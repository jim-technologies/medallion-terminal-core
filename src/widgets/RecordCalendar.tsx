import { useEffect, useMemo, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'
import {
  applyRecordView,
  normalizeRecordSet,
  recordChoiceColor,
  recordDateKey,
  recordTitle,
  type RecordViewData,
  type WorkRecordData,
} from './recordShapes'
import { Empty } from './states'

interface RecordCalendarOptions {
  view_id?: string
  date_field?: string
  color_field?: string
  week_starts_on?: 0 | 1
  initial_month?: string
  record_id_key?: string
  table_id_key?: string
}

function calendarViews(views: RecordViewData[]): RecordViewData[] {
  return views.filter(view => view.type === 'calendar' || view.type === 'timeline')
}

function startOfMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), 1)
}

function addMonths(value: Date, amount: number): Date {
  return new Date(value.getFullYear(), value.getMonth() + amount, 1)
}

function monthCells(month: Date, weekStartsOn: 0 | 1): Date[] {
  const first = startOfMonth(month)
  const firstDay = first.getDay()
  const offset = (firstDay - weekStartsOn + 7) % 7
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset)
  return Array.from({ length: 42 }, (_, index) =>
    new Date(start.getFullYear(), start.getMonth(), start.getDate() + index),
  )
}

function semanticDot(color?: string): string {
  switch (color?.toLowerCase()) {
    case 'ok':
    case 'green':
    case 'emerald':
      return 'bg-emerald-400'
    case 'warn':
    case 'warning':
    case 'amber':
    case 'yellow':
    case 'orange':
      return 'bg-amber-400'
    case 'danger':
    case 'error':
    case 'red':
      return 'bg-red-400'
    case 'neutral':
    case 'muted':
    case 'gray':
    case 'grey':
      return 'bg-zinc-500'
    default:
      return 'bg-sky-400'
  }
}

// Month view over any date/datetime field in a record_set. It remains a
// projection of the same records—not a second calendar-specific data model.
export function RecordCalendar({ data, options }: WidgetProps) {
  const set = useMemo(() => normalizeRecordSet(data), [data])
  const opts = (options ?? {}) as RecordCalendarOptions
  const { setCtx } = useDashboard()
  const initial = opts.initial_month ? new Date(`${opts.initial_month}-01T12:00:00`) : new Date()
  const [month, setMonth] = useState(startOfMonth(Number.isNaN(initial.getTime()) ? new Date() : initial))
  const [viewId, setViewId] = useState(opts.view_id ?? '')

  useEffect(() => setViewId(opts.view_id ?? ''), [opts.view_id])

  if (!set) return <Empty>No record set</Empty>

  const views = calendarViews(set.views)
  const view = views.find(candidate => candidate.id === viewId) ??
    views.find(candidate => candidate.id === set.activeViewId) ??
    views[0]
  const dateFieldKey = opts.date_field ?? view?.dateField
  const dateField = set.fields.find(field => field.key === dateFieldKey)
  if (!dateField) return <Empty padded>A calendar requires a date_field or calendar view</Empty>
  const colorField = set.fields.find(field => field.key === opts.color_field)

  const weekStartsOn = opts.week_starts_on ?? 1
  const cells = monthCells(month, weekStartsOn)
  const records = applyRecordView(set.records, view)
  const byDate = new Map<string, WorkRecordData[]>()
  for (const record of records) {
    const key = recordDateKey(record.values[dateField.key])
    if (!key) continue
    const bucket = byDate.get(key) ?? []
    bucket.push(record)
    byDate.set(key, bucket)
  }

  const labels = weekStartsOn === 1
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = recordDateKey(Date.now())
  const recordIdKey = opts.record_id_key ?? 'record_id'
  const tableIdKey = opts.table_id_key ?? 'table_id'

  const selectRecord = (record: WorkRecordData) => {
    setCtx(tableIdKey, set.tableId)
    setCtx(recordIdKey, record.id)
    for (const [key, value] of Object.entries(record.context)) setCtx(key, value)
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2 pb-2">
        <button
          type="button"
          onClick={() => setMonth(value => addMonths(value, -1))}
          className="mtc-control px-2 py-1 text-xs text-zinc-400"
          aria-label="Previous month"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setMonth(startOfMonth(new Date()))}
          className="mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400"
        >
          Today
        </button>
        <h4 className="text-sm font-semibold text-zinc-100">
          {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </h4>
        <button
          type="button"
          onClick={() => setMonth(value => addMonths(value, 1))}
          className="mtc-control px-2 py-1 text-xs text-zinc-400"
          aria-label="Next month"
        >
          →
        </button>
        {views.length > 1 && (
          <select
            value={view?.id ?? ''}
            onChange={event => setViewId(event.target.value)}
            className="mtc-control ml-auto max-w-[12rem] px-2 py-1 text-xs text-zinc-300 outline-none"
            aria-label="Saved calendar view"
          >
            {views.map(candidate => (
              <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-x-auto">
        <div className="h-full min-w-[42rem] flex flex-col">
          <div className="grid grid-cols-7 border-t border-l border-zinc-800 text-[9px] uppercase tracking-wider text-zinc-600">
            {labels.map(label => (
              <div key={label} className="border-r border-b border-zinc-800 px-2 py-1">{label}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-6 flex-1 min-h-0 border-l border-zinc-800 overflow-hidden">
            {cells.map(cell => {
              const key = recordDateKey(cell)!
              const dayRecords = byDate.get(key) ?? []
              const inMonth = cell.getMonth() === month.getMonth()
              return (
                <div
                  key={key}
                  className={`min-w-0 min-h-0 border-r border-b border-zinc-800 p-1.5 overflow-y-auto ${
                    inMonth ? 'bg-zinc-900/35' : 'bg-zinc-950/45'
                  }`}
                >
                  <div className={`text-[10px] tabular-nums mb-1 ${
                    key === today
                      ? 'w-5 h-5 grid place-items-center rounded-full bg-sky-500 text-zinc-100'
                      : inMonth ? 'text-zinc-400' : 'text-zinc-700'
                  }`}>
                    {cell.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayRecords.slice(0, 4).map(record => (
                      <button
                        key={record.id}
                        type="button"
                        onClick={() => selectRecord(record)}
                        className="w-full flex items-start gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 py-1 text-left hover:border-zinc-600"
                        title={recordTitle(set, record, view?.titleField)}
                      >
                        <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${semanticDot(
                          recordChoiceColor(
                            colorField,
                            colorField ? record.values[colorField.key] : undefined,
                          ),
                        )}`} />
                        <span className="text-[9px] leading-tight text-zinc-300 line-clamp-2">
                          {recordTitle(set, record, view?.titleField)}
                        </span>
                      </button>
                    ))}
                    {dayRecords.length > 4 && (
                      <div className="text-[9px] text-zinc-600 px-1">+{dayRecords.length - 4} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
