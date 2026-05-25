## Why

After login, users see no confirmation of who they are, and there is no way to log in using the TangoAtlas identity provider (id.tangoatlas.org) that is already configured in the WordPress backend. Both gaps reduce trust and adoption — dancers who already have a TangoAtlas account should not need to create a separate TMD password.

## What Changes

- After a successful login (password or SSO), redirect the user to a post-login profile screen that shows their name, email, and avatar.
- Add a "Log in with TangoAtlas" button on the login page that initiates the OAuth 2.0 / OpenID Connect flow via id.tangoatlas.org.
- The WordPress backend handles the SSO callback; the mobile app receives a JWT token pair through the existing WPGraphQL JWT endpoint (same tokens as password login).
- The auth store is extended to persist and surface user details (name, email, avatar URL) so any route can display them.
- A `/profile` route is added showing the logged-in user's details and a logout button.

## Capabilities

### New Capabilities

- `user-profile`: Display logged-in user details (name, email, avatar) on a dedicated `/profile` screen; expose user info to the auth store so other views can read it.
- `sso-tangoatlas`: Add TangoAtlas SSO login flow — "Log in with TangoAtlas" button on the login page that redirects to id.tangoatlas.org, handles the OAuth callback, and exchanges the code for JWT tokens through the WordPress GraphQL endpoint.

### Modified Capabilities

- `saved-events`: The auth state shape gains a richer `User` object (avatar URL). The saved-events feature reads auth state but its own requirements do not change.

## Impact

- **`src/lib/auth.ts`**: Extend `User` type with `avatarUrl`; add `loginWithSso(provider)` function that redirects to the WordPress SSO initiation URL; add `handleSsoCallback(code, state)` that exchanges the code for tokens via GraphQL or REST.
- **`src/lib/api/graphql.ts`**: Add `GET_CURRENT_USER_QUERY` to fetch user details (id, name, email, avatar) after token refresh.
- **`src/routes/login/+page.svelte`**: Add "Log in with TangoAtlas" button below the password form.
- **`src/routes/profile/`**: New route showing user details and logout; accessible only when authenticated (redirect to `/login` otherwise).
- **`src/routes/+layout.svelte`**: Surface user name / avatar in nav when authenticated, linking to `/profile`.
- **WordPress dependency**: The `id.tangoatlas.org` OpenID Connect provider must be registered as a WP OAuth server; the callback URL `<origin>/auth/callback` must be whitelisted. This is a backend prerequisite, not implemented here.
- **Static/SSR constraint**: The OAuth callback handler must work with `adapter-static` — it will be implemented as a client-side route that reads `?code=` and `?state=` from the URL on mount.
