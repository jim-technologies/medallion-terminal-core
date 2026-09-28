import { useState } from 'react'
import { Button } from '../components/Button'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, waitFor } from 'storybook/test'
import { DataTable } from './DataTable'

const meta: Meta<typeof DataTable> = {
  title: 'Widgets/DataTable',
  component: DataTable,
  decorators: [
    (Story) => (
      <div style={{ height: 350, margin: 16, background: 'var(--mtc-surface)', border: '1px solid var(--mtc-border)', padding: 16, borderRadius: 'var(--mtc-radius-md)' }}>
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

const WATCHLIST_ROWS = [
  { Sym: 'BTC', Last: 67842.5, 'Chg%': 1.84, Vol: 4823, Trend: [66100, 66800, 67200, 66900, 67500, 67700, 67842] },
  { Sym: 'ETH', Last: 3456.1, 'Chg%': 0.81, Vol: 2410, Trend: [3380, 3410, 3445, 3420, 3460, 3450, 3456] },
  { Sym: 'SOL', Last: 168.2, 'Chg%': 3.92, Vol: 980, Trend: [162, 164, 166, 165, 167, 167, 168] },
  { Sym: 'LINK', Last: 14.62, 'Chg%': -0.42, Vol: 180, Trend: [15.1, 14.9, 14.7, 14.8, 14.6, 14.7, 14.62] },
  { Sym: 'DOGE', Last: 0.156, 'Chg%': 4.3, Vol: 6500, Trend: [0.148, 0.15, 0.151, 0.152, 0.153, 0.155, 0.156] },
]

/**
 * How the rendered grid fits its box: horizontal overflow, headers past the
 * visible edge, and cells whose text is cut. Measured from layout, not
 * pixels, so a column that scrolls out of view fails even when it looks
 * tidy.
 */
function gridFit(root: HTMLElement) {
  const viewport = root.querySelector<HTMLElement>('[role="grid"]')!
  const edge = viewport.getBoundingClientRect().right
  const headers = [...viewport.querySelectorAll<HTMLElement>('[role="columnheader"]')]
  const cut = (element: Element) => element instanceof HTMLElement && element.scrollWidth > element.clientWidth + 1
  const clipped = [...viewport.querySelectorAll<HTMLElement>('[role="gridcell"]')]
    .filter(cell => cut(cell) || [...cell.querySelectorAll('*')].some(cut))
    .map(cell => cell.textContent)
  return {
    overflow: viewport.scrollWidth - viewport.clientWidth,
    hiddenHeaders: headers.filter(header => header.getBoundingClientRect().right > edge + 1).map(header => header.textContent),
    clipped,
    columns: headers.map(header => header.textContent),
  }
}

// The flagship dashboard's watchlist at its desktop width (span 4 of 12 at
// 1440 px, about 420 px): every column shows, numbers whole, nothing to
// scroll sideways.
export const WatchlistFit: Story = {
  name: 'Watchlist fits its width',
  render: args => (
    <div style={{ width: 420, height: 300 }}>
      <DataTable {...args} />
    </div>
  ),
  args: {
    data: WATCHLIST_ROWS,
    options: {
      row_context: { key: 'symbol', field: 'Sym' },
      heat_columns: ['Chg%'],
      column_formats: { Last: 'currency:USD', 'Chg%': 'percent:signed:p', Vol: 'compact', Trend: 'sparkline' },
    },
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(gridFit(canvasElement).columns).toEqual(['Sym', 'Last', 'Chg%', 'Vol', 'Trend']))
    const fit = gridFit(canvasElement)
    await expect(fit.overflow).toBeLessThanOrEqual(0)
    await expect(fit.hiddenHeaders).toEqual([])
    await expect(fit.clipped).toEqual([])
  },
}

// Narrower than its content: the text column gives way, ending its names in
// an ellipsis, because that lets every column fit; the numbers stay whole.
export const NarrowFit: Story = {
  name: 'Narrow table keeps numbers whole',
  render: args => (
    <div style={{ width: 320, height: 300 }}>
      <DataTable {...args} />
    </div>
  ),
  args: {
    data: [
      { Account: 'Northwind Health Partners International', Balance: 1284500.25, Change: -0.0342 },
      { Account: 'Cobalt Logistics', Balance: 98400, Change: 0.0125 },
      { Account: 'Cedar & Pine', Balance: 2150.5, Change: 0.2 },
    ],
    options: { column_formats: { Balance: 'currency:USD', Change: 'percent:signed' } },
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(gridFit(canvasElement).columns).toHaveLength(3))
    const fit = gridFit(canvasElement)
    await expect(fit.overflow).toBeLessThanOrEqual(0)
    await expect(fit.clipped.filter(text => /\d/.test(text ?? ''))).toEqual([])
  },
}

function RowIdentityExample() {
  const [rows, setRows] = useState([
    { Label: 'Repeated', Id: 'run-1', Rank: 4 },
    { Label: 'Repeated', Id: 'run-2', Rank: 1 },
    { Label: 'Other', Id: 'run-3', Rank: 3 },
    { Label: 'Repeated', Id: 'run-4', Rank: 2 },
  ])
  const [ctx, setCtx] = useState<Record<string, string>>({})
  return (
    <DashboardContext.Provider value={{ ...DEFAULT_DASHBOARD_CONTEXT, ctx, setCtx: (key, value) => setCtx(prior => ({ ...prior, [key]: value })) }}>
      <div className="flex h-full flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setRows(prior => [...prior].reverse().map(row => ({ ...row })))}>Refresh rows</Button>
          <Button onClick={() => setRows([
            { Label: 'Repeated', Id: 'shared', Rank: 1 },
            { Label: 'Repeated', Id: 'shared', Rank: 2 },
            { Label: 'Other', Id: 'different', Rank: 3 },
          ])}>Duplicate context values</Button>
          <Button onClick={() => {
            const row = { Label: 'Repeated', Id: 'shared', Rank: 1 }
            setRows([row, row])
          }}>Repeated object</Button>
          <Button onClick={() => setCtx({ run: 'different' })}>External context</Button>
        </div>
        <output aria-label="Selected row context">{ctx.run ?? 'none'}</output>
        <div className="min-h-0 flex-1">
          <DataTable data={rows} options={{ row_context: { key: 'run', field: 'Id' }, search: true, pageSize: 2 }} />
        </div>
      </div>
    </DashboardContext.Provider>
  )
}

export const RowIdentity: Story = { render: () => <RowIdentityExample /> }

function FlashIdentityExample() {
  const initial = [
    { Label: 'unique', Amount: 10 },
    { Label: 'duplicate', Amount: 20 },
    { Label: 'duplicate', Amount: 30 },
    { Label: 1, Amount: 40 },
    { Label: '1', Amount: 50 },
    { Label: undefined, Amount: 60 },
  ]
  const [rows, setRows] = useState(initial)
  const [enabled, setEnabled] = useState(true)
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setRows(prior => prior.map(row => ({ ...row, Amount: row.Amount + 1 })))}>Advance values</Button>
        <Button onClick={() => setRows(prior => prior.filter(row => row.Label !== 'unique'))}>Remove unique</Button>
        <Button onClick={() => setRows(prior => [{ Label: 'unique', Amount: 99 }, ...prior])}>Restore unique</Button>
        <Button onClick={() => setRows(prior => prior.filter(row => row.Label !== 'duplicate' || row.Amount < 30))}>Resolve duplicate</Button>
        <Button onClick={() => setRows(prior => [...prior, { Label: 'unique', Amount: 500 }])}>Duplicate unique</Button>
        <Button onClick={() => setEnabled(prior => !prior)}>Toggle flashes</Button>
      </div>
      <div className="min-h-0 flex-1"><DataTable data={rows} options={{ tick_flash: enabled }} /></div>
    </div>
  )
}

export const FlashIdentity: Story = { render: () => <FlashIdentityExample /> }
