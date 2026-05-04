# Tasks: Phase 4 — Personal Utility

## 1. Saved Events Storage

- [x] 1.1 Create `src/lib/saved-events.ts` with `saveEvent(id)`, `unsaveEvent(id)`, `isSaved(id)`, and `getSavedIds()` using `localStorage`
- [x] 1.2 Handle `QuotaExceededError` and missing `localStorage` gracefully
- [x] 1.3 Add save/unsave toggle component usable on both event cards and event detail pages

## 2. Saved Events UI

- [x] 2.1 Add save toggle to event cards in `src/routes/events/+page.svelte`
- [x] 2.2 Add save toggle to `src/routes/events/[id]/+page.svelte`
- [x] 2.3 Implement saved-events list view (route or section) showing saved events from `localStorage`
- [x] 2.4 Add empty state for saved-events view when no events are saved
- [x] 2.5 Add navigation link to the saved-events section in the layout

## 3. Registration Reminders

- [x] 3.1 Create `src/lib/reminders.ts` with permission request and reminder scheduling using the Web Notifications API
- [x] 3.2 Add "Remind me" button to `src/routes/events/[id]/+page.svelte` for events with a registration date
- [x] 3.3 Show informational message when notification permission is denied
- [x] 3.4 Show confirmation when a reminder is successfully set

## 4. Offline Cache

- [x] 4.1 Create `src/service-worker.ts` with cache strategy for the most recent events API response (1-hour TTL)
- [x] 4.2 Register the Service Worker in the SvelteKit app entry point
- [x] 4.3 Update the offline state UI in `src/routes/events/+page.svelte` to show cached data when available
- [x] 4.4 Verify Service Worker scope is compatible with Cloudflare Worker Assets SPA fallback

## 5. PWA Install/Update Prompts

- [x] 5.1 Add install prompt banner shown after the user has browsed at least two events
- [x] 5.2 Add update prompt shown when a new Service Worker version is waiting to activate

## 6. Validation

- [x] 6.1 Run `npx @sveltejs/mcp svelte-autofixer` on all changed `.svelte` files
- [x] 6.2 Run `npm run check` and fix all TypeScript errors
- [x] 6.3 Run `npm run build` and confirm Service Worker is included in static output
