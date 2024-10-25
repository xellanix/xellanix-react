import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		react(),
		dts({
			outDir: "dist/types",
			insertTypesEntry: true,
		}),
	],
	build: {
		minify: true,
		assetsInlineLimit: 0,
		lib: {
			entry: path.resolve(__dirname, "src/index.tsx"),
			name: "xellanix-react",
			fileName: (format) => `xellanix.${format}.js`,
		},
		rollupOptions: {
			external: ["react", /^react\/.*/, "react-dom", /react-dom\/.*/],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
				assetFileNames: "assets/[name][extname]", // Ensure assets (CSS) are included
			},
		},
	},
});
