import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ROPService } from '../service/rop.service';
import { DataConst } from 'src/app/shared/constants/pvu/pvu-data.constants';


@Component({
    selector: 'app-rop-wf',
    templateUrl: 'rop-wf.component.html',
    styleUrls: ['./rop-wf.component.css']
})
export class RopWfComponent implements OnInit {
    public menuId;
    public linkMenuId;
    public officeId;
    public postId;
    public wfRoleIds;
    public wfRoleCode;
    public trnId;
    public userId;
    public wfStatus;
    public lkPoOffUserId;
    refenceNo: string = '';
    isUserRequired: boolean = true;
    isSubmitted: boolean = false;
    isApprove: boolean = false;
    date: any = new Date();
    headerJSON = [];
    actionResponse;
    userResponse;
    workflowForm: FormGroup;
    errorMessages = {};

    forwardDialog_history_list: any[] = [];

    action_list: object[] = [];
    user_list: object[] = [];

    actionCtrl: FormControl = new FormControl();
    userCodeCtrl: FormControl = new FormControl();
    pvuOfficeName: string = '';
    heading: string = '';
    isPvuOfficeName: boolean;
    isReturn: boolean;
    remarksRequired: boolean = false;
    isReturnFromPrev: boolean = false;
    isAuthZ: boolean = false;

    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<RopWfComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private ropService: ROPService
    ) { }
    onNoClick() { }

    ngOnInit() {
        this.workflowForm = this.fb.group({
            workflowAction: ['', Validators.required],
            user: ['', Validators.required],
            remarks: ['']
        });

        this.heading = this.data.heading;
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
        this.ropService.getCurrentUserDetail().then(res => {
            if (res) {
                this.wfRoleIds = res['wfRoleId'];
                this.wfRoleCode = res['wfRoleCode'];
                this.menuId = res['menuId'];
                this.linkMenuId = res['linkMenuId'];
                this.postId = res['postId'];
                this.userId = res['userId'];
                this.lkPoOffUserId = res['lkPoOffUserId'];
                this.getData();
            }
        });
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
            }
        });
        const histParam = {
            'eventId': null,
            'menuId': this.linkMenuId,
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
        });
        if (this.menuId && this.wfRoleIds && this.postId && this.userId && this.data.eventId &&
            this.data.officeId) {
            const params = {
                // 'menuId': this.menuId,
                'menuId': this.linkMenuId,
                'officeId': this.data.officeId,
                'postId': this.postId,
                'trnId': this.data.eventId,
                'userId': this.userId,
                'wfRoleIds': this.wfRoleIds,
                'lkPoOffUserId': this.lkPoOffUserId
            };
            this.ropService.getWorkFlowAssignmentOpt(params).subscribe((data) => {
                if (data && data['result'] && data['result'].length > 0) {
                    this.actionResponse = data['result'];
                    if (data['result'].length === 1) {
                        if (
                            data['result'][0]['wfActionId'] === 8 ||
                            data['result'][0]['wfActionId'] === 15 ||
                            data['result'][0]['wfActionId'] === 5
                        ) {
                            this.workflowForm.controls.remarks.clearValidators();
                            this.workflowForm.controls.remarks.updateValueAndValidity();
                            this.remarksRequired = false;
                        } else {
                            this.workflowForm.controls.remarks.setValidators(Validators.required);
                            this.workflowForm.controls.remarks.updateValueAndValidity();
                            this.remarksRequired = true;
                        }
                        this.action_list.push(
                            {
                                'wfActionId': data['result'][0]['wfActionId'],
                                'wfActionName': data['result'][0]['wfActionName']
                            }
                        );
                        this.workflowForm.get('workflowAction').setValue(data['result'][0]['wfActionId']);
                        this.getWorkflowUsers();
                    } else {
                        data['result'].forEach(element => {
                            if (this.isReturnFromPrev === true && this.isAuthZ === false) {
                                if (element['wfActionId'] !== 20) {
                                    this.action_list.push(
                                        {
                                            'wfActionId': element['wfActionId'],
                                            'wfActionName': element['wfActionName']
                                        }
                                    );
                                }
                            } else if (this.isReturnFromPrev === false && this.isAuthZ === true) {
                                if (element['wfActionId'] !== 14) {
                                    this.action_list.push(
                                        {
                                            'wfActionId': element['wfActionId'],
                                            'wfActionName': element['wfActionName']
                                        }
                                    );
                                }
                            } else {
                                this.action_list.push(
                                    {
                                        'wfActionId': element['wfActionId'],
                                        'wfActionName': element['wfActionName']
                                    }
                                );
                            }
                        });
                        // console.log(this.action_list, 'actionList');
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
            'id': this.data.eventId
        };
        this.ropService.getPvuOffice(params).subscribe((data) => {
            if (data && data['status'] === 200 && data['result']) {
                // console.log(data['result']);
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
     * To get the User List based on the selected action
     */
    getWorkflowUsers() {
        this.user_list = [];
        const selectedAction = this.actionResponse.filter(item => {
            return item['wfActionId'] === this.workflowForm.get('workflowAction').value;
        });
        if (
            selectedAction[0]['wfActionId'] === 8 ||
            selectedAction[0]['wfActionId'] === 15 ||
            selectedAction[0]['wfActionId'] === 5 ||
            selectedAction[0]['wfActionId'] === 20
        ) {
            this.workflowForm.controls.remarks.clearValidators();
            this.workflowForm.controls.remarks.updateValueAndValidity();
            this.remarksRequired = false;
        } else {
            this.workflowForm.controls.remarks.setValidators(Validators.required);
            this.workflowForm.controls.remarks.updateValueAndValidity();
            this.remarksRequired = true;
        }
        if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionCode'] &&
            (selectedAction[0]['wfActionCode'] === DataConst.ROP.WF_APPROVE_CODE || // Approve
                selectedAction[0]['wfActionCode'] === DataConst.ROP.WF_REJECT_CODE || // Reject
                selectedAction[0]['wfActionCode'] === DataConst.ROP.WF_AUTHORIZE_CODE || // Authorize
                (selectedAction[0]['wfActionCode'] === DataConst.ROP.WF_FORWORD_PVU_CODE &&
                    selectedAction[0]['currentWfRoleId'] === DataConst.ROP.APPROVER_CUR_WF_ROLE))) { // Forward To PVU
            this.workflowForm.controls.user.setValue('');
            this.workflowForm.controls.user.clearValidators();
            this.workflowForm.controls.user.updateValueAndValidity();
            this.isUserRequired = false;
            if (selectedAction[0]['wfActionCode'] === DataConst.ROP.WF_FORWORD_PVU_CODE) {
                this.isPvuOfficeName = true;
                this.getPvuOffice();
            } else {
                this.isPvuOfficeName = false;
            }
            if (selectedAction[0]['wfActionCode'] === DataConst.ROP.WF_APPROVE_CODE) { // Approve
                this.isApprove = true;
            } else {
                this.isApprove = false;
            }
            return;
        } else if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionCode'] &&
            (this.data.isPvuApprover && selectedAction[0]['wfActionCode'] === DataConst.ROP.WF_RETURN_CODE)) {
            this.isReturn = true;
        } else {
            this.workflowForm.controls.user.setValidators(Validators.required);
            this.workflowForm.controls.user.updateValueAndValidity();
            this.isUserRequired = true;
            this.isApprove = false;
        }

        if (selectedAction && selectedAction[0]) {
            const params = {
                // 'menuId': this.menuId,
                'menuId': this.linkMenuId,
                'officeId': this.data.officeId,
                'postId': this.postId,
                'trnId': this.data.eventId,
                'userId': this.userId,
                'wfRoleIds': this.wfRoleIds,
                'wfActionId': selectedAction[0]['wfActionId'],
                'nextWfRoleId': selectedAction[0]['assignedWfRoleId'],
                'lkPoOffUserId': this.lkPoOffUserId
            };
            if (this.isReturn && this.data.isPvuApprover) {
                params['officeId'] = this.data.pvuReturnOfficeId;
            }
            this.ropService.getWorkFlowUsers(params).subscribe((data) => {
                if (data && data['status'] === 200 && data['result']) {
                    if (data['result'].length > 0) {
                        this.userResponse = data['result'];
                        if (data['result'].length === 1) {
                            this.user_list.push(
                                {
                                    'userId': data['result'][0]['userId'],
                                    'userName': data['result'][0]['userName'],
                                    'pouId': data['result'][0]['pouId'],
                                }
                            );
                            this.workflowForm.get('user').setValue(data['result'][0]['pouId']);
                        } else {
                            data['result'].forEach(element => {
                                this.user_list.push(
                                    {
                                        'userId': element['userId'],
                                        'userName': element['userName'],
                                        'pouId': element['pouId'],
                                    }
                                );
                            });
                        }
                    } else {
                        this.toastr.error(pvuMessage.WF_USER_LIST_EMPTY);
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
     * To submit the workflow
     */
    submitWorkFlow() {
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
                'assignByOfficeId': this.data.officeId,
                'assignByPostId': this.postId,
                'assignByUserId': this.userId,
                'assignByWfRoleId': selectedAction[0]['currentWfRoleId'],
                'assignToWfRoleId': selectedAction[0]['assignedWfRoleId'],
                'currentWorkflowId': selectedAction[0]['currentWorkflowId'],
                // 'menuId': this.menuId,
                'menuId': this.linkMenuId,
                'remarks': this.workflowForm.get('remarks').value,
                'trnId': this.data.eventId,
                'trnStatus': selectedAction[0]['trnStatus'],
                'wfActionId': selectedAction[0]['wfActionId'],
                'wfAttachmentIds': [1],
                'wfStatus': selectedAction[0]['wfStatus'],
                'assignByActionLevel': selectedAction[0]['currentActionLevel'],
                'assignToActionLevel': selectedAction[0]['nextActionLevel'],
                'assignByPOUId': this.lkPoOffUserId,
                'eventId': null
            };
            if (this.isUserRequired) {
                const selectedUser = this.userResponse.filter(item => {
                    return item['pouId'] === this.workflowForm.get('user').value;
                });
                params['assignToOfficeId'] = selectedUser[0]['officeId'];
                params['assignToPostId'] = selectedUser[0]['postId'];
                params['assignToUserId'] = selectedUser[0]['userId'];
                params['assignToPOUId'] = selectedUser[0]['pouId'];
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
            if (this.isReturn && this.data.isPvuApprover) {
                params['assignToOfficeId'] = this.data.pvuReturnOfficeId;
            }
            this.ropService.submitRopWorkFlow(params).subscribe((data) => {
                if (data && data['status'] === 200) {
                    this.toastr.success(data['message']);
                    if (this.data && this.data.passAction) {
                        const selectedAction1 = this.actionResponse.filter(item => {
                            return item['wfActionId'] === this.workflowForm.get('workflowAction').value;
                        });
                        this.dialogRef.close( { action: 'yes', actionName: selectedAction1[0] ?
                                                                        selectedAction1[0]['wfActionCode'] : null });
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

}
