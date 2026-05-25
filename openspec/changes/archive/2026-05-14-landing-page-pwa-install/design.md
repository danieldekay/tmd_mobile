# Design Artifact: Landing Page & PWA Install Experience

## Overview

This document outlines the UX/UI design for the TMD Mobile landing page and the guided PWA install experience. The design prioritizes clarity, visual hierarchy, and platform-specific install guidance.

## Landing Page Layout

### Information Architecture

```
┌─────────────────────────────────────────┐
│              Navigation                 │
│         (optional header/logo)          │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────────────────────┐   │
│   │    Hero Section                 │   │
│   │  "Discover Tango Marathons"     │   │
│   │  Subheading: About TMD          │   │
│   │  [Install Now] [Explore as Web] │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │   Features Section              │   │
│   │  - Curated Events & Calendar    │   │
│   │  - Teachers & DJs Directory     │   │
│   │  - Event Series Tracking        │   │
│   │  - Instant Notifications        │   │
│   │  - Offline Event Access         │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │   The Tango Marathon Directory  │   │
│   │   Section with benefits & link  │   │
│   │   to tangomarathons.com         │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  Install Card (Dynamic)         │   │
│   │  Shows browser/OS-specific CTA  │   │
│   └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│              Footer                     │
│   About | Privacy | Terms | GitHub      │
└─────────────────────────────────────────┘
```

### Visual Hierarchy

**Primary Elements:**
1. Hero heading: "Discover Tango Marathons" (large, bold, accent color)
2. Hero subheading: Brief description of TMD Mobile + call to action
3. "Install Now" button (prominent, primary color, large tap target ≥48px)
4. Features list (secondary color, readable at smaller sizes)

**Secondary Elements:**
1. Navigation/branding (top)
2. Section headings for Features and TMD Directory
3. Footer links

### Key Sections

#### 1. Hero Section
- **Layout**: Full viewport width, centered content
- **Background**: Gradient or solid color (theme-aligned)
- **Typography**: 
  - Main heading: 32–48px, bold, dark/light based on theme
  - Subheading: 16–20px, secondary color, medium weight
- **CTA Buttons**:
  - "Install Now": Primary button, 16px font, padding 12px 24px, rounded corners
  - "Explore as Web": Secondary/outline button, same size/padding
- **Responsive**: Stack vertically on mobile, side-by-side on tablet+

#### 2. Features Section
- **Layout**: Grid or single column depending on screen size
- **Cards per row**: 1 on mobile, 2 on tablet, 3+ on desktop
- **Feature Card**:
  - Icon (20–24px)
  - Title (18px, bold)
  - Description (14px, secondary text)
  - Tap target: minimum 48x48px
- **Features to highlight**:
  1. Curated Events & Calendar
  2. Teachers & DJs Directory
  3. Event Series Tracking
  4. Instant Notifications
  5. Offline Event Access

#### 3. The Tango Marathon Directory Section
- **Layout**: Centered text with optional background
- **Content**:
  - Heading: "About The Tango Marathon Directory"
  - Description: 2–3 sentences about TMD's mission and scope
  - CTA: "Visit tangomarathons.com" (link/button)
- **Typography**: Consistent with page

#### 4. Install Card Section
- **Layout**: Full width on mobile, contained width on desktop (max 600px)
- **Dynamic Content**:
  - Chrome/Chromium browsers: "Install App" button (triggers native `beforeinstallprompt`)
  - iOS/Safari: "Add to Home Screen" button + instructions link (opens modal)
  - Firefox: "Install App" with instructions (opens modal or external link)
  - Samsung Internet: Native prompt support
  - Other: Fallback text "This app works best when installed"

### Component Specifications

#### Hero Component
```typescript
- Background color: theme.primary or gradient
- Heading: 32–48px (responsive)
- Subheading: 16–20px
- Button group: flex, gap 12px, wrap on mobile
- Padding: 40px on desktop, 24px on mobile
- Min-height: 50vh (flexible)
```

#### Feature Card Component
```typescript
- Width: 100% / cols (1, 2, or 3 based on breakpoint)
- Padding: 20px
- Border-radius: 8px
- Box-shadow: subtle (0 2px 8px rgba(0,0,0,0.1))
- Icon color: theme.primary
- Hover state: slight elevation, background color shift
```

#### PwaInstallCard Component
```typescript
- Width: 100% on mobile, max 600px on desktop
- Padding: 24px
- Border: 1px solid theme.border (or subtle shadow)
- Border-radius: 8px
- Content:
  - Title: 18px, bold
  - Message: 14px, secondary text
  - Button: Dynamic based on platform (see below)
  - Optional: Instructions link/icon for iOS
```

## Platform-Specific User Flows

### Chrome/Edge/Chromium Browsers
**Flow:**
1. User lands on page
2. Browser fires `beforeinstallprompt` event
3. "Install Now" button enabled and highlighted
4. User clicks → native browser prompt appears
5. User installs app (or dismisses)
6. Button state updates (success/hidden if installed)

**UX Details:**
- Button text: "Install App" or "Add to Home Screen" (OS-appropriate)
- Success feedback: Toast or brief confirmation message
- Re-prompt: Only once per session if dismissed

### iOS/Safari
**Flow:**
1. User lands on page
2. Detect Safari browser + iOS OS
3. "Add to Home Screen" button enabled
4. User clicks → modal opens with step-by-step instructions
5. Modal shows:
   - Numbered steps (1–3)
   - Screenshots or icons indicating tap positions
   - "Share" button icon → "Add to Home Screen" menu item
   - Example: "Tap Share (bottom center) → Scroll down → Add to Home Screen"
6. User dismisses modal and follows instructions

**UX Details:**
- Button text: "Add to Home Screen"
- Modal: Fullscreen or centered overlay (max 600px width)
- Dismiss: X button or tap outside
- Visual aids: Diagrams or icons showing Safari menu structure

### Firefox
**Flow:**
1. User lands on page
2. Detect Firefox browser
3. "Install App" button visible with note: "Web app installation coming soon"
4. Optional: Link to MDN or Firefox documentation
5. Fallback: Message "This app works best when installed" (text-only)

**UX Details:**
- Button state: Disabled or informational
- Fallback message: Subtle, doesn't obstruct experience

### Android (non-Chrome)
**Flow:**
1. User lands on page on Samsung Internet or similar
2. Platform support detected
3. "Install App" button or native prompt (if supported)
4. Behavior similar to Chrome but with browser-specific styling

### Fallback (Other Browsers)
**Flow:**
1. No install support detected
2. Message: "This app works best when installed on your device"
3. Optional: Link to browser compatibility guide

## Responsive Breakpoints

| Breakpoint | Screen Size | Layout Changes |
|-----------|-----------|-----------|
| Mobile | ≤640px | Single column, 1 feature per row, hero full height |
| Tablet | 641–1024px | 2 feature columns, hero expanded |
| Desktop | ≥1025px | 3+ feature columns, container max-width 1200px |

## Color & Typography

### Typography Scale
- H1: 32–48px (hero heading)
- H2: 24–32px (section headings)
- H3: 18–24px (card titles)
- Body: 14–16px
- Small: 12–14px (captions, metadata)

### Color Scheme
- Primary: Theme accent (tango red, warm orange, or brand color)
- Secondary: Neutral gray (text)
- Background: White or light gray
- Success: Green (for install confirmation)
- Border: Light gray (subtle dividers)

### Accessibility
- Color contrast: WCAG AA (≥4.5:1 for text)
- Focus states: Visible 2–3px outline (not removed)
- Buttons: Minimum 48x48px tap target
- Text: No color alone to convey meaning (pair with icons/text)

## Interaction Patterns

### Button States
- **Default**: Enabled, color-filled, pointer cursor
- **Hover** (desktop): Slight background shift, shadow elevation
- **Active/Pressed**: Visual feedback (darker shade or scaledown)
- **Disabled**: 50% opacity, cursor not-allowed
- **Loading**: Spinner or progress indicator inside button
- **Success**: Checkmark icon, green background (brief), then state reset or hidden

### Modal (iOS Instructions)
- **Appear**: Fade-in + slide-up (iOS-like animation)
- **Dismiss**: Fade-out + slide-down, X button, or tap outside
- **Content**: Scrollable if instructions exceed viewport height
- **Buttons**: "Got it" or "Close" at bottom

### Accessibility Considerations
- Links: Underlined and distinguishable from text
- Form inputs (if any): Labels associated with `<label>` tags
- Icons: Always paired with text labels
- Modals: Focus trap, semantic HTML (`role="dialog"`)
- Keyboard navigation: Tab order logical, Enter/Escape support

## Animation & Motion

### Transitions
- Page load: Fade-in (200ms)
- Button hover: Color transition (150ms ease-in-out)
- Modal appear: Slide-up from bottom (300ms cubic-bezier)
- Feature cards: Subtle fade-in on scroll (lazy load friendly)

### Preferences
- Respect `prefers-reduced-motion` media query
- Fallback: Instant state change (no animation) if user prefers

## SEO & Meta

- Page title: "TMD Mobile - Discover Tango Marathons"
- Meta description: "Browse curated tango marathons, teachers, and DJs. Install the free PWA app for offline access and instant notifications."
- Open Graph: Social card with hero image or TMD logo

## Dark Mode Support

- Landing page supports theme toggle (if app has light/dark mode)
- All sections adapt colors (button, backgrounds, text)
- Contrast maintained in both modes
