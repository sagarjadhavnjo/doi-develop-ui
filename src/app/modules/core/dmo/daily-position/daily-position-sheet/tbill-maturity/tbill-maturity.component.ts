import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TBillMaturity } from '../../../model/dmo';

@Component({
  selector: 'app-tbill-maturity',
  templateUrl: './tbill-maturity.component.html',
  styleUrls: ['./tbill-maturity.component.css']
})
export class TbillMaturityComponent implements OnInit {
  tBillMaturityForm: FormGroup;
  errorMessages = dmoMessage;
  popupFor = 'for91Days';


  //  TbillMaturity Table data
  tBillMaturityData: TBillMaturity[] = [
    {
      issueDate: '',
      originalFaceValue: '',
      currentFaceValue: '',
    }
  ];
  tBillMaturityDataSource = new MatTableDataSource<TBillMaturity>(this.tBillMaturityData);
  tBillMaturityDisplayedColumns: string[] = [
    'issueDate',
    'originalFaceValue',
    'currentFaceValue',
    'action'
  ];


  directiveObj: CommonDirective = new CommonDirective();
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<TbillMaturityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data === 'for91') {
      this.popupFor = 'for91Days';
    } else {
      this.popupFor = 'for14Days';
    }
  }
  ngOnInit() {
    this.tBillMaturityForm = this.fb.group({
      fourteenDayTBillBalance: [''],
      fourteenDaysTBillClosingBalance: [''],
      fourteenDayTBillMaturity: [''],

      ninethOneDayTBillBalance: [''],
      ninethOneDaysTBillClosingBalance: [''],
      ninethOneDayTBillMaturity: [''],
    });
  }
  add() {
    this.tBillMaturityDataSource.data.push({
      issueDate: '',
      originalFaceValue: '',
      currentFaceValue: '',
    });
    this.tBillMaturityDataSource.data = this.tBillMaturityDataSource.data;
  }
  onSubmit() {
    this.dialogRef.close('Submit');
  }
  onClose() {
    this.dialogRef.close('Closed');
  }

}
