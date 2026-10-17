import { chromium, type FullConfig } from '@playwright/test'

// A freshly started Storybook dev server compiles the preview, the toolkit
// and its styles on the first story request. On a busy host that first
// render outlasts an expect timeout, so whichever tests opened the first
// pages would fail on a cold server and pass on a warm one. Render one story
// before any worker starts, so every spec meets a warm server. The preview
// can show a load error or reload itself while Vite optimizes a late
// dependency; both are retried within the budget.
const STORY = '/iframe.html?id=toolkit-workbench-datagrid--scroll-ownership&viewMode=story'
const BUDGET_MS = 180_000
const ATTEMPT_MS = 60_000

export default async function warmStorybook(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL
  if (!baseURL) throw new Error('Storybook warm-up needs the project baseURL')
  const deadline = Date.now() + BUDGET_MS
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    for (;;) {
      const timeout = () => Math.max(1, Math.min(ATTEMPT_MS, deadline - Date.now()))
      try {
        await page.goto(new URL(STORY, baseURL).href, { timeout: timeout() })
        await page.waitForFunction(() => {
          const preview = (window as unknown as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } }).__STORYBOOK_PREVIEW__
          return preview?.currentRender?.phase === 'finished'
        }, undefined, { timeout: timeout() })
        return
      } catch (error) {
        if (deadline - Date.now() < 1_000) throw new Error(`Storybook did not render ${STORY} within ${BUDGET_MS / 1000}s`, { cause: error })
      }
    }
  } finally {
    await browser.close()
  }
}
