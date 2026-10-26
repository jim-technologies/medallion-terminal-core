import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const cases = [
  [undefined, undefined], ['1/1', { current: 1, total: 1 }],
  ['1/8', { current: 1, total: 8 }], ['8/8', { current: 8, total: 8 }],
]
for (const [value, expected] of cases) {
  const env = { ...process.env }
  delete env.PLAYWRIGHT_SHARD
  if (value !== undefined) env.PLAYWRIGHT_SHARD = value
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', "const { default: config } = await import('./playwright.config.ts'); console.log(JSON.stringify(config.shard ?? null))"], { env, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout), expected ?? null, `shard ${value}`)
}
for (const value of ['', '0/8', '9/8', '-1/8', '2', '1/0', '2.0/8', '1/8x', ' 1/8', '1/9007199254740992']) {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', "await import('./playwright.config.ts')"], { env: { ...process.env, PLAYWRIGHT_SHARD: value }, encoding: 'utf8' })
  assert.notEqual(result.status, 0, `invalid shard ${JSON.stringify(value)} was accepted`)
  assert.match(result.stderr, /PLAYWRIGHT_SHARD/)
}
console.log(`14 shard configuration checks passed`)
