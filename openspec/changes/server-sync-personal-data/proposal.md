## Why

Personal utility data (saved events, reminders) currently lives only in `localStorage`, meaning it's siloed per device and lost when storage is cleared. TMD Core is introducing authenticated API endpoints for following, liking, and saving events, which makes it possible to persist this data server-side and sync it across devices. Using these endpoints closes the gap between the local-only PWA experience and the richer, account-aware behavior users expect from a modern events app.

## What Changes

- Replace the local-only `saved-events.ts` implementation with a hybrid that reads from and writes to the TMD server for authenticated users, with localStorage as the fallback for guests
- Add JWT-authenticated API calls for save/unsave event actions using the new TMD Core personal data endpoints
- Introduce a lightweight auth layer (login, token storage) so users can authenticate from within TMD Mobile
- Show save state from the server when the user is logged in, overriding any local state
- Sync due reminders: if a registration-date reminder has been set locally and the server supports reminder storage, persist it server-side

## Capabilities

### New Capabilities

- `user-auth`: JWT login/logout flow using WPGraphQL mutation; token stored in `localStorage`; session refresh; exposed via `$lib/auth` composable and a `/login` route
- `server-saved-events`: Authenticated save/unsave actions via TMD Core personal data endpoints; hydrates saved state from server on app load for logged-in users; falls back gracefully to local storage for guests

### Modified Capabilities

- `event-browsing`: When authenticated, save toggle reads/writes to server instead of localStorage only; optimistic UI update with server confirmation
- `event-detail`: Same server-save behaviour as event-browsing; reminder button may persist to server if endpoint available

## Impact

- **API**: New TMD Core endpoints (e.g. `POST /wp-json/tmd/v3/user/saved-events`, `DELETE /wp-json/tmd/v3/user/saved-events/{id}`, `GET /wp-json/tmd/v3/user/saved-events`); requires JWT bearer token in `Authorization` header
- **CORS**: TMD Core CORS must allow `mobile.tangomarathons.com` and `localhost:5173` — already configured in phase1
- **Auth**: WPGraphQL login mutation at `/graphql`; `authToken` (short-lived) + `refreshToken` (30-day) stored in `localStorage`
- **Code**: `src/lib/auth.ts` (new), `src/lib/saved-events.ts` (modified), `src/routes/login/+page.svelte` (new), `src/routes/+layout.svelte` (auth state provider)
- **Deployment**: No new infrastructure required; all server calls go to `www.tangomarathons.com`
- **Access**: Login/save is opt-in; all browse features remain public and unauthenticated
