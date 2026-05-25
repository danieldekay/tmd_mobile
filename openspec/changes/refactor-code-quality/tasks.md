# Tasks: Refactor — Code Quality

## Task Group: Reminder button refactor

- [x] Extract reminder button into `src/lib/components/ReminderButton.svelte` with eventId, eventTitle, registrationDate props
- [x] Replace inline reminder button logic with new ReminderButton component on all pages

## Task Group: Landing page sections refactor

- [x] Extract landing page sections (HeroSection, FeaturesSection, DirectorySection, ExploreSection) into reusable components
- [x] Replace inline section code in `src/routes/+page.svelte` with component imports (97 lines, down from 543)

## Task Group: Shared formatters

- [x] Create `src/lib/utils/format.ts` with formatDateRange, formatLocation, formatRegistrationDate
- [x] Apply formatters throughout event pages, replacing inline formatting logic in 4 files

## Task Group: TMD API module cleanup

- [x] Split `src/lib/api/tmd.ts` (864 lines) into `record-utils.ts` (82 lines), `tmd-normalize.ts` (376 lines), `tmd.ts` (473 lines)
- [x] Add TypeScript interfaces for all TMD Core v3 API response types in `src/lib/types.ts`
- [x] Remove dead code and keep all files under 500 lines

## Task Group: Filter URL utils

- [x] Extract filter URL manipulation into `src/lib/utils/filter-url.ts` (readFiltersFromUrl, pushFiltersToUrl, pushViewModeToUrl, FilterUrlState, RegState)
- [x] Update EventFilters.svelte to delegate all URLSearchParams and goto calls to filter-url.ts (307 lines, down from 325)
