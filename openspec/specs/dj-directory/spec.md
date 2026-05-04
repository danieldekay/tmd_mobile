# Spec: DJ Directory

## Requirement: DJ Directory List

The app SHALL provide a browsable DJ list with links to individual DJ profiles.

### Scenario: DJ list loads successfully

- WHEN the user opens /djs and the endpoint returns DJ records
- THEN the app shows each DJ's name, location metadata, and a link to their detail page

### Scenario: DJ list is loading

- WHEN the DJ list request is in flight
- THEN the page shows a skeleton loading state without hiding navigation

### Scenario: DJ list is empty

- WHEN the endpoint returns no DJ records
- THEN the app shows an empty state message

## Requirement: DJ Detail Page

The app SHALL provide a DJ detail page showing profile information and connected events.

### Scenario: DJ detail loads successfully

- GIVEN a DJ record exists in TMD Core
- WHEN the user opens /djs/[id]
- THEN the app shows the DJ's name, location, links, biography when available, and a list of their upcoming connected events

### Scenario: Connected events are shown

- WHEN the DJ has upcoming connected events
- THEN each event is shown with title, date, and location linking to the event detail

## Requirement: Event Series Detail Page

The app SHALL provide a series detail page showing series metadata and edition history.

### Scenario: Series detail loads successfully

- GIVEN a series exists in TMD Core
- WHEN the user opens /event-series/[id]
- THEN the app shows the series name, description, and a chronological list of editions linking to individual event detail pages

### Scenario: Series has no upcoming editions

- WHEN all series events are in the past
- THEN the series page still renders with past editions listed and a note that no upcoming editions are scheduled
