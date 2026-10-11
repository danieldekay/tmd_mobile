#!/usr/bin/env node
/**
 * Read-only TMD V4 and WordPress Core contract, CORS and privacy smoke test.
 *
 * node scripts/smoke-public-api.mjs --origin=https://staging.example.org --client-origin=https://mobile.tangomarathons.com
 *
 * Never sends credentials or writes. Does not log response bodies or personal data.
 */
const args = process.argv.slice(2);
const option = name => args.find(a => a.startsWith('--' + name + '='))?.slice(name.length + 3);
function requireOrigin(input, name) {
  if (!input) throw new Error('Missing --' + name + '=https://...');
  const url = new URL(input);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('--' + name + ' must be an HTTPS origin without credentials, path, query or fragment');
  }
  return url.origin;
}
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
function assert(value, message) {
  if (!value) throw new Error(message);
}
const outcomes = [];
function report(name, ok, message) {
  outcomes.push({ name, ok });
  console.log((ok ? 'PASS ' : 'FAIL ') + name + ': ' + message);
  if (!ok) process.exitCode = 1;
}
let origin, mobile;
try {
  origin = requireOrigin(option('origin'), 'origin');
  mobile = requireOrigin(option('client-origin'), 'client-origin');
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
async function fetchPublic(path, statuses = [200]) {
  const url = new URL(path, origin);
  const response = await fetch(url, {
    headers: { Origin: mobile, Accept: 'application/json' },
    credentials: 'omit', redirect: 'manual', signal: AbortSignal.timeout(12000)
  });
  assert(statuses.includes(response.status), 'HTTP ' + response.status + ' at ' + url.pathname);
  const cors = response.headers.get('access-control-allow-origin');
  assert(cors === mobile || cors === '*', 'CORS origin missing or wrong: ' + (cors ?? 'absent'));
  if (response.status === 200) {
    assert(response.headers.get('content-type')?.includes('application/json'), 'not JSON');
  }
  return response;
}
async function list(path, name, checkItem) {
  try {
    const response = await fetchPublic(path);
    const result = await response.json();
    assert(Array.isArray(result) && result.every(object), 'expected array collection');
    const total = response.headers.get('x-wp-total');
    const totalPages = response.headers.get('x-wp-totalpages');
    assert(total !== null && /^\d+$/.test(total), 'X-WP-Total missing');
    assert(totalPages !== null && /^\d+$/.test(totalPages), 'X-WP-TotalPages missing');
    const expose = response.headers.get('access-control-expose-headers') ?? '';
    assert(expose === '*' || (/x-wp-total/i.test(expose) && /x-wp-totalpages/i.test(expose)),
      'pagination headers are not exposed to cross-origin browsers');
    if (result.length) checkItem?.(result[0]);
    report(name, true, result.length + ' returned, ' + total + ' total');
    return result;
  } catch (error) {
    report(name, false, error.message);
    return [];
  }
}
async function detail(path, name, validate) {
  try {
    const response = await fetchPublic(path);
    const data = await response.json();
    assert(object(data), 'expected object');
    validate(data);
    report(name, true, 'HTTP 200 and valid JSON object');
  } catch (error) {
    report(name, false, error.message);
  }
}
if (origin && mobile) {
  const v4 = '/wp-json/tmd/v4/';
  const wp = '/wp-json/wp/v2/';
  const v4Event = item => {
    assert(Number.isSafeInteger(Number(item.id)), 'event missing id');
    assert(typeof item.title === 'string', 'V4 title must be string');
    assert(object(item.meta), 'V4 event missing meta');
    if (item.meta.start_date) {
      assert(/^\d{4}-\d{2}-\d{2}/.test(String(item.meta.start_date)), 'invalid start_date');
    }
  };
  const events = await list(
    v4 + 'events?per_page=2&page=1&orderby=start_date&order=asc&start_date_after=2026-01-01',
    'V4 event ordering and pagination', v4Event);
  if (events.length) await detail(v4 + 'events/' + events[0].id + '?_embed=true',
    'V4 public event detail', v4Event);
  for (const name of ['djs', 'teachers', 'series']) {
    await list(v4 + name + '?per_page=1', 'V4 ' + name,
      item => {
        assert(Number.isSafeInteger(Number(item.id)), 'missing V4 id');
        assert(typeof item.title === 'string', 'V4 title is not string');
      });
  }
  for (const name of ['posts', 'pages']) {
    await list(wp + name + '?per_page=1', 'WP Core ' + name,
      item => assert(object(item.title) && typeof item.title.rendered === 'string',
        'WP Core title.rendered missing'));
  }
  for (const name of ['media', 'categories', 'tags']) {
    await list(wp + name + '?per_page=1', 'WP Core ' + name,
      item => assert(Number.isSafeInteger(Number(item.id)), 'WP ID missing'));
  }
  for (const name of ['types', 'taxonomies']) {
    await detail(wp + name, 'WP Core ' + name,
      value => assert(Object.keys(value).length > 0, 'empty discovery response'));
  }
  try {
    const response = await fetchPublic(v4 + 'user-interactions?per_page=1', [401, 403]);
    report('Anonymous private interactions rejected', true, 'HTTP ' + response.status);
  } catch (error) {
    report('Anonymous private interactions rejected', false, error.message);
  }
  try {
    const response = await fetchPublic(wp + 'user-interactions?per_page=1', [401, 403, 404]);
    report('Native WordPress private interactions not public', true, 'HTTP ' + response.status);
  } catch (error) {
    report('Native WordPress private interactions not public', false, error.message);
  }
  console.log('\n' + outcomes.filter(result => result.ok).length + '/' + outcomes.length + ' checks passed');
}
