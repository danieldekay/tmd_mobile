# Design: Newsletter Signup

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Route Pages                                     │
│                                                                              │
│    /newsletter/+page.html (Newsletter Signup)                                  │
│        └──> src/lib/components/NewsletterSignup.svelte (component)           │
│        └──> src/lib/api/legal.ts (optional: fetch from WordPress)             │
│        └──> src/lib/matomo/consent.ts (Matomo/consent integration)           │
│        └──> src/lib/components/PwaUpdateBanner.svelte (update banner)        │
│        └──> src/lib/components/PwaUpdateBanner.svelte (update banner)        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### File Structure

### `src/lib/api/legal.ts` (new)

Legal page fetching.

### `src/lib/matomo/consent.ts` (new)

Matomo/consent integration.

## File Structure

```javascript
// 1. src/lib/components/NewsletterSignup.svelte (new)
//    - Newsletter signup form
//    - Sendy integration (if Sendy API available)
//    - Unsubscribe link
//    - Error handling

// 2. src/lib/api/legal.ts (new)
//    - Legal page fetching
//    - Optional: fetch from WordPress /wp-json/tmd/v3/legal

// 3. src/lib/matomo/consent.ts (new)
//    - Matomo/consent integration
//    - Matomo/consent integration

// 4. src/lib/components/PwaUpdateBanner.svelte (new)
//    - Newsletter signup
//    - Sendy integration (if Sendy API available)
//    - Unsubscribe link
//    - Error handling

// 5. src/lib/api/legal.ts (new)
//    - Newsletter signup form
//    - Sendy integration (if Sendy API available)
//    - Unsubscribe link
//    - Error handling

// 6. src/lib/matomo/consent.ts (new)
//    - Newsletter signup
//    - Sendy integration (if Sendy API available)
//    - Unsubscribe link
//    - Error handling

// 7. src/lib/components/PwaUpdateBanner.svelte (new)
//    - Newsletter signup form
//    - Sendy integration (if Sendy API available)
//    - Unsubscribe link
//    - Error handling
```

## Data Flow

### `src/lib/api/legal.ts`

1. User opens `/newsletter`
2. NewsletterSignup component renders
3. User enters email
4. NewsletterSignup sends to Sendy
5. Sendy returns success/error
6. If success → shown
7. If error → error shown

### `/src/lib/api/legal.ts`

1. User opens `/newsletter`
2. NewsletterSignup component renders
3. User enters email
4. NewsletterSignup sends to Sendy
5. Sendy returns success/error
6. If success → shown
7. If error → error shown

### `/src/lib/matomo/consent.ts`

1. User opens `/newsletter`
2. NewsletterSignup renders
3. User enters email
4. NewsletterSignup sends to Sendy
5. Sendy returns success/error
6. If success → shown
7. If error → error shown

### `/src/lib/components/PwaUpdateBanner.svelte`

1. User opens `/newsletter`
2. NewsletterSignup renders
3. User enters email
4. NewsletterSignup sends to Sendy
5. Sendy returns success/error
6. If success → shown
7. If error → error shown

**Acceptance:**
- NewsletterSignup renders
- Sendy sends to Sendy
- Sendy returns success/error
- If success → shown
- If error → error shown

### `/src/lib/api/legal.ts`

1. User opens `/newsletter`
2. NewsletterSignup renders
3. User enters email
4. NewsletterSignup sends to Sendy
5. Sendy returns success/error
6. If success → shown
7. If error → error shown

### `/src/lib/matomo/consent.ts`

1. User opens `/newsletter`
2. NewsletterSignup renders
3. User enters email
4. NewsletterSignup sends to Sendy
5. Sendy returns success/error
6. If success → shown
7. If error → error shown

### `/src/lib/components/PwaUpdateBanner.svelte`

1. User opens `/newsletter`
2. NewsletterSignup renders
3. User enters email
4. NewsletterSignup sends to Sendy
5. Sendy returns success/error
6. If success → shown
7. If error → error shown

**Acceptance:**
- NewsletterSignup renders
- Sendy sends to Sendy
- Sendy returns success/error
- If success → shown
- If error → error shown
