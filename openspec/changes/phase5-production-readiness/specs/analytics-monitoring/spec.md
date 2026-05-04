## ADDED Requirements

### Requirement: Analytics and monitoring
The app SHALL collect consent-aware, privacy-respecting analytics in production and SHALL have uptime monitoring configured.

#### Scenario: Analytics event is tracked
- **GIVEN** the user has not opted out of analytics
- **WHEN** the user navigates between routes
- **THEN** the page view is tracked in the configured analytics tool without sending personally identifiable information

#### Scenario: Uptime alert fires
- **GIVEN** uptime monitoring is configured for `https://mobile.tangomarathons.com`
- **WHEN** the root URL returns a non-2xx response
- **THEN** an alert is sent to the operator within 5 minutes
