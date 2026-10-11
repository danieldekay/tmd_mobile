# TMD Mobile — V4 + WordPress Core release gates

**Architecture:** TMD REST V4 for events, DJs, teachers and series; native WordPress REST wp/v2 for posts, pages, media and editorial taxonomies.

**Status (2026-10-11):** This is a release checklist, not a record of a production smoke test. Core draft PR #46 and Mobile draft PR #55 remain unmerged. Production V3 stays active by default, and deployment builds intentionally force PUBLIC_TMD_USE_V4=false.

**Tracking:** https://github.com/danieldekay/tmd_mobile/issues/45 ; https://github.com/danieldekay/tmd_mobile/issues/54 ; https://github.com/danieldekay/tmd_core/issues/44 ; https://github.com/danieldekay/tmd_core/issues/45

## Automated gates already present

- Mobile CI checks Svelte/TypeScript, runs the public API, pagination, native WordPress and cache-policy tests, validates the staging smoke-checker script, and builds the app.
- The production deploy job is restricted to main and repeats type checks, tests, smoke-runner syntax validation and build **before** Cloudflare Wrangler deploy. No direct push to main should bypass review.
- The backend draft PR checks PHP 8.4 syntax and runs targeted PHPUnit authorization and V4 discovery contract tests.
- These code tests cannot replace a deployed WordPress integration test. Do not merge and enable V4 based on green unit tests alone.

## Critical prerequisite: active V3 security patch

Before any V4 rollout, review and release [TMD Core hotfix PR #47](https://github.com/danieldekay/tmd_core/pull/47), tracked in [security issue #48](https://github.com/danieldekay/tmd_core/issues/48). A code-level review discovered that V3 interaction-list queries must be owner-scoped through the actual `get_query_args()` override called by `BaseController::get_items()`; merely patching `prepare_query()` does not change live collection results. The hotfix also removes the generic native WordPress REST exposure of private interactions and caps private collection page sizes.

Verify this with ordinary test accounts A and B using the real `/wp-json/tmd/v3/user-interactions?user_id=B` and `/wp-json/tmd/v3/me/interactions` routes, plus the native `/wp-json/wp/v2/user-interactions` route. Account A must never retrieve B's interaction rows. Do not record credentials or response bodies. Unit CI on the code does not establish live production remediation.

## 1. Read-only live API smoke test

Use a reachable HTTPS WordPress staging origin with V4 installed and published test data. In this branch:

    node scripts/smoke-public-api.mjs \
      --origin=https://STAGING_HOST \
      --client-origin=https://mobile.tangomarathons.com

After the workflow is merged into the default branch, GitHub Actions > Verify public WordPress API > Run workflow offers the same checks with explicit origins; it makes **read-only** anonymous requests and sends no bearer tokens.

The checker asserts:
- TMD V4 event listing supports start-date ordering and filtering; exposes array collection, total and page-count headers; detail uses a string title and nested meta.
- TMD V4 DJs, teachers and series collections have the V4 array/string DTO contract.
- Native WordPress posts/pages use title.rendered; media, categories, tags, types and taxonomies are reachable.
- CORS allows the mobile origin and exposes pagination headers to browsers.
- Anonymous TMD V4 user-interaction listing is rejected (401 or 403). Native WordPress user-interactions must not be anonymously accessible (401, 403 or hidden/404).
- Unexpected 401, 403, 404, HTML responses or unexposed CORS headers fail the public contract gate.

**Record** staging hostname, installed TMD Core commit/version, workflow URL, HTTP statuses, CORS headers and date. Do not publish sample private records in issue comments.

## 2. Authenticated WordPress security tests (manual, staging only)

Use separate test accounts A and B plus an editor. Verify public reads with no credentials: published/unprotected events work; unpublished, future, private and password-protected event direct IDs and relationships do not leak.

Verify account A can access only their own private bookmarks/interactions, not B's individual IDs or collection rows, including query-string author/status overrides. Test both custom TMD REST and native wp/v2 CPT routes. Confirm the correct HTTP status and absence of private notes. Verify editor access follows exact edit_post capability. Avoid placing personal interaction responses in SW/Cloudflare caches, including offline fallback.

Audit the TMD Core meta key allowlist and UserController separately; only published public content should enter anonymous caches.

## 3. V3-to-V4 parity comparison

For the same fixed 30- and 90-day event windows, compare V3 and V4:
- Published event IDs and counts, dates/order/filter boundaries, country/city; no silent truncation.
- Venue and geocoder decimal lat/lon including valid zero, date-only timezone stability, registration dates.
- DJs, teachers and series relationships; all editions of a series with page 2+ and historical IDs.
- WordPress editorial slugs and rendered HTML with mobile sanitization.
- REST status 401/403 must **not** silently trigger V3 fallback.

Store anonymized fixture samples, discrepancies and resolution links in issues #46, #52 and #54. Do not activate V4 while parity differences are unexplained.

## 4. Browser, app and PWA checks

With a separately built staging app and PUBLIC_TMD_USE_V4=true, test:
- Current, filtered and next-page events; deep links; changing filters mid-request; bookmark persistence.
- Map marker counts, decimal coordinates and malicious event title/city strings (must render as inert text).
- Calendar event coverage notice, date boundaries, registration date wording (start date does not prove registrations are open).
- Teacher and DJ profile links, event-series dated editions; WordPress blog/post/page UI, unsafe HTML/links, media alt text.
- iOS Safari and installed iOS PWA; Android Chrome/installed PWA; desktop Chrome/Firefox.
- Offline: public API cache only; auth/private API remains network-only. Validate old SW cache migration and upgrade prompt; reload **after** controllerchange.
- Cross-origin and public cache response variations; SW and index.html must not trap an installed app on stale content.
- Accessibility, navigation, error states and performance on slow/mobile networks.

## 5. Rollout and rollback

1. Get core security and discovery PR approved, merged and deployed to the target WordPress staging host.
2. Run smoke test and signed-off WordPress multi-user integration/security tests. Preserve actual run URL and credentials-free evidence.
3. Enable V4 **only for a staging app build**. PUBLIC_TMD_USE_V4=true is a build-time variable; wrangler.toml runtime vars are not sufficient to switch a compiled Vite client.
4. Complete parity/browser/offline tests, sign off WP HTML and consent, and verify no sensitive cache.
5. Deploy a production candidate with feature flag **off**. A separate reviewed deployment change is required before turning production V4 on.
6. Prepare rollback to last known-good assets and V3 API without losing saved local IDs. Verify SW cache/version recovery.
7. Only close rollout issues after production health and telemetry evidence exists.

**Do not** reclassify these as completed based solely on passing unit tests. Production cannot be validated from this repository branch alone.
