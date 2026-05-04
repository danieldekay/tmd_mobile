## ADDED Requirements

### Requirement: Teacher Directory List

The app SHALL provide a browsable teacher list at `/teachers` backed by `/wp-json/tmd/v3/teachers`.

#### Scenario: Teacher list loads successfully

- **WHEN** the user opens `/teachers` and the endpoint returns teacher records
- **THEN** the app shows each teacher's name, location metadata, and a link to their detail page

#### Scenario: Teacher list is loading

- **WHEN** the teacher list request is in flight
- **THEN** the page shows a skeleton loading state without hiding navigation

#### Scenario: Teacher list is empty

- **WHEN** the endpoint returns no teacher records
- **THEN** the app shows an empty state message ("No teachers found")

#### Scenario: Teacher list fetch fails

- **WHEN** the endpoint returns an error or is unreachable
- **THEN** the app shows an error state with a retry option and does not crash

### Requirement: Teacher Detail Page

The app SHALL provide individual teacher profiles at `/teachers/[id]`.

#### Scenario: Teacher profile loads

- **WHEN** the user navigates to `/teachers/[id]` and the endpoint returns a teacher record
- **THEN** the app shows the teacher's name, bio or description, location, and linked upcoming events if available

#### Scenario: Teacher profile not found

- **WHEN** the endpoint returns 404 for the requested teacher id
- **THEN** the app shows a "Teacher not found" message and a link back to `/teachers`

#### Scenario: Teacher detail is loading

- **WHEN** the teacher detail request is in flight
- **THEN** the page shows a skeleton loading state without hiding navigation

### Requirement: Teacher links on event detail

The app SHALL link teacher names on event detail pages to the corresponding teacher profile at `/teachers/[id]`.

#### Scenario: Teacher link is resolvable

- **WHEN** an event detail lists teachers and the teacher has a known ID
- **THEN** each teacher name is a clickable link pointing to `/teachers/[id]`

#### Scenario: Teacher ID is unavailable

- **WHEN** a teacher name has no associated ID in the event relationship data
- **THEN** the teacher name is shown as plain text without a broken link
