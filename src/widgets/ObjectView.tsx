import { useMemo, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { useSubmitAction } from '../hooks/useSubmitAction'
import { isErrorStatus } from '../hooks/useWatchAction'
import type { WidgetProps } from '../types/template'
import { normalizeObject, type ObjectAction, type ObjectLink } from './platformShapes'
import { Empty } from './states'
import { localDate } from './textNormalize'
import { Button } from '../components/Button'
import { MetaRow } from '../components/Display'
import { Tag } from '../components/Feedback'
import type { StatusTone } from '../foundations/types'
import { LinkPanel, type LinkGroup } from '../objects/LinkPanel'
import { ObjectHeader } from '../objects/ObjectHeader'
import { PropertyPanel } from '../objects/PropertyPanel'

interface ObjectViewOptions {
  enable_actions?: boolean
  link_context?: {
    type_key?: string
    id_key?: string
  }
}

// Semantic object detail on the toolkit's object components: a compact
// ObjectHeader, a PropertyPanel of typed values (never raw JSON) and a
// LinkPanel whose links retarget the shared dashboard context. Explicitly
// enabled actions dispatch through TerminalService.SubmitAction.
export function ObjectView({ data, options, widgetId }: WidgetProps) {
  const object = useMemo(() => normalizeObject(data), [data])
  const opts = (options ?? {}) as ObjectViewOptions
  const { setCtx } = useDashboard()
  const mutation = useSubmitAction(widgetId)
  const [runningActionId, setRunningActionId] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)

  if (!object) return <Empty>No object</Empty>

  const typeKey = opts.link_context?.type_key ?? 'object_type'
  const idKey = opts.link_context?.id_key ?? 'object_id'

  const selectLink = (link: typeof object.links[number]) => {
    if (Object.keys(link.context).length > 0) {
      for (const [key, value] of Object.entries(link.context)) setCtx(key, value)
    } else {
      if (link.targetType) setCtx(typeKey, link.targetType)
      setCtx(idKey, link.targetId)
    }
  }

  const runAction = async (action: ObjectAction) => {
    if (action.disabled || mutation.submitting || runningActionId) return
    if (action.confirm && confirming !== action.id) {
      setConfirming(action.id)
      return
    }

    setRunningActionId(action.id)
    setConfirming(null)
    const reply = await mutation.submit({
      actionId: action.id,
      params: {
        ...action.params,
        object_type: object.objectType,
        object_id: object.objectId,
      },
      successMessage: action.label,
      refreshTarget: widgetId ?? '*',
      onComplete: () => setRunningActionId(null),
    })
    // A missing backend or a synchronously blocked duplicate returns null.
    if (!reply) setRunningActionId(null)
  }

  const linkGroups = groupLinks(object.links)
  const header = (
    <ObjectHeader
      compact
      headingLevel={3}
      type={{ id: object.objectType || 'object', label: humanizeType(object.objectType) }}
      title={object.title}
      objectId={object.objectId || undefined}
      status={object.status ? { label: humanizeType(object.status), tone: statusTone(object.status) } : undefined}
    />
  )
  const meta = [
    ...object.tags.map(tag => <Tag key={tag}>{tag}</Tag>),
    object.updatedAt ? `Updated ${String(localDate(object.updatedAt))}` : null,
  ].filter(Boolean)

  return (
    <div className="mtc-object-view h-full overflow-auto">
      {header}
      {object.description && <p className="mtc-object-view-description">{object.description}</p>}
      {meta.length > 0 && <MetaRow items={meta} />}
      <PropertyPanel
        headingLevel={4}
        filterable={object.properties.length > 8}
        properties={object.properties.map(property => ({
          id: property.key,
          label: property.label,
          value: property.value,
          format: propertyFormat(property.format),
          group: property.group ?? 'General',
          description: property.description,
        }))}
      />
      {linkGroups.length > 0 && (
        <LinkPanel
          headingLevel={4}
          title="Relationships"
          groups={linkGroups}
          maxItems={5}
          onNavigate={object_ => {
            const link = object.links.find(candidate => `${candidate.relation}:${candidate.targetType}:${candidate.targetId}` === object_.id)
            if (link) selectLink(link)
          }}
        />
      )}
      {opts.enable_actions === true && object.actions.length > 0 && (
        <section className="grid gap-2" aria-label="Actions">
          <div className="flex flex-wrap gap-2">
            {object.actions.map((action) => {
              const isConfirming = confirming === action.id
              const busy = runningActionId === action.id && mutation.submitting
              return (
                <Button
                  key={action.id}
                  size="small"
                  intent={isConfirming || action.style === 'danger' ? 'danger' : action.style === 'primary' ? 'primary' : 'neutral'}
                  variant={action.style === 'primary' && !isConfirming ? 'solid' : 'outline'}
                  loading={busy}
                  onClick={() => void runAction(action)}
                  disabled={action.disabled || mutation.submitting || runningActionId != null}
                  title={action.description}
                >
                  {isConfirming ? `Confirm ${action.label}` : action.label}
                </Button>
              )
            })}
            {confirming && (
              <Button size="small" variant="ghost" onClick={() => setConfirming(null)} disabled={mutation.submitting}>
                Cancel
              </Button>
            )}
          </div>
          {mutation.result && (
            <p className={`text-xs ${isErrorStatus(mutation.result.status) ? 'text-red-400' : 'text-zinc-500'}`} role="status">
              {mutation.result.message ?? mutation.result.status}
            </p>
          )}
        </section>
      )}
    </div>
  )
}

function statusTone(status: string): StatusTone {
  const normalized = status.toLowerCase()
  if (/(healthy|ready|active|ok|published|open)/.test(normalized)) return 'ok'
  if (/(warn|stale|draft|pending|review)/.test(normalized)) return 'warning'
  if (/(error|failed|deprecated|archived|blocked|closed)/.test(normalized)) return 'danger'
  return 'neutral'
}

// Relationships grouped by relation and target type, as link groups.
function groupLinks(links: readonly ObjectLink[]): LinkGroup[] {
  const groups = new Map<string, LinkGroup>()
  for (const link of links) {
    const key = `${link.relation}:${link.targetType}`
    const group = groups.get(key) ?? {
      id: key,
      relation: humanizeType(link.relation || 'related'),
      targetType: { id: link.targetType || 'object', label: humanizeType(link.targetType || 'object') },
      count: 0,
      items: [],
    }
    groups.set(key, {
      ...group,
      count: group.count + 1,
      items: [...group.items, {
        id: `${link.relation}:${link.targetType}:${link.targetId}`,
        title: link.label,
        type: group.targetType,
        detail: link.status ? humanizeType(link.status) : undefined,
      }],
    })
  }
  return [...groups.values()]
}

// Widget formats onto property formats: percent here is a 0-1 ratio, and
// `link` values are URLs.
function propertyFormat(format: string | undefined): string | undefined {
  if (!format) return undefined
  if (format === 'link') return 'url'
  if (format === 'compact') return 'number'
  return format
}

function humanizeType(value: string): string {
  const text = value.replace(/[_-]+/g, ' ').trim()
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}
