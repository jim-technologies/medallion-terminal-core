import type { Meta, StoryObj } from '@storybook/react'
import { Prompt } from './Prompt'
import { DashboardContext } from '../core/DashboardContext'

const meta: Meta<typeof Prompt> = {
  title: 'Widgets/Prompt',
  component: Prompt,
  decorators: [
    (Story) => (
      <DashboardContext.Provider
        value={{
          dispatch: () => {},
          ctx: { symbol: 'BTC' },
          setCtx: () => {},
          widgets: [],
          toast: () => {},
          compact: false,
          fullscreenId: null,
          setFullscreenId: () => {},
        }}
      >
        <div style={{ height: 100, width: 520, background: '#18181b', padding: 12, borderRadius: 8 }}>
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
