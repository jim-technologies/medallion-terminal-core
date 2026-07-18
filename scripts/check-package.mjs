import { access, readFile, readdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))

const requiredFiles = new Set([
  packageJson.main,
  packageJson.types,
  packageJson.exports?.['.']?.import,
  packageJson.exports?.['.']?.types,
  packageJson.exports?.['./proto']?.types,
  packageJson.exports?.['./styles'],
])

for (const relative of requiredFiles) {
  if (typeof relative !== 'string' || !relative.startsWith('./')) {
    throw new Error(`Invalid package export target: ${JSON.stringify(relative)}`)
  }
  await access(path.resolve(root, relative))
}

const publishedRoots = new Set(packageJson.files)
for (const expected of ['dist', 'proto']) {
  if (!publishedRoots.has(expected)) {
    throw new Error(`package.json files must include ${JSON.stringify(expected)}`)
  }
}
for (const privateRoot of ['src', 'examples', 'public', 'scripts']) {
  if (publishedRoots.has(privateRoot)) {
    throw new Error(`package.json files must not publish ${JSON.stringify(privateRoot)}`)
  }
}

const distFiles = await readdir(path.join(root, 'dist'), { recursive: true })
for (const relative of distFiles) {
  if (/\.(?:fixture|stories|test)\./.test(relative)) {
    throw new Error(`Published dist contains development-only file ${JSON.stringify(relative)}`)
  }
}

const entryPath = path.resolve(root, packageJson.main)
const library = await import(`${pathToFileURL(entryPath).href}?package-check=${Date.now()}`)
const requiredExports = [
  'Dashboard',
  'MultiDashboard',
  'registerWidget',
  'AssetCatalog',
  'ObjectView',
  'CodeBrowser',
  'RecordGrid',
  'RecordBoard',
  'RecordCalendar',
  'RecordForm',
  'ActionForm',
  'DepthChart',
  'GeoMap',
  'MediaGallery',
  'buildBiDescriptor',
  'exportView',
  'validateTemplateTrust',
]
for (const name of requiredExports) {
  if (!(name in library)) throw new Error(`Published entry is missing export ${JSON.stringify(name)}`)
}

const requiredWidgets = [
  'asset_catalog',
  'object_view',
  'code_browser',
  'record_grid',
  'record_board',
  'record_calendar',
  'record_form',
  'file_browser',
  'action_form',
  'depth_chart',
  'geo_map',
  'media_gallery',
]
for (const name of requiredWidgets) {
  if (!(library.BUILTIN_KEYS instanceof Set) || !library.BUILTIN_KEYS.has(name)) {
    throw new Error(`Published widget registry is missing ${JSON.stringify(name)}`)
  }
}

const budgets = [
  // The entry intentionally exposes every built-in for direct composition.
  // Heavy renderers remain peer dependencies; GeoMap loads MapLibre and the
  // media viewer loads its implementation only when mounted. Keep a firm
  // ceiling with room for harmless toolchain churn.
  { label: 'library entry', path: entryPath, maxGzipBytes: 84 * 1024 },
  {
    label: 'library styles',
    path: path.resolve(root, packageJson.exports['./styles']),
    maxGzipBytes: 12 * 1024,
  },
]

for (const budget of budgets) {
  const bytes = await readFile(budget.path)
  const gzipBytes = gzipSync(bytes).byteLength
  if (gzipBytes > budget.maxGzipBytes) {
    throw new Error(
      `${budget.label} is ${(gzipBytes / 1024).toFixed(2)} KiB gzip; ` +
      `budget is ${(budget.maxGzipBytes / 1024).toFixed(2)} KiB`,
    )
  }
  console.log(
    `${budget.label}: ${(gzipBytes / 1024).toFixed(2)} KiB gzip ` +
    `(budget ${(budget.maxGzipBytes / 1024).toFixed(2)} KiB)`,
  )
}

console.log('published package contract: ok')
