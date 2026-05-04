/**
 * Saved-events persistence — hybrid localStorage + server sync.
 *
 * For guests: localStorage-only (same as before).
 * For authenticated users: server is source of truth; localStorage is a
 * write-through cache. All mutations are optimistic with rollback on failure.
 */

import { isAuthenticated } from '$lib/auth';
import {
	getSavedEvents as serverGetSavedEvents,
	saveEvent as serverSaveEvent,
	unsaveEvent as serverUnsaveEvent,
} from '$lib/api/user';

const STORAGE_KEY = 'tmd_saved_events';

/** In-memory cache, null = not yet initialised (falls back to localStorage). */
let _cache: number[] | null = null;
/** Guards against duplicate server fetches when multiple components call initSavedEvents. */
let _initDone = false;

function getCachedOrRead(): number[] {
	if (_cache !== null) return _cache;
	_cache = readIds();
	return _cache;
}

/**
 * Reset saved-events state. Call after logout so the next login triggers a fresh
 * server fetch rather than serving stale cached IDs.
 */
export function resetSavedEventsState(): void {
	_cache = null;
	_initDone = false;
}

/** Read saved IDs from localStorage. Returns [] on any failure. */
function readIds(): number[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((v): v is number => typeof v === 'number');
	} catch {
		return [];
	}
}

/** Write IDs to localStorage. Silently ignores QuotaExceededError. */
function writeIds(ids: number[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
	} catch (err) {
		if (!(err instanceof DOMException && err.name === 'QuotaExceededError')) {
			// Re-throw unexpected errors
			throw err;
		}
		// Quota exceeded — skip write silently
	}
}

/**
 * Hydrate the in-memory cache. Call once from layout onMount, after initAuth().
 * For authenticated users, fetches saved IDs from the server.
 * Falls back to localStorage on error or when not authenticated.
 */
export async function initSavedEvents(): Promise<void> {
	if (_initDone) return;
	_initDone = true;
	if (isAuthenticated()) {
		const serverIds = await serverGetSavedEvents();
		// Server is source of truth; write back so localStorage mirrors server state
		_cache = serverIds;
		writeIds(_cache);
	} else {
		_cache = readIds();
	}
}

/** Save an event. Optimistic update; syncs to server when authenticated. */
export async function saveEvent(id: number): Promise<void> {
	const ids = getCachedOrRead();
	if (ids.includes(id)) return;
	const newIds = [...ids, id];
	_cache = newIds;
	writeIds(newIds);

	if (isAuthenticated()) {
		try {
			await serverSaveEvent(id);
		} catch {
			// Rollback
			_cache = ids;
			writeIds(ids);
		}
	}
}

/** Remove an event from saved list. Optimistic update; syncs to server when authenticated. */
export async function unsaveEvent(id: number): Promise<void> {
	const ids = getCachedOrRead();
	const newIds = ids.filter((i) => i !== id);
	_cache = newIds;
	writeIds(newIds);

	if (isAuthenticated()) {
		try {
			await serverUnsaveEvent(id);
		} catch {
			// Rollback
			_cache = ids;
			writeIds(ids);
		}
	}
}

/** Returns true if the event ID is in the saved list. */
export function isSaved(id: number): boolean {
	return getCachedOrRead().includes(id);
}

/** Returns all saved event IDs in the order they were saved. */
export function getSavedIds(): number[] {
	return getCachedOrRead();
}
