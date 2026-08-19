// Version parity (part of `make validate`, per MAKEFILE-CONTRACT.md).
//
// One VERSION file at the repo root is the release version; every language
// SDK reads it or is checked against it. This repo publishes one npm
// package, so parity means package.json agrees with VERSION.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const version = readFileSync(path.join(root, 'VERSION'), 'utf8').trim()
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`VERSION is not a bare semver: ${JSON.stringify(version)}`)
  process.exit(1)
}

if (pkg.version !== version) {
  console.error(`Version parity failed: VERSION is ${version} but package.json is ${pkg.version}`)
  process.exit(1)
}

console.log(`Version parity OK: ${version}`)
