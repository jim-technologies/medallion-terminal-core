import { describe, it, expect } from 'vitest'
import {
  isFolder,
  normalizeEntries,
  sortEntries,
  splitPath,
  humanSize,
  previewKind,
  buildMediaUrl,
} from '../widgets/fileBrowserHelpers'
import { prettyJSON, parseCSV } from '../widgets/fileBrowserDecoders'

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

    it('unwraps TablePayload { rows: [...] }', () => {
      const e = [{ kind: 'file', name: 'a.txt', object_id: 'A' }]
      expect(normalizeEntries({ rows: e })).toEqual(e)
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

  describe('previewKind', () => {
    it.each([
      ['video/mp4', undefined, 'video'],
      ['video/webm', undefined, 'video'],
      ['VIDEO/MP4', undefined, 'video'],
      ['audio/mpeg', undefined, 'audio'],
      ['image/jpeg', undefined, 'image'],
      ['image/png', undefined, 'image'],
      ['application/pdf', undefined, 'pdf'],
      ['application/pdf; charset=binary', undefined, 'pdf'],
      ['image/heic', undefined, 'heic'],
      ['image/heif', undefined, 'heic'],
      ['video/x-matroska', undefined, 'mkv'],
      ['application/x-matroska', undefined, 'mkv'],
      ['application/zip', undefined, null],
      ['', undefined, null],
      [undefined, undefined, null],
      // Extension-based fallback for files uploaded as octet-stream.
      ['application/octet-stream', 'iphone.heic', 'heic'],
      ['application/octet-stream', 'CLIP.HEIF', 'heic'],
      ['application/octet-stream', 'movie.mkv', 'mkv'],
      ['application/octet-stream', 'doc.pdf', 'pdf'],
      // Content-type wins over extension when both are present and useful.
      ['video/mp4', 'unknown.mkv', 'mkv'], // mkv extension still triggers — extension hint is the conservative path
      // Filename without recognized extension → unchanged classification.
      ['application/octet-stream', 'README', null],
      // Text-family kinds.
      ['application/json', undefined, 'json'],
      ['text/json', undefined, 'json'],
      ['application/octet-stream', 'data.json', 'json'],
      ['application/yaml', undefined, 'yaml'],
      ['application/x-yaml', undefined, 'yaml'],
      ['application/octet-stream', 'config.yaml', 'yaml'],
      ['application/octet-stream', 'config.yml', 'yaml'],
      ['text/markdown', undefined, 'markdown'],
      ['application/octet-stream', 'README.md', 'markdown'],
      ['text/csv', undefined, 'csv'],
      ['application/octet-stream', 'export.csv', 'csv'],
      ['text/plain', undefined, 'text'],
      ['application/octet-stream', 'notes.txt', 'text'],
      ['application/octet-stream', 'app.log', 'text'],
    ])('%q + %q → %s', (ct, name, want) => {
      expect(previewKind(ct as string | undefined, name)).toBe(want as ReturnType<typeof previewKind>)
    })
  })

  describe('buildMediaUrl', () => {
    it('substitutes namespace and object_id', () => {
      expect(buildMediaUrl('/media/{namespace}/{object_id}', 'photos', 'OID')).toBe('/media/photos/OID')
    })
    it('url-encodes both', () => {
      expect(buildMediaUrl('/media/{namespace}/{object_id}', 'my ns', 'a/b')).toBe('/media/my%20ns/a%2Fb')
    })
  })

  describe('prettyJSON', () => {
    it('indents valid JSON', () => {
      expect(prettyJSON('{"a":1,"b":[2,3]}')).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}')
    })
    it('returns input unchanged on parse failure', () => {
      expect(prettyJSON('not json {')).toBe('not json {')
    })
  })

  describe('parseCSV', () => {
    it('parses a simple CSV', () => {
      expect(parseCSV('a,b,c\n1,2,3\n')).toEqual([['a', 'b', 'c'], ['1', '2', '3']])
    })
    it('handles quoted fields with commas and CRLF', () => {
      expect(parseCSV('name,note\r\n"smith, john","hello, world"\r\n'))
        .toEqual([['name', 'note'], ['smith, john', 'hello, world']])
    })
    it('handles escaped quotes', () => {
      expect(parseCSV('quote\n"she said ""hi"""\n')).toEqual([['quote'], ['she said "hi"']])
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
