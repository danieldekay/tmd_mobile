## MODIFIED Requirements

### Requirement: Event detail header uses accessible text color
The event detail page header banner SHALL use `text-ink` for all text. The `text-white` color SHALL NOT be used on the `bg-primary` banner. Child text opacity modifiers SHALL use `text-ink/N` variants.

#### Scenario: Event header text is readable on yellow background
- **WHEN** a user views an event detail page
- **THEN** the title, location, date, edition, and category badges all use dark text on the yellow header
- **THEN** no text uses white or light color on the yellow banner

#### Scenario: Layout shell header does not overlap on narrow phones
- **WHEN** the user views any page on a phone narrower than 375 px
- **THEN** the brand title and the auth/settings buttons in the header do not overlap
- **THEN** the brand title truncates with an ellipsis if the viewport is too narrow to show it fully
