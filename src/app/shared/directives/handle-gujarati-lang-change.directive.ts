import { Directive, Input, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

declare function SetGujarati();
declare function SetEnglish();

/**
 * Can be used to change language and handle language change issue in any formControlName
 */

@Directive({
  selector: '[appHandleGujaratiLangChange]'
})
export class HandleGujaratiLangChangeDirective {

  @Input() name: string;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() onlyOneLang: boolean = false;
  @Input() maxlength = '200';
  @Output() ngModelChange = new EventEmitter();
  currentLang = new BehaviorSubject<string>('Eng');
  private specialKeys: Array<string> = ['Tab',
    'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Backspace', 'Delete', 'Enter', 'Control '];

  constructor(
    private el: ElementRef,
    private ngControl: NgControl
  ) { }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value?) {
    if (this.disabled === true || this.readonly === true) {
      event.preventDefault();
      return;
    }
    const input: HTMLInputElement = this.el.nativeElement as HTMLInputElement;
    const inputVal = input.value;
    const max: number = Number(this.maxlength) - Number(1);
    if (Number(inputVal.length) >= max) {
      event.preventDefault();
      return;
    }
    if (this.name === 'Guj') {
      this.currentLang.next('Guj');
      SetGujarati();
    }
    if (this.name === 'Eng') {
      this.currentLang.next('Eng');
      SetEnglish();
    }
    input.focus();
    input.select();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input: HTMLInputElement = this.el.nativeElement as HTMLInputElement;
    const inputVal = input.value;
    let max: number = 0;
    if (!this.onlyOneLang) {
      max = Number(this.maxlength) - Number(2);
    } else {
      max = Number(this.maxlength);
    }

    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    if (Number(inputVal.length) >= max) {
      event.preventDefault();
      return;
    }
  }

  @HostListener('keyup', ['$event']) onKeyUp(event) {
    if (!this.onlyOneLang) {
      return;
    }
    const initalValue = this.el.nativeElement.value;
    if (initalValue) {
      // [\u0020-\u007E]
        let regExpNumeric = /[\u0020-\u007E]/gu;
        if (this.name === 'Guj') {
          regExpNumeric = /[\u0A80-\u0AFF\u0020-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/gu;
        }
        const finalValue = initalValue.match(regExpNumeric);
        if (finalValue && finalValue.length > 0) {
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

  @HostListener('blur', ['$event.target.value'])
  onBlur(value?) {
    const input: HTMLInputElement = this.el.nativeElement as HTMLInputElement;
    const inputVal = input.value;
    const max: number = Number(this.maxlength) - Number(1);
    if (inputVal.endsWith(' ')) {
      SetEnglish();
      event.preventDefault();
      return;
    }
    if (Number(inputVal.length) >= max) {
      SetEnglish();
      event.preventDefault();
      return;
    }
    if (inputVal === null || inputVal === undefined || inputVal === '') {
      SetEnglish();
      return;
    }
    if (this.disabled === true || this.readonly === true) {
      SetEnglish();
      return;
    }
    if (this.name === 'Guj') {
      this.currentLang.next('Eng');
      if (this.onlyOneLang) {
        this.el.nativeElement.value = inputVal + '';
      } else {
        this.el.nativeElement.value = inputVal + ' ';
      }
      this.ngControl.control.patchValue(this.el.nativeElement.value);
      this.ngModelChange.emit(this.el.nativeElement.value);
      SetEnglish();
    }
    SetEnglish();
  }
}
