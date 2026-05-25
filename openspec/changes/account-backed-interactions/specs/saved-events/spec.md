## MODIFIED Requirements

### Requirement: Saved Events Page

The saved events page SHALL display events bookmarked by the current user, backed by the server for authenticated users and by `localStorage` for guests.

#### Scenario: Authenticated user sees cloud-backed saved events

- **GIVEN** the user is authenticated
- **WHEN** the saved events page loads
- **THEN** the page shows only events whose IDs appear in the interaction store's bookmarked set
- **AND** the displayed events match those bookmarked on the server (not only local storage)

#### Scenario: Guest user sees locally saved events

- **GIVEN** the user is not authenticated
- **WHEN** the saved events page loads
- **THEN** the page shows events saved in `localStorage['tmd_saved_events']`
- **AND** a "Log in to sync your saved events" prompt is shown

#### Scenario: No saved events

- **GIVEN** the interaction store has no bookmarked events (and localStorage is empty for guests)
- **WHEN** the saved events page loads
- **THEN** an empty-state message is shown with a link to browse events
