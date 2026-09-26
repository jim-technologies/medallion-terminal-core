/**
 * Public presentation themes. `operator` remains the existing industrial
 * preset; `high-contrast` is the accessibility-focused preset.
 */
export type PresentationTheme = 'dark' | 'operator' | 'light' | 'high-contrast';
/**
 * Density shared by controls, workbench surfaces, and dashboards.
 * `standard` (28 px controls, 32 px rows) is the default.
 */
export type Density = 'compact' | 'standard' | 'comfortable';
/** Semantic intent used by actions and status-bearing components. */
export type Intent = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
/** Consistent control sizing independent of the active density. */
export type ComponentSize = 'small' | 'medium' | 'large';
/**
 * Tone of a status: `ok`, `warning` and `danger` carry meaning, `info` marks
 * something in progress or informational, `neutral` has no judgement.
 */
export type StatusTone = 'ok' | 'warning' | 'danger' | 'info' | 'neutral';
