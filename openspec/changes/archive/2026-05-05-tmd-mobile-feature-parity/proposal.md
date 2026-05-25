# Proposal: TMD Mobile Feature Parity Foundation

## Why

The Tango Marathon Directory currently has its core data and workflows in TMD Core and its public browsing experience in TMD4. A dedicated mobile PWA should make the same event discovery workflows fast, touch-friendly, installable, and deployable independently from the WordPress theme.

## What Changes

- Establish TMD Mobile as a SvelteKit 5 / Svelte 5 static PWA.
- Use TMD Core REST v3 as the default API source.
- Preserve the RNT mobile deployment mechanism with Cloudflare Worker Assets.
- Define feature parity phases for events, calendar, map, DJs, teachers, event series, saved events, and production deployment.
- Prepare `tmd-mobile` as the Cloudflare Worker service name.
- Document that `mobile.tangomarathons.com` is pending Cloudflare DNS and routing.

## User-Visible Outcome

Users eventually get a mobile-first app for browsing tango marathon events, seeing registration timing, scanning locations, opening event detail pages, and exploring DJs, teachers, and event series. The initial foundation already renders a TMD-branded app shell and attempts a live TMD Core event preview.

## Scope

In scope:

- public event browsing plan
- event detail plan
- calendar and map plan
- DJ, teacher, and series plan
- deployment setup plan
- OpenSpec artifacts for future implementation

Out of scope for the foundation:

- authenticated user accounts
- organizer/admin workflows
- AI import/enrichment controls
- production DNS activation
- final visual design system beyond a functional shell

## Impact

- App routes: `/`, `/events`, `/calendar`, `/map`, `/djs`, `/settings`
- API module: `src/lib/api/tmd.ts`
- Deployment files: `wrangler.toml`, `worker.ts`, `.github/workflows/*`
- Documentation: `docs/analysis`, `docs/roadmap`, `DEPLOY.md`

## Risks

- TMD Core endpoint response shape may differ between local and production environments.
- CORS may need explicit mobile domain support.
- Map provider choice affects CSP, privacy consent, cost, and parity with TMD4.
- OpenSpec slash command integration depends on IDE support even though the npm CLI is installed.
