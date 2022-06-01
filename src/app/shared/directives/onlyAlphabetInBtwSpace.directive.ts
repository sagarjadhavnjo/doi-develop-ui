import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[alphabetInBtwSpaceOnly]'
})
export class OnlyAlphabetInBtwSpaceDirective {

    @Output() ngModelChange = new EventEmitter();

    constructor(private _el: ElementRef, private ngControl: NgControl) { }

    @HostListener('input', ['$event']) onInputChange(event) {
        let initalValue = this._el.nativeElement.value;

        if (initalValue.length > 0) {
            if (initalValue[0] === ' ') {
                initalValue = initalValue.slice(1, initalValue.length);
            }
        }
        this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z ]*/gi, '');
        this._el.nativeElement.value = this._el.nativeElement.value.replace(/  /gi, ' ');
        if (initalValue !== this._el.nativeElement.value) {
            this.ngModelChange.emit(this._el.nativeElement.value);
            event.stopPropagation();
        }
    }
    @HostListener('blur', ['$event']) onBlur(event) {
        const initalValue = this._el.nativeElement.value;
        this._el.nativeElement.value = this._el.nativeElement.value.trim();
        this.ngControl.control.patchValue(this._el.nativeElement.value);
        if (initalValue !== this._el.nativeElement.value) {
            this.ngModelChange.emit(this._el.nativeElement.value);
            event.stopPropagation();
        }
    }
}