## ADDED Requirements

### Requirement: Saved events
The app SHALL allow users to save and unsave events to device-local storage. Saved events SHALL be accessible in a dedicated saved-events view without requiring network access.

#### Scenario: User saves an event
- **WHEN** the user taps the save toggle on an event card or event detail page
- **THEN** the event is added to the saved list and the toggle reflects the saved state

#### Scenario: User unsaves an event
- **WHEN** the user taps the save toggle on a saved event
- **THEN** the event is removed from the saved list

#### Scenario: User views saved events
- **WHEN** the user navigates to the saved-events section
- **THEN** the app shows all saved events, pulling from local storage without a network request

#### Scenario: No events are saved
- **WHEN** the saved-events section is empty
- **THEN** the app shows an empty state prompting the user to save events from the event list

#### Scenario: Saved state persists across sessions
- **WHEN** the user closes and reopens the app
- **THEN** previously saved events are still shown in the saved-events section

### Requirement: Registration reminders
The app SHALL allow users to set an opt-in notification reminder for an event's registration-opening date, using the Web Notifications API.

#### Scenario: User sets a reminder
- **WHEN** the user taps "Remind me" on an event detail page
- **THEN** the app requests notification permission if not already granted, then schedules a reminder for the registration-opening date

#### Scenario: Notification permission denied
- **WHEN** the user denies notification permission
- **THEN** the app shows an informational message explaining how to enable notifications and does not crash

#### Scenario: Reminder is shown
- **WHEN** the registration date is reached and the app is in the background
- **THEN** a system notification is shown with the event name and a link to the event detail

### Requirement: Offline cache
The app SHALL cache the most recently fetched event list using the Service Worker cache API so that the last-seen data is available when the device is offline.

#### Scenario: User opens app offline
- **WHEN** the device is offline
- **THEN** the app shows the cached event list with a visible offline indicator

#### Scenario: Cache is stale or absent
- **WHEN** no cached data is available and the device is offline
- **THEN** the app shows an offline empty state rather than an error
