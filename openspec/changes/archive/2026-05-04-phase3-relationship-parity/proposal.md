## Why

After Phase 2, users can find and filter events, but the people and series behind those events are not yet browsable. DJs, teachers, and event series are first-class entities in TMD Core and key decision factors for tango travelers choosing which marathons to attend. Implementing these relationship views closes the parity gap with TMD4's DJ directory and event series pages.

## What Changes

- Implement `/djs` route: browsable DJ directory with name, location metadata, and links.
- Implement `/djs/[id]` route: DJ detail page with profile info and upcoming connected events.
- Implement `/event-series/[id]` route: series detail page with metadata and edition history.
- Add teacher browsing where teacher data is available from TMD Core v3.
- Link event detail pages (Phase 1) to their connected DJs, teachers, and series.
- Extend the API client with `getDjs()`, `getDj(id)`, `getEventSeries(id)` functions.

## Capabilities

### New Capabilities

- `dj-directory`: DJ list at `/djs` and DJ detail at `/djs/[id]` with connected events.
- `event-series-detail`: Event series page at `/event-series/[id]` with edition history.

### Modified Capabilities

- `relationship-browsing`: Existing spec covers DJ and series intent; this change adds teacher browsing and cross-links from event detail.
- `event-detail`: Event detail pages must now link to DJ, teacher, and series detail routes.

## Impact

- **Routes**: `src/routes/djs/+page.svelte`, `src/routes/djs/[id]/+page.svelte`, `src/routes/event-series/[id]/+page.svelte`
- **API module**: `src/lib/api/tmd.ts` — add `getDjs()`, `getDj(id)`, `getEventSeries(id)`
- **Types**: `TmdDj`, `TmdDjDetail`, `TmdEventSeries` in `src/lib/types.ts`
- **Cross-links**: `src/routes/events/[id]/+page.svelte` — DJ, teacher, series links
- **API**: TMD Core v3 `/wp-json/tmd/v3/djs`, `/wp-json/tmd/v3/djs/{id}`, `/wp-json/tmd/v3/event-series/{id}` (endpoints to be confirmed)
- **Access level**: fully public, no authentication required
- **GraphQL consideration**: if nested connected-events data requires multiple REST round-trips, GraphQL may reduce overfetching here
