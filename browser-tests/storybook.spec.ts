import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator, type Page } from '@playwright/test'

const cloneStories = {
  airtable: 'clones-airtable--operational-grid',
  superset: 'clones-apache-superset--business-dashboard',
  confluence: 'clones-atlassian-confluence--space-overview',
  jira: 'clones-atlassian-jira--backlog',
  binance: 'clones-binance--spot-trading',
  coingecko: 'clones-coingecko--market-rankings',
  databricks: 'clones-databricks--collaborative-notebook',
  github: 'clones-github--pull-request',
  gitlab: 'clones-gitlab--merge-request',
  calendar: 'clones-google-calendar--month-view',
  drive: 'clones-google-drive--my-drive',
  gmail: 'clones-google-gmail--inbox',
  timeline: 'clones-google-maps-timeline--day-history',
  photos: 'clones-google-photos--photo-timeline',
  docs: 'clones-google-docs--operating-plan',
  sheets: 'clones-google-sheets--revenue-model',
  slides: 'clones-google-slides--business-review',
  grafana: 'clones-grafana-labs-grafana--operations-dashboard',
  hubspot: 'clones-hubspot--contact-index',
  tws: 'clones-interactive-brokers-trader-workstation--mosaic-workspace',
  intercom: 'clones-intercom--shared-inbox',
  linear: 'clones-linear--my-issues',
  facebook: 'clones-meta-facebook--home-feed',
  instagram: 'clones-meta-instagram--home-feed',
  threads: 'clones-meta-threads--for-you',
  whatsapp: 'clones-meta-whatsapp--group-conversation',
  outlook: 'clones-microsoft-outlook--focused-inbox',
  netflix: 'clones-netflix--personalized-home',
  notion: 'clones-notion--project-document',
  chatgpt: 'clones-openai-chatgpt--assistant-conversation',
  palantir: 'clones-palantir-foundry-foundation--platform-readiness',
  palantirOntology: 'clones-palantir-foundry-ontology-operations--ontology-manager',
  polymarket: 'clones-polymarket--market-discovery',
  quickbooks: 'clones-intuit-quickbooks--business-overview',
  shopify: 'clones-shopify--store-overview',
  slack: 'clones-slack--launch-channel',
  snowflake: 'clones-snowflake--workspace-sql-project',
  backstage: 'clones-spotify-backstage--software-catalog',
  spotify: 'clones-spotify--personalized-home',
  stripe: 'clones-stripe--revenue-overview',
} as const

const toolkitStories = {
  toolkitThemes: 'toolkit-foundations-designsystemprovider--themes',
  toolkitDensity: 'toolkit-foundations-designsystemprovider--density-modes',
  toolkitButtons: 'toolkit-components-controls--icon-and-buttons',
  toolkitIcons: 'toolkit-components-iconography--icon-set',
  toolkitTypeGlyphs: 'toolkit-components-iconography--type-glyphs',
  toolkitForms: 'toolkit-components-controls--input-text-area-and-form-field',
  toolkitChoices: 'toolkit-components-controls--checkbox-radio-and-switch',
  toolkitCombobox: 'toolkit-components-controls--combobox-control',
  toolkitFeedback: 'toolkit-components-controls--tag-badge-and-callout',
  toolkitLight: 'toolkit-components-controls--light-comfortable',
  toolkitCompact: 'toolkit-components-controls--compact-density',
  toolkitTabs: 'toolkit-components-navigation--tabs-control',
  toolkitVerticalTabs: 'toolkit-components-navigation--vertical-tabs',
  toolkitBreadcrumbs: 'toolkit-components-navigation--breadcrumbs-control',
  toolkitNarrowBreadcrumbs: 'toolkit-components-navigation--narrow-breadcrumbs',
  toolkitTooltip: 'toolkit-components-overlays--tooltip-control',
  toolkitPopover: 'toolkit-components-overlays--popover-control',
  toolkitMenu: 'toolkit-components-overlays--menu-control',
  toolkitContextMenu: 'toolkit-components-overlays--context-menu-control',
  toolkitDialog: 'toolkit-components-overlays--dialog-control',
  toolkitDrawer: 'toolkit-components-overlays--drawer-control',
  toolkitAppSurface: 'toolkit-workbench-primitives--app-surface-toolbar-sidebar-and-inspector',
  toolkitSplitPane: 'toolkit-workbench-primitives--split-pane-keyboard-resize',
  toolkitTree: 'toolkit-workbench-primitives--tree-selection-and-expansion',
  toolkitPropertyList: 'toolkit-workbench-primitives--property-list-arbitrary-data',
  toolkitStates: 'toolkit-workbench-primitives--empty-loading-and-error-states',
  toolkitAccessStates: 'toolkit-workbench-primitives--access-session-and-freshness-states',
  toolkitNarrowPane: 'toolkit-workbench-primitives--narrow-stacked-pane',
  toolkitObjectWorkbench: 'toolkit-compositions-workbenches--object-workbench-composition',
  toolkitModelWorkbench: 'toolkit-compositions-workbenches--model-workbench-composition',
  toolkitDatabase: 'toolkit-compositions-workbenches--database-like-data-workbench',
  toolkitTableViewer: 'toolkit-compositions-workbenches--database-table-viewer',
  toolkitScopedRegistry: 'toolkit-integration-hostbridge--scoped-widget-registry',
  toolkitHostIntent: 'toolkit-integration-hostbridge--host-intent-emission',
  toolkitStatusKeys: 'toolkit-components-display--status-keys-and-avatars',
  toolkitSkeletonCopy: 'toolkit-components-display--skeletons-and-copy',
  toolkitPanel: 'toolkit-components-display--panel-frame',
  toolkitPropertyValues: 'toolkit-objects-propertyvalue--every-kind',
  toolkitPropertyPanel: 'toolkit-objects-propertypanel--grouped-and-filterable',
  toolkitObjectHeader: 'toolkit-objects-objectheader--object-page-header',
  toolkitInspectorHeader: 'toolkit-objects-objectheader--inspector-header',
  toolkitObjectChips: 'toolkit-objects-objectheader--chips-and-hover-cards',
  toolkitDataGrid: 'toolkit-workbench-datagrid--typed-object-table',
  toolkitDataGridLarge: 'toolkit-workbench-datagrid--ten-thousand-rows',
  toolkitDataGridActions: 'toolkit-workbench-datagrid--context-actions-and-paging',
  toolkitDataGridEmpty: 'toolkit-workbench-datagrid--empty-and-loading',
  toolkitDataGridNarrow: 'toolkit-workbench-datagrid--narrow-columns',
  toolkitLinkPanel: 'toolkit-objects-links--link-panel-groups',
  toolkitLinkGraph: 'toolkit-objects-links--one-hop-graph',
  toolkitLinkGraphCapped: 'toolkit-objects-links--capped-graph',
  toolkitSchemaGraph: 'toolkit-objects-links--schema-graph-types',
  toolkitSearchField: 'toolkit-components-search--search-field-with-tokens',
  toolkitCommandPalette: 'toolkit-components-search--command-palette-grouped',
  toolkitCommandPaletteOpen: 'toolkit-components-search--command-palette-open',
  toolkitStatTiles: 'toolkit-components-status--stat-tiles',
  toolkitToasts: 'toolkit-components-status--toast-stack',
  toolkitPagination: 'toolkit-components-status--pagination-modes',
  toolkitNavRail: 'toolkit-workbench-navigation--nav-rail-sections',
  toolkitPageHeader: 'toolkit-workbench-navigation--page-header-with-tabs',
  toolkitFacets: 'toolkit-objects-explore--facet-rail',
  toolkitActivity: 'toolkit-objects-explore--activity-feed-and-timeline',
  toolkitCsvPreview: 'toolkit-files--csv-table',
  toolkitMarkdownPreview: 'toolkit-files--markdown-document',
  toolkitImagePreview: 'toolkit-files--signature-checks',
  toolkitTextPreview: 'toolkit-files--source-and-text',
  toolkitCodeView: 'toolkit-files--code-view-controls',
  toolkitCodeHighlighting: 'toolkit-files--code-view-highlighting',
  toolkitShell: 'toolkit-app-productshell--standalone-shell',
  toolkitShellExpired: 'toolkit-app-productshell--session-expired',
  toolkitShellSignedOut: 'toolkit-app-productshell--signed-out',
  toolkitShellEmbedded: 'toolkit-app-productshell--embedded-page',
  toolkitShellMinimal: 'toolkit-app-productshell--without-session',
  toolkitOperationsTray: 'toolkit-app-productshell--operations-tray-states',
  toolkitResource: 'toolkit-app-useresource--cached-and-deduplicated',
  toolkitObjectPage: 'toolkit-objects-objectpage--customer-object-page',
} as const

// Widgets rebuilt on toolkit components keep themed baselines too. Their
// story frames have a fixed width, so they skip the mobile containment check.
const widgetStories = {
  widgetFileBrowser: 'widgets-filebrowser--host-extensions',
  widgetRecordGrid: 'widgets-records-recordgrid--default',
  widgetRecordGridEditing: 'widgets-records-recordgrid--inline-editing',
  widgetRecordGridOverlayEditor: 'widgets-records-recordgrid--editor-over-the-cell',
  widgetRecordGridLists: 'widgets-records-recordgrid--lists-and-chips',
  widgetTable: 'widgets-datatable--watchlist-fit',
  widgetObjectView: 'widgets-objectview--customer-object',
  widgetText: 'widgets-text--markdown-body',
  widgetTrade: 'widgets-trade--spot-trade',
} as const

// Page templates are whole pages composed only from the toolkit entry:
// themed baselines at 1440 and phone baselines at 390, in both themes.
const templateStories = {
  templateObjectExplorer: 'templates-pages--object-explorer-page',
  templateObjectView: 'templates-pages--object-view-page',
  templateObjectType: 'templates-pages--object-type-page',
  templateSchemaGraph: 'templates-pages--schema-graph-page',
  templateFiles: 'templates-pages--files-page',
  templateOperations: 'templates-pages--operations-page',
  templateStorage: 'templates-pages--storage-page',
  templateConnect: 'templates-pages--connect-page',
} as const

const stories = {
  dashboard: 'core-dashboard--full-demo',
  ...cloneStories,
  ...toolkitStories,
  ...widgetStories,
  ...templateStories,
  githubFiles: 'clones-github--files-changed',
  githubChecks: 'clones-github--checks',
  gitlabChanges: 'clones-gitlab--changes',
  gitlabPipeline: 'clones-gitlab--pipeline',
  backstageEntity: 'clones-spotify-backstage--component-overview',
  backstageTopology: 'clones-spotify-backstage--system-topology',
  backstageTemplates: 'clones-spotify-backstage--software-templates',
  backstageScaffolder: 'clones-spotify-backstage--scaffolder-workflow',
  backstageDocs: 'clones-spotify-backstage--tech-docs',
  readiness: 'examples-production-readiness--connected-workspace',
  recovery: 'examples-production-readiness--failure-and-recovery',
  scale: 'examples-production-readiness--large-collections',
  workflow: 'examples-production-readiness--governed-workflow',
} as const

type StoryTheme = 'dark' | 'operator' | 'light' | 'high-contrast'
type StoryDensity = 'compact' | 'standard' | 'comfortable'

interface StoryOptions {
  /** Storybook `theme` global; the preview decorator scopes it. */
  theme?: StoryTheme
  /** Storybook `density` global; omitted keeps the preview default. */
  density?: StoryDensity
  /** Render at FIXED_NOW (baseline tests). */
  pinClock?: boolean
}

// Baseline stories render at one wall-clock instant, so live clocks,
// relative times ("3 min ago") and "today" markers are identical on every
// run and every day. Timers still run in real time; only `Date` is pinned.
// Behaviour and axe tests keep the real clock: the pinned one delays the
// Storybook a11y addon's own axe run until it overlaps the gate's.
const FIXED_NOW = new Date('2026-07-22T18:45:00Z')

async function openStory(page: Page, id: string, { theme = 'dark', density, pinClock = false }: StoryOptions = {}) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  if (pinClock) await page.clock.setFixedTime(FIXED_NOW)
  const globals = [`theme:${theme}`, density && `density:${density}`].filter(Boolean).join(';')
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=${globals}`)
  // The vendored fonts load asynchronously (font-display: swap); settle them
  // before any assertion or screenshot so glyph metrics are final. A cold
  // Storybook dev server can reload the iframe once while Vite optimizes a
  // late dependency, so a destroyed context is waited out and retried.
  for (let attempt = 1; ; attempt++) {
    await page.locator('#storybook-root').waitFor({ state: 'visible' })
    await page.waitForLoadState('networkidle')
    try {
      await page.evaluate(async () => { await document.fonts.ready })
      break
    } catch (error) {
      if (attempt >= 3 || !String(error).includes('Execution context was destroyed')) throw error
    }
  }
  // A story's play function runs after the first render; compare and
  // interact only once it has finished, so a baseline never captures a
  // half-played story.
  // The preview's "preparing" overlay must be gone too: a page screenshot
  // taken under it records a spinner instead of the story.
  await page.waitForFunction(() => {
    const preview = (window as unknown as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } }).__STORYBOOK_PREVIEW__
    const phase = preview?.currentRender?.phase
    return phase !== undefined
      && ['played', 'completing', 'completed', 'afterEach', 'finished', 'errored', 'aborted'].includes(phase)
      && document.body.classList.contains('sb-show-main')
      && !document.body.classList.contains('sb-show-preparing-story')
  })
  expect(errors, `browser errors in ${id}`).toEqual([])
  // A dev server under load can serve its "failed to load the preview"
  // page instead of the story; fail (and let the retry run) rather than
  // compare, or with --update-snapshots record, that page as a baseline.
  await expect(page.getByText(/Failed to load the Storybook preview/), `Storybook preview for ${id}`).toHaveCount(0)
  return page.locator('#storybook-root')
}

// The pixel comparison tolerates 0.3% of the frame for anti-aliasing, which
// is enough to hide a whole widget changing state ("Unable to load" becoming
// "You don't have access"). The accessibility-tree snapshot beside it has no
// tolerance: every role, accessible name and text node, numbers included,
// must equal `browser-tests/__aria__/${name}.yml`, so a copy or state
// change fails the gate until the snapshot is regenerated on purpose. It is
// taken after the screenshot, which waits for the page to settle.
async function expectAriaBaseline(root: Locator, name: string) {
  // Never compare, or record, a story that has not rendered. Under load the
  // preview can remount a story for a moment after its screenshot, so an
  // empty tree is re-read for a few seconds before it counts as a failure.
  let snapshot = ''
  await expect.poll(async () => {
    snapshot = await root.ariaSnapshot()
    return snapshot.trim()
  }, { message: `accessibility tree of ${name}`, timeout: 5_000 }).not.toBe('')
  expect(snapshot).toMatchSnapshot(`${name}.yml`)
}

async function expectBaseline(root: Locator, name: string) {
  await expect(root).toHaveScreenshot(`${name}.png`)
  await expectAriaBaseline(root, name)
}

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .include('#storybook-root')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze()
  expect(results.violations).toEqual([])
}

for (const [name, id] of Object.entries(stories)) {
  test(`${name} has no automated accessibility violations`, async ({ page }) => {
    await openStory(page, id)
    await expectNoAxeViolations(page)
  })
}

// Toolkit stories that follow the theme global. Stories that pin their own
// provider (the theme and density specimens) render identically under every
// global, so they keep one baseline.
const themeInvariantToolkitStories = new Set<keyof typeof toolkitStories>([
  'toolkitThemes',
  'toolkitDensity',
  'toolkitLight',
  'toolkitCompact',
])
const themedToolkitStories = [
  ...Object.entries(toolkitStories)
    .filter(([name]) => !themeInvariantToolkitStories.has(name as keyof typeof toolkitStories)),
  ...Object.entries(widgetStories),
  ...Object.entries(templateStories),
]

for (const [name, id] of themedToolkitStories) {
  test(`${name} has no automated accessibility violations in the light theme`, async ({ page }) => {
    await openStory(page, id, { theme: 'light' })
    await expectNoAxeViolations(page)
  })
}

test('Google Drive supports search and layout switching', async ({ page }) => {
  const root = await openStory(page, stories.drive)
  const search = page.getByRole('textbox', { name: 'Search in Files' })
  await search.fill('roadmap')
  await expect(root.getByText(/roadmap/i).first()).toBeVisible()
  await page.getByRole('button', { name: 'Grid view' }).click()
  await expect(page.getByRole('button', { name: 'Grid view' })).toHaveAttribute('aria-pressed', 'true')
})

test('Spotify supports search and playback controls', async ({ page }) => {
  await openStory(page, stories.spotify)
  await page.getByRole('button', { name: /search/i }).first().click()
  const search = page.getByRole('textbox', { name: 'What do you want to play?' })
  await search.fill('signal')
  await expect(search).toHaveValue('signal')
  await page.getByRole('button', { name: /^Play / }).first().click()
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
})

test('HubSpot opens contact records through the semantic row action', async ({ page }) => {
  const root = await openStory(page, stories.hubspot)
  const contact = root.getByRole('button', { name: 'Open Amelia Stone' })

  await contact.focus()
  await page.keyboard.press('Enter')
  await expect(root.getByText('About this contact')).toBeVisible()
  await expect(root.getByRole('heading', { name: 'Amelia Stone' })).toBeVisible()
})

test('CoinGecko opens ranked assets through the semantic coin action', async ({ page }) => {
  const root = await openStory(page, stories.coingecko)
  const showcase = root.locator('[data-product="coingecko"]')
  const coin = root.getByRole('button', { name: 'Open Bitcoin' })

  await coin.focus()
  await page.keyboard.press('Enter')
  await expect(showcase).toHaveAttribute('data-view', 'coin-detail')
  await expect(root.getByRole('heading', { name: 'Bitcoin price chart' })).toBeVisible()
})

test('Backstage filters the catalog and opens entity topology', async ({ page }) => {
  const root = await openStory(page, stories.backstage)
  const showcase = root.locator('[data-product="spotify-backstage"]')

  await root.getByRole('searchbox', { name: 'Filter catalog' }).fill('gateway')
  await expect(root.getByRole('button', { name: 'Open Customer Gateway' })).toBeVisible()
  await expect(root.getByRole('button', { name: 'Open Web Console' })).toHaveCount(0)

  await root.getByRole('button', { name: 'Open Customer Gateway' }).click()
  await expect(showcase).toHaveAttribute('data-view', 'entity')
  await expect(root.getByRole('heading', { name: 'customer-gateway', level: 1 })).toBeVisible()

  await root.getByRole('tab', { name: 'Dependencies' }).click()
  await expect(root.getByRole('heading', { name: 'System topology' })).toBeVisible()
  await expect(root.getByRole('button', { name: /Customer Database/ })).toBeVisible()

  await root.getByRole('button', { name: 'Create', exact: true }).click()
  await expect(showcase).toHaveAttribute('data-view', 'create')
  await expect(root.getByRole('heading', { name: 'Create a new component' })).toBeVisible()
})

test('GitHub supports pull-request review, file selection, and viewed state', async ({ page }) => {
  const root = await openStory(page, stories.github)
  const showcase = root.locator('[data-product="github"]')
  const sections = root.getByRole('navigation', { name: 'Pull request sections' })

  await sections.getByRole('button', { name: /Files changed/ }).click()
  await expect(showcase).toHaveAttribute('data-view', 'files-changed')

  await root.getByRole('textbox', { name: 'Filter changed files' }).fill('integrations')
  await root.getByRole('button', { name: 'Open docs/integrations.md' }).click()
  const viewed = root.getByRole('checkbox', { name: 'Viewed' })
  await viewed.check()
  await expect(viewed).toBeChecked()

  await sections.getByRole('button', { name: /Checks/ }).click()
  await expect(showcase).toHaveAttribute('data-view', 'actions')
  await root.getByRole('button', { name: /Deploy preview/ }).click()
  await expect(root.getByRole('heading', { name: 'Deploy preview' })).toBeVisible()
})

test('GitLab supports stage-based pipelines and changed-file review', async ({ page }) => {
  const root = await openStory(page, stories.gitlab)
  const showcase = root.locator('[data-product="gitlab"]')
  const sections = root.getByRole('navigation', { name: 'Merge request sections' })

  await sections.getByRole('button', { name: /Pipelines/ }).click()
  await expect(showcase).toHaveAttribute('data-view', 'pipeline')
  await root.getByRole('button', { name: /Storybook/ }).first().click()
  await expect(root.getByRole('heading', { name: 'Storybook' })).toBeVisible()

  await sections.getByRole('button', { name: /Changes/ }).click()
  await expect(showcase).toHaveAttribute('data-view', 'changes')
  await root.getByRole('button', { name: 'Open docs/integrations.md' }).click()
  const viewed = root.getByRole('checkbox', { name: 'Viewed' })
  await viewed.check()
  await expect(viewed).toBeChecked()
})

test('Instagram supports engagement, discovery, and search', async ({ page }) => {
  const root = await openStory(page, stories.instagram)
  const showcase = root.locator('[data-product="meta-instagram"]')
  const mayaPost = root.locator('article').filter({ hasText: 'mayachen' }).first()
  const like = mayaPost.getByRole('button', { name: 'Like post' })
  await like.click()
  await expect(mayaPost.getByRole('button', { name: 'Unlike post' })).toBeVisible()

  await root.getByRole('button', { name: 'Explore', exact: true }).click()
  await expect(showcase).toHaveAttribute('data-view', 'explore')
  await root.getByRole('searchbox', { name: 'Search Gallery' }).fill('quiet')
  await expect(root.getByRole('button', { name: /Open Jun/ })).toBeVisible()
})

test('Facebook navigates from the feed to a business page', async ({ page }) => {
  const root = await openStory(page, stories.facebook)
  const showcase = root.locator('[data-product="meta-facebook"]')
  await root.getByRole('button', { name: 'Business page', exact: true }).click()
  await expect(showcase).toHaveAttribute('data-view', 'business-page')
  await expect(root.getByRole('heading', { name: /Jim Technologies/ })).toBeVisible()
  await expect(root.getByText('18K followers · 286 following')).toBeVisible()
})

test('Threads switches feeds and accepts a draft', async ({ page }) => {
  const root = await openStory(page, stories.threads)
  const showcase = root.locator('[data-product="meta-threads"]')
  const feedNavigation = root.getByRole('navigation', { name: 'Posts feed' })
  await feedNavigation.getByRole('button', { name: 'Following' }).click()
  await expect(showcase).toHaveAttribute('data-view', 'following')

  const composer = root.getByRole('textbox', { name: 'Start a thread...' })
  await composer.fill('A host-owned draft')
  await expect(composer).toHaveValue('A host-owned draft')
})

test('Dashboard keyboard navigation opens and closes fullscreen', async ({ page }) => {
  await openStory(page, stories.dashboard)
  await page.keyboard.press('j')
  await expect(page.locator('.mtc-widget[data-focused="true"]')).toHaveCount(1)
  await page.keyboard.press('f')
  await expect(page.getByRole('dialog', { name: /^Fullscreen / })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: /^Fullscreen / })).toHaveCount(0)
})

test('Production readiness workspace composes and preserves scenario tabs', async ({ page }) => {
  await openStory(page, stories.readiness)
  await page.getByRole('button', { name: /Reliability/ }).click()
  await expect(page.getByRole('heading', { name: 'Production resilience · healthy' })).toBeVisible()

  await page.keyboard.press('Control+3')
  await expect(page.getByRole('heading', { name: 'Large collections · bounded pages' })).toBeVisible()

  await page.getByRole('button', { name: /Access & policy/ }).click()
  await expect(page.getByRole('heading', { name: 'Jim Technologies · authorized workspace' })).toBeVisible()
})

test('Production readiness recovery scenario exposes failure and recovery states', async ({ page }) => {
  const root = await openStory(page, stories.recovery)
  const scenario = root.getByRole('combobox')
  const probe = root.locator('#mt-widget-probe')

  await scenario.selectOption('empty')
  await expect(root.getByText('valid empty result')).toBeVisible()

  // Failures render as typed states, never as a bare HTTP status; the wait
  // comes from the server's Retry-After.
  await scenario.selectOption('rate_limited')
  await expect(probe.getByText('Too many requests')).toBeVisible()
  await expect(probe.getByText('Try again in 2 seconds.')).toBeVisible()

  await scenario.selectOption('unavailable')
  await expect(probe.getByText('Service unavailable')).toBeVisible()

  await scenario.selectOption('healthy')
  await expect(root.getByText('healthy response')).toBeVisible()
})

test('Production readiness collections page with opaque cursors', async ({ page }) => {
  const root = await openStory(page, stories.scale)
  const catalog = root.locator('.mtc-widget').filter({ hasText: 'Catalog · 12,480 assets' })
  const pages = catalog.getByRole('navigation', { name: 'Asset catalog pages' })

  await pages.getByRole('button', { name: 'Next' }).click()
  await expect(catalog.getByRole('button', { name: /^Inventory forecast healthy/ })).toBeVisible()
  await pages.getByRole('button', { name: 'Previous' }).click()
  await expect(catalog.getByRole('button', { name: /^Customer 360 healthy/ })).toBeVisible()
})

test('Production readiness workflow completes a confirmed action lifecycle', async ({ page }) => {
  const root = await openStory(page, stories.workflow)

  await root.getByRole('button', { name: 'Review decision', exact: true }).click()
  await expect(root.getByText('Confirm action')).toBeVisible()
  await root.getByRole('button', { name: 'Confirm Review decision', exact: true }).click()
  await expect(root.getByText('Change approved and audit evidence retained').first()).toBeVisible()
})

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 820, height: 1000 },
]) {
  test(`Dashboard ${viewport.name} layout stays within the viewport`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    const root = await openStory(page, stories.dashboard, { pinClock: true })
    const dimensions = await root.evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
    await expect(page).toHaveScreenshot(`dashboard-${viewport.name}.png`)
    await expectAriaBaseline(root, `dashboard-${viewport.name}`)
  })
}

// Widget stories frame themselves in a margined box on --mtc-surface. The
// Storybook canvas is its own block formatting context, so that margin stays
// inside the themed root: the theme paints the canvas edge to edge, with no
// unthemed strip above the frame, in dark and light alike.
const storyFrames = {
  actionForm: 'widgets-actionform--governed-approval',
  section: 'widgets-section--labelled',
  metric: 'widgets-metric--full',
  exportMenu: 'bi-exportmenu--table',
  kelly: 'domain-kelly--manual-odds',
}

for (const theme of ['dark', 'light'] as const) {
  test(`Story frames sit on a themed canvas edge to edge in the ${theme} theme`, async ({ page }) => {
    for (const [name, id] of Object.entries(storyFrames)) {
      await openStory(page, id, { theme })
      const canvas = await page.evaluate(() => {
        const edges = [[1, 1], [innerWidth / 2, 1], [innerWidth - 2, 1], [1, innerHeight - 2], [innerWidth - 2, innerHeight - 2]]
        return {
          rootTop: document.querySelector('.mtc-root')?.getBoundingClientRect().top,
          unthemed: edges.filter(([x, y]) => !document.elementFromPoint(x, y)?.closest('.mtc-root')),
        }
      })
      expect(canvas, `${name} canvas`).toEqual({ rootTop: 0, unthemed: [] })
    }
  })
}

test('Workbench composition stacks without horizontal viewport overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const root = await openStory(page, stories.toolkitObjectWorkbench)
  const dimensions = await root.evaluate(element => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
})

test('Database explorer filters, inspects, and presents schema and query workflows', async ({ page }) => {
  const root = await openStory(page, stories.toolkitDatabase)
  const filter = root.getByRole('searchbox', { name: 'Filter table rows' })

  await filter.fill('cobalt')
  await expect(root.getByRole('button', { name: 'Inspect row Cobalt Logistics' })).toBeVisible()
  await expect(root.getByRole('button', { name: 'Inspect row Northwind Health' })).toHaveCount(0)

  await root.getByRole('button', { name: 'Inspect row Cobalt Logistics' }).click()
  await expect(root.getByRole('heading', { name: 'Cobalt Logistics' })).toBeVisible()

  await root.getByRole('tab', { name: 'Structure' }).click()
  await expect(root.getByRole('heading', { name: 'Column definitions' })).toBeVisible()
  await expect(root.getByRole('cell', { name: 'timestamptz' })).toBeVisible()

  await root.getByRole('tab', { name: 'Query' }).click()
  const editor = root.getByRole('textbox', { name: 'SQL query' })
  await expect(editor).toHaveValue(/FROM analytics\.public\.customers/)
  await root.getByRole('button', { name: 'Run preview' }).click()
  await expect(root.getByRole('status')).toContainText('execution remains host-owned')
})

test('FilePreview renders a valid image from a blob and refuses a renamed SVG', async ({ page }) => {
  const root = await openStory(page, stories.toolkitImagePreview)
  await expect(root.getByRole('img', { name: 'chart.png' })).toHaveAttribute('src', /^blob:/)
  await expect(root.getByText('Preview blocked')).toBeVisible()
  await expect(root.locator('img[alt="renamed.png"], svg[onload]')).toHaveCount(0)
})

test('FileBrowser lists entries in a keyboard grid with stable data hooks', async ({ page }) => {
  const root = await openStory(page, stories.widgetFileBrowser)
  const grid = root.getByRole('grid', { name: /Files in/ })
  await expect(grid.locator('[data-mtc-entry-kind="folder"]')).toHaveCount(1)
  await expect(grid.locator('[data-mtc-entry-kind="file"]')).toHaveCount(3)
  await expect(grid.getByRole('columnheader', { name: 'Modified' })).toBeVisible()
  // Dates are formatted, never raw ISO.
  await expect(grid.getByText('2026-09-24T16:20:00Z')).toHaveCount(0)
  await expect(grid.locator('[tabindex="0"]')).toHaveCount(1)
})

test('RecordGrid is a keyboard grid: one tab stop, arrow keys, header sort', async ({ page }) => {
  const root = await openStory(page, stories.widgetRecordGrid)
  const grid = root.getByRole('grid')
  await grid.locator('[data-cell="0:0"]').click()
  await expect(grid.locator('[tabindex="0"]')).toHaveCount(1)
  await page.keyboard.press('ArrowRight')
  await expect(grid.locator('[data-cell="0:1"]')).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('Enter')
  await expect(grid.locator('[role="columnheader"][aria-sort="ascending"]')).toHaveCount(1)
})

test('ProductShell routes from the rail, marks the current page and opens search with Ctrl+K', async ({ page }) => {
  const root = await openStory(page, stories.toolkitShell)
  const nav = root.getByRole('navigation', { name: 'Product navigation' })
  await expect(nav.getByRole('link', { name: /finance/ })).toHaveAttribute('aria-current', 'page')
  await nav.getByRole('link', { name: /Buckets/ }).click()
  await expect(root.getByRole('heading', { name: 'Buckets', level: 1 })).toBeVisible()
  await expect(nav.getByRole('link', { name: /Buckets/ })).toHaveAttribute('aria-current', 'page')
  await root.getByRole('button', { name: 'Open finance' }).click()
  await expect(root.getByRole('grid', { name: 'Files in finance' })).toBeVisible()
  await page.keyboard.press('Control+k')
  const palette = page.getByRole('dialog', { name: 'Command palette' })
  await expect(palette.getByRole('combobox')).toBeFocused()
  await page.keyboard.type('board')
  await page.keyboard.press('Enter')
  await expect(palette).toHaveCount(0)
  await expect(page).toHaveTitle('Opened board-deck.pdf')
})

test('ProductShell keeps the page under the expired-session dialog and renews on Continue', async ({ page }) => {
  const root = await openStory(page, stories.toolkitShellExpired)
  const dialog = page.getByRole('dialog', { name: 'Your session expired' })
  await expect(dialog).toBeVisible()
  // The page is still there underneath.
  await expect(root.getByRole('grid', { name: 'Files in finance' })).toBeAttached()
  await dialog.getByRole('button', { name: 'Continue' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(root.getByRole('grid', { name: 'Files in finance' })).toBeVisible()
})

test('ProductShell moves the navigation into a drawer on phones', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const root = await openStory(page, stories.toolkitShell)
  await expect(root.getByRole('navigation', { name: 'Product navigation' })).toBeHidden()
  await root.getByRole('button', { name: 'Open navigation' }).click()
  const drawer = page.getByRole('dialog', { name: 'Storage' })
  await drawer.getByRole('link', { name: /Activity/ }).click()
  await expect(drawer).toHaveCount(0)
  await expect(root.getByRole('heading', { name: 'Activity', level: 1 })).toBeVisible()
})

test('Object explorer template narrows the grid from facets and previews the selection', async ({ page }) => {
  const root = await openStory(page, stories.templateObjectExplorer)
  const grid = root.getByRole('grid', { name: 'Customers' })
  await expect(grid.getByRole('row')).toHaveCount(6)
  await root.getByRole('checkbox', { name: /At risk/ }).click()
  await expect(root.getByRole('status').filter({ hasText: 'customers' })).toHaveText('1 of 5 customers · sorted by annual contract value')
  await expect(grid.getByRole('row')).toHaveCount(2)
  await grid.getByRole('gridcell', { name: 'Mid-market' }).click()
  const preview = root.getByRole('complementary', { name: 'Selected customer' })
  await expect(preview.getByRole('heading', { name: 'Cedar & Pine Health' })).toBeVisible()
  await page.keyboard.press('Control+k')
  const palette = page.getByRole('dialog', { name: 'Command palette' })
  await page.keyboard.type('north')
  await expect(palette.getByRole('option', { name: /Northstar Labs/ })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(palette).toHaveCount(0)
})

test('Page templates move the navigation and filters into drawers on phones', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const root = await openStory(page, stories.templateObjectExplorer)
  await expect(root.getByRole('navigation', { name: 'Workspace' })).toBeHidden()
  await root.getByRole('button', { name: 'Open navigation' }).click()
  const drawer = page.getByRole('dialog', { name: 'Navigation' })
  await expect(drawer.getByRole('link', { name: 'Explore' })).toHaveAttribute('aria-current', 'page')
  await drawer.getByRole('link', { name: /Files/ }).click()
  await expect(drawer).toHaveCount(0)
  await root.getByRole('button', { name: 'Filters' }).click()
  const filters = page.getByRole('dialog', { name: 'Filters' })
  await filters.getByRole('checkbox', { name: /Watch/ }).click()
  await page.keyboard.press('Escape')
  await expect(root.getByRole('grid', { name: 'Customers' }).getByRole('row')).toHaveCount(2)
})

test('Files template previews the selected file in the inspector', async ({ page }) => {
  const root = await openStory(page, stories.templateFiles)
  const inspector = root.getByRole('complementary', { name: 'Selected file' })
  await expect(inspector.getByRole('grid', { name: 'q3-forecast.csv' })).toBeVisible()
  await root.getByRole('grid', { name: 'Files in finance' }).getByRole('gridcell', { name: '3.1 kB' }).click()
  await expect(inspector.getByRole('heading', { name: 'renewal-notes.md' })).toBeVisible()
  await expect(inspector.getByRole('grid')).toHaveCount(0)
})

// The smallest graph text as it lands on screen: its font size times the
// scale of the drawing it sits in. Hidden (overview) labels do not count.
async function smallestGraphText(page: Page): Promise<{ size: number; text: string | null }> {
  return page.evaluate(() => {
    let smallest = { size: Infinity, text: null as string | null }
    for (const text of document.querySelectorAll<SVGTextElement>('#storybook-root svg text')) {
      const style = getComputedStyle(text)
      if (style.display === 'none' || text.getBBox().width === 0) continue
      const matrix = text.getScreenCTM()
      if (!matrix) continue
      const size = parseFloat(style.fontSize) * Math.hypot(matrix.a, matrix.b)
      if (size < smallest.size) smallest = { size: Math.round(size * 100) / 100, text: text.textContent }
    }
    return smallest
  })
}

for (const width of [1440, 390]) {
  test(`Graph labels never render under 11 px at ${width} px, fitted or zoomed out`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const id of [
      templateStories.templateSchemaGraph,
      templateStories.templateObjectType,
      templateStories.templateObjectView,
      toolkitStories.toolkitLinkGraph,
      toolkitStories.toolkitLinkGraphCapped,
      toolkitStories.toolkitSchemaGraph,
    ]) {
      const root = await openStory(page, id)
      const fitted = await smallestGraphText(page)
      expect(fitted.size, `${id} fitted: ${fitted.text}`).toBeGreaterThanOrEqual(11)
      await root.getByRole('button', { name: 'Zoom out' }).first().click()
      const zoomed = await smallestGraphText(page)
      expect(zoomed.size, `${id} zoomed out: ${zoomed.text}`).toBeGreaterThanOrEqual(11)
    }
  })
}

test('Schema graph on a phone opens with the selected type in view', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const root = await openStory(page, templateStories.templateSchemaGraph)
  const graph = root.getByRole('group', { name: /graph/i }).first()
  const frame = (await graph.boundingBox())!
  const selected = (await graph.locator('[aria-current="true"]').boundingBox())!
  expect(selected.x).toBeGreaterThanOrEqual(frame.x)
  expect(selected.x + selected.width).toBeLessThanOrEqual(frame.x + frame.width)
  expect(selected.y).toBeGreaterThanOrEqual(frame.y)
  expect(selected.y + selected.height).toBeLessThanOrEqual(frame.y + frame.height)
})

test('CopyButton confirms a copy with a polite status', async ({ page }) => {
  const root = await openStory(page, stories.toolkitSkeletonCopy)
  const actions = root.getByRole('region', { name: 'Copy actions' })
  await actions.getByRole('button', { name: 'Copy hash' }).click()
  await expect(actions.getByRole('status').first()).toHaveText('Copied')
  await expect(actions.getByRole('button', { name: 'Copy hash' }).locator('path')).toHaveAttribute('d', 'm5 12 4 4L19 6')
  await expect(actions.getByRole('status').first()).toHaveText('', { timeout: 3000 })
})

// Column fit is measured from layout, not pixels: a column pushed behind a
// horizontal scroll looks tidy in a screenshot and still fails here.
test('The flagship watchlist shows every column whole at 1440 px', async ({ page }) => {
  const root = await openStory(page, 'examples-complete-dashboards--medallion-terminal')
  const grid = root.locator('.mtc-widget').filter({ hasText: 'Watchlist' }).getByRole('grid')
  await expect(grid.getByRole('columnheader')).toHaveText(['Sym', 'Last', 'Chg%', 'Vol', 'Trend'])
  const fit = await grid.evaluate(element => {
    const edge = element.getBoundingClientRect().right
    const cut = (node: Element) => node instanceof HTMLElement && node.scrollWidth > node.clientWidth + 1
    return {
      overflow: element.scrollWidth - element.clientWidth,
      hiddenHeaders: [...element.querySelectorAll('[role="columnheader"]')]
        .filter(header => header.getBoundingClientRect().right > edge + 1)
        .map(header => header.textContent),
      clipped: [...element.querySelectorAll('[role="gridcell"]')]
        .filter(cell => cut(cell) || [...cell.querySelectorAll('*')].some(cut))
        .map(cell => cell.textContent),
    }
  })
  expect(fit).toEqual({ overflow: 0, hiddenHeaders: [], clipped: [] })
})

// Every grid value on the page is whole or ends in an ellipsis. A box that
// clips its content passes only as a block container with `text-overflow:
// ellipsis` whose overflowing content is inline (an ellipsis is never drawn
// for a block child); anything else is a silent cut. A row has one line, so
// anything that leaves its cell at the top or bottom (chips wrapped onto a
// second line, content taller than the row) or is clipped vertically is cut
// too. A status dot or icon squeezed to nothing counts as collapsed.
// Measured from layout, so a cut that looks tidy in a screenshot still
// fails.
async function gridValueFit(page: Page): Promise<{ cut: string[]; ellipsised: string[]; collapsed: string[] }> {
  return page.evaluate(() => {
    const blockContainer = new Set(['block', 'inline-block', 'flow-root', 'list-item', 'table-cell'])
    const cut = new Set<string>()
    const ellipsised = new Set<string>()
    const collapsed = new Set<string>()
    for (const cell of document.querySelectorAll<HTMLElement>('#storybook-root [role="gridcell"], #storybook-root [role="columnheader"]')) {
      const label = `${cell.closest('[role="grid"]')?.getAttribute('aria-label')}: ${(cell.textContent ?? '').trim()}`
      const bounds = cell.getBoundingClientRect()
      for (const element of [cell, ...cell.querySelectorAll('*')]) {
        // Not rendered (inside a hidden pane), or text for assistive
        // technology only: nothing to cut.
        if (element.getClientRects().length === 0 || element.closest('.mtc-visually-hidden')) continue
        const style = getComputedStyle(element)
        const box = element.getBoundingClientRect()
        if ((element instanceof SVGSVGElement || element.classList.contains('mtc-badge-dot')) && box.width < 1) collapsed.add(label)
        if (box.top < bounds.top - 0.5 || box.bottom > bounds.bottom + 0.5
          || (style.overflowY !== 'visible' && element.scrollHeight > element.clientHeight + 1)) {
          cut.add(label)
          continue
        }
        if (style.overflowX === 'visible' || element.scrollWidth <= element.clientWidth + 1) continue
        const blockSpill = [...element.children].some(child => (
          !getComputedStyle(child).display.startsWith('inline') && child.getBoundingClientRect().right > box.right + 1
        ))
        if (style.textOverflow === 'ellipsis' && blockContainer.has(style.display) && !blockSpill) ellipsised.add(label)
        else cut.add(label)
      }
    }
    return { cut: [...cut], ellipsised: [...ellipsised], collapsed: [...collapsed] }
  })
}

// The reference pages never cut a value: on a desktop every value is
// whole (a grid too wide for its pane scrolls sideways instead), and on a
// phone a value may end in an ellipsis but is never cut.
for (const width of [1440, 390]) {
  test(`Page template grids show every value whole${width < 1440 ? ' or ellipsised' : ''} at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    for (const [name, id] of Object.entries(templateStories)) {
      await openStory(page, id)
      const fit = await gridValueFit(page)
      expect(fit.cut, `${name} cut values`).toEqual([])
      expect(fit.collapsed, `${name} collapsed marks`).toEqual([])
      if (width === 1440) expect(fit.ellipsised, `${name} values cut short`).toEqual([])
    }
  })
}

test('DataGrid ends a value it cuts short in an ellipsis and keeps it reachable', async ({ page }) => {
  const root = await openStory(page, stories.toolkitDataGridNarrow)
  const fit = await gridValueFit(page)
  expect(fit.cut).toEqual([])
  expect(fit.collapsed).toEqual([])
  // The story does cut values short: text columns giving way, and every
  // typed kind in columns set narrower than their values.
  expect(fit.ellipsised).toEqual(expect.arrayContaining([
    'Documents: quarterly-board-review-final.pdf',
    'Documents: finance/board/2026/q3/quarterly-board-review-final.pdf',
    'Documents: Signed by the audit committee',
    'Set widths: $1,284,500.25',
    'Set widths: Near quota',
    'Set widths: Naomie Park',
  ]))
  // A pointer gets the whole value as the cell's title.
  const note = root.getByRole('grid', { name: 'Documents' }).getByRole('gridcell', { name: 'Signed by the audit committee' })
  await note.hover()
  await expect(note).toHaveAttribute('title', 'Signed by the audit committee')
  const tags = root.getByRole('grid', { name: 'Set widths' }).getByRole('gridcell', { name: /^Finance/ })
  await tags.hover()
  await expect(tags).toHaveAttribute('title', 'Finance, Board, +1')
  // Keyboard focus shows it whole over the cell.
  await note.click()
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.mtc-data-grid-value-tip')).toHaveText('Signed by the audit committee')
})

// A record grid keeps every row on one line at any width: chips never wrap
// or give way (their columns keep their width and the grid scrolls), a list
// shows two chips and "+N", whose title names the rest, and text gives way
// only with an ellipsis.
test('RecordGrid keeps list and choice chips whole on one line at every width', async ({ page }) => {
  test.slow()
  for (const id of [stories.widgetRecordGrid, stories.widgetRecordGridLists]) {
    for (const width of [1440, 1100, 1000, 940, 880, 600, 390]) {
      await page.setViewportSize({ width, height: 800 })
      await openStory(page, id)
      const fit = await gridValueFit(page)
      expect(fit.cut, `${id} at ${width} px: cut values`).toEqual([])
      expect(fit.collapsed, `${id} at ${width} px: collapsed marks`).toEqual([])
      const shortChips = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(
        '#storybook-root [role="gridcell"] :is(.mtc-tag-label, .mtc-badge-label)',
      )].filter(label => label.scrollWidth > label.clientWidth + 1).map(label => label.textContent))
      expect(shortChips, `${id} at ${width} px: chips cut short`).toEqual([])
    }
  }
  const grid = page.getByRole('grid', { name: 'Work items' })
  const beacon = grid.getByRole('row', { name: /^Beacon inventory rollout/ })
  await expect(beacon.locator('.mtc-value-more')).toHaveText(['+2', '+1'])
  await expect(beacon.locator('.mtc-value-more').first()).toHaveAttribute('title', '2 more: Legal hold, Renewal')
  await expect(beacon.locator('.mtc-value-more').last()).toHaveAttribute('title', '1 more: Noah Williams')
})

// Every editor the record grid opens, in each row density. One-line
// controls (text, a choice, a user, a number, a date, a date and time,
// Yes/No) edit in their cell; a list of choices and long text are taller
// than a row and open in a dialog over the cell. The whole control and
// every focus ring in the editor must be inside the visible area (the
// window, cut by every clipping box above it), the editor's controls hold
// the tab stop and their own keys, Escape cancels, and focus returns to the
// cell. While a save is pending (the story's backend never answers) each
// editor shows the value, read-only, in place of its field, and that fits
// too.
const RECORD_EDITORS = [
  { column: 'name', label: 'Work item', layout: 'inline' },
  { column: 'stage', label: 'Stage', layout: 'inline' },
  { column: 'owner', label: 'Owner', layout: 'inline' },
  { column: 'value', label: 'Value', layout: 'inline' },
  { column: 'due_date', label: 'Due', layout: 'inline' },
  { column: 'review_at', label: 'Review', layout: 'inline' },
  { column: 'completed', label: 'Complete', layout: 'inline' },
  { column: 'tags', label: 'Tags', layout: 'overlay' },
  { column: 'reviewers', label: 'Reviewers', layout: 'overlay' },
  { column: 'notes', label: 'Notes', layout: 'overlay' },
] as const

async function recordEditorFit(page: Page, column: string) {
  return page.evaluate(column => {
    const cell = document.querySelector<HTMLElement>(`#storybook-root [data-row-index="1"] [data-column-id="${column}"]`)!
    const dialog = document.querySelector<HTMLElement>('.mtc-data-grid-overlay-editor')
    const editor = (dialog ?? cell).querySelector<HTMLElement>('.mtc-data-grid-editor')!
    // The field, the Yes/No box, or the value shown while a save is pending.
    const control = editor.firstElementChild as HTMLElement
    const active = document.activeElement
    const focused = active instanceof HTMLElement && editor.contains(active) ? active : null
    type Box = { left: number; top: number; right: number; bottom: number }
    // An element's clip edge is its padding box.
    const paddingBox = (element: Element): Box => {
      const rect = element.getBoundingClientRect()
      const left = rect.left + element.clientLeft
      const top = rect.top + element.clientTop
      return { left, top, right: left + element.clientWidth, bottom: top + element.clientHeight }
    }
    const windowBox = (): Box => ({
      left: 0, top: 0, right: document.documentElement.clientWidth, bottom: document.documentElement.clientHeight,
    })
    const visibleArea = (element: Element): Box => {
      const view = windowBox()
      for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent)
        if (style.overflowX === 'visible' && style.overflowY === 'visible') continue
        const edge = paddingBox(parent)
        view.left = Math.max(view.left, edge.left)
        view.top = Math.max(view.top, edge.top)
        view.right = Math.min(view.right, edge.right)
        view.bottom = Math.min(view.bottom, edge.bottom)
      }
      return view
    }
    // Layout positions are exact to 1/64 px, so half a pixel outside (a
    // control 1 px taller than its row, centred) is outside.
    const inside = (box: Box, view: Box) => box.left >= view.left - 0.1 && box.top >= view.top - 0.1
      && box.right <= view.right + 0.1 && box.bottom <= view.bottom + 0.1
    let ringInView: boolean | null = null
    let outline: string | null = null
    if (focused) {
      // The ring's outer edge: its width plus its offset from the border box
      // (a negative offset draws it inside the control).
      const style = getComputedStyle(focused)
      outline = style.outlineStyle
      const reach = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset)
      const box = focused.getBoundingClientRect()
      ringInView = inside({ left: box.left - reach, top: box.top - reach, right: box.right + reach, bottom: box.bottom + reach }, visibleArea(focused))
    }
    // The pending value is whole: nothing in it is cut or outside the view.
    const valueWhole = control.tagName === 'DIV'
      ? control.scrollHeight <= control.clientHeight + 1 && control.scrollWidth <= control.clientWidth + 1
        && [...control.querySelectorAll('*')].every(element => inside(element.getBoundingClientRect(), visibleArea(element)))
      : null
    const cellRect = cell.getBoundingClientRect()
    const editorBox = editor.getBoundingClientRect()
    const controlBox = control.getBoundingClientRect()
    const fit = {
      layout: dialog ? 'overlay' : 'inline',
      focused: focused?.getAttribute('aria-label') ?? focused?.tagName.toLowerCase() ?? null,
      outline,
      controlHeight: Math.round(controlBox.height),
      controlInView: inside(controlBox, visibleArea(control)),
      ringInView,
      valueWhole,
    }
    if (dialog) {
      // Anchored over the cell: at its top, covering it (moved left only as
      // far as the window's edge asks), inside the window.
      const box = dialog.getBoundingClientRect()
      return {
        ...fit,
        overCell: Math.abs(box.top - cellRect.top) <= 1 && box.left <= cellRect.left + 1
          && box.right >= Math.min(cellRect.right, windowBox().right - 8) - 1,
        inWindow: inside(box, windowBox()),
      }
    }
    const cellStyle = getComputedStyle(cell)
    const cellBox = paddingBox(cell)
    const content = {
      left: cellBox.left + parseFloat(cellStyle.paddingLeft),
      right: cellBox.right - parseFloat(cellStyle.paddingRight),
    }
    const buttons = [...editor.querySelectorAll(':scope > button')].map(button => button.getBoundingClientRect())
    return {
      ...fit,
      editorFillsCell: Math.abs(editorBox.left - content.left) <= 1 && Math.abs(editorBox.right - content.right) <= 1,
      controlTakesTheRest: Math.abs(controlBox.right + parseFloat(getComputedStyle(editor).columnGap) - buttons[0]!.left) <= 1,
      buttonsAtTheEnd: Math.abs(buttons.at(-1)!.right - content.right) <= 1,
    }
  }, column)
}

for (const density of ['standard', 'compact'] as const) {
  test(`RecordGrid shows every editor whole with its focus rings in view (${density})`, async ({ page }) => {
    test.slow()
    const root = await openStory(page, stories.widgetRecordGridEditing, { density })
    const grid = root.getByRole('grid', { name: 'Work items' })
    const cellOf = (column: string) => grid.locator(`[data-row-index="1"] [data-column-id="${column}"]`)
    const dialog = page.getByRole('dialog')
    // The story opened the first record's title; Escape closes it and
    // focus returns to its cell.
    await expect(grid.getByRole('textbox', { name: 'Work item' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(grid.getByRole('textbox')).toHaveCount(0)
    await expect(grid.locator('[data-cell="0:0"]')).toBeFocused()

    for (const { column, label, layout } of RECORD_EDITORS) {
      // F2 from the keyboard, so every focus ring shows.
      const cell = cellOf(column)
      await cell.focus()
      await page.keyboard.press('F2')
      const saveName = `Save ${label}`
      if (layout === 'overlay') await expect(dialog).toHaveAccessibleName(`Edit ${label}`)
      else await expect(dialog).toHaveCount(0)
      const field = await recordEditorFit(page, column)
      expect(field, `${label}: ${JSON.stringify(field)}`).toMatchObject({
        layout, focused: label, controlInView: true, ringInView: true,
        ...(layout === 'overlay'
          ? { overCell: true, inWindow: true }
          : { editorFillsCell: true, controlTakesTheRest: true, buttonsAtTheEnd: true }),
      })
      expect(field.outline, label).not.toBe('none')
      if (layout === 'inline') {
        // The editor's controls are the grid's tab stop while it is open.
        await expect(grid.locator('[tabindex="0"]')).toHaveCount(0)
        for (const name of [saveName, 'Cancel edit']) {
          // Tab in a date field first steps through its parts.
          await expect(async () => {
            await page.keyboard.press('Tab')
            await expect(root.getByRole('button', { name })).toBeFocused({ timeout: 100 })
          }).toPass({ timeout: 5_000 })
          const button = await recordEditorFit(page, column)
          expect(button, `${label}, ${name}: ${JSON.stringify(button)}`).toMatchObject({ outline: 'solid', ringInView: true })
        }
        // Enter presses Cancel (the grid leaves the editor's keys to it),
        // and Escape on a button closes the editor too.
        await page.keyboard.press(column === 'name' ? 'Enter' : 'Escape')
      } else {
        // Tab stays inside the dialog: Cancel, Save, then the field again.
        for (const name of ['Cancel edit', saveName]) {
          await page.keyboard.press('Tab')
          await expect(dialog.getByRole('button', { name })).toBeFocused()
          const button = await recordEditorFit(page, column)
          expect(button, `${label}, ${name}: ${JSON.stringify(button)}`).toMatchObject({ outline: 'solid', ringInView: true })
        }
        await page.keyboard.press('Tab')
        await expect(page.getByLabel(label, { exact: true })).toBeFocused()
        await page.keyboard.press('Shift+Tab')
        await expect(dialog.getByRole('button', { name: saveName })).toBeFocused()
        await page.keyboard.press('Escape')
        await expect(dialog).toHaveCount(0)
      }
      await expect(cell).toBeFocused()
      await expect(grid.locator('[tabindex="0"]')).toHaveCount(1)
    }

    // A press outside the dialog cancels it.
    await cellOf('tags').focus()
    await page.keyboard.press('F2')
    await expect(dialog).toHaveCount(1)
    await root.getByRole('searchbox').click()
    await expect(dialog).toHaveCount(0)
    await expect(root.getByRole('searchbox')).toBeFocused()

    // Long text: Shift+Enter adds a line, Enter saves. The save stays
    // pending, and the dialog shows the value in place of the field.
    await cellOf('notes').focus()
    await page.keyboard.press('F2')
    const notes = dialog.getByRole('textbox', { name: 'Notes' })
    await expect(notes).toBeFocused()
    await expect(notes).toHaveAccessibleDescription('Shift+Enter adds a line')
    await page.keyboard.press('Control+End')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('Owner signed off.')
    await expect(notes).toHaveValue('Kickoff done. Waiting on the product feed export.\nOwner signed off.')
    await page.keyboard.press('Enter')
    await expect(notes).toHaveCount(0)
    await expect(dialog.getByRole('button', { name: 'Save Notes' })).toBeDisabled()
    const pendingNotes = await recordEditorFit(page, 'notes')
    expect(pendingNotes, JSON.stringify(pendingNotes)).toMatchObject({ controlInView: true, valueWhole: true, overCell: true })
    await dialog.getByRole('button', { name: 'Cancel edit' }).click()
    await expect(dialog).toHaveCount(0)
    await expect(cellOf('notes')).toBeFocused()

    // Every editor while that save is pending: the value fits the row, or
    // the dialog.
    for (const { column, label, layout } of RECORD_EDITORS) {
      await cellOf(column).focus()
      await page.keyboard.press('F2')
      await expect(page.getByRole('button', { name: `Save ${label}` })).toBeDisabled()
      const pending = await recordEditorFit(page, column)
      expect(pending, `${label} pending: ${JSON.stringify(pending)}`).toMatchObject({ layout, controlInView: true, valueWhole: true })
      await page.getByRole('button', { name: 'Cancel edit' }).click()
      await expect(page.getByRole('button', { name: 'Cancel edit' })).toHaveCount(0)
      await expect(cellOf(column)).toBeFocused()
    }
  })
}

test('DataGrid keeps ten thousand rows under 1,500 DOM nodes at every scroll offset', async ({ page }) => {
  const root = await openStory(page, stories.toolkitDataGridLarge)
  const grid = root.getByRole('grid', { name: 'Event log' })
  await expect(grid).toHaveAttribute('aria-rowcount', '10001')
  for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
    await grid.evaluate((element, share) => {
      element.scrollTop = (element.scrollHeight - element.clientHeight) * share
    }, fraction)
    await expect.poll(() => grid.evaluate(element => element.querySelectorAll('*').length)).toBeLessThan(1500)
  }
  await expect(grid.locator('[aria-rowindex="10001"]')).toBeVisible()
})

test('DataGrid moves one tab stop with the arrow keys and selects with Space', async ({ page }) => {
  const root = await openStory(page, stories.toolkitDataGridLarge)
  const grid = root.getByRole('grid', { name: 'Event log' })
  // The story's own play ends back on the first cell with Ctrl+Home.
  await expect(grid.locator('[data-cell="0:0"]')).toBeFocused()
  await grid.locator('[data-cell="2:1"]').click()
  await expect(grid.locator('[data-cell="2:1"]')).toBeFocused()
  await expect(grid.locator('[tabindex="0"]')).toHaveCount(1)
  await page.keyboard.press('PageDown')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Space')
  await expect(grid.locator(':focus')).toHaveAttribute('data-cell', /^(?:[1-9]\d+):2$/)
  await expect(grid.locator('[role="row"][aria-selected="true"]')).toHaveCount(1)
  await page.keyboard.press('Tab')
  await expect(grid.locator(':focus')).toHaveCount(0)
})

test('Database table viewer controls visible columns, sorting, paging, and row inspection', async ({ page }) => {
  const root = await openStory(page, stories.toolkitTableViewer)

  await root.getByRole('button', { name: 'Choose visible columns' }).click()
  const city = root.getByRole('checkbox', { name: /city/i })
  await city.uncheck()
  await expect(root.getByRole('columnheader', { name: 'city' })).toHaveCount(0)
  await page.keyboard.press('Escape')

  await root.getByRole('button', { name: 'legal_name' }).click()
  await expect(root.getByRole('columnheader', { name: 'legal_name' })).toHaveAttribute(
    'aria-sort',
    'ascending',
  )

  await root.getByRole('button', { name: 'Next row page' }).click()
  await expect(root.getByText('Page 2 of 2')).toBeVisible()

  const filter = root.getByRole('searchbox', { name: 'Filter table rows' })
  await filter.fill('northwind')
  await root.getByRole('button', { name: 'Inspect row Northwind Health' }).click()
  await expect(root.getByRole('heading', { name: 'Northwind Health' })).toBeVisible()
})

for (const [name, id] of Object.entries({ ...toolkitStories, ...templateStories })) {
  test(`${name} mobile layout stays within the viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const root = await openStory(page, id)
    const dimensions = await root.evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
  })
}

for (const [name, id] of Object.entries(cloneStories)) {
  test(`${name} mobile layout stays within the viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    const root = await openStory(page, id)
    const dimensions = await root.evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
  })
}

// Product-faithful clones carry their own authored styles and ignore the
// theme global: one dark baseline each, named after the story.
for (const [name, id] of Object.entries({
  ...cloneStories,
  githubFiles: stories.githubFiles,
  githubChecks: stories.githubChecks,
  gitlabChanges: stories.gitlabChanges,
  gitlabPipeline: stories.gitlabPipeline,
})) {
  test(`${name} visual baseline`, async ({ page }) => {
    const root = await openStory(page, id, { pinClock: true })
    await expectBaseline(root, name)
  })
}

for (const name of themeInvariantToolkitStories) {
  test(`${name} visual baseline`, async ({ page }) => {
    const root = await openStory(page, toolkitStories[name], { pinClock: true })
    await expectBaseline(root, name)
  })
}

// Density matters for these surfaces: they also keep a compact baseline in
// each theme, `${story}-${theme}-compact.png`, beside the standard one. The
// compact text must equal the standard text snapshot.
const compactToolkitStories = [
  'toolkitPropertyPanel',
  'toolkitDataGrid',
] as const satisfies readonly (keyof typeof toolkitStories)[]

for (const theme of ['dark', 'light'] as const) {
  for (const name of compactToolkitStories) {
    test(`${name} ${theme} compact visual baseline`, async ({ page }) => {
      const root = await openStory(page, toolkitStories[name], { theme, density: 'compact', pinClock: true })
      await expect(root).toHaveScreenshot(`${name}-${theme}-compact.png`)
      await expectAriaBaseline(root, name)
    })
  }
}

// Full-page surfaces also keep a phone baseline in each theme,
// `${story}-${theme}-mobile.png` at 390 × 844, beside the desktop one.
const mobileBaselineStories = {
  toolkitShell: toolkitStories.toolkitShell,
  toolkitObjectPage: toolkitStories.toolkitObjectPage,
  ...templateStories,
}

for (const theme of ['dark', 'light'] as const) {
  for (const [name, id] of Object.entries(mobileBaselineStories)) {
    test(`${name} ${theme} mobile visual baseline`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 })
      const root = await openStory(page, id, { theme, pinClock: true })
      await expect(page).toHaveScreenshot(`${name}-${theme}-mobile.png`)
      await expectAriaBaseline(root, `${name}-mobile`)
    })
  }
}

// Themed surfaces: `${story}-${theme}.png` in dark and light. The text must
// not change with the theme, so both themes compare their accessibility
// tree with the one `${story}.yml`.
for (const theme of ['dark', 'light'] as const) {
  for (const [name, id] of [...themedToolkitStories, ['readiness', stories.readiness] as const]) {
    test(`${name} ${theme} visual baseline`, async ({ page }) => {
      const root = await openStory(page, id, { theme, pinClock: true })
      await expect(root).toHaveScreenshot(`${name}-${theme}.png`)
      await expectAriaBaseline(root, name)
    })
  }
}

for (const theme of ['dark', 'light'] as const) {
  test(`navigation keeps its width with long labels and vertical scrolling in ${theme}`, async ({ page }) => {
    const root = await openStory(page, 'toolkit-app-productshell--long-navigation', { theme })
    const rail = root.getByRole('navigation', { name: 'Product navigation' })
    const lastName = 'destination-39-with-a-long-unbroken-name'
    const checkRail = async (nav: Locator) => {
      const scroller = nav.locator('.mtc-nav-rail-sections')
      await expect.poll(() => scroller.evaluate(element => element.scrollWidth - element.clientWidth)).toBe(0)
      expect(await scroller.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true)
      const last = nav.getByRole('link', { name: lastName })
      await last.focus()
      await expect(last).toBeFocused()
      await expect(last).toBeInViewport()
      const bounds = await last.evaluate(element => {
        const item = element.getBoundingClientRect()
        const scroll = element.closest('.mtc-nav-rail-sections')!.getBoundingClientRect()
        return { left: item.left - scroll.left, right: scroll.right - item.right }
      })
      expect(bounds.left).toBeGreaterThanOrEqual(0)
      expect(bounds.right).toBeGreaterThanOrEqual(0)
      expect(await scroller.evaluate(element => element.scrollLeft)).toBe(0)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
    }
    for (const width of [1440, 820]) {
      await page.setViewportSize({ width, height: 700 })
      await checkRail(rail)
      const toggle = rail.getByRole('button', { name: 'Collapse navigation' })
      await toggle.focus()
      await page.keyboard.press('Enter')
      await expect(rail).toHaveAttribute('data-collapsed', 'true')
      await expect(rail.getByRole('button', { name: 'Expand navigation' })).toBeFocused()
      await checkRail(rail)
      await rail.getByRole('button', { name: 'Expand navigation' }).click()
      await expect(rail).not.toHaveAttribute('data-collapsed')
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(rail).toBeHidden()
    const open = root.getByRole('button', { name: 'Open navigation' })
    await open.click()
    const dialog = page.getByRole('dialog')
    await checkRail(dialog.getByRole('navigation', { name: 'Product navigation' }))
    const accessibility = await new AxeBuilder({ page }).include('[role="dialog"]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(accessibility.violations).toEqual([])
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(open).toBeFocused()
  })
}

for (const theme of ['dark', 'light'] as const) {
  test(`table occurrence selection survives sort filter and page in ${theme}`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await openStory(page, 'widgets-datatable--row-identity', { theme })
    const grid = page.getByRole('grid', { name: 'Table data' })
    const row = (id: string) => grid.getByRole('row').filter({ has: page.getByRole('gridcell', { name: id, exact: true }) })
    const context = page.getByLabel('Selected row context')
    await row('run-2').click()
    await expect(context).toHaveText('run-2')
    await expect(row('run-2')).toHaveAttribute('aria-selected', 'true')
    await expect(row('run-1')).toHaveAttribute('aria-selected', 'false')
    await grid.getByRole('columnheader', { name: 'Rank' }).click()
    await expect(row('run-2')).toHaveAttribute('aria-selected', 'true')
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(grid.locator('[aria-selected="true"]')).toHaveCount(0)
    await page.getByRole('button', { name: 'Previous', exact: true }).click()
    await expect(row('run-2')).toHaveAttribute('aria-selected', 'true')
    await page.getByRole('searchbox', { name: 'Filter rows' }).fill('run-4')
    await row('run-4').click()
    await expect(context).toHaveText('run-4')
    await page.getByRole('searchbox', { name: 'Filter rows' }).fill('')
    await expect(row('run-4')).toHaveAttribute('aria-selected', 'true')
    await page.getByRole('button', { name: 'Refresh rows' }).click()
    await expect(context).toHaveText('run-4')
    await expect(row('run-4')).toHaveAttribute('aria-selected', 'true')
    expect(errors).toEqual([])
  })

  test(`table refresh never guesses duplicate context identity in ${theme}`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await openStory(page, 'widgets-datatable--row-identity', { theme })
    const grid = page.getByRole('grid', { name: 'Table data' })
    const context = page.getByLabel('Selected row context')
    await page.getByRole('button', { name: 'Duplicate context values' }).click()
    const dataRows = grid.locator('[data-row-index]')
    await dataRows.nth(1).click()
    await expect(context).toHaveText('shared')
    await expect(dataRows.nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect(dataRows.nth(0)).toHaveAttribute('aria-selected', 'false')
    await page.getByRole('searchbox', { name: 'Filter rows' }).fill('2')
    await expect(grid.locator('[aria-selected="true"]')).toHaveCount(1)
    await page.getByRole('button', { name: 'Refresh rows' }).click()
    await expect(context).toHaveText('shared')
    // Only one duplicate is visible, but uniqueness is checked across all rows.
    await expect(dataRows).toHaveCount(1)
    await expect(grid.locator('[aria-selected="true"]')).toHaveCount(0)
    await page.getByRole('searchbox', { name: 'Filter rows' }).fill('')
    await page.getByRole('button', { name: 'External context' }).click()
    await expect(context).toHaveText('different')
    await expect(grid.getByRole('row').filter({ hasText: 'different' })).toHaveAttribute('aria-selected', 'true')
    await page.getByRole('button', { name: 'Repeated object' }).click()
    await dataRows.nth(1).click()
    await expect(context).toHaveText('shared')
    await expect(dataRows.nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect(dataRows.nth(0)).toHaveAttribute('aria-selected', 'false')
    expect(errors).toEqual([])
  })

  test(`table flashes require unambiguous scalar identity in ${theme}`, async ({ page }) => {
    await openStory(page, 'widgets-datatable--flash-identity', { theme })
    await page.clock.install()
    const grid = page.getByRole('grid', { name: 'Table data' })
    const dataRows = grid.locator('[data-row-index]')
    await page.getByRole('button', { name: 'Advance values' }).click()
    await expect(dataRows.nth(0)).toHaveAttribute('data-flash', 'up')
    await expect(dataRows.nth(1)).not.toHaveAttribute('data-flash')
    await expect(dataRows.nth(2)).not.toHaveAttribute('data-flash')
    await expect(dataRows.nth(3)).toHaveAttribute('data-flash', 'up')
    await expect(dataRows.nth(4)).toHaveAttribute('data-flash', 'up')
    await expect(dataRows.nth(5)).not.toHaveAttribute('data-flash')
    await page.getByRole('button', { name: 'Resolve duplicate' }).click()
    await expect(dataRows.nth(1)).not.toHaveAttribute('data-flash')
    await page.getByRole('button', { name: 'Advance values' }).click()
    await expect(dataRows.nth(1)).toHaveAttribute('data-flash', 'up')
    await page.getByRole('button', { name: 'Duplicate unique' }).click()
    const ambiguous = dataRows.filter({ has: page.getByRole('gridcell', { name: 'unique', exact: true }) })
    await expect(ambiguous).toHaveCount(2)
    await expect(ambiguous.nth(0)).not.toHaveAttribute('data-flash')
    await expect(ambiguous.nth(1)).not.toHaveAttribute('data-flash')
    await expect(grid.locator('[data-flash]')).toHaveCount(3)
    await page.getByRole('button', { name: 'Remove unique' }).click()
    await page.getByRole('button', { name: 'Restore unique' }).click()
    await expect(dataRows.nth(0)).not.toHaveAttribute('data-flash')
    await page.clock.fastForward(601)
    await expect(grid.locator('[data-flash]')).toHaveCount(0)
    await page.getByRole('button', { name: 'Advance values' }).click()
    await expect(dataRows.nth(0)).toHaveAttribute('data-flash', 'up')
    await page.getByRole('button', { name: 'Toggle flashes' }).click()
    await expect(grid.locator('[data-flash]')).toHaveCount(0)
  })
}
