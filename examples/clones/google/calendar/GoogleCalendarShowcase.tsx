import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { CLONE_DEMO_IDENTITY } from '../../demoIdentity'
import './GoogleCalendarShowcase.css'

export type GoogleCalendarView = 'month' | 'week' | 'day' | 'schedule'
export type GoogleCalendarEntryKind =
  | 'event'
  | 'task'
  | 'focus'
  | 'out-of-office'
  | 'appointment'

export interface GoogleCalendarSource {
  id: string
  name: string
  color: string
  group?: 'mine' | 'other'
  visible?: boolean
}

export interface GoogleCalendarGuest {
  name: string
  email?: string
  response?: 'accepted' | 'declined' | 'tentative' | 'pending'
}

// The showcase deliberately consumes a neutral calendar-event vocabulary.
// Google-specific presentation stays in this namespaced example.
export interface GoogleCalendarEvent {
  id: string
  title: string
  start: string
  end: string
  calendarId: string
  allDay?: boolean
  kind?: GoogleCalendarEntryKind
  color?: string
  location?: string
  meetingUrl?: string
  description?: string
  guests?: readonly GoogleCalendarGuest[]
  organizer?: string
  recurring?: string
  attachments?: readonly string[]
}

export interface GoogleCalendarDraft {
  title: string
  kind: GoogleCalendarEntryKind
  date: string
  startTime: string
  endTime: string
  calendarId: string
}

export interface GoogleCalendarShowcaseProps {
  calendars?: readonly GoogleCalendarSource[]
  events?: readonly GoogleCalendarEvent[]
  initialView?: GoogleCalendarView
  initialDate?: string
  initialSelectedEventId?: string
  initialQuery?: string
  initialComposerOpen?: boolean
  sidebarOpen?: boolean
  showRightRail?: boolean
  today?: string
  onCreateEvent?: (draft: GoogleCalendarDraft) => void
  onSelectEvent?: (event: GoogleCalendarEvent) => void
}

export const GOOGLE_CALENDAR_SAMPLE_CALENDARS: readonly GoogleCalendarSource[] = [
  {
    id: 'jun',
    name: CLONE_DEMO_IDENTITY.user,
    color: '#1a73e8',
    group: 'mine',
  },
  {
    id: 'jim-technologies',
    name: CLONE_DEMO_IDENTITY.company,
    color: '#0b8043',
    group: 'mine',
  },
  {
    id: 'product',
    name: 'Product launches',
    color: '#8e24aa',
    group: 'mine',
  },
  {
    id: 'tasks',
    name: 'Tasks',
    color: '#3f51b5',
    group: 'mine',
  },
  {
    id: 'birthdays',
    name: 'Birthdays',
    color: '#039be5',
    group: 'other',
  },
  {
    id: 'holidays',
    name: 'Holidays in United States',
    color: '#d50000',
    group: 'other',
  },
]

export const GOOGLE_CALENDAR_SAMPLE_EVENTS: readonly GoogleCalendarEvent[] = [
  {
    id: 'weekly-planning',
    title: 'Weekly planning',
    start: '2026-07-20T09:00:00-07:00',
    end: '2026-07-20T10:00:00-07:00',
    calendarId: 'jim-technologies',
    meetingUrl: 'https://meet.google.com/example',
    guests: [
      { name: CLONE_DEMO_IDENTITY.user, email: CLONE_DEMO_IDENTITY.email, response: 'accepted' },
      { name: 'Maya Rivera', response: 'accepted' },
      { name: 'Lina Tran', response: 'accepted' },
      { name: 'Sam Chen', response: 'tentative' },
    ],
    organizer: CLONE_DEMO_IDENTITY.user,
    recurring: 'Weekly on Monday',
  },
  {
    id: 'customer-onboarding',
    title: 'Customer onboarding review',
    start: '2026-07-20T10:30:00-07:00',
    end: '2026-07-20T11:15:00-07:00',
    calendarId: 'jim-technologies',
    meetingUrl: 'https://meet.google.com/example',
    description: 'Review activation milestones and open implementation decisions.',
    guests: [
      { name: CLONE_DEMO_IDENTITY.user, response: 'accepted' },
      { name: 'Ari Kim', response: 'accepted' },
    ],
    attachments: ['Customer onboarding brief'],
  },
  {
    id: 'deep-work',
    title: 'Focus time',
    start: '2026-07-20T13:00:00-07:00',
    end: '2026-07-20T15:00:00-07:00',
    calendarId: 'jun',
    kind: 'focus',
    recurring: 'Every weekday',
    description: 'Decline meetings automatically during protected focus time.',
  },
  {
    id: 'roadmap-review',
    title: 'Product roadmap review',
    start: '2026-07-21T10:00:00-07:00',
    end: '2026-07-21T11:00:00-07:00',
    calendarId: 'product',
    meetingUrl: 'https://meet.google.com/example',
    location: 'Juniper · 5th floor',
    guests: [
      { name: CLONE_DEMO_IDENTITY.user, response: 'accepted' },
      { name: 'Maya Rivera', response: 'accepted' },
      { name: 'Sam Chen', response: 'pending' },
    ],
    attachments: ['Product roadmap H2'],
  },
  {
    id: 'lunch-maya',
    title: 'Lunch with Maya',
    start: '2026-07-21T12:30:00-07:00',
    end: '2026-07-21T13:30:00-07:00',
    calendarId: 'jun',
    location: 'The Grove',
    guests: [{ name: 'Maya Rivera', response: 'accepted' }],
  },
  {
    id: 'design-critique',
    title: 'Design critique',
    start: '2026-07-21T15:00:00-07:00',
    end: '2026-07-21T16:00:00-07:00',
    calendarId: 'product',
    meetingUrl: 'https://meet.google.com/example',
    guests: [
      { name: 'Maya Rivera', response: 'accepted' },
      { name: 'Sam Chen', response: 'accepted' },
    ],
  },
  {
    id: 'team-offsite',
    title: 'Team offsite',
    start: '2026-07-22',
    end: '2026-07-23',
    calendarId: 'jim-technologies',
    allDay: true,
    location: 'Presidio, San Francisco',
    guests: [
      { name: CLONE_DEMO_IDENTITY.user, response: 'accepted' },
      { name: 'Maya Rivera', response: 'accepted' },
      { name: 'Lina Tran', response: 'accepted' },
      { name: 'Sam Chen', response: 'accepted' },
    ],
  },
  {
    id: 'investor-prep',
    title: 'Investor update prep',
    start: '2026-07-22T09:30:00-07:00',
    end: '2026-07-22T10:30:00-07:00',
    calendarId: 'jun',
    attachments: ['Investor update — July'],
  },
  {
    id: 'supplier-call',
    title: 'Supplier contract call',
    start: '2026-07-22T14:00:00-07:00',
    end: '2026-07-22T14:45:00-07:00',
    calendarId: 'jim-technologies',
    meetingUrl: 'https://meet.google.com/example',
    guests: [
      { name: CLONE_DEMO_IDENTITY.user, response: 'accepted' },
      { name: 'Lina Tran', response: 'accepted' },
    ],
  },
  {
    id: 'q3-finance-review',
    title: 'Q3 finance review',
    start: '2026-07-23T11:00:00-07:00',
    end: '2026-07-23T12:00:00-07:00',
    calendarId: 'jim-technologies',
    location: 'Cedar · 4th floor',
    meetingUrl: 'https://meet.google.com/example',
    description: 'Review runway, revenue outlook, and operating-plan variances.',
    guests: [
      { name: CLONE_DEMO_IDENTITY.user, email: CLONE_DEMO_IDENTITY.email, response: 'accepted' },
      { name: 'Lina Tran', response: 'accepted' },
      { name: 'Maya Rivera', response: 'tentative' },
    ],
    organizer: 'Lina Tran',
    attachments: ['Revenue forecast FY26', 'Q3 operating plan'],
  },
  {
    id: 'launch-readiness',
    title: 'Launch readiness',
    start: '2026-07-23T15:00:00-07:00',
    end: '2026-07-23T16:30:00-07:00',
    calendarId: 'product',
    meetingUrl: 'https://meet.google.com/example',
    guests: [
      { name: CLONE_DEMO_IDENTITY.user, response: 'accepted' },
      { name: 'Maya Rivera', response: 'accepted' },
      { name: 'Sam Chen', response: 'accepted' },
    ],
  },
  {
    id: 'customer-webinar',
    title: 'Customer webinar',
    start: '2026-07-24T10:00:00-07:00',
    end: '2026-07-24T11:30:00-07:00',
    calendarId: 'jim-technologies',
    meetingUrl: 'https://meet.google.com/example',
    location: 'Virtual event',
  },
  {
    id: 'publish-release-notes',
    title: 'Publish release notes',
    start: '2026-07-24T13:00:00-07:00',
    end: '2026-07-24T13:30:00-07:00',
    calendarId: 'tasks',
    kind: 'task',
  },
  {
    id: 'no-meeting-afternoon',
    title: 'No-meeting afternoon',
    start: '2026-07-24T14:00:00-07:00',
    end: '2026-07-24T17:00:00-07:00',
    calendarId: 'jun',
    kind: 'focus',
  },
  {
    id: 'company-breakfast',
    title: 'Company breakfast',
    start: '2026-07-27T09:00:00-07:00',
    end: '2026-07-27T10:00:00-07:00',
    calendarId: 'jim-technologies',
    location: 'Kitchen',
  },
  {
    id: 'quarterly-board',
    title: 'Quarterly board meeting',
    start: '2026-07-28T13:00:00-07:00',
    end: '2026-07-28T15:00:00-07:00',
    calendarId: 'jim-technologies',
    meetingUrl: 'https://meet.google.com/example',
    attachments: ['Board meeting notes'],
  },
  {
    id: 'maya-birthday',
    title: 'Maya’s birthday',
    start: '2026-07-30',
    end: '2026-07-31',
    calendarId: 'birthdays',
    allDay: true,
  },
  {
    id: 'independence-day',
    title: 'Independence Day',
    start: '2026-07-04',
    end: '2026-07-05',
    calendarId: 'holidays',
    allDay: true,
  },
  {
    id: 'july-observed',
    title: 'Independence Day (observed)',
    start: '2026-07-03',
    end: '2026-07-04',
    calendarId: 'holidays',
    allDay: true,
  },
  {
    id: 'billing-close',
    title: 'Monthly billing close',
    start: '2026-07-31T15:00:00-07:00',
    end: '2026-07-31T16:00:00-07:00',
    calendarId: 'jim-technologies',
    recurring: 'Monthly on the last weekday',
  },
  {
    id: 'appointment-block',
    title: 'Office hours',
    start: '2026-08-03T14:00:00-07:00',
    end: '2026-08-03T16:00:00-07:00',
    calendarId: 'jun',
    kind: 'appointment',
    description: 'Bookable 30-minute customer office-hour slots.',
  },
]

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const
const HOUR_START = 7
const HOUR_END = 19
const HOUR_HEIGHT = 56
const DEFAULT_DATE = '2026-07-20'

function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

function startOfWeek(date: Date): Date {
  return addDays(date, -date.getDay())
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatMonthDay(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatClock(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

function eventTimeLabel(event: GoogleCalendarEvent): string {
  if (event.allDay) return 'All day'
  return `${formatClock(event.start)} – ${formatClock(event.end)}`
}

function eventOverlapsDate(event: GoogleCalendarEvent, date: Date): boolean {
  if (event.allDay) {
    const dateKey = toDateKey(date)
    return event.start.slice(0, 10) <= dateKey && event.end.slice(0, 10) > dateKey
  }
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = addDays(dayStart, 1)
  return Date.parse(event.end) > dayStart.getTime() && Date.parse(event.start) < dayEnd.getTime()
}

export function googleCalendarMonthDays(anchorDate: string): string[] {
  const anchor = parseDateKey(anchorDate)
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1, 12)
  const gridStart = startOfWeek(first)
  return Array.from({ length: 42 }, (_, index) => toDateKey(addDays(gridStart, index)))
}

export function selectGoogleCalendarEvents(
  events: readonly GoogleCalendarEvent[],
  calendarIds: readonly string[],
  rangeStart: string,
  rangeEndExclusive: string,
  query = '',
): GoogleCalendarEvent[] {
  const active = new Set(calendarIds)
  const start = parseDateKey(rangeStart).setHours(0, 0, 0, 0)
  const end = parseDateKey(rangeEndExclusive).setHours(0, 0, 0, 0)
  const normalizedQuery = query.trim().toLocaleLowerCase()

  return events
    .filter(event => active.has(event.calendarId))
    .filter(event => (
      event.allDay
        ? event.end.slice(0, 10) > rangeStart && event.start.slice(0, 10) < rangeEndExclusive
        : Date.parse(event.end) > start && Date.parse(event.start) < end
    ))
    .filter(event => {
      if (!normalizedQuery) return true
      return [
        event.title,
        event.location,
        event.description,
        event.organizer,
        ...(event.guests?.map(guest => `${guest.name} ${guest.email ?? ''}`) ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    })
    .sort((left, right) => Date.parse(left.start) - Date.parse(right.start))
}

type CalendarIconName =
  | 'menu'
  | 'search'
  | 'help'
  | 'settings'
  | 'apps'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'plus'
  | 'close'
  | 'more'
  | 'clock'
  | 'people'
  | 'pin'
  | 'video'
  | 'description'
  | 'attachment'
  | 'edit'
  | 'mail'
  | 'trash'

function CalendarIcon({
  name,
  size = 20,
}: {
  name: CalendarIconName
  size?: number
}) {
  const path = {
    menu: 'M4 6h16M4 12h16M4 18h16',
    search: 'm21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    help: 'M9.1 9a3 3 0 1 1 5.3 1.9c-.9 1-2.4 1.4-2.4 3.1M12 18h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.1.4.32.75.6 1 .3.26.68.4 1.1.4h.09v4h-.09c-.42 0-.8.14-1.1.4-.28.25-.5.6-.6 1Z',
    apps: 'M5 5h2v2H5V5Zm6 0h2v2h-2V5Zm6 0h2v2h-2V5ZM5 11h2v2H5v-2Zm6 0h2v2h-2v-2Zm6 0h2v2h-2v-2ZM5 17h2v2H5v-2Zm6 0h2v2h-2v-2Zm6 0h2v2h-2v-2Z',
    'chevron-left': 'm15 18-6-6 6-6',
    'chevron-right': 'm9 18 6-6-6-6',
    'chevron-down': 'm7 10 5 5 5-5',
    plus: 'M12 5v14M5 12h14',
    close: 'M18 6 6 18M6 6l12 12',
    more: 'M12 7.5h.01M12 12h.01M12 16.5h.01',
    clock: 'M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    pin: 'M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    video: 'M15 10 21 6v12l-6-4v3H3V7h12v3Z',
    description: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8M8 17h6',
    attachment: 'm21.4 11.6-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 1 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5',
    edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z',
    mail: 'M4 4h16v16H4V4Zm0 3 8 6 8-6',
    trash: 'M3 6h18M8 6V4h8v2m-9 0 1 15h8l1-15M10 10v7M14 10v7',
  }[name]

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <path
        d={path}
        fill={name === 'apps' ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={name === 'apps' ? 0 : 1.8}
      />
    </svg>
  )
}

function GoogleCalendarLogo() {
  return (
    <span aria-hidden="true" className="gcal-logo">
      <span className="gcal-logo__top" />
      <span className="gcal-logo__number">20</span>
    </span>
  )
}

function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: CalendarIconName
  label: string
  onClick?: () => void
}) {
  return (
    <button aria-label={label} className="gcal-icon-button" onClick={onClick} title={label} type="button">
      <CalendarIcon name={icon} />
    </button>
  )
}

function MiniCalendar({
  anchorDate,
  selectedDate,
  today,
  onSelect,
}: {
  anchorDate: Date
  selectedDate: string
  today: string
  onSelect: (date: string) => void
}) {
  const days = googleCalendarMonthDays(toDateKey(anchorDate))
  const month = anchorDate.getMonth()

  return (
    <section aria-label="Mini calendar" className="gcal-mini">
      <div className="gcal-mini__header">
        <strong>{formatMonthYear(anchorDate)}</strong>
        <span>
          <IconButton icon="chevron-left" label="Previous month" />
          <IconButton icon="chevron-right" label="Next month" />
        </span>
      </div>
      <div className="gcal-mini__weekdays">
        {DAY_NAMES.map(day => <span key={day}>{day.slice(0, 1)}</span>)}
      </div>
      <div className="gcal-mini__days">
        {days.map(dayKey => {
          const day = parseDateKey(dayKey)
          return (
            <button
              aria-label={formatLongDate(day)}
              className={[
                'gcal-mini__day',
                day.getMonth() !== month ? 'is-outside' : '',
                dayKey === selectedDate ? 'is-selected' : '',
                dayKey === today ? 'is-today' : '',
              ].filter(Boolean).join(' ')}
              key={dayKey}
              onClick={() => onSelect(dayKey)}
              type="button"
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function CalendarToggle({
  calendar,
  checked,
  onChange,
}: {
  calendar: GoogleCalendarSource
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="gcal-calendar-toggle">
      <input checked={checked} onChange={onChange} type="checkbox" />
      <span
        className="gcal-calendar-toggle__box"
        style={{ '--gcal-calendar-color': calendar.color } as CSSProperties}
      >
        <span>✓</span>
      </span>
      <span>{calendar.name}</span>
      <button aria-label={`Options for ${calendar.name}`} type="button">
        <CalendarIcon name="more" size={17} />
      </button>
    </label>
  )
}

function GoogleCalendarSidebar({
  anchorDate,
  calendars,
  enabledCalendarIds,
  selectedDate,
  today,
  onCreate,
  onSelectDate,
  onToggleCalendar,
}: {
  anchorDate: Date
  calendars: readonly GoogleCalendarSource[]
  enabledCalendarIds: readonly string[]
  selectedDate: string
  today: string
  onCreate: () => void
  onSelectDate: (date: string) => void
  onToggleCalendar: (id: string) => void
}) {
  const mine = calendars.filter(calendar => (calendar.group ?? 'mine') === 'mine')
  const other = calendars.filter(calendar => calendar.group === 'other')

  return (
    <aside className="gcal-sidebar">
      <button className="gcal-create" onClick={onCreate} type="button">
        <span className="gcal-create__plus">
          <CalendarIcon name="plus" size={27} />
        </span>
        <span>Create</span>
        <CalendarIcon name="chevron-down" size={16} />
      </button>

      <MiniCalendar
        anchorDate={anchorDate}
        onSelect={onSelectDate}
        selectedDate={selectedDate}
        today={today}
      />

      <label className="gcal-people-search">
        <CalendarIcon name="search" size={18} />
        <input aria-label="Search for people" placeholder="Search for people" />
      </label>

      <button className="gcal-booking" type="button">
        <span className="gcal-booking__icon">▦</span>
        <span>
          <strong>Booking pages</strong>
          <small>Share your availability</small>
        </span>
      </button>

      <section className="gcal-calendar-group">
        <div className="gcal-calendar-group__heading">
          <strong>My calendars</strong>
          <IconButton icon="chevron-down" label="Collapse my calendars" />
        </div>
        {mine.map(calendar => (
          <CalendarToggle
            calendar={calendar}
            checked={enabledCalendarIds.includes(calendar.id)}
            key={calendar.id}
            onChange={() => onToggleCalendar(calendar.id)}
          />
        ))}
      </section>

      <section className="gcal-calendar-group">
        <div className="gcal-calendar-group__heading">
          <strong>Other calendars</strong>
          <IconButton icon="plus" label="Add other calendar" />
        </div>
        {other.map(calendar => (
          <CalendarToggle
            calendar={calendar}
            checked={enabledCalendarIds.includes(calendar.id)}
            key={calendar.id}
            onChange={() => onToggleCalendar(calendar.id)}
          />
        ))}
      </section>
    </aside>
  )
}

function eventStyle(
  event: GoogleCalendarEvent,
  calendarsById: ReadonlyMap<string, GoogleCalendarSource>,
): CSSProperties {
  return {
    '--gcal-event-color': event.color ?? calendarsById.get(event.calendarId)?.color ?? '#1a73e8',
  } as CSSProperties
}

function EventPill({
  event,
  calendarsById,
  compact = false,
  onSelect,
}: {
  event: GoogleCalendarEvent
  calendarsById: ReadonlyMap<string, GoogleCalendarSource>
  compact?: boolean
  onSelect: (event: GoogleCalendarEvent) => void
}) {
  const isTask = event.kind === 'task'
  return (
    <button
      className={[
        'gcal-event-pill',
        event.allDay ? 'is-all-day' : '',
        isTask ? 'is-task' : '',
        compact ? 'is-compact' : '',
      ].filter(Boolean).join(' ')}
      onClick={clickEvent => {
        clickEvent.stopPropagation()
        onSelect(event)
      }}
      style={eventStyle(event, calendarsById)}
      title={`${event.title}, ${eventTimeLabel(event)}`}
      type="button"
    >
      {!event.allDay && <span className="gcal-event-pill__dot" />}
      {isTask && <span className="gcal-event-pill__task">✓</span>}
      {!compact && !event.allDay && <time>{formatClock(event.start)}</time>}
      <span>{event.title}</span>
    </button>
  )
}

function MonthView({
  anchorDate,
  calendarsById,
  events,
  today,
  onCreateAt,
  onSelectEvent,
}: {
  anchorDate: Date
  calendarsById: ReadonlyMap<string, GoogleCalendarSource>
  events: readonly GoogleCalendarEvent[]
  today: string
  onCreateAt: (date: string) => void
  onSelectEvent: (event: GoogleCalendarEvent) => void
}) {
  const month = anchorDate.getMonth()
  const days = googleCalendarMonthDays(toDateKey(anchorDate))

  return (
    <div aria-label={`${formatMonthYear(anchorDate)} month view`} className="gcal-month" role="grid">
      <div className="gcal-month__weekdays" role="row">
        {DAY_NAMES.map(day => <div key={day} role="columnheader">{day}</div>)}
      </div>
      <div className="gcal-month__grid">
        {days.map(dayKey => {
          const day = parseDateKey(dayKey)
          const dayEvents = events.filter(event => eventOverlapsDate(event, day))
          const visibleEvents = dayEvents.slice(0, 4)
          return (
            <div
              className={[
                'gcal-month__day',
                day.getMonth() !== month ? 'is-outside' : '',
                dayKey === today ? 'is-today' : '',
              ].filter(Boolean).join(' ')}
              key={dayKey}
              onDoubleClick={() => onCreateAt(dayKey)}
              role="gridcell"
            >
              <button
                aria-label={`Create event on ${formatLongDate(day)}`}
                className="gcal-month__date"
                onClick={() => onCreateAt(dayKey)}
                type="button"
              >
                {day.getDate() === 1
                  ? `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(day)} ${day.getDate()}`
                  : day.getDate()}
              </button>
              <div className="gcal-month__events">
                {visibleEvents.map(event => (
                  <EventPill
                    calendarsById={calendarsById}
                    compact={dayEvents.length > 3}
                    event={event}
                    key={event.id}
                    onSelect={onSelectEvent}
                  />
                ))}
                {dayEvents.length > visibleEvents.length && (
                  <button className="gcal-month__more" type="button">
                    {dayEvents.length - visibleEvents.length} more
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TimedGrid({
  anchorDate,
  calendarsById,
  events,
  mode,
  today,
  onCreateAt,
  onSelectEvent,
}: {
  anchorDate: Date
  calendarsById: ReadonlyMap<string, GoogleCalendarSource>
  events: readonly GoogleCalendarEvent[]
  mode: 'week' | 'day'
  today: string
  onCreateAt: (date: string) => void
  onSelectEvent: (event: GoogleCalendarEvent) => void
}) {
  const first = mode === 'week' ? startOfWeek(anchorDate) : anchorDate
  const days = Array.from({ length: mode === 'week' ? 7 : 1 }, (_, index) => addDays(first, index))
  const hours = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, index) => HOUR_START + index)
  const allDayEvents = events.filter(event => event.allDay)
  const timedEvents = events.filter(event => !event.allDay)

  return (
    <div
      className={`gcal-time-grid is-${mode}`}
      style={{ '--gcal-day-count': days.length } as CSSProperties}
    >
      <div className="gcal-time-grid__header">
        <div className="gcal-time-grid__timezone">GMT−07</div>
        {days.map(day => {
          const key = toDateKey(day)
          return (
            <div className={key === today ? 'is-today' : ''} key={key}>
              <span>{DAY_NAMES[day.getDay()]}</span>
              <strong>{day.getDate()}</strong>
            </div>
          )
        })}
      </div>
      <div className="gcal-time-grid__all-day">
        <div />
        {days.map(day => {
          const dayEvents = allDayEvents.filter(event => eventOverlapsDate(event, day))
          return (
            <div key={toDateKey(day)}>
              {dayEvents.map(event => (
                <EventPill
                  calendarsById={calendarsById}
                  compact
                  event={event}
                  key={event.id}
                  onSelect={onSelectEvent}
                />
              ))}
            </div>
          )
        })}
      </div>
      <div className="gcal-time-grid__scroll">
        <div className="gcal-time-grid__hours">
          {hours.map(hour => (
            <span key={hour} style={{ top: (hour - HOUR_START) * HOUR_HEIGHT - 7 }}>
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </span>
          ))}
        </div>
        <div className="gcal-time-grid__canvas">
          {days.map(day => (
            <button
              aria-label={`Create event on ${formatLongDate(day)}`}
              className="gcal-time-grid__day-column"
              key={toDateKey(day)}
              onClick={() => onCreateAt(toDateKey(day))}
              type="button"
            >
              {hours.map(hour => <span key={hour} style={{ top: (hour - HOUR_START) * HOUR_HEIGHT }} />)}
            </button>
          ))}
          {timedEvents.map(event => {
            const eventDate = new Date(event.start)
            const dayIndex = days.findIndex(day => toDateKey(day) === toDateKey(eventDate))
            if (dayIndex < 0) return null
            const startMinutes = eventDate.getHours() * 60 + eventDate.getMinutes()
            const endDate = new Date(event.end)
            const durationMinutes = Math.max(
              20,
              (endDate.getTime() - eventDate.getTime()) / 60_000,
            )
            const top = Math.max(0, (startMinutes - HOUR_START * 60) * HOUR_HEIGHT / 60)
            const height = Math.max(24, durationMinutes * HOUR_HEIGHT / 60)
            return (
              <button
                className={[
                  'gcal-timed-event',
                  event.kind ? `is-${event.kind}` : '',
                ].filter(Boolean).join(' ')}
                key={event.id}
                onClick={() => onSelectEvent(event)}
                style={{
                  ...eventStyle(event, calendarsById),
                  '--gcal-event-height': `${height}px`,
                  '--gcal-event-left': `calc(${dayIndex * 100 / days.length}% + 2px)`,
                  '--gcal-event-top': `${top}px`,
                  '--gcal-event-width': `calc(${100 / days.length}% - 6px)`,
                } as CSSProperties}
                type="button"
              >
                <strong>{event.title}</strong>
                <span>{eventTimeLabel(event)}</span>
                {event.location && <span>{event.location}</span>}
              </button>
            )
          })}
          {days.some(day => toDateKey(day) === today) && (
            <div
              aria-label="Current time 11:32 AM"
              className="gcal-now-line"
              style={{
                '--gcal-now-left': `${
                  days.findIndex(day => toDateKey(day) === today) * 100 / days.length
                }%`,
                '--gcal-now-top': `${(11.533 - HOUR_START) * HOUR_HEIGHT}px`,
                '--gcal-now-width': `${100 / days.length}%`,
              } as CSSProperties}
            >
              <span />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ScheduleView({
  anchorDate,
  calendarsById,
  events,
  today,
  onSelectEvent,
}: {
  anchorDate: Date
  calendarsById: ReadonlyMap<string, GoogleCalendarSource>
  events: readonly GoogleCalendarEvent[]
  today: string
  onSelectEvent: (event: GoogleCalendarEvent) => void
}) {
  const days = Array.from({ length: 21 }, (_, index) => addDays(anchorDate, index))
    .map(date => ({
      date,
      events: events.filter(event => eventOverlapsDate(event, date)),
    }))
    .filter(group => group.events.length > 0)

  return (
    <div className="gcal-schedule">
      <header>
        <span>Upcoming</span>
        <strong>{formatMonthDay(anchorDate)} and later</strong>
      </header>
      {days.length === 0 && (
        <div className="gcal-schedule__empty">
          <GoogleCalendarLogo />
          <strong>No events in this range</strong>
          <span>Enjoy the open time.</span>
        </div>
      )}
      {days.map(({ date, events: dayEvents }) => {
        const key = toDateKey(date)
        return (
          <section className={key === today ? 'is-today' : ''} key={key}>
            <div className="gcal-schedule__date">
              <span>{DAY_NAMES[date.getDay()]}</span>
              <strong>{date.getDate()}</strong>
              <small>{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)}</small>
            </div>
            <div className="gcal-schedule__events">
              {dayEvents.map(event => (
                <button
                  className="gcal-schedule-event"
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  style={eventStyle(event, calendarsById)}
                  type="button"
                >
                  <span className="gcal-schedule-event__color" />
                  <time>{eventTimeLabel(event)}</time>
                  <span>
                    <strong>{event.title}</strong>
                    <small>
                      {event.location
                        ?? calendarsById.get(event.calendarId)?.name
                        ?? 'Calendar'}
                    </small>
                  </span>
                  {event.meetingUrl && (
                    <span className="gcal-schedule-event__meet">
                      <CalendarIcon name="video" size={16} />
                      Join
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function GuestAvatar({ guest }: { guest: GoogleCalendarGuest }) {
  const initials = guest.name
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <span className={`gcal-guest is-${guest.response ?? 'pending'}`} title={`${guest.name}: ${guest.response ?? 'pending'}`}>
      {initials}
      <small>{guest.response === 'accepted' ? '✓' : guest.response === 'tentative' ? '?' : '·'}</small>
    </span>
  )
}

function EventDetails({
  calendarsById,
  event,
  onClose,
}: {
  calendarsById: ReadonlyMap<string, GoogleCalendarSource>
  event: GoogleCalendarEvent
  onClose: () => void
}) {
  const calendar = calendarsById.get(event.calendarId)
  const eventDate = parseDateKey(event.start.slice(0, 10))
  return (
    <div className="gcal-overlay" role="presentation">
      <article aria-label={`Event details for ${event.title}`} className="gcal-event-details">
        <div className="gcal-event-details__actions">
          <IconButton icon="edit" label="Edit event" />
          <IconButton icon="trash" label="Delete event" />
          <IconButton icon="mail" label="Email guests" />
          <IconButton icon="more" label="More event actions" />
          <IconButton icon="close" label="Close event details" onClick={onClose} />
        </div>
        <div className="gcal-event-details__title">
          <span style={eventStyle(event, calendarsById)} />
          <div>
            <h2>{event.title}</h2>
            <p>
              {formatLongDate(eventDate)}
              {!event.allDay && ` · ${eventTimeLabel(event)}`}
            </p>
            {event.recurring && <small>{event.recurring}</small>}
          </div>
        </div>
        {event.meetingUrl && (
          <div className="gcal-detail-row">
            <CalendarIcon name="video" />
            <div className="gcal-detail-row__content">
              <button className="gcal-meet-button" type="button">Join with Google Meet</button>
              <span>meet.google.com/jim-team-sync</span>
            </div>
          </div>
        )}
        {event.location && (
          <div className="gcal-detail-row">
            <CalendarIcon name="pin" />
            <div className="gcal-detail-row__content">
              <strong>{event.location}</strong>
              <span>View map and room details</span>
            </div>
          </div>
        )}
        {event.guests && event.guests.length > 0 && (
          <div className="gcal-detail-row">
            <CalendarIcon name="people" />
            <div className="gcal-detail-row__content">
              <strong>{event.guests.length} guests</strong>
              <span>
                {event.guests.filter(guest => guest.response === 'accepted').length} yes
                {' · '}
                {event.guests.filter(guest => guest.response === 'tentative').length} maybe
              </span>
              <div className="gcal-guests">
                {event.guests.map(guest => <GuestAvatar guest={guest} key={guest.email ?? guest.name} />)}
              </div>
            </div>
          </div>
        )}
        {event.description && (
          <div className="gcal-detail-row">
            <CalendarIcon name="description" />
            <div className="gcal-detail-row__content">
              <p>{event.description}</p>
            </div>
          </div>
        )}
        {event.attachments && event.attachments.length > 0 && (
          <div className="gcal-detail-row">
            <CalendarIcon name="attachment" />
            <div className="gcal-detail-row__content">
              <strong>{event.attachments.length} attachments</strong>
              <div className="gcal-attachments">
                {event.attachments.map(attachment => (
                  <button key={attachment} type="button">
                    <span>▤</span>
                    {attachment}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <footer>
          <span
            className="gcal-event-details__calendar-dot"
            style={{ background: event.color ?? calendar?.color }}
          />
          {calendar?.name ?? 'Calendar'}
          {event.organizer && ` · Organized by ${event.organizer}`}
        </footer>
      </article>
    </div>
  )
}

function QuickComposer({
  calendars,
  date,
  onClose,
  onSave,
}: {
  calendars: readonly GoogleCalendarSource[]
  date: string
  onClose: () => void
  onSave: (draft: GoogleCalendarDraft) => void
}) {
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState<GoogleCalendarEntryKind>('event')
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('11:00')
  const [calendarId, setCalendarId] = useState(calendars[0]?.id ?? 'primary')
  const dateValue = parseDateKey(date)

  return (
    <div className="gcal-overlay is-composer" role="presentation">
      <form
        aria-label="Create calendar entry"
        className="gcal-composer"
        onSubmit={submitEvent => {
          submitEvent.preventDefault()
          onSave({
            title: title.trim() || 'Untitled event',
            kind,
            date,
            startTime,
            endTime,
            calendarId,
          })
        }}
      >
        <div className="gcal-composer__chrome">
          <span />
          <IconButton icon="close" label="Close composer" onClick={onClose} />
        </div>
        <input
          autoFocus
          className="gcal-composer__title"
          onChange={event => setTitle(event.target.value)}
          placeholder="Add title"
          value={title}
        />
        <div className="gcal-composer__tabs">
          {([
            ['event', 'Event'],
            ['task', 'Task'],
            ['appointment', 'Appointment schedule'],
          ] as const).map(([value, label]) => (
            <button
              className={kind === value ? 'is-active' : ''}
              key={value}
              onClick={() => setKind(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="gcal-composer__row">
          <CalendarIcon name="clock" />
          <div>
            <strong>{formatLongDate(dateValue)}</strong>
            <span className="gcal-composer__times">
              <input aria-label="Start time" onChange={event => setStartTime(event.target.value)} type="time" value={startTime} />
              <span>–</span>
              <input aria-label="End time" onChange={event => setEndTime(event.target.value)} type="time" value={endTime} />
            </span>
            <span className="gcal-composer__timezone">Time zone · Pacific Time</span>
          </div>
        </div>
        <button className="gcal-composer__add-row" type="button">
          <CalendarIcon name="people" />
          Add guests
        </button>
        <button className="gcal-composer__add-row is-meet" type="button">
          <CalendarIcon name="video" />
          Add Google Meet video conferencing
        </button>
        <button className="gcal-composer__add-row" type="button">
          <CalendarIcon name="pin" />
          Add location
        </button>
        <button className="gcal-composer__add-row" type="button">
          <CalendarIcon name="description" />
          Add description or attachments
        </button>
        <label className="gcal-composer__calendar">
          <span
            style={{
              background: calendars.find(calendar => calendar.id === calendarId)?.color,
            }}
          />
          <select onChange={event => setCalendarId(event.target.value)} value={calendarId}>
            {calendars
              .filter(calendar => (calendar.group ?? 'mine') === 'mine')
              .map(calendar => (
                <option key={calendar.id} value={calendar.id}>{calendar.name}</option>
              ))}
          </select>
        </label>
        <footer>
          <button className="gcal-more-options" type="button">More options</button>
          <button className="gcal-save" type="submit">Save</button>
        </footer>
      </form>
    </div>
  )
}

function GoogleSideRail() {
  return (
    <aside aria-label="Google Workspace side panel" className="gcal-side-rail">
      <button aria-label="Google Keep" className="is-keep" title="Keep" type="button">▰</button>
      <button aria-label="Google Tasks" className="is-tasks" title="Tasks" type="button">✓</button>
      <button aria-label="Google Contacts" className="is-contacts" title="Contacts" type="button">●</button>
      <button aria-label="Google Maps" className="is-maps" title="Maps" type="button">◆</button>
      <span />
      <button aria-label="Get add-ons" className="is-add" title="Get add-ons" type="button">
        <CalendarIcon name="plus" size={18} />
      </button>
      <button aria-label="Hide side panel" className="is-collapse" title="Hide side panel" type="button">
        <CalendarIcon name="chevron-right" size={18} />
      </button>
    </aside>
  )
}

function viewHeading(view: GoogleCalendarView, anchorDate: Date): string {
  if (view === 'month') return formatMonthYear(anchorDate)
  if (view === 'day') return formatLongDate(anchorDate)
  if (view === 'schedule') return formatMonthYear(anchorDate)

  const start = startOfWeek(anchorDate)
  const end = addDays(start, 6)
  if (start.getMonth() === end.getMonth()) {
    return `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(start)} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`
  }
  return `${formatMonthDay(start)} – ${formatMonthDay(end)}, ${end.getFullYear()}`
}

function visibleRange(view: GoogleCalendarView, anchorDate: Date): [string, string] {
  if (view === 'month') {
    const days = googleCalendarMonthDays(toDateKey(anchorDate))
    return [
      days[0],
      toDateKey(addDays(parseDateKey(days[days.length - 1] ?? days[0]), 1)),
    ]
  }
  if (view === 'week') {
    const start = startOfWeek(anchorDate)
    return [toDateKey(start), toDateKey(addDays(start, 7))]
  }
  if (view === 'day') {
    return [toDateKey(anchorDate), toDateKey(addDays(anchorDate, 1))]
  }
  return [toDateKey(anchorDate), toDateKey(addDays(anchorDate, 21))]
}

export function GoogleCalendarShowcase({
  calendars = GOOGLE_CALENDAR_SAMPLE_CALENDARS,
  events = GOOGLE_CALENDAR_SAMPLE_EVENTS,
  initialView = 'month',
  initialDate = DEFAULT_DATE,
  initialSelectedEventId,
  initialQuery = '',
  initialComposerOpen = false,
  sidebarOpen = true,
  showRightRail = true,
  today = DEFAULT_DATE,
  onCreateEvent,
  onSelectEvent,
}: GoogleCalendarShowcaseProps) {
  const [view, setView] = useState<GoogleCalendarView>(initialView)
  const [anchorDate, setAnchorDate] = useState(() => parseDateKey(initialDate))
  const [selectedEventId, setSelectedEventId] = useState(initialSelectedEventId)
  const [query, setQuery] = useState(initialQuery)
  const [searchOpen, setSearchOpen] = useState(Boolean(initialQuery))
  const [composerOpen, setComposerOpen] = useState(initialComposerOpen)
  const [composerDate, setComposerDate] = useState(initialDate)
  const [enabledCalendarIds, setEnabledCalendarIds] = useState(
    () => calendars.filter(calendar => calendar.visible !== false).map(calendar => calendar.id),
  )
  useEffect(() => setView(initialView), [initialView])
  useEffect(() => setAnchorDate(parseDateKey(initialDate)), [initialDate])
  useEffect(() => setSelectedEventId(initialSelectedEventId), [initialSelectedEventId])
  useEffect(() => setComposerOpen(initialComposerOpen), [initialComposerOpen])
  useEffect(() => setQuery(initialQuery), [initialQuery])
  useEffect(() => {
    setEnabledCalendarIds(
      calendars.filter(calendar => calendar.visible !== false).map(calendar => calendar.id),
    )
  }, [calendars])

  const calendarsById = useMemo(
    () => new Map(calendars.map(calendar => [calendar.id, calendar])),
    [calendars],
  )
  const [rangeStart, rangeEnd] = visibleRange(view, anchorDate)
  const visibleEvents = useMemo(
    () => selectGoogleCalendarEvents(
      events,
      enabledCalendarIds,
      rangeStart,
      rangeEnd,
      query,
    ),
    [enabledCalendarIds, events, query, rangeEnd, rangeStart],
  )
  const selectedEvent = events.find(event => event.id === selectedEventId)

  function navigate(amount: number) {
    setAnchorDate(current => {
      if (view === 'month') {
        return new Date(current.getFullYear(), current.getMonth() + amount, 1, 12)
      }
      if (view === 'week' || view === 'schedule') return addDays(current, amount * 7)
      return addDays(current, amount)
    })
  }

  function openComposer(date = toDateKey(anchorDate)) {
    setComposerDate(date)
    setComposerOpen(true)
  }

  function selectEvent(event: GoogleCalendarEvent) {
    setSelectedEventId(event.id)
    onSelectEvent?.(event)
  }

  function handleRootKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      setSelectedEventId(undefined)
      setComposerOpen(false)
      setSearchOpen(false)
    }
  }

  return (
    <div className="gcal-shell" onKeyDown={handleRootKeyDown}>
      <header className="gcal-topbar">
        <div className="gcal-brand">
          <IconButton icon="menu" label="Main menu" />
          <GoogleCalendarLogo />
          <span>Calendar</span>
        </div>
        <div className="gcal-navigation">
          <button className="gcal-today" onClick={() => setAnchorDate(parseDateKey(today))} type="button">
            Today
          </button>
          <IconButton icon="chevron-left" label="Previous date range" onClick={() => navigate(-1)} />
          <IconButton icon="chevron-right" label="Next date range" onClick={() => navigate(1)} />
          <h1>{viewHeading(view, anchorDate)}</h1>
        </div>
        <div className="gcal-actions">
          {searchOpen ? (
            <label className="gcal-global-search">
              <CalendarIcon name="search" size={19} />
              <input
                autoFocus
                onChange={event => setQuery(event.target.value)}
                placeholder="Search"
                value={query}
              />
              <IconButton
                icon="close"
                label="Close search"
                onClick={() => {
                  setSearchOpen(false)
                  setQuery('')
                }}
              />
            </label>
          ) : (
            <IconButton icon="search" label="Search" onClick={() => setSearchOpen(true)} />
          )}
          <IconButton icon="help" label="Support" />
          <IconButton icon="settings" label="Settings menu" />
          <label className="gcal-view-select">
            <select
              aria-label="Calendar view"
              onChange={event => setView(event.target.value as GoogleCalendarView)}
              value={view}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="schedule">Schedule</option>
            </select>
            <CalendarIcon name="chevron-down" size={16} />
          </label>
          <IconButton icon="apps" label="Google apps" />
          <button
            aria-label={`Account: ${CLONE_DEMO_IDENTITY.user}, ${CLONE_DEMO_IDENTITY.email}`}
            className="gcal-avatar"
            title={`Account: ${CLONE_DEMO_IDENTITY.user}`}
            type="button"
          >
            J
          </button>
        </div>
      </header>

      <div className="gcal-body">
        {sidebarOpen && (
          <GoogleCalendarSidebar
            anchorDate={anchorDate}
            calendars={calendars}
            enabledCalendarIds={enabledCalendarIds}
            onCreate={() => openComposer()}
            onSelectDate={date => {
              setAnchorDate(parseDateKey(date))
              if (view === 'month') setView('day')
            }}
            onToggleCalendar={id => {
              setEnabledCalendarIds(current => (
                current.includes(id)
                  ? current.filter(calendarId => calendarId !== id)
                  : [...current, id]
              ))
            }}
            selectedDate={toDateKey(anchorDate)}
            today={today}
          />
        )}
        <main className="gcal-main">
          {query && (
            <div className="gcal-search-summary">
              <span>Search results for “{query}”</span>
              <strong>{visibleEvents.length} events</strong>
            </div>
          )}
          {view === 'month' && (
            <MonthView
              anchorDate={anchorDate}
              calendarsById={calendarsById}
              events={visibleEvents}
              onCreateAt={openComposer}
              onSelectEvent={selectEvent}
              today={today}
            />
          )}
          {(view === 'week' || view === 'day') && (
            <TimedGrid
              anchorDate={anchorDate}
              calendarsById={calendarsById}
              events={visibleEvents}
              mode={view}
              onCreateAt={openComposer}
              onSelectEvent={selectEvent}
              today={today}
            />
          )}
          {view === 'schedule' && (
            <ScheduleView
              anchorDate={anchorDate}
              calendarsById={calendarsById}
              events={visibleEvents}
              onSelectEvent={selectEvent}
              today={today}
            />
          )}
        </main>
        {showRightRail && <GoogleSideRail />}
      </div>

      {selectedEvent && (
        <EventDetails
          calendarsById={calendarsById}
          event={selectedEvent}
          onClose={() => setSelectedEventId(undefined)}
        />
      )}
      {composerOpen && (
        <QuickComposer
          calendars={calendars}
          date={composerDate}
          onClose={() => setComposerOpen(false)}
          onSave={draft => {
            onCreateEvent?.(draft)
            setComposerOpen(false)
          }}
        />
      )}
    </div>
  )
}
