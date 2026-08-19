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
        'medallion-terminal-core': resolve(__dirname, 'src/index.ts'),
        toolkit: resolve(__dirname, 'src/toolkit.ts'),
        dashboard: resolve(__dirname, 'src/dashboard.ts'),
        'asset-open': resolve(__dirname, 'src/asset-open.ts'),
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
