import { PvuCommonService } from './../../../../pvu-common/services/pvu-common.service';
import { ToastrService } from 'ngx-toastr';
import { PVUWorkflowService } from './../../services/pvu-workflow.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
@Component({
    selector: 'app-print-remarks-history-dailog',
    templateUrl: './print-remarks-history-dailog.component.html',
    styleUrls: ['./print-remarks-history-dailog.component.css']
})
export class PrintRemarksHistoryDailogComponent implements OnInit {

    heading = 'Reprint History';
    public trnId;
    headerJSON: any[] = [];

    forwardDialog_history_list: any[] = [];
    params: any;

    constructor(
        private toastr: ToastrService,
        private service: PVUWorkflowService,
        private pvuCommonservice: PvuCommonService,
        public dialogRef: MatDialogRef<PrintRemarksHistoryDailogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {
        dialogRef.disableClose = true;
    }

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
        this.service.reprintRemarksHistory(this.params, this.data.eventType).subscribe(res => {
            if (res && res['result']) {
                this.forwardDialog_history_list = cloneDeep(res['result']);
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
        this.pvuCommonservice.getWorkFlowEmpDetail(param).subscribe((data) => {
            if (data && data['result']) {
                const datePipe = new DatePipe('en-US');
                const joinDate = datePipe.transform(data['result']['dateOfJoining'], 'dd-MMM-yyyy');
                const datePipe1 = new DatePipe('en-US');
                const retireDate = datePipe1.transform(data['result']['dateOfRetirement'], 'dd-MMM-yyyy');
                this.headerJSON.push(
                    { label: 'Employee Name',
                    value: (data['result']['salutation'] ? data['result']['salutation']  + ' '  : '')
                    + (data['result']['employeeName']  + ' ' )
                    + (data['result']['middelName'] ? data['result']['middelName'] + ' ' : '')
                    + (data['result']['lastName'] ? data['result']['lastName'] + ' ' : '')},
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
