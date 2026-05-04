# Phase 1 Public Event Parity

## Why

TMD Mobile has its app shell and Cloudflare deployment scaffold in place, but it lacks any real public event browsing experience. Users opening the app see a placeholder; they need a functional upcoming-event list, event detail pages, and proper loading/error/offline states to replace the TMD4 WordPress frontend for mobile discovery.

## What Changes

- Implement `/events` route: paginated list of upcoming tango marathon events.
- Implement `/events/[id]` route: full event detail page with dates, location, registration links, contact, website/social links, and feature badges.
- Stabilise the TMD Core v3 REST DTO types for event list and event detail responses.
- Add loading, empty, error, and offline UI states for both routes.
- Add navigation between event list and event detail.
- Register event-browsing and event-detail routes in the SvelteKit router.

## Capabilities

### New Capabilities

- `event-list`: Paginated upcoming-event list view at `/events`, consuming TMD Core v3 `/tmd/v3/events`.
- `event-detail`: Event detail page at `/events/[id]`, consuming TMD Core v3 `/tmd/v3/events/{id}`.

### Modified Capabilities

- `event-browsing`: Existing spec covers discovery intent; this change now realises the browsing list UI and DTO contract.
- `event-detail`: Existing spec defines detail-page requirements; this change implements the route and data layer.

## Impact

- **Routes**: `src/routes/events/+page.svelte`, `src/routes/events/[id]/+page.svelte`
- **API module**: `src/lib/api/tmd.ts` — add `getEvents()` and `getEvent(id)` functions with proper DTO typing
- **Types**: `src/lib/types.ts` — add or refine `TmdEvent`, `TmdEventList`, `TmdEventDetail` types
- **Navigation**: update layout or nav component to link to `/events`
- **API**: TMD Core v3 `/wp-json/tmd/v3/events` and `/wp-json/tmd/v3/events/{id}`
- **Access level**: fully public, no authentication required
- **CORS**: TMD Core must allow requests from `mobile.tangomarathons.com` (and `localhost` in dev)
