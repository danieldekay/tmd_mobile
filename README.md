# TMD Mobile

Mobile-first SvelteKit PWA for The Tango Marathon Directory. This project was bootstrapped from the RNT mobile deployment pattern, then reset for TMD Core data and TMD4 feature parity planning.

## Current State

- SvelteKit 5 / Svelte 5 app shell
- TMD Core v3 API preview client
- Cloudflare Worker Assets deployment config for `tmd-mobile`
- OpenSpec artifacts for feature parity phases
- Documentation based on TMD Core and TMD4 analysis

## Development

```bash
nvm use
npm install
npm run dev
npm run check
npm run build
```

## Configuration

Copy `.env.example` to `.env` when you need local overrides.

```bash
PUBLIC_TMD_API_BASE_URL=http://localhost:10014/wp-json/tmd/v3
```

The production default is:

```text
https://www.tangomarathons.com/wp-json/tmd/v3
```

### Server sync (optional)

Set `VITE_ENABLE_SERVER_SYNC=true` in `.env.development` to enable JWT-authenticated
features: login/logout and server-side saved-events sync. Requires a local WordPress
site with WPGraphQL + JWT Authentication for WP-GraphQL installed.

When disabled (the default), all saves are stored in `localStorage` only.

## Documentation

- [docs/analysis/tmd-core-tmd4-analysis.md](docs/analysis/tmd-core-tmd4-analysis.md)
- [docs/roadmap/feature-parity-plan.md](docs/roadmap/feature-parity-plan.md)
- [docs/deployment/cloudflare-route-requirements.md](docs/deployment/cloudflare-route-requirements.md)
- [docs/decisions/map-provider.md](docs/decisions/map-provider.md)
- [DEPLOY.md](DEPLOY.md)
- [openspec/changes/tmd-mobile-feature-parity/proposal.md](openspec/changes/tmd-mobile-feature-parity/proposal.md)

## Deployment

The app is prepared for Cloudflare Worker Assets under service name `tmd-mobile`. The intended custom domain is `mobile.tangomarathons.com`, but DNS and Worker routing are not configured yet.

Production TMD Core currently returns `401 rest_not_logged_in` for anonymous v3 event requests. Public mobile browsing needs a public-read or JWT-backed API contract before launch.

## OpenSpec

OpenSpec is installed as a dev dependency via `@fission-ai/openspec`. Use the checked-in artifacts as the first feature parity proposal.

```bash
npm run openspec -- --help
npm run openspec:update
```
