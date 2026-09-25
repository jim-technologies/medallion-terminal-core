import type { Meta, StoryObj } from '@storybook/react'
import { Prompt } from './Prompt'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'

const meta: Meta<typeof Prompt> = {
  title: 'Widgets/Prompt',
  component: Prompt,
  decorators: [
    (Story) => (
      <DashboardContext.Provider
        value={{ ...DEFAULT_DASHBOARD_CONTEXT, ctx: { symbol: 'BTC' } }}
      >
        <div style={{ height: 100, width: 520, margin: 16, background: 'var(--mtc-surface)', border: '1px solid var(--mtc-border)', padding: 12, borderRadius: 'var(--mtc-radius-md)' }}>
          <Story />
        </div>
      </DashboardContext.Provider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Prompt>

// Storybook can't reach a real backend; these stories show the input
// surface only. Calling submit will hit the configured URL and fail
// (404), which Prompt renders as an inline error — also useful to see.
export const Default: Story = { args: { options: { url: '/api/generate' } } }
export const NoUrl: Story = { name: 'No URL configured', args: { options: {} } }
