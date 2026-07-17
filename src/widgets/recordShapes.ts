// Normalization and view helpers for the record-set payload.
//
// Connect JSON uses lowerCamelCase while hand-authored templates and many
// lightweight backends use proto snake_case. The wire edge accepts both and
// gives every record widget one predictable internal model.

export type RecordFieldType =
  | 'text'
  | 'long_text'
  | 'number'
  | 'currency'
  | 'percent'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'single_select'
  | 'multi_select'
  | 'user'
  | 'link'
  | 'attachment'
  | 'url'
  | 'email'
  | 'phone'
  | 'formula'
  | 'lookup'
  | 'rollup'
  | 'created_at'
  | 'updated_at'

export type RecordViewType =
  | 'grid'
  | 'board'
  | 'calendar'
  | 'gallery'
  | 'list'
  | 'timeline'
  | 'form'

export interface RecordChoiceData {
  value: string
  label: string
  color?: string
}

export interface RecordFieldData {
  key: string
  label: string
  type: RecordFieldType
  description?: string
  required: boolean
  readOnly: boolean
  choices: RecordChoiceData[]
  linkedTableId?: string
  allowMultiple: boolean
  format?: string
  defaultValue?: unknown
}

export interface WorkRecordData {
  id: string
  values: Record<string, unknown>
  createdAt?: string
  updatedAt?: string
  revision?: string
  context: Record<string, string>
}

export interface RecordSortData {
  field: string
  descending: boolean
}

export interface RecordFilterData {
  field: string
  operator: string
  value: unknown
}

export interface RecordViewData {
  id: string
  name: string
  type: RecordViewType
  visibleFields: string[]
  groupBy?: string
  dateField?: string
  titleField?: string
  sorts: RecordSortData[]
  filters: RecordFilterData[]
}

export interface RecordCapabilitiesData {
  create: boolean
  update: boolean
  delete: boolean
  createActionId: string
  updateActionId: string
  deleteActionId: string
}

export interface RecordSetData {
  workspaceId: string
  tableId: string
  tableName: string
  primaryField: string
  fields: RecordFieldData[]
  records: WorkRecordData[]
  views: RecordViewData[]
  activeViewId?: string
  total?: number
  nextPageToken?: string
  capabilities: RecordCapabilitiesData
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function object(value: unknown): Record<string, unknown> {
  return isObject(value) ? value : {}
}

function optionalString(value: unknown): string | undefined {
  return value == null || value === '' ? undefined : String(value)
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

function stringMap(value: unknown): Record<string, string> {
  if (!isObject(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => entry != null)
      .map(([key, entry]) => [key, String(entry)]),
  )
}

function finiteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

const FIELD_TYPES: Record<string, RecordFieldType> = {
  '1': 'text',
  '2': 'long_text',
  '3': 'number',
  '4': 'currency',
  '5': 'percent',
  '6': 'boolean',
  '7': 'date',
  '8': 'datetime',
  '9': 'single_select',
  '10': 'multi_select',
  '11': 'user',
  '12': 'link',
  '13': 'attachment',
  '14': 'url',
  '15': 'email',
  '16': 'phone',
  '17': 'formula',
  '18': 'lookup',
  '19': 'rollup',
  '20': 'created_at',
  '21': 'updated_at',
}

const VIEW_TYPES: Record<string, RecordViewType> = {
  '1': 'grid',
  '2': 'board',
  '3': 'calendar',
  '4': 'gallery',
  '5': 'list',
  '6': 'timeline',
  '7': 'form',
}

function enumSuffix(value: unknown, prefix: string): string {
  return String(value ?? '')
    .replace(prefix, '')
    .toLowerCase()
}

function fieldType(value: unknown): RecordFieldType {
  const numeric = FIELD_TYPES[String(value)]
  if (numeric) return numeric
  const suffix = enumSuffix(value, 'RECORD_FIELD_TYPE_')
  return Object.values(FIELD_TYPES).includes(suffix as RecordFieldType)
    ? suffix as RecordFieldType
    : 'text'
}

function viewType(value: unknown): RecordViewType {
  const numeric = VIEW_TYPES[String(value)]
  if (numeric) return numeric
  const suffix = enumSuffix(value, 'RECORD_VIEW_TYPE_')
  return Object.values(VIEW_TYPES).includes(suffix as RecordViewType)
    ? suffix as RecordViewType
    : 'grid'
}

function inferFieldType(value: unknown): RecordFieldType {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (Array.isArray(value)) return 'multi_select'
  return 'text'
}

function computedType(type: RecordFieldType): boolean {
  return type === 'formula' ||
    type === 'lookup' ||
    type === 'rollup' ||
    type === 'created_at' ||
    type === 'updated_at'
}

function normalizeFields(root: Record<string, unknown>, records: WorkRecordData[]): RecordFieldData[] {
  const fields = (Array.isArray(root.fields) ? root.fields : [])
    .filter(isObject)
    .map((field): RecordFieldData => {
      const type = fieldType(field.type)
      const choices = (Array.isArray(field.choices) ? field.choices : [])
        .filter(isObject)
        .map((choice): RecordChoiceData => ({
          value: String(choice.value ?? ''),
          label: String(choice.label ?? choice.value ?? ''),
          color: optionalString(choice.color),
        }))
        .filter(choice => choice.value)
      return {
        key: String(field.key ?? ''),
        label: String(field.label ?? field.key ?? ''),
        type,
        description: optionalString(field.description),
        required: field.required === true,
        readOnly: field.readOnly === true || field.read_only === true || computedType(type),
        choices,
        linkedTableId: optionalString(field.linkedTableId ?? field.linked_table_id),
        allowMultiple: field.allowMultiple === true || field.allow_multiple === true,
        format: optionalString(field.format),
        defaultValue: field.defaultValue ?? field.default_value,
      }
    })
    .filter(field => field.key)

  if (fields.length > 0) return fields

  const keys = [...new Set(records.flatMap(record => Object.keys(record.values)))]
  return keys.map(key => {
    const sample = records.find(record => record.values[key] != null)?.values[key]
    return {
      key,
      label: key,
      type: inferFieldType(sample),
      required: false,
      readOnly: false,
      choices: [],
      allowMultiple: Array.isArray(sample),
    }
  })
}

export function normalizeRecordSet(data: unknown): RecordSetData | null {
  const root = object(data)
  const rawRecords = Array.isArray(root.records)
    ? root.records
    : Array.isArray(root.rows)
      ? root.rows
      : []

  const records = rawRecords
    .filter(isObject)
    .map((entry, index): WorkRecordData => {
      const explicitValues = isObject(entry.values)
      const values = explicitValues
        ? entry.values as Record<string, unknown>
        : Object.fromEntries(
            Object.entries(entry).filter(([key]) =>
              !['id', '_id', 'createdAt', 'created_at', 'updatedAt', 'updated_at', 'revision', 'context'].includes(key),
            ),
          )
      return {
        id: String(entry.id ?? entry._id ?? `record-${index + 1}`),
        values,
        createdAt: optionalString(entry.createdAt ?? entry.created_at),
        updatedAt: optionalString(entry.updatedAt ?? entry.updated_at),
        revision: optionalString(entry.revision),
        context: stringMap(entry.context),
      }
    })
    .filter(record => record.id)

  const fields = normalizeFields(root, records)
  const views = (Array.isArray(root.views) ? root.views : [])
    .filter(isObject)
    .map((view): RecordViewData => ({
      id: String(view.id ?? ''),
      name: String(view.name ?? view.id ?? ''),
      type: viewType(view.type),
      visibleFields: stringArray(view.visibleFields ?? view.visible_fields),
      groupBy: optionalString(view.groupBy ?? view.group_by),
      dateField: optionalString(view.dateField ?? view.date_field),
      titleField: optionalString(view.titleField ?? view.title_field),
      sorts: (Array.isArray(view.sorts) ? view.sorts : [])
        .filter(isObject)
        .map(sort => ({
          field: String(sort.field ?? ''),
          descending: sort.descending === true,
        }))
        .filter(sort => sort.field),
      filters: (Array.isArray(view.filters) ? view.filters : [])
        .filter(isObject)
        .map(filter => ({
          field: String(filter.field ?? ''),
          operator: String(filter.operator ?? 'eq').toLowerCase(),
          value: filter.value,
        }))
        .filter(filter => filter.field),
    }))
    .filter(view => view.id)

  const rawCapabilities = object(root.capabilities)
  const tableId = String(root.tableId ?? root.table_id ?? '')
  const tableName = String(root.tableName ?? root.table_name ?? tableId)
  if (!tableId && !tableName && fields.length === 0 && records.length === 0) return null

  return {
    workspaceId: String(root.workspaceId ?? root.workspace_id ?? ''),
    tableId,
    tableName,
    primaryField: String(root.primaryField ?? root.primary_field ?? fields[0]?.key ?? 'id'),
    fields,
    records,
    views,
    activeViewId: optionalString(root.activeViewId ?? root.active_view_id),
    total: finiteNumber(root.total),
    nextPageToken: optionalString(root.nextPageToken ?? root.next_page_token),
    capabilities: {
      create: rawCapabilities.create === true,
      update: rawCapabilities.update === true,
      delete: rawCapabilities.delete === true,
      createActionId: String(rawCapabilities.createActionId ?? rawCapabilities.create_action_id ?? 'record_create'),
      updateActionId: String(rawCapabilities.updateActionId ?? rawCapabilities.update_action_id ?? 'record_update'),
      deleteActionId: String(rawCapabilities.deleteActionId ?? rawCapabilities.delete_action_id ?? 'record_delete'),
    },
  }
}

export function isRecordFieldEditable(field: RecordFieldData): boolean {
  return !field.readOnly && field.type !== 'attachment'
}

// Form initialization must preserve the exact storage shape while editing.
// In particular, an absent optional field stays `undefined` and an explicit
// null stays null; defaults apply only when creating a new record.
export function initialRecordValues(
  fields: RecordFieldData[],
  record?: WorkRecordData,
): Record<string, unknown> {
  return Object.fromEntries(fields.map(field => [
    field.key,
    record ? record.values[field.key] : field.defaultValue ?? null,
  ]))
}

export function changedRecordValues(
  fields: RecordFieldData[],
  values: Record<string, unknown>,
  record?: WorkRecordData,
): Record<string, unknown> {
  const entries = fields
    .filter(isRecordFieldEditable)
    .filter(field => JSON.stringify(values[field.key]) !== JSON.stringify(record?.values[field.key]))
    .map(field => [field.key, values[field.key]] as const)
  return Object.fromEntries(entries)
}

export function recordTitle(
  set: RecordSetData,
  record: WorkRecordData,
  titleField = set.primaryField,
): string {
  const value = record.values[titleField] ?? record.values[set.primaryField]
  if (isObject(value)) return String(value.label ?? value.name ?? value.id ?? record.id)
  if (Array.isArray(value)) return value.map(recordValueLabel).join(', ') || record.id
  return value == null || value === '' ? record.id : String(value)
}

export function recordValueLabel(value: unknown): string {
  if (value == null) return ''
  if (isObject(value)) return String(value.label ?? value.name ?? value.id ?? '')
  if (Array.isArray(value)) return value.map(recordValueLabel).filter(Boolean).join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

export function recordDateKey(value: unknown): string | null {
  // Date-only values are calendar coordinates, not UTC instants. Preserve
  // their written day so users west of UTC do not see them shifted backward.
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = value instanceof Date
    ? value
    : typeof value === 'string' || typeof value === 'number'
      ? new Date(value)
      : null
  if (!date || Number.isNaN(date.getTime())) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function emptyValue(value: unknown): boolean {
  return value == null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
}

function comparable(value: unknown): unknown {
  if (isObject(value)) return value.id ?? value.value ?? value.label ?? value.name ?? ''
  return value
}

function equal(a: unknown, b: unknown): boolean {
  const left = comparable(a)
  const right = comparable(b)
  if (typeof left === 'number' && typeof right === 'number') return left === right
  return String(left ?? '').toLowerCase() === String(right ?? '').toLowerCase()
}

// Resolve a saved choice's semantic color from any supported value shape
// (scalar, linked/select object, etc.). Consumers decide how that semantic
// token maps onto their particular visual (lane marker, calendar dot).
export function recordChoiceColor(
  field: RecordFieldData | undefined,
  value: unknown,
): string | undefined {
  if (!field) return undefined
  return field.choices.find(choice => equal(choice.value, value))?.color
}

export function recordMatchesFilter(record: WorkRecordData, filter: RecordFilterData): boolean {
  const actual = record.values[filter.field]
  const expected = filter.value
  switch (filter.operator) {
    case 'empty':
      return emptyValue(actual)
    case 'not_empty':
      return !emptyValue(actual)
    case 'neq':
      return !equal(actual, expected)
    case 'contains': {
      if (Array.isArray(actual)) return actual.some(value => equal(value, expected))
      return recordValueLabel(actual).toLowerCase().includes(recordValueLabel(expected).toLowerCase())
    }
    case 'in': {
      const expectedValues = Array.isArray(expected) ? expected : [expected]
      const actualValues = Array.isArray(actual) ? actual : [actual]
      return actualValues.some(value => expectedValues.some(candidate => equal(value, candidate)))
    }
    case 'gt':
      return Number(comparable(actual)) > Number(comparable(expected))
    case 'gte':
      return Number(comparable(actual)) >= Number(comparable(expected))
    case 'lt':
      return Number(comparable(actual)) < Number(comparable(expected))
    case 'lte':
      return Number(comparable(actual)) <= Number(comparable(expected))
    case 'eq':
    default:
      return equal(actual, expected)
  }
}

export function applyRecordView(records: WorkRecordData[], view?: RecordViewData): WorkRecordData[] {
  if (!view) return records
  const filtered = view.filters.length > 0
    ? records.filter(record => view.filters.every(filter => recordMatchesFilter(record, filter)))
    : records
  if (view.sorts.length === 0) return filtered

  return filtered
    .map((record, index) => ({ record, index }))
    .sort((a, b) => {
      for (const sort of view.sorts) {
        const left = comparable(a.record.values[sort.field])
        const right = comparable(b.record.values[sort.field])
        if (left == null && right == null) continue
        if (left == null) return 1
        if (right == null) return -1
        const comparison = typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' })
        if (comparison !== 0) return sort.descending ? -comparison : comparison
      }
      return a.index - b.index
    })
    .map(entry => entry.record)
}

export function findRecordView(
  set: RecordSetData,
  type: RecordViewType,
  preferredId?: string,
): RecordViewData | undefined {
  return set.views.find(view => view.id === preferredId && view.type === type) ??
    set.views.find(view => view.id === set.activeViewId && view.type === type) ??
    set.views.find(view => view.type === type)
}
