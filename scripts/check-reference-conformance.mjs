import { createTerminalServer } from '../examples/backend/server.mjs'
import { runTerminalServiceConformance } from '../examples/conformance/terminal-service-conformance.mjs'

const server = createTerminalServer()
try {
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('reference server has no TCP address')
  const report = await runTerminalServiceConformance({
    backendUrl: `http://127.0.0.1:${address.port}`,
    actionProbe: { actionId: 'request_asset_access', params: { asset_id: 'dataset.customer_360' } },
  })
  process.stdout.write(`TerminalService conformance OK: ${report.sources} sources, ${report.checks.length} checks\n`)
} finally {
  await new Promise(resolve => server.close(resolve))
}
