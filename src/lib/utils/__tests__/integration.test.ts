import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setupBeforeInstallPromptListener, setupAppInstalledListener, requestInstall } from '$lib/utils/pwa-install';

describe('PWA Install Event Integration', () => {
	beforeEach(() => {
		// Clear window.deferredPrompt before each test
		// @ts-expect-error
		window.deferredPrompt = null;
		vi.clearAllMocks();
	});

	afterEach(() => {
		// Clean up
		// @ts-expect-error
		window.deferredPrompt = null;
	});

	describe('setupBeforeInstallPromptListener()', () => {
		it('should set up beforeinstallprompt event listener', () => {
			const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

			setupBeforeInstallPromptListener();

			expect(addEventListenerSpy).toHaveBeenCalledWith(
				'beforeinstallprompt',
				expect.any(Function)
			);

			addEventListenerSpy.mockRestore();
		});

		it('should capture beforeinstallprompt event', () => {
			setupBeforeInstallPromptListener();

			const mockEvent = new Event('beforeinstallprompt');
			Object.assign(mockEvent, {
				preventDefault: vi.fn(),
				prompt: vi.fn().mockResolvedValue(undefined),
				userChoice: Promise.resolve({ outcome: 'accepted' }),
			});

			window.dispatchEvent(mockEvent);

			// Check that deferredPrompt was stored
			expect(window.deferredPrompt).toBeTruthy();
		});

		it('should prevent mini-infobar from appearing', () => {
			setupBeforeInstallPromptListener();

			const mockEvent = new Event('beforeinstallprompt');
			const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
			Object.assign(mockEvent, {
				prompt: vi.fn().mockResolvedValue(undefined),
				userChoice: Promise.resolve({ outcome: 'accepted' }),
			});

			window.dispatchEvent(mockEvent);

			expect(preventDefaultSpy).toHaveBeenCalled();
		});

		it('should dispatch pwa-install-ready custom event', () => {
			setupBeforeInstallPromptListener();

			const customEventListener = vi.fn();
			window.addEventListener('pwa-install-ready', customEventListener);

			const mockEvent = new Event('beforeinstallprompt');
			Object.assign(mockEvent, {
				preventDefault: vi.fn(),
				prompt: vi.fn().mockResolvedValue(undefined),
				userChoice: Promise.resolve({ outcome: 'accepted' }),
			});

			window.dispatchEvent(mockEvent);

			expect(customEventListener).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'pwa-install-ready',
					detail: { ready: true },
				})
			);

			window.removeEventListener('pwa-install-ready', customEventListener);
		});

		it('should handle multiple beforeinstallprompt events', () => {
			setupBeforeInstallPromptListener();

			const firstEvent = new Event('beforeinstallprompt');
			Object.assign(firstEvent, {
				preventDefault: vi.fn(),
				prompt: vi.fn().mockResolvedValue(undefined),
				userChoice: Promise.resolve({ outcome: 'accepted' }),
			});

			window.dispatchEvent(firstEvent);
			const firstPrompt = window.deferredPrompt;

			const secondEvent = new Event('beforeinstallprompt');
			Object.assign(secondEvent, {
				preventDefault: vi.fn(),
				prompt: vi.fn().mockResolvedValue(undefined),
				userChoice: Promise.resolve({ outcome: 'accepted' }),
			});

			window.dispatchEvent(secondEvent);
			const secondPrompt = window.deferredPrompt;

			// Should store the latest one
			expect(secondPrompt).not.toBe(firstPrompt);
		});
	});

	describe('setupAppInstalledListener()', () => {
		it('should set up appinstalled event listener', () => {
			const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

			setupAppInstalledListener();

			expect(addEventListenerSpy).toHaveBeenCalledWith(
				'appinstalled',
				expect.any(Function)
			);

			addEventListenerSpy.mockRestore();
		});

		it('should clear deferredPrompt on app installed', () => {
			// Set up a deferred prompt first
			setupBeforeInstallPromptListener();

			const mockBeforeInstallEvent = new Event('beforeinstallprompt');
			Object.assign(mockBeforeInstallEvent, {
				preventDefault: vi.fn(),
				prompt: vi.fn().mockResolvedValue(undefined),
				userChoice: Promise.resolve({ outcome: 'accepted' }),
			});

			window.dispatchEvent(mockBeforeInstallEvent);
			expect(window.deferredPrompt).toBeTruthy();

			// Now set up app installed listener
			setupAppInstalledListener();

			const appInstalledEvent = new Event('appinstalled');
			window.dispatchEvent(appInstalledEvent);

			// Should clear deferred prompt
			expect(window.deferredPrompt).toBeNull();
		});

		it('should dispatch pwa-installed custom event', () => {
			setupAppInstalledListener();

			const customEventListener = vi.fn();
			window.addEventListener('pwa-installed', customEventListener);

			const appInstalledEvent = new Event('appinstalled');
			window.dispatchEvent(appInstalledEvent);

			expect(customEventListener).toHaveBeenCalledWith(
				expect.objectContaining({
					type: 'pwa-installed',
				})
			);

			window.removeEventListener('pwa-installed', customEventListener);
		});
	});

	describe('requestInstall()', () => {
		it('should use deferred prompt to trigger install', async () => {
			// Set up deferred prompt
			setupBeforeInstallPromptListener();

			const mockPromptFn = vi.fn().mockResolvedValue(undefined);
			const mockEvent = new Event('beforeinstallprompt');
			Object.assign(mockEvent, {
				preventDefault: vi.fn(),
				prompt: mockPromptFn,
				userChoice: Promise.resolve({ outcome: 'accepted' }),
			});

			window.dispatchEvent(mockEvent);

			// Request install
			const result = await requestInstall();

			// Prompt should have been called
			expect(mockPromptFn).toHaveBeenCalled();
			expect(result).toBe(true);
		});

		it('should return false when no deferred prompt available', async () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			const result = await requestInstall();

			expect(result).toBe(false);
			expect(consoleSpy).toHaveBeenCalledWith('Install prompt not available');

			consoleSpy.mockRestore();
		});

		it('should clear deferredPrompt after successful install', async () => {
			setupBeforeInstallPromptListener();

			const mockEvent = new Event('beforeinstallprompt');
			Object.assign(mockEvent, {
				preventDefault: vi.fn(),
				prompt: vi.fn().mockResolvedValue(undefined),
				userChoice: Promise.resolve({ outcome: 'accepted' }),
			});

			window.dispatchEvent(mockEvent);
			expect(window.deferredPrompt).toBeTruthy();

			await requestInstall();

			// Should be cleared
			expect(window.deferredPrompt).toBeNull();
		});

		it('should handle user dismissed install', async () => {
			setupBeforeInstallPromptListener();

			const mockEvent = new Event('beforeinstallprompt');
			Object.assign(mockEvent, {
				preventDefault: vi.fn(),
				prompt: vi.fn().mockResolvedValue(undefined),
				userChoice: Promise.resolve({ outcome: 'dismissed' }),
			});

			window.dispatchEvent(mockEvent);

			const result = await requestInstall();

			expect(result).toBe(false);
		});

		it('should handle prompt error gracefully', async () => {
			setupBeforeInstallPromptListener();

			const errorMessage = 'Prompt failed';
			const mockEvent = new Event('beforeinstallprompt');
			Object.assign(mockEvent, {
				preventDefault: vi.fn(),
				prompt: vi.fn().mockRejectedValue(new Error(errorMessage)),
				userChoice: Promise.resolve({ outcome: 'accepted' }),
			});

			window.dispatchEvent(mockEvent);

			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			const result = await requestInstall();

			expect(result).toBe(false);
			expect(consoleSpy).toHaveBeenCalled();

			consoleSpy.mockRestore();
		});
	});

	describe('Event Flow Integration', () => {
		it('should handle complete install flow: beforeinstallprompt -> requestInstall -> appinstalled', async () => {
			setupBeforeInstallPromptListener();
			setupAppInstalledListener();

			const customEventListeners = {
				installReady: vi.fn(),
				installed: vi.fn(),
			};

			window.addEventListener('pwa-install-ready', customEventListeners.installReady);
			window.addEventListener('pwa-installed', customEventListeners.installed);

			// Step 1: beforeinstallprompt fires
			const mockBeforeInstallEvent = new Event('beforeinstallprompt');
			Object.assign(mockBeforeInstallEvent, {
				preventDefault: vi.fn(),
				prompt: vi.fn().mockResolvedValue(undefined),
				userChoice: Promise.resolve({ outcome: 'accepted' }),
			});

			window.dispatchEvent(mockBeforeInstallEvent);
			expect(customEventListeners.installReady).toHaveBeenCalled();
			expect(window.deferredPrompt).toBeTruthy();

			// Step 2: requestInstall is called
			const installResult = await requestInstall();
			expect(installResult).toBe(true);

			// Step 3: appinstalled fires
			const appInstalledEvent = new Event('appinstalled');
			window.dispatchEvent(appInstalledEvent);
			expect(customEventListeners.installed).toHaveBeenCalled();

			// Step 4: deferredPrompt should be cleared
			expect(window.deferredPrompt).toBeNull();

			window.removeEventListener('pwa-install-ready', customEventListeners.installReady);
			window.removeEventListener('pwa-installed', customEventListeners.installed);
		});
	});
});
