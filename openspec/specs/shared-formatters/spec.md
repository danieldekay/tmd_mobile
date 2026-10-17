# Spec: Shared Formatters

### Requirement: Date and location formatters live in a single shared module
A new module `src/lib/utils/format.ts` SHALL be the single source of truth for
`formatDateRange`, `formatLocation`, and `formatRegistrationDate`. Duplicate
implementations in other files SHALL be removed.

#### Scenario: format.ts exports the three formatter functions
- **WHEN** the refactoring is complete
- **THEN** `src/lib/utils/format.ts` SHALL export `formatDateRange(dateStart, dateEnd)`, `formatLocation(city, country)`, and `formatRegistrationDate(dateStr)`

#### Scenario: Duplicate formatters are removed from tmd.ts
- **WHEN** the refactoring is complete
- **THEN** `src/lib/api/tmd.ts` SHALL NOT contain a local definition of `formatDateRange` or `formatLocation`

#### Scenario: Duplicate formatters are removed from the event detail route
- **WHEN** the refactoring is complete
- **THEN** `src/routes/events/[id]/+page.svelte` SHALL NOT contain local definitions of `formatDateRange`, `formatLocation`, or `formatRegistrationDate`

### Requirement: Formatter functions produce identical output to previous inline implementations
The extracted formatter functions SHALL preserve the exact rendering behaviour of
the original inline implementations.

#### Scenario: formatDateRange produces the same string as the previous tmd.ts implementation
- **WHEN** `formatDateRange('2026-06-01', '2026-06-03')` is called
- **THEN** the output SHALL match the string previously produced by the equivalent logic in `tmd.ts`

#### Scenario: TypeScript build passes after formatter extraction
- **WHEN** `npm run check` is run after extracting formatters
- **THEN** it SHALL complete with zero TypeScript errors
