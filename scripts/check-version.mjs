// Version parity (part of `make validate`, per MAKEFILE-CONTRACT.md).
//
// One VERSION file at the repo root is the release version. This repo ships
// one package, distributed from Git tags, so parity means:
//   - package.json agrees with VERSION;
//   - CHANGELOG.md opens with `## [Unreleased]` and its first release
//     heading is VERSION — 0.5.1 shipped without a changelog entry because
//     nothing in the gate read the file;
//   - the pnpm that package.json `packageManager` names is the pnpm Flox
//     locks; otherwise pnpm 11 quietly downloads the declared one inside the
//     gate and Flox stops being the sole toolchain provider;
//   - `engines.node` states the runtime floor consumers install against.
// With --release (scripts/release.mjs) the [Unreleased] section must also be
// empty: anything above the release heading is by definition unreleased.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const release = process.argv.includes('--release')
const read = (name) => readFileSync(path.join(root, name), 'utf8')
const errors = []

const version = read('VERSION').trim()
const pkg = JSON.parse(read('package.json'))

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  errors.push(`VERSION is not a bare semver: ${JSON.stringify(version)}`)
}
if (pkg.version !== version) {
  errors.push(`VERSION is ${version} but package.json is ${pkg.version}`)
}

// The changelog opens with `# Changelog` prose, so look at H2 headings only.
const changelog = read('CHANGELOG.md').split('\n')
const headings = changelog
  .map((line, index) => ({ line, index }))
  .filter(({ line }) => line.startsWith('## '))
const [unreleased, firstRelease] = headings
if (unreleased?.line !== '## [Unreleased]') {
  errors.push(
    `CHANGELOG.md must open with \`## [Unreleased]\`, found ${JSON.stringify(unreleased?.line ?? null)}`,
  )
}
const releaseHeading = /^## \[(\d+\.\d+\.\d+)\]/.exec(firstRelease?.line ?? '')
if (!releaseHeading) {
  errors.push('CHANGELOG.md has no `## [X.Y.Z]` release heading after [Unreleased]')
} else if (releaseHeading[1] !== version) {
  errors.push(
    `CHANGELOG.md first release heading is ${releaseHeading[1]} but VERSION is ${version}`,
  )
}
if (release && unreleased && firstRelease) {
  const body = changelog.slice(unreleased.index + 1, firstRelease.index).join('\n').trim()
  if (body !== '') {
    errors.push(
      'CHANGELOG.md [Unreleased] must be empty at release — move its entries under the new version heading',
    )
  }
}

const declaredPnpm = /^pnpm@(\d+\.\d+\.\d+)$/.exec(pkg.packageManager ?? '')
if (!declaredPnpm) {
  errors.push(
    `package.json packageManager must be pnpm@X.Y.Z, found ${JSON.stringify(pkg.packageManager)}`,
  )
}
const lock = JSON.parse(read('.flox/env/manifest.lock'))
const lockedPnpm = [
  ...new Set(lock.packages.filter((p) => p.install_id === 'pnpm').map((p) => p.version)),
]
if (lockedPnpm.length !== 1) {
  errors.push(
    `.flox/env/manifest.lock must lock exactly one pnpm version, found ${JSON.stringify(lockedPnpm)}`,
  )
} else if (declaredPnpm && declaredPnpm[1] !== lockedPnpm[0]) {
  errors.push(
    `package.json packageManager is pnpm@${declaredPnpm[1]} but Flox locks pnpm ${lockedPnpm[0]}`,
  )
}

if (typeof pkg.engines?.node !== 'string' || pkg.engines.node.trim() === '') {
  errors.push('package.json must declare engines.node, the runtime floor consumers install against')
}

if (errors.length > 0) {
  console.error('Version parity failed:')
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`Version parity OK: ${version}${release ? ' (release)' : ''}`)
