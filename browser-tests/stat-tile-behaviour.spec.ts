import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator } from '@playwright/test'

async function textColors(tile: Locator) {
  return tile.evaluate(element => {
    const background = getComputedStyle(element).backgroundColor
    const text = ['.mtc-stat-tile-label', '.mtc-stat-tile-unit', '.mtc-stat-tile-description'].map(selector => {
      const node = element.querySelector(selector)
      if (!node) throw new Error(`Missing StatTile text: ${selector}`)
      return { selector, color: getComputedStyle(node).color }
    })
    return { background, text }
  })
}

function contrast(foreground: string, background: string) {
  const luminance = (color: string) => {
    const channels = color.match(/[\d.]+/g)?.map(Number)
    if (!channels || channels.length !== 3) throw new Error(`Expected opaque RGB: ${color}`)
    return channels.map(channel => {
      const value = channel / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index]!, 0)
  }
  const values = [luminance(foreground), luminance(background)].sort((a, b) => a - b)
  return (values[1]! + 0.05) / (values[0]! + 0.05)
}

for (const theme of ['light', 'dark']) {
  test(`interactive StatTile text remains readable before, during and after ${theme} hover`, async ({ page }, testInfo) => {
    await page.goto(`/iframe.html?id=toolkit-components-status--stat-tiles&viewMode=story&globals=theme:${theme}`)
    const tile = page.getByRole('link', { name: /Placed/ })
    await expect(tile).toBeVisible()
    await page.waitForFunction(() => {
      const preview = (window as unknown as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } }).__STORYBOOK_PREVIEW__
      return preview?.currentRender?.phase === 'finished'
    })
    await page.evaluate(async () => { await document.fonts.ready })
    await page.mouse.move(1, 1)
    const normalBackground = theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(18, 21, 26)'
    await expect(tile).toHaveCSS('background-color', normalBackground)
    const normal = await textColors(tile)
    await tile.hover()
    await expect(tile).toHaveCSS('background-color', theme === 'light' ? 'rgb(227, 231, 236)' : 'rgb(36, 41, 48)')
    const hovered = await textColors(tile)
    const audit = await new AxeBuilder({ page }).include('a.mtc-stat-tile[data-interactive="true"]').withRules(['color-contrast']).analyze()
    await testInfo.attach('hovered-stat-tile.png', { body: await tile.screenshot(), contentType: 'image/png' })
    await page.mouse.move(1, 1)
    await expect(tile).toHaveCSS('background-color', normalBackground)
    const restored = await textColors(tile)
    const evidence = { theme, normal, hovered, restored, violations: audit.violations }
    await testInfo.attach('stat-tile-colors.json', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' })

    expect(restored).toEqual(normal)
    for (const [state, colors] of Object.entries({ normal, hovered, restored })) {
      for (const text of colors.text) {
        expect(contrast(text.color, colors.background), `${theme} ${state} ${text.selector}`).toBeGreaterThanOrEqual(4.5)
      }
    }
    expect(audit.violations).toEqual([])
    await expect(tile).toHaveAttribute('href', '#/explore?type=order')
  })
}
