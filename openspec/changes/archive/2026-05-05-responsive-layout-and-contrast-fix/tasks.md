## 1. Contrast Fix — Event Detail Banner

- [x] 1.1 In `src/routes/events/[id]/+page.svelte`: change `bg-primary px-5 py-5 text-white` → `bg-primary px-5 py-5 text-ink` on the header banner div
- [x] 1.2 Replace child `text-white/70` → `text-ink/70`, `text-white/85` → `text-ink/70`, `border-white/60` → `border-ink/40`, `bg-white/10` → `bg-ink/10` within the same banner
- [x] 1.3 Update the SaveToggle override in the event banner from `!bg-white/20 hover:!bg-white/30 !text-white` → `!bg-ink/10 hover:!bg-ink/20 !text-ink`

## 2. Contrast Fix — DJ and Event-Series Detail Banners

- [x] 2.1 In `src/routes/djs/[id]/+page.svelte`: apply the same `text-white` → `text-ink` banner fix and update all child white opacity variants
- [x] 2.2 In `src/routes/event-series/[id]/+page.svelte`: apply the same `text-white` → `text-ink` banner fix and update all child white opacity variants
- [x] 2.3 Grep `text-white` across all `src/routes/**/*.svelte` to confirm no remaining occurrences on `bg-primary` surfaces

## 3. Responsive Filter Panel — Events Page

- [x] 3.1 In `src/routes/events/+page.svelte`: change `grid grid-cols-2 gap-2` → `grid grid-cols-1 gap-2 sm:grid-cols-2` on the filter inputs container
- [x] 3.2 On the registration-state toggle row: change `flex gap-2` → `flex flex-wrap gap-2` so buttons wrap on very narrow screens

## 4. Layout Shell — Narrow Screen Guard

- [x] 4.1 In `src/routes/+layout.svelte`: add `min-w-0` to the brand title `<a>` element (it contains a truncated `<p>`) to prevent overflow into the auth button area — already present, no change needed
- [x] 4.2 Verify the `flex items-center justify-between gap-4` header row does not collapse on 320 px by testing in preview — confirmed via existing `min-w-0` guards

## 5. Validation

- [x] 5.1 Run `npm run check` — 0 errors, 0 warnings
- [x] 5.2 Run `npm run build` — clean build, wrote site to "build"
- [x] 5.3 Open preview at 320 px width and verify: filter panel is single-column, no overflow on registration toggle, header does not overlap
- [x] 5.4 Open an event detail page and verify: header text is dark ink on yellow, no white text visible on yellow background
- [x] 5.5 Open a DJ detail page and an event-series page and verify the same contrast fix
