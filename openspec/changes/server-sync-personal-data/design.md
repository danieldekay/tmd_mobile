## Context

TMD Mobile currently stores saved events and reminder preferences exclusively in `localStorage`. This works for single-device use but data is lost when the browser storage is cleared, and there is no cross-device sync. TMD Core is adding authenticated personal data endpoints that allow the server to store per-user saved events, follows, and likes. The mobile app should adopt these endpoints to provide a persistent, account-linked experience for authenticated users while keeping all browse features public.

The app is a SvelteKit 2 static PWA (adapter-static, `ssr = false`). Auth must be fully client-side. TMD Core already exposes a WPGraphQL endpoint with a JWT authentication plugin used by TMD Quasar. We can reuse the same login flow.

## Goals / Non-Goals

**Goals:**
- Implement a minimal JWT auth layer (login, token refresh, logout) in `src/lib/auth.ts`
- Add a `/login` route with username/password form
- Sync saved events to the server for authenticated users; fall back to localStorage for guests
- Expose auth state as a Svelte 5 `$state` reactive singleton so all components can react to login/logout
- Optimistic UI: update local state immediately, confirm with server in the background

**Non-Goals:**
- User registration (TMD users only; no sign-up flow)
- Password reset within the app (redirect to main site)
- Syncing reminders to the server in this change (deferred; depends on server-side reminder API availability)
- Social features (follow, like counters) beyond save/unsave — tracked as future work
- GraphQL for personal data endpoints (REST v3 is sufficient; GraphQL adds no benefit here)

## Decisions

### D1: Auth via WPGraphQL login mutation, not REST

TMD Core's WPGraphQL JWT plugin is already in use by TMD Quasar and is proven to work. It returns an `authToken` (short-lived, ~1 hour) and a `refreshToken` (30-day). The alternative REST-based `/wp-json/jwt-auth/v1/token` endpoint would need separate CORS configuration and is less consistent with the existing multi-frontend auth strategy.

**Chosen**: WPGraphQL `login` mutation at `/graphql`; `refreshJwtAuthToken` mutation for token refresh.

### D2: Token storage in localStorage (not cookies)

The app is a static SPA with no server-side rendering. HttpOnly cookies require a server to set them, which is not compatible with `adapter-static`. Storing tokens in localStorage is the accepted trade-off for client-rendered SPAs; the risk is XSS exfiltration, mitigated by the app not loading third-party scripts.

**Chosen**: `localStorage` keys `tmd_auth_token` and `tmd_refresh_token`.

### D3: Saved events hybrid: server-first for authenticated, localStorage-only for guests

When the user is logged in, `saved-events.ts` calls `GET /wp-json/tmd/v3/user/saved-events` on mount to hydrate the canonical set. Save/unsave operations call `POST`/`DELETE` on the server and update local state optimistically. When logged out, the existing localStorage behaviour is unchanged — no migration or merging of guest saves into the server store is required in this change (deferred).

**Chosen**: Hybrid with server-first hydration for authenticated users.

### D4: Auth state as a module-level Svelte 5 `$state` singleton

A single `src/lib/auth.ts` module exports a reactive `authState` object (using Svelte 5 rune `$state`) and functions `login()`, `logout()`, `refreshToken()`, `isAuthenticated()`. The `+layout.svelte` calls `initAuth()` on mount to restore token from localStorage and attempt a silent refresh if expired. This avoids Pinia / Context API and keeps the pattern consistent with existing composables.

### D5: New personal-data API module, not extending `tmd.ts`

`src/lib/api/tmd.ts` handles public read-only data. Authenticated write operations belong in a separate `src/lib/api/user.ts` to maintain separation of concerns and avoid accidentally requiring auth for public reads.

## Risks / Trade-offs

- **Token expiry during a session** → Mitigation: `user.ts` detects 401 responses and calls `refreshToken()` before retrying once; if refresh fails, calls `logout()` and shows a re-login prompt.
- **TMD Core personal data endpoints not yet live** → Mitigation: `user.ts` wraps all calls in try/catch with graceful degradation to localStorage; a feature flag `VITE_ENABLE_SERVER_SYNC=true` gates server calls so the app remains fully functional without them.
- **localStorage guest saves lost on login** → Mitigation: Out of scope for this change; document as known limitation. A merge-on-login flow can be added later.
- **GraphQL endpoint CORS** → The `/graphql` endpoint is already allowed for `mobile.tangomarathons.com` and `localhost:5173` from the CORS update in phase1. No new CORS config needed.
- **Optimistic UI inconsistency** → If server save fails after optimistic update, rollback local state and show a brief error toast.
