## NEW Requirements

### Requirement: Event Featured Images on List Cards

The app SHALL display a featured image thumbnail on event list cards when available.

#### Scenario: Event has a featured image

- **GIVEN** the events list response includes `_embedded.wp:featuredmedia` for an event
- **WHEN** the event list card renders
- **THEN** the card shows the `thumbnail` (150×150) image with `loading="lazy"` in a fixed-aspect-ratio container

#### Scenario: Event has no featured image

- **GIVEN** the events list response has no featured media for an event
- **WHEN** the event list card renders
- **THEN** a placeholder block in the TMD accent colour is shown and no layout shift occurs

### Requirement: Featured Image on Event Detail Header

#### Scenario: Event detail shows banner image

- **GIVEN** the event detail response includes `_embedded.wp:featuredmedia`
- **WHEN** the event detail page renders
- **THEN** the `event-banner-small` (960×540) size is shown as a full-width header
- **AND** the app falls back to `source_url` if that specific size is absent

### Requirement: Graceful Image Degradation

- **WHEN** the browser fails to load a featured image
- **THEN** the placeholder is shown without a broken-image icon
