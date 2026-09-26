/**
 * The embed handshake between a product frame and its host (the Terminal).
 * Messages are versioned, only exchanged with allow-listed origins, and
 * never posted to `*`.
 */
import type { PresentationTheme } from '../foundations/types'

/** Host to product. */
export type EmbedHostMessage =
  | { type: 'mtc:init'; version: 1; theme?: PresentationTheme; locale?: string; timeZone?: string }
  | { type: 'mtc:navigate'; version: 1; path: string }

/** Product to host. */
export type EmbedChildMessage =
  | { type: 'mtc:ready'; version: 1; product: string; path: string }
  | { type: 'mtc:resize'; version: 1; height: number }
  | { type: 'mtc:navigated'; version: 1; path: string }
  | { type: 'mtc:session-expired'; version: 1 }

const THEMES = new Set<string>(['dark', 'light', 'operator', 'high-contrast'])

/** Validates a host message; anything else is ignored. */
export function parseEmbedHostMessage(data: unknown): EmbedHostMessage | null {
  if (!data || typeof data !== 'object') return null
  const message = data as Record<string, unknown>
  if (message.version !== 1) return null
  if (message.type === 'mtc:navigate') {
    // An app path: `//host` and `/\host` are protocol-relative to a URL parser.
    return typeof message.path === 'string' && /^\/(?![/\\])/.test(message.path)
      ? { type: 'mtc:navigate', version: 1, path: message.path }
      : null
  }
  if (message.type === 'mtc:init') {
    return {
      type: 'mtc:init',
      version: 1,
      theme: typeof message.theme === 'string' && THEMES.has(message.theme) ? message.theme as PresentationTheme : undefined,
      locale: typeof message.locale === 'string' ? message.locale : undefined,
      timeZone: typeof message.timeZone === 'string' ? message.timeZone : undefined,
    }
  }
  return null
}

/** Options for `createEmbedChannel`. */
export interface EmbedChannelOptions {
  /** Host origins allowed to frame the product and talk to it. */
  allowedOrigins: readonly string[]
  /** Injectable for tests. */
  window?: Window
}

/** A channel to the framing host. */
export interface EmbedChannel {
  /** The host's origin, or null when the product is not framed by an allowed host. */
  readonly hostOrigin: string | null
  post(message: EmbedChildMessage): void
  subscribe(listener: (message: EmbedHostMessage) => void): () => void
}

/**
 * Opens the channel to the parent frame. The host origin comes from the
 * document referrer and must be allow-listed; messages from any other
 * origin or window are ignored, and nothing is posted without a host.
 */
export function createEmbedChannel({ allowedOrigins, window: win = globalThis.window }: EmbedChannelOptions): EmbedChannel {
  let referrerOrigin: string | null = null
  try {
    referrerOrigin = win.document.referrer ? new URL(win.document.referrer).origin : null
  } catch {
    referrerOrigin = null
  }
  const framed = win.parent !== win
  const hostOrigin = framed && referrerOrigin && allowedOrigins.includes(referrerOrigin) ? referrerOrigin : null
  return {
    hostOrigin,
    post(message) {
      if (hostOrigin) win.parent.postMessage(message, hostOrigin)
    },
    subscribe(listener) {
      const onMessage = (event: MessageEvent) => {
        if (!hostOrigin || event.origin !== hostOrigin || event.source !== win.parent) return
        const message = parseEmbedHostMessage(event.data)
        if (message) listener(message)
      }
      win.addEventListener('message', onMessage)
      return () => win.removeEventListener('message', onMessage)
    },
  }
}
