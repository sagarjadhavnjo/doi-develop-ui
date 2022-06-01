import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TBillInvestment } from '../../../model/dmo';

@Component({
  selector: 'app-tbill-investment',
  templateUrl: './tbill-investment.component.html',
  styleUrls: ['./tbill-investment.component.css']
})
export class TbillInvestmentComponent implements OnInit {
  tBillInvestmentForm: FormGroup;
  errorMessages = dmoMessage;
  popupFor = 'for14Days';

  // T-Bill Invenstment Table data
  tBillInvestmentData: TBillInvestment[] = [
    {
      dateOfInvestment: '',
      dateOfMaturity: '',
      faceValue: '',
      discountValue: '',
      costValue: '',
      yield: '',
    }
  ];
  tBillInvestmentDataSource = new MatTableDataSource<TBillInvestment>(this.tBillInvestmentData);
  tBillInvestmentDisplayedColumns: string[] = [
    'dateOfInvestment',
    'dateOfMaturity',
    'faceValue',
    'discountValue',
    'costValue',
    'yield',
  ];


  directiveObj: CommonDirective = new CommonDirective();
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<TbillInvestmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data === 'for91') {
      this.popupFor = 'for91Days';
      this.tBillInvestmentDisplayedColumns = [
        'dateOfInvestment',
        'dateOfMaturity',
        'costValue',
        'intimationNo',
        'intimationDate',
        'amountIntimatedRs',
        'yield',
      ];
    } else {
      this.popupFor = 'for14Days';
      this.tBillInvestmentDisplayedColumns = [
        'dateOfInvestment',
        'dateOfMaturity',
        'faceValue',
        'discountValue',
        'costValue',
        'yield',
      ];
    }
  }

  ngOnInit() {
    this.tBillInvestmentForm = this.fb.group({
      fourteenDayTBillBalance: [''],
      fourteenDaysTBillClosingBalance: [''],

      ninetyOneDayTBillBalance: [''],
      ninetyOneDaysTBillClosingBalance: [''],
    });
  }
  onSubmit() {
    this.dialogRef.close('Submit');
  }
  onClose() {
    this.dialogRef.close('Closed');
  }
}
