import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Tabs } from '../components/Navigation'
import type { BreadcrumbItem } from '../components/Navigation'
import { cx, useControllableState } from '../components/utils'
import { useMessage } from '../foundations/DesignSystemProvider'
import { PageHeader } from '../workbench/PageHeader'
import { ObjectHeader, type ObjectHeaderProps } from './ObjectHeader'

/** One section of an object page: Overview, Properties, Links, Activity. */
export interface ObjectPageTab {
  id: string
  label: ReactNode
  /** Count after the label, such as the number of links. */
  count?: ReactNode
  panel: ReactNode
}

/** Props for an object's page. */
export interface ObjectPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The object's identity (type, title, id, status, metadata, actions). */
  header: ObjectHeaderProps
  /** Location trail, such as Ontology › Customer › Northstar Labs. */
  breadcrumbs?: readonly BreadcrumbItem[]
  /** Sections in order; the first is shown by default. */
  tabs: readonly ObjectPageTab[]
  /** Controlled section. */
  tab?: string
  defaultTab?: string
  onTabChange?: (id: string) => void
  /** Accessible name of the section list; defaults to "Object sections". */
  tabsLabel?: string
}

/**
 * The object anatomy as a page: breadcrumbs, the `ObjectHeader`, then
 * sections as tabs (typically Overview, Properties, Links, Activity) whose
 * panels compose `PropertyPanel`, `LinkPanel`, `LinkGraph` and
 * `ActivityFeed`. Routing-agnostic: drive `tab` from the URL to deep-link a
 * section.
 */
export const ObjectPage = forwardRef<HTMLDivElement, ObjectPageProps>(function ObjectPage(
  { header, breadcrumbs, tabs, tab, defaultTab, onTabChange, tabsLabel, className, ...rest },
  ref,
) {
  const t = useMessage()
  const [current, setCurrent] = useControllableState({
    value: tab,
    defaultValue: defaultTab ?? tabs[0]?.id ?? '',
    onChange: onTabChange,
  })
  return (
    <div {...rest} ref={ref} className={cx('mtc-object-page', className)}>
      <PageHeader breadcrumbs={breadcrumbs} className="mtc-object-page-header">
        <ObjectHeader {...header} headingLevel={1} />
      </PageHeader>
      <Tabs
        label={tabsLabel ?? t('objectPage.sections')}
        value={current}
        onValueChange={setCurrent}
        items={tabs.map(section => ({ id: section.id, label: section.label, count: section.count, panel: section.panel }))}
        className="mtc-object-page-tabs"
      />
    </div>
  )
})
