## ADDED Requirements

### Requirement: User Profile Page

The app SHALL provide a `/profile` route that displays the authenticated user's name, email address, and avatar image. Unauthenticated users who navigate to `/profile` SHALL be redirected to `/login`.

#### Scenario: Authenticated user views profile

- **WHEN** an authenticated user navigates to `/profile`
- **THEN** the page displays the user's display name, email address, and avatar (or an initials fallback if no avatar URL is available)

#### Scenario: Unauthenticated access redirected

- **WHEN** an unauthenticated user navigates to `/profile`
- **THEN** the app redirects to `/login`

#### Scenario: Profile loads from persisted data on cold start

- **GIVEN** the user was previously logged in and their user data was persisted to localStorage
- **WHEN** the user opens the app without a network connection
- **THEN** the profile page displays the cached name, email, and avatar without a network request

#### Scenario: Avatar fails to load

- **WHEN** the user's avatar image URL is absent or the image request fails
- **THEN** the app displays an initials-based fallback avatar using the user's display name

#### Scenario: Logout from profile page

- **WHEN** the authenticated user taps the "Log out" button on the profile page
- **THEN** the auth state is cleared, localStorage tokens and user data are removed, and the user is redirected to the home page

### Requirement: User Identity Chip in Header

The app header SHALL display the logged-in user's name (and avatar thumbnail if available) as a tappable chip that links to `/profile` when the user is authenticated. When unauthenticated, the header SHALL show the "Log in" button as it does today.

#### Scenario: Authenticated header state

- **WHEN** the user is authenticated
- **THEN** the header shows a chip with the user's display name (and avatar thumbnail) linking to `/profile`, replacing the "Log in" button

#### Scenario: Unauthenticated header state

- **WHEN** the user is not authenticated
- **THEN** the header shows the "Log in" button as before

#### Scenario: Header chip is accessible

- **WHEN** a screen reader or keyboard user focuses the header chip
- **THEN** the chip has an accessible label indicating it navigates to the user profile (e.g. "View profile for <name>")

### Requirement: User Details Persisted on Login

After a successful login (by any method), the app SHALL persist the user's id, name, email, and avatarUrl to localStorage and restore them on the next app load without requiring an additional network request.

#### Scenario: User data stored after password login

- **WHEN** the user successfully logs in with username and password
- **THEN** the user's id, name, email, and avatarUrl are stored in localStorage and the authState store reflects them

#### Scenario: User data restored on app reload

- **GIVEN** the user previously logged in and their data is in localStorage
- **WHEN** the app initialises (`initAuth()` is called)
- **THEN** authState is populated with the persisted user object without a network call

#### Scenario: Stale user data refreshed when token refreshes

- **GIVEN** no user data is in localStorage but a valid refreshToken is
- **WHEN** `initAuth()` successfully refreshes the auth token
- **THEN** a `viewer` GraphQL query is issued to fetch current user details and they are stored

#### Scenario: User data cleared on logout

- **WHEN** `logout()` is called
- **THEN** user data is removed from localStorage and `authState.user` is set to null
