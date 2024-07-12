import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    dynamicImportVarsOptions: {
      exclude: [],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "search.html"),
        nested: resolve(__dirname, "submission_wizard.html"),
      },
    },
  },
});
