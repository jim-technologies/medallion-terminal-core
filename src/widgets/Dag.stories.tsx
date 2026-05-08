import type { Meta, StoryObj } from '@storybook/react'
import { Dag } from './Dag'

const meta: Meta<typeof Dag> = {
  title: 'Widgets/Dag',
  component: Dag,
  decorators: [
    (Story) => (
      <div style={{ height: 480, width: 760, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Dag>

export const DataPipeline: Story = {
  args: {
    data: {
      nodes: [
        { id: 'raw_trades',  label: 'raw_trades',  status: 'ok' },
        { id: 'raw_quotes',  label: 'raw_quotes',  status: 'ok' },
        { id: 'features',    label: 'features',    status: 'running' },
        { id: 'signals',     label: 'signals',     status: 'pending' },
        { id: 'positions',   label: 'positions',   status: 'pending' },
        { id: 'pnl',         label: 'daily_pnl',   status: 'pending' },
        { id: 'risk',        label: 'risk_report', status: 'pending' },
        { id: 'reports',     label: 'reports',     status: 'pending' },
      ],
      edges: [
        { from: 'raw_trades',  to: 'features' },
        { from: 'raw_quotes',  to: 'features' },
        { from: 'features',    to: 'signals' },
        { from: 'signals',     to: 'positions' },
        { from: 'positions',   to: 'pnl' },
        { from: 'positions',   to: 'risk' },
        { from: 'pnl',         to: 'reports' },
        { from: 'risk',        to: 'reports' },
      ],
    },
  },
}

export const WithFailure: Story = {
  args: {
    data: {
      nodes: [
        { id: 'a', label: 'extract', status: 'ok' },
        { id: 'b', label: 'transform', status: 'error' },
        { id: 'c', label: 'load', status: 'pending' },
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
      ],
    },
  },
}
