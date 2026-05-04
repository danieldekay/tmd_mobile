## 1. Font Packages

- [ ] 1.1 Run `npm install @fontsource-variable/space-grotesk @fontsource-variable/inter`
- [ ] 1.2 Run `npm uninstall @fontsource/atkinson-hyperlegible-next @fontsource/ibm-plex-sans-condensed`
- [ ] 1.3 Run `npm run check` — confirm no missing import errors before touching CSS

## 2. CSS Token Rewrite (`src/app.css`)

- [ ] 2.1 Replace font `@import` lines: remove Atkinson/IBM Plex imports; add `@fontsource-variable/space-grotesk/index.css` and `@fontsource-variable/inter/index.css`
- [ ] 2.2 Replace `:root` block — remove `--ink`, `--pine`, `--wine`, `--gold`, `--paper`, `--shell`, `--mist`, `--line`, `--muted`; add `--void: 9 9 11`, `--paper: 250 250 250`, `--concrete: 244 244 245`, `--acid: 212 255 0`, `--magenta: 255 0 127`, `--cyan: 0 240 255`
- [ ] 2.3 Rewrite `@theme` block: map new semantic aliases (`--color-canvas`, `--color-panel`, `--color-ink`, `--color-primary`, `--color-accent`, `--color-info`); set `--font-sans: 'Inter'`, `--font-display: 'Space Grotesk'`; set `--radius-panel: 0`, `--radius-control: 0`; set `--shadow-panel: 4px 4px 0 #09090B`, `--shadow-control: 2px 2px 0 #09090B`
- [ ] 2.4 Update `html` and `body` base styles: `background: rgb(var(--paper))`, `color: rgb(var(--void))`, update `font-family` to `'Inter'`
- [ ] 2.5 Update `h1, h2, h3` to use `'Space Grotesk'`
- [ ] 2.6 Update `:focus-visible` outline colour from `--gold` to `rgb(var(--acid))`
- [ ] 2.7 Rewrite `.panel` component class: 2px solid `#09090B` border, `bg-panel`, `shadow-panel`, `rounded-panel` (resolves to 0)
- [ ] 2.8 Rewrite `.button-primary`: `bg-primary` (acid), `text-ink` (void), 2px solid `#09090B` border, `shadow-control`, 0 radius; hover: invert to `bg-ink text-primary`
- [ ] 2.9 Rewrite `.button-secondary`: `bg-panel` (concrete), `text-ink`, 2px solid `#09090B` border, `shadow-control`, 0 radius; hover: `bg-canvas`
- [ ] 2.10 Rewrite `.nav-link`: 0 radius, 2px solid border, min-height 44px (accessible tap target)
- [ ] 2.11 Rewrite `.nav-link-active`: `bg-primary` (acid), `text-ink`, 2px solid `#09090B`
- [ ] 2.12 Rewrite `.nav-link-idle`: transparent bg, `text-ink`, 2px solid transparent; hover: `bg-panel` border `#09090B`
- [ ] 2.13 Run `npm run check` — confirm no Tailwind class errors

## 3. Layout Updates (`src/routes/+layout.svelte`)

- [ ] 3.1 Update header: change `bg-canvas/95 backdrop-blur` to `bg-canvas border-b-2 border-ink` (remove blur, keep solid border)
- [ ] 3.2 Update logo mark: change `rounded-panel bg-primary` to `bg-primary text-ink` (acid background, void text, 0 radius)
- [ ] 3.3 Verify nav `gap-2` and `overflow-x-auto` still work with 0-radius tabs
- [ ] 3.4 Update footer: change `border-t border-line` to `border-t-2 border-ink`

## 4. PWA Prompts Component (`src/lib/components/PwaPrompts.svelte`)

- [ ] 4.1 Replace any soft-panel, rounded, blurred backdrop styles with `.panel` or inline 2px-border brutalist equivalents
- [ ] 4.2 Ensure install/dismiss buttons use `.button-primary` / `.button-secondary` classes
- [ ] 4.3 Run `npm run check`

## 5. Route-level Audit

- [ ] 5.1 Search all `.svelte` files in `src/routes/` for hardcoded old colour tokens (`pine`, `wine`, `gold`, `shell`, `mist`, `line`, `warm`, `soft`) — list any found
- [ ] 5.2 Replace found hardcoded old token classes with the new equivalents (see design.md token mapping)
- [ ] 5.3 Run `npm run check` — confirm zero TypeScript/Svelte errors after route updates

## 6. Contrast and Visual Audit

- [ ] 6.1 Run `npm run dev` and open in browser; verify header, nav, buttons, and cards render with hard shadows and sharp borders
- [ ] 6.2 Check Acid Lemon is NEVER used as text on white/concrete backgrounds (only on `--void` backgrounds)
- [ ] 6.3 Verify minimum 44×44px tap targets on all `.nav-link` and `.button-*` elements in mobile viewport
- [ ] 6.4 Verify `:focus-visible` ring is visible in keyboard navigation

## 7. Build and Deploy

- [ ] 7.1 Run `npm run build` — confirm static build succeeds with no CSS errors
- [ ] 7.2 Deploy via `npx wrangler deploy` with Node 22 (`nvm use 22`)
- [ ] 7.3 Smoke-test live at `https://tmd-mobile.daniel-1f6.workers.dev` — confirm new fonts and palette load correctly
