// Directive that contains all the reusable methods of Letter of Credit module
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line: max-line-length
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ElementRef } from '@angular/core';
import { HistoryDialogComponent } from './../../letter-of-credit/history-dialog/history-dialog.component';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';


export class LetterOfCreditDirectives {

  selectedIndex: number;
  tabDisable: Boolean = true;
  fileBrowseIndex: number;

  // constructor(private router: Router, private dialog: MatDialog) { }
  constructor(private router: Router, private dialog: MatDialog, private el: ElementRef) { }


  selection = new SelectionModel<any>(true, []);

  // Methods for Checkbox Selection Starts
  masterToggle(dataSourceData) {
    this.isAllSelected(dataSourceData)
      ? this.selection.clear()
      : dataSourceData.forEach(row =>
        this.selection.select(row)
      );
  }

  isAllSelected(dataSourceData) {
    const numSelected = this.selection.selected.length;
    const numRows = dataSourceData.length;
    return numSelected === numRows;
  }

  checkboxLabel(dataSourceData, row?: any): string {
    if (!row) {
      return `${this.isAllSelected(dataSourceData) ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'
      } row ${row.position + 1}`;
  }
  // Methods for Checkbox Selection Ends

  // Method to accept only Numbers and Alphabets
  onlyNumberAndAlphabets(event: any) {
    const pattern = /^[a-zA-Z0-9]+$/;
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

  // // Method to accept only Numbers and Alphabets with Space
  onlyNumberAndAlphabetsWithSpace(event: any) {
    const pattern = /^[a-zA-Z0-9 ]+$/;
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

  // Method to accept only Alphabets and Space
  onlyAlphabetsAndSpace(event: any) {
    const pattern = /^[a-zA-Z ]+$/;
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

  // Method to restrice Space only
  restrictSpace(event: any) {
    const pattern = /^[ ]+$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;
    if (pattern.test(tempstr)) {
      event.preventDefault();
      return false;
    }
  }

  // Method to accept only Alphabets and Hyphen
  onlyAlphabetsAndHyphen(event: any) {
    const pattern = /^[a-zA-Z-]+$/;
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

  // Method to accept Alphabets, Number, Space and few SpecialChar (Mostly used for division Name and Circle Name)
  onlyAlphabetsNumberSpaceSpecial(event: any) {
    const pattern = /^[a-zA-Z0-9 ,.()&]+$/;
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
  onlyAlphabetsNumberSpaceAllSpecial(event: any) {
    const pattern = /^[a-zA-Z0-9 ,.()&!@#$%-*?^</]+$/;
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

  onlyAlphabetsNumberAllSpecial(event: any) {
    const pattern = /^[a-zA-Z0-9,.()&!@#$%-*?^</]+$/;
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
  onlyAlphabetsSpaceAndSpecial(event) {
    const pattern = /^[a-zA-Z ()&,.\d]+$/;
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

  onlyAlphaNumberSpecialSpace(event) {
    const pattern = /^[a-zA-Z ()&,.\d]+$/;
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

  // To add decimal point after number
  decimalPoint(data, key) {
    if (data[key]) {
      data[key] = Number(data[key]).toFixed(2);
    }
  }

  // // To add decimal point after number
  // addDecimalPoint(data, formname) {
  //   data = Number(data).toFixed(2);
  //   console.log(data);
  //   return data;
  // }

  // Method to accept only Numbers
  onlyNumber(event: any) {
    const pattern = /^[0-9]+$/;
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
  onlyNumberwithDigitSpecific(event: any,digits :number) {
    const pattern = /^[0-9]+$/;
    const inputChar = String.fromCharCode(
      !event.charCode ? event.which : event.charCode
    );
    let tempstr = event.target.value;
    tempstr += inputChar;
    console.log(tempstr.length)
    if (!pattern.test(tempstr) || tempstr.length>digits) {
      event.preventDefault();
      return false;
    }
  
  }
  // Method to accept only Alphabets
  onlyAlphabet(event: any) {
    const pattern = /^[a-zA-Z]+$/;
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

  // Method to avoid Special Characters
  noSpecialCharacter(event: any) {
    const pattern = /^[a-zA-Z0-9]+$/;
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

  // Method to accept only alphabets with space and dot
  onlyAlphabetSpaceDot(event: any) {
    const pattern = /^[a-zA-Z.\s]+$/;
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
  // Method to Open History Dialog
  historyDialog(data?: any): void {
    if (data) {
      const dialogRef = this.dialog.open(HistoryDialogComponent, {
        width: '1200px',
        data: data,
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    } else {
      const dialogRef = this.dialog.open(HistoryDialogComponent, {
        width: '1200px',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }

  // Method to Reset Form
  resetForm(formName) {
    formName.reset();
  }

  // Method to redirect to another screen
  goToScreen(path) {
    this.router.navigate(['/dashboard' + path]);
  }

  // Method to get viewValue from value
  getViewValue(list, value) {
    let viewValue;
    list.forEach(item => {
      if (item.value === '' + value) { viewValue = item.viewValue; }
    });
    return viewValue;
  }

  totalexpenditureAmount(dataSourceData) {
    let Amount = 0;
    dataSourceData.forEach((element) => {
      Amount = Amount + Number(element.expenditureAmount);
    });
    return Amount;
  }

  totalHeadWiseAmount(dataSourceData) {
    let Amount = 0;
    dataSourceData.forEach((element) => {
      Amount = Amount + Number(element.headwiseCancelChequeAmount);
    });
    return Amount;
  }

  totalHeadWiseAvailableAmount(dataSourceData) {
    let Amount = 0;
    dataSourceData.forEach((element) => {
      Amount = Amount + Number(element.availableAmount);
    });
    return Amount;
  }

  totalChequeAmount(dataSourceData) {
    let Amount = 0;
    dataSourceData.forEach((element) => {
      Amount = Amount + Number(element.chequeAmount);
    });
    return Amount;
  }

  totalEPaymentAmount(dataSourceData) {
    let Amount = 0;
    dataSourceData.forEach((element) => {
      Amount = Amount + Number(element.epaymentAmount);
    });
    return Amount;
  }

  totalAmount(dataSourceData) {
    let Amount = 0;
    dataSourceData.forEach((element) => {
      Amount = Amount + Number(element.amount);
    });
    return Amount;
  }

  decimalKeyPress(event) {
    const pattern = /^\d+(\.\d{0,2})?$/;
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

  getTabIndex(tabIndex) {
    this.selectedIndex = tabIndex;
    const temp = this.selectedIndex;
  }

  goToNext() {
    this.tabDisable = false;
    this.selectedIndex = 1;
  }

  // Methods for upload document start
  onFileSelection(fileSelected, brwoseData) {
    if (fileSelected.target && fileSelected.target.files) {
      brwoseData[this.fileBrowseIndex].file =
        fileSelected.target.files[0];
    }
  }

  openFileSelector(index) {
    this.el.nativeElement.querySelector('#fileBrowse').click();
    this.fileBrowseIndex = index;
  }

  addBrowse(dataSourceBrowse) {
    if (dataSourceBrowse) {
      const data = dataSourceBrowse.data[
        dataSourceBrowse.data.length - 1
      ];
      if (data && data.name && data.file) {
        const p_data = dataSourceBrowse.data;
        p_data.push({
          attachmentType: undefined,
          fileName: undefined,
          browse: undefined,
          uploadedFileName: '',
          uploadedBy: '',
        });
        dataSourceBrowse.data = p_data;
      }
    }
  }

  removeRow(index, dataSourceBrowse) {
    dataSourceBrowse.data.splice(index, 1);
  }
      /**
     * @description Close Button Click
     */
       goToDashboard() {
        const proceedMessage = MESSAGES.PROCEED_MESSAGE;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard/lc'], { skipLocationChange: true });
            }
        });
    }
    
}
