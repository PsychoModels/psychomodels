import {defineConfig} from "vite";
import {resolve} from "path";
import react from "@vitejs/plugin-react";
import {djangoVitePlugin} from 'django-vite-plugin'

export default defineConfig({
    plugins: [
        djangoVitePlugin({
            input: [
                'static/js/main.ts',
            ],
            addAliases: false
        }), react()
    ],
    build: {
        dynamicImportVarsOptions: {
            exclude: [],
        },
        rollupOptions: {
            input: {
                main: resolve(__dirname, "/frontend_src/search.html"),
                nested: resolve(__dirname, "/frontend_src/submission_wizard.html"),
            },
        },
    },
});
