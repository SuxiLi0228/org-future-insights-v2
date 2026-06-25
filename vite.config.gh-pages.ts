import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/org-future-insights-v2/',
  plugins: [
    react(),
    {
      name: 'generate-404-html',
      closeBundle() {
        // GitHub Pages SPA fallback: copy index.html to 404.html
        const dist = resolve(process.cwd(), 'dist')
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
