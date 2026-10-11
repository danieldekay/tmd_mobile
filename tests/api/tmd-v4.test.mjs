import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getV4EventPage, getV4Event, getV4Djs, getV4Series, getV4EventRange, getV4Teachers, getV4Teacher,
  normalizeV4Event, TmdV4ApiError
} from '../../src/lib/api/tmd-v4.ts';

const event = (id = 10) => ({
  id, title: 'Festival ' + id, slug: 'festival-' + id,
  meta: {
    start_date: '2027-01-15', end_date: '2027-01-18',
    registration_start_date: '2026-11-01',
    city: 'Berlin', country: 'Germany', 'venue-name': 'Ballroom',
    lat: '52.5200', lng: '13.4050', role_balanced: '1'
  }
});
function respond(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'content-type': 'application/json', ...headers }
  });
}
test('V4 events: array DTO, nested meta, decimal coordinates and canonical filters', async t => {
  const old = globalThis.fetch;
  t.after(() => globalThis.fetch = old);
  let requested;
  globalThis.fetch = async (url, opts) => {
    requested = { url: new URL(url), opts };
    return respond([event()], 200, { 'X-WP-Total': '51', 'X-WP-TotalPages': '3' });
  };
  const result = await getV4EventPage(20, {
    country: 'Germany', city: 'Berlin',
    dateAfter: '2027-01-01', dateBefore: '2027-02-01'
  });
  assert.equal(result.items[0].lat, 52.52);
  assert.equal(result.items[0].lng, 13.405);
  assert.equal(result.items[0].venue, 'Ballroom');
  assert.deepEqual(result.items[0].badges, ['Role balanced']);
  assert.equal(result.total, 51);
  assert.equal(result.complete, false);
  assert.equal(requested.url.pathname, '/wp-json/tmd/v4/events');
  assert.equal(requested.url.searchParams.get('start_date_after'), '2027-01-01');
  assert.equal(requested.url.searchParams.get('start_date_before'), '2027-02-01');
  assert.equal(requested.url.searchParams.get('orderby'), 'start_date');
  assert.equal(requested.url.searchParams.get('order'), 'asc');
  assert.equal(requested.url.searchParams.get('future'), null);
  assert.equal(requested.opts.credentials, 'omit');
});
test('V4 event relationships use embedded entries or link URIs', async t => {
  const old = globalThis.fetch;
  t.after(() => globalThis.fetch = old);
  globalThis.fetch = async () => respond({
    ...event(),
    _embedded: { djs: [{ id: 42, title: 'DJ A' }] },
    _links: {
      teachers: [{ href: 'https://www.tangomarathons.com/wp-json/tmd/v4/teachers/5', title: 'Teacher B' }],
      event_series: [{ href: 'https://www.tangomarathons.com/wp-json/tmd/v4/series/7', title: 'Series C' }]
    }
  });
  const detail = await getV4Event(10);
  assert.deepEqual(detail.djs.map(x => x.id), [42]);
  assert.deepEqual(detail.teachers.map(x => x.id), [5]);
  assert.deepEqual(detail.series.map(x => x.id), [7]);
});
test('V4 DJ metadata uses actual tmd_dj prefixed keys', async t => {
  const old = globalThis.fetch;
  t.after(() => globalThis.fetch = old);
  globalThis.fetch = async () => respond([{
    id: 41, title: 'DJ Uno', meta: {
      tmd_dj_city: 'Rome', tmd_dj_country: 'Italy',
      tmd_dj_webpage: 'https://dj.example'
    }
  }]);
  const [dj] = await getV4Djs(10);
  assert.equal(dj.city, 'Rome');
  assert.equal(dj.country, 'Italy');
  assert.equal(dj.website, 'https://dj.example/');
});
test('V4 event series calls /series and reads event links', async t => {
  const old = globalThis.fetch;
  t.after(() => globalThis.fetch = old);
  let requested = '';
  globalThis.fetch = async url => {
    requested = String(url);
    return respond({ id: 7, title: 'Seven Series',
      _links: { events: [{
        href: 'https://www.tangomarathons.com/wp-json/tmd/v4/events/10', title: '2027 edition'
      }] }
    });
  };
  const series = await getV4Series(7);
  assert.ok(requested.includes('/tmd/v4/series/7'));
  assert.deepEqual(series.editions, [{ id: 10, title: '2027 edition' }]);
});
test('malformed V4 collections and failed HTTP are errors, never empty success', async t => {
  const old = globalThis.fetch;
  t.after(() => globalThis.fetch = old);
  globalThis.fetch = async () => respond({ _embedded: { events: [event()] } });
  await assert.rejects(getV4EventPage(10), /Unexpected TMD V4 collection shape/);
  globalThis.fetch = async () => respond({ code: 'rest_forbidden' }, 403);
  await assert.rejects(getV4EventPage(10), e => e instanceof TmdV4ApiError && e.status === 403);
});
test('coordinates reject out-of-range and URLs must use safe schemes', () => {
  const bad = { ...event(), meta: {
    ...event().meta, lat: '500', lng: 'NaN', website: 'javascript:alert(1)'
  } };
  assert.equal(normalizeV4Event(bad).lat, undefined);
  assert.equal(normalizeV4Event(bad).lng, undefined);
});
test('open-registration filter refuses unsupported authoritative status', async () => {
  await assert.rejects(getV4EventPage(20, { registrationState: 'open' }), /does not yet provide/);
});


test('V4 range traverses multiple pages and makes truncation explicit', async t => {
  const previous = globalThis.fetch;
  t.after(() => globalThis.fetch = previous);
  const pages = [];
  globalThis.fetch = async url => {
    const request = new URL(url);
    const current = Number(request.searchParams.get('page'));
    pages.push(current);
    const start = (current - 1) * 100;
    return respond(Array.from({ length: 100 }, (_, i) => event(start + i + 1)), 200, {
      'X-WP-Total': '300',
      'X-WP-TotalPages': '3'
    });
  };
  const result = await getV4EventRange(200, { dateAfter: '2027-01-01' });
  assert.deepEqual(pages, [1, 2]);
  assert.equal(result.items.length, 200);
  assert.equal(result.items[0].id, 1);
  assert.equal(result.items[199].id, 200);
  assert.equal(result.complete, false);
  assert.equal(result.truncated, true);
});

test('V4 teacher list uses controller meta keys, detail uses safe links', async t => {
  const previous = globalThis.fetch;
  t.after(() => globalThis.fetch = previous);
  const teacher = {
    id: 8, title: 'Listed Name', meta: {
      first_name: 'Ada', last_name: 'Luna', city: 'Turin', country: 'Italy',
      website: 'javascript:alert(1)', bio_short: 'Teacher biography'
    }
  };
  globalThis.fetch = async url => respond(String(url).includes('/teachers/8')
    ? teacher : [teacher]);
  const page = await getV4Teachers(20);
  assert.equal(page.items[0].title, 'Ada Luna');
  const detail = await getV4Teacher(8);
  assert.equal(detail.bio, 'Teacher biography');
  assert.equal(detail.website, undefined);
  assert.equal(detail.socialLinks.length, 0);
});

test('V4 series pages include dated editions from embedded relations', async t => {
  const previous = globalThis.fetch;
  t.after(() => globalThis.fetch = previous);
  const calls = [];
  globalThis.fetch = async url => {
    const request = new URL(url);
    calls.push(request.searchParams.get('page') ?? '1');
    const first = !request.searchParams.has('page');
    return respond({
      id: 99,
      title: 'Festival series',
      _embedded: {
        events: [{
          id: first ? 20 : 21,
          title: first ? 'Old' : 'New',
          start_date: first ? '2025-08-01' : '2026-08-01',
          city: 'Vienna', country: 'Austria'
        }],
        events_pagination: {
          current_page: first ? 1 : 2,
          has_next: first
        }
      }
    });
  };
  const series = await getV4Series(99);
  assert.deepEqual(calls, ['1', '2']);
  assert.equal(series.editions[0].dateStart, '2025-08-01');
  assert.equal(series.editions[1].dateStart, '2026-08-01');
  assert.equal(series.editions[1].city, 'Vienna');
});
