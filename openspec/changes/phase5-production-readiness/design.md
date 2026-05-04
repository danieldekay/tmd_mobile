## Context

The app builds and deploys to Cloudflare Worker Assets in CI, but the production domain is unbound and CORS is unconfirmed for the mobile origin. TMD Core REST v3 CORS settings were configured for TMD4's domain; a new mobile origin must be explicitly allowed. Analytics and monitoring are deferred until consent copy is settled and the domain is live.

## Goals / Non-Goals

**Goals:**

- Live `mobile.tangomarathons.com` domain bound to the `tmd-mobile` Cloudflare Worker service.
- Confirmed CORS for the production mobile origin in TMD Core.
- GitHub Actions deployment validated end-to-end with `CLOUDFLARE_API_TOKEN`.
- Consent-aware analytics added and validated.
- Production smoke-test checklist in `DEPLOY.md`.

**Non-Goals:**

- Redesigning the deployment architecture (stays Cloudflare Worker Assets).
- Adding auth or user accounts (Phase 6).
- Multi-region edge caching (can be added as a Cloudflare config change independently).

## Decisions

**Decision: Matomo for analytics if self-hosted instance is available**

TMD already has infrastructure; a Matomo site can be created without third-party data sharing. If unavailable, defer analytics rather than use Google Analytics.

**Decision: Uptime monitoring via Cloudflare Health Checks or UptimeRobot free tier**

Simple HTTP health check on the root URL. No custom monitoring infrastructure needed for Phase 5.

**Decision: CORS confirmed by TMD Core plugin/filter, not by a proxy**

The correct fix is to update TMD Core's CORS allowed origins list (via filter or plugin config) rather than routing mobile traffic through a Cloudflare proxy that strips the origin.

## Risks / Trade-offs

- **CORS misconfiguration blocks production launch** → Test CORS from `mobile.tangomarathons.com` against the production TMD Core before declaring Phase 5 done.
- **Analytics without consent copy** → Do not activate analytics until privacy notice is written and reviewed.
- **DNS propagation delay** → Allow 24–48 hours after DNS change before treating the domain as stable.

## Open Questions

- Is a self-hosted Matomo instance available for the TMD organisation?
- Who owns the DNS zone for `tangomarathons.com` and can add the subdomain record?
- Does TMD Core's CORS plugin allow per-origin configuration via wp-config or a filter?
