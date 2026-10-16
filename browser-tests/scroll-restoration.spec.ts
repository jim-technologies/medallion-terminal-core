import { writeFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const historyFixture = `http://127.0.0.1:${process.env.HISTORY_FIXTURE_PORT ?? 6216}/browser-tests/fixtures/history.html`

test('shell and nested grids restore back, forward and refresh after asynchronous loading', async ({ page }, testInfo) => {
  await page.goto(`${historyFixture}?pane=list`)
  const main = page.getByRole('main')
  const grid = page.getByRole('grid', { name: 'History rows' })
  await expect(grid).toHaveAttribute('aria-busy', 'true')
  await expect(grid).not.toHaveAttribute('aria-busy', 'true')
  await main.evaluate(element => { element.scrollTop = 200 })
  await grid.evaluate(element => { element.scrollTop = 5000; element.scrollLeft = 120 })
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBe(5000)
  await page.getByRole('button', { name: 'Open detail', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Detail', exact: true })).toBeVisible()
  await page.goBack()
  await expect.poll(() => main.evaluate(element => element.scrollTop)).toBe(200)
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBe(5000)
  await expect.poll(() => grid.evaluate(element => element.scrollLeft)).toBe(120)
  await page.goForward()
  await expect(page.getByRole('heading', { name: 'Detail', exact: true })).toBeVisible()
  await page.goBack()
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBe(5000)
  const beforeReload = await page.evaluate(() => ({ state:history.state, stored:sessionStorage.getItem('mtc:scroll-restoration:v1'), main:document.querySelector('main')?.scrollTop }))
  await page.reload()
  await writeFile(testInfo.outputPath('reload-state.json'), JSON.stringify({ beforeReload, afterReload:await page.evaluate(() => ({ state:history.state, stored:sessionStorage.getItem('mtc:scroll-restoration:v1'), main:document.querySelector('main')?.scrollTop })) }))
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
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBe(500)
  await page.reload()
  await expect.poll(() => main.evaluate(element => element.scrollTop)).toBe(80)
  await expect.poll(() => grid.evaluate(element => element.scrollTop)).toBe(500)
})
