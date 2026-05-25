# Proposal: Matomo Analytics Offline Queue

## Why

TMD Mobile currently has no analytics tracking for PWA usage. Unlike rnt_mobile which successfully uses a Matomo offline queue to track page views and events even when the app is backgrounded or offline, tmd_mobile has no tracking at all. For a production PWA, analytics are critical to understand user behavior and improve the app. The Matomo integration is essential for EU-compliant analytics (self-hosted, no cookie banner required for internal data).

## What Changes

- NEW — `src/lib/matomo-offline.ts`: Matomo offline queue implementation from rnt_mobile's `matomo.ts`, including offline event buffering, retry logic, heartbeat, and `sendBeacon` fallback
- NEW — `src/lib/utils/analytics.ts`: Simplified analytics API for pages and components to track page views and events
- MODIFIED — All route pages to import and use Matomo tracking (with consent-aware gating per `consentStore` or equivalent)
- NO new dependencies added — Matomo SDK already loaded via `PUBLIC_MATOMO_URL` from env vars

### Capabilities

#### New Capabilities
- `matomo-offline-queue`: Stores tracking events in `localStorage` when offline, retries on reconnect
- `matomo-heartbeat`: Heartbeat ping for long-lived PWA sessions (30s interval when in standalone mode)
- `matomo-send-beacon`: Uses `navigator.sendBeacon` for reliable final-page-unload tracking in PWAs
- `matomo-display-mode`: Tracks PWA display mode (`standalone` vs `browser`) as custom dimension

#### Modified Capabilities
- `analytics-tracking`: TMD Mobile moves from no-analytics → full-op-analytics with offline queue
- `consent-gating`: All analytics respect user's consent choices (GDPR compliance)

## Impact

- `src/lib/matomo-offline.ts`: completely new analytics module
- `src/lib/utils/analytics.ts`: simple tracking API for page use
- `src/routes/+layout.svelte`: add matomo initialization on mount
- `src/routes/+page.svelte`: track home page view
- `src/routes/events/+page.svelte`: track event list view + filter changes
- `src/routes/events/[id]/+page.svelte`: track event detail view
- `src/routes/event-series/+page.svelte`: track event list and detail
- All other route pages should add tracking as appropriate
- No API endpoint changes
- Auth changes: none (first-party data, no PII)
- Prerender compatibility: only track in client-side code, not SSR
