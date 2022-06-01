import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[twoDecimalWithCount]'
})
export class TwoDecimalWithCountDirective {
    @Input() numberLength: any = 0;
    private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);

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
    constructor(private el: ElementRef) { }
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
        if ((next && !String(next).match(this.regex)) || index > this.numberLength) {
            event.preventDefault();
        }
    }

    @HostListener('blur', ['$event.target.value'])
    onBLur(value?) {
        const input: HTMLInputElement = this.el.nativeElement as HTMLInputElement;

        if (input.value === null || input.value === undefined || String(input.value) === '') {
            return;
        }
        let data = input.value;
        if (data.toString().indexOf('.') != -1) {
            let mainValue = data.split('.');
            mainValue[0] = mainValue[0].length ? mainValue[0] : '0';
            if (mainValue[1].length < 2) {
                while (mainValue[1].length < 2) {
                    mainValue[1] = mainValue[1] + '0';
                }
            }
            data = mainValue[0] + '.' + mainValue[1];
        } else {
            data = data + '.00';
        }
        this.el.nativeElement.value = data;

    }

}
