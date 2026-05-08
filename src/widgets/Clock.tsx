import { useEffect, useState } from 'react'
import type { WidgetProps } from '../types/template'

interface ClockOptions {
  zones?: string[]   // e.g. ["America/New_York", "Europe/London", "Asia/Tokyo"]
  format?: '24h' | '12h'  // default 24h
}

const DEFAULT_ZONES = ['America/New_York', 'Europe/London', 'Asia/Singapore']

// Multi-timezone clock. Useful for traders who need to know London open,
// NY open, Tokyo close at a glance. Uses Intl.DateTimeFormat — no deps.
export function Clock({ options }: WidgetProps) {
  const opts = (options ?? {}) as ClockOptions
  const zones = opts.zones?.length ? opts.zones : DEFAULT_ZONES
  const hour12 = opts.format === '12h'
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-full flex items-center justify-around gap-3">
      {zones.map(zone => {
        const time = formatTime(now, zone, hour12)
        const offset = offsetLabel(now, zone)
        const label = zoneLabel(zone)
        const session = sessionFor(zone, now)
        return (
          <div key={zone} className="flex flex-col items-center">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <span>{label}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${session}`} />
            </div>
            <div className="text-base font-semibold text-zinc-100 tabular-nums">{time}</div>
            <div className="text-[10px] text-zinc-600 tabular-nums">{offset}</div>
          </div>
        )
      })}
    </div>
  )
}

// "America/New_York" → "NY"; falls back to last segment when unknown.
const ZONE_LABELS: Record<string, string> = {
  'America/New_York':    'NY',
  'America/Los_Angeles': 'LA',
  'America/Chicago':     'CHI',
  'Europe/London':       'LDN',
  'Europe/Frankfurt':    'FRA',
  'Asia/Tokyo':          'TYO',
  'Asia/Singapore':      'SGP',
  'Asia/Hong_Kong':      'HKG',
  'Asia/Shanghai':       'SHA',
  'Australia/Sydney':    'SYD',
  'UTC':                 'UTC',
}
function zoneLabel(zone: string): string {
  return ZONE_LABELS[zone] ?? zone.split('/').pop() ?? zone
}

function formatTime(d: Date, zone: string, hour12: boolean): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12,
    }).format(d)
  } catch {
    return '—'
  }
}

// "GMT-04:00" or similar.
function offsetLabel(d: Date, zone: string): string {
  try {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' })
    const parts = f.formatToParts(d)
    const tz = parts.find(p => p.type === 'timeZoneName')?.value
    return tz ?? ''
  } catch {
    return ''
  }
}

// Rough trading session indicator. Green during local 9–17, amber near open/close,
// zinc otherwise. Doesn't try to be precise — just a glanceable hint.
function sessionFor(zone: string, d: Date): string {
  try {
    const hourStr = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: '2-digit', hour12: false }).format(d)
    const hour = Number(hourStr)
    if (!Number.isFinite(hour)) return 'bg-zinc-700'
    if (hour >= 9 && hour < 17) return 'bg-emerald-500'
    if (hour === 8 || hour === 17) return 'bg-amber-500'
    return 'bg-zinc-700'
  } catch {
    return 'bg-zinc-700'
  }
}
