# Spec: Teacher Directory

## Requirement: Teacher Directory List

The app SHALL provide a browsable teacher list at `/teachers` with links to individual profiles.

### Scenario: Teacher list loads successfully

- WHEN the user opens /teachers and the endpoint returns teacher records
- THEN the app shows each teacher's name, city, country, and a link to their detail page
- AND teachers with a profile photo show a thumbnail avatar

### Scenario: Teacher list is loading

- WHEN the teacher list request is in flight
- THEN the page shows a skeleton loading state without hiding navigation

### Scenario: Teacher list is empty

- WHEN the endpoint returns no teacher records
- THEN the app shows an empty state message

## Requirement: Teacher Detail Page

The app SHALL provide a teacher detail page at `/teachers/[id]` showing profile information.

### Scenario: Teacher detail loads successfully

- GIVEN a teacher record exists in TMD Core
- WHEN the user opens /teachers/[id]
- THEN the app shows the teacher's name, location (city + country), profile photo when available, and a list of connected events

### Scenario: Teacher has connected events

- WHEN the teacher has events linked in `_embedded.events`
- THEN each event is shown with title, date, and location linking to the event detail page

### Scenario: Teacher has no connected events

- WHEN the teacher's events array is empty
- THEN the detail page shows "No events recorded" in the events section

### Scenario: Teacher does not exist

- GIVEN an id that does not match any teacher
- WHEN the user navigates to /teachers/[id]
- THEN the app shows a not-found error state

## Requirement: Teacher Navigation

The app SHALL include Teachers in the bottom navigation bar.

### Scenario: User navigates to Teachers

- WHEN the user taps the Teachers nav item
- THEN the app navigates to /teachers

## Requirement: Teacher links on event detail

The app SHALL link teacher names on event detail pages to the corresponding teacher profile at `/teachers/[id]`.

### Scenario: Teacher link is resolvable

- WHEN an event detail lists teachers and the teacher has a known ID
- THEN each teacher name is a clickable link pointing to `/teachers/[id]`

### Scenario: Teacher ID is unavailable

- WHEN a teacher name has no associated ID in the event relationship data
- THEN the teacher name is shown as plain text without a broken link
