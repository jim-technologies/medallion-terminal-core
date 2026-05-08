import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Demo-app build. Lib build uses vite.config.lib.ts and writes to
// dist/ (the published package). Outputs must not collide, so this
// app build goes to dist-app/.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist-app' },
})
