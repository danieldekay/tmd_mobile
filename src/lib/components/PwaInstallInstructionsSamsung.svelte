<script lang="ts">
	/**
	 * Samsung Internet install instructions
	 * Provides step-by-step guidance for Samsung Internet on Android
	 */
</script>

<div class="instructions-samsung">
	<p class="instruction-intro">
		Follow these simple steps to add TMD Mobile to your home screen:
	</p>

	<ol class="steps-list">
		<li class="step">
			<div class="step-number">1</div>
			<div class="step-content">
				<div class="step-title">Open Samsung Internet</div>
				<p>Make sure you're viewing this page in Samsung Internet.</p>
			</div>
		</li>

		<li class="step">
			<div class="step-number">2</div>
			<div class="step-content">
				<div class="step-title">Tap the Menu</div>
				<p>Tap the menu button (three vertical dots) at the bottom right of the screen.</p>
			</div>
		</li>

		<li class="step">
			<div class="step-number">3</div>
			<div class="step-content">
				<div class="step-title">Select "Add to Home Screen"</div>
				<p>Look for the option to add the page to your home screen and tap it.</p>
			</div>
		</li>
	</ol>

	<p class="instruction-note">
		Samsung Internet provides excellent PWA support. You'll have a fully functional app on your home screen!
	</p>
</div>

<style>
	.instructions-samsung {
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
