## MODIFIED Requirements

### Requirement: DJ Detail Page

The app SHALL display complete DJ profile including biography, style, social links, and played events list.

#### Scenario: DJ has biography

- **GIVEN** a DJ record has a non-empty `bio` field
- **WHEN** the DJ detail page renders
- **THEN** the biography text is shown in an "About" section

#### Scenario: DJ has style tag

- **GIVEN** a DJ record has a non-empty `style` field
- **WHEN** the DJ detail page renders
- **THEN** the style is shown as a tag or badge

#### Scenario: DJ has played events

- **GIVEN** the DJ detail response includes embedded events
- **WHEN** the DJ detail page renders
- **THEN** each event is shown with title, date, and location linking to the event detail page

#### Scenario: DJ has no played events

- **GIVEN** the DJ's embedded events array is empty
- **WHEN** the DJ detail page renders
- **THEN** a "No events recorded" message is shown in the events section
