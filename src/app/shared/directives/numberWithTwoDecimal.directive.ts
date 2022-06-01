import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[twoDecimalNumber]'
})
export class TwoDigitDecimaNumberDirective {
    private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);

    // tslint:disable-next-line: max-line-length
   /** private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // console.log(this.el.nativeElement.value);
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        const current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;
        // tslint:disable-next-line: max-line-length
        const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
*/
    private specialKeys: Array<string> = [
        'Backspace',
        'Tab',
        'End',
        'Home',
        'ArrowLeft',
        'ArrowRight',
        'Del',
        'Delete'
    ];
    constructor(private el: ElementRef) {}
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        // tslint:disable-next-line: prefer-const
        let current: string = this.el.nativeElement.value;
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
        if ((next && !String(next).match(this.regex)) || index > 8) {
            event.preventDefault();
        }
    }

}
