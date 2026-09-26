import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { RecordFieldInput, RecordValue, recordEditorLayout } from '../widgets/RecordFields'
import type { RecordFieldData } from '../widgets/recordShapes'
import { DataGrid, type DataGridEditingCell } from '../workbench/DataGrid'

const html = (node: React.ReactNode) => renderToStaticMarkup(node)

const reviewers: RecordFieldData = {
  key: 'reviewers',
  label: 'Reviewers',
  type: 'user',
  required: false,
  readOnly: false,
  choices: [
    { value: 'mina', label: 'Mina Patel' },
    { value: 'jules', label: 'Jules Chen' },
    { value: 'noah', label: 'Noah Williams' },
  ],
  allowMultiple: true,
}

describe('RecordValue lists', () => {
  it('renders several users as one chip each, by their choice labels', () => {
    const cell = html(<RecordValue field={reviewers} value={['jules', 'noah']} context="grid" />)
    expect(cell).toContain('Jules Chen')
    expect(cell).toContain('Noah Williams')
    expect(cell).not.toContain('jules, noah')
  })

  it('keeps a grid list on one line: two chips, then +N naming the rest', () => {
    const cell = html(<RecordValue field={reviewers} value={['mina', 'jules', 'noah']} context="grid" />)
    expect(cell).toContain('class="mtc-value-list" data-context="grid"')
    expect(cell).toContain('Jules Chen')
    expect(cell).not.toContain('>Noah Williams<')
    expect(cell).toContain('title="1 more: Noah Williams"')
    expect(cell).toContain('+1')
  })

  it('shows up to four chips outside a grid', () => {
    const card = html(<RecordValue field={reviewers} value={['mina', 'jules', 'noah']} />)
    expect(card).toContain('data-context="panel"')
    expect(card).toContain('Noah Williams')
    expect(card).not.toContain('+1')
  })

  it('names an editor control that has no visible label', () => {
    const name: RecordFieldData = { ...reviewers, key: 'name', label: 'Work item', type: 'text', choices: [], allowMultiple: false }
    expect(html(<RecordFieldInput field={name} value="Alder" onChange={() => {}} label="Work item" />)).toContain('aria-label="Work item"')
  })
})

describe('recordEditorLayout', () => {
  const field = (type: RecordFieldData['type'], extra: Partial<RecordFieldData> = {}): RecordFieldData => ({
    ...reviewers, key: type, label: type, type, choices: [], allowMultiple: false, ...extra,
  })
  const choices = reviewers.choices

  it('opens a list of choices and long text over the cell', () => {
    expect(recordEditorLayout(field('multi_select', { choices }))).toBe('overlay')
    expect(recordEditorLayout(field('user', { choices, allowMultiple: true }))).toBe('overlay')
    expect(recordEditorLayout(field('link', { choices, allowMultiple: true }))).toBe('overlay')
    expect(recordEditorLayout(field('long_text'))).toBe('overlay')
  })

  it('edits one-line controls in the cell', () => {
    for (const type of ['text', 'number', 'currency', 'percent', 'date', 'datetime', 'boolean', 'url', 'email', 'phone'] as const) {
      expect(recordEditorLayout(field(type)), type).toBe('inline')
    }
    expect(recordEditorLayout(field('single_select', { choices }))).toBe('inline')
    expect(recordEditorLayout(field('user', { choices }))).toBe('inline')
    expect(recordEditorLayout(field('link', { choices }))).toBe('inline')
    // Several links without choices are typed as text.
    expect(recordEditorLayout(field('link', { allowMultiple: true }))).toBe('inline')
  })
})

describe('DataGrid editing cell', () => {
  interface Row { id: string; name: string }
  const rows: Row[] = [{ id: 'a', name: 'Alder' }, { id: 'b', name: 'Beacon' }]
  const grid = (editingCell?: DataGridEditingCell | null) => html(
    <DataGrid<Row>
      label="Items"
      columns={[{
        id: 'name',
        header: 'Name',
        cell: (row, { editing }) => <span className={editing ? 'editor' : 'probe'}>{row.name}</span>,
      }]}
      rows={rows}
      rowKey={row => row.id}
      editingCell={editingCell}
    />,
  )
  const cellsOf = (markup: string) => markup.match(/<div role="gridcell"[^>]*>.*?<\/div>/g) ?? []

  it('puts an inline editor in its cell, outside the one-line box and out of the tab order', () => {
    const markup = grid({ rowKey: 'a', columnId: 'name' })
    const cells = cellsOf(markup)
    expect(cells).toHaveLength(2)
    expect(cells[0]).toContain('data-editing="true"')
    expect(cells[0]).not.toContain('tabindex')
    expect(cells[0]).toContain('<span class="editor">Alder</span>')
    expect(cells[0]).not.toContain('mtc-data-grid-cell-text')
    expect(cells[1]).toContain('<span class="mtc-data-grid-cell-text"><span class="probe">Beacon</span></span>')
    expect(markup).not.toContain('role="dialog"')
  })

  it('opens an overlay editor in a dialog named after its column, the cell keeping its value', () => {
    const markup = grid({ rowKey: 'a', columnId: 'name', layout: 'overlay' })
    const cells = cellsOf(markup)
    expect(cells[0]).toContain('tabindex="0"')
    expect(cells[0]).not.toContain('data-editing')
    expect(cells[0]).toContain('<span class="mtc-data-grid-cell-text"><span class="probe">Alder</span></span>')
    const dialog = markup.match(/<div role="dialog"[^>]*>.*?<\/div>/)?.[0] ?? ''
    expect(dialog).toContain('aria-label="Edit Name"')
    expect(dialog).toContain('aria-modal="true"')
    expect(dialog).toContain('<span class="editor">Alder</span>')
  })

  it('keeps the first cell as the tab stop when nothing is edited', () => {
    const cells = grid(null).match(/<div role="gridcell"[^>]*>/g) ?? []
    expect(cells[0]).toContain('tabindex="0"')
    expect(cells.join('')).not.toContain('data-editing')
  })
})
