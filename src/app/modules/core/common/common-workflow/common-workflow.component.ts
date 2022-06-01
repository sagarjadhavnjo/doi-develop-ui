import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommonWorkflowService } from '../workflow-service/common-workflow.service';
import {
    CommonWfMsg, DataConstant, viewableExtension, previewExtension, ModuleNames
} from '../constant/common-workflow.constants';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

declare function SetGujarati();
declare function SetEnglish();

@Component({
    selector: 'app-common-workflow',
    templateUrl: './common-workflow.component.html',
    styleUrls: ['./common-workflow.component.css']
})
export class CommonWorkflowComponent implements OnInit {
    currentLang = new BehaviorSubject<string>('Eng');
    isLangChange = false;
    hasFocusSet: number;
    public showData: boolean = true;
    showWorkFlowAction: boolean = true;

    fileBrowseIndex: number;
    date: any = new Date();
    brwoseData: any[] = [{
        name: undefined,
        file: undefined,
        uploadedBy: undefined
    }];
    @ViewChild('attachment') attachment: ElementRef;
    maxAttachment: number;
    isUploadDisable: boolean = false;
    dataSourceBrowse = new MatTableDataSource([]);
    displayedBrowseColumns = ['attachmentTypeId', 'fileName', 'browse', 'uploadedFileName', 'action'];
    displayData: boolean = false;
    page: number = 1;
    totalPages: number;
    isLoaded: boolean = false;
    sampleFlag: boolean;
    tabDisable: Boolean = true;
    selectedIndex: number;

    workflowForm: FormGroup;
    errorMessages = CommonWfMsg;

    historyData: any[] = [];
    actionList: any[] = [];
    userList: any[] = [];

    attachmentTypeList: any[] = [];

    actionCtrl: FormControl = new FormControl();
    userCodeCtrl: FormControl = new FormControl();
    branchCodeCtrl: FormControl = new FormControl();
    officeCodeCtrl: FormControl = new FormControl();
    departmentCodeCtrl: FormControl = new FormControl();
    workflowRoleCodeCtrl: FormControl = new FormControl();
    hodCodeCtrl: FormControl = new FormControl();
    coCodeCtrl: FormControl = new FormControl();
    attachmentTypeCodeCtrl: FormControl = new FormControl();
    linkMenuId: any;
    postId: any;
    wfRoleCode: any;
    wfRoleIds: any;
    menuId: any;
    userId: any;
    lkPoOffUserId: any;
    actionResponse: any;
    remarksRequired: boolean;
    officeId: any;
    isUserVisible: boolean;
    isBranchVisible: boolean;
    branchList: any[];
    isDepartmentVisible: boolean;
    departmentList: any[];
    isWorkflowRoleVisible: boolean;
    workflowRoleList: any[];
    isHodVisible: boolean;
    hodList: any[];
    isCoVisible: boolean;
    coList: any[];
    isOfficeVisible: boolean;
    officeList: any[];
    userResponse: any[];
    attachData = [];
    uploadDirectoryPath: string;
    totalAttachmentSize: number = 0;
    allowedFileType: any;
    isSubmitted: boolean;
    apiErrorMessageList = [];
    parentOffice: any;
    userSelTwoObj: any;
    selectedAction: any;
    sendBackFlag: boolean;
    selectedFilePreviewPdf: string;
    selectedFilePreviewImageBase64: string;
    selectedFileBase64: string;
    isLocationTypeBranch: boolean;
    ministerList = [];
    dummyBranchList = [];
    isChildOffice: boolean;
    fdGroupData = null;
    isOnlyDummyEntry: boolean;
    commentHistoryOfficeName: string;
    isParentOffice: boolean;
    isTobranch: boolean;
    isToOffice: boolean;
    isSameOfficeSameBranch: boolean;  // added by shailesh
    isParentOfficeSameBranch: any;
    loggedInDepartmentId: number = null;
    isGrantCoSelection: boolean;
    isUniqueListReqForBudget: boolean = false;

    constructor(private elem: ElementRef,
        private toastr: ToastrService,
        private router: Router,
        private fb: FormBuilder,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CommonWorkflowComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private el: ElementRef,
        private commonWorkflowService: CommonWorkflowService
    ) { }

    ngOnInit() {
        this.maxAttachment = DataConstant.MAX_ATTACHMENT;
        this.createForm();

        // To get the logged in user info and menu info
        this.commonWorkflowService.getCurrentUserDetail().then(res => {
            if (res) {
                this.wfRoleIds = res['wfRoleId'];
                this.wfRoleCode = res['wfRoleCode'];
                this.menuId = res['menuId'];
                this.linkMenuId = res['linkMenuId'] ? res['linkMenuId'] : this.menuId;
                this.postId = res['postId'];
                this.userId = res['userId'];
                this.lkPoOffUserId = res['lkPoOffUserId'];
                this.officeId = res['officeDetail']['officeId'];
                this.commentHistoryOfficeName = res['officeDetail']['officeName'];
                this.loggedInDepartmentId = res['officeDetail']['departmentId'];
                console.log('---------->', res);
                this.getHistory();
                this.getParentOffice();
                if (this.data.isAttachmentTab) {
                    this.getAttachmentList();
                }
            }
        });
    }

    /**
     * @description to create workflow form
     */
    createForm() {
        this.workflowForm = this.fb.group({
            workflowAction: ['', Validators.required],
            remarks: ['', Validators.required]
        });
    }

    /**
     * @description to get the workflow history
     */
    getHistory() {
        try {
            const histParam = {
                'menuId': this.linkMenuId,
                'trnId': this.data.trnId,
            };
            this.commonWorkflowService.getWorkFlowHistory(histParam).subscribe((data) => {
                if (data && data['result'] && data['result'].length > 0) {
                    let extension;
                    this.historyData = data['result'].filter(dataObj => {
                        if (dataObj && dataObj.attachmentCommonDtoList) {
                            dataObj.attachmentCommonDtoList = dataObj.attachmentCommonDtoList.filter(attachmentItem => {
                                extension = attachmentItem.uploadedFileName ?
                                    attachmentItem.uploadedFileName.split('.').pop() : '';
                                if (previewExtension.indexOf(extension) !== -1) {
                                    attachmentItem.isView = true;
                                }
                                return attachmentItem;
                            });
                        }
                        return dataObj;
                    });
                }
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To get Parent Office
     */
    getParentOffice() {
        try {
            const param = {
                'id': this.officeId
            };
            this.commonWorkflowService.getParentOffice(param).subscribe((data) => {
                if (data && data['status'] === 200 && data['result']) {
                    this.parentOffice = data['result'];
                }
                this.getActionList();
            }, (err) => {
                this.toastr.error(err);
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description get the action list
     */
    getActionList() {
        try {
            if (this.linkMenuId && this.wfRoleIds && this.postId && this.userId && this.data.trnId) {
                const params = {
                    'menuId': this.linkMenuId,
                    'officeId': this.officeId,
                    'postId': this.postId,
                    'trnId': this.data.trnId,
                    'userId': this.userId,
                    'wfRoleIds': this.wfRoleIds,
                    'lkPOUId': this.lkPoOffUserId
                };
                if (this.data.branchId) {
                    params['branchId'] = this.data.branchId;
                }
                this.commonWorkflowService.getWorkFlowAction(params).subscribe((data) => {
                    if (data && data['result'] && data['result'].length > 0) {
                        this.popErrorMessage('action');
                        this.actionResponse = data['result'];
                        if (data['result'].length === 1) {
                            this.actionList.push(
                                {
                                    'workflowActionId': data['result'][0]['workflowActionId'],
                                    'wfActionName': data['result'][0]['wfActionName']
                                }
                            );
                            this.workflowForm.get('workflowAction').setValue(data['result'][0]['workflowActionId']);
                            this.onActionChange();
                        } else {
                            data['result'].forEach(element => {
                                this.actionList.push(
                                    {
                                        'workflowActionId': element['workflowActionId'],
                                        'wfActionName': element['wfActionName']
                                    }
                                );
                            });
                        }
                    } else {
                        this.pushErrorMessage(data['message'], 'action');
                        this.toastr.error(data['message']);
                    }
                }, (err) => {
                    this.pushErrorMessage(err, 'action');
                    this.toastr.error(err);
                });
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To reset variable on action change
     */
    resetActionChangeVariable() {
        try {
            this.isLocationTypeBranch = false;
            this.isUserVisible = false;
            this.isDepartmentVisible = false;
            this.isWorkflowRoleVisible = false;
            this.isHodVisible = false;
            this.isCoVisible = false;
            this.isOfficeVisible = false;
            this.isChildOffice = false;
            this.isParentOffice = false;
            this.isOnlyDummyEntry = false;
            this.isToOffice = false;
            this.isTobranch = false;
            this.isSameOfficeSameBranch = false;  // added by shailesh
            this.isParentOfficeSameBranch = false;
            this.isGrantCoSelection = false;
            this.userSelTwoObj = null;
            this.fdGroupData = null;
            this.userList = [];
            this.officeList = [];
            this.departmentList = [];
            this.hodList = [];
            this.coList = [];
            this.apiErrorMessageList = [];
            this.userResponse = [];
            this.isUniqueListReqForBudget = false;
            if (this.workflowForm.controls.hasOwnProperty('user')) {
                this.workflowForm.removeControl('user');

            }
        } catch (err) {
            this.toastr.error(err);
        }
    }
    /**
     * @description On Action selection change get the user or branch or office List
     */
    onActionChange() {
        try {
            if (this.actionResponse) {
                const selectedAction = this.actionResponse.filter(actionObj => {
                    return actionObj.workflowActionId === this.workflowForm.get('workflowAction').value;
                })[0];
                if (selectedAction) {
                    this.selectedAction = _.cloneDeep(selectedAction);
                    this.resetActionChangeVariable();
                    let configDtoList = [];

                    if (selectedAction.wfActionConfigDtoList && selectedAction.wfActionConfigDtoList.length > 0) {
                        this.userSelTwoObj = selectedAction.wfActionConfigDtoList.filter(actionObj => {
                            return actionObj.isToUserSelReq === 2;
                        })[0];
                        if (this.userSelTwoObj && this.userSelTwoObj['toBranchTypeId']) {
                            this.getBranchForDummyEntryByBranchType(this.userSelTwoObj['toBranchTypeId']);
                        }
                    }
                    if (selectedAction.wfActionConfigDtoList && selectedAction.wfActionConfigDtoList.length > 0) {
                        configDtoList = selectedAction.wfActionConfigDtoList.filter(actionObj => {
                            return actionObj.isToUserSelReq !== 2;
                        });
                    }
                    if (configDtoList && configDtoList.length > 0) {
                        if (configDtoList.length > 1) {
                            this.checkCondition(configDtoList).then((correctCondition) => {
                                if (correctCondition) {
                                    this.selectedAction = configDtoList.filter(actionObj => {
                                        return actionObj.condition === correctCondition;
                                    })[0];
                                    this.selectedActionCheck(_.cloneDeep(this.selectedAction), true);
                                }
                            }).catch(err => {
                                this.toastr.error(err);
                            });
                        } else if (configDtoList.length === 1) {
                            if (configDtoList[0]['condition']) {
                                this.checkCondition(configDtoList).then((correctConditionObj) => {
                                    if (correctConditionObj) {
                                        this.selectedAction = configDtoList.filter(actionObj => {
                                            return actionObj.condition === correctConditionObj;
                                        })[0];
                                        this.selectedActionCheck(_.cloneDeep(this.selectedAction), true);
                                    }
                                }).catch(err => {
                                    this.toastr.error(err);
                                });
                            } else {
                                this.selectedAction = _.cloneDeep(configDtoList[0]);
                                this.selectedActionCheck(_.cloneDeep(this.selectedAction), true);
                            }
                        }
                    } else {
                        if (selectedAction['condition']) {
                            configDtoList.push(selectedAction);
                            this.checkCondition(configDtoList).then((correctConditionObj1) => {
                                if (correctConditionObj1) {
                                    this.selectedAction = configDtoList.filter(actionObj => {
                                        return actionObj.condition === correctConditionObj1;
                                    })[0];
                                    this.selectedActionCheck(_.cloneDeep(this.selectedAction), true);
                                }
                            }).catch(err => {
                                this.toastr.error(err);
                            });
                        } else {
                            this.selectedAction = _.cloneDeep(selectedAction);
                            this.selectedActionCheck(_.cloneDeep(this.selectedAction), false);
                        }
                    }
                }
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * To perform all the condition check for selected action
     * @param selectedAction Selected Action Object
     * @param fromConfigDto If selected action from configDto then it's true other wise it should be false
     */
    selectedActionCheck(selectedAction, fromConfigDto) {
        try {
            if (selectedAction.locationTypeName) {
                if (selectedAction.locationTypeName === DataConstant.CUSTOM_LOCATION_TYPE) {
                    if (this.data.menuModuleName === ModuleNames.BUDGET) {
                        if (selectedAction.locationValue === DataConstant.HOD_SELECTION) {
                            if (this.data.moduleInfo.menuName &&
                                this.data.moduleInfo.menuName === DataConstant.STANDING_CHARGE_ESTIMATE) {
                                this.isUniqueListReqForBudget = true;
                            }
                            this.hodSelection();
                            this.isBranchSelection().then((hodBranchRes) => {
                                if (hodBranchRes) {
                                    this.isTobranch = true;
                                }
                            });
                        } else if (selectedAction.locationValue === DataConstant.CO_SELECTION) {
                            if (this.data.moduleInfo.menuName &&
                                    this.data.moduleInfo.menuName === DataConstant.STANDING_CHARGE_ESTIMATE) {
                                this.isUniqueListReqForBudget = true;
                            }
                            this.coSelection();
                            this.isBranchSelection().then((coBranchRes) => {
                                if (coBranchRes) {
                                    this.isTobranch = true;
                                }
                            });
                        } else if (selectedAction.locationValue === DataConstant.FDGROUP) {
                            // as discussed with shailesh added this check.
                            if (this.data.fdGroupUrl) {
                                this.getFdGroup();
                            }
                            this.isBranchSelection().then((fdBranchRes) => {
                                if (fdBranchRes) {
                                    this.isTobranch = true;
                                }
                                this.isUserSelection(fromConfigDto);
                            });
                        } else if (selectedAction.locationValue === DataConstant.GAD_OFFICE_ALIAS) {
                            // GAD Alias for outcome budget menu & checked with shailesh
                            this.getGadOfficeForOtcmBud().then(() => {
                                this.isBranchSelection().then((toBranchRes) => {
                                    if (toBranchRes) {
                                        this.isTobranch = true;
                                    }
                                    this.isUserSelection(fromConfigDto);
                                });
                            });
                        }
                    } else if (this.data.menuModuleName === ModuleNames.GRANT) {
                        if (selectedAction.locationValue === DataConstant.FDOFFICE) {
                            this.getFdOfficeByOfficeType();
                        } else if (selectedAction.locationValue === DataConstant.GRANT_CO_SELECTION) {
                            this.isGrantCoSelection = true;
                            this.coSelection();
                            // this.isBranchSelection().then((branchRes) => {
                            //     if (branchRes) {
                            //         this.isTobranch = true;
                            //     }
                            // });
                        } else if (selectedAction.locationValue === DataConstant.GRANT_SELECT_SPECIFIC_APPROVER) {
                            this.isSameOfficeSameBranch = true;
                            this.isBranchSelection().then((grantBranchRes) => {
                                if (grantBranchRes) {
                                    this.isTobranch = true;
                                }
                                this.isUserSelection(fromConfigDto);
                            });
                        }
                    } else if (this.data.menuModuleName === ModuleNames.EDP) {
                        if (selectedAction.locationValue === DataConstant.TO_OFFICE_NAME ||
                            selectedAction.locationValue === DataConstant.DAT_OFFICE_NAME) {
                            this.getTOPAOOffice().then(() => {
                                this.isBranchSelection().then((toBranchRes) => {
                                    if (toBranchRes) {
                                        this.isTobranch = true;
                                    }
                                    this.isUserSelection(fromConfigDto);
                                });
                            });
                        }
                    } else if (this.data.menuModuleName === ModuleNames.RECEIPT) {
                        if (selectedAction.locationValue === DataConstant.DAT_OFFICE_NAME) {
                            this.getDatOfficeForReceipt().then(() => {
                                this.isBranchSelection().then((branchRes) => {
                                    if (branchRes) {
                                        this.isTobranch = true;
                                    }
                                    this.isUserSelection(fromConfigDto);
                                });
                            });
                        }
                    } else if (this.data.menuModuleName === ModuleNames.CONTRACT) {
                        if (selectedAction.locationValue === DataConstant.DEPARTMENT_OFFICE) {
                            this.getContractAdOffice().then((deptOfficeRes) => {
                                if (deptOfficeRes) {
                                    this.isToOffice = true;
                                }
                                this.isBranchSelection().then((deptBranchRes) => {
                                    if (deptBranchRes) {
                                        this.isTobranch = true;
                                    }
                                    this.isUserSelection(fromConfigDto);
                                });
                            });
                        }
                    }
                } else if (selectedAction.locationTypeName === DataConstant.SAME_OFFICE_OTHER_BRANCH_TYPE) {
                    this.isBranchSelection().then((sameOffOtherBranchRes) => {
                        if (sameOffOtherBranchRes) {
                            this.isTobranch = true;
                        }
                        this.isUserSelection(fromConfigDto);
                    });
                } else if (selectedAction.locationTypeName === DataConstant.PARENT_OFFICE) {

                    this.isParentOffice = true;
                    this.setParentOffice().then((parentOfficeRes) => {
                        if (parentOfficeRes) {
                            this.isToOffice = true;
                        }
                        this.isUserSelection(fromConfigDto);
                    });
                } else if (selectedAction.locationTypeName === DataConstant.PARENT_OFFICE_OTHER_BRANCH_TYPE) {
                    this.setParentOffice().then((parentOffOtherBranchOfficeRes) => {
                        if (parentOffOtherBranchOfficeRes) {
                            this.isToOffice = true;
                        }
                        this.isBranchSelection().then((parentOffOtherBranchRes) => {
                            if (parentOffOtherBranchRes) {
                                this.isTobranch = true;
                            }
                            this.isUserSelection(fromConfigDto);
                        });
                    });
                } else if (selectedAction.locationTypeName === DataConstant.PARENT_OFFICE_SAME_BRANCH) {
                    this.isParentOfficeSameBranch = true;
                    this.setParentOffice().then((parentOffSameBranchOfficeRes) => {
                        if (parentOffSameBranchOfficeRes) {
                            this.isToOffice = true;
                        }
                        this.isBranchSelection().then((parentOffSameBranchRes) => {
                            if (parentOffSameBranchRes) {
                                this.isTobranch = true;
                            }
                            this.isUserSelection(fromConfigDto);
                        });
                    });
                } else if (selectedAction.locationTypeName === DataConstant.CHILD_OFFICE) {
                    this.isChildOffice = true;
                    this.isOfficeSelection().then((childOfficeRes) => {
                        if (childOfficeRes) {
                            this.isToOffice = true;
                        }
                        this.isBranchSelection().then((childOffBranchRes) => {
                            if (childOffBranchRes) {
                                this.isTobranch = true;
                            }
                            this.isUserSelection(fromConfigDto);
                        });
                    });
                } else if (selectedAction.locationTypeName === DataConstant.SAME_OFFICE_SAME_BRANCH) {
                    this.isSameOfficeSameBranch = true;  // added by shailesh
                    this.isBranchSelection().then((sameOffSameBranchRes) => {
                        if (sameOffSameBranchRes) {
                            this.isTobranch = true;
                        }
                        this.isUserSelection(fromConfigDto);
                    });
                } else if (selectedAction.locationTypeName === DataConstant.SAME_OFFICE) {
                    this.isBranchSelection().then((sameOfficeBranchRes) => {
                        if (sameOfficeBranchRes) {
                            this.isTobranch = true;
                        }
                        this.isUserSelection(fromConfigDto);
                    });
                } else {
                    this.isOfficeSelection().then((officeRes) => {
                        if (officeRes) {
                            this.isToOffice = true;
                        }
                        this.isBranchSelection().then((branchRes) => {
                            if (branchRes) {
                                this.isTobranch = true;
                            }
                            this.isUserSelection(fromConfigDto);
                        });
                    });
                }

            } else {
                this.toastr.error(this.errorMessages.CONF_WITHOUT_LOCATIONTYPE);
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To get the AD office List for Contract Menu
     */
    getContractAdOffice() {
        try {
            return new Promise((officeResolve) => {
                if (this.selectedAction.isToOfficeSelReq === 1 || this.selectedAction.isToOfficeSelReq === -1) {
                    this.isOfficeVisible = true;
                    this.workflowForm.addControl('office', new FormControl(Validators.required));
                    this.workflowForm.controls.office.setValue('');
                }
                this.commonWorkflowService.getAdOffice({}).subscribe((data) => {
                    if (data && data['status'] === 200 && data['result']) {
                        if (data['result'].length > 0) {
                            this.popErrorMessage('adoffice');
                            const adOfficeList = data['result'];
                            this.officeList = adOfficeList.filter(deptObj => {
                                return deptObj.departmentId === this.loggedInDepartmentId;
                            });
                            if (this.officeList && this.officeList.length > 0) {
                                if (this.isOfficeVisible) {
                                    if (this.officeList.length > 1) {
                                        this.officeList = this.officeList.filter(temp => temp.isFd === 2);
                                    }
                                    this.workflowForm.get('office').setValue(this.officeList[0]['officeId']);
                                }
                            }
                            officeResolve(true);
                        } else {
                            this.officeList = [];
                            this.pushErrorMessage(this.errorMessages.WF_OFFICE_LIST_EMPTY, 'adoffice');
                            this.toastr.error(this.errorMessages.WF_OFFICE_LIST_EMPTY);
                            officeResolve(false);
                        }
                    } else {
                        this.officeList = [];
                        this.pushErrorMessage(data['message'], 'adoffice');
                        this.toastr.error(data['message']);
                        officeResolve(false);
                    }
                }, (err) => {
                    this.officeList = [];
                    this.pushErrorMessage(err, 'adoffice');
                    this.toastr.error(err);
                    officeResolve(false);
                });
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To set the parent office list for PARANT_OFFICE_aliase
     */
    setParentOffice() {
        try {
            return new Promise((officeResolve) => {
                if (this.parentOffice) {
                    this.officeList = [];
                    this.officeList.push(this.parentOffice);
                    if (this.selectedAction.isToOfficeSelReq === 1 || this.selectedAction.isToOfficeSelReq === -1) {
                        this.isOfficeVisible = true;
                        this.workflowForm.addControl('office', new FormControl(Validators.required));
                        this.workflowForm.controls.office.setValue('');
                        if (this.parentOffice.officeId) {
                            this.workflowForm.controls.office.setValue(this.parentOffice.officeId);
                        }
                    }
                    officeResolve(true);
                } else {
                    officeResolve(false);
                }
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To check the Office selection is required or not and get the Office List Data
     */
    isOfficeSelection() {
        try {
            return new Promise((officeResolve) => {
                if ((!(this.selectedAction.locationTypeName === DataConstant.CUSTOM_LOCATION_TYPE &&
                    (this.selectedAction.locationValue === DataConstant.HOD_SELECTION ||
                        this.selectedAction.locationValue === DataConstant.CO_SELECTION)))
                    && !this.isChildOffice && !this.isParentOfficeSameBranch) {
                    this.isOfficeVisible = false;
                    this.officeList = [];
                    // for office dropdown
                    if (this.selectedAction.isToOfficeSelReq === 1 || this.selectedAction.isToOfficeSelReq === -1) {
                        this.isOfficeVisible = true;
                        this.workflowForm.addControl('office', new FormControl(Validators.required));
                        this.workflowForm.controls.office.setValue('');
                        this.getOfficeByOfficeType().then((officeType) => {
                            if (officeType) {
                                officeResolve(true);
                            } else {
                                officeResolve(false);
                            }
                        });
                    } else {
                        officeResolve(false);
                    }
                } else if (this.isChildOffice) {
                    if (this.selectedAction.isToOfficeSelReq === 1 || this.selectedAction.isToOfficeSelReq === -1) {
                        this.isOfficeVisible = true;
                        this.workflowForm.addControl('office', new FormControl(Validators.required));
                        this.workflowForm.controls.office.setValue('');
                    }
                    this.getChildOfficeList().then((childOffice) => {
                        if (childOffice) {
                            officeResolve(true);
                        } else {
                            officeResolve(false);
                        }
                    });
                } else if (this.isParentOfficeSameBranch) {
                    this.isOfficeVisible = false;
                    this.officeList = [];
                    if (this.selectedAction.isToOfficeSelReq === 1 || this.selectedAction.isToOfficeSelReq === -1) {
                        this.isOfficeVisible = true;
                        this.workflowForm.addControl('office', new FormControl(Validators.required));
                    }
                    if (this.workflowForm.controls.hasOwnProperty('office')) {
                        this.workflowForm.controls.office.setValue('');
                    }
                    this.getOfficeByOfficeType().then((parentOffice) => {
                        if (parentOffice) {
                            officeResolve(true);
                        } else {
                            officeResolve(false);
                        }
                    });
                } else {
                    officeResolve(false);
                }
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To check the Branch selection is required or not and get the Branch List Data
     */
    isBranchSelection() {
        try {
            return new Promise((branchRes) => {
                this.isBranchVisible = false;
                this.branchList = [];

                if (this.selectedAction.isToBranchSelReq != null ||
                    this.selectedAction.isToBranchSelReq !== undefined) {
                    // for branch dropdown
                    if (this.selectedAction.isToBranchSelReq === 1 || this.selectedAction.isToBranchSelReq === -1) {
                        this.isBranchVisible = true;
                        this.workflowForm.addControl('branch', new FormControl(Validators.required));
                        this.workflowForm.controls.branch.setValue('');
                        if (this.selectedAction['toBranchTypeId']) {
                            this.getBranchByBranchType().then(res => {
                                if (res) {
                                    branchRes(true);
                                } else {
                                    branchRes(false);
                                }
                            });
                        } else {
                            branchRes(false);
                        }
                    } else {
                        if (this.selectedAction['toBranchTypeId']) {
                            this.getBranchByBranchType().then(branchTypeRes => {
                                if (branchTypeRes) {
                                    branchRes(true);
                                } else {
                                    branchRes(false);
                                }
                            });
                        } else {
                            branchRes(false);
                        }
                    }
                } else {
                    branchRes(false);
                }
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To check the User selection is required or not and get the User List Data
     */
    isUserSelection(fromConfigDto) {
        try {
            if (this.selectedAction.condition === DataConstant.MINISTER_CONDITION) {
                this.ministerSelection();
            } else {
                if (this.isToOffice) {
                    if (this.selectedAction.toIsFd === 1 &&
                        (!(this.selectedAction.isToUserSelReq === 2 && !fromConfigDto))) {
                        if (this.selectedAction.isToUserSelReq === 1 || this.selectedAction.isToUserSelReq === -1) {
                            this.isUserVisible = true;
                            this.workflowForm.addControl('user', new FormControl(Validators.required));
                            this.workflowForm.controls.user.setValue('');
                        }
                        this.getFdOfficeByOfficeType();
                    } else {
                        if (this.selectedAction.isToUserSelReq === 1 || this.selectedAction.isToUserSelReq === -1) {
                            this.isUserVisible = true;
                            this.workflowForm.addControl('user', new FormControl(Validators.required));
                            this.workflowForm.controls.user.setValue('');
                            if (this.workflowForm.get('office').value) {
                                this.getWorkflowUsers(this.workflowForm.get('office').value);
                            }
                        } else if (this.selectedAction.isToUserSelReq === 2 && !fromConfigDto) {
                            // for user selection two
                            this.isOnlyDummyEntry = true;
                            this.userSelTwoObj = _.cloneDeep(this.selectedAction);
                            if (this.userSelTwoObj['toBranchTypeId']) {
                                this.getBranchForDummyEntryByBranchType(this.userSelTwoObj['toBranchTypeId']);
                            }
                        }
                    }
                } else {
                    if (this.selectedAction.toIsFd === 1 &&
                        (!(this.selectedAction.isToUserSelReq === 2 && !fromConfigDto))) {
                        if (this.selectedAction.isToUserSelReq === 1 || this.selectedAction.isToUserSelReq === -1) {
                            this.isUserVisible = true;
                            this.workflowForm.addControl('user', new FormControl(Validators.required));
                            this.workflowForm.controls.user.setValue('');
                        }
                        this.getFdOfficeByOfficeType();
                    } else {
                        if (this.selectedAction.isToUserSelReq === 1 || this.selectedAction.isToUserSelReq === -1) {
                            this.isUserVisible = true;
                            this.workflowForm.addControl('user', new FormControl(Validators.required));
                            this.workflowForm.controls.user.setValue('');
                            this.getWorkflowUsers(this.officeId);
                        } else if (this.selectedAction.isToUserSelReq === 2 && !fromConfigDto) {
                            // for user selection two
                            this.isOnlyDummyEntry = true;
                            this.userSelTwoObj = _.cloneDeep(this.selectedAction);
                            if (this.userSelTwoObj['toBranchTypeId']) {
                                this.getBranchForDummyEntryByBranchType(this.userSelTwoObj['toBranchTypeId']);
                            }
                        }
                    }
                }
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To load the User list based on office selection change
     */
    officeSelectionChange() {
        try {
            if (this.workflowForm.get('office').value) {
                if (this.selectedAction.isToUserSelReq === 1 || this.selectedAction.isToUserSelReq === -1) {
                    this.getWorkflowUsers(this.workflowForm.get('office').value);
                }
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To display the HOD selection fields and get the dropdown data
     */
    hodSelection() {
        try {
            this.isDepartmentVisible = true;
            this.isHodVisible = true;
            this.isCoVisible = false;
            this.isOfficeVisible = false;
            this.workflowForm.addControl('department', new FormControl(Validators.required));
            this.workflowForm.addControl('hod', new FormControl(Validators.required));
            this.workflowForm.controls.department.setValue('');
            this.workflowForm.controls.hod.setValue('');
            this.getDepartmentList();
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To display the CO selection fields and get the dropdown data
     */
    coSelection() {
        try {
            this.isDepartmentVisible = true;
            this.isOfficeVisible = false;
            if (this.data.menuModuleName === ModuleNames.GRANT) {
                this.isWorkflowRoleVisible = true;
                this.workflowForm.addControl('department', new FormControl(Validators.required));
                this.workflowForm.addControl('workflowRole', new FormControl(Validators.required));
                // this.workflowForm.addControl('hod', new FormControl());
                // this.workflowForm.addControl('co', new FormControl());
                this.workflowForm.controls.workflowRole.setValue('');
            } else {
                this.isHodVisible = true;
                this.isCoVisible = true;
                this.workflowForm.addControl('department', new FormControl(Validators.required));
                this.workflowForm.addControl('hod', new FormControl(Validators.required));
                this.workflowForm.addControl('co', new FormControl(Validators.required));
                this.workflowForm.controls.hod.setValue('');
                this.workflowForm.controls.co.setValue('');
            }
            this.workflowForm.controls.department.setValue('');
            this.getDepartmentList();
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To display the CO selection fields and get the dropdown data
     */
    ministerSelection() {
        try {
            this.isUserVisible = true;
            this.workflowForm.addControl('user', new FormControl(Validators.required));
            this.workflowForm.controls.user.setValue('');
            this.getMinisterInCharge();
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To get list of Minister
     */
    getMinisterInCharge() {
        try {
            const param = {
                'officeId': this.officeId,
                'menuId': this.linkMenuId,
                'ministerId': this.data.ministerId
            };
            this.commonWorkflowService.getMinisterInCharge(param).subscribe((data) => {
                if (data && data['status'] === 200 && data['result']) {
                    this.popErrorMessage('minister');
                    this.userResponse = data['result'];
                    if (data['result'].length === 1) {
                        this.userList.push(
                            {
                                'userId': data['result'][0]['userId'],
                                'userName': data['result'][0]['postName'] ?
                                    data['result'][0]['userName'] + ' (' + data['result'][0]['postName'] + ')'
                                    : data['result'][0]['userName'],
                                'pouId': data['result'][0]['pouId'],
                            }
                        );
                        this.workflowForm.get('user').setValue(data['result'][0]['userId']);
                    } else {
                        data['result'].forEach(userElement => {
                            this.userList.push(
                                {
                                    'userId': userElement['userId'],
                                    'userName': userElement['postName'] ?
                                        userElement['userName'] + ' (' + userElement['postName'] + ')'
                                        : userElement['userName'],
                                    'pouId': userElement['pouId'],
                                }
                            );
                        });
                        if (this.selectedAction.isToUserSelReq === -1 && data['result'].length > 1) {
                            this.workflowForm.get('user').setValue(data['result'][0]['userId']);
                        }
                    }
                } else {
                    this.pushErrorMessage(data['message'], 'minister');
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.pushErrorMessage(err, 'minister');
                this.toastr.error(err);
            });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * To check, which condition is true for the selected action
     * @param conditionList condition array (wfActionConfigDtoList key of action list)
     */
    checkCondition(conditionList) {
        try {
            return new Promise((conditionResolve) => {
                if (conditionList && conditionList.length > 0) {
                    const conditionArray = [];
                    conditionList.forEach(condObj => {
                        if (condObj.condition) {
                            conditionArray.push(condObj.condition);
                        }
                    });
                    const actionName = this.actionList.find(x => {
                        return x.workflowActionId === this.workflowForm.get('workflowAction').value;
                    }).wfActionName;
                    if (conditionArray) {
                        const param = {
                            'trnId': this.data.trnId,
                            'defaultCondition': conditionArray[0],
                            'condition': conditionArray
                        };
                        if (this.data.menuModuleName === ModuleNames.EDP) {
                            param['menuId'] = this.linkMenuId;
                            param['action'] = actionName;
                        }

                        if (this.data.menuModuleName === ModuleNames.RECEIPT) {
                            param['menuId'] = this.linkMenuId;
                            param['action'] = actionName;
                        }

                        this.commonWorkflowService.postSubmitApi('POST', this.data.conditionUrl, param)
                            .subscribe((data) => {
                                if (data && data['status'] === 200 && data['result']) {
                                    this.popErrorMessage('condition');
                                    conditionResolve(data['result']);
                                } else {
                                    this.pushErrorMessage(data['message'], 'condition');
                                    this.toastr.error(data['message']);
                                    conditionResolve('');
                                }
                            }, (err) => {
                                this.pushErrorMessage(err, 'condition');
                                this.toastr.error(err);
                                conditionResolve('');
                            });
                    } else {
                        conditionResolve('');
                    }
                } else {
                    conditionResolve('');
                }
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description to get the user list
     */
    getWorkflowUsers(officeId) {
        try {
            if (this.selectedAction) {
                const params = {
                    'menuId': this.linkMenuId,
                    'officeId': officeId,
                    'postId': this.postId,
                    'pouId': this.lkPoOffUserId,
                    'trnId': this.data.trnId,
                    'userId': this.userId,
                    'wfActionConfigId': this.selectedAction['actionConfigId']
                };
                if (this.data.brachId) {
                    params['branchId'] = this.data.brachId;
                }
                this.commonWorkflowService.getWorkFlowUsers(params).subscribe((data) => {
                    if (data && data['status'] === 200 && data['result']) {
                        if (data['result'].length > 0) {
                            this.popErrorMessage('user');
                            this.userResponse = data['result'];
                            if (data['result'].length === 1) {
                                this.userList.push(
                                    {
                                        'userId': data['result'][0]['userId'],
                                        'userName': data['result'][0]['wfRoleName'] ?
                                            data['result'][0]['userName'] + ' (' + data['result'][0]['wfRoleName'] + ')'
                                            : data['result'][0]['userName'],
                                        'pouId': data['result'][0]['pouId'],
                                    }
                                );
                                if (this.data.menuModuleName === ModuleNames.GRANT &&
                                    this.selectedAction.locationValue === DataConstant.GRANT_SELECT_SPECIFIC_APPROVER &&
                                    this.data && this.data.moduleInfo &&
                                    this.data.moduleInfo.selectedUserPouId) {
                                    // this condition is for grant to set selected user from transaction in user field
                                    const user = this.userList.filter(userData => {
                                        return userData.pouId === this.data.moduleInfo.selectedUserPouId;
                                    })[0];
                                    if (user && user['userId']) {
                                        this.workflowForm.get('user').setValue(user['userId']);
                                    }
                                } else {
                                    this.workflowForm.get('user').setValue(data['result'][0]['userId']);
                                }
                            } else {
                                data['result'].forEach(userEle => {
                                    this.userList.push(
                                        {
                                            'userId': userEle['userId'],
                                            'userName': userEle['wfRoleName'] ?
                                                userEle['userName'] + ' (' + userEle['wfRoleName'] + ')'
                                                : userEle['userName'],
                                            'pouId': userEle['pouId'],
                                        }
                                    );
                                });
                                if (this.selectedAction.isToUserSelReq === -1 && data['result'].length > 1) {
                                    this.workflowForm.get('user').setValue(data['result'][0]['userId']);
                                }
                                // this condition is for grant to set selected user from transaction in user field
                                if (this.data.menuModuleName === ModuleNames.GRANT &&
                                    this.selectedAction.locationValue === DataConstant.GRANT_SELECT_SPECIFIC_APPROVER &&
                                    this.data && this.data.moduleInfo &&
                                    this.data.moduleInfo.selectedUserPouId) {
                                    const user = this.userList.filter(userData => {
                                        return userData.pouId === this.data.moduleInfo.selectedUserPouId;
                                    })[0];
                                    if (user && user['userId']) {
                                        this.workflowForm.get('user').setValue(user['userId']);
                                    }
                                }
                            }
                        } else {
                            this.userList = [];
                            this.pushErrorMessage(this.errorMessages.WF_USER_LIST_EMPTY, 'user');
                            this.toastr.error(this.errorMessages.WF_USER_LIST_EMPTY);
                        }
                    } else {
                        this.userList = [];
                        this.pushErrorMessage(data['message'], 'user');
                        this.toastr.error(data['message']);
                    }
                }, (err) => {
                    this.userList = [];
                    this.pushErrorMessage(err, 'user');
                    this.toastr.error(err);
                });
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description to get the user list Grant CO_SELECTION Alias
     */
    getGrantWorkflowUsers(officeId, wfRoleId?) {
        try {
            if (this.selectedAction) {
                const params = {
                    'menuId': this.linkMenuId,
                    'officeId': officeId,
                    'toWfRoleId': this.workflowForm.get('workflowRole').value
                };
                this.commonWorkflowService.getGrantWorkFlowUsers(params).subscribe((data) => {
                    if (data && data['status'] === 200 && data['result']) {
                        if (data['result'].length > 0) {
                            this.popErrorMessage('user');
                            this.userResponse = data['result'];
                            if (data['result'].length === 1) {
                                this.userList.push(
                                    {
                                        'userId': data['result'][0]['userId'],
                                        'userName': data['result'][0]['postName'] ?
                                            data['result'][0]['userName'] + ' (' + data['result'][0]['postName'] + ')'
                                            : data['result'][0]['userName'],
                                        'pouId': data['result'][0]['pouId'],
                                    }
                                );
                                if (this.data && this.data.moduleInfo &&
                                    this.data.moduleInfo.selectedUserPouId) {
                                    // this condition is for grant to set selected user from transaction in user field
                                    const user = this.userList.filter(userData => {
                                        return userData.pouId === this.data.moduleInfo.selectedUserPouId;
                                    })[0];
                                    if (user && user['userId']) {
                                        this.workflowForm.get('user').setValue(user['userId']);
                                    }
                                } else {
                                    this.workflowForm.get('user').setValue(data['result'][0]['userId']);
                                }
                            } else {
                                data['result'].forEach(userEle => {
                                    this.userList.push(
                                        {
                                            'userId': userEle['userId'],
                                            'userName': userEle['postName'] ?
                                                userEle['userName'] + ' (' + userEle['postName'] + ')'
                                                : userEle['userName'],
                                            'pouId': userEle['pouId'],
                                        }
                                    );
                                });
                                if (this.selectedAction.isToUserSelReq === -1 && data['result'].length > 1) {
                                    this.workflowForm.get('user').setValue(data['result'][0]['userId']);
                                }
                                // this condition is for grant to set selected user from transaction in user field
                                if (this.data && this.data.moduleInfo &&
                                    this.data.moduleInfo.selectedUserPouId) {
                                    const user = this.userList.filter(userData => {
                                        return userData.pouId === this.data.moduleInfo.selectedUserPouId;
                                    })[0];
                                    if (user && user['userId']) {
                                        this.workflowForm.get('user').setValue(user['userId']);
                                    }
                                }
                            }
                        } else {
                            this.userList = [];
                            this.pushErrorMessage(this.errorMessages.WF_USER_LIST_EMPTY, 'user');
                            this.toastr.error(this.errorMessages.WF_USER_LIST_EMPTY);
                        }
                    } else {
                        this.userList = [];
                        this.pushErrorMessage(data['message'], 'user');
                        this.toastr.error(data['message']);
                    }
                }, (grantWfErr) => {
                    this.userList = [];
                    this.pushErrorMessage(grantWfErr, 'user');
                    this.toastr.error(grantWfErr);
                });
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description to get the branch list by branch type id
     */
    getBranchByBranchType() {
        try {
            return new Promise((branchResolve) => {
                if (this.selectedAction && this.selectedAction['toBranchTypeId']) {
                    this.branchList = [];
                    const params = {
                        'id': this.selectedAction['toBranchTypeId'],
                    };
                    this.commonWorkflowService.getBranchByBranchType(params).subscribe((data) => {
                        if (data && data['status'] === 200 && data['result']) {
                            if (data['result'].length > 0) {
                                this.popErrorMessage('branchType');
                                this.branchList = data['result'];
                                if ((data['result'].length === 1 && this.isBranchVisible)
                                    || (this.selectedAction.isToBranchSelReq === -1 && data['result'].length > 1)) {
                                    this.workflowForm.get('branch').setValue(data['result'][0]['branchId']);
                                }
                                branchResolve(true);
                            } else {
                                this.pushErrorMessage(this.errorMessages.WF_BRANCH_LIST_EMPTY, 'branchType');
                                this.toastr.error(this.errorMessages.WF_BRANCH_LIST_EMPTY);
                                branchResolve(false);
                            }
                        } else {
                            this.pushErrorMessage(data['message'], 'branchType');
                            this.toastr.error(data['message']);
                            branchResolve(false);
                        }
                    }, (err) => {
                        this.pushErrorMessage(err, 'branchType');
                        this.toastr.error(err);
                        branchResolve(false);
                    });
                } else {
                    branchResolve(false);
                }
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description to get the branch list for Dummy entry by branch type id
     */
    getBranchForDummyEntryByBranchType(branchTypeId) {
        try {
            if (branchTypeId) {
                this.dummyBranchList = [];
                const params = {
                    'id': branchTypeId,
                };
                this.commonWorkflowService.getBranchByBranchType(params).subscribe((data) => {
                    if (data && data['status'] === 200 && data['result']) {
                        if (data['result'].length > 0) {
                            this.popErrorMessage('dummyBranchType');
                            this.dummyBranchList = data['result'];
                        } else {
                            this.pushErrorMessage(this.errorMessages.WF_BRANCH_LIST_EMPTY, 'dummyBranchType');
                            this.toastr.error(this.errorMessages.WF_BRANCH_LIST_EMPTY);
                        }
                    } else {
                        this.pushErrorMessage(data['message'], 'dummyBranchType');
                        this.toastr.error(data['message']);
                    }
                }, (err) => {
                    this.pushErrorMessage(err, 'dummyBranchType');
                    this.toastr.error(err);
                });
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To get office list by office type id
     */
    getOfficeByOfficeType() {
        try {
            return new Promise((officeResolve) => {
                if (this.selectedAction && this.selectedAction['toOfficeTypeId']) {
                    this.officeList = [];
                    const params = {
                        'id': this.selectedAction['toOfficeTypeId'],
                    };
                    this.commonWorkflowService.getOfficeByOfficeType(params).subscribe((data) => {
                        if (data && data['status'] === 200 && data['result']) {
                            if (data['result'].length > 0) {
                                this.popErrorMessage('officeType');
                                this.officeList = data['result'];
                                if (this.isOfficeVisible) {
                                    if (data['result'].length === 1) {
                                        this.workflowForm.get('office').setValue(data['result'][0]['officeId']);
                                    } else {
                                        if (this.parentOffice.officeId) {
                                            this.workflowForm.get('office').setValue(this.parentOffice.officeId);
                                        } else if (this.selectedAction.isToOfficeSelReq === -1) {
                                            this.workflowForm.get('office').setValue(data['result'][0]['officeId']);
                                        }
                                    }
                                }
                                officeResolve(true);
                            } else {
                                this.pushErrorMessage(this.errorMessages.WF_OFFICE_LIST_EMPTY, 'officeType');
                                this.toastr.error(this.errorMessages.WF_OFFICE_LIST_EMPTY);
                                officeResolve(false);
                            }
                        } else {
                            this.pushErrorMessage(data['message'], 'officeType');
                            this.toastr.error(data['message']);
                            officeResolve(false);
                        }
                    }, (err) => {
                        this.pushErrorMessage(err, 'officeType');
                        this.toastr.error(err);
                        officeResolve(false);
                    });
                } else {
                    officeResolve(false);
                }
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To get FD office list by office type id
     */
    getFdOfficeByOfficeType() {
        try {
            this.officeList = [];
            this.commonWorkflowService.getFdOffice({}).subscribe((data) => {
                if (data && data['status'] === 200 && data['result']) {
                    this.popErrorMessage('fdOffice');
                    if (data['result'].length > 0) {
                        this.officeList = data['result'];
                        if (this.isUserVisible) {
                            this.getWorkflowUsers(data['result'][0]['officeId']);
                        }
                    }
                } else {
                    this.pushErrorMessage(data['message'], 'fdOffice');
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.pushErrorMessage(err, 'fdOffice');
                this.toastr.error(err);
            });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description To get Child office list by office type id
     */
    getChildOfficeList() {
        try {
            return new Promise((childOffResolve) => {
                this.officeList = [];
                const param = {
                    'menuId': this.linkMenuId,
                    'trnId': this.data.trnId,
                    'officeId': this.officeId
                };
                this.commonWorkflowService.getChildOffice(param).subscribe((data) => {
                    if (data && data['status'] === 200 && data['result']) {
                        this.popErrorMessage('childOffice');
                        this.officeList.push(data['result']);
                        if (this.isOfficeVisible) {
                            this.workflowForm.get('office').setValue(this.officeList[0]['officeId']);
                        }
                        childOffResolve(true);
                    } else {
                        this.pushErrorMessage(data['message'], 'childOffice');
                        this.toastr.error(data['message']);
                    }
                }, (err) => {
                    this.pushErrorMessage(err, 'childOffice');
                    this.toastr.error(err);
                    childOffResolve(false);
                });
            });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description To get TO/PAO office by office type id
     * As Discussed with Shailesh Dobariya i am added Aliyas API function into this file.
     */
    getTOPAOOffice() {
        try {
            return new Promise((toPaoOffice) => {
                this.officeList = [];
                const param = {
                    'alias': this.selectedAction.locationValue,
                    'districtId': this.data.moduleInfo.districtId
                };
                this.commonWorkflowService.getTOPAOOffice(param).subscribe((data) => {
                    if (data && data['status'] === 200 && data['result']) {
                        this.popErrorMessage('TaPaoOffice');
                        this.officeList.push(data['result']);
                        // tslint:disable-next-line: max-line-length
                        if (this.selectedAction.isToOfficeSelReq === 1 || this.selectedAction.isToOfficeSelReq === -1) {
                            this.isOfficeVisible = true;

                            this.workflowForm.addControl('office', new FormControl(Validators.required));
                            this.workflowForm.controls.office.setValue('');
                            this.workflowForm.get('office').setValue(this.officeList[0]['officeId']);
                        }
                        toPaoOffice(true);
                    } else {
                        this.pushErrorMessage(data['message'], 'TaPaoOffice');
                        this.toastr.error(data['message']);
                    }
                }, (err) => {
                    this.pushErrorMessage(err, 'TaPaoOffice');
                    this.toastr.error(err);
                    toPaoOffice(false);
                });
            });
        } catch (error) {
            this.toastr.error(error);
        }
    }


    getDatOfficeForReceipt() {
        try {
            return new Promise((toPaoOffice) => {
                this.officeList = [];
                const param = {
                    'alias': this.selectedAction.locationValue
                };
                this.commonWorkflowService.getDatOfficeForReceipt(param).subscribe((data) => {
                    if (data && data['status'] === 200 && data['result']) {
                        this.officeId = data['result'].officeId;
                        this.popErrorMessage('TaPaoOffice');
                        this.officeList.push(data['result']);
                        // tslint:disable-next-line: max-line-length
                        if (this.selectedAction.isToOfficeSelReq === 1 || this.selectedAction.isToOfficeSelReq === -1) {
                            this.isOfficeVisible = true;

                            this.workflowForm.addControl('office', new FormControl(Validators.required));
                            this.workflowForm.controls.office.setValue('');
                            this.workflowForm.get('office').setValue(this.officeList[0]['officeId']);
                        }
                        toPaoOffice(true);
                    } else {
                        this.pushErrorMessage(data['message'], 'TaPaoOffice');
                        this.toastr.error(data['message']);
                    }
                }, (err) => {
                    this.pushErrorMessage(err, 'TaPaoOffice');
                    this.toastr.error(err);
                    toPaoOffice(false);
                });
            });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    getFdGroup() {
        try {
            const param = {
                'id': this.data.trnId,
            };
            // discussed with shailesh, added fd group url for module specific.
            this.commonWorkflowService.postSubmitApi('POST', this.data.fdGroupUrl, param).subscribe((data) => {
                if (data && data['status'] === 200 && data['result']) {
                    this.popErrorMessage('fdGroup');
                    this.fdGroupData = data['result'];
                } else {
                    this.pushErrorMessage(data['message'], 'fdGroup');
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.pushErrorMessage(err, 'fdGroup');
                this.toastr.error(err);
            });
        } catch (error) {
            this.toastr.error(error);
        }
    }


    /**
     * @description To get GAD office for outcome budget menu
     * checked for the same with shailesh
     */
    getGadOfficeForOtcmBud() {
        try {
            return new Promise((gadOffice) => {
                this.officeList = [];
                const param = {
                    'alias': this.selectedAction.locationValue,
                };
                this.commonWorkflowService.getGadOffice(param).subscribe((data) => {
                    if (data && data['status'] === 200 && data['result']) {
                        this.popErrorMessage('GadOffice');
                        this.officeList.push(data['result']);
                        // tslint:disable-next-line: max-line-length
                        if (this.selectedAction.isToOfficeSelReq === 1 || this.selectedAction.isToOfficeSelReq === -1) {
                            this.isOfficeVisible = true;

                            this.workflowForm.addControl('office', new FormControl(Validators.required));
                            this.workflowForm.controls.office.setValue('');
                            this.workflowForm.get('office').setValue(this.officeList[0]['officeId']);
                        }
                        gadOffice(true);
                    } else {
                        this.pushErrorMessage(data['message'], 'GadOffice');
                        this.toastr.error(data['message']);
                    }
                }, (err) => {
                    this.pushErrorMessage(err, 'GadOffice');
                    this.toastr.error(err);
                    gadOffice(false);
                });
            });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description To get Department List
     */
    getDepartmentList() {
        try {
            this.commonWorkflowService.getAdOffice({}, this.isUniqueListReqForBudget).subscribe((data) => {
                if (data && data['status'] === 200 && data['result']) {
                    if (data['result'].length > 0) {
                        this.popErrorMessage('department');
                        this.departmentList = data['result'];
                        const department = this.departmentList.filter(deptObj => {
                            return deptObj.departmentId === this.parentOffice.departmentId;
                        });
                        if (department && department.length > 0) {
                            if (this.isDepartmentVisible) {
                                this.workflowForm.get('department').setValue(this.parentOffice.departmentId);
                            }
                        }
                        if (data['result'].length === 1 && this.isDepartmentVisible) {
                            this.workflowForm.get('department').setValue(data['result'][0]['id']);
                        }
                        if (this.isWorkflowRoleVisible) {
                            this.getWorkflowRoleList();
                        }
                        if (this.isHodVisible && this.workflowForm.get('department').value) {
                            this.getHodList();
                        }
                    } else {
                        this.departmentList = [];
                        this.pushErrorMessage(this.errorMessages.WF_DEPARTMENT_LIST_EMPTY, 'department');
                        this.toastr.error(this.errorMessages.WF_DEPARTMENT_LIST_EMPTY);
                    }
                } else {
                    this.departmentList = [];
                    this.pushErrorMessage(data['message'], 'department');
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.departmentList = [];
                this.pushErrorMessage(err, 'department');
                this.toastr.error(err);
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
    * @description To get the workflow role list
    */
    getWorkflowRoleList() {
        try {
            this.commonWorkflowService.getWorkflowRoleList({}).subscribe((data) => {
                if (data && data['status'] === 200 && data['result']) {
                    if (data['result'].length > 0) {
                        this.popErrorMessage('workflowRole');
                        this.workflowRoleList = data['result'];
                        if (this.workflowRoleList && this.workflowRoleList.length === 1) {
                            this.workflowForm.controls.workflowRole.setValue(this.workflowRoleList[0]['wfRoleId']);
                            this.onWorkflowRoleChange();
                        }
                    } else {
                        this.workflowRoleList = [];
                        this.pushErrorMessage(this.errorMessages.WF_WORKFLOW_ROLE_LIST_EMPTY, 'workflowRole');
                        this.toastr.error(this.errorMessages.WF_WORKFLOW_ROLE_LIST_EMPTY);
                    }
                } else {
                    this.workflowRoleList = [];
                    this.pushErrorMessage(data['message'], 'workflowRole');
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.workflowRoleList = [];
                this.pushErrorMessage(err, 'workflowRole');
                this.toastr.error(err);
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    onWorkflowRoleChange() {
        try {
            if (this.isWorkflowRoleVisible && this.workflowForm.get('workflowRole').value) {
                this.userList = [];
                this.userResponse = [];
                if (this.workflowForm.controls.hasOwnProperty('user')) {
                    this.workflowForm.get('user').setValue('');
                }
                this.hodList = [];
                if (this.workflowForm.controls.hasOwnProperty('hod')) {
                    this.workflowForm.get('hod').setValue('');
                }
                this.coList = [];
                if (this.workflowForm.controls.hasOwnProperty('co')) {
                    this.workflowForm.get('co').setValue('');
                }
                const wfRole = this.workflowRoleList.filter(roleObj => {
                    return roleObj.wfRoleId === this.workflowForm.get('workflowRole').value;
                })[0];

                if (this.isGrantCoSelection) {
                    if (this.selectedAction.isToUserSelReq === 1 || this.selectedAction.isToUserSelReq === -1) {
                        this.isUserVisible = true;
                        if (!this.workflowForm.controls.hasOwnProperty('user')) {
                            this.workflowForm.addControl('user', new FormControl(Validators.required));
                        }
                        this.workflowForm.controls.user.setValue('');
                        if (this.workflowForm.get('department').value
                            && this.workflowForm.get('workflowRole').value) {
                            const dept = this.departmentList.filter(deptObj => {
                                return deptObj['departmentId'] === this.workflowForm.get('department').value;
                            })[0];
                            if (dept && dept['officeId']) {
                                // tslint:disable-next-line:max-line-length
                                this.getGrantWorkflowUsers(dept['officeId'], this.workflowForm.get('workflowRole').value);
                            }
                        }
                    }
                }
                if (wfRole && wfRole['wfRoleCode']) {
                    if (wfRole['wfRoleCode'] === DataConstant.CO_APPROVER_WF_ROLE_CODE) {
                        this.isHodVisible = true;
                        this.isCoVisible = true;
                        this.workflowForm.addControl('hod', new FormControl());
                        this.workflowForm.addControl('co', new FormControl());
                        this.workflowForm.controls.hod.setValue('');
                        this.workflowForm.controls.co.setValue('');
                        if (this.isHodVisible && this.workflowForm.get('department').value) {
                            this.getHodList();
                        }
                    } else if (wfRole['wfRoleCode'] === DataConstant.DEPT_APPROVER_WF_ROLE_CODE) {
                        this.isHodVisible = false;
                        this.isCoVisible = false;
                    }
                }
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }


    /**
     * @description on department selection change
     */
    onDepartmentChange() {
        try {
            if (this.isHodVisible && this.workflowForm.get('department').value) {
                if (this.isGrantCoSelection) {
                    this.onWorkflowRoleChange();
                } else {
                    this.getHodList();
                }
            } else if (this.workflowForm.get('department').value) {
                if (this.isGrantCoSelection) {
                    this.onWorkflowRoleChange();
                }
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To get HOD List
     */
    getHodList() {
        try {
            const deptOffice = this.departmentList.filter(deptObj => {
                return deptObj.departmentId === this.workflowForm.get('department').value;
            })[0];
            if (deptOffice) {
                const param = {
                    'id': deptOffice.officeId
                };
                this.commonWorkflowService.getHodList(param, this.isUniqueListReqForBudget).subscribe((data) => {
                    if (data && data['status'] === 200 && data['result']) {
                        if (data['result'].length > 0) {
                            this.popErrorMessage('hod');
                            this.hodList = data['result'];
                            const hod = this.hodList.filter(hodObj => {
                                return hodObj.hodId === this.parentOffice.hodId;
                            });
                            if (hod && hod.length > 0) {
                                if (this.parentOffice.hodId && this.isHodVisible && !this.isWorkflowRoleVisible) {
                                    this.workflowForm.get('hod').setValue(this.parentOffice.hodId);
                                }
                                if (this.parentOffice && this.parentOffice.officeId && this.isUniqueListReqForBudget) {
                                    this.workflowForm.get('hod').setValue(this.parentOffice.officeId);
                                    // change for sce patch hod issue
                                }
                            }
                            if (data['result'].length === 1 && this.isHodVisible && !this.isWorkflowRoleVisible) {
                                this.workflowForm.get('hod').setValue(data['result'][0]['officeId']);
                            }
                            if (this.isCoVisible && this.workflowForm.get('hod').value) {
                                this.getCoList();
                            }
                        } else {
                            this.hodList = [];
                            if (!this.isWorkflowRoleVisible) {
                                this.pushErrorMessage(this.errorMessages.WF_HOD_LIST_EMPTY, 'hod');
                            }
                            this.toastr.error(this.errorMessages.WF_HOD_LIST_EMPTY);
                        }
                    } else {
                        this.hodList = [];
                        if (!this.isWorkflowRoleVisible) {
                            this.pushErrorMessage(data['message'], 'hod');
                        }
                        this.toastr.error(data['message']);
                    }
                }, (err) => {
                    this.hodList = [];
                    if (!this.isWorkflowRoleVisible) {
                        this.pushErrorMessage(err, 'hod');
                    }
                    this.toastr.error(err);
                });
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description on HOD selection change
     */
    onHodChange() {
        try {
            if (this.isGrantCoSelection) {
                this.userList = [];
                this.userResponse = [];
                if (this.selectedAction.isToUserSelReq === 1 || this.selectedAction.isToUserSelReq === -1) {
                    this.isUserVisible = true;
                    if (!this.workflowForm.controls.hasOwnProperty('user')) {
                        this.workflowForm.addControl('user', new FormControl(Validators.required));
                    }
                    this.workflowForm.controls.user.setValue('');
                    if (this.workflowForm.get('hod').value && this.workflowForm.get('workflowRole').value) {
                        // tslint:disable-next-line:max-line-length
                        this.getGrantWorkflowUsers(this.workflowForm.get('hod').value, this.workflowForm.get('workflowRole').value);
                    }
                }
            }
            if (this.isCoVisible && this.workflowForm.get('hod').value) {
                this.coList = [];
                if (this.workflowForm.controls.hasOwnProperty('co')) {
                    this.workflowForm.get('co').setValue('');
                }
                this.getCoList();
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To get CO List
     */
    getCoList() {
        try {
            const param = {
                'id': this.workflowForm.get('hod').value
            };
            this.commonWorkflowService.getCoList(param).subscribe((data) => {
                if (data && data['status'] === 200 && data['result']) {
                    if (data['result'].length > 0) {
                        this.popErrorMessage('co');
                        this.coList = data['result'];
                        if (data['result'].length === 1 && this.isCoVisible && !this.isWorkflowRoleVisible) {
                            this.workflowForm.get('co').setValue(data['result'][0]['officeId']);
                        }
                    } else {
                        this.coList = [];
                        if (!this.isWorkflowRoleVisible) {
                            this.pushErrorMessage(this.errorMessages.WF_CO_LIST_EMPTY, 'co');
                        }
                        this.toastr.error(this.errorMessages.WF_CO_LIST_EMPTY);
                    }
                } else {
                    this.coList = [];
                    if (!this.isWorkflowRoleVisible) {
                        this.pushErrorMessage(data['message'], 'co');
                    }
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.coList = [];
                if (!this.isWorkflowRoleVisible) {
                    this.pushErrorMessage(err, 'co');
                }
                this.toastr.error(err);
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    onCoChange() {
        try {
            if (this.isGrantCoSelection) {
                this.userList = [];
                this.userResponse = [];
                if (this.selectedAction.isToUserSelReq === 1 || this.selectedAction.isToUserSelReq === -1) {
                    this.isUserVisible = true;
                    if (!this.workflowForm.controls.hasOwnProperty('user')) {
                        this.workflowForm.addControl('user', new FormControl(Validators.required));
                    }
                    this.workflowForm.controls.user.setValue('');
                    if (this.workflowForm.get('co').value && this.workflowForm.get('workflowRole').value) {
                        // tslint:disable-next-line:max-line-length
                        this.getGrantWorkflowUsers(this.workflowForm.get('co').value, this.workflowForm.get('workflowRole').value);
                    }
                }
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description To push the specific error message (if not exist) in error message list
     * @param val error message
     */
    pushErrorMessage(val, type) {
        const hasMessage = this.apiErrorMessageList.filter(obj => {
            return obj['key'] === type;
        });
        if (hasMessage.length === 0) {
            this.apiErrorMessageList.push({ 'key': type, 'message': val });
        }
    }

    /**
     * @description To pop the specific error message from error message list
     * @param val error message
     */
    popErrorMessage(type) {
        const messageList = this.apiErrorMessageList.filter(obj => {
            return obj['key'] !== type;
        });
        this.apiErrorMessageList = _.cloneDeep(messageList);
    }

    gotoListing() {
        this.router.navigate(['']);
    }

    uploadAttachment() {
        this.tabDisable = false;
        this.selectedIndex = 2;
    }

    /**
     * @description to close the dialog box
     */
    closeDialog(): void {
        this.dialogRef.close('no');
    }

    /**
     * @description To check file operation is pending in attachment tab.
     */
    checkFileUploadPending() {
        try {
            if (!this.data.isAttachmentTab) {
                return false;
            }
            return this.dataSourceBrowse.data.find(data => {
                if (data && !data.documentId && data.file) {
                    return true;
                }
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @description Submit the work flow.
     */
    submitWorkflow() {
        try {
            const result = this.checkFileUploadPending();
            if (!result) {
                if (this.workflowForm.invalid) {
                    _.each(this.workflowForm.controls, function (control) {
                        if (control.status === 'INVALID') {
                            control.markAsTouched({ onlySelf: true });
                        }
                    });
                }
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    width: '360px',
                    data: this.errorMessages.SUBMIT_CONF_MSG
                });
                dialogRef.afterClosed().subscribe(res => {
                    if (res === 'yes') {
                        if (this.workflowForm.valid && !this.isSubmitted && this.apiErrorMessageList.length === 0) {
                            this.isSubmitted = true;
                            let selectedUser;
                            if (!this.selectedAction || (this.selectedAction && this.selectedAction.length === 0)) {
                                this.isSubmitted = false;
                                return;
                            }
                            if (this.userResponse) {
                                selectedUser = this.userResponse.filter(userObj => {
                                    return userObj.userId === this.workflowForm.get('user').value;
                                })[0];
                            }
                            const params = {
                                'wfDetails': []
                            };
                            if (!this.isOnlyDummyEntry) {
                                params.wfDetails.push({
                                    'actionConfigId': this.selectedAction.actionConfigId,
                                    'assignedBy': {
                                        'officeId': this.officeId,
                                        'postId': this.postId,
                                        'pouId': this.lkPoOffUserId,
                                        'userId': this.userId,
                                        'wfRoleId': this.selectedAction.fromWfRoleId
                                    },
                                    'assignedTo': {
                                        'officeId': selectedUser && selectedUser.officeId ?
                                            selectedUser.officeId : null,
                                        'postId': selectedUser && selectedUser.postId ? selectedUser.postId : null,
                                        'pouId': selectedUser && selectedUser.pouId ? selectedUser.pouId : null,
                                        'userId': selectedUser && selectedUser.userId ? selectedUser.userId : null,
                                        'wfRoleId': selectedUser && selectedUser.wfRoleId ? selectedUser.wfRoleId : null
                                    },
                                    'remarks': this.workflowForm.get('remarks').value,
                                    'trnId': this.data.trnId
                                });
                                if (this.data.branchId) {
                                    params['wfDetails'][0]['assignedBy']['branchId'] = this.data.branchId;
                                }
                                if (selectedUser && selectedUser.level != null && selectedUser.level !== undefined) {
                                    params['wfDetails'][0]['assignedTo']['level'] = selectedUser.level;
                                }
                                if (this.isOfficeVisible) {
                                    // tslint:disable-next-line:max-line-length
                                    params['wfDetails'][0]['assignedTo']['officeId'] = this.workflowForm.get('office').value;
                                    if (!this.isUserVisible) {
                                        // tslint:disable-next-line:max-line-length
                                        params['wfDetails'][0]['assignedTo']['wfRoleId'] = this.selectedAction.toWfRoleId;
                                    }
                                } else if (this.isCoVisible) {
                                    // tslint:disable-next-line:max-line-length
                                    params['wfDetails'][0]['assignedTo']['officeId'] = this.workflowForm.get('co').value;
                                    if (!this.isUserVisible) {
                                        // tslint:disable-next-line:max-line-length
                                        params['wfDetails'][0]['assignedTo']['wfRoleId'] = this.selectedAction.toWfRoleId;
                                    }
                                } else if (this.isHodVisible) {
                                    // tslint:disable-next-line:max-line-length
                                    params['wfDetails'][0]['assignedTo']['officeId'] = this.workflowForm.get('hod').value;
                                    if (!this.isUserVisible) {
                                        // tslint:disable-next-line:max-line-length
                                        params['wfDetails'][0]['assignedTo']['wfRoleId'] = this.selectedAction.toWfRoleId;
                                    }
                                } else if (this.isChildOffice || this.isParentOfficeSameBranch || this.isParentOffice) {
                                    params['wfDetails'][0]['assignedTo']['officeId'] = (this.officeList
                                        && this.officeList.length > 0) ? this.officeList[0].officeId : null;
                                    if (!this.isUserVisible) {
                                        // tslint:disable-next-line:max-line-length
                                        params['wfDetails'][0]['assignedTo']['wfRoleId'] = this.selectedAction.toWfRoleId;
                                    }
                                } else if (this.isSameOfficeSameBranch) {   // added by shailesh
                                    params['wfDetails'][0]['assignedTo']['officeId'] = this.officeId;
                                    if (!this.isUserVisible) {
                                        // tslint:disable-next-line:max-line-length
                                        params['wfDetails'][0]['assignedTo']['wfRoleId'] = this.selectedAction.toWfRoleId;
                                    }
                                } else if (this.selectedAction.toIsFd === 1 &&
                                    this.selectedAction.locationValue === DataConstant.FDOFFICE) { // added by shailesh
                                    if (this.officeList && this.officeList.length > 0) {
                                        params['wfDetails'][0]['assignedTo']['officeId'] = this.officeList[0].officeId;
                                    }
                                    params['wfDetails'][0]['assignedTo']['wfRoleId'] = this.selectedAction.toWfRoleId;
                                }
                                if (this.fdGroupData && this.fdGroupData['groupId']) {
                                    if (this.officeList && this.officeList.length > 0) {
                                        params['wfDetails'][0]['assignedTo']['officeId'] = this.officeList[0].officeId;
                                    }
                                    params['wfDetails'][0]['assignedTo']['groupId'] = this.fdGroupData.groupId;
                                    params['wfDetails'][0]['assignedTo']['wfRoleId'] = this.selectedAction.toWfRoleId;
                                }
                                if (this.isWorkflowRoleVisible) {
                                    if (this.workflowForm.get('workflowRole').value) {
                                        // tslint:disable-next-line:max-line-length
                                        params['wfDetails'][0]['assignedTo']['wfRoleId'] = this.workflowForm.get('workflowRole').value;
                                    }
                                    if (this.isCoVisible && this.workflowForm.get('co').value) {
                                        // tslint:disable-next-line:max-line-length
                                        params['wfDetails'][0]['assignedTo']['officeId'] = this.workflowForm.get('co').value;
                                    } else if (this.isHodVisible && this.workflowForm.get('hod').value) {
                                        // tslint:disable-next-line:max-line-length
                                        params['wfDetails'][0]['assignedTo']['officeId'] = this.workflowForm.get('hod').value;
                                    } else if (this.isDepartmentVisible && this.workflowForm.get('department').value) {
                                        const dept = this.departmentList.filter(deptObj => {
                                            // tslint:disable-next-line:max-line-length
                                            return deptObj['departmentId'] === this.workflowForm.get('department').value;
                                        })[0];
                                        if (dept && dept['officeId']) {
                                            params['wfDetails'][0]['assignedTo']['officeId'] = dept['officeId'];
                                        }
                                    }
                                }
                                if (this.selectedAction.isToBranchSelReq === 1 ||
                                    this.selectedAction.isToBranchSelReq === -1) {
                                    // tslint:disable-next-line:max-line-length
                                    params['wfDetails'][0]['assignedTo']['branchId'] = this.workflowForm.get('branch').value;
                                } else if (!this.isBranchVisible
                                    && this.branchList && this.branchList.length > 0) {
                                    params['wfDetails'][0]['assignedTo']['branchId'] = this.branchList[0]['branchId'];
                                } else if (this.isChildOffice && this.isUserVisible) {
                                    // tslint:disable-next-line:max-line-length
                                    params['wfDetails'][0]['assignedTo']['branchId'] = selectedUser && selectedUser.branchId ? selectedUser.branchId : null;
                                }

                                if (this.selectedAction.wfActionCode === DataConstant.CANCEL_ACTION_CODE
                                    || this.selectedAction.wfActionCode === DataConstant.REJECT_ACTION_CODE) {
                                    // tslint:disable-next-line:max-line-length
                                    params['wfDetails'][0]['assignedTo'] = _.cloneDeep(params['wfDetails'][0]['assignedBy']);
                                }
                            }

                            if (this.userSelTwoObj) {
                                params.wfDetails.push({
                                    'actionConfigId': this.userSelTwoObj.actionConfigId,
                                    'assignedBy': {
                                        'officeId': this.officeId,
                                        'postId': this.postId,
                                        'pouId': this.lkPoOffUserId,
                                        'userId': this.userId,
                                        'wfRoleId': this.userSelTwoObj.fromWfRoleId
                                    },
                                    'assignedTo': {
                                        'officeId': this.officeId,
                                        'postId': this.postId,
                                        'pouId': this.lkPoOffUserId,
                                        'userId': this.userId,
                                        'wfRoleId': this.userSelTwoObj.fromWfRoleId
                                    },
                                    'remarks': this.workflowForm.get('remarks').value,
                                    'trnId': this.data.trnId
                                });
                                if (this.data.branchId) {
                                    // tslint:disable-next-line:max-line-length
                                    params['wfDetails'][params.wfDetails.length - 1]['assignedBy']['branchId'] = this.data.branchId;
                                    // tslint:disable-next-line:max-line-length
                                    params['wfDetails'][params.wfDetails.length - 1]['assignedTo']['branchId'] = this.data.branchId;
                                }
                                if (this.dummyBranchList && this.dummyBranchList.length > 0) {
                                    // tslint:disable-next-line:max-line-length
                                    params['wfDetails'][params.wfDetails.length - 1]['assignedTo']['branchId'] = this.dummyBranchList[0]['branchId'];
                                }
                            }

                            this.commonWorkflowService.submitWorkFlow(params).subscribe((data) => {
                                if (data && data['status'] === 200) {
                                    this.toastr.success(data['message']);
                                    const info = {
                                        'commonModelStatus': true,
                                        data // API response information
                                    };
                                    if (this.data.menuModuleName === ModuleNames.CONTRACT) {
                                        info['level'] = data['result'][0]['level'];
                                    }
                                    this.dialogRef.close(info);
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
            } else {
                this.toastr.error(this.errorMessages.WF_ATTACHMENT_PENDING_MSG);
                this.selectedIndex = 1;
            }
        } catch (err) {
            this.toastr.error(err);
        }
    }

    nextPage() {
        this.page += 1;
        if (this.page > this.totalPages) {
            this.page = this.totalPages;
        }
    }

    previousPage() {
        this.page -= 1;
        if (this.page < 1) {
            this.page = 1;
        }
    }

    afterLoadComplete(pdfData: any) {
        this.totalPages = pdfData.numPages;
    }
    checkDisplayFile(data, event) {
        this.viewUploadedAttachment(data, event);
    }

    /**
     * @description Validate File on file selection
     * @param fileSelected selected file
     */
    onFileSelection(fileSelected: any) {
        let valid = true;
        const fileExtension = fileSelected.target.files[0].name.split('.').pop().toLowerCase();
        const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
        const fileSupportedExtension = this.dataSourceBrowse.data[this.fileBrowseIndex].format;
        const extensionArray = fileSupportedExtension.split(',');
        if (fileSelected.target.files[0].size > this.dataSourceBrowse.data[this.fileBrowseIndex].fileSize * 1024) {
            valid = false;
            const sizeInMB = this.dataSourceBrowse.data[this.fileBrowseIndex].fileSize / 1024;
            this.toastr.error('File Size Exceed Limit of ' + sizeInMB + 'MB.');
        } else if (extensionArray.indexOf(fileExtension) < 0) {
            valid = false;
            this.toastr.error(`File extension is not supported. Supported extensions are ${extensionArray}`);
        }
        if (valid) {
            this.totalAttachmentSize += fileSizeInKb;
            this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
            this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileName = fileSelected.target.files[0].name;
            this.dataSourceBrowse.data[this.fileBrowseIndex].fileExtension = fileExtension.toLowerCase();
            this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileSize = fileSizeInKb;
        }
        this.attachment.nativeElement.value = '';
    }

    openFileSelector(index: number) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }

    getSelectedFileTypeData(id?) {
        if (id) {
            return this.attachmentTypeList.find(ele => ele.id === id);
        } else {
            return this.attachmentTypeList[0] ? this.attachmentTypeList[0] : {};
        }
    }
    onBrowseSelectChange() { }
    /**
     * @description Add row for adding attachment
     */
    addNewFileRow() {

        if (this.dataSourceBrowse && this.dataSourceBrowse.data.length > 0) {
            const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
            const getCurrentFileTypeInfo = this.getSelectedFileTypeData();
            if (data && data.attachmentTypeId && data.fileName && data.uploadedFileName) {
                const p_data = this.dataSourceBrowse.data;
                p_data.push({
                    attachmentId: 0,
                    attachmentTypeId: getCurrentFileTypeInfo.id,
                    attachmentTypeName: getCurrentFileTypeInfo.name,
                    file: '',
                    fileName: '',
                    uploadDirectoryPath: getCurrentFileTypeInfo.uploadDirectoryPath,
                    uploadedFileName: '',
                    fileSize: getCurrentFileTypeInfo.fileSize,
                    format: getCurrentFileTypeInfo.format,
                    menuId: getCurrentFileTypeInfo.menuId,
                    attCtegryId: getCurrentFileTypeInfo.attCtegryId,
                });

                this.dataSourceBrowse.data = p_data;
            } else {
                this.toastr.error('Please fill the detail.');
            }
        } else {
            const getCurrentFileTypeInfo = this.getSelectedFileTypeData();
            const tableData = [{
                attachmentId: 0,
                attachmentTypeId: getCurrentFileTypeInfo.id,
                attachmentTypeName: getCurrentFileTypeInfo.name,
                file: '',
                fileName: '',
                uploadDirectoryPath: getCurrentFileTypeInfo.uploadDirectoryPath,
                uploadedFileName: '',
                fileSize: getCurrentFileTypeInfo.fileSize,
                format: getCurrentFileTypeInfo.format,
                menuId: getCurrentFileTypeInfo.menuId,
                attCtegryId: getCurrentFileTypeInfo.attCtegryId,
            }];
            this.dataSourceBrowse = new MatTableDataSource(tableData);
        }
    }

    /**
     * @description This method remove the attached file from data table.
     * @param item Array from which index is to be found
     * @param index key based on which index is to be found
     */
    removeUploadUserFile(item, index) {
        this.dataSourceBrowse.data.forEach((data, indexTable) => {
            if (indexTable === index) {
                data['file'] = null;
                data['uploadedFileName'] = '';
                data['fileExtension'] = '';
                data['uploadedFileSize'] = 0;
            }
        });
    }

    /**
     * @description Method to find array index
     * @param itemArray Array from which index is to be found
     * @param keyName key based on which index is to be found
     * @param selectedValue selected value based on which index is to be found
     * @returns array object
     */
    deleteUploadedAttachment(item, index) {

        if (item && item.uploadedFileName && item.uploadedDate && item.attachmentId) {
            const param = {
                'attachmentId': item.attachmentId,
                'menuId': this.linkMenuId
            };
            this.commonWorkflowService.attachmentDelete(param).subscribe((res) => {
                if (res && res['status'] === 200 && res['result'] === true) {
                    this.toastr.success(res['message']);
                    this.dataSourceBrowse.data.splice(index, 1);
                    this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
                    this.getUploadedAttachmentData();
                }
            },
                (err) => {
                    this.toastr.error(err);
                });
        } else {
            this.toastr.error('Please upload the file first, they it can be removed.');
        }
    }

    /**
     * @description Method to find array index
     * @param itemArray Array from which index is to be found
     * @param keyName key based on which index is to be found
     * @param selectedValue selected value based on which index is to be found
     * @returns array object
     */
    findArrayIndex(itemArray, keyName, selectedValue) {
        const selectedIndex = itemArray.findIndex(x => x[keyName] === selectedValue);
        return itemArray[selectedIndex];
    }

    /**
     * @description Method to get attachment types.
     * @returns array object
     */
    getAttachmentList() {
        const param = {
            'categoryName': 'WORKFLOW',
            'menuId': this.linkMenuId,
        };
        this.commonWorkflowService.getAttachmentList(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result'] && (res['result'].length > 0)) {
                console.log('### attachmentTypeList ###' + JSON.stringify(res['result']));
                this.attachmentTypeList = res['result'].filter(data => {
                    data.id = data['attTypeId'].id;
                    data.name = data['attTypeId'].name;
                    data.isMandatory = data['attTypeId'].isMandatory;
                    data.category = data['attTypeId'].category;
                    return data;
                });
                // this.attachmentTypeList.push(this.attachmentTypeList[0])
                this.getUploadedAttachmentData();
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
      * @description Method to get user uploaded attachments.
      * @returns array object
      */
    getUploadedAttachmentData() {
        try {
            const param = {
                'categoryName': DataConstant.CATEGORY_NAME,
                'menuId': this.linkMenuId,
                'trnId': this.data.trnId,
                'lkPOUId': this.lkPoOffUserId
            };
            this.commonWorkflowService.getUploadedAttachmentList(param).subscribe((res) => {
                if (res && res['status'] === 200 && res['result']) {
                    const resultObject = _.cloneDeep(res['result']);
                    if (resultObject.length === 0) {
                        this.addNewFileRow();
                    } else {
                        let extension;
                        resultObject.filter(data => {
                            extension = data.uploadedFileName ? data.uploadedFileName.split('.').pop() : '';
                            if (viewableExtension.indexOf(extension) !== -1) {
                                data.isView = true;
                            }
                            return data;
                        });
                        this.dataSourceBrowse.data = _.cloneDeep(resultObject);
                        if (resultObject.length === DataConstant.MAX_ATTACHMENT) {
                            this.isUploadDisable = true;
                        } else {
                            this.isUploadDisable = false;
                        }
                    }
                }
            },
                (err) => {
                    this.toastr.error(err);
                });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
    * @description Set the data on selection of file
    * @param object item
    * @param number index
    */
    onAttachmentTypeChange(item, index) {
        try {
            const getCurrentFileTypeInfo = this.getSelectedFileTypeData(item.attachmentId);
            this.dataSourceBrowse.data.forEach((data, indexTable) => {
                if (indexTable === index) {
                    data['fileName'] = '';
                    data['uploadDirectoryPath'] = getCurrentFileTypeInfo.uploadDirectoryPath;
                    data['fileSize'] = getCurrentFileTypeInfo.fileSize;
                    data['format'] = getCurrentFileTypeInfo.format;
                    data['menuId'] = getCurrentFileTypeInfo.menuId;
                    data['attCtegryId'] = getCurrentFileTypeInfo.attCtegryId;
                    data['file'] = null;
                    data['uploadedFileName'] = '';
                    data['fileExtension'] = '';
                    data['uploadedFileSize'] = 0;
                }
            });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description Check if it is mandatory to upload a file
     * @returns boolean flag
     */
    checkForMandatory() {
        let flag = true;
        this.dataSourceBrowse.data.forEach(obj => {
            if (obj.isMandatory === 'YES') {
                if (obj.id === 0) {
                    flag = false;
                }
            }
        });
        if (!flag) {
            this.toastr.error('Please attach mandatory documents and Upload the same!');
        }
        return flag;
    }


    /**
     * @description Save/Upload Attachment Details
     * @returns void
     */
    saveAttachmentTab() {
        let valid = true;
        const formData = new FormData();
        const filesArray = this.dataSourceBrowse.data.filter(item => item.attachmentId === 0 && item.file);
        if (filesArray.length === 0) {
            this.toastr.error('Please add atleast one record !');
            valid = false;
        } else {
            filesArray.forEach((element) => {
                if (!((element.file && element.file !== '') && (element.fileName && element.fileName !== '')
                    && element.attachmentTypeId)) {
                    valid = false;
                }
            });
            if (!valid) {
                this.toastr.error('Please fill the detail.');
            }
        }

        if (valid) {
            filesArray.forEach((element, index) => {
                const categoryInfo = this.attachmentTypeList.filter(ele => ele.id === element.attachmentTypeId)[0];
                formData.append('attachmentCommonDtoList[' + index + '].eventId', '');
                formData.append('attachmentCommonDtoList[' + index + '].uploadedFileSize', element.uploadedFileSize);
                formData.append('attachmentCommonDtoList[' + index + '].userName', 'tet');
                formData.append('attachmentCommonDtoList[' + index + '].attachmentTypeId', element.attachmentTypeId);
                formData.append('attachmentCommonDtoList[' + index + '].categoryId', categoryInfo.category);
                formData.append('attachmentCommonDtoList[' + index + '].fileName', element.fileName);
                formData.append('attachmentCommonDtoList[' + index + '].fileSize', element.fileSize);
                formData.append('attachmentCommonDtoList[' + index + '].format', element.fileExtension);
                formData.append('attachmentCommonDtoList[' + index + '].lkPOUId', this.lkPoOffUserId);
                formData.append('attachmentCommonDtoList[' + index + '].menuId', this.linkMenuId);
                formData.append('attachmentCommonDtoList[' + index + '].trnId', this.data.trnId);
                formData.append('attachmentCommonDtoList[' + index + '].userId', this.userId);
                formData.append('attachmentCommonDtoList[' + index + '].uploadDirectoryPath',
                    element.uploadDirectoryPath);
                formData.append('attachmentCommonDtoList[' + index + '].attachment', element.file, element.file.name);
                formData.append('attachmentCommonDtoList[' + index + '].uploadedFileName', element.uploadedFileName);
            });
            this.commonWorkflowService.attachmentUpload(formData).subscribe((res) => {
                if (res && res['status'] === 200) {
                    this.toastr.success('File Uploaded Successfully.');
                    this.getUploadedAttachmentData();
                } else {
                    this.toastr.error(res['message']);
                }
            },
                (err) => {
                    this.toastr.error(err);
                });
        }
    }

    /**
     * @description View Attachment
     * @param attachment  attachment
     */
    viewUploadedAttachment(attachment: any, event, isPreview = false) {
        try {
            const param = {
                'documentDataKey': attachment.documentId,
                'fileName': attachment.uploadedFileName
            };
            this.commonWorkflowService.viewAttachment(param).subscribe((res: any) => {
                if (res) {
                    const resultObj = res['result'];
                    const imgNameArray = attachment.uploadedFileName.split('.');
                    const imgType = imgNameArray[imgNameArray.length - 1];
                    let docType;
                    let isPdf = false;
                    if (imgType.toLowerCase() === 'pdf') {
                        docType = 'application/pdf';
                        isPdf = true;
                    } else if (imgType.toLowerCase() === 'png') {
                        docType = 'image/png';
                    } else if (imgType.toLowerCase() === 'jpg') {
                        docType = 'image/jpg';
                    } else if (imgType.toLowerCase() === 'jpeg') {
                        docType = 'image/jpeg';
                    }
                    if (isPreview === true) {
                        this.selectedFilePreviewImageBase64 = '';
                        this.selectedFilePreviewPdf = '';
                        const blobData = resultObj['fileSrc'] as string;
                        if (isPdf) {
                            this.selectedFilePreviewPdf = 'data:' + docType + ';base64,' + blobData;
                        } else {
                            this.selectedFilePreviewImageBase64 = 'data:' + docType + ';base64,' + blobData;
                        }
                        this.showWorkFlowAction = false;
                        event.stopPropagation();
                    } else {
                        const byteArray = new Uint8Array(atob(resultObj['fileSrc']).split('').map(
                            char => char.charCodeAt(0)));
                        const blob = new Blob([byteArray], { type: docType });
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(blob, res['result']['fileName']);
                        } else {
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, '_blank');
                        }
                    }

                }
            }, (err) => {
                this.toastr.error(err);
            });
        } catch (error) {
            this.toastr.error(error);
            console.log('@@@@@Error @@@' + error);
        }
    }

    onError(error: any) {
        console.log(`#### Error #### ${error}`);
    }
    /**
     * @description Download Attachment
     * @param params attachment details
     */
    downLoadUploadedAttachment(params) {
        try {
            const ID = {
                'documentDataKey': params.documentId,
                'fileName': params.uploadedFileName
            };
            this.commonWorkflowService.downloadAttachment(ID).subscribe((res) => {
                const url = window.URL.createObjectURL(res);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', '' + params.uploadedFileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            },
                (err) => {
                    this.toastr.error(err);
                });
        } catch (error) {
            this.toastr.error(error);
        }
    }

    setEnglishOnFocusOut() {
        SetEnglish();
    }

    toggleLanguage() {
        this.isLangChange = true;
        const elements = this.elem.nativeElement.querySelectorAll('.hasfocus')[0];
        if (elements !== undefined) {
            if (this.currentLang.value === 'Guj') {
                SetEnglish();
                this.currentLang.next('Eng');
            } else {
                SetGujarati();
                this.currentLang.next('Guj');
            }
            elements.focus();
        }
    }
    changeViewToWorkFlowAction() {
        this.showWorkFlowAction = true;
    }

    /**
     * @description To patch the remarks to remarks field
     * @param remarksValue remarks
     */
    setRemarksOnBlur(remarksValue) {
        this.workflowForm.patchValue({
            remarks: remarksValue
        });
    }

}
