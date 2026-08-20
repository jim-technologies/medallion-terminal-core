import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

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
  toolkitNarrowPane: 'toolkit-workbench-primitives--narrow-stacked-pane',
  toolkitObjectWorkbench: 'toolkit-compositions-workbenches--object-workbench-composition',
  toolkitModelWorkbench: 'toolkit-compositions-workbenches--model-workbench-composition',
  toolkitDatabase: 'toolkit-compositions-workbenches--database-like-data-workbench',
  toolkitTableViewer: 'toolkit-compositions-workbenches--database-table-viewer',
  toolkitScopedRegistry: 'toolkit-integration-hostbridge--scoped-widget-registry',
  toolkitHostIntent: 'toolkit-integration-hostbridge--host-intent-emission',
} as const

const stories = {
  dashboard: 'core-dashboard--full-demo',
  ...cloneStories,
  ...toolkitStories,
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

async function openStory(page: Page, id: string) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`/iframe.html?id=${id}&viewMode=story`)
  await page.locator('#storybook-root').waitFor({ state: 'visible' })
  await page.waitForLoadState('networkidle')
  expect(errors, `browser errors in ${id}`).toEqual([])
  return page.locator('#storybook-root')
}

for (const [name, id] of Object.entries(stories)) {
  test(`${name} has no automated accessibility violations`, async ({ page }) => {
    await openStory(page, id)
    const results = await new AxeBuilder({ page })
      .include('#storybook-root')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze()
    expect(results.violations).toEqual([])
  })
}

test('Google Drive supports search and layout switching', async ({ page }) => {
  const root = await openStory(page, stories.drive)
  const search = page.getByRole('textbox', { name: 'Search in Drive' })
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
  await root.getByRole('searchbox', { name: 'Search Instagram' }).fill('quiet')
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
  const feedNavigation = root.getByRole('navigation', { name: 'Threads feed' })
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

  await scenario.selectOption('empty')
  await expect(root.getByText('valid empty result')).toBeVisible()

  await scenario.selectOption('rate_limited')
  await expect(root.getByText('HTTP 429')).toBeVisible()

  await scenario.selectOption('unavailable')
  await expect(root.getByText('HTTP 503')).toBeVisible()

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
    const root = await openStory(page, stories.dashboard)
    const dimensions = await root.evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }))
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1)
    await expect(page).toHaveScreenshot(`dashboard-${viewport.name}.png`)
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

for (const [name, id] of Object.entries(toolkitStories)) {
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

for (const [name, id] of Object.entries({
  ...cloneStories,
  githubFiles: stories.githubFiles,
  githubChecks: stories.githubChecks,
  gitlabChanges: stories.gitlabChanges,
  gitlabPipeline: stories.gitlabPipeline,
  toolkitThemes: stories.toolkitThemes,
  toolkitButtons: stories.toolkitButtons,
  toolkitTabs: stories.toolkitTabs,
  toolkitAppSurface: stories.toolkitAppSurface,
  toolkitObjectWorkbench: stories.toolkitObjectWorkbench,
  toolkitDatabase: stories.toolkitDatabase,
  toolkitTableViewer: stories.toolkitTableViewer,
  readiness: stories.readiness,
})) {
  test(`${name} visual baseline`, async ({ page }) => {
    const root = await openStory(page, id)
    await expect(root).toHaveScreenshot(`${name}.png`)
  })
}
