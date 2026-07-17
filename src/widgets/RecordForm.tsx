import { useEffect, useMemo, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { useSubmitAction, type SubmitActionReply } from '../hooks/useSubmitAction'
import { isErrorStatus } from '../hooks/useWatchAction'
import type { WidgetProps } from '../types/template'
import { RecordFieldInput } from './RecordFields'
import {
  changedRecordValues,
  findRecordView,
  initialRecordValues,
  isRecordFieldEditable,
  normalizeRecordSet,
  recordTitle,
  type RecordFieldData,
} from './recordShapes'
import { Empty } from './states'

interface RecordFormOptions {
  mode?: 'create' | 'edit' | 'auto'
  view_id?: string
  fields?: string[]
  columns?: 1 | 2
  show_read_only?: boolean
  record_id_key?: string
  table_id_key?: string
  new_record_value?: string
  submit_label?: string
}

function empty(value: unknown): boolean {
  return value == null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
}

// Schema-driven create/edit form over RecordSetPayload. Selection comes from
// shared ctx, so a grid, board, or calendar can target this form without a
// bespoke parent component.
export function RecordForm({ data, options, widgetId }: WidgetProps) {
  const set = useMemo(() => normalizeRecordSet(data), [data])
  const opts = (options ?? {}) as RecordFormOptions
  const { backendUrl, ctx, setCtx, toast } = useDashboard()
  const mutation = useSubmitAction(widgetId)
  const recordIdKey = opts.record_id_key ?? 'record_id'
  const tableIdKey = opts.table_id_key ?? 'table_id'
  const selectedId = ctx[recordIdKey]
  const selectedRecord = set?.records.find(record => record.id === selectedId)
  const mode = opts.mode ?? 'auto'
  const editing = mode === 'edit' || (mode === 'auto' && !!selectedRecord)
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState(false)

  const formView = set ? findRecordView(set, 'form', opts.view_id) : undefined
  const requestedFields = opts.fields?.length
    ? opts.fields
    : formView?.visibleFields.length
      ? formView.visibleFields
      : set?.fields.map(field => field.key) ?? []
  const fields = set
    ? requestedFields
        .map(key => set.fields.find(field => field.key === key))
        .filter((field): field is RecordFieldData => !!field)
        .filter(field => opts.show_read_only !== false || isRecordFieldEditable(field))
    : []

  useEffect(() => {
    setValues(initialRecordValues(fields, editing ? selectedRecord : undefined))
    setErrors({})
    setConfirmDelete(false)
    // Field keys and the record revision define the editable form identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [set?.tableId, selectedRecord?.id, selectedRecord?.revision, editing, requestedFields.join('|')])

  if (!set) return <Empty>No record set</Empty>
  if (editing && !selectedRecord) {
    return <Empty padded>Select a record from a grid, board, or calendar to edit it</Empty>
  }

  const writableFields = fields.filter(isRecordFieldEditable)
  const canSubmit = backendUrl !== undefined &&
    (editing ? set.capabilities.update : set.capabilities.create)
  const columns = opts.columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'

  const setValue = (key: string, value: unknown) => {
    setValues(current => ({ ...current, [key]: value }))
    setErrors(current => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const completion = (reply: SubmitActionReply) => {
    if (isErrorStatus(reply.status)) return
    const returnedId = reply.data?.record_id ?? reply.data?.recordId ?? reply.id
    if (!editing && returnedId) {
      setCtx(tableIdKey, set.tableId)
      setCtx(recordIdKey, String(returnedId))
    }
  }

  const submitForm = async () => {
    if (!canSubmit || mutation.submitting) return
    const nextErrors: Record<string, string> = {}
    for (const field of writableFields) {
      if (field.required && empty(values[field.key])) nextErrors[field.key] = 'Required'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast('Complete the required fields', 'warn')
      return
    }

    const payloadValues = editing
      ? changedRecordValues(writableFields, values, selectedRecord)
      : Object.fromEntries(writableFields.map(field => [field.key, values[field.key]]))
    if (editing && Object.keys(payloadValues).length === 0) {
      toast('No changes to save', 'info')
      return
    }

    await mutation.submit({
      actionId: editing
        ? set.capabilities.updateActionId
        : set.capabilities.createActionId,
      params: {
        workspace_id: set.workspaceId,
        table_id: set.tableId,
        ...(editing ? {
          record_id: selectedRecord!.id,
          revision: selectedRecord!.revision,
        } : {}),
        values: payloadValues,
      },
      successMessage: editing
        ? `${recordTitle(set, selectedRecord!, formView?.titleField)} updated`
        : `${set.tableName || 'Record'} created`,
      refreshTarget: '*',
      onComplete: completion,
    })
  }

  const deleteRecord = async () => {
    if (!selectedRecord || !set.capabilities.delete || backendUrl === undefined || mutation.submitting) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    await mutation.submit({
      actionId: set.capabilities.deleteActionId,
      params: {
        workspace_id: set.workspaceId,
        table_id: set.tableId,
        record_id: selectedRecord.id,
        revision: selectedRecord.revision,
      },
      successMessage: `${recordTitle(set, selectedRecord, formView?.titleField)} deleted`,
      refreshTarget: '*',
      onComplete: reply => {
        if (isErrorStatus(reply.status)) return
        setCtx(recordIdKey, opts.new_record_value ?? 'new')
        setConfirmDelete(false)
      },
    })
  }

  const reset = () => {
    setValues(initialRecordValues(fields, editing ? selectedRecord : undefined))
    setErrors({})
    setConfirmDelete(false)
  }

  return (
    <form
      className="h-full flex flex-col min-h-0"
      onSubmit={event => {
        event.preventDefault()
        void submitForm()
      }}
    >
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            {editing ? 'Edit record' : 'New record'} · {set.tableName || set.tableId}
          </div>
          <h4 className="text-sm font-semibold text-zinc-100 mt-0.5 truncate">
            {editing && selectedRecord
              ? recordTitle(set, selectedRecord, formView?.titleField)
              : `Add to ${set.tableName || 'table'}`}
          </h4>
          {editing && selectedRecord && (
            <div className="text-[9px] font-mono text-zinc-600 mt-0.5">
              {selectedRecord.id}{selectedRecord.revision ? ` · rev ${selectedRecord.revision}` : ''}
            </div>
          )}
        </div>
        {mode === 'auto' && (
          <button
            type="button"
            onClick={() => {
              setCtx(tableIdKey, set.tableId)
              setCtx(recordIdKey, opts.new_record_value ?? 'new')
            }}
            className="mtc-control px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400 shrink-0"
          >
            New
          </button>
        )}
      </div>

      <div className={`grid ${columns} gap-x-4 gap-y-3 py-3 overflow-y-auto flex-1 min-h-0 pr-1`}>
        {fields.map(field => (
          <label key={field.key} className={field.type === 'long_text' ? 'md:col-span-2' : ''}>
            <span className="flex items-center gap-1 mb-1 text-[10px] uppercase tracking-wider text-zinc-500">
              {field.label}
              {field.required && <span className="text-amber-400">*</span>}
              {field.readOnly && <span className="normal-case tracking-normal text-zinc-700">computed</span>}
              {errors[field.key] && <span className="ml-auto text-red-400 normal-case tracking-normal">{errors[field.key]}</span>}
            </span>
            <RecordFieldInput
              field={field}
              value={values[field.key]}
              onChange={value => setValue(field.key, value)}
              disabled={mutation.submitting}
            />
            {field.description && (
              <span className="block text-[9px] text-zinc-600 mt-1 leading-relaxed">{field.description}</span>
            )}
          </label>
        ))}
      </div>

      <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
        {editing && set.capabilities.delete && (
          <button
            type="button"
            onClick={() => void deleteRecord()}
            disabled={mutation.submitting || backendUrl === undefined}
            className={`mtc-control px-2.5 py-1.5 text-[10px] uppercase tracking-wider disabled:opacity-40 ${
              confirmDelete ? 'text-red-300 border-red-500/40 bg-red-500/10' : 'text-zinc-500'
            }`}
          >
            {confirmDelete ? 'Confirm delete' : 'Delete'}
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          disabled={mutation.submitting}
          className="mtc-control ml-auto px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-zinc-500 disabled:opacity-40"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={!canSubmit || mutation.submitting}
          className="mtc-control px-3 py-1.5 text-[10px] uppercase tracking-wider text-sky-300 border-sky-500/40 bg-sky-500/10 disabled:opacity-40"
          title={!canSubmit ? 'This record set is read-only or backendUrl is missing' : undefined}
        >
          {mutation.submitting ? 'Saving…' : opts.submit_label ?? (editing ? 'Save changes' : 'Create record')}
        </button>
      </div>
    </form>
  )
}
