import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useMessage, usePortalContainer } from '../foundations/DesignSystemProvider'
import { Kbd } from './Display'
import { Icon } from './Icon'
import { handleModalKeyDown, useModalFocus } from './utils'

/** One result or command. */
export interface CommandItem {
  id: string
  label: string
  /** Secondary text, such as a type name, id or path. */
  description?: ReactNode
  /** Leading visual, such as a `TypeGlyph`. */
  icon?: ReactNode
  /** Display-only shortcut hint. */
  shortcut?: string
  disabled?: boolean
}

/** A titled group of results, such as one object type. */
export interface CommandGroup {
  id: string
  label: string
  items: readonly CommandItem[]
}

/** Props for the global search and command palette. */
export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Current query. */
  query: string
  onQueryChange: (query: string) => void
  /** Results for the query, grouped. The host searches; the palette presents. */
  groups: readonly CommandGroup[]
  /** An item was chosen (Enter or click); the palette closes. */
  onSelect: (item: CommandItem) => void
  /** Enter with no item highlighted, such as a free-text command. */
  onSubmit?: (query: string) => void
  /**
   * Highlight the first item as results change (the default), so Enter
   * opens it. Off, Enter submits the query until an arrow key picks an item.
   */
  autoHighlight?: boolean
  /** Accessible name; defaults to "Command palette". */
  label?: string
  placeholder?: string
  /** A search is in flight. */
  loading?: boolean
  /** Shown when there are no results for a non-empty query. */
  emptyLabel?: ReactNode
  /** Content under the results; defaults to the keyboard hints. */
  footer?: ReactNode
  /** Toggle with Ctrl/⌘ K from anywhere on the page. */
  hotkey?: boolean
}

/**
 * The global search and command palette: a modal combobox over grouped
 * results. Arrow keys move the highlight across groups, Enter chooses (or
 * submits the query), Escape closes and focus returns to where it was. The
 * host owns searching and navigation; the palette owns presentation and
 * keyboard. The Dashboard's `⌘K` palette is built on it.
 */
export function CommandPalette({
  open,
  onOpenChange,
  query,
  onQueryChange,
  groups,
  onSelect,
  onSubmit,
  autoHighlight = true,
  label,
  placeholder,
  loading = false,
  emptyLabel,
  footer,
  hotkey = true,
}: CommandPaletteProps) {
  const t = useMessage()
  const container = usePortalContainer()
  const baseId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const items = useMemo(
    () => groups.flatMap(group => group.items.filter(item => !item.disabled)),
    [groups],
  )
  const [active, setActive] = useState<string | null>(null)
  useModalFocus(open, dialogRef, inputRef)

  useEffect(() => {
    setActive(autoHighlight ? items[0]?.id ?? null : null)
  }, [items, autoHighlight])

  useEffect(() => {
    if (!hotkey) return
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [hotkey, open, onOpenChange])

  useEffect(() => {
    if (!active) return
    listRef.current
      ?.querySelector(`[data-command-id="${CSS.escape(active)}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  const optionId = (id: string) => `${baseId}-option-${id}`
  const move = (delta: 1 | -1) => {
    if (items.length === 0) return
    const index = active ? items.findIndex(item => item.id === active) : -1
    const next = index < 0
      ? (delta === 1 ? 0 : items.length - 1)
      : (index + delta + items.length) % items.length
    setActive(items[next]!.id)
  }
  const choose = (item: CommandItem) => {
    if (item.disabled) return
    onSelect(item)
    onOpenChange(false)
  }

  const dialog = (
    <div
      className="mtc-modal-backdrop mtc-overlay mtc-command-backdrop"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onOpenChange(false)
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label ?? t('palette.label')}
        tabIndex={-1}
        className="mtc-command-palette"
        onKeyDown={event => handleModalKeyDown(event, dialogRef, true, () => onOpenChange(false))}
      >
        <div className="mtc-command-input-row">
          <Icon name="search" className="mtc-command-input-icon" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${baseId}-listbox`}
            aria-activedescendant={active ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-label={label ?? t('palette.label')}
            placeholder={placeholder ?? t('palette.placeholder')}
            className="mtc-command-input"
            value={query}
            onChange={event => onQueryChange(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault()
                move(event.key === 'ArrowDown' ? 1 : -1)
              } else if (event.key === 'Enter') {
                event.preventDefault()
                const item = active ? items.find(candidate => candidate.id === active) : undefined
                if (item) choose(item)
                else if (onSubmit) {
                  onSubmit(query)
                  onOpenChange(false)
                }
              }
            }}
          />
          {loading && <Icon name="spinner" className="mtc-command-spinner" label={t('palette.loading')} />}
        </div>
        <div ref={listRef} id={`${baseId}-listbox`} role="listbox" aria-label={t('palette.results')} className="mtc-command-list">
          {groups.map(group => group.items.length > 0 && (
            <div key={group.id} role="group" aria-labelledby={`${baseId}-group-${group.id}`} className="mtc-command-group">
              <div id={`${baseId}-group-${group.id}`} className="mtc-command-group-label" role="presentation">
                {group.label}
              </div>
              {group.items.map(item => (
                <div
                  key={item.id}
                  id={optionId(item.id)}
                  role="option"
                  aria-selected={item.id === active}
                  aria-disabled={item.disabled || undefined}
                  data-command-id={item.id}
                  className="mtc-command-item"
                  onMouseMove={() => {
                    if (!item.disabled && item.id !== active) setActive(item.id)
                  }}
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => choose(item)}
                >
                  {item.icon && <span className="mtc-command-item-icon">{item.icon}</span>}
                  <span className="mtc-command-item-copy">
                    <span className="mtc-command-item-label">{item.label}</span>
                    {item.description && <span className="mtc-command-item-description">{item.description}</span>}
                  </span>
                  {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
                </div>
              ))}
            </div>
          ))}
          {items.length === 0 && query.trim() !== '' && !loading && (
            <div className="mtc-command-empty" role="presentation">{emptyLabel ?? t('palette.empty')}</div>
          )}
        </div>
        <div className="mtc-command-footer">
          {footer ?? (
            <>
              <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> {t('palette.navigate')}</span>
              <span><Kbd>↵</Kbd> {t('palette.select')}</span>
              <span><Kbd>Esc</Kbd> {t('palette.close')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
  return container ? createPortal(dialog, container) : dialog
}
