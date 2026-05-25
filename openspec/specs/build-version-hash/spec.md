# build-version-hash Specification

## Purpose
TBD - created by archiving change app-version-changelog. Update Purpose after archive.
## Requirements
### Requirement: Build commit hash is injected at build time

The build system SHALL capture the short git commit SHA at build time and expose it as `__BUILD_HASH__` globally.

#### Scenario: Normal build with git available

- **GIVEN** the project is inside a git repository with at least one commit
- **WHEN** `npm run build` is executed
- **THEN** `__BUILD_HASH__` resolves to the 7-character short SHA of HEAD (e.g., `"a1b2c3d"`)

#### Scenario: Build without git (fallback)

- **GIVEN** git is not available or the repo is in a shallow/detached state where `rev-parse` fails
- **WHEN** `npm run build` is executed
- **THEN** `__BUILD_HASH__` resolves to the string `"dev"` and the build succeeds without error

---

### Requirement: Footer displays version and commit hash

The app footer SHALL display both the semver version and short commit SHA.

#### Scenario: Normal runtime

- **WHEN** a user scrolls to the footer
- **THEN** they see text in the format `v0.1.0 (a1b2c3d)` where the hash portion links to `/changelog`

#### Scenario: Dev / fallback hash

- **WHEN** `__BUILD_HASH__` equals `"dev"`
- **THEN** the footer shows `v0.1.0 (dev)` as plain text (no link)

---

### Requirement: In-app changelog page

The app SHALL expose a `/changelog` route listing versioned release entries.

#### Scenario: User navigates to changelog

- **WHEN** a user visits `/changelog`
- **THEN** they see a list of release entries ordered newest-first, each showing version, date, title, and bullet items

#### Scenario: Changelog is accessible from primary nav

- **WHEN** a user is on any page
- **THEN** the primary navigation bar contains a link to `/changelog`

#### Scenario: Changelog entry data is typed

- **GIVEN** `src/lib/changelog.ts` is imported
- **THEN** each entry conforms to the `ChangelogEntry` type with required `version`, `date`, `title`, and `items` fields

