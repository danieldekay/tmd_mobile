## MODIFIED Requirements

### Requirement: Event Detail Parity
The app SHALL provide a detail page for each event with the most important public TMD4 event information.

The detail header SHALL display: title, edition (when present), category pills, date range, registration date, location, venue, contact links, website/social links, price, features, DJs, teachers, and series relationships when available.

#### Scenario: User opens an event detail
- **GIVEN** an event exists in TMD Core
- **WHEN** the user opens `/events/[id]`
- **THEN** the app shows date range, registration date, location, venue, contact links, website/social links, price, features, DJs, teachers, and series relationships when available

#### Scenario: Event has categories
- **GIVEN** an event has taxonomy terms in `event-categories-2020`
- **WHEN** the detail page renders
- **THEN** category pills are shown in the header section, above or alongside the title

#### Scenario: Event has an edition
- **GIVEN** an event has an `edition` field value
- **WHEN** the detail page renders
- **THEN** the edition (e.g. "Ed. 11") is displayed near the title in a secondary text style

#### Scenario: Event has registration timing
- **GIVEN** an event has a registration start date
- **WHEN** the detail page renders
- **THEN** the registration date is visible near the primary event actions

#### Scenario: Event detail is loading
- **WHEN** the detail endpoint request is in flight
- **THEN** the app shows skeleton placeholders for all major sections without shifting layout

#### Scenario: Event not found
- **GIVEN** an invalid or deleted event ID is requested
- **WHEN** the app fetches `/events/[id]`
- **THEN** the app shows a "not found" message with a link back to the events list
