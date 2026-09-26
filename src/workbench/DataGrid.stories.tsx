import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { Icon } from '../components/Icon'
import { ObjectChip } from '../objects'
import { PEOPLE, TYPES } from '../objects/objectStories.fixture'
import { DataGrid, type DataGridColumn } from '.'

const meta = {
  title: 'Toolkit/Workbench/DataGrid',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Workbench"
        title={context.name}
        description="A dense ARIA grid: one tab stop, arrow keys, Space to select, Shift for ranges, Enter to open, the Menu key for row actions. Headers sort and resize; above 200 rows only the rows in view render."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

interface CustomerRow {
  id: string
  name: string
  customerId: string
  segment: string
  acv: number
  health: number
  renewal: string
  owner: (typeof PEOPLE)[keyof typeof PEOPLE]
  status: string
}

const NAMES = [
  'Northstar Labs', 'Northwind Health', 'North Harbor Freight', 'Northgate Retail', 'Cobalt Logistics',
  'Juniper Analytics', 'Harbor & Pine', 'Meridian Foods', 'Quartz Mobility', 'Alder Street Clinics',
  'Beacon Payroll', 'Cinder Robotics', 'Delta Orchard', 'Evergreen Tiles', 'Fjord Outfitters',
  'Granite Ledger', 'Hollow Creek Farms', 'Ironbridge Works', 'Kestrel Aviation', 'Lumen Dental',
  'Maple & Main', 'Nimbus Studios', 'Orchid Pharmacy', 'Prairie Solar', 'Riverbend Schools',
]
const OWNERS = [PEOPLE.ada, PEOPLE.daniel, PEOPLE.naomie]
const SEGMENTS = ['Enterprise', 'Mid-market', 'Startup']

const CUSTOMERS: CustomerRow[] = NAMES.map((name, index) => ({
  id: `cus-${index}`,
  name,
  customerId: `CUS-0${(1842 - index * 37).toString().padStart(4, '0')}`,
  segment: SEGMENTS[index % 3]!,
  acv: 284000 - index * 9150 + (index % 4) * 1210,
  health: 92 - ((index * 7) % 31),
  renewal: `2026-${String(10 + (index % 3)).padStart(2, '0')}-${String(3 + ((index * 5) % 25)).padStart(2, '0')}`,
  owner: OWNERS[index % 3]!,
  status: index % 6 === 5 ? 'Churned' : 'Active',
}))

const customerColumns: DataGridColumn<CustomerRow>[] = [
  {
    id: 'name',
    header: 'Customer',
    width: 196,
    pinned: true,
    cell: row => <ObjectChip object={{ id: row.id, title: row.name, type: TYPES.customer }} />,
    sortValue: row => row.name,
  },
  { id: 'customerId', header: 'Customer ID', kind: 'id' },
  { id: 'segment', header: 'Segment', kind: 'enum' },
  { id: 'acv', header: 'Annual contract value', format: 'currency:USD' },
  { id: 'health', header: 'Health', kind: 'integer' },
  { id: 'renewal', header: 'Renewal', kind: 'date' },
  { id: 'status', header: 'Status', kind: 'enum', tones: { Active: 'ok', Churned: 'danger' } },
  { id: 'owner', header: 'Account owner', sortValue: row => row.owner.title },
]

const activated = fn()

export const TypedObjectTable: Story = {
  name: 'Typed object table',
  render: () => {
    const [selected, setSelected] = useState<string[]>(['cus-0'])
    return (
      <DataGrid
        label="Customers"
        columns={customerColumns}
        rows={CUSTOMERS}
        rowKey={row => row.id}
        rowLabel={row => row.name}
        selection="multi"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        defaultSort={{ columnId: 'acv', direction: 'descending' }}
        onRowActivate={row => activated(row.id)}
        height={420}
        footer={<span>{selected.length} of {CUSTOMERS.length} selected</span>}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Customers' })
    await expect(canvas.getByRole('columnheader', { name: /Annual contract value/ })).toHaveAttribute('aria-sort', 'descending')
    // One tab stop: the first data cell of the first row.
    await userEvent.tab()
    const first = grid.querySelector<HTMLElement>('[data-cell="0:1"]')!
    await expect(first).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}{ }')
    await expect(canvas.getByText('2 of 25 selected')).toBeVisible()
    await userEvent.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}')
    await expect(canvas.getByText('4 of 25 selected')).toBeVisible()
    await userEvent.keyboard('{Enter}')
    await expect(activated).toHaveBeenCalledWith('cus-3')
    // Sort from the header with the keyboard.
    await userEvent.keyboard('{Control>}{Home}{/Control}{ArrowUp}{ArrowRight}{ArrowRight}{Enter}')
    await expect(canvas.getByRole('columnheader', { name: /Customer ID/ })).toHaveAttribute('aria-sort', 'ascending')
    await userEvent.keyboard('{Enter}{Enter}')
    await expect(canvas.getByRole('columnheader', { name: /Customer ID/ })).toHaveAttribute('aria-sort', 'none')
  },
}

interface EventRow {
  id: number
  sequence: string
  kind: string
  amount: number
  at: string
}

const KINDS = ['Order placed', 'Invoice sent', 'Payment received', 'Refund issued', 'Shipment delivered']
const EVENTS: EventRow[] = Array.from({ length: 10_000 }, (_, index) => ({
  id: index,
  sequence: `EVT-${String(index + 1).padStart(5, '0')}`,
  kind: KINDS[index % KINDS.length]!,
  amount: ((index * 7919) % 100_000) / 100,
  at: new Date(Date.UTC(2026, 8, 1) + index * 60_000).toISOString(),
}))

const eventColumns: DataGridColumn<EventRow>[] = [
  { id: 'sequence', header: 'Event', kind: 'id' },
  { id: 'kind', header: 'Kind' },
  { id: 'amount', header: 'Amount', format: 'currency:USD' },
  { id: 'at', header: 'Recorded', kind: 'datetime' },
]

export const TenThousandRows: Story = {
  name: 'Ten thousand rows',
  render: () => (
    <DataGrid
      label="Event log"
      columns={eventColumns}
      rows={EVENTS}
      rowKey={row => String(row.id)}
      selection="single"
      height={440}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Event log' })
    await expect(grid).toHaveAttribute('aria-rowcount', '10001')
    // Only the rows in view (plus overscan) are in the DOM.
    await expect(grid.querySelectorAll('*').length).toBeLessThan(1500)
    await userEvent.tab()
    await userEvent.keyboard('{Control>}{End}{/Control}')
    await waitFor(() => expect(grid.querySelector('[aria-rowindex="10001"]')).not.toBeNull())
    await expect(grid.querySelector('[data-cell="9999:3"]')).toHaveFocus()
    await expect(grid.querySelectorAll('*').length).toBeLessThan(1500)
    await userEvent.keyboard('{Control>}{Home}{/Control}')
    await waitFor(() => expect(grid.querySelector('[data-cell="0:0"]')).toHaveFocus())
  },
}

interface FileRow {
  id: string
  name: string
  size: number
  modified: string
}

const PAGE = 40
const MAX = 160
const renamed = fn()

function filesPage(offset: number): FileRow[] {
  return Array.from({ length: PAGE }, (_, index) => {
    const n = offset + index + 1
    return { id: `f-${n}`, name: `report-${String(n).padStart(3, '0')}.csv`, size: 12_000 + n * 733, modified: `2026-09-${String(1 + (n % 24)).padStart(2, '0')}` }
  })
}

export const ContextActionsAndPaging: Story = {
  name: 'Context actions and paging',
  render: () => {
    const [rows, setRows] = useState<FileRow[]>(() => filesPage(0))
    const [loading, setLoading] = useState(false)
    return (
      <DataGrid
        label="Reports"
        columns={[
          { id: 'name', header: 'Name', grow: true },
          { id: 'size', header: 'Size', kind: 'bytes' },
          { id: 'modified', header: 'Modified', kind: 'date' },
        ]}
        rows={rows}
        rowKey={row => row.id}
        rowHref={row => `#/files/${row.id}`}
        onNavigate={row => activated(row.id)}
        totalRows={MAX}
        loading={loading}
        onEndReached={() => {
          setLoading(true)
          setTimeout(() => {
            setRows(current => [...current, ...filesPage(current.length)])
            setLoading(false)
          }, 50)
        }}
        contextActions={row => [
          { id: 'rename', label: 'Rename', shortcut: 'F2', onSelect: () => renamed(row.id) },
          { id: 'download', label: 'Download' },
          { id: 'sep', separator: true },
          { id: 'delete', label: 'Delete', intent: 'danger' },
        ]}
        onCellEdit={row => renamed(row.id)}
        height={360}
        footer={<span>{rows.length} of {MAX} loaded</span>}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Reports' })
    await userEvent.tab()
    await userEvent.keyboard('{Shift>}{F10}{/Shift}')
    const menu = await within(document.body).findByRole('menu', { name: 'Actions for report-001.csv' })
    await expect(within(menu).getByRole('menuitem', { name: /Rename/ })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(renamed).toHaveBeenCalledWith('f-1')
    await waitFor(() => expect(grid.querySelector('[data-cell="0:0"]')).toHaveFocus())
    await userEvent.keyboard('{F2}')
    await expect(renamed).toHaveBeenCalledTimes(2)
    // Scrolling to the end asks for the next page once.
    grid.scrollTop = grid.scrollHeight
    await waitFor(() => expect(canvas.getByText('80 of 160 loaded')).toBeVisible())
  },
}

export const EmptyAndLoading: Story = {
  name: 'Empty and loading',
  render: () => (
    <div className="grid gap-4 lg:grid-cols-2">
      <DataGrid label="Loading orders" columns={eventColumns} rows={[]} rowKey={row => String(row.id)} loading height={300} />
      <DataGrid label="Filtered orders" columns={eventColumns} rows={[]} rowKey={row => String(row.id)} height={300} />
    </div>
  ),
}

interface DocumentRow {
  id: string
  name: string
  path: string
  note: string
  size: number
  amount: number
  updated: string
  status: string
  tags: string[]
  owner: (typeof PEOPLE)[keyof typeof PEOPLE]
  shared: boolean
}

const DOCUMENTS: DocumentRow[] = [
  {
    id: 'doc-1',
    name: 'quarterly-board-review-final.pdf',
    path: 'finance/board/2026/q3/quarterly-board-review-final.pdf',
    note: 'Signed by the audit committee',
    size: 2_400_000,
    amount: 1_284_500.25,
    updated: '2026-09-24T09:02:00Z',
    status: 'Near quota',
    tags: ['Finance', 'Board', 'Confidential'],
    owner: PEOPLE.naomie,
    shared: true,
  },
  {
    id: 'doc-2',
    name: 'northstar-master-agreement.pdf',
    path: 'legal/contracts/northstar/master-agreement.pdf',
    note: 'Renewal terms under review',
    size: 812_000,
    amount: 98_400,
    updated: '2026-09-22T04:40:00Z',
    status: 'Available',
    tags: ['Legal'],
    owner: PEOPLE.daniel,
    shared: false,
  },
  {
    id: 'doc-3',
    name: 'crm-field-mapping.json',
    path: 'integrations/crm/field-mapping.json',
    note: 'Generated by the CRM sync',
    size: 9_800,
    amount: 2_150.5,
    updated: '2026-08-28T03:00:00Z',
    status: 'Read-only',
    tags: ['Sync', 'CRM'],
    owner: PEOPLE.ada,
    shared: true,
  },
]

const documentColumns: DataGridColumn<DocumentRow>[] = [
  {
    id: 'name',
    header: 'Document',
    cell: row => (
      <span className="flex min-w-0 items-center gap-2">
        <Icon name="document" />
        <span className="truncate">{row.name}</span>
      </span>
    ),
    sortValue: row => row.name,
  },
  { id: 'path', header: 'Path', kind: 'code' },
  { id: 'note', header: 'Note', cell: row => row.note },
  { id: 'size', header: 'Size', kind: 'bytes' },
]

// Set widths narrower than the values: typed values end in an ellipsis too.
const setWidthColumns: DataGridColumn<DocumentRow>[] = [
  { id: 'amount', header: 'Amount', format: 'currency:USD', width: 80 },
  { id: 'updated', header: 'Updated', kind: 'datetime', width: 96 },
  { id: 'status', header: 'Status', kind: 'enum', tones: { 'Near quota': 'warning', Available: 'ok', 'Read-only': 'neutral' }, width: 88 },
  { id: 'tags', header: 'Tags', kind: 'list', width: 120 },
  { id: 'owner', header: 'Owner', kind: 'link', width: 88 },
  { id: 'shared', header: 'Shared', kind: 'boolean', width: 56 },
]

/** Whether any part of a cell is wider than the box that clips it. */
function cutShort(cell: Element): boolean {
  return [cell, ...cell.querySelectorAll('*')].some(element => element.scrollWidth > element.clientWidth + 1)
}

export const NarrowColumns: Story = {
  name: 'Narrow columns',
  render: () => (
    <div className="grid gap-4" style={{ maxWidth: 360 }}>
      <DataGrid label="Documents" columns={documentColumns} rows={DOCUMENTS} rowKey={row => row.id} height="auto" />
      <DataGrid label="Set widths" columns={setWidthColumns} rows={DOCUMENTS} rowKey={row => row.id} height="auto" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: 'Documents' })
    const first = grid.querySelector<HTMLElement>('[data-cell="0:0"]')!
    // The text columns give way so every column fits, and end in an ellipsis.
    await waitFor(() => expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth))
    await waitFor(() => expect(cutShort(first)).toBe(true))
    // The whole value stays reachable: the cell's name, and the value shown
    // whole over the cell while it has keyboard focus (Escape hides it).
    await expect(within(first).getByText(DOCUMENTS[0]!.name)).toBeInTheDocument()
    const tip = () => canvasElement.ownerDocument.querySelector('.mtc-data-grid-value-tip')
    await userEvent.tab()
    await expect(first).toHaveFocus()
    await waitFor(() => expect(tip()).toHaveTextContent(DOCUMENTS[0]!.name))
    await userEvent.keyboard('{Escape}')
    await expect(tip()).toBeNull()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(tip()).toHaveTextContent(DOCUMENTS[0]!.path))
  },
}
