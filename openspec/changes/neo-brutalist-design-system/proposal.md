## Why

TMD Mobile's current aesthetic — earthy, muted, and softly rounded — no longer aligns with the TMD brand direction, which has moved to a high-energy Neo-Brutalist Pop-Art visual language ("Endless Summer 2026"). The existing palette and typography communicate calm restraint; the target communicates boldness, urgency, and fun — fitting for a tango marathon directory. This is the right moment to align the mobile app with the unified TMD design system before further UI work embeds the old style deeper.

## What Changes

- **BREAKING** — Replace the entire CSS custom-property palette in `src/app.css`: remove earthy tokens (`--pine`, `--wine`, `--gold`, `--paper`, `--shell`, `--mist`, `--line`, `--ink`) and introduce the Endless Summer tokens (`--void`, `--paper`, `--concrete`, `--acid`, `--magenta`, `--cyan`)
- **BREAKING** — Replace fonts: swap Atkinson Hyperlegible Next (body) → Inter/Geist, and IBM Plex Sans Condensed (display) → Space Grotesk; install new `@fontsource` packages and remove old ones
- Replace soft Tailwind theme tokens (rounded radii, blurred shadows) with Neo-Brutalist tokens: sharp `--radius-panel: 0`, hard drop-shadow `4px 4px 0 #09090B`, 2px solid borders
- Update `+layout.svelte` header and nav to use new tokens (background, border, active state using Acid Lemon)
- Update shared button styles in `app.css` (`.button-primary`, `.button-secondary`) to sharp rectangles with color-inverting hover states
- Update card component styles across event list, DJ list, and detail pages to use hard-outline brutalist card pattern
- Update tag/badge styles to high-contrast pill with minimal border-radius
- Update the `PwaPrompts.svelte` component to match new visual style

## Capabilities

### New Capabilities

- `design-system-tokens`: Defines the canonical CSS custom-property tokens, `@theme` block, and global typography for the TMD Endless Summer design system

### Modified Capabilities

*(No spec-level requirement changes — this is a visual/style layer change. All feature behavior remains the same.)*

## Impact

- **`src/app.css`**: Complete palette and typography rewrite (breaking visual change)
- **`src/routes/+layout.svelte`**: Class updates to header, nav, logo mark, and footer
- **`src/lib/components/PwaPrompts.svelte`**: Style update
- **`package.json`**: Remove old `@fontsource` packages, add Space Grotesk and Inter/Geist
- **All route pages**: Card, button, and tag class names may need updating where hardcoded old color tokens are used
- **No API or routing changes** — purely visual
- **Accessibility**: Must maintain WCAG 2.1 AA contrast ratios; Acid Lemon on Void Black requires verification
