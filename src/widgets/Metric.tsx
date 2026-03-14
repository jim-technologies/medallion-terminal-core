import type { WidgetProps } from '../types/template'

export function Metric({ data }: WidgetProps) {
  const { value, delta, unit, label } = normalize(data)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <div className="text-3xl font-bold text-white tabular-nums">
        {formatValue(value)}
        {unit && <span className="text-base font-normal text-zinc-400 ml-1">{unit}</span>}
      </div>
      {delta != null && (
        <div className={`text-sm font-medium ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {delta >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(delta).toFixed(2)}%
        </div>
      )}
      {label && <div className="text-xs text-zinc-500">{label}</div>}
    </div>
  )
}

function normalize(data: unknown): { value: number; delta?: number; unit?: string; label?: string } {
  if (typeof data === 'number') return { value: data }
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    return {
      value: Number(d.value ?? 0),
      delta: d.delta != null ? Number(d.delta) : undefined,
      unit: d.unit != null ? String(d.unit) : undefined,
      label: d.label != null ? String(d.label) : undefined,
    }
  }
  return { value: 0 }
}

function formatValue(n: number): string {
  if (Math.abs(n) >= 1e12) return (n / 1e12).toFixed(2) + 'T'
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (Math.abs(n) >= 1e3) return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 })
}
