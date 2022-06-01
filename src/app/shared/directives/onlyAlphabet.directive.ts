import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[alphabetOnly]'
})
export class OnlyAlphabetDirective {

    @Output() ngModelChange = new EventEmitter();

    constructor(private _el: ElementRef, private ngControl: NgControl) { }

    @HostListener('input', ['$event']) onInputChange(event) {
        const initalValue = this._el.nativeElement.value;

        this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z]*/g, '');
        this.ngControl.control.patchValue(this._el.nativeElement.value);
        if (initalValue !== this._el.nativeElement.value) {
            this.ngModelChange.emit(this._el.nativeElement.value);
            event.stopPropagation();
        }
    }
}
