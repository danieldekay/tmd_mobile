## ADDED Requirements

### Requirement: Design System Token Set

The app SHALL define a canonical set of CSS custom-property tokens in `src/app.css` that all components consume. The tokens SHALL match the TMD Endless Summer 2026 palette and typography specification.

#### Scenario: Acid Lemon token is used on dark backgrounds only

- **WHEN** Acid Lemon (`--acid`) is applied as a text or icon colour
- **THEN** the background MUST be Void Black (`--void`) to maintain WCAG AA contrast

#### Scenario: All semantic alias tokens resolve correctly

- **WHEN** a component uses `bg-canvas`, `text-ink`, `bg-primary`, `text-primary`, `bg-accent`, `shadow-panel`
- **THEN** each token resolves to the corresponding Endless Summer palette value

#### Scenario: Typography tokens are applied globally

- **WHEN** any heading element (`h1`–`h3`) is rendered
- **THEN** the Space Grotesk display font is applied with tight line-height (`1.12`) and bold weight

#### Scenario: Body text uses Inter

- **WHEN** body copy or UI labels are rendered
- **THEN** the Inter (or Geist) font is applied with utility line-height (`1.55`)

#### Scenario: Hard shadows render on elevated elements

- **WHEN** a `.panel` or `.button-primary` element is displayed
- **THEN** a 4px × 4px hard drop-shadow with zero blur and `#09090B` colour is applied

#### Scenario: Zero border-radius is applied globally

- **WHEN** any `.panel`, `.button-primary`, `.button-secondary`, or `.nav-link` element is rendered
- **THEN** border-radius is `0` (sharp corners, no rounding)

#### Scenario: Focus ring uses brand accent

- **WHEN** a keyboard user focuses any interactive element
- **THEN** a 3px solid `--acid` outline appears at 2px offset (ensuring WCAG 2.1 AA focus visibility)
