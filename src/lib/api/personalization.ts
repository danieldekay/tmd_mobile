import { authedFetch } from '$lib/api/user';
import type { TmdEventFilters, TmdEventSummary } from '$lib/types';

export type FollowMatch = {
  target_post_type: 'tmd_dj' | 'tmd_teacher' | 'tmd_teacher_couple' | 'tmd_event_series';
  target_post_id: number;
  title: string;
};

export type FollowingEvent = TmdEventSummary & {
  matchedBy: FollowMatch[];
};

export type UserInteraction = {
  id: number;
  interaction_type: 'bookmark' | 'follow';
  target_post_type: string;
  target_post_id: number;
};

export type FollowingPage = {
  events: FollowingEvent[];
  total: number;
  pages: number;
};

type ServerFollowingEvent = {
  id?: unknown;
  title?: unknown;
  start_date?: unknown;
  end_date?: unknown;
  registration_start_date?: unknown;
  city?: unknown;
  country?: unknown;
  event_type?: unknown;
  matched_by?: unknown;
};

const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

function parseMatches(value: unknown): FollowMatch[] {
  if (!Array.isArray(value)) return [];
  const accepted = new Set([
    'tmd_dj', 'tmd_teacher', 'tmd_teacher_couple', 'tmd_event_series'
  ]);
  return value.flatMap((raw): FollowMatch[] => {
    if (!raw || typeof raw !== 'object') return [];
    const match = raw as Record<string, unknown>;
    if (!accepted.has(str(match.target_post_type)) || num(match.target_post_id) < 1) return [];
    return [{
      target_post_type: str(match.target_post_type) as FollowMatch['target_post_type'],
      target_post_id: num(match.target_post_id),
      title: str(match.title)
    }];
  });
}

function normalize(row: ServerFollowingEvent): FollowingEvent | null {
  const id = num(row.id);
  if (id < 1 || !str(row.title)) return null;
  const eventType = str(row.event_type);
  return {
    id,
    title: str(row.title),
    dateStart: str(row.start_date) || undefined,
    dateEnd: str(row.end_date) || undefined,
    registrationDate: str(row.registration_start_date) || undefined,
    city: str(row.city) || undefined,
    country: str(row.country) || undefined,
    badges: eventType ? [eventType] : [],
    matchedBy: parseMatches(row.matched_by)
  };
}

/**
 * Load a complete server-paginated page of events linked to the account's
 * actual follow records (including a teacher's teaching partnerships).
 * No filtering of the first N public events, which would miss valid matches.
 */
export async function getFollowingEvents(
  page = 1,
  filters: TmdEventFilters = {},
  perPage = 50
): Promise<FollowingPage> {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(Math.max(1, Math.min(100, perPage)))
  });
  if (filters.country) query.set('country', filters.country);
  if (filters.dateAfter) query.set('from', filters.dateAfter);
  if (filters.dateBefore) query.set('to', filters.dateBefore);

  const response = await authedFetch(`/me/following-events?${query.toString()}`, {}, 'v4');
  if (!response) throw new Error('Sign in to see events featuring people you follow.');
  if (!response.ok) throw new Error(`Following events request failed: HTTP ${response.status}`);

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) throw new Error('Unexpected following-events response.');
  const events = payload
    .filter((row): row is ServerFollowingEvent => !!row && typeof row === 'object' && !Array.isArray(row))
    .map(normalize)
    .filter((row): row is FollowingEvent => row !== null);

  // Core applies country/date filtering before pagination. City and registration
  // are fallback presentation filters until the API supports them directly.
  const city = filters.city?.trim().toLocaleLowerCase();
  const registrationState = filters.registrationState;
  const now = Date.now();
  const filtered = events.filter((event) => {
    if (city && !event.city?.toLocaleLowerCase().includes(city)) return false;
    if (registrationState && registrationState !== 'all') {
      const date = event.registrationDate ? new Date(event.registrationDate).getTime() : undefined;
      if (registrationState === 'open' && (date === undefined || date > now)) return false;
      if (registrationState === 'upcoming' && date !== undefined && date <= now) return false;
    }
    return true;
  });

  return {
    events: filtered,
    total: Number(response.headers.get('X-WP-Total') ?? events.length),
    pages: Number(response.headers.get('X-WP-TotalPages') ?? 1)
  };
}

export async function getUserInteractions(kind: 'follow' | 'bookmark' = 'follow'): Promise<UserInteraction[]> {
  const response = await authedFetch(`/user-interactions?interaction_type=${kind}&per_page=100`, {}, 'v4');
  if (!response) throw new Error('Sign in to see your saved and followed items.');
  if (!response.ok) throw new Error(`Account interests request failed: HTTP ${response.status}`);
  const raw = (await response.json()) as unknown;
  if (!Array.isArray(raw)) throw new Error('Unexpected account-interests response.');
  return raw.flatMap((value): UserInteraction[] => {
    if (!value || typeof value !== 'object') return [];
    const row = value as Record<string, unknown>;
    if (!num(row.id) || !num(row.target_post_id) || row.interaction_type !== kind) return [];
    return [{
      id: num(row.id),
      target_post_id: num(row.target_post_id),
      target_post_type: str(row.target_post_type),
      interaction_type: kind
    }];
  });
}

export async function removeUserInteraction(interactionId: number): Promise<void> {
  const response = await authedFetch(`/user-interactions/${interactionId}`, { method: 'DELETE' }, 'v4');
  if (!response?.ok) throw new Error('Could not remove your follow. Try again.');
}
