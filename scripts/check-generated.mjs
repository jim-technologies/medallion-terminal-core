import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const generatedDir = path.join(root, 'src', 'gen')

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

const before = await snapshot(generatedDir)
const localBin = path.join(root, 'node_modules', '.bin')
const result = spawnSync('buf', ['generate'], {
  cwd: root,
  env: {
    ...process.env,
    PATH: `${localBin}${path.delimiter}${process.env.PATH ?? ''}`,
  },
  stdio: 'inherit',
})

if (result.status !== 0) process.exit(result.status ?? 1)

const after = await snapshot(generatedDir)
const changed = [...new Set([...before.keys(), ...after.keys()])]
  .filter((name) => before.get(name) !== after.get(name))
  .sort()

if (changed.length > 0) {
  console.error('Generated protobuf files were stale:')
  for (const name of changed) console.error(`  src/gen/${name}`)
  console.error('Run `pnpm gen:proto` and commit the generated output.')
  process.exit(1)
}
