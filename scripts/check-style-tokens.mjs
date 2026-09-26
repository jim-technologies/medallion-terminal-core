#!/usr/bin/env node
// Style-token guard for production source (src/**/*.{ts,tsx,css}) and the
// examples built on it (examples/**, except the clone showcases).
//
// Colour, type size and letter-spacing come from the scoped --mtc-* tokens
// (see DESIGN.md); the rules are in scripts/style-token-rules.mjs.
//
// Existing debt is a ratchet, not a pass: scripts/style-token-budget.json
// records the violations each file had when the guard landed (documented
// canvas-library fallbacks, and the widget type sizes the v0.7.0 sweep
// retires). A file may never exceed its budget, and a budget larger than the
// file's current count fails too, so paying debt down forces the budget to
// follow (`node scripts/check-style-tokens.mjs --write` rewrites it).
//
// Stories, tests, fixtures and generated code are exempt from the other
// rules: fixtures may use literal values, and generated code is not
// authored. Stories still get the story-frame rule, and the page templates
// (src/templates/*.stories.tsx), the reference for product pages, get every
// rule besides it.
//
// Scope of the type rules (DESIGN.md, Typography): the 11 px floor and
// sentence-case labels govern what ships as Medallion, so every source file,
// the page templates and every example built on the toolkit (the custom
// widget, the readiness workspace) are held to them. The clone showcases under examples/clones are
// exempt on purpose: each reproduces another product's density at the sizes
// that product ships, from its own authored stylesheet rather than the
// --mtc-* tokens, so the toolkit can be judged against it. They are
// fidelity references, not Medallion surfaces, so only their stories are
// scanned (story-frame).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isStory, violations } from './style-token-rules.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const budgetPath = path.join(root, 'scripts/style-token-budget.json')

function exempt(relative) {
  return /(?:^|\/)(?:__tests__|gen|fonts)\//.test(relative)
    || /\.(?:stories|test|spec|bench|fixture)\.[cm]?[jt]sx?$/.test(relative)
    || /\.fixture\.ts$/.test(relative)
}

function* sourceFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* sourceFiles(absolute)
    else if (/\.(?:ts|tsx|css)$/.test(entry.name)) yield absolute
  }
}

const isClone = relative => relative.startsWith('examples/clones/')

// Production source and the examples; clone showcases only for their stories.
const scanned = [
  ...sourceFiles(path.join(root, 'src')),
  ...[...sourceFiles(path.join(root, 'examples'))].filter(file => (
    isStory(file) || !isClone(path.relative(root, file).split(path.sep).join('/'))
  )),
]

const counts = {}
const details = {}
for (const absolute of scanned) {
  const relative = path.relative(root, absolute).split(path.sep).join('/')
  if (exempt(relative) && !isStory(relative)) continue
  const found = violations(relative, readFileSync(absolute, 'utf8'))
  if (found.length === 0) continue
  counts[relative] = {}
  details[relative] = found
  for (const { rule } of found) counts[relative][rule] = (counts[relative][rule] ?? 0) + 1
}

const sorted = Object.fromEntries(
  Object.keys(counts).sort().map(file => [
    file,
    Object.fromEntries(Object.keys(counts[file]).sort().map(rule => [rule, counts[file][rule]])),
  ]),
)

if (process.argv.includes('--write')) {
  writeFileSync(budgetPath, `${JSON.stringify(sorted, null, 2)}\n`)
  console.log(`style-token budget written for ${Object.keys(sorted).length} files`)
  process.exit(0)
}

const budget = JSON.parse(readFileSync(budgetPath, 'utf8'))
const problems = []
for (const file of new Set([...Object.keys(sorted), ...Object.keys(budget)])) {
  for (const rule of new Set([...Object.keys(sorted[file] ?? {}), ...Object.keys(budget[file] ?? {})])) {
    const actual = sorted[file]?.[rule] ?? 0
    const allowed = budget[file]?.[rule] ?? 0
    if (actual > allowed) {
      const lines = details[file].filter(item => item.rule === rule)
        .map(item => `${file}:${item.line} ${item.text}`).join('\n    ')
      problems.push(`${file}: ${actual} ${rule} (budget ${allowed})\n    ${lines}`)
    } else if (actual < allowed) {
      problems.push(`${file}: ${rule} budget ${allowed} is stale (now ${actual}); run node scripts/check-style-tokens.mjs --write`)
    }
  }
}

if (problems.length > 0) {
  console.error('Style tokens: production source must use --mtc-* tokens (DESIGN.md).')
  for (const problem of problems) console.error(`  ${problem}`)
  process.exit(1)
}
const debt = Object.values(sorted).reduce((total, rules) => total + Object.values(rules).reduce((a, b) => a + b, 0), 0)
console.log(`style tokens: ok (${debt} budgeted legacy violations in ${Object.keys(sorted).length} files)`)
