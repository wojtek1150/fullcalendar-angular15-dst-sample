import { EventInput } from '@fullcalendar/core'
import { DateTime } from 'luxon'
import { RRule } from 'rrule'

let eventGuid = 0
const TODAY_STR = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today


// Ustal strefę czasową użytkownika
const userTimezone = 'Europe/Warsaw' // Możesz użyć odpowiedniej strefy czasowej

// Ustal datę początkową i godzinę wydarzenia w czasie UTC
const startDateUTC = DateTime.fromObject({
  year: 2023,
  month: 9,
  day: 12,
  hour: 17},{
  zone: 'utc' // Określenie strefy czasowej UTC
})

// Utwórz regułę RRULE
const rrule = new RRule({
  freq: RRule.WEEKLY, // Co tydzień
  dtstart: startDateUTC.toJSDate(), // Data początkowa w formacie JS Date
  count: 10, // Liczba wystąpień (np. 10 tygodni)
  byweekday: [RRule.TH], // Czwartek
  byhour: [17], // 17:00
});

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T00:00:00',
    end: TODAY_STR + 'T03:00:00'
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T15:00:00'
  },
  {
    id: createEventId(),
    title: 'Recurring RRULE',
    rrule: 'DTSTART:20230911T170000Z\nRRULE:FREQ=WEEKLY;UNTIL=20231231;BYDAY=MO'
  },
  {
    id: createEventId(),
    color: 'orange',
    title: 'Recurring RRULE luxon',
    rrule: rrule.toString(),
  },
  {
    id: createEventId(),
    title: 'Recurring RRULE no Z',
    rrule: 'DTSTART:20230911T170000\nRRULE:FREQ=WEEKLY;UNTIL=20231231;BYDAY=FR',
    color: 'purple'
  },
  {
    id: createEventId(),
    title: 'Recurring RRULE TZ',
    rrule: 'DTSTART;TZID=Africa/Lome:20230912T170000\nRRULE:COUNT=20;FREQ=WEEKLY;BYDAY=TH',
    color: 'purple'
  },
  {
    id: createEventId(),
    title: 'Recurring from Mentors',
    start: TODAY_STR + 'T17:00:00Z',
    end: TODAY_STR + 'T18:00:00Z',
    rrule: 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20231230T215959Z',
    color: 'green'
  },
  {
    id: createEventId(),
    groupId: 'blueEvents',
    color: 'blue',
    title: 'Recurring DaysOfWeek flag',
    startTime: '17:00:00',
    endTime: '18:00:00',
    daysOfWeek: ['3'] // these recurrent events move separately
  }
]

export function createEventId() {
  return String(eventGuid++)
}
