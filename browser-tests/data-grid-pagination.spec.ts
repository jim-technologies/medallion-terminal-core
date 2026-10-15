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
