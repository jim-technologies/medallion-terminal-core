import type { Meta, StoryObj } from '@storybook/react'
import { PairedGrid } from './PairedGrid'

const meta: Meta<typeof PairedGrid> = {
  title: 'Widgets/PairedGrid',
  component: PairedGrid,
  decorators: [
    (Story) => (
      <div style={{ height: 480, width: 720, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof PairedGrid>

export const OptionsChain: Story = {
  args: {
    data: {
      subject: 'BTC',
      dimension: '2026-06-27',
      subject_value: 67842,
      venue: 'deribit',
      left_label: 'Calls',
      right_label: 'Puts',
      key_label: 'Strike',
      measures: [
        { key: 'iv', label: 'IV', format: 'percent' },
        { key: 'delta', label: 'Δ' },
        { key: 'bid', label: 'Bid', format: 'compact' },
        { key: 'ask', label: 'Ask', format: 'compact' },
      ],
      rows: [
        { key: 50000, left: { values: { iv: 0.78, delta:  0.94, bid: 18450, ask: 18550 } }, right: { values: { iv: 0.75, delta: -0.06, bid:    80, ask:   100 } } },
        { key: 55000, left: { values: { iv: 0.71, delta:  0.88, bid: 13680, ask: 13780 } }, right: { values: { iv: 0.68, delta: -0.12, bid:   240, ask:   280 } } },
        { key: 60000, left: { values: { iv: 0.66, delta:  0.79, bid:  9220, ask:  9320 } }, right: { values: { iv: 0.63, delta: -0.21, bid:   680, ask:   720 } } },
        { key: 65000, left: { values: { iv: 0.62, delta:  0.66, bid:  5540, ask:  5620 } }, right: { values: { iv: 0.60, delta: -0.34, bid:  1840, ask:  1900 } } },
        { key: 67500, left: { values: { iv: 0.60, delta:  0.58, bid:  4180, ask:  4240 } }, right: { values: { iv: 0.59, delta: -0.42, bid:  2620, ask:  2680 } } },
        { key: 70000, left: { values: { iv: 0.59, delta:  0.49, bid:  3120, ask:  3180 } }, right: { values: { iv: 0.58, delta: -0.51, bid:  3540, ask:  3600 } } },
        { key: 72500, left: { values: { iv: 0.58, delta:  0.41, bid:  2280, ask:  2340 } }, right: { values: { iv: 0.57, delta: -0.59, bid:  4680, ask:  4760 } } },
        { key: 75000, left: { values: { iv: 0.57, delta:  0.33, bid:  1640, ask:  1700 } }, right: { values: { iv: 0.56, delta: -0.67, bid:  5980, ask:  6080 } } },
        { key: 80000, left: { values: { iv: 0.56, delta:  0.20, bid:   820, ask:   860 } }, right: { values: { iv: 0.54, delta: -0.80, bid:  9120, ask:  9240 } } },
        { key: 85000, left: { values: { iv: 0.55, delta:  0.11, bid:   380, ask:   420 } }, right: { values: { iv: 0.53, delta: -0.89, bid: 12420, ask: 12560 } } },
      ],
    },
  },
}

export const SportsbookSpread: Story = {
  args: {
    data: {
      subject: 'Lakers vs Celtics',
      dimension: 'Spread (pts)',
      left_label: 'Lakers',
      right_label: 'Celtics',
      key_label: 'Line',
      venue: 'draftkings',
      measures: [{ key: 'odds', label: 'Odds' }],
      rows: [
        { key: -7.5, left: { values: { odds: 2.45 } }, right: { values: { odds: 1.62 } } },
        { key: -3.5, left: { values: { odds: 1.95 } }, right: { values: { odds: 1.91 } } },
        { key:  0,   left: { values: { odds: 1.83 } }, right: { values: { odds: 2.05 } } },
        { key:  3.5, left: { values: { odds: 1.65 } }, right: { values: { odds: 2.35 } } },
        { key:  7.5, left: { values: { odds: 1.42 } }, right: { values: { odds: 2.85 } } },
      ],
    },
  },
}

// Demonstrates the shape covers non-quote use cases too: A/B test
// at percentile, with mean and p-value as the declared measures.
export const ABTestPercentiles: Story = {
  args: {
    data: {
      subject: 'Checkout-button-color test',
      dimension: 'Conversion rate by percentile',
      left_label: 'Variant A',
      right_label: 'Variant B',
      key_label: 'Percentile',
      measures: [
        { key: 'mean', label: 'Mean', format: 'percent' },
        { key: 'p_value', label: 'p' },
      ],
      rows: [
        { key:  50, left: { values: { mean: 0.082, p_value: 0.42 } }, right: { values: { mean: 0.084, p_value: 0.42 } } },
        { key:  75, left: { values: { mean: 0.115, p_value: 0.18 } }, right: { values: { mean: 0.128, p_value: 0.18 } } },
        { key:  90, left: { values: { mean: 0.142, p_value: 0.04 } }, right: { values: { mean: 0.171, p_value: 0.04 } } },
        { key:  95, left: { values: { mean: 0.158, p_value: 0.02 } }, right: { values: { mean: 0.192, p_value: 0.02 } } },
        { key:  99, left: { values: { mean: 0.182, p_value: 0.01 } }, right: { values: { mean: 0.218, p_value: 0.01 } } },
      ],
    },
  },
}
