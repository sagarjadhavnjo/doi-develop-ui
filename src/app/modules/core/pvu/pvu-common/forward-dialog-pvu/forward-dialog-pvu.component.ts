import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'src/app/modules/services/common.service';
import { PVUUTransactionDialogEventComponent } from './transaction-dialog.component';
import { Component, OnInit, ElementRef, Inject } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup, ValidatorFn, } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PvuCommonService } from '../services/pvu-common.service';
import { TransactionNumberDialogComponent } from '../transaction-number-dialog/transaction-number-dialog.component';
import * as _ from 'lodash';
import { COMMON_APIS, COMMON_MESSAGES } from '..';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
// import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
const WORKFLOW = COMMON_APIS.WORKFLOW;
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
    templateUrl: './forward-dialog-pvu.component.html',
    styleUrls: ['./forward-dialog-pvu.component.css']
})
export class ForwardDialogPVUComponent implements OnInit {
    remarksLabel = COMMON_MESSAGES.VIEW_REMARKS_LABEL;
    public menuId;
    public officeId;
    public postId;
    public wfRoleIds;
    public trnId;
    public userId;
    public wfStatus;
    public lkPoOffUserId;

    public linkMenuId;
    public wfRoleCode;
    event;
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

    forwardDialogHistoryList = [];

    actionList: object[] = [];
    userList: object[] = [];
    eventName;
    actionCtrl: FormControl = new FormControl();
    userCodeCtrl: FormControl = new FormControl();

    pvuOfficeName: string = '';
    isPvuOfficeName: boolean;
    isReturn: boolean;
    public errorMessages = {
        ACTION: 'Please select action',
        USER: 'Please select user',
        REMARKS: 'Please fill Remarks',
    };
    isReturnFromPrev: boolean = false;
    isAuthZ: boolean = false;

    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private pvuService: PvuCommonService,
        private commonService: CommonService,
        public dialogRef: MatDialogRef<ForwardDialogPVUComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private el: ElementRef
    ) {
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        // this.errorMessages = pvuMessage;
        this.workflowForm = this.fb.group({
            workflowAction: ['', Validators.required],
            user: ['', Validators.required],
            remarks: ['', [Validators.required, trimValidator]]
        });
        if (!this.data.isReturn) {
            this.isReturnFromPrev = false;
        } else {
            this.isReturnFromPrev = this.data.isReturn;
        }
        if (!this.data.isAuthZ) {
            this.isAuthZ = false;
        } else {
            this.isAuthZ = this.data.isAuthZ;
        }
        if (this.data.remarksLabel) {
            this.remarksLabel = this.data.remarksLabel;
        }

        this.trnNo = this.data.trnNo;
        this.initiationDate = this.data.initiationDate;
        this.event = this.data.event;
        this.eventId = this.data.eventId;
        this.eventName = this.data.eventName;
        this.pvuService.getCurrentUserMultipleRoleDetail().then(res => {
            if (res) {
                this.wfRoleIds = res['wfRoleId'];
                this.menuId = res['menuId'];
                this.postId = res['postId'];
                this.userId = res['userId'];
                this.officeId = res['officeDetail']['officeId'];
                this.lkPoOffUserId = res['lkPoOffUserId'];
                this.wfRoleCode = res['wfRoleCode'];
                this.linkMenuId = this.commonService.getLinkMenuId();
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
        if (this.data.trnId && this.menuId) {
            const param = {
                'trnId': this.data.trnId,
                'menuId': this.menuId
            };
            param['eventId'] = this.eventId;
            param['menuId'] = this.linkMenuId;
            param['officeId'] = this.data.officeId;
            param['postId'] = this.postId;
            param['wfRoleCode'] = this.wfRoleCode;
            param['wfRoles'] = this.wfRoleIds;
            const url = COMMON_APIS.WORKFLOW.GET_PVU_HISTORY;
            this.pvuService.getWorkFlowReview(param, url).subscribe((data) => {
                if (data && data['result'] && data['result'].length > 0) {
                    this.forwardDialogHistoryList = _.cloneDeep(data['result']);
                    _.forEach(this.forwardDialogHistoryList, function (item) {
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
            this.pvuService.getWorkFlowAssignmentOpt(params).subscribe((data) => {
                if (data && data['result'] && data['result'].length > 0) {
                    this.actionResponse = data['result'];
                    if (data['result'].length === 1) {
                        this.actionList.push(
                            {
                                'wfActionId': data['result'][0]['wfActionId'],
                                'wfActionName': data['result'][0]['wfActionName']
                            }
                        );
                        this.workflowForm.get('workflowAction').setValue(data['result'][0]['wfActionId']);
                        this.getWorkflowUsers();
                    } else {
                        if (this.data.isPvuApprover) {
                            if (this.data.canDecide) {
                                // Remove Forward
                                data['result'].forEach(element => {
                                    if (element.wfActionCode !== WORKFLOW.CODES.WF_FORWORD_PVU_CODE) {
                                        if (this.isReturnFromPrev === true && this.isAuthZ === false) {
                                            if (element['wfActionId'] !== 20) {
                                                this.actionList.push(
                                                    {
                                                        'wfActionId': element['wfActionId'],
                                                        'wfActionName': element['wfActionName']
                                                    }
                                                );
                                            }
                                        } else if (this.isReturnFromPrev === false && this.isAuthZ === true) {
                                            if (element['wfActionId'] !== 24) {
                                                this.actionList.push(
                                                    {
                                                        'wfActionId': element['wfActionId'],
                                                        'wfActionName': element['wfActionName']
                                                    }
                                                );
                                            }
                                        } else {
                                            this.actionList.push(
                                                {
                                                    'wfActionId': element['wfActionId'],
                                                    'wfActionName': element['wfActionName']
                                                }
                                            );
                                        }
                                    }
                                });
                            } else {
                                // Remove authorize
                                data['result'].forEach(element => {
                                    if (element.wfActionCode !== WORKFLOW.CODES.WF_AUTHORIZE_CODE
                                        && element.wfActionCode !== WORKFLOW.CODES.WF_RETURN_CODE) {
                                        this.actionList.push(
                                            {
                                                'wfActionId': element['wfActionId'],
                                                'wfActionName': element['wfActionName']
                                            }
                                        );
                                    }
                                });
                            }
                        } else if (this.data.isPvuApproverClassI) {
                            // Remove Forward
                            data['result'].forEach(el => {
                                if (el.wfActionCode !== WORKFLOW.CODES.WF_FORWORD_PVU_CODE) {
                                    if (this.isReturnFromPrev === true && this.isAuthZ === false) {
                                        if (el['wfActionId'] !== 20) {
                                            this.actionList.push(
                                                {
                                                    'wfActionId': el['wfActionId'],
                                                    'wfActionName': el['wfActionName']
                                                }
                                            );
                                        }
                                    } else if (this.isReturnFromPrev === false && this.isAuthZ === true) {
                                        if (el['wfActionId'] !== 24) {
                                            this.actionList.push(
                                                {
                                                    'wfActionId': el['wfActionId'],
                                                    'wfActionName': el['wfActionName']
                                                }
                                            );
                                        }
                                    } else {
                                        this.actionList.push(
                                            {
                                                'wfActionId': el['wfActionId'],
                                                'wfActionName': el['wfActionName']
                                            }
                                        );
                                    }
                                }
                            });
                        } else {
                            data['result'].forEach(element => {
                                this.actionList.push(
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
     * To get the PVU Office Name
     */
    getPvuOffice() {
        const params = {
            'id': this.data.trnId
        };
        this.pvuService.getPvuOffice(params, this.event).subscribe((data) => {
            if (data && data['status'] === 200 && data['result']) {
                console.log(data['result']);
                this.pvuOfficeName = data['result']['officeName'];
                // this.isPvuOfficeName = true;
            } else {
                this.toastr.error(data['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });

    }

    /**
     * @description Get workflow users based on action selected
     */
    getWorkflowUsers() {
        this.userList = [];
        this.userList = [];
        const selectedAction = this.actionResponse.filter(item => {
            return item['wfActionId'] === this.workflowForm.get('workflowAction').value;
        });
        if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionCode'] &&
            (selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_AUTHORIZE_CODE ||
            selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_FORWORD_PVU_CODE ||
            selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_APPROVE_CODE ||
            selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_VERIFY_CODE )) {
                this.workflowForm.get('remarks').setValidators([]);
                this.workflowForm.get('remarks').updateValueAndValidity();
        } else {
            this.workflowForm.get('remarks').setValidators([Validators.required, trimValidator]);
            this.workflowForm.get('remarks').updateValueAndValidity();
        }
        if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionCode'] &&
            (selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_APPROVE_CODE || // Approve
                selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_REJECT_CODE || // Reject
                selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_AUTHORIZE_CODE || // Authorize
                (selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_FORWORD_PVU_CODE &&
                    selectedAction[0]['currentWfRoleId'] === WORKFLOW.CODES.APPROVER_CUR_WF_ROLE))) { // Forward To PVU
            this.workflowForm.controls.user.setValue('');
            this.workflowForm.controls.user.clearValidators();
            this.workflowForm.controls.user.updateValueAndValidity();
            this.isUserRequired = false;
            if (selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_FORWORD_PVU_CODE) {
                this.isPvuOfficeName = true;
                this.getPvuOffice();
            } else {
                this.isPvuOfficeName = false;
            }
            if (selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_APPROVE_CODE) { // Approve
                this.isApprove = true;
            } else {
                this.isApprove = false;
            }
            return;
        } else if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionCode'] &&
            (this.data.isPvuVerifier && selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_RETURN_CODE)) {
            this.isReturn = true;
        } else if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionCode'] &&
            (this.data.isPvuApprover && selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_RETURN_CODE)) {
            this.isReturn = true;
        } else if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionCode'] &&
            (this.data.isPvuApproverClassI && selectedAction[0]['wfActionCode'] === WORKFLOW.CODES.WF_RETURN_CODE)) {
            this.isReturn = true;
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
                'lkPoOffUserId': this.lkPoOffUserId,
                'wfRoleIds': this.wfRoleIds,
                'wfActionId': selectedAction[0]['wfActionId'],
                'nextWfRoleId': selectedAction[0]['assignedWfRoleId']
            };
            params['eventId'] = this.eventId;
            // if (this.isReturn && this.data.isPvuApprover && this.data.canDecide) {
            //     params['officeId'] = this.data.pvuReturnOfficeId;
            // }
            // if (this.isReturn && this.data.isPvuApproverClassI && this.data.canDecide) {
            //     params['officeId'] = this.data.pvuReturnOfficeId;
            // }
            // if (this.isReturn && this.data.isPvuVerifier) {
            //     params['officeId'] = this.data.pvuReturnOfficeId;
            // }
            this.pvuService.getWorkFlowUsers(params).subscribe((data) => {
                if (data && data['result'] && data['result'].length > 0) {
                    if (data['result'].length > 0) {
                        this.userResponse = data['result'];
                        if (WORKFLOW.CODES.WF_PULLBACK_CODE === selectedAction[0].wfActionCode) {
                            this.userList = [];
                            for (let j = 0; j < data['result'].length; j++) {
                                const user = data['result'][j];
                                if (user.postId === this.postId &&
                                    user.pouId === this.lkPoOffUserId
                                    && user.officeId === this.officeId) {
                                    this.userList.push(
                                        {
                                            'userId': data['result'][j]['userId'],
                                            'userName': data['result'][j]['userName'],
                                            'pouId': data['result'][j]['pouId']
                                        }
                                    );
                                }
                            }
                            this.workflowForm.get('user').setValue(this.userList[0]['pouId']);
                        } else {
                            if (data['result'].length === 1) {
                                this.userList.push(
                                    {
                                        'userId': data['result'][0]['userId'],
                                        'userName': data['result'][0]['userName'],
                                        'pouId': data['result'][0]['pouId']
                                    }
                                );
                                this.workflowForm.get('user').setValue(data['result'][0]['pouId']);
                            } else {
                                data['result'].forEach(element => {
                                    this.userList.push({
                                        'userId': element['userId'], 'userName': element['userName'],
                                        'pouId': element['pouId']
                                    });
                                });
                            }
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
    submitConfirmation() {
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

            if (this.isPvuOfficeName) {
                if (this.pvuOfficeName === '' || this.pvuOfficeName === null || this.pvuOfficeName === undefined) {
                    this.toastr.error('PVU Office Name not available');
                    this.isSubmitted = false;
                    return;
                }
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
                'assignByPOUId': this.lkPoOffUserId,
                'eventId': this.eventId
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
            if (this.isApprove) {
                params['assignToPostId'] = this.postId;
                params['assignToOfficeId'] = this.data.officeId;
                params['assignToPOUId'] = this.lkPoOffUserId;
                params['assignToWfRoleId'] = selectedAction[0]['currentWfRoleId'];
            }
            if (this.isPvuOfficeName) {
                params['assignToPostId'] = this.postId;
                params['assignToOfficeId'] = this.data.officeId;
                params['assignToPOUId'] = this.lkPoOffUserId;
                params['assignToWfRoleId'] = selectedAction[0]['currentWfRoleId'];
            }
            // if (this.isReturn && this.data.isPvuApprover && this.data.canDecide) {
            //     params['assignToOfficeId'] = this.data.pvuReturnOfficeId;
            // }
            // if (this.isReturn && this.data.isPvuApproverClassI && this.data.canDecide) {
            //     params['assignToOfficeId'] = this.data.pvuReturnOfficeId;
            // }
            // if (this.isReturn && this.data.isPvuVerifier) {
            //     params['assignToOfficeId'] = this.data.pvuReturnOfficeId;
            // }
            this.pvuService.submitWorkFlow(params, this.event).subscribe((data) => {
                if (data && data['status'] === 200) {
                    this.toastr.success(data['message']);
                    if (data['result']) {
                        if (!this.trnNo) {
                            this.trnNo = data['result']['trnNo'];
                            this.openTransactionNumberDialog(data);
                        } else {
                            this.checkForApprovedDialog(data);
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
                trnNo: data['result']['trnNo']
            }
        });
        this.dialogRef.close('yes');
        dialogRef1.afterClosed().subscribe(result => {
            if (result === 'yes') {
                // this.dialogRef.close('yes');
            }
        });
    }

    checkForApprovedDialog(data) {
        if (this.isApprove) {
            const dialogRef1 = this.dialog.open(TransactionNumberDialogComponent, {
                width: '360px',
                data: {
                    trnNo: data['result']['trnNo']
                }
            });
            this.dialogRef.close('yes');
            dialogRef1.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.dialogRef.close('yes');
                }
            });
        } else {
            this.dialogRef.close('yes');
        }
    }

    /**
     * @description Method invoked on the click of cancel button
     */
    onNoClick() {
        this.dialogRef.close('no');
    }
}
