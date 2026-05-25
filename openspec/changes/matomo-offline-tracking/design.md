# Design: Matomo Analytics Offline Queue

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Route Pages                             │
│  +layout.svelte → initializes Matomo on mount               │
│  +page.svelte → tracks "home" view                          │
│  events/[id]/+page.svelte → tracks "event-detail" view      │
│  event-series/[id]/+page.svelte → tracks "series-detail"    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  src/lib/matomo-offline.ts                    │
│                                                               │
│  export function trackPageView(url: string, title: string)    │
│  export function trackEvent(category: string, action: string) │
│  export function setupOnOnlineListener()                       │
│  export function cleanup()                                     │
│                                                               │
│  ┌─────────────────────────────────────┐                      │
│  │ localStorage matomo-queue            │                      │
│  │ - pending events (max 50)            │                      │
│  │ - timestamp + command + retry count │                      │
│  └─────────────────────────────────────┘                      │
│         ▲                                                      │
│         │ online event fires                                   │
│   retryQueue() ← sends all stored                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    Matomo Server                              │
│  POST /matomo.php?pageview=1&rec=1                          │
│  POST /matomo.php?action=track&category=events&action=click │
│         POST /heartbeat.ping (every 30s in PWA mode)         │
└─────────────────────────────────────────────────────────────┘
```

## Implementation

### `src/lib/matomo-offline.ts`

Core module that handles all Matomo interaction. This is the only file that knows about
Matomo's API — pages and components should never call the Matomo SDK directly.

```typescript
// Key exports
export function initializeMatomo(): void
export function trackPageView(url: string, title?: string): void
export function trackEvent(category: string, action: string, label?: string): void
export function startHeartbeat(): void
export function stopHeartbeat(): void
export function cleanup(): void

// Internal state
let initialized = false
let pendingEvents: PendingEvent[] = []
let heartbeatInterval: number | null = null
let isOnline = true
```

### Online/Offline Detection

`src/lib/utils/analytics.ts` wraps matomo-offline with a simplified API for pages.

```typescript
import { trackPageView, trackEvent } from '$lib/matomo-offline'

export function trackRouteView(pathname: string, title: string): void {
  const route = getRouteName(pathname)
  trackPageView(`${route}/${pathname}`, title)
}

export function getRouteName(path: string): string {
  if (path === '/') return 'home'
  if (path.startsWith('/events/')) return 'event-detail'
  // ...
  return 'unknown'
}
```

## Data Flow

1. **Page Mount**: `+layout.svelte` imports `initializeMatomo()` from `matomo-offline.ts`
2. **User Action**: Page calls `trackRouteView('/events/123', 'Event Title')`
3. **Queue Write**: `matomo-offline.ts` stores command in `localStorage` if offline
4. **Retry**: On `online` event, `matomo-offline.ts` retries all pending events
5. **Persistence**: Events stay in queue until successfully sent (up to 3 retries)

## Consent Gating

All Matomo calls must check user consent before tracking. The `consentStore` (or equivalent)
provides a `getConsentValue(key): boolean` method. Track only when `getConsentValue('analytics')`
is true.

## Error Handling

- Failed sends log silent (no toast — user didn't opt into error notifications)
- Pending events are retried on reconnect indefinitely
- Max 50 pending events in queue (drop oldest if exceeded)
- Heartbeat failure is silently swallowed

## Testing

- Unit test `matomo-offline.ts`: queue management, retry logic, heartbeat
- Mock `localStorage` for storage, `navigator.sendBeacon` for beacon
- No integration tests needed (depends on Matomo server)
