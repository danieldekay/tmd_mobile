<script lang="ts">
	type Props = {
		eventsHref: string;
	};

	const { eventsHref }: Props = $props();
</script>

<section class="explore">
	<div class="section-content">
		<h2 class="section-title">Ready to explore?</h2>
		<p class="explore-description">Start browsing curated tango marathons from around the world.</p>
		<a href={eventsHref} class="btn btn-primary btn-large">Browse Events Now</a>
	</div>
</section>

<style>
	.explore {
		background: var(--color-primary);
		color: white;
		text-align: center;
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
		margin: 0 0 12px 0;
		color: white;
		text-align: center;
	}

	.explore-description {
		font-size: 16px;
		margin: 0 0 24px 0;
		opacity: 0.95;
		line-height: 1.6;
	}

	.btn {
		padding: 12px 24px;
		border-radius: 4px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		display: inline-block;
		transition: all 0.2s ease;
		border: none;
		min-height: 48px;
		min-width: 48px;
		line-height: 1.5;
	}

	.btn-primary {
		background: white;
		color: var(--color-primary);
	}

	.btn-primary:hover {
		background: var(--color-background-secondary);
		color: var(--color-primary);
	}

	.btn-large {
		padding: 14px 32px;
		font-size: 18px;
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
		.explore {
			padding: 50px 32px;
		}

		.section-title {
			font-size: 24px;
		}
	}

	@media (max-width: 768px) {
		.explore {
			padding: 40px 24px;
		}
	}

	@media (max-width: 480px) {
		.explore {
			padding: 24px 16px;
		}

		.section-title {
			font-size: 20px;
		}

		.explore-description {
			font-size: 14px;
		}

		.btn-large {
			padding: 12px 24px;
			font-size: 16px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.explore {
			animation: none;
		}

		.btn:hover {
			transform: none;
		}
	}
</style>
