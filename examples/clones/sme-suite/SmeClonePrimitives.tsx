import type { CSSProperties, SVGProps } from 'react'

export type SmeCloneIconName =
  | 'activity'
  | 'apps'
  | 'arrow-down'
  | 'arrow-up'
  | 'bank'
  | 'bell'
  | 'board'
  | 'calendar'
  | 'chart'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'company'
  | 'contact'
  | 'document'
  | 'filter'
  | 'grid'
  | 'help'
  | 'home'
  | 'invoice'
  | 'mail'
  | 'menu'
  | 'money'
  | 'more'
  | 'note'
  | 'phone'
  | 'plus'
  | 'reports'
  | 'search'
  | 'settings'
  | 'share'
  | 'sort'
  | 'sparkles'
  | 'table'
  | 'task'
  | 'team'
  | 'warning'

export interface SmeCloneIconProps extends SVGProps<SVGSVGElement> {
  name: SmeCloneIconName
  size?: number
}

/**
 * Small, original line-icon set for showcase code. Keeping the icons local
 * avoids pulling a product-specific icon library into the published package.
 */
export function SmeCloneIcon({
  name,
  size = 18,
  ...props
}: SmeCloneIconProps) {
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
      return (
        <svg {...common} {...props}>
          <path d="m3 9 9-5 9 5" />
          <path d="M5 10v7m4-7v7m6-7v7m4-7v7M3 20h18" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...common} {...props}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      )
    case 'board':
      return (
        <svg {...common} {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16m6-16v16" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common} {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common} {...props}>
          <path d="M4 19V9m6 10V5m6 14v-7m4 7H2" />
        </svg>
      )
    case 'check':
      return <svg {...common} {...props}><path d="m5 12 4 4L19 6" /></svg>
    case 'chevron-down':
      return <svg {...common} {...props}><path d="m6 9 6 6 6-6" /></svg>
    case 'chevron-left':
      return <svg {...common} {...props}><path d="m15 18-6-6 6-6" /></svg>
    case 'chevron-right':
      return <svg {...common} {...props}><path d="m9 18 6-6-6-6" /></svg>
    case 'close':
      return <svg {...common} {...props}><path d="M6 6l12 12M18 6 6 18" /></svg>
    case 'company':
      return (
        <svg {...common} {...props}>
          <path d="M4 21V5l10-2v18M4 9h10m-7 4h1m3 0h1m-5 4h1m3 0h1m3 4v-8h5v8" />
        </svg>
      )
    case 'contact':
      return (
        <svg {...common} {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      )
    case 'document':
      return (
        <svg {...common} {...props}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h5M9 13h6m-6 4h6" />
        </svg>
      )
    case 'filter':
      return <svg {...common} {...props}><path d="M4 5h16l-6 7v6l-4 2v-8z" /></svg>
    case 'grid':
      return (
        <svg {...common} {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'help':
      return (
        <svg {...common} {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.8 9a2.3 2.3 0 1 1 3.4 2c-.8.5-1.2 1-1.2 2M12 17h.01" />
        </svg>
      )
    case 'home':
      return <svg {...common} {...props}><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z" /></svg>
    case 'invoice':
      return (
        <svg {...common} {...props}>
          <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
          <path d="M9 8h6m-6 4h6m-6 4h3" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common} {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )
    case 'menu':
      return <svg {...common} {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
    case 'money':
      return (
        <svg {...common} {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 8.5c-.7-.8-1.8-1.2-3-1.2-1.7 0-3 1-3 2.3 0 3.6 6 1.4 6 5 0 1.3-1.3 2.3-3 2.3-1.4 0-2.6-.5-3.3-1.4M12 5v14" />
        </svg>
      )
    case 'more':
      return (
        <svg {...common} {...props}>
          <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'note':
      return (
        <svg {...common} {...props}>
          <path d="M5 3h14v18H5zM8 8h8m-8 4h8m-8 4h5" />
        </svg>
      )
    case 'phone':
      return <svg {...common} {...props}><path d="M5 4h4l2 5-3 2a14 14 0 0 0 5 5l2-3 5 2v4c0 1-1 2-2 2C10 21 3 14 3 6c0-1 1-2 2-2Z" /></svg>
    case 'plus':
      return <svg {...common} {...props}><path d="M12 5v14M5 12h14" /></svg>
    case 'reports':
      return (
        <svg {...common} {...props}>
          <path d="M5 21V10m7 11V3m7 18v-7" />
        </svg>
      )
    case 'search':
      return (
        <svg {...common} {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="m16.5 16.5 4 4" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...common} {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      )
    case 'share':
      return (
        <svg {...common} {...props}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.7 10.7 6.6-4.1m-6.6 6.7 6.6 4.1" />
        </svg>
      )
    case 'sort':
      return <svg {...common} {...props}><path d="M8 6h12M8 12h8M8 18h4M4 4v16m-2-2 2 2 2-2" /></svg>
    case 'sparkles':
      return (
        <svg {...common} {...props}>
          <path d="m12 3 1.2 3.3L16.5 7l-3.3 1.2L12 11.5l-1.2-3.3L7.5 7l3.3-.7zM18.5 13l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8zM6 14l.9 2.6 2.6.9-2.6.9L6 21l-.9-2.6-2.6-.9 2.6-.9z" />
        </svg>
      )
    case 'table':
      return (
        <svg {...common} {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M9 9v11m6-11v11" />
        </svg>
      )
    case 'task':
      return (
        <svg {...common} {...props}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      )
    case 'team':
      return (
        <svg {...common} {...props}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 20a6 6 0 0 1 12 0m0-5a5 5 0 0 1 6 5" />
        </svg>
      )
    case 'warning':
      return (
        <svg {...common} {...props}>
          <path d="M12 3 2.5 20h19z" />
          <path d="M12 9v5m0 3h.01" />
        </svg>
      )
  }
}

export interface SmeCloneAvatarProps {
  name: string
  color?: string
  size?: number
  title?: string
}

export function smeCloneInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function SmeCloneAvatar({
  name,
  color = '#516174',
  size = 28,
  title,
}: SmeCloneAvatarProps) {
  return (
    <span
      className="sme-clone-avatar"
      style={{ '--avatar-color': color, '--avatar-size': `${size}px` } as CSSProperties}
      title={title ?? name}
      aria-label={name}
    >
      {smeCloneInitials(name)}
    </span>
  )
}

export function formatSmeCurrency(
  value: number,
  options: { compact?: boolean; maximumFractionDigits?: number } = {},
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: options.compact ? 'compact' : 'standard',
    maximumFractionDigits: options.maximumFractionDigits ?? (options.compact ? 1 : 0),
  }).format(value)
}

export function formatSmePercent(value: number, digits = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: digits,
  }).format(value)
}
