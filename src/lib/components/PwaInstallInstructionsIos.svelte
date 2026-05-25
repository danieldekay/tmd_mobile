<script lang="ts">
	/**
	 * iOS Add to Home Screen instructions
	 * Provides step-by-step guidance for Safari on iOS
	 */
</script>

<div class="instructions-ios">
	<p class="instruction-intro">
		Follow these simple steps to add TMD Mobile to your home screen:
	</p>

	<ol class="steps-list">
		<li class="step">
			<div class="step-number">1</div>
			<div class="step-content">
				<div class="step-title">Open Safari</div>
				<p>Make sure you're viewing this page in Safari on your iPhone or iPad.</p>
			</div>
		</li>

		<li class="step">
			<div class="step-number">2</div>
			<div class="step-content">
				<div class="step-title">Tap the Share Button</div>
				<p>Tap the share icon at the bottom of the screen (looks like a box with an arrow).</p>
			</div>
		</li>

		<li class="step">
			<div class="step-number">3</div>
			<div class="step-content">
				<div class="step-title">Scroll and Select</div>
				<p>Scroll down in the menu and tap <strong>"Add to Home Screen"</strong>.</p>
			</div>
		</li>

		<li class="step">
			<div class="step-number">4</div>
			<div class="step-content">
				<div class="step-title">Confirm</div>
				<p>Choose a name for the app (default is fine) and tap <strong>"Add"</strong> to finish.</p>
			</div>
		</li>
	</ol>

	<p class="instruction-note">
		Once added, you'll see TMD Mobile on your home screen and can access it like any other app!
	</p>
</div>

<style>
	.instructions-ios {
		font-size: 14px;
		line-height: 1.8;
		color: var(--color-text-secondary, #666666);
	}

	.instruction-intro {
		margin: 0 0 20px 0;
		font-weight: 500;
		color: var(--color-text, #000000);
	}

	.steps-list {
		list-style: none;
		padding: 0;
		margin: 0 0 20px 0;
	}

	.step {
		display: flex;
		gap: 16px;
		margin-bottom: 16px;
	}

	.step-number {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--color-primary, #e74c3c);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 16px;
	}

	.step-content {
		flex: 1;
		padding-top: 2px;
	}

	.step-title {
		font-weight: 600;
		color: var(--color-text, #000000);
		margin: 0 0 4px 0;
	}

	.step-content p {
		margin: 0;
		font-size: 14px;
	}

	.instruction-note {
		margin: 0;
		padding: 12px;
		background: var(--color-background-secondary, #f3f4f6);
		border-left: 3px solid var(--color-primary, #e74c3c);
		border-radius: 4px;
		font-size: 13px;
		color: var(--color-text, #000000);
	}

	@media (max-width: 480px) {
		.step {
			gap: 12px;
		}

		.step-number {
			width: 32px;
			height: 32px;
			font-size: 14px;
		}
	}
</style>
