# Spec: Event Featured Images

## Requirement: Featured Image on Event List Cards

The app SHALL display a featured image thumbnail on event list cards when the API provides one.

### Scenario: Event has a featured image

- GIVEN the events list response includes `_embedded.wp:featuredmedia` for an event
- WHEN the event list card renders
- THEN the card shows the `thumbnail` (150×150) sized image with `loading="lazy"`
- AND the image uses `object-fit: cover` within a fixed-aspect-ratio container

### Scenario: Event has no featured image

- GIVEN the events list response has no featured media for an event
- WHEN the event list card renders
- THEN the card shows a placeholder block in the TMD accent colour
- AND the layout does not shift or collapse

## Requirement: Featured Image on Event Detail Header

The app SHALL display a banner-sized featured image at the top of the event detail page.

### Scenario: Event has a featured image

- GIVEN the event detail response includes `_embedded.wp:featuredmedia`
- WHEN the event detail page renders
- THEN the page shows the `event-banner-small` (960×540) sized image as a full-width header
- AND falls back to `source_url` if that specific size is absent

### Scenario: Event has no featured image

- GIVEN the event detail has no featured media
- WHEN the event detail page renders
- THEN no image element is rendered (the header shows title and meta only)

## Requirement: Graceful Degradation

The app SHALL NOT display broken image icons or layout shifts when images are unavailable.

### Scenario: Image URL is present but image fails to load

- WHEN the browser fails to load a featured image
- THEN the image element is hidden or replaced by the placeholder
