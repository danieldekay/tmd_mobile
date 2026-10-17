## 1. Split `src/lib/api/tmd.ts` into three modules

- [x] 1.1 Create `src/lib/api/record-utils.ts` and move the seven private helper functions into it: `isRecord`, `getRecord`, `getString`, `getNumber`, `getBoolean`, `getTitle`, `formatDate` — export all of them
- [x] 1.2 Create `src/lib/api/tmd-normalize.ts` and move all normalization and extraction functions into it: `normalizeEvent`, `normalizeTmdEvent`, `normalizeTmdEventDetail`, `normalizeTmdDj`, `normalizeTmdDjDetail`, `normalizeTmdEventSeries`, `normalizeTmdTeacher`, `normalizeWpPost`, `normalizeWpPostDetail`, `normalizeWpPage`, `extractCollection`, `extractFeatures`, `extractPeople`, `extractCategories` — import from `./record-utils` and `$lib/types`
- [x] 1.3 Update `src/lib/api/tmd.ts` to import the moved helpers from `./record-utils` and `./tmd-normalize`; remove the moved function bodies
- [x] 1.4 Verify: `npm run check` passes with zero new TypeScript errors
- [x] 1.5 Verify: `npm run build` completes successfully
- [x] 1.6 Verify: all three modules are ≤500 lines — `record-utils.ts` (82), `tmd-normalize.ts` (376), `tmd.ts` (473)

## 2. Extract shared formatters to `src/lib/utils/format.ts`

- [x] 2.1 Create `src/lib/utils/format.ts` exporting `formatDateRange(dateStart: string | undefined, dateEnd: string | undefined): string`, `formatLocation(city: string | undefined, country: string | undefined): string`, and `formatRegistrationDate(dateStr: string): string` — implement as standalone functions (no dependency on domain types)
- [x] 2.2 Remove local `formatDateRange` and `formatLocation` from `src/lib/api/tmd.ts`; import from `$lib/utils/format` where they are used in normalization
- [x] 2.3 Replace inline `formatDateRange`, `formatRegistrationDate`, and `formatLocation` in `src/routes/events/[id]/+page.svelte` with imports from `$lib/utils/format`; update call sites to pass primitive values instead of event objects; also removed from `event-series/[id]/+page.svelte` and `EventTable.svelte`
- [x] 2.4 Verify: `npm run check` passes with zero TypeScript errors
- [x] 2.5 Verify: `npm run build` completes successfully

## 3. Extract landing page sections into components

- [x] 3.1 Create `src/lib/components/landing/HeroSection.svelte` with prop `eventsHref: string`; move the `<section class="hero">` markup and its scoped styles from `+page.svelte` into this component
- [x] 3.2 Create `src/lib/components/landing/FeaturesSection.svelte` with prop `features: LandingFeature[]`; move the `<section class="features">` markup and its scoped styles
- [x] 3.3 Create `src/lib/components/landing/DirectorySection.svelte` (no props); move the `<section class="tmd-directory">` markup and its scoped styles
- [x] 3.4 Create `src/lib/components/landing/ExploreSection.svelte` with prop `eventsHref: string`; move the explore CTA section and its scoped styles
- [x] 3.5 Update `src/routes/+page.svelte` to import and use the four section components; keep only shared CSS custom properties and the `.landing-page` layout rule
- [x] 3.6 Verify: `wc -l src/routes/+page.svelte` reports 97 lines (≤100)
- [x] 3.7 Verify: `npm run build` completes successfully

## 4. Extract `ReminderButton` component

- [x] 4.1 Create `src/lib/components/ReminderButton.svelte` accepting props `eventId: number`, `eventTitle: string`, `registrationDate: string`; move the `reminderSet`, `reminderDenied`, `reminderLoading` state variables, the `toggleReminder` function, and the full reminder template block from the event detail route into this component
- [x] 4.2 Update `src/routes/events/[id]/+page.svelte` to import `ReminderButton` and replace the extracted reminder template block with `<ReminderButton {eventId} {eventTitle} {registrationDate} />`; remove the three reminder state variables and `toggleReminder` function
- [x] 4.3 Verify: `wc -l src/routes/events/\[id\]/+page.svelte` reports 271 lines (≤290 ✓)
- [x] 4.4 Verify: `npm run check` passes with zero new TypeScript errors
- [x] 4.5 Verify: `npm run build` completes successfully

## 5. Extract URL sync from `EventFilters.svelte` (deferred)

- [x] 5.1 Create `src/lib/utils/filter-url.ts` exporting `readFiltersFromUrl()`, `pushFiltersToUrl()`, `pushViewModeToUrl()`, and `type RegState` — extracted from `EventFilters.svelte`; 97 lines
- [x] 5.2 Update `src/lib/components/EventFilters.svelte` to import from `$lib/utils/filter-url`; also extracted view toggle into `src/lib/components/ViewToggle.svelte`
- [x] 5.3 Verify: `wc -l src/lib/components/EventFilters.svelte` reports 251 lines (≤270 ✓)
- [x] 5.4 Verify: `npm run check` passes with zero new TypeScript errors
- [x] 5.5 Verify: `npm run build` completes successfully (✓ built in 994ms)
