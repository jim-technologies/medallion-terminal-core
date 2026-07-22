// Small reference adapter for the server's generic `authorize` callback.
// Production hosts should validate short-lived tokens with their IdP/JWKS or
// API gateway; this static-token adapter exists for local integration tests.
import { createHash, timingSafeEqual } from 'node:crypto'

function digest(value) {
  return createHash('sha256').update(value).digest()
}

export function createBearerAuthorizer({ tokens }) {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    throw new TypeError('tokens must contain at least one bearer credential')
  }
  const credentials = tokens.map(entry => {
    if (!entry || typeof entry.token !== 'string' || entry.token.length < 16) {
      throw new TypeError('each bearer token must be at least 16 characters')
    }
    if (typeof entry.subject !== 'string' || entry.subject.length === 0) {
      throw new TypeError('each bearer token requires a subject')
    }
    return {
      hash: digest(entry.token),
      principal: {
        subject: entry.subject,
        scopes: [...new Set(entry.scopes ?? [])],
        tenant: entry.tenant,
      },
    }
  })

  return ({ request, requiredScopes }) => {
    const authorization = request.headers.authorization
    const match = typeof authorization === 'string'
      ? /^Bearer\s+(.+)$/i.exec(authorization)
      : null
    if (!match) {
      return { allowed: false, status: 401, message: 'bearer token required' }
    }

    const presented = digest(match[1])
    const credential = credentials.find(candidate => timingSafeEqual(candidate.hash, presented))
    if (!credential) {
      return { allowed: false, status: 401, message: 'invalid bearer token' }
    }

    const granted = new Set(credential.principal.scopes)
    const missing = requiredScopes.filter(scope => !granted.has(scope))
    if (missing.length > 0) {
      return {
        allowed: false,
        status: 403,
        message: 'token does not grant the required scope',
        principal: credential.principal,
      }
    }
    return { allowed: true, principal: credential.principal }
  }
}
