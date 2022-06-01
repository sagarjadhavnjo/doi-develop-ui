import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appNumbersOnlyInGujaratiAndEnglish]'
})
export class OnlyNumberInGujaratiAndEnglishDirective  {
    @Input() appNumbersOnlyInGujaratiAndEnglish: boolean = true; // true means directive will work or else will not work
    @Output() ngModelChange = new EventEmitter();
    @Input() maxlength = '200';
    @Input() isDecimalRequired = true;
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
    }

    @HostListener('keyup', ['$event']) onKeyUp(event) {
        if (!this.appNumbersOnlyInGujaratiAndEnglish) {
            return;
        }
        const initalValue = this.el.nativeElement.value;
        if (initalValue) {
            // const regExpNumeric = /[0-9૦-૯]+/g;
            let regExpNumeric = /[0-9૦-૯]+((\.[0-9૦-૯][0-9૦-૯]?)|(\.)?)?/g;
            if (!this.isDecimalRequired) {
                regExpNumeric = /[0-9૦-૯]+/g;
            }
            const finalValue = initalValue.match(regExpNumeric);
            if (finalValue) {
                const finalString = finalValue[0];
                // if (finalString.indexOf('.') === finalString.length - 1) {
                //     finalString = finalString.substring(0, finalString.length - 1);
                // }
                this.el.nativeElement.value = finalString;
            } else {
                this.el.nativeElement.value = '';
            }
        }
        if (initalValue !== this.el.nativeElement.value) {
            this.ngModelChange.emit(this.el.nativeElement.value);
            // event.stopPropagation();
        }
      }
      @HostListener('blur', ['$event']) onBlue(event) {
        if (!this.appNumbersOnlyInGujaratiAndEnglish) {
            return;
        }
        const initalValue = this.el.nativeElement.value;
        if (initalValue.indexOf('.') === initalValue.length - 1) {
            this.el.nativeElement.value = initalValue.substring(0, initalValue.length - 1);
        } else {
            const regExpNumeric = /[0-9૦-૯]+((\.[0-9૦-૯][0-9૦-૯]?)|(\.)?)?/g;
            const finalValue = initalValue.match(regExpNumeric);
            if (!finalValue) {
                this.el.nativeElement.value =  '';
            }
        }
      }
}
