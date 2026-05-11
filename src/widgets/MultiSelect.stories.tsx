import type { Meta, StoryObj } from '@storybook/react'
import { MultiSelect } from './MultiSelect'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'

const meta: Meta<typeof MultiSelect> = {
  title: 'Widgets/MultiSelect',
  component: MultiSelect,
  decorators: [
    (Story) => (
      <DashboardContext.Provider value={DEFAULT_DASHBOARD_CONTEXT}>
        <div style={{ height: 100, width: 360, background: '#18181b', padding: 12, borderRadius: 8 }}>
          <Story />
        </div>
      </DashboardContext.Provider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof MultiSelect>

export const Venues: Story = {
  args: { options: { key: 'venues', label: 'Venues', choices: ['binance', 'coinbase', 'kraken', 'okx', 'bybit'] } },
}

export const Tags: Story = {
  args: {
    options: {
      key: 'tags',
      label: 'Filter Tags',
      choices: [
        { value: 'crypto',    label: 'Crypto' },
        { value: 'options',   label: 'Options' },
        { value: 'futures',   label: 'Futures' },
        { value: 'sentiment', label: 'Sentiment' },
      ],
    },
  },
}
