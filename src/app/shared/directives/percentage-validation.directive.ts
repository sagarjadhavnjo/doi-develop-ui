import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPercentageValidation]'
})
export class PercentageValidationDirective {
  @Output() ngModelChange = new EventEmitter();

  constructor(
    private elementRef: ElementRef,
    private ngControl: NgControl
  ) { }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value?) {
    const initalValue: number = this.elementRef.nativeElement.value;
    if (initalValue < 0 || initalValue > 100) {
      this.elementRef.nativeElement.value = (0).toFixed(2);
    } else {
      this.elementRef.nativeElement.value = Number(initalValue).toFixed(2);
    }
    this.ngControl.control.patchValue(this.elementRef.nativeElement.value);
    this.ngModelChange.emit(this.elementRef.nativeElement.value);
    // tslint:disable-next-line: deprecation
    event.stopPropagation();
  }
}
