// vite.config.js
import {extname, relative, resolve} from 'path'
import {defineConfig} from "vite";
import dts from 'vite-plugin-dts'
import {fileURLToPath} from "node:url";
import {glob} from "glob";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dts({
        // outputDir: './dist/types',
        // insertTypesEntry: true,
        include: ["lib"]
    })],
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/index.ts'),
            formats: ["es"]
        },
        rollupOptions: {
            input: Object.fromEntries(
                glob.sync('lib/**/*.{ts,js}').map(file => [
                    // The name of the entry point
                    // lib/nested/foo.ts becomes nested/foo
                    relative('lib', file.slice(0, file.length - extname(file).length)),
                    // The absolute path to the entry file
                    // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
                    fileURLToPath(new URL(file, import.meta.url))
                ])
            ),
            output: {
                entryFileNames(chunkInfo) {
                    return `${chunkInfo.name}.js`
                },
            }
        }
    },

})
