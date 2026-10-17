# Spec: Tmd Api Modules

### Requirement: API layer is split into three focused modules
The `src/lib/api/` layer SHALL be divided into three files, each with a single
responsibility: record accessor utilities, normalization functions, and the public
fetch API.

#### Scenario: record-utils module exists with all accessor helpers
- **WHEN** the refactoring is complete
- **THEN** `src/lib/api/record-utils.ts` SHALL exist and export `isRecord`, `getRecord`, `getString`, `getNumber`, `getBoolean`, `getTitle`, and `formatDate`

#### Scenario: tmd-normalize module exists with all normalization functions
- **WHEN** the refactoring is complete
- **THEN** `src/lib/api/tmd-normalize.ts` SHALL exist and export `normalizeTmdEvent`, `normalizeTmdEventDetail`, and all other `normalize*` and `extract*` functions previously defined in `tmd.ts`

#### Scenario: tmd.ts retains only the public fetch API
- **WHEN** the refactoring is complete
- **THEN** `src/lib/api/tmd.ts` SHALL contain only URL configuration, `TmdNotFoundError`, `getResponseErrorMessage`, and all exported `get*`/`fetch*` async functions

### Requirement: No file in the API layer exceeds 500 lines
Each module in `src/lib/api/` SHALL be at most 500 lines after the split.

#### Scenario: tmd.ts line count is within limit
- **WHEN** `wc -l src/lib/api/tmd.ts` is run after refactoring
- **THEN** the output SHALL be ≤250 lines

#### Scenario: record-utils.ts line count is within limit
- **WHEN** `wc -l src/lib/api/record-utils.ts` is run
- **THEN** the output SHALL be ≤200 lines

#### Scenario: tmd-normalize.ts line count is within limit
- **WHEN** `wc -l src/lib/api/tmd-normalize.ts` is run
- **THEN** the output SHALL be ≤400 lines

### Requirement: All existing public exports remain accessible
Every function and type that route pages import from `$lib/api/tmd` before the
refactoring SHALL remain importable from the same path after refactoring. No route
page SHALL require an import path change.

#### Scenario: Route pages build without import errors
- **WHEN** `npm run build` is run after the split
- **THEN** it SHALL complete with zero TypeScript errors related to missing imports from `$lib/api/tmd`

#### Scenario: record-utils and tmd-normalize are internal modules
- **WHEN** the refactoring is complete
- **THEN** no route page (files under `src/routes/`) SHALL import directly from `$lib/api/record-utils` or `$lib/api/tmd-normalize`
