## ADDED Requirements

### Requirement: Changelog data module

The app SHALL include a `src/lib/changelog.ts` module that exports a typed array of changelog entries.

#### Scenario: Module imports without error

- **WHEN** `src/lib/changelog.ts` is imported
- **THEN** it exports a `changelog` array of type `ChangelogEntry[]` with at least one entry

#### Scenario: Entries are sorted newest-first

- **GIVEN** the changelog has multiple entries
- **WHEN** the array is iterated in order
- **THEN** entries appear from most recent to oldest by date

#### Scenario: Changelog page renders all entries

- **WHEN** a user visits `/changelog`
- **THEN** every entry in `changelog` is rendered as a distinct section with version, date, title, and all bullet items visible

#### Scenario: Changelog page is reachable via direct URL

- **GIVEN** the SvelteKit static adapter is in use
- **WHEN** a user navigates directly to `/changelog`
- **THEN** the page loads successfully without a 404 (it is included in the static output)
