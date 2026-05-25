<script lang="ts">
	type Props = {
		eventsHref: string;
	};

	const { eventsHref }: Props = $props();
</script>

<section class="hero">
	<div class="hero-content">
		<h1 class="hero-title">Discover Tango Marathons</h1>
		<p class="hero-tagline">
			Explore curated events, teachers, and DJs. Install the free app for offline access and instant
			notifications.
		</p>
		<div class="cta-buttons">
			<a href={eventsHref} class="btn btn-primary">Explore as Web</a>
			<span class="or-divider">or</span>
			<p class="install-prompt">Install the app for the best experience</p>
		</div>
	</div>
</section>

<style>
	.hero {
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
		color: white;
		padding: 80px 40px;
		text-align: center;
		min-height: 50vh;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: slideUp 0.6s ease-out;
	}

	.hero-content {
		max-width: 600px;
		margin: 0 auto;
	}

	.hero-title {
		font-size: 48px;
		font-weight: 800;
		margin: 0 0 20px 0;
		line-height: 1.1;
		letter-spacing: -0.5px;
	}

	.hero-tagline {
		font-size: 18px;
		font-weight: 300;
		margin: 0 0 30px 0;
		line-height: 1.6;
		opacity: 0.95;
	}

	.cta-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		margin-top: 30px;
	}

	.or-divider {
		font-size: 14px;
		font-weight: 500;
		opacity: 0.9;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.install-prompt {
		font-size: 14px;
		font-weight: 500;
		margin: 0;
		opacity: 0.9;
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
		min-width: 200px;
	}

	.btn-primary:hover {
		background: var(--color-background-secondary);
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
		.hero {
			padding: 60px 32px;
			min-height: 45vh;
		}

		.hero-title {
			font-size: 40px;
		}

		.hero-tagline {
			font-size: 16px;
		}
	}

	@media (max-width: 768px) {
		.hero {
			padding: 40px 24px;
			min-height: auto;
		}

		.hero-title {
			font-size: 32px;
		}

		.hero-tagline {
			font-size: 15px;
		}
	}

	@media (max-width: 480px) {
		.hero {
			padding: 24px 16px;
		}

		.hero-title {
			font-size: 28px;
		}

		.hero-tagline {
			font-size: 14px;
		}

		.cta-buttons {
			gap: 12px;
		}

		.btn {
			padding: 10px 20px;
			font-size: 14px;
			min-height: 44px;
		}

		.btn-primary {
			min-width: auto;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hero {
			animation: none;
		}

		.btn:hover {
			transform: none;
		}
	}
</style>
