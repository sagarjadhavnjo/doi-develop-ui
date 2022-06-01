import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[edpCode]'
})
export class EdpCodeMaskingDirective {
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
    constructor(private _el: ElementRef, private ngControl: NgControl) { }

    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        const initalValue = this._el.nativeElement.value;

        this._el.nativeElement.value = initalValue.replace(/[^0-9 ]*/g, '');
        this.ngControl.control.patchValue(this._el.nativeElement.value);
        const position = this._el.nativeElement.selectionStart;
        if (position === 4 || position === 7 || position === 11) {
            // this._el.nativeElement.value = initalValue + ' ';
            this._el.nativeElement.value = [
                this._el.nativeElement.value.slice(0, position),
                ' ',
                this._el.nativeElement.value.slice(position)
            ].join('');
        }
    }


    // private regex: RegExp = new RegExp(/[^0-9]*/g);
    // private specialKeys: Array<string> = [
    //     'Backspace',
    //     'Tab',
    //     'End',
    //     'Home',
    //     'ArrowLeft',
    //     'ArrowRight',
    //     'Del',
    //     'Delete'
    // ];
    // constructor(private el: ElementRef) {}
    // @HostListener('keydown', ['$event'])
    // onKeyDown(event: KeyboardEvent) {
    //     debugger;
    //     // Allow Backspace, tab, end, and home keys
    //     if (this.specialKeys.indexOf(event.key) !== -1) {
    //         return;
    //     }
    //     // tslint:disable-next-line: prefer-const
    //     let current: string = this.el.nativeElement.value;
    //     const position = this.el.nativeElement.selectionStart;
    //     if (position === 4 || position === 7 || position === 11) {
    //         this.el.nativeElement.value = '';
    //         this.el.nativeElement.value = current + ' ';
    //     }
    // }

}
