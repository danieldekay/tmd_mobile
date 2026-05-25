# Spec: Relationship Browsing

## Requirement: DJs, Teachers, and Series

The app SHALL let users browse public relationship entities that help them decide which events to attend.

### Scenario: User browses DJs

- GIVEN TMD Core exposes DJ records
- WHEN the user opens `/djs`
- THEN the app shows DJ names, location metadata, links, and upcoming connected events when available

### Scenario: User opens an event series

- GIVEN an event belongs to a series
- WHEN the user opens the series page
- THEN the app shows series metadata and related editions or upcoming events

### Scenario: User opens a DJ detail

- GIVEN a DJ exists in TMD Core
- WHEN the user opens /djs/[id]
- THEN the app shows the DJ's profile information and their upcoming connected events

### Scenario: DJ detail is loading

- WHEN the DJ detail request is in flight
- THEN the page shows a skeleton loading state

### Scenario: DJ not found

- WHEN the requested DJ ID does not exist
- THEN the app shows a not-found message and a link back to the DJ list

### Scenario: Event detail links to DJs

- GIVEN an event has associated DJs
- WHEN the user views the event detail page
- THEN each DJ name is a link navigating to /djs/[id]

### Scenario: Event detail links to series

- GIVEN an event belongs to a series
- WHEN the user views the event detail page
- THEN the series name is a link navigating to /event-series/[id]

### Scenario: User browses teachers

- GIVEN TMD Core exposes teacher records at `/wp-json/tmd/v3/teachers`
- WHEN the user opens `/teachers`
- THEN the app shows teacher names, location metadata, and links to individual teacher profiles

### Scenario: User opens a teacher profile

- GIVEN the user is on an event detail page or the teacher list
- WHEN the user taps a teacher name that has an associated ID
- THEN the app navigates to `/teachers/[id]` showing the teacher's full profile

### Scenario: Teacher data is unavailable

- GIVEN TMD Core v3 does not return teacher endpoint data or the teacher has no ID
- WHEN teachers are referenced on an event
- THEN teacher names are shown as plain text without navigation links
