import { useEffect } from 'react'
import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'

interface Choice { value: string; label?: string }

interface SelectOptions {
  key?: string
  choices?: Array<string | Choice>
  label?: string
  default?: string
  // When the widget has a `source`, its fetched rows are turned into
  // choices by reading these fields. Defaults: value←"value", label←"label".
  value_field?: string
  label_field?: string
}

// Categorical input that writes to ctx. Pairs with `slider` (numeric);
// together they cover the two standard input shapes.
//
// Choices come from EITHER:
//   - static `options.choices` (a flat string array or [{value,label?}]), OR
//   - a wired `source`: the fetched rows (data) are mapped to choices via
//     value_field/label_field. This lets a backend populate the dropdown
//     dynamically (e.g. "the namespaces that currently exist") without the
//     widget knowing anything domain-specific.
// Initial value comes from `ctx[key]` (URL / Cmd+K / another Select all
// sync into it).
export function Select({ data, options }: WidgetProps) {
  const opts = (options ?? {}) as SelectOptions
  const { ctx, setCtx } = useDashboard()

  const key = opts.key
  const choices = resolveChoices(data, opts)
  // The value the dropdown DISPLAYS as selected. ctx wins, then an
  // explicit default, then the first choice.
  const ctxVal = key ? ctx[key] : undefined
  const current = ctxVal ?? opts.default ?? (choices[0]?.value)

  // Sync the displayed value into ctx when ctx is empty but we have a
  // resolved choice. Without this, dependent sources (e.g. a file browser
  // wired to ${ctx.org}) fire with an EMPTY param on first load — the
  // dropdown looks populated but never told ctx what it's showing. Only
  // fires when ctx[key] is unset, so it never fights a user/URL selection.
  useEffect(() => {
    if (key && (ctxVal === undefined || ctxVal === '') && current) {
      setCtx(key, current)
    }
  }, [key, ctxVal, current, setCtx])

  if (!key) {
    return <Empty>Select requires options.key</Empty>
  }
  if (choices.length === 0) {
    return <Empty>Select has no choices</Empty>
  }

  return (
    <div className="flex flex-col h-full justify-center gap-1.5 px-2">
      <label className="text-[10px] uppercase tracking-wider text-zinc-500">
        {opts.label ?? opts.key}
      </label>
      <select
        value={current}
        onChange={e => setCtx(opts.key!, e.target.value)}
        className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500"
      >
        {choices.map(c => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
    </div>
  )
}

// resolveChoices prefers source-fetched rows when present, else the static
// `choices` option. Source rows are unwrapped from the common payload
// shapes ({rows}/{entries}/array) and mapped via value_field/label_field.
function resolveChoices(data: unknown, opts: SelectOptions): Choice[] {
  const rows = unwrapRows(data)
  if (rows.length > 0) {
    const vf = opts.value_field ?? 'value'
    const lf = opts.label_field ?? 'label'
    return rows
      .map((r): Choice | null => {
        if (typeof r === 'string') return { value: r, label: r }
        if (r && typeof r === 'object') {
          const rec = r as Record<string, unknown>
          const v = rec[vf]
          if (typeof v === 'string') {
            const l = rec[lf]
            return { value: v, label: typeof l === 'string' ? l : v }
          }
        }
        return null
      })
      .filter((c): c is Choice => c !== null)
  }
  return (opts.choices ?? []).map(c =>
    typeof c === 'string' ? { value: c, label: c } : { value: c.value, label: c.label ?? c.value },
  )
}

// unwrapRows pulls a row array out of the common DataResponse shapes a
// backend source returns: a bare array, { rows }, or { entries }.
function unwrapRows(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.rows)) return obj.rows
    if (Array.isArray(obj.entries)) return obj.entries
  }
  return []
}
