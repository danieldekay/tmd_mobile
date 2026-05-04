# Spec: Saved Events and Personal Utility

## Requirement: Saved Events

The app SHALL allow users to save and unsave events to device-local storage, accessible without network access.

### Scenario: User saves an event

- GIVEN the user is viewing an event card or event detail page
- WHEN the user taps the save toggle
- THEN the event is added to the saved list and the toggle reflects the saved state

### Scenario: User unsaves an event

- GIVEN the user has previously saved an event
- WHEN the user taps the save toggle on a saved event
- THEN the event is removed from the saved list

### Scenario: User views saved events

- GIVEN the user has saved one or more events
- WHEN the user navigates to the saved-events section
- THEN the app shows all saved events from local storage without a network request

### Scenario: No events are saved

- WHEN the saved-events section is empty
- THEN the app shows an empty state prompting the user to save events from the event list

### Scenario: Saved state persists across sessions

- GIVEN the user has saved one or more events
- WHEN the user closes and reopens the app
- THEN previously saved events are still shown in the saved-events section

## Requirement: Registration Reminders

The app SHALL allow users to set opt-in notification reminders for event registration-opening dates.

### Scenario: User sets a reminder

- GIVEN the user is viewing an event detail page with a registration-opening date
- WHEN the user taps "Remind me"
- THEN the app requests notification permission if not already granted and schedules a reminder for the registration-opening date

### Scenario: Notification permission denied

- WHEN the user denies notification permission
- THEN the app shows an informational message explaining how to enable notifications and does not crash

### Scenario: Reminder is shown

- GIVEN the user has set a reminder for an event
- WHEN the registration date is reached and the app is in the background
- THEN a system notification is shown with the event name and a link to the event detail

## Requirement: Offline Cache

The app SHALL cache the most recently fetched event list so that last-seen data is available when the device is offline.

### Scenario: User opens app offline

- GIVEN the app has previously loaded event data
- WHEN the device is offline
- THEN the app shows the cached event list with a visible offline indicator

### Scenario: Cache is stale or absent

- GIVEN no cached data is available
- WHEN the device is offline
- THEN the app shows an offline empty state rather than an error
