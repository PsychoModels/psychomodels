import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./frontend_src/setup-vitest.ts"],
    exclude: [...configDefaults.exclude, "e2e-tests/*"],
  },
  plugins: [react()],
  build: {
    dynamicImportVarsOptions: {
      exclude: [],
    },
  },
});
