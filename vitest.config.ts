import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		conditions: ["browser"],
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/setupTests.ts"],
		include: ["src/**/*.test.ts", "src/**/*.test.svelte"],
		server: {
			deps: {
				inline: ["@testing-library/svelte"],
			},
		},
		alias: {
			// For Svelte 5 compatibility
			"svelte/internal/server": "svelte/internal",
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
	},
});
