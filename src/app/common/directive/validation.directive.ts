import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Directive, HostBinding, ElementRef, TemplateRef, HostListener, Input, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[numbersOnly]'
})

export class NumbersOnlyDirective {

  // constructor(private _el: ElementRef) { }

  // @HostListener('input', ['$event']) onInputChange(event) {
  //   const initalValue = this._el.nativeElement.value;

  //   this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
  //   if (initalValue !== this._el.nativeElement.value) {
  //     event.stopPropagation();
  //   }
  // }

  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^\d*$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[cdkDetailRow]'
})

export class CdkDetailRowDirective {
  private row: any;
  private tRef: TemplateRef<any>;
  private opened: boolean;

  @HostBinding('class.expanded')
  get expended(): boolean {
    return this.opened;
  }

  @Input()
  set cdkDetailRow(value: any) {
    if (value !== this.row) {
      this.row = value;
      // this.render();
    }
  }

  @Input('cdkDetailRowTpl')
  set template(value: TemplateRef<any>) {
    if (value !== this.tRef) {
      this.tRef = value;
      // this.render();
    }
  }

  constructor(public vcRef: ViewContainerRef) { }

  @HostListener('click')
  onClick(): void {
    this.toggle();
  }

  toggle(): void {
    if (this.opened) {
      this.vcRef.clear();
    } else {
      this.render();
    }
    this.opened = this.vcRef.length > 0;
  }

  private render(): void {
    this.vcRef.clear();
    if (this.tRef && this.row) {
      this.vcRef.createEmbeddedView(this.tRef, { $implicit: this.row });
    }
  }
}


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[datoAutoFocus]'
})
export class AutoFocusDirective {

  @Input()
  public set datoAutoFocus(value) {
    if (!!value) {
      this.host.nativeElement.focus();
    }
  }

  public constructor(
    private host: ElementRef,
  ) {
  }
}

// Accept Alphabets and Space Only
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphabetsSpaceOnly]'
})
export class AlphabetsSpaceOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /[a-zA-Z ]/g;
    const patternMatch = pattern.test(event.key);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

//  Accept Number till two decimal point
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[decimalLimitTwoOnly]'
})
export class DecimalLimitTwoOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^\d+(\.\d{0,2})?$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[sevenDigitOnly]'
})
export class SevenDigitOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^\d{0,7}(\.\d{0,2})?$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

// To accept Numbers and alphabets
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[numbersAlphabetsOnly]'
})
export class NumbersAlphabetsOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z0-9]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

// To Accept Numbers, alphabets and Space
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[numbersAlphabetsSpaceOnly]'
})
export class NumbersAlphabetsSpaceOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z0-9\s]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

// To Accept alphabets and hyphen
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphabetsHyphenOnly]'
})
export class AlphabetsHyphenOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z\-]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

// To Accept alphabets and hyphen
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[numbersHyphenOnly]'
})
export class NumbersHyphenOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[\d\-]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}


// To accept Alphabets, Number, Space and few SpecialChar such as ,.()& (Mostly used for Division Name and Circle Name in LC module)
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphabetsNumberSpaceSpecialOnly]'
})
export class AlphabetsNumberSpaceSpecialOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z0-9 ,.()&]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}


// To Add 2 Decimal Point at the End (Eg: .00 at the end)
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[decimalPoint2]'
})
export class DecimalPoint2Directive {
  constructor(private _el: ElementRef) { }
  @HostListener('blur', ['$event']) onBlur(event) {
    if (event.target.value) {
      event.target.value = parseFloat(event.target.value).toFixed(2);
    } else {
      event.target.value = parseFloat('0').toFixed(2);
    }
  }
}

// To allow only digits and slash characters as input and checks date format
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[dateOnly]'
})
export class DateOnlyDirective {
  constructor(private _el: ElementRef) { }

  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^\d{0,2}\-{0,1}[A-Za-z]{0,3}\-{0,1}\d{0,4}$$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);
    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  @HostListener('blur', ['$event']) onBlur(event) {
    // tslint:disable-next-line: max-line-length
    const pattern = /^(([0-9])|([0-2][0-9])|([3][0-1]))\-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\-\d{4}$/g;
    const tempstr = event.target.value;
    const patternMatch = pattern.test(tempstr);
    if (!patternMatch) {
      event.target.value = '';
    }
  }
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[app-common-directive]'
})
export class CommonDirective {
  removeLoader: any;

  constructor(private router?: Router) { }
  // selection = new SelectionModel<any>(true, []);

  selection = new SelectionModel<any>(true, []);
  selection1 = new SelectionModel<any>(true, []);
  // ------------------CheckBox Functions---------------------------
  masterToggle(dataSource) {
    this.isAllSelected(dataSource)
      ? this.selection.clear()
      : dataSource.data.forEach(row =>
        this.selection.select(row)
      );
  }

  isAllSelected(dataSource) {
    const numSelected = this.selection.selected.length;
    const numRows = dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(dataSource, row?: any): string {
    if (!row) {
      return `${this.isAllSelected(dataSource) ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'
      } row ${row.position + 1}`;
  }
  // -----------------------------------------------------------------
  // ------------------CheckBox Functions If there are 2 checkbox in one screen---------------------------
  masterToggle1(dataSource) {
    this.isAllSelected1(dataSource)
      ? this.selection1.clear()
      : dataSource.data.forEach(row =>
        this.selection1.select(row)
      );
  }

  isAllSelected1(dataSource) {
    const numSelected = this.selection1.selected.length;
    const numRows = dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel1(dataSource, row?: any): string {
    if (!row) {
      return `${this.isAllSelected1(dataSource) ? 'select' : 'deselect'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'
      } row ${row.position + 1}`;
  }
  // -----------------------------------------------------------------

  // Method to Reset Form
  resetForm(formName) {
    formName.reset();
  }

  // Method to redirect to another screen
  goToScreen(path) {
    this.router.navigate([path]);
  }

  // Method to get viewValue from value
  getViewValue(list, value) {
    let viewValue;
    list.forEach(item => {
      if (item.value === '' + value) { viewValue = item.viewValue; }
    });
    return viewValue;
  }

  // Method to get value from viewValue
  getValue(list, viewValue) {
    let value;
    list.forEach(item => {
      if (item.viewValue === '' + viewValue) { value = item.value; }
    });
    return value;
  }

  // Method to Delete Row
  deleteRow(dataSource, index) {
    dataSource.data.splice(index, 1);
    dataSource.data = dataSource.data;
  }

  columnTotal(dataSource, columnName) {
    let amount = 0;
    dataSource.data.forEach((element) => {
      amount = amount + Number(element[columnName]);
    });
    return amount;
  }


}




// allows only alphabets, space and dot in input

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[onlyAlphabetSpaceDot]'
})
export class AlphabetSpaceDotDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z.\s]+$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;
    const  // allows only alphabets, space and dot in input
      patternMatch = pattern.test(tempstr);
    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[noSpecialCharacter]'
})
export class NoSpecialCharacterDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z0-9]+$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;
    const  // allows only alphabets, space and dot in input
      patternMatch = pattern.test(tempstr);
    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphabetOnly]'
})
export class AlphabetOnlyDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z]+$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);
    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

// Allow only numbers from 1 to 100
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[percentageOnly]'
})
export class PercentageOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[1-9][0-9]?$|^100$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

// Allow only numbers from 0.00 to 100.00
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[percentageDecimalTwoOnly]'
})
export class PercentageOnlyDecimalTwoDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^([0-9](\.\d{0,2})?|([1-9][0-9]?)(\.\d{0,2})?$|^100(\.[0]{0,2})?)?$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

// Allow only numbers from 1 to 100
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphabetSpaceCommaOnly]'
})
export class AlphabetSpaceCommaOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z,\s]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}


// Allow user to enter only numbers on keypress
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[numbersOnlyKeypress]'
})
export class NumbersOnlyKeypressDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[0-9-]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}


// Allow only numbers from 1 to 100
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphabetSpaceDotCommaOnly]'
})
export class AlphabetSpaceDotCommaOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z,.\s]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

// allow user to enter only digit before and after dot
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[twoDigitTwoDecimalOnly]'
})
export class TwoDigitTwoDecimalOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[0-9]{0,2}(\.([0-9]){0,2})?$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[numberDotOnly]'
})
export class NumberDotOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[0-9.]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphabetSpaceSpaceOnly]'
})
export class AlphabetSpaceSlashOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z/\s]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[hourFormat]'
})
export class HourFormatDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[0-9:]*$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;
    if (!pattern.test(tempstr)) {
      event.preventDefault();
      return false;
    }
  }
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphabetNumberHypenOnly]'
})
export class AlphabetNumberHypenOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z0-9 -]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[numberHypenOnly]'
})
export class NumberHypenOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[0-9-]*$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;
    if (!pattern.test(tempstr)) {
      event.preventDefault();
      return false;
    }
  }
}


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphabetNumberSpaceDotOnly]'
})
export class AlphabetNumberSpaceDotOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z0-9 .]{1,}?$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;
    if (!pattern.test(tempstr)) {
      event.preventDefault();
      return false;
    }
  }
}

// allows 10 digit Number and comma
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[prEmpNoOnly]'
})
export class PrEmpNoOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[\d]{0,10}(,{1}[\d]{0,10})*$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;
    if (!pattern.test(tempstr)) {
      event.preventDefault();
      return false;
    }
  }
}

// allows 10 digit Number
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[empNoOnly]'
})
export class EmpNoDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[\d]{0,10}$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;
    if (!pattern.test(tempstr)) {
      event.preventDefault();
      return false;
    }
  }
}


@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[numbersAsterisksOnly]'
})

export class NumbersAsteriskOnlyDirective {

  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[0-9*]*$/;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[prBudgetHeadsOnly]'
})
export class PayrollBudgetHeadsOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z0-9 :\/\-.()]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

// allow user to enter negative number and 2 digits after decimal
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[negativeNumber]'
})
export class NegativeNumberDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^([0-9-])+(\.\d{0,2})?$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

// display nothing on loss on focus from element
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[appendDecimal]'
})
export class AppendDecimalDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('blur', ['$event']) onBlur(event) {
    if (event.target.value) {
      event.target.value = parseFloat(event.target.value).toFixed(2);
    }
  }
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[numberSlashOnly]'
})
export class NumberSlashOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[0-9/]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[alphabetsSpaceDashOnly]'
})
export class AlphabetsSpaceDashOnlyDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('keypress', ['$event']) onInputChange(event) {
    const pattern = /^[a-zA-Z/s-]+$/g;
    const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    let tempstr = event.target.value;
    tempstr += inputChar;
    const patternMatch = pattern.test(tempstr);

    if (!patternMatch) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
