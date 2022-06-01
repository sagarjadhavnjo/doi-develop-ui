import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[numberSpaceColonOnly]'
})
export class OnlyNumberSpaceColonDirective {

  constructor(private _el: ElementRef, private ngControl: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    let initalValue = this._el.nativeElement.value;

    if (initalValue.length > 0) {
      if (initalValue[0] === ' ') {
        initalValue = initalValue.slice(1, initalValue.length);
      }
    }

    this._el.nativeElement.value = initalValue.replace(/[^0-9: ]*/g, '');
    this._el.nativeElement.value = this._el.nativeElement.value.replace(/  /gi, ' ');
    this.ngControl.control.patchValue(this._el.nativeElement.value);
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
