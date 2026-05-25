<script lang="ts">
	/**
	 * Firefox install instructions
	 * Provides information about coming web app support
	 */
</script>

<div class="instructions-firefox">
	<p class="instruction-message">
		Firefox is actively developing web app installation support. Check back soon for native install capability!
	</p>

	<div class="instruction-note">
		<strong>In the meantime:</strong>
		<ul>
			<li>Bookmark this page for quick access</li>
			<li>Use your browser's menu to create a shortcut to your desktop</li>
			<li>Check <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" target="_blank" rel="noopener noreferrer">MDN Web Docs</a> for the latest on PWA support in Firefox</li>
		</ul>
	</div>

	<p class="instruction-footer">
		We're excited about Firefox's PWA support coming soon!
	</p>
</div>

<style>
	.instructions-firefox {
		font-size: 14px;
		line-height: 1.8;
		color: var(--color-text-secondary, #666666);
	}

	.instruction-message {
		margin: 0 0 16px 0;
		font-weight: 500;
		color: var(--color-text, #000000);
	}

	.instruction-note {
		margin: 16px 0;
		padding: 16px;
		background: var(--color-background-secondary, #f3f4f6);
		border-left: 3px solid var(--color-primary, #e74c3c);
		border-radius: 4px;
		color: var(--color-text, #000000);
	}

	.instruction-note strong {
		display: block;
		margin-bottom: 8px;
		color: var(--color-text, #000000);
	}

	.instruction-note ul {
		margin: 0;
		padding-left: 24px;
		list-style: disc;
	}

	.instruction-note li {
		margin: 4px 0;
	}

	.instruction-note a {
		color: var(--color-primary, #e74c3c);
		text-decoration: underline;
	}

	.instruction-note a:hover {
		opacity: 0.8;
	}

	.instruction-footer {
		margin: 16px 0 0 0;
		font-size: 13px;
		font-style: italic;
		color: var(--color-text-secondary, #666666);
	}
</style>
