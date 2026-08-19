// Public-surface guard (part of `make validate`, per MAKEFILE-CONTRACT.md).
//
// This repository is public. The gate fails when tracked files carry
// private-infrastructure hostnames, private package registries, references
// to other (potentially private) repositories under the org, credential
// material, CI secret usage, or encrypted-secret stores. The deny-list is
// structural — derived from this repo's own review; it names no internal
// systems, so the guard itself leaks nothing.
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const self = 'scripts/public-surface-check.mjs'

// Generated build output is rebuilt from checked sources; scanning it only
// duplicates findings. Everything else tracked by git is in scope, including
// the lockfile (private registries would surface there) and the Makefile.
const skipDirs = /^(dist|dist-app|storybook-static|test-results|playwright-report)\//
const binaryExt = /\.(png|jpe?g|gif|webp|avif|ico|svg|mp4|webm|mov|mp3|wav|woff2?|ttf|otf|eot|parquet|pdf|zip)$/i

// Filenames that indicate an encrypted-secret store. These repositories hold
// no secrets, encrypted or otherwise.
const secretStoreName = /(^|\/)(\.sops\.ya?ml|\.git-crypt|secrets?\.(enc|ya?ml\.enc))$|\.(age|gpg|kdbx)$/

const checks = [
  {
    name: 'private-infrastructure hostname',
    pattern: /\b[a-z0-9][a-z0-9-]*\.(internal|corp|intranet|lan)\b/gi,
  },
  {
    name: 'private package registry',
    pattern: /npm\.pkg\.github\.com|\.jfrog\.io|artifactory|verdaccio|nexus[.-]?(repo|registry)/gi,
  },
  {
    name: 'ssh/private git reference',
    pattern: /git\+ssh:\/\/|\bgit@[a-z0-9.-]+:/gi,
  },
  {
    name: 'credential material',
    pattern:
      /\bghp_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{22,}\b|\bAKIA[0-9A-Z]{16}\b|\bxox[baprs]-[A-Za-z0-9-]{10,}\b|-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
  },
]

// Under the org, only this repository may be referenced; sibling repos are
// not assumed public.
const orgRef = /github\.com[:/]jim-technologies\/([A-Za-z0-9._-]+)/gi
const allowedRepos = new Set(['medallion-terminal-core', 'medallion-terminal-core.git'])

// CI secrets of any kind are forbidden — CI runs `make validate`, nothing else.
const workflowSecret = /\bsecrets\s*\.\s*[A-Za-z_]/g

const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)

const violations = []

for (const file of files) {
  if (secretStoreName.test(file)) {
    violations.push(`${file}: encrypted-secret store file`)
    continue
  }
  if (file === self || skipDirs.test(file) || binaryExt.test(file)) continue

  let text
  try {
    text = readFileSync(path.join(root, file), 'utf8')
  } catch {
    continue // deleted in the working tree
  }
  if (text.includes('\0')) continue

  for (const { name, pattern } of checks) {
    pattern.lastIndex = 0
    const match = pattern.exec(text)
    if (match) violations.push(`${file}: ${name}: ${JSON.stringify(match[0])}`)
  }

  orgRef.lastIndex = 0
  for (let match; (match = orgRef.exec(text)); ) {
    if (!allowedRepos.has(match[1])) {
      violations.push(`${file}: reference to non-public org repository ${JSON.stringify(match[1])}`)
    }
  }

  if (file.startsWith('.github/')) {
    workflowSecret.lastIndex = 0
    const match = workflowSecret.exec(text)
    if (match) violations.push(`${file}: CI secret usage: ${JSON.stringify(match[0])}`)
  }
}

if (violations.length > 0) {
  console.error('Public-surface check failed:')
  for (const violation of violations) console.error(`  ${violation}`)
  process.exit(1)
}

console.log(`Public-surface check passed (${files.length} tracked files).`)
