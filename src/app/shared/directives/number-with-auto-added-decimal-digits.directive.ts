import { NgControl } from '@angular/forms';
import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appNumberWithAutoAddedDecimalDigits]'
})
export class NumberWithAutoAddedDecimalDigitsDirective {

  @Output() ngModelChange = new EventEmitter();

  constructor(
    private elementRef: ElementRef,
    private ngControl: NgControl
  ) { }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value?) {
    const initalValue: number = this.elementRef.nativeElement.value;
    this.elementRef.nativeElement.value = Number(initalValue).toFixed(2);
    this.ngControl.control.patchValue(this.elementRef.nativeElement.value);
    if (initalValue !== this.elementRef.nativeElement.value) {
      this.ngModelChange.emit(this.elementRef.nativeElement.value);
      // tslint:disable-next-line: deprecation
      event.stopPropagation();
    }
  }
}
