## ADDED Requirements

### Requirement: Event filters
The app SHALL provide filter controls on the `/events` route for country, city, month/date range, and registration state. Filter state SHALL be reflected in URL query params.

#### Scenario: User filters by country
- **WHEN** the user selects a country from the country filter
- **THEN** the event list narrows to events in that country and the URL updates with `?country=<value>`

#### Scenario: User filters by city
- **WHEN** the user selects a city filter (after selecting a country where relevant)
- **THEN** the event list narrows to events in that city

#### Scenario: User filters by month or date range
- **WHEN** the user selects a month or custom date range
- **THEN** only events whose start date falls within that range are shown

#### Scenario: User filters by registration state
- **WHEN** the user selects a registration-state filter (e.g., open, upcoming, closed)
- **THEN** only events matching that registration state are shown

#### Scenario: User clears all filters
- **WHEN** the user activates a clear/reset control
- **THEN** all filters are removed and the full upcoming event list is shown

#### Scenario: Filtered URL is shared
- **WHEN** a user shares or bookmarks a filtered URL
- **THEN** opening that URL applies the same filters automatically
