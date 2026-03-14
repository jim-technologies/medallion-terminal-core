import type { Meta, StoryObj } from '@storybook/react'
import { Candlestick } from './Candlestick'

const meta: Meta<typeof Candlestick> = {
  title: 'Widgets/Candlestick',
  component: Candlestick,
  decorators: [
    (Story) => (
      <div style={{ height: 400, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Candlestick>

export const WithVolume: Story = {
  name: 'OHLCV (With Volume)',
  args: {
    data: [
      { timestamp: '2024-03-01', open: 61800, high: 63200, low: 61400, close: 62400, volume: 28500 },
      { timestamp: '2024-03-02', open: 62400, high: 63800, low: 62100, close: 63100, volume: 31200 },
      { timestamp: '2024-03-03', open: 63100, high: 65200, low: 62800, close: 64900, volume: 42300 },
      { timestamp: '2024-03-04', open: 64900, high: 67500, low: 64200, close: 66800, volume: 55100 },
      { timestamp: '2024-03-05', open: 66800, high: 68200, low: 66500, close: 67500, volume: 48700 },
      { timestamp: '2024-03-06', open: 67500, high: 67900, low: 66800, close: 67200, volume: 35600 },
      { timestamp: '2024-03-07', open: 67200, high: 67500, low: 65800, close: 66100, volume: 38900 },
      { timestamp: '2024-03-08', open: 66100, high: 66500, low: 64900, close: 65400, volume: 41200 },
      { timestamp: '2024-03-09', open: 65400, high: 67200, low: 65100, close: 66900, volume: 36800 },
      { timestamp: '2024-03-10', open: 66900, high: 68500, low: 66700, close: 68100, volume: 44500 },
      { timestamp: '2024-03-11', open: 68100, high: 69200, low: 67800, close: 68900, volume: 52100 },
      { timestamp: '2024-03-12', open: 68900, high: 72500, low: 68400, close: 71800, volume: 78300 },
      { timestamp: '2024-03-13', open: 71800, high: 73400, low: 71200, close: 72900, volume: 65400 },
      { timestamp: '2024-03-14', open: 72900, high: 73800, low: 72100, close: 73100, volume: 58900 },
    ],
  },
}

export const OHLCOnly: Story = {
  name: 'OHLC (No Volume)',
  args: {
    data: [
      { date: '2024-03-01', o: 61800, h: 63200, l: 61400, c: 62400 },
      { date: '2024-03-04', o: 64900, h: 67500, l: 64200, c: 66800 },
      { date: '2024-03-07', o: 67200, h: 67500, l: 65800, c: 66100 },
      { date: '2024-03-10', o: 66900, h: 68500, l: 66700, c: 68100 },
      { date: '2024-03-14', o: 72900, h: 73800, l: 72100, c: 73100 },
    ],
  },
}

export const Empty: Story = {
  args: { data: null },
}
