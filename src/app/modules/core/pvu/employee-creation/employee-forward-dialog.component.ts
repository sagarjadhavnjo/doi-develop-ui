import { pvuMessage } from '../../../../shared/constants/pvu/pvu-message.constants';
import { Component, Inject, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmployeeCreationService } from 'src/app/modules/services/pvu/employee-creation.service';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { EmployeeConfirmationDialogComponent } from './employee-confirmation-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

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
    selector: 'app-employee-forward-dialog',
    templateUrl: 'employee-forward-dialog.html',
    styleUrls: ['./employee-creation.component.css']
})
export class EmployeeForwardDialogComponent implements OnInit {
    public menuId;
    public linkMenuId;
    public officeId;
    public postId;
    public wfRoleIds;
    public trnId;
    public userId;
    public wfStatus;
    public lkPoOffUserId;
    refenceNo: string = '';
    isUserRequired: boolean = true;
    isSubmitted: boolean = false;
    isApprove: boolean = false;
    showAction: boolean = true;
    fileBrowseIndex: number;
    date: any = new Date();
    headerJSON = [];
    actionResponse;
    userResponse;
    workflowForm: FormGroup;
    errorMessages = {
        FIN_YEAR: 'Please select any Financial Year',
        DEPARTMENT: 'Please select any Department',
        WF_ACTION: 'Please Select Action',
        WF_USER: 'Please Select User',
        WF_REMARK: 'Please Enter Remarks',
    };

    forwardDialog_history_list: any[] = [];

    action_list: object[] = [];
    user_list: object[] = [];

    actionCtrl: FormControl = new FormControl();
    userCodeCtrl: FormControl = new FormControl();

    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private pvuService: EmployeeCreationService,
        public dialogRef: MatDialogRef<EmployeeForwardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private el: ElementRef,
    ) { }
    onNoClick() { }
    onSubmitClick() { }
    ngOnInit() {
        this.workflowForm = this.fb.group({
            workflowAction: ['', Validators.required],
            user: ['', Validators.required],
            remarks: ['', [Validators.required, trimValidator]]
        });

        this.pvuService.getCurrentUserDetail(true).then(res => {
            if (res) {
                this.wfRoleIds = res['wfRoleId'];
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
            'id': this.data.empId
        };
        this.pvuService.getWorkFlowEmpDetail(param).subscribe((data) => {
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
                    { label: 'Applicable Pay Commission', value: data['result']['payLevelName'] }
                );

            }
        });
        this.pvuService.getWorkFlowReview(param).subscribe((data) => {
            if (data && data['result'] && data['result'].length > 0) {
                this.forwardDialog_history_list = data['result'];
            }
        });
        if (this.menuId && this.wfRoleIds && this.postId && this.userId && this.data.empId && this.data.officeId) {
            const params = {
                'menuId': this.menuId,
                // 'menuId': this.linkMenuId,
                'officeId': this.data.officeId,
                'postId': this.postId,
                'trnId': this.data.empId,
                'userId': this.userId,
                'wfRoleIds': this.wfRoleIds,
                'lkPoOffUserId': this.lkPoOffUserId
            };
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
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }
    getWorkflowUsers() {
        this.user_list = [];
        const selectedAction = this.actionResponse.filter(item => {
            return item['wfActionId'] === this.workflowForm.get('workflowAction').value;
        });
        if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionName'] &&
            (selectedAction[0]['wfActionName'].toLowerCase() === 'Approve'.toLowerCase() ||
            selectedAction[0]['wfActionName'].toLowerCase() === 'Forward'.toLowerCase() ||
            selectedAction[0]['wfActionName'].toLowerCase() === 'Verify'.toLowerCase() )) {
                this.workflowForm.get('remarks').setValidators([]);
                this.workflowForm.get('remarks').updateValueAndValidity();
        } else {
            this.workflowForm.get('remarks').setValidators([Validators.required, trimValidator]);
            this.workflowForm.get('remarks').updateValueAndValidity();
        }

        if (selectedAction && selectedAction[0] && selectedAction[0]['wfActionName'] &&
            (selectedAction[0]['wfActionName'].toLowerCase() === 'Approve'.toLowerCase() ||
                selectedAction[0]['wfActionName'].toLowerCase() === 'Reject'.toLowerCase())) {
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
                // 'menuId': this.linkMenuId,
                'officeId': this.data.officeId,
                'postId': this.postId,
                'trnId': this.data.empId,
                'userId': this.userId,
                'wfRoleIds': this.wfRoleIds,
                'wfActionId': selectedAction[0]['wfActionId'],
                'nextWfRoleId': selectedAction[0]['assignedWfRoleId'],
                'lkPoOffUserId': this.lkPoOffUserId
            };
            this.pvuService.getWorkFlowUsers(params).subscribe((data) => {
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
    submitWorkFlow() {
        if (this.workflowForm.invalid) {
            _.each(this.workflowForm.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
        }
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.CLOSE
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res === 'yes') {
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
                        'assignByOfficeId': this.data.officeId,
                        'assignByPostId': this.postId,
                        'assignByUserId': this.userId,
                        'assignByWfRoleId': selectedAction[0]['currentWfRoleId'],
                        'assignToWfRoleId': selectedAction[0]['assignedWfRoleId'],
                        'currentWorkflowId': selectedAction[0]['currentWorkflowId'],
                        'menuId': this.menuId,
                        // 'menuId': this.linkMenuId,
                        'remarks': this.workflowForm.get('remarks').value,
                        'trnId': this.data.empId,
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
                    this.pvuService.submitWorkFlow(params).subscribe((data) => {
                        if (data && data['status'] === 200) {
                            this.toastr.success(data['message']);
                            if (data['result']) {
                                if (this.isApprove) {
                                    const dialogRef1 = this.dialog.open(EmployeeConfirmationDialogComponent, {
                                        width: '360px',
                                        data: {
                                            empNo: data['result']['employeeNo'],
                                            empName: data['result']['salutation'] + ' '
                                                + data['result']['employeeName'] + ' '
                                                + data['result']['middelName'] + ' '
                                                + data['result']['lastName'],
                                            designation: data['result']['designationName']
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
        });
    }

}
