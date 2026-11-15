import { describe, expect, it } from 'vitest'
import { fromJson, toJson } from '@bufbuild/protobuf'
import { ExtensionManifestSchema } from '../gen/medallion/extension/v1/manifest_pb'
import { validateExtensionManifest, type ExtensionManifestJson } from '../proto'

function native(): ExtensionManifestJson {
  return {
    id: 'records',
    version: '1.2.3-beta.1+build.42',
    title: 'Records',
    icon: 'table',
    kind: 'EXTENSION_KIND_NATIVE',
    entitlementKey: 'modules:records',
    contributes: {
      routes: ['/w/{workspace}/m/records', '/w/{workspace}/m/records/recent'],
      nav: [{ title: 'Records', path: '/w/{workspace}/m/records' }],
      homeTiles: [{ title: 'Recent records', path: '/w/{workspace}/m/records/recent', icon: 'clock' }],
    },
  }
}

function link(): ExtensionManifestJson {
  return {
    ...native(),
    kind: 'EXTENSION_KIND_LINK',
    link: {
      urlTemplate: 'https://metrics.example.test/d/{workspace}?view=summary',
      requiredRelation: 'can_read',
    },
  }
}

describe('workspace module manifests', () => {
  it('round-trips the canonical generated ProtoJSON contract', () => {
    for (const manifest of [native(), link()]) {
      const json = toJson(ExtensionManifestSchema, fromJson(ExtensionManifestSchema, manifest))
      expect(json).toEqual(manifest)
      expect(validateExtensionManifest(json, { allowedLinkHosts: ['metrics.example.test'] })).toEqual([])
    }
  })

  it('permits hidden native routes without adding navigation or home tiles', () => {
    const manifest = native()
    manifest.contributes = { routes: ['/w/{workspace}/m/records'] }
    expect(validateExtensionManifest(manifest)).toEqual([])
  })

  it.each([null, [], 'records', 3])('refuses malformed manifest %j without throwing', manifest => {
    expect(validateExtensionManifest(manifest)).toEqual([{ path: '', message: 'manifest must be an object' }])
  })

  it.each([null, [], 3, false, {}, { toString: null }, { toString: null, valueOf: null }].map(id => ({ id })))('refuses non-string identity $id without coercion', ({ id }) => {
    const manifest = { ...native(), id }
    expect(() => validateExtensionManifest(manifest)).not.toThrow()
    expect(validateExtensionManifest(manifest)).toContainEqual(expect.objectContaining({ path: 'id' }))
  })

  it.each(['ab', 'Upper', '../records', 'a'.repeat(65), 'records/other'])('refuses invalid identity %s', id => {
    expect(validateExtensionManifest({ ...native(), id })).toContainEqual(expect.objectContaining({ path: 'id' }))
  })

  it.each(['1', '01.2.3', '1.2.3-01', '1.2.3+', '1.2.3-', '1.2.3.4', 'latest'])('refuses non-semver version %s', version => {
    expect(validateExtensionManifest({ ...native(), version })).toContainEqual(expect.objectContaining({ path: 'version' }))
  })

  it.each(['', 'EXTENSION_KIND_UNSPECIFIED', 'EXTENSION_KIND_FRAME', 1])('refuses undeclared presentation kind %s', kind => {
    expect(validateExtensionManifest({ ...native(), kind })).toContainEqual(expect.objectContaining({ path: 'kind' }))
  })

  it.each([
    '/w/{workspace}/m/other',
    '/w/{workspace}/m/records-other',
    '/w/other/m/records',
    '/w/{workspace}/m/records/..',
    '/w/{workspace}/m/records/a/../b',
    '/w/{workspace}/m/records/%2e%2e',
    '/w/{workspace}/m/records/%252fadmin',
    '/w/{workspace}/m/records//child',
    '/w/{workspace}/m/records/',
    '/w/{workspace}/m/records?next=other',
    '/w/{workspace}/m/records#other',
    '/w/{workspace}/m/records/child\\other',
  ])('keeps route %s within the owning module', route => {
    const manifest = native()
    manifest.contributes = { routes: [route] }
    expect(validateExtensionManifest(manifest)).toContainEqual(expect.objectContaining({ path: 'contributes.routes[0]' }))
  })

  it('refuses duplicate routes and undeclared navigation/home targets', () => {
    const manifest = native()
    manifest.contributes!.routes!.push('/w/{workspace}/m/records')
    manifest.contributes!.nav![0]!.path = '/w/{workspace}/m/other'
    manifest.contributes!.homeTiles![0]!.path = '/w/{workspace}/m/records/missing'
    expect(validateExtensionManifest(manifest).map(issue => issue.path)).toEqual([
      'contributes.routes[2]', 'contributes.nav[0].path', 'contributes.homeTiles[0].path',
    ])
  })

  it('refuses unimplemented capabilities instead of silently accepting them', () => {
    for (const name of ['runtime', 'capabilities', 'operations', 'viewers', 'commands']) {
      expect(validateExtensionManifest({ ...native(), [name]: [] }))
        .toContainEqual(expect.objectContaining({ path: name }))
    }
    const manifest = native()
    expect(validateExtensionManifest({ ...manifest, contributes: { ...manifest.contributes, commands: [] } }))
      .toContainEqual(expect.objectContaining({ path: 'contributes.commands' }))
  })

  it('fails closed when a link authority is absent from host configuration', () => {
    expect(validateExtensionManifest(link())).toContainEqual(expect.objectContaining({ path: 'link.urlTemplate' }))
    expect(validateExtensionManifest(link(), { allowedLinkHosts: ['other.example.test'] }))
      .toContainEqual(expect.objectContaining({ path: 'link.urlTemplate' }))
    expect(validateExtensionManifest(link(), { allowedLinkHosts: ['METRICS.EXAMPLE.TEST'] })).toEqual([])
  })

  it.each([
    'javascript:alert(1)',
    '//metrics.example.test/path',
    'https://metrics.example.test.evil.test/',
    'https://metrics.example.test@evil.test/',
    'https://user:password@metrics.example.test/',
    'https://@metrics.example.test/',
    'https://:@metrics.example.test/',
    'https://metrics.example.test/#',
    'https://metrics.example.test:8443/',
    'https://{workspace}.metrics.example.test/',
    'https://metrics.example.test/{unresolved}',
    'https://metrics.example.test/#fragment',
    'https://metrics.example.test/ bad',
    'https://metrics.example.test/\\evil',
  ])('refuses unsafe or unconfigured destination %s', urlTemplate => {
    const manifest = link()
    manifest.link!.urlTemplate = urlTemplate
    expect(validateExtensionManifest(manifest, { allowedLinkHosts: ['metrics.example.test'] }))
      .toContainEqual(expect.objectContaining({ path: 'link.urlTemplate' }))
  })

  it.each([
    'https://metrics.example.test/d/@reader/{workspace}',
    'https://metrics.example.test/d/{workspace}?reader=@viewer',
    'https://metrics.example.test/d/%23reader/{workspace}',
    'https://metrics.example.test/d/{workspace}?reader=%23viewer',
  ])('permits @ outside the authority in %s', urlTemplate => {
    const manifest = link()
    manifest.link!.urlTemplate = urlTemplate
    expect(validateExtensionManifest(manifest, { allowedLinkHosts: ['metrics.example.test'] })).toEqual([])
  })

  it('requires the relation on links and refuses destinations on native modules', () => {
    const manifest = link()
    manifest.link!.requiredRelation = ''
    expect(validateExtensionManifest(manifest, { allowedLinkHosts: ['metrics.example.test'] }))
      .toContainEqual(expect.objectContaining({ path: 'link.requiredRelation' }))
    expect(validateExtensionManifest({ ...link(), kind: 'EXTENSION_KIND_NATIVE' }))
      .toContainEqual(expect.objectContaining({ path: 'link' }))
  })

  it('does not accept an image URL as an icon or a blank entitlement', () => {
    expect(validateExtensionManifest({ ...native(), icon: 'https://images.example.test/icon.png', entitlementKey: ' ' }))
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ path: 'icon' }), expect.objectContaining({ path: 'entitlementKey' }),
      ]))
  })
})
