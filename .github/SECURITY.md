# Security Notes

## External Services

- TMD Core REST API: public read paths under `/wp-json/tmd/v3`.
- Optional local development API: `http://localhost:10014/wp-json/tmd/v3`.
- Cloudflare Worker Assets: static asset hosting and SPA fallback.

## Current Risk Boundaries

- No secrets are stored in client-side code.
- `PUBLIC_*` values are public and may be embedded in the client bundle.
- The Worker currently serves assets only and does not proxy privileged requests.
- Authenticated or admin-facing TMD Core features must use explicit permission checks and must not be exposed until the backend contract is reviewed.

## Before Production

- Confirm CORS policy for `mobile.tangomarathons.com`.
- Add a Cloudflare deployment token as `CLOUDFLARE_API_TOKEN`.
- Review CSP in `static/_headers` after final map and analytics providers are chosen.
- Add monitoring for build and deployment failures.
