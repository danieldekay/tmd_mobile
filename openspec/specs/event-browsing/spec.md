# Spec: Event Browsing

## Requirement: Upcoming Event List

The app SHALL show a mobile-first list of upcoming tango marathon events from TMD Core.

### Scenario: Events load successfully

- GIVEN the TMD Core events endpoint returns events
- WHEN a user opens the app or `/events`
- THEN the app shows event title, date range, city, country, venue when available, and major feature badges

### Scenario: Events are loading

- WHEN the events endpoint request is in flight
- THEN the app shows a skeleton or spinner loading state without hiding the navigation

### Scenario: Events cannot load

- GIVEN the endpoint returns an error or CORS blocks the request
- WHEN a user opens an event list view
- THEN the app shows a clear retryable error state without hiding navigation

### Scenario: No upcoming events

- WHEN the endpoint returns an empty list
- THEN the app shows an empty state message explaining no events are scheduled

### Scenario: User is offline

- WHEN the device has no network connection and no cached events are available
- THEN the app shows an offline indicator and does not show a blank screen

### Scenario: User taps an event

- WHEN a user taps an event card in the list
- THEN the app navigates to `/events/[id]` for that event

## Requirement: Event Filtering

The app SHALL support filters equivalent to the most important TMD4 event archive controls.

### Scenario: User filters by country

- GIVEN events exist in multiple countries
- WHEN the user selects a country filter
- THEN the list narrows to matching events and keeps the selected filter visible

### Scenario: Filter controls are visible

- WHEN the user is on `/events`
- THEN filter controls for country, city, date range, and registration state are accessible without leaving the list view

### Scenario: Filtered state persists in URL

- WHEN the user applies one or more filters
- THEN the URL query params reflect the active filters for bookmarking and sharing

### Scenario: Back navigation preserves filters

- WHEN the user navigates from a filtered event list to an event detail and then back
- THEN the filter state is restored from the URL
