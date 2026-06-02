import type { Meta, StoryObj } from '@storybook/react'
import { ExportMenu } from './ExportMenu'

// The export affordance in isolation. In a live terminal it lives in
// the widget action menu (WidgetShell) — every data widget gets it — but
// it is also exported standalone for custom widget authors.
const meta: Meta<typeof ExportMenu> = {
  title: 'BI/ExportMenu',
  component: ExportMenu,
  decorators: [
    (Story) => (
      <div style={{ height: 220, width: 280, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Story />
        </div>
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof ExportMenu>

const positions = [
  { asset: 'BTC', qty: 1.5, price: 73100, pnl: 0.034 },
  { asset: 'ETH', qty: 12, price: 3980, pnl: -0.012 },
  { asset: 'SOL', qty: 240, price: 168, pnl: 0.081 },
]

export const Table: Story = {
  args: {
    view: { data: positions, component: 'table' },
    filenameBase: 'positions',
  },
}

export const Timeseries: Story = {
  args: {
    view: {
      data: {
        points: [
          { timestamp: '2026-01-01', value: 100 },
          { timestamp: '2026-01-02', value: 104 },
          { timestamp: '2026-01-03', value: 101 },
        ],
      },
      component: 'timeseries',
    },
    filenameBase: 'equity-curve',
  },
}

export const Empty: Story = {
  args: {
    view: { data: [], component: 'table' },
  },
}
