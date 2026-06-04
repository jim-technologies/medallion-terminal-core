import type { Template } from '../types/template';
export declare const BUILTIN_COMPONENTS: ReadonlySet<string>;
export type ValidationSeverity = 'error' | 'warn';
export interface ValidationIssue {
    path: string;
    severity: ValidationSeverity;
    message: string;
}
export declare function validateTemplate(template: Template, knownExtra?: Iterable<string>): ValidationIssue[];
