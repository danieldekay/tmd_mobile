## Context

TMD Mobile is static SvelteKit on Cloudflare Worker Assets. All persistence must be client-side; there is no authenticated backend for user data in Phase 4. The Web Notifications API is available in modern mobile browsers but requires explicit permission. Service Worker caching is compatible with the static deployment target as long as the SW scope does not conflict with Cloudflare Worker routing.

## Goals / Non-Goals

**Goals:**

- Save/unsave events to `localStorage`; display a saved-events list in the app.
- Opt-in registration reminders via the Web Notifications API.
- Cache the most recent event list response in the Service Worker cache for offline use.
- Better PWA install and update prompts.

**Non-Goals:**

- Server-side saved-events synced across devices (requires auth — Phase 6).
- Background sync for real-time updates (limited browser PWA support).
- Push notifications via a server subscription (requires auth and push server — Phase 6).
- Storing any sensitive user data.

## Decisions

**Decision: `localStorage` for saved events, not IndexedDB**

Saved event IDs are small (integer array). `localStorage` is synchronous, universally supported, and requires no async wrapper library. Upgrade to IndexedDB only if the data model grows (e.g., notes, timestamps, offline event bodies).

**Decision: Permission requested on first reminder set, not on app load**

Requesting notification permission on page load is rejected by browsers and degrades UX. Permission is requested only when the user explicitly taps "Remind me" on a specific event.

**Decision: Service Worker cache for last-seen event list only**

Caching all routes and API responses risks serving stale event data. Cache only the most recent `/tmd/v3/events` response with a short TTL (e.g., 1 hour) for offline fallback. Individual event detail pages are not cached in Phase 4.

**Decision: SvelteKit `service-worker.ts` for SW registration**

SvelteKit's built-in `src/service-worker.ts` entry point works with `adapter-static`. The SW scope will be `/` which is compatible with Cloudflare Worker Assets fallback routing.

## Risks / Trade-offs

- **SW and Cloudflare Worker scope conflict** → Cloudflare Worker Assets handles routing at the edge; the browser SW handles caching client-side. These operate at different layers and should not conflict, but must be tested in production.
- **Notification permission fatigue** → Over-requesting permissions damages trust. Limit reminder prompts to the event detail page, never on list views.
- **localStorage quota** → Unlikely to exceed limits with event IDs, but handle `QuotaExceededError` gracefully.

## Open Questions

- Does the SvelteKit Service Worker build work correctly with Cloudflare Worker Assets SPA fallback?
- What is the consent and privacy copy requirement before enabling analytics in Phase 5?
