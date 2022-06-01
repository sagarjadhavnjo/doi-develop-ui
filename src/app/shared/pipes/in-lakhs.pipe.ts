import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inLakhs'
})
export class InLakhsPipe implements PipeTransform {

  transform(value: number, decimalLimit: number): string {
    if (!(value === undefined || value === null)) {
      const numberInLakhs = value / 100000;
      return numberInLakhs.toFixed(decimalLimit);
    }
  }
}
