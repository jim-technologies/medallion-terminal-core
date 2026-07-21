import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  GOOGLE_CALENDAR_SAMPLE_CALENDARS,
  GOOGLE_CALENDAR_SAMPLE_EVENTS,
  GoogleCalendarShowcase,
  googleCalendarMonthDays,
  selectGoogleCalendarEvents,
  type GoogleCalendarEvent,
  type GoogleCalendarSource,
} from '../../examples/clones/google/calendar/GoogleCalendarShowcase'

describe('GoogleCalendarShowcase', () => {
  it('builds a stable six-week month projection', () => {
    const days = googleCalendarMonthDays('2026-07-20')

    expect(days).toHaveLength(42)
    expect(days[0]).toBe('2026-06-28')
    expect(days[days.length - 1]).toBe('2026-08-08')
    expect(days).toContain('2026-07-20')
  })

  it('selects visible events by calendar, range, and neutral search text', () => {
    const workWeek = selectGoogleCalendarEvents(
      GOOGLE_CALENDAR_SAMPLE_EVENTS,
      ['jim-technologies'],
      '2026-07-20',
      '2026-07-27',
    )
    const finance = selectGoogleCalendarEvents(
      GOOGLE_CALENDAR_SAMPLE_EVENTS,
      GOOGLE_CALENDAR_SAMPLE_CALENDARS.map(calendar => calendar.id),
      '2026-07-01',
      '2026-08-01',
      'runway',
    )

    expect(workWeek.map(event => event.id)).toEqual([
      'weekly-planning',
      'customer-onboarding',
      'team-offsite',
      'supplier-call',
      'q3-finance-review',
      'customer-webinar',
    ])
    expect(finance.map(event => event.id)).toEqual(['q3-finance-review'])
  })

  it('keeps all-day event dates stable across local time zones', () => {
    const allDay = selectGoogleCalendarEvents(
      GOOGLE_CALENDAR_SAMPLE_EVENTS,
      ['jim-technologies'],
      '2026-07-22',
      '2026-07-23',
    )

    expect(allDay.some(event => event.id === 'team-offsite')).toBe(true)
    expect(
      selectGoogleCalendarEvents(
        GOOGLE_CALENDAR_SAMPLE_EVENTS,
        ['jim-technologies'],
        '2026-07-21',
        '2026-07-22',
      ).some(event => event.id === 'team-offsite'),
    ).toBe(false)
  })

  it('server-renders the complete month, week, day, and schedule anatomy', () => {
    const month = renderToStaticMarkup(<GoogleCalendarShowcase />)
    const week = renderToStaticMarkup(<GoogleCalendarShowcase initialView="week" />)
    const day = renderToStaticMarkup(<GoogleCalendarShowcase initialView="day" />)
    const schedule = renderToStaticMarkup(<GoogleCalendarShowcase initialView="schedule" />)

    expect(month).toContain('Calendar')
    expect(month).toContain('July 2026')
    expect(month).toContain('Booking pages')
    expect(month).toContain('Product launches')
    expect(month).toContain('Weekly planning')
    expect(month).toContain('Account: Jun')
    expect(week).toContain('GMT−07')
    expect(week).toContain('Focus time')
    expect(day).toContain('Monday, July 20')
    expect(schedule).toContain('Upcoming')
    expect(schedule).toContain('Join')
  })

  it('renders event-detail and quick-create interaction states', () => {
    const details = renderToStaticMarkup(
      <GoogleCalendarShowcase
        initialSelectedEventId="q3-finance-review"
        initialView="week"
      />,
    )
    const composer = renderToStaticMarkup(
      <GoogleCalendarShowcase initialComposerOpen initialView="week" />,
    )

    expect(details).toContain('Event details for Q3 finance review')
    expect(details).toContain('Join with Google Meet')
    expect(details).toContain('Revenue forecast FY26')
    expect(details).toContain('Organized by Lina Tran')
    expect(composer).toContain('Create calendar entry')
    expect(composer).toContain('Appointment schedule')
    expect(composer).toContain('Add Google Meet video conferencing')
    expect(composer).toContain('Pacific Time')
  })

  it('accepts host-provided calendars and events without leaking sample content', () => {
    const calendars: readonly GoogleCalendarSource[] = [{
      id: 'host-calendar',
      name: 'Host operations',
      color: '#1565c0',
    }]
    const events: readonly GoogleCalendarEvent[] = [{
      id: 'host-event',
      title: 'Host capacity review',
      start: '2026-07-20T14:00:00-07:00',
      end: '2026-07-20T15:00:00-07:00',
      calendarId: 'host-calendar',
      description: 'Host-provided operational event.',
    }]
    const html = renderToStaticMarkup(
      <GoogleCalendarShowcase calendars={calendars} events={events} />,
    )

    expect(html).toContain('Host operations')
    expect(html).toContain('Host capacity review')
    expect(html).not.toContain('Weekly planning')
    expect(html).not.toContain('Product launches')
  })
})
