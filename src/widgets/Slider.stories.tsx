import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from './Slider'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'

const meta: Meta<typeof Slider> = {
  title: 'Widgets/Slider',
  component: Slider,
  decorators: [
    (Story) => (
      <DashboardContext.Provider value={DEFAULT_DASHBOARD_CONTEXT}>
        <div style={{ height: 100, width: 280, background: '#18181b', padding: 12, borderRadius: 8 }}>
          <Story />
        </div>
      </DashboardContext.Provider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Slider>

export const Confidence: Story = {
  args: { options: { key: 'confidence', min: 0, max: 1, step: 0.01, default: 0.7, label: 'Min Confidence' } },
}

export const Lookback: Story = {
  args: { options: { key: 'days', min: 1, max: 365, step: 1, default: 30, label: 'Lookback', unit: 'd' } },
}

export const Allocation: Story = {
  args: { options: { key: 'alloc', min: 0, max: 100, step: 1, default: 50, label: 'Allocation', unit: '%' } },
}

export const NoKey: Story = { args: { options: {} } }
