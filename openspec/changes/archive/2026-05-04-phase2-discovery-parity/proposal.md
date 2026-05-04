## Why

Phase 1 delivers a functional event list and detail view, but users have no way to filter events by country, city, date, or registration state, and no way to scan events spatially or temporally. These discovery tools are the most-used features of the TMD4 event archive and are essential for tango travelers who browse by region or travel window.

## What Changes

- Add country, city, month/date range, and registration-state filter controls to the `/events` route.
- Implement `/calendar` route: agenda view combining event dates and registration-opening dates.
- Implement `/map` route: consent-aware map showing events with location data.
- Extend the TMD Core v3 API client to pass filter parameters to the events endpoint.
- Ensure filter state is reflected in the URL query string for shareability and back-navigation.

## Capabilities

### New Capabilities

- `event-filters`: Country, city, month/date-range, and registration-state filter controls on the event list.

### Modified Capabilities

- `event-browsing`: Filter controls modify the existing event list behaviour — adds new filtering scenarios.
- `calendar-map`: Existing spec describes intent; this change implements both routes with concrete interaction and data requirements.

## Impact

- **Routes**: `src/routes/events/+page.svelte` (add filter controls), `src/routes/calendar/+page.svelte`, `src/routes/map/+page.svelte`
- **API module**: `src/lib/api/tmd.ts` — add filter query params to `getEvents()`
- **Types**: filter parameter types, normalised location type for map markers
- **Navigation**: layout nav updated to include `/calendar` and `/map`
- **Map provider**: choice of Leaflet + OpenStreetMap affects CSP headers in `wrangler.toml`
- **Access level**: fully public, no authentication required
- **CORS**: no new CORS implications beyond Phase 1; tile server requests are cross-origin but initiated by Leaflet
