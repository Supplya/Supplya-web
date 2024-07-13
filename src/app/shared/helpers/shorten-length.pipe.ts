import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText',
})
export class ShortenProductNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    const words = value.split(' ');
    if (words.length > 5) {
      return words.slice(0, 5).join(' ') + '...';
    } else {
      return value;
    }
  }
}
