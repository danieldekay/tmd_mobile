# Tasks: Account-Backed Interactions

## Task Group: Server interactions API

- [ ] Create `src/lib/api/interactions.ts` with createBookmark(), deleteInteraction(), loadInteractions() functions
- [ ] Wire server interactions into `src/lib/saved-events.ts` — replace localStorage-only save with server-backed optimistic update
- [ ] Gate all save/reminder actions behind auth check — show login prompt for unauthenticated users
- [ ] Execute pending interactions after login callback in `src/routes/login/+page.svelte`
- [ ] Migrate local-only saved events to server on first login via `/tmd/v3/user-interactions/bulk`
- [ ] Add visual indicators for authenticated vs guest state on save buttons
- [ ] Run manual tests with task items for manual testing
