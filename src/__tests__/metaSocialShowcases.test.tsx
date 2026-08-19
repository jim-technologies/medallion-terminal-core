import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  META_SOCIAL_VIEWS,
  MetaSocialShowcase,
  resolveMetaSocialView,
  type MetaSocialAuthor,
  type MetaSocialPost,
  type MetaSocialProduct,
  type MetaSocialStory,
  type MetaSocialSuggestion,
} from '../../examples/clones/meta/shared/MetaSocialShowcase'

const PRODUCTS = Object.keys(META_SOCIAL_VIEWS) as MetaSocialProduct[]

describe('Meta social showcases', () => {
  it('documents each product view and safely falls back to its default', () => {
    expect(META_SOCIAL_VIEWS).toEqual({
      instagram: ['feed', 'explore', 'profile'],
      facebook: ['feed', 'groups', 'business-page'],
      threads: ['for-you', 'following', 'profile'],
    })

    for (const product of PRODUCTS) {
      const views = META_SOCIAL_VIEWS[product]
      for (const view of views) {
        expect(resolveMetaSocialView(product, view)).toBe(view)
      }
      expect(resolveMetaSocialView(product, 'unsupported-view')).toBe(views[0])
      expect(resolveMetaSocialView(product)).toBe(views[0])
    }
  })

  it('server-renders all nine product views with stable identity markers', () => {
    for (const product of PRODUCTS) {
      for (const view of META_SOCIAL_VIEWS[product]) {
        const html = renderToStaticMarkup(
          <MetaSocialShowcase product={product} initialView={view} />,
        )

        expect(html, `${product}/${view}`).toContain(`data-product="meta-${product}"`)
        expect(html, `${product}/${view}`).toContain(`data-view="${view}"`)
        expect(html, `${product}/${view}`).toContain('Jun')
        expect(html, `${product}/${view}`).toContain('Jim Technologies')
      }
    }
  })

  it('keeps every surface recognizable with original fixture content', () => {
    const expectedCopy: Record<MetaSocialProduct, readonly string[]> = {
      instagram: ['Instagram', 'Suggested for you', 'View all 96 comments'],
      facebook: ['Facebook', 'What&#x27;s on your mind, Jun?', 'Sponsored'],
      threads: ['Threads', 'For you', 'Start a thread...'],
    }

    for (const product of PRODUCTS) {
      const html = renderToStaticMarkup(<MetaSocialShowcase product={product} />)
      for (const copy of expectedCopy[product]) {
        expect(html, `${product}: ${copy}`).toContain(copy)
      }
    }
  })

  it('renders host-supplied records instead of depending on bundled fixtures', () => {
    const customAuthor: MetaSocialAuthor = {
      id: 'customer-team',
      name: 'Customer Team',
      handle: 'customerteam',
      subtitle: 'Operations',
      verified: true,
      color: '#375f78',
    }
    const customPosts: readonly MetaSocialPost[] = [{
      id: 'customer-update',
      author: customAuthor,
      body: 'A host-provided customer launch update.',
      timestamp: 'now',
      likes: 12,
      comments: 3,
      shares: 1,
      following: true,
    }]
    const customStories: readonly MetaSocialStory[] = [{
      id: 'customer-story',
      author: customAuthor,
      title: 'Customer story',
      imageUrl: '/examples/media-demo.svg#harbor',
    }]
    const customSuggestions: readonly MetaSocialSuggestion[] = [{
      id: 'customer-suggestion',
      author: customAuthor,
      reason: 'Provided by the host',
    }]
    const html = renderToStaticMarkup(
      <MetaSocialShowcase
        product="instagram"
        posts={customPosts}
        stories={customStories}
        suggestions={customSuggestions}
        companyName="Customer Company"
        userName="Alex"
      />,
    )

    expect(html).toContain('A host-provided customer launch update.')
    expect(html).toContain('Customer story')
    expect(html).toContain('Provided by the host')
    expect(html).toContain('Alex')
    expect(html).not.toContain('A calmer operating system')
  })
})
