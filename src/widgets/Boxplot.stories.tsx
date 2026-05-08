import type { Meta, StoryObj } from '@storybook/react'
import { Boxplot } from './Boxplot'

const meta: Meta<typeof Boxplot> = {
  title: 'Widgets/Boxplot',
  component: Boxplot,
  decorators: [
    (Story) => (
      <div style={{ height: 360, width: 640, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Boxplot>

// Box-Muller-ish samples around different means/stds.
function gaussian(n: number, mean: number, std: number): number[] {
  return Array.from({ length: n }, () => {
    const u1 = Math.random(); const u2 = Math.random()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return mean + z * std
  })
}

export const StrategyReturns: Story = {
  args: {
    data: [
      { label: 'Mom',     values: gaussian(200,  0.8, 1.4) },
      { label: 'MeanRev', values: gaussian(200,  0.3, 0.9) },
      { label: 'Arb',     values: gaussian(200,  0.4, 0.4) },
      { label: 'Vol',     values: gaussian(200, -0.2, 2.1) },
      { label: 'Carry',   values: gaussian(200,  0.5, 0.7) },
    ],
  },
}

export const PreComputed: Story = {
  args: {
    data: [
      { label: 'Q1', min: -2.4, q1: -0.6, median: 0.2, q3: 0.9, max: 2.1, outliers: [-3.4, 3.2] },
      { label: 'Q2', min: -1.8, q1: -0.3, median: 0.4, q3: 1.1, max: 2.4 },
      { label: 'Q3', min: -2.9, q1: -0.8, median: 0.1, q3: 0.7, max: 1.9, outliers: [-3.8] },
      { label: 'Q4', min: -1.5, q1: -0.2, median: 0.5, q3: 1.3, max: 2.6 },
    ],
  },
}
