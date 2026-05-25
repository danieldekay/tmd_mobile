## MODIFIED Requirements

### Requirement: Pending Domain Setup
The app SHALL NOT expose internal deployment notes or pending DNS information in the user-visible UI.

#### Scenario: Operator prepares production
- **WHEN** the domain is added to Cloudflare
- **THEN** the operator follows `DEPLOY.md` to attach the route to Worker `tmd-mobile` and validate production smoke tests

#### Scenario: Footer shows no internal metadata
- **WHEN** an end user views the app footer
- **THEN** no mention of "Cloudflare Worker", "tmd-mobile", or pending DNS setup is visible

## ADDED Requirements

### Requirement: Build embeds git commit hash
The build process SHALL embed the short git commit hash as `__GIT_HASH__` via Vite `define`.

#### Scenario: Hash available in build
- **WHEN** a build runs in a git repository
- **THEN** `__GIT_HASH__` resolves to the short commit SHA (7 characters)

#### Scenario: Hash unavailable fallback
- **WHEN** the git command fails (shallow clone, no git)
- **THEN** `__GIT_HASH__` resolves to the string `'unknown'`
