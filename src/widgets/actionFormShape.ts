export type ActionFieldType =
  | 'text'
  | 'long_text'
  | 'number'
  | 'currency'
  | 'percent'
  | 'boolean'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'datetime'
  | 'email'
  | 'url'
  | 'password'

export interface ActionChoice {
  value: string
  label: string
}

export interface ActionField {
  key: string
  label: string
  type: ActionFieldType
  description?: string
  placeholder?: string
  required: boolean
  readOnly: boolean
  choices: ActionChoice[]
  defaultValue?: unknown
  contextKey?: string
  min?: number
  max?: number
  step?: number
}

export interface ActionFormData {
  actionId: string
  submitLabel: string
  successMessage?: string
  description?: string
  confirm: boolean
  tone: 'primary' | 'danger' | 'neutral'
  columns: 1 | 2
  fields: ActionField[]
  params: Record<string, unknown>
  values: Record<string, unknown>
}

const FIELD_TYPES = new Set<ActionFieldType>([
  'text',
  'long_text',
  'number',
  'currency',
  'percent',
  'boolean',
  'select',
  'multi_select',
  'date',
  'datetime',
  'email',
  'url',
  'password',
])

export function normalizeActionForm(
  data: unknown,
  options?: Record<string, unknown>,
): ActionFormData | null {
  const source = objectValue(data)
  const opts = options ?? {}
  const rawFields = arrayValue(opts.fields) ?? arrayValue(source.fields)
  if (!rawFields) return null

  const fields = rawFields
    .map(normalizeField)
    .filter((field): field is ActionField => field !== null)
  if (fields.length === 0) return null

  const actionId = stringValue(opts.action_id) ?? stringValue(source.action_id) ?? ''
  const toneValue = stringValue(opts.tone) ?? stringValue(source.tone)
  const columnsValue = numberValue(opts.columns) ?? numberValue(source.columns)
  return {
    actionId,
    submitLabel:
      stringValue(opts.submit_label) ??
      stringValue(source.submit_label) ??
      'Submit',
    successMessage:
      stringValue(opts.success_message) ??
      stringValue(source.success_message),
    description:
      stringValue(opts.description) ??
      stringValue(source.description),
    confirm:
      booleanValue(opts.confirm) ??
      booleanValue(source.confirm) ??
      false,
    tone: toneValue === 'danger' || toneValue === 'neutral' ? toneValue : 'primary',
    columns: columnsValue === 2 ? 2 : 1,
    fields,
    params: {
      ...recordValue(source.params),
      ...recordValue(opts.params),
    },
    values: {
      ...recordValue(source.values),
      ...recordValue(opts.values),
    },
  }
}

export function initialActionValues(
  form: ActionFormData,
  ctx: Record<string, string>,
): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const field of form.fields) {
    const supplied = form.values[field.key]
    const context = field.contextKey ? ctx[field.contextKey] : undefined
    values[field.key] =
      supplied !== undefined ? supplied :
      context !== undefined ? coerceInputValue(field, context) :
      field.defaultValue !== undefined ? field.defaultValue :
      field.type === 'boolean' ? false :
      field.type === 'multi_select' ? [] :
      ''
  }
  return values
}

export function validateActionValues(
  fields: ActionField[],
  values: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of fields) {
    const value = values[field.key]
    if (field.required && isEmpty(value)) {
      errors[field.key] = 'Required'
      continue
    }
    if (isEmpty(value)) continue
    if (isNumeric(field.type)) {
      const number = typeof value === 'number' ? value : Number(value)
      if (!Number.isFinite(number)) {
        errors[field.key] = 'Enter a number'
      } else if (field.min !== undefined && number < field.min) {
        errors[field.key] = `Minimum ${field.min}`
      } else if (field.max !== undefined && number > field.max) {
        errors[field.key] = `Maximum ${field.max}`
      }
    }
    if (field.type === 'url' && typeof value === 'string' && !safeFormUrl(value)) {
      errors[field.key] = 'Enter an http(s) or relative URL'
    }
  }
  return errors
}

export function actionParams(
  form: ActionFormData,
  values: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...form.params,
    ...Object.fromEntries(
      form.fields
        .filter(field => !field.readOnly || values[field.key] !== undefined)
        .map(field => [field.key, values[field.key]]),
    ),
  }
}

function normalizeField(raw: unknown): ActionField | null {
  const field = objectValue(raw)
  const key = stringValue(field.key)
  if (!key) return null
  const rawType = stringValue(field.type) as ActionFieldType | undefined
  const type = rawType && FIELD_TYPES.has(rawType) ? rawType : 'text'
  return {
    key,
    label: stringValue(field.label) ?? humanize(key),
    type,
    description: stringValue(field.description),
    placeholder: stringValue(field.placeholder),
    required: booleanValue(field.required) ?? false,
    readOnly: booleanValue(field.read_only) ?? false,
    choices: normalizeChoices(field.choices),
    ...(field.default_value !== undefined && { defaultValue: field.default_value }),
    contextKey: stringValue(field.context_key),
    min: numberValue(field.min),
    max: numberValue(field.max),
    step: numberValue(field.step),
  }
}

function normalizeChoices(raw: unknown): ActionChoice[] {
  if (!Array.isArray(raw)) return []
  return raw.flatMap(choice => {
    if (typeof choice === 'string' || typeof choice === 'number') {
      const value = String(choice)
      return [{ value, label: value }]
    }
    const item = objectValue(choice)
    const value = stringValue(item.value)
    if (!value) return []
    return [{ value, label: stringValue(item.label) ?? value }]
  })
}

function coerceInputValue(field: ActionField, value: string): unknown {
  if (isNumeric(field.type)) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : value
  }
  if (field.type === 'boolean') return value === 'true'
  if (field.type === 'multi_select') {
    return value.split(',').map(entry => entry.trim()).filter(Boolean)
  }
  return value
}

function isNumeric(type: ActionFieldType): boolean {
  return type === 'number' || type === 'currency' || type === 'percent'
}

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === '' ||
    (Array.isArray(value) && value.length === 0)
}

function safeFormUrl(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) return true
  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

function recordValue(value: unknown): Record<string, unknown> {
  return objectValue(value)
}

function arrayValue(value: unknown): unknown[] | null {
  return Array.isArray(value) ? value : null
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function booleanValue(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function humanize(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}
