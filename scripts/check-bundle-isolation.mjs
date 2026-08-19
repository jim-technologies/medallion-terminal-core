import { readFile, readdir } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const virtualOutdir = path.join(root, '.bundle-isolation-check')
const forbiddenRuntimePackages = [
  'recharts',
  'lightweight-charts',
  'maplibre-gl',
  '@ffmpeg/ffmpeg',
  '@ffmpeg/util',
  'heic2any',
]
const forbiddenBrowserImports = [
  '@ffmpeg/ffmpeg',
  '@ffmpeg/util',
  'heic2any',
]

const checks = [
  {
    label: 'toolkit',
    entry: path.join(root, 'dist/toolkit.js'),
    maxStaticGzipBytes: 16 * 1024,
    requireDynamicImport: false,
  },
  {
    label: 'asset-open',
    entry: path.join(root, 'dist/asset-open.js'),
    maxStaticGzipBytes: 12 * 1024,
    requireDynamicImport: false,
  },
  {
    label: 'dashboard',
    entry: path.join(root, 'dist/dashboard.js'),
    maxStaticGzipBytes: 72 * 1024,
    requireDynamicImport: true,
  },
]

for (const check of checks) {
  const result = await build({
    absWorkingDir: root,
    entryPoints: { [check.label]: check.entry },
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    splitting: true,
    minify: true,
    write: false,
    metafile: true,
    outdir: virtualOutdir,
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    logLevel: 'silent',
  })

  const outputs = Object.entries(result.metafile.outputs)
  const entryOutput = outputs.find(([, metadata]) => (
    metadata.entryPoint
    && path.resolve(root, metadata.entryPoint) === check.entry
  ))
  if (!entryOutput) {
    throw new Error(`${check.label}: esbuild did not identify the entry output`)
  }

  const outputFiles = new Map(
    result.outputFiles.map(file => [path.normalize(file.path), file.contents]),
  )
  const reachable = staticOutputClosure(entryOutput[0], result.metafile.outputs)
  const staticGzipBytes = [...reachable].reduce((total, outputName) => {
    const absolute = path.normalize(path.resolve(root, outputName))
    const contents = outputFiles.get(absolute)
    if (!contents) throw new Error(`${check.label}: missing output bytes for ${outputName}`)
    return total + gzipSync(contents).byteLength
  }, 0)

  if (staticGzipBytes > check.maxStaticGzipBytes) {
    throw new Error(
      `${check.label}: static bundle is ${(staticGzipBytes / 1024).toFixed(2)} KiB gzip; `
      + `budget is ${(check.maxStaticGzipBytes / 1024).toFixed(2)} KiB`,
    )
  }

  const forbidden = new Set()
  let dynamicImports = 0
  for (const outputName of reachable) {
    const metadata = result.metafile.outputs[outputName]
    for (const imported of metadata.imports) {
      if (imported.kind === 'dynamic-import') {
        dynamicImports += 1
        continue
      }
      const packageName = forbiddenRuntimePackages.find(name => (
        imported.path === name || imported.path.startsWith(`${name}/`)
      ))
      if (packageName) forbidden.add(packageName)
    }
    for (const inputName of Object.keys(metadata.inputs)) {
      const packageName = forbiddenRuntimePackages.find(name => (
        inputName.includes(`/node_modules/${name}/`)
        || inputName.includes(`/node_modules/.pnpm/${name.replace('/', '+')}@`)
      ))
      if (packageName) forbidden.add(packageName)
    }
  }

  if (forbidden.size > 0) {
    throw new Error(
      `${check.label}: static bundle reaches optional runtime packages: `
      + [...forbidden].sort().join(', '),
    )
  }
  if (check.requireDynamicImport && dynamicImports === 0) {
    throw new Error(`${check.label}: no lazy widget boundary remains in the consumer bundle`)
  }

  console.log(
    `${check.label}: ${(staticGzipBytes / 1024).toFixed(2)} KiB static gzip; `
    + `${dynamicImports} lazy import${dynamicImports === 1 ? '' : 's'}`,
  )
}

// Catch ignored bare imports in every published chunk even when a package is
// absent from the local dependency graph. Such imports survive into browsers
// and cannot resolve without a host import map.
const distFiles = await readdir(path.join(root, 'dist'), { recursive: true })
for (const relative of distFiles.filter(file => file.endsWith('.js'))) {
  const source = await readFile(path.join(root, 'dist', relative), 'utf8')
  for (const packageName of forbiddenBrowserImports) {
    if (source.includes(`import("${packageName}")`)
      || source.includes(`import('${packageName}')`)) {
      throw new Error(
        `dist/${relative} retains a browser-unresolvable bare import for ${packageName}`,
      )
    }
  }
}

console.log('consumer bundle isolation: ok')

function staticOutputClosure(entryName, outputs) {
  const seen = new Set()
  const visit = (outputName) => {
    if (seen.has(outputName)) return
    seen.add(outputName)
    const metadata = outputs[outputName]
    if (!metadata) return
    for (const imported of metadata.imports) {
      if (imported.external || imported.kind === 'dynamic-import') continue
      // esbuild metafiles normally report generated imports relative to the
      // working directory (already an output-map key). Keep a relative-path
      // fallback for compatibility with other esbuild output modes.
      const resolved = outputs[imported.path]
        ? imported.path
        : path.posix.normalize(
            path.posix.join(path.posix.dirname(outputName), imported.path),
          )
      visit(resolved)
    }
  }
  visit(entryName)
  return seen
}
