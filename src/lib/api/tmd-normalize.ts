/**
 * Data-normalization helpers for the TMD API layer.
 *
 * Each function maps a raw `TmdApiRecord` received from the API to a typed DTO.
 * These are internal to $lib/api — route pages must not import from here directly;
 * use the public functions exported from $lib/api/tmd instead.
 */
import type {
	TmdApiRecord,
	TmdContactLink,
	TmdDj,
	TmdDjDetail,
	TmdEvent,
	TmdEventDetail,
	TmdEventSeries,
	TmdEventSummary,
	TmdPage,
	TmdPerson,
	TmdPost,
	TmdPostDetail,
	TmdSeriesEdition,
	TmdTeacher,
	TmdTeacherDetail
} from '$lib/types';

import {
	isRecord,
	getRecord,
	getString,
	getNumber,
	getBoolean,
	getTitle
} from './record-utils';

// ── Collection extraction ────────────────────────────────────────────────────

export function extractCollection(payload: unknown, embeddedKey = 'events'): TmdApiRecord[] {
	if (Array.isArray(payload)) {
		return payload.filter(isRecord);
	}

	if (!isRecord(payload)) {
		return [];
	}

	const embedded = getRecord(payload, '_embedded');
	const embeddedItems = embedded[embeddedKey];
	if (Array.isArray(embeddedItems)) {
		return embeddedItems.filter(isRecord);
	}
	// WordPress sometimes serializes arrays as objects with numeric string keys (PHP json_encode quirk)
	if (embeddedItems !== null && typeof embeddedItems === 'object') {
		const values = Object.values(embeddedItems as Record<string, unknown>);
		if (values.length > 0) {
			return values.filter(isRecord);
		}
	}

	for (const key of ['items', 'data', 'results']) {
		const value = payload[key];
		if (Array.isArray(value)) {
			return value.filter(isRecord);
		}
	}

	return [];
}

// ── Legacy event normalization (used by fetchEvents / fetchEventById) ────────

export function normalizeEvent(record: TmdApiRecord): TmdEvent {
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
		facebookEvent:
			getString(record, ['facebook_event', 'facebookEvent']) ??
			getString(meta, ['facebook_event', 'facebookEvent']),
		facebookGroup:
			getString(record, ['facebook_group', 'facebookGroup']) ??
			getString(meta, ['facebook_group', 'facebookGroup']),
		facebookPage:
			getString(record, ['facebook_page', 'facebookPage']) ??
			getString(meta, ['facebook_page', 'facebookPage']),
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

// ── New typed API normalizers ────────────────────────────────────────────────

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
		badges: extractFeatures(record, meta),
		edition: getString(record, ['edition']) ?? getString(meta, ['edition']) ?? null,
		categories: extractCategories(record)
	};
}

/**
 * Map a raw API record to a TmdEventDetail (detail DTO).
 */
export function normalizeTmdEventDetail(record: TmdApiRecord): TmdEventDetail {
	const meta = getRecord(record, 'meta');
	const relationships = getRecord(record, 'relationships');
	const summary = normalizeTmdEvent(record);

	const website = getString(record, ['website']) ?? getString(meta, ['website']);
	const email = getString(record, ['email']) ?? getString(meta, ['email']);
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

export function normalizeTmdDj(record: TmdApiRecord): TmdDj {
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

export function normalizeTmdDjDetail(record: TmdApiRecord): TmdDjDetail {
	const meta = getRecord(record, 'meta');
	const base = normalizeTmdDj(record);
	const bio =
		getString(record, ['biography', 'bio', 'description']) ??
		getString(meta, ['biography', 'bio', 'description']);
	return { ...base, bio };
}

export function normalizeTmdEventSeries(record: TmdApiRecord): TmdEventSeries {
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

export function normalizeTmdTeacher(record: TmdApiRecord): TmdTeacher {
	const meta = getRecord(record, 'meta');
	return {
		id: getNumber(record, ['id']) ?? 0,
		title: getString(record, ['name']) ?? getTitle(record),
		slug: getString(record, ['slug']),
		city: getString(record, ['city']) ?? getString(meta, ['city']),
		country: getString(record, ['country']) ?? getString(meta, ['country'])
	};
}

export function normalizeWpPost(record: TmdApiRecord): TmdPost {
	const titleObj = record.title;
	const title =
		(isRecord(titleObj) ? getString(titleObj, ['rendered']) : undefined) ??
		getString(record, ['title']) ??
		'Untitled';

	const excerptObj = record.excerpt;
	const excerpt = isRecord(excerptObj) ? getString(excerptObj, ['rendered']) : undefined;

	return {
		id: getNumber(record, ['id']) ?? 0,
		slug: getString(record, ['slug']) ?? '',
		title,
		excerpt: excerpt?.replace(/<[^>]*>/g, '').trim() || undefined,
		date: getString(record, ['date'])
	};
}

export function normalizeWpPostDetail(record: TmdApiRecord): TmdPostDetail {
	const base = normalizeWpPost(record);
	const contentObj = record.content;
	const content = isRecord(contentObj)
		? (getString(contentObj, ['rendered']) ?? '')
		: (getString(record, ['content']) ?? '');
	return { ...base, content };
}

export function normalizeWpPage(record: TmdApiRecord): TmdPage {
	const titleObj = record.title;
	const title =
		(isRecord(titleObj) ? getString(titleObj, ['rendered']) : undefined) ??
		getString(record, ['title']) ??
		'Untitled';

	const contentObj = record.content;
	const content = isRecord(contentObj)
		? (getString(contentObj, ['rendered']) ?? '')
		: (getString(record, ['content']) ?? '');

	return {
		id: getNumber(record, ['id']) ?? 0,
		slug: getString(record, ['slug']) ?? '',
		title,
		content
	};
}

// ── Private helpers ──────────────────────────────────────────────────────────

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

function extractPeople(
	record: TmdApiRecord,
	relationships: TmdApiRecord,
	key: string
): TmdPerson[] {
	const value =
		relationships[key] ??
		record[key] ??
		(key === 'event_series' ? record.series : undefined);
	if (!Array.isArray(value)) {
		return [];
	}

	return value.filter(isRecord).map((person) => ({
		id: getNumber(person, ['id']) ?? 0,
		name: getString(person, ['name', 'title']) ?? 'Unnamed',
		url: getString(person, ['url', 'link'])
	}));
}

function extractCategories(record: TmdApiRecord): string[] {
	const embedded = record['_embedded'];
	if (!isRecord(embedded)) return [];
	const wpTerm = embedded['wp:term'];
	if (!Array.isArray(wpTerm)) return [];
	const categories: string[] = [];
	for (const termGroup of wpTerm) {
		if (!Array.isArray(termGroup)) continue;
		for (const term of termGroup) {
			if (
				isRecord(term) &&
				term['taxonomy'] === 'event-categories-2020' &&
				typeof term['name'] === 'string'
			) {
				categories.push(term['name']);
			}
		}
	}
	return categories;
}
