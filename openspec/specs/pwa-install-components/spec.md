# Spec: PWA Install Components

## Components Overview

### PwaInstallCard

**File:** `src/lib/components/PwaInstallCard.svelte`

A card component that shows browser/OS-specific install guidance with dynamic content based on detected platform.

**Props:**

- `pwaInstallState: PwaInstallState | null` - Current install state
- `onInstallClick?: () => void` - Callback when install is attempted
- `onDismiss?: () => void` - Callback when card is dismissed

**Behavior:**

- Hidden when `canInstall` is false
- Shows "Install Now" button for `native-prompt` method
- Shows "Add to Home Screen" button for `ios-instructions` method
- Shows info text for `firefox-link` and other methods

### PwaInstallInstructions

**File:** `src/lib/components/PwaInstallInstructions.svelte`

Modal component showing platform-specific install instructions.

**Props:**

- `method: InstallMethod` - The install method to show instructions for
- `onClose?: () => void` - Callback when modal closes

**Variants:**

- `ios-instructions` - Share button → Add to Home Screen steps
- `firefox-link` - Link to Firefox installation documentation
- `samsung-native` - Menu button → Add to Home Screen steps
- `none` - Fallback messaging

### PwaPrompts (Nested)

**Directories:**

- `src/lib/components/PwaInstallInstructionsIos.svelte`
- `src/lib/components/PwaInstallInstructionsFirefox.svelte`
- `src/lib/components/PwaInstallInstructionsSamsung.svelte`

Individual instruction components for each platform.
