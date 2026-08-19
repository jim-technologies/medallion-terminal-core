import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import type { ComponentSize, Density } from '../foundations/types'
import { Icon } from './Icon'
import { cx } from './utils'

/** Props for a tokenized text input. */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual control size. */
  size?: ComponentSize
  /** Optional density override for this control. */
  density?: Density
  /** Marks the control invalid without replacing a supplied ARIA value. */
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'medium', density, invalid, className, ...rest },
  ref,
) {
  return (
    <input
      {...rest}
      ref={ref}
      aria-invalid={invalid || rest['aria-invalid'] || undefined}
      className={cx('mtc-input', density && `mtc-density-${density}`, className)}
      data-size={size}
    />
  )
})

/** Props for a tokenized multiline input. */
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visual control size. */
  size?: ComponentSize
  /** Optional density override for this control. */
  density?: Density
  /** Marks the control invalid without replacing a supplied ARIA value. */
  invalid?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { size = 'medium', density, invalid, className, ...rest },
  ref,
) {
  return (
    <textarea
      {...rest}
      ref={ref}
      aria-invalid={invalid || rest['aria-invalid'] || undefined}
      className={cx('mtc-input mtc-textarea', density && `mtc-density-${density}`, className)}
      data-size={size}
    />
  )
})

/** Props for labels, help text, and validation around one form control. */
export interface FormFieldProps {
  /** Visible field label. */
  label: ReactNode
  /** One form control that accepts `id` and ARIA description props. */
  children: ReactElement
  /** Stable control ID when the child does not already provide one. */
  id?: string
  /** Non-error help text announced with the control. */
  description?: ReactNode
  /** Validation message announced with the control. */
  error?: ReactNode
  /** Marks the child as required and displays a required indicator. */
  required?: boolean
  /** Additional class for the field wrapper. */
  className?: string
}

/**
 * Connects a label and descriptive/error text to one child control. Explicit
 * child IDs and ARIA attributes are preserved.
 */
export function FormField({
  label,
  children,
  id,
  description,
  error,
  required,
  className,
}: FormFieldProps) {
  const generatedId = useId()
  const existingChildId = isValidElement<Record<string, unknown>>(children)
    && typeof children.props.id === 'string'
    ? children.props.id
    : undefined
  const controlId = existingChildId ?? id ?? `mtc-field-${generatedId}`
  const descriptionId = description ? `${controlId}-description` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const childDescribedBy = isValidElement<Record<string, unknown>>(children)
    && typeof children.props['aria-describedby'] === 'string'
    ? children.props['aria-describedby']
    : undefined
  const describedBy = [childDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const childRequired = isValidElement<Record<string, unknown>>(children)
    && typeof children.props.required === 'boolean'
    ? children.props.required
    : undefined
  const fieldRequired = childRequired ?? required

  const control = isValidElement<Record<string, unknown>>(children)
    ? cloneElement(children, {
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid': children.props['aria-invalid'] ?? (error ? true : undefined),
        required: fieldRequired,
      })
    : children

  return (
    <div className={cx('mtc-form-field', className)}>
      <label className="mtc-form-label" htmlFor={controlId}>
        {label}
        {fieldRequired && <span aria-hidden="true" className="mtc-form-required"> *</span>}
      </label>
      {control}
      {description && (
        <div id={descriptionId} className="mtc-form-description">{description}</div>
      )}
      {error && (
        <div id={errorId} className="mtc-form-error" role="alert">{error}</div>
      )}
    </div>
  )
}

interface ChoiceBaseProps {
  /** Visible label that also supplies the control's accessible name. */
  label: ReactNode
  /** Optional supporting copy rendered with the label. */
  description?: ReactNode
  /** Optional density override for this control. */
  density?: Density
}

/** Props for a labeled native checkbox. */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ChoiceBaseProps {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, density, className, ...rest },
  ref,
) {
  return (
    <label className={cx('mtc-choice', density && `mtc-density-${density}`, className)}>
      <input {...rest} ref={ref} type="checkbox" className="mtc-choice-input" />
      <span className="mtc-choice-box" aria-hidden="true"><Icon name="check" /></span>
      <span className="mtc-choice-copy">
        <span className="mtc-choice-label">{label}</span>
        {description && <span className="mtc-choice-description">{description}</span>}
      </span>
    </label>
  )
})

/** Props for a labeled native radio button. */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, ChoiceBaseProps {}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, density, className, ...rest },
  ref,
) {
  return (
    <label className={cx('mtc-choice', density && `mtc-density-${density}`, className)}>
      <input {...rest} ref={ref} type="radio" className="mtc-choice-input" />
      <span className="mtc-choice-box mtc-radio-box" aria-hidden="true" />
      <span className="mtc-choice-copy">
        <span className="mtc-choice-label">{label}</span>
        {description && <span className="mtc-choice-description">{description}</span>}
      </span>
    </label>
  )
})

/** Props for a controlled boolean switch. */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange' | 'size'>, ChoiceBaseProps {
  /** Current checked state. */
  checked: boolean
  /** Called with the next checked state after user interaction. */
  onCheckedChange: (checked: boolean) => void
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { checked, onCheckedChange, label, description, density, className, ...rest },
  ref,
) {
  return (
    <label className={cx('mtc-switch', density && `mtc-density-${density}`, className)}>
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onCheckedChange(event.currentTarget.checked)}
        className="mtc-switch-input"
      />
      <span className="mtc-switch-track" aria-hidden="true"><span /></span>
      <span className="mtc-choice-copy">
        <span className="mtc-choice-label">{label}</span>
        {description && <span className="mtc-choice-description">{description}</span>}
      </span>
    </label>
  )
})

/** One selectable value in a Combobox. */
export interface ComboboxOption {
  /** Stable submitted value. Values must be unique within the option set. */
  value: string
  /** Human-readable option label. */
  label: string
  /** Optional secondary text included in filtering. */
  description?: string
  /** Prevents pointer and keyboard selection. */
  disabled?: boolean
}

/** Props for the controlled searchable select. */
export interface ComboboxProps {
  /** Selected option value, or `null` when no option is selected. */
  value: string | null
  /** Called when the user commits an enabled option. */
  onValueChange: (value: string) => void
  /** Searchable options with unique values. */
  options: readonly ComboboxOption[]
  /** Input placeholder shown without a selected value. */
  placeholder?: string
  /** Disables the input and prevents the listbox from opening. */
  disabled?: boolean
  /** Participates in native form required validation. */
  required?: boolean
  /** Optional form field name; a hidden input submits the selected value. */
  name?: string
  /** Stable input ID used to associate labels and listbox options. */
  id?: string
  /** Accessible name when no external label is used. */
  'aria-label'?: string
  /** ID of an external element that labels the input. */
  'aria-labelledby'?: string
  /** IDs of external descriptive elements. */
  'aria-describedby'?: string
  /** Explicit ARIA invalid state, including grammar and spelling variants. */
  'aria-invalid'?: InputHTMLAttributes<HTMLInputElement>['aria-invalid']
  /** Marks the input invalid. */
  invalid?: boolean
  /** Visual control size. */
  size?: ComponentSize
  /** Optional density override for this control. */
  density?: Density
  /** Additional class for the combobox wrapper. */
  className?: string
  /** Content rendered when filtering produces no options. */
  emptyMessage?: ReactNode
}

/**
 * Searchable controlled select with combobox/listbox semantics and complete
 * arrow, Home/End, Enter, Tab, and Escape behavior.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    value,
    onValueChange,
    options,
    placeholder = 'Select…',
    disabled,
    required,
    name,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    invalid,
    size = 'medium',
    density,
    className,
    emptyMessage = 'No matching options',
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? `mtc-combobox-${generatedId}`
  const listboxId = `${inputId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const selected = options.find(option => option.value === value)
  const [query, setQuery] = useState(selected?.label ?? '')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    if (!needle || selected?.label === query) return [...options]
    return options.filter(option => (
      option.label.toLocaleLowerCase().includes(needle)
      || option.description?.toLocaleLowerCase().includes(needle)
    ))
  }, [options, query, selected?.label])

  useEffect(() => {
    if (!open) setQuery(selected?.label ?? '')
  }, [open, selected?.label])

  useEffect(() => {
    inputRef.current?.setCustomValidity(
      required && !selected ? 'Please select an option.' : '',
    )
  }, [required, selected])

  useEffect(() => {
    if (!open || typeof document === 'undefined') return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const firstEnabled = (from: number, delta: 1 | -1) => {
    if (filtered.length === 0) return -1
    let index = from
    for (let count = 0; count < filtered.length; count++) {
      index = (index + delta + filtered.length) % filtered.length
      if (!filtered[index]?.disabled) return index
    }
    return -1
  }

  const select = (option: ComboboxOption) => {
    if (option.disabled) return
    onValueChange(option.value)
    setQuery(option.label)
    setOpen(false)
    setActiveIndex(-1)
  }

  return (
    <div
      ref={rootRef}
      className={cx('mtc-combobox', density && `mtc-density-${density}`, className)}
      data-size={size}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      <input
        ref={node => {
          inputRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        id={inputId}
        value={query}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        role="combobox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid || ariaInvalid || undefined}
        aria-required={required || undefined}
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={open && activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined}
        className="mtc-input mtc-combobox-input"
        onFocus={() => {
          setOpen(true)
          setActiveIndex(filtered.findIndex(option => option.value === value && !option.disabled))
        }}
        onChange={(event) => {
          setQuery(event.currentTarget.value)
          setOpen(true)
          setActiveIndex(-1)
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
            setActiveIndex(index => firstEnabled(index, 1))
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setOpen(true)
            setActiveIndex(index => firstEnabled(index < 0 ? 0 : index, -1))
          } else if (event.key === 'Home' && open) {
            event.preventDefault()
            setActiveIndex(firstEnabled(-1, 1))
          } else if (event.key === 'End' && open) {
            event.preventDefault()
            setActiveIndex(firstEnabled(0, -1))
          } else if (event.key === 'Enter' && open && activeIndex >= 0) {
            event.preventDefault()
            const option = filtered[activeIndex]
            if (option) select(option)
          } else if (event.key === 'Escape' && open) {
            event.preventDefault()
            event.stopPropagation()
            setOpen(false)
            setQuery(selected?.label ?? '')
          } else if (event.key === 'Tab') {
            setOpen(false)
          }
        }}
      />
      <Icon name="chevron-down" className="mtc-combobox-chevron" aria-hidden="true" />
      {open && !disabled && (
        <div id={listboxId} role="listbox" className="mtc-combobox-list mtc-popover">
          {filtered.length === 0 ? (
            <div className="mtc-combobox-empty">{emptyMessage}</div>
          ) : filtered.map((option, index) => (
            <div
              id={`${inputId}-option-${index}`}
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              className="mtc-combobox-option"
              data-active={activeIndex === index}
              data-selected={option.value === value}
              onMouseDown={event => event.preventDefault()}
              onMouseMove={() => { if (!option.disabled) setActiveIndex(index) }}
              onClick={() => select(option)}
            >
              <span className="mtc-combobox-option-copy">
                <span>{option.label}</span>
                {option.description && <small>{option.description}</small>}
              </span>
              {option.value === value && <Icon name="check" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
