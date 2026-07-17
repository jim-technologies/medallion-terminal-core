import { useEffect, useMemo, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { useSubmitAction } from '../hooks/useSubmitAction'
import type { WidgetProps } from '../types/template'
import { RecordValue } from './RecordFields'
import {
  applyRecordView,
  normalizeRecordSet,
  recordTitle,
  recordValueLabel,
  type RecordFieldData,
  type RecordViewData,
  type WorkRecordData,
} from './recordShapes'
import { Empty } from './states'

interface RecordBoardOptions {
  view_id?: string
  group_by?: string
  card_fields?: string[]
  search?: boolean
  record_id_key?: string
  table_id_key?: string
  new_record_value?: string
  allow_move?: boolean
}

function boardViews(views: RecordViewData[]): RecordViewData[] {
  return views.filter(view => view.type === 'board')
}

function valueKey(value: unknown): string {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, unknown>
    return String(record.id ?? record.value ?? record.label ?? record.name ?? '')
  }
  return value == null ? '' : String(value)
}

function laneTone(color?: string): string {
  switch (color?.toLowerCase()) {
    case 'ok':
    case 'green':
    case 'emerald':
      return 'bg-emerald-400'
    case 'warn':
    case 'amber':
    case 'yellow':
    case 'orange':
      return 'bg-amber-400'
    case 'danger':
    case 'red':
      return 'bg-red-400'
    case 'info':
    case 'blue':
    case 'cyan':
    case 'purple':
      return 'bg-sky-400'
    default: return 'bg-zinc-500'
  }
}

// Saved-view board over the same record_set payload used by RecordGrid.
// Lane changes use both an accessible select and pointer drag/drop; both
// dispatch the exact same revision-aware update action.
export function RecordBoard({ data, options, widgetId }: WidgetProps) {
  const set = useMemo(() => normalizeRecordSet(data), [data])
  const opts = (options ?? {}) as RecordBoardOptions
  const { backendUrl, setCtx } = useDashboard()
  const mutation = useSubmitAction(widgetId)
  const [query, setQuery] = useState('')
  const [viewId, setViewId] = useState(opts.view_id ?? '')
  const [draggingId, setDraggingId] = useState<string | null>(null)

  useEffect(() => setViewId(opts.view_id ?? ''), [opts.view_id])

  if (!set) return <Empty>No record set</Empty>

  const views = boardViews(set.views)
  const view = views.find(candidate => candidate.id === viewId) ??
    views.find(candidate => candidate.id === set.activeViewId) ??
    views[0]
  const groupFieldKey = opts.group_by ?? view?.groupBy
  const groupField = set.fields.find(field => field.key === groupFieldKey)
  if (!groupField) return <Empty padded>A board requires a group_by field or board view</Empty>

  const recordIdKey = opts.record_id_key ?? 'record_id'
  const tableIdKey = opts.table_id_key ?? 'table_id'
  const canMove = opts.allow_move !== false &&
    set.capabilities.update &&
    backendUrl !== undefined &&
    !groupField.readOnly
  const baseRecords = applyRecordView(set.records, view)
  const normalizedQuery = query.trim().toLowerCase()
  const records = normalizedQuery
    ? baseRecords.filter(record =>
        Object.values(record.values).some(value =>
          recordValueLabel(value).toLowerCase().includes(normalizedQuery),
        ),
      )
    : baseRecords

  const discovered = [...new Set(records.map(record => valueKey(record.values[groupField.key])))]
  const laneValues = [
    ...groupField.choices.map(choice => choice.value),
    ...discovered.filter(value => !groupField.choices.some(choice => choice.value === value)),
  ]
  if (!laneValues.includes('')) laneValues.push('')

  const cardFieldKeys = opts.card_fields?.length
    ? opts.card_fields
    : view?.visibleFields.length
      ? view.visibleFields
      : set.fields.map(field => field.key)
  const cardFields = cardFieldKeys
    .filter(key => key !== (view?.titleField ?? set.primaryField) && key !== groupField.key)
    .map(key => set.fields.find(field => field.key === key))
    .filter((field): field is RecordFieldData => !!field)
    .slice(0, 4)

  const selectRecord = (record: WorkRecordData) => {
    setCtx(tableIdKey, set.tableId)
    setCtx(recordIdKey, record.id)
    for (const [key, value] of Object.entries(record.context)) setCtx(key, value)
  }

  const moveRecord = async (record: WorkRecordData, lane: string) => {
    if (!canMove || mutation.submitting || valueKey(record.values[groupField.key]) === lane) return
    await mutation.submit({
      actionId: set.capabilities.updateActionId,
      params: {
        workspace_id: set.workspaceId,
        table_id: set.tableId,
        record_id: record.id,
        revision: record.revision,
        values: { [groupField.key]: lane || null },
      },
      successMessage: `${recordTitle(set, record, view?.titleField)} moved`,
      refreshTarget: '*',
      announce: false,
    })
  }

  const startNew = () => {
    setCtx(tableIdKey, set.tableId)
    setCtx(recordIdKey, opts.new_record_value ?? 'new')
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2 pb-2">
        {opts.search !== false && (
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={`Search ${set.tableName || 'records'}…`}
            className="mtc-control flex-1 min-w-0 px-2 py-1.5 text-xs outline-none focus:border-sky-500"
          />
        )}
        {views.length > 1 && (
          <select
            value={view?.id ?? ''}
            onChange={event => setViewId(event.target.value)}
            className="mtc-control max-w-[12rem] px-2 py-1.5 text-xs text-zinc-300 outline-none"
            aria-label="Saved board view"
          >
            {views.map(candidate => (
              <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
            ))}
          </select>
        )}
        {set.capabilities.create && (
          <button
            type="button"
            onClick={startNew}
            className="mtc-control px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-sky-300 border-sky-500/30"
          >
            + New
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex gap-3 min-w-max">
          {laneValues.map(lane => {
            const choice = groupField.choices.find(candidate => candidate.value === lane)
            const laneRecords = records.filter(record => valueKey(record.values[groupField.key]) === lane)
            return (
              <section
                key={lane || '__unassigned'}
                className="w-64 h-full flex flex-col rounded border border-zinc-800 bg-zinc-950/25"
                onDragOver={event => {
                  if (canMove) event.preventDefault()
                }}
                onDrop={event => {
                  event.preventDefault()
                  const recordId = event.dataTransfer.getData('text/record-id') || draggingId
                  const record = records.find(candidate => candidate.id === recordId)
                  setDraggingId(null)
                  if (record) void moveRecord(record, lane)
                }}
              >
                <header className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800">
                  <span className={`w-1.5 h-1.5 rounded-full ${laneTone(choice?.color)}`} />
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 truncate">
                    {(choice?.label ?? lane) || 'Unassigned'}
                  </span>
                  <span className="ml-auto text-[10px] tabular-nums text-zinc-600">{laneRecords.length}</span>
                </header>
                <div className="p-2 space-y-2 overflow-y-auto min-h-0">
                  {laneRecords.map(record => (
                    <article
                      key={record.id}
                      draggable={canMove}
                      onDragStart={event => {
                        setDraggingId(record.id)
                        event.dataTransfer.effectAllowed = 'move'
                        event.dataTransfer.setData('text/record-id', record.id)
                      }}
                      onDragEnd={() => setDraggingId(null)}
                      className={`mtc-landing-card p-3 ${draggingId === record.id ? 'opacity-50' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => selectRecord(record)}
                        className="block w-full text-left"
                      >
                        <h4 className="text-xs font-semibold text-zinc-100 leading-snug">
                          {recordTitle(set, record, view?.titleField)}
                        </h4>
                        <span className="text-[9px] font-mono text-zinc-600">{record.id}</span>
                        {cardFields.length > 0 && (
                          <dl className="mt-2 space-y-1.5">
                            {cardFields.map(field => (
                              <div key={field.key} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
                                <dt className="text-[9px] uppercase tracking-wider text-zinc-600 truncate">
                                  {field.label}
                                </dt>
                                <dd className="text-[10px] text-zinc-300 min-w-0 truncate">
                                  <RecordValue field={field} value={record.values[field.key]} />
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}
                      </button>
                      {canMove && (
                        <select
                          value={valueKey(record.values[groupField.key])}
                          onChange={event => void moveRecord(record, event.target.value)}
                          disabled={mutation.submitting}
                          className="mtc-control mt-2 w-full px-2 py-1 text-[10px] text-zinc-400 outline-none disabled:opacity-40"
                          aria-label={`Move ${recordTitle(set, record, view?.titleField)} to lane`}
                        >
                          {laneValues.map(value => {
                            const option = groupField.choices.find(candidate => candidate.value === value)
                            return (
                              <option key={value || '__unassigned'} value={value}>
                                {(option?.label ?? value) || 'Unassigned'}
                              </option>
                            )
                          })}
                        </select>
                      )}
                    </article>
                  ))}
                  {laneRecords.length === 0 && (
                    <div className="py-8 text-center text-[10px] text-zinc-700">No records</div>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
