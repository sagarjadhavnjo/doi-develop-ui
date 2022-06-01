import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TBillRediscounting } from '../../../model/dmo';
@Component({
  selector: 'app-tbill-rediscounting',
  templateUrl: './tbill-rediscounting.component.html',
  styleUrls: ['./tbill-rediscounting.component.css']
})
export class TbillRediscountingComponent implements OnInit {
  tBillRediscountingForm: FormGroup;
  errorMessages = dmoMessage;
  popupFor = 'for91Days';

  // TbillRediscounting data
  tBillRediscountingData: TBillRediscounting[] = [
    {
      issueDate: '',
      originalFaceValue: '',
      currentFaceValue: '',
      rediscountAmount: '',
      faceValueOfRediscounted: '',
      residualAmount: '',
    }
  ];
  tBillRediscountingDataSource = new MatTableDataSource<TBillRediscounting>(this.tBillRediscountingData);
  tBillRediscountingDisplayedColumns: string[] = [
    'issueDate',
    'originalFaceValue',
    'currentFaceValue',
    'rediscountAmount',
    'faceValueOfRediscounted',
    'residualAmount',
    'action'
  ];


  directiveObj: CommonDirective = new CommonDirective();
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<TbillRediscountingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data === 'for91') {
      this.popupFor = 'for91Days';
    } else {
      this.popupFor = 'for14Days';
    }
  }

  ngOnInit() {
    this.tBillRediscountingForm = this.fb.group({
      fourteenDayTBillBalance: [''],
      fourteenDaysTBillClosingBalance: [''],
      fourteenDayTBillRediscount: [''],

      ninetyOneDayTBillBalance: [''],
      ninetyOneDaysTBillClosingBalance: [''],
      ninetyOneDayTBillRediscount: [''],
    });
    // if (this.popupFor === 'for14Days') {

    // } else if (this.popupFor === 'for91Days') {

    // } else {

    // }
  }
  add() {
    this.tBillRediscountingDataSource.data.push({
      issueDate: '',
      originalFaceValue: '',
      currentFaceValue: '',
      rediscountAmount: '',
      faceValueOfRediscounted: '',
      residualAmount: '',
    });
    this.tBillRediscountingDataSource.data = this.tBillRediscountingDataSource.data;
  }

  onSubmit() {
    this.dialogRef.close('Submit');
  }
  onClose() {
    this.dialogRef.close('Closed');
  }

}
