import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: 'manifest.json',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,jpg,jpeg,woff,woff2,ttf,otf,webp,avif,ico}'],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'zustand', 'framer-motion'],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'framer-motion'],
  },
})
