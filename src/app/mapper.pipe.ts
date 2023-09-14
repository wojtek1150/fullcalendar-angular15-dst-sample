import {Pipe, PipeTransform} from '@angular/core';
import {EventInput} from "@fullcalendar/core";
import {RRuleSet, rrulestr} from "rrule";
import {DateTime} from "luxon";

@Pipe({
  name: 'mapper',
  standalone: true,
})
export class MapperPipe implements PipeTransform {
  transform(events: any, mapperOn: boolean): EventInput[] {
    if (!mapperOn) {
      return events as EventInput[];
    }
    // Use 1 offset for all dates
    const may = new Date();
    may.setMonth(4);
    const timeZoneOffset = may.getTimezoneOffset();

    return (events as any[]).map(item => {
      // Here goes DST mapper....

      // 1st move current dates into current tz
      const movedStart = new Date(item.start);
      const movedEnd = new Date(item.end);
      movedStart.setMinutes(movedStart.getMinutes() - timeZoneOffset)
      movedEnd.setMinutes(movedEnd.getMinutes() - timeZoneOffset)

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
    }) as EventInput[]
  }
}
