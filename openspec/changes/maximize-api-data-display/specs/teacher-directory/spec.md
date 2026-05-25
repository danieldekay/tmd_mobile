## NEW Requirements

### Requirement: Teacher Directory List

The app SHALL provide a browsable teacher list at `/teachers`.

#### Scenario: Teacher list loads successfully

- **GIVEN** the TMD Core teachers endpoint returns teacher records
- **WHEN** the user opens /teachers
- **THEN** the app shows each teacher's name, city, country, and a link to their detail page
- **AND** teachers with a profile photo show a thumbnail avatar

#### Scenario: Teacher list is loading

- **WHEN** the teacher list request is in flight
- **THEN** the page shows a skeleton loading state

#### Scenario: Teacher list is empty

- **WHEN** the endpoint returns no teacher records
- **THEN** the app shows an empty state message

### Requirement: Teacher Detail Page

#### Scenario: Teacher detail loads successfully

- **GIVEN** a teacher record exists
- **WHEN** the user opens /teachers/[id]
- **THEN** the app shows name, location, profile photo when available, bio when present, style when present, and linked events list

#### Scenario: Teacher has connected events

- **GIVEN** the teacher detail response embeds linked events
- **WHEN** the detail page renders
- **THEN** each event is shown with title and date linking to the event detail page

#### Scenario: Teacher does not exist

- **GIVEN** an id that matches no teacher
- **WHEN** the user navigates to /teachers/[id]
- **THEN** the app shows a not-found error state

### Requirement: Teacher Navigation

- **WHEN** the user taps the Teachers nav item
- **THEN** the app navigates to /teachers
