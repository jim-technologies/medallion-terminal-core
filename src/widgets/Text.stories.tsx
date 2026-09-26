import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import { Text } from './Text'

const meta: Meta<typeof Text> = {
  title: 'Widgets/Text',
  component: Text,
  decorators: [
    (Story) => (
      <div style={{ height: 350, margin: 16, background: 'var(--mtc-surface)', border: '1px solid var(--mtc-border)', padding: 16, borderRadius: 'var(--mtc-radius-md)' }}>
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
        source: 'Market Wire',
        date: 'Mar 14',
        body: 'Bitcoin surged past $73,000 for the first time as spot ETF products saw $1.05B in single-day inflows.',
        tags: ['BTC', 'ETF'],
      },
      {
        title: 'Ethereum Dencun Upgrade Goes Live',
        source: 'Protocol Desk',
        date: 'Mar 13',
        body: 'The long-awaited Dencun upgrade activated on mainnet, introducing proto-danksharding.',
        tags: ['ETH', 'L2'],
      },
      {
        title: 'SEC Delays Decision on Solana ETF Filing',
        source: 'Market Wire',
        date: 'Mar 12',
        body: 'The SEC extended its review period for the Solana ETF application by 45 days.',
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

// Bodies are Markdown by default: headings, lists, emphasis, code and
// links render, and anything unsafe (script, event handlers, javascript:
// links) is stripped. `options.markdown: false` shows the raw text.
export const MarkdownBody: Story = {
  name: 'Markdown body',
  args: {
    data: {
      title: 'Morning brief',
      meta: 'Research desk · 07:30',
      body: [
        'Rates held; **the curve steepened** by 6 bp.',
        '',
        '- Watch `2s10s` into the auction',
        '- Funding stayed [calm](https://example.com/funding)',
        '',
        '<span onclick="alert(1)">Inline HTML keeps its text, not its handlers.</span> [unsafe](javascript:alert(1))',
      ].join('\n'),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('the curve steepened')).toHaveProperty('tagName', 'STRONG')
    await expect(canvas.getByText('2s10s')).toHaveProperty('tagName', 'CODE')
    await expect(canvas.getByRole('link', { name: 'calm' })).toHaveAttribute('href', 'https://example.com/funding')
    await expect(canvas.getByText('Inline HTML keeps its text, not its handlers.')).not.toHaveAttribute('onclick')
    await expect(canvasElement.querySelector('a[href^="javascript"]')).toBeNull()
  },
}

export const RawText: Story = {
  name: 'Markdown off',
  args: {
    options: { markdown: false },
    data: { title: 'Raw note', body: 'Shown as typed: **not bold**, `not code`.' },
  },
  play: async ({ canvasElement }) => {
    await expect(await within(canvasElement).findByText('Shown as typed: **not bold**, `not code`.')).toBeVisible()
  },
}

export const Empty: Story = {
  args: { data: null },
}
