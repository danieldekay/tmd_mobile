# Tasks: Phase 3 — Relationship Parity

## 1. API Endpoint Verification

- [x] 1.1 Confirm TMD Core v3 exposes `/tmd/v3/djs` and `/tmd/v3/djs/{id}`; document response shape
- [x] 1.2 Confirm TMD Core v3 exposes `/tmd/v3/event-series/{id}`; document response shape
- [x] 1.3 Confirm whether `/tmd/v3/events` accepts `?dj_id=` or `?series_id=` filter params for connected-event lists
- [x] 1.4 Confirm whether a teacher endpoint exists and document its shape or note its absence

## 2. Types and API Client

- [x] 2.1 Add `TmdDj` and `TmdDjDetail` types to `src/lib/types.ts`
- [x] 2.2 Add `TmdEventSeries` type to `src/lib/types.ts`
- [x] 2.3 Add `getDjs(): Promise<TmdDj[]>` to `src/lib/api/tmd.ts`
- [x] 2.4 Add `getDj(id): Promise<TmdDjDetail>` to `src/lib/api/tmd.ts` including connected-event fetch
- [x] 2.5 Add `getEventSeries(id): Promise<TmdEventSeries>` to `src/lib/api/tmd.ts`

## 3. DJ Directory Routes

- [x] 3.1 Implement `src/routes/djs/+page.svelte` with DJ list, loading skeleton, and empty state
- [x] 3.2 Implement `src/routes/djs/[id]/+page.svelte` with DJ profile, connected-events list, loading/error/not-found states
- [x] 3.3 Add back-navigation from DJ detail to `/djs`

## 4. Event Series Route

- [x] 4.1 Implement `src/routes/event-series/[id]/+page.svelte` with series metadata, edition list, loading/error/not-found states
- [x] 4.2 Link each edition to `/events/[id]`

## 5. Event Detail Cross-Links

- [x] 5.1 Update `src/routes/events/[id]/+page.svelte` to render DJ names as links to `/djs/[id]`
- [x] 5.2 Update `src/routes/events/[id]/+page.svelte` to render series name as a link to `/event-series/[id]`
- [x] 5.3 Keep teacher names as plain text if teacher endpoint is unavailable; add links if confirmed

## 6. Navigation

- [x] 6.1 Add `/djs` link to the main layout navigation component

## 7. Validation

- [x] 7.1 Run `npx @sveltejs/mcp svelte-autofixer` on all changed `.svelte` files
- [x] 7.2 Run `npm run check` and fix all TypeScript errors
- [x] 7.3 Run `npm run build` and confirm static output is generated without errors
