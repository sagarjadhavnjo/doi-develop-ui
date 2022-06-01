import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appSevenPlusTwoDecimal]'
})
export class SevenPlusTwoDecimalDirective {
    @Input() inputLen = 7;
    // Allow decimal numbers and negative values
    private regex: RegExp = new RegExp(/^\d{0,14}\.?\d{0,2}$/g);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab',
        'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        // tslint:disable-next-line: prefer-const
        let current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;

        const next: string =
            [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
        let index = next.indexOf('.');
        if (index === -1) {
            index = next.length + index + 1;
        }

        if ((next && !String(next).match(this.regex)) || index > this.inputLen || index === 0) {
            event.preventDefault();
        }
    }
}
