## ADDED Requirements

### Requirement: Footer displays real links
The footer SHALL contain a link to tangomarathons.com, a Privacy Policy link, and a Legal/Imprint link.

#### Scenario: User sees footer links
- **WHEN** the user views any page in the app
- **THEN** the footer contains an external link to `https://www.tangomarathons.com`
- **THEN** the footer contains a link labelled "Privacy Policy"
- **THEN** the footer contains a link labelled "Legal"

#### Scenario: External links open correctly
- **WHEN** the user taps the tangomarathons.com link
- **THEN** the browser navigates to `https://www.tangomarathons.com` (external)

#### Scenario: Footer has no placeholder text
- **WHEN** the user views the footer
- **THEN** no text mentions "Cloudflare Worker", "tmd-mobile", "pending", or internal deployment details

### Requirement: Footer displays version and git hash
The footer SHALL display the app version string and the short git commit hash baked in at build time.

#### Scenario: Version and hash visible
- **WHEN** the user views the footer
- **THEN** a line shows the version number (e.g., `v0.1.0`) and the short git hash (e.g., `d1b10e8`)

#### Scenario: Fallback when hash unavailable
- **WHEN** the git hash cannot be determined at build time
- **THEN** the footer shows `unknown` in place of the hash
