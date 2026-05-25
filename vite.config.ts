import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

const pkg = JSON.parse(
	readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as {
	version: string;
};

function getBuildHash(): string {
	try {
		return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
	} catch {
		return "dev";
	}
}

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
		__BUILD_HASH__: JSON.stringify(getBuildHash()),
		__BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
	},
	plugins: [tailwindcss(), sveltekit()],
});
