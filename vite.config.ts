import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression' // gzip静态资源压缩
import { loadEnv } from 'vite'

// https://vitejs.dev/config/
export default ({ mode }) =>
    defineConfig({
        plugins: [
            vue(),
            viteCompression({
                verbose: true,
                disable: false,
                threshold: 10240,
                algorithm: 'gzip',
                ext: '.gz',
            }),
        ],
        // base: loadEnv(mode, process.cwd()).Vite_BASE,
        base: './',
        resolve: {
            alias: [
                //配置别名
                {
                    find: '@',
                    replacement: resolve(__dirname, './src'),
                },
            ],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    /**如果引入多个文件，可以使用
                     * '@import "@/assets/scss/globalVariable1.scss";
                     * @import"@/assets/scss/globalVariable2.scss";'
                     **/
                    // additionalData: '@import "@/styles/global.scss";',
                },
            },
        },
        server: {
            proxy: {
                // 跨域代理
                '/api': {
                    // target: 'http://' + env.VUE_APP_BASE_API,
                    // target: loadEnv(mode, process.cwd()).VITE_BASE_URL,
                    target: 'https://markdown.erha2777.icu/', //
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
                // 代理 WebSocket 或 socket
                // '/socket.io': {
                //   target: 'ws://localhost:3000',
                //   ws: true
                //  }
            },
        },
        build: {
            // 打包配置
            rollupOptions: {
                output: {
                    // 资源分类打包
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                },
            },
            terserOptions: {
                compress: {
                    // 清除console和debugger
                    drop_console: true,
                    drop_debugger: true,
                },
            },
        },
        optimizeDeps: {
            exclude: ['electron'], // 告诉 Vite 排除预构建 electron，不然会出现 __diranme is not defined
        },
    })
