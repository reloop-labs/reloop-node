import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["cjs", "esm"],
	dts: true,
	clean: true,
	esbuildOptions(options) {
		// Map #src/* → src/* (Node package imports / absolute style)
		options.alias = {
			"#src": path.join(root, "src"),
		};
	},
});
