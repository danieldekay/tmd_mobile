## ADDED Requirements

### Requirement: Table view on /events

The `/events` page SHALL offer a compact table view as an alternative to the card grid.

#### Scenario: Default view is cards

- **WHEN** a user navigates to `/events` without a `?view=` param
- **THEN** the card grid layout is displayed

#### Scenario: Table view is activated via URL param

- **WHEN** the URL contains `?view=table`
- **THEN** the compact `EventTable` layout is displayed instead of cards

#### Scenario: View toggle button switches modes

- **WHEN** a user clicks the table/card toggle button in the filter bar
- **THEN** `?view=table` (or absence of the param) is added/removed from the URL

#### Scenario: Table shows required columns

- **WHEN** the table view is active
- **THEN** each row shows: event name (linked to detail), dates, city/country, registration status badge

#### Scenario: Table rows are tappable links

- **WHEN** a user taps any row in the table
- **THEN** they are navigated to `/events/[id]`
