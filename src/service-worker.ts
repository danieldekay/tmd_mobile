/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = `tmd-cache-${version}`;
const API_CACHE_NAME = 'tmd-api-cache';
const API_TTL_MS = 60 * 60 * 1000; // 1 hour

// All precacheable assets (app shell + static files)
const ASSETS = [...build, ...files];

async function precacheAssets(): Promise<void> {
	const cache = await caches.open(CACHE_NAME);
	await cache.addAll(ASSETS);
	await self.skipWaiting();
}

// ── Install: precache all static assets ───────────────────────────────────
self.addEventListener('install', (event) => {
	event.waitUntil(precacheAssets());
});

async function clearOldCaches(): Promise<void> {
	const keys = await caches.keys();
	for (const key of keys) {
		if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
			await caches.delete(key);
		}
	}
	await self.clients.claim();
}

// ── Activate: remove old caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
	event.waitUntil(clearOldCaches());
});

async function handleStaticAssetRequest(request: Request): Promise<Response> {
	const cached = await caches.match(request);
	return cached ?? fetch(request);
}

async function handleSpaNavigationRequest(request: Request): Promise<Response> {
	const cached = await caches.match('/index.html');
	return cached ?? fetch(request);
}

async function handleDefaultRequest(request: Request): Promise<Response> {
	try {
		return await fetch(request);
	} catch {
		const cached = await caches.match(request);
		return cached ?? Response.error();
	}
}

// ── Fetch: route-based caching strategy ───────────────────────────────────
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Only handle GET requests
	if (request.method !== 'GET') return;

	// TMD API requests: network-first with 1-hour TTL cache fallback
	if (url.href.includes('/wp-json/tmd/')) {
		event.respondWith(handleApiRequest(request));
		return;
	}

	// Static assets / app shell: cache-first
	if (ASSETS.includes(url.pathname)) {
		event.respondWith(handleStaticAssetRequest(request));
		return;
	}

	// SPA navigation: return cached index.html (adapter-static fallback)
	if (request.headers.get('accept')?.includes('text/html')) {
		event.respondWith(handleSpaNavigationRequest(request));
		return;
	}

	// Default: network with cache fallback
	event.respondWith(handleDefaultRequest(request));
});

async function handleApiRequest(request: Request): Promise<Response> {
	const cache = await caches.open(API_CACHE_NAME);
	const cached = await cache.match(request);

	if (cached) {
		const dateHeader = cached.headers.get('sw-cached-at');
		const cachedAt = dateHeader ? parseInt(dateHeader, 10) : 0;
		const isStale = Date.now() - cachedAt > API_TTL_MS;

		if (!isStale) {
			return cached;
		}
	}

	try {
		const response = await fetch(request);
		if (response.ok) {
			// Clone response, add cache timestamp header
			const headers = new Headers(response.headers);
			headers.set('sw-cached-at', String(Date.now()));
			const cachedResponse = new Response(await response.clone().arrayBuffer(), {
				status: response.status,
				statusText: response.statusText,
				headers
			});
			await cache.put(request, cachedResponse);
		}
		return response;
	} catch {
		// Network failed — return stale cache if available
		if (cached) return cached;
		return Response.error();
	}
}

// ── Skip waiting on demand ─────────────────────────────────────────────────
self.addEventListener('message', (event) => {
	if (event.data?.type === 'SKIP_WAITING') {
		void self.skipWaiting();
	}
});
