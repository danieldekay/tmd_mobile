## ADDED Requirements

### Requirement: URL filter synchronisation logic lives in a dedicated utility module
A new module `src/lib/utils/filter-url.ts` SHALL export `parseFiltersFromUrl` and
`pushFiltersToUrl`. `EventFilters.svelte` SHALL use these utilities instead of
containing the URL sync logic inline.

#### Scenario: filter-url.ts exports the two utility functions
- **WHEN** the refactoring is complete
- **THEN** `src/lib/utils/filter-url.ts` SHALL export `parseFiltersFromUrl(): FilterUrlState` and `pushFiltersToUrl(state: FilterUrlState): Promise<void>`

#### Scenario: EventFilters.svelte no longer defines pushToUrl inline
- **WHEN** the refactoring is complete
- **THEN** `src/lib/components/EventFilters.svelte` SHALL NOT contain a local `pushToUrl` function definition

#### Scenario: EventFilters.svelte is within the size limit
- **WHEN** `wc -l src/lib/components/EventFilters.svelte` is run after refactoring
- **THEN** the output SHALL be ≤270 lines

### Requirement: Filter URL synchronisation behaviour is preserved
Applying filters SHALL continue to update the URL and restoring the page from a
URL SHALL pre-populate the filters.

#### Scenario: Filter state round-trips through URL
- **WHEN** `pushFiltersToUrl(state)` is called followed by `parseFiltersFromUrl()`
- **THEN** the returned `FilterUrlState` SHALL equal the original `state`

#### Scenario: TypeScript build passes after extraction
- **WHEN** `npm run check` is run after extracting filter-url utilities
- **THEN** it SHALL complete with zero TypeScript errors
