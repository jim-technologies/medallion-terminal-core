/**
 * A small, bounded syntax highlighter for the source formats a data platform
 * shows most: JSON, YAML and SQL. It works one line at a time with sticky
 * regular expressions (no backtracking across lines, no state), produces
 * plain text runs for React to render as text nodes, and leaves lines
 * longer than `MAX_HIGHLIGHT_LINE` unhighlighted. Anything it does not
 * recognise stays plain.
 */

/** A token's role; each maps to a `--mtc-code-*` colour. */
export type CodeTokenKind = 'key' | 'string' | 'number' | 'literal' | 'keyword' | 'comment' | 'plain'

export interface CodeToken {
  kind: CodeTokenKind
  text: string
}

/** Languages with highlighting. */
export type CodeLanguage = 'json' | 'yaml' | 'sql'

/** Lines longer than this render plain. */
export const MAX_HIGHLIGHT_LINE = 2_000

const ALIASES: Record<string, CodeLanguage> = {
  json: 'json', jsonc: 'json', json5: 'json', geojson: 'json', jsonl: 'json', ndjson: 'json',
  yaml: 'yaml', yml: 'yaml',
  sql: 'sql', postgresql: 'sql', postgres: 'sql', mysql: 'sql', sqlite: 'sql', duckdb: 'sql', clickhouse: 'sql',
}

/** The highlighter for a language name or file extension, if there is one. */
export function codeLanguage(name?: string): CodeLanguage | null {
  if (!name) return null
  return ALIASES[name.trim().toLowerCase().replace(/^\./, '')] ?? null
}

const SQL_KEYWORDS = new Set([
  'select', 'from', 'where', 'and', 'or', 'not', 'in', 'is', 'as', 'on', 'join', 'left', 'right', 'inner',
  'outer', 'full', 'cross', 'group', 'by', 'order', 'having', 'limit', 'offset', 'union', 'all', 'distinct',
  'insert', 'into', 'values', 'update', 'set', 'delete', 'create', 'table', 'view', 'index', 'drop', 'alter',
  'with', 'case', 'when', 'then', 'else', 'end', 'between', 'like', 'ilike', 'exists', 'asc', 'desc',
  'returning', 'primary', 'key', 'references', 'default', 'over', 'partition', 'window', 'cast', 'interval',
])
const LITERALS = new Set(['true', 'false', 'null'])

type Rule = [kind: CodeTokenKind | ((match: string, rest: string) => CodeTokenKind), pattern: RegExp]

const NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y

const RULES: Record<CodeLanguage, Rule[]> = {
  json: [
    // A string followed by a colon is a key.
    [(_, rest) => (/^\s*:/.test(rest) ? 'key' : 'string'), /"(?:[^"\\]|\\.)*"?/y],
    ['number', NUMBER],
    ['literal', /\b(?:true|false|null)\b/y],
    ['comment', /\/\/.*/y],
  ],
  yaml: [
    ['comment', /#.*/y],
    // A mapping key at the start of the line (after indentation or "- ").
    ['key', /(?<=^\s*(?:-\s+)?)(?!-\s)[^\s#:'"{}[\],&*!|>][^#:]*?(?=\s*:(?:\s|$))/y],
    ['string', /"(?:[^"\\]|\\.)*"?|'(?:[^']|'')*'?/y],
    ['literal', /(?<=[\s:[,-]|^)(?:true|false|null|yes|no|on|off|~)(?=\s*(?:$|[,\]}#]))/iy],
    ['number', /(?<=[\s:[,-]|^)-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?(?=\s*(?:$|[,\]}#]))/y],
  ],
  sql: [
    ['comment', /--.*|\/\*.*?(?:\*\/|$)/y],
    ['string', /'(?:[^']|'')*'?/y],
    ['key', /"(?:[^"]|"")*"?/y],
    ['number', /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y],
    [match => (LITERALS.has(match.toLowerCase()) ? 'literal' : SQL_KEYWORDS.has(match.toLowerCase()) ? 'keyword' : 'plain'), /\b[A-Za-z_][A-Za-z0-9_]*\b/y],
  ],
}

/** One line as tokens; adjacent plain text is merged. */
export function tokenizeLine(line: string, language: CodeLanguage): CodeToken[] {
  if (line.length > MAX_HIGHLIGHT_LINE) return [{ kind: 'plain', text: line }]
  const rules = RULES[language]
  const tokens: CodeToken[] = []
  const push = (kind: CodeTokenKind, text: string) => {
    const last = tokens[tokens.length - 1]
    if (kind === 'plain' && last?.kind === 'plain') last.text += text
    else tokens.push({ kind, text })
  }
  let index = 0
  while (index < line.length) {
    let matched = false
    for (const [kind, pattern] of rules) {
      pattern.lastIndex = index
      const match = pattern.exec(line)
      if (!match || match[0].length === 0) continue
      const text = match[0]
      push(typeof kind === 'function' ? kind(text, line.slice(index + text.length)) : kind, text)
      index += text.length
      matched = true
      break
    }
    if (!matched) {
      // Copy up to the next character a rule could start on.
      const next = line.slice(index + 1).search(/["'#\-/~\w]/)
      const end = next < 0 ? line.length : index + 1 + next
      push('plain', line.slice(index, end))
      index = end
    }
  }
  return tokens
}
