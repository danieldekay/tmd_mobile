# PWA Installation & Usage Guide

## Overview

TMD Mobile is a Progressive Web App (PWA) that can be installed on mobile devices and desktops for a native-like experience. This guide explains how the PWA installation experience works and how to test it locally.

## What is a PWA?

A Progressive Web App is a web application that uses modern web technologies to provide capabilities similar to native apps, including:

- **Installable**: Can be added to home screen or app menu
- **Offline-capable**: Works without internet (with cached data)
- **Fast**: Near-instant load times with service worker caching
- **Responsive**: Optimized for all device sizes
- **Engaging**: Can send notifications and have app-like UI

## Browser Support

### Installation Methods by Platform

| Platform | Browser | Install Method | Status |
|----------|---------|-------|---------|
| **Android** | Chrome | Native prompt (`beforeinstallprompt`) | ✅ Supported |
| **Android** | Edge | Native prompt | ✅ Supported |
| **Android** | Opera | Native prompt | ✅ Supported |
| **Android** | Brave | Native prompt | ✅ Supported |
| **Android** | Samsung Internet | Native prompt | ✅ Supported |
| **Android** | Firefox | Manual workaround | ⏳ Coming soon |
| **iOS** | Safari | Manual "Add to Home Screen" | ✅ Supported |
| **Windows** | Chrome/Edge | Native prompt | ✅ Supported |
| **macOS** | Chrome/Edge | Native prompt | ✅ Supported |
| **macOS** | Safari | Not available | ❌ Not supported |
| **Desktop/Linux** | Chrome/Firefox | Native prompt | ✅ Supported |

## How PWA Installation Works

### Chrome/Chromium Browsers (Android, Windows, macOS)

1. User visits the app
2. Browser fires `beforeinstallprompt` event
3. "Install Now" button appears
4. User clicks button
5. Native browser install prompt appears
6. User confirms installation
7. App is added to home screen/app menu

**Technical details:**
- Uses native `beforeinstallprompt` event
- Deferred and triggered on user action
- Browser handles all installation UI
- `appinstalled` event fires on successful installation

### iOS Safari

1. User visits the app in Safari
2. Detection: Browser is Safari + OS is iOS
3. "Add to Home Screen" button appears
4. User clicks button
5. Modal with step-by-step instructions appears
6. User follows manual steps:
   - Tap Share at bottom
   - Scroll to "Add to Home Screen"
   - Confirm app name
   - Tap Add
7. App is added to home screen

### Firefox

1. User visits the app
2. Firefox currently has limited web app support
3. Button shows informational message about coming support
4. Fallback: User can bookmark the page or create desktop shortcut

## Local Testing

### Prerequisites

```bash
# Use Node.js version from .nvmrc
nvm use

# Install dependencies
npm install

# Build the app
npm run build

# Start dev server
npm run dev
```

### Testing PWA Installation

#### 1. Browser DevTools

Open Chrome DevTools (F12) and navigate to the **Application** tab:

- **Manifest**: Check if manifest.json is loaded correctly
- **Service Workers**: Verify service worker is registered and active
- **Storage**: Check LocalStorage and IndexedDB
- **Install Prompt**: Use "Test Manifest" to simulate beforeinstallprompt

#### 2. Testing Different Browsers

**Chrome/Edge:**
- Visit the app
- Look for install prompt in address bar or menu
- Click to install
- Verify app appears in `chrome://apps`

**Safari (iOS):**
- Open app in Safari on iPhone/iPad
- Tap Share button (bottom center)
- Scroll down → "Add to Home Screen"
- Follow prompts
- Verify app appears on home screen

**Firefox:**
- Visit the app
- Verify "Install support coming" message appears
- No native install, but bookmark/shortcut works

#### 3. Testing Detection Logic

The app automatically detects browser and OS. Test by:

1. Opening browser DevTools console
2. Running detection functions:

```javascript
// Browser detection
import { getBrowser, getOS } from '$lib/utils/pwa-install';

console.log('Browser:', getBrowser()); // e.g., 'chrome'
console.log('OS:', getOS());             // e.g., 'android'
```

#### 4. Testing Event Listeners

Verify PWA event listeners are working:

```javascript
// Listen for install ready
window.addEventListener('pwa-install-ready', (e) => {
  console.log('PWA ready to install');
});

// Listen for successful install
window.addEventListener('pwa-installed', (e) => {
  console.log('PWA installed!');
});

// Check if deferred prompt is available
console.log('Deferred prompt:', window.deferredPrompt);
```

## Troubleshooting

### Install Prompt Not Appearing

**Chrome/Edge/Samsung:**
1. App must have valid manifest.json ✓ (configured in build)
2. Must be HTTPS in production (http://localhost is OK for dev)
3. Must have valid service worker ✓ (auto-generated)
4. User cannot have dismissed prompt too recently
5. Check DevTools → Application → Manifest

**iOS/Safari:**
1. Must be in Safari (not in-app browser or Chrome)
2. Check if URL is being added to home screen (not bookmarked)
3. Verify button appears in install section

### Service Worker Not Registering

```javascript
// Check service worker registration
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    console.log('Registered service workers:', registrations);
  });
```

### Manual Install Issues

**For development/testing:**
- Chrome: `chrome://apps` → Create shortcuts
- Firefox: Right-click → Create shortcut
- Safari: Use "Add to Home Screen" with web clipper

## Testing Checklist

- [ ] Landing page loads without errors
- [ ] PWA install state detected correctly
- [ ] Browser/OS detection works for test devices
- [ ] Install prompt/button appears for supported platforms
- [ ] Install flow completes successfully
- [ ] App can be removed from home screen
- [ ] App launches from home screen
- [ ] Service worker caches assets
- [ ] App works offline (with cached data)
- [ ] Notifications work (if enabled)
- [ ] All accessibility features work

## Implementation Details

### File Structure

```
src/
├── lib/
│   ├── utils/
│   │   └── pwa-install.ts           # Detection & install utilities
│   ├── types/
│   │   └── pwa.ts                   # PWA type definitions
│   ├── components/
│   │   ├── PwaInstallCard.svelte    # Main install prompt
│   │   ├── PwaInstallInstructions.svelte
│   │   ├── PwaInstallInstructionsIos.svelte
│   │   ├── PwaInstallInstructionsFirefox.svelte
│   │   └── PwaInstallInstructionsSamsung.svelte
│   └── data/
│       └── landing-features.ts       # Feature cards data
├── routes/
│   ├── +layout.svelte               # PWA listeners setup
│   ├── +page.svelte                 # Landing page
│   └── +page.ts                     # Prerender config
└── app.d.ts                         # Type definitions
```

### Key Exports

```typescript
// Browser detection
getBrowser(): Browser
getOS(): OS

// Install detection
supportsNativeInstallPrompt(): boolean
isSafariStandalone(): boolean
getInstallMethod(): InstallMethod

// Install state
getPwaInstallState(): Promise<PwaInstallState>
isInstallable(): Promise<boolean>

// Install triggering
requestInstall(): Promise<boolean>

// Event listeners
setupBeforeInstallPromptListener(): void
setupAppInstalledListener(): void

// Utilities
getBrowserName(browser: Browser): string
getInstallInstructions(method: InstallMethod): string | null
```

## References

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: Web App Install Prompts](https://web.dev/install-prompt/)
- [Chrome DevTools: PWA Debugging](https://developer.chrome.com/docs/devtools/progressive-web-apps/)
- [Apple: Web App Support on iOS](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Firefox: Manifest WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/scope)

## Questions & Support

For issues or questions:
1. Check the troubleshooting section above
2. Search [MDN Web Docs](https://developer.mozilla.org/)
3. Review [web.dev PWA resources](https://web.dev/progressive-web-apps/)
4. Check GitHub issues for similar problems
5. Report bugs with browser/OS information and console logs
