# Phase 1 Public Event Parity Design

## Context

TMD Mobile has a working SvelteKit/Svelte 5 scaffold and Cloudflare Worker Assets deployment pipeline. The app currently renders a branded shell but has no real data routes. TMD Core REST v3 is live at `/wp-json/tmd/v3/events` and `/wp-json/tmd/v3/events/{id}`. The existing `src/lib/api/tmd.ts` already includes a preview client; it needs to be stabilised into production-ready API functions with proper DTO typing.

## Goals / Non-Goals

**Goals:**

- Deliver `/events` (event list) and `/events/[id]` (event detail) as functional, accessible, mobile-first Svelte 5 routes.
- Type the TMD Core v3 response shapes fully in `src/lib/types.ts`.
- Handle all five UI states: loading, success, empty, error, and offline.
- Link list and detail pages via the existing layout navigation.

**Non-Goals:**

- Filter/search UI (Phase 2).
- Calendar and map views (Phase 2).
- DJ, teacher, or series relationship pages (Phase 3).
- Saved-event persistence (Phase 4).
- Authentication or admin views (Phase 6).

## Decisions

### Decision: REST v3 Only, No GraphQL For Phase 1

TMD Core v3 REST exposes `/events` and `/events/{id}` with sufficient data. GraphQL would reduce overfetching for relationship-heavy detail views but adds boot complexity. Defer until Phase 3 when nested DJ/teacher/series data makes it worthwhile.

### Decision: Client-Side Data Fetching With `onMount`

The deployment target is `adapter-static` with `ssr = false`. All data fetching happens in the browser via `onMount` + `fetch`. No SvelteKit `load()` server functions.

### Decision: Normalise API Response Into A Typed Local DTO

The raw TMD Core response is wide and has optional fields. A thin normalisation function (`normalizeTmdEvent`) converts the raw response to a local `TmdEventSummary` / `TmdEventDetail` type to isolate consumers from API shape changes.

### Decision: Tailwind CSS 4 For Styling; No New Component Library

Continue using Tailwind CSS 4 utilities. Avoid introducing a third-party component library for Phase 1 to keep bundle size predictable.

## Risks / Trade-offs

- **CORS in production** → TMD Core must whitelist `mobile.tangomarathons.com`. Confirm before Phase 5 launch; dev uses `localhost` exemption or proxy.
- **API response shape drift** → Local normalisation functions and fixture-based tests catch shape changes before they reach the UI.
- **Pagination behaviour** → TMD Core v3 may return paginated results. Use `_links.next` or `page`/`per_page` params; confirm defaults with local API before finalising DTO.
- **Performance on slow connections** → Event list may include many items. Use skeleton loading states and request only required fields where the API supports sparse fieldsets.

## Migration Plan

1. Add/update types in `src/lib/types.ts`.
2. Add `getEvents()` and `getEvent(id)` to `src/lib/api/tmd.ts`.
3. Implement `src/routes/events/+page.svelte`.
4. Implement `src/routes/events/[id]/+page.svelte`.
5. Update layout navigation to include `/events` link.
6. Run `npx @sveltejs/mcp svelte-autofixer` on changed Svelte files.
7. Run `npm run check` and `npm run build`.

Rollback: remove new route files and revert `tmd.ts` additions; no database or deployment changes required.

## Open Questions

- What is the default `per_page` for `/wp-json/tmd/v3/events`, and does it filter to future events by default?
- Is there a `status=upcoming` or `after=today` filter parameter available in v3?
- Which event fields are guaranteed non-null versus optional in the v3 response?
