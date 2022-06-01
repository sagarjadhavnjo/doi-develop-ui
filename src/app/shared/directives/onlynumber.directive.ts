import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[numbersOnly]'
})
export class OnlynumberDirective {

  constructor(private _el: ElementRef, private ngControl: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    this.ngControl.control.patchValue(this._el.nativeElement.value);
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
