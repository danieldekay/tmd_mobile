# Cloudflare Route Requirements

Date: 2026-05-01

## Current Status

The app is configured for Cloudflare Worker Assets with Worker service name `tmd-mobile`. The intended custom domain `mobile.tangomarathons.com` is not configured yet.

## Requirements To Go Live

1. Cloudflare zone access for `tangomarathons.com`.
2. Worker service `tmd-mobile` deployed from this repository.
3. DNS record or Worker route for `mobile.tangomarathons.com`.
4. GitHub repository secret `CLOUDFLARE_API_TOKEN` with Workers deploy permissions.
5. TMD Core CORS policy allowing `https://mobile.tangomarathons.com`.
6. TMD Core public-read or JWT-backed API contract for `/wp-json/tmd/v3/events` and detail endpoints.
7. CSP update if map tiles, analytics, or media providers change.

## Verification Checklist

```bash
nvm use
npm run check
npm run build
npx wrangler deploy --message "Manual deploy"
```

After deploy:

- Open the worker.dev URL.
- Open `/events`, `/calendar`, `/map`, `/djs`, and `/settings` directly.
- Confirm the TMD Core API preview either loads events or shows the known auth/CORS message.
- Attach `mobile.tangomarathons.com` and repeat direct-route smoke tests.

## Known Blocker

Production TMD Core currently returns `401 rest_not_logged_in` for anonymous v3 event requests. Public mobile browsing requires a backend policy decision before live users can see event data.
