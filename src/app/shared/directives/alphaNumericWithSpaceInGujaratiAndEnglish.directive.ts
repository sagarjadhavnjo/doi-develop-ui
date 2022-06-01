import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appAlphaNumericWithSpaceInGujaratiAndEnglish]'
})
export class AlphaNumericWithSpaceInGujaratiAndEnglishDirective  {
    // tslint:disable-next-line: no-input-rename
    @Input() appAlphaNumericWithSpaceInGujaratiAndEnglish: boolean = true;
    @Output() ngModelChange = new EventEmitter();
    @Input() maxlength = '200';
    @Input() disabled: boolean = false;
    private specialKeys: Array<string> = ['Tab',
    'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Backspace', 'Delete', 'Enter'];

    constructor(private el: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        const input: HTMLInputElement = this.el.nativeElement as HTMLInputElement;
        const inputVal = input.value;
        if (this.specialKeys.indexOf(event.key) !== -1) {
        return;
        }
        const max: number = Number(this.maxlength);
        if (Number(inputVal.length) >= max) {
          event.preventDefault();
          return;
        }
        if (this.disabled) {
            event.preventDefault();
            return;
        }
    }

    @HostListener('keyup', ['$event']) onKeyUp(event) {
        if (!this.appAlphaNumericWithSpaceInGujaratiAndEnglish) {
            return;
        }
        const initalValue = this.el.nativeElement.value;
        if (initalValue) {
            const regExpNumeric = /[\p{sc=Gujarati}\sa-zA-Z0-9]/gu;
            const finalValue = initalValue.match(regExpNumeric);
            if (finalValue.length > 0) {
                this.el.nativeElement.value = finalValue.join('');
            } else {
                this.el.nativeElement.value = '';
            }
        }
        if (initalValue !== this.el.nativeElement.value) {
            this.ngModelChange.emit(this.el.nativeElement.value);
            // event.stopPropagation();
        }
      }
}
