import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'body'
})
export class NoRightClickDirective {

  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }

  constructor() { }

}
