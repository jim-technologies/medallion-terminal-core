import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CommandPalette as ToolkitCommandPalette,
  type CommandGroup,
  type CommandItem,
} from '../components/CommandPalette'
import { Kbd } from '../components/Display'
import { useDashboard } from './DashboardContext'
import { saveView, loadView, listViews, deleteView } from './savedViews'

const RANGE_PRESETS = new Set(['1d', '5d', '1m', '3m', '1y', 'max'])
const SUGGEST_DEBOUNCE_MS = 150
const MAX_SUGGESTIONS = 8

export interface PaletteSuggestion {
  // Primary line — what the user reads to identify the choice.
  label: string
  // Optional secondary line (e.g. full name, exchange tag).
  hint?: string
  // Ctx values merged on click. Multiple pairs allowed so a single
  // suggestion can retarget more than one dimension.
  ctx: Record<string, string>
}

export type PaletteSuggest = (query: string) => Promise<PaletteSuggestion[]> | PaletteSuggestion[]

type Cmd =
  | { kind: 'set';    key: string; value: string }
  | { kind: 'set_many'; pairs: Array<[string, string]> }
  | { kind: 'save';   name: string }
  | { kind: 'load';   name: string }
  | { kind: 'delete'; name: string }
  | { kind: 'noop' }

// Parse a command. Slash commands (`/save name`, `/load name`,
// `/delete name`) are recognised first; multi-pair "k1:v1 k2:v2"
// next; then the single-pair / bare-value fallbacks.
function parseCommand(input: string, dominantKey: string): Cmd | null {
  const s = input.trim()
  if (!s) return null
  if (s.startsWith('/')) {
    const [verb, ...rest] = s.slice(1).split(/\s+/)
    const name = rest.join(' ').trim()
    switch (verb.toLowerCase()) {
      case 'save': return name ? { kind: 'save', name } : null
      case 'load': case 'open': return name ? { kind: 'load', name } : null
      case 'delete': case 'rm': return name ? { kind: 'delete', name } : null
      default: return { kind: 'noop' }
    }
  }
  // Multi-pair: every whitespace-separated token must be "key:value" or
  // "key=value" (no internal spaces). Falls through to single-pair
  // parsing if any token doesn't match, so "symbol BTC" still works.
  const tokens = s.split(/\s+/)
  if (tokens.length > 1) {
    const pairs: Array<[string, string]> = []
    let ok = true
    for (const t of tokens) {
      const tm = t.match(/^([a-zA-Z_][a-zA-Z0-9_]*)[:=](.+)$/)
      if (!tm) { ok = false; break }
      pairs.push([tm[1].toLowerCase(), tm[2]])
    }
    if (ok && pairs.length > 1) return { kind: 'set_many', pairs }
  }
  const m = s.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*[:=]\s*(.+)$/)
  if (m) return { kind: 'set', key: m[1].toLowerCase(), value: m[2].trim() }
  const space = s.indexOf(' ')
  if (space > 0) return { kind: 'set', key: s.slice(0, space).toLowerCase(), value: s.slice(space + 1).trim() }
  if (RANGE_PRESETS.has(s.toLowerCase())) return { kind: 'set', key: 'range', value: s.toLowerCase() }
  return { kind: 'set', key: dominantKey, value: s }
}

/**
 * The Dashboard's Ctrl/⌘ K palette on the toolkit `CommandPalette`: typing
 * a command and pressing Enter applies it (`symbol:BTC range:1d`,
 * `/save name`, `/load name`, `/delete name`); arrow keys pick a backend
 * suggestion, a saved view or a recent command instead.
 */
export function DashboardCommandPalette({ suggest }: { suggest?: PaletteSuggest } = {}) {
  const { ctx, setCtx, toast } = useDashboard()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<PaletteSuggestion[]>([])
  // Generation token so a slow earlier fetch doesn't overwrite a fast
  // later one with stale results.
  const suggestGen = useRef(0)

  useEffect(() => {
    if (!open) {
      setInput('')
      setSuggestions([])
    }
  }, [open])

  // Debounced suggestion fetch. Token-guarded to avoid out-of-order
  // results clobbering the latest. Cleared when the input is empty.
  useEffect(() => {
    if (!suggest || !open) return
    const q = input.trim()
    if (!q) { setSuggestions([]); return }
    const gen = ++suggestGen.current
    const handle = setTimeout(async () => {
      try {
        const results = await suggest(q)
        if (gen !== suggestGen.current) return
        setSuggestions(results.slice(0, MAX_SUGGESTIONS))
      } catch {
        if (gen === suggestGen.current) setSuggestions([])
      }
    }, SUGGEST_DEBOUNCE_MS)
    return () => clearTimeout(handle)
  }, [input, open, suggest])

  const dominantKey = useMemo(() => Object.keys(ctx)[0] ?? 'symbol', [ctx])
  // listViews() walks the entire localStorage keyspace; only re-scan when
  // the palette opens or after a /save or /delete (both push history).
  const views = useMemo(() => (open ? listViews() : []), [open, history])

  const apply = (command: string) => {
    const parsed = parseCommand(command, dominantKey)
    if (!parsed || parsed.kind === 'noop') return
    if (parsed.kind === 'save') {
      saveView(parsed.name, ctx)
      toast(`Saved "${parsed.name}"`, 'ok')
    } else if (parsed.kind === 'load') {
      const view = loadView(parsed.name)
      if (!view) {
        toast(`No view named "${parsed.name}"`, 'warn')
      } else {
        for (const [k, v] of Object.entries(view)) setCtx(k, v)
        toast(`Loaded "${parsed.name}"`, 'ok')
      }
    } else if (parsed.kind === 'delete') {
      deleteView(parsed.name)
      toast(`Deleted "${parsed.name}"`, 'ok')
    } else if (parsed.kind === 'set') {
      setCtx(parsed.key, parsed.value)
    } else if (parsed.kind === 'set_many') {
      for (const [k, v] of parsed.pairs) setCtx(k, v)
    }
    setHistory(h => [command, ...h.filter(x => x !== command)].slice(0, 5))
  }

  const groups = useMemo<CommandGroup[]>(() => [
    {
      id: 'suggestions',
      label: 'Suggestions',
      items: suggestions.map((s, i) => ({
        id: `suggestion:${i}`,
        label: s.label,
        description: s.hint ?? Object.entries(s.ctx).map(([k, v]) => `${k}=${v}`).join(' · '),
      })),
    },
    { id: 'views', label: 'Saved views', items: views.map((v: string) => ({ id: `view:${v}`, label: v, description: `/load ${v}` })) },
    { id: 'recent', label: 'Recent', items: history.map(h => ({ id: `recent:${h}`, label: h })) },
  ], [suggestions, views, history])

  const select = (item: CommandItem) => {
    const [kind, ...rest] = item.id.split(':')
    const value = rest.join(':')
    if (kind === 'suggestion') {
      const s = suggestions[Number(value)]
      if (s) for (const [k, v] of Object.entries(s.ctx)) setCtx(k, v)
    } else if (kind === 'view') {
      apply(`/load ${value}`)
    } else if (kind === 'recent') {
      apply(value)
    }
  }

  const context = Object.entries(ctx)
  return (
    <ToolkitCommandPalette
      open={open}
      onOpenChange={setOpen}
      query={input}
      onQueryChange={setInput}
      groups={groups}
      onSelect={select}
      onSubmit={apply}
      autoHighlight={false}
      label="Dashboard commands"
      placeholder="symbol:BTC range:1d  ·  /save view  ·  /load view"
      footer={(
        <>
          <span><Kbd>↵</Kbd> apply</span>
          <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> pick</span>
          <span><Kbd>Esc</Kbd> close</span>
          {context.length > 0 && (
            <span className="mtc-command-context">
              {context.map(([k, v]) => `${k}=${v}`).join(' · ')}
            </span>
          )}
        </>
      )}
    />
  )
}

// Exposed for testing the parser without rendering.
export const _parseCommand = parseCommand
