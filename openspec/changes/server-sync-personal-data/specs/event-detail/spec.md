## MODIFIED Requirements

### Requirement: Event Detail Page
The app SHALL show all available information for a single event. The header area SHALL include a save toggle that reflects server-side saved state for authenticated users and localStorage state for guests.

#### Scenario: Event detail loads successfully
- **WHEN** a user navigates to `/events/[id]`
- **THEN** the app shows the event title, full date range, city, country, venue, registration date, description, links, and a save toggle in the header

#### Scenario: Event is loading
- **WHEN** the event detail endpoint request is in flight
- **THEN** the app shows a skeleton or loading state

#### Scenario: Event not found
- **WHEN** the endpoint returns 404 or no matching event
- **THEN** the app shows a not-found message with a back link to the events list

#### Scenario: Event cannot load
- **WHEN** the endpoint returns an error
- **THEN** the app shows a retryable error state

#### Scenario: User navigates back to event list
- **WHEN** a user taps the back link on the detail page
- **THEN** the app navigates to `/events`

#### Scenario: Authenticated user saves an event from detail
- **WHEN** an authenticated user taps the save toggle in the event header
- **THEN** the app updates save state optimistically and syncs to the server

#### Scenario: Registration date reminder for authenticated user
- **WHEN** an authenticated user taps "Remind me" for an event with a registration date
- **THEN** a local notification is scheduled and, if the server supports reminder storage, also persisted to the server
