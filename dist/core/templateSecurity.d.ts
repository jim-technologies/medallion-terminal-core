import type { Template } from '../types/template';
import { type BasemapPresetId } from '../maps/basemaps';
export type TemplateSecuritySeverity = 'error' | 'warn';
export interface TemplateSecurityIssue {
    path: string;
    severity: TemplateSecuritySeverity;
    message: string;
}
export interface IframeSandboxPolicy {
    requiredTokens?: readonly string[];
    disallowedTokens?: readonly string[];
    allowScriptsWithSameOrigin?: boolean;
}
export interface TemplateTrustPolicy {
    allowedUrlOrigins?: readonly string[];
    allowedIframeOrigins?: readonly string[];
    allowRelativeUrls?: boolean;
    allowedBasemapPresets?: readonly BasemapPresetId[];
    allowedHeaders?: readonly string[];
    disallowedHeaders?: readonly string[];
    minRefreshIntervalMs?: number;
    maxRefreshIntervalMs?: number;
    iframeSandbox?: IframeSandboxPolicy;
}
export declare const DEFAULT_IFRAME_SANDBOX = "";
export declare const DEFAULT_SENSITIVE_TEMPLATE_HEADERS: readonly ['authorization', 'cookie', 'proxy-authorization', 'set-cookie', 'x-api-key', 'x-auth-token', 'x-csrf-token', 'x-xsrf-token'];
export declare const DEFAULT_IFRAME_SANDBOX_DISALLOWED_TOKENS: readonly ['allow-downloads', 'allow-popups-to-escape-sandbox', 'allow-top-navigation', 'allow-top-navigation-by-user-activation'];
export declare const DEFAULT_UNTRUSTED_TEMPLATE_POLICY: {
    readonly allowRelativeUrls: true;
    readonly allowedUrlOrigins: readonly [];
    readonly allowedBasemapPresets: readonly [];
    readonly disallowedHeaders: readonly ["authorization", "cookie", "proxy-authorization", "set-cookie", "x-api-key", "x-auth-token", "x-csrf-token", "x-xsrf-token"];
    readonly minRefreshIntervalMs: 1000;
    readonly iframeSandbox: {
        readonly disallowedTokens: readonly ["allow-downloads", "allow-popups-to-escape-sandbox", "allow-top-navigation", "allow-top-navigation-by-user-activation"];
        readonly allowScriptsWithSameOrigin: false;
    };
};
export declare function validateTemplateTrust(template: Template, policy?: TemplateTrustPolicy): TemplateSecurityIssue[];
