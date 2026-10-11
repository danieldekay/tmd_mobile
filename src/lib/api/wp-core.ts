/**
 * Read-only native WordPress REST v2 client for editorial content.
 * TMD domain entities must use tmd-v4.ts, not wp/v2 custom post routes.
 */
const DEFAULT_WP_ORIGIN = 'https://www.tangomarathons.com';
const configured = import.meta.env.PUBLIC_TMD_API_BASE_URL as string | undefined;
const explicit = import.meta.env.PUBLIC_WP_API_BASE_URL as string | undefined;
const origin = (() => {
  if (explicit) return explicit.replace(/\/+$/, '');
  try { return new URL(configured || DEFAULT_WP_ORIGIN).origin + '/wp-json/wp/v2'; }
  catch { return DEFAULT_WP_ORIGIN + '/wp-json/wp/v2'; }
})();
export const wpCoreBaseUrl = origin.replace(/\/+$/, '');

export type WpRendered = { rendered: string };
export type WpPostSummary = {
  id: number; slug: string; title: WpRendered; excerpt: WpRendered;
  date: string; modified?: string; link?: string; featured_media?: number;
};
export type WpPostDetail = WpPostSummary & { content: WpRendered };
export type WpPage = {
  id: number; slug: string; title: WpRendered; content: WpRendered;
  link?: string; modified?: string;
};
export type WpMedia = {
  id: number; alt_text: string; source_url: string;
  media_details?: { width?: number; height?: number; sizes?: Record<string, {
    source_url: string; width?: number; height?: number;
  }> };
};
export type WpTerm = { id: number; name: string; slug: string; count?: number };
export type WpCollection<T> = {
  items: T[];
  page: number;
  perPage: number;
  total?: number;
  totalPages?: number;
};

export class WpApiError extends Error {
  constructor(public status: number, public path: string) {
    super('WordPress REST returned ' + status + ' for ' + path);
    this.name = 'WpApiError';
  }
}
function pageSize(value: number): string {
  return String(Number.isFinite(value) ? Math.max(1, Math.min(100, Math.trunc(value))) : 20);
}
async function request<T>(url: URL): Promise<{ body: T; headers: Headers }> {
  const response = await fetch(url.toString(), {
    headers: { accept: 'application/json' }, credentials: 'omit'
  });
  if (!response.ok) throw new WpApiError(response.status, url.pathname);
  let body: unknown;
  try { body = await response.json(); }
  catch { throw new Error('Invalid JSON from WordPress REST ' + url.pathname); }
  return { body: body as T, headers: response.headers };
}
function count(headers: Headers, name: string): number | undefined {
  const raw = headers.get(name);
  return raw !== null && /^\d+$/.test(raw) ? Number(raw) : undefined;
}
async function collection<T>(url: URL): Promise<WpCollection<T>> {
  const { body, headers } = await request<unknown>(url);
  if (!Array.isArray(body) || !body.every(item => item && typeof item === 'object' && !Array.isArray(item))) {
    throw new Error('Unexpected WordPress REST collection response from ' + url.pathname);
  }
  return {
    items: body as T[],
    page: Number(url.searchParams.get('page') ?? 1),
    perPage: Number(url.searchParams.get('per_page') ?? 10),
    total: count(headers, 'X-WP-Total'),
    totalPages: count(headers, 'X-WP-TotalPages')
  };
}
function urlFor(path: string): URL { return new URL(wpCoreBaseUrl + '/' + path); }

export async function getWpPosts(perPage = 20, page = 1): Promise<WpCollection<WpPostSummary>> {
  const url = urlFor('posts');
  url.searchParams.set('per_page', pageSize(perPage));
  url.searchParams.set('page', String(Math.max(1, Math.trunc(page))));
  url.searchParams.set('_fields', 'id,slug,title,excerpt,date,modified,link,featured_media');
  return collection<WpPostSummary>(url);
}
export async function getWpPost(slug: string): Promise<WpPostDetail | undefined> {
  const url = urlFor('posts');
  url.searchParams.set('slug', slug);
  url.searchParams.set('per_page', '1');
  url.searchParams.set('_fields', 'id,slug,title,excerpt,content,date,modified,link,featured_media');
  return (await collection<WpPostDetail>(url)).items[0];
}
export async function getWpPage(slug: string): Promise<WpPage | undefined> {
  const url = urlFor('pages');
  url.searchParams.set('slug', slug);
  url.searchParams.set('per_page', '1');
  url.searchParams.set('_fields', 'id,slug,title,content,modified,link');
  return (await collection<WpPage>(url)).items[0];
}
export async function getWpMedia(id: number): Promise<WpMedia> {
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('Invalid media ID');
  const url = urlFor('media/' + id);
  url.searchParams.set('_fields', 'id,alt_text,source_url,media_details');
  const { body } = await request<unknown>(url);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('Unexpected WordPress media response');
  }
  return body as WpMedia;
}
export async function getWpCategories(perPage = 100, page = 1): Promise<WpCollection<WpTerm>> {
  const url = urlFor('categories');
  url.searchParams.set('per_page', pageSize(perPage));
  url.searchParams.set('page', String(Math.max(1, Math.trunc(page))));
  url.searchParams.set('_fields', 'id,name,slug,count');
  return collection<WpTerm>(url);
}
export async function getWpTags(perPage = 100, page = 1): Promise<WpCollection<WpTerm>> {
  const url = urlFor('tags');
  url.searchParams.set('per_page', pageSize(perPage));
  url.searchParams.set('page', String(Math.max(1, Math.trunc(page))));
  url.searchParams.set('_fields', 'id,name,slug,count');
  return collection<WpTerm>(url);
}

/**
 * The returned content.rendered HTML is NOT sanitized. Any Svelte UI that
 * renders it using {@html} must sanitize with a reviewed DOMPurify policy,
 * normalize relative href/src URLs and reject event-handler attributes.
 */
