import { useEffect, useRef, useState } from 'react'
import { downloadView, viewRowCount, type ExportableView, type ExportFormat } from './exportView'

// ExportMenu — a small dropdown affordance for exporting a widget's
// data in any BI-standard format (CSV / JSON / NDJSON / Parquet).
//
// Drop it into a data widget's chrome. It owns its own open/close state
// and the (possibly async, for Parquet) download. Styling matches the
// terminal's zinc dark theme and the existing WidgetShell action menu.

const FORMATS: { key: ExportFormat; label: string }[] = [
  { key: 'csv', label: 'CSV' },
  { key: 'parquet', label: 'Parquet' },
  { key: 'json', label: 'JSON' },
  { key: 'ndjson', label: 'NDJSON' },
]

export interface ExportMenuProps {
  view: ExportableView
  // Filename base (extension is added per format). Usually the widget
  // title or id.
  filenameBase?: string
  // Optional callback fired after a download is triggered (or failed).
  // Lets the host surface a toast.
  onExport?: (format: ExportFormat, ok: boolean) => void
  // Render as a compact icon button (default) or a full-width row (for
  // menus). Compact suits a widget header; "row" suits an action menu.
  variant?: 'button' | 'row'
}

export function ExportMenu({ view, filenameBase, onExport, variant = 'button' }: ExportMenuProps) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<ExportFormat | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const rowCount = viewRowCount(view)
  const disabled = rowCount === 0

  const run = async (format: ExportFormat) => {
    setBusy(format)
    let ok = false
    try {
      ok = await downloadView(view, format, filenameBase)
    } catch {
      ok = false
    } finally {
      setBusy(null)
      setOpen(false)
      onExport?.(format, ok)
    }
  }

  const trigger =
    variant === 'row' ? (
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        className="block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
      >
        Export…
      </button>
    ) : (
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        title={disabled ? 'No data to export' : `Export ${rowCount.toLocaleString()} rows`}
        className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-800 shrink-0 disabled:opacity-40"
        aria-label="Export data"
      >
        ↓ Export
      </button>
    )

  return (
    <div className="relative" ref={ref}>
      {trigger}
      {open && !disabled && (
        <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 z-30 min-w-[140px]">
          <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-zinc-600">
            {rowCount.toLocaleString()} rows
          </div>
          {FORMATS.map((f) => (
            <button
              key={f.key}
              onClick={() => run(f.key)}
              disabled={busy != null}
              className="block w-full text-left px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-between"
            >
              <span>{f.label}</span>
              {busy === f.key && <span className="text-zinc-500">…</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
