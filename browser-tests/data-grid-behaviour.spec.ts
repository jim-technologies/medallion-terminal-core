import AxeBuilder from '@axe-core/playwright'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
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

test('typed grid reuses byte and explicit-zone date formatters across sorting', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    const probe = { bytes: 0, dates: 0, number: Intl.NumberFormat, date: Intl.DateTimeFormat }
    Object.defineProperty(window, '__mtcIntlReuseProbe', { value: probe })
    Intl.NumberFormat = new Proxy(Intl.NumberFormat, {
      construct(target, args, newTarget) {
        const options = args[1] as Intl.NumberFormatOptions | undefined
        if (args[0] === 'en' && options?.style === 'unit' && options.unit === 'kilobyte') probe.bytes++
        return Reflect.construct(target, args, newTarget)
      },
    })
    Intl.DateTimeFormat = new Proxy(Intl.DateTimeFormat, {
      construct(target, args, newTarget) {
        const options = args[1] as Intl.DateTimeFormatOptions | undefined
        if (args[0] === 'en' && options?.timeZone === 'UTC' && options.dateStyle === 'medium' && options.timeStyle === undefined) probe.dates++
        return Reflect.construct(target, args, newTarget)
      },
    })
  })
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--context-actions-and-paging&viewMode=story')
  const grid = page.getByRole('grid', { name: 'Reports', exact: true })
  await expect(grid).toBeVisible()
  await page.waitForFunction(() => {
    const preview = (window as unknown as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } }).__STORYBOOK_PREVIEW__
    return preview?.currentRender?.phase === 'finished'
      && document.body.classList.contains('sb-show-main')
      && !document.body.classList.contains('sb-show-preparing-story')
  })
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toHaveCount(0)
  const samples = []
  for (const phase of ['initial', 'descending']) {
    if (phase === 'descending') {
      const header = grid.getByRole('columnheader', { name: /^Size/ })
      await header.click()
      await expect(header).toHaveAttribute('aria-sort', 'ascending')
      await header.click()
      await expect(header).toHaveAttribute('aria-sort', 'descending')
    }
    const row = grid.locator('[data-row-index="0"]')
    const name = (await row.locator('[data-column-id="name"]').textContent())!
    const number = Number(name.match(/report-(\d+)\.csv/)![1])
    const expected = await page.evaluate(n => {
      const probe = (window as unknown as { __mtcIntlReuseProbe: { number: typeof Intl.NumberFormat; date: typeof Intl.DateTimeFormat } }).__mtcIntlReuseProbe
      return {
        size: new probe.number('en', { style: 'unit', unit: 'kilobyte', unitDisplay: 'short', maximumFractionDigits: 1 }).format((12_000 + n * 733) / 1000),
        modified: new probe.date('en', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: undefined }).format(new Date(Date.UTC(2026, 8, 1 + n % 24))),
      }
    }, number)
    const actual = { size: await row.locator('[data-column-id="size"]').textContent(), modified: await row.locator('[data-column-id="modified"]').textContent() }
    samples.push({ phase, number, actual, expected })
    expect(actual).toEqual(expected)
  }
  expect(samples[0]!.number).not.toBe(samples[1]!.number)
  const constructions = await page.evaluate(() => {
    const { bytes, dates } = (window as unknown as { __mtcIntlReuseProbe: { bytes: number; dates: number } }).__mtcIntlReuseProbe
    return { bytes, dates }
  })
  await testInfo.attach('typed-grid-formatter-reuse.json', { body: JSON.stringify({ samples, constructions }, null, 2), contentType: 'application/json' })
  expect(constructions).toEqual({ bytes: 1, dates: 1 })
})

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
  const features = await page.evaluate(() => {
    const runtime = window as unknown as { FEATURES?: { highlight?: boolean; developmentModeForBuild?: boolean }; __STORYBOOK_HIGHLIGHT_INITIALIZED?: boolean }
    return { highlight: runtime.FEATURES?.highlight, developmentModeForBuild: runtime.FEATURES?.developmentModeForBuild, highlighterInitialized: Boolean(runtime.__STORYBOOK_HIGHLIGHT_INITIALIZED) }
  })
  await testInfo.attach('storybook-performance-features.json', { body: JSON.stringify(features), contentType: 'application/json' })
  expect(features).toEqual({ highlight: false, developmentModeForBuild: false, highlighterInitialized: false })
  await expect(grid).toHaveAttribute('aria-rowcount', '10002')
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
  const loadedAssets = await page.evaluate(() => performance.getEntriesByType('resource')
    .map(entry => new URL(entry.name)).filter(url => url.origin === location.origin && url.pathname.startsWith('/assets/') && url.pathname.endsWith('.js'))
    .map(url => url.pathname))
  const artifacts = []
  const generatedHelpers = []
  // These two generated toolchain helpers have no original source maps.
  const knownGeneratedHelpers: Record<string, string> = {
    '97cd730ec57b186cda02f34226d3cf8fd283b7d5ad62fb53a94cebfeb4e0d3de': 'Vite preload helper',
    '4625e101449061a5fae04634001143ffaba4e22a6141f1f77ed6d342b4e9db4e': 'Rolldown interop helper',
  }
  for (const pathname of [...new Set(loadedAssets)]) {
    const path = resolve('storybook-performance', pathname.slice(1))
    const chunk = await readFile(path)
    const chunkSha256 = createHash('sha256').update(chunk).digest('hex')
    const servedChunk = await page.request.get(pathname)
    expect(servedChunk.ok()).toBe(true)
    expect(await servedChunk.body()).toEqual(chunk)
    let map: Buffer
    try {
      map = await readFile(`${path}.map`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
      const facade = chunk.toString().match(/^import\{\w+ as (\w+)\}from"(\.\/iframe-[\w-]+\.js)";\1\(\);$/)
      const role = facade ? 'entry facade' : knownGeneratedHelpers[chunkSha256]
      expect(role, `known generated mapless asset: ${pathname}`).toBeDefined()
      const imports = [...chunk.toString().matchAll(/from"(\.\/[^"\n]+\.js)"/g)]
        .map(match => new URL(match[1]!, new URL(pathname, page.url())).pathname)
      for (const target of imports) expect(loadedAssets).toContain(target)
      if (facade) await readFile(`${resolve('storybook-performance', imports[0]!.slice(1))}.map`)
      generatedHelpers.push({ pathname, role, bytes: chunk.length, chunkSha256, imports, servedBytesEqual: true })
      continue
    }
    const servedMap = await page.request.get(`${pathname}.map`)
    expect(servedMap.ok()).toBe(true)
    expect(await servedMap.body()).toEqual(map)
    const sources = (JSON.parse(map.toString()) as { sources: string[] }).sources
    expect(sources.filter(source => /\/react(?:-jsx(?:-dev)?-runtime|-dom(?:-client)?)?\.development\.js$/.test(source))).toEqual([])
    if (sources.some(source => /(?:\/DataGrid\.tsx|\/react(?:-jsx-runtime)?\.production\.js|\/react-dom-client\.production\.js)$/.test(source))) {
      artifacts.push({ pathname, chunkSha256, mapSha256: createHash('sha256').update(map).digest('hex'), sources })
    }
  }
  const sources = artifacts.flatMap(artifact => artifact.sources)
  for (const target of [/\/DataGrid\.tsx$/, /\/react\.production\.js$/, /\/react-jsx-runtime\.production\.js$/, /\/react-dom-client\.production\.js$/]) {
    expect(sources.some(source => target.test(source)), `loaded preview contains ${target}`).toBe(true)
  }
  await testInfo.attach('storybook-production-artifacts.json', { body: JSON.stringify(artifacts), contentType: 'application/json' })
  await testInfo.attach('storybook-generated-helpers.json', { body: JSON.stringify(generatedHelpers), contentType: 'application/json' })
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
