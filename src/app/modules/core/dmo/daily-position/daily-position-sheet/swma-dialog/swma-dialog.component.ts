import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Swma } from '../../../model/dmo';
@Component({
  selector: 'app-swma-dialog',
  templateUrl: './swma-dialog.component.html',
  styleUrls: ['./swma-dialog.component.css']
})
export class SwmaDialogComponent implements OnInit {
  swmaForm: FormGroup;
  errorMessages = dmoMessage;
  popupFor = 'for14Days';
  swmaType = 'advance';
  header = 'SWMA Advance';

  // SWMA Table data
  swmaData: Swma[] = [];
  swmaDataSource = new MatTableDataSource<Swma>(this.swmaData);
  swmaDisplayedColumns: string[] = [
    'totalOutstandingSwma',
    'noOfDaysInSwma',
    'interestRate',
    'interestPayable',
    'interestPaid',
    'perOfSwmaLimitUtilized',
  ];


  directiveObj: CommonDirective = new CommonDirective();
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<SwmaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.swmaType = data;
    } else {
      this.swmaType = 'advance';
    }
    switch (this.swmaType) {
      case 'advance': this.header = 'SWMA Advance';
        this.swmaData = [{
          totalOutstandingSwma: '67,467.00',
          noOfDaysInSwma: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '0.00',
          perOfSwmaLimitUtilized: '0.00',
        }];
        break;

      case 'principal': this.header = 'SWMA Principal Payment';
        this.swmaData = [{
          totalOutstandingSwma: '0.00',
          noOfDaysInSwma: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '67,467.00',
          perOfSwmaLimitUtilized: '0.00',
        }];
        break;

      case 'interest': this.header = 'SWMA Interest Payment ';
        this.swmaData = [{
          totalOutstandingSwma: '67,467.00',
          noOfDaysInSwma: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '0.00',
          perOfSwmaLimitUtilized: '0.00',
        }];
        break;

      default: this.header = 'SWMA Advance';
        this.swmaData = [{
          totalOutstandingSwma: '67,467.00',
          noOfDaysInSwma: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '0.00',
          perOfSwmaLimitUtilized: '0.00',
        }];
        break;
    }
    this.swmaDataSource = new MatTableDataSource<Swma>(this.swmaData);
  }

  ngOnInit() {
    this.swmaForm = this.fb.group({
      normalWaysMeansLimit: [{ value: ' ', disabled: true }],
      swmaOutstanding: [{ value: '0.00', disabled: true }],
      swmaAdvances: [{ value: '67,467.00', disabled: true }],
      swmaOutstandingRs: [{ value: ' ', disabled: true }],
      swmaRepaymentRs: [{ value: '0.00', disabled: true }],
      interestPaymentRs: [{ value: '67,467.00', disabled: true }],
    });
  }
  onSubmit() {
    this.dialogRef.close('Submit');
  }
  onClose() {
    this.dialogRef.close('Closed');
  }
}
