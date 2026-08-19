import type { Template } from '../types/template';
export declare const BUILTIN_COMPONENTS: ReadonlySet<string>;
export type ValidationSeverity = 'error' | 'warn';
export interface ValidationIssue {
    path: string;
    severity: ValidationSeverity;
    message: string;
}
/** Optional validator behavior for hosts with an exact scoped registry. */
export interface ValidateTemplateOptions {
    /**
     * Includes Terminal Core built-ins in addition to `knownExtra`. Defaults to
     * true for backward compatibility.
     */
    includeBuiltIns?: boolean;
}
export declare function validateTemplate(template: Template, knownExtra?: Iterable<string>, options?: ValidateTemplateOptions): ValidationIssue[];
