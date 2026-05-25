/**
 * URL synchronisation helpers for event filter state.
 *
 * Encapsulates all URLSearchParams / history read-write logic so that
 * EventFilters.svelte stays focused on UI and derived state.
 */

import { goto } from '$app/navigation';

// ── Types ─────────────────────────────────────────────────────────────────────

export type RegState = 'open' | 'upcoming' | 'all';

export type FilterUrlState = {
	country: string;
	city: string;
	dateAfter: string;
	dateBefore: string;
	regState: RegState;
	search: string;
	viewMode: 'cards' | 'table';
};

// ── Read ──────────────────────────────────────────────────────────────────────

/**
 * Parse filter state from the current URL search params.
 * Must be called in a browser context (e.g. `onMount`).
 */
export function readFiltersFromUrl(): FilterUrlState {
	const params = new URLSearchParams(window.location.search);

	const reg = params.get('reg');
	const regState: RegState = reg === 'open' || reg === 'upcoming' ? reg : 'all';

	const isEventsPage = window.location.pathname === '/events';

	return {
		country: params.get('country') ?? '',
		city: params.get('city') ?? '',
		dateAfter: params.get('after') ?? '',
		dateBefore: params.get('before') ?? '',
		regState,
		search: params.get('q') ?? '',
		viewMode: isEventsPage && params.get('view') === 'table' ? 'table' : 'cards',
	};
}

// ── Write ─────────────────────────────────────────────────────────────────────

type FilterParams = {
	country: string;
	city: string;
	dateAfter: string;
	dateBefore: string;
	regState: RegState;
	search: string;
};

/**
 * Push current filter values to the URL via SvelteKit's `goto` (replaceState).
 */
export async function pushFiltersToUrl(params: FilterParams): Promise<void> {
	const url = new URL(window.location.href);
	['country', 'city', 'after', 'before', 'reg', 'q'].forEach((k) => url.searchParams.delete(k));

	if (params.country) url.searchParams.set('country', params.country);
	if (params.city) url.searchParams.set('city', params.city);
	if (params.dateAfter) url.searchParams.set('after', params.dateAfter);
	if (params.dateBefore) url.searchParams.set('before', params.dateBefore);
	if (params.regState !== 'all') url.searchParams.set('reg', params.regState);
	if (params.search) url.searchParams.set('q', params.search);

	await goto(url.pathname + (url.search || ''), {
		replaceState: true,
		keepFocus: true,
		noScroll: true,
	});
}

/**
 * Push the view-mode toggle to the URL via SvelteKit's `goto` (replaceState).
 */
export async function pushViewModeToUrl(mode: 'cards' | 'table'): Promise<void> {
	const url = new URL(window.location.href);
	if (mode === 'table') {
		url.searchParams.set('view', 'table');
	} else {
		url.searchParams.delete('view');
	}
	await goto(url.pathname + (url.search || ''), {
		replaceState: true,
		keepFocus: true,
		noScroll: true,
	});
}
