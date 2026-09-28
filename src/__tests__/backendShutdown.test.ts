import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// The reference backend's standalone entries are templates to fork, so they
// shut down the way a deployed service must: on SIGTERM they stop accepting
// connections, finish in-flight calls and exit 0 instead of dying on the
// signal. Each entry runs as its own process on an ephemeral loopback port.

const entries: Array<{ script: string, env: Record<string, string> }> = [
  { script: 'server.mjs', env: {} },
  {
    script: 'secure-server.mjs',
    env: {
      TERMINAL_DEMO_TOKEN: 'shutdown-test-token-0123456789',
      TERMINAL_ALLOWED_ORIGIN: 'http://localhost:5173',
    },
  },
]

describe.each(entries)('reference backend $script', ({ script, env }) => {
  it('exits 0 on SIGTERM', async () => {
    const path = fileURLToPath(new URL(`../../examples/backend/${script}`, import.meta.url))
    const child = spawn(process.execPath, [path], {
      env: { ...process.env, ...env, PORT: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const exited = new Promise<{ code: number | null, signal: NodeJS.Signals | null }>(resolve => {
      child.once('exit', (code, signal) => resolve({ code, signal }))
    })
    await new Promise<void>((resolve, reject) => {
      child.stdout.on('data', chunk => {
        if (String(chunk).includes('listening')) resolve()
      })
      void exited.then(result => reject(new Error(`${script} exited before listening: ${JSON.stringify(result)}`)))
    })

    child.kill('SIGTERM')
    expect(await exited).toEqual({ code: 0, signal: null })
  })
})
