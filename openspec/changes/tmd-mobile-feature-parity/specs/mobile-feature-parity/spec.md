# Mobile Feature Parity Delta

## ADDED Requirements

### Requirement: Mobile App Foundation

TMD Mobile SHALL provide a SvelteKit PWA foundation that can run as a static Cloudflare Worker Assets app and consume TMD Core as its data source.

#### Scenario: App shell loads on a direct route

- GIVEN the static build is deployed through Worker Assets
- WHEN a user opens `/calendar` directly
- THEN the SPA fallback serves the app and the calendar route renders client-side

#### Scenario: API base is configurable

- GIVEN an operator sets `PUBLIC_TMD_API_BASE_URL`
- WHEN the app requests public event data
- THEN the request targets the configured TMD Core REST v3 base URL

### Requirement: Public Event Browsing Parity

TMD Mobile SHALL plan and implement public event browsing behavior that covers the highest-value TMD4 event archive and detail use cases.

#### Scenario: User previews upcoming events

- GIVEN TMD Core returns public event records
- WHEN the user opens the app home screen
- THEN the app shows upcoming event cards with title, date range, location, and feature badges when available

#### Scenario: User cannot reach TMD Core

- GIVEN TMD Core returns an error or CORS blocks the request
- WHEN the user opens a public event view
- THEN the app shows a readable error state and keeps navigation available

### Requirement: Feature Parity Roadmap

TMD Mobile SHALL maintain an OpenSpec-backed roadmap for event browsing, calendar, map, relationships, personal utility, and deployment readiness.

#### Scenario: Future work begins

- GIVEN a developer starts a new feature
- WHEN they inspect the OpenSpec artifacts
- THEN they can find the related requirements, design notes, and implementation tasks before editing code
