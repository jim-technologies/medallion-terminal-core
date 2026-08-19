import type { CSSProperties, SVGProps } from 'react'

// Neutral helpers shared by product-specific operational showcases.
export type OperationalShowcaseIconName =
  | 'activity'
  | 'apps'
  | 'arrow-down'
  | 'arrow-up'
  | 'bank'
  | 'bell'
  | 'bolt'
  | 'bookmark'
  | 'box'
  | 'calendar'
  | 'camera'
  | 'cart'
  | 'chart'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'clock'
  | 'close'
  | 'code'
  | 'database'
  | 'document'
  | 'download'
  | 'filter'
  | 'flag'
  | 'globe'
  | 'graph'
  | 'help'
  | 'heart'
  | 'home'
  | 'inbox'
  | 'inventory'
  | 'layers'
  | 'link'
  | 'location'
  | 'mail'
  | 'menu'
  | 'message'
  | 'money'
  | 'more'
  | 'package'
  | 'people'
  | 'phone'
  | 'play'
  | 'plus'
  | 'refresh'
  | 'return'
  | 'search'
  | 'send'
  | 'settings'
  | 'shield'
  | 'sparkles'
  | 'tag'
  | 'ticket'
  | 'timeline'
  | 'truck'
  | 'user'
  | 'video'
  | 'warning'

export interface OperationalShowcaseIconProps extends SVGProps<SVGSVGElement> {
  name: OperationalShowcaseIconName
  size?: number
}

export function OperationalShowcaseIcon({
  name,
  size = 18,
  ...props
}: OperationalShowcaseIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'activity':
      return <svg {...common} {...props}><path d="M3 12h4l2.2-6 4.1 12 2.2-6H21" /></svg>
    case 'apps':
      return (
        <svg {...common} {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    case 'arrow-down':
      return <svg {...common} {...props}><path d="M12 4v16m-6-6 6 6 6-6" /></svg>
    case 'arrow-up':
      return <svg {...common} {...props}><path d="M12 20V4m-6 6 6-6 6 6" /></svg>
    case 'bank':
      return <svg {...common} {...props}><path d="m3 9 9-5 9 5M5 10v7m4-7v7m6-7v7m4-7v7M3 20h18" /></svg>
    case 'bell':
      return <svg {...common} {...props}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
    case 'bolt':
      return <svg {...common} {...props}><path d="m13 2-9 12h8l-1 8 9-12h-8z" /></svg>
    case 'bookmark':
      return <svg {...common} {...props}><path d="M6 4h12v17l-6-4-6 4z" /></svg>
    case 'box':
      return <svg {...common} {...props}><path d="m4 7 8-4 8 4-8 4zM4 7v10l8 4 8-4V7M12 11v10" /></svg>
    case 'calendar':
      return <svg {...common} {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
    case 'camera':
      return <svg {...common} {...props}><path d="M4 7h4l1.5-2h5L16 7h4v12H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
    case 'cart':
      return <svg {...common} {...props}><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 8H6M10 20h.01M17 20h.01" /></svg>
    case 'chart':
      return <svg {...common} {...props}><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" /></svg>
    case 'check':
      return <svg {...common} {...props}><path d="m5 12 4 4L19 6" /></svg>
    case 'chevron-down':
      return <svg {...common} {...props}><path d="m6 9 6 6 6-6" /></svg>
    case 'chevron-left':
      return <svg {...common} {...props}><path d="m15 18-6-6 6-6" /></svg>
    case 'chevron-right':
      return <svg {...common} {...props}><path d="m9 18 6-6-6-6" /></svg>
    case 'clock':
      return <svg {...common} {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
    case 'close':
      return <svg {...common} {...props}><path d="M6 6l12 12M18 6 6 18" /></svg>
    case 'code':
      return <svg {...common} {...props}><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-10-2 12" /></svg>
    case 'database':
      return <svg {...common} {...props}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" /></svg>
    case 'document':
      return <svg {...common} {...props}><path d="M6 3h8l4 4v14H6zM14 3v5h5M9 13h6m-6 4h6" /></svg>
    case 'download':
      return <svg {...common} {...props}><path d="M12 3v12m-5-5 5 5 5-5M4 20h16" /></svg>
    case 'filter':
      return <svg {...common} {...props}><path d="M4 5h16l-6 7v6l-4 2v-8z" /></svg>
    case 'flag':
      return <svg {...common} {...props}><path d="M5 21V4m0 1h11l-2 4 2 4H5" /></svg>
    case 'globe':
      return <svg {...common} {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
    case 'graph':
      return <svg {...common} {...props}><circle cx="5" cy="12" r="2.5" /><circle cx="18" cy="5" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m7.2 10.8 8.6-4.6M7.2 13.2l8.6 4.6" /></svg>
    case 'help':
      return <svg {...common} {...props}><circle cx="12" cy="12" r="9" /><path d="M9.8 9a2.3 2.3 0 1 1 3.4 2c-.8.5-1.2 1-1.2 2M12 17h.01" /></svg>
    case 'heart':
      return <svg {...common} {...props}><path d="M20.8 5.8a5.4 5.4 0 0 0-7.7 0L12 6.9l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 22l8.8-8.5a5.4 5.4 0 0 0 0-7.7Z" /></svg>
    case 'home':
      return <svg {...common} {...props}><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z" /></svg>
    case 'inbox':
      return <svg {...common} {...props}><path d="M4 4h16v16H4zM4 14h5l2 3h2l2-3h5" /></svg>
    case 'inventory':
      return <svg {...common} {...props}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 4v5m8-5v5M8 14h8" /></svg>
    case 'layers':
      return <svg {...common} {...props}><path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" /></svg>
    case 'link':
      return <svg {...common} {...props}><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1" /></svg>
    case 'location':
      return <svg {...common} {...props}><path d="M12 21s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12Z" /><circle cx="12" cy="9" r="2.3" /></svg>
    case 'mail':
      return <svg {...common} {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
    case 'menu':
      return <svg {...common} {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
    case 'message':
      return <svg {...common} {...props}><path d="M4 4h16v13H8l-4 4z" /><path d="M8 9h8m-8 4h5" /></svg>
    case 'money':
      return <svg {...common} {...props}><circle cx="12" cy="12" r="9" /><path d="M15 8.5c-.7-.8-1.8-1.2-3-1.2-1.7 0-3 1-3 2.3 0 3.6 6 1.4 6 5 0 1.3-1.3 2.3-3 2.3-1.4 0-2.6-.5-3.3-1.4M12 5v14" /></svg>
    case 'more':
      return <svg {...common} {...props}><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></svg>
    case 'package':
      return <svg {...common} {...props}><path d="M4 7h16v14H4zM4 7l3-4h10l3 4M9 11h6" /></svg>
    case 'people':
      return <svg {...common} {...props}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 21a6 6 0 0 1 12 0m-1.5-5a5 5 0 0 1 7.5 4.4" /></svg>
    case 'phone':
      return <svg {...common} {...props}><path d="M5 4h4l2 5-3 2a14 14 0 0 0 5 5l2-3 5 2v4c0 1-1 2-2 2C10 21 3 14 3 6c0-1 1-2 2-2Z" /></svg>
    case 'play':
      return <svg {...common} {...props}><circle cx="12" cy="12" r="9" /><path d="m10 8 6 4-6 4z" /></svg>
    case 'plus':
      return <svg {...common} {...props}><path d="M12 5v14M5 12h14" /></svg>
    case 'refresh':
      return <svg {...common} {...props}><path d="M20 7v5h-5M4 17v-5h5M18.5 12a7 7 0 0 0-12-4.8L4 10m16 4-2.5 2.8A7 7 0 0 1 5.5 12" /></svg>
    case 'return':
      return <svg {...common} {...props}><path d="m9 8-5 5 5 5M4 13h9a6 6 0 0 0 6-6V5" /></svg>
    case 'search':
      return <svg {...common} {...props}><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></svg>
    case 'send':
      return <svg {...common} {...props}><path d="m3 11 18-8-7 18-3-7zM11 14l4-4" /></svg>
    case 'settings':
      return <svg {...common} {...props}><circle cx="12" cy="12" r="3" /><path d="M19 13.5v-3l-2-.7-.7-1.7.9-1.9-2.1-2.1-1.9.9-1.7-.7L10.5 2h-3l-.7 2-1.7.7-1.9-.9-2.1 2.1.9 1.9-.7 1.7L0 10.5v3l2 .7.7 1.7-.9 1.9 2.1 2.1 1.9-.9 1.7.7.7 2.3h3l.7-2 1.7-.7 1.9.9 2.1-2.1-.9-1.9.7-1.7z" transform="translate(2)" /></svg>
    case 'shield':
      return <svg {...common} {...props}><path d="M12 3 4 6v6c0 5 3.4 8 8 10 4.6-2 8-5 8-10V6z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>
    case 'sparkles':
      return <svg {...common} {...props}><path d="m12 2 1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>
    case 'tag':
      return <svg {...common} {...props}><path d="M3 12V4h8l10 10-8 8z" /><circle cx="8" cy="8" r="1.5" /></svg>
    case 'ticket':
      return <svg {...common} {...props}><path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4zM12 8v8" /></svg>
    case 'timeline':
      return <svg {...common} {...props}><path d="M7 4v16M7 7h7m-7 5h10M7 17h5" /><circle cx="7" cy="7" r="2" fill="currentColor" /><circle cx="7" cy="12" r="2" fill="currentColor" /><circle cx="7" cy="17" r="2" fill="currentColor" /></svg>
    case 'truck':
      return <svg {...common} {...props}><path d="M3 6h11v11H3zM14 10h4l3 4v3h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></svg>
    case 'user':
      return <svg {...common} {...props}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
    case 'video':
      return <svg {...common} {...props}><rect x="3" y="5" width="13" height="14" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></svg>
    case 'warning':
      return <svg {...common} {...props}><path d="M12 3 2.5 20h19zM12 9v5m0 3h.01" /></svg>
  }
}

export function operationalShowcaseInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
}

export function OperationalShowcaseAvatar({
  name,
  color = '#4169a1',
  size = 28,
}: {
  name: string
  color?: string
  size?: number
}) {
  const style: CSSProperties = {
    '--ready-avatar-color': color,
    width: size,
    height: size,
  } as CSSProperties
  return (
    <span className="ready-avatar" style={style} title={name} aria-label={name}>
      {operationalShowcaseInitials(name)}
    </span>
  )
}

export function formatOperationalCurrency(
  value: number,
  options: { compact?: boolean; currency?: string; cents?: boolean } = {},
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: options.currency ?? 'USD',
    notation: options.compact ? 'compact' : 'standard',
    maximumFractionDigits: options.cents ? 2 : options.compact ? 1 : 0,
    minimumFractionDigits: options.cents ? 2 : 0,
  }).format(value)
}

export function formatOperationalPercent(value: number, digits = 1): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: digits,
  }).format(value)
}

export function OperationalShowcaseSparkline({
  values,
  color = 'currentColor',
  height = 48,
}: {
  values: readonly number[]
  color?: string
  height?: number
}) {
  const width = 180
  const minimum = values.length > 0 ? Math.min(...values) : 0
  const maximum = values.length > 0 ? Math.max(...values) : 1
  const range = Math.max(maximum - minimum, 1)
  const points = values
    .map((value, index) => {
      const x = values.length <= 1 ? 0 : index * width / (values.length - 1)
      const y = height - 4 - ((value - minimum) / range) * (height - 8)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      className="ready-sparkline"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
