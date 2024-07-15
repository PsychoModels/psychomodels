import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { djangoVitePlugin } from "django-vite-plugin";

export default defineConfig({
  plugins: [
    djangoVitePlugin({
      input: [
        "./static/js/main.ts",
        "./frontend_src/submission_wizard.tsx",
        "./frontend_src/search.tsx",
      ],
      addAliases: false,
    }),
    react(),
  ],
  build: {
    dynamicImportVarsOptions: {
      exclude: [],
    },
  },
});
