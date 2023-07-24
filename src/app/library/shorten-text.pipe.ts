import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText',
})
export class ShortenTextPipe implements PipeTransform {
  transform(value: string, pageWidth: number): unknown {
    let newOverview;

    if (pageWidth < 500 || (pageWidth < 500 && value.length < 40)) {
      newOverview = value.substring(0, 25) + '...';
    } else if (value.length < 40) {
      return value;
    } else {
      newOverview = value.substring(0, 40) + '...';
    }

    return newOverview;
  }
}
