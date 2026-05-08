import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton, ErrorState } from './states'

const meta: Meta<typeof Skeleton> = {
  title: 'Widgets/States',
  component: Skeleton,
  decorators: [
    (Story) => (
      <div style={{ height: 320, width: 460, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const ChartLoading: Story = { name: 'Loading — chart',  args: { component: 'timeseries' } }
export const TableLoading: Story = { name: 'Loading — table',  args: { component: 'table' } }
export const ListLoading: Story  = { name: 'Loading — list',   args: { component: 'events' } }
export const SingleLoading: Story = { name: 'Loading — single',  args: { component: 'gauge' } }
export const DonutLoading: Story = { name: 'Loading — donut',  args: { component: 'distribution' } }
export const GridLoading: Story  = { name: 'Loading — grid',   args: { component: 'heatmap' } }
export const Generic: Story      = { name: 'Loading — generic', args: { component: 'unknown-component' } }

export const Error: StoryObj<typeof ErrorState> = {
  name: 'Error state',
  render: (args) => <ErrorState {...args} />,
  args: { message: 'HTTP 503 — backend unavailable' },
}
