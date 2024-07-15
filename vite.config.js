import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { djangoVitePlugin } from "django-vite-plugin";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    djangoVitePlugin({
      input: ["./static/js/main.ts", "./frontend_src/submission_wizard.tsx"],
      addAliases: false,
    }),
    react(),
  ],
  build: {
    dynamicImportVarsOptions: {
      exclude: [],
    },
  },
  // root: "./frontend_src",
  // base: "./static/",
  // build: {
  //   manifest: "manifest.json",
  //   outDir: resolve(__dirname, "./static"),
  //   rollupOptions: {
  //     input: {
  //       search: resolve(__dirname, "./frontend_src/search.tsx"),
  //       // submission_wizard: resolve(__dirname, "./frontend_src/submission_wizard.tsx"),
  //       // detail_view_dev: resolve(__dirname, "./frontend_src/detail_view_dev.tsx"),
  //     },
  //   },
  // },
});
