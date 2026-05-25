## ADDED Requirements

### Requirement: Event Category Display
The app SHALL show event taxonomy categories (e.g. Marathon, Encuentro, Festival) on each event list card and on the event detail header.

#### Scenario: Event has one or more categories
- **WHEN** the events list or detail page renders and the event has categories from the `event-categories-2020` taxonomy
- **THEN** each category name is displayed as a pill/badge on the list card and in the detail header

#### Scenario: Event has no categories
- **WHEN** an event has no taxonomy terms assigned
- **THEN** no category pills are shown; layout does not leave an empty gap

#### Scenario: Categories embedded via _embed parameter
- **WHEN** the `getEvents` call includes `?_embed=wp:term`
- **THEN** category terms are available in the response without a second request per event

#### Scenario: Categories on detail page
- **WHEN** the user opens `/events/[id]`
- **THEN** category pills are visible in the event header section alongside the title
