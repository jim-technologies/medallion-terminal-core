// embedConfig — parse an embed URL's query string into a typed config.
//
// The embed surface lets a BI tool (reporting panel or iframe) render a single live widget or a whole
// dashboard with minimal chrome. The host points an <iframe> at the
// embed entry and passes everything via the query string — no JS bridge
// required, which is the lowest common denominator every BI tool
// supports.
//
// Query parameters (all optional except a data source):
//   template   — URL to a dashboard template JSON (renders the whole
//                dashboard, embed-styled). Mutually exclusive with the
//                single-widget params below.
//   src        — TerminalService source_id for a single-widget embed.
//   component  — widget component name for a single-widget embed
//                (default "table").
//   url        — arbitrary data URL for a single-widget embed (escape
//                hatch; alternative to `src`).
//   title      — widget/dashboard title override.
//   backend    — TerminalService backend base URL (for `src`).
//   ctx.<k>=v  — seed context values (e.g. ctx.symbol=BTC).
//   stream     — "1"/"true" to stream the single-widget source.
//   refreshMs  — polling interval for the single-widget source.
//   chrome     — "none" (default) hides the toolbar/status bar;
//                "full" shows them. Embeds default to no chrome.
//   theme      — reserved; only "dark" is supported today.
//
// This module is pure (no DOM) so it is unit-testable in node.

export interface EmbedConfig {
  // Full-dashboard mode: a template URL to fetch + render.
  templateUrl?: string
  // Single-widget mode.
  widget?: {
    component: string
    sourceId?: string
    url?: string
    stream: boolean
    refreshIntervalMs?: number
  }
  title?: string
  backendUrl?: string
  ctx: Record<string, string>
  chrome: 'none' | 'full'
}

function truthy(v: string | null): boolean {
  return v === '1' || v === 'true' || v === 'yes'
}

// Parse a query string (with or without leading "?") into an EmbedConfig.
export function parseEmbedConfig(search: string): EmbedConfig {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)

  const ctx: Record<string, string> = {}
  for (const [key, value] of params.entries()) {
    if (key.startsWith('ctx.')) {
      const k = key.slice(4)
      if (k) ctx[k] = value
    }
  }

  const chrome: EmbedConfig['chrome'] = params.get('chrome') === 'full' ? 'full' : 'none'
  const title = params.get('title') ?? undefined
  const backendUrl = params.get('backend') ?? undefined

  const templateUrl = params.get('template') ?? undefined
  if (templateUrl) {
    return { templateUrl, title, backendUrl, ctx, chrome }
  }

  const sourceId = params.get('src') ?? undefined
  const url = params.get('url') ?? undefined
  if (sourceId || url) {
    const refreshRaw = params.get('refreshMs')
    const refresh = refreshRaw != null ? Number(refreshRaw) : NaN
    return {
      widget: {
        component: params.get('component') ?? 'table',
        sourceId,
        url,
        stream: truthy(params.get('stream')),
        refreshIntervalMs: Number.isFinite(refresh) && refresh > 0 ? refresh : undefined,
      },
      title,
      backendUrl,
      ctx,
      chrome,
    }
  }

  // No data source — caller renders a help/placeholder state.
  return { title, backendUrl, ctx, chrome }
}

// Build an embed URL from a config — the inverse of parseEmbedConfig.
// Used by the connection-config helper / UI to produce a copy-pasteable
// iframe src for a BI tool.
export function buildEmbedUrl(base: string, config: Partial<EmbedConfig>): string {
  const params = new URLSearchParams()
  if (config.templateUrl) params.set('template', config.templateUrl)
  if (config.widget) {
    if (config.widget.component) params.set('component', config.widget.component)
    if (config.widget.sourceId) params.set('src', config.widget.sourceId)
    if (config.widget.url) params.set('url', config.widget.url)
    if (config.widget.stream) params.set('stream', '1')
    if (config.widget.refreshIntervalMs) params.set('refreshMs', String(config.widget.refreshIntervalMs))
  }
  if (config.title) params.set('title', config.title)
  if (config.backendUrl) params.set('backend', config.backendUrl)
  if (config.chrome === 'full') params.set('chrome', 'full')
  for (const [k, v] of Object.entries(config.ctx ?? {})) params.set(`ctx.${k}`, v)
  const qs = params.toString()
  return qs ? `${base}?${qs}` : base
}
