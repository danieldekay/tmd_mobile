<script lang="ts">
	import type { LandingFeature } from '$lib/data/landing-features';

	type Props = {
		features: LandingFeature[];
	};

	const { features }: Props = $props();
</script>

<section class="features">
	<div class="section-content">
		<h2 class="section-title">Why Choose TMD Mobile?</h2>
		<div class="features-grid">
			{#each features as feature (feature.id)}
				<div class="feature-card">
					<div class="feature-icon">{feature.icon}</div>
					<h3 class="feature-title">{feature.title}</h3>
					<p class="feature-description">{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.features {
		background: var(--color-background-secondary);
		padding: 60px 40px;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		animation: slideUp 0.6s ease-out;
	}

	.section-content {
		width: 100%;
	}

	.section-title {
		font-size: 28px;
		font-weight: 700;
		margin: 0 0 40px 0;
		color: var(--color-text);
		text-align: center;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 24px;
		margin-top: 40px;
	}

	.feature-card {
		background: var(--color-surface);
		padding: 28px 20px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		text-align: center;
		transition: all 0.3s ease;
		border: 1px solid var(--color-border);
	}

	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
		border-color: var(--color-primary-light);
	}

	.feature-icon {
		font-size: 40px;
		margin: 0 0 12px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 56px;
		width: 56px;
	}

	.feature-title {
		font-size: 18px;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: var(--color-text);
	}

	.feature-description {
		font-size: 14px;
		line-height: 1.6;
		margin: 0;
		color: var(--color-text-secondary);
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 1024px) {
		.features {
			padding: 50px 32px;
		}

		.section-title {
			font-size: 24px;
		}
	}

	@media (max-width: 768px) {
		.features {
			padding: 40px 24px;
		}

		.section-title {
			font-size: 24px;
			margin-bottom: 28px;
		}

		.features-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 16px;
		}

		.feature-card {
			padding: 20px 16px;
		}
	}

	@media (max-width: 480px) {
		.features {
			padding: 24px 16px;
		}

		.section-title {
			font-size: 20px;
			margin-bottom: 20px;
		}

		.features-grid {
			grid-template-columns: 1fr;
			gap: 12px;
		}

		.feature-card {
			padding: 16px 12px;
		}

		.feature-icon {
			font-size: 32px;
			height: 48px;
			width: 48px;
		}

		.feature-title {
			font-size: 16px;
		}

		.feature-description {
			font-size: 13px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.features {
			animation: none;
		}

		.feature-card:hover {
			transform: none;
		}
	}
</style>
