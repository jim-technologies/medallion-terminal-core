import { access, readFile, readdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const optionalRendererPeers = ['lightweight-charts', 'maplibre-gl', 'recharts']

for (const packageName of optionalRendererPeers) {
  if (packageJson.dependencies?.[packageName]) {
    throw new Error(`${packageName} must not be an eager runtime dependency`)
  }
  if (!packageJson.peerDependencies?.[packageName]) {
    throw new Error(`${packageName} must remain a declared renderer peer`)
  }
  if (packageJson.peerDependenciesMeta?.[packageName]?.optional !== true) {
    throw new Error(`${packageName} must remain optional for focused-entry consumers`)
  }
}

const requiredFiles = new Set([
  packageJson.main,
  packageJson.types,
  ...Object.values(packageJson.exports ?? {}).flatMap(value => (
    typeof value === 'string' ? [value] : Object.values(value ?? {})
  )),
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
const toolkit = await import(
  `${pathToFileURL(path.resolve(root, packageJson.exports['./toolkit'].import)).href}`
  + `?package-check=${Date.now()}`
)
const dashboard = await import(
  `${pathToFileURL(path.resolve(root, packageJson.exports['./dashboard'].import)).href}`
  + `?package-check=${Date.now()}`
)
const assetOpen = await import(
  `${pathToFileURL(path.resolve(root, packageJson.exports['./asset-open'].import)).href}`
  + `?package-check=${Date.now()}`
)
const requiredExports = [
  'Dashboard',
  'MultiDashboard',
  'registerWidget',
  'AssetOpenProvider',
  'useAssetOpen',
  'assetKindMatches',
  'normalizeAssetOpenResolution',
  'DesignSystemProvider',
  'Icon',
  'Button',
  'IconButton',
  'Input',
  'Combobox',
  'Menu',
  'Dialog',
  'Drawer',
  'Tabs',
  'AppSurface',
  'Toolbar',
  'SplitPane',
  'Tree',
  'PropertyList',
  'createWidgetRegistry',
  'fileEntryIdentity',
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
  'BASEMAP_PRESETS',
  'normalizeBasemap',
  'MediaGallery',
  'Conversation',
  'buildBiDescriptor',
  'exportView',
  'validateTemplateTrust',
]
for (const name of requiredExports) {
  if (!(name in library)) throw new Error(`Published entry is missing export ${JSON.stringify(name)}`)
}
for (const [entry, module, names] of [
  ['./toolkit', toolkit, ['DesignSystemProvider', 'Button', 'Dialog', 'AppSurface', 'Tree']],
  ['./dashboard', dashboard, ['Dashboard', 'MultiDashboard', 'createWidgetRegistry']],
  [
    './asset-open',
    assetOpen,
    ['AssetOpenProvider', 'useAssetOpen', 'assetKindMatches', 'assetApplicationSupports'],
  ],
]) {
  for (const name of names) {
    if (!(name in module)) {
      throw new Error(`Published ${entry} entry is missing export ${JSON.stringify(name)}`)
    }
  }
}

const renderedToolkit = renderToStaticMarkup(
  createElement(
    toolkit.DesignSystemProvider,
    { theme: 'light', density: 'compact' },
    createElement(toolkit.Button, null, 'Inspect'),
  ),
)
if (
  !renderedToolkit.includes('mtc-theme-light')
  || !renderedToolkit.includes('data-density="compact"')
  || !renderedToolkit.includes('mtc-button')
) {
  throw new Error('Published toolkit exports could not render a themed control')
}

const declarationFiles = distFiles.filter(relative => relative.endsWith('.d.ts'))
const declarations = (
  await Promise.all(declarationFiles.map(relative => readFile(path.join(root, 'dist', relative), 'utf8')))
).join('\n')
for (const name of [
  'DesignSystemProviderProps',
  'ButtonProps',
  'DialogProps',
  'TreeProps',
  'DashboardProps',
  'AssetApplicationFrame',
  'TerminalIntent',
  'WidgetRegistry',
  'FileBrowserEntry',
]) {
  if (!new RegExp(`\\b${name}\\b`).test(declarations)) {
    throw new Error(`Published declarations are missing ${JSON.stringify(name)}`)
  }
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
  'conversation',
]
for (const name of requiredWidgets) {
  if (!(library.BUILTIN_KEYS instanceof Set) || !library.BUILTIN_KEYS.has(name)) {
    throw new Error(`Published widget registry is missing ${JSON.stringify(name)}`)
  }
}

const budgets = [
  // The entry intentionally exposes every built-in for direct composition.
  // Heavy renderers remain peer dependencies; GeoMap loads MapLibre and the
  // media viewer loads its implementation only when mounted. The entry also
  // exposes the focused application toolkit. Keep a firm ceiling with narrow
  // room for harmless toolchain churn.
  { label: 'library entry', path: entryPath, maxGzipBytes: 96 * 1024 },
  {
    label: 'toolkit entry',
    path: path.resolve(root, packageJson.exports['./toolkit'].import),
    maxGzipBytes: 14 * 1024,
  },
  {
    label: 'dashboard entry',
    path: path.resolve(root, packageJson.exports['./dashboard'].import),
    maxGzipBytes: 40 * 1024,
  },
  {
    label: 'asset-open entry',
    path: path.resolve(root, packageJson.exports['./asset-open'].import),
    maxGzipBytes: 10 * 1024,
  },
  {
    label: 'library styles',
    path: path.resolve(root, packageJson.exports['./styles']),
    maxGzipBytes: 18 * 1024,
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
