## MODIFIED Requirements

### Requirement: Map page shows filter panel

The `/map` page SHALL display an `EventFilters` panel above the map so users can filter which events are plotted as markers.

#### Scenario: Filter panel is rendered above map

- **WHEN** a user visits `/map`
- **THEN** the `EventFilters` component is shown above the Leaflet map container

#### Scenario: Map markers update on filter change

- **WHEN** a user changes any filter in the panel
- **THEN** `getEvents()` is called with the new filters and map markers are redrawn to reflect filtered results

#### Scenario: Loading state during re-fetch

- **WHEN** a filter change triggers a re-fetch
- **THEN** a loading indicator is shown and the search input is disabled until results arrive

#### Scenario: Filter panel is collapsible on mobile

- **WHEN** the viewport is narrow (< `sm` breakpoint)
- **THEN** the filter panel is initially collapsed and a toggle button reveals it, preserving map height

---

### Requirement: Calendar page shows filter panel

The `/calendar` page SHALL display an `EventFilters` panel above the month grid.

#### Scenario: Filter panel is rendered above calendar

- **WHEN** a user visits `/calendar`
- **THEN** the `EventFilters` component is shown above the month-grouped event list

#### Scenario: Calendar month groups update on filter change

- **WHEN** a user changes any filter
- **THEN** the month-grouped list re-renders using the filtered events

#### Scenario: Empty state when no events match

- **GIVEN** filters result in zero matching events
- **WHEN** the calendar page renders
- **THEN** a "No events match your filters" message is shown with a "Clear filters" link
