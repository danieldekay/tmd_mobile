## Why

Two categories of UI defects are degrading usability on real phone screens:

1. **Contrast failure**: Detail page headers for events, DJs, and event-series use `bg-primary` (acid yellow `#D4FF00`) with `text-white`. White on yellow produces a contrast ratio near 1.5:1 — far below the WCAG AA minimum of 4.5:1. Users see illegible text on a bright yellow background.

2. **Narrow-screen layout breakage**: Several layouts break at widths below ~360 px. The events filter panel uses a fixed `grid-cols-2` that is never collapsed; the registration-state toggle row uses `flex gap-2` with three full-label buttons that overflow and clip; and the header `flex items-center justify-between` in the layout shell can cause the nav/auth controls to overlap on small phones.

## What Changes

- Replace `text-white` with `text-ink` on all `bg-primary` header banners (events, DJs, event-series detail pages)
- Audit and fix every `bg-primary text-white` or `bg-primary … text-white` combination across all routes
- Convert the filter `grid-cols-2` to `grid-cols-1 sm:grid-cols-2` so it stacks on narrow screens
- Make the registration-state toggle row wrap gracefully (`flex-wrap`) on small viewports
- Ensure the layout header controls never overlap (guard `min-w-0` on text containers, allow wrapping)

## Capabilities

### New Capabilities
- `accessible-color-use`: All foreground text on `bg-primary` (acid yellow) uses `text-ink` (near-black), not white; minimum contrast ratio ≥ 4.5:1 for all normal text

### Modified Capabilities
- `event-browsing`: Event filter panel is single-column on narrow screens; registration toggle wraps instead of overflowing
- `event-detail`: Event detail header uses `text-ink` instead of `text-white`; SaveToggle overrides updated accordingly

## Impact

- `src/routes/events/[id]/+page.svelte`: header banner color fix
- `src/routes/djs/[id]/+page.svelte`: header banner color fix
- `src/routes/event-series/[id]/+page.svelte`: header banner color fix
- `src/routes/events/+page.svelte`: filter grid responsive + registration toggle wrapping
- `src/routes/+layout.svelte`: header shell guard for narrow screens
- `src/routes/+page.svelte`: verify landing page `sm:grid-cols-2` is safe on narrow viewports
- No API changes; no new dependencies; deployment unchanged
- Affects only public routes; no authentication implications
