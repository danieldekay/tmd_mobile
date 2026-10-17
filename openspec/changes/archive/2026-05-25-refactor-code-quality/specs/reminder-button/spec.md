## ADDED Requirements

### Requirement: Reminder interaction logic lives in a standalone component
A new component `src/lib/components/ReminderButton.svelte` SHALL encapsulate all
reminder-related state, logic, and UI. The event detail route SHALL delegate to
this component rather than containing reminder logic inline.

#### Scenario: ReminderButton component exists with required props
- **WHEN** the refactoring is complete
- **THEN** `src/lib/components/ReminderButton.svelte` SHALL accept props `eventId: number`, `eventTitle: string`, and `registrationDate: string`

#### Scenario: Event detail route no longer contains inline reminder logic
- **WHEN** the refactoring is complete
- **THEN** `src/routes/events/[id]/+page.svelte` SHALL NOT contain definitions of `reminderSet`, `reminderDenied`, `reminderLoading`, or `toggleReminder`

#### Scenario: Event detail route file is within the size limit
- **WHEN** `wc -l src/routes/events/\[id\]/+page.svelte` is run after refactoring
- **THEN** the output SHALL be ≤290 lines

### Requirement: Reminder toggle behaviour is preserved
Setting and removing a reminder from the event detail page SHALL behave identically
before and after extraction.

#### Scenario: Reminder button shows correct initial state
- **WHEN** a user navigates to an event detail page
- **THEN** the `ReminderButton` SHALL show "Set Reminder" if no reminder exists, or "Remove Reminder" if one does

#### Scenario: Reminder button handles notification denial gracefully
- **WHEN** the user denies notification permission
- **THEN** the `ReminderButton` SHALL display a denied-state message without crashing

#### Scenario: TypeScript build passes after extraction
- **WHEN** `npm run check` is run after extracting `ReminderButton`
- **THEN** it SHALL complete with zero TypeScript errors
