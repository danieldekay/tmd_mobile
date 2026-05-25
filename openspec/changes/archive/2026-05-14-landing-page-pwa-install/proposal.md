## Why

TMD Mobile currently loads directly into the events list. New users arrive with no context about what the app is, what TMD is, or how to install it on their home screen. There's no guided onboarding or install experience. Users on iOS have particularly poor discoverability because there is no native "Install App" button (iOS requires manual menu navigation). This change adds a dedicated landing page that explains the purpose of the app, introduces The Tango Marathon Directory, and provides a guided install experience with auto-detection of browser/OS and platform-specific instructions.

## What Changes

- NEW — `src/routes/+page.svelte`: Landing page with TMD/TMD Mobile description, features overview, and install button that auto-detects the user's browser and OS
- NEW — `src/lib/utils/pwa-install.ts`: Browser/OS detection utilities and install handling logic for Chrome/Edge (native `beforeinstallprompt`), iOS (SafariStandaloneMode detection + instructions), Firefox, Samsung Internet, etc.
- NEW — `src/lib/components/PwaInstallCard.svelte`: Reusable PWA install component with "Install Now" button that either triggers native install or displays platform-specific instructions (modal for iOS with step-by-step screenshots)
- NEW — `src/lib/components/PwaInstallInstructions.svelte`: Modal component showing step-by-step iOS install instructions (Add to Home Screen flow)
- MODIFIED — `src/routes/events/+page.svelte`: Update link/navigation to ensure landing page is accessible from the home page or app menu
- MODIFIED — `src/app.d.ts`: add `BeforeInstallPromptEvent` type declaration and global `__BUILD_TIMESTAMP__` for cache busting
- MODIFIED — `src/routes/+layout.svelte`: add navigation link to landing page (optional home/info link in footer or nav, or home icon)

## Capabilities

### New Capabilities
- `pwa-install-prompt`: Native install prompt for Chromium browsers (Chrome, Edge, Opera, Brave) triggered automatically or via "Install Now" button
- `pwa-install-instructions`: Platform-specific install instructions for iOS (modal with step-by-step Add to Home Screen), Android (native prompt), and fallback text for other browsers
- `browser-os-detection`: Automatic detection of user's browser (Chrome, Safari, Firefox, Edge, Samsung, etc.) and OS (iOS, Android, Windows, macOS, Linux) to serve appropriate install guidance
- `landing-page`: New homepage explaining TMD Mobile features and The Tango Marathon Directory with CTA to install and explore events

### Modified Capabilities
- `app-navigation`: Updated primary navigation to include link to landing page or home (lightweight addition)

## Impact

- `src/routes/+page.svelte`: new landing page (home route)
- `src/lib/utils/pwa-install.ts`: new utility module for browser/OS detection and install handling
- `src/lib/components/PwaInstallCard.svelte`: new install card component
- `src/lib/components/PwaInstallInstructions.svelte`: new modal for iOS/fallback instructions
- `src/routes/events/+page.svelte`: minimal changes (ensure proper linking context)
- `src/routes/+layout.svelte`: add optional nav link to landing/home (minimal)
- `src/app.d.ts`: add `BeforeInstallPromptEvent` type and global timestamp
- No new routes beyond `/` (landing page)
- No API endpoint changes
- No auth changes
- SvelteKit static prerender: landing page should be prerendered as static HTML
