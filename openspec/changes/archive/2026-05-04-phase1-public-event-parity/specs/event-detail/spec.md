# Event Detail Delta

## MODIFIED Requirements

### Requirement: Event Detail Parity

The app SHALL provide a detail page at `/events/[id]` implemented in `src/routes/events/[id]/+page.svelte`, consuming TMD Core v3 `/tmd/v3/events/{id}`.

#### Scenario: User opens an event detail

- **GIVEN** an event exists in TMD Core
- **WHEN** the user opens `/events/[id]`
- **THEN** the app shows date range, registration date, location, venue, contact links, website/social links, price, features, DJs, teachers, and series relationships when available

#### Scenario: Event has registration timing

- **GIVEN** an event has a registration start date
- **WHEN** the detail page renders
- **THEN** the registration date is visible near the primary event actions

#### Scenario: Event detail is loading

- **WHEN** the detail endpoint request is in flight
- **THEN** the page shows a skeleton loading state and retains the back-navigation affordance

#### Scenario: Event not found

- **WHEN** the requested event ID does not exist in TMD Core
- **THEN** the app shows a not-found message and a link back to the event list

#### Scenario: Event detail cannot load

- **GIVEN** the endpoint returns a network or CORS error
- **WHEN** the user opens an event detail page
- **THEN** the app shows a retryable error message without a blank screen

#### Scenario: User navigates back to event list

- **WHEN** a user is on `/events/[id]`
- **THEN** a clear back or close affordance returns them to `/events`
