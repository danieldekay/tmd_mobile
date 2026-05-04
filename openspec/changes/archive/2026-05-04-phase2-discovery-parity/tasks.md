# Tasks: Phase 2 — Discovery Parity

## 1. API Client Filter Support

- [x] 1.1 Audit TMD Core v3 `/events` endpoint for supported filter params (country, city, after, before, status)
- [x] 1.2 Extend `getEvents()` in `src/lib/api/tmd.ts` to accept and forward filter params as query strings
- [x] 1.3 Add `TmdEventFilters` type to `src/lib/types.ts` (country, city, dateAfter, dateBefore, registrationState)
- [x] 1.4 Add normalised location/coordinate type to `src/lib/types.ts` for map marker use

## 2. Event List Filters

- [x] 2.1 Add filter bar component to `src/routes/events/+page.svelte` with country, city, date-range, and registration-state controls
- [x] 2.2 Sync active filter state to URL query params using `$page.url.searchParams`
- [x] 2.3 Read initial filter state from URL query params on mount to restore shared/bookmarked URLs
- [x] 2.4 Add clear/reset control that removes all active filters and updates the URL
- [x] 2.5 Show a filtered-empty state when no events match active filters (distinct from global empty state)

## 3. Calendar Route

- [x] 3.1 Implement `src/routes/calendar/+page.svelte` fetching events via `getEvents()`
- [x] 3.2 Group events by month in an agenda layout with event-start and registration-opening dates distinguished
- [x] 3.3 Add loading skeleton and empty state for the calendar view
- [x] 3.4 Link each agenda entry to `/events/[id]`

## 4. Map Route

- [x] 4.1 Install `leaflet` and `@types/leaflet` npm packages
- [x] 4.2 Implement `src/routes/map/+page.svelte` with Leaflet map initialised in `onMount`
- [x] 4.3 Place event markers for events with valid location data; omit events without coordinates gracefully
- [x] 4.4 Add tap-to-detail navigation from map marker popups to `/events/[id]`
- [x] 4.5 Add loading state before map initialises and fallback message when OSM tiles are unavailable
- [x] 4.6 Update CSP headers in `wrangler.toml` to allow Leaflet tile requests (`img-src`, `connect-src` for `*.tile.openstreetmap.org`)

## 5. Navigation

- [x] 5.1 Add `/calendar` and `/map` links to the main layout navigation component

## 6. Validation

- [x] 6.1 Run `npx @sveltejs/mcp svelte-autofixer` on all changed `.svelte` files
- [x] 6.2 Run `npm run check` and fix all TypeScript errors
- [x] 6.3 Run `npm run build` and confirm static output is generated without errors
