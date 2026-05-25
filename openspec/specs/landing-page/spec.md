# Spec: Landing Page Route

## File Path

`src/routes/+page.svelte`

## Purpose

The landing page is the entry point for new users. It introduces TMD Mobile, highlights its value, and provides a guided PWA install experience with browser/OS auto-detection.

## Route Configuration

| Property    | Value                       |
| ----------- | --------------------------- |
| Route Path  | `/` (home)                  |
| Prerendered | Yes (static HTML)           |
| Metadata    | Title, description, OG tags |

## Page Structure

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
```

## Sections

### 1. Head / Meta

- Title: "TMD Mobile - Discover Tango Marathons"
- Description: "Browse curated tango marathons, teachers, and DJs. Install the free PWA app for offline access and instant notifications."
- Open Graph and Twitter card tags for social sharing

### 2. Hero Section

- Main Heading: "Discover Tango Marathons"
- Subheading: "Explore curated events, teachers, and DJs. Install the free app for offline access and instant notifications."
- CTAs: "Install Now", "Explore as Web"

### 3. Features Section

Grid of 5 feature cards:

1. Curated Events & Calendar
2. Teachers & DJs Directory
3. Event Series Tracking
4. Instant Notifications
5. Offline Event Access

### 4. TMD Directory Section

Brief introduction to The Tango Marathon Directory with link to main site.

### 5. Install Card Section

Dynamic `PwaInstallCard` component showing browser/OS-specific install guidance.

### 6. Explore Section

Quick link to `/events` for users ready to browse.

## Styling

- Responsive grid layout for features
- Flexbox column layout for main sections
- CSS variables for theme colors
- Reduced motion support

## Accessibility

- Proper heading hierarchy (H1 → H2 → H3)
- Keyboard accessible buttons and links
- Sufficient color contrast
- Focus indicators visible
