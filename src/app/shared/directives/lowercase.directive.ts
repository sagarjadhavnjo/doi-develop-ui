import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appLowercase]'
})
export class LowercaseDirective {


  @Output() ngModelChange = new EventEmitter();

  constructor(private _el: ElementRef, private ngControl: NgControl) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    this._el.nativeElement.value = this._el.nativeElement.value.toLowerCase();
    this.ngControl.control.patchValue(this._el.nativeElement.value);
    this.ngModelChange.emit(this._el.nativeElement.value);
  }

}
