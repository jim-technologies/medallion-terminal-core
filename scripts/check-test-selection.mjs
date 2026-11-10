import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

// Loads playwright.config.ts under each selection input and reads back the
// shard and the projects Playwright receives.
function load(values) {
  const env = { ...process.env }
  delete env.PLAYWRIGHT_SHARD
  delete env.PLAYWRIGHT_PROJECTS
  for (const [name, value] of Object.entries(values)) if (value !== undefined) env[name] = value
  const read = `const { default: config } = await import('./playwright.config.ts')
    console.log(JSON.stringify({ shard: config.shard ?? null, projects: config.projects.map(project => project.name) }))`
  return spawnSync(process.execPath, ['--input-type=module', '-e', read], { env, encoding: 'utf8' })
}

let checks = 0
for (const [value, expected] of [
  [undefined, null], ['1/1', { current: 1, total: 1 }],
  ['1/8', { current: 1, total: 8 }], ['8/8', { current: 8, total: 8 }],
]) {
  const result = load({ PLAYWRIGHT_SHARD: value })
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout).shard, expected, `shard ${value}`)
  checks++
}
for (const value of ['', '0/8', '9/8', '-1/8', '2', '1/0', '2.0/8', '1/8x', ' 1/8', '1/9007199254740992']) {
  const result = load({ PLAYWRIGHT_SHARD: value })
  assert.notEqual(result.status, 0, `invalid shard ${JSON.stringify(value)} was accepted`)
  assert.match(result.stderr, /PLAYWRIGHT_SHARD/)
  checks++
}

for (const [value, expected] of [
  [undefined, ['chromium', 'firefox', 'webkit']], ['all', ['chromium', 'firefox', 'webkit']],
  ['chromium,firefox', ['chromium', 'firefox']], ['firefox,chromium', ['chromium', 'firefox']],
  ['webkit', ['webkit']], ['chromium', ['chromium']],
]) {
  const result = load({ PLAYWRIGHT_PROJECTS: value })
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout).projects, expected, `projects ${value}`)
  checks++
}
for (const value of ['', 'safari', 'Chromium', ' chromium', 'chromium,', ',webkit', 'chromium,chromium', 'all,webkit']) {
  const result = load({ PLAYWRIGHT_PROJECTS: value })
  assert.notEqual(result.status, 0, `invalid projects ${JSON.stringify(value)} were accepted`)
  assert.match(result.stderr, /PLAYWRIGHT_PROJECTS/)
  checks++
}
console.log(`${checks} test selection checks passed`)
