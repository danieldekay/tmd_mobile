# Spec: Legal Pages + Privacy Consent Enhancement

## Purpose

Add legal pages (Impressum, Datenschutzerklärung, Cookie-Richtlinie, Was ist neu) and
privacy consent management to tmd_mobile for German/EU compliance. Currently tmd_mobile
has NO legal pages and NO privacy consent.

## Scenarios

### Scenario: Impressum page

- **GIVEN** user navigates to /impressum
- **WHEN** page loads
- **THEN** Impressum content shown
- **AND** legal info visible

### Scenario: Privacy page

- **GIVEN** user opens /datenschutz
- **WHEN** page loads
- **THEN** privacy policy shown
- **AND** DSGVO info visible

### Scenario: Cookie policy

- **GIVEN** user opens /cookie-richtlinie
- **WHEN** page loads
- **THEN** cookie policy shown
- **AND** info visible

### Scenario: Changelog

- **GIVEN** user opens /was-ist-neu
- **WHEN** page loads
- **THEN** changelog shown
- **AND** updates visible

### Scenario: Accept consent

- **GIVEN** user opens app
- **AND** no consent set
- **WHEN** user accepts
- **THEN** consent stored
- **AND** matomo enabled

### Scenario: Reject consent

- **GIVEN** no consent set
- **AND** user rejects
- **WHEN** rejected
- **THEN** consent stored
- **AND** matomo disabled

### Scenario: Manage consent

- **GIVEN** consent set
- **WHEN** user changes preference
- **THEN** consent updated
- **AND** matomo updated

### Scenario: Consent stored

- **GIVEN** user accepts/rejects
- **WHEN** stored
- **THEN** consent saved
- **AND** persists

### Scenario: Consent check

- **GIVEN** consent checked
- **WHEN** matomo queried
- **THEN** consent returned
- **AND** matomo gated

### Scenario: Privacy page shown

- **GIVEN** user navigates to /impressum
- **WHEN** page shown
- **THEN** legal info shown
- **AND** content visible
