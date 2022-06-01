import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: '[appTwoDecimalNumberPercentage]',
    providers: [NgModel]
})
export class TwoDecimalNumberPercentageDirective {
    // Allow decimal numbers and negative values
    @Input()
    regex: RegExp = new RegExp(/^\d{0,10}\.?\d{0,2}$/g);

    @Input()
    toFixed = 2;

    @Input()
    maxValue = 100
    // private regex: RegExp = new RegExp(/^\d{0,12}\.?\d{0,2}$/g);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = [
        'Backspace',
        'Tab',
        'End',
        'Home',
        '-',
        'ArrowLeft',
        'ArrowRight',
        'Del',
        'Delete'
    ];

    get ctrl() {
        return this.ngControl.control;
    }

    constructor(private el: ElementRef, private ngControl: NgModel) { }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        const current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;
        const next: string = [
            current.slice(0, position),
            event.key === 'Decimal' ? '.' : event.key,
            current.slice(position)
        ].join('');
        let index = next.indexOf('.');
        if (index === -1) {
            index = next.length + index + 1;
        }
        if ((next && !String(next).match(this.regex)) || Number(next) > this.maxValue) {
            event.preventDefault();
        }
    }
    @HostListener('blur', ['$event'])
    onBlur() {
        const value = this.ctrl.value;
        if (value && this.toFixed) {
            this.ctrl.setValue(Number(value).toFixed(this.toFixed));
        }
    }
}
