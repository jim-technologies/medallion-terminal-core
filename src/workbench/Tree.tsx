import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import type { Density } from '../foundations/types'
import { Icon } from '../components/Icon'
import { cx } from '../components/utils'

/** One stable node in a generic hierarchy. */
export interface TreeItem {
  /** Required unique ID used for selection, expansion, focus, and React keys. */
  id: string
  /** Visible item label. */
  label: ReactNode
  /** Optional secondary item text. */
  description?: ReactNode
  /** Optional leading visual. */
  icon?: ReactNode
  /** Removes the item from selection and keyboard navigation. */
  disabled?: boolean
  /** Nested child items. */
  children?: readonly TreeItem[]
}

/** Props for the controlled hierarchy explorer. */
export interface TreeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Root hierarchy items. IDs must be unique across the full tree. */
  items: readonly TreeItem[]
  /** Accessible name for the tree. */
  label: string
  /** ID of the selected item. */
  selectedId?: string
  /** Called when pointer or keyboard interaction selects an enabled item. */
  onSelectionChange?: (id: string) => void
  /** IDs of expanded branch items. */
  expandedIds: ReadonlySet<string>
  /** Called with a fresh set after user expansion or collapse. */
  onExpandedChange: (ids: ReadonlySet<string>) => void
  /** Optional density override for tree rows. */
  density?: Density
}

interface VisibleTreeItem {
  item: TreeItem
  level: number
  parentId?: string
  position: number
  setSize: number
}

/** Controlled tree with selection, expansion, and WAI-style keyboard navigation. */
export const Tree = forwardRef<HTMLDivElement, TreeProps>(function Tree(
  {
    items,
    label,
    selectedId,
    onSelectionChange,
    expandedIds,
    onExpandedChange,
    density,
    className,
    ...rest
  },
  ref,
) {
  const visible = useMemo(() => flattenVisible(items, expandedIds), [items, expandedIds])
  const itemRefs = useRef(new Map<string, HTMLDivElement>())
  const [focusedId, setFocusedId] = useState<string | undefined>(
    selectedId ?? visible.find(entry => !entry.item.disabled)?.item.id,
  )

  useEffect(() => {
    if (focusedId && visible.some(entry => entry.item.id === focusedId && !entry.item.disabled)) return
    setFocusedId(selectedId ?? visible.find(entry => !entry.item.disabled)?.item.id)
  }, [focusedId, selectedId, visible])

  const focus = (id: string | undefined) => {
    if (!id) return
    setFocusedId(id)
    itemRefs.current.get(id)?.focus()
  }
  const setExpanded = (id: string, expanded: boolean) => {
    const next = new Set(expandedIds)
    if (expanded) next.add(id)
    else next.delete(id)
    onExpandedChange(next)
  }
  const enabledEntries = visible.filter(entry => !entry.item.disabled)

  const onItemKeyDown = (event: KeyboardEvent<HTMLDivElement>, entry: VisibleTreeItem) => {
    const enabledIndex = enabledEntries.findIndex(candidate => candidate.item.id === entry.item.id)
    const hasChildren = !!entry.item.children?.length
    const expanded = expandedIds.has(entry.item.id)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      const next = enabledEntries[Math.min(
        enabledEntries.length - 1,
        Math.max(0, enabledIndex + delta),
      )]
      focus(next?.item.id)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      if (hasChildren && !expanded) setExpanded(entry.item.id, true)
      else if (hasChildren) focus(entry.item.children?.find(child => !child.disabled)?.id)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (hasChildren && expanded) setExpanded(entry.item.id, false)
      else focus(entry.parentId)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const target = event.key === 'Home' ? enabledEntries[0] : enabledEntries[enabledEntries.length - 1]
      focus(target?.item.id)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelectionChange?.(entry.item.id)
    } else if (event.key === '*' && entry.parentId) {
      event.preventDefault()
      const next = new Set(expandedIds)
      for (const sibling of visible.filter(candidate => candidate.parentId === entry.parentId)) {
        if (sibling.item.children?.length) next.add(sibling.item.id)
      }
      onExpandedChange(next)
    }
  }

  return (
    <div
      {...rest}
      ref={ref}
      role="tree"
      aria-label={label}
      aria-multiselectable={false}
      className={cx('mtc-tree', density && `mtc-density-${density}`, className)}
    >
      {visible.map(entry => {
        const { item } = entry
        const hasChildren = !!item.children?.length
        const expanded = expandedIds.has(item.id)
        const selected = selectedId === item.id
        return (
          <div
            key={item.id}
            ref={node => {
              if (node) itemRefs.current.set(item.id, node)
              else itemRefs.current.delete(item.id)
            }}
            role="treeitem"
            aria-level={entry.level}
            aria-posinset={entry.position}
            aria-setsize={entry.setSize}
            aria-expanded={hasChildren ? expanded : undefined}
            aria-selected={selected}
            aria-disabled={item.disabled || undefined}
            tabIndex={!item.disabled && focusedId === item.id ? 0 : -1}
            className="mtc-tree-item"
            data-selected={selected}
            data-disabled={item.disabled || undefined}
            style={{ '--mtc-tree-level': entry.level } as CSSProperties}
            onFocus={() => setFocusedId(item.id)}
            onClick={() => {
              if (!item.disabled) onSelectionChange?.(item.id)
            }}
            onDoubleClick={() => {
              if (!item.disabled && hasChildren) setExpanded(item.id, !expanded)
            }}
            onKeyDown={event => onItemKeyDown(event, entry)}
          >
            <button
              type="button"
              className="mtc-tree-toggle"
              tabIndex={-1}
              aria-label={hasChildren ? `${expanded ? 'Collapse' : 'Expand'} ${stringLabel(item.label)}` : undefined}
              aria-hidden={!hasChildren || undefined}
              disabled={!hasChildren || item.disabled}
              onClick={(event) => {
                event.stopPropagation()
                if (hasChildren) setExpanded(item.id, !expanded)
              }}
            >
              {hasChildren && <Icon name="chevron-right" />}
            </button>
            {item.icon && <span className="mtc-tree-icon" aria-hidden="true">{item.icon}</span>}
            <span className="mtc-tree-copy">
              <span className="mtc-tree-label">{item.label}</span>
              {item.description && <span className="mtc-tree-description">{item.description}</span>}
            </span>
          </div>
        )
      })}
    </div>
  )
})

function flattenVisible(
  items: readonly TreeItem[],
  expandedIds: ReadonlySet<string>,
  level = 1,
  parentId?: string,
  seen = new Set<string>(),
): VisibleTreeItem[] {
  const result: VisibleTreeItem[] = []
  items.forEach((item, index) => {
    if (!item.id || seen.has(item.id)) return
    seen.add(item.id)
    result.push({
      item,
      level,
      parentId,
      position: index + 1,
      setSize: items.length,
    })
    if (item.children?.length && expandedIds.has(item.id)) {
      result.push(...flattenVisible(item.children, expandedIds, level + 1, item.id, seen))
    }
  })
  return result
}

function stringLabel(label: ReactNode): string {
  return typeof label === 'string' || typeof label === 'number' ? String(label) : 'item'
}
