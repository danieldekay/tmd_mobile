# TMD Mobile V4 staging preview

This branch stages draft PR #55 **without** deploying the production Worker `tmd-mobile` or claiming `mobile.tangomarathons.com`.

The separate `tmd-mobile-v4-staging` Worker serves a static V4-enabled SvelteKit build. Build-time API URLs point only to `https://staging.tangomarathons.com/wp-json/tmd/v4`.

Workflow: `.github/workflows/deploy-v4-preview.yml`. A normal branch push only prepares the preview; deployment requires a commit message containing `[deploy-mobile-v4-staging]` (or an authorized manual action). The job first checks type safety, tests, Core staging V4 public REST responses and cross-origin CORS. It rejects any staging Wrangler config containing production routes.

Successful deployment should provide a Cloudflare workers.dev preview URL. That URL is not known in advance and must be obtained from the actual deployment output. CORS must then also be verified from that preview origin in a browser. No V4 production rollout is implied.

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
