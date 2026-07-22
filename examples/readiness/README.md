# Production readiness examples

Storybook path: `Examples/Production Readiness`.

This suite exercises the real `Dashboard` and `MultiDashboard` components
against a browser-local `TerminalService` fixture on the reserved
`terminal-readiness.example.test` origin. The fixture intercepts only that
origin and delegates every unrelated request to the browser's original
`fetch` implementation.

The five stories cover:

- a connected four-tab workspace;
- host-supplied tenant and authorization headers, field masking, a safe 403,
  source discovery, and metadata-only auditing;
- healthy, empty, rate-limited, and unavailable read states;
- bounded asset, record, and conversation pages with opaque scoped cursors;
- a confirmed, idempotent action with a monotonic `WatchAction` lifecycle.

The fixture is test infrastructure, not a deployable backend or identity
system. Production hosts still own authentication, authorization, storage,
pagination, durable idempotency, auditing, and action execution. Credentials
remain in host props and are never serialized into a template or snapshot.

Run the focused contract checks with:

```bash
flox activate -- pnpm exec vitest run src/__tests__/productionReadinessExamples.test.ts
flox activate -- pnpm exec playwright test --grep 'readiness|Production readiness'
```

Run `pnpm ci:verify` for the complete release gate.
