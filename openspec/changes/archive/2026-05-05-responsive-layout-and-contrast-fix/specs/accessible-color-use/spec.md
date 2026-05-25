## ADDED Requirements

### Requirement: Foreground text on primary-color backgrounds SHALL use ink color
All text rendered on a `bg-primary` (acid yellow `#D4FF00`) surface SHALL use `text-ink` (near-black) to ensure a minimum contrast ratio of 4.5:1 per WCAG AA. The `text-white` color SHALL NOT be used on `bg-primary` surfaces.

#### Scenario: Event detail header is legible
- **WHEN** a user opens an event detail page
- **THEN** the header banner (title, location, edition, categories) uses dark text readable against the yellow background

#### Scenario: DJ detail header is legible
- **WHEN** a user opens a DJ detail page
- **THEN** the header banner uses dark ink text, not white

#### Scenario: Event-series detail header is legible
- **WHEN** a user opens an event-series detail page
- **THEN** the header banner uses dark ink text, not white

#### Scenario: Secondary and tertiary text maintains hierarchy
- **WHEN** a user views a detail page header
- **THEN** secondary text (edition, sub-labels) uses `text-ink/70` and tertiary uses `text-ink/60`, providing visible hierarchy without white

#### Scenario: SaveToggle on primary background is legible
- **WHEN** the SaveToggle is rendered on a `bg-primary` banner
- **THEN** its icon and background use ink-compatible colors (not white overrides)
