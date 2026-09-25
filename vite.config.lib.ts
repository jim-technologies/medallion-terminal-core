import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  build: {
    lib: {
      entry: {
        'medallion-terminal-core': resolve(import.meta.dirname, 'src/index.ts'),
        toolkit: resolve(import.meta.dirname, 'src/toolkit.ts'),
        dashboard: resolve(import.meta.dirname, 'src/dashboard.ts'),
        'asset-open': resolve(import.meta.dirname, 'src/asset-open.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'recharts', 'lightweight-charts', 'maplibre-gl'],
    },
  },
})
