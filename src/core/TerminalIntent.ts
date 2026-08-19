/**
 * Generic messages from Terminal Core to a trusted host. The host remains
 * responsible for authorization and execution.
 */
export type TerminalIntent =
  | {
      type: 'object.open'
      objectId: string
      mode?: string
    }
  | {
      type: 'object.select'
      objectId: string
    }
  | {
      type: 'command.invoke'
      commandId: string
      objectIds?: string[]
      params?: Record<string, unknown>
    }

/** Optional host-owned intent sink. */
export type TerminalIntentHandler = (intent: TerminalIntent) => void

