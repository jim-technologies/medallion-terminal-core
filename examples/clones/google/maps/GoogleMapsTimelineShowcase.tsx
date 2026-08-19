import { useMemo, useState, type CSSProperties } from 'react'
import { CLONE_DEMO_IDENTITY } from '../../demoIdentity'
import {
  OperationalShowcaseAvatar,
  OperationalShowcaseIcon,
} from '../../shared/OperationalShowcasePrimitives'
import '../../shared/OperationalShowcases.css'

export type TimelineShowcaseSection = 'day' | 'trips' | 'places'
export type TimelineTravelMode = 'Walking' | 'Driving' | 'Cycling' | 'Transit' | 'Flight'

export interface TimelineMediaItem {
  id: string
  title: string
  kind: 'photo' | 'video'
  color: string
}

export interface TimelineStop {
  id: string
  name: string
  address: string
  category: string
  arrival: string
  departure: string
  durationMinutes: number
  latitude: number
  longitude: number
  mapX: number
  mapY: number
  confidence: 'Confirmed' | 'Estimated'
  media: TimelineMediaItem[]
}

export interface TimelineTrip {
  id: string
  fromStopId: string
  toStopId: string
  mode: TimelineTravelMode
  startTime: string
  endTime: string
  distanceKm: number
  durationMinutes: number
}

export interface TimelineDay {
  id: string
  date: string
  label: string
  city: string
  stops: TimelineStop[]
  trips: TimelineTrip[]
}

export interface GoogleMapsTimelineShowcaseProps {
  days?: readonly TimelineDay[]
  initialSection?: TimelineShowcaseSection
  initialDayId?: string
  initialSelectedStopId?: string
  basemapLabel?: string
  onSelectStop?: (stop: TimelineStop) => void
}

export const TIMELINE_SAMPLE_DAYS: readonly TimelineDay[] = [
  {
    id: '2026-07-12',
    date: '2026-07-12',
    label: 'Sunday, July 12',
    city: 'San Francisco',
    stops: [
      {
        id: 'home',
        name: 'Home',
        address: 'Mission District, San Francisco',
        category: 'Home',
        arrival: '12:00 AM',
        departure: '8:42 AM',
        durationMinutes: 522,
        latitude: 37.7599,
        longitude: -122.4148,
        mapX: 31,
        mapY: 73,
        confidence: 'Confirmed',
        media: [],
      },
      {
        id: 'ferry-building',
        name: 'Ferry Building',
        address: '1 Ferry Building, San Francisco',
        category: 'Landmark',
        arrival: '9:05 AM',
        departure: '10:18 AM',
        durationMinutes: 73,
        latitude: 37.7955,
        longitude: -122.3937,
        mapX: 69,
        mapY: 30,
        confidence: 'Confirmed',
        media: [
          { id: 'market-hall', title: 'Market hall', kind: 'photo', color: '#b78b5f' },
          { id: 'bay-view', title: 'Bay view', kind: 'photo', color: '#6f9fbd' },
        ],
      },
      {
        id: 'coit-tower',
        name: 'Coit Tower',
        address: '1 Telegraph Hill Blvd, San Francisco',
        category: 'Scenic spot',
        arrival: '10:37 AM',
        departure: '11:22 AM',
        durationMinutes: 45,
        latitude: 37.8024,
        longitude: -122.4058,
        mapX: 56,
        mapY: 18,
        confidence: 'Confirmed',
        media: [
          { id: 'skyline', title: 'Skyline', kind: 'photo', color: '#7998a8' },
          { id: 'tower-video', title: 'Tower panorama', kind: 'video', color: '#8c775e' },
          { id: 'bay-bridge', title: 'Bay Bridge', kind: 'photo', color: '#6689a4' },
        ],
      },
      {
        id: 'north-beach',
        name: 'Original Joe’s',
        address: '601 Union Street, San Francisco',
        category: 'Restaurant',
        arrival: '11:38 AM',
        departure: '1:04 PM',
        durationMinutes: 86,
        latitude: 37.8002,
        longitude: -122.4091,
        mapX: 48,
        mapY: 28,
        confidence: 'Estimated',
        media: [{ id: 'lunch', title: 'Sunday lunch', kind: 'photo', color: '#ad6a4c' }],
      },
      {
        id: 'presidio',
        name: 'Presidio Tunnel Tops',
        address: '210 Lincoln Blvd, San Francisco',
        category: 'Park',
        arrival: '1:31 PM',
        departure: '4:12 PM',
        durationMinutes: 161,
        latitude: 37.7989,
        longitude: -122.4662,
        mapX: 14,
        mapY: 24,
        confidence: 'Confirmed',
        media: [
          { id: 'presidio-field', title: 'Presidio lawn', kind: 'photo', color: '#66845f' },
          { id: 'golden-gate', title: 'Golden Gate', kind: 'photo', color: '#a46956' },
        ],
      },
      {
        id: 'home-evening',
        name: 'Home',
        address: 'Mission District, San Francisco',
        category: 'Home',
        arrival: '4:34 PM',
        departure: '11:59 PM',
        durationMinutes: 445,
        latitude: 37.7599,
        longitude: -122.4148,
        mapX: 31,
        mapY: 73,
        confidence: 'Confirmed',
        media: [],
      },
    ],
    trips: [
      { id: 'trip-1', fromStopId: 'home', toStopId: 'ferry-building', mode: 'Transit', startTime: '8:42 AM', endTime: '9:05 AM', distanceKm: 4.8, durationMinutes: 23 },
      { id: 'trip-2', fromStopId: 'ferry-building', toStopId: 'coit-tower', mode: 'Walking', startTime: '10:18 AM', endTime: '10:37 AM', distanceKm: 1.5, durationMinutes: 19 },
      { id: 'trip-3', fromStopId: 'coit-tower', toStopId: 'north-beach', mode: 'Walking', startTime: '11:22 AM', endTime: '11:38 AM', distanceKm: 1.1, durationMinutes: 16 },
      { id: 'trip-4', fromStopId: 'north-beach', toStopId: 'presidio', mode: 'Driving', startTime: '1:04 PM', endTime: '1:31 PM', distanceKm: 6.7, durationMinutes: 27 },
      { id: 'trip-5', fromStopId: 'presidio', toStopId: 'home-evening', mode: 'Driving', startTime: '4:12 PM', endTime: '4:34 PM', distanceKm: 7.2, durationMinutes: 22 },
    ],
  },
  {
    id: '2026-07-11',
    date: '2026-07-11',
    label: 'Saturday, July 11',
    city: 'Oakland',
    stops: [
      { id: 'home-sat', name: 'Home', address: 'Mission District, San Francisco', category: 'Home', arrival: '12:00 AM', departure: '10:04 AM', durationMinutes: 604, latitude: 37.7599, longitude: -122.4148, mapX: 31, mapY: 73, confidence: 'Confirmed', media: [] },
      { id: 'lake-merritt', name: 'Lake Merritt', address: 'Oakland, CA', category: 'Park', arrival: '10:37 AM', departure: '1:24 PM', durationMinutes: 167, latitude: 37.8012, longitude: -122.2583, mapX: 72, mapY: 42, confidence: 'Confirmed', media: [{ id: 'lake', title: 'Lake Merritt', kind: 'photo', color: '#557f91' }] },
      { id: 'home-sat-evening', name: 'Home', address: 'Mission District, San Francisco', category: 'Home', arrival: '2:05 PM', departure: '11:59 PM', durationMinutes: 594, latitude: 37.7599, longitude: -122.4148, mapX: 31, mapY: 73, confidence: 'Confirmed', media: [] },
    ],
    trips: [
      { id: 'sat-trip-1', fromStopId: 'home-sat', toStopId: 'lake-merritt', mode: 'Driving', startTime: '10:04 AM', endTime: '10:37 AM', distanceKm: 18.3, durationMinutes: 33 },
      { id: 'sat-trip-2', fromStopId: 'lake-merritt', toStopId: 'home-sat-evening', mode: 'Driving', startTime: '1:24 PM', endTime: '2:05 PM', distanceKm: 19.1, durationMinutes: 41 },
    ],
  },
  {
    id: '2026-07-10',
    date: '2026-07-10',
    label: 'Friday, July 10',
    city: 'San Francisco',
    stops: [
      { id: 'home-fri', name: 'Home', address: 'Mission District, San Francisco', category: 'Home', arrival: '12:00 AM', departure: '8:18 AM', durationMinutes: 498, latitude: 37.7599, longitude: -122.4148, mapX: 31, mapY: 73, confidence: 'Confirmed', media: [] },
      { id: 'studio', name: CLONE_DEMO_IDENTITY.company, address: 'South of Market, San Francisco', category: 'Work', arrival: '8:36 AM', departure: '5:42 PM', durationMinutes: 546, latitude: 37.7785, longitude: -122.3967, mapX: 61, mapY: 58, confidence: 'Confirmed', media: [] },
      { id: 'home-fri-evening', name: 'Home', address: 'Mission District, San Francisco', category: 'Home', arrival: '6:03 PM', departure: '11:59 PM', durationMinutes: 356, latitude: 37.7599, longitude: -122.4148, mapX: 31, mapY: 73, confidence: 'Confirmed', media: [] },
    ],
    trips: [
      { id: 'fri-trip-1', fromStopId: 'home-fri', toStopId: 'studio', mode: 'Cycling', startTime: '8:18 AM', endTime: '8:36 AM', distanceKm: 3.2, durationMinutes: 18 },
      { id: 'fri-trip-2', fromStopId: 'studio', toStopId: 'home-fri-evening', mode: 'Cycling', startTime: '5:42 PM', endTime: '6:03 PM', distanceKm: 3.5, durationMinutes: 21 },
    ],
  },
]

export function selectTimelineDay(
  days: readonly TimelineDay[],
  id: string,
): TimelineDay | undefined {
  return days.find(day => day.id === id)
}

export function timelineDayTotals(day: TimelineDay): {
  distanceKm: number
  travelMinutes: number
  places: number
  media: number
} {
  return {
    distanceKm: day.trips.reduce((total, trip) => total + trip.distanceKm, 0),
    travelMinutes: day.trips.reduce((total, trip) => total + trip.durationMinutes, 0),
    places: day.stops.filter((stop, index) =>
      stop.category !== 'Home' || (index !== 0 && index !== day.stops.length - 1),
    ).length,
    media: day.stops.reduce((total, stop) => total + stop.media.length, 0),
  }
}

const TIMELINE_NAV: { id: TimelineShowcaseSection; label: string; icon: 'timeline' | 'location' | 'flag' }[] = [
  { id: 'day', label: 'Day', icon: 'timeline' },
  { id: 'trips', label: 'Trips', icon: 'flag' },
  { id: 'places', label: 'Places', icon: 'location' },
]

export function GoogleMapsTimelineShowcase({
  days = TIMELINE_SAMPLE_DAYS,
  initialSection = 'day',
  initialDayId = '2026-07-12',
  initialSelectedStopId = 'coit-tower',
  basemapLabel = 'OpenFreeMap · configurable',
  onSelectStop,
}: GoogleMapsTimelineShowcaseProps) {
  const [section, setSection] = useState<TimelineShowcaseSection>(initialSection)
  const [dayId, setDayId] = useState(initialDayId)
  const [selectedStopId, setSelectedStopId] = useState(initialSelectedStopId)
  const [mapType, setMapType] = useState<'Map' | 'Satellite'>('Map')
  const day = selectTimelineDay(days, dayId) ?? days[0]
  const selectedStop = day?.stops.find(stop => stop.id === selectedStopId)
  const totals = day ? timelineDayTotals(day) : undefined
  const dayIndex = days.findIndex(candidate => candidate.id === day?.id)
  const placeGroups = useMemo(() => {
    const groups = new Map<string, TimelineStop[]>()
    for (const candidateDay of days) {
      for (const stop of candidateDay.stops) {
        if (stop.category === 'Home') continue
        const group = groups.get(stop.category) ?? []
        if (!group.some(existing => existing.name === stop.name)) group.push(stop)
        groups.set(stop.category, group)
      }
    }
    return [...groups.entries()]
  }, [days])

  const chooseStop = (stop: TimelineStop) => {
    setSelectedStopId(stop.id)
    onSelectStop?.(stop)
  }

  const changeDay = (offset: number) => {
    const next = days[dayIndex + offset]
    if (!next) return
    setDayId(next.id)
    setSelectedStopId(next.stops[1]?.id ?? next.stops[0]?.id ?? '')
  }

  if (!day || !totals) {
    return <div className="ready-showcase timeline-showcase timeline-empty">No timeline days available</div>
  }

  return (
    <div className="ready-showcase timeline-showcase">
      <header className="timeline-topbar">
        <button aria-label="Main menu" className="timeline-menu"><OperationalShowcaseIcon name="menu" /></button>
        <div className="timeline-logo"><span className="timeline-pin-logo"><OperationalShowcaseIcon name="location" size={21} /></span><strong>Google Maps</strong></div>
        <label className="timeline-search"><input placeholder="Search Google Maps" /><OperationalShowcaseIcon name="search" size={18} /><button aria-label="Search"><OperationalShowcaseIcon name="send" size={18} /></button></label>
        <div className="ready-top-actions"><button aria-label="Help"><OperationalShowcaseIcon name="help" /></button><button aria-label="Settings"><OperationalShowcaseIcon name="settings" /></button><button aria-label="Google apps"><OperationalShowcaseIcon name="apps" /></button><OperationalShowcaseAvatar name={CLONE_DEMO_IDENTITY.user} color="#4d76b3" size={30} /></div>
      </header>

      <div className="timeline-body">
        <aside aria-label="Timeline history" className="timeline-sidebar">
          <div className="timeline-sidebar-heading">
            <button aria-label="Back to Google Maps"><OperationalShowcaseIcon name="chevron-left" size={18} /></button>
            <div><h1>Your Timeline</h1><span>Only you can see your Timeline</span></div>
            <button aria-label="Timeline options"><OperationalShowcaseIcon name="more" size={18} /></button>
          </div>
          <nav aria-label="Timeline views">
            {TIMELINE_NAV.map(item => (
              <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)}>
                <OperationalShowcaseIcon name={item.icon} size={17} /><span>{item.label}</span>
              </button>
            ))}
          </nav>

          {section === 'day' && (
            <>
              <div className="timeline-date-picker">
                <button aria-label="Newer day" disabled={dayIndex >= days.length - 1} onClick={() => changeDay(1)}><OperationalShowcaseIcon name="chevron-left" size={17} /></button>
                <button className="timeline-date-button"><OperationalShowcaseIcon name="calendar" size={17} /><span><strong>{day.label}</strong><small>{day.city}</small></span><OperationalShowcaseIcon name="chevron-down" size={13} /></button>
                <button aria-label="Older day" disabled={dayIndex <= 0} onClick={() => changeDay(-1)}><OperationalShowcaseIcon name="chevron-right" size={17} /></button>
              </div>
              <div className="timeline-day-summary">
                <div><strong>{totals.places}</strong><span>Places</span></div>
                <div><strong>{totals.distanceKm.toFixed(1)} km</strong><span>Distance</span></div>
                <div><strong>{formatTimelineDuration(totals.travelMinutes)}</strong><span>Travel</span></div>
                <div><strong>{totals.media}</strong><span>Photos</span></div>
              </div>
              <div className="timeline-feed">
                {day.stops.map((stop, index) => {
                  const trip = index > 0 ? day.trips[index - 1] : undefined
                  return (
                    <div key={stop.id}>
                      {trip && <TimelineTripRow trip={trip} />}
                      <button className={`timeline-stop-card ${stop.id === selectedStop?.id ? 'selected' : ''}`} onClick={() => chooseStop(stop)}>
                        <span className={`timeline-stop-marker ${stop.category.toLowerCase().replace(/\s+/g, '-')}`}><OperationalShowcaseIcon name={stop.category === 'Home' ? 'home' : 'location'} size={15} /></span>
                        <span className="timeline-stop-copy">
                          <span><strong>{stop.name}</strong><small>{stop.arrival} – {stop.departure}</small></span>
                          <small>{stop.address}</small>
                          <span className="timeline-stop-meta"><em>{formatTimelineDuration(stop.durationMinutes)}</em><em>{stop.confidence}</em></span>
                          {stop.media.length > 0 && (
                            <span className="timeline-media-strip">
                              {stop.media.slice(0, 3).map(media => <TimelineMediaThumbnail key={media.id} media={media} />)}
                              {stop.media.length > 3 && <i>+{stop.media.length - 3}</i>}
                            </span>
                          )}
                        </span>
                        <OperationalShowcaseIcon name="more" size={16} />
                      </button>
                    </div>
                  )
                })}
                <div className="timeline-day-complete"><OperationalShowcaseIcon name="check" size={14} /><span>Timeline saved to this device</span></div>
              </div>
            </>
          )}

          {section === 'trips' && (
            <div className="timeline-trips-panel">
              <div className="timeline-period-select"><button>2026 <OperationalShowcaseIcon name="chevron-down" size={13} /></button><button>All trip types <OperationalShowcaseIcon name="chevron-down" size={13} /></button></div>
              <div className="timeline-trip-stats"><div><strong>14</strong><span>Trips</span></div><div><strong>482 km</strong><span>Distance</span></div><div><strong>6</strong><span>Cities</span></div></div>
              <h2>Recent trips</h2>
              <button className="timeline-trip-card selected">
                <span className="timeline-trip-cover coast"><OperationalShowcaseIcon name="location" size={20} /></span>
                <span><strong>San Francisco weekend</strong><small>Jul 10 – Jul 12 · 3 days</small><em>12 places · 7 photos</em></span>
              </button>
              <button className="timeline-trip-card">
                <span className="timeline-trip-cover forest"><OperationalShowcaseIcon name="location" size={20} /></span>
                <span><strong>Point Reyes</strong><small>Jun 27 · 1 day</small><em>5 places · 18 photos</em></span>
              </button>
              <button className="timeline-trip-card">
                <span className="timeline-trip-cover city"><OperationalShowcaseIcon name="location" size={20} /></span>
                <span><strong>New York</strong><small>May 18 – May 22 · 5 days</small><em>28 places · 64 photos</em></span>
              </button>
            </div>
          )}

          {section === 'places' && (
            <div className="timeline-places-panel">
              <label><OperationalShowcaseIcon name="search" size={15} /><input placeholder="Search visited places" /></label>
              <div className="timeline-place-count"><strong>68 places</strong><span>Visited in 2026</span></div>
              {placeGroups.map(([category, stops]) => (
                <section key={category}>
                  <div><span className={`timeline-category-icon ${category.toLowerCase().replace(/\s+/g, '-')}`}><OperationalShowcaseIcon name="location" size={14} /></span><h2>{category}</h2><em>{stops.length}</em></div>
                  {stops.map(stop => <button key={stop.id} onClick={() => chooseStop(stop)}><span><strong>{stop.name}</strong><small>{stop.address}</small></span><OperationalShowcaseIcon name="chevron-right" size={13} /></button>)}
                </section>
              ))}
            </div>
          )}
        </aside>

        <main className={`timeline-map ${mapType.toLowerCase()}`}>
          <div className="timeline-map-texture" aria-hidden="true">
            <span className="timeline-water bay">San Francisco Bay</span>
            <span className="timeline-park presidio">Presidio</span>
            <span className="timeline-place-label downtown">Downtown</span>
            <span className="timeline-place-label mission">Mission District</span>
            <span className="timeline-place-label marina">Marina District</span>
            <i className="timeline-road road-one" /><i className="timeline-road road-two" /><i className="timeline-road road-three" /><i className="timeline-road road-four" />
          </div>
          <svg className="timeline-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Route for selected day">
            <polyline points={day.stops.map(stop => `${stop.mapX},${stop.mapY}`).join(' ')} />
          </svg>
          {day.stops.map((stop, index) => (
            <button
              key={stop.id}
              className={`timeline-map-marker ${stop.id === selectedStop?.id ? 'selected' : ''}`}
              style={{ '--timeline-x': `${stop.mapX}%`, '--timeline-y': `${stop.mapY}%` } as CSSProperties}
              onClick={() => chooseStop(stop)}
              title={stop.name}
            >
              <span>{stop.category === 'Home' ? <OperationalShowcaseIcon name="home" size={13} /> : index}</span>
              {stop.id === selectedStop?.id && <em>{stop.name}</em>}
            </button>
          ))}
          <div className="timeline-map-controls">
            <div><button className={mapType === 'Map' ? 'active' : ''} onClick={() => setMapType('Map')}>Map</button><button className={mapType === 'Satellite' ? 'active' : ''} onClick={() => setMapType('Satellite')}>Satellite</button></div>
            <button aria-label="Center map on current location"><OperationalShowcaseIcon name="location" size={18} /></button>
            <div><button>+</button><button>−</button></div>
          </div>
          <div className="timeline-map-legend"><span>{basemapLabel}</span><button>Map data</button><button>Terms</button></div>

          {selectedStop && (
            <aside aria-label={`${selectedStop.name} details`} className="timeline-place-card">
              <button aria-label="Close place details" className="timeline-place-close" onClick={() => setSelectedStopId('')}><OperationalShowcaseIcon name="close" size={16} /></button>
              <div className={`timeline-place-hero ${selectedStop.category.toLowerCase().replace(/\s+/g, '-')}`}>
                {selectedStop.media.length > 0
                  ? <TimelineMediaThumbnail media={selectedStop.media[0]} large />
                  : <OperationalShowcaseIcon name={selectedStop.category === 'Home' ? 'home' : 'location'} size={32} />}
              </div>
              <div className="timeline-place-copy">
                <h2>{selectedStop.name}</h2><span>{selectedStop.category}</span><p>{selectedStop.address}</p>
                <div className="timeline-place-actions"><button><span><OperationalShowcaseIcon name="send" size={17} /></span>Directions</button><button><span><OperationalShowcaseIcon name="document" size={17} /></span>Details</button><button><span><OperationalShowcaseIcon name="more" size={17} /></span>More</button></div>
                <div className="timeline-visit-row"><OperationalShowcaseIcon name="clock" size={16} /><span><strong>Visited {selectedStop.arrival} – {selectedStop.departure}</strong><small>{formatTimelineDuration(selectedStop.durationMinutes)} · {day.label}</small></span><OperationalShowcaseIcon name="more" size={15} /></div>
                {selectedStop.media.length > 0 && <div className="timeline-place-media"><div><strong>Photos from this place</strong><button>View all</button></div><div>{selectedStop.media.map(media => <TimelineMediaThumbnail key={media.id} media={media} />)}</div></div>}
              </div>
            </aside>
          )}
        </main>
      </div>
    </div>
  )
}

function TimelineTripRow({ trip }: { trip: TimelineTrip }) {
  return (
    <div className="timeline-trip-row">
      <span><OperationalShowcaseIcon name={travelIcon(trip.mode)} size={14} /></span>
      <i />
      <div><strong>{trip.mode} · {trip.distanceKm.toFixed(1)} km</strong><small>{trip.startTime} – {trip.endTime} · {trip.durationMinutes} min</small></div>
    </div>
  )
}

function TimelineMediaThumbnail({
  media,
  large,
}: {
  media: TimelineMediaItem
  large?: boolean
}) {
  return (
    <span
      className={`timeline-media-thumb ${large ? 'large' : ''}`}
      style={{ '--timeline-media-color': media.color } as CSSProperties}
      title={media.title}
    >
      <i /><b />
      {media.kind === 'video' && <em>▶</em>}
    </span>
  )
}

function travelIcon(mode: TimelineTravelMode): 'truck' | 'timeline' | 'flag' {
  if (mode === 'Driving') return 'truck'
  if (mode === 'Walking' || mode === 'Cycling') return 'timeline'
  return 'flag'
}

function formatTimelineDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder > 0 ? `${hours} hr ${remainder} min` : `${hours} hr`
}
