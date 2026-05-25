## MODIFIED Requirements

### Requirement: Upcoming Event List

The app SHALL show a mobile-first list of upcoming tango marathon events from TMD Core.

Each list card SHALL display: event title, date range, city, country, venue when available, category pills, edition tag when present, major feature badges, and a featured image thumbnail when available.

#### Scenario: Events load successfully

- **GIVEN** the TMD Core events endpoint returns events
- **WHEN** a user opens the app or `/events`
- **THEN** the app shows event title, date range, city, country, venue, category pills, edition tag, badges, and a featured image thumbnail when the event has one

#### Scenario: Event card shows featured image

- **GIVEN** an event has a featured image returned in the list response
- **WHEN** the event list card renders
- **THEN** the card shows the thumbnail image with lazy loading and no layout shift

#### Scenario: Event has no featured image

- **GIVEN** an event has no featured image
- **WHEN** the event list card renders
- **THEN** a placeholder block is shown and the card layout does not shift

#### Scenario: Event card shows price

- **GIVEN** an event has a non-empty `price` field
- **WHEN** the event list card renders
- **THEN** the card shows the formatted price (with currency when available)
