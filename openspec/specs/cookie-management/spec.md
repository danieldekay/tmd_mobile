# cookie-management Specification

## Purpose

The app SHALL provide users the ability to manage their cookie/analytics preferences.

## Requirements

### Requirement: Consent Revocation UI

The app SHALL provide a way for users to revoke or modify their previously given consent at any time.

#### Scenario: User can access consent management

- **WHEN** a user navigates to a consent management page or settings entry
- **THEN** they can view their current consent state and change it

#### Scenario: User can revoke analytics consent

- **WHEN** a user revokes their analytics consent
- **THEN** the tracking is stopped and the consent record in localStorage is updated to reflect rejection

#### Scenario: Revocation takes effect immediately

- **WHEN** a user revokes analytics consent
- **THEN** any ongoing tracking (Matomo/\_paq) is stopped or will not fire on the next page load

### Requirement: Consent Preference Center

The app SHALL include a preference center page (e.g., `/cookie-preferences`) where users can manage their cookie/analytics preferences.

#### Scenario: Cookie preferences page exists

- **WHEN** a user navigates to `/cookie-preferences`
- **THEN** the page displays current consent states and allows modification

#### Scenario: Preference changes are persisted

- **WHEN** a user updates their cookie preferences
- **THEN** the new preferences are saved to localStorage immediately

### Requirement: Entry Point to Cookie Management

The app SHALL provide a persistent link to cookie/privacy management from a visible UI location.

#### Scenario: Footer link to cookie management

- **WHEN** a user views any page
- **THEN** a link to cookie/privacy preferences is visible in the footer alongside other legal page links

#### Scenario: User can access cookie management from consent banner

- **WHEN** a user has previously accepted consent and revisits
- **THEN** they can still access cookie preferences via a footer link or settings entry to change their choice
