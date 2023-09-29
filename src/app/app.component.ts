import {Component, OnInit} from '@angular/core'
import {Store} from '@ngrx/store'
import {CalendarOptions, EventInput} from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import rrulePlugin from '@fullcalendar/rrule'
import {CalendarFeature, selectEventsCount} from './reducer'
import {HttpClient} from "@angular/common/http";
import luxonPlugin from '@fullcalendar/luxon3'
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import {DateTime, Settings} from "luxon";
import {INITIAL_EVENTS} from "./event-utils";
import {RRuleSet, rrulestr} from "rrule";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // selectedZone = 'Europe/Warsaw';
  selectedZone = DateTime.local().toFormat('z');
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, rrulePlugin, luxonPlugin, momentTimezonePlugin],
    initialView: 'timeGridWeek',
    firstDay: 0,
    weekends: false,
    slotDuration: {minutes: 60},
    timeZone: this.selectedZone,
    height: '80%',
  }

  calendarVisible$ = this.store.select(CalendarFeature.selectCalendarVisible)
  events$ = this.store.select(CalendarFeature.selectEvents)
  eventsCount$ = this.store.select(selectEventsCount)
  zones$ = this.httpClient.get<string[]>('https://fullcalendar.io//api/demo-feeds/timezones.json');
  defaultEvents = INITIAL_EVENTS;

  constructor(private readonly store: Store, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.handleZoneChange(this.selectedZone)
  }


  handleZoneChange(zone: string) {
    Settings.defaultZone = zone;
    this.calendarOptions.timeZone = zone;
    this.calendarOptions.events = [];
    this.calendarOptions.events = this.mapEvents(this.defaultEvents, zone);
  }

  private mapEvents(events: any, zone: string): EventInput[] {
    const newEvents = (events as any[]).map(item => {
      // move event dates into current timezone
      const movedStart = DateTime.fromISO(item.start, {zone: item.tzid})
      const movedEnd = DateTime.fromISO(item.end, {zone: item.tzid})

      // Setup slot duration time
      const duration = new Date(movedEnd.toJSDate()).getTime() - movedStart.toJSDate().getTime();

      // Create default rrule - remove last 11 characters when interval set (INTERVAL=1)
      let rrule = item.recurrenceRule.includes('INTERVAL') ? item.recurrenceRule.slice(0, -11) : item.recurrenceRule;

      // Parse until date if exist
      // 16 is number of characters in ISO formatted DATE like 20230801T100000Z
      if (item.recurrenceRule.includes('UNTIL')) {
        const untilDate = DateTime.fromISO(item.recurrenceRule.slice(-16), {zone: item.tzid});
        rrule = `${item.recurrenceRule.slice(0, -16)}${untilDate.toFormat('yyyyLLdd')}T${untilDate.toFormat('HHmmss')}`
      }


      // Merge all rule string params
      let ruleString = `DTSTART;TZID=${item.tzid}:${movedStart.toFormat('yyyyLLdd')}T${movedStart.toFormat('HHmmss')}\nRRULE:${rrule}`

      const ruleSet = new RRuleSet();
      ruleSet.rrule(rrulestr(ruleString));

      // Handle count with local date
      if (ruleString.includes('COUNT')) {
        ruleString += ';UNTIL=23232006T100000';
      }

      // Check skipped dates
      if (item.skipDates?.length) {
        // "DTSTART;TZID=Europe/Warsaw:20230801T100000
        // RRULE:FREQ=WEEKLY;BYDAY=WE;UNTIL=20231231T225959
        // EXDATE;TZID=Europe/Warsaw:20230823T080000,20230920T080000"

        const exdates = item.skipDates.map((isoString: string) => {
          const luxonDate = DateTime.fromISO(isoString, {zone: item.tzid});
          return `${luxonDate.toFormat('yyyyLLdd')}T${luxonDate.toFormat('HHmmss')}`;
        });
        ruleString += `\nEXDATE;TZID=${item.tzid}:${exdates.join(',')}`;
      }

      return {
        recurrenceRule: item.recurrenceRule,
        title: item.title,
        color: item.color,
        rrule: ruleString,
        ruleSet: ruleSet.toString(),
        all: ruleSet.all(),
        duration,
        movedStart: movedStart.toString(),
        movedEnd: movedEnd.toString(),
        start: item.start,
        end: item.end,
      };
    }) as EventInput[]
    console.log('Mapped to ' + zone, newEvents);
    return newEvents;
  }
}
