# Spec: Deployment and PWA

## Requirement: Cloudflare Worker Assets Deployment

The app SHALL deploy as a static SvelteKit build served by Cloudflare Worker Assets.

### Scenario: Direct route load

- GIVEN the app is deployed
- WHEN a user opens `/calendar` directly
- THEN Worker Assets serves the SPA fallback and the route renders client-side

## Requirement: Pending Domain Setup

The app SHALL document that `mobile.tangomarathons.com` is not configured yet.

### Scenario: Operator prepares production

- GIVEN the domain is added to Cloudflare
- WHEN the operator follows `DEPLOY.md`
- THEN they can attach the route to Worker `tmd-mobile` and validate production smoke tests
