import type { IncomingMessage, Server } from 'node:http'

// Public surface for tests + embedders. The CLI entrypoint is wrapped
// so importing the module doesn't auto-listen — only `node server.mjs`
// does.
export interface TerminalPrincipal {
  subject?: string
  id?: string
  [key: string]: unknown
}

export interface TerminalAuthorizationContext {
  request: IncomingMessage
  requestId: string
  operation: 'Media' | 'Download' | 'ListSources' | 'Get' | 'Stream' | 'Generate' | 'SubmitAction' | 'WatchAction'
  sourceId?: string
  actionId?: string
  requiredScopes: string[]
  body: Record<string, unknown>
}

export type TerminalAuthorizationResult = boolean | {
  allowed: boolean
  status?: 401 | 403
  message?: string
  principal?: TerminalPrincipal
}

export interface TerminalAuditEvent {
  timestamp: string
  request_id: string
  operation: string
  source_id?: string
  action_id?: string
  subject?: string
  outcome: 'allowed' | 'denied' | 'error'
  status: number
  duration_ms: number
}

export interface TerminalServerOptions {
  allowedOrigins?: '*' | string[] | ((origin: string) => boolean)
  authorize?: (
    context: TerminalAuthorizationContext,
  ) => TerminalAuthorizationResult | Promise<TerminalAuthorizationResult>
  onAudit?: (event: TerminalAuditEvent) => void | Promise<void>
  maxBodyBytes?: number
}

export function createTerminalServer(options?: TerminalServerOptions): Server
