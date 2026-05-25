## Context

TMD Mobile already has a functional username/password login flow backed by WPGraphQL JWT Authentication. After login, the app redirects to `/events` but displays no user information anywhere in the UI — the only affordance is a "Log out" button in the header. Additionally, the WordPress backend has the `id.tangoatlas.org` OpenID Connect provider configured, but the mobile app does not expose this login path.

The current auth module (`src/lib/auth.ts`) stores a minimal `User` shape `{ id, name, email }` in an in-memory Svelte store alongside JWT tokens, but this data is never restored from storage on app reload — only the tokens are. There is no profile route and no SSO initiation logic.

## Goals / Non-Goals

**Goals:**

- Surface logged-in user details (name, email, avatar) on a new `/profile` route after login.
- Persist the user object alongside the JWT tokens so the profile is available on cold start without an extra network request (or with a lightweight re-fetch if stale).
- Add a "Log in with TangoAtlas" button on the login page that begins the WP-managed OAuth 2.0 / OIDC flow for id.tangoatlas.org.
- Handle the OAuth callback in a client-side route (`/auth/callback`) that is compatible with the `adapter-static` constraint.
- Show the user's display name (and avatar thumbnail if available) in the header when authenticated, linking to `/profile`.

**Non-Goals:**

- Implementing or configuring the id.tangoatlas.org OIDC provider on the WordPress side — that is a backend prerequisite.
- Registration, password reset, or account management flows.
- Server-side session handling or cookies (static deployment constraint).
- Social login providers other than TangoAtlas.

## Decisions

### D1 — SSO flow via WordPress redirect, not direct OIDC

**Decision:** The mobile app does not talk directly to id.tangoatlas.org. It redirects to the WordPress initiation URL (e.g. `https://www.tangomarathons.com/wp-login.php?action=wordpress_social_login&mode=login&provider=openid-connect&redirect_to=<callback>`), WordPress handles the OIDC exchange, and the callback lands back on the mobile app's `/auth/callback` route with a one-time code.

**Rationale:** Avoids embedding OIDC client credentials in the static app bundle. The WordPress plugin (WP OAuth Server or Social Login) already holds the provider registration. This also means the JWT token exchange uses the same `LOGIN_MUTATION` path as password login (the WP plugin issues a JWT after the SSO handshake), keeping the auth module uniform.

**Alternative considered:** Implementing a PKCE flow directly against id.tangoatlas.org from the SPA. Rejected: requires exposing client_id/secret, duplicates logic already in WP, and requires CORS cooperation from id.tangoatlas.org.

### D2 — OAuth callback as a static client-side route

**Decision:** Add `src/routes/auth/callback/+page.svelte`. On mount, read `?code=` and `?state=` from the URL, POST to a WordPress REST endpoint (`/wp-json/tmd/v3/auth/sso-exchange` or similar) to exchange the code for JWT tokens, then redirect to `/profile`.

**Rationale:** `adapter-static` requires all routes to be pre-renderable. The callback page has no server-side logic — the code exchange call goes to WordPress, and the page is just a loading/error UI wrapper.

**Alternative considered:** A SvelteKit server route (`+server.ts`). Rejected: incompatible with `adapter-static` unless `export const prerender = false` is used for that single route, which requires `adapter-cloudflare` features not currently in use.

### D3 — Persist user details in localStorage alongside tokens

**Decision:** Serialize the `User` object to `localStorage` under key `tmd_auth_user` as JSON. `initAuth()` reads and deserializes it. A `fetchCurrentUser()` call via GraphQL (`viewer { id, name, email, avatar { url } }`) is made on init when a token exists but the stored user is missing (e.g. first login before this change shipped).

**Rationale:** Avoids a mandatory network round-trip on every cold start for something that changes rarely. GraphQL `viewer` query is used (not REST) because it returns a rich user object including the avatar URL in one query.

**Alternative considered:** Always re-fetch user from `viewer` query on init. Rejected: adds 100–300 ms to cold start and requires network, hurting PWA offline experience.

### D4 — `User` type extended with `avatarUrl`

**Decision:** Extend the existing `User` type in `auth.ts`:

```ts
type User = { id: string; name: string; email: string; avatarUrl: string | null };
```

The GraphQL `LOGIN_MUTATION` is updated to also request `avatar { url }`. Existing code that destructures `user` will continue to work; `avatarUrl` is nullable for backward compat.

### D5 — Profile route at `/profile`, linked from header

**Decision:** New route `src/routes/profile/+page.svelte`. The header's "Log out" button is replaced with a user avatar/name chip that links to `/profile`; the profile page contains the logout button. Unauthenticated access to `/profile` redirects to `/login`.

**Rationale:** Consolidates user-facing identity actions in one place. The header chip provides lightweight always-visible confirmation of who is logged in.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| WordPress SSO initiation URL format unknown until backend is tested | Parameterize via `PUBLIC_SSO_INITIATION_URL` env var; fall back gracefully with an error if not configured |
| Code exchange endpoint (`/wp-json/tmd/v3/auth/sso-exchange`) may not exist yet on WP side | Guard with a clear error message on the callback page; the button can be gated behind the env var so it's invisible until the backend is ready |
| `adapter-static` pre-renders `/auth/callback` — route must handle both "code present" and "empty" states without crashing | Pre-render the page as a loading skeleton; actual logic runs only client-side in `onMount` |
| Avatar URL from WP may be a Gravatar URL (http) served over http | Display with `<img>` allowing mixed content; fall back to initials avatar if empty or if loading fails |
| Storing user JSON in localStorage is sensitive | User data stored is display-only (name, email, avatar) — no credentials. Tokens are already stored there. Acceptable for this threat model. |

## Migration Plan

1. Deploy the updated `LOGIN_MUTATION` (with avatar) — backward compatible, WP returns null avatar if unavailable.
2. Ship `/profile` route and header chip — users who were already logged in will see the chip but `avatarUrl` will be null until next login (graceful degradation to initials).
3. Configure `PUBLIC_SSO_INITIATION_URL` in Cloudflare Workers environment variables once WordPress side is ready.
4. Enable the "Log in with TangoAtlas" button (it renders only when `PUBLIC_SSO_INITIATION_URL` is set).

**Rollback:** The SSO button is additive and env-gated. Removing the env var hides it immediately without a redeploy.

## Open Questions

- What is the exact WordPress SSO initiation URL format for id.tangoatlas.org? (Backend team to confirm.)
- Does the WP backend expose `/wp-json/tmd/v3/auth/sso-exchange`, or should the callback use the WP REST OAuth token endpoint directly?
- Should the callback state parameter be verified against a CSRF nonce stored in `sessionStorage`? (Recommended yes — needs agreement on the nonce mechanism.)
