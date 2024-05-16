import {defineConfig} from 'vite';
import path from 'path'
export default defineConfig({
    base: path.resolve("/static/"),
    build: {

        manifest: "manifest.json",
        outDir: path.resolve("./static/generated/js/"),
        rollupOptions: {
            input: {
                main: path.resolve("./static/src/ts/main.ts"),
            }
        }
    }
})
