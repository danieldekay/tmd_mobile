import type {
	FetchEventsOptions,
	TmdApiRecord,
	TmdDj,
	TmdDjDetail,
	TmdEvent,
	TmdEventDetail,
	TmdEventFilters,
	TmdEventSeries,
	TmdEventSummary,
	TmdPage,
	TmdPost,
	TmdPostDetail,
	TmdTeacher,
	TmdTeacherDetail
} from '$lib/types';

import { isRecord } from './record-utils';
import {
	extractCollection,
	normalizeEvent,
	normalizeTmdEvent,
	normalizeTmdEventDetail,
	normalizeTmdDj,
	normalizeTmdDjDetail,
	normalizeTmdEventSeries,
	normalizeTmdTeacher,
	normalizeWpPost,
	normalizeWpPostDetail,
	normalizeWpPage
} from './tmd-normalize';

const DEFAULT_API_BASE_URL = 'https://www.tangomarathons.com/wp-json/tmd/v3';
const DEFAULT_WP_BASE_URL = 'https://www.tangomarathons.com/wp-json/wp/v2';

export const apiBaseUrl = normalizeBaseUrl(
	import.meta.env.PUBLIC_TMD_API_BASE_URL ?? DEFAULT_API_BASE_URL
);

export const wpBaseUrl = normalizeBaseUrl(
	import.meta.env.PUBLIC_TMD_API_BASE_URL
		? import.meta.env.PUBLIC_TMD_API_BASE_URL.replace(/\/wp-json\/tmd\/v3$/, '/wp-json/wp/v2')
		: DEFAULT_WP_BASE_URL
);

export async function fetchEvents(options: FetchEventsOptions = {}): Promise<TmdEvent[]> {
	const endpoint = new URL(`${apiBaseUrl}/events`);
	endpoint.searchParams.set('per_page', String(options.limit ?? 12));
	endpoint.searchParams.set('include_relationships', 'true');

	if (options.country) {
		endpoint.searchParams.set('country', options.country);
	}

	if (options.futureOnly ?? true) {
		endpoint.searchParams.set('future', '1');
	}

	const response = await fetch(endpoint.toString(), {
		headers: {
			accept: 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error(`TMD Core returned ${response.status} for ${endpoint.pathname}`);
	}

	const payload = (await response.json()) as unknown;
	return extractCollection(payload).map(normalizeEvent);
}

export async function fetchEventById(id: number): Promise<TmdEvent> {
	const endpoint = new URL(`${apiBaseUrl}/events/${id}`);
	endpoint.searchParams.set('include_relationships', 'true');
	endpoint.searchParams.set(
		'meta_fields',
		[
			'start_date',
			'end_date',
			'registration_start_date',
			'edition',
			'country',
			'city',
			'venue_name',
			'venue-name',
			'website',
			'email',
			'facebook_event',
			'facebook_group',
			'facebook_page',
			'price',
			'currency',
			'role_balanced',
			'invitation_only',
			'have_registration',
			'have_milongas',
			'have_tickets',
			'have_live_music',
			'have_lessons',
			'have_show'
		].join(',')
	);

	const response = await fetch(endpoint.toString(), {
		headers: {
			accept: 'application/json'
		}
	});

	if (!response.ok) {
		throw new Error(getResponseErrorMessage(response.status, endpoint.pathname));
	}

	const payload = (await response.json()) as unknown;
	if (!isRecord(payload)) {
		throw new Error('TMD Core returned an unexpected event detail response.');
	}

	return normalizeEvent(payload);
}

// ── New typed API (phase 1) ──────────────────────────────────────────────────

export class TmdNotFoundError extends Error {
	constructor(id: string | number, resource = 'Event') {
		super(`${resource} ${id} not found.`);
		this.name = 'TmdNotFoundError';
	}
}

/**
 * Fetch upcoming events and return lightweight summary DTOs.
 * Server-side filters: country, after, before.
 * Client-side filters (applied after fetch): city, registrationState.
 */
export async function getEvents(
	perPage = 20,
	filters?: TmdEventFilters
): Promise<TmdEventSummary[]> {
	const endpoint = new URL(`${apiBaseUrl}/events`);
	endpoint.searchParams.set('per_page', String(perPage));
	endpoint.searchParams.set('future', '1');
	endpoint.searchParams.set('_embed', 'wp:term');
	endpoint.searchParams.set('meta_fields', 'end_date');

	if (filters?.country) {
		endpoint.searchParams.set('country', filters.country);
	}
	if (filters?.city) {
		endpoint.searchParams.set('city', filters.city);
	}
	if (filters?.dateAfter) {
		endpoint.searchParams.set('after', filters.dateAfter);
	}
	if (filters?.dateBefore) {
		endpoint.searchParams.set('before', filters.dateBefore);
	}

	const response = await fetch(endpoint.toString(), {
		headers: { accept: 'application/json' }
	});

	if (!response.ok) {
		throw new Error(`TMD Core returned ${response.status} for ${endpoint.pathname}`);
	}

	const payload = (await response.json()) as unknown;
	let events = extractCollection(payload).map(normalizeTmdEvent);

	// Client-side fallback filtering
	if (filters?.city) {
		const cityLower = filters.city.toLowerCase();
		events = events.filter((e) => e.city?.toLowerCase().includes(cityLower));
	}
	if (filters?.dateAfter) {
		const after = new Date(filters.dateAfter).getTime();
		events = events.filter((e) => !e.dateStart || new Date(e.dateStart).getTime() >= after);
	}
	if (filters?.dateBefore) {
		const before = new Date(filters.dateBefore).getTime();
		events = events.filter((e) => !e.dateStart || new Date(e.dateStart).getTime() <= before);
	}
	if (filters?.registrationState && filters.registrationState !== 'all') {
		const now = Date.now();
		events = events.filter((e) => {
			const regTime = e.registrationDate ? new Date(e.registrationDate).getTime() : undefined;
			if (filters.registrationState === 'open') {
				return regTime !== undefined && regTime <= now;
			}
			if (filters.registrationState === 'upcoming') {
				return regTime === undefined || regTime > now;
			}
			return true;
		});
	}
	if (filters?.search && filters.search.trim() !== '') {
		const searchLower = filters.search.trim().toLowerCase();
		events = events.filter((e) =>
			`${e.title} ${e.city ?? ''} ${e.country ?? ''}`.toLowerCase().includes(searchLower)
		);
	}

	return events;
}

/**
 * Fetch a single event by ID and return a full detail DTO.
 */
export async function getEvent(id: string | number): Promise<TmdEventDetail> {
	const endpoint = new URL(`${apiBaseUrl}/events/${id}`);
	endpoint.searchParams.set('include_relationships', 'true');

	const response = await fetch(endpoint.toString(), {
		headers: { accept: 'application/json' }
	});

	if (response.status === 404) {
		throw new TmdNotFoundError(id);
	}

	if (!response.ok) {
		throw new Error(getResponseErrorMessage(response.status, endpoint.pathname));
	}

	const payload = (await response.json()) as unknown;
	if (!isRecord(payload)) {
		throw new Error('TMD Core returned an unexpected event detail response.');
	}

	return normalizeTmdEventDetail(payload);
}

/**
 * Fetch a paged DJ list.
 */
export async function getDjs(perPage = 50): Promise<TmdDj[]> {
	const endpoint = new URL(`${apiBaseUrl}/djs`);
	endpoint.searchParams.set('per_page', String(perPage));
	endpoint.searchParams.set('orderby', 'title');
	endpoint.searchParams.set('order', 'asc');

	const response = await fetch(endpoint.toString(), {
		headers: { accept: 'application/json' }
	});

	if (!response.ok) {
		throw new Error(`TMD Core returned ${response.status} for ${endpoint.pathname}`);
	}

	const payload = (await response.json()) as unknown;
	return extractCollection(payload).map(normalizeTmdDj);
}

/**
 * Fetch a single DJ by ID.
 */
export async function getDj(id: string | number): Promise<TmdDjDetail> {
	const endpoint = new URL(`${apiBaseUrl}/djs/${id}`);

	const response = await fetch(endpoint.toString(), {
		headers: { accept: 'application/json' }
	});

	if (response.status === 404) {
		throw new TmdNotFoundError(id, 'DJ');
	}

	if (!response.ok) {
		throw new Error(getResponseErrorMessage(response.status, endpoint.pathname));
	}

	const payload = (await response.json()) as unknown;
	if (!isRecord(payload)) {
		throw new Error('TMD Core returned an unexpected DJ response.');
	}

	return normalizeTmdDjDetail(payload);
}

/**
 * Fetch a single event series by ID, including editions if available.
 */
export async function getEventSeries(id: string | number): Promise<TmdEventSeries> {
	const endpoint = new URL(`${apiBaseUrl}/event-series/${id}`);
	endpoint.searchParams.set('include_relationships', 'true');

	const response = await fetch(endpoint.toString(), {
		headers: { accept: 'application/json' }
	});

	if (response.status === 404) {
		throw new TmdNotFoundError(id, 'Event series');
	}

	if (!response.ok) {
		throw new Error(getResponseErrorMessage(response.status, endpoint.pathname));
	}

	const payload = (await response.json()) as unknown;
	if (!isRecord(payload)) {
		throw new Error('TMD Core returned an unexpected series response.');
	}

	return normalizeTmdEventSeries(payload);
}

/**
 * Fetch a paged teacher list.
 */
export async function getTeachers(perPage = 50): Promise<TmdTeacher[]> {
	const endpoint = new URL(`${apiBaseUrl}/teachers`);
	endpoint.searchParams.set('per_page', String(perPage));
	endpoint.searchParams.set('orderby', 'title');
	endpoint.searchParams.set('order', 'asc');

	const response = await fetch(endpoint.toString(), {
		headers: { accept: 'application/json' }
	});

	if (!response.ok) {
		throw new Error(`TMD Core returned ${response.status} for ${endpoint.pathname}`);
	}

	const payload = (await response.json()) as unknown;
	return extractCollection(payload, 'teachers').map(normalizeTmdTeacher);
}

/**
 * Fetch a single teacher by ID.
 */
export async function getTeacher(id: string | number): Promise<TmdTeacherDetail> {
	const endpoint = new URL(`${apiBaseUrl}/teachers/${id}`);

	const response = await fetch(endpoint.toString(), {
		headers: { accept: 'application/json' }
	});

	if (response.status === 404) {
		throw new TmdNotFoundError(id, 'Teacher');
	}

	if (!response.ok) {
		throw new Error(getResponseErrorMessage(response.status, endpoint.pathname));
	}

	const payload = (await response.json()) as unknown;
	if (!isRecord(payload)) {
		throw new Error('TMD Core returned an unexpected teacher response.');
	}

	return normalizeTmdTeacher(payload);
}

/**
 * Fetch a paged list of WordPress blog posts via WP REST v2.
 * Content is rendered HTML — only display from trusted origin.
 */
export async function getPosts(perPage = 20): Promise<TmdPost[]> {
	const endpoint = new URL(`${wpBaseUrl}/posts`);
	endpoint.searchParams.set('per_page', String(perPage));
	endpoint.searchParams.set('_fields', 'id,slug,title,excerpt,date');
	endpoint.searchParams.set('orderby', 'date');
	endpoint.searchParams.set('order', 'desc');

	const response = await fetch(endpoint.toString(), {
		headers: { accept: 'application/json' }
	});

	if (!response.ok) {
		throw new Error(`WordPress returned ${response.status} for ${endpoint.pathname}`);
	}

	const payload = (await response.json()) as unknown;
	if (!Array.isArray(payload)) {
		return [];
	}

	return payload.filter(isRecord).map(normalizeWpPost);
}

/**
 * Fetch a single WordPress blog post by slug via WP REST v2.
 * Content is rendered HTML — only display from trusted origin.
 */
export async function getPost(slug: string): Promise<TmdPostDetail> {
	const endpoint = new URL(`${wpBaseUrl}/posts`);
	endpoint.searchParams.set('slug', slug);
	endpoint.searchParams.set('_fields', 'id,slug,title,content,date');

	const response = await fetch(endpoint.toString(), {
		headers: { accept: 'application/json' }
	});

	if (!response.ok) {
		throw new Error(`WordPress returned ${response.status} for ${endpoint.pathname}`);
	}

	const payload = (await response.json()) as unknown;
	if (!Array.isArray(payload) || payload.length === 0) {
		throw new TmdNotFoundError(slug, 'Post');
	}

	const record = payload[0];
	if (!isRecord(record)) {
		throw new Error('WordPress returned an unexpected post response.');
	}

	return normalizeWpPostDetail(record);
}

/**
 * Fetch a single WordPress page by slug via WP REST v2.
 * Content is rendered HTML — only display from trusted origin.
 */
export async function getPage(slug: string): Promise<TmdPage> {
	const endpoint = new URL(`${wpBaseUrl}/pages`);
	endpoint.searchParams.set('slug', slug);
	endpoint.searchParams.set('_fields', 'id,slug,title,content');

	const response = await fetch(endpoint.toString(), {
		headers: { accept: 'application/json' }
	});

	if (!response.ok) {
		throw new Error(`WordPress returned ${response.status} for ${endpoint.pathname}`);
	}

	const payload = (await response.json()) as unknown;
	if (!Array.isArray(payload) || payload.length === 0) {
		throw new TmdNotFoundError(slug, 'Page');
	}

	const record = payload[0];
	if (!isRecord(record)) {
		throw new Error('WordPress returned an unexpected page response.');
	}

	return normalizeWpPage(record);
}

// ── Private helpers ──────────────────────────────────────────────────────────

function normalizeBaseUrl(value: string): string {
	return value.trim().replace(/\/$/, '');
}

function getResponseErrorMessage(status: number, pathname: string): string {
	if (status === 401) {
		return `TMD Core requires authentication for ${pathname}. Public mobile browsing needs a public-read or JWT-backed API contract.`;
	}

	return `TMD Core returned ${status} for ${pathname}`;
}
