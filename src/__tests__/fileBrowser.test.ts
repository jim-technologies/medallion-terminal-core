import { describe, it, expect } from 'vitest'
import {
  isFolder,
  normalizeEntries,
  sortEntries,
  splitPath,
  humanSize,
} from '../widgets/fileBrowserHelpers'

describe('FileBrowser helpers', () => {
  describe('isFolder', () => {
    it.each([
      ['folder', true],
      ['FOLDER', true],
      ['KIND_FOLDER', true],
      ['kind_folder', true],
      ['file', false],
      ['FILE', false],
      ['KIND_FILE', false],
      ['', false],
    ])('kind %q → %p', (kind, want) => {
      expect(isFolder({ kind })).toBe(want)
    })
  })

  describe('normalizeEntries', () => {
    it('returns [] for null/undefined', () => {
      expect(normalizeEntries(null)).toEqual([])
      expect(normalizeEntries(undefined)).toEqual([])
    })

    it('returns array as-is', () => {
      const e = [{ kind: 'file', name: 'a.txt' }]
      expect(normalizeEntries(e)).toEqual(e)
    })

    it('unwraps { entries: [...] }', () => {
      const e = [{ kind: 'folder', name: 'docs' }]
      expect(normalizeEntries({ entries: e })).toEqual(e)
    })

    it('returns [] for unknown shapes', () => {
      expect(normalizeEntries({ stuff: [] })).toEqual([])
      expect(normalizeEntries(42)).toEqual([])
    })
  })

  describe('sortEntries', () => {
    it('folders first, then files; alphabetical within each', () => {
      const result = sortEntries([
        { kind: 'file', name: 'zebra.txt' },
        { kind: 'folder', name: 'docs' },
        { kind: 'file', name: 'apple.txt' },
        { kind: 'folder', name: 'archive' },
      ])
      expect(result.map((e) => e.name)).toEqual(['archive', 'docs', 'apple.txt', 'zebra.txt'])
    })

    it('does not mutate input', () => {
      const input = [{ kind: 'file', name: 'b' }, { kind: 'folder', name: 'a' }]
      const before = JSON.stringify(input)
      sortEntries(input)
      expect(JSON.stringify(input)).toBe(before)
    })
  })

  describe('splitPath', () => {
    it.each([
      ['', []],
      ['photos', ['photos']],
      ['photos/2024', ['photos', '2024']],
      ['/photos/2024/', ['photos', '2024']],
      ['a//b', ['a', 'b']],
    ])('%q → %j', (input, want) => {
      expect(splitPath(input)).toEqual(want)
    })
  })

  describe('humanSize', () => {
    it.each([
      [0, '0 B'],
      [512, '512 B'],
      [1024, '1.0 KB'],
      [2_300_000, '2.2 MB'],
      [5_000_000_000, '4.7 GB'],
    ])('%i → %q', (input, want) => {
      expect(humanSize(input)).toBe(want)
    })
  })
})
