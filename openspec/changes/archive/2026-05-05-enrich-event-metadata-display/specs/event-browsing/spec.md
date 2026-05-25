## MODIFIED Requirements

### Requirement: Upcoming Event List
The app SHALL show a mobile-first list of upcoming tango marathon events from TMD Core.

Each list card SHALL display: event title, date range (start and end when available), city, country, venue when available, event category pills, edition tag when present, and major feature badges.

#### Scenario: Events load successfully
- **GIVEN** the TMD Core events endpoint returns events
- **WHEN** a user opens the app or `/events`
- **THEN** the app shows event title, date range, city, country, venue when available, category pills, edition tag, and major feature badges

#### Scenario: Event has an end date
- **GIVEN** the API returns `end_date` for an event (via `?meta_fields=end_date`)
- **WHEN** the list card renders
- **THEN** the date displays as a range "DD MMM – DD MMM YYYY" rather than a single date

#### Scenario: Event has no end date
- **GIVEN** the API does not return `end_date` for an event
- **WHEN** the list card renders
- **THEN** only the start date is shown; no broken or empty date range is visible

#### Scenario: Event has an edition
- **GIVEN** an event has an `edition` field value (e.g. `11`)
- **WHEN** the list card renders
- **THEN** the edition is shown as "Ed. 11" in a secondary text style near the title

#### Scenario: Event has categories
- **GIVEN** the events list response embeds `wp:term` categories
- **WHEN** a list card renders
- **THEN** category pill(s) are visible on the card (e.g. "Marathon", "Encuentro")

#### Scenario: Events are loading
- **WHEN** the events endpoint request is in flight
- **THEN** the app shows a skeleton or spinner loading state without hiding the navigation

#### Scenario: Events cannot load
- **GIVEN** the endpoint returns an error or CORS blocks the request
- **WHEN** the list attempts to render
- **THEN** the app shows an error message with a retry option
