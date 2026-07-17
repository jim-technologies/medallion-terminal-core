import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')

async function snapshot(dir, prefix = '') {
  const files = new Map()
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name)
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      for (const [name, hash] of await snapshot(absolute, relative)) files.set(name, hash)
    } else if (entry.isFile()) {
      const content = await readFile(absolute)
      files.set(relative, createHash('sha256').update(content).digest('hex'))
    }
  }
  return files
}

const before = await snapshot(distDir)
const result = spawnSync('pnpm', ['build:lib'], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
})

if (result.status !== 0) process.exit(result.status ?? 1)

const after = await snapshot(distDir)
const changed = [...new Set([...before.keys(), ...after.keys()])]
  .filter((name) => before.get(name) !== after.get(name))
  .sort()

if (changed.length > 0) {
  console.error('Committed library artifacts were stale:')
  for (const name of changed) console.error(`  dist/${name}`)
  console.error('Run `pnpm build:lib` and commit the generated output.')
  process.exit(1)
}
