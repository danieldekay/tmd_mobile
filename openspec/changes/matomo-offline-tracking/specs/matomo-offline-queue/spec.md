# Matomo Offline Analytics Queue Specification

## ADDED Requirements

### Requirement: Offline Event Queue

The app SHALL buffer tracking events (page views, events) in `localStorage` when the device is offline, and send them when connectivity is restored.

#### Scenario: Page view is queued when offline

- **WHEN** the app is offline and a page view occurs
- **THEN** the page view command is stored in a queue in `localStorage` under a known key (e.g., `matomo-queue`)

#### Scenario: Event tracking commands are queued when offline

- **WHEN** the app is offline and a tracking event (e.g., `trackEvent(category, action)`) is called
- **THEN** the event command is stored in the same `localStorage` queue alongside page views

#### Scenario: Queue is persisted across page loads

- **WHEN** the app is reloaded while offline
- **THEN** previously queued events are still present and awaiting transmission

#### Scenario: Old queued events are discarded after max retries

- **WHEN** a queued event exceeds its retry count (e.g., 3 attempts) without success
- **THEN** the event is removed from the queue to prevent unbounded growth

### Requirement: Online Retry Mechanism

The app SHALL automatically flush the queued events to the Matomo server when connectivity is restored.

#### Scenario: Queue is flushed on going online

- **WHEN** the device transitions from offline to online
- **THEN** all events in the `localStorage` queue are sent to the Matomo server in order

#### Scenario: Successful sends remove events from queue

- **WHEN** a queued event is successfully received by Matomo
- **THEN** the event is removed from the `localStorage` queue

#### Scenario: Failed sends retry on next online event

- **WHEN** a queued event fails to send (network error, 5xx server response)
- **THEN** the event remains in the queue for retry on the next online transition

### Requirement: sendBeacon Fallback

The app SHALL use `navigator.sendBeacon()` for tracking events when available, providing reliable final-page-unload delivery.

#### Scenario: sendBeacon is used for track calls

- **WHEN** the tracking module sends a page view or event
- **THEN** `navigator.sendBeacon()` is used instead of `fetch` when the browser supports it

#### Scenario: Legacy fetch fallback for browsers without sendBeacon

- **WHEN** the browser does not support `navigator.sendBeacon()`
- **THEN** the tracking module falls back to a `fetch` with `keepalive: true`

#### Scenario: Tracking survives page unload with sendBeacon

- **WHEN** a user navigates away from the app while offline
- **THEN** any queued events are persisted and will retry on the next session (no data loss from page unload)

### Requirement: Heartbeat Ping for Long-Lived Sessions

The app SHALL send a Matomo heartbeat ping (`_pk_ping`) on a periodic interval (30 seconds) to maintain session data in long-lived PWA sessions.

#### Scenario: Heartbeat fires while in standalone PWA mode

- **WHEN** the PWA is running in standalone mode and has been open for more than one heartbeat interval
- **THEN** a `_pk_ping` / `heartbeat.ping` request is sent to Matomo

#### Scenario: Heartbeat respects online status

- **WHEN** the device is offline
- **THEN** the heartbeat ping is NOT sent, and the heartbeat interval is paused or skipped

#### Scenario: Heartbeat is silent on failure

- **WHEN** a heartbeat ping fails (network error)
- **THEN** no error toast or alert is shown to the user (failures are swallowed silently)

### Requirement: PWA Display Mode Tracking

The app SHALL track the PWA display mode (`standalone` vs `browser`) as a custom Matomo dimension.

#### Scenario: Standalone display mode is tracked

- **WHEN** the app loads in standalone PWA mode (via `navigator.standalone === true`)
- **THEN** the Matomo `_setCustomDimension` call is made with the display mode set to `standalone`

#### Scenario: Browser display mode is tracked

- **WHEN** the app loads in a regular browser tab (not installed)
- **THEN** the Matomo `_setCustomDimension` call is made with the display mode set to `browser`

### Requirement: Consent-Respecting Tracking

All Matomo tracking calls (page views, events, heartbeat, display mode) MUST respect the user's stored consent state.

#### Scenario: Page views are blocked without consent

- **WHEN** a user has not consented to analytics
- **THEN** no page view events are sent to Matomo, regardless of online status

#### Scenario: Events are blocked without consent

- **WHEN** a user has rejected analytics tracking
- **THEN** no event calls (e.g., `trackEvent`) are sent to Matomo, whether online or offline

#### Scenario: Heartbeat is blocked without consent

- **WHEN** a user has not consented to tracking
- **THEN** no heartbeat pings are sent or queued

#### Scenario: Consent is checked before dispatching queued events

- **WHEN** a previously rejected user later grants consent
- **THEN** the pre-consent queued events are NOT automatically flushed (only post-consent events are tracked)
