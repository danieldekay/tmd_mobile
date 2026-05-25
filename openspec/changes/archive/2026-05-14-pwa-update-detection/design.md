# Design: PWA Update Detection

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Route Pages                              │
│   +layout.svelte → checkForUpdate() on mount                  │
│   +page.svelte → show update banner in PWA mode              │
│   Footer → "New version" link (optional)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              src/lib/utils/build-version.ts                    │
│                                                                  │
│  export const BUILD_TIMESTAMP = __BUILD_TIMESTAMP__;           │
│  export function compareVersions(current: string, remote:      │
│    string): 'update-available' | 'up-to-date'                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              src/lib/utils/pwa-install.ts                      │
│                                                                  │
│  export function checkForBuildVersion(): Promise<boolean>       │
│  export function checkForUpdate(skipBanner?:                    │
│    boolean): boolean                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│            src/lib/utils/pwa-update-banner.ts                   │
│                                                                  │
│  export function showUpdateBanner(): void  │
│  export function hideUpdateBanner(): void  │
│  export function triggerReload(): void  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│               Service Worker                                   │
│                                                                  │
│  - listen for 'updatefound'                                    │
│  - fetch build-version.json                                    │
│  - compare with BUILD_TIMESTAMP                                │
│  - callback if update available                                │
└──────────────────────────────────────────────────────────────┘
```

## Implementation

### `src/lib/utils/build-version.ts` (new)

Build version module.

```typescript
export const BUILD_TIMESTAMP = __BUILD_TIMESTAMP__;  // injected at build
export const BUILD_VERSION = __BUILD_HASH__;          // injected at build

export function compareVersions(current: string, remote: string): 
  'update-available' | 'up-to-date' {
  if (current !== remote) return 'update-available';
  return 'up-to-date';
}
```

### `src/lib/utils/pwa-install.ts` (existing, enhanced)

Add update detection to existing PWA install module.

```typescript
export function checkForBuildVersion(): Promise<boolean>
export function checkForUpdate(skipBanner?: boolean): boolean
export function setupUpdateListener(): void
```

### `src/lib/utils/pwa-update-banner.ts` (if new is needed)

Update banner UI.

```typescript
export function showUpdateBanner(): void
export function hideUpdateBanner(): void  
export function triggerReload(): void
```

### `src/routes/+layout.svelte` (modified)

Add update check.

```typescript
import { checkForBuildVersion, checkForUpdate, setupUpdateListener } from '$lib/utils/pwa-install';
import { onMount } from 'svelte';

onMount(() => {
  checkForBuildVersion();
  setupUpdateListener();
});
```

### `src/routes/+page.svelte` (modified)

Show update banner in PWA mode.

```typescript
import { showUpdateBanner, hideUpdateBanner, triggerReload } from '$lib/utils/pwa-update-banner';

$: if (pwaUpdateBannerVisible) {
  showUpdateBanner();
}
```

## Workflow

1. User opens app
2. `+layout.svelte` calls `checkForBuildVersion()`
3. Service worker compares current vs remote `BUILD_TIMESTAMP`
4. If mismatch: `showUpdateBanner()` appears
5. User clicks "Reload" → `triggerReload()` called
6. App reloads with new version

## Testing

### Manual Tests

- Deploy new version
- Open old version → banner should appear
- Click "Reload" → app updates
- Skip update → banner disappears
- Check interval → banner reappears after 24 hours

### Automated Tests

- `checkForBuildVersion()` returns true when versions differ
- `checkForBuildVersion()` returns false when equal
- `showUpdateBanner()` shows banner
- `triggerReload()` reloads page
