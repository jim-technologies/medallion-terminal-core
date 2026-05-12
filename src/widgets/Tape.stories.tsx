import type { Meta, StoryObj } from '@storybook/react'
import { Tape } from './Tape'

const meta: Meta<typeof Tape> = {
  title: 'Widgets/Tape',
  component: Tape,
  decorators: [
    (Story) => (
      <div style={{ height: 320, width: 420, background: '#18181b', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Tape>

const t0 = Date.now()
const ts = (offset: number) => new Date(t0 - offset).toISOString()

// Mixed bid/ask prints — what a Binance / Coinbase trades feed looks
// like under the hood. The component prepends newest, flashes new
// inserts, and dedupes by id (here we omit id and rely on the
// timestamp+price+size fingerprint).
const prints = [
  { timestamp: ts(   400), side: 'buy',  price: 67843, size: 0.142 },
  { timestamp: ts(  1200), side: 'sell', price: 67841, size: 0.085 },
  { timestamp: ts(  2300), side: 'buy',  price: 67843, size: 0.310 },
  { timestamp: ts(  3800), side: 'sell', price: 67840, size: 0.220 },
  { timestamp: ts(  5100), side: 'buy',  price: 67844, size: 0.058 },
  { timestamp: ts(  6900), side: 'sell', price: 67842, size: 1.840 },
  { timestamp: ts(  9200), side: 'buy',  price: 67845, size: 0.092 },
  { timestamp: ts( 11500), side: 'sell', price: 67841, size: 0.412 },
  { timestamp: ts( 14400), side: 'buy',  price: 67845, size: 0.063 },
  { timestamp: ts( 18100), side: 'sell', price: 67840, size: 0.985 },
]

export const TradePrints: Story = { args: { data: { events: prints } } }

const headlines = [
  { id: 'n3', timestamp: ts(  2000), label: 'ETF flows: +$312M net inflow on Friday' },
  { id: 'n2', timestamp: ts( 60000), label: 'FOMC minutes: officials patient on cuts' },
  { id: 'n1', timestamp: ts(180000), label: 'Spot BTC opens at 67k; volumes light' },
]

export const NewsHeadlines: Story = { args: { data: { events: headlines } } }

export const Empty_: Story = { name: 'Empty', args: { data: [] } }
