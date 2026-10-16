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
