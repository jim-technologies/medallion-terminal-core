// `make release` (per MAKEFILE-CONTRACT.md): publish to public ecosystems
// only — a git tag plus npm — from a maintainer's machine. CI never
// publishes. Fail-closed: refuses a dirty tree, an unpushed HEAD, version
// disagreement, or an existing tag, and performs no side effect unless
// RELEASE_CONFIRM=yes is set after the plan is printed.
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
const fail = (message) => {
  console.error(`release: ${message}`)
  process.exit(1)
}

if (git('status', '--porcelain') !== '') {
  fail('working tree is dirty — commit or stash everything before releasing')
}

try {
  git('fetch', '--quiet')
} catch {
  fail('could not fetch the remote — refusing to release without verifying the pushed state')
}

let upstream
try {
  upstream = git('rev-parse', '--abbrev-ref', '@{upstream}')
} catch {
  fail('current branch has no upstream — push it before releasing')
}

try {
  git('merge-base', '--is-ancestor', 'HEAD', '@{upstream}')
} catch {
  fail(`HEAD is not contained in ${upstream} — push before releasing`)
}

const version = readFileSync(path.join(root, 'VERSION'), 'utf8').trim()
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
if (pkg.version !== version) {
  fail(`VERSION is ${version} but package.json is ${pkg.version} — run \`make validate\``)
}

const tag = `v${version}`
let tagExists = true
try {
  git('rev-parse', '--quiet', '--verify', `refs/tags/${tag}`)
} catch {
  tagExists = false
}
if (tagExists) fail(`tag ${tag} already exists — bump VERSION and package.json first`)

console.log(`Release plan for ${pkg.name} ${version}:`)
console.log(`  1. git tag ${tag} && git push origin ${tag}`)
console.log('  2. pnpm publish --access public   (prepack rebuilds dist/)')

if (process.env.RELEASE_CONFIRM !== 'yes') {
  fail('dry run — nothing was tagged or published; re-run with RELEASE_CONFIRM=yes to execute the plan')
}

execFileSync('git', ['tag', tag], { cwd: root, stdio: 'inherit' })
execFileSync('git', ['push', 'origin', tag], { cwd: root, stdio: 'inherit' })
execFileSync('pnpm', ['publish', '--access', 'public'], { cwd: root, stdio: 'inherit' })
console.log(`Released ${pkg.name} ${version}.`)
