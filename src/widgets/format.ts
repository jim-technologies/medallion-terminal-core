// Shared number / time formatters used across multiple widgets.
//
// Three abbreviation styles, used in three contexts:
//
//   abbreviateAxis(n)   "1.2K / 3.4M / 5.6B" — 1dp universally
//                       For chart axis ticks (Timeseries, AreaChart, BarChart).
//
//   formatCompact(n)    "<1 → 2dp, <1000 → 1dp, else integer locale"
//                       For chart cells / heatmap / histogram bin labels.
//
//   formatStat(n)       "T/B/M with 2dp + locale fallback"
//                       For metric cards and stat strips (the big numbers).
//
// `formatTimestamp(ts)` is the standard "Mar 5" tick formatter.
//
// Step- or range-aware formatters (Slider, Gauge), domain-specific
// formatters (PairedGrid, Clock), and arbitrary-cell formatters
// (DataTable.formatCell) intentionally stay inline in their widgets.

export function abbreviateAxis(n: unknown): string {
  if (typeof n !== 'number') return String(n)
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toFixed(Number.isInteger(n) ? 0 : 2)
}

export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
  if (Math.abs(n) < 1) return n.toFixed(2)
  return n.toFixed(1)
}

export function formatStat(n: number): string {
  if (Math.abs(n) >= 1e12) return (n / 1e12).toFixed(2) + 'T'
  if (Math.abs(n) >= 1e9)  return (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6)  return (n / 1e6).toFixed(2) + 'M'
  if (Math.abs(n) >= 1e3)  return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 })
}

export function formatTimestamp(ts: unknown): string {
  if (ts == null) return ''
  try {
    const d = new Date(ts as string | number)
    if (isNaN(d.getTime())) return String(ts)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return String(ts)
  }
}

// =================================================================
// Finance-specific formatters. Centralized so dashboards present
// percent, currency, and bps numbers consistently across widgets.
// =================================================================

// Percent. Defaults treat the input as a fraction (0.0218 → "+2.18%")
// since that's what the proto uses for delta. Pass `as = 'percent'`
// when the input is already a percentage (e.g. 2.18 → "+2.18%").
export function formatPercent(
  n: number,
  options: { decimals?: number; as?: 'fraction' | 'percent'; signed?: boolean } = {},
): string {
  const { decimals = 2, as = 'fraction', signed = false } = options
  const pct = as === 'fraction' ? n * 100 : n
  const sign = signed && pct > 0 ? '+' : ''
  return `${sign}${pct.toFixed(decimals)}%`
}

// Currency. Uses Intl.NumberFormat — locale-aware symbols and digit
// grouping. `compact` trims fractional digits for axis-style labels.
export function formatCurrency(
  n: number,
  code: string = 'USD',
  options: { compact?: boolean; decimals?: number } = {},
): string {
  const { compact = false, decimals } = options
  try {
    return n.toLocaleString(undefined, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: decimals ?? (compact ? 0 : Math.abs(n) >= 100 ? 2 : 4),
      minimumFractionDigits: decimals ?? (compact || Math.abs(n) >= 100 ? 0 : 2),
    })
  } catch {
    // Invalid currency code — fall back to numeric formatting.
    return n.toLocaleString()
  }
}

// Basis points. 1 bps = 0.01% = 0.0001 as a fraction. Defaults treat
// input as a fraction; pass `as = 'percent'` if you already have %.
// Useful for fixed-income / FX displays.
export function formatBps(
  n: number,
  options: { signed?: boolean; as?: 'fraction' | 'percent' } = {},
): string {
  const { signed = false, as = 'fraction' } = options
  const bps = (as === 'fraction' ? n * 10_000 : n * 100)
  const sign = signed && bps > 0 ? '+' : ''
  return `${sign}${Math.round(bps)} bps`
}
