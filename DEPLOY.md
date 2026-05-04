# TMD Mobile Deployment Guide

## Overview

This repository is prepared for Cloudflare Worker Assets. It mirrors the RNT mobile deployment mechanism, but uses the Worker service name `tmd-mobile`.

The intended public route is:

```text
https://mobile.tangomarathons.com
```

This domain is not available in Cloudflare yet, so production routing is documented but not complete.

## Source Of Truth

Deployment configuration lives in:

- `.github/workflows/deploy.yml`
- `wrangler.toml`
- `worker.ts`

Current Wrangler setup:

```toml
name = "tmd-mobile"
main = "./worker.ts"
compatibility_date = "2024-01-01"
keep_vars = true

[assets]
directory = "./build"
not_found_handling = "single-page-application"
```

`keep_vars = true` is intentional so dashboard-managed environment variables survive deploys.

## Required GitHub Secret

Add this repository secret before enabling production deploys:

```text
CLOUDFLARE_API_TOKEN
```

The token must be able to deploy Workers.

## Domain Setup Still Pending

When `mobile.tangomarathons.com` is ready in Cloudflare:

1. Add the DNS record or Worker route for `mobile.tangomarathons.com`.
2. Attach the route to the `tmd-mobile` Worker.
3. Confirm the TMD Core API allows requests from the mobile origin.
4. Update this document with the final Cloudflare route details.

See [docs/deployment/cloudflare-route-requirements.md](docs/deployment/cloudflare-route-requirements.md) for the full readiness checklist.

## API Access Blocker

Anonymous production requests to `/wp-json/tmd/v3/events` currently return `401 rest_not_logged_in`. The mobile app can deploy before that is fixed, but public event browsing will show the graceful API access message until TMD Core exposes published event reads publicly or a JWT-backed mobile access flow exists.

## Local Validation

```bash
nvm use
npm install
npm run check
npm run build
```

Build output is written to `build/`.

## Manual Deploy

```bash
npm run build
npx wrangler deploy --message "Manual deploy"
```

## Smoke Test After Deploy

1. Open the worker.dev URL or custom domain.
2. Confirm the home screen renders.
3. Confirm `/events`, `/calendar`, `/map`, `/djs`, and `/settings` load directly.
4. Confirm the TMD Core preview either loads events or shows a clear API/CORS error.
5. Confirm browser console has no runtime errors.

## Notes

- Hosting uses Worker Assets, not Cloudflare Pages.
- The app is a static SvelteKit build with SPA fallback behavior.
- Runtime API base can be overridden locally with `PUBLIC_TMD_API_BASE_URL`.
