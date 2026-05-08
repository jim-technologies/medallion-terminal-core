import type { Meta, StoryObj } from '@storybook/react'
import { Histogram } from './Histogram'

const meta: Meta<typeof Histogram> = {
  title: 'Widgets/Histogram',
  component: Histogram,
  decorators: [
    (Story) => (
      <div style={{ height: 320, width: 480, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Histogram>

// A roughly-normal distribution of daily returns (in %).
const returns = Array.from({ length: 1000 }, () => {
  // Box-Muller, scaled to look like ±2% daily.
  const u1 = Math.random(); const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return z * 1.2 + 0.05
})

export const ReturnsDistribution: Story = {
  args: { data: returns },
}

export const Latencies: Story = {
  args: {
    data: Array.from({ length: 500 }, () => 30 + Math.random() * Math.random() * 200),
    options: { bins: 30 },
  },
}

export const PreBinned: Story = {
  args: {
    data: [
      { bin: '<-2', count:  4 },
      { bin: '-2..-1', count: 38 },
      { bin: '-1..0', count: 162 },
      { bin: '0..1', count: 198 },
      { bin: '1..2', count:  72 },
      { bin: '>2', count:  6 },
    ],
  },
}
