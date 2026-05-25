# legal-pages Specification

## Requirement: Impressum Page

The app SHALL serve an Impressum (legal notice) page at `/impressum` with a Svelte component.

### Scenario: Impressum route resolves

- WHEN a user navigates to `/impressum`
- THEN the `src/routes/impressum/+page.svelte` component renders

### Scenario: Impressum displays organizer information

- WHEN a user visits the `/impressum` page
- THEN the page displays organizer name, address, contact details, and relevant legal entity information

### Scenario: Impressum page uses consistent layout

- WHEN a user visits the `/impressum` page
- THEN it uses the same app shell, font styles, and border styling as the rest of the app

## Requirement: Datenschutzerklärung (Privacy Policy) Page

The app SHALL serve a Datenschutzerklärung page at `/datenschutz` with a Svelte component.

### Scenario: Datenschutz route resolves

- WHEN a user navigates to `/datenschutz`
- THEN the `src/routes/datenschutz/+page.svelte` component renders

### Scenario: Datenschutzerklärung describes data practices

- WHEN a user visits the `/datenschutz` page
- THEN the page describes what personal data is collected, how it is used, and user rights under GDPR/DSGVO

### Scenario: Datenschutz page uses consistent styling

- WHEN a user visits the `/datenschutz` page
- THEN it uses the same app shell, font styles, and border styling as the rest of the app

## Requirement: Cookie-Richtlinie Page

The app SHALL serve a Cookie-Richtlinie (cookie policy) page at `/cookie-richtlinie` with a Svelte component.

### Scenario: Cookie-Richtlinie route resolves

- WHEN a user navigates to `/cookie-richtlinie`
- THEN the `src/routes/cookie-richtlinie/+page.svelte` component renders

### Scenario: Cookie-Richtlinie describes cookie usage

- WHEN a user visits the `/cookie-richtlinie` page
- THEN the page describes what cookies are used, their purpose, and how to manage them

## Requirement: Changelog ("Was ist neu") Page

The app SHALL serve a changelog page at `/was-ist-neu` showing recent updates and changes.

### Scenario: Changelog route resolves

- WHEN a user navigates to `/was-ist-neu`
- THEN the `src/routes/was-ist-neu/+page.svelte` component renders

### Scenario: Changelog shows updates

- WHEN a user visits the `/was-ist-neu` page
- THEN the page displays recent updates and changes

## Requirement: Footer Navigation to Legal Pages

The app SHALL include links to Impressum, Datenschutzerklärung, and Cookie-Richtlinie in the footer.

### Scenario: Footer contains legal page links

- WHEN a user scrolls to the footer of any page
- THEN links for Impressum, Datenschutzerklärung, and Cookie-Richtlinie are visible

### Scenario: Footer legal links navigate to internal routes

- WHEN a user clicks a footer link to a legal page
- THEN the app navigates to the corresponding internal route (e.g., `/impressum`) instead of an external URL
