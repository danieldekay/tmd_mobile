# Specification: PWA Install Utilities

## File Path

`src/lib/utils/pwa-install.ts`

## Overview

This module provides browser/OS detection and install handling logic for PWA installation. It abstracts the complexity of different platform capabilities and serves the appropriate install method for each browser and OS combination.

## Type Definitions

```typescript
// Browser types
type Browser = 
  | 'chrome'
  | 'edge'
  | 'opera'
  | 'brave'
  | 'firefox'
  | 'safari'
  | 'samsung'
  | 'unknown';

// OS types
type OS = 
  | 'ios'
  | 'android'
  | 'windows'
  | 'macos'
  | 'linux'
  | 'unknown';

// Install state
interface PwaInstallState {
  browser: Browser;
  os: OS;
  canInstall: boolean;
  installMethod: InstallMethod;
  supportsNativePrompt: boolean;
}

type InstallMethod = 
  | 'native-prompt'      // Chrome/Edge/Brave → beforeinstallprompt
  | 'ios-instructions'   // Safari on iOS → manual Add to Home Screen
  | 'firefox-link'       // Firefox → external docs
  | 'samsung-native'     // Samsung Internet → native support
  | 'none';              // No install support

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
```

## Global Declarations

Add to `src/app.d.ts`:

```typescript
declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent | null;
  }
}
```

Declare `BeforeInstallPromptEvent` in `src/lib/types.ts` or `src/app.d.ts`:

```typescript
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
```

## Core Functions

### `getBrowser(): Browser`

Detects the user's browser by parsing the user agent string.

**Algorithm:**
1. Check for Safari (must check before Chrome, as some Chrome browsers on iOS report Safari)
2. Check for Edge (must check before Chrome, as Edge reports as Chrome)
3. Check for Opera
4. Check for Brave
5. Check for Samsung Internet
6. Check for Firefox
7. Check for Chrome
8. Return 'unknown'

**Implementation:**

```typescript
export function getBrowser(): Browser {
  const ua = navigator.userAgent;
  
  // Edge (Chromium)
  if (/Edg[e|A|iOS]/.test(ua)) return 'edge';
  
  // Opera
  if (/OPR\//.test(ua)) return 'opera';
  
  // Brave
  if (/(navigator.brave|brave)/.test(navigator.userAgent) || navigator.brave?.isBrave) {
    return 'brave';
  }
  
  // Samsung Internet
  if (/SamsungBrowser/.test(ua)) return 'samsung';
  
  // Firefox
  if (/Firefox\//.test(ua)) return 'firefox';
  
  // Safari (iOS or macOS)
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return 'safari';
  
  // Chrome (includes Chromium-based)
  if (/Chrome\//.test(ua)) return 'chrome';
  
  return 'unknown';
}
```

### `getOS(): OS`

Detects the user's OS by parsing the user agent string.

**Algorithm:**
1. Check for iOS (iPhone, iPad, iPod)
2. Check for Android
3. Check for Windows
4. Check for macOS
5. Check for Linux
6. Return 'unknown'

**Implementation:**

```typescript
export function getOS(): OS {
  const ua = navigator.userAgent;
  
  // iOS
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
  
  // Android
  if (/Android/.test(ua)) return 'android';
  
  // Windows
  if (/Windows NT/.test(ua)) return 'windows';
  
  // macOS
  if (/Macintosh|Mac OS X/.test(ua)) return 'macos';
  
  // Linux
  if (/Linux/.test(ua) && !/Android/.test(ua)) return 'linux';
  
  return 'unknown';
}
```

### `supportsNativeInstallPrompt(): boolean`

Checks if the browser supports the native `beforeinstallprompt` event.

**Behavior:**
- Returns `true` for: Chrome, Edge, Opera, Brave, Samsung Internet (when app is installable)
- Returns `false` for: Safari, Firefox, unknown browsers

**Implementation:**

```typescript
export function supportsNativeInstallPrompt(): boolean {
  const browser = getBrowser();
  return ['chrome', 'edge', 'opera', 'brave', 'samsung'].includes(browser);
}
```

### `isSafariStandalone(): boolean`

Checks if the app is running in standalone mode on iOS (i.e., already installed).

**Behavior:**
- Returns `true` if running as standalone PWA on iOS
- Used to hide install prompts for already-installed users

**Implementation:**

```typescript
export function isSafariStandalone(): boolean {
  return (
    /Safari/.test(navigator.userAgent) &&
    /iPhone|iPad|iPod/.test(navigator.userAgent) &&
    (navigator.standalone === true || window.navigator.standalone === true)
  );
}
```

### `getInstallMethod(): InstallMethod`

Determines the appropriate install method for the current browser/OS.

**Decision Tree:**
```
1. If browser supports native prompt → 'native-prompt'
2. If browser is Safari and OS is iOS → 'ios-instructions'
3. If browser is Firefox → 'firefox-link'
4. If browser is Samsung Internet → 'samsung-native'
5. Otherwise → 'none'
```

**Implementation:**

```typescript
export function getInstallMethod(): InstallMethod {
  const browser = getBrowser();
  const os = getOS();
  
  // Native prompt support
  if (supportsNativeInstallPrompt()) {
    return 'native-prompt';
  }
  
  // iOS Safari
  if (browser === 'safari' && os === 'ios') {
    return 'ios-instructions';
  }
  
  // Firefox (link to docs)
  if (browser === 'firefox') {
    return 'firefox-link';
  }
  
  // Samsung Internet
  if (browser === 'samsung') {
    return 'samsung-native';
  }
  
  return 'none';
}
```

### `getPwaInstallState(): Promise<PwaInstallState>`

Main function that aggregates browser/OS detection and install readiness.

**Implementation:**

```typescript
export async function getPwaInstallState(): Promise<PwaInstallState> {
  const browser = getBrowser();
  const os = getOS();
  const installMethod = getInstallMethod();
  const supportsNative = supportsNativeInstallPrompt();
  const isStandalone = isSafariStandalone();
  
  return {
    browser,
    os,
    canInstall: !isStandalone && installMethod !== 'none',
    installMethod,
    supportsNativePrompt: supportsNative,
  };
}
```

### `requestInstall(): Promise<boolean>`

Triggers the native install prompt (for Chromium browsers). Should only be called if `PwaInstallState.supportsNativePrompt` is `true`.

**Implementation:**

```typescript
export async function requestInstall(): Promise<boolean> {
  // Check if deferredPrompt is available (set by beforeinstallprompt listener)
  const deferredPrompt = (window as any).deferredPrompt;
  
  if (!deferredPrompt) {
    console.warn('Install prompt not available');
    return false;
  }
  
  try {
    // Trigger the install prompt
    await deferredPrompt.prompt();
    
    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    
    // Clear the deferred prompt
    (window as any).deferredPrompt = null;
    
    return outcome === 'accepted';
  } catch (error) {
    console.error('Install prompt failed:', error);
    return false;
  }
}
```

## Event Listeners (to be called in app layout or root)

### `setupBeforeInstallPromptListener()`

Sets up the `beforeinstallprompt` event listener to capture and defer the install prompt.

**Usage:** Call in `src/routes/+layout.svelte` in an `onMount` hook.

**Implementation:**

```typescript
export function setupBeforeInstallPromptListener(): void {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    // Prevent the mini-infobar from appearing
    event.preventDefault();
    
    // Store the event for later use
    (window as any).deferredPrompt = event as BeforeInstallPromptEvent;
    
    // Trigger an event or store flag so UI can show install button
    window.dispatchEvent(new CustomEvent('pwa-install-ready', { detail: { ready: true } }));
  });
}
```

### App Installed Listener

Listen for app installation to dismiss install prompts post-install:

```typescript
export function setupAppInstalledListener(): void {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('appinstalled', () => {
    // Clear deferred prompt
    (window as any).deferredPrompt = null;
    
    // Trigger event for UI to hide install prompt
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  });
}
```

## Utility Functions

### `isInstallable(): Promise<boolean>`

Combined check: Is the app installable for this browser?

**Implementation:**

```typescript
export async function isInstallable(): Promise<boolean> {
  const state = await getPwaInstallState();
  return state.canInstall;
}
```

### `getInstallInstructions(method: InstallMethod): string | null`

Returns platform-specific install instructions (text fallback).

**Implementation:**

```typescript
export function getInstallInstructions(method: InstallMethod): string | null {
  const instructions: Record<InstallMethod, string | null> = {
    'native-prompt': null, // Handled by browser
    'ios-instructions': 'Tap Share at the bottom of the screen, then tap Add to Home Screen.',
    'firefox-link': 'Firefox Web App Installation support is coming soon. Check your browser settings.',
    'samsung-native': 'Tap the menu button, then tap Add to Home Screen.',
    'none': 'This app is optimized for mobile devices. For the best experience, please visit on a phone or tablet.',
  };
  
  return instructions[method] || null;
}
```

### `getBrowserName(browser: Browser): string`

Returns human-readable browser name.

**Implementation:**

```typescript
export function getBrowserName(browser: Browser): string {
  const names: Record<Browser, string> = {
    chrome: 'Chrome',
    edge: 'Microsoft Edge',
    opera: 'Opera',
    brave: 'Brave',
    firefox: 'Firefox',
    safari: 'Safari',
    samsung: 'Samsung Internet',
    unknown: 'Your browser',
  };
  
  return names[browser] || 'Your browser';
}
```

## Integration Example (in component)

```typescript
// src/lib/components/PwaInstallCard.svelte
import { getPwaInstallState, requestInstall } from '$lib/utils/pwa-install';

let pwaState = $state(null);

onMount(async () => {
  pwaState = await getPwaInstallState();
});

async function handleInstallClick() {
  if (pwaState?.supportsNativePrompt) {
    const success = await requestInstall();
    if (success) {
      // Show success message
    }
  } else if (pwaState?.installMethod === 'ios-instructions') {
    // Open instructions modal
  }
}
```

## Error Handling

All functions should gracefully degrade:
- If `window` is undefined (SSR), return defaults or skip logic
- If user agent parsing fails, return `'unknown'` for browser/OS
- If install prompt fails, log error and return `false`
- No UI errors should crash the page

## Testing

### Unit Tests

Test each function independently:
- `getBrowser()` with mock user agent strings
- `getOS()` with mock user agent strings
- `supportsNativeInstallPrompt()` with known browsers
- `isSafariStandalone()` with mock navigator
- `getInstallMethod()` with all browser/OS combinations
- `requestInstall()` with mock `deferredPrompt`

### Integration Tests

- Verify `beforeinstallprompt` listener captures event
- Verify `appinstalled` listener fires on install
- Test iOS install flow (manual verification)
- Test Firefox fallback (manual verification)

## Browser Compatibility

| Browser | OS | Support | Method |
|---------|-----|---------|---------|
| Chrome | Windows/Mac/Linux/Android | ✅ | native-prompt |
| Chrome | iOS | ❌ (not available) | none |
| Edge | Windows/Mac/Android | ✅ | native-prompt |
| Edge | iOS | ❌ | none |
| Firefox | All | ⚠️ (coming soon) | firefox-link |
| Safari | iOS | ✅ | ios-instructions |
| Safari | macOS | ⚠️ (limited) | none |
| Opera | Android/Windows/Mac | ✅ | native-prompt |
| Brave | Windows/Mac/Linux/Android | ✅ | native-prompt |
| Samsung Internet | Android | ✅ | samsung-native |

## Performance Considerations

- Detection is synchronous (no async calls)
- Event listener setup is fast and non-blocking
- `beforeinstallprompt` event is automatically captured by the browser
- No external API calls required
- Bundle size: <2KB gzipped
