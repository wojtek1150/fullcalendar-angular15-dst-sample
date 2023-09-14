import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import rrulePlugin from '@fullcalendar/rrule'
import { createEventId, INITIAL_EVENTS } from './event-utils'
import { CalendarFeature, selectEventsCount } from './reducer'
import * as CalendarActions from './actions'
import { datetime, Frequency, RRule, rrulestr } from 'rrule'
import { DateTime } from 'luxon'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  viewStartTime = '08:00:00'
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, rrulePlugin],
    initialView: 'timeGridWeek',
    firstDay: 0,
    weekends: true,
    editable: false,
    dayMaxEventRows: true,
    selectable: false,
    longPressDelay: 0,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this), nowIndicator: true,
    scrollTime: this.viewStartTime,
    slotDuration: { minutes: 30 },
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit'
    },
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false
    },
    events: INITIAL_EVENTS,
    height: '100%',
    allDaySlot: false
  }

  calendarVisible$ = this.store.select(CalendarFeature.selectCalendarVisible)
  events$ = this.store.select(CalendarFeature.selectEvents)
  eventsCount$ = this.store.select(selectEventsCount)

  constructor(private readonly store: Store) {
    const rule = new RRule({
      dtstart: datetime(2023, 9, 17, 17, 0),
      count: 20,
      freq: Frequency.WEEKLY
    })
    console.log(rule.all())
    console.log(rule.toString())
    console.log(rrulestr('DTSTART:20230911T170000\nRRULE:FREQ=WEEKLY;UNTIL=20231231;BYDAY=FR').all())
    console.log(rrulestr('DTSTART:20230911T170000Z\nRRULE:FREQ=WEEKLY;UNTIL=20231231;BYDAY=MO').all())
  }

  handleCalendarToggle() {
    this.store.dispatch(CalendarActions.toggleCalendar())
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this
    calendarOptions.weekends = !calendarOptions.weekends
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event')
    const calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      const event: EventInput = {
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      }
      this.store.dispatch(CalendarActions.createEvent({ event }))
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      this.store.dispatch(CalendarActions.deleteEvent({ id: clickInfo.event.id }))
    }
  }
}
