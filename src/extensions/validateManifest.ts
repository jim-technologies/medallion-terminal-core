/** One authoring error in a generated ProtoJSON module manifest. */
export interface ExtensionManifestIssue {
  path: string
  message: string
}

/** Deployment authorities are supplied by the host, never by a manifest. */
export interface ExtensionManifestValidationOptions {
  allowedLinkHosts: readonly string[]
}

const identifier = /^[a-z0-9][a-z0-9.-]{2,63}$/
const numeric = '(?:0|[1-9][0-9]*)'
const prerelease = '(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)'
const semver = new RegExp(`^${numeric}\\.${numeric}\\.${numeric}(?:-${prerelease}(?:\\.${prerelease})*)?(?:\\+[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*)?$`)

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function label(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 128
    && value.trim() === value && !/[\u0000-\u001f\u007f]/.test(value)
}

function iconIdentifier(value: unknown): value is string {
  return label(value) && /^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(value)
}

/**
 * Validates a v1 ProtoJSON declaration without registering, loading or contacting
 * a module. Returns no issues for a valid manifest. Links fail closed unless the
 * caller supplies the exact deployment host[:port] authority in allowedLinkHosts.
 */
export function validateExtensionManifest(
  manifest: unknown,
  options: ExtensionManifestValidationOptions = { allowedLinkHosts: [] },
): ExtensionManifestIssue[] {
  const issues: ExtensionManifestIssue[] = []
  const issue = (path: string, message: string) => issues.push({ path, message })
  const fields = (value: Record<string, unknown>, allowed: readonly string[], path: string) => {
    for (const key of Object.keys(value)) {
      if (!allowed.includes(key)) issue(path ? `${path}.${key}` : key, 'field is not supported by manifest v1')
    }
  }
  if (!record(manifest)) {
    issue('', 'manifest must be an object')
    return issues
  }
  fields(manifest, ['id', 'version', 'title', 'icon', 'kind', 'entitlementKey', 'contributes', 'link'], '')
  if (typeof manifest.id !== 'string' || !identifier.test(manifest.id)) {
    issue('id', 'id must match ^[a-z0-9][a-z0-9.-]{2,63}$')
  }
  if (typeof manifest.version !== 'string' || manifest.version.length > 128 || !semver.test(manifest.version)) {
    issue('version', 'version must be an exact semantic version')
  }
  if (!label(manifest.title)) issue('title', 'a nonblank title of at most 128 characters is required')
  if (!iconIdentifier(manifest.icon)) issue('icon', 'a host icon identifier of at most 128 characters is required')
  if (!label(manifest.entitlementKey) || !/^[a-zA-Z0-9][a-zA-Z0-9_.:-]*$/.test(manifest.entitlementKey)) {
    issue('entitlementKey', 'a stable workspace entitlement key is required')
  }
  if (manifest.kind !== 'EXTENSION_KIND_NATIVE' && manifest.kind !== 'EXTENSION_KIND_LINK') {
    issue('kind', 'kind must be EXTENSION_KIND_NATIVE or EXTENSION_KIND_LINK')
  }

  if (!record(manifest.contributes)) {
    issue('contributes', 'contributions must declare the module routes')
  } else {
    const contributes = manifest.contributes
    fields(contributes, ['nav', 'routes', 'homeTiles'], 'contributes')
    const routes = new Set<string>()
    const prefix = `/w/{workspace}/m/${manifest.id}`
    if (!Array.isArray(contributes.routes) || contributes.routes.length === 0) {
      issue('contributes.routes', 'at least one route is required')
    } else {
      contributes.routes.forEach((route, index) => {
        const path = `contributes.routes[${index}]`
        if (typeof route !== 'string' || route.length > 2048
          || (route !== prefix && !route.startsWith(`${prefix}/`))) {
          issue(path, 'route must be inside /w/{workspace}/m/<manifest-id>')
          return
        }
        const suffix = route.slice(prefix.length)
        if (suffix && suffix.slice(1).split('/').some(segment => (
          !/^[a-zA-Z0-9._~-]+$/.test(segment) || segment === '.' || segment === '..'
        ))) {
          issue(path, 'route contains an unsafe or unsupported child segment')
          return
        }
        if (routes.has(route)) issue(path, 'duplicate route')
        routes.add(route)
      })
    }
    for (const key of ['nav', 'homeTiles'] as const) {
      const entries = contributes[key]
      if (entries === undefined) continue
      if (!Array.isArray(entries)) {
        issue(`contributes.${key}`, 'entries must be an array')
        continue
      }
      const seen = new Set<string>()
      entries.forEach((entry, index) => {
        const path = `contributes.${key}[${index}]`
        if (!record(entry)) {
          issue(path, 'entry must be an object')
          return
        }
        fields(entry, ['title', 'path', 'icon'], path)
        if (!label(entry.title)) issue(`${path}.title`, 'a nonblank title of at most 128 characters is required')
        if (entry.icon !== undefined && !iconIdentifier(entry.icon)) issue(`${path}.icon`, 'icon must be a host icon identifier')
        if (typeof entry.path !== 'string' || !routes.has(entry.path)) {
          issue(`${path}.path`, 'entry must point at a declared route')
        } else {
          if (seen.has(entry.path)) issue(`${path}.path`, 'duplicate entry route')
          seen.add(entry.path)
        }
      })
    }
  }

  if (manifest.kind === 'EXTENSION_KIND_LINK') {
    if (!record(manifest.link)) {
      issue('link', 'link modules require a destination and relation')
    } else {
      fields(manifest.link, ['urlTemplate', 'requiredRelation'], 'link')
      const template = manifest.link.urlTemplate
      if (typeof template !== 'string' || template.length > 2048 || /\s|[\u0000-\u001f\u007f\\]/.test(template)) {
        issue('link.urlTemplate', 'link must be an absolute HTTP(S) template without whitespace or backslashes')
      } else {
        try {
          const authority = template.match(/^https?:\/\/([^/?#]*)/i)?.[1]
          const remainder = template.replace(/\{workspace\}/g, 'workspace')
          const url = new URL(remainder)
          if (!authority || /[{}]/.test(authority) || /[{}]/.test(remainder)
            || !['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash
            || !options.allowedLinkHosts.some(host => host.toLowerCase() === url.host.toLowerCase())) {
            issue('link.urlTemplate', 'link authority must be explicitly allowed; only {workspace} in path/query is supported')
          }
        } catch {
          issue('link.urlTemplate', 'link must be an absolute HTTP(S) URL')
        }
      }
      if (typeof manifest.link.requiredRelation !== 'string'
        || !/^[a-z][a-z0-9_]{0,63}$/.test(manifest.link.requiredRelation)) {
        issue('link.requiredRelation', 'a valid required relation is mandatory')
      }
    }
  } else if (manifest.link !== undefined) {
    issue('link', 'only link modules may declare a destination')
  }
  return issues
}
