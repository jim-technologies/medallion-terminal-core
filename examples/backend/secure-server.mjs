// Fail-closed local authenticated slice. This demonstrates the framework's
// auth/CORS/audit integration seams; replace the static credential adapter
// with your IdP or gateway in a deployed host.
import { createBearerAuthorizer } from './auth.mjs'
import { createTerminalServer } from './server.mjs'

const port = Number(process.env.PORT ?? 3001)
const token = process.env.TERMINAL_DEMO_TOKEN
const allowedOrigin = process.env.TERMINAL_ALLOWED_ORIGIN

if (!token || token.length < 16) {
  throw new Error('TERMINAL_DEMO_TOKEN must be set to at least 16 characters')
}
if (!allowedOrigin) {
  throw new Error('TERMINAL_ALLOWED_ORIGIN must be set (for example http://localhost:5173)')
}
new URL(allowedOrigin)

const authorize = createBearerAuthorizer({
  tokens: [{
    token,
    subject: 'jun@example.test',
    tenant: 'jim-technologies',
    scopes: ['terminal:read', 'terminal:write', 'terminal:media'],
  }],
})

const server = createTerminalServer({
  allowedOrigins: [allowedOrigin],
  authorize,
  onAudit: event => process.stdout.write(`${JSON.stringify({ type: 'terminal_audit', ...event })}\n`),
})

server.listen(port, () => {
  process.stdout.write(`[medallion-secure-backend] listening on http://localhost:${port}\n`)
})
