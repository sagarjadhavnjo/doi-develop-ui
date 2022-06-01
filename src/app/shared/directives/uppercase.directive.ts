import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[uppercase]'
})
export class UppercaseDirective {

    @Output() ngModelChange = new EventEmitter();

    constructor(private _el: ElementRef, private ngControl: NgControl) { }

    @HostListener('input', ['$event']) onInputChange(event) {
        this._el.nativeElement.value = this._el.nativeElement.value.toUpperCase();
        this.ngControl.control.patchValue(this._el.nativeElement.value);
        this.ngModelChange.emit(this._el.nativeElement.value);
    }
}
