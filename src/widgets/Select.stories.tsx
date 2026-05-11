import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'

const meta: Meta<typeof Select> = {
  title: 'Widgets/Select',
  component: Select,
  decorators: [
    (Story) => (
      <DashboardContext.Provider value={DEFAULT_DASHBOARD_CONTEXT}>
        <div style={{ height: 100, width: 240, background: '#18181b', padding: 12, borderRadius: 8 }}>
          <Story />
        </div>
      </DashboardContext.Provider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Select>

export const StringChoices: Story = {
  args: { options: { key: 'venue', label: 'Venue', choices: ['binance', 'coinbase', 'kraken', 'okx', 'bybit'] } },
}

export const ObjectChoices: Story = {
  args: {
    options: {
      key: 'strategy',
      label: 'Strategy',
      choices: [
        { value: 'mom',   label: 'Momentum' },
        { value: 'mr',    label: 'Mean reversion' },
        { value: 'arb',   label: 'Arbitrage' },
        { value: 'vol',   label: 'Vol harvesting' },
      ],
      default: 'mom',
    },
  },
}

export const NoKey: Story = { args: { options: {} } }
