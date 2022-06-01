import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Overdraft } from '../../../model/dmo';
@Component({
  selector: 'app-overdraft-dialog',
  templateUrl: './overdraft-dialog.component.html',
  styleUrls: ['./overdraft-dialog.component.css']
})
export class OverdraftDialogComponent implements OnInit {

  overdrafForm: FormGroup;
  errorMessages = dmoMessage;
  popupFor = 'for14Days';
  overdrafType = 'advance';
  header = 'Overdraft Advance';

  // Overdraft Table data
  overdrafData: Overdraft[] = [];
  overdrafDataSource = new MatTableDataSource<Overdraft>(this.overdrafData);
  overdrafDisplayedColumns: string[] = [
    'totalOutstandingOverdraf',
    'noOfDaysInOverdraf',
    'interestRate',
    'interestPayable',
    'interestPaid',
    'perOfOverdrafLimitUtilized',
  ];


  directiveObj: CommonDirective = new CommonDirective();
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<OverdraftDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.overdrafType = data;
    } else {
      this.overdrafType = 'advance';
    }
    switch (this.overdrafType) {
      case 'advance': this.header = 'Overdraft Advance';
        this.overdrafData = [{
          totalOutstandingOverdraf: '67,467.00',
          noOfDaysInOverdraf: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '0.00',
          perOfOverdrafLimitUtilized: '0.00',
        }];
        break;

      case 'principal': this.header = 'Overdraft Principal Payment';
        this.overdrafData = [{
          totalOutstandingOverdraf: '67,467.00',
          noOfDaysInOverdraf: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '0.00',
          perOfOverdrafLimitUtilized: '0.00',
        }];
        break;

      case 'interest': this.header = 'Overdraft Interest Payment ';
        this.overdrafData = [{
          totalOutstandingOverdraf: '67,467.00',
          noOfDaysInOverdraf: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '0.00',
          perOfOverdrafLimitUtilized: '0.00',
        }];
        break;

      default: this.header = 'Overdraft Advance';
        this.overdrafData = [{
          totalOutstandingOverdraf: '67,467.00',
          noOfDaysInOverdraf: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '0.00',
          perOfOverdrafLimitUtilized: '0.00',
        }];
        break;
    }
    this.overdrafDataSource = new MatTableDataSource<Overdraft>(this.overdrafData);
  }

  ngOnInit() {
    this.overdrafForm = this.fb.group({
      overdrafOutstanding: [{ value: ' ', disabled: true }],
      overdrafAmount: [{ value: '67,467.00', disabled: true }],
    });
  }
  // On click of submit button
  onSubmit() {
    this.dialogRef.close('Submit');
  }
  // On click of Close button
  onClose() {
    this.dialogRef.close('Closed');
  }
}
