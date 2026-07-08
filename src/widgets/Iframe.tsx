import { Empty } from './states'
import { DEFAULT_IFRAME_SANDBOX } from '../core/templateSecurity'
import type { WidgetProps } from '../types/template'

// Sandboxed iframe widget for embedding external content
// (third-party charts, legacy dashboards, model docs, etc.).
//
// Data forms accepted:
//   "https://..."                                            → bare URL
//   { url, title?, sandbox? }                                → manual shape
//   { url, label?, sandbox? }                                → EmbedPayload (proto)
//
// Sandbox defaults to the strict empty sandbox. Trusted/operator
// dashboards can loosen it per widget; customer-authored templates
// should be checked by Dashboard's template trust policy first.
export function Iframe({ data, options }: WidgetProps) {
  const { url, title, sandbox } = parse(data, options)
  if (!url) return <Empty>No URL</Empty>
  return (
    <iframe
      src={url}
      title={title}
      sandbox={sandbox}
      loading="lazy"
      className="w-full h-full border-0 rounded"
    />
  )
}

function parse(
  data: unknown,
  options?: Record<string, unknown>,
): { url: string | undefined; title: string; sandbox: string } {
  let url: string | undefined
  let title = 'embed'
  let sandbox = DEFAULT_IFRAME_SANDBOX
  if (typeof data === 'string') {
    url = data
  } else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (typeof d.url === 'string') url = d.url
    // EmbedPayload.label is the canonical proto field; `title` is
    // accepted for hand-authored shapes.
    if (typeof d.label === 'string') title = d.label
    else if (typeof d.title === 'string') title = d.title
    if (typeof d.sandbox === 'string') sandbox = d.sandbox
  }
  if (options) {
    if (typeof options.url === 'string' && !url) url = options.url
    if (typeof options.title === 'string' && title === 'embed') title = options.title
    if (typeof options.sandbox === 'string') sandbox = options.sandbox
  }
  return { url, title, sandbox }
}
