/**
 * Pure public API caching policy. Unknown endpoints are ALWAYS network-only.
 * V3 is deliberately excluded until its arbitrary meta-field contract is
 * proven safe; private /me, user-interactions and native WP users are excluded.
 */
const PUBLIC_PATH = [
	/^\/wp-json\/tmd\/v4\/(events|djs|teachers|series|couples)(\/\d+)?\/?$/,
	/^\/wp-json\/wp\/v2\/(posts|pages|media|categories|tags)(\/\d+)?\/?$/
];

const PUBLIC_QUERY = new Set([
	'page', 'per_page', 'search', 'orderby', 'order', 'country', 'city',
	'featured', 'start_date_after', 'start_date_before',
	'registration_start_date_after', 'registration_start_date_before',
	'_embed', 'embed_mode', 'include_relationships', 'meta_fields',
	'_fields', 'slug', 'categories', 'tags', 'after', 'before'
]);

export function isPublicApiCacheCandidate(
	request: Request, appOrigin: string, wordpressOrigin = 'https://www.tangomarathons.com'
): boolean {
	if (request.method !== 'GET') return false;
	if (request.credentials !== 'omit') return false;
	// WordPress can authenticate with a nonce header even when credentials
	// are omitted. An authenticated or custom-token request is never public.
	if (['authorization', 'cookie', 'x-wp-nonce', 'x-api-key', 'x-auth-token', 'x-csrf-token']
		.some((header) => request.headers.has(header))) return false;

	const url = new URL(request.url);
	if (url.origin !== wordpressOrigin && url.origin !== appOrigin) return false;
	if (!PUBLIC_PATH.some((pattern) => pattern.test(url.pathname))) return false;
	if ([...url.searchParams.keys()].some((key) => !PUBLIC_QUERY.has(key))) return false;
	return true;
}

export function mayCachePublicResponse(response: Response): boolean {
	if (!response.ok || response.type === 'opaque') return false;
	// Do not persist responses that create sessions, or that can change with
	// Cookie/Authorization. A credentials:omit request alone is not proof that
	// the WordPress response is identical for all users.
	if (response.headers.has('set-cookie')) return false;
	const vary = response.headers.get('vary') ?? '';
	if (vary.split(',').some((field) => /^(cookie|authorization|\*)$/i.test(field.trim()))) {
		return false;
	}
	const directives = response.headers.get('cache-control') ?? '';
	if (/\b(private|no-store|no-cache)\b/i.test(directives)) return false;
	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.toLowerCase().includes('json')) return false;
	return true;
}
