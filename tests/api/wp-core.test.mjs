import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getWpPosts, getWpPost, getWpPage, getWpMedia, getWpCategories, WpApiError
} from '../../src/lib/api/wp-core.ts';

function response(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers });
}
test('WordPress posts use /wp/v2 with native rendered fields and pagination', async t => {
  const old = globalThis.fetch;
  t.after(() => globalThis.fetch = old);
  let requested;
  globalThis.fetch = async (url, opts) => {
    requested = { url: new URL(url), opts };
    return response([{
      id: 1, slug: 'news', title: { rendered: 'Latest news' },
      excerpt: { rendered: '<p>News</p>' }, date: '2026-10-01'
    }], 200, { 'X-WP-Total': '40', 'X-WP-TotalPages': '2' });
  };
  const result = await getWpPosts(20);
  assert.equal(requested.url.pathname, '/wp-json/wp/v2/posts');
  assert.equal(requested.opts.credentials, 'omit');
  assert.equal(result.items[0].title.rendered, 'Latest news');
  assert.equal(result.total, 40);
  assert.equal(result.totalPages, 2);
});
test('posts/pages use slug query, not a guessed numeric endpoint', async t => {
  const old = globalThis.fetch;
  t.after(() => globalThis.fetch = old);
  const calls = [];
  globalThis.fetch = async url => {
    calls.push(new URL(url));
    return response([{ id: 12, slug: 'about', title: { rendered: 'About' },
      content: { rendered: '<p>Body</p>' } }]);
  };
  const post = await getWpPost('about');
  const page = await getWpPage('about');
  assert.equal(post.slug, 'about');
  assert.equal(page.content.rendered, '<p>Body</p>');
  assert.equal(calls[0].searchParams.get('slug'), 'about');
  assert.equal(calls[1].pathname, '/wp-json/wp/v2/pages');
});
test('media and taxonomy endpoints are standard WP Core routes', async t => {
  const old = globalThis.fetch;
  t.after(() => globalThis.fetch = old);
  const paths = [];
  globalThis.fetch = async url => {
    paths.push(new URL(url).pathname);
    return response(paths.length === 1
      ? { id: 4, alt_text: 'Dancers', source_url: 'https://example.org/image.jpg' }
      : [{ id: 8, name: 'Tango', slug: 'tango' }]);
  };
  assert.equal((await getWpMedia(4)).alt_text, 'Dancers');
  assert.equal((await getWpCategories()).items[0].name, 'Tango');
  assert.deepEqual(paths, ['/wp-json/wp/v2/media/4', '/wp-json/wp/v2/categories']);
});
test('WP API rejects non-collection shapes and propagates errors', async t => {
  const old = globalThis.fetch;
  t.after(() => globalThis.fetch = old);
  globalThis.fetch = async () => response({ message: 'not a list' });
  await assert.rejects(getWpPosts(), /Unexpected WordPress REST collection response/);
  globalThis.fetch = async () => response({ code: 'rest_forbidden' }, 403);
  await assert.rejects(getWpPosts(), e => e instanceof WpApiError && e.status === 403);
});
