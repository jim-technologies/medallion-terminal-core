import type { Meta, StoryObj } from '@storybook/react'
import { Catalog } from './Catalog'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'

const meta: Meta<typeof Catalog> = {
  title: 'Widgets/Catalog',
  component: Catalog,
  decorators: [
    (Story) => (
      <div style={{ height: 480, width: 460, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Catalog>

// Mock fetch so the story runs without a real backend.
function withMockFetch(response: object) {
  return (Story: () => React.ReactNode) => {
    const original = window.fetch
    window.fetch = (() =>
      Promise.resolve(
        new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )) as typeof window.fetch
    setTimeout(() => { window.fetch = original }, 30000)
    return (
      <DashboardContext.Provider
        value={{ ...DEFAULT_DASHBOARD_CONTEXT, backendUrl: 'https://mock' }}
      >
        <Story />
      </DashboardContext.Provider>
    )
  }
}

export const Populated: Story = {
  decorators: [
    withMockFetch({
      sources: [
        { id: 'btc_ohlcv', name: 'Bitcoin OHLCV', description: 'Hourly candles for BTC', shape: 'SHAPE_CANDLES', streamable: true, params: [{ key: 'range', description: '1d, 1w, 1m', required: false }], tags: ['crypto'] },
        { id: 'eth_ohlcv', name: 'Ethereum OHLCV', shape: 'SHAPE_CANDLES', streamable: true, tags: ['crypto'] },
        { id: 'btc_spot',  name: 'Bitcoin spot price', shape: 'SHAPE_METRIC', streamable: true, tags: ['crypto'] },
        { id: 'twitter_sentiment', name: 'Twitter sentiment', shape: 'SHAPE_GAUGE', params: [{ key: 'symbol', required: true }], tags: ['sentiment'] },
        { id: 'cron_health', shape: 'SHAPE_HEATMAP', description: '24h job × hour grid', tags: ['ops'] },
        { id: 'workflow_status', shape: 'SHAPE_EVENTS', tags: ['ops'] },
        { id: 'news_feed', name: 'News feed', shape: 'SHAPE_TEXT', params: [{ key: 'symbol' }] },
      ],
    }),
  ],
  args: {},
}

export const NoBackend: Story = {
  decorators: [
    (Story) => (
      <DashboardContext.Provider value={DEFAULT_DASHBOARD_CONTEXT}>
        <Story />
      </DashboardContext.Provider>
    ),
  ],
  args: {},
}

export const Empty_: Story = {
  name: 'Empty (no sources)',
  decorators: [withMockFetch({ sources: [] })],
  args: {},
}
