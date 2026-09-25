import type { ReactNode } from 'react'

interface StoryFrameProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  spacious?: boolean
}

/**
 * Storybook-only presentation shell for focused component specimens.
 *
 * It deliberately uses public tokens and ordinary composition so the stories
 * demonstrate the same constraints a consuming application has: sentence
 * case, the type scale, flat bordered surfaces.
 */
export function StoryFrame({
  eyebrow,
  title,
  description,
  children,
  spacious = false,
}: StoryFrameProps) {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-6 sm:px-6 sm:py-8">
      <header className="grid min-w-0 gap-1 border-b border-[var(--mtc-border)] pb-4">
        <span className="text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-muted)]">
          {eyebrow}
        </span>
        <h1 className="text-[length:var(--mtc-font-size-xl)] leading-[var(--mtc-line-height-xl)] font-semibold text-[var(--mtc-fg)]">
          {title}
        </h1>
        <p className="max-w-3xl text-[length:var(--mtc-font-size-md)] leading-[var(--mtc-line-height-md)] text-[var(--mtc-muted)]">
          {description}
        </p>
      </header>

      <section
        className={`relative min-w-0 overflow-visible rounded-[var(--mtc-radius-md)] border border-[var(--mtc-border)] bg-[var(--mtc-surface)] p-4 sm:p-6 ${
          spacious ? 'min-h-[24rem]' : ''
        }`}
        aria-label={`${title} component example`}
      >
        {children}
      </section>

      <footer className="text-[length:var(--mtc-font-size-xs)] text-[var(--mtc-muted)]">
        Theme and density inherit from the scoped toolkit root.
      </footer>
    </main>
  )
}
