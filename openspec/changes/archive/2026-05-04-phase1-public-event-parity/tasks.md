# Tasks: Phase 1 — Public Event Parity

## 1. Types and API Client

- [x] 1.1 Define `TmdEventSummary` type in `src/lib/types.ts` (id, title, dateStart, dateEnd, city, country, venue, badges, slug)
- [x] 1.2 Define `TmdEventDetail` type in `src/lib/types.ts` (all summary fields plus registrationDate, price, website, contactLinks, socialLinks, features, djs, teachers, series)
- [x] 1.3 Add `getEvents(): Promise<TmdEventSummary[]>` to `src/lib/api/tmd.ts` with pagination default and normalisation
- [x] 1.4 Add `getEvent(id: string | number): Promise<TmdEventDetail>` to `src/lib/api/tmd.ts` with normalisation
- [x] 1.5 Create normalisation functions `normalizeTmdEvent` and `normalizeTmdEventDetail` to map raw API response to local DTOs
- [x] 1.6 Validate API response shape against local and production endpoints; update types if needed

## 2. Event List Route

- [x] 2.1 Implement `src/routes/events/+page.svelte` with `onMount` data fetch using `getEvents()`
- [x] 2.2 Add skeleton loading state while events are in flight
- [x] 2.3 Add event card component showing title, date range, location, and feature badges
- [x] 2.4 Add empty state UI when no events are returned
- [x] 2.5 Add retryable error state when `getEvents()` throws or returns an error
- [x] 2.6 Add offline detection and offline state message when `navigator.onLine` is false

## 3. Event Detail Route

- [x] 3.1 Implement `src/routes/events/[id]/+page.svelte` with `onMount` data fetch using `getEvent(id)`
- [x] 3.2 Display date range, registration date, location, venue, price, website, contact links, and social links
- [x] 3.3 Display feature badges and DJs/teachers/series relationships when present in response
- [x] 3.4 Add skeleton loading state while detail is in flight
- [x] 3.5 Add not-found state for 404 responses from the API
- [x] 3.6 Add retryable error state for network/CORS errors
- [x] 3.7 Add back-navigation affordance linking to `/events`

## 4. Navigation

- [x] 4.1 Add `/events` link to the main layout navigation component
- [x] 4.2 Ensure the active route is visually indicated in the nav

## 5. Validation

- [x] 5.1 Run `npx @sveltejs/mcp svelte-autofixer` on all changed `.svelte` files
- [x] 5.2 Run `npm run check` and fix all TypeScript errors
- [x] 5.3 Run `npm run build` and confirm static output is generated without errors
