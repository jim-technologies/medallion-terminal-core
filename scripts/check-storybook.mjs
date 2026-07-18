import { readFileSync, readdirSync } from 'node:fs'

const indexPath = 'storybook-static/index.json'
const storybookIndex = JSON.parse(readFileSync(indexPath, 'utf8'))
const entries = Object.values(storybookIndex.entries ?? {})

if (entries.length === 0) {
  throw new Error(`${indexPath} contains no stories`)
}

const publicExampleIds = readdirSync('public/examples')
  .filter(file => file.endsWith('.json'))
  .map(file => file.replace(/\.json$/, ''))
  .sort()
const galleryEntries = entries.filter(
  entry => entry.importPath === './src/ExamplesGallery.stories.tsx',
)

const missingExamples = publicExampleIds.filter(
  exampleId => !galleryEntries.some(entry => entry.id.endsWith(`--${exampleId}`)),
)
if (missingExamples.length > 0) {
  throw new Error(`Storybook is missing example stories: ${missingExamples.join(', ')}`)
}

const registrySource = readFileSync('src/core/WidgetRegistry.ts', 'utf8')
const widgetImports = [
  ...registrySource.matchAll(
    /lazyWidget\(\(\) => import\('\.\.\/widgets\/([^']+)'\)/g,
  ),
].map(match => match[1])
const widgetStoryModules = new Set(
  widgetImports.map(moduleName => moduleName === 'MediaGalleryImpl' ? 'MediaGallery' : moduleName),
)
const indexedImportPaths = new Set(entries.map(entry => entry.importPath))
const missingWidgetStories = [...widgetStoryModules]
  .filter(moduleName => !indexedImportPaths.has(`./src/widgets/${moduleName}.stories.tsx`))
  .sort()

if (missingWidgetStories.length > 0) {
  throw new Error(`Storybook is missing built-in widget stories: ${missingWidgetStories.join(', ')}`)
}

console.log(
  `Storybook coverage OK: ${publicExampleIds.length} complete dashboards, `
  + `${widgetStoryModules.size} built-in widgets, ${entries.length} total stories.`,
)
