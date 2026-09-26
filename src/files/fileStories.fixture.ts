/**
 * A fake file server for the file preview stories and tests: serves bytes
 * from memory, honours `Range: bytes=0-N` with 206 and `Content-Range`,
 * and answers 404 for unknown paths. Injected as `FilePreview.fetch`.
 */

/** A 96 × 56 PNG bar chart (valid signature). */
export const CHART_PNG = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAGAAAAA4CAIAAACNJ2r1AAAAiklEQVR42u3QwQ2AIBAEQBrx44vO7M+/vVEBxhAkB0yyz83ldtJxZnlJQgAIECBAgAABWjDXc9cCCBCgBYG+PAQIECBA0YFG3gEECBAgQLMDzTgMECBAgFru9OoAAgRoL6BoHUCAYnQAAQL0L9DO4wEBAgQIECBAgAABAgQIECBAgAABAgQI0NBOAfsc3ELhw+qfAAAAAElFTkSuQmCC'), character => character.charCodeAt(0))

const encoder = new TextEncoder()

export const MARKDOWN = [
  '# Quarterly operating review',
  '',
  'Revenue grew **12%** against plan, led by the *enterprise* segment.',
  '',
  '## Actions',
  '',
  '1. Renew the Northstar master agreement before Oct 18.',
  '2. Close the two open support escalations.',
  '',
  '> Numbers are preliminary until finance closes the quarter.',
  '',
  '| Segment | Revenue | Change |',
  '|---|---:|---:|',
  '| Enterprise | $1.28M | +18% |',
  '| Mid-market | $640K | +6% |',
  '',
  'Inline `code`, a [link](https://example.com/report) and a raw <script>alert(1)</script> tag that is removed.',
  '',
].join('\n')

export const TYPESCRIPT = [
  "import { DataGrid } from 'medallion-terminal-core/toolkit'",
  '',
  'interface Customer {',
  '  id: string',
  '  name: string',
  '  acv: number',
  '}',
  '',
  'export function Customers({ rows }: { rows: Customer[] }) {',
  '  return (',
  '    <DataGrid',
  '      label="Customers"',
  "      columns={[{ id: 'name', header: 'Customer' }, { id: 'acv', header: 'ACV', format: 'currency:USD' }]}",
  '      rows={rows}',
  '      rowKey={row => row.id}',
  '    />',
  '  )',
  '}',
  '',
].join('\n')

function csvRows(count: number): string {
  const lines = ['order_id,customer,region,amount,placed_at']
  for (let index = 1; index <= count; index += 1) {
    const region = ['North America', 'EU-Central', 'APAC'][index % 3]
    lines.push(`ORD-${4000 + index},"Customer ${index % 37}, Inc.",${region},${((index * 7919) % 90000) / 100},2026-09-${String(1 + (index % 24)).padStart(2, '0')}`)
  }
  return `${lines.join('\n')}\n`
}

const FILES: Record<string, Uint8Array> = {
  '/files/orders.csv': encoder.encode(csvRows(1_200)),
  '/files/review.md': encoder.encode(MARKDOWN),
  '/files/chart.png': CHART_PNG,
  // An SVG page renamed to .png: the signature check refuses it.
  '/files/renamed.png': encoder.encode('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="10" height="10"/></svg>'),
  '/files/customers.tsx': encoder.encode(TYPESCRIPT),
  '/files/config.json': encoder.encode('{"horizon_days":90,"regions":["North America","EU-Central"],"approved":true}'),
  '/files/server.log': encoder.encode(Array.from({ length: 4_000 }, (_, index) => `2026-09-25T15:${String(index % 60).padStart(2, '0')}:00Z INFO request ${index} served in ${index % 97} ms`).join('\n')),
}

/** A `fetch` over the in-memory files. */
export const fakeFileFetch: typeof globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  const path = new URL(url, 'http://files.local').pathname
  const bytes = FILES[path]
  if (!bytes) return new Response('{"code":"not_found","message":"no such file"}', { status: 404, headers: { 'content-type': 'application/json' } })
  const range = new Headers(init?.headers).get('range')
  const match = range ? /^bytes=(\d+)-(\d+)$/.exec(range) : null
  if (match) {
    const start = Number(match[1])
    const end = Math.min(bytes.length - 1, Number(match[2]))
    return new Response(bytes.slice(start, end + 1), {
      status: 206,
      headers: { 'content-range': `bytes ${start}-${end}/${bytes.length}` },
    })
  }
  return new Response(bytes.slice(), { status: 200 })
}
