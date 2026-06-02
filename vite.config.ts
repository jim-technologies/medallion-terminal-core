import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// Demo-app build. Lib build uses vite.config.lib.ts and writes to
// dist/ (the published package). Outputs must not collide, so this
// app build goes to dist-app/.
//
// Two HTML entries: the demo app (index.html) and the standalone embed
// page (embed.html). The embed page is the iframe target BI tools point
// at — it renders a single widget or dashboard with minimal chrome.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist-app',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        embed: resolve(__dirname, 'embed.html'),
      },
    },
  },
})
