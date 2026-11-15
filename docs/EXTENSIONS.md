# Workspace module manifests

`medallion.extension.v1.ExtensionManifest` declares a first-party native module or
a permission-checked link. It does not install modules, grant entitlements, load
extension code or register routes. Hosts keep their existing app path until they
explicitly opt into manifest resolution.

The canonical fields and validation rules are documented in
`proto/medallion/extension/v1/manifest.proto`. The focused entry exports generated
ProtoJSON types and a runtime validator without UI or protobuf-reflection code:

```ts
import {
  validateExtensionManifest,
  type ExtensionManifestJson,
} from 'medallion-terminal-core/proto'

const manifest: ExtensionManifestJson = {
  id: 'records',
  version: '1.0.0',
  title: 'Records',
  icon: 'table',
  kind: 'EXTENSION_KIND_NATIVE',
  entitlementKey: 'modules:records',
  contributes: {
    routes: ['/w/{workspace}/m/records'],
    nav: [{ title: 'Records', path: '/w/{workspace}/m/records' }],
  },
}

const issues = validateExtensionManifest(manifest)
```

The host checks workspace membership and the workspace entitlement before
returning a manifest or a module chunk. The `{workspace}` token belongs to the
host's route resolver; substitute a percent-encoded workspace identifier. Routes
stay below `/w/{workspace}/m/<manifest-id>`, and navigation/home entries must refer
to declared routes. There are no dynamic child-route parameters in this version.

A link declares `link.urlTemplate` and `link.requiredRelation`. Deployment URLs
and `allowedLinkHosts` come from the host's trusted configuration, never the
manifest. Resolve any deployment placeholders before validating; only
`{workspace}` in the destination path or query may remain. The allow-list matches
the parsed host and non-default port exactly and ignores case. An empty list
refuses every link. Validate again after resolving the workspace token. The server
must check the required relation and record its link-open event before returning
the destination; a successful manifest validation is not that permission check.

The future extension-host design maps `display_name` to `title` and keeps `id` and
`version`. This smaller contract adds `kind`, workspace entitlement and shell
contributions. Fields9–13 and the names `runtime`, `capabilities`, `operations`,
`viewers` and `commands` are reserved. Publisher/provenance, executable entrypoints,
capabilities, viewer claims, sandbox runtimes, installs and control operations are
outside this version. Unknown fields fail validation rather than silently enabling
a later capability.

Existing APIs and consumer pins do not change. Hosts can roll back by keeping
their prior kit pin and app-resolution path; this contract creates no persistent
state. A future manifest release needs its own version decision and publication.
