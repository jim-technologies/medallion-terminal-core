import { useEffect, useState } from 'react'

const SHORTCUTS: Array<{ keys: string; description: string }> = [
  { keys: '⌘ K / Ctrl K', description: 'Open command palette (set ctx, save/load views)' },
  { keys: '↑ ↓',          description: 'In palette: cycle recent commands' },
  { keys: '↵',            description: 'In palette: apply current input' },
  { keys: 'Esc',          description: 'Close palette / fullscreen / overlays' },
  { keys: '⌘ 1 — 9',      description: 'In multi-tab: jump to tab N' },
  { keys: '?',            description: 'Show this shortcuts cheat sheet' },
  { keys: '/save <name>', description: 'In palette: save current ctx as a named view' },
  { keys: '/load <name>', description: 'In palette: restore a saved view' },
  { keys: '/delete <name>', description: 'In palette: delete a saved view' },
]

// Press `?` (anywhere outside an input) to bring up the shortcuts cheat
// sheet. `Esc` or click outside dismisses. Mounted once at the
// Dashboard root so it's available everywhere.
export function ShortcutsOverlay() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't intercept `?` typed into a real input/textarea.
      const tag = (e.target as HTMLElement | null)?.tagName
      const inEditable = tag === 'INPUT' || tag === 'TEXTAREA' ||
        (e.target as HTMLElement | null)?.isContentEditable
      if (e.key === '?' && !inEditable) {
        e.preventDefault()
        setOpen(o => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden motion-safe:animate-[fadeIn_180ms_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-100">Keyboard shortcuts</h3>
          <span className="text-[10px] text-zinc-500">esc to close</span>
        </div>
        <div className="px-4 py-3 flex flex-col gap-1.5">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="flex items-baseline gap-3">
              <kbd className="text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0">
                {s.keys}
              </kbd>
              <span className="text-xs text-zinc-400">{s.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
