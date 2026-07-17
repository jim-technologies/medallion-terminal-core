import { useMemo } from 'react'
import type { WidgetProps } from '../types/template'
import { Empty } from './states'

// Pretty-printed JSON view of whatever the source returns. Use for raw
// data inspection: backend response debugging, AI-emitted templates,
// catalog details. Generic enough that the source can be anything that
// fetches.
export function Json({ data }: WidgetProps) {
  const pretty = useMemo(() => {
    if (data === undefined || data === null) return ''
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }, [data])

  if (!pretty) {
    return <Empty>No data</Empty>
  }

  return (
    <pre className="text-[11px] font-mono text-zinc-300 overflow-auto h-full whitespace-pre leading-relaxed">
      {colorize(pretty)}
    </pre>
  )
}

// Lightweight syntax tinting via regex pass. Keys quoted-string on the
// left of a colon, primitives on the right. Cheap; runs once per render
// and the output's already memoized.
function colorize(s: string) {
  const parts: Array<{ text: string; color?: string }> = []
  // Keys: "key": followed by anything
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s)) != null) {
    if (m.index > last) parts.push({ text: s.slice(last, m.index) })
    if (m[1]) {
      parts.push({ text: m[1], color: m[2] ? 'var(--mtc-code-key)' : 'var(--mtc-code-string)' })
      if (m[2]) parts.push({ text: m[2] })
    } else if (m[3]) {
      parts.push({ text: m[3], color: 'var(--mtc-code-literal)' })
    } else if (m[4]) {
      parts.push({ text: m[4], color: 'var(--mtc-code-number)' })
    }
    last = re.lastIndex
  }
  if (last < s.length) parts.push({ text: s.slice(last) })
  return parts.map((p, i) => p.color
    ? <span key={i} style={{ color: p.color }}>{p.text}</span>
    : p.text,
  )
}
