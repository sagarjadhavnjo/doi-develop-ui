import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidatorFn } from '@angular/forms';

/**
 *  validate rage as per the given increment value
 */
 export function payBandValueValidator(payBand: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {

    if (!payBand) {
      return null;
    }

    const payBandValue: number = control.value;
    const payScaleArray = payBand.split('-');
    const min = payScaleArray[0] ? Number(payScaleArray[0]) : 0;
    const max = payScaleArray[1] ? Number(payScaleArray[1]) : 0;

    if (payBandValue >= min && payBandValue <= max) {
      return null;
    }
    return {'payBandValue': {value: control.value}};
  };
}

@Directive({
  selector: '[appValidatePaybandValue]',
  providers: [{provide: NG_VALIDATORS,
    useExisting: ValidatePaybandValueDirective, multi: true}]
})
export class ValidatePaybandValueDirective {

  @Input() payBand: string;
  constructor() { }

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.payBand ? payBandValueValidator(this.payBand)(control) : null;
  }
}
