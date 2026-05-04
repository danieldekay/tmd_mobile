## Context

After Phase 1 users can browse and read events but cannot narrow results. TMD4's event archive is the parity reference: it offers country/city dropdowns, date pickers, and a registration-state toggle. A calendar view helps tango travelers plan by month; a map view surfaces geographic clusters at a glance. The static SvelteKit build means all filter state must live in URL query params or local reactive state — no server-side rendering is available.

## Goals / Non-Goals

**Goals:**

- Country, city, month/date-range, and registration-state filters on the event list, synced to URL query params.
- `/calendar` agenda view driven by the same event data, showing event and registration dates.
- `/map` consent-aware map using Leaflet and OpenStreetMap tiles.
- All views handle loading, empty, error, and offline states.

**Non-Goals:**

- Server-side filtering or pagination cursor management (REST v3 handles server-side filtering via query params).
- Advanced filter combinations beyond the TMD4 parity set.
- Authenticated or saved-filter preferences (Phase 4).
- Map clustering or advanced spatial features.

## Decisions

**Decision: URL query params for filter state**

Filters must survive page refreshes and be shareable via URL. SvelteKit's `$page.url.searchParams` provides a reactive, URL-synced store that works with `adapter-static`.

**Decision: Leaflet + OpenStreetMap for map**

OpenStreetMap tiles are free, privacy-respecting, and avoid API key management. Leaflet is a well-established lightweight map library. The only consent requirement is a brief attribution note — no cookie consent needed for OSM tiles.

**Decision: Agenda layout for calendar, not grid calendar**

A scrollable agenda grouped by month is better suited to a narrow mobile viewport than a traditional calendar grid. It reuses the event card component from Phase 1 and adds date grouping headers.

**Decision: Filter params forwarded to TMD Core v3**

Country/city filters will be sent as query params to `/wp-json/tmd/v3/events` if supported; otherwise filtered client-side from a full fetch. Confirm v3 support before implementation.

## Risks / Trade-offs

- **Map CSP requirements** → Leaflet tile requests need `img-src` and `connect-src` CSP entries. Update `wrangler.toml` Content-Security-Policy header.
- **Client-side filter fallback** → If v3 does not support server-side country/city filtering, all events must be fetched first; large datasets may slow the filter UX on mobile.
- **Geocoding availability** → Not all TMD events have coordinates. Map markers fall back to city-level geocoding or are omitted when location data is insufficient.

## Open Questions

- Does `/wp-json/tmd/v3/events` accept `country`, `city`, `after`, `before`, or `status` query params?
- What location fields does the event API return — lat/lng, city string, or a structured venue object?
- Should the calendar show only event-start dates or also registration-opening dates?
