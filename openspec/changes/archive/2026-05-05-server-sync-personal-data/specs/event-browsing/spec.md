## MODIFIED Requirements

### Requirement: Upcoming Event List
The app SHALL show a mobile-first list of upcoming tango marathon events from TMD Core. Each event card SHALL include a save toggle that reflects server-side saved state for authenticated users and localStorage state for guests.

#### Scenario: Events load successfully
- **WHEN** a user opens the app or `/events`
- **THEN** the app shows event title, date range, city, country, venue when available, major feature badges, and a save toggle on each card

#### Scenario: Events are loading
- **WHEN** the events endpoint request is in flight
- **THEN** the app shows a skeleton or spinner loading state without hiding the navigation

#### Scenario: Events cannot load
- **WHEN** the endpoint returns an error or CORS blocks the request
- **THEN** the app shows a clear retryable error state without hiding navigation

#### Scenario: No upcoming events
- **WHEN** the endpoint returns an empty list
- **THEN** the app shows an empty state message explaining no events are scheduled

#### Scenario: User is offline
- **WHEN** the device has no network connection and no cached events are available
- **THEN** the app shows an offline indicator and does not show a blank screen

#### Scenario: User taps an event
- **WHEN** a user taps an event card in the list
- **THEN** the app navigates to `/events/[id]` for that event

#### Scenario: Authenticated user saves an event from the list
- **WHEN** an authenticated user taps the save toggle on an event card
- **THEN** the app updates save state optimistically and syncs to the server
