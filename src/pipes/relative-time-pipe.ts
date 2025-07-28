import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'relativeTime'
})

export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date | moment.Moment): string {
    if (!value) {
      return '';
    }
    return moment(value).fromNow();
  }
}