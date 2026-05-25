# Server-Sync Personal Data Specification

## ADDED Requirements

### Requirement: Server-Saved Events Sync

The app SHALL sync the user's saved/deselected events to the server after every add or remove operation, ensuring consistency across devices.

#### Scenario: Saved event is synced after add

- **WHEN** a user marks an event as saved
- **THEN** the change is sent to the server and persisted in the user's profile

#### Scenario: Deselected event is synced after remove

- **WHEN** a user removes a saved event
- **THEN** the server immediately reflects the deselected state

#### Scenario: Sync failure shows appropriate feedback

- **WHEN** a server sync operation fails (network error, 5xx server error)
- **THEN** the app displays an error message without blocking the user from continuing

#### Scenario: Duplicate requests are coalesced

- **WHEN** multiple save/deselect events are triggered rapidly
- **THEN** only the final state is synced to the server (coalescing / debouncing)

### Requirement: Server Sync for User Preferences

The app SHALL sync user preference data (display settings, theme, sort order) to the server.

#### Scenario: Displayed preferences are synced after change

- **WHEN** a user modifies a display preference in settings
- **THEN** the preference change is sent to the server within a short delay

#### Scenario: Sync happens only for authenticated users

- **WHEN** an unauthenticated user changes a preference
- **THEN** the preference is stored locally only, and no server call is made

### Requirement: Offline Sync Queue

The app SHALL queue pending sync operations locally when offline and replay them on reconnection.

#### Scenario: Sync is queued when offline

- **WHEN** a user is offline and triggers a save/deselect operation
- **THEN** the change is stored locally in a pending-sync queue

#### Scenario: Queue is replayed on reconnection

- **WHEN** the device regains connectivity
- **THEN** all pending sync operations are sent in order to the server

#### Scenario: Failed queued syncs are retried

- **WHEN** a queued sync operation fails on retry
- **THEN** it remains in the queue for future retry attempts (with a backoff strategy)

#### Scenario: Successful sync removes from queue

- **WHEN** a queued sync operation succeeds
- **THEN** the entry is removed from the pending-sync queue

### Requirement: Personal Data Privacy Compliance

The app SHALL ensure all server-synced personal data is sent over HTTPS, is not exposed in URLs or logs, and respects user consent preferences.

#### Scenario: All API requests use HTTPS

- **WHEN** the app sends any personal data to the server
- **THEN** the request is made exclusively over HTTPS

#### Scenario: Personal data is not logged

- **WHEN** sync operations execute
- **THEN** the payload details (e.g., event IDs, user preferences) are not printed to the console or any log output

#### Scenario: Data is gated by user consent

- **WHEN** the user has opted out of tracking/analytics
- **THEN** no tracking data (page views, events) is sent to the analytics server
