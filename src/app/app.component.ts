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
      // 1st move event dates into current timezone
      const movedStart = DateTime.fromISO(item.start, {zone: item.tzid})
      const movedEnd = DateTime.fromISO(item.end, {zone: item.tzid})

      // 2nd Setup slot duration time
      const duration = new Date(movedEnd.toJSDate()).getTime() - movedStart.toJSDate().getTime();

      const rrule = `DTSTART;TZID=${item.tzid}:${movedStart.toFormat('yyyymmdd')}T${movedStart.toFormat('HHmmss')}\nRRULE:${item.recurrenceRule.replace('Z','')}`
      const ruleSet = new RRuleSet();
      ruleSet.rrule(rrulestr(item.recurrenceRule, {dtstart: movedStart.toJSDate(), tzid: item.tzid}));
      return {
        recurrenceRule: item.recurrenceRule,
        title: item.title,
        color: item.color,
        rrule,
        ruleSetString: ruleSet.toString(),
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
