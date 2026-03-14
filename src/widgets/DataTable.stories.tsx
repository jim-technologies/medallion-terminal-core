import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './DataTable'

const meta: Meta<typeof DataTable> = {
  title: 'Widgets/DataTable',
  component: DataTable,
  decorators: [
    (Story) => (
      <div style={{ height: 350, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DataTable>

export const ArrayOfObjects: Story = {
  name: 'Array of Objects (Auto Columns)',
  args: {
    data: [
      { Asset: 'BTC', Price: 73100, '24h %': 2.18, Holdings: 1.5, Value: 109650 },
      { Asset: 'ETH', Price: 3980, '24h %': -0.54, Holdings: 15, Value: 59700 },
      { Asset: 'SOL', Price: 178.25, '24h %': 4.67, Holdings: 200, Value: 35650 },
      { Asset: 'DOGE', Price: 0.1834, '24h %': -1.23, Holdings: 50000, Value: 9170 },
      { Asset: 'LINK', Price: 19.45, '24h %': 3.12, Holdings: 500, Value: 9725 },
    ],
  },
}

export const ExplicitSchema: Story = {
  name: 'Explicit Columns + Rows',
  args: {
    data: {
      columns: ['Country', 'Population', 'GDP (B)', 'Growth %'],
      rows: [
        ['United States', 331000000, 25460, 2.1],
        ['China', 1412000000, 17960, 5.2],
        ['Japan', 125000000, 4230, 1.9],
        ['Germany', 83200000, 4070, 1.8],
        ['India', 1408000000, 3390, 6.8],
      ],
    },
  },
}

export const Empty: Story = {
  args: { data: null },
}
