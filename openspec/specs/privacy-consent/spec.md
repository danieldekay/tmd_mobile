# privacy-consent Specification

## Purpose

The app SHALL display a cookie/privacy consent banner on first visit and persist user consent choices.

## Requirements

### Requirement: Consent Banner Component

The app SHALL display a cookie/privacy consent banner on first visit before any analytics tracking.

#### Scenario: Consent banner displays on first visit

- **WHEN** a new user (no prior consent recorded) loads any page
- **THEN** a consent banner appears explaining cookie/analytics usage and offering accept/reject options

#### Scenario: Consent banner is dismissible

- **WHEN** a user is viewing the consent banner
- **THEN** they can dismiss it by either accepting or rejecting the consent options

#### Scenario: Consent banner respects app visual style

- **WHEN** the consent banner is displayed
- **THEN** it uses the same visual design language (colors, fonts, borders, padding) as the rest of the app

#### Scenario: Consent banner is accessible

- **WHEN** a user navigates the consent banner with a screen reader
- **THEN** all options and descriptions are announced clearly with proper ARIA attributes

### Requirement: Consent Storage

The app SHALL persist user consent choices using `localStorage` so they survive page reloads and sessions.

#### Scenario: Consent is saved on accept

- **WHEN** a user accepts the consent banner
- **THEN** the acceptance decision is stored in `localStorage`

#### Scenario: Consent is saved on reject

- **WHEN** a user rejects the consent banner
- **THEN** the rejection decision is stored in `localStorage`

#### Scenario: Consent is re-read on next visit

- **WHEN** a returning user (consent already in localStorage) loads the app
- **THEN** the consent banner does NOT appear again unless consent was previously rejected or revoked

#### Scenario: Consent data has a defined structure

- **WHEN** consent is stored in `localStorage`
- **THEN** it follows a consistent key and structure, e.g., `{ "tmd_consent": { "analytics": true, "timestamp": "ISO-8601" } }`

### Requirement: Consent Gating Check

The app SHALL check stored consent before allowing any analytics or tracking code to execute.

#### Scenario: No tracking without consent

- **WHEN** a user has NOT given analytics consent (or has rejected it)
- **THEN** Matomo/tracker initialization code is NOT called

#### Scenario: Tracking proceeds with consent

- **WHEN** a user HAS given analytics consent
- **THEN** Matomo/tracker initialization proceeds normally on app load
