import { useMemo, useState } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { useSubmitAction } from '../hooks/useSubmitAction'
import { isErrorStatus } from '../hooks/useWatchAction'
import type { WidgetProps } from '../types/template'
import { formatCompact, formatCurrency, formatPercent } from './format'
import { normalizeObject, type ObjectAction, type ObjectProperty } from './platformShapes'
import { Empty } from './states'
import { localDate, safeUrl } from './textNormalize'

interface ObjectViewOptions {
  enable_actions?: boolean
  link_context?: {
    type_key?: string
    id_key?: string
  }
}

// Semantic object detail. Properties are schema-driven display rows,
// links retarget the shared dashboard context, and explicitly enabled
// actions dispatch through TerminalService.SubmitAction.
export function ObjectView({ data, options, widgetId }: WidgetProps) {
  const object = useMemo(() => normalizeObject(data), [data])
  const opts = (options ?? {}) as ObjectViewOptions
  const { setCtx } = useDashboard()
  const mutation = useSubmitAction(widgetId)
  const [runningActionId, setRunningActionId] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)

  if (!object) return <Empty>No object</Empty>

  const groups = groupProperties(object.properties)
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

  return (
    <div className="h-full overflow-auto pr-1">
      <div className="pb-3 border-b border-zinc-800">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">
              {object.objectType || 'object'}
            </div>
            <h4 className="text-base text-zinc-100 mt-0.5 truncate">{object.title}</h4>
            {object.objectId && (
              <div className="text-[10px] font-mono text-zinc-600 mt-0.5 truncate">
                {object.objectId}
              </div>
            )}
          </div>
          {object.status && (
            <span className={`text-[10px] uppercase tracking-wider shrink-0 ${statusTone(object.status)}`}>
              {object.status}
            </span>
          )}
        </div>
        {object.description && (
          <p className="text-xs text-zinc-500 leading-relaxed mt-2">{object.description}</p>
        )}
        <div className="flex items-center gap-1.5 flex-wrap mt-2">
          {object.tags.map((tag) => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
              {tag}
            </span>
          ))}
          {object.updatedAt && (
            <span className="text-[10px] text-zinc-600 ml-auto">
              updated {String(localDate(object.updatedAt))}
            </span>
          )}
        </div>
      </div>

      {groups.map(([group, properties]) => (
        <section key={group} className="py-3 border-b border-zinc-800/70 last:border-0">
          <h5 className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">{group}</h5>
          <dl>
            {properties.map((property) => (
              <div key={property.key} className="grid grid-cols-[minmax(7rem,0.42fr)_minmax(0,1fr)] gap-3 py-1.5">
                <dt className="text-xs text-zinc-500" title={property.description}>
                  {property.label}
                </dt>
                <dd className="text-xs text-zinc-200 min-w-0">
                  <PropertyValue property={property} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      {object.links.length > 0 && (
        <section className="py-3 border-b border-zinc-800/70">
          <h5 className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">Relationships</h5>
          <div className="space-y-1">
            {object.links.map((link, index) => (
              <button
                key={`${link.relation}:${link.targetType}:${link.targetId}:${index}`}
                onClick={() => selectLink(link)}
                className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-zinc-800/60 group"
              >
                <span className="text-[10px] uppercase tracking-wider text-zinc-600 w-24 truncate shrink-0">
                  {link.relation || 'related'}
                </span>
                <span className="text-xs text-zinc-200 truncate group-hover:text-sky-300">{link.label}</span>
                <span className="text-[10px] font-mono text-zinc-600 truncate ml-auto">{link.targetType}</span>
                {link.status && <span className={statusTone(link.status)}>●</span>}
                <span className="text-zinc-600">→</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {opts.enable_actions === true && object.actions.length > 0 && (
        <section className="pt-3">
          <h5 className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Actions</h5>
          <div className="flex gap-2 flex-wrap">
            {object.actions.map((action) => {
              const isConfirming = confirming === action.id
              const busy = runningActionId === action.id && mutation.submitting
              return (
                <button
                  key={action.id}
                  onClick={() => void runAction(action)}
                  disabled={action.disabled || mutation.submitting || runningActionId != null}
                  title={action.description}
                  className={`px-3 py-1.5 rounded border text-xs disabled:opacity-40 ${actionTone(action.style, isConfirming)}`}
                >
                  {busy ? 'Working…' : isConfirming ? `Confirm ${action.label}` : action.label}
                </button>
              )
            })}
            {confirming && (
              <button
                onClick={() => setConfirming(null)}
                disabled={mutation.submitting}
                className="px-3 py-1.5 rounded border border-zinc-700 text-xs text-zinc-400 hover:text-zinc-100"
              >
                Cancel
              </button>
            )}
          </div>
          {mutation.result && (
            <div className={`mt-2 text-xs ${
              isErrorStatus(mutation.result.status) ? 'text-red-400' : 'text-zinc-500'
            }`}>
              {mutation.result.message ?? mutation.result.status}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function groupProperties(properties: ObjectProperty[]): Array<[string, ObjectProperty[]]> {
  const groups = new Map<string, ObjectProperty[]>()
  for (const property of properties) {
    const group = property.group ?? 'General'
    const list = groups.get(group) ?? []
    list.push(property)
    groups.set(group, list)
  }
  return [...groups.entries()]
}

function PropertyValue({ property }: { property: ObjectProperty }) {
  const url = property.format === 'link' ? safeUrl(property.value) : undefined
  if (url) {
    return (
      <a
        href={url}
        {...(url.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        className="text-sky-400 hover:underline break-all"
      >
        {url}
      </a>
    )
  }

  if (property.value == null) return <span className="text-zinc-600">—</span>
  if (typeof property.value === 'object') {
    return (
      <pre className="font-mono text-[10px] whitespace-pre-wrap break-words text-zinc-400">
        {safeJson(property.value)}
      </pre>
    )
  }
  return <span className="break-words">{formatProperty(property.value, property.format)}</span>
}

function formatProperty(value: unknown, format?: string): string {
  if (format?.startsWith('currency') && typeof value === 'number') {
    return formatCurrency(value, format.split(':')[1] ?? 'USD')
  }
  if (format?.startsWith('percent') && typeof value === 'number') {
    return formatPercent(value)
  }
  if (format === 'compact' && typeof value === 'number') return formatCompact(value)
  if ((format === 'datetime' || format === 'date') && typeof value === 'string') {
    return String(localDate(value))
  }
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function statusTone(status: string): string {
  const normalized = status.toLowerCase()
  if (/(healthy|ready|active|ok|published|open)/.test(normalized)) return 'text-emerald-400'
  if (/(warn|stale|draft|pending|review)/.test(normalized)) return 'text-amber-400'
  if (/(error|failed|deprecated|archived|blocked|closed)/.test(normalized)) return 'text-red-400'
  return 'text-zinc-500'
}

function actionTone(style: string | undefined, confirming: boolean): string {
  if (confirming || style === 'danger') {
    return 'border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20'
  }
  if (style === 'primary') {
    return 'border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20'
  }
  return 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
}
