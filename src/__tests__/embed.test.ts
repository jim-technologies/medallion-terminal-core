import { describe, it, expect } from 'vitest'
import { parseEmbedConfig, buildEmbedUrl } from '../embed/embedConfig'
import {
  buildBiDescriptor,
  descriptorToJson,
  connectionFields,
  type SourceLike,
} from '../bi/connector'

// =============================================================
// Embed config parsing + round-trip, and the BI-connector descriptor
// builder. Pure logic — no DOM, runs in the default node environment.
// =============================================================

describe('parseEmbedConfig', () => {
  it('parses a single-widget embed with source id + ctx + chrome', () => {
    const c = parseEmbedConfig('?src=btc_px&component=candlestick&backend=https://api.example.com&ctx.symbol=BTC&ctx.range=1d&stream=1')
    expect(c.widget).toBeDefined()
    expect(c.widget!.sourceId).toBe('btc_px')
    expect(c.widget!.component).toBe('candlestick')
    expect(c.widget!.stream).toBe(true)
    expect(c.backendUrl).toBe('https://api.example.com')
    expect(c.ctx).toEqual({ symbol: 'BTC', range: '1d' })
    expect(c.chrome).toBe('none')
    expect(c.theme).toBe('dark')
  })

  it('defaults component to table and chrome to none', () => {
    const c = parseEmbedConfig('?src=positions')
    expect(c.widget!.component).toBe('table')
    expect(c.chrome).toBe('none')
    expect(c.widget!.stream).toBe(false)
  })

  it('parses chrome=full and refreshMs', () => {
    const c = parseEmbedConfig('src=x&chrome=full&refreshMs=5000')
    expect(c.chrome).toBe('full')
    expect(c.widget!.refreshIntervalMs).toBe(5000)
  })

  it('accepts operator and light themes and falls back safely', () => {
    expect(parseEmbedConfig('src=x&theme=operator').theme).toBe('operator')
    expect(parseEmbedConfig('src=x&theme=light').theme).toBe('light')
    expect(parseEmbedConfig('src=x&theme=unknown').theme).toBe('dark')
  })

  it('ignores a non-positive / non-numeric refreshMs', () => {
    expect(parseEmbedConfig('src=x&refreshMs=0').widget!.refreshIntervalMs).toBeUndefined()
    expect(parseEmbedConfig('src=x&refreshMs=abc').widget!.refreshIntervalMs).toBeUndefined()
  })

  it('parses a full-dashboard embed via template url', () => {
    const c = parseEmbedConfig('?template=/examples/crypto.json&ctx.symbol=ETH')
    expect(c.templateUrl).toBe('/examples/crypto.json')
    expect(c.widget).toBeUndefined()
    expect(c.ctx).toEqual({ symbol: 'ETH' })
  })

  it('returns no widget/template when no data source is given', () => {
    const c = parseEmbedConfig('?title=hello')
    expect(c.widget).toBeUndefined()
    expect(c.templateUrl).toBeUndefined()
    expect(c.title).toBe('hello')
  })
})

describe('buildEmbedUrl round-trips parseEmbedConfig', () => {
  it('rebuilds a single-widget config', () => {
    const url = buildEmbedUrl('https://terminal.example.com/embed.html', {
      widget: { component: 'timeseries', sourceId: 'px', stream: true, refreshIntervalMs: 2000 },
      backendUrl: 'https://api.example.com',
      ctx: { symbol: 'SOL' },
      chrome: 'none',
      theme: 'operator',
    })
    const c = parseEmbedConfig(new URL(url).search)
    expect(c.widget!.component).toBe('timeseries')
    expect(c.widget!.sourceId).toBe('px')
    expect(c.widget!.stream).toBe(true)
    expect(c.widget!.refreshIntervalMs).toBe(2000)
    expect(c.backendUrl).toBe('https://api.example.com')
    expect(c.ctx).toEqual({ symbol: 'SOL' })
    expect(c.theme).toBe('operator')
  })

  it('rebuilds a template config with full chrome', () => {
    const url = buildEmbedUrl('/embed.html', {
      templateUrl: '/d.json',
      chrome: 'full',
      ctx: {},
    })
    const c = parseEmbedConfig(url.slice(url.indexOf('?')))
    expect(c.templateUrl).toBe('/d.json')
    expect(c.chrome).toBe('full')
  })
})

const SOURCES: SourceLike[] = [
  {
    id: 'btc_candles',
    name: 'BTC Candles',
    description: 'OHLCV bars',
    shape: 'SHAPE_CANDLES',
    streamable: true,
    tags: ['crypto'],
    params: [
      { key: 'range', required: false, default_value: '1d', type: 'PARAM_TYPE_DURATION' },
      { key: 'limit', required: false, type: 'PARAM_TYPE_INTEGER' },
    ],
  },
  {
    id: 'positions',
    name: 'Open Positions',
    shape: 'SHAPE_TABLE',
  },
]

describe('buildBiDescriptor', () => {
  it('builds a connect descriptor with precomputed Get URL', () => {
    const d = buildBiDescriptor(SOURCES, { name: 'Medallion', endpoint: 'https://api.example.com/' })
    expect(d.version).toBe(1)
    expect(d.protocol).toBe('connect')
    expect(d.endpoint).toBe('https://api.example.com')
    expect(d.service).toBe('medallion.terminal.v1.TerminalService')
    expect(d.getUrl).toBe('https://api.example.com/medallion.terminal.v1.TerminalService/Get')
    expect(d.tables).toHaveLength(2)
  })

  it('derives candle columns from the shape and marks the time column', () => {
    const d = buildBiDescriptor(SOURCES, { name: 'M', endpoint: 'https://api.example.com' })
    const candles = d.tables.find((t) => t.id === 'btc_candles')!
    expect(candles.columns.map((c) => c.name)).toEqual(['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    expect(candles.columns[0].isTime).toBe(true)
    expect(candles.streamable).toBe(true)
  })

  it('maps params to BI column types', () => {
    const d = buildBiDescriptor(SOURCES, { name: 'M', endpoint: 'https://api.example.com' })
    const candles = d.tables.find((t) => t.id === 'btc_candles')!
    const limit = candles.params!.find((p) => p.key === 'limit')!
    expect(limit.type).toBe('integer')
    const range = candles.params!.find((p) => p.key === 'range')!
    expect(range.defaultValue).toBe('1d')
  })

  it('normalizes protobuf runtime enums and canonical lowerCamelCase params', () => {
    const d = buildBiDescriptor([{
      id: 'runtime-candles',
      shape: 2,
      params: [{
        key: 'range',
        type: 6,
        defaultValue: '1d',
        enumValues: ['1d', '5d'],
      }],
    }], { name: 'M', endpoint: '' })
    expect(d.tables[0].shape).toBe('SHAPE_CANDLES')
    expect(d.tables[0].columns.map(column => column.name)).toEqual([
      'timestamp', 'open', 'high', 'low', 'close', 'volume',
    ])
    expect(d.tables[0].params?.[0]).toMatchObject({
      defaultValue: '1d',
      enumValues: ['1d', '5d'],
    })
  })

  it('leaves table-shaped columns empty for connector inference', () => {
    const d = buildBiDescriptor(SOURCES, { name: 'M', endpoint: 'https://api.example.com' })
    const positions = d.tables.find((t) => t.id === 'positions')!
    expect(positions.columns).toEqual([])
  })

  it('declares the stable geospatial export columns', () => {
    const descriptor = buildBiDescriptor([{
      id: 'sites',
      shape: 'SHAPE_GEO',
    }], { name: 'M', endpoint: 'https://api.example.com' })
    expect(descriptor.tables[0].columns.map(column => column.name)).toEqual([
      'id',
      'label',
      'geometry_type',
      'geometry',
      'status',
      'value',
      'context',
    ])
  })

  it('declares the stable media-library export columns', () => {
    const descriptor = buildBiDescriptor([{
      id: 'media',
      shape: 'SHAPE_MEDIA',
    }], { name: 'M', endpoint: 'https://api.example.com' })
    expect(descriptor.tables[0].columns.map(column => column.name)).toEqual([
      'id',
      'title',
      'kind',
      'url',
      'thumbnail_url',
      'captured_at',
      'created_at',
      'content_type',
      'width',
      'height',
      'duration_seconds',
      'favorite',
      'tags',
      'collection_ids',
      'metadata',
      'context',
    ])
  })

  it('declares the stable conversation export columns', () => {
    const descriptor = buildBiDescriptor([{
      id: 'conversations',
      shape: 'SHAPE_CONVERSATION',
    }], { name: 'M', endpoint: 'https://api.example.com' })
    expect(descriptor.tables[0].columns.map(column => column.name)).toEqual([
      'conversation_id',
      'id',
      'timestamp',
      'sender_id',
      'sender_name',
      'kind',
      'body',
      'reply_to_id',
      'edited',
      'status',
      'attachments',
      'reactions',
      'thread_reply_count',
      'metadata',
      'context',
    ])
  })

  it('omits connect fields for a sql-protocol descriptor', () => {
    const d = buildBiDescriptor(SOURCES, { name: 'M', endpoint: 'https://sql.example.com', protocol: 'sql' })
    expect(d.protocol).toBe('sql')
    expect(d.getUrl).toBeUndefined()
    expect(d.service).toBeUndefined()
  })

  it('serializes to JSON and round-trips', () => {
    const d = buildBiDescriptor(SOURCES, { name: 'M', endpoint: 'https://api.example.com' })
    expect(JSON.parse(descriptorToJson(d))).toEqual(d)
  })
})

describe('connectionFields', () => {
  it('lists the connect connection settings', () => {
    const d = buildBiDescriptor(SOURCES, { name: 'M', endpoint: 'https://api.example.com' })
    const labels = connectionFields(d).map((f) => f.label)
    expect(labels).toContain('Get RPC URL')
    expect(labels).toContain('Method')
    expect(labels).toContain('Tables')
  })

  it('surfaces a bearer auth hint', () => {
    const d = buildBiDescriptor(SOURCES, {
      name: 'M',
      endpoint: 'https://api.example.com',
      auth: { kind: 'bearer' },
    })
    const auth = connectionFields(d).find((f) => f.label === 'Auth')!
    expect(auth.value).toContain('Bearer')
  })
})
