import {EventInput} from '@fullcalendar/core'
import {DateTime} from 'luxon'
import {RRule, RRuleSet, rrulestr} from 'rrule'

let eventGuid = 0
const TODAY_STR = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today


// Ustal datę początkową i godzinę wydarzenia w czasie UTC
const startDateUTC = DateTime.fromObject({
  year: 2023,
  month: 9,
  day: 12,
  hour: 17
}, {
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
    title: 'Weekly Monday 10.07.23 9-10 UTC',
    start: TODAY_STR + 'T09:00:00.000Z',
    end: TODAY_STR + 'T10:00:00.000Z',
    rrule: 'FREQ=WEEKLY;BYDAY=MO;UNTIL=20231007T215959Z',
    color: '#3498DB'
  },
  {
    id: createEventId(),
    title: 'August - December 10-11 UTC',
    start: '2023-08-01T10:00:00.000Z',
    end: '2023-08-01T11:00:00.000Z',
    rrule: 'FREQ=WEEKLY;BYDAY=MO;UNTIL=20231231T215959Z',
    color: '#2ECC71'
  },
  {
    id: createEventId(),
    title: 'November - January 11-12 UTC',
    start: '2023-11-05T11:00:00.000Z',
    end: '2023-11-05T12:00:00.000Z',
    rrule: 'FREQ=WEEKLY;BYDAY=MO;UNTIL=20240120T215959Z',
    color: '#3498DB'
  },
  {
    id: createEventId(),
    title: 'November - May 11-13 UTC',
    start: '2023-11-05T12:00:00.000Z',
    end: '2023-11-05T13:00:00.000Z',
    rrule: 'FREQ=WEEKLY;BYDAY=MO;UNTIL=20240520T215959Z',
    color: '#9B59B6'
  },
  {
    id: createEventId(),
    title: 'May - September 13-14 UTC',
    start: '2023-05-05T13:00:00.000Z',
    end: '2023-05-05T14:00:00.000Z',
    rrule: 'FREQ=WEEKLY;BYDAY=MO;UNTIL=20230920T215959Z',
    color: '#F1C40F'
  },
  {
    id: createEventId(),
    title: 'June - May 14-15 UTC',
    start: '2023-06-05T14:00:00.000Z',
    end: '2023-06-05T15:00:00.000Z',
    rrule: 'FREQ=WEEKLY;BYDAY=MO;UNTIL=20240520T215959Z',
    color: '#E67E22'
  },
].map(item => {
  // Here goes mapper from calendar
  const startDate = new Date(item.start);
  const duration = new Date(item.end).getTime() - startDate.getTime();
  const ruleSet = new RRuleSet();
  ruleSet.rrule(rrulestr(item.rrule, {dtstart: startDate}));
  const newItem = {
    ...item,
    rrule: ruleSet.toString(),
    duration
  }
  console.log('Current:', newItem);
  // To create event only rrule is needed
  return newItem;
})
  .map(item => {
    // Here goes DST mapper....

    // 1st move current dates into current tz
    const movedStart = new Date(item.start);
    const movedEnd = new Date(item.end);
    movedStart.setMinutes(movedStart.getMinutes() - movedStart.getTimezoneOffset())
    movedEnd.setMinutes(movedEnd.getMinutes() - movedEnd.getTimezoneOffset())

    // 2nd Setup slot duration time
    const duration = new Date(movedEnd).getTime() - movedStart.getTime();

    // Create rule, magic here is add timezone id for the user timezone from luxon
    const ruleSet = new RRuleSet();
    ruleSet.rrule(rrulestr(item.rrule, {dtstart: movedStart, tzid: DateTime.now().toFormat('z')}));
    const newItem = {
      ...item,
      rrule: ruleSet.toString(),
      duration,
      movedStart: movedStart.toISOString(),
      movedEnd: movedEnd.toISOString(),
    }
    console.log('after mapping:', newItem);
    return newItem;

  })

export function createEventId() {
  return String(eventGuid++)
}
