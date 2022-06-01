import { Directive, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


declare function SetGujarati();
declare function SetEnglish();

@Directive({
  selector: '[appHandleGujLangChangeWithoutFormControl]'
})
export class HandleGujLangChangeWithoutFormControlDirective {

  @Input() name: string = 'Guj'; // by default It will handle Gujarati Language
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() maxlength = '200';
  @Output() ngModelChange = new EventEmitter();
  currentLang = new BehaviorSubject<string>('Eng');
  private specialKeys: Array<string> = ['Tab',
    'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Backspace', 'Delete', 'Enter'];

  constructor(
    private el: ElementRef
  ) { }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value?) {
    if (this.disabled === true || this.readonly === true) {
      event.preventDefault();
      return;
    }
    const input: HTMLInputElement = this.el.nativeElement as HTMLInputElement;
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
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const max: number = Number(this.maxlength) - Number(2);
    if (Number(inputVal.length) >= max) {
      event.preventDefault();
      return;
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
      this.el.nativeElement.value = inputVal + ' ';
      this.ngModelChange.emit(this.el.nativeElement.value);
      SetEnglish();
    }
    SetEnglish();
  }
}
