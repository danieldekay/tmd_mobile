# Spec: PWA Update Detection

## Purpose

Add PWA update detection to tmd_mobile to ensure users always have the latest version.
Currently tmd_mobile has no mechanism to detect when a new deployment is available.

## Scenarios

### Scenario: Update detected

- **GIVEN** app version changed on server
- **AND** app is running old version
- **WHEN** app checks for update
- **THEN** update is detected
- **AND** banner shown

### Scenario: No update

- **GIVEN** app on latest version
- **AND** no changes on server
- **WHEN** app checks for update
- **THEN** no update detected
- **AND** no banner shown

### Scenario: User dismisses banner

- **GIVEN** update banner displayed
- **WHEN** user closes banner
- **THEN** banner hidden
- **AND** next check scheduled for 24h later

### Scenario: Check interval

- **GIVEN** update check ran
- **WHEN** 1 hour passed
- **THEN** not check again (respect interval)
- **AND** next check scheduled

### Scenario: Offline check

- **GIVEN** no internet
- **WHEN** app tries to check
- **THEN** check fails silently
- **AND** no error shown

### Scenario: Check on startup

- **GIVEN** app opens
- **WHEN** update check runs
- **THEN** check completes
- **AND** result processed

### Scenario: Reload on update

- **GIVEN** update available
- **AND** user clicks "Reload"
- **WHEN** reload happens
- **THEN** app reloads
- **AND** new version loaded

### Scenario: Check version

- **GIVEN** app loads
- **WHEN** version check happens
- **THEN** version compared
- **AND** result correct

### Scenario: Version mismatch

- **GIVEN** local version != remote version
- **WHEN** comparison happens
- **THEN** mismatch detected
- **AND** banner shown

### Scenario: Version match

- **GIVEN** local version == remote version
- **WHEN** comparison happens
- **THEN** match detected
- **AND** no banner
