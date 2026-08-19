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
 * demonstrate the same constraints a consuming application has.
 */
export function StoryFrame({
  eyebrow,
  title,
  description,
  children,
  spacious = false,
}: StoryFrameProps) {
  return (
    <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-6 sm:px-8 sm:py-10">
      <header className="grid gap-3 border-b border-[var(--mtc-border)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--mtc-accent-soft)]">
            {eyebrow}
          </span>
          <span className="rounded-full border border-[var(--mtc-border)] bg-[var(--mtc-panel)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--mtc-muted-strong)]">
            Interactive specimen
          </span>
        </div>
        <div className="grid max-w-3xl gap-1.5">
          <h1 className="text-xl font-semibold tracking-[-0.02em] text-[var(--mtc-fg)]">
            {title}
          </h1>
          <p className="text-sm leading-6 text-[var(--mtc-muted)]">{description}</p>
        </div>
      </header>

      <section
        className={`relative overflow-visible rounded-[var(--mtc-radius-lg)] border border-[var(--mtc-border)] bg-[var(--mtc-surface)] p-5 shadow-[var(--mtc-elevation-1)] sm:p-7 ${
          spacious ? 'min-h-[24rem]' : ''
        }`}
        aria-label={`${title} component example`}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--mtc-border-strong)] opacity-70"
          aria-hidden="true"
        />
        {children}
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[var(--mtc-muted-subtle)]">
        <span>Theme and density inherit from the scoped toolkit root.</span>
        <span>Keyboard and pointer ready</span>
      </footer>
    </main>
  )
}
