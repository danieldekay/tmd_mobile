import { get } from 'svelte/store';
import { apiBaseUrl } from '$lib/api/tmd';
import { authState, refreshAuthToken, logout } from '$lib/auth';

const SERVER_SYNC_ENABLED = import.meta.env.VITE_ENABLE_SERVER_SYNC === 'true';

async function authedFetch(path: string, init: RequestInit = {}): Promise<Response | null> {
	if (!SERVER_SYNC_ENABLED) return null;

	let token = get(authState).authToken;
	if (!token) return null;

	const existingHeaders = (init.headers as Record<string, string> | undefined) ?? {};

	const makeHeaders = (t: string): Record<string, string> => ({
		Accept: 'application/json',
		Authorization: `Bearer ${t}`,
		...existingHeaders,
	});

	const resp = await fetch(`${apiBaseUrl}${path}`, { ...init, headers: makeHeaders(token) });

	if (resp.status === 401) {
		const refreshed = await refreshAuthToken();
		if (!refreshed) {
			logout();
			return null;
		}
		token = get(authState).authToken ?? token;
		return fetch(`${apiBaseUrl}${path}`, { ...init, headers: makeHeaders(token) });
	}

	return resp;
}

type SavedEventsResponse = { ids?: unknown[] };

export async function getSavedEvents(): Promise<number[]> {
	try {
		const resp = await authedFetch('/user/saved-events');
		if (!resp?.ok) return [];
		const data = (await resp.json()) as SavedEventsResponse;
		const ids = data?.ids;
		if (!Array.isArray(ids)) return [];
		return ids.filter((v): v is number => typeof v === 'number');
	} catch {
		return [];
	}
}

export async function saveEvent(id: number): Promise<void> {
	const resp = await authedFetch('/user/saved-events', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ event_id: id }),
	});
	if (resp && !resp.ok) {
		throw new Error(`Save failed: ${resp.status}`);
	}
}

export async function unsaveEvent(id: number): Promise<void> {
	const resp = await authedFetch(`/user/saved-events/${id}`, { method: 'DELETE' });
	if (resp && !resp.ok) {
		throw new Error(`Unsave failed: ${resp.status}`);
	}
}
