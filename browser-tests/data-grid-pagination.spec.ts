import { writeFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

for (const width of [1440, 390]) {
  test(`only a bounded grid pages as rows enter its viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 })
    await page.goto('/iframe.html?id=toolkit-workbench-datagrid--pagination-viewports&viewMode=story')
    const auto = page.getByRole('grid', { name: 'Content-sized rows', exact: true })
    const unbounded = page.getByRole('grid', { name: 'Unbounded parent rows', exact: true })
    const bounded = page.getByRole('grid', { name: 'Bounded rows', exact: true })
    const boundedParent = page.getByRole('grid', { name: 'Bounded parent rows', exact: true })
    const capped = page.getByRole('grid', { name: 'Capped content rows', exact: true })
    const footer = (grid: typeof auto) => grid.locator('..').locator('.mtc-data-grid-footer')

    for (const grid of [bounded, boundedParent]) {
      await expect(footer(grid)).toHaveText('44 loaded; 1 requests')
      expect(await grid.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0)
    }
    await page.evaluate(() => new Promise<void>(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    }))
    await expect(footer(auto)).toHaveText('40 loaded; 0 requests')
    await expect(footer(unbounded)).toHaveText('40 loaded; 0 requests')
    await expect(footer(capped)).toHaveText('40 loaded; 0 requests')
    expect(await capped.evaluate(element => element.clientHeight)).toBeGreaterThan(0)
    expect(await capped.locator('..').evaluate(element => element.clientHeight)).toBeLessThanOrEqual(576)
    expect(await capped.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0)

    for (const grid of [bounded, boundedParent]) {
      await grid.evaluate(element => { element.scrollTop = element.scrollHeight })
      await expect(footer(grid)).toHaveText('84 loaded; 2 requests')
      await page.evaluate(() => new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      }))
      await expect(footer(grid)).toHaveText('84 loaded; 2 requests')
      expect(await grid.locator('.mtc-data-grid-body [role="row"]').count()).toBeLessThan(35)
    }
    for (let next = 1; next <= 2; next++) {
      await capped.evaluate(element => { element.scrollTop = element.scrollHeight })
      await expect(footer(capped)).toHaveText(`${40 + next * 40} loaded; ${next} requests`)
      await page.evaluate(() => new Promise<void>(resolve => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      }))
      await expect(footer(capped)).toHaveText(`${40 + next * 40} loaded; ${next} requests`)
      const rows = capped.locator('.mtc-data-grid-body [role="row"]')
      const rendered = await rows.count()
      const rowHeight = await rows.first().evaluate(element => element.getBoundingClientRect().height)
      const viewportHeight = await capped.evaluate(element => element.clientHeight)
      expect(rowHeight).toBeGreaterThan(0)
      expect(rendered).toBeGreaterThan(0)
      // The window includes a partial edge row and the retained active row.
      expect(rendered).toBeLessThanOrEqual(Math.ceil(viewportHeight / rowHeight) + 2 * 8 + 2)
      expect(rendered).toBeLessThan(40 + next * 40)
    }
    await expect(footer(auto)).toHaveText('40 loaded; 0 requests')
    await expect(footer(unbounded)).toHaveText('40 loaded; 0 requests')
  })
}

test('a fractionally sized bounded grid loads the next page', async ({ page }, testInfo) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--fractional-paging&viewMode=story')
  const grid = page.getByRole('grid', { name: 'Fractional bounded rows', exact: true })
  const footer = grid.locator('..').locator('.mtc-data-grid-footer')
  await expect(footer).toHaveText('6000 loaded; 0 requests')
  await grid.evaluate(element => { element.scrollTop = element.scrollHeight })
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
  const geometry = await grid.evaluate(element => {
    const before = { clientHeight: element.clientHeight, rectHeight: element.getBoundingClientRect().height, scrollTop: element.scrollTop, scrollHeight: element.scrollHeight }
    const prior = element.style.getPropertyValue('flex-basis')
    const priority = element.style.getPropertyPriority('flex-basis')
    let during: { clientHeight: number; rectHeight: number }
    try {
      element.style.setProperty('flex-basis', `${element.scrollHeight + element.clientHeight}px`)
      during = { clientHeight: element.clientHeight, rectHeight: element.getBoundingClientRect().height }
    } finally {
      if (prior) element.style.setProperty('flex-basis', prior, priority)
      else element.style.removeProperty('flex-basis')
    }
    return { before, during, strictBounded: during.clientHeight <= before.clientHeight }
  })
  const path = testInfo.outputPath('fractional-paging-geometry.json')
  await writeFile(path, JSON.stringify(geometry, null, 2))
  await testInfo.attach('fractional-paging-geometry', { path, contentType: 'application/json' })
  await expect(footer).toHaveText('6200 loaded; 1 requests')
})

test('a reused grid pages a new scrollKey at the same initial row count', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--paging-across-listings&viewMode=story')
  const first = page.getByRole('grid', { name: 'Paged finance rows', exact: true })
  await first.evaluate(element => { element.scrollTop = element.scrollHeight })
  await expect(first.locator('..').locator('.mtc-data-grid-footer')).toHaveText('80 loaded; 1 requests')
  await page.getByRole('button', { name: 'Switch listing' }).click()
  const next = page.getByRole('grid', { name: 'Paged media rows', exact: true })
  await expect(next.locator('..').locator('.mtc-data-grid-footer')).toHaveText('40 loaded; 0 requests')
  await expect.poll(() => next.evaluate(element => element.scrollTop)).toBe(0)
  await next.evaluate(element => { element.scrollTop = element.scrollHeight })
  await expect(next.locator('..').locator('.mtc-data-grid-footer')).toHaveText('80 loaded; 1 requests')
})

test('a first-page generation can retry without automatic error retries or scroll reset', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--paging-generations&viewMode=story')
  const grid = page.getByRole('grid', { name: 'Generation rows', exact: true })
  const footer = grid.locator('..').locator('.mtc-data-grid-footer')
  await grid.evaluate(element => { element.scrollTop = element.scrollHeight })
  await expect(page.getByRole('alert')).toHaveText('The second page failed')
  await expect(page.getByRole('status')).toHaveText('1 attempts; 0 rerenders')
  await page.getByRole('button', { name: 'Render same first page' }).click()
  for (let i = 0; i < 3; i++) {
    await grid.evaluate(element => { element.scrollTop = element.scrollHeight })
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
  }
  await expect(page.getByRole('status')).toHaveText('1 attempts; 1 rerenders')
  const scroll = await grid.evaluate(element => element.scrollTop)
  await page.getByRole('button', { name: 'Retry first page' }).click()
  await expect(footer).toHaveText('80 loaded')
  await expect(page.getByRole('status')).toHaveText('2 attempts; 1 rerenders')
  await expect(page.getByRole('alert')).toHaveCount(0)
  expect(Math.abs(await grid.evaluate(element => element.scrollTop) - scroll)).toBeLessThanOrEqual(1)
})

test('StrictMode asks once for an initially short page', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--strict-mode-paging&viewMode=story')
  const grid = page.getByRole('grid', { name: 'StrictMode rows', exact: true })
  const footer = grid.locator('..').locator('.mtc-data-grid-footer')
  await expect(footer).toHaveText('44 loaded; 1 requests')
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
  await expect(footer).toHaveText('44 loaded; 1 requests')
})

test('a paging probe restores inline declarations and their priorities', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--paging-across-listings&viewMode=story')
  const grid = page.getByRole('grid', { name: 'Paged finance rows', exact: true })
  const previousStyle = await grid.evaluate(element => {
    element.style.setProperty('flex-basis', '100px', 'important')
    element.style.setProperty('--probe-control', 'preserved', 'important')
    element.scrollTop = element.scrollHeight
    return element.style.cssText
  })
  await expect(grid.locator('..').locator('.mtc-data-grid-footer')).toHaveText('80 loaded; 1 requests')
  expect(await grid.evaluate(element => ({ value: element.style.getPropertyValue('flex-basis'), priority: element.style.getPropertyPriority('flex-basis') })))
    .toEqual({ value: '100px', priority: 'important' })
  expect(await grid.evaluate(element => element.style.cssText)).toBe(previousStyle)
})
