import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from 'src/app/modules/services/validatation.service';

@Component({
  selector: 'error-messages',
  template: `<div class="error-wrapper" *ngIf="errorMessage !== null"><mat-error>{{errorMessage}}</mat-error></div>`
})

export class ControlMessagesComponent {
  @Input() control: FormControl;
  @Input() errorMessages: object;
  constructor() { }

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) &&
       (this.control.touched && (this.control.errors.required || this.control.value !== ''))) {
        return ValidationService.getValidatorErrorMessage(propertyName,
           this.control.errors[propertyName], this.errorMessages);
      } else {
        return null;
      }
    }
    return null;
  }
}