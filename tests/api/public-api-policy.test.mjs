import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isPublicApiCacheCandidate, mayCachePublicResponse
} from '../../src/lib/offline/public-api-policy.ts';

const ORIGIN = 'https://mobile.tangomarathons.com';
const API = 'https://www.tangomarathons.com';
function request(path, opts = {}) {
  return new Request(API + path, { credentials: 'omit', ...opts });
}
test('cache only explicit anonymous public TMD V4 and WordPress Core collections/details', () => {
  for (const path of [
    '/wp-json/tmd/v4/events?per_page=100&start_date_after=2027-01-01',
    '/wp-json/tmd/v4/events?registration_start_date_after=2026-10-11&per_page=25',
    '/wp-json/tmd/v4/events/432?_embed=true',
    '/wp-json/tmd/v4/djs/22',
    '/wp-json/tmd/v4/series/3?page=2&per_page=20',
    '/wp-json/wp/v2/posts?slug=about',
    '/wp-json/wp/v2/pages/10',
    '/wp-json/wp/v2/media/25',
    '/wp-json/wp/v2/categories?per_page=20'
  ]) {
    assert.equal(isPublicApiCacheCandidate(request(path), ORIGIN), true, path);
  }
});
test('auth, legacy API, private routes, unknown query and unsafe origins bypass cache', () => {
  for (const path of [
    '/wp-json/tmd/v3/events',
    '/wp-json/tmd/v4/user-interactions',
    '/wp-json/tmd/v4/user-interactions/10',
    '/wp-json/tmd/v4/me',
    '/wp-json/wp/v2/users',
    '/wp-json/wp/v2/tmd_user_interactions',
    '/wp-json/wp/v2/posts?context=edit',
    '/wp-json/wp/v2/posts?status=private',
    '/wp-json/wp/v2/posts?password=secret',
    '/wp-json/wp/v2/posts/1/revisions'
  ]) {
    assert.equal(isPublicApiCacheCandidate(request(path), ORIGIN), false, path);
  }
  assert.equal(isPublicApiCacheCandidate(request('/wp-json/tmd/v4/events',
    { headers: { Authorization: 'Bearer secret' } }), ORIGIN), false);
  assert.equal(isPublicApiCacheCandidate(request('/wp-json/tmd/v4/events',
    { credentials: 'include' }), ORIGIN), false);
  assert.equal(isPublicApiCacheCandidate(request('/wp-json/tmd/v4/events',
    { credentials: 'same-origin' }), ORIGIN), false);
  assert.equal(isPublicApiCacheCandidate(request('/wp-json/tmd/v4/events',
    { method: 'POST' }), ORIGIN), false);
  assert.equal(isPublicApiCacheCandidate(new Request(
    'https://example.org/wp-json/tmd/v4/events', { credentials: 'omit' }), ORIGIN), false);
});
test('cache only successful, JSON, publicly cacheable responses', () => {
  const pub = new Response('[]', {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' }
  });
  assert.equal(mayCachePublicResponse(pub), true);
  for (const header of ['private', 'no-store', 'no-cache', 'public, no-store']) {
    assert.equal(mayCachePublicResponse(new Response('[]', {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': header }
    })), false);
  }
  assert.equal(mayCachePublicResponse(new Response('No', { status: 403,
    headers: { 'Content-Type': 'application/json' } })), false);
  assert.equal(mayCachePublicResponse(new Response('<html>no</html>', {
    headers: { 'Content-Type': 'text/html' }
  })), false);
});
