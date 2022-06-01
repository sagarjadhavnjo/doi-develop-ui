import { Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[charactersOnly]'
})

export class CharactersOnlyDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /[a-zA-Z]/g;
    const patternMatch = pattern.test(event.key);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
