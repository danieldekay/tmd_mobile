# Specification: Landing Page Route

## File Path

`src/routes/+page.svelte`

## Overview

The landing page is the entry point for new users. It introduces TMD Mobile, highlights its value, and provides a guided PWA install experience with browser/OS auto-detection. The page is statically prerendered and serves as the home route (`/`).

## Route Configuration

| Property | Value |
|----------|-------|
| Route Path | `/` (home) |
| File | `src/routes/+page.svelte` |
| Prerendered | Yes (static HTML) |
| Layout | `src/routes/+layout.svelte` (inherited) |
| Metadata | Title, description, OG tags |

## Page Structure

### Import & Setup

```typescript
import { onMount } from 'svelte';
import PwaInstallCard from '$lib/components/PwaInstallCard.svelte';
import { getPwaInstallState } from '$lib/utils/pwa-install';

let pwaInstallState = $state(null);
let beenInstalled = $state(false);

onMount(async () => {
  pwaInstallState = await getPwaInstallState();
  beenInstalled = await checkIfInstalled();
});
```

### Component Tree

```
<svelte:head>
  <!-- Meta tags -->
</svelte:head>

<main class="landing-page">
  <!-- Hero Section -->
  <HeroSection />
  
  <!-- Features Section -->
  <FeaturesSection />
  
  <!-- TMD Directory Section -->
  <TmdDirectorySection />
  
  <!-- Install Card (dynamic) -->
  <PwaInstallCard {pwaInstallState} />
  
  <!-- CTA to Events -->
  <ExploreSection />
</main>

<style>
  /* Styling: See below */
</style>
```

## Sections

### 1. Head / Meta

```html
<svelte:head>
  <title>TMD Mobile - Discover Tango Marathons</title>
  <meta name="description" content="Browse curated tango marathons, teachers, and DJs. Install the free PWA app for offline access and instant notifications." />
  <meta name="theme-color" content="#e74c3c" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="TMD Mobile - Discover Tango Marathons" />
  <meta property="og:description" content="Browse curated tango marathons, teachers, and DJs. Install the free PWA app." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mobile.tangomarathons.com/" />
  <meta property="og:image" content="https://mobile.tangomarathons.com/og-image.png" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="TMD Mobile" />
  <meta name="twitter:description" content="Discover Tango Marathons" />
</svelte:head>
```

### 2. Hero Section

**Content:**
- Main Heading: "Discover Tango Marathons"
- Subheading: "Explore curated events, teachers, and DJs. Install the free app for offline access and instant notifications."
- CTAs:
  - Primary: "Install Now" (dynamic, via `PwaInstallCard`)
  - Secondary: "Explore as Web" (link to `/events`)

**Structure:**
```html
<section class="hero">
  <div class="hero-content">
    <h1>Discover Tango Marathons</h1>
    <p class="tagline">Explore curated events, teachers, and DJs. Install the free app for offline access and instant notifications.</p>
    <div class="cta-buttons">
      <button class="btn btn-primary">Install Now</button>
      <a href="/events" class="btn btn-secondary">Explore as Web</a>
    </div>
  </div>
</section>
```

**Styling:**
- Full viewport width, centered content
- Background: Theme primary color or gradient
- Min-height: 50vh
- Padding: 40px (desktop), 24px (mobile)
- Typography: H1 36px, p 18px

### 3. Features Section

**Content:**
Grid of 5 feature cards highlighting TMD Mobile capabilities:

| Feature | Icon | Description |
|---------|------|-------------|
| Curated Events & Calendar | Calendar icon | Browse marathons by date, location, and category |
| Teachers & DJs Directory | Musician icon | Discover instructors and performers |
| Event Series Tracking | Series icon | Follow multi-day events and recurrences |
| Instant Notifications | Bell icon | Get alerts for new events and updates |
| Offline Event Access | Download icon | Access saved events without internet |

**Structure:**
```html
<section class="features">
  <h2>Why Choose TMD Mobile?</h2>
  <div class="features-grid">
    <!-- Feature cards -->
    {#each features as feature (feature.id)}
      <div class="feature-card">
        <div class="feature-icon">{@html feature.icon}</div>
        <h3>{feature.title}</h3>
        <p>{feature.description}</p>
      </div>
    {/each}
  </div>
</section>
```

**Styling:**
- Grid: auto (mobile) / 2 columns (tablet) / 3+ columns (desktop)
- Cards: 200px × 240px (flexible), rounded 8px, shadow
- Hover: Elevation effect, slight background shift

### 4. TMD Directory Section

**Content:**
- Heading: "About The Tango Marathon Directory"
- Description: "The Tango Marathon Directory (TMD) is the world's most comprehensive, curated database of tango marathons. Founded in 2013, TMD provides dancers and organizers with essential information about events, teachers, DJs, and venues worldwide."
- CTA: Link to "Visit tangomarathons.com"

**Structure:**
```html
<section class="tmd-directory">
  <div class="tmd-content">
    <h2>About The Tango Marathon Directory</h2>
    <p>The Tango Marathon Directory (TMD) is the world's most comprehensive, curated database of tango marathons...</p>
    <a href="https://www.tangomarathons.com" class="btn btn-outline" target="_blank" rel="noopener noreferrer">
      Visit tangomarathons.com
    </a>
  </div>
</section>
```

**Styling:**
- Background: Subtle accent or transparent
- Max-width: 600px, centered
- Padding: 60px 40px (responsive)

### 5. Install Card Section

**Content:**
Dynamic `PwaInstallCard` component that shows browser/OS-specific install guidance.

**Structure:**
```html
<section class="install-section">
  <PwaInstallCard {pwaInstallState} />
</section>
```

See `specs/pwa-install-components.md` for `PwaInstallCard` details.

### 6. Explore Section (Optional)

**Content:**
Quick link to events page if not already installed.

**Structure:**
```html
<section class="explore">
  <h2>Ready to explore?</h2>
  <a href="/events" class="btn btn-primary">Browse Events Now</a>
</section>
```

## Styling

### CSS Classes & Layout

```css
/* Main container */
.landing-page {
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding: 0;
}

/* Sections */
section {
  padding: 60px 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

section.hero {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  padding: 80px 40px;
  text-align: center;
  border-radius: 0;
}

section.features {
  background: var(--color-background-secondary);
}

section.tmd-directory {
  background: var(--color-background);
  text-align: center;
}

section.install-section {
  background: var(--color-background-secondary);
  display: flex;
  justify-content: center;
}

section.explore {
  background: var(--color-primary);
  color: white;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  section {
    padding: 40px 24px;
    gap: 40px;
  }
  
  section.hero {
    padding: 40px 24px;
    min-height: auto;
  }
}

@media (max-width: 480px) {
  section {
    padding: 24px 16px;
    gap: 24px;
  }
}
```

### Grid Layout for Features

```css
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background: var(--color-surface);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
```

### Button Styling

```css
.btn {
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
  border: none;
  min-height: 48px;
  min-width: 48px;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-secondary,
.btn-outline {
  background: transparent;
  border: 2px solid currentColor;
  color: var(--color-primary);
}

.btn-secondary:hover {
  background: var(--color-primary);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Animations

### Page Load

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.landing-page {
  animation: fadeIn 0.3s ease-out;
}
```

### Section Stagger (Optional)

```css
section {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Data & State

### Page Props (SvelteKit)

None required. Page is static.

### Component State

```typescript
let pwaInstallState: PwaInstallState | null = null;
let beenInstalled: boolean = false;

onMount(async () => {
  pwaInstallState = await getPwaInstallState();
  beenInstalled = await checkIfInstalled();
});
```

## Prerendering

The landing page should be prerendered as static HTML during the build process:

```typescript
// src/routes/+page.ts
export const prerender = true;
```

No dynamic data is required for the landing page.

## Accessibility

- Headings: Proper nesting (H1 → H2 → H3)
- Links: Underlined, descriptive text (not "click here")
- Buttons: Proper `role="button"`, keyboard accessible
- Images/Icons: Alt text or `aria-label`
- Focus: Visible outline on keyboard navigation
- Color: Not sole method of communication (icons + text)

## Performance

- Image optimization: WebP with fallback, lazy loading for below-fold
- CSS: Inline critical styles, defer non-critical
- JavaScript: Minimal; PWA detection only on mount
- Bundle size: Target <50KB gzipped (page JS)
- Core Web Vitals: LCP <2.5s, CLS <0.1, FID <100ms

## SEO

- Canonical URL: `https://mobile.tangomarathons.com/`
- Robots: Index, follow
- Sitemap: Included in `sitemap.xml`
- Structured data: Optional JSON-LD for `WebApplication` or `SoftwareApplication`
