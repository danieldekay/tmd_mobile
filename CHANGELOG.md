# Changelog

All notable changes to TMD Mobile will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Landing Page & PWA Install Experience (2026-05)

- **Landing page** (`/`): Complete hero, features showcase, TMD directory info, install call-to-action, and explore CTA
- **PWA detection system**: Automatic browser/OS detection with support matrix
  - Browsers: Chrome, Edge, Opera, Brave, Firefox, Safari, Samsung Internet
  - OS: iOS, Android, Windows, macOS, Linux
- **Native install prompt**: Chrome/Edge/Brave/Opera/Samsung Internet with `beforeinstallprompt` event
- **iOS Add to Home Screen**: Safari on iOS with step-by-step modal instructions
- **Firefox PWA support**: Informational message with fallback bookmarking suggestions
- **Samsung Internet support**: 3-step installation instructions
- **PWA event listeners**: `pwa-install-ready` and `pwa-installed` custom events
- **Static prerendering**: Landing page optimized for fast initial load
- **Responsive design**: Mobile-first CSS with breakpoints at 480px, 768px, 1024px, 1200px
- **Accessibility**: WCAG AA color contrast, semantic HTML, keyboard navigation, focus management
- **Comprehensive tests**:
  - Unit tests for PWA detection utilities (getBrowser, getOS, getInstallMethod, etc.)
  - Component tests for PwaInstallCard and PwaInstallInstructions modals
  - Integration tests for beforeinstallprompt and appinstalled events
  - Landing page component and rendering tests

### Technical Details

- Added type definitions: `BeforeInstallPromptEvent`, `Browser`, `OS`, `InstallMethod`, `PwaInstallState`
- Utilities module (`pwa-install.ts`): 11 functions for detection, event handling, and install flow
- Components:
  - `PwaInstallCard.svelte`: Main install prompt with state management
  - `PwaInstallInstructions.svelte`: Modal wrapper with accessibility features
  - `PwaInstallInstructionsIos.svelte`: 4-step iOS Safari guide
  - `PwaInstallInstructionsFirefox.svelte`: Fallback information and suggestions
  - `PwaInstallInstructionsSamsung.svelte`: 3-step Samsung Internet guide
- Landing page with 6 sections: hero, features grid, TMD directory info, install card, explore CTA
- Features data: 5 prominent features (Events & Calendar, Teachers & DJs, Event Series, Notifications, Offline Access)
- Documentation: Complete PWA installation and testing guide

### Browser Support Matrix

| Platform | Browser | Install Method | Status |
|----------|---------|-------|---------|
| Android | Chrome/Edge/Brave/Opera/Samsung | Native prompt | ✅ Supported |
| iOS | Safari | Manual Add to Home Screen | ✅ Supported |
| Windows/macOS/Linux | Chrome/Edge/Brave/Opera | Native prompt | ✅ Supported |
| All Platforms | Firefox | Bookmarking (native support coming) | ⏳ Coming soon |

---

## Future Roadmap

- [ ] Complete feature parity with TMD4 (events, teachers, series)
- [ ] Event search and filtering
- [ ] Saved events and reminders
- [ ] Offline event data caching
- [ ] Authentication and user profiles
- [ ] Push notifications
- [ ] Map-based event discovery
- [ ] Performance monitoring and analytics
- [ ] Dark mode support
