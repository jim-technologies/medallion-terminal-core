import type { Meta, StoryObj } from '@storybook/react'
import { Distribution } from './Distribution'

const meta: Meta<typeof Distribution> = {
  title: 'Widgets/Distribution',
  component: Distribution,
  decorators: [
    (Story) => (
      <div style={{ height: 280, width: 320, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Distribution>

export const Allocation: Story = {
  args: {
    data: {
      slices: [
        { label: 'BTC',   value: 42.8, color: 'info' },
        { label: 'ETH',   value: 24.6, color: 'info' },
        { label: 'SOL',   value: 12.4, color: 'info' },
        { label: 'Cash',  value: 14.2, color: 'muted' },
        { label: 'Other', value:  6.0, color: 'muted' },
      ],
    },
  },
}

export const Sentiment: Story = {
  args: {
    data: {
      slices: [
        { label: 'Bull', value: 0.62, color: 'ok' },
        { label: 'Bear', value: 0.38, color: 'danger' },
      ],
    },
  },
}

export const BookShare: Story = {
  args: {
    data: {
      slices: [
        { label: 'Yes', value: 1240000, color: 'ok' },
        { label: 'No',  value: 1716000, color: 'danger' },
      ],
    },
  },
}

export const ManySlices: Story = {
  args: {
    data: {
      slices: Array.from({ length: 8 }, (_, i) => ({
        label: `Topic ${i + 1}`,
        value: Math.round(100 * Math.random()) + 10,
      })),
    },
  },
}
