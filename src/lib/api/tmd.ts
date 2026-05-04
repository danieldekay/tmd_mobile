import type {
	FetchEventsOptions,
	TmdApiRecord,
	TmdContactLink,
	TmdDj,
	TmdDjDetail,
	TmdEvent,
	TmdEventDetail,
	TmdEventFilters,
	TmdEventSeries,
	TmdEventSummary,
	TmdPerson,
	TmdSeriesEdition
} from '$lib/types';

const DEFAULT_API_BASE_URL = 'https://www.tangomarathons.com/wp-json/tmd/v3';

export const apiBaseUrl = normalizeBaseUrl(
	import.meta.env.PUBLIC_TMD_API_BASE_URL ?? DEFAULT_API_BASE_URL
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

export function formatDateRange(event: TmdEvent): string {
	if (!event.startDate) {
		return 'Date to be announced';
	}

	const startDate = formatDate(event.startDate);
	const endDate = event.endDate ? formatDate(event.endDate) : '';

	if (!endDate || endDate === startDate) {
		return startDate;
	}

	return `${startDate} to ${endDate}`;
}

export function formatLocation(event: TmdEvent): string {
	return [event.city, event.country].filter(Boolean).join(', ') || 'Location to be announced';
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
 * Map a raw API record to a TmdEventSummary (list DTO).
 */
export function normalizeTmdEvent(record: TmdApiRecord): TmdEventSummary {
	const meta = getRecord(record, 'meta');
	return {
		id: getNumber(record, ['id']) ?? 0,
		title: getTitle(record),
		slug: getString(record, ['slug']),
		dateStart: getString(record, ['start_date', 'startDate']) ?? getString(meta, ['start_date', 'startDate']),
		dateEnd: getString(record, ['end_date', 'endDate']) ?? getString(meta, ['end_date', 'endDate']),
		registrationDate:
			getString(record, ['registration_start_date', 'registrationStartDate']) ??
			getString(meta, ['registration_start_date', 'registrationStartDate']),
		city: getString(record, ['city']) ?? getString(meta, ['city']),
		country: getString(record, ['country']) ?? getString(meta, ['country']),
		venue: getString(record, ['venue_name', 'venueName', 'venue-name']) ?? getString(meta, ['venue_name', 'venueName', 'venue-name']),
		lat: getNumber(record, ['lat', 'latitude', 'geo_lat']) ?? getNumber(meta, ['lat', 'latitude', 'geo_lat']),
		lng: getNumber(record, ['lng', 'lon', 'longitude', 'geo_lng']) ?? getNumber(meta, ['lng', 'lon', 'longitude', 'geo_lng']),
		badges: extractFeatures(record, meta)
	};
}

/**
 * Map a raw API record to a TmdEventDetail (detail DTO).
 */
export function normalizeTmdEventDetail(record: TmdApiRecord): TmdEventDetail {
	const meta = getRecord(record, 'meta');
	const relationships = getRecord(record, 'relationships');
	const summary = normalizeTmdEvent(record);

	const website =
		getString(record, ['website']) ?? getString(meta, ['website']);
	const email =
		getString(record, ['email']) ?? getString(meta, ['email']);
	const facebookEvent =
		getString(record, ['facebook_event', 'facebookEvent']) ??
		getString(meta, ['facebook_event', 'facebookEvent']);
	const facebookGroup =
		getString(record, ['facebook_group', 'facebookGroup']) ??
		getString(meta, ['facebook_group', 'facebookGroup']);
	const facebookPage =
		getString(record, ['facebook_page', 'facebookPage']) ??
		getString(meta, ['facebook_page', 'facebookPage']);

	const contactLinks: TmdContactLink[] = [
		website ? { label: 'Website', href: website } : null,
		email ? { label: 'Email', href: `mailto:${email}` } : null
	].filter((x): x is TmdContactLink => x !== null);

	const socialLinks: TmdContactLink[] = [
		facebookEvent ? { label: 'Facebook event', href: facebookEvent } : null,
		facebookGroup ? { label: 'Facebook group', href: facebookGroup } : null,
		facebookPage ? { label: 'Facebook page', href: facebookPage } : null
	].filter((x): x is TmdContactLink => x !== null);

	return {
		...summary,
		registrationDate:
			getString(record, ['registration_start_date', 'registrationStartDate']) ??
			getString(meta, ['registration_start_date', 'registrationStartDate']),
		price: getString(record, ['price']) ?? getString(meta, ['price']),
		currency: getString(record, ['currency']) ?? getString(meta, ['currency']),
		website,
		contactLinks,
		socialLinks,
		features: extractFeatures(record, meta),
		djs: extractPeople(record, relationships, 'djs'),
		teachers: extractPeople(record, relationships, 'teachers'),
		series: extractPeople(record, relationships, 'event_series')
	};
}

function normalizeTmdDj(record: TmdApiRecord): TmdDj {
	const meta = getRecord(record, 'meta');
	const website = getString(record, ['website']) ?? getString(meta, ['website']);
	const facebook =
		getString(record, ['facebook', 'facebook_url']) ??
		getString(meta, ['facebook', 'facebook_url']);
	const instagram =
		getString(record, ['instagram', 'instagram_url']) ??
		getString(meta, ['instagram', 'instagram_url']);

	const socialLinks: TmdContactLink[] = [
		facebook ? { label: 'Facebook', href: facebook } : null,
		instagram ? { label: 'Instagram', href: instagram } : null,
		website ? { label: 'Website', href: website } : null
	].filter((x): x is TmdContactLink => x !== null);

	return {
		id: getNumber(record, ['id']) ?? 0,
		title: getString(record, ['name']) ?? getTitle(record),
		slug: getString(record, ['slug']),
		city: getString(record, ['city']) ?? getString(meta, ['city']),
		country: getString(record, ['country']) ?? getString(meta, ['country']),
		website,
		socialLinks
	};
}

function normalizeTmdDjDetail(record: TmdApiRecord): TmdDjDetail {
	const meta = getRecord(record, 'meta');
	const base = normalizeTmdDj(record);
	const bio =
		getString(record, ['biography', 'bio', 'description']) ??
		getString(meta, ['biography', 'bio', 'description']);
	return { ...base, bio };
}

function normalizeTmdEventSeries(record: TmdApiRecord): TmdEventSeries {
	const meta = getRecord(record, 'meta');
	const relationships = getRecord(record, 'relationships');
	const description =
		getString(record, ['description', 'content']) ?? getString(meta, ['description']);

	const rawEditions = Array.isArray(relationships.events)
		? relationships.events
		: Array.isArray(record.events)
			? record.events
			: [];

	const editions: TmdSeriesEdition[] = (rawEditions as unknown[]).filter(isRecord).map((r) => {
		const m = getRecord(r, 'meta');
		return {
			id: getNumber(r, ['id']) ?? 0,
			title: getTitle(r),
			dateStart:
				getString(r, ['start_date', 'startDate']) ?? getString(m, ['start_date', 'startDate']),
			dateEnd: getString(r, ['end_date', 'endDate']) ?? getString(m, ['end_date', 'endDate']),
			city: getString(r, ['city']) ?? getString(m, ['city']),
			country: getString(r, ['country']) ?? getString(m, ['country'])
		};
	});

	return {
		id: getNumber(record, ['id']) ?? 0,
		title: getTitle(record),
		slug: getString(record, ['slug']),
		description,
		city: getString(record, ['city']) ?? getString(meta, ['city']),
		country: getString(record, ['country']) ?? getString(meta, ['country']),
		editions
	};
}

// ─────────────────────────────────────────────────────────────────────────────

function normalizeBaseUrl(value: string): string {
	return value.trim().replace(/\/$/, '');
}

function extractCollection(payload: unknown): TmdApiRecord[] {
	if (Array.isArray(payload)) {
		return payload.filter(isRecord);
	}

	if (!isRecord(payload)) {
		return [];
	}

	const embedded = getRecord(payload, '_embedded');
	const embeddedEvents = embedded.events;
	if (Array.isArray(embeddedEvents)) {
		return embeddedEvents.filter(isRecord);
	}

	for (const key of ['items', 'data', 'events', 'results']) {
		const value = payload[key];
		if (Array.isArray(value)) {
			return value.filter(isRecord);
		}
	}

	return [];
}

function normalizeEvent(record: TmdApiRecord): TmdEvent {
	const meta = getRecord(record, 'meta');
	const relationships = getRecord(record, 'relationships');

	return {
		id: getNumber(record, ['id']) ?? 0,
		title: getTitle(record),
		link: getString(record, ['link', 'url']),
		slug: getString(record, ['slug']),
		startDate: getString(record, ['start_date', 'startDate']) ?? getString(meta, ['start_date', 'startDate']),
		endDate: getString(record, ['end_date', 'endDate']) ?? getString(meta, ['end_date', 'endDate']),
		registrationStartDate:
			getString(record, ['registration_start_date', 'registrationStartDate']) ??
			getString(meta, ['registration_start_date', 'registrationStartDate']),
		city: getString(record, ['city']) ?? getString(meta, ['city']),
		country: getString(record, ['country']) ?? getString(meta, ['country']),
		venueName:
			getString(record, ['venue_name', 'venueName', 'venue-name']) ??
			getString(meta, ['venue_name', 'venueName', 'venue-name']),
		website: getString(record, ['website']) ?? getString(meta, ['website']),
		email: getString(record, ['email']) ?? getString(meta, ['email']),
		facebookEvent: getString(record, ['facebook_event', 'facebookEvent']) ?? getString(meta, ['facebook_event', 'facebookEvent']),
		facebookGroup: getString(record, ['facebook_group', 'facebookGroup']) ?? getString(meta, ['facebook_group', 'facebookGroup']),
		facebookPage: getString(record, ['facebook_page', 'facebookPage']) ?? getString(meta, ['facebook_page', 'facebookPage']),
		price: getString(record, ['price']) ?? getString(meta, ['price']),
		currency: getString(record, ['currency']) ?? getString(meta, ['currency']),
		features: extractFeatures(record, meta),
		relationships: {
			djs: extractPeople(record, relationships, 'djs'),
			teachers: extractPeople(record, relationships, 'teachers'),
			series: extractPeople(record, relationships, 'event_series')
		}
	};
}

function getTitle(record: TmdApiRecord): string {
	const title = record.title;

	if (typeof title === 'string') {
		return title;
	}

	if (isRecord(title)) {
		return getString(title, ['rendered', 'raw']) ?? 'Untitled event';
	}

	return getString(record, ['event_name', 'name']) ?? 'Untitled event';
}

function extractFeatures(record: TmdApiRecord, meta: TmdApiRecord): string[] {
	const featureMap: Array<[string, string]> = [
		['role_balanced', 'Role balanced'],
		['invitation_only', 'Invitation only'],
		['have_registration', 'Registration'],
		['have_milongas', 'Milongas'],
		['have_tickets', 'Tickets'],
		['have_live_music', 'Live music'],
		['have_lessons', 'Lessons'],
		['have_show', 'Show']
	];

	return featureMap
		.filter(([key]) => getBoolean(record, key) ?? getBoolean(meta, key))
		.map(([, label]) => label);
}

function extractPeople(record: TmdApiRecord, relationships: TmdApiRecord, key: string): TmdPerson[] {
	const value = relationships[key] ?? record[key] ?? (key === 'event_series' ? record.series : undefined);
	if (!Array.isArray(value)) {
		return [];
	}

	return value.filter(isRecord).map((person) => ({
		id: getNumber(person, ['id']) ?? 0,
		name: getString(person, ['name', 'title']) ?? 'Unnamed',
		url: getString(person, ['url', 'link'])
	}));
}

function getResponseErrorMessage(status: number, pathname: string): string {
	if (status === 401) {
		return `TMD Core requires authentication for ${pathname}. Public mobile browsing needs a public-read or JWT-backed API contract.`;
	}

	return `TMD Core returned ${status} for ${pathname}`;
}

function getRecord(record: TmdApiRecord, key: string): TmdApiRecord {
	const value = record[key];
	return isRecord(value) ? value : {};
}

function getString(record: TmdApiRecord, keys: string[]): string | undefined {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === 'string' && value.trim().length > 0) {
			return value.trim();
		}
	}

	return undefined;
}

function getNumber(record: TmdApiRecord, keys: string[]): number | undefined {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === 'number') {
			return value;
		}
		if (typeof value === 'string') {
			const parsed = Number.parseInt(value, 10);
			if (Number.isFinite(parsed)) {
				return parsed;
			}
		}
	}

	return undefined;
}

function getBoolean(record: TmdApiRecord, key: string): boolean | undefined {
	const value = record[key];
	if (typeof value === 'boolean') {
		return value;
	}
	if (typeof value === 'number') {
		return value === 1;
	}
	if (typeof value === 'string') {
		return ['1', 'true', 'yes'].includes(value.toLowerCase());
	}

	return undefined;
}

function formatDate(value: string): string {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat('en', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(date);
}

function isRecord(value: unknown): value is TmdApiRecord {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
