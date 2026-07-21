import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  NETFLIX_SAMPLE_RAILS,
  NETFLIX_SAMPLE_TITLES,
  NetflixShowcase,
  resolveNetflixRails,
  selectNetflixTitles,
  type NetflixRail,
  type NetflixTitle,
} from '../../examples/clones/netflix/NetflixShowcase'

describe('NetflixShowcase', () => {
  it('projects the neutral title catalog into product destinations', () => {
    const shows = selectNetflixTitles(NETFLIX_SAMPLE_TITLES, 'shows')
    const movies = selectNetflixTitles(NETFLIX_SAMPLE_TITLES, 'movies')
    const fresh = selectNetflixTitles(NETFLIX_SAMPLE_TITLES, 'new')
    const myList = selectNetflixTitles(NETFLIX_SAMPLE_TITLES, 'my-list')

    expect(shows.every(title => title.kind === 'series')).toBe(true)
    expect(movies.every(title => title.kind === 'movie')).toBe(true)
    expect(fresh.every(title => title.isNew || title.top10Rank !== undefined)).toBe(true)
    expect(myList.every(title => title.myList)).toBe(true)
    expect(myList.map(title => title.id)).toContain('field-notes')
  })

  it('searches titles, synopses, genres, cast, and languages', () => {
    expect(
      selectNetflixTitles(NETFLIX_SAMPLE_TITLES, 'home', 'coast')
        .map(title => title.id),
    ).toEqual(['field-notes', 'signal-coast', 'wild-current', 'long-weekend', 'driftline'])
    expect(
      selectNetflixTitles(NETFLIX_SAMPLE_TITLES, 'home', 'Lina Tran')
        .map(title => title.id),
    ).toEqual(['signal-coast'])
  })

  it('removes unavailable cards and empty rails without mutating rail metadata', () => {
    const rails = resolveNetflixRails(NETFLIX_SAMPLE_RAILS, ['field-notes', 'signal-coast'])

    expect(rails.map(rail => rail.id)).toEqual([
      'continue',
      'trending',
      'because-field-notes',
      'new',
      'my-list',
    ])
    expect(rails[0].titleIds).toEqual(['field-notes'])
    expect(NETFLIX_SAMPLE_RAILS[0].titleIds.length).toBeGreaterThan(1)
  })

  it('server-renders the personalized home and discovery destinations', () => {
    const home = renderToStaticMarkup(<NetflixShowcase />)
    const shows = renderToStaticMarkup(<NetflixShowcase initialSection="shows" />)
    const search = renderToStaticMarkup(<NetflixShowcase initialQuery="coast" />)
    const myList = renderToStaticMarkup(<NetflixShowcase initialSection="my-list" />)

    expect(home).toContain('NETFLIX')
    expect(home).toContain('Continue Watching for Jun')
    expect(home).toContain('Top 10 in the U.S. Today')
    expect(home).toContain('Field Notes')
    expect(shows).toContain('Bingeworthy TV Shows')
    expect(shows).not.toContain('Popular Movies')
    expect(search).toContain('Explore titles related to: “coast”')
    expect(search).toContain('Signal Coast')
    expect(myList).toContain('My List')
    expect(myList).toContain('Pattern Language')
  })

  it('renders title details, playback chrome, and profile selection', () => {
    const details = renderToStaticMarkup(
      <NetflixShowcase initialSelectedId="field-notes" />,
    )
    const player = renderToStaticMarkup(
      <NetflixShowcase initialPlayerId="field-notes" />,
    )
    const profiles = renderToStaticMarkup(
      <NetflixShowcase initialProfileGate />,
    )

    expect(details).toContain('Details for Field Notes')
    expect(details).toContain('Episodes')
    expect(details).toContain('The Quiet Coast')
    expect(details).toContain('98% Match')
    expect(player).toContain('Playing Field Notes')
    expect(player).toContain('Next Episode')
    expect(player).toContain('Skip Intro')
    expect(profiles).toContain('Who&#x27;s watching?')
    expect(profiles).toContain('Manage Profiles')
    expect(profiles).toContain('Jun')
  })

  it('accepts host-provided catalog and rails without leaking sample titles', () => {
    const title: NetflixTitle = {
      id: 'host-film',
      title: 'Host Operations Film',
      kind: 'movie',
      synopsis: 'A host-provided streaming title.',
      year: 2026,
      maturity: 'PG',
      match: 91,
      genres: ['Documentary'],
      scene: 'studio',
      durationMinutes: 82,
      myList: true,
    }
    const rails: readonly NetflixRail[] = [{
      id: 'host-rail',
      title: 'Host recommendations',
      titleIds: [title.id],
    }]
    const html = renderToStaticMarkup(<NetflixShowcase rails={rails} titles={[title]} />)

    expect(html).toContain('Host Operations Film')
    expect(html).toContain('Host recommendations')
    expect(html).not.toContain('Field Notes')
    expect(html).not.toContain('Signal Coast')
  })
})
