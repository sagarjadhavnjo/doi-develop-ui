import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { StorageService } from './../../../../../shared/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { RightsMappingService } from './../services/right-mapping.service';
import { Component, ViewChild, ElementRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { EmployeeDetails, UserRightsMap, EmployeeName, RightsMappingAttachment } from '../model/right-mapping';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ERROR_MESSAGES } from '../';
import { environment } from 'src/environments/environment';
import { RIGHT_MAPPING } from '../index';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { UserRightViewDialogComponent } from '../user-right-view-dialog/user-right-view-dialog.component';
import { element } from 'protractor';
import { HeaderJson, WorkflowPopupData } from '../../../common/model/common-workflow';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { CommonWorkflowComponent } from '../../../common/common-workflow/common-workflow.component';
import { map } from 'rxjs/operators';
import { ViewCommonWorkflowHistoryComponent } from '../../../common/view-common-workflow-history/view-common-workflow-history.component';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';
export interface EmpList {
    empId: number;
    empNo: string;
}
export class FileNode {
    id: number;
    name: string;
    submodule?: FileNode[];
}

@Component({
    selector: 'app-right-mapping',
    templateUrl: './right-mapping.component.html',
    styleUrls: ['./right-mapping.component.css']
})
export class RightMappingComponent implements OnInit {
    userMappingForm: FormGroup;
    fileBrowseIndex: number;
    transactionNo: number;
    officeId: number;
    postId: number = 0;
    selectedIndex: number = 0;
    selectedPostOfficeUserId: number;
    offId: number;
    empNo: number;
    empId: number;
    moduleID: number;
    modOfficeTypeId: number;
    cardexNo: number;
    ddoNo: number;
    districtId: number;
    district: number;
    totalAttachmentSize: number;
    noOfAttachment: number;
    transactionDate: Date;
    userName: string;
    officeDivision: string;
    districtName: string;
    empName: string;
    ddoOffice: string;
    postName: string;
    selectedModuleName: string;
    moduleName: string;
    action: string;
    currentEditIndex: string;
    userType: string;
    isWorkFlow: string = 'no';
    officeDistrictId: number;

    isAddEdit: boolean = true;
    permissioncheckbox: boolean = false;
    tabDisable: boolean = true;
    isSearch: boolean = false;
    isTransApproved: boolean = false;
    isDATUser: boolean = false;
    isSameUser: boolean = false;
    showSubActivity: boolean = false;
    showSubActivityMappedToUser: boolean = false;
    permissionOn: boolean = false;
    isHodUser: boolean = false;
    showModuleSelection = false;
    showEditDelete = true;
    disableApprovedLink = false;
    submitted: boolean = false;
    checkedWorkFlow: boolean = false;
    checkedRights: boolean = false;
    isWorkFLowAndRightsEnable: boolean = false;
    isOfficeDetailSearch: boolean = false;

    addRights;
    oldRightsList = [];
    wfRights;
    oldWorkFlowList = [];
    userInfo;
    userOffice;
    subModuleId;
    moduleId;
    showPerColor;
    showwfColor;
    menuId;
    wfRoleId;
    transactionId;
    subscribeParams: Subscription;
    selectedPostIndex;
    menuOfficeTypeId;
    approvedUserRightList;
    workFlowId;
    rightToBeEdit: boolean = false;
    addedRightsDto;
    removedRightsDto;
    addedOrRemovedRights: string[] = [];
    removedRights: string[] = [];
    isRemoved;
    selectedPerviousMenuWorflow = [];

    displayedColumnsFooter: string[] = ['position'];
    userPostList: EmployeeDetails[];
    defaultUserPostList: EmployeeDetails[];
    empData = [];
    // User approved rights
    userRightMapped: MatTableDataSource<UserRightsMap>;
    defaultUserRightMapped: UserRightsMap[];
    defaultWorkflowRights = [];
    approvedUserRightMapped: UserRightsMap[];
    approvedUserRightMappedByMenu: UserRightsMap[];
    freshUserRightMapped: UserRightsMap[];

    employeeListColumns: string[] = [
        'position',
        'empNo',
        'empName',
        'postName',
        'postType',
        'userRights',
        'userRights1'
    ];
    employeeListCommonColumns: string[] = ['empNo', 'empName', 'postName', 'postType'];
    // Rights to be Given table Columns
    rightsMapColumn: string[] = [
        'position',
        'moduleList',
        'subModule',
        'manuCounter',
        'permission',
        'branch',
        'workFLow',
        'action'
    ];
    // Rights to be Remove table
    displayedRoleMapremoveColumn: string[] = [
        'position',
        'moduleName',
        'subModuleName',
        'menuName',
        'rolePrmName',
        'workFlow',
        'action'
    ];
    defaultTransactionUserRights: UserRightsMap[] = [];
    userRightsGiven: MatTableDataSource<UserRightsMap>;
    userRightMapRemove: MatTableDataSource<UserRightsMap>;
    selectedMenuUserRights: UserRightsMap[] = [];
    selectedWorkflowRights: UserRightsMap[] = [];
    subActivity: string[] = [];
    menu: any[] = [];
    allSubMapped: any[] = [];
    postNameList: any[] = [];
    moduleNameList: any[] = [];
    activitiesList: any[] = [];
    moduleList: any[] = [];
    subModuleList: any[] = [];
    menuList: any[] = [];
    employee: any[] = [];
    post: any[] = [];
    workflowList = [];
    districtNameList: [] = [];
    ddoOfficeList: [] = [];
    officeListData: any[] = [];
    empList: EmployeeName[] = [];
    permissionList = [];

    districtCtrl: FormControl = new FormControl();
    userSearchCtrl: FormControl = new FormControl();
    userSearch: FormControl = new FormControl();
    formControl: FormControl = new FormControl();
    attachmentData: RightsMappingAttachment[] = [];
    dataSourceAttachment = new MatTableDataSource(this.attachmentData);

    workFlowInfo = {
        isCheckWorkFlow: false,
        objection: {
            required: false,
            status: false
        },
        isWfStatusDraft: true,
        wfInRequest: false
    };
    errorMessages = null;
    @ViewChild('rightMappingAttachment', { static: true }) rightMappingAttachment: ElementRef;
    displayedBrowseColumns = [
        'sr_no',
        'attachmentType',
        'fileName',
        'browse',
        'uploadedFileName',
        'uploadedBy',
        'action'
    ];
    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;

    enableCancelBtn = true;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private el: ElementRef,
        public dialog: MatDialog,
        private rightMappingService: RightsMappingService,
        private httpClient: HttpClient,
        private toastr: ToastrService,
        private storageService: StorageService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.errorMessages = msgConst;
        this.noOfAttachment = 0;
        this.totalAttachmentSize = 0;
        this.userName = this.storageService.get('userName');
        this.userInfo = this.storageService.get('currentUser');
        this.userOffice = this.storageService.get('userOffice');
        this.districtId = this.userOffice.districtId;
        this.officeDivision = this.userOffice['officeDivision'];
        this.officeId = this.userOffice['officeId'];
        const primaryPost = this.userInfo['post'].filter(item => item['primaryPost'] === true);
        if (primaryPost && primaryPost[0]) {
            this.postId = primaryPost[0]['postId'];
        }
        this.createUserMappingForm();
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            this.workFlowInfo.isWfStatusDraft = resRoute.isWfStatusDraft === 'false' ? false : true;

            // if (this.officeDivision && this.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
            //     if (this.action === 'edit' || this.action === 'view') {
            //         this.loadDistrictDetails();
            //     } else {
            //         this.loadDistrictDetails();
            //     }
            // }
            this.loadDistrictDetails();
            if (!this.officeDivision) {
                this.disableAllFormFields();
                this.userMappingForm.patchValue({
                    district: this.userOffice.districtName,
                    ddoNo: this.userOffice.ddoNo,
                    cardexNo: this.userOffice.cardexno,
                    ddoOffice: this.userOffice.officeName
                });
                this.getEmpByOffId(this.officeId);
                this.loadModuleListNonDat(this.officeId);
            }
            if (this.action === 'edit' || this.action === 'view') {
                this.disableAllFormFields();

                this.transactionNo = resRoute.trnNo;
                // this.transactionDate = resRoute.trnDate;

                this.disableApprovedLink = true;
                this.showEditDelete = false;

                this.transactionId = +resRoute.id;
                this.districtName = resRoute.districtName;
                this.getEditViewData(this.transactionId);

                if (resRoute.status === 'Saved as Draft' && this.action === 'view') {
                    this.showModuleSelection = true;
                    this.showEditDelete = false;
                    this.getEditViewData(this.transactionId);
                } else if (resRoute.status === 'Saved as Draft' && this.action === 'edit') {
                    this.showModuleSelection = true;
                    this.showEditDelete = true;
                    this.getEditViewData(this.transactionId);
                } else if (this.action === 'edit') {
                    this.showEditDelete = true;
                }
            } else {
                this.router.navigate(['../new'], { relativeTo: this.activatedRoute, skipLocationChange: true });
            }
        });
    }

    getEditViewData(transactionId) {
        const self = this;
        this.isSearch = true;
        // this.selectedMenuUserRights = [];
        // this.approvedUserRightList = [];
        self.rightMappingService.getEditViewApprovedRight(transactionId).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    self.officeId = res['result'].postView.officeId;
                    self.selectedPostOfficeUserId = res['result'].postView.postOfficeUserId;
                    self.empId = res['result']['empId'];
                    self.getEmpByOffId(self.officeId);
                    self.loadModuleListNonDat(self.officeId);
                    self.ddoNo = res['result'].ddoNo;
                    self.cardexNo = res['result'].cardexNo;
                    self.ddoOffice = res['result'].ddoOffice;
                    self.empNo = res['result'].empNo;
                    self.empName = res['result'].empName;
                    self.defaultTransactionUserRights = _.cloneDeep(res['result']);
                    const editRightsObj = res['result'];
                    self.getApprovedUserMappedRightsNonDat(editRightsObj);
                    self.userPostList = [];
                    this.transactionDate = res['result']['trnDate'];
                    self.userSearch.setValue(Number(res['result'].empNo));
                    self.userPostList.push(res['result'].postView);
                    self.userRightsGiven = new MatTableDataSource(res['result'].addedRightsDto);
                    self.userRightMapRemove = new MatTableDataSource(res['result'].removedRightsDto);
                    self.officeId = res['result'].postView.officeId;

                    this.workFlowInfo.objection.required = res['result'].objectionRequired;
                    this.workFlowInfo.objection.status = res['result'].objectionRemarks ? true : false;
                    this.workFlowInfo.wfInRequest = res['result'].wfInRequest;

                    if (self.officeDivision && self.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
                        self.userMappingForm.patchValue({
                            ddoNo: self.ddoNo,
                            cardexNo: self.cardexNo,
                            district: res['result']['district'],
                            ddoOffice: self.ddoOffice,
                            empNo: self.empNo,
                            empName: self.empName,
                            userSearch: self.empNo,
                            objStatus: this.workFlowInfo.objection.status,
                            objRemark: res['result'].objectionRemarks
                        });
                        this.isOfficeDetailSearch = true;
                        this.officeDistrictId = res['result']['district'];
                    } else {
                        self.userMappingForm.patchValue({
                            ddoNo: self.ddoNo,
                            cardexNo: self.cardexNo,
                            district: self.districtName,
                            ddoOffice: self.ddoOffice,
                            empNo: self.empNo,
                            empName: self.empName,
                            userSearch: self.empNo,
                            objStatus: this.workFlowInfo.objection.status,
                            objRemark: res['result'].objectionRemarks
                        });
                    }
                    /* disabled form on edit mode */
                    if (self.action === 'edit' || self.action === 'view') {
                        this.disableAllFormFields();
                        self.userSearch.disable();
                    }
                    if (this.action === 'view') {
                        self.submitted = true;
                        self.isAddEdit = true;
                        self.isWorkFLowAndRightsEnable = true;
                    } else {
                        self.isWorkFLowAndRightsEnable = false;
                    }
                }
            },
            err => {
                self.toastr.error(err);
            }
        );
    }

    getDdoOfficeValue() {
        return this.userMappingForm.controls.ddoOffice.value;
    }

    assignSavedransactionRights() {
        const self = this,
            defaultTransactionUserRights = _.cloneDeep(self.defaultTransactionUserRights),
            addedRightsDto = defaultTransactionUserRights.addedRightsDto,
            removedRightsDto = defaultTransactionUserRights.removedRightsDto,
            permissionsList = _.cloneDeep(this.approvedUserRightList);
        this.selectedPerviousMenuWorflow = _.cloneDeep(this.selectedMenuUserRights);
        self.selectedMenuUserRights = [];
        let menuToSave;
        let workFlowDetails;
        if (self.approvedUserRightList.length > 0) {
            workFlowDetails = this.approvedUserRightList.filter(resp => resp.menuId === this.menuId);
            if (workFlowDetails.length === 0) {
                self.isWorkFlow = 'no';
            } else if (workFlowDetails[0].wfRoleList && workFlowDetails[0].wfRoleList.length > 0) {
                self.isWorkFlow = 'yes';
            } else {
                self.isWorkFlow = 'no';
            }
        } else {
            self.isWorkFlow = 'no';
        }
        if (addedRightsDto && addedRightsDto.length > 0) {
            for (let i = 0; i < addedRightsDto.length; i++) {
                const addedMenuRightsDto = addedRightsDto[i];
                const approvedMenuRightsDto = permissionsList.filter(menu => menu.menuId === addedMenuRightsDto.menuId);
                menuToSave = {
                    menuId: addedMenuRightsDto.menuId,
                    oldRightsList: [],
                    rightsList: _.cloneDeep(addedMenuRightsDto.addedOrRemovedRights),
                    oldWfRoleList: [],
                    wfRoleList: _.cloneDeep(addedMenuRightsDto.wfRoleList)
                };
                if (approvedMenuRightsDto && approvedMenuRightsDto.length > 0) {
                    if (
                        approvedMenuRightsDto[0].rolePrmList &&
                        approvedMenuRightsDto[0].rolePrmList.rolePrm &&
                        approvedMenuRightsDto[0].rolePrmList.rolePrm.length > 0
                    ) {
                        menuToSave.oldRightsList = _.cloneDeep(approvedMenuRightsDto[0].rolePrmList.rolePrm);
                    }
                    if (approvedMenuRightsDto[0].wfRoleList) {
                        menuToSave.oldWfRoleList = _.cloneDeep(approvedMenuRightsDto[0].wfRoleList);
                    }
                    if (removedRightsDto && removedRightsDto.length > 0) {
                        const menuRemo = removedRightsDto.filter(menu => menu.menuId === addedMenuRightsDto.menuId);
                        if (!menuRemo || menuRemo.length === 0) {
                            menuToSave.rightsList = menuToSave.rightsList.concat(menuToSave.oldRightsList);
                            menuToSave.wfRoleList = menuToSave.wfRoleList.concat(menuToSave.oldWfRoleList);
                        }
                    } else {
                        menuToSave.rightsList = menuToSave.rightsList.concat(menuToSave.oldRightsList);
                        menuToSave.wfRoleList = menuToSave.wfRoleList.concat(menuToSave.oldWfRoleList);
                    }
                }
                this.selectedMenuUserRights.push(menuToSave);
            }
        }
        if (removedRightsDto && removedRightsDto.length > 0) {
            for (let i = 0; i < removedRightsDto.length; i++) {
                const removedMenuRightsDto = removedRightsDto[i];
                const approvedMenuRightsDto = permissionsList.filter(
                    menu => menu.menuId === removedMenuRightsDto.menuId
                );
                menuToSave = this.selectedMenuUserRights.filter(menu => menu.menuId === removedMenuRightsDto.menuId);
                if (!menuToSave || menuToSave.length === 0) {
                    menuToSave = {
                        menuId: removedMenuRightsDto.menuId,
                        oldRightsList: [],
                        rightsList: [],
                        oldWfRoleList: [],
                        wfRoleList: []
                    };
                    if (approvedMenuRightsDto && approvedMenuRightsDto.length > 0) {
                        if (
                            approvedMenuRightsDto[0].rolePrmList &&
                            approvedMenuRightsDto[0].rolePrmList.rolePrm &&
                            approvedMenuRightsDto[0].rolePrmList.rolePrm.length > 0
                        ) {
                            menuToSave.oldRightsList = _.cloneDeep(approvedMenuRightsDto[0].rolePrmList.rolePrm);
                        }
                        if (approvedMenuRightsDto[0].wfRoleList) {
                            menuToSave.oldWfRoleList = _.cloneDeep(approvedMenuRightsDto[0].wfRoleList);
                        }
                    }
                    this.selectedMenuUserRights.push(menuToSave);
                } else {
                    menuToSave = menuToSave[0];
                }
                if (menuToSave.oldRightsList && menuToSave.oldRightsList.length > 0) {
                    for (let j = 0; j < menuToSave.oldRightsList.length; j++) {
                        const oldMenu = menuToSave.oldRightsList[j];
                        if (!removedMenuRightsDto.addedOrRemovedRights.includes(oldMenu)) {
                            menuToSave.rightsList.push(oldMenu);
                        }
                    }
                }
                if (menuToSave.oldWfRoleList && menuToSave.oldWfRoleList.length > 0) {
                    for (let j = 0; j < menuToSave.oldWfRoleList.length; j++) {
                        const oldWf = menuToSave.oldWfRoleList[j],
                            oldWfRemo = removedMenuRightsDto.wfRoleList.filter(wf => wf.id === oldWf.id);
                        if (!oldWfRemo || oldWfRemo.length === 0) {
                            menuToSave.wfRoleList.push(oldWf);
                        }
                    }
                }
            }
        }
    }

    loadDistrictDetails() {
        const self = this;
        const userOffice = self.storageService.get('userOffice');
        self.officeDivision = userOffice['officeDivision'];
        if (self.officeDivision && self.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
            self.rightMappingService.getOfficeDetailByDistrict().subscribe(
                res => {
                    if (res && res['result'] && res['status'] === 200) {
                        const districtData = res['result'];
                        if (districtData) {
                            self.isDATUser = true;
                            const distData = _.orderBy(res['result'], 'name', 'asc');
                            self.districtNameList = distData;
                            self.officeData();
                            self.getAttachmentMasterData();
                        } else {
                            self.toastr.error(res['message']);
                        }
                    } else {
                        self.toastr.error(res['message']);
                    }
                },
                err => {
                    self.toastr.error(err);
                }
            );
        } else {
            self.getAttachmentMasterData();
            self.userMappingForm.patchValue({
                district: userOffice.districtName,
                ddoNo: userOffice.ddoNo,
                cardexNo: userOffice.cardexno,
                officeName: userOffice.officeName
            });
            self.officeId = userOffice.officeId;
            self.isDATUser = false;
        }
    }
    assignSelectedPostIndex(isShowPopUp = true) {
        const self = this;
        self.userPostList.forEach((userPost, i) => {
            // Made changes for type casting.
            if (+userPost.postOfficeUserId === +self.defaultTransactionUserRights[0].postOfficeUserId) {
                self.selectedPostIndex = i;
            }
        });
    }

    officeData() {
        const district = this.userMappingForm.controls.district.value;
        this.officeDistrictId = district;
        if (district) {
            this.isOfficeDetailSearch = true;
            const officeList = this.districtNameList.filter(data => {
                return data['id'] === district;
            })[0];
            if (officeList) {
                this.officeListData = _.cloneDeep(officeList['officeList']);
                this.onChangeNumber();
            }
        } else {
            this.isOfficeDetailSearch = false;
            this.empList = [];
            this.moduleList = [];
            this.officeListData = [];
            if (this.isDATUser) {
                this.userMappingForm.patchValue({
                    ddoNo: null,
                    cardexNo: null,
                    ddoOffice: null,
                    userSearch: null
                });
            }
            this.userSearch.setValue(null);
            this.resetAllSelection();
        }

        if (this.action === 'new' && this.officeDivision !== null) {
            this.userMappingForm.controls.ddoNo.setValue('');
            this.userMappingForm.controls.cardexNo.setValue('');
            this.userMappingForm.controls.ddoOffice.setValue('');
        }
    }
    onChangeNumber() {
        const self = this;
        const ddoNo = self.userMappingForm.controls.ddoNo.value;
        const cardexNo = self.userMappingForm.controls.cardexNo.value;
        if (ddoNo && cardexNo) {
            self.empList = [];
            self.userMappingForm.controls.ddoOffice.setValue('');
            let isMatch = 0;
            self.officeListData.forEach(officeObj => {
                if (ddoNo === officeObj['ddoNo'] && cardexNo.toString() === officeObj['cardexNo'].toString()) {
                    self.userMappingForm.patchValue({
                        ddoOffice: officeObj['name']
                    });
                    self.isDATUser = true;
                    isMatch = 1;
                    self.officeId = officeObj['id'];
                    this.isOfficeDetailSearch = true;
                    self.getEmpByOffId(self.officeId);
                    self.loadModuleListNonDat(self.officeId);
                }
            });
            if (!isMatch) {
                self.toastr.error('Office name is In Active or not found');
                self.resetAllSelection();
            }
        }
    }
    createUserMappingForm() {
        this.userMappingForm = this.fb.group({
            district: ['', Validators.required],
            ddoNo: ['', Validators.required],
            cardexNo: ['', Validators.required],
            ddoOffice: [''],
            userSearchID: [''],
            objStatus: [''],
            objRemark: ['']
        });
        if (this.workFlowInfo.objection) {
            this.objectionRemarks();
        }
    }

    objectionRemarks() {
        if (this.workFlowInfo.objection.status) {
            this.userMappingForm.controls.objRemark.setValidators(Validators.required);
            this.userMappingForm.controls.objRemark.updateValueAndValidity();
        } else {
            this.userMappingForm.controls.objRemark.reset();
            this.userMappingForm.controls.objRemark.clearValidators();
            this.userMappingForm.controls.objRemark.updateValueAndValidity();
        }
    }

    searchUser(value) {
        const self = this;
        if (self.userSearch.value) {
            this.isSearch = true;
            this.resetAllSelection();
            this.rightMappingService
                .getUserPostList({
                    empId: self.userSearch.value,
                    officeId: this.officeId
                })
                .subscribe(
                    res => {
                        if (res['status'] === 200) {
                            self.userPostList = res['result'];
                            self.defaultUserPostList = _.cloneDeep(res['result']);
                            if (self.transactionId) {
                                self.assignSelectedPostIndex();
                            }
                        } else {
                            self.toastr.error(res['message']);
                            self.userPostList = [];
                        }
                    },
                    err => {
                        self.toastr.error(err);
                    }
                );
        } else {
            this.isSearch = false;
            this.resetAllSelection();
        }
    }
    resetAllSelection() {
        this.showModuleSelection = false;
        this.userPostList = [];
        this.defaultUserPostList = [];
    }
    // tslint:disable-next-line: no-shadowed-variable
    onEmployeeNumberClick(index, element, isShowPopUp = true) {
        this.getApprovedUserMappedRightsNonDat(element);
        this.resetAll();
        if (!this.transactionId) {
            //  this.userPostList = [];
            this.selectedPostIndex = index;
            //  this.userPostList.push(this.defaultUserPostList[index]);
            this.getUserRightMap(isShowPopUp, index);
        }
        if (this.transactionId && (!this.defaultUserRightMapped || this.defaultUserRightMapped.length === 0)) {
            this.getUserRightMap(isShowPopUp);
        }
    }
    getUserRightMap(isShowPopUp = true, index = null) {
        const self = this;
        this.rightMappingService
            .getUserMappedRights({
                id: this.userPostList[self.selectedPostIndex].postOfficeUserId
            })
            .subscribe(
                res => {
                    if (
                        res['status'] === 200 &&
                        res['result'] === 'Saved as Draft' &&
                        this.action !== 'edit' &&
                        isShowPopUp
                    ) {
                        if (res['result']['isSamePost']) {
                            this.isSameUser = res['result']['isSamePost'];
                        }
                        // tslint:disable-next-line: no-use-before-declare
                        const dialogRef = this.dialog.open(AlreadyExistsDialogComponent, {
                            disableClose: true,
                            height: '150px',
                            width: '600px',
                            data: {
                                message: res['message'],
                                isSameUser: this.isSameUser
                            }
                        });
                        dialogRef.afterClosed().subscribe(result => {
                            if (result === 'no') {
                                self.resetAllSelection();
                                self.userSearch.patchValue('');
                            } else if (result === 'yes') {
                                self.router.navigate(['dashboard/edp/rights-mapping/list'], {
                                    skipLocationChange: true
                                });
                            }
                        });
                    } else if (res['status'] === 200) {
                        this.showModuleSelection = true;
                        if (index !== null) {
                            this.userPostList = [];
                            this.userPostList.push(this.defaultUserPostList[index]);
                        }
                    } else {
                        self.defaultUserRightMapped = [];
                        self.defaultWorkflowRights = [];
                        self.approvedUserRightMapped = res['result'];
                        if (res && res['status'] === 10001) {
                            this.showModuleSelection = false;
                            this.loadAlreadyExistsPopupSameUser(res);
                        } else if (res && res['status'] === 10002) {
                            this.showModuleSelection = false;
                            this.loadAlreadyExistsPopup(res);
                        } else {
                            this.toastr.error(res['message']);
                        }
                    }
                    if (self.defaultUserRightMapped && self.defaultUserRightMapped.length > 0) {
                        // tslint:disable-next-line: no-shadowed-variable
                        self.defaultUserRightMapped.forEach(element => {
                            if (element['statusName'] === 'Approved') {
                                self.isTransApproved = true;
                            }
                        });
                    }
                },
                err => {
                    self.toastr.error(err);
                }
            );
    }
    loadAlreadyExistsPopupSameUser(res) {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(UserRightConfirmDialogComponent, {
            disableClose: true,
            height: '270px',
            width: '600px',
            data: {
                message: res['message']
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard/edp/rights-mapping/list'], { skipLocationChange: true });
            }
            if (result === 'no') {
                this.showModuleSelection = false;
            }
        });
    }
    loadAlreadyExistsPopup(res) {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(AlreadyExistsDialogComponent, {
            disableClose: true,
            height: '270px',
            width: '600px',
            data: {
                message: res['message']
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'no') {
                this.showModuleSelection = false;
            }
        });
    }
    loadModuleListNonDat(officeId) {
        const self = this;
        const param = {
            officeId: officeId
        };
        self.rightMappingService.loadModuleListNonDat(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    self.moduleList = res['result'];
                    // this.modOfficeTypeId = res['result'][0].modOfficeTypeId;
                } else {
                    self.moduleList = [];
                    self.toastr.error(res['message']);
                }
            },
            err => {
                self.toastr.error(err);
            }
        );
    }
    loadSubModuleListByModuleId(item) {
        const self = this;
        self.moduleID = item.moduleId;
        self.subModuleId = null;
        self.menuId = null;
        self.subModuleList = [];
        self.menuList = [];
        self.permissionList = [];
        self.workflowList = [];
        self.menuOfficeTypeId = null;
        self.modOfficeTypeId = item.modOfficeTypeId;
        const param = {
            lkModOffTypeId: item.modOfficeTypeId
        };
        this.rightMappingService.loadSubModuleListByModuleIdNonDat(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    self.subModuleList = res['result']['submoduleList'];
                    this.enableCancelBtn = true;
                } else {
                    self.subModuleList = [];
                    self.toastr.error(res['message']);
                }
            },
            err => {
                self.toastr.error(err);
            }
        );
    }

    loadMenuListBySubModuleId(item) {
        const self = this;
        self.menuId = null;
        self.menuList = [];
        self.permissionList = [];
        self.workflowList = [];
        self.subModuleId = item.subModuleId;
        const param = {
            lkModOffTypeId: self.modOfficeTypeId,
            subModuleId: item.subModuleId
        };
        this.rightMappingService.loadMenuListBySubModuleIdNonDat(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    self.menuList = res['result'];
                    self.isWorkFlow = 'no';
                } else {
                    self.menuList = [];
                    self.toastr.error(res['message']);
                }
            },
            err => {
                self.toastr.error(err);
            }
        );
    }
    getApprovedUserMappedRightsNonDat(elementData) {
        const self = this;
        if (this.action === 'new') {
            this.empId = elementData.empId;
            if (elementData.postOfficeUserId !== undefined) {
                this.selectedPostOfficeUserId = elementData.postOfficeUserId;
            } else {
                self.selectedPostOfficeUserId = elementData.postView.postOfficeUserId;
            }
        }
        const param = {
            id: this.selectedPostOfficeUserId
        };
        this.rightMappingService.getApprovedUserMappedRightsNonDat(param).subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    self.approvedUserRightList = res['result'];
                    if (self.approvedUserRightList && self.approvedUserRightList.length > 0) {
                        self.approvedUserRightList.forEach(roleObj => {
                            self.defaultUserRightMapped = _.cloneDeep(roleObj['rolePrmList']);
                            self.defaultWorkflowRights = _.cloneDeep(roleObj['wfRoleList']);
                        });
                    }

                    this.assignSavedransactionRights();
                } else {
                    self.defaultUserRightMapped = [];
                    self.approvedUserRightList = [];
                    self.toastr.error(res['message']);
                }
            },
            err => {
                self.toastr.error(err);
            }
        );
    }
    getPermissonList(item) {
        const self = this;
        self.menuId = item.menuId;
        self.menuOfficeTypeId = item.menuOfficeTypeId;
        self.getWorkFlowList(); // to get default workflow for this menu

        self.rightMappingService.getPermissionsByMenu({ id: item.menuId }).subscribe(
            res => {
                if (res['status'] === 200) {
                    self.permissionList = res['result'];
                    // self.isWorkFlow = 'no';
                    // self.assignSelectedMenuRights();
                } else {
                    self.toastr.error(res['message']);
                }
            },
            err => {
                self.toastr.error(err);
            }
        );
    }
    isAssignedWorkFlowNonDat(flowPrm) {
        const self = this;
        let checked = false,
            permissionDetails;
        if (self.approvedUserRightList && self.approvedUserRightList.length > 0) {
            permissionDetails = this.approvedUserRightList.filter(resp => resp.menuId === this.menuId);
        }
        let menuToSave;
        if (this.selectedMenuUserRights && this.selectedMenuUserRights.length > 0) {
            menuToSave = this.selectedMenuUserRights.filter(menu => menu.menuId === this.menuId);
        }
        if (menuToSave && menuToSave.length > 0) {
            if (menuToSave[0].wfRoleList && menuToSave[0].wfRoleList.length > 0) {
                const wfIndex = this.getWfIndexFromWfRoleList(menuToSave, flowPrm);
                checked = this.updateCheckedFlagByWfIndex(wfIndex, checked);
            } else {
                checked = false;
            }
        } else {
            if (permissionDetails && permissionDetails.length > 0) {
                let wfIndex;
                if (permissionDetails[0].wfRoleList && permissionDetails[0].wfRoleList.length > 0) {
                    wfIndex = this.getWfIndexFromPermissionWfRoleList(permissionDetails, flowPrm);
                    checked = this.updateCheckedFlagByWfIndex(wfIndex, checked);
                } else {
                    checked = false;
                }
            }
        }
        return checked;
    }

    getWfIndexFromWfRoleList(menuToSave, fp) {
        let wfIndex = null;
        menuToSave[0].wfRoleList.forEach((wfr, i) => {
            if (Number(wfr.id) === Number(fp.wfRoleId)) {
                wfIndex = i;
            }
        });

        return wfIndex;
    }

    getWfIndexFromPermissionWfRoleList(permissionDetails, flp) {
        let wfIdx = null;
        permissionDetails[0].wfRoleList.forEach((wf, idx) => {
            if (Number(wf.id) === Number(flp.wfRoleId)) {
                wfIdx = idx;
            }
        });
        return wfIdx;
    }

    updateCheckedFlagByWfIndex(wfIndex, checked) {
        if (wfIndex) {
            checked = true;
        } else if (wfIndex === 0) {
            checked = true;
        } else {
            checked = false;
        }
        return checked;
    }

    checkWorkFlowNonDatColor(flowPrm) {
        const self = this;
        let permissionDetails;
        if (self.approvedUserRightList && self.approvedUserRightList.length > 0) {
            permissionDetails = self.approvedUserRightList.filter(resp => resp.menuId === self.menuId);
            if (permissionDetails && permissionDetails.length > 0) {
                let menuToSave;
                if (this.selectedMenuUserRights && this.selectedMenuUserRights.length > 0) {
                    menuToSave = this.selectedMenuUserRights.filter(menu => menu.menuId === this.menuId);
                }
                if (menuToSave && menuToSave.length > 0) {
                    if (menuToSave[0].oldWfRoleList && menuToSave[0].oldWfRoleList.length > 0) {
                        let wfOldIndex;
                        menuToSave[0].oldWfRoleList.forEach((wf, index) => {
                            if (Number(wf.id) === Number(flowPrm.wfRoleId)) {
                                wfOldIndex = index;
                            }
                        });
                        if (wfOldIndex || wfOldIndex === 0) {
                            let wfIndex;
                            if (menuToSave[0].wfRoleList && menuToSave[0].wfRoleList.length > 0) {
                                wfIndex = this.getWfIndexFromWfRoleList(menuToSave, flowPrm);
                                return this.getUpdatedColorFlagByWfIndex(wfIndex);
                            } else {
                                return 'red';
                            }
                        } else {
                            return '';
                        }
                    } else {
                        return '';
                    }
                } else {
                    if (permissionDetails[0].wfRoleList && permissionDetails[0].wfRoleList.length > 0) {
                        let wfIndex;
                        wfIndex = this.getWfIndexFromPermissionWfRoleList(permissionDetails, flowPrm);
                        if (wfIndex) {
                            return 'green';
                        } else if (wfIndex === 0) {
                            return 'green';
                        } else {
                            return '';
                        }
                    } else {
                        return '';
                    }
                }
            }
        }
        return '';
    }

    getUpdatedColorFlagByWfIndex(wfIndex) {
        if (wfIndex) {
            return 'green';
        } else if (wfIndex === 0) {
            return 'green';
        } else {
            return 'red';
        }
    }

    assignRemoveMenuWorkFlow(event, flowPrm) {
        const self = this;
        let workFlowDetails;
        // If already have Workflow assigned
        if (self.approvedUserRightList.length > 0) {
            workFlowDetails = this.approvedUserRightList.filter(resp => resp.menuId === this.menuId);
        }
        let menuToSave;
        // If already have Workflow selected or not
        if (this.selectedMenuUserRights && this.selectedMenuUserRights.length > 0) {
            menuToSave = this.selectedMenuUserRights.filter(menu => menu.menuId === this.menuId);
        }
        if (menuToSave && menuToSave.length > 0) {
            // If already have Workflow selected
            if (menuToSave[0].wfRoleList) {
                if (event.checked) {
                    menuToSave[0].wfRoleList.push({
                        id: Number(flowPrm.wfRoleId),
                        name: flowPrm.wfName
                    });
                } else {
                    const wfIndex = this.getWfIndexFromWfRoleList(menuToSave, flowPrm);
                    if (wfIndex) {
                        menuToSave[0].wfRoleList.splice(wfIndex, 1);
                    }
                    if (wfIndex === 0) {
                        menuToSave[0].wfRoleList.splice(wfIndex, 1);
                    }
                }
            } else {
                // If not Workflow selected
                menuToSave[0].oldWfRoleList = [];
                menuToSave[0].wfRoleList = [];
                if (workFlowDetails && workFlowDetails.length > 0) {
                    menuToSave[0].oldWfRoleList = _.cloneDeep(workFlowDetails[0].wfRoleList);
                    menuToSave[0].wfRoleList = _.cloneDeep(workFlowDetails[0].wfRoleList);
                }
                if (event.checked) {
                    menuToSave[0].wfRoleList.push({
                        id: Number(flowPrm.wfRoleId),
                        name: flowPrm.wfName
                    });
                } else {
                    const wfIndex = this.getWfIndexFromWfRoleList(menuToSave, flowPrm);
                    if (wfIndex) {
                        menuToSave[0].wfRoleList.splice(wfIndex, 1);
                    }
                    if (wfIndex === 0) {
                        menuToSave[0].wfRoleList.splice(wfIndex, 1);
                    }
                }
            }
        } else {
            // If not menu assigned
            menuToSave = {
                menuId: this.menuId,
                oldWfRoleList: [],
                wfRoleList: []
            };
            if (workFlowDetails && workFlowDetails.length > 0) {
                if (
                    workFlowDetails[0].rolePrmList &&
                    workFlowDetails[0].rolePrmList !== null &&
                    workFlowDetails[0].rolePrmList.rolePrm
                ) {
                    menuToSave.oldRightsList = _.cloneDeep(workFlowDetails[0].rolePrmList.rolePrm);
                    menuToSave.rightsList = _.cloneDeep(workFlowDetails[0].rolePrmList.rolePrm);
                } else {
                    menuToSave.oldRightsList = [];
                    menuToSave.rightsList = [];
                }
                if (
                    workFlowDetails[0].wfRoleList &&
                    workFlowDetails[0].wfRoleList !== null &&
                    workFlowDetails[0].wfRoleList.length > 0
                ) {
                    menuToSave.oldWfRoleList = _.cloneDeep(workFlowDetails[0].wfRoleList);
                    menuToSave.wfRoleList = _.cloneDeep(workFlowDetails[0].wfRoleList);
                }
            } else {
                menuToSave.oldRightsList = [];
                menuToSave.rightsList = [];
            }
            if (event.checked) {
                menuToSave.wfRoleList.push({
                    id: Number(flowPrm.wfRoleId),
                    name: flowPrm.wfName
                });
            } else {
                let wfIndex;
                menuToSave.wfRoleList.forEach((wf, index) => {
                    if (Number(wf.id) === Number(flowPrm.wfRoleId)) {
                        wfIndex = index;
                    }
                });
                if (wfIndex) {
                    menuToSave.wfRoleList.splice(wfIndex, 1);
                }
                if (wfIndex === 0) {
                    menuToSave.wfRoleList.splice(wfIndex, 1);
                }
            }
            this.selectedMenuUserRights.push(menuToSave);
        }
        this.isSaveAsDraftEnable();
    }
    isAssignedPermissionNonDat(rolePrm) {
        const self = this;
        let checked = false,
            permissionDetails;
        if (self.approvedUserRightList && self.approvedUserRightList.length > 0) {
            permissionDetails = this.approvedUserRightList.filter(resp => resp.menuId === this.menuId);
        }
        let menuToSave;
        if (this.selectedMenuUserRights && this.selectedMenuUserRights.length > 0) {
            menuToSave = this.selectedMenuUserRights.filter(menu => menu.menuId === this.menuId);
        }
        if (menuToSave && menuToSave.length > 0) {
            if (menuToSave[0].rightsList) {
                if (menuToSave[0].rightsList.includes(rolePrm.roleName)) {
                    checked = true;
                } else {
                    checked = false;
                }
            } else {
                checked = false;
            }
        } else {
            if (
                permissionDetails &&
                permissionDetails.length > 0 &&
                permissionDetails[0].rolePrmList &&
                permissionDetails[0].rolePrmList !== null
            ) {
                if (permissionDetails[0].rolePrmList.rolePrm) {
                    if (permissionDetails[0].rolePrmList.rolePrm.includes(rolePrm.roleName)) {
                        checked = true;
                    } else {
                        checked = false;
                    }
                } else {
                    checked = false;
                }
            } else {
                checked = false;
            }
        }
        return checked;
    }
    checkPermissionNonDatColor(rolePrm) {
        const self = this;
        let permissionDetails;
        if (self.approvedUserRightList && self.approvedUserRightList.length > 0) {
            permissionDetails = this.approvedUserRightList.filter(resp => resp.menuId === this.menuId);
            if (permissionDetails && permissionDetails.length > 0) {
                let menuToSave;
                if (this.selectedMenuUserRights && this.selectedMenuUserRights.length > 0) {
                    menuToSave = this.selectedMenuUserRights.filter(menu => menu.menuId === this.menuId);
                }
                if (menuToSave && menuToSave.length > 0) {
                    if (menuToSave[0].oldRightsList) {
                        if (menuToSave[0].oldRightsList.includes(rolePrm.roleName)) {
                            if (menuToSave[0].rightsList.includes(rolePrm.roleName)) {
                                return 'green';
                            } else {
                                return 'red';
                            }
                        } else {
                            return '';
                        }
                    } else {
                        return '';
                    }
                } else {
                    if (
                        permissionDetails &&
                        permissionDetails.length > 0 &&
                        permissionDetails[0].rolePrmList &&
                        permissionDetails[0].rolePrmList !== null
                    ) {
                        if (permissionDetails[0].rolePrmList.rolePrm) {
                            if (permissionDetails[0].rolePrmList.rolePrm.includes(rolePrm.roleName)) {
                                return 'green';
                            } else {
                                return '';
                            }
                        } else {
                            return '';
                        }
                    } else {
                        return '';
                    }
                }
            }
            return '';
        }
        return '';
    }
    assignRemoveMenuRights(event, rolePrm) {
        const self = this;
        let permissionDetails;
        if (self.approvedUserRightList.length > 0) {
            permissionDetails = this.approvedUserRightList.filter(resp => resp.menuId === this.menuId);
        }
        let menuToSave;
        if (this.selectedMenuUserRights && this.selectedMenuUserRights.length > 0) {
            menuToSave = this.selectedMenuUserRights.filter(menu => menu.menuId === this.menuId);
        }
        if (menuToSave && menuToSave.length > 0) {
            if (menuToSave[0].rightsList) {
                if (event.checked) {
                    menuToSave[0].rightsList.push(_.cloneDeep(rolePrm.roleName));
                } else {
                    if (menuToSave[0].rightsList.includes(rolePrm.roleName)) {
                        menuToSave[0].rightsList.splice(menuToSave[0].rightsList.indexOf(rolePrm.roleName), 1);
                    }
                }
            } else {
                menuToSave[0].oldRightsList = [];
                menuToSave[0].rightsList = [];
                if (
                    permissionDetails &&
                    permissionDetails.length > 0 &&
                    permissionDetails[0].rolePrmList &&
                    permissionDetails[0].rolePrmList.rolePrm
                ) {
                    menuToSave[0].oldRightsList = _.cloneDeep(permissionDetails[0].rolePrmList.rolePrm);
                    menuToSave[0].rightsList = _.cloneDeep(permissionDetails[0].rolePrmList.rolePrm);
                }
                if (event.checked) {
                    menuToSave[0].rightsList.push(_.cloneDeep(rolePrm.roleName));
                } else {
                    if (menuToSave[0].rightsList.includes(rolePrm.roleName)) {
                        menuToSave[0].rightsList.splice(menuToSave[0].rightsList.indexOf(rolePrm.roleName), 1);
                    }
                }
            }
        } else {
            menuToSave = {
                menuId: this.menuId,
                oldRightsList: [],
                rightsList: []
            };
            if (permissionDetails && permissionDetails.length > 0) {
                if (
                    permissionDetails[0].rolePrmList &&
                    permissionDetails[0].rolePrmList !== null &&
                    permissionDetails[0].rolePrmList.rolePrm
                ) {
                    menuToSave.oldRightsList = _.cloneDeep(permissionDetails[0].rolePrmList.rolePrm);
                    menuToSave.rightsList = _.cloneDeep(permissionDetails[0].rolePrmList.rolePrm);
                }
                if (
                    permissionDetails[0].wfRoleList &&
                    permissionDetails[0].wfRoleList !== null &&
                    permissionDetails[0].wfRoleList.length > 0
                ) {
                    menuToSave.oldWfRoleList = _.cloneDeep(permissionDetails[0].wfRoleList);
                    menuToSave.wfRoleList = _.cloneDeep(permissionDetails[0].wfRoleList);
                } else {
                    menuToSave.oldWfRoleList = [];
                    menuToSave.wfRoleList = [];
                }
            } else {
                menuToSave.oldWfRoleList = [];
                menuToSave.wfRoleList = [];
            }
            if (event.checked) {
                menuToSave.rightsList.push(_.cloneDeep(rolePrm.roleName));
            } else {
                if (menuToSave.rightsList.includes(rolePrm.roleName)) {
                    menuToSave.rightsList.splice(menuToSave.rightsList.indexOf(rolePrm.roleName), 1);
                }
            }
            this.selectedMenuUserRights.push(menuToSave);
        }
        this.isSaveAsDraftEnable();
    }
    isSaveAsDraftEnable() {
        if (this.selectedMenuUserRights && this.selectedMenuUserRights.length > 0) {
            const indexArr = [];
            this.selectedMenuUserRights.forEach((elementObj, index) => {
                if (
                    elementObj['oldRightsList'] &&
                    elementObj['oldRightsList'].length === 0 &&
                    elementObj['rightsList'] &&
                    elementObj['rightsList'].length === 0 &&
                    elementObj['oldWfRoleList'] &&
                    elementObj['oldWfRoleList'].length === 0 &&
                    elementObj['wfRoleList'] &&
                    elementObj['wfRoleList'].length === 0
                ) {
                    indexArr.push(index);
                }
            });
            if (indexArr.length > 0) {
                for (let i = 0; i < indexArr.length; i++) {
                    this.selectedMenuUserRights.splice(indexArr[i] - i, 1);
                }
            }
        }
    }

    getWorkFlowList() {
        const self = this;
        const param = {
            id: this.menuOfficeTypeId
        };
        this.rightMappingService.getWorkflowListNonDat(param).subscribe(
            res => {
                if (res['status'] === 200) {
                    self.workflowList = res['result'];
                    if (self.workflowList.length === 0) {
                        self.isWorkFlow = 'no';
                    } else {
                        let workFlowDetails;
                        if (self.approvedUserRightList !== null && self.approvedUserRightList !== undefined) {
                            workFlowDetails = this.approvedUserRightList.filter(resp => resp.menuId === this.menuId);
                            if (workFlowDetails.length === 0) {
                                self.isWorkFlow = 'no';
                            } else if (workFlowDetails[0].wfRoleList && workFlowDetails[0].wfRoleList.length > 0) {
                                self.isWorkFlow = 'yes';
                            } else {
                                self.isWorkFlow = 'no';
                            }
                        } else {
                            self.isWorkFlow = 'no';
                        }
                    }
                    // if (self.menuId) {
                    //     this.assignSelectedWfRights();
                    // }
                } else {
                    self.toastr.error(res['message']);
                }
            },
            err => {
                self.toastr.error(err);
            }
        );
    }
    workFlowChange(event) {
        const self = this;
        self.isWorkFlow = event.value;
    }

    showFormError() {
        _.each(this.userMappingForm.controls, function(control) {
            if (control.status === 'INVALID') {
                control.markAsTouched({ onlySelf: true });
            }
        });
    }

    assignRights(btnName) {
        if (this.workFlowInfo.objection.status) {
            if (
                this.userMappingForm.controls.objRemark.errors &&
                this.userMappingForm.controls.objRemark.errors.required
            ) {
                this.showFormError();
            } else {
                this.saveSubmitByBtnName(btnName);
            }
        } else {
            this.saveSubmitByBtnName(btnName);
        }
    }

    saveSubmitByBtnName(btnName) {
        const dataToSend = this.getRightsMappingDataToSend();
        if (btnName === 'save') {
            if (dataToSend) {
                if (!this.transactionId) {
                    this.getValueForCheckWorkFlowPopup().subscribe(r => {
                        dataToSend.wfInRequest = this.workFlowInfo.isCheckWorkFlow;
                        this.saveRightsMapping(dataToSend);
                    });
                } else {
                    this.saveRightsMapping(dataToSend);
                }
            }
        } else if (btnName === 'submit') {
            if (this.workFlowInfo.objection.required) {
                this.submitRightsMapping(dataToSend);
            } else {
                if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                    if (this.workFlowInfo.isCheckWorkFlow) {
                        if (this.hasMandatoryAttachmentUploaded()) {
                            this.submitRightsMapping(dataToSend);
                        } else {
                            this.showMandatoryAttachmentError();
                        }
                    } else {
                        this.submitRightsMapping(dataToSend);
                    }
                } else {
                    if (this.hasMandatoryAttachmentUploaded()) {
                        this.submitRightsMapping(dataToSend);
                    } else {
                        this.showMandatoryAttachmentError();
                    }
                }
            }
        }
    }

    hasMandatoryAttachmentUploaded(): boolean {
        const hasAllMandatoryAttachment = this.dataSourceAttachment.data
            .filter(attachement => attachement.mandatoryFlag)
            .every(x => x.userRgMpAttrId > 0);
        return hasAllMandatoryAttachment;
    }

    showMandatoryAttachmentError() {
        this.toastr.error(this.errorMessages.RIGHTS_MAPPING.TRANSACTION.ERR_UPLOAD_ALL_ATTACH);
        return;
    }

    getRightsMappingDataToSend() {
        const dataToSend = {
            empId: this.empId,
            lkPoOffUserId: this.selectedPostOfficeUserId,
            menuId: EdpDataConst.MENU.RIGHTS_MAPPING.TRANSACTION,
            wfInRequest: this.workFlowInfo.wfInRequest
        };

        dataToSend['uiDataList'] = _.cloneDeep(this.selectedMenuUserRights);

        if (this.transactionNo && this.transactionId) {
            dataToSend['tusrRgMapId'] = this.transactionId;
            dataToSend['trnNo'] = this.transactionNo;
        }

        if (this.workFlowInfo.objection.required) {
            if (this.workFlowInfo.objection.status) {
                dataToSend['objectionRequired'] = this.userMappingForm.controls.objStatus.value;
                dataToSend['hasObjection'] = this.userMappingForm.controls.objStatus.value;
                dataToSend['objectionRemarks'] = this.userMappingForm.controls.objRemark.value;
            }
        }

        return dataToSend;
    }

    saveRightsMapping(dataToSend: any, stayOnTransactionPage = true) {
        dataToSend['formAction'] = EdpDataConst.STATUS_DRAFT;
        this.rightMappingService.saveUserData(dataToSend).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    this.enableCancelBtn = false;
                    this.toastr.success(res['message']);
                    this.transactionNo = res['result']['trnNo'];
                    this.transactionDate = res['result']['trnDate'];
                    this.transactionId = res['result']['trnId'];
                    this.empId = res['result']['empId'];
                    this.selectedPostOfficeUserId = res['result'].postView.postOfficeUserId;
                    this.defaultTransactionUserRights = _.cloneDeep(res['result']);
                    const addedRights = res['result']['addedRightsDto'];
                    const removedRights = res['result']['removedRightsDto'];
                    if (addedRights && addedRights.length > 0) {
                        this.userRightsGiven = new MatTableDataSource(addedRights);
                    } else {
                        this.userRightsGiven = new MatTableDataSource([]);
                    }

                    if (removedRights && removedRights.length > 0) {
                        this.userRightMapRemove = new MatTableDataSource(removedRights);
                    } else {
                        this.userRightMapRemove = new MatTableDataSource([]);
                    }
                    this.resetAll();
                    this.isAddEdit = false;
                    this.disableAllFormFields();
                    this.userSearch.disable();
                    if (!stayOnTransactionPage) {
                        this.router.navigate(['dashboard/edp/rights-mapping/list'], {
                            skipLocationChange: true
                        });
                    }
                } else {
                    this.isAddEdit = true;
                    this.defaultTransactionUserRights = [];
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    submitRightsMapping(dataToSend: any, showPopup = true) {
        dataToSend['formAction'] = EdpDataConst.STATUS_SUBMITTED;
        // tslint:disable-next-line: no-use-before-declare
        if (showPopup) {
            // tslint:disable-next-line: no-use-before-declare
            this.dialog
                // tslint:disable-next-line: no-use-before-declare
                .open(UserRightSubmitDialogComponent, {
                    width: '360px'
                })
                .afterClosed()
                .subscribe(result => {
                    if (result === 'yes') {
                        this.getValueForCheckWorkFlowPopup().subscribe(r => {
                            if (this.workFlowInfo.isCheckWorkFlow) {
                                this.openWorkFlow();
                            } else {
                                this.callSubmit(dataToSend);
                            }
                        });
                    }
                });
        } else {
            this.callSubmit(dataToSend);
        }
    }

    callSubmit(dataToSend) {
        this.rightMappingService.saveUserData(dataToSend).subscribe(
            res => {
                if (res['status'] === 200) {
                    this.toastr.success(res['message']);
                    this.router.navigate(['dashboard/edp/rights-mapping/list'], {
                        skipLocationChange: true
                    });
                    this.dialog.closeAll();
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    // tslint:disable-next-line: no-shadowed-variable
    showConfirmationPopup(element) {
        this.selectedPostOfficeUserId = element.postOfficeUserId;
        const self = this;
        const param = {
            id: this.selectedPostOfficeUserId
        };
        this.rightMappingService.getApprovedUserMappedRights(param).subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    self.approvedUserRightMapped = res['result'];
                } else {
                    self.defaultUserRightMapped = [];
                    self.approvedUserRightMapped = [];
                    self.toastr.error(res['message']);
                }
                // tslint:disable-next-line: no-use-before-declare
                const dialogRef = this.dialog.open(UserRightViewDialogComponent, {
                    panelClass: 'UserRightViewDialog',
                    height: '500px',
                    data: {
                        empNo: element.empNo,
                        empName: element.empName,
                        postName: element.postName,
                        userRights: _.cloneDeep(self.approvedUserRightMapped)
                    }
                });
                dialogRef.afterClosed().subscribe(result => {
                    return false;
                });
            },
            err => {
                self.toastr.error(err);
            }
        );
    }
    onEditRights(item, i) {
        const self = this;
        this.menuId = +item.menuId;
        this.currentEditIndex = i;
        this.moduleID = item.moduleId;
        this.officeId = item.officeId;
        this.subModuleId = item.subModuleId;
        this.isRemoved = item.isRemoved;
        const param = {
            menuId: item.menuId,
            moduleId: item.moduleId,
            officeId: item.officeId,
            subModuleId: item.subModuleId
        };
        this.rightMappingService.getEditModuleSubModule(param).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                item.menuOfficeTypeId = res['result']['menuOfficeTypeId'];
                item.modOfficeTypeId = res['result']['modOfficeTypeId'];
                self.modOfficeTypeId = item.modOfficeTypeId;
                if (item.subModuleId !== 0 && item.subModuleId != null && self.modOfficeTypeId !== 0) {
                    self.rightToBeEdit = true;
                    self.loadSubModuleListByModuleId(item);
                    self.loadMenuListBySubModuleId(item);
                    self.getPermissonList(item);
                } else {
                    self.moduleId = item.moduleId;
                    self.subModuleId = null;
                    self.subModuleList = [];
                }
                if (this.action === 'new') {
                    self.assignSavedransactionRights();
                }
            } else {
                item.modOfficeTypeId = 0;
            }
        });
    }

    onViewApprovedRights(item) {
        const param = {
            menuId: item.menuId,
            officeId: this.officeId,
            permId: item.prmId
        };
        if (item.wfRoleIds === null) {
            param['wfRoleIds'] = 0;
        } else {
            param['wfRoleIds'] = item.wfRoleIds.join(',');
        }
        if (item.postOfficeUserId) {
            this.selectedPostOfficeUserId = item.postOfficeUserId;
        }
        // tslint:disable-next-line:max-line-length
        this.rightMappingService.getAprvdUsrRightsByMenuOffcId(param).subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    this.approvedUserRightMappedByMenu = res['result'];
                } else if (res['status'] === 200) {
                    this.approvedUserRightMappedByMenu = res['result'];
                } else {
                    this.approvedUserRightMappedByMenu = res['result'];
                    this.toastr.error(res['message']);
                }
                // tslint:disable-next-line: no-use-before-declare
                const dialogRef = this.dialog.open(UserRightMappingDialogComponent, {
                    panelClass: 'UserRightDialog',
                    height: '500px',
                    data: {
                        user: res['result'],
                        menu: item.menu
                    }
                });

                dialogRef.afterClosed().subscribe(result => {
                    return false;
                });
            },
            err => {
                this.toastr.error(err);
            }
        );
    }
    onDeleteRights(item, index, btnName) {
        const self = this;
        const param = {
            id: item.tusrRgMapDtlId
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.DELETE
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.rightMappingService.deleteRights(param).subscribe(
                    res => {
                        if (res && res['status'] === 200) {
                            self.toastr.success(res['message']);
                            if (btnName === 'add') {
                                self.userRightsGiven.data.splice(index, 1);
                                self.userRightsGiven = new MatTableDataSource(self.userRightsGiven.data);
                                self.selectedMenuUserRights = [];
                            }
                            if (btnName === 'remove') {
                                self.userRightMapRemove.data.splice(index, 1);
                                self.userRightMapRemove = new MatTableDataSource(self.userRightMapRemove.data);
                            }
                            self.getEditViewData(self.transactionId);
                            // if (this.action === 'new') {
                            //     this.assignSavedransactionRights();
                            // }
                            self.resetAll();
                            self.isAddEdit = true;
                        } else {
                            self.toastr.error(res['message']);
                        }
                    },
                    err => {
                        self.toastr.error(err);
                    }
                );
            }
        });
    }
    resetAll() {
        const self = this;
        self.addRights = [];
        self.wfRights = [];
        self.subModuleId = null;
        self.menuId = null;
        self.moduleId = null;
        self.subModuleList = [];
        self.menuList = [];
        self.permissionList = [];
        self.workflowList = [];
        self.isWorkFlow = 'no';
    }
    oncancel() {
        this.enableCancelBtn = false;
        this.resetAll();
        if (!this.transactionId) {
            this.showModuleSelection = false;
            this.userPostList = _.cloneDeep(this.defaultUserPostList);
            this.isSearch = true;
        }
    }
    // Attachments code begins
    getEmpByOffId(officeId) {
        const self = this;
        this.rightMappingService.getEmpByOffId({ id: officeId }).subscribe(
            res => {
                if (res['status'] === 200) {
                    self.empList = res['result'];
                } else {
                    self.toastr.error(res['message']);
                    self.empList = [];
                }
            },
            err => {
                self.toastr.error(err);
            }
        );
    }
    getAttachmentMasterData() {
        const param = {
            attTypes: ['Common Attachment', 'Rights Mapping Attachment']
        };
        this.rightMappingService.getAttachmentMaster(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    const mandatoryAttach = [],
                        nonMandatoryAttach = [];
                    res['result'].forEach(fileObj => {
                        const attach = fileObj;
                        attach['fileName'] = '';
                        attach['uploadedFileName'] = '';
                        attach['uploadedBy'] = '';
                        attach['userRgMpAttrId'] = null;
                        attach['size'] = 0;
                        attach['pathUploadFile'] = '';
                        attach['rolePermId'] = null;
                        attach['file'] = null;
                        if (attach['mandatoryFlag']) {
                            mandatoryAttach.push(attach);
                        } else {
                            nonMandatoryAttach.push(attach);
                        }
                        this.noOfAttachment++;
                    });
                    this.attachmentData = mandatoryAttach;
                    this.attachmentData = this.attachmentData.concat(nonMandatoryAttach);
                    this.dataSourceAttachment.data = _.cloneDeep(this.attachmentData);
                    // if (this.action === 'edit' || this.action === 'view') {
                    this.loadAttachmentList(this.transactionId);
                    // }
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(this.errorMessages['ERR_GET_LIST']);
            }
        );
    }
    onFileSelection(fileSelected) {
        const fileType = EdpDataConst.EDP_ATTACHMENT_FILE_TYPE;
        if (fileSelected.target && fileSelected.target.files) {
            let fileAllowed: Boolean = false;
            fileType.forEach(el => {
                if (
                    fileSelected.target.files[0] &&
                    el.toLowerCase() ===
                        fileSelected.target.files[0].name
                            .split('.')
                            .pop()
                            .toLowerCase()
                ) {
                    fileAllowed = true;
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    const currentSelectedIndexFileSize = this.dataSourceAttachment.data[this.fileBrowseIndex]
                        ? this.dataSourceAttachment.data[this.fileBrowseIndex].size
                        : 0;
                    this.totalAttachmentSize -= currentSelectedIndexFileSize;
                    this.totalAttachmentSize += Number(fileSizeInKb);
                    if (this.totalAttachmentSize <= EdpDataConst.MAX_FILE_SIZE_FOR_COMMON) {
                        const uplFlName = fileSelected.target.files[0].name;
                        this.dataSourceAttachment.data[this.fileBrowseIndex].uploadedFileName = uplFlName;
                        this.dataSourceAttachment.data[this.fileBrowseIndex].pathUploadFile = fileSelected.target.value;
                        this.dataSourceAttachment.data[this.fileBrowseIndex].size = fileSizeInKb;
                        this.dataSourceAttachment.data[this.fileBrowseIndex].uploadedByName = this.userName;
                        this.dataSourceAttachment.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
                        this.rightMappingAttachment.nativeElement.value = '';
                    } else {
                        this.totalAttachmentSize = this.totalAttachmentSize - fileSizeInKb;
                        this.toastr.error(this.errorMessages['ATTACHMENT']['LARGE_FILE']);
                        this.rightMappingAttachment.nativeElement.value = '';
                    }
                }
            });
            if (!fileAllowed) {
                this.toastr.error(this.errorMessages['ATTACHMENT']['INVALID_TYPE']);
            }
        }
    }
    openFileSelector(index) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }
    addBrowse() {
        if (this.dataSourceAttachment) {
            const data = this.dataSourceAttachment.data[this.dataSourceAttachment.data.length - 1];
            if (data && data.fileName && data.uploadedFileName) {
                const attachData = this.dataSourceAttachment.data;
                attachData.push({
                    attachmentId: Number(data.attachmentId),
                    attachmentName: data.attachmentName,
                    attachmentCode: data.attachmentCode,
                    attachmentDesc: data.attachmentDesc,
                    attahcmentType: Number(data.attahcmentType),
                    fileName: '',
                    uploadedFileName: '',
                    uploadedBy: '',
                    uploadedByName: '',
                    size: 0,
                    pathUploadFile: '',
                    rolePermId: 0,
                    file: null,
                    common: true,
                    mandatoryFlag: false,
                    userRgMapId: null,
                    userRgMpAttrId: null
                });
                this.dataSourceAttachment.data = attachData;
            } else {
                this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_FILL_ALL_DATA']);
            }
        }
    }
    deleteBrowse(index) {
        const data = _.cloneDeep(this.dataSourceAttachment.data);
        const deletedFile: any = data.splice(index, 1)[0];
        if (!this.removeFile(deletedFile, index)) {
            this.dataSourceAttachment.data.splice(index, 1);
            const tableData = this.dataSourceAttachment.data;
            tableData.push(deletedFile);
            this.dataSourceAttachment = new MatTableDataSource(tableData);
        } else {
            this.dataSourceAttachment.data.splice(index, 1);
            this.dataSourceAttachment = new MatTableDataSource(this.dataSourceAttachment.data);
        }
    }

    removeFile(fileData, removeIndex = null): boolean {
        this.dataSourceAttachment.data.forEach((file, index) => {
            if (file.userRgMpAttrId) {
                if (
                    file.size === fileData.size &&
                    file.uploadedFileName === fileData.uploadedFileName &&
                    file.userRgMpAttrId === fileData.userRgMpAttrId
                ) {
                    this.rightMappingService.deleteAttachmentByAttachID({ id: fileData.userRgMpAttrId }).subscribe(
                        res => {
                            if (res && res['status'] === 200) {
                                // file.id = 0;
                                this.totalAttachmentSize = this.totalAttachmentSize - fileData.size;
                                file.uploadedByName = '';
                                file.size = 0;
                                file.fileName = file.fileName;
                                file.uploadedFileName = '';
                                file.pathUploadFile = '';
                                file.file = null;
                                file.userRgMpAttrId = null;
                                return true;
                            } else {
                                this.toastr.error(res['message']);
                                return false;
                            }
                        },
                        err => {
                            this.toastr.error(err);
                            return false;
                        }
                    );
                }
            } else if (
                file.size === fileData.size &&
                file.uploadedFileName === fileData.uploadedFileName &&
                file.attachmentId === fileData.attachmentId &&
                removeIndex === index
            ) {
                this.totalAttachmentSize = this.totalAttachmentSize - fileData.size;
                file.uploadedByName = '';
                file.size = 0;
                file.uploadedFileName = '';
                file.pathUploadFile = '';
                file.file = null;
                file.userRgMpAttrId = null;
                return true;
            }
        });

        if (this.attachmentData && this.attachmentData.length) {
            const attData = this.attachmentData[removeIndex];
            if (attData) {
                attData.uploadedByName = '';
                attData.size = 0;
                attData.uploadedFileName = null;
                (attData.fileName = ''), (attData.pathUploadFile = fileData.pathUploadFile);
                attData.file = null;
                attData.userRgMpAttrId = null;
            }
        }
        return true;
    }

    // removeFile(fileData, removeIndex = null): boolean {
    //     // tslint:disable-next-line: no-shadowed-variable

    //         if (fileData.userRgMpAttrId) {
    //             const fileSize = Number(fileData.uploadedFileSize);
    //             if (fileData.size === fileData.size && fileData.uploadedFileName === fileData.uploadedFileName &&
    //                 fileData.userRgMpAttrId === fileData.userRgMpAttrId) {
    //                 this.rightMappingService.deleteAttachmentByAttachID(
    //                     { id: fileData.userRgMpAttrId }
    //                 ).subscribe((res) => {
    //                     if (res && res['result'] && res['status'] === 200) {
    //                         fileData.uploadedByName = '';
    //                         fileData.size = 0;
    //                         fileData.uploadedFileName = '';
    //                         fileData.pathUploadFile = '';
    //                         fileData.file = null;
    //                         fileData.fileName = '';
    //                         fileData.userRgMpAttrId = null;
    //                         return true;
    //                     } else {
    //                         return false;
    //                     }
    //                 }, (err) => {
    //                     this.toastr.error(err);
    //                     return false;
    //                 });
    //             }
    //         } else {
    //             this.dataSourceAttachment.data.forEach(file => {
    //             if (file.size === fileData.size && file.uploadedFileName === fileData.uploadedFileName &&
    //                 file.attachmentId === fileData.attachmentId) {
    //                 this.totalAttachmentSize = this.totalAttachmentSize - Number(fileData.size);
    //                 file.uploadedByName = '';
    //                 file.size = 0;
    //                 file.uploadedFileName = '';
    //                 file.pathUploadFile = fileData.pathUploadFile;
    //                 file.file = null;
    //                 file.userRgMpAttrId = null;
    //                 return true;
    //             }
    //             });
    //         }

    //         const i = this.dataSourceAttachment.data.indexOf(removeIndex);
    //         if (i > -1) {
    //             this.dataSourceAttachment.data.splice(removeIndex, 1);
    //         }

    //     return true;
    // }

    loadAttachmentList(transactionId) {
        const param = {
            id: transactionId
        };
        this.rightMappingService.loadAttachmentList(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    const resultObject = _.cloneDeep(res['result']);
                    let updateOfficeAttachment = [];
                    this.noOfAttachment = this.attachmentData.length;
                    if (resultObject.length === 0) {
                        this.dataSourceAttachment.data = _.cloneDeep(this.attachmentData);
                    } else {
                        // if (resultObject.length > 0) {
                        const postTransferAttachment: any = [];
                        if (this.attachmentData) {
                            this.attachmentData.forEach((attachData, attachindex) => {
                                const data = resultObject.filter(obj => {
                                    return attachData.attachmentId === obj.attachmentId;
                                });
                                // if (data && data.length > 0) {
                                // if (data.length === 1) {
                                //     attachData['fileName'] = data[0].fileName;
                                //     attachData['userRgMpAttrId'] = data[0].userRgMpAttrId;
                                //     attachData['userRgMapId'] = data[0].userRgMapId;
                                //     attachData['uploadedFileName'] = data[0].uploadFileName;
                                //     attachData['file'] = data[0].file;
                                //     attachData['pathUploadFile'] = data[0].pathUploadFile;
                                //     attachData['rolePermId'] = data[0].rolePermId;
                                //     attachData['uploadedByName'] = data[0].uploadedByName;
                                //     attachData['size'] = data[0].uploadFileSize;
                                //     attachData['common'] = false;
                                //     this.totalAttachmentSize += Number(data[0].uploadFileSize);
                                // } else if (data && data.length > 1) {
                                data.forEach((attachmentData, dataIndex) => {
                                    const attachDataClone = _.cloneDeep(attachData);
                                    attachDataClone['fileName'] = attachmentData.fileName;
                                    attachDataClone['userRgMpAttrId'] = attachmentData.userRgMpAttrId;
                                    attachDataClone['userRgMapId'] = attachmentData.userRgMapId;
                                    attachDataClone['uploadedFileName'] = attachmentData.uploadFileName;
                                    attachDataClone['file'] = attachmentData.file;
                                    attachDataClone['pathUploadFile'] = attachmentData.pathUploadFile;
                                    attachDataClone['rolePermId'] = attachmentData.rolePermId;
                                    attachDataClone['uploadedByName'] = attachmentData.uploadedByName;
                                    attachDataClone['size'] = attachmentData.uploadFileSize;
                                    attachDataClone['common'] = false;
                                    this.totalAttachmentSize += Number(attachmentData.uploadFileSize);
                                    if (dataIndex === 0) {
                                        this.attachmentData.splice(attachindex, 1, attachDataClone);
                                    } else {
                                        postTransferAttachment.push(attachDataClone);
                                    }
                                });
                                // }
                                // }
                            });
                            updateOfficeAttachment = this.attachmentData.concat(postTransferAttachment);
                        }
                        // this.attachmentData = this.attachmentData.concat(postTransferAttachment);
                        // const filtered = this.attachmentData.filter(item => {
                        //     return item.attachmentId === item.attachmentId;
                        // });
                        this.dataSourceAttachment.data = _.cloneDeep(updateOfficeAttachment);
                    }
                    // if (this.dataSourceAttachment && this.dataSourceAttachment.data &&
                    //     this.dataSourceAttachment.data.length === 0) {
                    //     this.getAttachmentMasterData();
                    // }
                }
            },
            err => {
                this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_GET_LIST']);
            }
        );
    }
    uploadFiles() {
        let allowUpload = false;
        const uploadAttachmentList = new FormData();
        let index = 0;
        this.dataSourceAttachment.data.forEach(obj => {
            if (
                obj.pathUploadFile &&
                obj.size > 0 &&
                obj.uploadedFileName &&
                obj.uploadedByName &&
                obj.userRgMpAttrId === null
            ) {
                if (obj.fileName.trim()) {
                    uploadAttachmentList.append('attch[' + index + '].fileName', obj.fileName.trim());
                    uploadAttachmentList.append('attch[' + index + '].file', obj.file);
                    uploadAttachmentList.append('attch[' + index + '].attachmentId', obj.attachmentId.toString());
                    uploadAttachmentList.append('attch[' + index + '].uploadedFileName', obj.uploadedFileName);
                    uploadAttachmentList.append('attch[' + index + '].pathUploadFile', obj.pathUploadFile);
                    uploadAttachmentList.append('attch[' + index + '].userRgMapId', this.transactionId.toString());
                    uploadAttachmentList.append(
                        'attch[' + index + '].rolePermId',
                        EdpDataConst.ROLE_PERM_ID.toString()
                    );
                    allowUpload = true;
                    index++;
                }
            }
        });

        if (this.dataSourceAttachment.data && this.dataSourceAttachment.data.length) {
            const inValid = this.dataSourceAttachment.data.some(
                x =>
                    (_.isEmpty(x.fileName) && !_.isEmpty(x.uploadedFileName)) ||
                    (!_.isEmpty(x.fileName) && _.isEmpty(x.uploadedFileName))
            );

            if (!inValid && allowUpload && uploadAttachmentList) {
                this.rightMappingService.saveAttachment(uploadAttachmentList).subscribe(
                    res => {
                        if (res && res['result'] && res['status'] === 200) {
                            this.toastr.success(this.errorMessages['ATTACHMENT']['UPLOAD_SUCCESS']);
                            this.totalAttachmentSize = 0;
                            this.loadAttachmentList(this.transactionId);
                        }
                    },
                    err => {
                        this.toastr.error(err);
                    }
                );
            } else {
                this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_FILENAME']);
            }
        }
    }
    downloadAttachFile(item) {
        this.rightMappingService.downloadAttachmentByAttachID({ id: item.userRgMpAttrId }).subscribe(
            res => {
                const url = window.URL.createObjectURL(res);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', '' + item.uploadedFileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            },
            err => {
                this.toastr.error(err);
            }
        );
    }
    viewAttachment(attachment) {
        const ID = {
            id: attachment.userRgMpAttrId
        };
        this.httpClient
            .post(`${environment.baseUrl}${RIGHT_MAPPING.ATTECHMENT.DOWNLOAD_FILE}`, ID, {
                responseType: 'blob' as 'json'
            })
            .subscribe(
                res => {
                    const url = window.URL.createObjectURL(res);
                    window.open(url, '_blank');
                },
                err => {
                    this.toastr.error(err);
                }
            );
    }
    onFileNameChange(event, item) {
        item.fileName = event.target.value;
    }
    resetAttachment() {
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.attachmentData = [];
                this.totalAttachmentSize = 0;
                // this.loadAttachmentList(this.postId);
                this.getAttachmentMasterData();
            }
        });
    }
    goToListing() {
        this.router.navigate(['dashboard/edp/rights-mapping/list'], { skipLocationChange: true });
    }
    /**
     * Navigate to the dashboard
     */
    goToDashboard() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.CLOSE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }

    getValueForCheckWorkFlowPopup() {
        return this.rightMappingService.checkForWorkFlow('').pipe(
            map(
                (res: any) => {
                    if (res && res.status === 200) {
                        this.workFlowInfo.isCheckWorkFlow = res.result;
                    }
                    return this.workFlowInfo.isCheckWorkFlow;
                },
                err => {
                    this.toastr.error(err);
                }
            )
        );
    }

    openWorkFlow() {
        this.rightMappingService
            .getHeaderDetails({ id: this.transactionId, menuId: EdpDataConst.MENU.RIGHTS_MAPPING.TRANSACTION })
            .subscribe((res: any) => {
                if (res && res.result && res.status === 200) {
                    // Dynamic
                    const headerJson: HeaderJson[] = res.result;

                    const moduleInfo = {
                        moduleName: ModuleNames.EDP,
                        districtId: this.districtId
                    };
                    const workflowData: WorkflowPopupData = {
                        menuModuleName: ModuleNames.EDP,
                        headingName: EdpDataConst.RIGHTS_MAPPING,
                        headerJson: headerJson,
                        trnId: this.transactionId, // this.edpUsrPoTrnsHeaderId, // dynamic
                        conditionUrl: 'edp/condition/rightsMapping/2001', // edp url
                        moduleInfo: moduleInfo,
                        refNo: this.transactionNo.toString(), // dynamic
                        refDate: this.transactionDate, // dynamic
                        branchId: null,
                        ministerId: null,
                        isAttachmentTab: false, // for Attachment tab visible it should be true
                        fdGroupUrl: null // Need to check that its required or not. came after pull from trunk
                    };
                    const dialogRef = this.dialog.open(CommonWorkflowComponent, {
                        width: '2700px',
                        height: '600px',
                        data: workflowData
                    });

                    dialogRef.afterClosed().subscribe(wfData => {
                        if (wfData.commonModelStatus) {
                            const popUpRes = wfData.data.result[0];
                            const dataToSend: any = this.getRightsMappingDataToSend();
                            if (popUpRes.trnStatus && popUpRes.trnStatus.toLowerCase() === 'approved') {
                                dataToSend.wfSubmit = true;
                                this.submitRightsMapping(dataToSend, false);
                            } else if (this.workFlowInfo.objection.status) {
                                // For objection
                                this.saveRightsMapping(dataToSend, false);
                            } else {
                                this.saveRightsMapping(dataToSend, false);
                                this.router.navigate(['dashboard/edp/rights-mapping/list'], {
                                    skipLocationChange: true
                                });
                                this.dialog.closeAll();
                            }
                        } else {
                            this.dialog.closeAll();
                        }
                    });
                }
            });
    }

    viewComments(): void {
        this.rightMappingService
            .getHeaderDetails({ id: this.transactionId, menuId: EdpDataConst.MENU.RIGHTS_MAPPING.TRANSACTION })
            .subscribe(
                (res: any) => {
                    if (res && res.result && res.status === 200) {
                        const headerJson: HeaderJson[] = res.result;
                        this.dialog.open(ViewCommonWorkflowHistoryComponent, {
                            width: '2700px',
                            height: '600px',
                            data: {
                                menuModuleName: ModuleNames.EDP,
                                headingName: EdpDataConst.RIGHTS_MAPPING,
                                headerJson: headerJson,
                                trnId: this.transactionId,
                                refNo: this.transactionNo, // dynamic
                                refDate: this.transactionDate // dynamic
                            }
                        });
                    } else {
                        this.toastr.error(res.message);
                    }
                },
                err => {
                    this.toastr.error(err);
                }
            );
    }

    disableAllFormFields() {
        if (this.workFlowInfo.objection.required && this.action !== 'view') {
            this.userMappingForm.enable();
            this.userMappingForm.controls['district'].disable();
            this.userMappingForm.controls['ddoNo'].disable();
            this.userMappingForm.controls['cardexNo'].disable();
            this.userMappingForm.controls['ddoOffice'].disable();
            this.userMappingForm.controls['userSearchID'].disable();
            this.userMappingForm.controls['objStatus'].enable();
            this.userMappingForm.controls['objRemark'].enable();
        } else {
            this.userMappingForm.disable();
        }
    }

    searchOfficeDetails() {
        // tslint:disable-next-line: no-use-before-declare
        const districtData = {
            district: this.officeDistrictId
        };
        const dialogRef = this.dialog.open(SearchDialogComponent, {
            width: '1000px',
            height: '600px',
            data: districtData
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'no') {
                return result;
            }
        });
    }
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'right-mapping-submit-dialog',
    templateUrl: 'right-mapping-submit-dialog.html',
    styleUrls: ['./right-mapping.component.css']
})
export class UserRightSubmitDialogComponent implements OnInit {
    constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UserRightSubmitDialogComponent>) {}

    ngOnInit() {}

    onNoClick(): void {
        this.dialogRef.close('no');
    }

    onYesClick() {
        this.dialogRef.close('yes');
    }
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'right-mapping-confirm-dialog',
    templateUrl: 'right-mapping-confirm-dialog.html',
    styleUrls: ['./right-mapping.component.css']
})
export class UserRightConfirmDialogComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<UserRightConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {}

    message: string;
    ngOnInit() {
        this.message = this.data.message;
    }
    onNo(): void {
        this.dialogRef.close('no');
    }

    onYes(): void {
        this.dialogRef.close('yes');
    }
}

@Component({
    selector: 'app-already-exists-dialog',
    templateUrl: 'already-exists-dialog.html',
    styleUrls: ['./right-mapping.component.css']
})
export class AlreadyExistsDialogComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AlreadyExistsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {}
    message: string;
    isSameUser: string;
    ngOnInit() {
        this.message = this.data.message;
        this.isSameUser = this.data.isSameUser;
    }

    onNoClick(data): void {
        this.dialogRef.close(data);
    }
}

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'right-mapping-dialog',
    templateUrl: 'right-mapping-dialog.html',
    styleUrls: ['./right-mapping.component.css']
})
export class UserRightMappingDialogComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<UserRightMappingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {}
    empName;
    empNo;
    postName;
    menuName;
    wfRoleNames;
    assignedRights = new MatTableDataSource([]);
    displayedBrowseColumns = [
        'srNo',
        'empNo',
        'empName',
        'postName',
        'postType',
        'create',
        'edit',
        'view',
        'delete',
        'wfRoleNames'
    ];

    ngOnInit() {
        const self = this;
        if (this.data.user) {
            this.data.user.map(
                (user, index) => (this.data.user[index].rolePermName = self.arrangeUserRights(user.rolePermName))
            );
            self.assignedRights = new MatTableDataSource(this.data.user);
        } else {
            self.assignedRights = new MatTableDataSource([]);
        }
        self.menuName = this.data.menu;
    }
    arrangeUserRights(rolePermName) {
        const roles = { view: false, edit: false, create: false, delete: false };
        if (rolePermName) {
            const permissionData = rolePermName.split(',');
            for (const ele of permissionData) {
                switch (ele) {
                    case 'View':
                        roles.view = true;
                        break;
                    case 'Edit':
                        roles.edit = true;
                        break;
                    case 'Create':
                        roles.create = true;
                        break;
                    case 'Delete':
                        roles.delete = true;
                        break;
                    default:
                        break;
                }
            }
        }
        return roles;
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
