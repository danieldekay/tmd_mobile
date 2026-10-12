# TMD Mobile V4 staging preview

This branch stages draft PR #55 **without** deploying the production Worker `tmd-mobile` or claiming `mobile.tangomarathons.com`.

The separate `tmd-mobile-v4-staging` Worker serves a static V4-enabled SvelteKit build. Build-time API URLs point only to `https://staging.tangomarathons.com/wp-json/tmd/v4`.

Workflow: `.github/workflows/deploy-v4-preview.yml`. A normal branch push only prepares the preview; deployment requires a commit message containing `[deploy-mobile-v4-staging]` (or an authorized manual action). The job first checks type safety, tests, Core staging V4 public REST responses and cross-origin CORS. It rejects any staging Wrangler config containing production routes.

Successful deployment should provide a Cloudflare workers.dev preview URL. That URL is captured from the actual Wrangler deployment output. The same deploy workflow then runs the deployed-app smoke test from that real preview origin. No V4 production rollout is implied.

Do not merge/enable production V4 or modify the production Worker until Core staging privacy/CORS checks and browser-level PWA validation pass.

## Staging Core verification and preview trigger

Core V4 staging deployment [#38292089269](https://github.com/danieldekay/tmd_core/actions/runs/38292089269) passed its security, build, upload, exact-SHA and anonymous public/private endpoint checks at commit `ca807cd29eaf4d14c01aad3753b0f14da0bba8cc`.

The separate mobile preview deploy is now eligible to run after its additional WordPress Core/CORS contract tests. It is still not a production V4 rollout.

## Verification and missing GitHub credential — 2026-10-12

- Core V4 staging deployment [38292089269](https://github.com/danieldekay/tmd_core/actions/runs/38292089269) passed, including public route/private-route checks and exact SHA marker `ca807cd29eaf`.
- The Mobile preview's stronger public API/CORS job passed **14/14** checks in [run 38293707816](https://github.com/danieldekay/tmd_mobile/actions/runs/38293707816); the V4-enabled SvelteKit static build also passed.
- Cloudflare deployment **did not run successfully**, because the job had an empty `CLOUDFLARE_API_TOKEN`. No Worker URL exists yet.
- The `staging` GitHub Environment (or repository Actions secrets) in `danieldekay/tmd_mobile` must contain `CLOUDFLARE_API_TOKEN` with narrowly scoped Cloudflare Workers deployment privileges. Do not add the token to source, logs, an issue, or this chat.
- The workflow now checks for this token before any expensive build. Once it is configured, trigger a new `staging/mobile-v4-preview` commit whose message includes `[deploy-mobile-v4-staging]`.
- Staging content is sparse: 5 events, 1 series, and 0 DJs / 0 teachers. Populate disposable published DJ and teacher fixtures before signing off UI data mapping.
- After the Worker deployment, inspect its actual `workers.dev` URL and test the installed PWA, offline caching, network fallback, browser-origin CORS, and navigation. Production V4 remains disabled.

## Deployed preview app smoke gate

After the Cloudflare staging Worker exists, the deploy workflow automatically runs `npm run smoke:preview` against the actual `workers.dev` origin detected from Wrangler output. A separate manual workflow, `.github/workflows/smoke-v4-preview-app.yml`, remains available for reruns.

The deployed-app smoke gate checks, without credentials:

- the root app shell and SPA routes `/events`, `/calendar`, `/map` and `/blog` return HTML;
- `manifest.json` is parseable and installable (`display=standalone`, `start_url=/`);
- `service-worker.js` is reachable, not long-cacheable, and contains the TMD public API cache markers;
- static security headers include `nosniff`, frame denial and CSP `connect-src` for staging;
- the deployed preview origin can read `https://staging.tangomarathons.com/wp-json/tmd/v4/events` with usable browser CORS for the preview origin itself;
- the script refuses to run against `mobile.tangomarathons.com` unless explicitly overridden, so it is not accidentally used as a production validation.

Example local/manual command:

```bash
npm run smoke:preview -- \
  --url=https://tmd-mobile-v4-staging.<account>.workers.dev \
  --api-origin=https://staging.tangomarathons.com
```

This is still not enough for production cutover. A real browser pass is still required for install/update behavior, offline fallback and visible UI mapping with non-empty DJ and teacher fixtures.
