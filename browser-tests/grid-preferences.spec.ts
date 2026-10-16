import { expect, test } from '@playwright/test'

test('explicitly scoped grid column widths survive refresh', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--scroll-ownership&viewMode=story&args=count:50;bounded:true')
  const header = page.getByRole('grid', { name: 'Scroll ownership rows' }).locator('[data-cell="-1:1"]')
  const original = (await header.boundingBox())!.width
  await header.focus()
  await page.keyboard.press('Alt+ArrowRight')
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(original + 16)
  await page.reload()
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(original + 16)
})

test('different grid state keys do not share widths and unkeyed grids do not persist', async ({ page }) => {
  const open = (key: string) => page.goto(`/iframe.html?id=toolkit-workbench-datagrid--scroll-ownership&viewMode=story&args=count:50;bounded:true;stateKey:${key}`)
  const header = page.getByRole('grid', { name: 'Scroll ownership rows' }).locator('[data-cell="-1:1"]')
  await open('first')
  await header.focus()
  await page.keyboard.press('Alt+ArrowRight')
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(216)
  await open('second')
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(200)
  await open('first')
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(216)
  await open('')
  await header.focus()
  await page.keyboard.press('Alt+ArrowRight')
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(216)
  await page.reload()
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(200)
})

for (const mode of ['keyboard', 'pointer']) test(`growing columns resize from their visible width with ${mode}`, async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--growing-column-widths&viewMode=story')
  const grid = page.getByRole('grid', { name: 'Growing columns' })
  const header = grid.locator('[data-cell="-1:0"]')
  const initial = (await header.boundingBox())!.width
  expect(initial).toBeGreaterThan(500)
  if (mode === 'keyboard') {
    await header.focus()
    await page.keyboard.press('Alt+ArrowRight')
  } else {
    const grip = (await header.locator('.mtc-data-grid-resize').boundingBox())!
    await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2)
    await page.mouse.down()
    await page.mouse.move(grip.x + grip.width / 2 + 16, grip.y + grip.height / 2, { steps: 4 })
    await page.mouse.up()
  }
  await expect.poll(async () => Math.abs((await header.boundingBox())!.width - initial - 16)).toBeLessThanOrEqual(1)
  await page.reload()
  await expect.poll(async () => Math.abs((await header.boundingBox())!.width - initial - 16)).toBeLessThanOrEqual(1)
  await header.focus()
  await page.keyboard.press('Alt+ArrowLeft')
  await page.keyboard.press('Alt+ArrowLeft')
  await expect.poll(async () => Math.abs((await header.boundingBox())!.width - initial)).toBeLessThanOrEqual(1)
})
