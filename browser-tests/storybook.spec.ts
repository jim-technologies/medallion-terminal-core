import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const stories = {
  dashboard: 'core-dashboard--full-demo',
  palantir: 'clones-palantir-foundry-foundation--platform-readiness',
  drive: 'clones-google-drive--my-drive',
  photos: 'clones-google-photos--photo-timeline',
  docs: 'clones-google-docs--operating-plan',
  spotify: 'clones-spotify--personalized-home',
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

for (const [name, id] of Object.entries({
  palantir: stories.palantir,
  drive: stories.drive,
  photos: stories.photos,
  docs: stories.docs,
  spotify: stories.spotify,
  readiness: stories.readiness,
})) {
  test(`${name} visual baseline`, async ({ page }) => {
    const root = await openStory(page, id)
    await expect(root).toHaveScreenshot(`${name}.png`)
  })
}
