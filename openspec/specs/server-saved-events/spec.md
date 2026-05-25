## ADDED Requirements

### Requirement: Authenticated user's saved events are persisted to TMD server
The app SHALL sync saved event IDs to the TMD Core personal data endpoint for authenticated users.

#### Scenario: User saves an event while authenticated
- **WHEN** an authenticated user taps the save toggle on an event card or detail page
- **THEN** the event is immediately shown as saved (optimistic), and a `POST /wp-json/tmd/v3/user/saved-events` request is sent; if the request fails, the saved state is rolled back

#### Scenario: User unsaves an event while authenticated
- **WHEN** an authenticated user taps the save toggle on an already-saved event
- **THEN** the event is immediately shown as unsaved (optimistic), and a `DELETE /wp-json/tmd/v3/user/saved-events/{id}` request is sent; if the request fails, the saved state is rolled back

#### Scenario: Saved events hydrated from server on load
- **WHEN** an authenticated user opens the app or navigates to a page with save toggles
- **THEN** the app calls `GET /wp-json/tmd/v3/user/saved-events` and populates saved state from the server response, overriding any local state

#### Scenario: Guest user's save actions use localStorage only
- **WHEN** an unauthenticated user taps the save toggle
- **THEN** the event is saved to or removed from localStorage with no server call

### Requirement: Saved events page shows server-synced data for authenticated users
The app SHALL show the full saved events list from the server when authenticated.

#### Scenario: Authenticated user views saved events
- **WHEN** an authenticated user navigates to `/saved`
- **THEN** the app loads saved events from `GET /wp-json/tmd/v3/user/saved-events` and displays them

#### Scenario: Server saved events endpoint unavailable
- **WHEN** the server endpoint returns an error
- **THEN** the app falls back to localStorage saved IDs and shows the local saved list; a non-blocking error notice informs the user

#### Scenario: Authenticated user has no saved events
- **WHEN** the server returns an empty list and localStorage is also empty
- **THEN** the empty state message is shown with a link to browse events
