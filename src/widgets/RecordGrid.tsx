import { useEffect, useMemo, useState } from 'react'
import { Button, IconButton } from '../components/Button'
import { Input } from '../components/FormControls'
import { Icon } from '../components/Icon'
import { Pagination } from '../components/Pagination'
import { DataGrid, type DataGridColumn } from '../workbench/DataGrid'
import type { PropertyKind } from '../objects/propertyFormat'
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
import {
  CursorPager,
  cursorPageTokenKey,
  type CursorPaginationOptions,
} from './CursorPager'

interface RecordGridOptions extends CursorPaginationOptions {
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

// Mutable, schema-driven record grid on the toolkit DataGrid: one tab stop,
// arrow keys, Enter selects the record, F2 or a double-click edits a cell
// (Enter saves, Escape cancels). Table remains the lightweight read-only
// analytical surface; record_grid adds identity, field types, saved views,
// linked values, revisions, selection, and governed writes.
export function RecordGrid({ data, options, widgetId }: WidgetProps) {
  const set = useMemo(() => normalizeRecordSet(data), [data])
  const opts = (options ?? {}) as RecordGridOptions
  const { backendUrl, ctx, setCtx } = useDashboard()
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
  const pageTokenKey = cursorPageTokenKey(widgetId, opts)
  const serverPaged = !!set.nextPageToken || !!ctx[pageTokenKey]
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

  const totalPages = serverPaged ? 1 : Math.max(1, Math.ceil(visibleRecords.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const pageRecords = serverPaged
    ? visibleRecords
    : visibleRecords.slice(safePage * pageSize, (safePage + 1) * pageSize)

  const selectRecord = (record: WorkRecordData) => {
    setCtx(tableIdKey, set.tableId)
    setCtx(recordIdKey, record.id)
    for (const [key, value] of Object.entries(record.context)) setCtx(key, value)
  }

  const startNew = () => {
    setCtx(tableIdKey, set.tableId)
    setCtx(recordIdKey, opts.new_record_value ?? 'new')
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

  const columns: DataGridColumn<WorkRecordData>[] = fields.map(field => ({
    id: field.key,
    header: field.label,
    // Content-sized; dates and Yes/No keep their width like numbers do, and
    // the record's title field takes the spare width and gives way last.
    kind: recordColumnKind(field.type),
    grow: field.key === set.primaryField,
    primary: field.key === set.primaryField,
    accessor: record => record.values[field.key],
    align: field.type === 'number' || field.type === 'currency' || field.type === 'percent' ? 'end' : 'start',
    cell: record => {
      const editing = edit?.record.id === record.id && edit.field.key === field.key
      if (!editing) return <RecordValue field={field} value={record.values[field.key]} />
      return (
        <span className="mtc-data-grid-editor">
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
          <IconButton icon={<Icon name="check" />} size="small" variant="ghost" aria-label={`Save ${field.label}`} disabled={mutation.submitting} onClick={() => void saveEdit()} />
          <IconButton icon={<Icon name="close" />} size="small" variant="ghost" aria-label="Cancel edit" onClick={() => setEdit(null)} />
        </span>
      )
    },
  }))

  const startEdit = (record: WorkRecordData, columnId: string) => {
    const field = fields.find(candidate => candidate.key === columnId)
    if (!field || !canInlineEdit || !isRecordFieldEditable(field)) return
    setEdit({ record, field, value: record.values[field.key] })
  }

  return (
    <div className="h-full flex flex-col min-h-0 gap-2">
      <div className="flex items-center gap-2">
        {(opts.search !== false) && (
          <Input
            type="search"
            size="small"
            value={query}
            onChange={event => {
              setQuery(event.target.value)
              setPage(0)
            }}
            aria-label={`Search ${set.tableName || 'records'}`}
            placeholder={`Search ${set.tableName || 'records'}…`}
            className="min-w-0 flex-1"
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
            className="mtc-input max-w-[12rem]"
            data-size="small"
            aria-label="Saved view"
          >
            {gridViews.map(candidate => (
              <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
            ))}
          </select>
        )}
        {set.capabilities.create && (
          <Button size="small" intent="primary" startIcon={<Icon name="add" />} onClick={startNew}>
            New
          </Button>
        )}
      </div>

      <DataGrid
        label={set.tableName || 'Records'}
        className="min-h-0 flex-1"
        columns={columns}
        rows={pageRecords}
        rowKey={record => record.id}
        rowLabel={record => recordTitle(set, record)}
        selection="single"
        selectedKeys={ctx[recordIdKey] ? [ctx[recordIdKey]!] : []}
        onSelectionChange={keys => {
          const record = pageRecords.find(candidate => candidate.id === keys[0])
          if (record) selectRecord(record)
        }}
        onRowActivate={selectRecord}
        onCellEdit={canInlineEdit ? startEdit : undefined}
        sort={sort ? { columnId: sort.field, direction: sort.descending ? 'descending' : 'ascending' } : null}
        onSortChange={next => {
          setSort(next ? { field: next.columnId, descending: next.direction === 'descending' } : null)
          setPage(0)
        }}
        sortMode="server"
        empty={<Empty>No matching records</Empty>}
        rowProps={record => ({ 'data-mtc-record-id': record.id })}
        footer={(
          <div className="flex w-full items-center justify-between gap-3">
            <span>
              {visibleRecords.length} shown
              {set.total != null && set.total !== visibleRecords.length ? ` · ${set.total} total` : ''}
              {view ? ` · ${view.name}` : ''}
            </span>
            {serverPaged ? (
              <CursorPager
                nextPageToken={set.nextPageToken}
                widgetId={widgetId}
                options={opts}
                ariaLabel="Record pages"
              />
            ) : totalPages > 1 && (
              <Pagination
                label="Record pages"
                page={safePage + 1}
                pageCount={totalPages}
                onPageChange={next => setPage(next - 1)}
              />
            )}
          </div>
        )}
      />
    </div>
  )
}

function recordColumnKind(type: string): PropertyKind | undefined {
  if (type === 'date') return 'date'
  if (type === 'datetime' || type === 'created_at' || type === 'updated_at') return 'datetime'
  if (type === 'boolean') return 'boolean'
  return undefined
}
