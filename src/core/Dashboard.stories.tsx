import type { Meta, StoryObj } from '@storybook/react'
import { Dashboard } from './Dashboard'
import type { Template } from '../types/template'

const meta: Meta<typeof Dashboard> = {
  title: 'Core/Dashboard',
  component: Dashboard,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Dashboard>

const fullDemo: Template = {
  title: 'Medallion Terminal',
  widgets: [
    {
      id: 'price-chart',
      component: 'timeseries',
      span: 8,
      title: 'BTC/USD Price (30D)',
      source: {
        data: [
          { timestamp: '2024-02-14', value: 52100 },
          { timestamp: '2024-02-15', value: 52450 },
          { timestamp: '2024-02-16', value: 52800 },
          { timestamp: '2024-02-17', value: 51900 },
          { timestamp: '2024-02-18', value: 52300 },
          { timestamp: '2024-02-19', value: 52700 },
          { timestamp: '2024-02-20', value: 53100 },
          { timestamp: '2024-02-21', value: 53800 },
          { timestamp: '2024-02-22', value: 54200 },
          { timestamp: '2024-02-23', value: 54600 },
          { timestamp: '2024-02-24', value: 55100 },
          { timestamp: '2024-02-25', value: 55800 },
          { timestamp: '2024-02-26', value: 56200 },
          { timestamp: '2024-02-27', value: 57100 },
          { timestamp: '2024-02-28', value: 57500 },
          { timestamp: '2024-02-29', value: 61200 },
          { timestamp: '2024-03-01', value: 62400 },
          { timestamp: '2024-03-02', value: 63100 },
          { timestamp: '2024-03-03', value: 64900 },
          { timestamp: '2024-03-04', value: 66800 },
          { timestamp: '2024-03-05', value: 67500 },
          { timestamp: '2024-03-06', value: 67200 },
          { timestamp: '2024-03-07', value: 66100 },
          { timestamp: '2024-03-08', value: 65400 },
          { timestamp: '2024-03-09', value: 66900 },
          { timestamp: '2024-03-10', value: 68100 },
          { timestamp: '2024-03-11', value: 68900 },
          { timestamp: '2024-03-12', value: 71800 },
          { timestamp: '2024-03-13', value: 72900 },
          { timestamp: '2024-03-14', value: 73100 },
        ],
      },
    },
    {
      id: 'news-feed',
      component: 'text',
      span: 4,
      title: 'Market News',
      source: {
        data: [
          {
            title: 'Bitcoin Breaks $73K as ETF Inflows Hit Record',
            source: 'CoinDesk',
            date: 'Mar 14',
            body: 'Bitcoin surged past $73,000 for the first time as spot ETF products saw $1.05B in single-day inflows, driven by institutional demand.',
            tags: ['BTC', 'ETF'],
          },
          {
            title: 'Ethereum Dencun Upgrade Goes Live',
            source: 'The Block',
            date: 'Mar 13',
            body: 'The long-awaited Dencun upgrade activated on mainnet, introducing proto-danksharding to dramatically reduce L2 transaction costs.',
            tags: ['ETH', 'L2'],
          },
          {
            title: 'SEC Delays Decision on Solana ETF Filing',
            source: 'Bloomberg',
            date: 'Mar 12',
            body: 'The Securities and Exchange Commission extended its review period for the VanEck Solana Trust application by 45 days.',
            tags: ['SOL', 'Regulation'],
          },
          {
            title: 'MicroStrategy Acquires Additional 12,000 BTC',
            source: 'Reuters',
            date: 'Mar 11',
            body: "Michael Saylor's firm purchased another 12,000 Bitcoin for approximately $821 million, bringing total holdings to 217,000 BTC.",
          },
        ],
      },
    },
    {
      id: 'btc-price',
      component: 'metric',
      span: 3,
      title: 'BTC Price',
      source: { data: { value: 73100, delta: 2.18, unit: 'USD' } },
    },
    {
      id: 'volume-24h',
      component: 'metric',
      span: 3,
      title: '24h Volume',
      source: { data: { value: 28453000000, delta: 5.23, unit: 'USD' } },
    },
    {
      id: 'market-cap',
      component: 'metric',
      span: 3,
      title: 'Market Cap',
      source: { data: { value: 1430000000000, delta: 1.85, unit: 'USD' } },
    },
    {
      id: 'dominance',
      component: 'metric',
      span: 3,
      title: 'BTC Dominance',
      source: { data: { value: 54.2, delta: -0.3, unit: '%' } },
    },
    {
      id: 'portfolio',
      component: 'table',
      span: 8,
      title: 'Portfolio Holdings',
      source: {
        data: [
          { Asset: 'BTC', Price: 73100, '24h %': 2.18, Holdings: 1.5, Value: 109650 },
          { Asset: 'ETH', Price: 3980, '24h %': -0.54, Holdings: 15, Value: 59700 },
          { Asset: 'SOL', Price: 178.25, '24h %': 4.67, Holdings: 200, Value: 35650 },
          { Asset: 'DOGE', Price: 0.1834, '24h %': -1.23, Holdings: 50000, Value: 9170 },
          { Asset: 'LINK', Price: 19.45, '24h %': 3.12, Holdings: 500, Value: 9725 },
          { Asset: 'AVAX', Price: 42.80, '24h %': 1.05, Holdings: 100, Value: 4280 },
        ],
      },
    },
    {
      id: 'analysis',
      component: 'text',
      span: 4,
      title: 'AI Market Summary',
      source: {
        data: {
          title: 'Bullish Momentum Continues',
          body: "Bitcoin's 30-day rally from $52K to $73K represents a 40% gain driven primarily by institutional ETF flows and pre-halving accumulation. Key support sits at $67K (20-day EMA). On-chain metrics show exchange reserves at 5-year lows, suggesting holders are moving to cold storage. The Fear & Greed Index reads 82 (Extreme Greed) \u2014 historically a signal for short-term corrections, but macro conditions remain favorable with rate cut expectations in Q2.",
        },
      },
    },
  ],
}

export const FullDemo: Story = {
  args: { template: fullDemo },
}

export const MetricsOnly: Story = {
  args: {
    template: {
      title: 'SaaS Metrics',
      widgets: [
        { id: 'a', component: 'metric', span: 3, title: 'Active Users', source: { data: { value: 12453, delta: 8.2 } } },
        { id: 'b', component: 'metric', span: 3, title: 'MRR', source: { data: { value: 892000, delta: 3.1, unit: 'USD' } } },
        { id: 'c', component: 'metric', span: 3, title: 'Churn', source: { data: { value: 2.4, delta: -0.8, unit: '%' } } },
        { id: 'd', component: 'metric', span: 3, title: 'NPS', source: { data: { value: 72, delta: 4.5 } } },
      ],
    },
  },
}

export const MultiSeriesChart: Story = {
  args: {
    template: {
      title: 'Multi-Asset Comparison',
      widgets: [
        {
          id: 'multi',
          component: 'timeseries',
          span: 12,
          title: 'BTC vs ETH vs SOL (Normalized)',
          source: {
            data: [
              { timestamp: '2024-01-01', BTC: 100, ETH: 100, SOL: 100 },
              { timestamp: '2024-01-15', BTC: 105, ETH: 108, SOL: 112 },
              { timestamp: '2024-02-01', BTC: 112, ETH: 115, SOL: 95 },
              { timestamp: '2024-02-15', BTC: 118, ETH: 110, SOL: 130 },
              { timestamp: '2024-03-01', BTC: 135, ETH: 125, SOL: 145 },
              { timestamp: '2024-03-14', BTC: 140, ETH: 132, SOL: 155 },
            ],
          },
        },
      ],
    },
  },
}
