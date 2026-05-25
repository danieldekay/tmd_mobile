# Neo Brutalist Design System Specification

## ADDED Requirements

### Requirement: Design Token System

The app SHALL define a cohesive design token system under `:root` and `@theme` in `src/app.css` using TailwindCSS 4's native CSS variable approach.

#### Scenario: Color tokens are defined on :root

- **WHEN** the app loads any page
- **THEN** `--color-canvas`, `--color-panel`, `--color-ink`, `--color-primary`, `--color-accent`, `--color-info` are exposed as RGB CSS variables on `:root`

#### Scenario: Typography tokens use Google variable fonts

- **WHEN** styling text on any page
- **THEN** `--font-sans` resolves to 'Inter' (variable font) and `--font-display` resolves to 'Space Grotesk' (variable font)

#### Scenario: Shadow tokens produce neo-brutalist hard shadows

- **WHEN** applying `shadow-panel` or `shadow-control` via Tailwind classes
- **THEN** panels have a 4px right and 4px bottom offset black shadow, and controls have a 2px offset black shadow

#### Scenario: Border-radius tokens are sharp (brutalist)

- **WHEN** applying `rounded-control` or `rounded-panel` classes
- **THEN** elements render with 0px border-radius (sharp corners, neo-brutalist style)

### Requirement: Base Component Styles

The app SHALL provide reusable Tailwind utility classes for core UI components in `src/app.css` `@layer components`.

#### Scenario: `.panel` class creates bordered surface

- **WHEN** a component uses `class="panel"`
- **THEN** it renders with a 2px bold border, panel background, and neo-brutalist shadow

#### Scenario: `.button-primary` class creates an interactive button

- **WHEN** a button uses `class="button-primary"`
- **THEN** it renders with a 2px bold border, primary color background, bold text, shadow, and hover-invert state (black bg, primary text)

#### Scenario: `.button-secondary` class creates an outline button

- **WHEN** a button uses `class="button-secondary"`
- **THEN** it renders with a 2px bold border, panel background, shadow on all sides, and hover-to-fill state

#### Scenario: `.nav-link` and `.nav-link-active` style navigation

- **WHEN** a nav link is in active or idle state
- **THEN** active links have a bold border, primary background, and ink text; idle links have transparent border, ink text, and hover-to-border state

#### Scenario: `.eyebrow` class creates uppercase section headers

- **WHEN** an element uses `class="eyebrow"`
- **THEN** it renders as small, uppercase, tracking-wide text at 60% opacity

### Requirement: Responsive Layout Shell

The app SHALL include a `.app-shell` layout that constrains content to a mobile-first max-width on all screens and works correctly as a PWA in standalone mode.

#### Scenario: App shell is centered and constrained

- **WHEN** the `.app-shell` layout is applied
- **THEN** content is centered, constrained to `max-w-xl`, and spans the full screen width on narrow devices

#### Scenario: Sticky header works on scroll

- **WHEN** a user scrolls past the page header
- **THEN** the header remains sticky at the top with a bottom border, and does not obscure page content

#### Scenario: Footer appears at bottom of any content length

- **WHEN** a page has less content than the viewport height
- **THEN** the footer is pushed to the bottom of the viewport using flex column layout

#### Scenario: Skip-to-content link is accessible

- **WHEN** a keyboard user presses Tab on page load
- **THEN** a "Skip to content" link appears as the first focusable element and navigates to the main content area

### Requirement: Print-Friendly Styles for Legal Pages

The app SHALL export print-specific CSS rules that produce clean, readable printed legal pages.

#### Scenario: Print removes navigation and interactive elements

- **WHEN** a user prints or uses Print Preview on a legal page
- **THEN** the navigation bar, footer, and any interactive elements are hidden

#### Scenario: Print uses high-contrast ink-on-paper colors

- **WHEN** a user prints a legal page
- **THEN** text color becomes black and background becomes white

#### Scenario: Print uses proper page-break behavior

- **WHEN** a legal page has multiple sections
- **THEN** each section avoids breaking mid-block, and headers trigger a page break before them

### Requirement: PWA Install Card Component

The app SHALL include a `PwaInstallCard` component that detects the user's browser and OS, and shows the appropriate install call-to-action.

#### Scenario: Install card detects Chrome on Android

- **WHEN** a user on Chrome Android views the installer card
- **THEN** a single "Install App" button is shown that triggers the native `beforeinstallprompt`

#### Scenario: Install card detects Safari on iOS

- **WHEN** a user on Safari iOS views the installer card
- **THEN** instructions are shown for "Add to Home Screen" with a step-by-step guide modal

#### Scenario: Install card detects already-installed PWA

- **WHEN** a user has already installed the PWA (running standalone)
- **THEN** the install card is hidden or shows a "App Installed" confirmation

#### Scenario: Install card detects unsupported browser

- **WHEN** a user on an unsupported browser views the installer card
- **THEN** a text message explains the app works best when installed

#### Scenario: Install card can be dismissed

- **WHEN** a user clicks the close button on the install card
- **THEN** the card is removed from the DOM

### Requirement: Landing Page Layout

The app SHALL provide a structured landing page (`/`) composed of Hero, Features, Directory, Install, and Explore sections with responsive behavior.

#### Scenario: Landing page displays hero above the fold

- **WHEN** a user loads the `/` route
- **THEN** the hero section with branding and a brief description is visible without scrolling

#### Scenario: Landing page features section renders as single column on mobile

- **WHEN** a user on a mobile device views `FeaturesSection`
- **THEN** each feature card is displayed in a single column with icon and title

#### Scenario: Landing page directory section shows cities grid

- **WHEN** a user views the `DirectorySection`
- **THEN** a grid of city names is displayed with a link to the main directory

#### Scenario: Landing page PWA install section only shows on non-installed devices

- **WHEN** a user has not installed the PWA
- **THEN** the `PwaInstallCard` component is rendered in the install section

#### Scenario: Landing page respects reduced-motion preference

- **WHEN** a user has `prefers-reduced-motion` set to `reduce`
- **THEN** page fade-in animations and transitions are disabled
