## ADDED Requirements

### Requirement: DJ directory list
The app SHALL provide a paginated DJ list at `/djs` in `src/routes/djs/+page.svelte`, consuming TMD Core v3 `/tmd/v3/djs`.

#### Scenario: DJ list loads successfully
- **WHEN** the user opens `/djs` and the TMD Core endpoint returns DJ records
- **THEN** the app shows each DJ's name, location metadata, and a link to their detail page

#### Scenario: DJ list is loading
- **WHEN** the DJ list request is in flight
- **THEN** the page shows a skeleton loading state without hiding navigation

#### Scenario: DJ list is empty
- **WHEN** the endpoint returns no DJ records
- **THEN** the app shows an empty state message

### Requirement: DJ detail page
The app SHALL provide a DJ detail page at `/djs/[id]` in `src/routes/djs/[id]/+page.svelte`, showing profile info and upcoming connected events.

#### Scenario: DJ detail loads successfully
- **GIVEN** a DJ record exists in TMD Core
- **WHEN** the user opens `/djs/[id]`
- **THEN** the app shows the DJ's name, location, links, biography (if available), and a list of their upcoming connected events

#### Scenario: Connected events are shown
- **WHEN** the DJ has upcoming connected events
- **THEN** each event is shown with title, date, and location and links to `/events/[id]`

### Requirement: Event series detail page
The app SHALL provide a series detail page at `/event-series/[id]` in `src/routes/event-series/[id]/+page.svelte`, showing series metadata and edition history.

#### Scenario: Series detail loads successfully
- **GIVEN** a series exists in TMD Core
- **WHEN** the user opens `/event-series/[id]`
- **THEN** the app shows the series name, description, and a chronological list of editions linking to individual event detail pages

#### Scenario: Series has no upcoming editions
- **WHEN** all series events are in the past
- **THEN** the series page still renders with past editions listed and a note that no upcoming editions are scheduled
