import { writeFile } from 'node:fs/promises'
import { expect, test, type Page } from '@playwright/test'

const historyFixture = `http://127.0.0.1:${process.env.HISTORY_FIXTURE_PORT ?? 6216}/browser-tests/fixtures/history.html`

async function completeHistoryRows(page: Page) {
  await page.waitForFunction(() => window.__historyFixtureRows?.search === window.location.search)
  await page.evaluate(() => window.__historyFixtureRows!.complete())
}

test('shell and nested grids restore back, forward and refresh after asynchronous loading', async ({ page }, testInfo) => {
  await page.goto(`${historyFixture}?pane=list&load=manual`)
  const main = page.getByRole('main')
  const grid = page.getByRole('grid', { name: 'History rows' })
  await expect(grid).toHaveAttribute('aria-busy', 'true')
  await completeHistoryRows(page)
  await expect(grid).not.toHaveAttribute('aria-busy', 'true')
  await main.evaluate(element => { element.scrollTop = 200 })
  await grid.evaluate(element => { element.scrollTop = 5000; element.scrollLeft = 120 })
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBe(5000)
  await page.getByRole('button', { name: 'Open detail', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Detail', exact: true })).toBeVisible()
  await page.goBack()
  await expect(grid).toHaveAttribute('aria-busy', 'true')
  await completeHistoryRows(page)
  await expect(grid).not.toHaveAttribute('aria-busy', 'true')
  await expect.poll(() => main.evaluate(element => element.scrollTop)).toBe(200)
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBe(5000)
  await expect.poll(() => grid.evaluate(element => element.scrollLeft)).toBe(120)
  await page.goForward()
  await expect(page.getByRole('heading', { name: 'Detail', exact: true })).toBeVisible()
  await page.goBack()
  await expect(grid).toHaveAttribute('aria-busy', 'true')
  await completeHistoryRows(page)
  await expect(grid).not.toHaveAttribute('aria-busy', 'true')
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBe(5000)
  const beforeReload = await page.evaluate(() => ({ state:history.state, stored:sessionStorage.getItem('mtc:scroll-restoration:v1'), main:document.querySelector('main')?.scrollTop }))
  await page.reload()
  await writeFile(testInfo.outputPath('reload-state.json'), JSON.stringify({ beforeReload, afterReload:await page.evaluate(() => ({ state:history.state, stored:sessionStorage.getItem('mtc:scroll-restoration:v1'), main:document.querySelector('main')?.scrollTop })) }))
  await expect(grid).toHaveAttribute('aria-busy', 'true')
  await completeHistoryRows(page)
  await expect(grid).not.toHaveAttribute('aria-busy', 'true')
  await expect.poll(() => main.evaluate(element => element.scrollTop)).toBe(200)
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBe(5000)
})

test('same URL history entries keep separate positions and replacement preserves host state', async ({ page }) => {
  await page.goto(`${historyFixture}?pane=list`)
  const main = page.getByRole('main')
  await page.getByRole('grid', { name: 'History rows' }).waitFor()
  await main.evaluate(element => { element.scrollTop = 200 })
  await page.getByRole('button', { name: 'Open list', exact: true }).click()
  await expect.poll(() => main.evaluate(element => element.scrollTop)).toBe(0)
  await main.evaluate(element => { element.scrollTop = 400 })
  await page.goBack()
  await expect.poll(() => main.evaluate(element => element.scrollTop)).toBe(200)
  await page.evaluate(() => history.replaceState({ ...history.state, hostState: 'keep' }, ''))
  await page.getByRole('button', { name: 'Replace list', exact: true }).click()
  expect(await page.evaluate(() => history.state.hostState)).toBe('keep')
})

const frames = (page: Page) => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))

test('an in-page fragment link keeps its anchor scroll and Back restores the list', async ({ page }) => {
  await page.goto(`${historyFixture}?pane=list`)
  const main = page.getByRole('main')
  const grid = page.getByRole('grid', { name: 'History rows' })
  await expect(grid).not.toHaveAttribute('aria-busy', 'true')
  await main.evaluate(element => { element.scrollTop = 40 })
  await frames(page)
  await page.getByRole('link', { name: 'Jump to target', exact: true }).click()
  await expect(page).toHaveURL(/#history-target$/)
  await frames(page)
  const target = page.getByRole('heading', { name: 'Target', exact: true })
  await expect(target).toBeInViewport()
  expect(await main.evaluate(element => element.scrollTop)).toBeGreaterThan(1000)
  await page.goBack()
  await expect(page).not.toHaveURL(/#history-target$/)
  await expect.poll(() => main.evaluate(element => element.scrollTop)).toBe(40)
})

test('the focus value tip follows keyboard reveal in the shell and closes under its top bar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${historyFixture}?pane=tips`)
  const main = page.getByRole('main')
  const grid = page.getByRole('grid', { name: 'Tip rows' })
  await grid.locator('[data-cell="0:1"]').focus()
  for (let row = 1; row <= 40; row++) await page.keyboard.press('ArrowDown')
  await expect(grid.locator('[data-cell="40:1"]')).toBeFocused()
  expect(await main.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
  for (let row = 39; row >= 5; row--) await page.keyboard.press('ArrowUp')
  const cell = grid.locator('[data-cell="5:1"]')
  await expect(cell).toBeFocused()
  await frames(page)
  const placed = await cell.evaluate(element => {
    const tip = document.querySelector('.mtc-data-grid-value-tip')?.getBoundingClientRect()
    return { cell: element.getBoundingClientRect().toJSON(), main: element.closest('main')!.getBoundingClientRect().toJSON(), tipTop: tip?.top ?? null }
  })
  expect(Math.abs(placed.cell.top - placed.main.top)).toBeLessThanOrEqual(1)
  expect(placed.tipTop).not.toBeNull()
  expect(Math.abs(placed.tipTop! - placed.cell.top)).toBeLessThanOrEqual(2)
  // Under the top bar: still inside the window, hidden by the shell's main panel.
  await main.evaluate((element, by) => { element.scrollTop += by }, Math.ceil(placed.cell.height) + 1)
  await expect(page.locator('.mtc-data-grid-value-tip')).toHaveCount(0)
  await expect(cell).toBeFocused()
})

test('denied browser storage leaves navigation and scrolling usable', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError') }
    Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError') }
  })
  await page.goto(`${historyFixture}?pane=list`)
  const grid = page.getByRole('grid', { name: 'History rows' })
  await expect(grid).not.toHaveAttribute('aria-busy', 'true')
  await grid.evaluate(element => { element.scrollTop = 600 })
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBe(600)
  await page.getByRole('button', { name: 'Open detail', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Detail', exact: true })).toBeVisible()
})

test('replacement retains caller-owned history state', async ({ page }) => {
  await page.goto(`${historyFixture}?pane=list`)
  await page.getByRole('grid', { name: 'History rows' }).waitFor()
  await page.evaluate(() => history.replaceState({ ...history.state, hostState: 'keep' }, ''))
  await page.getByRole('button', { name: 'Replace list', exact: true }).click()
  expect(await page.evaluate(() => history.state?.hostState)).toBe('keep')
})

test('real input cancels a pending grid restore before slow rows arrive', async ({ page }) => {
  await page.goto(`${historyFixture}?pane=list&delay=2000`)
  const grid = page.getByRole('grid', { name: 'History rows' })
  await expect(grid).not.toHaveAttribute('aria-busy', 'true')
  await grid.evaluate(element => { element.scrollTop = 5000 })
  await page.reload({ waitUntil: 'commit' })
  await expect(grid).toHaveAttribute('aria-busy', 'true')
  const box = (await grid.boundingBox())!
  await page.mouse.move(box.x + 100, box.y + 80)
  await page.mouse.wheel(0, 8)
  await expect(grid).not.toHaveAttribute('aria-busy', 'true')
  expect(await grid.evaluate(element => element.scrollTop)).toBe(0)
})

test('an unreachable saved offset settles after ten seconds and stops forcing the view', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('mtc:scroll-restoration:v1', JSON.stringify([['external-scroll', {
      'grid:["External rows","rows"]': { top: 1_000_000_000, left: 0 },
    }]]))
  })
  await page.goto('/iframe.html?id=toolkit-app-productshell--external-scroll-owner&viewMode=story')
  const grid = page.getByRole('grid', { name: 'External rows' })
  await expect(grid).toBeVisible()
  const maximum = await grid.evaluate(element => element.scrollHeight - element.clientHeight)
  expect(maximum).toBeGreaterThan(0)
  await expect.poll(() => page.evaluate(() => {
    const entries = JSON.parse(sessionStorage.getItem('mtc:scroll-restoration:v1') ?? '[]')
    return entries.find(([key]: [string]) => key === 'external-scroll')?.[1]?.['grid:["External rows","rows"]']?.top
  }), { timeout: 12_000 }).toBe(maximum)
  await grid.evaluate(element => {
    element.scrollTop = 0
    element.firstElementChild!.setAttribute('data-after-settle', 'true')
  })
  await page.waitForTimeout(100)
  expect(await grid.evaluate(element => element.scrollTop)).toBe(0)
})

test('history entry identity also works without secure-context randomUUID', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(Crypto.prototype, 'randomUUID', { value: undefined }) })
  await page.goto(`${historyFixture}?pane=list`)
  await expect(page.getByRole('grid', { name: 'History rows' })).toBeVisible()
  expect(await page.evaluate(() => history.state.__mtcEntry)).toMatch(/^[a-f0-9]{32}$/)
  await page.getByRole('button', { name: 'Open detail', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Detail', exact: true })).toBeVisible()
})

test('same-key owner replacement captures immediate offsets before DOM removal', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-app-productshell--external-scroll-owner&viewMode=story')
  const main = page.getByRole('main')
  const grid = page.getByRole('grid', { name: 'External rows' })
  await expect(grid).toBeVisible()
  await page.evaluate(() => {
    document.querySelector('main')!.scrollTop = 80
    document.querySelector<HTMLElement>('[role="grid"]')!.scrollTop = 500
    Array.from(document.querySelectorAll('button')).find(button => button.textContent === 'Remount owners')!.click()
  })
  await expect.poll(() => main.evaluate(element => element.scrollTop)).toBe(80)
  await expect.poll(() => grid.evaluate(element => Math.abs(element.scrollTop - 500))).toBeLessThanOrEqual(1)
  await page.reload()
  await expect.poll(() => main.evaluate(element => element.scrollTop)).toBe(80)
  await expect.poll(() => grid.evaluate(element => Math.abs(element.scrollTop - 500))).toBeLessThanOrEqual(1)
})

test('shell and nested keyboard navigation reveals focus inside the outer scroll owner', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${historyFixture}?pane=list`)
  const main = page.getByRole('main')
  const grid = page.getByRole('grid', { name: 'History rows' })
  await expect(grid).not.toHaveAttribute('aria-busy', 'true')
  await grid.locator('[data-cell="0:0"]').focus()
  await main.evaluate(element => { element.scrollTop = 0 })
  await page.keyboard.press('Control+End')
  const last = grid.locator('[data-cell="10000:2"]')
  await expect(last).toBeFocused()
  await writeFile(testInfo.outputPath('keyboard-owner-metrics.json'), JSON.stringify(await last.evaluate(element => ({
    cell: element.getBoundingClientRect().toJSON(),
    owners: Array.from((function* () { let owner = element.parentElement; while (owner) { yield owner; owner = owner.parentElement } })()).map(owner => ({
      tag: owner.tagName, className: owner.className, rect: owner.getBoundingClientRect().toJSON(),
      top: owner.scrollTop, left: owner.scrollLeft, height: owner.clientHeight, overflow: getComputedStyle(owner).overflowY,
    })), viewport: { width: innerWidth, height: innerHeight },
  }))))
  await expect(last).toBeInViewport({ ratio: 1 })
  await expect.poll(() => last.evaluate(element => {
    const bounds = element.getBoundingClientRect()
    const owner = element.closest('main')!.getBoundingClientRect()
    return bounds.top >= owner.top && bounds.bottom <= owner.bottom
  })).toBe(true)
  await expect.poll(() => main.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
  const lastBox = (await last.boundingBox())!
  const lastHeaderBox = (await grid.locator('[data-cell="-1:2"]').boundingBox())!
  expect(Math.abs(lastBox.x - lastHeaderBox.x)).toBeLessThanOrEqual(1)
  const horizontal = await grid.evaluate(element => element.scrollLeft)
  expect(horizontal).toBeGreaterThan(0)
  const outerPosition = await main.evaluate(element => element.scrollTop)
  await page.keyboard.press('Control+Home')
  const first = grid.locator('[data-cell="0:0"]')
  await expect(first).toBeFocused()
  await expect(first).toBeInViewport({ ratio: 1 })
  expect(Math.abs(await grid.evaluate(element => element.scrollLeft) - horizontal)).toBeLessThanOrEqual(1)
  expect(Math.abs(await main.evaluate(element => element.scrollTop) - outerPosition)).toBeLessThanOrEqual(1)
  const firstBox = (await first.boundingBox())!
  const firstHeaderBox = (await grid.locator('[data-cell="-1:0"]').boundingBox())!
  expect(Math.abs(firstBox.x - firstHeaderBox.x)).toBeLessThanOrEqual(1)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
})
