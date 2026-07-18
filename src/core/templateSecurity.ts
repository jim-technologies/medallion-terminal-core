import type { DataSource, Template, WidgetConfig } from '../types/template'

export type TemplateSecuritySeverity = 'error' | 'warn'

export interface TemplateSecurityIssue {
  path: string
  severity: TemplateSecuritySeverity
  message: string
}

export interface IframeSandboxPolicy {
  // Tokens that must be present in the iframe sandbox attribute.
  requiredTokens?: readonly string[]
  // Tokens that may not be present for untrusted templates.
  disallowedTokens?: readonly string[]
  // `allow-scripts allow-same-origin` lets same-origin content remove its
  // sandbox. Keep false for customer-authored templates unless the host
  // fully controls the iframe origin.
  allowScriptsWithSameOrigin?: boolean
}

export interface TemplateTrustPolicy {
  // Absolute URL origins allowed in source.url and known URL-bearing widget
  // options. Empty means absolute URLs are rejected.
  allowedUrlOrigins?: readonly string[]
  // Optional narrower origin list for iframe/image payload URLs.
  // Defaults to allowedUrlOrigins.
  allowedIframeOrigins?: readonly string[]
  // Relative URLs stay inside the host app. Disable when untrusted
  // templates must use source_id/inline only.
  allowRelativeUrls?: boolean
  // If set, request headers must be in this allow-list.
  allowedHeaders?: readonly string[]
  // Headers rejected even when allowedHeaders is not set.
  disallowedHeaders?: readonly string[]
  // Polling intervals below this value are rejected. 0 / undefined means
  // fetch once and is allowed.
  minRefreshIntervalMs?: number
  // Optional upper bound for long-lived dashboards.
  maxRefreshIntervalMs?: number
  iframeSandbox?: IframeSandboxPolicy
}

export const DEFAULT_IFRAME_SANDBOX = ''

export const DEFAULT_SENSITIVE_TEMPLATE_HEADERS = [
  'authorization',
  'cookie',
  'proxy-authorization',
  'set-cookie',
  'x-api-key',
  'x-auth-token',
  'x-csrf-token',
  'x-xsrf-token',
] as const

export const DEFAULT_IFRAME_SANDBOX_DISALLOWED_TOKENS = [
  'allow-downloads',
  'allow-popups-to-escape-sandbox',
  'allow-top-navigation',
  'allow-top-navigation-by-user-activation',
] as const

export const DEFAULT_UNTRUSTED_TEMPLATE_POLICY = {
  allowRelativeUrls: true,
  allowedUrlOrigins: [],
  disallowedHeaders: DEFAULT_SENSITIVE_TEMPLATE_HEADERS,
  minRefreshIntervalMs: 1000,
  iframeSandbox: {
    disallowedTokens: DEFAULT_IFRAME_SANDBOX_DISALLOWED_TOKENS,
    allowScriptsWithSameOrigin: false,
  },
} as const satisfies TemplateTrustPolicy

const URL_OPTION_KEYS = [
  'url',
  'upload_url',
  'search_url',
  'ingest_url',
  'download_url',
  'media_url_template',
  'style_url',
] as const

interface EffectiveTrustPolicy {
  allowedUrlOrigins: Set<string>
  allowedIframeOrigins: Set<string>
  allowRelativeUrls: boolean
  allowedHeaders?: Set<string>
  disallowedHeaders: Set<string>
  minRefreshIntervalMs?: number
  maxRefreshIntervalMs?: number
  iframeSandbox: Required<IframeSandboxPolicy>
}

// Host-side guardrail for customer-provided templates. Dashboard runs
// this by default before widgets mount; hosts may also call it directly
// when accepting template JSON at an API boundary.
export function validateTemplateTrust(
  template: Template,
  policy: TemplateTrustPolicy = DEFAULT_UNTRUSTED_TEMPLATE_POLICY,
): TemplateSecurityIssue[] {
  const issues: TemplateSecurityIssue[] = []
  const effective = normalizePolicy(policy)

  if (!template || typeof template !== 'object' || !Array.isArray(template.widgets)) {
    return [{ path: 'widgets', severity: 'error', message: 'template.widgets must be an array' }]
  }

  template.widgets.forEach((widget, i) => {
    if (!widget || typeof widget !== 'object') return
    const path = `widgets[${i}]`
    if (widget.source) validateSource(widget.source, `${path}.source`, effective, issues)
    validateWidgetOptions(widget, path, effective, issues)
    if (widget.component === 'iframe') validateIframe(widget, path, effective, issues)
    if (widget.component === 'image') validateImage(widget, path, effective, issues)
    if (widget.component === 'media_gallery') validateMedia(widget, path, effective, issues)
  })

  return issues
}

function normalizePolicy(policy: TemplateTrustPolicy): EffectiveTrustPolicy {
  const defaultSandbox: IframeSandboxPolicy = DEFAULT_UNTRUSTED_TEMPLATE_POLICY.iframeSandbox
  const allowedUrlOrigins = normalizeOrigins(
    policy.allowedUrlOrigins ?? DEFAULT_UNTRUSTED_TEMPLATE_POLICY.allowedUrlOrigins,
  )
  return {
    allowedUrlOrigins,
    allowedIframeOrigins: normalizeOrigins(policy.allowedIframeOrigins ?? policy.allowedUrlOrigins ?? []),
    allowRelativeUrls: policy.allowRelativeUrls ?? DEFAULT_UNTRUSTED_TEMPLATE_POLICY.allowRelativeUrls,
    allowedHeaders: policy.allowedHeaders ? lowerSet(policy.allowedHeaders) : undefined,
    disallowedHeaders: lowerSet(policy.disallowedHeaders ?? DEFAULT_UNTRUSTED_TEMPLATE_POLICY.disallowedHeaders),
    minRefreshIntervalMs: policy.minRefreshIntervalMs ?? DEFAULT_UNTRUSTED_TEMPLATE_POLICY.minRefreshIntervalMs,
    maxRefreshIntervalMs: policy.maxRefreshIntervalMs,
    iframeSandbox: {
      requiredTokens: [...(defaultSandbox.requiredTokens ?? []), ...(policy.iframeSandbox?.requiredTokens ?? [])],
      disallowedTokens: [
        ...(defaultSandbox.disallowedTokens ?? []),
        ...(policy.iframeSandbox?.disallowedTokens ?? []),
      ],
      allowScriptsWithSameOrigin:
        policy.iframeSandbox?.allowScriptsWithSameOrigin ?? defaultSandbox.allowScriptsWithSameOrigin ?? false,
    },
  }
}

function normalizeOrigins(origins: readonly string[]): Set<string> {
  const out = new Set<string>()
  for (const origin of origins) {
    try {
      out.add(new URL(origin).origin)
    } catch {
      // Ignore malformed policy entries. They simply won't match.
    }
  }
  return out
}

function lowerSet(values: readonly string[]): Set<string> {
  return new Set(values.map(v => v.trim().toLowerCase()).filter(Boolean))
}

function validateSource(
  source: DataSource,
  path: string,
  policy: EffectiveTrustPolicy,
  issues: TemplateSecurityIssue[],
) {
  if (typeof source.url === 'string') {
    validateUrl(source.url, `${path}.url`, policy.allowedUrlOrigins, policy.allowRelativeUrls, issues)
  }
  if (source.headers && typeof source.headers === 'object') {
    validateHeaders(source.headers, `${path}.headers`, policy, issues)
  }
  validateRefreshInterval(source.refreshIntervalMs ?? source.refreshInterval, path, policy, issues)
}

function validateWidgetOptions(
  widget: WidgetConfig,
  path: string,
  policy: EffectiveTrustPolicy,
  issues: TemplateSecurityIssue[],
) {
  const options = widget.options
  if (!options || typeof options !== 'object') return
  for (const key of URL_OPTION_KEYS) {
    if (widget.component === 'iframe' && key === 'url') continue
    const value = options[key]
    if (typeof value !== 'string' || value === '') continue
    validateUrl(value, `${path}.options.${key}`, policy.allowedUrlOrigins, policy.allowRelativeUrls, issues)
  }
}

function validateIframe(
  widget: WidgetConfig,
  path: string,
  policy: EffectiveTrustPolicy,
  issues: TemplateSecurityIssue[],
) {
  const { url, sandbox } = iframeConfig(widget)
  if (url) {
    validateUrl(url, `${path}.iframe.url`, policy.allowedIframeOrigins, policy.allowRelativeUrls, issues)
  }
  validateSandbox(sandbox, `${path}.iframe.sandbox`, policy, issues)
}

function validateImage(
  widget: WidgetConfig,
  path: string,
  policy: EffectiveTrustPolicy,
  issues: TemplateSecurityIssue[],
) {
  const data = inlineData(widget.source)
  const url = typeof data === 'string'
    ? data
    : data && typeof data === 'object' && typeof (data as Record<string, unknown>).url === 'string'
      ? (data as Record<string, string>).url
      : undefined
  if (url) validateUrl(url, `${path}.image.url`, policy.allowedIframeOrigins, policy.allowRelativeUrls, issues)
}

function validateMedia(
  widget: WidgetConfig,
  path: string,
  policy: EffectiveTrustPolicy,
  issues: TemplateSecurityIssue[],
) {
  const data = inlineData(widget.source)
  if (!data || typeof data !== 'object') return
  const root: Record<string, unknown> = Array.isArray(data)
    ? { items: data }
    : data as Record<string, unknown>
  const items = Array.isArray(root.items)
    ? root.items
    : Array.isArray(root.media)
      ? root.media
      : Array.isArray(root.assets)
        ? root.assets
        : []
  items.forEach((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return
    const entry = item as Record<string, unknown>
    for (const key of ['url', 'mediaUrl', 'media_url', 'src', 'thumbnailUrl', 'thumbnail_url', 'thumbnail', 'posterUrl', 'poster_url', 'poster']) {
      const value = entry[key]
      if (typeof value === 'string' && value) {
        validateUrl(
          value,
          `${path}.media.items[${index}].${key}`,
          policy.allowedIframeOrigins,
          policy.allowRelativeUrls,
          issues,
        )
      }
    }
  })

  const collections = Array.isArray(root.collections)
    ? root.collections
    : Array.isArray(root.albums)
      ? root.albums
      : []
  collections.forEach((collection, index) => {
    if (!collection || typeof collection !== 'object' || Array.isArray(collection)) return
    const entry = collection as Record<string, unknown>
    for (const key of ['coverUrl', 'cover_url', 'thumbnailUrl', 'thumbnail_url']) {
      const value = entry[key]
      if (typeof value === 'string' && value) {
        validateUrl(
          value,
          `${path}.media.collections[${index}].${key}`,
          policy.allowedIframeOrigins,
          policy.allowRelativeUrls,
          issues,
        )
      }
    }
  })
}

function iframeConfig(widget: WidgetConfig): { url: string | undefined; sandbox: string } {
  const options = widget.options
  const data = inlineData(widget.source)
  let url: string | undefined
  let sandbox = DEFAULT_IFRAME_SANDBOX

  if (typeof data === 'string') {
    url = data
  } else if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (typeof obj.url === 'string') url = obj.url
    if (typeof obj.sandbox === 'string') sandbox = obj.sandbox
  }
  if (options && typeof options === 'object') {
    if (!url && typeof options.url === 'string') url = options.url
    if (typeof options.sandbox === 'string') sandbox = options.sandbox
  }
  return { url, sandbox }
}

function inlineData(source: DataSource | undefined): unknown {
  return source?.inline ?? source?.data
}

function validateHeaders(
  headers: Record<string, string>,
  path: string,
  policy: EffectiveTrustPolicy,
  issues: TemplateSecurityIssue[],
) {
  for (const name of Object.keys(headers)) {
    const key = name.trim().toLowerCase()
    if (!key) {
      issues.push({ path, severity: 'error', message: 'header names must be non-empty' })
      continue
    }
    if (policy.disallowedHeaders.has(key)) {
      issues.push({ path: `${path}.${name}`, severity: 'error', message: `header "${name}" is not allowed` })
    }
    if (policy.allowedHeaders && !policy.allowedHeaders.has(key)) {
      issues.push({ path: `${path}.${name}`, severity: 'error', message: `header "${name}" is not in the allow-list` })
    }
  }
}

function validateRefreshInterval(
  interval: number | undefined,
  path: string,
  policy: EffectiveTrustPolicy,
  issues: TemplateSecurityIssue[],
) {
  if (interval == null || interval === 0) return
  if (!Number.isFinite(interval) || interval < 0) {
    issues.push({ path: `${path}.refreshIntervalMs`, severity: 'error', message: 'refreshIntervalMs must be >= 0' })
    return
  }
  if (policy.minRefreshIntervalMs != null && interval < policy.minRefreshIntervalMs) {
    issues.push({
      path: `${path}.refreshIntervalMs`,
      severity: 'error',
      message: `refreshIntervalMs ${interval} is below host minimum ${policy.minRefreshIntervalMs}`,
    })
  }
  if (policy.maxRefreshIntervalMs != null && interval > policy.maxRefreshIntervalMs) {
    issues.push({
      path: `${path}.refreshIntervalMs`,
      severity: 'error',
      message: `refreshIntervalMs ${interval} is above host maximum ${policy.maxRefreshIntervalMs}`,
    })
  }
}

function validateUrl(
  raw: string,
  path: string,
  allowedOrigins: Set<string>,
  allowRelativeUrls: boolean,
  issues: TemplateSecurityIssue[],
) {
  const value = raw.trim()
  if (!value) {
    issues.push({ path, severity: 'error', message: 'URL must be non-empty' })
    return
  }
  if (isRelativeUrl(value)) {
    if (relativeUrlCanSynthesizeOrigin(value)) {
      issues.push({
        path,
        severity: 'error',
        message: 'relative URL template substitution must appear after a path, query, or hash delimiter',
      })
      return
    }
    if (!allowRelativeUrls) {
      issues.push({ path, severity: 'error', message: 'relative URLs are not allowed by host policy' })
    }
    return
  }
  if (originPart(value).includes('${')) {
    issues.push({ path, severity: 'error', message: 'URL origin may not contain template substitution' })
    return
  }
  let parsed: URL
  try {
    parsed = new URL(value.replace(/\{[A-Za-z0-9_]+\}/g, 'value'))
  } catch {
    issues.push({ path, severity: 'error', message: `URL ${JSON.stringify(raw)} does not parse` })
    return
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    issues.push({ path, severity: 'error', message: `URL protocol ${parsed.protocol} is not allowed` })
    return
  }
  if (!allowedOrigins.has(parsed.origin)) {
    issues.push({ path, severity: 'error', message: `URL origin ${parsed.origin} is not allowed` })
  }
}

function validateSandbox(
  sandbox: string,
  path: string,
  policy: EffectiveTrustPolicy,
  issues: TemplateSecurityIssue[],
) {
  const tokens = new Set(sandbox.split(/\s+/).map(t => t.trim()).filter(Boolean))
  for (const token of policy.iframeSandbox.requiredTokens) {
    if (!tokens.has(token)) {
      issues.push({ path, severity: 'error', message: `iframe sandbox must include ${token}` })
    }
  }
  for (const token of policy.iframeSandbox.disallowedTokens) {
    if (tokens.has(token)) {
      issues.push({ path, severity: 'error', message: `iframe sandbox token ${token} is not allowed` })
    }
  }
  if (
    !policy.iframeSandbox.allowScriptsWithSameOrigin &&
    tokens.has('allow-scripts') &&
    tokens.has('allow-same-origin')
  ) {
    issues.push({
      path,
      severity: 'error',
      message: 'iframe sandbox may not combine allow-scripts and allow-same-origin',
    })
  }
}

function isRelativeUrl(value: string): boolean {
  return !value.startsWith('//') && !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(value)
}

function relativeUrlCanSynthesizeOrigin(value: string): boolean {
  const token = value.indexOf('${')
  if (token === -1) return false
  const fixedPrefix = value.slice(0, token)
  if (!/[/?#]/.test(fixedPrefix)) return true
  return /^\/+$/.test(fixedPrefix)
}

function originPart(value: string): string {
  if (value.startsWith('//')) {
    const end = value.slice(2).search(/[/?#]/)
    return end === -1 ? value : value.slice(0, end + 2)
  }
  const match = value.match(/^[A-Za-z][A-Za-z0-9+.-]*:\/\/[^/?#]*/)
  return match ? match[0] : ''
}
