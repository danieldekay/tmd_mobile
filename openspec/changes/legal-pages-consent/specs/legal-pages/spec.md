# legal-pages Specification

## ADDED Requirements

### Requirement: Impressum Page

The app SHALL serve an Impressum (legal notice) page at `/impressum` with a Svelte component.

#### Scenario: Impressum route resolves

- **WHEN** a user navigates to `/impressum`
- **THEN** the `src/routes/impressum/+page.svelte` component renders

#### Scenario: Impressum displays organizer information

- **WHEN** a user visits the `/impressum` page
- **THEN** the page displays organizer name, address, contact details, and relevant legal entity information

#### Scenario: Impressum page uses consistent layout

- **WHEN** a user visits the `/impressum` page
- **THEN** it uses the same app shell, font styles, and border styling as the rest of the app

### Requirement: Datenschutzerklärung (Privacy Policy) Page

The app SHALL serve a Datenschutzerklärung page at `/datenschutz` with a Svelte component.

#### Scenario: Datenschutz route resolves

- **WHEN** a user navigates to `/datenschutz`
- **THEN** the `src/routes/datenschutz/+page.svelte` component renders

#### Scenario: Datenschutzerklärung describes data practices

- **WHEN** a user visits the `/datenschutz` page
- **THEN** the page describes what personal data is collected, how it is used, and user rights under GDPR/DSGVO

#### Scenario: Datenschutz page uses consistent styling

- **WHEN** a user visits the `/datenschutz` page
- **THEN** it uses the same app shell, font styles, and border styling as the rest of the app

### Requirement: Cookie-Richtlinie Page

The app SHALL serve a Cookie-Richtlinie (cookie policy) page at `/cookie-richtlinie` with a Svelte component.

#### Scenario: Cookie-Richtlinie route resolves

- **WHEN** a user navigates to `/cookie-richtlinie`
- **THEN** the `src/routes/cookie-richtlinie/+page.svelte` component renders

#### Scenario: Cookie-Richtlinie describes cookie usage

- **WHEN** a user visits the `/cookie-richtlinie` page
- **THEN** the page describes what cookies are used, their purpose, and how to manage them

### Requirement: Reusable Legal Page Component

The app SHALL include a reusable `LegalPage` component (`src/lib/components/LegalPage.svelte`) for rendering any legal page content in a consistent style.

#### Scenario: LegalPage component renders a title and body

- **WHEN** `LegalPage` is used with a `title` and `content` prop
- **THEN** it renders the title as an `<h1>` heading and body content in a readable layout

#### Scenario: LegalPage supports print-friendly rendering

- **WHEN** a user prints or uses print-preview on a legal page
- **THEN** the layout adapts for print (removing navigation, using proper margins and text colors)

#### Scenario: LegalPage is responsive on mobile

- **WHEN** a user opens a legal page on a small-screen device
- **THEN** the content remains readable with appropriate padding and font sizes

### Requirement: Legal Pages Footer Navigation

The app SHALL include links to Impressum, Datenschutzerklärung, and Cookie-Richtlinie in the footer or a dedicated legal pages menu.

#### Scenario: Footer contains legal page links

- **WHEN** a user scrolls to the footer of any page
- **THEN** links for Impressum, Datenschutzerklärung, and Cookie-Richtlinie are visible

#### Scenario: Footer legal links navigate to internal routes

- **WHEN** a user clicks a footer link to a legal page
- **THEN** the app navigates to the corresponding internal route (e.g., `/impressum`) instead of an external URL
