## ADDED Requirements

### Requirement: Server-Backed User Interactions

The app SHALL persist bookmarks and reminders to the authenticated user's TMD account via `/tmd/v3/user-interactions`.

---

#### Scenario: Bookmark is created on server when user is logged in

- **GIVEN** the user is authenticated
- **WHEN** the user taps the Save / bookmark button on an event
- **THEN** `POST /tmd/v3/user-interactions` is called with `interaction_type=bookmark`, `target_post_id=<eventId>`, `target_post_type=tmd_event`
- **AND** the returned server interaction ID is stored locally to enable future deletion

#### Scenario: Bookmark is deleted on server when user is logged in

- **GIVEN** the user is authenticated and has a bookmark for an event
- **WHEN** the user taps the Save button again to remove the bookmark
- **THEN** `DELETE /tmd/v3/user-interactions/{interactionId}` is called using the stored interaction ID
- **AND** the event disappears from the user's saved list

#### Scenario: Bookmarks are loaded from server on login

- **GIVEN** the user logs in
- **WHEN** the auth initialisation completes
- **THEN** `GET /tmd/v3/me/interactions?target_post_type=tmd_event` is called
- **AND** all returned `bookmark` and `reminder` interactions are loaded into the in-memory interaction store

#### Scenario: Reminder is created on server when user is logged in

- **GIVEN** the user is authenticated and an event has a `registrationDate`
- **WHEN** the user taps "Remind me when registration opens"
- **THEN** `POST /tmd/v3/user-interactions` is called with `interaction_type=reminder`, `target_post_id=<eventId>`, `target_post_type=tmd_event`, `expires_date=<registrationDate>`, `reminder_note=Registration opens for <eventTitle>`
- **AND** the returned interaction ID is stored locally

#### Scenario: Reminder is deleted on server when user is logged in

- **GIVEN** the user is authenticated and has a reminder for an event
- **WHEN** the user taps "Remove" on the reminder
- **THEN** `DELETE /tmd/v3/user-interactions/{reminderId}` is called
- **AND** the reminder state is removed

#### Scenario: Optimistic update with rollback on API failure

- **GIVEN** the user is authenticated and taps a bookmark or reminder button
- **WHEN** the API call fails with a network error or server error
- **THEN** the interaction state reverts to its previous value
- **AND** no broken interaction ID is stored

---

### Requirement: Authentication Gate

The app SHALL show a login prompt instead of immediately saving when the user is unauthenticated.

#### Scenario: Unauthenticated user taps bookmark button

- **GIVEN** the user is not logged in
- **WHEN** the user taps the Save / bookmark button on an event card or detail page
- **THEN** the button does NOT toggle and no local save occurs
- **AND** a pending action `{ action: 'bookmark', eventId }` is stored in `sessionStorage`
- **AND** the browser navigates to `/login?redirect=/events/<id>`

#### Scenario: Unauthenticated user taps reminder button

- **GIVEN** the user is not logged in and an event has a `registrationDate`
- **WHEN** the user taps "Log in to set a reminder"
- **THEN** a pending action `{ action: 'reminder', eventId, eventTitle, registrationDate }` is stored in `sessionStorage`
- **AND** the browser navigates to `/login?redirect=/events/<id>`

#### Scenario: Visual appearance of gate state

- **GIVEN** the user is not logged in
- **WHEN** an event card or detail page renders
- **THEN** the bookmark button shows `aria-label="Log in to save"` and a visually distinct (locked or dimmed) appearance
- **AND** the reminder button label reads "Log in to set a reminder"

---

### Requirement: Post-Login Pending Action Execution

The app SHALL execute any pending interaction after a successful login.

#### Scenario: Pending bookmark is saved after login

- **GIVEN** the user tapped bookmark while unauthenticated, triggering a redirect to `/login`
- **WHEN** the user completes login and the auth callback runs
- **THEN** the pending action is read from `sessionStorage`
- **AND** `saveEvent(eventId)` is called (which now writes to the server)
- **AND** the pending action is cleared from `sessionStorage`
- **AND** the user is navigated to the `redirect` query parameter URL (or `/events` as fallback)

#### Scenario: Pending reminder is scheduled after login

- **GIVEN** the user tapped the reminder button while unauthenticated
- **WHEN** the user completes login
- **THEN** `scheduleReminderWithSync(eventId, eventTitle, registrationDate)` is called
- **AND** the pending action is cleared and the user is redirected

#### Scenario: No pending action after login

- **GIVEN** the user navigates directly to `/login` without a pending action
- **WHEN** login completes
- **THEN** no interaction is executed and the user is redirected to `/events` (or the `redirect` param)

---

### Requirement: localStorage Migration on First Login

The app SHALL migrate any existing local-only bookmarks and reminders to the server on the user's first login.

#### Scenario: Existing bookmarks are migrated

- **GIVEN** the user has bookmarks in `localStorage` (from guest use) before their first login
- **WHEN** the auth callback runs after successful login
- **THEN** any bookmarked events not already on the server are bulk-created via `POST /tmd/v3/user-interactions/bulk`
- **AND** those event IDs are removed from `localStorage['tmd_saved_events']`

#### Scenario: Existing reminders are migrated

- **GIVEN** the user has reminders in `localStorage['tmd_reminders']` before their first login
- **WHEN** login completes
- **THEN** any reminders not already on the server are bulk-created with `interaction_type=reminder`
- **AND** those reminder entries are removed from `localStorage['tmd_reminders']`

#### Scenario: No local items to migrate

- **GIVEN** the user has no items in `localStorage` at login time
- **WHEN** `migrateLocalInteractions()` runs
- **THEN** no API call is made and the function returns silently
