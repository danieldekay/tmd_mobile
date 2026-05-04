## ADDED Requirements

### Requirement: User can log in with TMD account credentials
The app SHALL provide a login form at `/login` that authenticates against WPGraphQL using the JWT login mutation.

#### Scenario: Successful login
- **WHEN** a user submits valid username and password on `/login`
- **THEN** the app stores `authToken` and `refreshToken` in localStorage, updates auth state to authenticated, and redirects to `/events`

#### Scenario: Invalid credentials
- **WHEN** a user submits incorrect credentials
- **THEN** the app shows a clear error message and does not navigate away

#### Scenario: Login is loading
- **WHEN** the login request is in flight
- **THEN** the submit button shows a loading state and further submissions are disabled

#### Scenario: Login page is accessible when already authenticated
- **WHEN** a logged-in user navigates to `/login`
- **THEN** the app redirects them to `/events`

### Requirement: User can log out
The app SHALL allow an authenticated user to log out, clearing all auth tokens.

#### Scenario: Successful logout
- **WHEN** an authenticated user taps "Log out"
- **THEN** the app clears `tmd_auth_token` and `tmd_refresh_token` from localStorage, resets auth state to guest, and returns to `/events`

### Requirement: Auth token is silently refreshed
The app SHALL silently refresh an expired `authToken` using the stored `refreshToken` without requiring re-login.

#### Scenario: Auth token expires mid-session
- **WHEN** an API call returns 401 and a valid `refreshToken` exists
- **THEN** the app requests a new `authToken`, retries the original call, and the user notices no interruption

#### Scenario: Refresh token is also expired
- **WHEN** both tokens are expired or invalid
- **THEN** the app logs the user out and shows a brief notification prompting re-login

### Requirement: Auth state is persisted across page loads
The app SHALL restore auth state from localStorage on app start.

#### Scenario: Returning authenticated user
- **WHEN** a user reopens the app with a valid `refreshToken` stored
- **THEN** the app restores the authenticated session without showing a login prompt

#### Scenario: Returning guest user
- **WHEN** a user reopens the app with no token stored
- **THEN** the app starts in guest mode with no login prompt

### Requirement: Auth state is reflected in navigation
The app SHALL show login/logout affordances in the navigation based on current auth state.

#### Scenario: Guest user sees login link
- **WHEN** the user is not authenticated
- **THEN** a "Log in" link is visible in the header or navigation

#### Scenario: Authenticated user sees logout option
- **WHEN** the user is authenticated
- **THEN** the navigation shows the user's display name or email and a "Log out" action
