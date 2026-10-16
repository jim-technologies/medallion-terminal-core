import AxeBuilder from '@axe-core/playwright'
import { writeFile } from 'node:fs/promises'
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test'

async function openGrid(page: Page, args = '', theme = 'dark') {
  await page.goto(`/iframe.html?id=toolkit-workbench-datagrid--scroll-ownership&viewMode=story&globals=theme:${theme}&args=${args}`)
  const grid = page.getByRole('grid', { name: 'Scroll ownership rows' })
  await expect(grid).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => {
    const preview = (window as unknown as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } }).__STORYBOOK_PREVIEW__
    return preview?.currentRender?.phase === 'finished'
      && document.body.classList.contains('sb-show-main')
      && !document.body.classList.contains('sb-show-preparing-story')
  })
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

test('10,001 virtualized rows keep sampled DOM coverage while scrolling', { tag: '@performance' }, async ({ page, browserName }, testInfo) => {
  const grid = await openGrid(page, 'count:10001;bounded:true')
  const box = (await grid.boundingBox())!
  await page.mouse.move(box.x + 300, box.y + 100)
  await page.mouse.wheel(0, 120)
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
  await page.evaluate(() => {
    const element = document.querySelector<HTMLElement>('[aria-label="Scroll ownership rows"]')!
    const probe = { running: true, frames: 0, blankFrames: 0, durations: [] as number[], longTasksSupported: PerformanceObserver.supportedEntryTypes.includes('longtask'), observer: null as PerformanceObserver | null }
    ;(window as unknown as { scrollProbe: typeof probe }).scrollProbe = probe
    if (probe.longTasksSupported) {
      const observer = new PerformanceObserver(list => probe.durations.push(...list.getEntries().map(entry => entry.duration)))
      observer.observe({ type: 'longtask' })
      probe.observer = observer
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
    const probe = (window as unknown as { scrollProbe: { running: boolean; frames: number; blankFrames: number; durations: number[]; longTasksSupported: boolean; observer: PerformanceObserver | null } }).scrollProbe
    probe.running = false
    if (probe.observer) {
      probe.durations.push(...probe.observer.takeRecords().map(entry => entry.duration))
      probe.observer.disconnect()
    }
    return { running: probe.running, frames: probe.frames, blankFrames: probe.blankFrames, durations: probe.durations, longTasksSupported: probe.longTasksSupported }
  })
  const metricsPath = testInfo.outputPath('scroll-metrics.json')
  await writeFile(metricsPath, JSON.stringify(metrics))
  await testInfo.attach('scroll-metrics.json', { path: metricsPath, contentType: 'application/json' })
  expect(metrics.frames).toBeGreaterThan(10)
  expect(metrics.blankFrames).toBe(0)
  if (browserName === 'chromium') expect(metrics.longTasksSupported).toBe(true)
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

test('long values remain available by hover and keyboard at 200 percent reflow', async ({ page }, testInfo) => {
  // A 1440×900 desktop at 200% browser zoom has a 720×450 CSS viewport.
  await page.setViewportSize({ width: 720, height: 450 })
  const grid = await openGrid(page, 'count:50;bounded:true')
  const cell = grid.locator('[data-cell="0:2"]')
  await cell.hover()
  await expect(cell).toHaveAttribute('title', /東京 \/ café \/ long-name-/)
  await page.locator('body').click({ position: { x: 4, y: 4 } })
  await page.keyboard.press('Tab')
  await writeFile(testInfo.outputPath('keyboard-entry.json'), JSON.stringify(await page.evaluate(() => ({ tag: document.activeElement?.tagName, role: document.activeElement?.getAttribute('role'), className: document.activeElement?.className, focused: document.hasFocus() }))))
  await expect(grid.locator(':focus')).toHaveAttribute('data-cell', '0:1')
  await page.keyboard.press('ArrowRight')
  await expect(grid.locator(':focus')).toHaveAttribute('data-cell', '0:2')
  const tip = page.locator('.mtc-data-grid-value-tip')
  await expect(tip).toBeVisible()
  const tipBox = (await tip.boundingBox())!
  const geometry = await tip.evaluate(element => ({
    rect: element.getBoundingClientRect().toJSON(), left: (element as HTMLElement).style.left,
    maxWidth: getComputedStyle(element).maxWidth, boxSizing: getComputedStyle(element).boxSizing,
    viewport: innerWidth, clientWidth: document.documentElement.clientWidth, scrollX,
  }))
  await writeFile(testInfo.outputPath('tip-metrics.json'), JSON.stringify(geometry))
  expect(tipBox.x).toBeGreaterThanOrEqual(8)
  expect(tipBox.x + tipBox.width).toBeLessThanOrEqual(720 - 8)
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
  await page.screenshot({ path: testInfo.outputPath('focus-tip.png') })
  await page.keyboard.press('Escape')
  await expect(page.locator('.mtc-data-grid-value-tip')).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
})

async function dragLinkedText(page: Page, cell: Locator, padding: boolean, testInfo: TestInfo) {
  const box = await cell.locator('.mtc-value-text').evaluate(node => {
    const range = document.createRange()
    range.selectNodeContents(node)
    const rect = range.getBoundingClientRect()
    return { left: rect.left, right: rect.right, y: rect.top + rect.height / 2 }
  })
  await page.evaluate(() => {
    const events: string[] = []
    Object.assign(window, { pointerProbe: events })
    for (const name of ['mousedown', 'dragstart', 'selectstart', 'selectionchange', 'mouseup', 'click']) {
      document.addEventListener(name, event => events.push(`${name}:${event.defaultPrevented}:${window.getSelection()?.toString()}`))
    }
  })
  const start = padding ? (await cell.boundingBox())!.x + 2 : box.left + 1
  await page.mouse.move(start, box.y)
  await page.mouse.down()
  if (padding) {
    await page.waitForTimeout(100)
    for (let step = 1; step <= 12; step++) {
      await page.mouse.move(start + (box.right - 1 - start) * step / 12, box.y)
      await page.waitForTimeout(16)
    }
  } else await page.mouse.move(box.right - 1, box.y, { steps: 12 })
  await page.mouse.up()
  const metrics = await cell.locator('a').evaluate((element, geometry) => ({
    events: (window as Window & { pointerProbe: string[] }).pointerProbe,
    selected: window.getSelection()?.toString(), draggable: element.draggable, geometry,
    userSelect: getComputedStyle(element).userSelect, userDrag: getComputedStyle(element).getPropertyValue('-webkit-user-drag'),
  }), { box, padding })
  await writeFile(testInfo.outputPath('pointer-metrics.json'), JSON.stringify(metrics))
  return metrics.selected?.trim()
}

test('inside-link text dragging follows native browser selection', async ({ page, browserName }, testInfo) => {
  test.fail(browserName === 'webkit' && process.platform === 'linux', 'Linux WebKitGTK also refuses inside-anchor selection in neutral static HTML; padding-start selection is covered separately.')
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--linked-text-selection&viewMode=story')
  const cell = page.getByRole('grid', { name: 'Linked rows' }).locator('[data-cell="0:0"]')
  expect(await dragLinkedText(page, cell, false, testInfo)).toBe('Platform roadmap')
  await expect(page.getByRole('status')).toHaveText('Opened 0 times')
  await expect(page.getByRole('grid', { name: 'Linked rows' }).getByRole('row', { selected: true })).toHaveCount(0)
})

test('cell-padding text drag selects linked values without navigating', async ({ page }, testInfo) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--linked-text-selection&viewMode=story')
  const cell = page.getByRole('grid', { name: 'Linked rows' }).locator('[data-cell="0:0"]')
  expect(await dragLinkedText(page, cell, true, testInfo)).toBe('Platform roadmap')
  await expect(page.getByRole('status')).toHaveText('Opened 0 times')
  await expect(page.getByRole('grid', { name: 'Linked rows' }).getByRole('row', { selected: true })).toHaveCount(0)
})

test('row links preserve plain, keyboard, double-click, modified and middle activation', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--linked-text-selection&viewMode=story')
  const grid = page.getByRole('grid', { name: 'Linked rows' })
  const cell = grid.locator('[data-cell="0:0"]')
  const link = cell.locator('a')
  await link.click()
  await expect(page.getByRole('status')).toHaveText('Opened 1 times')
  await cell.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toHaveText('Opened 2 times')
  await grid.locator('[data-cell="0:1"]').dblclick()
  await expect(page.getByRole('status')).toHaveText('Opened 3 times')
  await expect(link).toHaveAttribute('href', /opened=1$/)
  for (const mode of ['modified', 'middle']) {
    const popupPromise = page.context().waitForEvent('page')
    if (mode === 'modified') await link.click({ modifiers: ['ControlOrMeta'] })
    else await link.click({ button: 'middle' })
    const popup = await popupPromise
    await popup.close()
    await expect(page.getByRole('status')).toHaveText('Opened 3 times')
  }
})
