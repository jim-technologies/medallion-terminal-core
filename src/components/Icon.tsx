import { forwardRef, type SVGProps } from 'react'

/**
 * Circle as a path: keeps every glyph a single `d` string so the set stays a
 * compact data table.
 */
function circle(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
}

/** Rounded rectangle as a path. */
function rect(x: number, y: number, w: number, h: number, rx = 1.5): string {
  return `M${x + rx} ${y}h${w - 2 * rx}a${rx} ${rx} 0 0 1 ${rx} ${rx}v${h - 2 * rx}`
    + `a${rx} ${rx} 0 0 1 ${-rx} ${rx}h${-(w - 2 * rx)}a${rx} ${rx} 0 0 1 ${-rx} ${-rx}`
    + `v${-(h - 2 * rx)}a${rx} ${rx} 0 0 1 ${rx} ${-rx}z`
}

/**
 * First-party glyphs on a 24-unit grid, drawn as 1.75-unit round strokes in
 * `currentColor`. Nouns double as object type icons inside `TypeGlyph`;
 * verbs label actions. None reproduces another product's icon set.
 */
const PATHS = {
  // Actions and navigation
  add: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'm5 12 4 4L19 6',
  success: 'm5 12 4 4L19 6',
  close: 'm6 6 12 12M18 6 6 18',
  'chevron-down': 'm7 9 5 5 5-5',
  'chevron-left': 'm15 18-6-6 6-6',
  'chevron-right': 'm9 18 6-6-6-6',
  'arrow-left': 'M19 12H5m6-6-6 6 6 6',
  'arrow-right': 'M5 12h14m-6-6 6 6-6 6',
  search: `${circle(11, 11, 6.5)}M16 16l4 4`,
  menu: 'M4 7h16M4 12h16M4 17h16',
  'panel-left': `${rect(3, 4, 18, 16)}M9 4v16`,
  'panel-right': `${rect(3, 4, 18, 16)}M15 4v16`,
  'external-link': 'M14 5h5v5m-9 4 9-9m0 8v6H5V5h6',
  settings: `${circle(12, 12, 3)}M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z`,
  spinner: 'M12 3a9 9 0 1 0 9 9M21 3v6h-6',
  copy: `${rect(8, 8, 12, 12)}M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3`,
  filter: 'M4 5h16l-6 7.5V19l-4 2v-8.5z',
  columns: `${rect(3, 4, 18, 16)}M9 4v16M15 4v16`,
  'sort-asc': 'M7 20V4M3 8l4-4 4 4M13 7h3M13 12h5M13 17h8',
  'sort-desc': 'M7 4v16m-4-4 4 4 4-4M13 7h8M13 12h5M13 17h3',
  refresh: 'M20 11a8 8 0 0 0-14.3-4.9L4 8M4 3v5h5M4 13a8 8 0 0 0 14.3 4.9L20 16m0 5v-5h-5',
  history: 'M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 3.5v5h5M12 7.5V12l3 2',
  download: 'M12 4v11m-5-5 5 5 5-5M5 20h14',
  upload: 'M12 20V9m-5 5 5-5 5 5M5 4h14',
  edit: 'M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17zm10-13 3 3',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  eye: `M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z${circle(12, 12, 3)}`,
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  bolt: 'M13 3 5 13h6l-1 8 8-10h-6z',
  'sign-in': 'M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M3 12h11m-4-4 4 4-4 4',
  'sign-out': 'M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4m-1-8h12m-4-4 4 4-4 4',
  hourglass: 'M7 3h10M7 21h10M8 3v2.5a4 4 0 0 0 1.6 3.2L12 11l2.4-2.3A4 4 0 0 0 16 5.5V3M8 21v-2.5a4 4 0 0 1 1.6-3.2L12 13l2.4 2.3a4 4 0 0 1 1.6 3.2V21',
  terminal: `${rect(3, 4, 18, 16)}M7 9l3 3-3 3M12 15h5`,
  plug: 'M9 3v5m6-5v5M6 8h12v3a6 6 0 0 1-12 0zm6 9v4',
  // Status
  info: `${circle(12, 12, 9)}M12 11v5M12 8h.01`,
  warning: 'M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4m0 4h.01',
  error: `${circle(12, 12, 9)}M9 9l6 6M15 9l-6 6`,
  // Workspace areas
  home: 'M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z',
  explore: `${circle(12, 12, 9)}M15.5 8.5l-2 5-5 2 2-5z`,
  ontology: `${circle(6, 7, 2.5)}${rect(15, 4.5, 5, 5, 1)}M12 14l3.5 6h-7zM8.5 7h6.5M7.4 9.1l3.2 5M16.6 9.6 13.5 14`,
  topology: `${circle(12, 5, 2)}${circle(12, 13, 2)}${circle(5, 19, 2)}${circle(19, 19, 2)}M12 7v4m-1.6 3.2-3.8 3.4m7-3.4 3.8 3.4`,
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  // Object nouns
  object: `M12 3l8 4.5v9L12 21l-8-4.5v-9z${circle(12, 12, 2.5)}`,
  person: `${circle(12, 8, 3.5)}M5 20a7 7 0 0 1 14 0`,
  people: `${circle(9, 8.5, 3)}M3.5 19a5.5 5.5 0 0 1 11 0${circle(16.5, 9.5, 2.5)}M15.8 14.1A4.5 4.5 0 0 1 20.5 19`,
  organization: `${rect(9, 3, 6, 5, 1)}${rect(3, 16, 6, 5, 1)}${rect(15, 16, 6, 5, 1)}M12 8v4M6 16v-4h12v4`,
  building: 'M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3',
  contract: 'M6 3h8l4 4v14H6zM14 3v4h4M9 11h6M9 16c1-1.5 2-1.5 2.5 0s1.5 1.5 3 0',
  document: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 15h6M9 18h3',
  file: 'M6 2h8l4 4v16H6ZM14 2v5h5',
  folder: 'M3 6.5h6l2 2h10v9.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z',
  database: 'M4 5a8 3 0 1 0 16 0A8 3 0 1 0 4 5M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7',
  dataset: 'M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5',
  table: `${rect(3, 4, 18, 16)}M3 9h18M3 14.5h18M9 9v11`,
  column: `${rect(3, 4, 18, 16)}M3 9h18M10 4v16M14 4v16`,
  bucket: 'M4 6h16l-1.8 13.2a1 1 0 0 1-1 .8H6.8a1 1 0 0 1-1-.8zM4 6c0-1.1 3.6-2 8-2s8 .9 8 2',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  graph: `${circle(6, 6, 2)}${circle(18, 8, 2)}${circle(9, 18, 2)}M8 6.3l8 1.4M6.5 8l2 8M16.8 9.6l-6.6 6.8`,
  event: `${rect(3, 5, 18, 16)}M3 10h18M8 3v4m8-4v4M11 14h2v2h-2z`,
  calendar: `${rect(3, 5, 18, 16)}M3 10h18M8 3v4m8-4v4`,
  clock: `${circle(12, 12, 9)}M12 7v5l3 2`,
  currency: `${circle(12, 12, 9)}M14.5 9.5C14 8.5 13.1 8 12 8c-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2-.5-2.5-1.5M12 6.5V8m0 8v1.5`,
  order: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6m-6 4h6m-6 4h3',
  package: 'M12 3 4 7v10l8 4 8-4V7zM4 7l8 4 8-4m-8 4v10',
  truck: `M3 6h11v10H3zm11 4h4l3 3v3h-7z${circle(7, 18, 2)}${circle(17, 18, 2)}`,
  location: `M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z${circle(12, 9.5, 2.5)}`,
  tag: `M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z${circle(7.5, 7.5, 1.5)}`,
  flag: 'M5 21V4h11l-2 4 2 4H5',
  alert: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zm4 4.5a2 2 0 0 0 4 0',
  shield: 'M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z',
  key: `${circle(8, 15, 4)}M11 12l8-8M16 7l2 2M14 9l2 2`,
  lock: `${rect(5, 11, 14, 10)}M8 11V8a4 4 0 0 1 8 0v3`,
  server: `${rect(4, 4, 16, 7)}${rect(4, 13, 16, 7)}M8 7.5h.01M8 16.5h.01`,
  cloud: 'M7 19a4 4 0 0 1-.7-7.9 6 6 0 0 1 11.5-1.6A4.5 4.5 0 0 1 17.5 19z',
  branch: `${circle(6, 5, 2)}${circle(6, 19, 2)}${circle(18, 7, 2)}M6 7v10m12-8v1a4 4 0 0 1-4 4H8a2 2 0 0 0-2 2`,
  commit: `${circle(12, 12, 3.5)}M3 12h5.5m7 0H21`,
  workflow: `${rect(3, 3, 6, 6, 1)}${rect(15, 15, 6, 6, 1)}M9 6h4a4 4 0 0 1 4 4v5m-2.5-2.5L17 15l2.5-2.5`,
  play: 'M8 5v14l11-7z',
  pause: 'M8 5v14M16 5v14',
  film: `${rect(3, 4, 18, 16)}M7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4`,
  music: `M9 18V5l11-2v13${circle(6, 18, 3)}${circle(17, 16, 3)}`,
  image: `${rect(3, 4, 18, 16)}${circle(8.5, 9.5, 1.5)}M21 16l-5-5-9 9`,
  'chart-line': 'M4 4v16h16M7 15l4-4 3 3 5-6',
  'chart-bar': 'M4 4v16h16M8 16v-4m4 4V8m4 8v-6',
  globe: `${circle(12, 12, 9)}M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z`,
  mail: `${rect(3, 5, 18, 14)}M3.5 6.5 12 13l8.5-6.5`,
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z',
  ticket: 'M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4zm11 0v2m0 3v2m0 3v1',
  tool: 'M14.7 4.3a4.5 4.5 0 0 0 5 5.9L10 20a2.1 2.1 0 0 1-3-3l9.8-9.8a4.5 4.5 0 0 1-2.1-2.9z',
  badge: `${circle(12, 9, 5)}M9 13.5 8 21l4-2 4 2-1-7.5`,
} as const satisfies Record<string, string>

/** Built-in, product-neutral symbols available to toolkit controls. */
export type IconName = keyof typeof PATHS | 'more'

/** Every built-in icon name, for pickers, stories, and host validation. */
export const ICON_NAMES: readonly IconName[] = [...Object.keys(PATHS) as (keyof typeof PATHS)[], 'more']

/** Props for the stroke-based icon primitive. */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  /** Accessible label. Omit when an adjacent label already names the icon. */
  label?: string
  /** CSS size value or numeric pixel size. */
  size?: string | number
}

/**
 * First-party icon set used by the toolkit. Icons inherit `currentColor`
 * and never load external SVG or arbitrary markup.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, label, size = '1em', className, strokeWidth = 1.75, ...rest },
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
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {name === 'more'
        ? <path d={`${circle(5, 12, 1)}${circle(12, 12, 1)}${circle(19, 12, 1)}`} fill="currentColor" />
        : <path d={PATHS[name]} />}
    </svg>
  )
})
