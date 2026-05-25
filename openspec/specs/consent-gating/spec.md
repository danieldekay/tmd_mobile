# consent-gating Specification

## Purpose

Trackers (Matomo/analytics) SHALL be gated behind user consent to comply with GDPR/E-Privacy requirements.

## Requirements

### Requirement: Tracking Initialization Gate

The app SHALL gate Matomo/tracker initialization behind a consent check function.

#### Scenario: Tracker is not initialized without consent

- **WHEN** the app boots and user analytics consent is NOT recorded as accepted
- **THEN** the Matomo tracker (`_paq.push`) calls are NOT executed

#### Scenario: Tracker is initialized with consent

- **WHEN** the app boots and user analytics consent IS recorded as accepted
- **THEN** the Matomo tracker (`_paq.push`) calls execute normally

#### Scenario: Consent check is synchronous

- **WHEN** the gate function is called
- **THEN** it returns immediately based on localStorage content without awaiting async operations

### Requirement: Deferred Tracking After Consent

The app SHALL allow deferred tracking initialization after consent is given at runtime.

#### Scenario: Tracker initializes after late consent

- **WHEN** a user initially rejects consent but later changes their mind and accepts
- **THEN** the tracker initializes immediately after acceptance without requiring a page reload

#### Scenario: No tracking data is backfilled

- **WHEN** a user had previously rejected consent and then accepts
- **THEN** only post-acceptance page views are tracked (no retroactive backfilling)
