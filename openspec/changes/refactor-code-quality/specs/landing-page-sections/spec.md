## ADDED Requirements

### Requirement: Landing page route delegates rendering to section components
`src/routes/+page.svelte` SHALL import and compose four section components rather
than containing their markup and scoped styles inline.

#### Scenario: Landing page route file is within the size limit
- **WHEN** `wc -l src/routes/+page.svelte` is run after refactoring
- **THEN** the output SHALL be ≤100 lines

#### Scenario: Four section components exist
- **WHEN** the refactoring is complete
- **THEN** all four files SHALL exist: `src/lib/components/landing/HeroSection.svelte`, `src/lib/components/landing/FeaturesSection.svelte`, `src/lib/components/landing/DirectorySection.svelte`, `src/lib/components/landing/ExploreSection.svelte`

#### Scenario: Each section component is within the size limit
- **WHEN** `wc -l` is run on each landing section component
- **THEN** each file SHALL be ≤150 lines

### Requirement: Landing page renders identically before and after refactoring
The visible HTML structure, CSS styling, and interaction behaviour of the landing
page SHALL be unchanged after extracting section components.

#### Scenario: Hero section renders with PWA install prompt
- **WHEN** a user navigates to `/`
- **THEN** the hero section SHALL display the app title, tagline, and CTA buttons

#### Scenario: All five sections are present in the rendered page
- **WHEN** a user navigates to `/`
- **THEN** the page SHALL render all sections: hero, features, directory info, PWA install card, and explore CTA

#### Scenario: Build succeeds after extraction
- **WHEN** `npm run build` is run after extracting section components
- **THEN** it SHALL complete with no errors
