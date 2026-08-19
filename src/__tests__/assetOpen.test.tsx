import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  AssetOpenProvider,
  assetApplicationSupports,
  assetKindMatches,
  assetMimeMatches,
  defaultAssetOpenDecision,
  normalizeAssetOpenResolution,
  useAssetOpen,
  type AssetAppRendererProps,
  type AssetOpenRequest,
} from '../core/AssetOpen'
import {
  DashboardContext,
  DEFAULT_DASHBOARD_CONTEXT,
} from '../core/DashboardContext'
import { FileBrowser } from '../widgets/FileBrowser'

const videoRequest: AssetOpenRequest = {
  asset: {
    id: 'asset-1',
    name: 'launch-reel.mp4',
    kind: 'video',
    contentType: 'video/mp4; charset=binary',
  },
  intent: 'play',
}

function StubRenderer({ asset }: AssetAppRendererProps) {
  return <div>{asset.name}</div>
}

describe('asset application matching', () => {
  it('matches exact, wildcard, and parameterized MIME types', () => {
    expect(assetMimeMatches(['video/mp4'], 'video/mp4; charset=binary')).toBe(true)
    expect(assetMimeMatches(['video/*'], 'video/webm')).toBe(true)
    expect(assetMimeMatches(['*/*'], 'application/pdf')).toBe(true)
    expect(assetMimeMatches(['image/*'], 'video/mp4')).toBe(false)
    expect(assetMimeMatches(['video/*'], undefined)).toBe(false)
    expect(assetMimeMatches(undefined, undefined)).toBe(true)
  })

  it('checks both intent and MIME declarations', () => {
    expect(assetApplicationSupports({
      id: 'player',
      name: 'Player',
      renderer: 'video',
      accepts: ['video/*'],
      intents: ['play'],
    }, videoRequest)).toBe(true)

    expect(assetApplicationSupports({
      id: 'editor',
      name: 'Editor',
      renderer: 'video',
      accepts: ['video/*'],
      intents: ['edit'],
    }, videoRequest)).toBe(false)
  })

  it('matches semantic kinds independently of filenames and MIME types', () => {
    expect(assetKindMatches(['movie'], 'MOVIE')).toBe(true)
    expect(assetKindMatches(['*'], 'ontology.object')).toBe(true)
    expect(assetKindMatches(['database'], 'movie')).toBe(false)
    expect(assetKindMatches(['movie'], undefined)).toBe(false)
    expect(assetKindMatches(undefined, undefined)).toBe(true)

    expect(assetApplicationSupports({
      id: 'ontology',
      name: 'Ontology',
      renderer: 'ontology',
      acceptsKinds: ['ontology.object'],
      intents: ['inspect'],
    }, {
      asset: { id: 'object-42', name: 'Quarterly budget', kind: 'ontology.object' },
      intent: 'inspect',
    })).toBe(true)
  })
})

describe('asset resolver normalization', () => {
  it('rejects malformed, duplicate, and incompatible applications', () => {
    const resolution = normalizeAssetOpenResolution({
      applications: [
        null,
        {
          id: 'jim-player',
          name: 'Jim Player',
          renderer: 'jim-video',
          accepts: ['video/*'],
          accepts_kinds: ['video'],
          intents: ['play'],
          launchContext: { grant: 'short-lived' },
        },
        {
          id: 'jim-player',
          name: 'Duplicate',
          renderer: 'duplicate',
        },
        {
          id: 'photo-editor',
          name: 'Photo Editor',
          renderer: 'photo',
          accepts: ['image/*'],
        },
        {
          id: 'wrong-intent',
          name: 'Video Editor',
          renderer: 'editor',
          intents: ['edit'],
        },
        { id: '', name: 'Missing id', renderer: 'bad' },
      ],
      preferredApplicationId: 'jim-player',
    }, videoRequest)

    expect(resolution).toEqual({
      applications: [{
        id: 'jim-player',
        name: 'Jim Player',
        renderer: 'jim-video',
        description: undefined,
        icon: undefined,
        accepts: ['video/*'],
        acceptsKinds: ['video'],
        intents: ['play'],
        launchContext: { grant: 'short-lived' },
      }],
      preferredApplicationId: 'jim-player',
    })
  })

  it('drops a preferred id that is not an eligible candidate', () => {
    expect(normalizeAssetOpenResolution({
      applications: [{
        id: 'viewer',
        name: 'Viewer',
        renderer: 'viewer',
      }],
      preferredApplicationId: 'not-installed-here',
    }, videoRequest).preferredApplicationId).toBeUndefined()
  })
})

describe('default asset-open policy', () => {
  const applications = [
    { id: 'one', name: 'One', renderer: 'one' },
    { id: 'two', name: 'Two', renderer: 'two' },
  ]

  it('uses an explicit preferred workspace application first', () => {
    expect(defaultAssetOpenDecision({
      applications,
      preferredApplicationId: 'two',
    }, {
      native: () => {},
    })).toEqual({ kind: 'application', application: applications[1] })
  })

  it('keeps native behavior when apps are installed but no preference exists', () => {
    expect(defaultAssetOpenDecision({ applications }, {
      native: () => {},
    })).toEqual({ kind: 'native' })
  })

  it('selects the only app without native support and otherwise asks', () => {
    expect(defaultAssetOpenDecision({
      applications: [applications[0]],
    })).toEqual({ kind: 'application', application: applications[0] })
    expect(defaultAssetOpenDecision({ applications })).toEqual({ kind: 'choose' })
  })

  it('uses download only after app and native options are exhausted', () => {
    expect(defaultAssetOpenDecision({ applications: [] }, {
      download: () => {},
    })).toEqual({ kind: 'download' })
  })
})

describe('AssetOpenProvider scoping', () => {
  function Availability() {
    return <span>{useAssetOpen().available ? 'available' : 'native-only'}</span>
  }

  it('keeps application capability inside one provider instance', () => {
    const html = renderToStaticMarkup(
      <>
        <AssetOpenProvider
          resolveAssetIntent={() => ({ applications: [] })}
          renderers={{ video: StubRenderer }}
        >
          <Availability />
        </AssetOpenProvider>
        <Availability />
      </>,
    )

    expect(html).toContain('<span>available</span><span>native-only</span>')
  })

  it('lets FileBrowser expose Open with only when the host resolver exists', () => {
    const file = {
      entries: [{
        kind: 'file',
        name: 'launch-reel.mp4',
        content_type: 'video/mp4',
      }],
    }
    const nativeOnly = renderToStaticMarkup(
      <DashboardContext.Provider value={DEFAULT_DASHBOARD_CONTEXT}>
        <FileBrowser data={file} />
      </DashboardContext.Provider>,
    )
    const modular = renderToStaticMarkup(
      <DashboardContext.Provider value={DEFAULT_DASHBOARD_CONTEXT}>
        <AssetOpenProvider
          resolveAssetIntent={() => ({ applications: [] })}
          renderers={{ video: StubRenderer }}
        >
          <FileBrowser data={file} />
        </AssetOpenProvider>
      </DashboardContext.Provider>,
    )

    expect(nativeOnly).not.toContain('with another application')
    expect(modular).toContain('Open launch-reel.mp4 with another application')
  })
})
