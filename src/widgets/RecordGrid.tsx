import { useEffect, useMemo, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { useSubmitAction } from '../hooks/useSubmitAction'
import { isErrorStatus } from '../hooks/useWatchAction'
import type { WidgetProps } from '../types/template'
import { RecordFieldInput, RecordValue } from './RecordFields'
import {
  applyRecordView,
  isRecordFieldEditable,
  normalizeRecordSet,
  recordTitle,
  recordValueLabel,
  type RecordFieldData,
  type RecordViewData,
  type WorkRecordData,
} from './recordShapes'
import { Empty } from './states'

interface RecordGridOptions {
  view_id?: string
  visible_fields?: string[]
  page_size?: number
  search?: boolean
  inline_edit?: boolean
  record_id_key?: string
  table_id_key?: string
  new_record_value?: string
}

interface EditCell {
  record: WorkRecordData
  field: RecordFieldData
  value: unknown
}

function selectableGridViews(views: RecordViewData[]): RecordViewData[] {
  return views.filter(view => view.type === 'grid' || view.type === 'list')
}

function compareValues(left: unknown, right: unknown): number {
  if (left == null && right == null) return 0
  if (left == null) return 1
  if (right == null) return -1
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return recordValueLabel(left).localeCompare(recordValueLabel(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

// Mutable, schema-driven record grid. Table remains the lightweight
// read-only analytical surface; record_grid adds identity, field types,
// saved views, linked values, revisions, selection, and governed writes.
export function RecordGrid({ data, options, widgetId }: WidgetProps) {
  const set = useMemo(() => normalizeRecordSet(data), [data])
  const opts = (options ?? {}) as RecordGridOptions
  const { backendUrl, setCtx } = useDashboard()
  const mutation = useSubmitAction(widgetId)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ field: string; descending: boolean } | null>(null)
  const [edit, setEdit] = useState<EditCell | null>(null)
  const [viewId, setViewId] = useState(opts.view_id ?? '')

  useEffect(() => {
    setViewId(opts.view_id ?? '')
  }, [opts.view_id])

  if (!set) return <Empty>No record set</Empty>

  const gridViews = selectableGridViews(set.views)
  const view = gridViews.find(candidate => candidate.id === viewId) ??
    gridViews.find(candidate => candidate.id === set.activeViewId) ??
    gridViews[0]
  const requestedFields = opts.visible_fields?.length
    ? opts.visible_fields
    : view?.visibleFields.length
      ? view.visibleFields
      : set.fields.map(field => field.key)
  const fields = requestedFields
    .map(key => set.fields.find(field => field.key === key))
    .filter((field): field is RecordFieldData => !!field)
  const pageSize = Math.max(1, opts.page_size ?? 25)
  const recordIdKey = opts.record_id_key ?? 'record_id'
  const tableIdKey = opts.table_id_key ?? 'table_id'
  const canInlineEdit = set.capabilities.update && opts.inline_edit !== false && backendUrl !== undefined

  const visibleRecords = (() => {
    let records = applyRecordView(set.records, view)
    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery) {
      records = records.filter(record =>
        fields.some(field => recordValueLabel(record.values[field.key]).toLowerCase().includes(normalizedQuery)),
      )
    }
    if (sort) {
      records = [...records].sort((left, right) => {
        const comparison = compareValues(left.values[sort.field], right.values[sort.field])
        return sort.descending ? -comparison : comparison
      })
    }
    return records
  })()

  const totalPages = Math.max(1, Math.ceil(visibleRecords.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const pageRecords = visibleRecords.slice(safePage * pageSize, (safePage + 1) * pageSize)

  const selectRecord = (record: WorkRecordData) => {
    setCtx(tableIdKey, set.tableId)
    setCtx(recordIdKey, record.id)
    for (const [key, value] of Object.entries(record.context)) setCtx(key, value)
  }

  const startNew = () => {
    setCtx(tableIdKey, set.tableId)
    setCtx(recordIdKey, opts.new_record_value ?? 'new')
  }

  const toggleSort = (field: string) => {
    setSort(current =>
      current?.field === field
        ? { field, descending: !current.descending }
        : { field, descending: false },
    )
    setPage(0)
  }

  const saveEdit = async () => {
    if (!edit || mutation.submitting) return
    await mutation.submit({
      actionId: set.capabilities.updateActionId,
      params: {
        workspace_id: set.workspaceId,
        table_id: set.tableId,
        record_id: edit.record.id,
        revision: edit.record.revision,
        values: { [edit.field.key]: edit.value },
      },
      successMessage: `${recordTitle(set, edit.record)} updated`,
      refreshTarget: '*',
      onComplete: reply => {
        if (!isErrorStatus(reply.status)) setEdit(null)
      },
    })
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2 pb-2">
        {(opts.search !== false) && (
          <input
            type="search"
            value={query}
            onChange={event => {
              setQuery(event.target.value)
              setPage(0)
            }}
            placeholder={`Search ${set.tableName || 'records'}…`}
            className="mtc-control min-w-0 flex-1 px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-sky-500"
          />
        )}
        {gridViews.length > 1 && (
          <select
            value={view?.id ?? ''}
            onChange={event => {
              setViewId(event.target.value)
              setPage(0)
              setSort(null)
            }}
            className="mtc-control max-w-[12rem] px-2 py-1.5 text-xs text-zinc-300 outline-none"
            aria-label="Saved view"
          >
            {gridViews.map(candidate => (
              <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
            ))}
          </select>
        )}
        {set.capabilities.create && (
          <button
            type="button"
            onClick={startNew}
            className="mtc-control px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-sky-300 border-sky-500/30 shrink-0"
          >
            + New
          </button>
        )}
      </div>

      <div className="overflow-auto flex-1 min-h-0 border border-zinc-800 rounded">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-[1] bg-zinc-900">
            <tr>
              {fields.map(field => (
                <th
                  key={field.key}
                  className="border-b border-r last:border-r-0 border-zinc-800 px-2.5 py-2 text-left font-medium text-zinc-400 whitespace-nowrap"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(field.key)}
                    className="w-full flex items-center gap-1 text-left hover:text-zinc-100"
                  >
                    <span>{field.label}</span>
                    {field.required && <span className="text-amber-400" title="Required">*</span>}
                    {field.readOnly && <span className="text-zinc-600" title="Computed or read-only">◇</span>}
                    {sort?.field === field.key && (
                      <span className="ml-auto text-zinc-600">{sort.descending ? '↓' : '↑'}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRecords.map(record => (
              <tr
                key={record.id}
                onClick={() => selectRecord(record)}
                className="border-b last:border-b-0 border-zinc-800/70 hover:bg-zinc-800/40 cursor-pointer"
              >
                {fields.map(field => {
                  const editing = edit?.record.id === record.id && edit.field.key === field.key
                  const editable = canInlineEdit && isRecordFieldEditable(field)
                  return (
                    <td
                      key={field.key}
                      className="min-w-[9rem] max-w-[22rem] border-r last:border-r-0 border-zinc-800/70 px-2.5 py-2 text-zinc-200 align-top"
                      onClick={event => {
                        if (!editable) return
                        event.stopPropagation()
                      }}
                    >
                      {editing ? (
                        <div className="min-w-[10rem]">
                          <RecordFieldInput
                            field={field}
                            value={edit.value}
                            onChange={value => setEdit(current => current ? { ...current, value } : current)}
                            compact
                            autoFocus
                            disabled={mutation.submitting}
                            onCommit={() => void saveEdit()}
                            onCancel={() => setEdit(null)}
                          />
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <button
                              type="button"
                              onClick={() => setEdit(null)}
                              className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-zinc-500 hover:text-zinc-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => void saveEdit()}
                              disabled={mutation.submitting}
                              className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-sky-300 disabled:opacity-40"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (editable) setEdit({ record, field, value: record.values[field.key] })
                          }}
                          className={`w-full min-h-5 text-left ${editable ? 'hover:text-sky-300' : 'cursor-default'}`}
                          title={editable ? `Edit ${field.label}` : undefined}
                        >
                          <RecordValue field={field} value={record.values[field.key]} />
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {pageRecords.length === 0 && (
          <div className="h-40"><Empty>No matching records</Empty></div>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between gap-3 text-[10px] text-zinc-500">
        <span>
          {visibleRecords.length} shown
          {set.total != null && set.total !== visibleRecords.length ? ` · ${set.total} total` : ''}
          {view ? ` · ${view.name}` : ''}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(current => Math.max(0, current - 1))}
              disabled={safePage === 0}
              className="mtc-control px-2 py-0.5 disabled:opacity-30"
            >
              Previous
            </button>
            <span className="px-1 tabular-nums">{safePage + 1}/{totalPages}</span>
            <button
              type="button"
              onClick={() => setPage(current => Math.min(totalPages - 1, current + 1))}
              disabled={safePage === totalPages - 1}
              className="mtc-control px-2 py-0.5 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
