## MODIFIED Requirements

### Requirement: Map Displays Event Locations

The app SHALL display event locations on a map using coordinates fetched from the list endpoint, without requiring per-event detail fetches.

#### Scenario: Map uses list-level coordinates

- **GIVEN** the event list endpoint returns `lat` and `lng` for events via `meta_fields`
- **WHEN** the map view renders
- **THEN** markers are placed using list-level coordinates without fetching individual event details

#### Scenario: Events without coordinates are excluded

- **GIVEN** some events have null or empty `lat`/`lng` fields
- **WHEN** the map builds the marker set
- **THEN** only events with valid numeric coordinates are included as markers
