import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CLONE_DEMO_IDENTITY } from '../../examples/clones/demoIdentity'
import {
  FOUNDRY_SAMPLE_OBJECT_TYPES,
  FoundryShowcase,
  foundryOntologyReadiness,
  selectFoundryObjectTypes,
  type FoundryObjectTypeDefinition,
} from '../../examples/clones/palantir/foundry/FoundryShowcase'
import {
  PALANTIR_SAMPLE_CAPABILITIES,
  PALANTIR_SAMPLE_RESOURCES,
  PalantirFoundationShowcase,
  palantirReadinessSummary,
  selectPalantirCompassResources,
  type PalantirCompassResource,
  type PalantirDataConnection,
  type PalantirRepositoryEntry,
} from '../../examples/clones/palantir/foundry/PalantirFoundationShowcase'
import {
  SHOPIFY_SAMPLE_INVENTORY,
  SHOPIFY_SAMPLE_ORDERS,
  ShopifyShowcase,
  selectShopifyOrders,
  shopifyInventoryRisk,
  type ShopifyOrder,
} from '../../examples/clones/shopify/ShopifyShowcase'
import {
  STRIPE_SAMPLE_PAYMENTS,
  StripeShowcase,
  selectStripePayments,
  stripeNetVolume,
  type StripePayment,
} from '../../examples/clones/stripe/StripeShowcase'
import {
  INTERCOM_SAMPLE_CONVERSATIONS,
  IntercomShowcase,
  intercomSlaRiskCount,
  selectIntercomConversations,
  type IntercomConversation,
} from '../../examples/clones/intercom/IntercomShowcase'
import {
  GoogleMapsTimelineShowcase,
  TIMELINE_SAMPLE_DAYS,
  selectTimelineDay,
  timelineDayTotals,
  type TimelineDay,
} from '../../examples/clones/google/maps/GoogleMapsTimelineShowcase'
import {
  formatOperationalCurrency,
  formatOperationalPercent,
  operationalShowcaseInitials,
} from '../../examples/clones/shared/OperationalShowcasePrimitives'

describe('operational product showcase primitives', () => {
  it('formats neutral presentation values and keeps one canonical demo identity', () => {
    expect(CLONE_DEMO_IDENTITY).toEqual({
      company: 'Jim Technologies',
      user: 'Jun',
      website: 'jimtech.xyz',
      email: 'jun@example.test',
    })
    expect(operationalShowcaseInitials(CLONE_DEMO_IDENTITY.company)).toBe('JT')
    expect(formatOperationalCurrency(48_621, { cents: true })).toBe('$48,621.00')
    expect(formatOperationalCurrency(86_420, { compact: true })).toBe('$86.4K')
    expect(formatOperationalPercent(0.968)).toBe('96.8%')
  })
})

describe('PalantirFoundationShowcase', () => {
  it('searches Compass resources and reports explicit presentation readiness', () => {
    expect(
      selectPalantirCompassResources(PALANTIR_SAMPLE_RESOURCES, 'python')
        .map(resource => resource.id),
    ).toEqual(['analytics-repository'])
    expect(
      selectPalantirCompassResources(PALANTIR_SAMPLE_RESOURCES, '', 'Media set')
        .map(resource => resource.id),
    ).toEqual(['field-media'])
    expect(palantirReadinessSummary(PALANTIR_SAMPLE_CAPABILITIES)).toEqual({
      total: 16,
      showcased: 7,
      coreReady: 9,
      missing: 0,
    })
  })

  it('server-renders readiness, Compass, data integration, and repository anatomy', () => {
    const coverage = renderToStaticMarkup(<PalantirFoundationShowcase />)
    const compass = renderToStaticMarkup(
      <PalantirFoundationShowcase initialSurface="compass" />,
    )
    const data = renderToStaticMarkup(
      <PalantirFoundationShowcase initialSurface="data" />,
    )
    const code = renderToStaticMarkup(
      <PalantirFoundationShowcase initialSurface="code" />,
    )

    expect(coverage).toContain('Palantir platform capability map')
    expect(coverage).toContain('Workshop')
    expect(coverage).toContain('Notepad &amp; Fusion')
    expect(coverage).toContain('DevOps, Marketplace &amp; Apollo')
    expect(coverage).toContain('No frontend gaps')
    expect(compass).toContain('Projects and resources')
    expect(compass).toContain('gold.customer_360')
    expect(data).toContain('Data Connection')
    expect(data).toContain('customer_360')
    expect(code).toContain('Pull requests')
    expect(code).toContain('customer_health.py')
  })

  it('accepts host-provided resources, connections, and repository files', () => {
    const resource: PalantirCompassResource = {
      id: 'host-resource',
      name: 'Host planning model',
      kind: 'Dataset',
      project: 'Host project',
      owner: 'Taylor Lane',
      modifiedAt: 'Now',
      status: 'Healthy',
      description: 'A host-provided Compass resource.',
      tags: ['host'],
    }
    const connection: PalantirDataConnection = {
      id: 'host-connection',
      name: 'Host ERP',
      sourceType: 'REST API',
      direction: 'Bidirectional',
      status: 'Connected',
      lastSync: 'Now',
      assets: 4,
      schedule: 'Every hour',
      throughput: '12K rows / day',
    }
    const entry: PalantirRepositoryEntry = {
      path: 'src/host.ts',
      name: 'host.ts',
      kind: 'file',
      depth: 0,
      language: 'TypeScript',
      content: 'export const hostReady = true',
      modifiedAt: 'Now',
    }

    const compass = renderToStaticMarkup(
      <PalantirFoundationShowcase
        resources={[resource]}
        initialSurface="compass"
        initialResourceId="host-resource"
      />,
    )
    const data = renderToStaticMarkup(
      <PalantirFoundationShowcase
        connections={[connection]}
        initialSurface="data"
        initialConnectionId="host-connection"
      />,
    )
    const code = renderToStaticMarkup(
      <PalantirFoundationShowcase
        repositoryEntries={[entry]}
        initialSurface="code"
        initialRepositoryPath="src/host.ts"
      />,
    )

    expect(compass).toContain('Host planning model')
    expect(compass).not.toContain('gold.customer_360')
    expect(data).toContain('Host ERP')
    expect(data).not.toContain('CRM Postgres')
    expect(code).toContain('export const hostReady = true')
    expect(code).not.toContain('customer_health.py')
  })
})

describe('FoundryShowcase', () => {
  it('searches object schemas and summarizes ontology readiness', () => {
    expect(
      selectFoundryObjectTypes(FOUNDRY_SAMPLE_OBJECT_TYPES, 'annual recurring revenue')
        .map(objectType => objectType.id),
    ).toEqual(['customer'])
    expect(foundryOntologyReadiness(FOUNDRY_SAMPLE_OBJECT_TYPES)).toEqual({
      types: 5,
      properties: 24,
      links: 12,
      healthy: 3,
    })
  })

  it('server-renders ontology, object, lineage, and governed-action anatomy', () => {
    const ontology = renderToStaticMarkup(<FoundryShowcase />)
    const objects = renderToStaticMarkup(<FoundryShowcase initialSection="objects" />)
    const lineage = renderToStaticMarkup(<FoundryShowcase initialSection="lineage" />)
    const actions = renderToStaticMarkup(<FoundryShowcase initialSection="actions" />)

    expect(ontology).toContain('Ontology Manager')
    expect(ontology).toContain('gold.customer_360')
    expect(objects).toContain('Object Explorer')
    expect(objects).toContain('Northwind Health')
    expect(lineage).toContain('Data Lineage')
    expect(lineage).toContain('Freshness policy breached')
    expect(actions).toContain('Action Types')
    expect(actions).toContain('Submission controls')
  })

  it('accepts host-provided ontology definitions', () => {
    const objectType: FoundryObjectTypeDefinition = {
      id: 'work-order',
      name: 'Work order',
      pluralName: 'Work orders',
      description: 'A host-provided operational work order.',
      icon: 'W',
      color: '#4f80ae',
      backingDataset: 'gold.work_orders',
      status: 'Healthy',
      properties: [{ id: 'id', name: 'Work order ID', type: 'string', required: true }],
      links: [],
      modifiedAt: 'Now',
      objectCount: 42,
    }
    const html = renderToStaticMarkup(
      <FoundryShowcase objectTypes={[objectType]} initialObjectTypeId="work-order" />,
    )

    expect(html).toContain('Work order')
    expect(html).toContain('gold.work_orders')
    expect(html).not.toContain('Support case')
  })
})

describe('ShopifyShowcase', () => {
  it('filters orders and identifies inventory at or below reorder point', () => {
    expect(
      selectShopifyOrders(SHOPIFY_SAMPLE_ORDERS, 'Maya').map(order => order.id),
    ).toEqual(['order-1057'])
    expect(
      selectShopifyOrders(SHOPIFY_SAMPLE_ORDERS, '', 'Returned').map(order => order.id),
    ).toEqual(['order-1054', 'order-1053'])
    expect(shopifyInventoryRisk(SHOPIFY_SAMPLE_INVENTORY).map(item => item.id)).toEqual([
      'inv-2',
      'inv-3',
      'inv-5',
    ])
  })

  it('server-renders overview, orders, detail, and inventory anatomy', () => {
    const overview = renderToStaticMarkup(<ShopifyShowcase />)
    const orders = renderToStaticMarkup(
      <ShopifyShowcase initialSection="orders" initialSelectedOrderId="" />,
    )
    const detail = renderToStaticMarkup(
      <ShopifyShowcase initialSection="orders" initialSelectedOrderId="order-1057" />,
    )
    const inventory = renderToStaticMarkup(<ShopifyShowcase initialSection="inventory" />)

    expect(overview).toContain('Store performance')
    expect(overview).toContain('ready to fulfill')
    expect(orders).toContain('Search orders')
    expect(orders).toContain('#1057')
    expect(detail).toContain('Fulfill items')
    expect(detail).toContain('Fraud analysis')
    expect(inventory).toContain('Inventory value')
    expect(inventory).toContain('Field Bottle')
  })

  it('accepts host-provided orders', () => {
    const order: ShopifyOrder = {
      id: 'host-order',
      number: '#9001',
      placedAt: 'Now',
      customer: 'Taylor Lane',
      email: 'taylor@example.test',
      total: 760,
      paymentStatus: 'Paid',
      fulfillmentStatus: 'Unfulfilled',
      channel: 'Wholesale',
      destination: 'Reno, NV',
      items: [{
        id: 'host-line',
        name: 'Operations Kit',
        variant: 'Standard',
        sku: 'OPS-STD',
        quantity: 1,
        price: 760,
        color: '#426a85',
      }],
    }
    const html = renderToStaticMarkup(
      <ShopifyShowcase orders={[order]} initialSection="orders" initialSelectedOrderId="" />,
    )

    expect(html).toContain('#9001')
    expect(html).toContain('Taylor Lane')
    expect(html).not.toContain('#1057')
  })
})

describe('StripeShowcase', () => {
  it('filters payment lifecycles and derives net successful volume', () => {
    expect(
      selectStripePayments(STRIPE_SAMPLE_PAYMENTS, '', 'Failed').map(payment => payment.id),
    ).toEqual(['pi_3Qjimtech06'])
    expect(
      selectStripePayments(STRIPE_SAMPLE_PAYMENTS, 'implementation').map(payment => payment.id),
    ).toEqual(['pi_3Qjimtech05'])
    expect(stripeNetVolume(STRIPE_SAMPLE_PAYMENTS)).toBeCloseTo(1847.89, 2)
  })

  it('server-renders revenue, payment, billing, and dispute anatomy', () => {
    const overview = renderToStaticMarkup(<StripeShowcase />)
    const payments = renderToStaticMarkup(<StripeShowcase initialSection="payments" />)
    const detail = renderToStaticMarkup(
      <StripeShowcase initialSection="payments" initialSelectedPaymentId="pi_3Qjimtech01" />,
    )
    const billing = renderToStaticMarkup(<StripeShowcase initialSection="billing" />)
    const disputes = renderToStaticMarkup(<StripeShowcase initialSection="disputes" />)

    expect(overview).toContain('Gross volume')
    expect(overview).toContain('Revenue recovery')
    expect(payments).toContain('Track the full lifecycle')
    expect(detail).toContain('Payment details')
    expect(detail).toContain('Events and logs')
    expect(billing).toContain('Monthly recurring revenue')
    expect(disputes).toContain('Submit evidence by July 23')
  })

  it('accepts host-provided payments', () => {
    const payment: StripePayment = {
      id: 'pi_host',
      createdAt: 'Now',
      customer: 'Taylor Lane',
      email: 'taylor@example.test',
      amount: 125,
      fee: 4.1,
      status: 'Succeeded',
      method: '•••• 4242',
      description: 'Host invoice',
      country: 'US',
      risk: 'Normal',
    }
    const html = renderToStaticMarkup(<StripeShowcase payments={[payment]} initialSection="payments" />)

    expect(html).toContain('Host invoice')
    expect(html).not.toContain('Implementation deposit')
  })
})

describe('IntercomShowcase', () => {
  it('searches conversation context and counts open SLA risks', () => {
    expect(
      selectIntercomConversations(INTERCOM_SAMPLE_CONVERSATIONS, 'inventory')
        .map(conversation => conversation.id),
    ).toEqual(['conv-1040'])
    expect(
      selectIntercomConversations(INTERCOM_SAMPLE_CONVERSATIONS, '', 'Open')
        .map(conversation => conversation.id),
    ).toEqual(['conv-1042', 'conv-1041', 'conv-1038'])
    expect(intercomSlaRiskCount(INTERCOM_SAMPLE_CONVERSATIONS)).toBe(2)
  })

  it('server-renders shared inbox, tickets, composer, and reporting anatomy', () => {
    const inbox = renderToStaticMarkup(<IntercomShowcase />)
    const tickets = renderToStaticMarkup(
      <IntercomShowcase initialSection="tickets" initialSelectedConversationId="conv-1041" />,
    )
    const reporting = renderToStaticMarkup(<IntercomShowcase initialSection="reporting" />)

    expect(inbox).toContain('Unable to update delivery address')
    expect(inbox).toContain('Use CtrlK for shortcuts')
    expect(inbox).toContain('Conversation attributes')
    expect(tickets).toContain('Billing request')
    expect(tickets).toContain('Submitted')
    expect(reporting).toContain('Median first response')
    expect(reporting).toContain('Team workload')
  })

  it('accepts host-provided conversations', () => {
    const conversation: IntercomConversation = {
      id: 'host-conversation',
      subject: 'Host support request',
      preview: 'A customer-provided support conversation.',
      customer: 'Taylor Lane',
      email: 'taylor@example.test',
      company: 'Example Manufacturing',
      channel: 'Email',
      state: 'Open',
      priority: 'Normal',
      assignee: 'Jordan Lee',
      assigneeColor: '#496f9a',
      updatedAt: 'Now',
      waitingMinutes: 4,
      unread: true,
      tags: ['host'],
      attributes: { Tier: 'Growth' },
      messages: [{
        id: 'host-message',
        author: 'Taylor Lane',
        authorRole: 'Customer',
        timestamp: 'Now',
        body: 'This content came from the host application.',
      }],
    }
    const html = renderToStaticMarkup(
      <IntercomShowcase conversations={[conversation]} initialSelectedConversationId="host-conversation" />,
    )

    expect(html).toContain('Host support request')
    expect(html).toContain('This content came from the host application.')
    expect(html).not.toContain('Unable to update delivery address')
  })
})

describe('GoogleMapsTimelineShowcase', () => {
  it('selects timeline days and derives travel, place, and media totals', () => {
    const day = selectTimelineDay(TIMELINE_SAMPLE_DAYS, '2026-07-12')
    expect(day?.label).toBe('Sunday, July 12')
    expect(day && timelineDayTotals(day)).toEqual({
      distanceKm: 21.3,
      travelMinutes: 107,
      places: 4,
      media: 8,
    })
  })

  it('server-renders day history, trip library, places, and provider disclosure', () => {
    const day = renderToStaticMarkup(<GoogleMapsTimelineShowcase />)
    const trips = renderToStaticMarkup(
      <GoogleMapsTimelineShowcase initialSection="trips" />,
    )
    const places = renderToStaticMarkup(
      <GoogleMapsTimelineShowcase initialSection="places" />,
    )

    expect(day).toContain('Your Timeline')
    expect(day).toContain('OpenFreeMap · configurable')
    expect(day).toContain('Coit Tower')
    expect(day).toContain('Photos from this place')
    expect(trips).toContain('San Francisco weekend')
    expect(trips).toContain('Recent trips')
    expect(places).toContain('Search visited places')
    expect(places).toContain('Scenic spot')
  })

  it('accepts host-provided timeline days', () => {
    const day: TimelineDay = {
      id: 'host-day',
      date: '2026-08-01',
      label: 'Saturday, August 1',
      city: 'Reno',
      stops: [{
        id: 'host-place',
        name: 'Host-provided place',
        address: 'Reno, NV',
        category: 'Work',
        arrival: '9:00 AM',
        departure: '10:00 AM',
        durationMinutes: 60,
        latitude: 39.5296,
        longitude: -119.8138,
        mapX: 50,
        mapY: 50,
        confidence: 'Confirmed',
        media: [],
      }],
      trips: [],
    }
    const html = renderToStaticMarkup(
      <GoogleMapsTimelineShowcase
        days={[day]}
        initialDayId="host-day"
        initialSelectedStopId="host-place"
        basemapLabel="Host map provider"
      />,
    )

    expect(html).toContain('Host-provided place')
    expect(html).toContain('Host map provider')
    expect(html).not.toContain('Coit Tower')
  })
})
