// Bar chart payloads come in two shapes:
//   single  — classic [{label, value[, color]}] rows, one bar per row
//   grouped — wide rows [{label, <series A>: n, <series B>: n, ...}],
//             one bar per series within each label group (e.g. win
//             probability per outcome across market + several models)

export interface SingleBar {
  label: string
  value: number
  color?: string
}

export type BarData =
  | { kind: 'single'; bars: SingleBar[] }
  | { kind: 'grouped'; rows: Record<string, unknown>[]; series: string[] }
  | null

export function normalizeBars(data: unknown): BarData {
  let raw: unknown[] | null = null
  if (Array.isArray(data)) raw = data
  else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.bars)) raw = d.bars
    else if (Array.isArray(d.rows)) raw = d.rows
  }
  if (!raw) return null
  const rows = raw.filter(
    (r): r is Record<string, unknown> => r != null && typeof r === 'object',
  )
  if (rows.length === 0) return null

  // Single mode: every row carries an explicit `value`.
  if (rows.every(r => 'value' in r)) {
    const bars = rows
      .map(r => ({
        label: String(r.label ?? r.name ?? ''),
        value: Number(r.value ?? 0),
        color: r.color != null ? String(r.color) : undefined,
      }))
      .filter(b => Number.isFinite(b.value))
    return bars.length > 0 ? { kind: 'single', bars } : null
  }

  // Grouped mode: series = the union of numeric keys across rows,
  // in first-seen order, excluding the label/name/color slots.
  const series: string[] = []
  for (const row of rows) {
    for (const [key, value] of Object.entries(row)) {
      if (key === 'label' || key === 'name' || key === 'color') continue
      if (typeof value === 'number' && Number.isFinite(value) && !series.includes(key)) {
        series.push(key)
      }
    }
  }
  if (series.length === 0) return null
  const grouped = rows.map(r => ({
    ...r,
    label: String(r.label ?? r.name ?? ''),
  }))
  return { kind: 'grouped', rows: grouped, series }
}
