import {EventInput} from '@fullcalendar/core'

let eventGuid = 0
const TODAY_STR = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: '1# PON: 12-13 zona Warsaw format ISO',
    start: TODAY_STR + 'T12:00:00+02:00',
    end: TODAY_STR + 'T13:00:00+02:00',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;UNTIL=20231231T215959Z',
    tzid: 'Europe/Warsaw',
    color: '#3498DB'
  },
  {
    id: createEventId(),
    title: '2# PON: 12-13 zona Istanbul format ISO',
    start: TODAY_STR + 'T12:00:00+03:00',
    end: TODAY_STR + 'T13:00:00+03:00',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO;UNTIL=20231231T215959Z',
    tzid: 'Europe/Istanbul',
    color: '#3498DB'
  },
  {
    id: createEventId(),
    title: '3# WT: 9-10 zona Warsaw format UTC',
    start: TODAY_STR + 'T07:00:00.000Z',
    end: TODAY_STR + 'T08:00:00.000Z',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20231231T215959Z',
    tzid: 'Europe/Warsaw',
    color: '#E67E22'
  },
  {
    id: createEventId(),
    title: '4# WT: 9-10 zona Istanbul format UTC',
    start: TODAY_STR + 'T06:00:00.000Z',
    end: TODAY_STR + 'T07:00:00.000Z',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20231231T215959Z',
    tzid: 'Europe/Istanbul',
    color: '#E67E22'
  },
  {
    id: createEventId(),
    title: '5# SR: 10-11 zona Warsaw format UTC (AUG-DEC)',
    start: '2023-08-01T08:00:00.000Z',
    end: '2023-08-01T09:00:00.000Z',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE;UNTIL=20231231T215959Z',
    tzid: 'Europe/Warsaw',
    color: '#2ECC71'
  },
  {
    id: createEventId(),
    title: '6# SR: 10-11 zona Istanbul format UTC (AUG-DEC)',
    start: '2023-08-01T07:00:00.000Z',
    end: '2023-08-01T08:00:00.000Z',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE;UNTIL=20231231T215959Z',
    tzid: 'Europe/Istanbul',
    color: '#2ECC71'
  },
  {
    id: createEventId(),
    title: '7# CZ: 12-13 zona Warsaw format UTC (LIS-STY)',
    start: '2023-11-05T11:00:00.000Z',
    end: '2023-11-05T12:00:00.000Z',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH;UNTIL=20240120T215959Z',
    tzid: 'Europe/Warsaw',
    color: '#9B59B6'
  },
  {
    id: createEventId(),
    title: '8# CZ: 13-14 zona Warsaw format UTC (LIS-MAJ)',
    start: '2023-11-05T12:00:00.000Z',
    end: '2023-11-05T13:00:00.000Z',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH;UNTIL=20240520T215959Z',
    tzid: 'Europe/Warsaw',
    color: '#9B59B6'
  },
  {
    id: createEventId(),
    title: '9# PT: 15-16 zona Warsaw format UTC (MAJ-WRZ)',
    start: '2023-05-05T13:00:00.000Z',
    end: '2023-05-05T14:00:00.000Z',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=FR;UNTIL=20230920T215959Z',
    tzid: 'Europe/Warsaw',
    color: '#F1C40F'
  },
  {
    id: createEventId(),
    title: '10# PT: 16-17 zona Warsaw format UTC (CZ-MAJ)',
    start: '2023-06-05T14:00:00.000Z',
    end: '2023-06-05T15:00:00.000Z',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=FR;UNTIL=20240520T215959Z',
    tzid: 'Europe/Warsaw',
    color: '#E67E22'
  },
];

export function createEventId() {
  return String(eventGuid++)
}
