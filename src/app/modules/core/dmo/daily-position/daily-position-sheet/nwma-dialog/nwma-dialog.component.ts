import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Nwma } from '../../../model/dmo';
@Component({
  selector: 'app-nwma-dialog',
  templateUrl: './nwma-dialog.component.html',
  styleUrls: ['./nwma-dialog.component.css']
})
export class NwmaDialogComponent implements OnInit {
  nwmaForm: FormGroup;
  errorMessages = dmoMessage;
  popupFor = 'for14Days';
  nwmaType = 'advance';
  header = 'NWMA Advance';

  // NWMA Table data
  nwmaData: Nwma[] = [];
  nwmaDataSource = new MatTableDataSource<Nwma>(this.nwmaData);
  nwmaDisplayedColumns: string[] = [
    'totalOutstandingNwma',
    'noOfDaysInNwma',
    'interestRate',
    'interestPayable',
    'interestPaid',
    'perOfNwmaLimitUtilized',
  ];


  directiveObj: CommonDirective = new CommonDirective();
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<NwmaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.nwmaType = data;
    } else {
      this.nwmaType = 'advance';
    }
    switch (this.nwmaType) {
      case 'advance': this.header = 'NWMA Advance';
        this.nwmaData = [{
          totalOutstandingNwma: '67,467.00',
          noOfDaysInNwma: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '0.00',
          perOfNwmaLimitUtilized: '0.00',
        }];
        break;

      case 'principal': this.header = 'NWMA Principal Payment';
        this.nwmaData = [{
          totalOutstandingNwma: '0.00',
          noOfDaysInNwma: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '67,467.00',
          perOfNwmaLimitUtilized: '0.00',
        }];
        break;

      case 'interest': this.header = 'NWMA Interest Payment ';
        this.nwmaData = [{
          totalOutstandingNwma: '0.00',
          noOfDaysInNwma: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '67,467.00',
          perOfNwmaLimitUtilized: '0.00',
        }];
        break;

      default: this.header = 'NWMA Advance';
        this.nwmaData = [{
          totalOutstandingNwma: '67,467.00',
          noOfDaysInNwma: '1',
          interestRate: '',
          interestPayable: '0.00',
          interestPaid: '0.00',
          perOfNwmaLimitUtilized: '0.00',
        }];
        break;
    }
    this.nwmaDataSource = new MatTableDataSource<Nwma>(this.nwmaData);
  }

  ngOnInit() {
    this.nwmaForm = this.fb.group({
      normalWaysMeansLimit: [{ value: ' ', disabled: true }],
      nwmaOutstanding: [{ value: '0.00', disabled: true }],
      nwmaAdvances: [{ value: '67,467.00', disabled: true }],
      nwmaOutstandingRs: [{ value: ' ', disabled: true }],
      nwmaRepaymentRs: [{ value: '0.00', disabled: true }],
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
