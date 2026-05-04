# Event Browsing Delta

## MODIFIED Requirements

### Requirement: Upcoming Event List

The app SHALL show a mobile-first list of upcoming tango marathon events fetched from TMD Core v3 `/tmd/v3/events`. The list SHALL be implemented as the `/events` route in `src/routes/events/+page.svelte`.

#### Scenario: Events load successfully

- **WHEN** a user opens `/events` and the TMD Core endpoint returns events
- **THEN** the app shows each event's title, date range, city, country, venue (when available), and major feature badges

#### Scenario: Events are loading

- **WHEN** the events endpoint request is in flight
- **THEN** the app shows a skeleton or spinner loading state without hiding the navigation

#### Scenario: Events cannot load

- **GIVEN** the endpoint returns an error or CORS blocks the request
- **WHEN** a user opens the event list view
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
