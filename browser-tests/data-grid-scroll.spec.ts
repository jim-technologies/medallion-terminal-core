import { expect, test, type Locator, type Page } from '@playwright/test'

async function openGrid(page: Page, story: string, theme: string) {
  await page.goto(`/iframe.html?id=toolkit-workbench-datagrid--${story}&viewMode=story&globals=theme:${theme}`)
  await page.waitForFunction(() => {
    const preview = (window as unknown as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } }).__STORYBOOK_PREVIEW__
    return preview?.currentRender?.phase === 'finished'
  })
  await page.evaluate(() => document.fonts.ready)
}

async function expectHeadNotScrollable(head: Locator) {
  const bounds = await head.evaluate(element => {
    const style = getComputedStyle(element)
    return {
      horizontal: element.scrollWidth - element.clientWidth,
      vertical: element.scrollHeight - element.clientHeight,
      scroller: [style.overflowX, style.overflowY].some(value => value === 'auto' || value === 'scroll'),
    }
  })
  expect(bounds).toEqual({ horizontal: 0, vertical: 0, scroller: false })
}

for (const theme of ['dark', 'light'] as const) {
  test(`grid headers have no separate scrollbar across common widths in ${theme}`, async ({ page }) => {
    test.setTimeout(120_000)
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 960 })
      for (const story of ['typed-object-table', 'narrow-columns', 'empty-and-loading']) {
        await openGrid(page, story, theme)
        for (const head of await page.locator('.mtc-data-grid-head').all()) await expectHeadNotScrollable(head)
      }
    }
  })

  test(`keyboard columns remain visible while scrolling and resizing in ${theme}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await openGrid(page, 'typed-object-table', theme)
    const grid = page.getByRole('grid', { name: 'Customers' })
    const pinned = grid.locator('[data-cell="0:1"]')
    const pinnedLeft = (await pinned.boundingBox())!.x
    const first = grid.locator('[data-cell="0:1"]')
    await first.focus()
    await page.keyboard.press('End')
    const focused = grid.locator(':focus')
    await expect(focused).toHaveAttribute('data-cell', '0:8')
    expect(await grid.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)
    const visible = await focused.evaluate(cell => {
      const viewport = cell.closest('[role="grid"]')!
      const pinned = viewport.querySelector('[data-cell="0:1"]')!
      const box = cell.getBoundingClientRect()
      const edge = viewport.getBoundingClientRect()
      return Math.min(box.right, edge.right) - Math.max(box.left, pinned.getBoundingClientRect().right)
    })
    expect(visible).toBeGreaterThan(0)
    expect((await pinned.boundingBox())!.x).toBeCloseTo(pinnedLeft, 0)
    await page.keyboard.press('ArrowUp')
    await expect(focused).toHaveAttribute('data-cell', '-1:8')
    const before = (await focused.boundingBox())!.width
    await page.keyboard.press('Alt+ArrowRight')
    expect((await focused.boundingBox())!.width).toBeGreaterThan(before)
    await expectHeadNotScrollable(grid.locator('.mtc-data-grid-head'))
    await page.screenshot({ path: testInfo.outputPath(`keyboard-columns-${theme}.png`) })
    for (let column = 7; column >= 2; column--) {
      await page.keyboard.press('ArrowLeft')
      await expect(focused).toHaveAttribute('data-cell', `-1:${column}`)
      const right = (await focused.boundingBox())!.x + (await focused.boundingBox())!.width
      const edge = (await grid.boundingBox())!
      expect(right).toBeGreaterThan(pinnedLeft + (await pinned.boundingBox())!.width)
      expect((await focused.boundingBox())!.x).toBeLessThan(edge.x + edge.width)
    }
    await page.keyboard.press('Home')
    await expect(focused).toHaveAttribute('data-cell', '-1:0')
    expect((await pinned.boundingBox())!.x).toBeCloseTo(pinnedLeft, 0)
  })
}
