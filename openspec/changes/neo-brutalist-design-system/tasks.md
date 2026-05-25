# Tasks: Neo Brutalist Design System

## Task Group: Design token foundation

- [ ] Define color tokens on `:root` in `src/app.css` (canvas, panel, ink, primary, accent, info)
- [ ] Define typography tokens (`--font-sans`, `--font-display`) in `src/app.css`
- [ ] Define shadow tokens with offset-based shadows for panels and controls
- [ ] Set border-radius to 0 for neo-brutalist sharp corners

## Task Group: Base component styles

- [ ] Create `.panel` component style with border, panel bg, neo-brutalist shadow
- [ ] Create `.button-primary` with acid-green bg, hover-invert state
- [ ] Create `.button-secondary` with outline style, hover-to-fill
- [ ] Create `.nav-link` styles (active, idle, active)
- [ ] Create `.eyebrow` and `.meta-text` styles
- [ ] Create `.app-shell` layout rules with centered, constrained content

## Task Group: App layout integration

- [ ] Add `app-shell` wrapper to `src/routes/+layout.svelte` with sticky header, scrollable content, sticky footer
- [ ] Verify header stays at top on scroll
- [ ] Verify footer sticks to bottom with flex column

## Task Group: Landing page components

- [ ] Create `src/lib/components/landing/HeroSection.svelte` with neo-brutalist CTA buttons
- [ ] Create `src/lib/components/landing/FeaturesSection.svelte` with feature cards grid
- [ ] Wire HeroSection + FeaturesSection into `src/routes/+page.svelte` beneath PwaInstallCard
- [ ] Keep `PwaInstallCard` component on landing page
- [ ] Add prefers-reduced-motion media query to `src/app.css`

## Task Group: Visual diff testing

- [ ] Verify neo-brutalist consistency across all pages (bold borders, solid shadows)
- [ ] Verify focus styles with outline and offset color on interactive elements
- [ ] Add `@media (prefers-reduced-motion)` rules to disable transitions
- [ ] Run visual diff testing across all 2.0+ pages
- [ ] Verify all neo-brutalist components render as expected (no soft shadows)
