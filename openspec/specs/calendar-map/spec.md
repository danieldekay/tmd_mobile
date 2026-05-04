# Spec: Calendar and Map

## Requirement: Calendar

The app SHALL provide a scrollable agenda view at `/calendar` that groups upcoming events and their registration-opening dates by month.

### Scenario: User scans the month

- GIVEN future events exist
- WHEN the user opens `/calendar`
- THEN the app shows events grouped by month with event-start dates and registration-opening dates clearly distinguished

### Scenario: Calendar is loading

- WHEN the calendar data is in flight
- THEN the page shows a loading state without hiding navigation

### Scenario: No upcoming events

- WHEN no events exist in the future
- THEN the calendar shows an empty state message

### Scenario: User taps a calendar event

- WHEN the user taps an event entry in the agenda
- THEN the app navigates to `/events/[id]` for that event

## Requirement: Map

The app SHALL provide a consent-aware map view at `/map` showing events that have location data as markers.

### Scenario: User opens map discovery

- GIVEN events have coordinates or geocodable locations
- WHEN the user opens `/map`
- THEN the app shows event markers on the map; tapping a marker opens the event detail

### Scenario: Events lack location data

- GIVEN some events have no coordinates or geocodable address
- WHEN the map renders
- THEN those events are omitted from the map without causing an error; a count of omitted events may be shown

### Scenario: Map is loading

- WHEN the map and event data are initialising
- THEN the page shows a loading state before the map renders

### Scenario: Map provider unavailable

- GIVEN OSM tile requests fail (offline or blocked)
- WHEN the user opens the map
- THEN the app shows a graceful fallback message rather than a broken map
