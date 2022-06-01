import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';


/**
 *  validate rage as per the given increment value
 */
export function payScaleValidator(payScaleVal: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const fixpay: number = control.value;
    const payScaleArray = payScaleVal.split('-');

    if (payScaleArray.length === 5) {
      const min1 = Number(payScaleArray[2]);
      const max1 = Number(payScaleArray[4]);
      const min2 = Number(payScaleArray[0]);
      const max2 = Number(payScaleArray[2]);
      if (fixpay > min1 && fixpay <= max1) {
        const incr1 = Number(payScaleArray[3]);
        if (((fixpay - min1) % incr1) === 0) {
          return null;
        }

      } else if (fixpay >= min2 && fixpay <= max2) {
        const incr2 = Number(payScaleArray[1]);
        if (((fixpay - min2) % incr2) === 0) {
          return null;
        }

      }
    } else if (payScaleArray.length === 3) {
      const min2 = Number(payScaleArray[0]);
      const max2 = Number(payScaleArray[2]);
      if (fixpay >= min2 && fixpay <= max2) {
        const incr2 = Number(payScaleArray[1]);
        if ((fixpay - min2) % incr2 === 0) {
          return null;
        }
      }
    }
    return {'payScale': {value: control.value}};
  };
}

@Directive({
  selector: '[appPayScaleValidation]',
  providers: [{provide: NG_VALIDATORS,
     useExisting: PayScaleValidationDirective, multi: true}]
})

export class PayScaleValidationDirective implements Validator {

  @Input() payScaleValue: string;
  constructor() { }

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.payScaleValue ? payScaleValidator(this.payScaleValue)(control) : null;
  }
}
