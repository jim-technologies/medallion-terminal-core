import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import { expect, test } from '@playwright/test'

interface RequestRecord {
  path: string
  body: string
  disconnected: boolean
}

interface FetchState {
  outcome: 'pending' | 'resolved' | 'rejected'
  firstChunk?: string
  headersAt?: number
  error?: { name: string, kind?: string, message: string }
}

interface FetchFixture extends Window {
  fetchState: FetchState
  caller: AbortController
  startRequest: (path: string, timeoutMs: number) => Promise<void>
}

test('native caller cancellation works before headers and throughout the response body', async ({ page, browser }, testInfo) => {
  const requests: RequestRecord[] = []
  let tearingDown = false
  const fixturePort = Number(process.env.HISTORY_FIXTURE_PORT ?? 6216)
  const server = createServer((request, response) => {
    if (request.url === '/') {
      response.setHeader('content-type', 'text/html')
      response.end(`<!doctype html><html lang="en"><meta charset="UTF-8"><title>Native fetch cancellation</title>
        <script type="module">
          import { createProductFetch } from 'http://127.0.0.1:${fixturePort}/src/app/productFetch.ts';
          window.startRequest = async (path, timeoutMs) => {
            const state = window.fetchState = { outcome: 'pending' };
            const controller = window.caller = new AbortController();
            try {
              const response = await createProductFetch({ timeoutMs })(path, {
                method: 'POST', body: 'native-request', signal: controller.signal,
              });
              state.headersAt = performance.now();
              const reader = response.body.getReader();
              state.firstChunk = new TextDecoder().decode((await reader.read()).value);
              await reader.read();
              state.outcome = 'resolved';
            } catch (error) {
              state.outcome = 'rejected';
              state.error = { name: error.name, kind: error.kind, message: error.message };
            }
          };
        </script></html>`)
      return
    }
    if (request.method !== 'POST' || !['/headers', '/stream', '/timeout'].includes(request.url ?? '')) {
      response.writeHead(404).end()
      return
    }
    let body = ''
    request.setEncoding('utf8')
    request.on('data', chunk => { body += chunk })
    request.on('end', () => {
      const record = { path: request.url!, body, disconnected: false }
      requests.push(record)
      response.on('close', () => {
        if (!tearingDown && !response.writableEnded) record.disconnected = true
      })
      if (request.url === '/stream') {
        response.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': 2 * 1024 * 1024 })
        response.flushHeaders()
        response.write('first ')
      }
    })
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
  const outcomes: { path: string, state: FetchState, callerAborted: boolean }[] = []
  try {
    await page.goto(origin)
    await page.waitForFunction(() => typeof (window as FetchFixture).startRequest === 'function')
    await page.evaluate(() => { void (window as FetchFixture).startRequest('/headers', 10_000) })
    await expect.poll(() => requests.filter(record => record.path === '/headers').length).toBe(1)
    await page.evaluate(() => (window as FetchFixture).caller.abort())
    await expect.poll(() => page.evaluate(() => (window as FetchFixture).fetchState.error?.name)).toBe('AbortError')
    await expect.poll(() => requests.find(record => record.path === '/headers')?.disconnected).toBe(true)
    outcomes.push(await page.evaluate(() => ({ path: '/headers', state: (window as FetchFixture).fetchState, callerAborted: (window as FetchFixture).caller.signal.aborted })))

    await page.evaluate(() => { void (window as FetchFixture).startRequest('/stream', 200) })
    await expect.poll(() => page.evaluate(() => (window as FetchFixture).fetchState.firstChunk)).toBe('first ')
    await expect.poll(() => page.evaluate(() => performance.now() - ((window as FetchFixture).fetchState.headersAt ?? performance.now()))).toBeGreaterThan(250)
    expect(await page.evaluate(() => (window as FetchFixture).fetchState.outcome)).toBe('pending')
    await page.evaluate(() => (window as FetchFixture).caller.abort())
    await expect.poll(() => page.evaluate(() => (window as FetchFixture).fetchState.error?.name)).toBe('AbortError')
    await expect.poll(() => requests.find(record => record.path === '/stream')?.disconnected).toBe(true)
    outcomes.push(await page.evaluate(() => ({ path: '/stream', state: (window as FetchFixture).fetchState, callerAborted: (window as FetchFixture).caller.signal.aborted })))

    await page.evaluate(() => { void (window as FetchFixture).startRequest('/timeout', 100) })
    await expect.poll(() => requests.filter(record => record.path === '/timeout').length).toBe(1)
    await expect.poll(() => page.evaluate(() => (window as FetchFixture).fetchState.error?.kind)).toBe('unavailable')
    expect(await page.evaluate(() => (window as FetchFixture).caller.signal.aborted)).toBe(false)
    await expect.poll(() => requests.find(record => record.path === '/timeout')?.disconnected).toBe(true)
    outcomes.push(await page.evaluate(() => ({ path: '/timeout', state: (window as FetchFixture).fetchState, callerAborted: (window as FetchFixture).caller.signal.aborted })))
    expect(requests.map(({ path, body, disconnected }) => ({ path, body, disconnected }))).toEqual(
      ['/headers', '/stream', '/timeout'].map(path => ({ path, body: 'native-request', disconnected: true })),
    )
    await testInfo.attach('native-http-cancellation.json', {
      body: JSON.stringify({ browserName: browser.browserType().name(), browserVersion: browser.version(), origin, requests, outcomes, disconnectsBeforeTeardown: true }, null, 2),
      contentType: 'application/json',
    })
  } finally {
    tearingDown = true
    const closed = new Promise<void>(resolve => server.close(() => resolve()))
    server.closeAllConnections()
    await closed
  }
})
