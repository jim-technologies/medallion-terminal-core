#!/usr/bin/env node
// Style-token guard for production source (src/**/*.{ts,tsx,css}).
//
// Colour, type size and letter-spacing come from the scoped --mtc-* tokens
// (see DESIGN.md). This script fails when production code introduces:
//
//   color-literal   a hex, rgb(), rgba(), hsl() or hsla() colour outside a
//                   `--mtc-*` / Tailwind `--color-*` custom-property
//                   declaration in src/index.css
//   arbitrary-color a Tailwind arbitrary colour class such as bg-[#123456]
//   font-size       text-[Npx] below 11 px or off the 11/12/13/14/16/20/24
//                   scale
//   tracking        an arbitrary tracking-[…] letter-spacing
//
// Existing debt is a ratchet, not a pass: scripts/style-token-budget.json
// records the violations each file had when the guard landed (documented
// canvas-library fallbacks, and the widget type sizes the v0.7.0 sweep
// retires). A file may never exceed its budget, and a budget larger than the
// file's current count fails too, so paying debt down forces the budget to
// follow (`node scripts/check-style-tokens.mjs --write` rewrites it).
//
// Stories, tests, fixtures and generated code are exempt: fixtures may use
// literal values, and generated code is not authored.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const budgetPath = path.join(root, 'scripts/style-token-budget.json')
const TYPE_SCALE = new Set([11, 12, 13, 14, 16, 20, 24])

const rules = {
  'color-literal': /#[0-9a-fA-F]{3,8}\b(?![-\w])|\b(?:rgba?|hsla?)\(/g,
  'arbitrary-color': /\b(?:bg|text|border(?:-[trblxy])?|fill|stroke|from|via|to|ring|outline|decoration|shadow|accent|caret|divide)-\[(?:#|rgba?\(|hsla?\()/g,
  'font-size': /\btext-\[(\d+(?:\.\d+)?)px\]/g,
  tracking: /\btracking-\[[^\]]+\]/g,
}

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

function violations(relative, text) {
  const found = []
  const lines = text.split('\n')
  lines.forEach((line, index) => {
    // A custom-property declaration in the token stylesheet *is* the token.
    const tokenDeclaration = relative === 'src/index.css'
      && /^\s*--(?:mtc|color)-[\w-]+\s*:/.test(line)
    for (const [rule, pattern] of Object.entries(rules)) {
      if (rule === 'color-literal' && tokenDeclaration) continue
      for (const match of line.matchAll(pattern)) {
        if (rule === 'font-size') {
          const px = Number(match[1])
          if (px >= 11 && TYPE_SCALE.has(px)) continue
        }
        if (rule === 'color-literal' && /^#[0-9a-fA-F]{3,8}$/.test(match[0])) {
          // Ignore hex-looking fragments that are not colours: URL fragments
          // and ids such as `#main` never reach here (non-hex), but numeric
          // anchors like `#123` in copy do; require a colour-ish context.
          const before = line.slice(0, match.index)
          if (/[\w/]$/.test(before)) continue
        }
        found.push({ rule, line: index + 1, text: match[0] })
      }
    }
  })
  return found
}

const counts = {}
const details = {}
for (const absolute of sourceFiles(path.join(root, 'src'))) {
  const relative = path.relative(root, absolute).split(path.sep).join('/')
  if (exempt(relative)) continue
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
