import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'path'

const fontsDir = resolve(import.meta.dirname, 'src/fonts')

/**
 * Ships the vendored OFL fonts as files beside `dist/styles.css`.
 *
 * Library mode inlines every CSS asset as base64, which would add ~280 KB to
 * the stylesheet every consumer loads and force hosts to allow `data:` fonts
 * in their CSP. Instead `src/fonts/fonts.css` stays out of the CSS graph: this
 * plugin prepends its `@font-face` rules to `styles.css` with URLs rewritten
 * to `./fonts/…` and emits the font and license files there, so host bundlers
 * resolve them like any other relative stylesheet asset.
 */
function vendoredFonts(): Plugin {
  return {
    name: 'mtc-vendored-fonts',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const styles = Object.values(bundle).find(
        output => output.type === 'asset' && output.fileName === 'styles.css',
      )
      if (!styles || styles.type !== 'asset') {
        this.error('vendored fonts: the library build emitted no styles.css')
      }
      const fontFaces = '/* Inter and JetBrains Mono, SIL OFL 1.1: fonts/OFL-*.txt */\n'
        + readFileSync(resolve(fontsDir, 'fonts.css'), 'utf8')
          .replace(/\/\*[\s\S]*?\*\/\n/g, '')
          .replace(/url\("\.\/([^"]+)"\)/g, 'url("./fonts/$1")')
      // Keep Tailwind's preserved license banner as the first line.
      const css = String(styles.source)
      const bannerEnd = css.startsWith('/*!') ? css.indexOf('*/') + 2 : 0
      const banner = bannerEnd > 0 ? `${css.slice(0, bannerEnd)}\n` : ''
      styles.source = `${banner}${fontFaces}${css.slice(bannerEnd)}`
      for (const file of readdirSync(fontsDir).sort()) {
        if (!/\.(?:woff2|txt)$/.test(file)) continue
        this.emitFile({
          type: 'asset',
          fileName: `fonts/${file}`,
          source: readFileSync(resolve(fontsDir, file)),
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), vendoredFonts()],
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
