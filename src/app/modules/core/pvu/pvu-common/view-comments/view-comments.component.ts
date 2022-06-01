import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PvuCommonService } from '../services/pvu-common.service';
import { TransactionNumberDialogComponent } from '../transaction-number-dialog/transaction-number-dialog.component';
import { IncrementCreationService } from '../../increment/services/increment-creation.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { COMMON_APIS, COMMON_MESSAGES } from '..';

@Component({
    selector: 'app-view-comments',
    templateUrl: './view-comments.component.html',
    styleUrls: ['./view-comments.component.css']
})
export class ViewCommentsComponent implements OnInit {
    remarksLabel = COMMON_MESSAGES.VIEW_REMARKS_LABEL;

    public menuId;
    public linkMenuId;
    public postId;
    public wfRoleIds;
    public wfRoleCode;
    public trnId;
    public userId;
    public wfStatus;
    public lkPoOffUserId;
    public officeId;

    event;
    eventId;
    trnNo;
    initiationDate;
    headerJSON = [];
    actionResponse;
    userResponse;

    forwardDialog_history_list = [];

    action_list: object[] = [];
    user_list: object[] = [];
    financialYearList;
    financialYearId;
    isPVU = false;
    checkAll = false;

    actionCtrl: FormControl = new FormControl();
    userCodeCtrl: FormControl = new FormControl();
    loader: boolean = true;
    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private pvuService: PvuCommonService,
        private incrementCreationService: IncrementCreationService,
        public dialogRef: MatDialogRef<ViewCommentsComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private el: ElementRef,
        private commonService: CommonService,
    ) {
        dialogRef.disableClose = true;
    }
    ngOnInit() {
        // this.getFinancialYears();
        this.trnNo = this.data.trnNo;
        this.initiationDate = this.data.initiationDate;
        this.event = this.data.event;
        this.eventId = this.data.eventId;
        if (this.data.isPVU) {
            this.isPVU = true;
        }
        if (this.data.remarksLabel) {
            this.remarksLabel = this.data.remarksLabel;
        }
        this.pvuService.getCurrentUserMultipleRoleDetail().then(res => {
            if (res) {
                this.wfRoleIds = res['wfRoleId'];
                this.menuId = res['menuId'];
                this.postId = res['postId'];
                this.userId = res['userId'];
                this.officeId = res['officeDetail']['officeId'];
                this.wfRoleCode = res['wfRoleCode'];
                this.linkMenuId = this.commonService.getLinkMenuId();
                this.lkPoOffUserId = res['lkPoOffUserId'];
                this.getData();
            }
        });
    }

    /**
    * @description Get Header (Employee/Event) Details, workflow history
    */
    getData() {
        if (this.data.empId) {
            const param = {
                'id': this.data.empId
            };
            this.pvuService.getWorkFlowEmpDetail(param).subscribe((data) => {
                if (data && data['result']) {
                    const datePipe = new DatePipe('en-US');
                    const joinDate = datePipe.transform(data['result']['dateOfJoining'], 'dd-MMM-yyyy');
                    const datePipe1 = new DatePipe('en-US');
                    const retireDate = datePipe1.transform(data['result']['dateOfRetirement'], 'dd-MMM-yyyy');
                    this.headerJSON.push(
                        { label: 'Employee Name', value: data['result']['salutation'] + ' '
                        + data['result']['employeeName'] + ' ' + data['result']['middelName'] + ' '
                        + data['result']['lastName'] },
                        { label: 'Employee Class', value: data['result']['className'] },
                        { label: 'Employee Designation', value: data['result']['designationName'] },
                        { label: 'Date of Joining', value: joinDate },
                        { label: 'Date of Retirement', value: retireDate },
                        { label: 'Applicable Pay Commission', value: data['result']['payLevelName'] }
                    );
                }
            });
        }
        if (this.data.trnId && this.data.event === 'INCREMENT') {
            const param = {
                'id': this.data.trnId
            };
            this.incrementCreationService.getIncrementDetail(param).subscribe(res => {
                if (res && res['result']) {
                    const datePipe = new DatePipe('en-US');
                    const incrementEffDate = datePipe.transform(res['result']['incrementEffDate'], 'dd-MMM-yyyy');
                    const datePipe1 = new DatePipe('en-US');
                    const dateNextInc = datePipe1.transform(res['result']['dateNextInc'], 'dd-MMM-yyyy');
                    // let data;
                    // if (this.financialYearList) {
                    //     data = this.financialYearList.filter(obj => {
                    //         return obj.financialYearId === res['result']['financialYear'];
                    //     })[0].fyStart;
                    // }
                    this.headerJSON.push(
                        { label: 'Reference Number.', value: res['result']['trnNo'] },
                        { label: 'Financial Year', value: res['result']['financialYearName'] },
                        { label: 'Effective Date', value: incrementEffDate },
                        { label: 'Date of Next Increment', value: dateNextInc },
                        { label: 'Pay Commission', value: res['result']['incrementForName'] },
                        { label: 'Increment Type', value: res['result']['incrementTypeName'] }
                    );
                }
            });
        }
        if (this.data.trnId && this.menuId) {
            const param = {
                'trnId': this.data.trnId,
                'menuId': this.menuId
            };
            if (this.eventId) {
                param['eventId'] = this.eventId;
            }
            let url = COMMON_APIS.WORKFLOW.GET_HISTORY;
            if (this.isPVU) {
                param['eventId'] = this.eventId;
                param['menuId'] = this.linkMenuId;
                param['officeId'] = this.data.officeId;
                param['postId'] = this.postId;
                param['wfRoleCode'] = this.wfRoleCode;
                param['wfRoles'] = this.wfRoleIds;
                url = COMMON_APIS.WORKFLOW.GET_PVU_HISTORY;
            }
            this.pvuService.getWorkFlowReview(param, url).subscribe((data) => {
                if (data && data['result'] && data['result'].length > 0) {
                    this.forwardDialog_history_list = data['result'];
                }
            });
        }
    }

    /**
     * @description Method invoked on the click of Cancel button
     */
    onNoClick(): void {
        this.dialogRef.close('no');
    }

    /**
     * @description Method to select all checkbox
     * @param event checkbox event
     */
    selectAll(event) {
        this.forwardDialog_history_list.forEach((element) => {
            element.isChecked = this.checkAll;
        });
    }

    /**
     * @description Checkbox change method
     * @param event click event
     * @param i index
     * @param element row element
     */
    onCheckboxChange(event, i, element) {
        if (this.forwardDialog_history_list.every(el => {
            return el.isChecked;
        })) {
            this.checkAll = true;
        }
    }

    onPrint() {
        const params = {
                'id': this.data.trnId
            };
        this.pvuService.viewComments(params).subscribe(res => {
            if (res) {
                const file = res['result'];
                const docType = 'application/pdf';
                const byteArray = new Uint8Array(atob(file).split('').map(char => char.charCodeAt(0)));
                const blob = new Blob([byteArray], { type: docType });
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blob);
                    this.loader = false;
                } else {
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                }
            }
        }, err => {
            this.toastr.error(err);
        });
    }
}

