# TMD Mobile Feature Parity Plan

Date: 2026-05-01

## Goal

Build a mobile-first PWA that gives tango travelers the core Tango Marathon Directory experience without requiring the WordPress theme frontend. TMD Core remains the canonical backend; TMD4 remains the parity reference for public browsing behavior.

## Assumptions

- Public browsing is anonymous.
- TMD Core REST v3 is the initial API contract.
- GraphQL can be introduced for relationship-heavy screens later.
- Cloudflare Worker Assets is the deployment target.
- `mobile.tangomarathons.com` is pending Cloudflare DNS and Worker routing.

## Phase Timeline

| Phase | Window | Outcome | Main Deliverables |
| --- | --- | --- | --- |
| 0 | Week 0 | Project foundation | SvelteKit scaffold, Worker config, OpenSpec, docs, initial git repo |
| 1 | Weeks 1-2 | Public event parity | Event list, event detail, registration links, loading/error states |
| 2 | Weeks 3-4 | Discovery parity | Filters, calendar, map, country/city browsing |
| 3 | Weeks 5-6 | Relationship parity | DJs, teachers, event series, connected event lists |
| 4 | Weeks 7-8 | Personal utility | Saved events, reminders, offline-friendly cache, install/update polish |
| 5 | Weeks 9-10 | Production readiness | Cloudflare domain, CORS confirmation, analytics, monitoring, release checklist |
| 6 | Later | Auth/admin expansion | JWT auth, user dashboard, import/enrichment status views if needed |

## Phase 0: Foundation

- Copy RNT deployment scaffold.
- Reset app source to TMD-branded shell.
- Add TMD Core API preview client.
- Install OpenSpec tooling.
- Write analysis and feature parity proposal docs.
- Initialize a new git repository.

## Phase 1: Public Event Parity

User-visible features:

- Upcoming event list
- Event detail route
- Date range and registration start display
- Location, venue, contact links, website/social links
- Feature badges for major event flags
- Empty, loading, API error, and offline states

Technical work:

- Stabilize DTOs for TMD Core event responses.
- Confirm endpoint filtering semantics.
- Decide REST relationship embedding versus follow-up detail requests.
- Add tests or fixture-driven validation for response normalization.

## Phase 2: Discovery Parity

User-visible features:

- Country and city filters
- Month/weekend/date filters
- Category/type and registration-state filters
- Calendar agenda
- Map discovery

Technical work:

- Add query-state handling for filters.
- Confirm map provider and CSP requirements.
- Confirm CORS and tile/provider consent behavior.

## Phase 3: Relationship Parity

User-visible features:

- DJ directory
- DJ detail pages with connected events
- Teacher browsing where data is available
- Event series pages with edition history

Technical work:

- Add TMD Core clients for DJs, teachers, and series.
- Use relationship includes or GraphQL for nested data.
- Define canonical route naming for entities.

## Phase 4: Personal Utility

User-visible features:

- Saved events
- Registration reminders
- Offline-friendly recent data
- Better PWA install/update prompts

Technical work:

- Add local persistence with explicit consent boundaries.
- Consider background sync limitations for browser PWAs.
- Avoid storing sensitive auth data until auth requirements are explicit.

## Phase 5: Production Readiness

- Add `mobile.tangomarathons.com` in Cloudflare.
- Attach route to Worker `tmd-mobile`.
- Add `CLOUDFLARE_API_TOKEN` in GitHub Actions.
- Confirm TMD Core CORS for mobile origin.
- Add analytics only after privacy/consent copy is settled.
- Run build, smoke tests, and deployment validation.

## Phase 6: Auth and Admin Expansion

This phase should not begin until public parity is stable. Candidate features:

- WordPress/JWT login
- saved server-side preferences
- importer session overview
- AI enrichment status dashboards
- organizer/admin tools

## Open Questions

- Event-location API shape for Leaflet/OpenStreetMap map markers.
- API contract: REST v3 only, or GraphQL for details and relationships?
- Languages: English-first, German-first, or localized content from WordPress?
- Legal pages: in-app mirrored pages or links to canonical tangomarathons.com pages?
- Analytics: Matomo site ID and consent copy for TMD Mobile.
