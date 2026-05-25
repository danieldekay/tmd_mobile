## 1. Auth Module — User Type and Persistence

- [x] 1.1 Extend `User` type in `src/lib/auth.ts` to add `avatarUrl: string | null`
- [x] 1.2 Add `USER_KEY = 'tmd_auth_user'` constant; serialize/deserialize user to/from localStorage in `login()`, `initAuth()`, and `logout()`
- [x] 1.3 Update `initAuth()` to restore persisted user from localStorage alongside token restoration
- [x] 1.4 Add `GET_VIEWER_QUERY` to `src/lib/api/graphql.ts` (`viewer { id name email avatar { url } }`)
- [x] 1.5 In `initAuth()`, when a token is refreshed but no cached user exists, call the viewer query and persist the result
- [x] 1.6 Update `LOGIN_MUTATION` in `src/lib/api/graphql.ts` to also request `user { id name email avatar { url } }` (add `avatarUrl` mapping in `login()`)
- [x] 1.7 Run `npm run check` to verify no TypeScript errors

## 2. Profile Route

- [x] 2.1 Create `src/routes/profile/+page.svelte` with auth guard (redirect to `/login` if unauthenticated using `$effect`)
- [x] 2.2 Display user name, email, and avatar (or initials fallback component) on the profile page
- [x] 2.3 Add "Log out" button on profile page that calls `logout()` + `resetSavedEventsState()` and redirects to `/`
- [x] 2.4 Add `<title>` via `<svelte:head>` ("Your Profile — TMD")
- [x] 2.5 Run `npm run check` and `npm run build` to confirm the new route pre-renders cleanly

## 3. Header Identity Chip

- [x] 3.1 In `src/routes/+layout.svelte`, replace the "Log out" button branch with a user chip linking to `/profile` (show name and avatar thumbnail) when `$authState.user` is set
- [x] 3.2 Ensure the chip has an `aria-label` of `"View profile for <name>"`
- [x] 3.3 Preserve the existing "Log in" button for the unauthenticated branch
- [x] 3.4 Move `handleLogout` to the profile page; remove it from the layout

## 4. SSO — Login Page Button

- [x] 4.1 Add `PUBLIC_SSO_INITIATION_URL` to the Vite env type declaration (`src/app.d.ts` or `src/env.d.ts`)
- [x] 4.2 In `src/routes/login/+page.svelte`, conditionally render a "Log in with TangoAtlas" button when `import.meta.env.PUBLIC_SSO_INITIATION_URL` is set
- [x] 4.3 Implement `loginWithTangoAtlas()` in `src/lib/auth.ts`: generate a random CSRF nonce, store in `sessionStorage`, then redirect to `PUBLIC_SSO_INITIATION_URL` with `redirect_to=<origin>/auth/callback&state=<nonce>`
- [x] 4.4 Wire the button `onclick` to `loginWithTangoAtlas()`
- [x] 4.5 Add visual separator between the SSO button and the password form (e.g. "or continue with email")

## 5. SSO — OAuth Callback Route

- [x] 5.1 Create `src/routes/auth/callback/+page.svelte` as a static-compatible client-side route
- [x] 5.2 On mount (`onMount`), read `code` and `state` from `$page.url.searchParams`
- [x] 5.3 Validate `state` against the nonce stored in `sessionStorage`; show an error and stop if mismatched
- [x] 5.4 Add `exchangeSsoCode(code: string)` to `src/lib/auth.ts` that POSTs to the WordPress SSO exchange endpoint (`PUBLIC_SSO_EXCHANGE_URL` env var) and returns `{ authToken, refreshToken, user }`
- [x] 5.5 On successful exchange, call the same token + user storage logic as `login()`, then redirect to `/profile`
- [x] 5.6 Show a loading state ("Completing sign-in…") while the exchange is in progress
- [x] 5.7 On error, display a clear message and a "Back to login" link
- [x] 5.8 Handle direct navigation to `/auth/callback` with no parameters (redirect to `/login`)
- [x] 5.9 Run `npm run check` and `npm run build` to confirm the callback route pre-renders without error

## 6. Validation and Cleanup

- [x] 6.1 Run `npm run check` (full TypeScript check) — fix all type errors
- [x] 6.2 Run `npm run build` — confirm static build succeeds and all routes are pre-rendered
- [x] 6.3 Manually test password login: verify user chip appears in header and profile page shows name/email/avatar
- [x] 6.4 Manually test logout from profile page: verify tokens and user data cleared, header reverts to "Log in"
- [x] 6.5 Manually test cold-start with persisted data: refresh app, verify profile still loads without network
- [x] 6.6 Verify SSO button is hidden when `PUBLIC_SSO_INITIATION_URL` is not set in `.env.local`
- [ ] 6.7 Once backend SSO endpoint is available: test full TangoAtlas SSO flow end-to-end
