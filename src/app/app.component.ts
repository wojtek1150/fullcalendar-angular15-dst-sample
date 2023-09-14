import {Component} from '@angular/core'
import {Store} from '@ngrx/store'
import {CalendarOptions, DateSelectArg, EventClickArg, EventInput} from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import rrulePlugin from '@fullcalendar/rrule'
import {createEventId} from './event-utils'
import {CalendarFeature, selectEventsCount} from './reducer'
import * as CalendarActions from './actions'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, rrulePlugin],
    initialView: 'timeGridWeek',
    firstDay: 0,
    weekends: false,
    slotDuration: {minutes: 60},
    height: '100%',
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
  }

  calendarVisible$ = this.store.select(CalendarFeature.selectCalendarVisible)
  events$ = this.store.select(CalendarFeature.selectEvents)
  eventsCount$ = this.store.select(selectEventsCount)
  mapper =  true;

  constructor(private readonly store: Store) {
  }

  handleCalendarToggle() {
    this.store.dispatch(CalendarActions.toggleCalendar())
  }

  handleWeekendsToggle() {
    const {calendarOptions} = this
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
      this.store.dispatch(CalendarActions.createEvent({event}))
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      this.store.dispatch(CalendarActions.deleteEvent({id: clickInfo.event.id}))
    }
  }

  handleMapperChange() {

  }
}
