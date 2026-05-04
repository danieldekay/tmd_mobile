## 1. Auth Library

- [x] 1.1 Create `src/lib/api/graphql.ts` with `LOGIN_MUTATION` and `REFRESH_TOKEN_MUTATION` GraphQL query strings targeting `/graphql`
- [x] 1.2 Create `src/lib/auth.ts` with module-level `$state` authState (`{ user: null | { username, email, displayName }, authToken, refreshToken }`), and export `initAuth()`, `login(username, password)`, `logout()`, `refreshAuthToken()`, `isAuthenticated()`
- [x] 1.3 Implement `initAuth()`: restore tokens from localStorage (`tmd_auth_token`, `tmd_refresh_token`); if `authToken` is missing but `refreshToken` exists, silently refresh; call on app mount
- [x] 1.4 Implement automatic 401 retry: export `withAuth(fn)` wrapper in `src/lib/api/user.ts` that catches 401, refreshes token once, retries; calls `logout()` if refresh fails
- [x] 1.5 Run `npm run check` and confirm no type errors in auth module

## 2. User API Module

- [x] 2.1 Create `src/lib/api/user.ts` with `getSavedEvents(): Promise<number[]>`, `saveEvent(id): Promise<void>`, `unsaveEvent(id): Promise<void>` — all gated behind `VITE_ENABLE_SERVER_SYNC` flag and JWT auth header
- [x] 2.2 Add graceful degradation: if any user API call fails or flag is disabled, return empty result / no-op without throwing
- [x] 2.3 Add `VITE_ENABLE_SERVER_SYNC=true` to `.env.development`; document in README

## 3. Saved Events — Hybrid Layer

- [x] 3.1 Update `src/lib/saved-events.ts`: add `initSavedEvents()` that fetches server state when authenticated and merges into in-memory set; change `saveEvent(id)` and `unsaveEvent(id)` to also call the user API when authenticated (optimistic + rollback on error)
- [x] 3.2 Update `src/routes/+layout.svelte` `onMount` to call `initSavedEvents()` after `initAuth()`
- [x] 3.3 Update `src/routes/saved/+page.svelte` to load saved events from server when authenticated (via `getSavedEvents()` + `getEvents()` hydration)

## 4. Login Route

- [x] 4.1 Create `src/routes/login/+page.svelte` with username/password form, submit handler calling `login()`, loading state, error message display, redirect to `/events` on success, redirect to `/events` if already authenticated
- [x] 4.2 Add "Log in" link in `src/routes/+layout.svelte` header nav when guest; show display name + "Log out" button when authenticated
- [x] 4.3 Add `/login` to `NavHref` type if needed; ensure Svelte type check passes

## 5. Validation

- [x] 5.1 Run `npm run check` — fix all TypeScript and Svelte type errors
- [x] 5.2 Run `npm run build` — confirm static build succeeds with new modules
- [ ] 5.3 Manual smoke test: login with test credentials, save an event, reload, confirm save state persists from server
- [ ] 5.4 Manual smoke test: save an event as guest, confirm localStorage is used and no 401 errors appear in console
