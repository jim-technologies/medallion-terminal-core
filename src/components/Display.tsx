import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { useMessage } from '../foundations/DesignSystemProvider'
import type { ComponentSize, Intent, StatusTone } from '../foundations/types'
import { IconButton } from './Button'
import { Badge } from './Feedback'
import { Icon } from './Icon'
import { cx } from './utils'

const TONE_INTENT: Record<StatusTone, Intent> = {
  ok: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  neutral: 'neutral',
}

/** Props for a status dot and label. */
export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status tone; the label always carries the meaning too. */
  tone?: StatusTone
  /** Visual size. */
  size?: ComponentSize
}

/**
 * A status: a dot in the tone's colour plus a label, so meaning never rests
 * on colour alone.
 */
export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(function StatusBadge(
  { tone = 'neutral', size = 'small', className, children, ...rest },
  ref,
) {
  return (
    <Badge
      {...rest}
      ref={ref}
      dot
      intent={TONE_INTENT[tone]}
      size={size}
      data-tone={tone}
      className={cx('mtc-status-badge', className)}
    >
      {children}
    </Badge>
  )
})

/** Props for a keyboard key. */
export type KbdProps = HTMLAttributes<HTMLElement>

/** A keyboard key or shortcut hint, such as `Ctrl K` or `/`. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, ...rest },
  ref,
) {
  return <kbd {...rest} ref={ref} className={cx('mtc-kbd', className)} />
})

/** Avatar sizes in pixels. */
export type AvatarSize = 24 | 32

/** Props for a person or service avatar. */
export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Display name; its initials are shown and it names the avatar. */
  name: string
  /** Optional image; initials remain the fallback if it fails to load. */
  src?: string
  /** Size in pixels. */
  size?: AvatarSize
  /**
   * Hide the avatar from assistive technology when adjacent text already
   * names the person.
   */
  decorative?: boolean
}

/** Initials of a display name: the first letters of its first and last words. */
export function initialsOf(name: string): string {
  const words = name.split(/[\s·._@-]+/u).filter(word => /\p{L}|\p{N}/u.test(word))
  if (words.length === 0) return '?'
  const first = [...words[0]!]
  if (words.length === 1) return first.slice(0, 2).join('').toUpperCase()
  const last = [...words[words.length - 1]!]
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
}

/** A round avatar with the person's initials, or their image when given. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 24, decorative = false, className, ...rest },
  ref,
) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  return (
    <span
      {...rest}
      ref={ref}
      className={cx('mtc-avatar', className)}
      data-size={size}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      title={decorative ? undefined : name}
    >
      {src && !failed
        ? <img src={src} alt="" onError={() => setFailed(true)} />
        : <span aria-hidden="true">{initialsOf(name)}</span>}
    </span>
  )
})

/** Props for a loading placeholder. */
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** CSS width or pixels; lines default to the full width. */
  width?: number | string
  /** CSS height or pixels; defaults to one text line. */
  height?: number | string
  /** Line, block, or circle (avatars and glyphs). */
  shape?: 'line' | 'block' | 'circle'
  /** Renders a paragraph of this many lines, the last one shorter. */
  lines?: number
}

/**
 * A loading placeholder in the shape of the content it stands in for. It is
 * hidden from assistive technology: announce loading with `LoadingState` or
 * `aria-busy` on the region.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { width, height, shape = 'line', lines, className, style, ...rest },
  ref,
) {
  const size = (value: number | string | undefined) => typeof value === 'number' ? `${value}px` : value
  if (lines && lines > 1) {
    return (
      <span {...rest} ref={ref} aria-hidden="true" className={cx('mtc-skeleton-lines', className)} style={{ width: size(width), ...style }}>
        {Array.from({ length: lines }, (_, index) => (
          <span key={index} className="mtc-skeleton" data-shape="line" style={index === lines - 1 ? { width: '60%' } : undefined} />
        ))}
      </span>
    )
  }
  return (
    <span
      {...rest}
      ref={ref}
      aria-hidden="true"
      className={cx('mtc-skeleton', className)}
      data-shape={shape}
      style={{ width: size(width), height: size(height), ...style }}
    />
  )
})

/** The clipboard operation CopyButton needs; injectable for tests. */
export interface ClipboardWriter {
  writeText(text: string): Promise<void>
}

/** Props for a copy-to-clipboard action. */
export interface CopyButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onCopy'> {
  /** Text written to the clipboard. */
  value: string
  /** Accessible action name; defaults to "Copy". */
  label?: string
  /** Announced after a successful copy; defaults to "Copied". */
  copiedLabel?: string
  /** Visual size. */
  size?: ComponentSize
  /** Clipboard to write to; defaults to `navigator.clipboard`. */
  clipboard?: ClipboardWriter
  /** Called after the value reached the clipboard. */
  onCopied?: (value: string) => void
}

const COPIED_MS = 1500

/**
 * Copies a value such as an id, hash or path. The icon turns into a check and
 * a polite status announces the copy.
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  { value, label, copiedLabel, size = 'small', clipboard, onCopied, className, ...rest },
  ref,
) {
  const t = useMessage()
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = async () => {
    const target = clipboard ?? (typeof navigator !== 'undefined' ? navigator.clipboard : undefined)
    if (!target) return
    try {
      await target.writeText(value)
    } catch {
      return
    }
    setCopied(true)
    onCopied?.(value)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), COPIED_MS)
  }
  return (
    <span className={cx('mtc-copy-button', className)} data-copied={copied || undefined}>
      <IconButton
        {...rest}
        ref={ref}
        variant="ghost"
        size={size}
        icon={<Icon name={copied ? 'check' : 'copy'} />}
        aria-label={label ?? t('copy.label')}
        onClick={() => void copy()}
      />
      <span role="status" className="mtc-visually-hidden">{copied ? copiedLabel ?? t('copy.copied') : ''}</span>
    </span>
  )
})

/** Props for a row of object metadata. */
export interface MetaRowProps extends HTMLAttributes<HTMLUListElement> {
  /** Metadata items, such as "Updated 18 min ago by Jamie Kim" or "Revision 14". */
  items: readonly ReactNode[]
}

/** A wrapping row of small, muted metadata items. */
export const MetaRow = forwardRef<HTMLUListElement, MetaRowProps>(function MetaRow(
  { items, className, ...rest },
  ref,
) {
  return (
    <ul {...rest} ref={ref} className={cx('mtc-meta-row', className)}>
      {items.filter(item => item != null && item !== false).map((item, index) => (
        <li key={index} className="mtc-meta-item">{item}</li>
      ))}
    </ul>
  )
})

/** Props for a titled content panel. */
export interface PanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Panel title (14 px, semibold). */
  title: ReactNode
  /** Muted text after the title, such as a count. */
  subtitle?: ReactNode
  /** Header actions, aligned to the end. */
  actions?: ReactNode
  /** Fixed content below the body. */
  footer?: ReactNode
  /** Heading level of the title. */
  headingLevel?: 2 | 3 | 4
  /** Pads the body; off for edge-to-edge rows and grids. */
  padded?: boolean
}

/**
 * A flat bordered panel with a 36 px header: the frame for property panels,
 * link panels, feeds and graphs.
 */
export const Panel = forwardRef<HTMLElement, PanelProps>(function Panel(
  { title, subtitle, actions, footer, headingLevel = 2, padded = false, className, children, ...rest },
  ref,
) {
  const titleId = useId()
  const Heading = `h${headingLevel}` as 'h2'
  return (
    <section {...rest} ref={ref} aria-labelledby={titleId} className={cx('mtc-panel', className)}>
      <header className="mtc-panel-header">
        <Heading id={titleId} className="mtc-panel-title">{title}</Heading>
        {subtitle != null && <span className="mtc-panel-subtitle">{subtitle}</span>}
        {actions && <div className="mtc-panel-actions">{actions}</div>}
      </header>
      <div className="mtc-panel-body" data-padded={padded || undefined}>{children}</div>
      {footer && <footer className="mtc-panel-footer">{footer}</footer>}
    </section>
  )
})
