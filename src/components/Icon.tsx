import { forwardRef, type SVGProps } from 'react'

/** Built-in, product-neutral symbols available to toolkit controls. */
export type IconName =
  | 'add'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'database'
  | 'error'
  | 'external-link'
  | 'file'
  | 'folder'
  | 'info'
  | 'menu'
  | 'minus'
  | 'more'
  | 'panel-left'
  | 'panel-right'
  | 'search'
  | 'settings'
  | 'spinner'
  | 'success'
  | 'warning'

/** Props for the stroke-based icon primitive. */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  /** Accessible label. Omit when an adjacent label already names the icon. */
  label?: string
  /** CSS size value or numeric pixel size. */
  size?: string | number
}

/**
 * Small first-party icon set used by the toolkit. Icons inherit `currentColor`
 * and never load external SVG or arbitrary markup.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, label, size = '1em', className, ...rest },
  ref,
) {
  return (
    <svg
      {...rest}
      ref={ref}
      className={['mtc-icon', className].filter(Boolean).join(' ')}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <IconPaths name={name} />
    </svg>
  )
})

function IconPaths({ name }: { name: IconName }) {
  switch (name) {
    case 'add': return <><path d="M12 5v14" /><path d="M5 12h14" /></>
    case 'minus': return <path d="M5 12h14" />
    case 'check':
    case 'success': return <path d="m5 12 4 4L19 6" />
    case 'close': return <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>
    case 'chevron-down': return <path d="m7 9 5 5 5-5" />
    case 'chevron-left': return <path d="m15 18-6-6 6-6" />
    case 'chevron-right': return <path d="m9 18 6-6-6-6" />
    case 'search': return <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>
    case 'more': return <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>
    case 'info': return <><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></>
    case 'warning': return <><path d="M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>
    case 'error': return <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6" /><path d="m15 9-6 6" /></>
    case 'database': return <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" /></>
    case 'folder': return <path d="M3 6.5h6l2 2h10v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    case 'file': return <><path d="M6 2h8l4 4v16H6Z" /><path d="M14 2v5h5" /></>
    case 'panel-left': return <><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M9 4v16" /></>
    case 'panel-right': return <><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M15 4v16" /></>
    case 'menu': return <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>
    case 'external-link': return <><path d="M14 5h5v5" /><path d="m10 14 9-9" /><path d="M19 13v6H5V5h6" /></>
    case 'settings': return <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>
    case 'spinner': return <><path d="M12 3a9 9 0 1 0 9 9" /><path d="M21 3v6h-6" /></>
  }
}
