import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup, ValidatorFn, } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PvuCommonService } from '../services/pvu-common.service';
import { TransactionNumberDialogComponent } from '../transaction-number-dialog/transaction-number-dialog.component';
import { IncrementCreationService } from '../../increment/services/increment-creation.service';
import { CommonService } from 'src/app/modules/services/common.service';
import * as _ from 'lodash';
import { PVUUTransactionDialogEventComponent } from '../forward-dialog-pvu/transaction-dialog.component';
// import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { COMMON_APIS } from '..';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
const COMMON_ERROR_MESSAGES = COMMON_APIS.COMMON_ERROR_MESSAGES;

const trimValidator: ValidatorFn = (control: FormControl) => {
    if (control.value.startsWith(' ')) {
        return {
            'trimError': { value: 'control has leading whitespace' }
        };
    }
    if (control.value.endsWith(' ')) {
        return {
            'trimError': { value: 'control has trailing whitespace' }
        };
    }
    return null;
};
@Component({
    selector: 'app-forward-dialog',
    templateUrl: './forward-dialog.component.html',
    styleUrls: ['./forward-dialog.component.css']
})
export class ForwardDialogComponent implements OnInit {

    public menuId;
    public officeId;
    public postId;
    public wfRoleIds;
    public trnId;
    public userId;
    public wfStatus;
    public lkPoOffUserId;

    event;
    eventName;
    eventId = undefined;
    trnNo;
    initiationDate;
    isUserRequired = true;
    isSubmitted = false;
    isApprove = false;
    showAction = true;
    fileBrowseIndex: number;
    date = new Date();
    headerJSON = [];
    actionResponse;
    userResponse;
    workflowForm: FormGroup;

    forwardDialog_history_list = [];

    action_list: object[] = [];
    user_list: object[] = [];
    financialYearList;
    financialYearId;

    actionCtrl: FormControl = new FormControl();
    userCodeCtrl: FormControl = new FormControl();

    public errorMessages = {
        ACTION: 'Please select action',
        USER: 'Please select user',
        REMARKS: 'Please fill Remarks',
    };

    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private pvuService: PvuCommonService,
        private incrementCreationService: IncrementCreationService,
        public dialogRef: MatDialogRef<ForwardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private el: ElementRef,
        private commonService: CommonService,
    ) {
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.getFinancialYears();
        // this.errorMessages = pvuMessage;
        this.workflowForm = this.fb.group({
            workflowAction: ['', Validators.required],
            user: ['', Validators.required],
            remarks: ['', [Validators.required, trimValidator]]
        });

        this.trnNo = this.data.trnNo;
        this.initiationDate = this.data.initiationDate;
        this.event = this.data.event;
        if (!this.data.isEightScreen) {
            this.eventName = this.event;
        } else {
            this.eventName = this.data.eventName;
        }
        this.eventId = this.data.eventId;
        // TODO this wf component called in suspension eol also
            // For that added below if condition
                // at time of implementation in suspension need to add event name
                    // or remove below condition
        this.pvuService.getCurrentUserMultipleRoleDetail().then(res => {
            if (res) {
                this.wfRoleIds = res['wfRoleId'];
                this.menuId = res['menuId'];
                this.postId = res['postId'];
                this.userId = res['userId'];
                this.officeId = res['officeDetail']['officeId'];
                this.lkPoOffUserId = res['lkPoOffUserId'];
                this.getData();
            }
        });
    }

    /**
     * @description Get Header (Employee/Event) Details, workflow history,workflow actions
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
                        { label: 'Reference No.', value: res['result']['trnNo'] },
                        { label: 'Financial Year', value: res['result']['financialYearName'] },
                        { label: 'Effective Date', value: incrementEffDate },
                        { label: 'Date of Next Increment', value: dateNextInc },
                        { label: 'Pay Commission', value: res['result']['incrementForName'] }
                        // { label: 'Increment Type', value: res['result']['incrementTypeName'] }
                    );
                }
            });
        }
        if (this.data.trnId && this.menuId) {
            const param = {
                'trnId': this.data.trnId,
                'menuId': this.menuId
            };
            param['eventId'] = this.eventId;
            const url = COMMON_APIS.WORKFLOW.GET_HISTORY;
            this.pvuService.getWorkFlowReview(param, url).subscribe((data) => {
                if (data && data['result'] && data['result'].length > 0) {
                    this.forwardDialog_history_list = _.cloneDeep(data['result']);
                    _.forEach(this.forwardDialog_history_list, function (item) {
                        if (item.createdDate) {
                            const createdDateTime = item.createdDate.split('T'),
                                createdDate = createdDateTime[0].split('-'),
                                createdTime = createdDateTime[1].split('.')[0].split(':');
                            // tslint:disable-next-line: max-line-length
                            item.createdDate = new Date(createdDate[0], createdDate[1] - 1, createdDate[2], createdTime[0], createdTime[1], createdTime[2]);

                        }
                    });
                }
            });
        }
        if (this.menuId && this.wfRoleIds && this.postId && this.userId && this.data.trnId &&
            this.officeId && this.lkPoOffUserId) {
            const params = {
                'menuId': this.menuId,
                'officeId': this.officeId,
                'postId': this.postId,
                'trnId': this.data.trnId,
                'userId': this.userId,
                'wfRoleIds': this.wfRoleIds,
                'lkPoOffUserId': this.lkPoOffUserId,
            };
            params['eventId'] = this.eventId;
            if (this.data.event === 'TRANSFER') {
                params['menuId'] = COMMON_APIS.WORKFLOW.PVU_TRANSFER_MENU_ID;
            }
            this.pvuService.getWorkFlowAssignmentOpt(params).subscribe((data) => {
                if (data && data['result'] && data['result'].length > 0) {
                    this.actionResponse = data['result'];
                    if (data['result'].length === 1) {
                        this.action_list.push(
                            {
                                'wfActionId': data['result'][0]['wfActionId'],
                                'wfActionName': data['result'][0]['wfActionName']
                            }
                        );
                        this.workflowForm.get('workflowAction').setValue(data['result'][0]['wfActionId']);
                        this.getWorkflowUsers();
                    } else {
                        if (this.data.event === 'TRANSFER_JOINING') {
                            data['result'].forEach(element => {
                                if (this.data.isTransferApprove) {
                                    if (element['wfActionCode'] === COMMON_APIS.WORKFLOW.CODES.WF_APPROVE_CODE) {
                                        this.action_list.push(
                                            {
                                                'wfActionId': element['wfActionId'],
                                                'wfActionName': element['wfActionName']
                                            }
                                        );
                                    }
                                } else {
                                    if (element['wfActionCode'] === COMMON_APIS.WORKFLOW.CODES.WF_REJECT_CODE) {
                                        this.action_list.push(
                                            {
                                                'wfActionId': element['wfActionId'],
                                                'wfActionName': element['wfActionName']
                                            }
                                        );
                                    }
                                }
                            });
                        } else {
                            data['result'].forEach(element => {
                                this.action_list.push(
                                    {
                                        'wfActionId': element['wfActionId'],
                                        'wfActionName': element['wfActionName']
                                    }
                                );
                            });
                        }
                    }
                }
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }

    /**
     * @description Get financial year master
     */
    getFinancialYears() {
        this.commonService.getAllFinancialYears().subscribe((res) => {
            if (res && res['result'] && res['result'].length > 0) {
                this.financialYearList = res['result'];
                // const fId = this.financialYearList.filter(year => {
                //     return year.isCurrentYear === 1;
                // })[0];
                // this.searchIncrementForm.patchValue({
                //     financialYear: fId.financialYearId
                // });
                // this.minDate = new Date(fId.fyStart, 0, 1);
                // this.maxDate = new Date(fId.fyStart, 11, 31);
            }
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    /**
     * @description Get workflow users based on action selected
     */
    getWorkflowUsers() {
        this.user_list = [];
        // tslint:disable-next-line:max-line-length
        const selectedAction = this.actionResponse.filter(item => {
            return item['wfActionId'] === this.workflowForm.get('workflowAction').value;
        });
        if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionName'] &&
            (selectedAction[0]['wfActionName'].toLowerCase() === 'Approve'.toLowerCase() ||
                selectedAction[0]['wfActionName'].toLowerCase() === 'Forward'.toLowerCase() ||
                selectedAction[0]['wfActionName'].toLowerCase() === 'Verify'.toLowerCase())) {
            this.workflowForm.get('remarks').setValidators([]);
            this.workflowForm.get('remarks').updateValueAndValidity();
        } else {
            this.workflowForm.get('remarks').setValidators([Validators.required, trimValidator]);
            this.workflowForm.get('remarks').updateValueAndValidity();
        }
        if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionName'] &&
            (selectedAction[0]['wfActionName'].toLowerCase() === 'Approve'.toLowerCase() ||
                selectedAction[0]['wfActionName'].toLowerCase() === 'Reject'.toLowerCase() ||
                selectedAction[0]['wfActionName'].toLowerCase() === 'Pull Back'.toLowerCase())) {
            this.workflowForm.controls.user.clearValidators();
            this.workflowForm.controls.user.updateValueAndValidity();
            this.isUserRequired = false;
            if (selectedAction[0]['wfActionName'].toLowerCase() === 'Approve'.toLowerCase()) {
                this.isApprove = true;
            } else {
                this.isApprove = false;
            }
            return;
        } else {
            this.workflowForm.controls.user.setValidators(Validators.required);
            this.workflowForm.controls.user.updateValueAndValidity();
            this.isUserRequired = true;
            this.isApprove = false;
        }

        if (selectedAction && selectedAction[0]) {
            const params = {
                'menuId': this.menuId,
                'officeId': this.officeId,
                'postId': this.postId,
                'trnId': this.data.trnId,
                'userId': this.userId,
                'lkPOUId': this.lkPoOffUserId,
                'wfRoleIds': this.wfRoleIds,
                'wfActionId': selectedAction[0]['wfActionId'],
                'nextWfRoleId': selectedAction[0]['assignedWfRoleId']
            };
            params['eventId'] = this.eventId;
            if (this.data.event === 'TRANSFER') {
                params['officeId'] = this.data.transferOffId;
            }
            this.pvuService.getWorkFlowUsers(params).subscribe((data) => {
                if (data && data['result']) {
                    if (data['result'].length > 0) {
                        this.userResponse = data['result'];
                        if (data['result'].length === 1) {
                            this.user_list.push(
                                {
                                    'userId': data['result'][0]['userId'],
                                    'userName': data['result'][0]['userName'],
                                    'pouId': data['result'][0]['pouId']
                                }
                            );
                            this.workflowForm.get('user').setValue(data['result'][0]['pouId']);
                        } else {
                            data['result'].forEach(element => {
                                this.user_list.push({ 'userId': element['userId'], 'userName': element['userName']
                                , 'pouId': element['pouId'] });
                            });
                        }
                    } else {
                        this.toastr.error(COMMON_ERROR_MESSAGES.WF_USER_LIST_EMPTY);
                    }
                } else {
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }

    /**
     * To delete the record from list
     * @param element selected record data
     */
    submitCOnfirmation() {
        if (this.workflowForm.invalid) {
            _.each(this.workflowForm.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
        } else {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: pvuMessage.CLOSE
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.submitWorkFlow();
                }
            });
        }

    }

    /**
     * @description Submit Workflow
     */
    submitWorkFlow() {
        // if (this.workflowForm.invalid) {
        //     _.each(this.workflowForm.controls, function (control) {
        //         if (control.status === 'INVALID') {
        //             control.markAsTouched({ onlySelf: true });
        //         }
        //     });
        // }
        if (this.workflowForm.valid && !this.isSubmitted) {
            this.isSubmitted = true;
            const selectedAction = this.actionResponse.filter(item => {
                return item['wfActionId'] === this.workflowForm.get('workflowAction').value;
            });

            if (!selectedAction || (selectedAction && selectedAction.length === 0)) {
                this.isSubmitted = false;
                return;
            }
            const params = {
                'assignByOfficeId': this.officeId,
                'assignByPostId': this.postId,
                'assignByUserId': this.userId,
                'assignByWfRoleId': selectedAction[0]['currentWfRoleId'],
                // 'assignToOfficeId': selectedUser[0]['officeId'],
                // 'assignToPostId': selectedUser[0]['postId'],
                // 'assignToUserId': selectedUser[0]['userId'],
                'assignToWfRoleId': selectedAction[0]['assignedWfRoleId'],
                'currentWorkflowId': selectedAction[0]['currentWorkflowId'],
                'menuId': this.menuId,
                'remarks': this.workflowForm.get('remarks').value,
                'trnId': this.data.trnId,
                'trnStatus': selectedAction[0]['trnStatus'],
                'wfActionId': selectedAction[0]['wfActionId'],
                'wfAttachmentIds': [1],
                'wfStatus': selectedAction[0]['wfStatus'],
                'assignByActionLevel': selectedAction[0]['currentActionLevel'],
                'assignToActionLevel': selectedAction[0]['nextActionLevel'],
                'assignByPOUId': this.lkPoOffUserId
                // 'eventId': null
            };
            if (this.isUserRequired) {
                const selectedUser = this.userResponse.filter(item => {
                    return item['pouId'] === this.workflowForm.get('user').value;
                });
                params['assignToOfficeId'] = selectedUser[0]['officeId'];
                params['assignToPostId'] = selectedUser[0]['postId'];
                params['assignToUserId'] = selectedUser[0]['userId'];
                params['assignToPOUId'] = selectedUser[0]['pouId'];
                // params['pvuTrnEmpCrWfId'] = 0;
            }
            params['eventId'] = this.eventId;
            this.pvuService.submitWorkFlow(params, this.event).subscribe((data) => {
                if (data && data['status'] === 200) {
                    this.toastr.success(data['message']);
                    if (data['result']) {
                        if (!this.trnNo) {
                            if (data['result']['trnNo']) {
                                this.trnNo = data['result']['trnNo'];
                            } else if (data['result']['transNo']) {
                                this.trnNo = data['result']['transNo'];
                            }
                            data['result']['transactionNo'] = this.trnNo;
                            if (this.trnNo) {
                                this.openTransactionNumberDialog(data);
                            }
                        }
                        if (this.isApprove) {
                            const dialogRef1 = this.dialog.open(TransactionNumberDialogComponent, {
                                width: '360px',
                                data: {
                                    trnNo: data['result']['trnNo']
                                }
                            });
                            dialogRef1.afterClosed().subscribe(result => {
                                if (result === 'yes') {
                                    this.dialogRef.close('yes');
                                }
                            });
                        } else {
                            this.dialogRef.close('yes');
                        }
                    } else {
                        this.dialogRef.close('yes');
                    }
                } else {
                    this.isSubmitted = false;
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.isSubmitted = false;
                this.toastr.error(err);
            });
        }
    }

    openTransactionNumberDialog(data) {
        const dialogRef1 = this.dialog.open(PVUUTransactionDialogEventComponent, {
            width: '360px',
            data: {
                trnNo: data['result']['transactionNo']
            }
        });
        this.dialogRef.close('yes');
        dialogRef1.afterClosed().subscribe(result => {
            if (result === 'yes') {
                // this.dialogRef.close('yes');
            }
        });
    }

    /**
     * @description Method invoked on the click of cancel button
     */
    onNoClick() {
        this.dialogRef.close('no');
    }
}
