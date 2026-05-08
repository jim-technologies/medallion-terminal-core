import type { Meta, StoryObj } from '@storybook/react'
import { Gauge } from './Gauge'

const meta: Meta<typeof Gauge> = {
  title: 'Widgets/Gauge',
  component: Gauge,
  decorators: [
    (Story) => (
      <div style={{ height: 200, width: 320, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Gauge>

export const Probability: Story = {
  args: {
    data: { value: 0.67, min: 0, max: 1, label: 'Yes — implied' },
  },
}

export const Sentiment: Story = {
  args: {
    data: {
      value: 0.32, min: -1, max: 1, label: 'Net sentiment (24h)',
      bands: [
        { from: -1,   to: -0.3, color: 'danger' },
        { from: -0.3, to:  0.3, color: 'warn' },
        { from:  0.3, to:  1,   color: 'ok' },
      ],
    },
  },
}

export const FleetHealth: Story = {
  args: {
    data: {
      value: 0.94, min: 0, max: 1, label: '94% green over 24h',
      bands: [
        { from: 0,    to: 0.7,  color: 'danger' },
        { from: 0.7,  to: 0.95, color: 'warn' },
        { from: 0.95, to: 1,    color: 'ok' },
      ],
    },
  },
}

export const NoBands: Story = {
  args: {
    data: { value: 0.42, min: 0, max: 1, label: 'Generic progress' },
  },
}
