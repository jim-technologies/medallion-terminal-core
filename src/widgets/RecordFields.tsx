import { Tag } from '../components/Feedback'
import { Icon } from '../components/Icon'
import { useMessage } from '../foundations/DesignSystemProvider'
import type { StatusTone } from '../foundations/types'
import { PropertyValue } from '../objects/PropertyValue'
import { formatCompact, formatCurrency, formatPercent } from './format'
import {
  isRecordFieldEditable,
  recordValueLabel,
  type RecordChoiceData,
  type RecordFieldData,
} from './recordShapes'
import { safeUrl } from './textNormalize'

interface RecordValueProps {
  field: RecordFieldData
  value: unknown
  /**
   * `grid` keeps a list on one line (a fixed-height row): its first two
   * chips, then "+N". `panel` (the default) wraps up to four.
   */
  context?: 'panel' | 'grid'
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

// Choice colours are semantic tones, never CSS: anything else is a neutral
// chip.
function toneOf(color?: string): StatusTone {
  switch (color?.toLowerCase()) {
    case 'info':
    case 'blue':
    case 'cyan':
    case 'purple':
      return 'info'
    case 'ok':
    case 'green':
    case 'emerald':
      return 'ok'
    case 'warn':
    case 'amber':
    case 'yellow':
    case 'orange':
      return 'warning'
    case 'danger':
    case 'red':
      return 'danger'
    default:
      return 'neutral'
  }
}

// A choice renders like any enum value: a filled chip, or a status badge
// when its choice carries a tone.
function Chip({ field, value }: RecordValueProps) {
  const label = chipLabel(field, value)
  return <PropertyValue value={label} kind="enum" tones={{ [label]: toneOf(choiceFor(field, value)?.color) }} context="grid" />
}

function chipLabel(field: RecordFieldData, value: unknown): string {
  return choiceFor(field, value)?.label ?? recordValueLabel(value)
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
export function RecordValue({ field, value, context = 'panel' }: RecordValueProps) {
  const t = useMessage()
  if (value == null || value === '') return <span className="mtc-value-empty">—</span>

  if (field.type === 'boolean') return <PropertyValue value={value === true || value === 'true'} kind="boolean" context="grid" />

  // A list (multi-select, several users or links) is one chip per entry,
  // never one chip of joined ids.
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="mtc-value-empty">—</span>
    const shown = value.slice(0, context === 'grid' ? 2 : 4)
    const rest = value.slice(shown.length)
    return (
      <span className="mtc-value-list" data-context={context}>
        {shown.map((entry, index) => (
          <Chip key={`${recordValueLabel(entry)}:${index}`} field={field} value={entry} />
        ))}
        {rest.length > 0 && (
          <Tag
            className="mtc-value-chip mtc-value-more"
            title={t('value.moreTitle', { count: rest.length, items: rest.map(entry => chipLabel(field, entry)).join(', ') })}
          >
            {t('value.more', { count: rest.length })}
          </Tag>
        )}
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

  if (typeof value === 'number') {
    return <span className="tabular-nums">{formatRecordNumber(field, value)}</span>
  }

  if (field.type === 'date' || field.type === 'datetime' ||
      field.type === 'created_at' || field.type === 'updated_at') {
    // Intl-formatted in the scope's locale and time zone; a bare
    // YYYY-MM-DD stays that calendar day everywhere.
    return <PropertyValue value={value} kind={field.type === 'date' ? 'date' : 'datetime'} context="grid" />
  }

  if (field.type === 'url') {
    const url = safeUrl(value)
    if (url) {
      return (
        <a
          href={url}
          {...(url.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          className="mtc-value-link"
          onClick={event => event.stopPropagation()}
        >
          <span className="mtc-value-link-text">{url}</span>
          {!url.startsWith('/') && <Icon name="external-link" />}
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
  /** Accessible name when no visible label wraps the control (a grid cell). */
  label?: string
  /** Id of text that describes the control, such as a key hint. */
  describedBy?: string
  disabled?: boolean
  autoFocus?: boolean
  /**
   * Enter commits (Shift+Enter still adds a line to long text); without it,
   * Enter adds a line to long text and does nothing in other fields.
   */
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
  } else if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
    if (event.currentTarget.tagName === 'TEXTAREA' && !onCommit) return
    event.preventDefault()
    onCommit?.()
  }
}

type RecordInputKind = 'boolean' | 'choice' | 'choices' | 'long_text' | 'field'

// Which control edits a field. Users and links with choices pick from
// them, one or several as the field allows.
function recordInputKind(field: RecordFieldData): RecordInputKind {
  if (field.type === 'boolean') return 'boolean'
  const listed = (field.type === 'user' || field.type === 'link') && field.choices.length > 0
  if (field.type === 'single_select' || (listed && !field.allowMultiple)) return 'choice'
  if (field.type === 'multi_select' || (listed && field.allowMultiple)) return 'choices'
  if (field.type === 'long_text') return 'long_text'
  return 'field'
}

/**
 * Where a grid opens a field's editor: one-line controls (text, numbers,
 * dates, a single choice, Yes/No) edit in their cell; a list of choices and
 * long text are taller than a row, so they open over it.
 */
export function recordEditorLayout(field: RecordFieldData): 'inline' | 'overlay' {
  const kind = recordInputKind(field)
  return kind === 'choices' || kind === 'long_text' ? 'overlay' : 'inline'
}

// Shared input renderer. Computed and attachment fields deliberately stay
// read-only; formulas/rollups belong on the governed backend and attachments
// use the existing file-browser/upload surface.
export function RecordFieldInput({
  field,
  value,
  onChange,
  label,
  describedBy,
  disabled,
  autoFocus,
  onCommit,
  onCancel,
}: RecordFieldInputProps) {
  const blocked = disabled || !isRecordFieldEditable(field)
  const kind = recordInputKind(field)

  if (blocked) {
    return (
      <div className="flex items-center min-h-7 px-2 py-1.5 border border-zinc-800 rounded bg-zinc-950/30 text-xs text-zinc-400">
        <RecordValue field={field} value={value} />
      </div>
    )
  }

  if (kind === 'boolean') {
    return (
      <label className="flex items-center gap-2 min-h-7 text-xs text-zinc-300">
        <input
          type="checkbox"
          checked={value === true}
          onChange={event => onChange(event.target.checked)}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-label={label}
          aria-describedby={describedBy}
          onKeyDown={event => keyHandler(event, onCommit, onCancel)}
          className="w-4 h-4"
        />
        {value === true ? 'Yes' : 'No'}
      </label>
    )
  }

  if (kind === 'choice') {
    return (
      <select
        value={choiceValue(value)}
        onChange={event => onChange(event.target.value || null)}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={label}
        aria-describedby={describedBy}
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

  if (kind === 'choices') {
    const selected = Array.isArray(value) ? value.map(choiceValue) : []
    return (
      <select
        multiple
        value={selected}
        onChange={event => onChange([...event.target.selectedOptions].map(option => option.value))}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={label}
        aria-describedby={describedBy}
        onKeyDown={event => keyHandler(event, onCommit, onCancel)}
        className={`${INPUT_CLASS} min-h-24`}
      >
        {field.choices.map(choice => (
          <option key={choice.value} value={choice.value}>{choice.label}</option>
        ))}
      </select>
    )
  }

  if (kind === 'long_text') {
    return (
      <textarea
        value={inputValue(value)}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={label}
        aria-describedby={describedBy}
        onKeyDown={event => keyHandler(event, onCommit, onCancel)}
        rows={4}
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
      aria-label={label}
      aria-describedby={describedBy}
      onKeyDown={event => keyHandler(event, onCommit, onCancel)}
      className={INPUT_CLASS}
    />
  )
}
