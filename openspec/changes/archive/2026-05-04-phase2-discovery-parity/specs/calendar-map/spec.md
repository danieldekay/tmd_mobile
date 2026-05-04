## MODIFIED Requirements

### Requirement: Upcoming Event List
The app SHALL show a mobile-first list of upcoming tango marathon events fetched from TMD Core v3 `/tmd/v3/events`. The list SHALL support country, city, date-range, and registration-state filters via URL query params. The list SHALL be implemented as the `/events` route in `src/routes/events/+page.svelte`.

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

#### Scenario: No events match active filters
- **WHEN** the user has active filters and no events match them
- **THEN** the app shows a filtered-empty state message distinct from the global empty state

#### Scenario: User is offline
- **WHEN** the device has no network connection and no cached events are available
- **THEN** the app shows an offline indicator and does not show a blank screen

#### Scenario: User taps an event
- **WHEN** a user taps an event card in the list
- **THEN** the app navigates to `/events/[id]` for that event

## MODIFIED Requirements

### Requirement: Calendar
The app SHALL provide a scrollable agenda view at `/calendar` in `src/routes/calendar/+page.svelte` that groups upcoming events and their registration-opening dates by month, using the same event data from TMD Core v3.

#### Scenario: User scans the month
- **GIVEN** future events exist
- **WHEN** the user opens `/calendar`
- **THEN** the app shows events grouped by month with event-start dates and registration-opening dates clearly distinguished

#### Scenario: Calendar is loading
- **WHEN** the calendar data is in flight
- **THEN** the page shows a loading state without hiding navigation

#### Scenario: No upcoming events
- **WHEN** no events exist in the future
- **THEN** the calendar shows an empty state message

#### Scenario: User taps a calendar event
- **WHEN** the user taps an event entry in the agenda
- **THEN** the app navigates to `/events/[id]` for that event

### Requirement: Map
The app SHALL provide a consent-aware map view at `/map` in `src/routes/map/+page.svelte` using Leaflet and OpenStreetMap tiles, showing events that have location data as markers.

#### Scenario: User opens map discovery
- **GIVEN** events have geocodable location data
- **WHEN** the user opens `/map`
- **THEN** the app shows a Leaflet map with event markers; tapping a marker opens the event detail

#### Scenario: Events lack location data
- **GIVEN** some events have no coordinates or geocodable address
- **WHEN** the map renders
- **THEN** those events are omitted from the map without causing an error; a count of omitted events may be shown

#### Scenario: Map is loading
- **WHEN** the map and event data are initialising
- **THEN** the page shows a loading state before the map renders

#### Scenario: Map provider unavailable
- **GIVEN** OSM tile requests fail (offline or CSP blocked)
- **WHEN** the user opens the map
- **THEN** the app shows a graceful fallback message rather than a broken map
