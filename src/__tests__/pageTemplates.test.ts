import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// The page templates are the reference products copy structure from, so
// they may use nothing a product cannot: every component comes from the
// public toolkit entry, and the data fixture imports types only.
const directory = new URL('../templates/', import.meta.url)
const files = readdirSync(directory).filter(name => /\.(ts|tsx)$/.test(name))

const ALLOWED: Record<string, readonly string[]> = {
  'Pages.stories.tsx': ['react', '@storybook/react', 'storybook/test', '../toolkit', './pages.fixture'],
  'pages.fixture.ts': ['../toolkit'],
}

function importsOf(source: string): { specifier: string; typeOnly: boolean }[] {
  const pattern = /^\s*import\s+(type\s+)?[\s\S]*?\s+from\s+'([^']+)'/gm
  return [...source.matchAll(pattern)].map(match => ({ specifier: match[2]!, typeOnly: Boolean(match[1]) }))
}

describe('page templates', () => {
  it('are the files this test knows about', () => {
    expect(files.sort()).toEqual(Object.keys(ALLOWED).sort())
  })

  for (const file of files) {
    it(`${file} imports only the toolkit entry`, () => {
      const source = readFileSync(new URL(file, directory), 'utf8')
      const imports = importsOf(source)
      expect(imports.length).toBeGreaterThan(0)
      for (const { specifier } of imports) {
        expect(ALLOWED[file], `${file} imports ${specifier}`).toContain(specifier)
      }
      // No dynamic imports or requires around the rule.
      expect(source).not.toMatch(/\bimport\(|\brequire\(/)
    })
  }

  it('keeps the fixture free of components', () => {
    const source = readFileSync(new URL('pages.fixture.ts', directory), 'utf8')
    expect(importsOf(source).every(entry => entry.typeOnly)).toBe(true)
  })

  it('covers the eight reference pages', () => {
    const source = readFileSync(new URL('Pages.stories.tsx', directory), 'utf8')
    const names = [...source.matchAll(/^\s+name: '([^']+)',$/gm)].map(match => match[1])
    expect(names).toEqual(['Object explorer', 'Object view', 'Object type', 'Schema graph', 'Files', 'Operations', 'Storage', 'Connect'])
  })
})
