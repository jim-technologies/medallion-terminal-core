// The style-token rules scripts/check-style-tokens.mjs applies to each
// scanned file, one line at a time.
//
// Colour, type size and letter-spacing come from the scoped --mtc-* tokens
// (see docs/DESIGN.md). A line fails when it introduces:
//
//   color-literal   a hex, rgb(), rgba(), hsl() or hsla() colour outside a
//                   `--mtc-*` / Tailwind `--color-*` custom-property
//                   declaration in src/index.css
//   arbitrary-color a Tailwind arbitrary colour class such as bg-[#123456]
//   font-size       text-[Npx] or text-[Nrem] below 11 px or off the
//                   11/12/13/14/16/20/24 scale
//   font-size-css   a CSS `font-size` or `font` shorthand in px or rem, or
//                   an inline `fontSize` (a number is px, as React and SVG
//                   read it), below 11 px; em and % are relative and not
//                   judged here
//   tracking        an arbitrary tracking-[…] letter-spacing
//   micro-label     an uppercase or letter-spaced label (`uppercase`,
//                   `tracking-wide*`, `text-transform: uppercase`); labels
//                   are sentence case (docs/DESIGN.md)
//   blur            a backdrop-filter blur (surfaces are flat; overlays
//                   carry elevation, not frosted glass)
//   story-frame     in a story (src/ or examples/, clones included), a frame `background`
//                   string that is not a --mtc-* token: a hex, rgb()/hsl(),
//                   a named colour such as 'black' or 'white', a gradient.
//                   Frames use --mtc-surface / --mtc-border so every theme
//                   previews on its own canvas
//
// A story gets only the story-frame rule, except the page templates
// (src/templates/): they are the reference for product pages, so they get
// every rule, the 11 px floor and sentence-case labels included, as well as
// the story-frame rule (docs/DESIGN.md, Typography, Scope).

export const TYPE_SCALE = new Set([11, 12, 13, 14, 16, 20, 24])

const rules = {
  'color-literal': /#[0-9a-fA-F]{3,8}\b(?![-\w])|\b(?:rgba?|hsla?)\(/g,
  'arbitrary-color': /\b(?:bg|text|border(?:-[trblxy])?|fill|stroke|from|via|to|ring|outline|decoration|shadow|accent|caret|divide)-\[(?:#|rgba?\(|hsla?\()/g,
  'font-size': /\btext-\[(\d*\.?\d+)(px|rem)\]/g,
  'font-size-css': /\bfont-size\s*:\s*(\d*\.?\d+)(px|rem)\b|\bfont\s*:[^;{}]*?(?<![\w.-])(\d*\.?\d+)(px|rem)\b|\bfontSize\s*[:=]\s*\{?\s*['"`]?(\d*\.?\d+)(px|rem)?(?![\w.%])/g,
  tracking: /\btracking-\[[^\]]+\]/g,
  'micro-label': /\b(?:uppercase|tracking-(?:wide|wider|widest))\b|text-transform:\s*uppercase/g,
  blur: /\bbackdrop-blur\b|\bbackdrop-filter\s*:|\bbackdropFilter\b/g,
}

// Any quoted background except one --mtc-* token or a colourless keyword.
const storyRules = {
  'story-frame': /\bbackground(?:Color)?:\s*(['"`])(?!(?:var\(--mtc-[\w-]+\)|transparent|none|inherit)\1)[^'"`]*\1/g,
}

export const isStory = relative => /\.stories\.[cm]?[jt]sx?$/.test(relative)

/** Whether a repository-relative path is a page template. */
export const isTemplate = relative => relative.startsWith('src/templates/')

/** Every rule a file's text breaks, with its line. */
export function violations(relative, text) {
  const found = []
  const lines = text.split('\n')
  const active = !isStory(relative) ? rules
    : isTemplate(relative) ? { ...rules, ...storyRules }
      : storyRules
  lines.forEach((line, index) => {
    // A custom-property declaration in the token stylesheet *is* the token.
    const tokenDeclaration = relative === 'src/index.css'
      && /^\s*--(?:mtc|color)-[\w-]+\s*:/.test(line)
    for (const [rule, pattern] of Object.entries(active)) {
      if (rule === 'color-literal' && tokenDeclaration) continue
      for (const match of line.matchAll(pattern)) {
        if (rule === 'font-size') {
          const px = Number(match[1]) * (match[2] === 'rem' ? 16 : 1)
          if (px >= 11 && TYPE_SCALE.has(px)) continue
        }
        if (rule === 'font-size-css') {
          const [value, unit] = match[1] !== undefined ? [match[1], match[2]]
            : match[3] !== undefined ? [match[3], match[4]]
              : [match[5], match[6]]
          const px = Number(value) * (unit === 'rem' ? 16 : 1)
          if (px >= 11) continue
        }
        if (rule === 'color-literal' && /^#[0-9a-fA-F]{3,8}$/.test(match[0])) {
          // Ignore hex-looking fragments that are not colours: URL fragments
          // and ids such as `#main` never reach here (non-hex), but numeric
          // anchors like `#123` in copy do; require a colour-ish context.
          const before = line.slice(0, match.index)
          if (/[\w/]$/.test(before)) continue
        }
        found.push({ rule, line: index + 1, text: match[0] })
      }
    }
  })
  return found
}
