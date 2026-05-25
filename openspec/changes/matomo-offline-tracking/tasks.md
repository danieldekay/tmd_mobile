# Tasks: Matomo Offline Analytics Queue

## Task Group: Core Matomo module

- [ ] Create `src/lib/matomo-offline.ts` with offline queue, heartbeat, sendBeacon
- [ ] Create `src/lib/utils/analytics.ts` simplified API wrapper for pages
- [ ] Create unit tests for `matomo-offline.ts` with offline queue and sendBeacon

## Task Group: Layout integration

- [ ] Add Matomo initialization to `src/routes/+layout.svelte` on mount
- [ ] Add Matomo init to `src/routes/+page.svelte` (landing page)

## Task Group: Consent banner + gating

- [ ] Create `src/lib/consent.ts` consent store with accept/reject and Matomo gating
- [ ] Design consent banner component that blocks Matomo until accepted

## Task Group: Matomo SDK injection

- [ ] Inject Matomo SDK into `src/app.html` head with load-on-consent
- [ ] Wire `src/lib/matomo-offline.ts` into landing page

## Task Group: Consent gating on all routes

- [ ] Add `shouldTrack` guards to `src/lib/matomo-offline.ts` on mount
- [ ] Add `shouldTrack` guards to `src/lib/matomo-offline.ts` on mount
- [ ] Add `shouldTrack` guards to `src/lib/matomo-offline.ts` on mount
- [ ] Add `shouldTrack` guards to `src/lib/matomo-offline.ts` on mount

## Task Group: Manual testing + polish

- [ ] Run manual test scenarios for page views and offline queue flush
- [ ] Validate all routes load without errors when Matomo is offline or consent is denied
