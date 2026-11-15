import type { GenEnum, GenFile, GenMessage } from "@bufbuild/protobuf/codegenv2";
import type { Message } from "@bufbuild/protobuf";
/**
 * Describes the file medallion/extension/v1/manifest.proto.
 */
export declare const file_medallion_extension_v1_manifest: GenFile;
/**
 * A first-party workspace module declaration. Hosts enforce membership and the
 * workspace entitlement before exposing contributions; this is not an install,
 * code-execution or authorization grant. ProtoJSON uses the generated camelCase
 * field names and symbolic enum names. Unknown fields are refused in v1.
 *
 * @generated from message medallion.extension.v1.ExtensionManifest
 */
export type ExtensionManifest = Message<"medallion.extension.v1.ExtensionManifest"> & {
    /**
     * Stable identifier matching ^[a-z0-9][a-z0-9.-]{2,63}$.
     *
     * @generated from field: string id = 1;
     */
    id: string;
    /**
     * Exact Semantic Versioning 2.0.0 version, including optional prerelease/build.
     *
     * @generated from field: string version = 2;
     */
    version: string;
    /**
     * Nonblank display title, at most 128 characters, without surrounding space.
     *
     * @generated from field: string title = 3;
     */
    title: string;
    /**
     * Host icon identifier, at most 128 characters, beginning with an ASCII letter
     * and otherwise containing letters, digits, dots, underscores or hyphens.
     *
     * @generated from field: string icon = 4;
     */
    icon: string;
    /**
     * Whether the host renders a native module or checks and resolves a link.
     *
     * @generated from field: medallion.extension.v1.ExtensionKind kind = 5;
     */
    kind: ExtensionKind;
    /**
     * Workspace entitlement key, at most 128 characters, containing ASCII letters,
     * digits, dots, underscores, colons or hyphens and beginning with a letter/digit.
     *
     * @generated from field: string entitlement_key = 6;
     */
    entitlementKey: string;
    /**
     * The module's routes and optional navigation and home entries.
     *
     * @generated from field: medallion.extension.v1.ExtensionContributions contributes = 7;
     */
    contributes?: ExtensionContributions | undefined;
    /**
     * Required for LINK and forbidden for NATIVE; the host supplies deployment URLs.
     *
     * @generated from field: medallion.extension.v1.ExtensionLink link = 8;
     */
    link?: ExtensionLink | undefined;
};
/**
 * A first-party workspace module declaration. Hosts enforce membership and the
 * workspace entitlement before exposing contributions; this is not an install,
 * code-execution or authorization grant. ProtoJSON uses the generated camelCase
 * field names and symbolic enum names. Unknown fields are refused in v1.
 *
 * @generated from message medallion.extension.v1.ExtensionManifest
 */
export type ExtensionManifestJson = {
    /**
     * Stable identifier matching ^[a-z0-9][a-z0-9.-]{2,63}$.
     *
     * @generated from field: string id = 1;
     */
    id?: string;
    /**
     * Exact Semantic Versioning 2.0.0 version, including optional prerelease/build.
     *
     * @generated from field: string version = 2;
     */
    version?: string;
    /**
     * Nonblank display title, at most 128 characters, without surrounding space.
     *
     * @generated from field: string title = 3;
     */
    title?: string;
    /**
     * Host icon identifier, at most 128 characters, beginning with an ASCII letter
     * and otherwise containing letters, digits, dots, underscores or hyphens.
     *
     * @generated from field: string icon = 4;
     */
    icon?: string;
    /**
     * Whether the host renders a native module or checks and resolves a link.
     *
     * @generated from field: medallion.extension.v1.ExtensionKind kind = 5;
     */
    kind?: ExtensionKindJson;
    /**
     * Workspace entitlement key, at most 128 characters, containing ASCII letters,
     * digits, dots, underscores, colons or hyphens and beginning with a letter/digit.
     *
     * @generated from field: string entitlement_key = 6;
     */
    entitlementKey?: string;
    /**
     * The module's routes and optional navigation and home entries.
     *
     * @generated from field: medallion.extension.v1.ExtensionContributions contributes = 7;
     */
    contributes?: ExtensionContributionsJson;
    /**
     * Required for LINK and forbidden for NATIVE; the host supplies deployment URLs.
     *
     * @generated from field: medallion.extension.v1.ExtensionLink link = 8;
     */
    link?: ExtensionLinkJson;
};
/**
 * Describes the message medallion.extension.v1.ExtensionManifest.
 * Use `create(ExtensionManifestSchema)` to create a new message.
 */
export declare const ExtensionManifestSchema: GenMessage<ExtensionManifest, {
    jsonType: ExtensionManifestJson;
}>;
/**
 * Declarative host contributions; omitted navigation and home lists are empty.
 *
 * @generated from message medallion.extension.v1.ExtensionContributions
 */
export type ExtensionContributions = Message<"medallion.extension.v1.ExtensionContributions"> & {
    /**
     * Optional navigation entries, each pointing at a declared route.
     *
     * @generated from field: repeated medallion.extension.v1.ExtensionEntry nav = 1;
     */
    nav: ExtensionEntry[];
    /**
     * Unique route templates beginning /w/{workspace}/m/<manifest-id>. At least one
     * is required. Optional child segments contain ASCII letters, digits, dots,
     * underscores, tildes or hyphens; dot segments, encoded delimiters, query strings,
     * fragments, backslashes, empty segments and trailing slashes are forbidden.
     *
     * @generated from field: repeated string routes = 2;
     */
    routes: string[];
    /**
     * Optional home tiles, each pointing at a declared route.
     *
     * @generated from field: repeated medallion.extension.v1.ExtensionEntry home_tiles = 3;
     */
    homeTiles: ExtensionEntry[];
};
/**
 * Declarative host contributions; omitted navigation and home lists are empty.
 *
 * @generated from message medallion.extension.v1.ExtensionContributions
 */
export type ExtensionContributionsJson = {
    /**
     * Optional navigation entries, each pointing at a declared route.
     *
     * @generated from field: repeated medallion.extension.v1.ExtensionEntry nav = 1;
     */
    nav?: ExtensionEntryJson[];
    /**
     * Unique route templates beginning /w/{workspace}/m/<manifest-id>. At least one
     * is required. Optional child segments contain ASCII letters, digits, dots,
     * underscores, tildes or hyphens; dot segments, encoded delimiters, query strings,
     * fragments, backslashes, empty segments and trailing slashes are forbidden.
     *
     * @generated from field: repeated string routes = 2;
     */
    routes?: string[];
    /**
     * Optional home tiles, each pointing at a declared route.
     *
     * @generated from field: repeated medallion.extension.v1.ExtensionEntry home_tiles = 3;
     */
    homeTiles?: ExtensionEntryJson[];
};
/**
 * Describes the message medallion.extension.v1.ExtensionContributions.
 * Use `create(ExtensionContributionsSchema)` to create a new message.
 */
export declare const ExtensionContributionsSchema: GenMessage<ExtensionContributions, {
    jsonType: ExtensionContributionsJson;
}>;
/**
 * A navigation item or home tile that enters one of the module's declared routes.
 *
 * @generated from message medallion.extension.v1.ExtensionEntry
 */
export type ExtensionEntry = Message<"medallion.extension.v1.ExtensionEntry"> & {
    /**
     * Nonblank entry title, at most 128 characters, without surrounding space.
     *
     * @generated from field: string title = 1;
     */
    title: string;
    /**
     * An exact route template from this manifest's contributes.routes list.
     *
     * @generated from field: string path = 2;
     */
    path: string;
    /**
     * Optional icon using the manifest icon syntax; inherits it when omitted.
     *
     * @generated from field: string icon = 3;
     */
    icon: string;
};
/**
 * A navigation item or home tile that enters one of the module's declared routes.
 *
 * @generated from message medallion.extension.v1.ExtensionEntry
 */
export type ExtensionEntryJson = {
    /**
     * Nonblank entry title, at most 128 characters, without surrounding space.
     *
     * @generated from field: string title = 1;
     */
    title?: string;
    /**
     * An exact route template from this manifest's contributes.routes list.
     *
     * @generated from field: string path = 2;
     */
    path?: string;
    /**
     * Optional icon using the manifest icon syntax; inherits it when omitted.
     *
     * @generated from field: string icon = 3;
     */
    icon?: string;
};
/**
 * Describes the message medallion.extension.v1.ExtensionEntry.
 * Use `create(ExtensionEntrySchema)` to create a new message.
 */
export declare const ExtensionEntrySchema: GenMessage<ExtensionEntry, {
    jsonType: ExtensionEntryJson;
}>;
/**
 * A deployment-configured destination; hosts resolve it on their server, not by
 * handing the browser an unchecked destination. Manifest validation does not
 * perform the required permission check or emit the link-opened audit event.
 *
 * @generated from message medallion.extension.v1.ExtensionLink
 */
export type ExtensionLink = Message<"medallion.extension.v1.ExtensionLink"> & {
    /**
     * Absolute HTTP(S) URL, with no userinfo, fragment or whitespace and an authority exactly
     * allowed by the host's host[:port] list. The only template token is {workspace},
     * permitted in path/query, never in the authority; the host percent-encodes its
     * replacement. Other deployment placeholders must be resolved before validation.
     *
     * @generated from field: string url_template = 1;
     */
    urlTemplate: string;
    /**
     * Required object relation, matching ^[a-z][a-z0-9_]{0,63}$.
     *
     * @generated from field: string required_relation = 2;
     */
    requiredRelation: string;
};
/**
 * A deployment-configured destination; hosts resolve it on their server, not by
 * handing the browser an unchecked destination. Manifest validation does not
 * perform the required permission check or emit the link-opened audit event.
 *
 * @generated from message medallion.extension.v1.ExtensionLink
 */
export type ExtensionLinkJson = {
    /**
     * Absolute HTTP(S) URL, with no userinfo, fragment or whitespace and an authority exactly
     * allowed by the host's host[:port] list. The only template token is {workspace},
     * permitted in path/query, never in the authority; the host percent-encodes its
     * replacement. Other deployment placeholders must be resolved before validation.
     *
     * @generated from field: string url_template = 1;
     */
    urlTemplate?: string;
    /**
     * Required object relation, matching ^[a-z][a-z0-9_]{0,63}$.
     *
     * @generated from field: string required_relation = 2;
     */
    requiredRelation?: string;
};
/**
 * Describes the message medallion.extension.v1.ExtensionLink.
 * Use `create(ExtensionLinkSchema)` to create a new message.
 */
export declare const ExtensionLinkSchema: GenMessage<ExtensionLink, {
    jsonType: ExtensionLinkJson;
}>;
/**
 * The two supported workspace module presentation modes.
 *
 * @generated from enum medallion.extension.v1.ExtensionKind
 */
export declare enum ExtensionKind {
    /**
     * No presentation mode; invalid in a published manifest.
     *
     * @generated from enum value: EXTENSION_KIND_UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * A native module compiled into the host application.
     *
     * @generated from enum value: EXTENSION_KIND_NATIVE = 1;
     */
    NATIVE = 1,
    /**
     * An external destination resolved by the host after its permission check.
     *
     * @generated from enum value: EXTENSION_KIND_LINK = 2;
     */
    LINK = 2
}
/**
 * The two supported workspace module presentation modes.
 *
 * @generated from enum medallion.extension.v1.ExtensionKind
 */
export type ExtensionKindJson = "EXTENSION_KIND_UNSPECIFIED" | "EXTENSION_KIND_NATIVE" | "EXTENSION_KIND_LINK";
/**
 * Describes the enum medallion.extension.v1.ExtensionKind.
 */
export declare const ExtensionKindSchema: GenEnum<ExtensionKind, ExtensionKindJson>;
