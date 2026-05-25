## MODIFIED Requirements

### Requirement: Event filter panel is responsive on narrow screens
The events filter panel SHALL stack to a single column on viewports narrower than 640 px. The filter inputs SHALL be full-width on phones. The registration-state toggle buttons SHALL wrap to a new line rather than overflow their container.

#### Scenario: Filter panel renders correctly at 320 px
- **WHEN** a user views the events page at 320 px viewport width
- **THEN** each filter input (country, city, from, to) occupies the full available width as a single column
- **THEN** no input is clipped, overlapping, or horizontally scrollable

#### Scenario: Filter panel expands to two columns on wider screens
- **WHEN** a user views the events page at 640 px or wider
- **THEN** the filter inputs are arranged in a two-column grid

#### Scenario: Registration toggle wraps on small screens
- **WHEN** all three registration state buttons ("All", "Open now", "Opening soon") are visible
- **THEN** they wrap to a second row rather than overflow the container if the combined width exceeds the available space
