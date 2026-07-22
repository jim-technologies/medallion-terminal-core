import type { IncomingMessage } from 'node:http'

export interface BearerCredential {
  token: string
  subject: string
  scopes: string[]
  tenant?: string
}

export interface AuthorizationContext {
  request: IncomingMessage
  requiredScopes: string[]
}

export type AuthorizationResult =
  | { allowed: true; principal: { subject: string; scopes: string[]; tenant?: string } }
  | { allowed: false; status: 401 | 403; message: string; principal?: { subject: string; scopes: string[]; tenant?: string } }

export function createBearerAuthorizer(options: {
  tokens: BearerCredential[]
}): (context: AuthorizationContext) => AuthorizationResult
