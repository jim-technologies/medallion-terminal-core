import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  BACKSTAGE_SAMPLE_ENTITIES,
  BackstageShowcase,
  resolveBackstageRelations,
  selectBackstageEntities,
  type BackstageDocument,
  type BackstageEntity,
  type BackstageTemplate,
} from '../../examples/clones/spotify/backstage/BackstageShowcase'

describe('BackstageShowcase', () => {
  it('filters neutral catalog metadata by query, kind, ownership, and stars', () => {
    const services = selectBackstageEntities(BACKSTAGE_SAMPLE_ENTITIES, '', {
      kind: 'Component',
      scope: 'all',
    })
    const owned = selectBackstageEntities(BACKSTAGE_SAMPLE_ENTITIES, '', {
      kind: 'All',
      owner: 'platform-experience',
      scope: 'owned',
    })
    const starred = selectBackstageEntities(BACKSTAGE_SAMPLE_ENTITIES, '', {
      kind: 'All',
      scope: 'starred',
    })
    const customer = selectBackstageEntities(BACKSTAGE_SAMPLE_ENTITIES, 'kubernetes', {
      kind: 'All',
      scope: 'all',
    })

    expect(services.every(entity => entity.kind === 'Component')).toBe(true)
    expect(owned.every(entity => entity.owner === 'platform-experience')).toBe(true)
    expect(starred.every(entity => entity.starred)).toBe(true)
    expect(customer.map(entity => entity.id)).toContain('component.customer-gateway')
  })

  it('resolves stable upstream and downstream topology relationships', () => {
    const gateway = BACKSTAGE_SAMPLE_ENTITIES.find(
      entity => entity.id === 'component.customer-gateway',
    )
    expect(gateway).toBeDefined()

    const relationships = resolveBackstageRelations(BACKSTAGE_SAMPLE_ENTITIES, gateway!)
    expect(relationships.upstream.map(entity => entity.id)).toEqual([
      'resource.customer-database',
      'component.identity-service',
    ])
    expect(relationships.downstream.map(entity => entity.id)).toContain('component.web-console')
  })

  it('server-renders catalog, entity plugins, templates, topology, and TechDocs', () => {
    const catalog = renderToStaticMarkup(<BackstageShowcase />)
    const overview = renderToStaticMarkup(<BackstageShowcase initialView="entity" />)
    const topology = renderToStaticMarkup(
      <BackstageShowcase initialEntityTab="dependencies" initialView="entity" />,
    )
    const kubernetes = renderToStaticMarkup(
      <BackstageShowcase initialEntityTab="kubernetes" initialView="entity" />,
    )
    const create = renderToStaticMarkup(<BackstageShowcase initialView="create" />)
    const scaffolder = renderToStaticMarkup(
      <BackstageShowcase initialTemplateId="typescript-service" initialView="create" />,
    )
    const docs = renderToStaticMarkup(<BackstageShowcase initialView="docs" />)

    expect(catalog).toContain('data-product="spotify-backstage"')
    expect(catalog).toContain('Software Catalog')
    expect(catalog).toContain('customer-gateway')
    expect(overview).toContain('Latest workflow runs')
    expect(overview).toContain('View TechDocs')
    expect(topology).toContain('System topology')
    expect(topology).toContain('Customer Database')
    expect(kubernetes).toContain('6 / 6 pods ready')
    expect(create).toContain('Create a new component')
    expect(create).toContain('TypeScript service')
    expect(scaffolder).toContain('Service details')
    expect(scaffolder).toContain('Review and create')
    expect(docs).toContain('Docs like code for Jim Technologies')
    expect(docs).toContain('Local development')
  })

  it('accepts host-provided catalog, template, and documentation data', () => {
    const entity: BackstageEntity = {
      id: 'component.host-service',
      name: 'host-service',
      title: 'Host Service',
      kind: 'Component',
      type: 'service',
      lifecycle: 'experimental',
      owner: 'host-team',
      description: 'A host-provided catalog entity.',
      tags: ['host'],
      health: 'healthy',
    }
    const template: BackstageTemplate = {
      id: 'host-template',
      title: 'Host Template',
      description: 'A host-owned golden path.',
      owner: 'host-team',
      type: 'Service',
      tags: ['host'],
      steps: ['Details', 'Review'],
      icon: 'box',
    }
    const document: BackstageDocument = {
      id: 'host-docs',
      title: 'Host Documentation',
      entityId: entity.id,
      description: 'Host-authored operational guidance.',
      owner: 'host-team',
      updatedAt: 'Now',
      sections: ['Overview'],
    }

    const catalog = renderToStaticMarkup(
      <BackstageShowcase entities={[entity]} initialEntityId={entity.id} />,
    )
    const create = renderToStaticMarkup(
      <BackstageShowcase entities={[entity]} initialView="create" templates={[template]} />,
    )
    const docs = renderToStaticMarkup(
      <BackstageShowcase
        documents={[document]}
        entities={[entity]}
        initialDocumentId={document.id}
        initialView="docs"
      />,
    )

    expect(catalog).toContain('host-service')
    expect(catalog).not.toContain('customer-gateway')
    expect(create).toContain('Host Template')
    expect(create).not.toContain('TypeScript service')
    expect(docs).toContain('Host Documentation')
    expect(docs).not.toContain('Identity Service')
  })
})
