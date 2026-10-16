import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

async function openGrid(page: Page, args = '', theme = 'dark') {
  await page.goto(`/iframe.html?id=toolkit-workbench-datagrid--scroll-ownership&viewMode=story&globals=theme:${theme}&args=${args}`)
  const grid = page.getByRole('grid', { name: 'Scroll ownership rows' })
  await expect(grid).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  return grid
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 2560, height: 1440 }, { width: 390, height: 844 }]) {
  for (const theme of ['dark', 'light']) {
    for (const gesture of ['wheel', 'trackpad', 'horizontal']) test(`content-sized grid routes ${gesture} at ${viewport.width}px in ${theme}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport)
      const grid = await openGrid(page, 'count:50', theme)
      expect(await grid.evaluate(element => element.scrollWidth - element.clientWidth)).toBeGreaterThan(0)
      expect(await grid.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0)
      const box = (await grid.boundingBox())!
      await page.mouse.move(box.x + Math.min(300, box.width / 2), Math.min(box.y + 100, viewport.height - 50))
      if (gesture === 'horizontal') {
        await page.mouse.wheel(400, 0)
        await expect.poll(() => grid.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)
        expect(await page.evaluate(() => window.scrollY)).toBe(0)
      } else {
        if (gesture === 'wheel') await page.mouse.wheel(0, 600)
        else for (let i = 0; i < 12; i++) await page.mouse.wheel(0, 8)
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(gesture === 'wheel' ? 100 : 20)
        expect(await grid.evaluate(element => element.scrollTop)).toBe(0)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
      await page.screenshot({ path: testInfo.outputPath(`scroll-${gesture}-${theme}-${viewport.width}.png`) })
    })
  }
}

test('bounded grid owns wheel scrolling and contains its edges', async ({ page }) => {
  const grid = await openGrid(page, 'count:10001;bounded:true')
  const box = (await grid.boundingBox())!
  await page.mouse.move(box.x + 300, box.y + 100)
  await page.mouse.wheel(0, 600)
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBeGreaterThan(100)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await grid.evaluate(element => { element.scrollTop = element.scrollHeight })
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(150)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  expect(await grid.locator('*').count()).toBeLessThan(1500)
  await expect(grid.locator('[data-row-index="10000"]')).toBeVisible()
})

test('grid arrow/page keys and selection keep page stationary', async ({ page }) => {
  const grid = await openGrid(page, 'count:10000;bounded:true')
  await grid.locator('[data-cell="0:1"]').focus()
  const top = await page.evaluate(() => window.scrollY)
  await page.keyboard.press('PageDown')
  await expect(grid.locator(':focus')).not.toHaveAttribute('data-cell', '0:1')
  await page.keyboard.press('Control+End')
  await expect(grid.locator(':focus')).toHaveAttribute('data-cell', '9999:3')
  await page.keyboard.press('Space')
  await expect(grid.locator('[data-row-index="9999"]')).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Control+Home')
  await expect(grid.locator(':focus')).toHaveAttribute('data-cell', '0:0')
  expect(await page.evaluate(() => window.scrollY)).toBe(top)
})

test('10,001 virtualized rows remain painted while scrolling', async ({ page }, testInfo) => {
  const grid = await openGrid(page, 'count:10001;bounded:true')
  const box = (await grid.boundingBox())!
  await page.mouse.move(box.x + 300, box.y + 100)
  await page.mouse.wheel(0, 120)
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
  await page.evaluate(() => {
    const element = document.querySelector<HTMLElement>('[aria-label="Scroll ownership rows"]')!
    const probe = { running: true, frames: 0, blankFrames: 0, durations: [] as number[], longTasksSupported: PerformanceObserver.supportedEntryTypes.includes('longtask') }
    ;(window as unknown as { scrollProbe: typeof probe }).scrollProbe = probe
    if (probe.longTasksSupported) {
      const observer = new PerformanceObserver(list => probe.durations.push(...list.getEntries().map(entry => entry.duration)))
      observer.observe({ type: 'longtask' })
    }
    const sample = () => {
      if (!probe.running) return
      const viewport = element.getBoundingClientRect()
      const header = element.querySelector('.mtc-data-grid-head')!.getBoundingClientRect()
      const rows = [...element.querySelectorAll<HTMLElement>('[data-row-index]')].map(row => row.getBoundingClientRect())
        .filter(row => row.bottom > header.bottom && row.top < viewport.bottom)
      probe.frames++
      if (rows.length === 0 || Math.min(...rows.map(row => row.top)) > header.bottom + 1 || Math.max(...rows.map(row => row.bottom)) < viewport.bottom - 1) probe.blankFrames++
      requestAnimationFrame(sample)
    }
    requestAnimationFrame(sample)
  })
  for (let frame = 0; frame < 24; frame++) {
    await page.mouse.wheel(0, 120)
    await page.waitForTimeout(18)
  }
  const metrics = await page.evaluate(() => {
    const probe = (window as unknown as { scrollProbe: { running: boolean; frames: number; blankFrames: number; durations: number[]; longTasksSupported: boolean } }).scrollProbe
    probe.running = false
    return probe
  })
  await testInfo.attach('scroll-metrics.json', { body: JSON.stringify(metrics), contentType: 'application/json' })
  expect(metrics.frames).toBeGreaterThan(10)
  expect(metrics.blankFrames).toBe(0)
  if (metrics.longTasksSupported) expect(metrics.durations.filter(duration => duration > 50)).toEqual([])
  expect(await grid.locator('*').count()).toBeLessThan(1500)
})

for (const count of [0, 1, 50, 10001]) {
  test(`grid has named controls and no serious accessibility findings with ${count} rows`, async ({ page }) => {
    const grid = await openGrid(page, `count:${count};bounded:true`)
    await expect(grid).toHaveAttribute('aria-rowcount', String(count + 1))
    const results = await new AxeBuilder({ page }).include('[role="grid"]').analyze()
    expect(results.violations.filter(item => item.impact === 'serious' || item.impact === 'critical')).toEqual([])
  })
}

test('long values remain available by hover and keyboard at doubled scale', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 })
  const grid = await openGrid(page, 'count:50;bounded:true')
  await page.locator('.mtc-root').first().evaluate(element => { (element as HTMLElement).style.zoom = '2' })
  const cell = grid.locator('[data-cell="0:2"]')
  await cell.hover()
  await expect(cell).toHaveAttribute('title', /東京 \/ café \/ long-name-/)
  await grid.locator('[data-cell="0:1"]').focus()
  await page.keyboard.press('ArrowRight')
  await expect(grid.locator(':focus')).toHaveAttribute('data-cell', '0:2')
  await expect(page.locator('.mtc-data-grid-value-tip')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('.mtc-data-grid-value-tip')).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
})
