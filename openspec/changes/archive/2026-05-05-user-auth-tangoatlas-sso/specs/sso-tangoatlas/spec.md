## ADDED Requirements

### Requirement: TangoAtlas SSO Login Button

The login page SHALL display a "Log in with TangoAtlas" button when the `PUBLIC_SSO_INITIATION_URL` environment variable is configured. Tapping the button SHALL initiate the TangoAtlas OpenID Connect flow via the WordPress backend.

#### Scenario: SSO button visible when configured

- **GIVEN** `PUBLIC_SSO_INITIATION_URL` is set in the deployment environment
- **WHEN** an unauthenticated user visits `/login`
- **THEN** the page shows a "Log in with TangoAtlas" button in addition to the existing username/password form

#### Scenario: SSO button hidden when not configured

- **GIVEN** `PUBLIC_SSO_INITIATION_URL` is not set
- **WHEN** a user visits `/login`
- **THEN** no TangoAtlas button is shown; the login page appears as today

#### Scenario: SSO flow initiated

- **WHEN** the user taps "Log in with TangoAtlas"
- **THEN** a CSRF nonce is stored in sessionStorage and the browser is redirected to the WordPress SSO initiation URL with a `redirect_to` parameter pointing to the app's `/auth/callback` route

#### Scenario: SSO button is accessible

- **WHEN** a screen reader or keyboard user focuses the TangoAtlas SSO button
- **THEN** the button has a clear accessible label ("Log in with TangoAtlas") and behaves as a standard button

### Requirement: OAuth Callback Handler

The app SHALL provide a `/auth/callback` route that handles the OAuth redirect from WordPress, exchanges the authorisation code for JWT tokens, and redirects the user to `/profile` on success.

#### Scenario: Successful OAuth callback

- **GIVEN** the user has completed the TangoAtlas SSO flow
- **WHEN** the browser lands on `/auth/callback?code=<code>&state=<state>`
- **THEN** the app verifies the state nonce from sessionStorage, exchanges the code via the WordPress SSO exchange endpoint, stores the resulting JWT tokens and user data, and redirects to `/profile`

#### Scenario: State mismatch — CSRF protection

- **WHEN** the `state` parameter in the callback URL does not match the nonce stored in sessionStorage
- **THEN** the app displays an error ("Login failed: invalid state parameter") and does NOT store any tokens

#### Scenario: Code exchange fails

- **WHEN** the WordPress SSO exchange endpoint returns an error
- **THEN** the app displays a human-readable error message and offers a link back to `/login`

#### Scenario: Callback page renders while processing

- **WHEN** the app is processing the OAuth callback
- **THEN** the page shows a loading indicator ("Completing sign-in…") while awaiting the exchange

#### Scenario: Direct navigation to callback without code

- **WHEN** a user navigates directly to `/auth/callback` with no query parameters
- **THEN** the page shows an error or redirects to `/login` (no infinite loop, no blank screen)

#### Scenario: Callback works with static adapter

- **GIVEN** the app is deployed as a static build
- **WHEN** the browser lands on the pre-rendered `/auth/callback` page
- **THEN** the client-side mount logic reads URL parameters and proceeds with the exchange (no server-side code required)

### Requirement: SSO Login Produces Identical Auth State to Password Login

After a successful SSO login, the auth state, persisted tokens, and user profile data SHALL be in exactly the same shape as after a password login, so all downstream features (profile display, saved events, token refresh) work without modification.

#### Scenario: Auth state equivalence after SSO

- **WHEN** SSO login completes successfully
- **THEN** `authState` contains `authToken`, `refreshToken`, and a populated `User` object with id, name, email, and avatarUrl — identical in structure to a password login result

#### Scenario: Token refresh works after SSO login

- **GIVEN** the user logged in via TangoAtlas SSO
- **WHEN** the auth token expires and `refreshAuthToken()` is called
- **THEN** the refresh succeeds using the stored refreshToken, exactly as it would for a password login
