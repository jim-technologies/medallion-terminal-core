import { forwardRef, useState, type HTMLAttributes } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { TypeGlyph } from '../components/TypeGlyph'
import { cx } from '../components/utils'
import { useLocale, useMessage } from '../foundations/DesignSystemProvider'
import { formatNumber } from '../foundations/intl'
import { typePresentation, type ObjectTypeRef } from './types'

/** One value of a facet. */
export interface FacetOption {
  value: string
  label: string
  /** Matching results. */
  count?: number
  /** Type glyph for object type facets. */
  type?: ObjectTypeRef
  /** Icon for other facets. */
  icon?: IconName
}

/** One facet: object type, a property's values, status. */
export interface FacetGroup {
  id: string
  label: string
  /** `single` behaves like radio buttons (object type); `multi` like checkboxes. */
  mode: 'single' | 'multi'
  options: readonly FacetOption[]
  /** Selected option values. */
  selected: readonly string[]
  /** Options shown before "Show more" (8 when unset). */
  maxVisible?: number
}

/** Props for the explorer's facet rail. */
export interface FacetListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Accessible name, such as "Filters". */
  label: string
  groups: readonly FacetGroup[]
  /** Called with a group's full selection after each change. */
  onChange: (groupId: string, values: string[]) => void
  /** Shows "Clear" while anything is selected. */
  onClear?: () => void
}

/**
 * The explorer's facet rail: groups of options with counts, the object type
 * facet single-select with type glyphs, value facets as checkboxes. Native
 * radio and checkbox inputs carry the semantics; long groups fold behind
 * "Show more".
 */
export const FacetList = forwardRef<HTMLDivElement, FacetListProps>(function FacetList(
  { label, groups, onChange, onClear, className, ...rest },
  ref,
) {
  const t = useMessage()
  const { locale } = useLocale()
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set())
  const anySelected = groups.some(group => group.selected.length > 0)
  return (
    <div {...rest} ref={ref} role="group" aria-label={label} className={cx('mtc-facet-list', className)}>
      {onClear && anySelected && (
        <div className="mtc-facet-list-header">
          <button type="button" className="mtc-facet-clear" onClick={onClear}>{t('facet.clear')}</button>
        </div>
      )}
      {groups.map(group => {
        const limit = group.maxVisible ?? 8
        const open = expanded.has(group.id)
        const hidden = group.options.length - limit
        const shown = open || hidden <= 0 ? group.options : group.options.slice(0, limit)
        const inputName = `mtc-facet-${group.id}`
        return (
          <fieldset key={group.id} className="mtc-facet-group">
            <legend className="mtc-facet-legend">{group.label}</legend>
            <div className="mtc-facet-options">
              {shown.map(option => {
                const checked = group.selected.includes(option.value)
                const presentation = option.type ? typePresentation(option.type) : null
                return (
                  <label key={option.value} className="mtc-facet-option" data-mode={group.mode} data-checked={checked || undefined}>
                    <input
                      type={group.mode === 'single' ? 'radio' : 'checkbox'}
                      name={inputName}
                      value={option.value}
                      checked={checked}
                      className={group.mode === 'single' ? 'mtc-visually-hidden' : 'mtc-facet-checkbox'}
                      onChange={() => {
                        if (group.mode === 'single') onChange(group.id, [option.value])
                        else onChange(group.id, checked
                          ? group.selected.filter(value => value !== option.value)
                          : [...group.selected, option.value])
                      }}
                    />
                    {presentation
                      ? <TypeGlyph icon={presentation.icon} color={presentation.color} size={16} />
                      : option.icon ? <Icon name={option.icon} className="mtc-facet-icon" /> : null}
                    <span className="mtc-facet-label">{option.label}</span>
                    {option.count !== undefined && (
                      <span className="mtc-facet-count">{formatNumber(option.count, { locale })}</span>
                    )}
                  </label>
                )
              })}
            </div>
            {hidden > 0 && (
              <button
                type="button"
                className="mtc-facet-more"
                aria-expanded={open}
                onClick={() => setExpanded(current => {
                  const next = new Set(current)
                  if (open) next.delete(group.id)
                  else next.add(group.id)
                  return next
                })}
              >
                {open ? t('facet.showLess') : t('facet.showMore', { count: hidden })}
              </button>
            )}
          </fieldset>
        )
      })}
    </div>
  )
})
