/**
 * Public presentation themes. `operator` remains the existing industrial
 * preset; `high-contrast` is the accessibility-focused preset.
 */
export type PresentationTheme = 'dark' | 'operator' | 'light' | 'high-contrast'

/** Density shared by controls, workbench surfaces, and dashboards. */
export type Density = 'compact' | 'comfortable'

/** Semantic intent used by actions and status-bearing components. */
export type Intent = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

/** Consistent control sizing independent of the active density. */
export type ComponentSize = 'small' | 'medium' | 'large'

