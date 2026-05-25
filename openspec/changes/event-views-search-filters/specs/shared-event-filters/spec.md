## ADDED Requirements

### Requirement: Shared EventFilters component

The app SHALL provide a reusable `EventFilters.svelte` component that encapsulates all filter controls and URL sync logic.

#### Scenario: Filter controls are rendered

- **WHEN** `<EventFilters bind:filters>` is rendered on any page
- **THEN** it displays controls for: text search (q), country, city, date-after, date-before, and registration state

#### Scenario: Filter state syncs to URL

- **WHEN** a user changes any filter value
- **THEN** the URL search params are updated via `goto()` with the corresponding param keys (`q`, `country`, `city`, `after`, `before`, `reg`)

#### Scenario: Filter state reads from URL on mount

- **WHEN** a page mounts with existing URL params
- **THEN** the `EventFilters` component initialises its state from those URL params

#### Scenario: Active filter count badge is shown

- **WHEN** one or more filters are non-empty
- **THEN** the filter bar displays a count of active filters (e.g., "2 filters active") and a "Clear all" control

#### Scenario: Text search is debounced

- **WHEN** a user types in the search field
- **THEN** the `onchange` callback fires only after 300ms of inactivity, not on every keystroke

---

### Requirement: Client-side text search

`TmdEventFilters.search` SHALL be applied client-side after API fetch across event title, city, and country.

#### Scenario: Search matches title

- **GIVEN** events are loaded and `filters.search = "Berlin"`
- **WHEN** `getEvents()` applies client-side filtering
- **THEN** only events whose title contains "Berlin" (case-insensitive) are returned

#### Scenario: Search matches city or country

- **GIVEN** `filters.search = "Germany"`
- **WHEN** `getEvents()` applies client-side filtering
- **THEN** events whose city or country contains "Germany" are included

#### Scenario: Empty search returns all results

- **GIVEN** `filters.search = ""`
- **WHEN** `getEvents()` runs
- **THEN** no additional client-side filtering is applied
