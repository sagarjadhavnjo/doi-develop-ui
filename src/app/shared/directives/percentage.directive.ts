import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[percentageOnly]'
})
export class PercentageDirective {

  // Allow percentage values
  private regex: RegExp = new RegExp(/^[0-9]{1}\d{0,1}(\.?\d{0,2})?$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Tab',
    'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (event.key == ' ') {
      event.preventDefault();
    }

    // tslint:disable-next-line: prefer-const
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    let next: string;
    // Backspace or Delete key should not remove decimal point otherwise percentage value will become greater than 100
    if (event.key === 'Backspace') {
      if (current.indexOf('.') !== -1) {
        // tslint:disable-next-line:triple-equals
        if (current[position - 1] == '.') {
          event.preventDefault();
        } else {
          next = [current.slice(0, position - 1), current.slice(position)].join('');
        }
      } else {
        next = [current.slice(0, position - 1), current.slice(position)].join('');
      }
    } else if (event.key === 'Delete') {
      if (current.indexOf('.') !== -1) {
        // tslint:disable-next-line:triple-equals
        if (current[position] == '.') {
          event.preventDefault();
        } else {
          next = [current.slice(0, position), current.slice(position + 1)].join('');
        }
      } else {
        next = [current.slice(0, position), current.slice(position + 1)].join('');
      }
    } else {
      next = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    }
    if (next) {
      let index = next.indexOf('.');
      if (index === -1) {
        index = next.length + index + 1;
      }
      if ((next && !String(Number(next)).match(this.regex)) || index > 2) {
        event.preventDefault();
      }
    }
  }
}
