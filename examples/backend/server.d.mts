import type { Server } from 'node:http'

// Public surface for tests + embedders. The CLI entrypoint is wrapped
// so importing the module doesn't auto-listen — only `node server.mjs`
// does.
export function createTerminalServer(): Server
