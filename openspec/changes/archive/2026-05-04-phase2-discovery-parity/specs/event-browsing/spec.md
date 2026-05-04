## MODIFIED Requirements

### Requirement: Upcoming Event List
The app SHALL show a mobile-first list of upcoming tango marathon events with country, city, date-range, and registration-state filter controls.

#### Scenario: Filter controls are visible
- **WHEN** the user is on `/events`
- **THEN** filter controls for country, city, month/date range, and registration state are accessible without leaving the list view

#### Scenario: Filtered state persists in URL
- **WHEN** the user applies one or more filters
- **THEN** the URL query params reflect the active filters for bookmarking and sharing

#### Scenario: Back navigation preserves filters
- **WHEN** the user navigates from a filtered event list to an event detail and then back
- **THEN** the filter state is restored from the URL
