/** One broken style-token rule on one line. */
export interface StyleTokenViolation {
  rule: string
  line: number
  text: string
}

/** The type scale in pixels; nothing may be smaller than its first step. */
export const TYPE_SCALE: ReadonlySet<number>

/** Whether a repository-relative path is a Storybook story. */
export function isStory(relative: string): boolean

/** Whether a repository-relative path is a page template (`src/templates/`). */
export function isTemplate(relative: string): boolean

/** Every rule a file's text breaks, with its line. */
export function violations(relative: string, text: string): StyleTokenViolation[]
