import type { Meta, StoryObj } from '@storybook/react'
import { Metric } from './Metric'

const meta: Meta<typeof Metric> = {
  title: 'Widgets/Metric',
  component: Metric,
  decorators: [
    (Story) => (
      <div style={{ height: 120, width: 250, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Metric>

export const Full: Story = {
  name: 'With Delta and Unit',
  args: {
    data: { value: 73100, delta: 2.18, unit: 'USD', label: 'Current Price' },
  },
}

export const Minimal: Story = {
  name: 'Raw Number',
  args: {
    data: 42069,
  },
}

export const NegativeDelta: Story = {
  args: {
    data: { value: 3456.80, delta: -4.52, unit: 'USD' },
  },
}

export const LargeNumber: Story = {
  args: {
    data: { value: 1430000000000, delta: 1.85, unit: 'USD' },
  },
}

export const Percentage: Story = {
  args: {
    data: { value: 54.2, delta: -0.3, unit: '%' },
  },
}
