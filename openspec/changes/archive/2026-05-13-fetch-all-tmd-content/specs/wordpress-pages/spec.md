## ADDED Requirements

### Requirement: WordPress Page Display

The app SHALL display individual WordPress pages at `/pages/[slug]` backed by `/wp-json/wp/v2/pages`.

#### Scenario: Page loads by slug

- **WHEN** the user navigates to `/pages/[slug]` and the endpoint returns a matching page
- **THEN** the app shows the page title and rendered HTML body content

#### Scenario: Page is loading

- **WHEN** the page content request is in flight
- **THEN** the app shows a skeleton loading state without hiding navigation

#### Scenario: Page not found

- **WHEN** the endpoint returns no page matching the slug
- **THEN** the app shows a "Page not found" message and a link back to the home page

#### Scenario: Direct-link to a WordPress page

- **WHEN** the user navigates directly to `/pages/[slug]`
- **THEN** the page is fetched client-side and rendered correctly (prerender = false)

#### Scenario: Page fetch fails

- **WHEN** the endpoint returns an error or CORS blocks the request
- **THEN** the app shows an error message with a fallback link to the main TMD website; it does not crash

## MODIFIED Requirements

### Requirement: DJs, Teachers, and Series

The app SHALL let users browse public relationship entities that help them decide which events to attend.

#### Scenario: User browses DJs

- **GIVEN** TMD Core exposes DJ records
- **WHEN** the user opens `/djs`
- **THEN** the app shows DJ names, location metadata, links, and upcoming connected events when available

#### Scenario: User opens an event series

- **GIVEN** an event belongs to a series
- **WHEN** the user opens the series page
- **THEN** the app shows series metadata and related editions or upcoming events

#### Scenario: User browses teachers

- **GIVEN** TMD Core exposes teacher records at `/wp-json/tmd/v3/teachers`
- **WHEN** the user opens `/teachers`
- **THEN** the app shows teacher names, location metadata, and links to individual teacher profiles

#### Scenario: User opens a teacher profile

- **GIVEN** the user is on an event detail page or the teacher list
- **WHEN** the user taps a teacher name that has an associated ID
- **THEN** the app navigates to `/teachers/[id]` showing the teacher's full profile

#### Scenario: Teacher data is unavailable

- **GIVEN** TMD Core v3 does not return teacher endpoint data or the teacher has no ID
- **WHEN** teachers are referenced on an event
- **THEN** teacher names are shown as plain text without navigation links
