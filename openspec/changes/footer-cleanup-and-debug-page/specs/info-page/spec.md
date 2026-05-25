## ADDED Requirements

### Requirement: Info page is accessible at /info
The app SHALL provide a public route at `/info` that displays runtime and build information.

#### Scenario: User navigates to /info
- **WHEN** the user opens `/info`
- **THEN** the page renders without requiring authentication

#### Scenario: Info page shows app version and git hash
- **WHEN** the user views the `/info` page
- **THEN** the app version and git commit hash are displayed

#### Scenario: Info page shows API base URL
- **WHEN** the user views the `/info` page
- **THEN** the configured TMD Core API base URL is displayed

#### Scenario: Info page shows authentication state
- **WHEN** the user is logged in and views `/info`
- **THEN** the page shows "Logged in" and the username or email

#### Scenario: Info page shows anonymous state
- **WHEN** the user is not logged in and views `/info`
- **THEN** the page shows "Not logged in"

#### Scenario: Info page shows environment
- **WHEN** the user views the `/info` page
- **THEN** the page indicates whether the app is running in development or production (via `import.meta.env.MODE`)

#### Scenario: Direct route load
- **WHEN** the user opens `/info` directly via URL
- **THEN** the page renders correctly without any SPA navigation prerequisite
