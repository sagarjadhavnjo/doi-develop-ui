import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ROPService } from '../service/rop.service';
import { DataConst } from 'src/app/shared/constants/pvu/pvu-data.constants';
import { CommonService } from 'src/app/modules/services/common.service';


@Component({
    selector: 'app-rop-comments',
    templateUrl: 'rop-comments.component.html',
    styleUrls: ['./rop-comments.component.css']
})
export class RopCommentsComponent implements OnInit {
    public menuId;
    public linkMenuId;
    public postId;
    public wfRoleIds;
    public wfRoleCode;
    public trnId;
    public userId;
    public wfStatus;
    public lkPoOffUserId;
    refenceNo: string = '';
    heading: string = '';
    date: any = new Date();
    headerJSON = [];
    errorMessages = {};

    forwardDialog_history_list: any[] = [];

    constructor(
        private toastr: ToastrService,
        public dialogRef: MatDialogRef<RopCommentsComponent>,
        private commonService: CommonService,
        @Inject(MAT_DIALOG_DATA) public data,
        private ropService: ROPService
    ) { }

    ngOnInit() {
        this.ropService.getCurrentUserDetail().then(res => {
            if (res) {
                this.wfRoleIds = res['wfRoleId'];
                this.wfRoleCode = res['wfRoleCode'];
                this.menuId = this.commonService.getMenuId();
                this.linkMenuId = this.commonService.getLinkMenuId();
                this.postId = res['postId'];
                this.userId = res['userId'];
                this.lkPoOffUserId = res['lkPoOffUserId'];
                this.getData();
            }
        });
        console.log(this.linkMenuId, 'menu id');
        this.heading = this.data.heading;
    }
    getData() {
        const param = {
            'id': Number(this.data.empId)
        };
        this.ropService.getWorkFlowEmpDetail(param).subscribe((data) => {
            if (data && data['result']) {
                const datePipe = new DatePipe('en-US');
                const joinDate = datePipe.transform(data['result']['dateOfJoining'], 'dd-MMM-yyyy');
                const datePipe1 = new DatePipe('en-US');
                const retireDate = datePipe1.transform(data['result']['dateOfRetirement'], 'dd-MMM-yyyy');
                this.headerJSON.push(
                    { label: 'Employee Name', value: data['result']['salutation'] + ' ' + data['result']['employeeName']
                    + ' ' + data['result']['middelName'] + ' ' + data['result']['lastName'] },
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
        let linkmenu;
        if (this.linkMenuId === null || this.linkMenuId === '' || this.linkMenuId === undefined) {
            linkmenu = 70;
        } else {
            linkmenu = this.linkMenuId;
        }
        const histParam = {
            'eventId': null,
            'menuId': linkmenu,
            'officeId': this.data.officeId,
            'postId': this.postId,
            'trnId': this.data.eventId,
            'wfRoleCode': this.wfRoleCode,
            'wfRoles': this.wfRoleIds
        };
        this.ropService.getWorkFlowReview(histParam).subscribe((data) => {
            if (data && data['result'] && data['result'].length > 0) {
                this.forwardDialog_history_list = data['result'];
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    onNoClick() { }
}
