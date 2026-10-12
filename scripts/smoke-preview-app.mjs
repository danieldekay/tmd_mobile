#!/usr/bin/env node
/**
 * Read-only deployed TMD Mobile preview smoke test.
 *
 * Usage:
 *   node scripts/smoke-preview-app.mjs --url=https://example.workers.dev --api-origin=https://staging.tangomarathons.com
 *
 * The script intentionally avoids credentials and writes. It fails closed when the
 * production mobile domain is supplied by mistake.
 */
const args = process.argv.slice(2);
const option = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);

function assert(value, message) {
  if (!value) throw new Error(message);
}

function requireOrigin(input, name) {
  if (!input) throw new Error(`Missing --${name}=https://...`);
  const url = new URL(input);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`--${name} must be an HTTPS origin without credentials, path, query or fragment`);
  }
  return url.origin;
}

const appOrigin = requireOrigin(option('url'), 'url');
const apiOrigin = option('api-origin') ? requireOrigin(option('api-origin'), 'api-origin') : 'https://staging.tangomarathons.com';
const allowProduction = args.includes('--allow-production-domain');
const appHost = new URL(appOrigin).hostname;
if (!allowProduction && appHost === 'mobile.tangomarathons.com') {
  throw new Error('Refusing to smoke-test production mobile.tangomarathons.com as a V4 preview. Use the isolated staging Worker URL.');
}

const outcomes = [];
function report(name, ok, message) {
  outcomes.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${message}`);
  if (!ok) process.exitCode = 1;
}

async function fetchPath(path, options = {}) {
  const url = new URL(path, appOrigin);
  const response = await fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(options.timeoutMs ?? 12000),
    headers: {
      Accept: options.accept ?? '*/*',
      ...(options.headers ?? {})
    }
  });
  return { url, response };
}

function header(response, name) {
  return response.headers.get(name) ?? '';
}

function assertNoSetCookie(response, path) {
  assert(!response.headers.has('set-cookie'), `${path} must not set cookies`);
}

async function checkHtmlRoute(path) {
  try {
    const { response } = await fetchPath(path, { accept: 'text/html' });
    assert(response.status === 200, `HTTP ${response.status}`);
    assert(header(response, 'content-type').includes('text/html'), 'response is not HTML');
    assertNoSetCookie(response, path);
    const html = await response.text();
    assert(html.includes('manifest.json'), 'manifest link missing');
    assert(html.includes('viewport'), 'viewport metadata missing');
    assert(!html.includes('mobile.tangomarathons.com/wp-json/tmd/v4'), 'preview HTML references production V4 API');
    report(`HTML route ${path}`, true, 'served application shell');
  } catch (error) {
    report(`HTML route ${path}`, false, error.message);
  }
}

async function checkManifest() {
  try {
    const { response } = await fetchPath('/manifest.json', { accept: 'application/manifest+json, application/json' });
    assert(response.status === 200, `HTTP ${response.status}`);
    assertNoSetCookie(response, '/manifest.json');
    const manifest = await response.json();
    assert(manifest.name === 'TMD Mobile', 'manifest.name mismatch');
    assert(manifest.start_url === '/', 'manifest.start_url must stay /');
    assert(manifest.display === 'standalone', 'manifest.display must be standalone');
    assert(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'manifest icons missing');
    report('PWA manifest', true, `${manifest.name}, ${manifest.display}`);
  } catch (error) {
    report('PWA manifest', false, error.message);
  }
}

async function checkServiceWorker() {
  try {
    const { response } = await fetchPath('/service-worker.js', { accept: 'application/javascript, text/javascript, */*' });
    assert(response.status === 200, `HTTP ${response.status}`);
    assertNoSetCookie(response, '/service-worker.js');
    const cacheControl = header(response, 'cache-control').toLowerCase();
    assert(cacheControl.includes('no-store') || cacheControl.includes('max-age=0'), 'service worker must not be served with long-lived cache headers');
    const body = await response.text();
    assert(body.includes('tmd-shell-'), 'shell cache marker missing');
    assert(body.includes('tmd-api-public'), 'public API cache marker missing');
    assert(body.includes('user-interactions'), 'private interaction denylist/check marker missing');
    assert(!body.includes('mobile.tangomarathons.com/wp-json/tmd/v4'), 'service worker references production V4 API');
    report('Service worker', true, cacheControl || 'cache header present');
  } catch (error) {
    report('Service worker', false, error.message);
  }
}

async function checkSecurityHeaders() {
  try {
    const { response } = await fetchPath('/', { accept: 'text/html' });
    assert(response.status === 200, `HTTP ${response.status}`);
    assert(header(response, 'x-content-type-options').toLowerCase() === 'nosniff', 'X-Content-Type-Options must be nosniff');
    assert(header(response, 'x-frame-options').toLowerCase() === 'deny', 'X-Frame-Options must be DENY');
    const csp = header(response, 'content-security-policy');
    assert(csp.includes('connect-src'), 'CSP connect-src missing');
    assert(csp.includes('*.tangomarathons.com') || csp.includes(apiOrigin), `CSP must allow ${apiOrigin}`);
    report('Security headers', true, 'frame/content-type/CSP present');
  } catch (error) {
    report('Security headers', false, error.message);
  }
}

async function checkApiReachability() {
  try {
    const url = new URL('/wp-json/tmd/v4/events?per_page=1&page=1', apiOrigin);
    const response = await fetch(url, {
      headers: { Origin: appOrigin, Accept: 'application/json' },
      credentials: 'omit',
      signal: AbortSignal.timeout(12000)
    });
    assert(response.status === 200, `HTTP ${response.status}`);
    const cors = response.headers.get('access-control-allow-origin');
    assert(cors === '*' || cors === appOrigin, `unexpected CORS for preview origin ${appOrigin}: ${cors ?? 'absent'}`);
    const data = await response.json();
    assert(Array.isArray(data), 'V4 events must be a JSON array');
    report('Staging Core V4 from preview origin', true, `${data.length} events on first page`);
  } catch (error) {
    report('Staging Core V4 from preview origin', false, error.message);
  }
}

await checkHtmlRoute('/');
for (const path of ['/events', '/calendar', '/map', '/blog']) await checkHtmlRoute(path);
await checkManifest();
await checkServiceWorker();
await checkSecurityHeaders();
await checkApiReachability();

const passed = outcomes.filter((result) => result.ok).length;
console.log(`\n${passed}/${outcomes.length} deployed preview checks passed`);
if (passed !== outcomes.length) process.exitCode = 1;
