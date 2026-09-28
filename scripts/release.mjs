// `make release` (per MAKEFILE-CONTRACT.md): publish from a maintainer's
// machine only; CI never publishes. Distribution is Git-only — consumers pin
// `github:jim-technologies/medallion-terminal-core#<sha>` where the sha is a
// vX.Y.Z tag's commit, and dist/ and src/gen are committed so no build runs
// on install — so publishing is creating and pushing the annotated tag.
// Nothing goes to a package registry. The guards are the ones every public
// repository runs (MAKEFILE-CONTRACT.md, `make release`): a clean tree, HEAD
// contained in origin/main, VERSION equal to the changelog's first release
// heading, and tag vVERSION absent. Any failed guard exits 1 with nothing
// tagged; otherwise the annotated tag is created and pushed, and it exits 0.
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
  git('fetch', '--quiet', 'origin')
} catch {
  fail('could not fetch origin — refusing to release without verifying the pushed state')
}

try {
  git('merge-base', '--is-ancestor', 'HEAD', 'origin/main')
} catch {
  fail('HEAD is not contained in origin/main — push it to main before releasing')
}

// The parity gate `make validate` runs, in release mode: VERSION ↔
// package.json, CHANGELOG.md's first release heading == VERSION with an empty
// [Unreleased], packageManager ↔ Flox pnpm, engines.node present.
try {
  execFileSync(process.execPath, [path.join(root, 'scripts', 'check-version.mjs'), '--release'], {
    cwd: root,
    stdio: 'inherit',
  })
} catch {
  fail('the version gate is red — fix the findings above before releasing')
}

const version = readFileSync(path.join(root, 'VERSION'), 'utf8').trim()
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))

const tag = `v${version}`
let tagExists = true
try {
  git('rev-parse', '--quiet', '--verify', `refs/tags/${tag}`)
} catch {
  tagExists = false
}
if (tagExists) fail(`tag ${tag} already exists — bump VERSION and package.json first`)

const sha = git('rev-parse', 'HEAD')
console.log(`Releasing ${pkg.name} ${version} at ${sha}: annotated tag ${tag}, pushed to origin`)
execFileSync('git', ['tag', '-a', tag, '-m', tag], { cwd: root, stdio: 'inherit' })
execFileSync('git', ['push', 'origin', tag], { cwd: root, stdio: 'inherit' })
console.log(`Released ${pkg.name} ${version}; consumers pin github:jim-technologies/${pkg.name}#${sha}`)
