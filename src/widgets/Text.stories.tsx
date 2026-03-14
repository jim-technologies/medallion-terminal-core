import type { Meta, StoryObj } from '@storybook/react'
import { Text } from './Text'

const meta: Meta<typeof Text> = {
  title: 'Widgets/Text',
  component: Text,
  decorators: [
    (Story) => (
      <div style={{ height: 350, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Text>

export const NewsFeed: Story = {
  args: {
    data: [
      {
        title: 'Bitcoin Breaks $73K as ETF Inflows Hit Record',
        source: 'CoinDesk',
        date: 'Mar 14',
        body: 'Bitcoin surged past $73,000 for the first time as spot ETF products saw $1.05B in single-day inflows.',
        tags: ['BTC', 'ETF'],
      },
      {
        title: 'Ethereum Dencun Upgrade Goes Live',
        source: 'The Block',
        date: 'Mar 13',
        body: 'The long-awaited Dencun upgrade activated on mainnet, introducing proto-danksharding.',
        tags: ['ETH', 'L2'],
      },
      {
        title: 'SEC Delays Decision on Solana ETF Filing',
        source: 'Bloomberg',
        date: 'Mar 12',
        body: 'The SEC extended its review period for the VanEck Solana Trust application by 45 days.',
        tags: ['SOL', 'Regulation'],
      },
    ],
  },
}

export const SingleArticle: Story = {
  name: 'Single Article',
  args: {
    data: {
      title: 'Bullish Momentum Continues',
      body: "Bitcoin's 30-day rally from $52K to $73K represents a 40% gain driven primarily by institutional ETF flows and pre-halving accumulation. Key support sits at $67K (20-day EMA). The Fear & Greed Index reads 82 (Extreme Greed).",
    },
  },
}

export const PlainText: Story = {
  name: 'Plain String',
  args: {
    data: 'This is a simple text block. You can use it for any freeform content — alerts, descriptions, or status messages.',
  },
}

export const Empty: Story = {
  args: { data: null },
}
