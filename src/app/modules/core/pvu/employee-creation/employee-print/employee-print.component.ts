import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';

@Component({
  selector: 'app-employee-print',
  templateUrl: './employee-print.component.html',
  styleUrls: ['./employee-print.component.css']
})
export class EmployeePrintComponent implements OnInit, AfterViewInit {

  EmployeeData;
  date: Date = new Date();
  dummyArray = [];
  errorMessages = pvuMessage;

  constructor(
    public dialogRef: MatDialogRef<EmployeePrintComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngAfterViewInit(): void {
    const htmlData = document.getElementById('print-section').innerHTML;
    this.dialogRef.close(htmlData);
  }

  ngOnInit() {
  }

}
