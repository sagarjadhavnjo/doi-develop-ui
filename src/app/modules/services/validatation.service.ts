import { FormGroup, FormControl } from '@angular/forms';

export class ValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any, errorMessage?: any) {
    let requiredMessage = 'Required';
    if (errorMessage !== undefined && errorMessage !== '') {
      requiredMessage = errorMessage.required;
    }

    const config = {
      'required': requiredMessage,
      'invalidEmailAddress': 'Please enter valid email address.',
      'invalidEmailAddressLength': 'Minimum 6 characters required.',
      'invalidMobileNo': 'Please enter valid 10 digit Mobile No.',
      'invalidAadharNo': 'Please enter valid 12 digit Aadhaar No.',
      'invalidPRANNo': 'Please enter valid 20 digit PRAN No.',
      'invalidPPONo': 'Please enter valid 20 digit PPO No.',
      'invalidPPANNo': 'Please enter valid 20 digit PPAN No.',
      'invalidName': 'Please enter valid name',
      'invalidFatherName': '"Please Enter valid Father\'s Name',
      'invalidNo': 'Please enter valid number.',
      'minlength': `Minimum length ${validatorValue.requiredLength}`,
      'maxlength': `Maximum length ${validatorValue.requiredLength}`,
      'invalidPanNo': 'Please Enter valid 10 digit PAN Number',
      'invalidPassportNo': 'Please Enter valid 8 digit Passport Number',
      'invalidElectionNo': 'Please enter valid Election No.',
      'invalidPercentage': 'Please enter valid Percentage',
      'invalidPincode': 'Please enter valid 6 digit Pincode.',
      'minHeight': 'Please Enter Valid Height',
      'trimError': 'Only spaces not allowed!'
    };
    return config[validatorName];
  }

  static emailValidator(control) {
    if (control.value !== '' && control.value != null) {
      if (+control.value.length < 6) {
        return { 'invalidEmailAddressLength': true };
      } else if (control.value.toString().match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,5}$/)) {
        return null;
      } else {
        return { 'invalidEmailAddress': true };
      }
    }
  }

  static mobileNoValidator(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/^([+][9][1]|[9][1]|[0]){0,1}([6-9]{1})([0-9]{9})$/)) {
        return null;
      } else {
        return { 'invalidMobileNo': true };
      }
    }
  }

  static aadharNoValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/^\d{12}$/)) {
        return null;
      } else {
        return { 'invalidAadharNo': true };
      }
    }
  }

  static pincodeValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/^[1-9][0-9]{5}$/)) {
        return null;
      } else {
        return { 'invalidPincode': true };
      }
    }
  }

  static numberOnly(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.match(/[1-9]\d*|0\d+/)) {
        return null;
      } else {
        return { 'invalidNo': true };
      }
    }
  }

  static tweldigitvalidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.match(/^\d{12}$/)) {
        return null;
      } else {
        return { 'invalidPRANNo': true };
      }
    }
  }
  static ppoNoValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.match(/^\d{20}$/)) {
        return null;
      } else {
        return { 'invalidPPONo': true };
      }
    }
  }

  static ppanNoValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.match(/^\d{20}$/)) {
        return null;
      } else {
        return { 'invalidPPANNo': true };
      }
    }
  }

  static cinValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}?$/)) {
        return null;
      } else {
        return { 'invalidCin': true };
      }
    }
  }

  static panCardValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}?$/)) {
        return null;
      } else {
        return { 'invalidPanNo': true };
      }
    }
  }

  static tanNoValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/[a-zA-Z]{4}[0-9]{5}[a-zA-Z]{1}?$/)) {
        return null;
      } else {
        return { 'invalidTanNo': true };
      }
    }
  }

  static urnNoValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}?$/)) {
        return null;
      } else {
        return { 'invalidUrnNo': true };
      }
    }
  }

  static passportValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.match(/^[A-Z]{1}[0-9]{7}$/)) {
        return null;
      } else {
        return { 'invalidPassportNo': true };
      }
    }
  }

  static electionNoValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/^([a-zA-Z]){3}([0-9]){7}?$/)) {
        return null;
      } else {
        return { 'invalidElectionNo': true };
      }
    }
  }
  static minHeightValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/^[1-9][0-9]*$/)) {
        return null;
      } else {
        return { 'minHeight': true };
      }
    }
  }
  static payScaleMinMaxValidation(control, min, max) {
    if (control.value !== '' && control.value != null) {
      if (control.value >= min && control.value <= max) {
        return null;
      } else {
        return { 'required': true };
      }
    }
  }
  static charWithSpaceValidation(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)) {
        return null;
      } else {
        return { 'invalidName': true };
      }
    }
  }
  static charWithSpaceValidationName(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/^[a-zA-Z]+(([ ][a-zA-Z ])?[a-zA-Z]*)*$/)) {
        return null;
      } else {
        return { 'invalidName': true };
      }
    }
  }
  static charWithSpaceValidationFatherName(control) {
    if (control.value !== '' && control.value != null) {
      if (control.value.toString().match(/^[a-zA-Z]+(([ ][a-zA-Z ])?[a-zA-Z]*)*$/)) {
        return null;
      } else {
        return { 'invalidFatherName': true };
      }
    }
  }
  static validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.updateValueAndValidity();
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  static resetValidation(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.setErrors(null);
    });
  }

}
