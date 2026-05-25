## MODIFIED Requirements

### Requirement: Event Detail Page

The app SHALL display complete event detail including: title, date range, location, venue, categories, badges, price, featured banner image, description (when present), address with map link (when present), contact info, social links, DJs, teachers, and series.

#### Scenario: Event detail shows banner image

- **GIVEN** the event detail response includes a featured image
- **WHEN** the event detail page renders
- **THEN** the `event-banner-small` (960×540) image is shown as a full-width header banner

#### Scenario: Event detail shows description

- **GIVEN** an event has a non-empty `description` field
- **WHEN** the event detail page renders
- **THEN** the description is shown as formatted text below the primary event meta

#### Scenario: Event detail shows address with map link

- **GIVEN** an event has a non-empty `address` field
- **WHEN** the event detail page renders
- **THEN** the address is displayed with a link that opens an external maps service

#### Scenario: Event has no description or address

- **GIVEN** an event has empty `description` and `address` fields
- **WHEN** the event detail page renders
- **THEN** neither the description section nor the address row is rendered
