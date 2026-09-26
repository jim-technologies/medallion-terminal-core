import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { useMessage } from '../foundations/DesignSystemProvider'
import type { ComponentSize } from '../foundations/types'
import { IconButton } from './Button'
import { Kbd } from './Display'
import { Icon } from './Icon'
import { cx } from './utils'

/** A scope token shown inside the field, such as a type filter. */
export interface SearchToken {
  id: string
  label: string
  /** Leading visual, such as a `TypeGlyph`. */
  icon?: ReactNode
}

/** Props for a search box with scope tokens. */
export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange' | 'onSubmit'> {
  /** Current query. */
  value: string
  /** Called on every edit. */
  onValueChange: (value: string) => void
  /** Accessible name of the input. */
  label: string
  /** Scope tokens before the query (a type pill, a folder). */
  tokens?: readonly SearchToken[]
  /** Removes a token (its × button, or Backspace in an empty field). */
  onRemoveToken?: (id: string) => void
  /** Enter. */
  onSubmit?: (value: string) => void
  /**
   * A key that focuses the field from anywhere outside another input, such
   * as `/`; shown as a hint while the field is empty.
   */
  shortcut?: string
  /** Overrides "Clear search". */
  clearLabel?: string
  /** Control size. */
  size?: ComponentSize
}

function typingElsewhere(target: EventTarget | null): boolean {
  return target instanceof HTMLElement
    && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
}

/**
 * The search box of explorers and product shells: a search icon, scope
 * tokens, the query, a clear action and an optional focus shortcut.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    value,
    onValueChange,
    label,
    tokens = [],
    onRemoveToken,
    onSubmit,
    shortcut,
    clearLabel,
    size = 'medium',
    className,
    placeholder,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const t = useMessage()
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  useEffect(() => {
    if (!shortcut) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== shortcut || event.metaKey || event.ctrlKey || event.altKey) return
      if (typingElsewhere(event.target)) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [shortcut])

  return (
    <form
      role="search"
      aria-label={label}
      className={cx('mtc-search-field', className)}
      data-size={size}
      onSubmit={(event: FormEvent) => {
        event.preventDefault()
        onSubmit?.(value)
      }}
    >
      <Icon name="search" className="mtc-search-field-icon" />
      {tokens.map(token => (
        <span key={token.id} className="mtc-search-token">
          {token.icon}
          <span>{token.label}</span>
          {onRemoveToken && (
            <button
              type="button"
              className="mtc-search-token-remove"
              aria-label={t('search.removeToken', { label: token.label })}
              onClick={() => {
                onRemoveToken(token.id)
                inputRef.current?.focus()
              }}
            >
              <Icon name="close" />
            </button>
          )}
        </span>
      ))}
      <input
        {...rest}
        ref={inputRef}
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        className="mtc-search-field-input"
        onChange={event => onValueChange(event.target.value)}
        onKeyDown={event => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          if (event.key === 'Backspace' && value === '' && tokens.length > 0 && onRemoveToken) {
            event.preventDefault()
            onRemoveToken(tokens[tokens.length - 1]!.id)
          } else if (event.key === 'Escape' && value !== '') {
            event.preventDefault()
            onValueChange('')
          }
        }}
      />
      {value !== '' ? (
        <IconButton
          icon={<Icon name="close" />}
          aria-label={clearLabel ?? t('search.clear')}
          variant="ghost"
          size="small"
          onClick={() => {
            onValueChange('')
            inputRef.current?.focus()
          }}
        />
      ) : shortcut ? (
        <Kbd aria-hidden="true" className="mtc-search-field-hint">{shortcut}</Kbd>
      ) : null}
    </form>
  )
})
