import { useEffect, useMemo, useState } from 'react'
import { Dashboard, type DashboardTemplateTrust, type DashboardTheme } from '../core/Dashboard'
import type { DashboardEvent } from '../core/DashboardContext'
import type { TemplateTrustPolicy } from '../core/templateSecurity'
import type { Template, WidgetConfig } from '../types/template'
import type { EmbedConfig } from './embedConfig'

// EmbedView — render a single widget or a whole dashboard from an
// EmbedConfig, with embed-appropriate chrome.
//
// This is the React surface behind the standalone embed entry
// (embed.html → src/embed/main.tsx), but it is also exported from the
// library so a host app can embed a live view inline without an iframe.

export interface EmbedViewProps {
  config: EmbedConfig
  // Telemetry passthrough (alerts, widget errors) — handy when the host
  // wants to forward embed events to its own logging.
  onEvent?: (event: DashboardEvent) => void
  theme?: DashboardTheme
  templateTrust?: DashboardTemplateTrust
  templateTrustPolicy?: TemplateTrustPolicy
}

// Build a one-widget Template from the single-widget embed config. The
// widget spans the full grid and fills the viewport height.
function singleWidgetTemplate(config: EmbedConfig): Template | null {
  if (!config.widget) return null
  const w = config.widget
  const widget: WidgetConfig = {
    id: 'embed',
    component: w.component,
    span: 12,
    title: config.title,
    source: w.sourceId
      ? { source_id: w.sourceId, stream: w.stream, refreshIntervalMs: w.refreshIntervalMs }
      : w.url
        ? { url: w.url, stream: w.stream, refreshIntervalMs: w.refreshIntervalMs }
        : undefined,
  }
  return {
    title: config.title,
    columns: 12,
    context: Object.keys(config.ctx).length > 0 ? { values: config.ctx } : undefined,
    widgets: [widget],
  }
}

export function EmbedView({
  config,
  onEvent,
  theme = 'dark',
  templateTrust,
  templateTrustPolicy,
}: EmbedViewProps) {
  const [fetched, setFetched] = useState<{ template?: Template; error?: string }>({})

  // Full-dashboard mode: fetch the template JSON from templateUrl.
  useEffect(() => {
    if (!config.templateUrl) return
    let cancelled = false
    setFetched({})
    fetch(config.templateUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`Template fetch failed: ${r.status}`)
        return r.json()
      })
      .then((json: Template) => {
        if (cancelled) return
        // Seed any ctx params from the embed URL over the template's
        // own defaults so ?ctx.symbol=ETH wins.
        const merged: Template =
          Object.keys(config.ctx).length > 0
            ? {
                ...json,
                context: {
                  values: { ...(json.context?.values ?? {}), ...config.ctx },
                },
              }
            : json
        setFetched({ template: merged })
      })
      .catch((e: unknown) => {
        if (!cancelled) setFetched({ error: e instanceof Error ? e.message : 'Template load error' })
      })
    return () => {
      cancelled = true
    }
  }, [config.templateUrl, config.ctx])

  const singleTemplate = useMemo(() => singleWidgetTemplate(config), [config])

  const template = config.templateUrl ? fetched.template : singleTemplate

  if (config.templateUrl && fetched.error) {
    return <EmbedMessage title="Embed error" body={fetched.error} theme={theme} />
  }
  if (config.templateUrl && !template) {
    return <EmbedMessage title="Loading…" body="Fetching dashboard template" theme={theme} />
  }
  if (!template) {
    return (
      <EmbedMessage
        title="Nothing to embed"
        body="Pass a ?template= URL, or a ?src= source id (with &backend=), or a ?url= data URL."
        theme={theme}
      />
    )
  }

  return (
    <div className={`mtc-root mtc-theme-${theme}`} data-theme={theme}>
    <div className="min-h-screen bg-zinc-950">
      <Dashboard
        template={template}
        backendUrl={config.backendUrl}
        chrome={config.chrome === 'full' ? 'full' : 'minimal'}
        onEvent={onEvent}
        theme={theme}
        templateTrust={templateTrust}
        templateTrustPolicy={templateTrustPolicy}
      />
    </div>
    </div>
  )
}

function EmbedMessage({ title, body, theme }: { title: string; body: string; theme: DashboardTheme }) {
  return (
    <div className={`mtc-root mtc-theme-${theme}`} data-theme={theme}>
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-sm font-medium text-zinc-200 mb-1">{title}</div>
        <div className="text-xs text-zinc-500">{body}</div>
      </div>
    </div>
    </div>
  )
}
