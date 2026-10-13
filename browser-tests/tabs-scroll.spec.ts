import { expect, test } from '@playwright/test'

for (const theme of ['dark', 'light'] as const) {
  for (const orientation of ['horizontal', 'vertical'] as const) {
    test(`section tabs scroll only along their ${orientation} axis in ${theme}`, async ({ page }, testInfo) => {
      test.setTimeout(120_000)
      const story = orientation === 'horizontal' ? 'tabs-control' : 'vertical-tabs'
      for (const width of [1440, 1024, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(`/iframe.html?id=toolkit-components-navigation--${story}&viewMode=story&globals=theme:${theme}`)
        await page.waitForFunction(() => {
          const preview = (window as unknown as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } }).__STORYBOOK_PREVIEW__
          return preview?.currentRender?.phase === 'finished'
        })
        await page.evaluate(() => document.fonts.ready)
        const tabs = page.getByRole('tablist', { name: 'Object sections' })
        await tabs.screenshot({ path: testInfo.outputPath(`tabs-${orientation}-${theme}-${width}.png`) })
        const overflow = await tabs.evaluate(element => ({
          horizontal: element.scrollWidth - element.clientWidth,
          vertical: element.scrollHeight - element.clientHeight,
          verticalLayout: getComputedStyle(element).flexDirection === 'column',
        }))
        expect(overflow.verticalLayout ? overflow.horizontal : overflow.vertical).toBe(0)
        const first = tabs.getByRole('tab', { name: 'Overview', exact: true })
        const last = tabs.getByRole('tab', { name: /^Activity/ })
        await first.focus()
        await page.keyboard.press('End')
        await expect(last).toBeFocused()
        await expect(last).toHaveAttribute('aria-selected', 'true')
        await expect(last).toBeInViewport({ ratio: 1 })
        await expect(page.getByRole('tabpanel')).toContainText('Activity')
        await page.keyboard.press(orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown')
        await expect(first).toBeFocused()
        await expect(first).toHaveAttribute('aria-selected', 'true')
        const ring = await first.evaluate(element => {
          const style = getComputedStyle(element)
          return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) }
        })
        expect(ring.style).not.toBe('none')
        expect(ring.width).toBeGreaterThan(0)
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
        if (orientation === 'horizontal' && width === 320) {
          expect(overflow.horizontal).toBeGreaterThan(0)
          await page.keyboard.press('End')
          expect(await tabs.evaluate(element => element.scrollLeft)).toBeGreaterThan(0)
        }
      }
    })
  }
}
