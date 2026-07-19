import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

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

function storyFilesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return storyFilesUnder(path)
    return entry.name.endsWith('.stories.tsx') ? [path] : []
  })
}

const cloneStories = storyFilesUnder('examples/clones')
const missingCloneStories = cloneStories.filter(storyPath => {
  const importPath = `./${storyPath}`
  return !indexedImportPaths.has(importPath)
})

if (missingCloneStories.length > 0) {
  throw new Error(`Storybook is missing clone showcases: ${missingCloneStories.join(', ')}`)
}

const cloneGroups = ['Google', 'Palantir', 'SME']
const cloneContracts = cloneStories.map(storyPath => {
  const source = readFileSync(storyPath, 'utf8')
  return {
    storyPath,
    title: source.match(/title:\s*['"]([^'"]+)['"]/)?.[1],
    namespace: source.match(/cloneNamespace:\s*['"]([^'"]+)['"]/)?.[1],
  }
})
const invalidCloneContracts = cloneContracts.filter(({ title, namespace }) =>
  !cloneGroups.some(group => title?.startsWith(`Clones/${group}/`))
  || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(namespace ?? ''),
)
if (invalidCloneContracts.length > 0) {
  throw new Error(
    'Clone stories must use a Clones/Google, Clones/Palantir, or Clones/SME title '
    + `and a kebab-case cloneNamespace: ${
      invalidCloneContracts.map(({ storyPath }) => storyPath).join(', ')
    }`,
  )
}

const cloneTitles = cloneContracts.map(({ title }) => title)
const cloneNamespaces = cloneContracts.map(({ namespace }) => namespace)
if (new Set(cloneTitles).size !== cloneTitles.length) {
  throw new Error('Clone story titles must be unique')
}
if (new Set(cloneNamespaces).size !== cloneNamespaces.length) {
  throw new Error('Clone story namespaces must be unique')
}
const missingCloneGroups = cloneGroups.filter(group =>
  !cloneTitles.some(title => title?.startsWith(`Clones/${group}/`)),
)
if (missingCloneGroups.length > 0) {
  throw new Error(`Storybook is missing clone groups: ${missingCloneGroups.join(', ')}`)
}

console.log(
  `Storybook coverage OK: ${publicExampleIds.length} complete dashboards, `
  + `${widgetStoryModules.size} built-in widgets, ${cloneStories.length} clone showcase`
  + `${cloneStories.length === 1 ? '' : 's'}, `
  + `${entries.length} total stories.`,
)
