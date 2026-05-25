# Specification: PWA Install Components

## Overview

This specification defines the components responsible for rendering PWA install prompts and instructions. Two components are defined: `PwaInstallCard.svelte` (main install prompt) and `PwaInstallInstructions.svelte` (iOS instructions modal).

---

## Component: PwaInstallCard

### File Path

`src/lib/components/PwaInstallCard.svelte`

### Purpose

Displays a platform-specific install prompt or call-to-action. It detects the user's browser/OS and shows the appropriate message and button/link.

### Props

```typescript
interface Props {
  pwaInstallState?: PwaInstallState | null;
  onInstallClick?: () => void;
  onDismiss?: () => void;
}
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `pwaInstallState` | `PwaInstallState \| null` | No | `null` | Install state from `getPwaInstallState()`. If not provided, component fetches it. |
| `onInstallClick` | `() => void` | No | – | Callback when user clicks "Install Now" button |
| `onDismiss` | `() => void` | No | – | Callback when user dismisses or closes the card |

### State

```typescript
let isVisible = $state(true);
let showInstructions = $state(false);
let isLoading = $state(false);
let successMessage = $state('');
let pwaState = $state<PwaInstallState | null>(null);
```

### Lifecycle

**On Mount:**
1. If `pwaInstallState` prop not provided, fetch via `getPwaInstallState()`
2. Set up `beforeinstallprompt` event listener
3. Listen for `pwa-install-ready` custom event
4. Listen for `pwa-installed` custom event (hide card on install)

**On Destroy:**
- Remove event listeners

### Template Structure

```html
{#if isVisible && pwaState?.canInstall}
  <div class="pwa-install-card">
    <div class="pwa-card-header">
      <h3>Install TMD Mobile</h3>
      <button class="btn-close" on:click={dismissCard} aria-label="Close">✕</button>
    </div>
    
    <div class="pwa-card-content">
      {#if successMessage}
        <p class="success-message">✓ {successMessage}</p>
      {:else if pwaState.installMethod === 'native-prompt'}
        <p>Get instant access to tango marathons on your home screen.</p>
        <button class="btn btn-primary" on:click={handleInstall} disabled={isLoading}>
          {#if isLoading}
            Installing...
          {:else}
            Install Now
          {/if}
        </button>
      {:else if pwaState.installMethod === 'ios-instructions'}
        <p>Add TMD Mobile to your home screen for quick access.</p>
        <button class="btn btn-primary" on:click={() => (showInstructions = true)}>
          Add to Home Screen
        </button>
      {:else if pwaState.installMethod === 'firefox-link'}
        <p>Install support is coming to Firefox. In the meantime, you can use TMD Mobile in your browser.</p>
      {:else}
        <p>This app works best when installed on your device.</p>
      {/if}
    </div>
  </div>
{/if}

{#if showInstructions}
  <PwaInstallInstructions
    method={pwaState?.installMethod}
    onClose={() => (showInstructions = false)}
  />
{/if}

<style>
  /* Styling: See below */
</style>
```

### Styling

```css
.pwa-install-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease-out;
}

.pwa-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pwa-card-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: var(--color-text);
}

.pwa-card-content {
  margin-top: 12px;
}

.pwa-card-content p {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  color: var(--color-text-secondary);
}

.btn {
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  color: var(--color-success);
  font-weight: 500;
  margin-bottom: 0 !important;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pwa-install-card {
    animation: none;
  }
}

@media (max-width: 480px) {
  .pwa-install-card {
    border-radius: 0;
    margin: 0 -24px;
    padding: 16px;
  }
}
```

### Event Handlers

**`handleInstall()`:**
```typescript
async function handleInstall() {
  isLoading = true;
  onInstallClick?.();
  
  try {
    const success = await requestInstall();
    if (success) {
      successMessage = 'App installed! Check your home screen.';
      setTimeout(() => {
        isVisible = false;
      }, 2000);
    }
  } catch (error) {
    console.error('Install failed:', error);
  } finally {
    isLoading = false;
  }
}
```

**`dismissCard()`:**
```typescript
function dismissCard() {
  isVisible = false;
  onDismiss?.();
}
```

### Accessibility

- Close button: `aria-label="Close"` (or accessible text)
- Button: Keyboard accessible, focus visible
- Disabled state: `disabled` attribute prevents interaction
- Motion: Respects `prefers-reduced-motion`

### Integration

```svelte
<!-- In landing page or other component -->
<PwaInstallCard
  {pwaInstallState}
  onInstallClick={() => console.log('Install clicked')}
  onDismiss={() => console.log('Card dismissed')}
/>
```

---

## Component: PwaInstallInstructions

### File Path

`src/lib/components/PwaInstallInstructions.svelte`

### Purpose

Displays platform-specific step-by-step install instructions in a modal. Used primarily for iOS (which lacks a native install prompt) and as fallback for other browsers.

### Props

```typescript
interface Props {
  method?: InstallMethod;
  onClose?: () => void;
}
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `method` | `InstallMethod` | No | `'ios-instructions'` | Install method; determines which instructions to show |
| `onClose` | `() => void` | No | – | Callback when modal is closed |

### State

```typescript
let isVisible = $state(true);
let method = $state<InstallMethod>('ios-instructions');

onMount(() => {
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
});

onDestroy(() => {
  // Restore body scroll
  document.body.style.overflow = '';
});
```

### Template Structure

```html
{#if isVisible}
  <!-- Overlay -->
  <div class="modal-overlay" on:click={closeModal} role="presentation"></div>
  
  <!-- Modal -->
  <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title">Add to Home Screen</h2>
        <button class="btn-close" on:click={closeModal} aria-label="Close instructions">✕</button>
      </div>
      
      <div class="modal-body">
        {#if method === 'ios-instructions'}
          <PwaInstallInstructionsIos />
        {:else if method === 'firefox-link'}
          <PwaInstallInstructionsFirefox />
        {:else if method === 'samsung-native'}
          <PwaInstallInstructionsSamsung />
        {:else}
          <p>For install instructions, visit your browser settings.</p>
        {/if}
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" on:click={closeModal}>Got it</button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Styling: See below */
</style>
```

### Styling

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.2s ease-out;
}

.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 80vh;
  max-width: 600px;
  width: 90%;
  background: var(--color-surface);
  border-radius: 12px;
  z-index: 1000;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.btn-close:hover {
  color: var(--color-text);
}

.modal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-secondary {
  background: var(--color-primary);
  color: white;
}

.btn-secondary:hover {
  background: var(--color-primary-dark);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-50% + 20px));
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

/* Mobile */
@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    max-height: 90vh;
    border-radius: 8px 8px 0 0;
    top: auto;
    bottom: 0;
    transform: translateX(-50%);
    left: 50%;
  }
  
  .modal-body {
    max-height: 60vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-overlay,
  .modal-container {
    animation: none;
  }
}
```

### Nested Instruction Components

#### `PwaInstallInstructionsIos.svelte`

iOS step-by-step instructions for "Add to Home Screen":

```html
<div class="instructions-ios">
  <ol class="steps">
    <li>
      <strong>Tap the Share button</strong> at the bottom of Safari (looks like an arrow pointing out of a box)
    </li>
    <li>
      <strong>Scroll down</strong> and select "Add to Home Screen"
    </li>
    <li>
      <strong>Choose a name</strong> for the app icon on your home screen
    </li>
    <li>
      <strong>Tap Add</strong> and the app will be installed
    </li>
  </ol>
  
  <div class="visual-aid">
    <p><strong>Visual guide:</strong></p>
    <svg viewBox="0 0 200 100" class="safari-menu-icon">
      <!-- Icon showing Share button at bottom of screen -->
    </svg>
  </div>
</div>

<style>
  .instructions-ios {
    font-size: 14px;
    line-height: 1.8;
  }
  
  .steps {
    margin: 0;
    padding-left: 24px;
  }
  
  .steps li {
    margin-bottom: 12px;
  }
  
  .steps strong {
    color: var(--color-primary);
  }
  
  .visual-aid {
    margin-top: 24px;
    padding: 16px;
    background: var(--color-background);
    border-radius: 8px;
  }
  
  .visual-aid p {
    margin: 0 0 12px 0;
    font-weight: 500;
  }
  
  .safari-menu-icon {
    width: 100%;
    max-width: 200px;
    height: auto;
  }
</style>
```

#### `PwaInstallInstructionsFirefox.svelte`

Fallback for Firefox:

```html
<div class="instructions-firefox">
  <p>Firefox native app installation support is coming soon.</p>
  <p>In the meantime, you can:</p>
  <ul>
    <li>Bookmark this app in your browser</li>
    <li>Use it in Firefox as a web app</li>
    <li>Check <a href="https://support.mozilla.org/en-US/kb/web-app-manifest-firefox" target="_blank">Firefox documentation</a> for updates</li>
  </ul>
</div>

<style>
  .instructions-firefox {
    font-size: 14px;
    line-height: 1.8;
  }
  
  ul {
    padding-left: 24px;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  a {
    color: var(--color-primary);
    text-decoration: underline;
  }
</style>
```

#### `PwaInstallInstructionsSamsung.svelte`

Samsung Internet instructions:

```html
<div class="instructions-samsung">
  <ol class="steps">
    <li>
      <strong>Tap the menu button</strong> (three dots) in the bottom right corner
    </li>
    <li>
      <strong>Select "Add to Home Screen"</strong> from the menu
    </li>
    <li>
      <strong>Confirm</strong> the app installation
    </li>
  </ol>
</div>

<style>
  .instructions-samsung {
    font-size: 14px;
    line-height: 1.8;
  }
  
  .steps {
    margin: 0;
    padding-left: 24px;
  }
  
  .steps li {
    margin-bottom: 12px;
  }
  
  .steps strong {
    color: var(--color-primary);
  }
</style>
```

### Event Handlers

**`closeModal()`:**
```typescript
function closeModal() {
  isVisible = false;
  onClose?.();
}
```

### Accessibility

- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`
- Close button: `aria-label="Close instructions"`
- Focus trap: Implemented (tab stays within modal)
- Overlay click: Close modal on overlay click
- Keyboard: Escape key closes modal (add via keydown listener)

### Integration

```svelte
<!-- In PwaInstallCard -->
{#if showInstructions}
  <PwaInstallInstructions
    method={pwaState?.installMethod}
    onClose={() => (showInstructions = false)}
  />
{/if}
```

---

## Shared Styling & Animations

Both components should use consistent theming from app CSS variables:

```css
--color-primary: #e74c3c (or theme primary)
--color-primary-dark: darker shade
--color-surface: white or light gray
--color-border: light gray
--color-text: dark gray
--color-text-secondary: medium gray
--color-success: green
--color-background: very light gray
--color-background-secondary: light gray
```

---

## Cross-Browser Testing

| Browser | Install Card | iOS Instructions | Notes |
|---------|--------------|------------------|-------|
| Chrome | Native button | – | Works as designed |
| Safari (iOS) | Instructions button | Full modal | Expected behavior |
| Firefox | Link/disabled | Modal with fallback | Future support |
| Safari (macOS) | Hidden/disabled | – | Not installable on desktop |
| Edge | Native button | – | Works like Chrome |
| Samsung Internet | Native button | – | Works like Chrome |
