# Tasks: Server Sync Personal Data

## Task Group: Server sync for saved events

- [ ] Create `src/lib/api/sync-events.ts` sync helper for save/deselect events to the server endpoint
- [ ] Wire `syncEventSave` into `src/lib/saved-events.ts` — local + server sync after every save/deselect
- [ ] Add server sync to `src/lib/api/user.ts` profile with `getSavedEvents()` and `saveEventStatus()`

## Task Group: Server sync for user preferences

- [ ] Create `src/lib/api/sync-preferences.ts` preferences sync helper
- [ ] Wire preference sync into `src/routes/settings/+page.svelte`

## Task Group: Offline sync queue

- [ ] Add offline queue to `src/lib/api/sync-events.ts` with sendBeacon or fetch fallback
- [ ] Create `src/lib/api/sync-preferences-offline.ts` preferences sync queue

## Task Group: Privacy compliance & error handling

- [ ] Ensure all sync requests use HTTPS only
- [ ] Silently log sync failures without user-facing toasts
- [ ] Add consent gate to sync — no analytics without opt-in

## Task Group: Manual testing & polish

- [ ] Manual test server sync flow: save/deselect with server, offline queue flush
- [ ] Manual test error handling: sync failures, network errors, server errors
