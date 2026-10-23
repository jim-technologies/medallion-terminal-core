import { expect, test } from '@playwright/test'

test('grid-consumed arrow keys do not also move Dashboard widget focus', async ({ page }) => {
  await page.goto('/iframe.html?id=core-behaviour--keyboard-ownership&viewMode=story')
  const grid = page.getByRole('grid', { name: 'Table data' })
  await grid.locator('[data-cell="0:0"]').click()
  await expect(page.locator('#mt-widget-rows .mtc-widget')).toHaveAttribute('data-focused', 'true')
  await page.keyboard.press('ArrowDown')
  await expect(grid.locator(':focus')).toHaveAttribute('data-cell', '1:0')
  await expect(page.locator('#mt-widget-rows .mtc-widget')).toHaveAttribute('data-focused', 'true')
  await expect(page.locator('#mt-widget-summary .mtc-widget')).not.toHaveAttribute('data-focused', 'true')
})

for (const label of ['Draft name', 'Draft notes', 'Draft choice', 'Draft editor']) {
  test(`workspace shortcuts leave typing alone in ${label}`, async ({ page }) => {
    await page.goto('/iframe.html?id=core-behaviour--keyboard-ownership&viewMode=story')
    await page.getByLabel(label, { exact: true }).focus()
    await page.keyboard.press('Control+2')
    await expect(page.locator('.mtc-tab-active')).toContainText('First workspace')
    await page.keyboard.press('ArrowDown')
    await expect(page.locator('.mtc-widget[data-focused="true"]')).toHaveCount(0)
  })
}

for (const label of ['Draft name', 'Draft notes', 'Draft choice', 'Draft editor']) {
  test(`global palette leaves typing alone in ${label}`, async ({ page }) => {
    await page.goto('/iframe.html?id=toolkit-app-productshell--editable-shortcuts&viewMode=story')
    await page.getByLabel(label, { exact: true }).focus()
    await page.keyboard.press('Control+k')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.getByRole('heading', { name: 'finance', exact: true }).click()
    await page.keyboard.press('Control+k')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
}

for (const label of ['Draft name', 'Draft notes', 'Draft choice', 'Draft editor']) {
  test(`shortcut help leaves typing alone in ${label}`, async ({ page }) => {
    await page.goto('/iframe.html?id=core-behaviour--keyboard-ownership&viewMode=story')
    await page.getByLabel(label, { exact: true }).focus()
    await page.keyboard.press('?')
    await expect(page.getByRole('heading', { name: 'Keyboard shortcuts' })).toHaveCount(0)
  })
}

test('Ctrl+K inside the shell palette closes it and returns focus to search', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-app-productshell--editable-shortcuts&viewMode=story')
  const search = page.getByRole('button', { name: /^Search files (?:Ctrl K|⌘ K)$/ })
  await search.click()
  const palette = page.getByRole('dialog')
  await expect(palette).toBeVisible()
  await expect(palette.getByRole('combobox')).toBeFocused()
  const pressed = page.evaluate(() => new Promise<boolean>(resolve => {
    document.addEventListener('keydown', event => setTimeout(() => resolve(event.defaultPrevented)), { once: true })
  }))
  await page.keyboard.press('Control+k')
  expect(await pressed).toBe(true)
  await expect(palette).toHaveCount(0)
  await expect(search).toBeFocused()
})

test('Ctrl+K inside the Dashboard palette closes it and returns focus to the grid', async ({ page }) => {
  await page.goto('/iframe.html?id=core-behaviour--keyboard-ownership&viewMode=story')
  const cell = page.getByRole('grid', { name: 'Table data' }).locator('[data-cell="0:0"]')
  await cell.click()
  await page.keyboard.press('Control+k')
  const palette = page.getByRole('dialog', { name: 'Dashboard commands', exact: true })
  await expect(palette.getByRole('combobox')).toBeFocused()
  await page.keyboard.press('Control+k')
  await expect(palette).toHaveCount(0)
  await expect(cell).toBeFocused()
})

test('Escape closes the palette above fullscreen without closing both layers', async ({ page }) => {
  await page.goto('/iframe.html?id=core-behaviour--keyboard-ownership&viewMode=story')
  await page.getByRole('grid', { name: 'Table data' }).locator('[data-cell="0:0"]').click()
  await page.keyboard.press('f')
  const fullscreen = page.getByRole('dialog', { name: 'Fullscreen Rows', exact: true })
  await expect(fullscreen).toBeVisible()
  await page.keyboard.press('Control+k')
  const palette = page.getByRole('dialog', { name: 'Dashboard commands', exact: true })
  await expect(palette).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(palette).toHaveCount(0)
  await expect(fullscreen).toBeVisible()
  await expect(fullscreen.getByRole('button', { name: 'Close', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(fullscreen).toHaveCount(0)
})
