import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'afterDecimalExtenstion'
})
export class AfterDecimalExtenstionPipe implements PipeTransform {

  transform(value: string): string {
    if (value !== undefined) {
      let num = value;
      const index = (num.indexOf('.'));
      const diff = (num.length - 1) - index;
      if (index < 0) {
        num = num + '.00';
      } else if (diff === 0 && index >= 0) {
        num = num + '00';
      } else if (diff === 1 && index > 0) {
        num = num + '0';
      }
      return num;
    }
  }
}