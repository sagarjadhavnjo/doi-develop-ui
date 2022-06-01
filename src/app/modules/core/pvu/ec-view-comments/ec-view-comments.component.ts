import { Component, OnInit, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeCreationService } from 'src/app/modules/services/pvu/employee-creation.service';


@Component({
    selector: 'app-ec-view-comments',
    templateUrl: 'ec-view-comments.component.html',
    styleUrls: ['./ec-view-comments.component.css']
})
export class EcViewCommentsComponent implements OnInit {
    refenceNo: string = '';
    heading: string = '';
    date: any = new Date();
    headerJSON = [];
    errorMessages = {};

    forwardDialog_history_list: any[] = [];

    constructor(
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<EcViewCommentsComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private employeeCreationService: EmployeeCreationService
    ) { }

    ngOnInit() {
        // this.employeeCreationService.getCurrentUserDetail().then(res => {
        //     if (res) {
        //         this.wfRoleIds = res['wfRoleId'];
        //         this.wfRoleCode = res['wfRoleCode'];
        //         this.menuId = this.commonService.getMenuId();
        //         this.linkMenuId = this.commonService.getLinkMenuId();
        //         this.postId = res['postId'];
        //         this.userId = res['userId'];
        //         this.lkPoOffUserId = res['lkPoOffUserId'];
        //         this.getData();
        //         console.log(this.linkMenuId, 'menu id');
        //     }
        // });
        this.getData();
        this.heading = this.data.heading;
    }
    getData() {
        const param = {
            'id': Number(this.data.empId)
        };
        this.employeeCreationService.getWorkFlowEmpDetail(param).subscribe((data) => {
            if (data && data['result']) {
                const datePipe = new DatePipe('en-US');
                const joinDate = datePipe.transform(data['result']['dateOfJoining'], 'dd-MMM-yyyy');
                const datePipe1 = new DatePipe('en-US');
                const retireDate = datePipe1.transform(data['result']['dateOfRetirement'], 'dd-MMM-yyyy');
                this.headerJSON.push(
                    {
                        label: 'Employee Name',
                        value: data['result']['salutation'] + ' ' + data['result']['employeeName']
                        + ' ' + data['result']['middelName'] + ' ' + data['result']['lastName']
                    },
                    { label: 'Employee Class', value: data['result']['className'] },
                    { label: 'Employee Designation', value: data['result']['designationName'] },
                    { label: 'Date of Joining', value: joinDate },
                    { label: 'Date of Retirement', value: retireDate },
                    { label: 'Applicable Pay Commission', value: data['result']['payLevelName'] }
                );
            } else {
                this.toastr.error(data['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
        this.getWfHistory(param);
    }

    getWfHistory(param) {
        this.employeeCreationService.getWorkFlowReview(param).subscribe((data) => {
            if (data && data['result'] && data['result'].length > 0) {
                this.forwardDialog_history_list = data['result'];
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }
    onNoClick() { }
}
