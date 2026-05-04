## Context

TMD Core exposes DJs, teachers, and event series as separate post types via REST v3. Phase 1 already renders these relationships on event detail pages as text, but they are not yet navigable. TMD4 has a DJ directory (`/djs`) and series pages that tango travelers use to research events. The static SvelteKit build constrains all data fetching to client-side `onMount` calls.

## Goals / Non-Goals

**Goals:**

- `/djs` listing and `/djs/[id]` detail pages with connected upcoming events.
- `/event-series/[id]` detail with edition history.
- Teacher data shown where available (may be limited by TMD Core v3 teacher endpoint availability).
- Cross-links from existing event detail pages to DJ, teacher, and series routes.

**Non-Goals:**

- Teacher directory listing page (defer if teacher API is incomplete in v3).
- Organizer/admin relationship management.
- Authenticated favouriting of DJs or series (Phase 4).

## Decisions

**Decision: REST v3 first; introduce GraphQL if round-trips exceed three per page**

DJ detail requires the DJ record plus their connected events. If v3 supports an `?include=events` or embedded resource param this stays as one REST call. If not, a second call to `/events?dj_id={id}` is acceptable. A third round-trip (e.g., series nested inside DJ inside event) is the threshold for switching the detail page to a GraphQL query.

**Decision: Teacher route deferred if endpoint unconfirmed**

Teachers are implemented only if `/wp-json/tmd/v3/teachers` or equivalent exists and returns usable data. Otherwise the teacher names on event detail remain non-linked text in Phase 3.

**Decision: Shared `EntityCard` component pattern**

DJ cards and event series summaries share enough structure (name, metadata, image, action link) to warrant a reusable card component. Extract from the event card pattern established in Phase 1.

## Risks / Trade-offs

- **API endpoint availability** → DJ and series REST endpoints may not be fully implemented in v3 yet. Confirm locally before building the client.
- **Connected-events overfetching** → Fetching all events to find those related to a DJ is expensive. Use a dedicated `?dj_id=` filter param if available; otherwise limit to a preview count.
- **Teacher data completeness** → Teacher records may have sparse data (no image, no bio). The UI must degrade gracefully to name-only display.

## Open Questions

- Does TMD Core v3 expose `/tmd/v3/djs`, `/tmd/v3/teachers`, and `/tmd/v3/event-series`?
- Is there a `?dj_id=` or `?teacher_id=` filter on the events endpoint for connected-event lists?
- Does GraphQL via WPGraphQL expose DJ and series relationships on event nodes?
