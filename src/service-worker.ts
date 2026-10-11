/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';
import { isPublicApiCacheCandidate, mayCachePublicResponse } from '$lib/offline/public-api-policy';

declare const self: ServiceWorkerGlobalScope;

const SHELL_CACHE = `tmd-shell-${version}`;
const PUBLIC_API_CACHE = `tmd-api-public-v2-${version}`;
const API_TTL_MS = 60 * 60 * 1000;
const CRITICAL_ASSETS = [...new Set(build)];
const OPTIONAL_ASSETS = [...new Set([...files, '/index.html'])]
	.filter((asset) => !CRITICAL_ASSETS.includes(asset));
const ASSETS = [...CRITICAL_ASSETS, ...OPTIONAL_ASSETS];

self.addEventListener('install', (event) => {
	event.waitUntil((async () => {
		const cache = await caches.open(SHELL_CACHE);
		// SvelteKit fingerprints build assets: a missing JS/CSS chunk must
		// fail install rather than activate a broken application shell.
		await cache.addAll(CRITICAL_ASSETS);

		// Some deployment platforms consume static control files such as
		// /_headers without serving them. Optional failures must not abort
		// installation of the entire PWA.
		await Promise.all(OPTIONAL_ASSETS.map(async (asset) => {
			try { await cache.add(asset); } catch { /* optional asset */ }
		}));

		// adapter-static emits index.html as a navigation fallback. If the
		// host does not expose it directly, cache the public application root
		// under the offline navigation fallback key.
		if (!(await cache.match('/index.html'))) {
			try {
				const shell = await fetch('/', { cache: 'no-store' });
				if (shell.ok && shell.headers.get('content-type')?.includes('text/html')) {
					await cache.put('/index.html', shell);
				}
			} catch { /* offline fallback unavailable during install */ }
		}
		// When upgrading an installed PWA, wait for user consent and then
		// reload only after controllerchange.
	})());
});

self.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		const names = await caches.keys();
		await Promise.all(names
			.filter((name) =>
				(name.startsWith('tmd-') || name.startsWith('rnt-')) &&
				name !== SHELL_CACHE && name !== PUBLIC_API_CACHE
			)
			.map((name) => caches.delete(name))
		);
		await self.clients.claim();
	})());
});

async function serveStatic(request: Request): Promise<Response> {
	const cached = await caches.match(request);
	return cached ?? fetch(request);
}

async function serveNavigation(request: Request): Promise<Response> {
	// Network-first avoids trapping installed PWAs on an obsolete index.html.
	try {
		const response = await fetch(request, { cache: 'no-store' });
		if (response.ok) return response;
		return response;
	} catch {
		return (await caches.match('/index.html')) ?? Response.error();
	}
}

async function servePublicApi(request: Request): Promise<Response> {
	const cache = await caches.open(PUBLIC_API_CACHE);
	const previous = await cache.match(request);
	if (previous) {
		const last = Number(previous.headers.get('sw-cached-at') ?? 0);
		if (last > 0 && Date.now() - last < API_TTL_MS) return previous;
	}

	try {
		const response = await fetch(request);
		if (mayCachePublicResponse(response)) {
			const headers = new Headers(response.headers);
			headers.set('sw-cached-at', String(Date.now()));
			const cached = new Response(await response.clone().arrayBuffer(), {
				status: response.status, statusText: response.statusText, headers
			});
			await cache.put(request, cached);
		}
		return response;
	} catch {
		return previous ?? Response.error();
	}
}

self.addEventListener('fetch', (event) => {
	const request = event.request;
	if (request.method !== 'GET') return;
	const url = new URL(request.url);

	if (isPublicApiCacheCandidate(request, self.location.origin)) {
		event.respondWith(servePublicApi(request));
		return;
	}

	if (url.origin === self.location.origin && ASSETS.includes(url.pathname)) {
		event.respondWith(serveStatic(request));
		return;
	}

	if (url.origin === self.location.origin &&
		(request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html'))) {
		event.respondWith(serveNavigation(request));
		return;
	}

	// Private, authenticated, unknown and non-allowlisted requests are network-only.
	// Do not fall back to broad caches from previous service-worker versions.
});

self.addEventListener('message', (event) => {
	if (event.data?.type === 'SKIP_WAITING') {
		void self.skipWaiting();
	}
});
