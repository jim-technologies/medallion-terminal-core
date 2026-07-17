import { useEffect, useMemo, useRef, useState } from 'react'
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

export function CommandPalette({ suggest }: { suggest?: PaletteSuggest } = {}) {
  const { ctx, setCtx, toast } = useDashboard()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  // -1 = "live" input, 0..N-1 = navigating into history.
  const [historyCursor, setHistoryCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const [suggestions, setSuggestions] = useState<PaletteSuggestion[]>([])
  // Generation token so a slow earlier fetch doesn't overwrite a fast
  // later one with stale results.
  const suggestGen = useRef(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
    else { setInput(''); setHistoryCursor(-1); setSuggestions([]) }
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

  // Hooks must run unconditionally; bail on render output instead.
  const dominantKey = useMemo(() => Object.keys(ctx)[0] ?? 'symbol', [ctx])
  // listViews() walks the entire localStorage keyspace; only re-scan when
  // the palette opens or after the user issues a /save or /delete (driven
  // by `history` changes since those commands push into history too).
  const views = useMemo(() => (open ? listViews() : []), [open, history])

  if (!open) return null

  const apply = () => {
    const parsed = parseCommand(input, dominantKey)
    if (!parsed || parsed.kind === 'noop') {
      setOpen(false)
      return
    }
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
    setHistory(h => [input, ...h.filter(x => x !== input)].slice(0, 5))
    setOpen(false)
  }

  const navigateHistory = (direction: 1 | -1) => {
    if (history.length === 0) return
    const next = Math.max(-1, Math.min(history.length - 1, historyCursor + direction))
    setHistoryCursor(next)
    setInput(next === -1 ? '' : history[next])
  }

  const applySuggestion = (s: PaletteSuggestion) => {
    for (const [k, v] of Object.entries(s.ctx)) setCtx(k, v)
    setOpen(false)
  }

  return (
    <div
      className="mtc-overlay fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="mtc-popover w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              apply()
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              navigateHistory(1)
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              navigateHistory(-1)
            }
          }}
          placeholder="symbol:BTC range:1d  ·  /save view  ·  /load view"
          className="w-full bg-transparent text-zinc-100 px-4 py-3 text-sm outline-none placeholder-zinc-500 border-b border-zinc-800"
        />
        {suggestions.length > 0 && (
          <div className="border-b border-zinc-800 max-h-72 overflow-auto">
            {suggestions.map((s, i) => (
              <button
                key={`${s.label}-${i}`}
                onClick={() => applySuggestion(s)}
                className="block w-full text-left px-4 py-1.5 text-sm hover:bg-zinc-800/60 group"
              >
                <span className="text-zinc-100">{s.label}</span>
                {s.hint && (
                  <span className="ml-2 text-[10px] text-zinc-500 font-mono">{s.hint}</span>
                )}
                <span className="ml-2 text-[10px] text-zinc-700 font-mono opacity-0 group-hover:opacity-100">
                  {Object.entries(s.ctx).map(([k, v]) => `${k}=${v}`).join(' · ')}
                </span>
              </button>
            ))}
          </div>
        )}
        {Object.entries(ctx).length > 0 && (
          <div className="px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-zinc-600 self-center">current</span>
            {Object.entries(ctx).map(([k, v]) => (
              <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                {k}={v}
              </span>
            ))}
          </div>
        )}
        {views.length > 0 && (
          <div className="px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-zinc-600 self-center">views</span>
            {views.map((v: string) => (
              <button
                key={v}
                onClick={() => setInput(`/load ${v}`)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 font-mono"
                title={`Load view "${v}"`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
        {history.length > 0 && (
          <div className="px-4 py-2 border-b border-zinc-800 flex gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-zinc-600 self-center">recent</span>
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => setInput(h)}
                className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 font-mono"
              >
                {h}
              </button>
            ))}
          </div>
        )}
        <div className="px-4 py-2 text-[10px] text-zinc-600 flex justify-between">
          <span>↵ apply  ·  ↑↓ recall</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}

// Exposed for testing the parser without rendering.
export const _parseCommand = parseCommand
