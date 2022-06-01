import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[noInwardSpace]'
})
export class NoInwardSpaceDirective {

    @Output() ngModelChange = new EventEmitter();

    constructor(private _el: ElementRef, private ngControl: NgControl) { }

    @HostListener('input', ['$event']) onInputChange(event) {
        let initalValue = this._el.nativeElement.value;

        if (initalValue.length > 0) {
            if (initalValue[0] === ' ') {
                initalValue = initalValue.slice(1, initalValue.length);
            }
        }
        initalValue.trim();
        this._el.nativeElement.value = initalValue;
        this._el.nativeElement.value = this._el.nativeElement.value.replace(/  /gi, '');
        this.ngControl.control.patchValue(this._el.nativeElement.value);
        if (initalValue !== this._el.nativeElement.value) {
            this.ngModelChange.emit(this._el.nativeElement.value);
            event.stopPropagation();
        }
    }
}
