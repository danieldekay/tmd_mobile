## Why

Phases 1–3 build the full public browsing experience. Phase 5 makes that experience production-ready: the domain is live, CORS is confirmed, analytics are in place, and the Cloudflare deployment is validated end-to-end. Without this phase the app exists only on localhost and has no production smoke-test baseline.

## What Changes

- Add `mobile.tangomarathons.com` DNS entry and Cloudflare Worker route.
- Confirm TMD Core CORS policy allows requests from the mobile domain.
- Add `CLOUDFLARE_API_TOKEN` to GitHub Actions secrets and validate the deployment workflow.
- Add privacy-respecting analytics (Matomo or similar) after consent copy is settled.
- Add uptime/error monitoring.
- Complete the production release checklist in `DEPLOY.md`.

## Capabilities

### New Capabilities

- `analytics-monitoring`: Consent-aware analytics and uptime monitoring for production.

### Modified Capabilities

- `deployment-pwa`: The pending-domain placeholder is replaced with a live domain, confirmed CORS, and a full deployment validation procedure.

## Impact

- **Cloudflare**: DNS A/CNAME record, Worker route binding for `tmd-mobile`
- **GitHub Actions**: `CLOUDFLARE_API_TOKEN` secret, validated `wrangler deploy` step
- **TMD Core**: CORS `allowed_origins` must include `https://mobile.tangomarathons.com`
- **Analytics**: Matomo site configuration; `src/lib/analytics.ts` or equivalent
- **Documentation**: `DEPLOY.md` updated with production checklist
- **Access level**: infrastructure change, no new user-facing authentication required
