import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { DataGrid, type DataGridColumn } from '../workbench/DataGrid'

interface Row {
  id: number
  name: string
}

const columns: DataGridColumn<Row>[] = [{ id: 'name', header: 'Name' }]
const rows: Row[] = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }]
const html = (node: React.ReactNode) => renderToStaticMarkup(node)

describe('DataGrid layout contract', () => {
  it('fills a bounded parent by default and fits its rows with height auto', () => {
    expect(html(<DataGrid label="Files" columns={columns} rows={rows} rowKey={row => String(row.id)} />))
      .toContain('height:100%')
    const auto = html(<DataGrid label="Files" columns={columns} rows={rows} rowKey={row => String(row.id)} height="auto" />)
    expect(auto).toContain('height:auto')
    // The body is exactly three standard rows (32 px each) tall.
    expect(auto).toContain('class="mtc-data-grid-body" style="height:96px"')
  })

  it('sizes the body to the density row height', () => {
    const compact = html(<DataGrid label="Files" columns={columns} rows={rows} rowKey={row => String(row.id)} density="compact" height="auto" />)
    expect(compact).toContain('class="mtc-data-grid-body" style="height:84px"')
  })

  it('shows the built-in empty row unless the host suppresses it with empty={null}', () => {
    const base = { label: 'Files', columns, rows: [] as Row[], rowKey: (row: Row) => String(row.id) }
    expect(html(<DataGrid {...base} />)).toContain('No rows')
    expect(html(<DataGrid {...base} empty="Nothing here" />)).toContain('Nothing here')
    const suppressed = html(<DataGrid {...base} empty={null} />)
    expect(suppressed).not.toContain('mtc-data-grid-empty-row')
    expect(suppressed).toContain('class="mtc-data-grid-body" style="height:0"')
  })
})
