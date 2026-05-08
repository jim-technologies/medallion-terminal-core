import type { Meta, StoryObj } from '@storybook/react'
import { Scatter } from './Scatter'

const meta: Meta<typeof Scatter> = {
  title: 'Widgets/Scatter',
  component: Scatter,
  decorators: [
    (Story) => (
      <div style={{ height: 360, width: 480, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Scatter>

export const RiskReward: Story = {
  args: {
    data: [
      { x: 0.12, y: 0.18, label: 'BTC', size: 1334, color: 'info' },
      { x: 0.18, y: 0.21, label: 'ETH', size:  416, color: 'info' },
      { x: 0.24, y: 0.32, label: 'SOL', size:   78, color: 'info' },
      { x: 0.08, y: 0.07, label: 'GLD', size:  220, color: 'muted' },
      { x: 0.14, y: 0.11, label: 'SPY', size: 4500, color: 'ok' },
      { x: 0.16, y: 0.13, label: 'QQQ', size: 2800, color: 'ok' },
      { x: 0.32, y: 0.42, label: 'PEPE', size:  18, color: 'warn' },
    ],
  },
}

export const IvDelta: Story = {
  args: {
    data: [
      { x: 0.06, y: 0.78 }, { x: 0.12, y: 0.71 }, { x: 0.21, y: 0.66 },
      { x: 0.34, y: 0.62 }, { x: 0.42, y: 0.60 }, { x: 0.51, y: 0.59 },
      { x: 0.59, y: 0.58 }, { x: 0.67, y: 0.57 }, { x: 0.80, y: 0.56 },
      { x: 0.89, y: 0.55 }, { x: 0.94, y: 0.55 },
    ],
  },
}
