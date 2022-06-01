import { Component, OnInit, Inject } from '@angular/core';
import { ROPService } from '../service/rop.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-re-print-history',
  templateUrl: './re-print-history.component.html',
  styleUrls: ['./re-print-history.component.css']
})
export class RePrintHistoryComponent implements OnInit {

  heading = 'Reprint History';
  public trnId;
  headerJSON: any[] = [];

  forwardDialog_history_list: any[] = [];
  params: any;

  constructor(
    private toastr: ToastrService,
    private service: ROPService,
    public dialogRef: MatDialogRef<RePrintHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.getEmployeeDetails();
    this.getReprintHistory();
    this.trnId = Number(this.data.id);
  }

  /**
   * to get the Remarks History
   */

  getReprintHistory() {
    this.params = {
      id: Number(this.data.id)
    };
    this.service.reprintRemarksHistory(this.params).subscribe(res => {
      if (res && res['result']) {
        this.forwardDialog_history_list = _.cloneDeep(res['result']);
      } else {
        this.toastr.error(res['message']);
      }
    }, err => {
      this.toastr.error(err);
    });
  }

  /**
   * To get the Employee Details
   */

  getEmployeeDetails() {
    const param = {
      'id': Number(this.data.empId)
    };
    this.service.getWorkFlowEmpDetail(param).subscribe((data) => {
      if (data && data['result']) {
        const datePipe = new DatePipe('en-US');
        const joinDate = datePipe.transform(data['result']['dateOfJoining'], 'dd-MMM-yyyy');
        const datePipe1 = new DatePipe('en-US');
        const retireDate = datePipe1.transform(data['result']['dateOfRetirement'], 'dd-MMM-yyyy');
        this.headerJSON.push(
          { label: 'Employee Name', value: data['result']['employeeName'] },
          { label: 'Employee Class', value: data['result']['className'] },
          { label: 'Employee Designation', value: data['result']['designationName'] },
          { label: 'Date of Joining', value: joinDate },
          { label: 'Date of Retirement', value: retireDate },
          // { label: 'Applicable Pay Commission', value: data['result']['payLevelName'] }
          { label: 'Office Name', value: data['result']['officeName'] }
        );
      } else {
        this.toastr.error(data['message']);
      }
    }, (err) => {
      this.toastr.error(err);
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
