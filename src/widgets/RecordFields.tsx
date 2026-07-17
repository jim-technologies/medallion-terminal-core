import { formatCompact, formatCurrency, formatPercent } from './format'
import {
  isRecordFieldEditable,
  recordValueLabel,
  type RecordChoiceData,
  type RecordFieldData,
} from './recordShapes'
import { localDate, safeUrl } from './textNormalize'

interface RecordValueProps {
  field: RecordFieldData
  value: unknown
}

function choiceValue(value: unknown): string {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const entry = value as Record<string, unknown>
    return String(entry.id ?? entry.value ?? entry.label ?? entry.name ?? '')
  }
  return value == null ? '' : String(value)
}

function choiceFor(field: RecordFieldData, value: unknown): RecordChoiceData | undefined {
  return field.choices.find(choice => choice.value === choiceValue(value))
}

function tone(color?: string): string {
  switch (color?.toLowerCase()) {
    case 'info':
    case 'blue':
    case 'cyan':
    case 'purple':
      return 'bg-sky-500/15 text-sky-300 border-sky-500/30'
    case 'ok':
    case 'green':
    case 'emerald':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    case 'warn':
    case 'amber':
    case 'yellow':
    case 'orange':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    case 'danger':
    case 'red':
      return 'bg-red-500/15 text-red-300 border-red-500/30'
    default:
      return 'bg-zinc-800 text-zinc-300 border-zinc-700'
  }
}

function Chip({ field, value }: RecordValueProps) {
  const choice = choiceFor(field, value)
  return (
    <span className={`inline-flex max-w-full items-center border rounded px-1.5 py-0.5 text-[10px] ${tone(choice?.color)}`}>
      <span className="truncate">{choice?.label ?? recordValueLabel(value)}</span>
    </span>
  )
}

function formatRecordNumber(field: RecordFieldData, value: number): string {
  if (field.type === 'currency' || field.format?.startsWith('currency')) {
    const currency = field.format?.startsWith('currency:')
      ? field.format.slice('currency:'.length)
      : 'USD'
    return formatCurrency(value, currency)
  }
  if (field.type === 'percent' || field.format === 'percent') return formatPercent(value)
  if (field.format === 'compact') return formatCompact(value)
  return value.toLocaleString(undefined, { maximumFractionDigits: 4 })
}

// Shared schema-aware value renderer used by grid, board, calendar, and form.
// It renders only semantic tones; arbitrary backend strings never become CSS.
export function RecordValue({ field, value }: RecordValueProps) {
  if (value == null || value === '') return <span className="text-zinc-700">—</span>

  if (field.type === 'boolean') {
    return (
      <span className={value ? 'text-emerald-400' : 'text-zinc-600'}>
        {value ? '✓' : '—'}
      </span>
    )
  }

  if (
    field.type === 'single_select' ||
    (field.type === 'user' && field.choices.length > 0) ||
    (field.type === 'link' && !!choiceFor(field, value))
  ) {
    return <Chip field={field} value={value} />
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-zinc-700">—</span>
    return (
      <span className="flex items-center gap-1 flex-wrap">
        {value.slice(0, 4).map((entry, index) => (
          <Chip key={`${recordValueLabel(entry)}:${index}`} field={field} value={entry} />
        ))}
        {value.length > 4 && <span className="text-[10px] text-zinc-500">+{value.length - 4}</span>}
      </span>
    )
  }

  if (typeof value === 'number') {
    return <span className="tabular-nums">{formatRecordNumber(field, value)}</span>
  }

  if (field.type === 'date' || field.type === 'datetime' ||
      field.type === 'created_at' || field.type === 'updated_at') {
    return <span className="tabular-nums">{String(localDate(value))}</span>
  }

  if (field.type === 'url') {
    const url = safeUrl(value)
    if (url) {
      return (
        <a
          href={url}
          {...(url.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          className="text-sky-400 hover:underline"
          onClick={event => event.stopPropagation()}
        >
          {url} <span aria-hidden="true">↗</span>
        </a>
      )
    }
  }

  return <span>{recordValueLabel(value)}</span>
}

export interface RecordFieldInputProps {
  field: RecordFieldData
  value: unknown
  onChange: (value: unknown) => void
  disabled?: boolean
  compact?: boolean
  autoFocus?: boolean
  onCommit?: () => void
  onCancel?: () => void
}

const INPUT_CLASS = 'mtc-control w-full px-2 py-1.5 text-xs text-zinc-100 outline-none focus:border-sky-500'

function inputValue(value: unknown): string {
  if (value && typeof value === 'object') return choiceValue(value)
  return value == null ? '' : String(value)
}

function dateTimeInputValue(value: unknown): string {
  if (typeof value !== 'string') return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 16)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

function keyHandler(
  event: React.KeyboardEvent<HTMLElement>,
  onCommit?: () => void,
  onCancel?: () => void,
) {
  if (event.key === 'Escape') {
    event.preventDefault()
    onCancel?.()
  } else if (event.key === 'Enter' && !event.shiftKey && event.currentTarget.tagName !== 'TEXTAREA') {
    event.preventDefault()
    onCommit?.()
  }
}

// Shared input renderer. Computed and attachment fields deliberately stay
// read-only; formulas/rollups belong on the governed backend and attachments
// use the existing file-browser/upload surface.
export function RecordFieldInput({
  field,
  value,
  onChange,
  disabled,
  compact,
  autoFocus,
  onCommit,
  onCancel,
}: RecordFieldInputProps) {
  const blocked = disabled || !isRecordFieldEditable(field)

  if (blocked) {
    return (
      <div className="min-h-7 px-2 py-1.5 border border-zinc-800 rounded bg-zinc-950/30 text-xs text-zinc-400">
        <RecordValue field={field} value={value} />
      </div>
    )
  }

  if (field.type === 'boolean') {
    return (
      <label className="flex items-center gap-2 min-h-7 text-xs text-zinc-300">
        <input
          type="checkbox"
          checked={value === true}
          onChange={event => onChange(event.target.checked)}
          disabled={disabled}
          autoFocus={autoFocus}
          onKeyDown={event => keyHandler(event, onCommit, onCancel)}
          className="w-4 h-4"
        />
        {value === true ? 'Yes' : 'No'}
      </label>
    )
  }

  if (field.type === 'single_select' ||
      ((field.type === 'user' || field.type === 'link') && field.choices.length > 0 && !field.allowMultiple)) {
    return (
      <select
        value={choiceValue(value)}
        onChange={event => onChange(event.target.value || null)}
        disabled={disabled}
        autoFocus={autoFocus}
        onKeyDown={event => keyHandler(event, onCommit, onCancel)}
        className={INPUT_CLASS}
      >
        <option value="">Select…</option>
        {field.choices.map(choice => (
          <option key={choice.value} value={choice.value}>{choice.label}</option>
        ))}
      </select>
    )
  }

  if (field.type === 'multi_select' ||
      ((field.type === 'user' || field.type === 'link') && field.choices.length > 0 && field.allowMultiple)) {
    const selected = Array.isArray(value) ? value.map(choiceValue) : []
    return (
      <select
        multiple
        value={selected}
        onChange={event => onChange([...event.target.selectedOptions].map(option => option.value))}
        disabled={disabled}
        autoFocus={autoFocus}
        onKeyDown={event => keyHandler(event, onCommit, onCancel)}
        className={`${INPUT_CLASS} ${compact ? 'min-h-16' : 'min-h-24'}`}
      >
        {field.choices.map(choice => (
          <option key={choice.value} value={choice.value}>{choice.label}</option>
        ))}
      </select>
    )
  }

  if (field.type === 'long_text') {
    return (
      <textarea
        value={inputValue(value)}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
        autoFocus={autoFocus}
        onKeyDown={event => keyHandler(event, onCommit, onCancel)}
        rows={compact ? 2 : 4}
        className={`${INPUT_CLASS} resize-y`}
      />
    )
  }

  const numeric = field.type === 'number' || field.type === 'currency' || field.type === 'percent'
  const type =
    numeric ? 'number' :
    field.type === 'date' ? 'date' :
    field.type === 'datetime' ? 'datetime-local' :
    field.type === 'email' ? 'email' :
    field.type === 'phone' ? 'tel' :
    field.type === 'url' ? 'url' :
    'text'
  const renderedValue = field.type === 'datetime'
    ? dateTimeInputValue(value)
    : inputValue(value)

  return (
    <input
      type={type}
      value={renderedValue}
      onChange={event => {
        if (numeric) {
          const parsed = Number(event.target.value)
          onChange(event.target.value === '' || !Number.isFinite(parsed) ? null : parsed)
        } else if (field.type === 'datetime') {
          onChange(event.target.value ? new Date(event.target.value).toISOString() : null)
        } else {
          onChange(event.target.value)
        }
      }}
      disabled={disabled}
      autoFocus={autoFocus}
      onKeyDown={event => keyHandler(event, onCommit, onCancel)}
      className={INPUT_CLASS}
    />
  )
}
