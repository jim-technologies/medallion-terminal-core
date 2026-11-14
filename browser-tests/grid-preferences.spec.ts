import { expect, test, type Page } from '@playwright/test'

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

test('different grid state keys do not share widths', async ({ page }) => {
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
})

test('unkeyed grids ignore scoped widths and do not persist', async ({ page }) => {
  const open = (key: string) => page.goto(`/iframe.html?id=toolkit-workbench-datagrid--scroll-ownership&viewMode=story&args=count:50;bounded:true;stateKey:${key}`)
  const header = page.getByRole('grid', { name: 'Scroll ownership rows' }).locator('[data-cell="-1:1"]')
  await open('first')
  await header.focus()
  await page.keyboard.press('Alt+ArrowRight')
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(216)
  const scopedWidth = await page.evaluate(() => {
    const stored = JSON.parse(sessionStorage.getItem('mtc:grid-widths:v1') ?? '[]') as [string, Record<string, number>][]
    return stored.find(([key]) => key === 'first')?.[1]['sequence']
  })
  expect(scopedWidth).toBe(216)
  await open('')
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(200)
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

async function resizePointer(page: Page, type: string, pointerId: number, clientX: number) {
  await page.evaluate(({ type, pointerId, clientX }) => {
    document.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId, clientX }))
  }, { type, pointerId, clientX })
}

test('column resize cancellation restores the width and retires the gesture', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--growing-column-widths&viewMode=story')
  const header = page.getByRole('grid', { name: 'Growing columns' }).locator('[data-cell="-1:0"]')
  await expect(header).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  const initial = (await header.boundingBox())!.width
  await header.locator('.mtc-data-grid-resize').dispatchEvent('pointerdown', { pointerId: 17, clientX: 100 })
  await resizePointer(page, 'pointermove', 17, 150)
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial + 50)
  await resizePointer(page, 'pointercancel', 17, 150)
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial)
  await resizePointer(page, 'pointermove', 17, 200)
  await resizePointer(page, 'pointerup', 17, 200)
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial)
  await page.reload()
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial)
})

test('column resize belongs only to the initiating pointer', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--growing-column-widths&viewMode=story')
  const header = page.getByRole('grid', { name: 'Growing columns' }).locator('[data-cell="-1:0"]')
  await expect(header).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  const initial = (await header.boundingBox())!.width
  await header.locator('.mtc-data-grid-resize').dispatchEvent('pointerdown', { pointerId: 17, clientX: 100 })
  await resizePointer(page, 'pointermove', 17, 132)
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial + 32)
  await resizePointer(page, 'pointermove', 18, 180)
  await resizePointer(page, 'pointerup', 18, 180)
  await resizePointer(page, 'pointercancel', 18, 180)
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial + 32)
  await resizePointer(page, 'pointermove', 17, 148)
  await resizePointer(page, 'pointerup', 17, 148)
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial + 48)
  await page.reload()
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial + 48)
})

test('column resize unmount never saves a detached gesture', async ({ page }) => {
  await page.goto('/iframe.html?id=toolkit-workbench-datagrid--resize-lifecycle&viewMode=story')
  const grid = page.getByRole('grid', { name: 'Resize lifecycle' })
  const header = grid.locator('[data-cell="-1:0"]')
  await expect(header).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  const initial = (await header.boundingBox())!.width
  await header.locator('.mtc-data-grid-resize').dispatchEvent('pointerdown', { pointerId: 17, clientX: 100 })
  await resizePointer(page, 'pointermove', 17, 150)
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial + 50)
  const hide = page.getByRole('button', { name: 'Hide grid', exact: true })
  await hide.focus()
  await hide.press('Enter')
  await expect(grid).toHaveCount(0)
  await resizePointer(page, 'pointermove', 17, 200)
  await resizePointer(page, 'pointerup', 17, 200)
  await page.getByRole('button', { name: 'Show grid', exact: true }).click()
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial)
  await page.reload()
  await expect.poll(async () => (await header.boundingBox())!.width).toBe(initial)
})
