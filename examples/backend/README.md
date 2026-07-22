# Reference TerminalService backend

`server.mjs` is a forkable Node HTTP implementation of every RPC consumed by
the framework. It is a protocol and integration reference, not an application
backend or deployment target.

## Run the open local demo

```bash
pnpm backend
# equivalent: node examples/backend/server.mjs
# optional: PORT=4000 pnpm backend
```

Then open:

```text
http://localhost:5173/?template=/examples/reference-backend.json&backend=http://localhost:3001
```

The open demo intentionally uses wildcard CORS and no authorization so the
bundled examples work without setup. Never expose that mode outside localhost.

## Run the authenticated slice

```bash
# terminal 1
TERMINAL_DEMO_TOKEN='replace-with-a-long-local-token' \
TERMINAL_ALLOWED_ORIGIN='http://localhost:5173' \
pnpm backend:secure

# terminal 2 — use the same local token
VITE_TERMINAL_DEMO_TOKEN='replace-with-a-long-local-token' pnpm dev
```

Mount the dashboard from trusted host code with the matching credential:

```tsx
<Dashboard
  template={template}
  backendUrl="http://localhost:3001"
  backendHeaders={{ Authorization: `Bearer ${token}` }}
/>
```

`secure-server.mjs` fails closed when either environment variable is missing.
It demonstrates an exact-origin CORS allowlist, read/write/media scopes,
request IDs, request-size limits, and metadata-only audit events. The
constant-time static-token adapter in `auth.mjs` is only for local integration;
production hosts should validate short-lived credentials with their IdP, JWKS,
or API gateway.

The bundled Vite app reads `VITE_TERMINAL_DEMO_TOKEN` only in development and
passes it through `backendHeaders`; it never reads a token from the URL. Vite
variables are public browser configuration, so this is strictly a local proof,
not a way to ship a long-lived secret.

## What it implements

| Surface | Reference behavior |
|---|---|
| `ListSources` | Catalog for files, platform assets/objects/lineage/code, media, records, conversations, and market feeds |
| `Get` | One canonical response oneof for every catalog entry |
| `Stream` | Connect JSON envelopes for the streamable market/event sources |
| Cursor collections | Scoped opaque cursors and bounded pages for assets, media, records, and older conversation history |
| Files and media | Path-safe listing/upload/download, content-type handling, and HTTP `Range` previews |
| `SubmitAction` | Idempotent action creation keyed by `client_request_id` |
| `WatchAction` | Monotonic lifecycle updates ending in a terminal status |
| `Generate` | Deterministic sample `WidgetAction`s and context updates |

The reference state and fixtures are intentionally in memory. Restarting the
process resets records, actions, and uploaded files.

## Embedding the server in a host or test

Import `createTerminalServer()` without opening a port:

```js
import { createTerminalServer } from './server.mjs'

const server = createTerminalServer({
  allowedOrigins: ['https://app.example.com'],
  maxBodyBytes: 2 * 1024 * 1024,
  authorize: async ({ operation, sourceId, actionId, requiredScopes, request }) => {
    return policy.authorize({ operation, sourceId, actionId, requiredScopes, request })
  },
  onAudit: event => audit.append(event),
})
```

`authorize` runs before every catalog/read/stream/generate/action/file handler
and receives the operation, source/action identifier, required scope hints,
request ID, parsed body, and raw request. Returning `false` or
`{ allowed: false }` denies the call. `onAudit` receives outcome metadata but
never a request body or bearer token.

## Pagination contract

Collection handlers accept `page_token` plus `page_size` and return
`next_page_token` only when another page exists. Tokens are opaque to the
frontend. A production implementation should bind them cryptographically to
tenant, source, filters, sort, and expiry; reject malformed or replayed
cross-scope cursors; and enforce a server-side page-size ceiling.

The file browser retains its explicit one-based `page` / `page_size` contract
because a directory listing can infer whether a next page may exist from the
returned row count. Do not mix the two schemes within one source.

## Protocol framing

Streaming RPCs (`Stream` and `WatchAction`) use Connect envelopes:

```text
[flags(1)][length(4 bytes, big endian)][JSON payload]
flags & 0x02 = end-of-stream trailer
```

The frontend's `parseConnectEnvelopes` consumes this format. Trailer JSON may
contain `{ metadata?, error? }`; a non-null error is surfaced by the widget.

## Conformance

The repository checks the reference implementation in process:

```bash
pnpm check:conformance
```

Run the reusable suite against another TerminalService:

```bash
node examples/conformance/terminal-service-conformance.mjs \
  https://terminal-api.example.com \
  --bearer-env TERMINAL_ACCESS_TOKEN \
  --action-id safe_conformance_action
```

The suite verifies catalog metadata/defaults, canonical oneof responses,
first stream frames, unknown-source failures, and—when configured—action
idempotency plus monotonic terminal lifecycle completion. Use a harmless
action and isolated tenant for the optional write probe.

`src/__tests__/backend.integration.test.ts` additionally exercises
authentication, CORS, paging, files, range reads, actions, generation, and
stream framing on ephemeral ports.

## Production boundary

Before deploying a derived service, replace the fixtures and all in-memory
stores with durable tenant-isolated services; enforce row/object/field/file
policy; validate real identity; issue signed binary-media URLs or use secure
same-site cookies; add rate and concurrency limits; terminate TLS; export
metrics/traces; and persist audit plus idempotency state. The reference server
shows where those controls attach, not an implementation of those controls.
