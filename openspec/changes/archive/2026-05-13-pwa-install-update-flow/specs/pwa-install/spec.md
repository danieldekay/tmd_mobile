# PWA Install + Update Detection Specification

## ADDED Requirements

### Requirement: PWA Install Prompt Flow

The app SHALL implement a guided PWA install experience that detects the user's browser, triggers the native install prompt, and provides fallback instructions for unsupported browsers.

#### Scenario: Native install prompt is triggered for supported browsers

- **WHEN** a user on Chrome, Edge, Opera, Brave, or Samsung Internet initiates installation
- **THEN** the `beforeinstallprompt` event's `prompt()` method is called, displaying the browser's native install dialog

#### Scenario: Install prompt is only triggered once per session

- **WHEN** a user dismisses the install prompt
- **THEN** the prompt is NOT shown again during the same browsing session

#### Scenario: Install succeeds and user is informed

- **WHEN** the user accepts the install prompt
- **THEN** an "App Installed" confirmation or visual feedback is shown

#### Scenario: Install is dismissed gracefully

- **WHEN** the user dismisses or declines the install prompt
- **THEN** no error message is shown, and the user continues browsing normally

### Requirement: Platform-Specific Install Guidance

The app SHALL provide browser/OS-specific guidance for PWA installation.

#### Scenario: iOS Safari user receives manual instructions

- **WHEN** a user on Safari iOS views install guidance
- **THEN** the app displays the "Add to Home Screen" menu selection with a description of the steps

#### Scenario: Firefox user receives a link to documentation

- **WHEN** a user on Firefox views install guidance
- **THEN** the app provides a link to web app installation documentation (e.g., MDN) or disables the install button with "coming soon" text

#### Scenario: Unsupported browser shows fallback messaging

- **WHEN** a user on an unsupported browser views install guidance
- **THEN** the app displays text indicating the app works best when installed, without breaking the browsing experience

### Requirement: PWA Update Detection

The app SHALL detect when a new service worker or build is available and notify the user to reload.

#### Scenario: Service worker update is detected

- **WHEN** a new version of the app is deployed and the service worker finds an updated cache
- **THEN** a "New version available" indicator or banner is shown to the user

#### Scenario: User can reload to apply the update

- **WHEN** the reload/update banner is displayed
- **THEN** clicking the reload button calls `window.location.reload()` and the updated app loads

#### Scenario: Update is shown only when a new version exists

- **WHEN** no new service worker version is available
- **THEN** the update banner is not shown

### Requirement: Update Banner Component

The app SHALL include a `PwaUpdateBanner` component that displays a reload prompt and can be dismissed.

#### Scenario: Banner shows "New Update" messaging

- **WHEN** the update banner component renders
- **THEN** it shows a brief message that a new version is available and a button to reload

#### Scenario: Banner can be dismissed for the current session

- **WHEN** a user dismisses the update banner
- **THEN** the banner is hidden for the remainder of the current session

#### Scenario: Banner respects reduced-motion preference

- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** the banner appears without animation transitions

### Requirement: Reusable PWA Install State Hook

The app SHALL provide a `PwaInstallState` store (or reactive variable) that reports the current PWA install status for use across components.

#### Scenario: Install state reflects whether app is installable

- **WHEN** the `PwaInstallState` is checked
- **THEN** its `canInstall` property is `true` if the browser supports installation, `false` otherwise

#### Scenario: Install state reflects whether app is already installed

- **WHEN** the PWA is running in standalone mode (already installed)
- **THEN** the `PwaInstallState` reflects `isInstalled: true`

#### Scenario: Install state updates on installation

- **WHEN** a user installs the PWA during a session
- **THEN** the `PwaInstallState` updates to reflect the installed state and triggers a UI update
