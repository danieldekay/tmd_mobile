## Context

The app uses a design system where `--color-primary` is acid yellow (`#D4FF00`). This color was always intended to be used with `text-ink` (near-black `#09090B`) — the `.button-primary` component class already does this correctly: `bg-primary text-ink`. However, three detail-page header banners incorrectly use `text-white` instead, creating a WCAG contrast failure.

Separately, the events filter panel was built with `grid-cols-2` targeting desktop-width preview. On phones narrower than ~360 px the two-column layout produces cramped or clipped form controls.

## Goals / Non-Goals

**Goals:**
- Achieve WCAG AA contrast (≥ 4.5:1) for all text on `bg-primary` surfaces by using `text-ink` consistently
- Make the events filter panel fully usable at 320 px viewport width (single-column stacking)
- Prevent the registration-state toggle buttons from overflowing their container
- Prevent header controls from overlapping in the layout shell on narrow screens
- Fix without changing any visual semantics, color palette, or component architecture

**Non-Goals:**
- Full WCAG audit beyond `bg-primary` contrast violations
- Redesigning the filter panel UX (just fix the grid responsiveness)
- Adding new breakpoints or changing the `max-w-xl` app shell constraint
- Modifying the color palette itself

## Decisions

### Decision 1: Use `text-ink` on `bg-primary` banners, not a new token
The design system's `button-primary` already establishes `bg-primary text-ink` as the correct pairing. The three banner violations are bugs, not design intent. Fix by replacing `text-white` with `text-ink` on the banner `div` and updating all child overrides (e.g. `text-white/70`, `text-white/85`, `border-white/60`, `bg-white/10`) to their `ink` equivalents.

**Alternative considered:** Darkening the yellow slightly. Rejected — changes the brand color palette; the correct fix is using ink on primary, which already works everywhere else.

### Decision 2: `grid-cols-1` default with `sm:grid-cols-2` for filter panel
Tailwind's `sm:` breakpoint is 640 px by default. Given the `max-w-xl` (576 px) app shell, `sm:grid-cols-2` will rarely trigger in normal use. Use the semantically correct default: single column, expanding to two on wider viewports. This is identical to the landing page's existing `sm:grid-cols-2` pattern.

### Decision 3: `flex-wrap` on the registration toggle row
The three button labels ("All", "Open now", "Opening soon") together are ~220 px at `text-xs`. At 320 px with padding they already fit — but adding `flex-wrap` is a cheap defensive fix that also handles translated label lengths. No visual change on normal screens.

### Decision 4: `min-w-0` guard on header title block
The layout header has `flex items-center justify-between gap-4`. The brand title block can expand and collide with the auth buttons on <375 px screens. Adding `min-w-0` to the title `<a>` and its inner text paragraph (already has `truncate`) ensures proper text truncation rather than layout overflow.

## Risks / Trade-offs

- [Risk] Child elements inside banner divs use `text-white/opacity` modifiers — easy to miss one → Mitigation: grep all `text-white` occurrences in affected files before and after the fix; verify in preview
- [Risk] `sm:grid-cols-2` on the filter panel means two columns appear only on tablets/wider, not on most phones → Mitigation: this is the correct mobile-first behavior; form fields are full-width on phones which is better UX
- [Risk] `text-ink` on yellow banner may need slight opacity adjustments for secondary text to maintain hierarchy → Mitigation: use `text-ink/70` for secondary lines, `text-ink/60` for tertiary, matching the rest of the design system

## Migration Plan

1. Fix banner contrast: update `text-white` → `text-ink` and child opacity variants in three detail page files
2. Fix filter grid: change `grid-cols-2` → `grid-cols-1 sm:grid-cols-2` in `events/+page.svelte`
3. Fix toggle wrap: add `flex-wrap` to registration toggle row
4. Fix header overflow: add `min-w-0` guard to layout shell title block
5. Run `npm run check` and `npm run build`
6. Verify visually with browser at 320 px width

## Open Questions

- None — all changes are straightforward CSS/class fixes with no ambiguity.
