import { Directive, Input, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appHandleRatioBasedOnNoOfDigits]'
})
export class HandleRatioBasedOnNoOfDigitsDirective {

  @Input() noOfDigitsBeforeDecimal: any = 0;
  @Input() noOfDigitsAfterDecimal: any = 0;
  @Input() maxNumberic: any = null;
  @Output() ngModelChange = new EventEmitter();
  focused: boolean = false;

  private regex: RegExp = new RegExp(/^\d*\.?\d{0,9}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Tab',
    'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Backspace', 'Delete'];

  constructor(private el: ElementRef) {
  }
  @HostListener('focus', ['$event.target.value'])
  onFocus() {
    const current: string = this.el.nativeElement.value;
    if (current !== undefined || current !== null || current !== '') {
      this.focused = true;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {

    // Allow Backspace, tab, end, and home keys
    const input: HTMLInputElement = this.el.nativeElement as HTMLInputElement;
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    if (this.noOfDigitsAfterDecimal === 0) {
      if (String(event.key) === '.') {
        event.preventDefault();
        return;
      }
    }

    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [
      current.slice(0, position),
      event.key === 'Decimal' ? '.' : event.key,
      current.slice(position)
    ].join('');

    if (this.focused) {
      this.focused = false;
      if (position === 0) {
        if (Number(event.key) >= 0 && Number(event.key) < 10) {
          return;
        }
      }
    }

    let index = next.indexOf('.');

    if (index !== -1) {
      next.split('.');
      const nextCopy = next;
      const nextArray = nextCopy.split('.');
      if (this.maxNumberic != null) {

        if (Number(next) === Number(this.maxNumberic)) {
          if (event.key !== '0') {
            event.preventDefault();
            return;
          }
        }
      }

      if (Number(nextArray[1].length) > Number(this.noOfDigitsAfterDecimal)) {
        event.preventDefault();
        return;
      }
    }
    if (index === -1) {
      index = next.length + index + 1;
    }

    let max = '';
    let maxVal: any;
    if (this.maxNumberic === null) {
      for (let i = 1; i <= Number(this.noOfDigitsBeforeDecimal); i++) {
        max = max + '9';
      }
      maxVal = (Number(max) + Number(0.99)).toFixed(2);
    } else {
      max = this.maxNumberic;
      maxVal = (Number(max)).toFixed(2);
    }
    const inVal = Number(next).toFixed(2);


    if (Number(inVal) > Number(maxVal)) {
      event.preventDefault();
      return;
    }

    if ((next && !String(next).match(this.regex))) {
      event.preventDefault();
    }
  }

  @HostListener('blur', ['$event.target.value'])
  onBLur(value?) {
    const input: HTMLInputElement = this.el.nativeElement as HTMLInputElement;

    if (input.value === null || input.value === undefined || String(input.value) === '') {
      return;
    }

    if (this.maxNumberic !== null && Number(this.maxNumberic) <= Number(value)) {
      this.el.nativeElement.value = Number(this.maxNumberic).toFixed(Number(this.noOfDigitsAfterDecimal));
    } else {
      this.el.nativeElement.value = Number(input.value).toFixed(Number(this.noOfDigitsAfterDecimal));
    }
    this.ngModelChange.emit(this.el.nativeElement.value);
  }

}
