<script lang="ts">
	// No props — static content section
</script>

<section class="tmd-directory">
	<div class="section-content">
		<h2 class="section-title">About The Tango Marathon Directory</h2>
		<p class="tmd-description">
			The Tango Marathon Directory (TMD) is the world's most comprehensive, curated database of tango
			marathons. Founded in 2013, TMD provides dancers and organizers with essential information about
			events, teachers, DJs, and venues worldwide.
		</p>
		<a
			href="https://www.tangomarathons.com"
			class="btn btn-outline"
			target="_blank"
			rel="noopener noreferrer"
		>
			Visit tangomarathons.com
		</a>
	</div>
</section>

<style>
	.tmd-directory {
		background: var(--color-background);
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
		margin: 0 0 40px 0;
		color: var(--color-text);
		text-align: center;
	}

	.tmd-description {
		font-size: 16px;
		line-height: 1.8;
		margin: 0 auto 24px;
		color: var(--color-text-secondary);
		max-width: 650px;
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
		min-height: 48px;
		min-width: 48px;
		line-height: 1.5;
	}

	.btn-outline {
		background: transparent;
		border: 2px solid var(--color-primary);
		color: var(--color-primary);
	}

	.btn-outline:hover {
		background: var(--color-primary);
		color: white;
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
		.tmd-directory {
			padding: 50px 32px;
		}

		.section-title {
			font-size: 24px;
		}
	}

	@media (max-width: 768px) {
		.tmd-directory {
			padding: 40px 24px;
		}

		.tmd-description {
			font-size: 15px;
		}
	}

	@media (max-width: 480px) {
		.tmd-directory {
			padding: 24px 16px;
		}

		.section-title {
			font-size: 20px;
			margin-bottom: 20px;
		}

		.tmd-description {
			font-size: 14px;
		}

		.btn {
			padding: 10px 20px;
			font-size: 14px;
			min-height: 44px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tmd-directory {
			animation: none;
		}
	}
</style>
