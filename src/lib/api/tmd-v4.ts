/**
 * Typed read-only TMD Core V4 client.
 *
 * V4 differs from V3: collections are plain arrays with pagination headers;
 * titles are strings; TMD fields live under "meta"; event series uses /series.
 * This module never sends credentials or reads user-interaction endpoints.
 */
import type {
  FetchEventsOptions, TmdApiRecord, TmdContactLink, TmdDj, TmdDjDetail,
  TmdEvent, TmdEventDetail, TmdEventFilters, TmdEventSeries, TmdEventSummary,
  TmdPerson, TmdSeriesEdition, TmdTeacher, TmdTeacherDetail
} from '$lib/types';
import { safeHttpUrl, safeMailto } from '../security/public-links.ts';

const DEFAULT_V4_BASE_URL = 'https://www.tangomarathons.com/wp-json/tmd/v4';
const existingBase = import.meta.env?.PUBLIC_TMD_API_BASE_URL as string | undefined;
const explicitBase = import.meta.env?.PUBLIC_TMD_V4_API_BASE_URL as string | undefined;
export const tmdV4BaseUrl = (explicitBase ??
  (existingBase?.replace(/\/tmd\/v3\/?$/, '/tmd/v4')) ??
  DEFAULT_V4_BASE_URL).replace(/\/+$/, '');

type JsonObject = Record<string, unknown>;
export type TmdV4Page<T> = {
  items: T[];
  page: number;
  perPage: number;
  total?: number;
  totalPages?: number;
  /** False if the server reports further pages. Undefined when not reported. */
  complete?: boolean;
};

export class TmdV4ApiError extends Error {
  readonly status: number;
  readonly path: string;
  constructor(status: number, path: string) {
    super('TMD V4 returned ' + status + ' for ' + path);
    this.status = status;
    this.path = path;
    this.name = 'TmdV4ApiError';
  }
}

function object(value: unknown): JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonObject
    : {};
}
function string(value: unknown): string | undefined {
  return (typeof value === 'string' || typeof value === 'number')
    && String(value).trim() ? String(value).trim() : undefined;
}
function record(value: unknown, name: string): JsonObject {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid TMD V4 ' + name + ': expected object');
  }
  return value as JsonObject;
}
function numeric(value: unknown): number | undefined {
  if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
function id(value: unknown): number | undefined {
  const n = numeric(value);
  return n !== undefined && n > 0 && Number.isInteger(n) ? n : undefined;
}
function bool(value: unknown): boolean {
  return value === true || value === 1 || value === '1' ||
    value === 'true' || value === 'yes';
}
function meta(item: JsonObject): JsonObject { return object(item.meta); }
function from(item: JsonObject, keys: string[]): string | undefined {
  const m = meta(item);
  for (const key of keys) {
    const val = string(item[key]) ?? string(m[key]);
    if (val !== undefined) return val;
  }
}
function ensureId(item: JsonObject): number {
  const value = id(item.id);
  if (value === undefined) throw new Error('Invalid TMD V4 record: missing numeric id');
  return value;
}
function localToday(): string {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')].join('-');
}
function intParam(n: number, min: number, max: number): number {
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.trunc(n))) : min;
}
async function readJson(url: URL): Promise<{ data: unknown; response: Response }> {
  const response = await fetch(url.toString(), {
    headers: { accept: 'application/json' },
    credentials: 'omit'
  });
  if (!response.ok) throw new TmdV4ApiError(response.status, url.pathname);
  let data: unknown;
  try { data = await response.json(); }
  catch { throw new Error('Invalid JSON from TMD V4 ' + url.pathname); }
  return { data, response };
}
function headerCount(response: Response, key: string): number | undefined {
  const value = response.headers.get(key);
  if (value === null || !/^\d+$/.test(value)) return;
  return Number(value);
}
async function collection(url: URL): Promise<TmdV4Page<JsonObject>> {
  const { data, response } = await readJson(url);
  if (!Array.isArray(data) || !data.every(item => Object.keys(object(item)).length > 0)) {
    // An empty array is a valid empty collection; an object/HAL wrapper is not.
    throw new Error('Unexpected TMD V4 collection shape at ' + url.pathname);
  }
  const page = Number(url.searchParams.get('page') ?? 1);
  const perPage = Number(url.searchParams.get('per_page') ?? 10);
  const total = headerCount(response, 'X-WP-Total');
  const totalPages = headerCount(response, 'X-WP-TotalPages');
  return {
    items: data as JsonObject[], page, perPage, total, totalPages,
    complete: totalPages === undefined ? undefined : page >= totalPages
  };
}
function coordinate(item: JsonObject, keys: string[], max: number): number | undefined {
  const m = meta(item);
  for (const key of keys) {
    const n = numeric(item[key]) ?? numeric(m[key]);
    if (n !== undefined && Math.abs(n) <= max) return n;
  }
}
function featureNames(item: JsonObject): string[] {
  const flags: Record<string, string> = {
    role_balanced: 'Role balanced', invitation_only: 'Invitation only',
    have_registration: 'Registration', have_milongas: 'Milongas',
    have_tickets: 'Tickets', have_live_music: 'Live music',
    have_lessons: 'Lessons', have_show: 'Show'
  };
  const m = meta(item);
  return Object.entries(flags)
    .filter(([key]) => bool(m[key] ?? item[key]))
    .map(([, label]) => label);
}
function validLink(raw: unknown, email = false): string | undefined {
  // Share V3/V4 URL safety: reject HTTP credentials and mailto headers.
  return email ? safeMailto(raw) : safeHttpUrl(raw);
}
function links(item: JsonObject, fields: Array<[string, string]>): TmdContactLink[] {
  return fields.flatMap(([key, label]) => {
    const href = validLink(from(item, [key]), key === 'email' || key === 'tmd_dj_e_mail');
    return href ? [{ label, href }] : [];
  });
}
function linked(item: JsonObject, key: string): TmdPerson[] {
  const embedded = object(item._embedded);
  const linked = object(item._links);
  const values = Array.isArray(embedded[key]) ? embedded[key] :
    Array.isArray(linked[key]) ? linked[key] : [];
  return values.flatMap(raw => {
    const x = object(raw), href = safeHttpUrl(x.href);
    const itemId = id(x.id) ?? id(href?.match(/\/(\d+)(?:\?.*)?$/)?.[1]);
    if (!itemId) return [];
    return [{ id: itemId, name: string(x.title) ?? 'Unnamed', url: href }];
  });
}
export function normalizeV4Event(item: TmdApiRecord): TmdEventSummary {
  const eventId = ensureId(item);
  return {
    id: eventId, title: string(item.title) ?? 'Untitled event',
    slug: string(item.slug), dateStart: from(item, ['start_date']),
    dateEnd: from(item, ['end_date']),
    registrationDate: from(item, ['registration_start_date']),
    city: from(item, ['city']), country: from(item, ['country']),
    venue: from(item, ['venue-name', 'venue_name']),
    lat: coordinate(item, ['lat', 'latitude', 'geo_lat'], 90),
    lng: coordinate(item, ['lng', 'lon', 'longitude', 'geo_lng'], 180),
    badges: featureNames(item)
  };
}
export function normalizeV4EventDetail(item: TmdApiRecord): TmdEventDetail {
  const base = normalizeV4Event(item);
  const contactLinks = links(item, [['website', 'Website'], ['email', 'Email']]);
  const socialLinks = links(item, [
    ['facebook_event', 'Facebook event'], ['facebook_group', 'Facebook group'],
    ['facebook_page', 'Facebook page']
  ]);
  return {
    ...base, price: from(item, ['price']), currency: from(item, ['currency']),
    website: validLink(from(item, ['website'])), contactLinks, socialLinks,
    features: base.badges, djs: linked(item, 'djs'),
    teachers: linked(item, 'teachers'), series: linked(item, 'event_series')
  };
}
export async function getV4EventPage(
  perPage = 20, filters?: TmdEventFilters, page = 1
): Promise<TmdV4Page<TmdEventSummary>> {
  if (filters?.registrationState === 'open') {
    throw new Error('TMD V4 does not yet provide authoritative registration-open filtering');
  }
  const url = new URL(tmdV4BaseUrl + '/events');
  url.searchParams.set('page', String(intParam(page, 1, 100000)));
  url.searchParams.set('per_page', String(intParam(perPage, 1, 100)));
  url.searchParams.set('orderby', 'start_date');
  url.searchParams.set('order', 'asc');
  url.searchParams.set('meta_fields', [
    'start_date', 'end_date', 'registration_start_date',
    'city', 'country', 'venue-name', 'lat', 'lon',
    'role_balanced', 'invitation_only', 'have_registration',
    'have_milongas', 'have_tickets', 'have_live_music',
    'have_lessons', 'have_show'
  ].join(','));
  url.searchParams.set('start_date_after', filters?.dateAfter || localToday());
  if (filters?.dateBefore) url.searchParams.set('start_date_before', filters.dateBefore);
  if (filters?.country) url.searchParams.set('country', filters.country);
  if (filters?.city) url.searchParams.set('city', filters.city);
  // Registration not started must be filtered by WordPress before pagination,
  // otherwise filtered pages can look empty while later pages have matches.
  if (filters?.registrationState === 'upcoming') {
    url.searchParams.set('registration_start_date_after', localToday());
  }
  const result = await collection(url);
  return { ...result, items: result.items.map(normalizeV4Event) };
}
/**
 * Bounded multi-page fetch. A requested count larger than 100 must not silently
 * truncate at the REST page-size limit. Consumers needing exhaustiveness can
 * inspect complete/truncated on getV4EventRange.
 */
export async function getV4EventRange(
  limit = 20, filters?: TmdEventFilters
): Promise<TmdV4Page<TmdEventSummary> & { truncated: boolean }> {
  const requested = intParam(limit, 1, 1000);
  const pageSize = Math.min(requested, 100);
  const maxPages = 10;
  const seen = new Set<number>();
  const items: TmdEventSummary[] = [];
  let total: number | undefined;
  let totalPages: number | undefined;
  let fetchedPages = 0;
  let finished = false;

  for (let page = 1; page <= maxPages && items.length < requested; page++) {
    const result = await getV4EventPage(pageSize, filters, page);
    fetchedPages++;
    total = result.total;
    totalPages = result.totalPages;
    for (const event of result.items) {
      if (!seen.has(event.id)) {
        seen.add(event.id);
        items.push(event);
      }
      if (items.length >= requested) break;
    }
    if (result.complete === true || result.items.length === 0 ||
        (totalPages === undefined && result.items.length < pageSize)) {
      finished = true;
      break;
    }
  }

  const complete = finished || (total !== undefined && items.length >= total);
  return {
    items, page: fetchedPages, perPage: pageSize, total, totalPages,
    complete, truncated: !complete
  };
}
export async function getV4Events(perPage = 20, filters?: TmdEventFilters): Promise<TmdEventSummary[]> {
  return (await getV4EventRange(perPage, filters)).items;
}
export async function getV4Event(idValue: string | number): Promise<TmdEventDetail> {
  const url = new URL(tmdV4BaseUrl + '/events/' + encodeURIComponent(String(idValue)));
  url.searchParams.set('_embed', 'true');
  return normalizeV4EventDetail(record((await readJson(url)).data, 'event detail'));
}
function dj(item: JsonObject): TmdDj {
  return {
    id: ensureId(item), title: from(item, ['tmd_dj_name']) ?? string(item.title) ?? 'Unnamed DJ',
    slug: string(item.slug), city: from(item, ['tmd_dj_city', 'city']),
    country: from(item, ['tmd_dj_country', 'country']),
    website: validLink(from(item, ['tmd_dj_webpage', 'website'])),
    socialLinks: links(item, [
      ['tmd_dj_webpage', 'Website'], ['tmd_dj_link_to_facebook', 'Facebook'],
      ['tmd_dj_link_to_facebook_page', 'Facebook page']
    ])
  };
}
export async function getV4Djs(perPage = 50): Promise<TmdDj[]> {
  const url = new URL(tmdV4BaseUrl + '/djs');
  url.searchParams.set('per_page', String(intParam(perPage, 1, 100)));
  url.searchParams.set('orderby', 'title');
  url.searchParams.set('order', 'asc');
  return (await collection(url)).items.map(dj);
}
export async function getV4Dj(idValue: string | number): Promise<TmdDjDetail> {
  const url = new URL(tmdV4BaseUrl + '/djs/' + encodeURIComponent(String(idValue)));
  const item = record((await readJson(url)).data, 'DJ detail');
  return { ...dj(item), bio: from(item, ['tmd_dj_about_the_dj', 'abstract']) };
}
function teacher(item: JsonObject): TmdTeacher {
  const fullName = [from(item, ['first_name']), from(item, ['last_name'])].filter(Boolean).join(' ');
  return {
    id: ensureId(item), title: fullName || from(item, ['nickname']) ||
      string(item.title) || 'Unnamed teacher',
    slug: string(item.slug), city: from(item, ['city']),
    country: from(item, ['country']), role: from(item, ['role'])
  };
}
export async function getV4Teachers(perPage = 50, page = 1): Promise<TmdV4Page<TmdTeacher>> {
  const url = new URL(tmdV4BaseUrl + '/teachers');
  url.searchParams.set('per_page', String(intParam(perPage, 1, 100)));
  url.searchParams.set('page', String(intParam(page, 1, 100000)));
  url.searchParams.set('orderby', 'title');
  url.searchParams.set('order', 'asc');
  const result = await collection(url);
  return { ...result, items: result.items.map(teacher) };
}
export async function getV4Teacher(idValue: string | number): Promise<TmdTeacherDetail> {
  const url = new URL(tmdV4BaseUrl + '/teachers/' + encodeURIComponent(String(idValue)));
  const item = record((await readJson(url)).data, 'teacher detail');
  return {
    ...teacher(item), bio: from(item, ['bio_short']),
    website: validLink(from(item, ['website'])),
    socialLinks: links(item, [
      ['website', 'Website'], ['facebook_profile', 'Facebook'], ['instagram', 'Instagram']
    ])
  };
}

export async function getV4Series(idValue: string | number): Promise<TmdEventSeries> {
  const url = new URL(tmdV4BaseUrl + '/series/' + encodeURIComponent(String(idValue)));
  url.searchParams.set('_embed', 'true');
  url.searchParams.set('per_page', '100');
  const item = record((await readJson(url)).data, 'series detail');
  const seen = new Set<number>();
  const editions: TmdSeriesEdition[] = [];
  const append = (payload: JsonObject) => {
    const embedded = object(payload._embedded);
    const events = Array.isArray(embedded.events) ? embedded.events : [];
    for (const raw of events) {
      const event = object(raw), eventId = id(event.id);
      if (eventId === undefined || seen.has(eventId)) continue;
      seen.add(eventId);
      editions.push({
        id: eventId, title: string(event.title) ?? 'Untitled edition',
        dateStart: from(event, ['start_date']), dateEnd: from(event, ['end_date']),
        city: from(event, ['city']), country: from(event, ['country'])
      });
    }
  };
  append(item);
  // Series with many historical editions have their own embedded pagination.
  // Cap at ten pages to avoid unbounded API requests from a detail screen.
  let pagination = object(object(item._embedded).events_pagination);
  for (let page = 2; pagination.has_next === true && page <= 10; page++) {
    url.searchParams.set('page', String(page));
    const next = record((await readJson(url)).data, 'series editions');
    append(next);
    pagination = object(object(next._embedded).events_pagination);
  }
  if (editions.length === 0) {
    for (const related of linked(item, 'events')) {
      if (!seen.has(related.id)) editions.push({ id: related.id, title: related.name });
    }
  }
  editions.sort((a, b) => (a.dateStart ?? '').localeCompare(b.dateStart ?? '') || a.id - b.id);
  return {
    id: ensureId(item), title: string(item.title) ?? 'Untitled series',
    slug: string(item.slug), description: from(item, ['about', 'abstract']),
    city: from(item, ['city']), country: from(item, ['country']), editions
  };
}
export async function fetchV4Events(options: FetchEventsOptions = {}): Promise<TmdEvent[]> {
  const items = await getV4Events(options.limit ?? 12, {
    country: options.country,
    dateAfter: options.futureOnly === false ? '1900-01-01' : undefined
  });
  return items.map(x => ({
    id: x.id, title: x.title, slug: x.slug, startDate: x.dateStart,
    endDate: x.dateEnd, registrationStartDate: x.registrationDate,
    city: x.city, country: x.country, venueName: x.venue,
    features: x.badges, relationships: { djs: [], teachers: [], series: [] }
  }));
}
export async function fetchV4EventById(idValue: number): Promise<TmdEvent> {
  const d = await getV4Event(idValue);
  return {
    id: d.id, title: d.title, slug: d.slug,
    startDate: d.dateStart, endDate: d.dateEnd, registrationStartDate: d.registrationDate,
    city: d.city, country: d.country, venueName: d.venue, website: d.website,
    price: d.price, currency: d.currency, features: d.features,
    relationships: { djs: d.djs, teachers: d.teachers, series: d.series }
  };
}
