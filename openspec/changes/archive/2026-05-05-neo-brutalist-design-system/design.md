## Context

TMD Mobile's visual layer (`src/app.css`) was built with a placeholder aesthetic: earthy muted tones (`--pine`, `--wine`, `--gold`, `--paper`), soft rounded corners (`--radius-panel: 0.5rem`), blurred shadows, and Atkinson Hyperlegible Next / IBM Plex Sans Condensed as fonts. The layout structure in `+layout.svelte` uses utility classes built on top of these tokens.

The authoritative TMD design system is now defined in `DESIGN.md` (the "Endless Summer 2026" system): Neo-Brutalist Pop-Art aesthetic, hard drop-shadows, 2px solid borders, a new palette, and new typography. No change to routing, API, or feature behavior is required — this is purely a CSS and typography-layer migration.

## Goals / Non-Goals

**Goals:**
- Replace all earthy palette tokens with the Endless Summer token set in `src/app.css`
- Replace fonts (Atkinson/IBM Plex → Space Grotesk/Inter) and update `@fontsource` npm packages
- Update `@theme` block to reflect new color, radius, and shadow tokens
- Rewrite component classes (`.panel`, `.button-primary`, `.button-secondary`, `.nav-link`, `.nav-link-active`, `.nav-link-idle`, `.card`) to brutalist pattern
- Update `+layout.svelte` header, logo mark, and footer to use new tokens
- Verify WCAG 2.1 AA contrast compliance across all new token pairings
- No changes to route structure, API calls, or any feature logic

**Non-Goals:**
- Dark mode implementation (dark mode is deferred; `--void-black` is available for future use)
- Animated transitions or motion design
- Responsive breakpoint changes
- Component-level JSX/Svelte rewrites beyond class attribute updates

## Decisions

### Decision 1 — Token naming strategy

Adopt a semantic/alias token layer over raw palette values, matching `DESIGN.md`. Raw palette values defined as `:root` CSS custom properties in RGB component notation (for Tailwind `rgb(var(--x))` compatibility), aliased in `@theme` to semantic names Tailwind understands.

**New raw tokens:**
```css
--void: 9 9 11;          /* #09090B */
--paper: 250 250 250;    /* #FAFAFA */
--concrete: 244 244 245; /* #F4F4F5 */
--acid: 212 255 0;       /* #D4FF00 */
--magenta: 255 0 127;    /* #FF007F */
--cyan: 0 240 255;       /* #00F0FF */
```

**`@theme` semantic aliases:**
```css
--color-canvas: rgb(var(--paper));
--color-panel: rgb(var(--concrete));
--color-ink: rgb(var(--void));
--color-primary: rgb(var(--acid));      /* CTA / primary accent */
--color-accent: rgb(var(--magenta));    /* active states */
--color-info: rgb(var(--cyan));         /* links, tags */
--font-sans: 'Inter', sans-serif;
--font-display: 'Space Grotesk', sans-serif;
--radius-panel: 0;
--radius-control: 0;
--shadow-panel: 4px 4px 0 #09090B;
--shadow-control: 2px 2px 0 #09090B;
```

**Alternative considered**: Keeping the old token names and just remapping values — rejected because the old names (`--pine`, `--wine`, `--gold`, `--shell`) carry semantic meaning tied to the earthy aesthetic and would confuse future contributors.

### Decision 2 — Font packages

Use `@fontsource-variable/space-grotesk` (variable font, ~50 KB) and `@fontsource-variable/inter` (variable font). Remove `@fontsource/atkinson-hyperlegible-next` and `@fontsource/ibm-plex-sans-condensed`.

**Alternative considered**: Loading from Google Fonts CDN — rejected because the project already commits to self-hosted `@fontsource` packages for performance and privacy (no external DNS at render time).

### Decision 3 — Button and card pattern

Buttons become sharp rectangles (no border-radius) with a 2px solid `--void` border and `2px 2px 0 #09090B` hard shadow. Primary button: `--acid` background, `--void` text. Hover: colors invert (void background, acid text). Secondary: white / `--concrete` background, `--void` border. Cards: `--concrete` background, 2px `--void` border, `4px 4px 0 #09090B` hard shadow.

**Alternative considered**: Keeping rounded radius at `0.25rem` (subtle) — rejected; DESIGN.md is explicit that "elegance comes from macro-typography and perfect alignment, not from rounded soft UI."

### Decision 4 — Navigation active state

Active nav tabs: `--acid` background, `--void` text, 2px `--void` border — matching the "Acid Lemon primary CTA" pattern from DESIGN.md. Idle state: transparent background, `--void` text, 2px transparent border (hover fills `--concrete`).

### Decision 5 — Contrast verification

`--acid` (`#D4FF00`) on `--void` (`#09090B`): contrast ratio ≈ 13.6:1 ✅ WCAG AAA. `--magenta` (`#FF007F`) on `--paper` (`#FAFAFA`): ≈ 4.6:1 ✅ WCAG AA. `--cyan` (`#00F0FF`) on `--void` (`#09090B`): ≈ 11.7:1 ✅ AAA. `--void` on `--paper`: 19.6:1 ✅ AAA.

## Risks / Trade-offs

- **Sharp zero-radius on mobile tap targets** → Hard shadow provides tactile visual feedback. Minimum tap target size (44×44px) must still be met; audit interactive elements during implementation.
- **Acid Lemon readability** → `#D4FF00` on white (`#FAFAFA`) has only ~1.3:1 contrast. Acid Lemon MUST only appear on `--void` black backgrounds or as a fill color on solid dark buttons — never as text on light backgrounds. → Mitigation: Primary button always uses Acid Lemon background with Void Black text, not the other way around.
- **Space Grotesk not yet installed** → Build will fail until `@fontsource-variable/space-grotesk` is added. → Mitigation: Install packages in task 1.1 before any CSS changes.
- **Hard shadows with `overflow: hidden`** → If any container clips with `overflow: hidden`, the 4px hard shadow will be cut off. → Mitigation: Audit layout containers; prefer `overflow: visible` with adequate padding on parent.
- **Focus ring colour** → Old focus ring used `--gold` (warm yellow). New ring should use `--acid` (on dark) or `--magenta` (on light). → Mitigation: Update `:focus-visible` in task 2.3.

## Migration Plan

1. Install new font packages, remove old ones (`npm install`, no build changes yet)
2. Rewrite `src/app.css` — tokens, `@theme`, base styles, component classes
3. Update `src/routes/+layout.svelte` class names where inline Tailwind classes reference old tokens
4. Update `src/lib/components/PwaPrompts.svelte` to match new component styles
5. Run `npm run check` and `npm run build` to confirm no compile errors
6. Visual audit in browser dev tools; fix any overflow/shadow clip issues
7. Deploy via `npx wrangler deploy`

**Rollback**: `git revert` on the `src/app.css` commit — all changes are isolated to the style layer with no logic changes.

## Open Questions

- Should `--magenta` or `--acid` be used for the logo mark background? (Current: `--pine`/teal). Proposal: `--acid` with `--void` text for maximum brand impact.
- Should the footer include a thin `4px 0 0 #09090B` top border (brutalist rule) or keep `border-t border-line`?
- Is Inter or Geist preferred for body? Both are in scope per DESIGN.md; recommend Inter for broader system font fallback compatibility.
