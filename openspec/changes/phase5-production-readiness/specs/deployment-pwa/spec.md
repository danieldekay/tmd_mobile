## MODIFIED Requirements

### Requirement: Cloudflare Worker Assets Deployment
The app SHALL deploy as a static SvelteKit build served by Cloudflare Worker Assets at `mobile.tangomarathons.com` via the `tmd-mobile` Worker service. Direct route loads SHALL resolve via the SPA fallback. The deployment SHALL be fully automated via GitHub Actions using a stored `CLOUDFLARE_API_TOKEN`.

#### Scenario: Direct route load
- **GIVEN** the app is deployed to `mobile.tangomarathons.com`
- **WHEN** a user opens any app route directly (e.g., `/events/123`)
- **THEN** Worker Assets serves the SPA fallback and the route renders client-side

#### Scenario: Automated deployment succeeds
- **GIVEN** `CLOUDFLARE_API_TOKEN` is stored in GitHub Actions secrets
- **WHEN** a commit is pushed to the deployment branch
- **THEN** the GitHub Actions workflow runs `wrangler deploy` and completes without errors

#### Scenario: Production smoke test passes
- **GIVEN** the deployment has completed
- **WHEN** the operator follows `DEPLOY.md` and opens `https://mobile.tangomarathons.com/events`
- **THEN** the event list loads data from the production TMD Core API

### Requirement: Pending Domain Setup
**Reason**: Domain is now live; this placeholder requirement is superseded by the confirmed deployment requirement above.

**Migration**: Remove this requirement from the canonical spec after Phase 5 is archived.
