/** One authoring error in a generated ProtoJSON module manifest. */
export interface ExtensionManifestIssue {
    path: string;
    message: string;
}
/** Deployment authorities are supplied by the host, never by a manifest. */
export interface ExtensionManifestValidationOptions {
    allowedLinkHosts: readonly string[];
}
/**
 * Validates a v1 ProtoJSON declaration without registering, loading or contacting
 * a module. Returns no issues for a valid manifest. Links fail closed unless the
 * caller supplies the exact deployment host[:port] authority in allowedLinkHosts.
 */
export declare function validateExtensionManifest(manifest: unknown, options?: ExtensionManifestValidationOptions): ExtensionManifestIssue[];
