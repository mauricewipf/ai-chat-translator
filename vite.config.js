import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '')

    return {
        plugins: [
            react(),
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: [],
                manifest: {
                    name: 'AI Chat Translator',
                    short_name: 'AI Translator',
                    description: 'AI-powered chat translation application',
                    theme_color: '#ffffff',
                    background_color: '#ffffff',
                    display: 'standalone',
                    scope: '/',
                    start_url: '/',
                    icons: [
                        {
                            src: '/icon-192x192.png',
                            sizes: '192x192',
                            type: 'image/png'
                        },
                        {
                            src: '/icon-512x512.png',
                            sizes: '512x512',
                            type: 'image/png'
                        },
                        {
                            src: '/icon-512x512.png',
                            sizes: '512x512',
                            type: 'image/png',
                            purpose: 'any maskable'
                        }
                    ]
                },
                workbox: {
                    clientsClaim: true,
                    skipWaiting: true,
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
                    runtimeCaching: [
                        {
                            urlPattern: /^https:\/\/api\.openai\.com\/.*/i,
                            handler: 'NetworkOnly'
                        }
                    ]
                }
            })
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            host: '0.0.0.0',
            port: 3000,
            proxy: {
                '/api': {
                    target: 'http://localhost:3001',
                    changeOrigin: true,
                }
            }
        },
        // Expose specific env variables to the client
        define: {
            'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
        },
    }
})

