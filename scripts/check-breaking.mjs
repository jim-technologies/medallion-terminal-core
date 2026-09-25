// Proto compatibility (part of `make validate`, per MAKEFILE-CONTRACT.md).
//
// `buf breaking` needs a baseline that is older than the change under test.
// Comparing against origin/main is a no-op on main after a push — HEAD is
// compared to itself and nothing between two releases can ever fail — so the
// baseline is the newest plain-semver v* tag reachable from HEAD: exactly
// what a consumer pinning the previous release sees. On the release commit
// itself, the release tag points at HEAD, so the preceding release is the
// baseline instead. With no reachable tag (a shallow or single-ref clone)
// the check is skipped loudly rather than passed silently.
import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()

const head = git('rev-parse', 'HEAD')
const releaseTag = `v${readFileSync(path.join(root, 'VERSION'), 'utf8').trim()}`
const baseline = git(
  'tag',
  '--merged',
  'HEAD',
  '--list',
  'v[0-9]*.[0-9]*.[0-9]*',
  '--sort=-version:refname',
)
  .split('\n')
  .filter((tag) => tag !== '' && !tag.includes('-'))
  .find((tag) => !(tag === releaseTag && git('rev-list', '-n', '1', tag) === head))

if (!baseline) {
  console.error('check-breaking: no prior release tag is reachable from HEAD; skipping buf breaking')
  process.exit(0)
}

console.log(`check-breaking: buf breaking against ${baseline}`)
const result = spawnSync('buf', ['breaking', '--against', `.git#tag=${baseline}`], {
  cwd: root,
  stdio: 'inherit',
})
process.exit(result.status ?? 1)
