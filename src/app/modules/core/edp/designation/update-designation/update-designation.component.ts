import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'src/app/modules/services/common.service';
import { AddDesignationService } from '../../services/add-designation.service';
import { ToastrService } from 'ngx-toastr';
import { EmployeeNo, ActivePost, Designation, DistrictName, OfficeListData } from '../../model/add-designation';
import { Subscription } from 'rxjs';
import { TabelElement } from '../../model/add-designation';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';
import { environment } from 'src/environments/environment';
import { CommonWorkflowComponent } from '../../../common/common-workflow/common-workflow.component';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { HeaderJson, WorkflowPopupData } from '../../../common/model/common-workflow';
import { ViewCommonWorkflowHistoryComponent } from '../../../common/view-common-workflow-history/view-common-workflow-history.component';
import { map } from 'rxjs/operators';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';

@Component({
    selector: 'app-update-designation',
    templateUrl: './update-designation.component.html',
    styleUrls: ['./update-designation.component.css']
})
export class UpdateDesignationComponent implements OnInit {

    isResetActivePost: boolean = true;
    updateDesignationForm: FormGroup;
    selectedIndex: number;
    fileBrowseIndex: number;
    action: string = 'new';
    subscribeParams: Subscription;
    updateDesignationId: number;
    officeId: number;
    totalAttachmentSize: number;
    userName: string;
    transactionNo: string;
    transactionDate: string;
    postId: number;
    officeDivision: string;
    noOfAttachment: number;
    districtId: number;
    officeDistrictId: number;
    activePostId: number;
    activePostName: string;

    isDATUser: boolean = false;
    isActivePost: boolean = false;
    isInActivePost: boolean = true;
    isConsolidateVisible: boolean;
    isDesignation: boolean;
    saveDraftEnable: boolean = false;
    isSubmitDisable: boolean = true;
    loadUpdateDesignation: string;
    isInsert: boolean = true;
    isUpload: boolean = false;
    objStatus: boolean = false;
    isCheckWorkFlow: boolean = false;
    wfInRequest: boolean = false;
    objectionRequired: boolean = false;
    hasWorkFlow: boolean = false;
    isOfficeDetailSearch: boolean = false;

    errorMessages = msgConst;
    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;
    @ViewChild('addAttachment', { static: true }) addAttachment: ElementRef;
    districtNameList: DistrictName[] = [];
    officeListData: OfficeListData[] = [];
    employeeNoList: EmployeeNo[] = [];
    activePostList: ActivePost[] = [];
    designationList: Designation[] = [];

    districtCtrl: FormControl = new FormControl();
    employeeNoCtrl: FormControl = new FormControl();
    actpostCtrl: FormControl = new FormControl();
    desigCtrl: FormControl = new FormControl();

    displayedBrowseColumns = ['id', 'attachmentType', 'fileName', 'browse', 'uploadedFileName', 'uploadedBy', 'action'];

    browseData: TabelElement[] = [];
    dataSourceBrowse = new MatTableDataSource(this.browseData);

    constructor(
        public dialog: MatDialog,
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        private storageService: StorageService,
        private commonService: CommonService,
        private addDesignationService: AddDesignationService,
        private el: ElementRef,
        private httpClient: HttpClient
    ) { }

    ngOnInit() {
        this.totalAttachmentSize = 0;
        this.noOfAttachment = 0;
        this.selectedIndex = 0;
        this.createForm();
        this.userName = this.storageService.get('userName');
        const userOffice = this.storageService.get('userOffice');
        this.officeDivision = userOffice['officeDivision'];
        if (this.officeDivision === null) {
            this.officeId = userOffice['officeId'];
        }
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action === 'edit' || this.action === 'view') {
                this.isResetActivePost = false;
                this.updateDesignationId = +resRoute.id;
                if (this.updateDesignationId) {
                    if (this.action === 'view') {
                        this.updateDesignationForm.disable();
                    }
                    // load update designation data
                    this.loadUpdateDesignationDeatail(this.updateDesignationId);
                } else {
                    this.router.navigate(['../new'], { relativeTo: this.activatedRoute, skipLocationChange: true });
                }
            } else {
                this.loadDistrictDetails();
            }
        });
        this.updateDesignationForm.valueChanges.subscribe(() => {
            this.saveDraftEnable = true;
            this.isSubmitDisable = false;
        });
    }

    loadDistrictDetails() {
        const userOffice = this.storageService.get('userOffice'),
            self = this;
        this.officeDivision = userOffice['officeDivision'];
        if (this.officeDivision && this.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
            this.addDesignationService.loadDistrictDetails('').subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    const districtData = res['result'];
                    if (districtData) {
                        self.districtNameList = districtData;
                        self.isDATUser = true;
                        if (self.officeId) {
                            if (self.loadUpdateDesignation) {
                                self.updateDesignationForm.patchValue({
                                    employeeNo: self.loadUpdateDesignation['empId'],
                                    employeeName: self.loadUpdateDesignation['empName'],
                                    designation: self.loadUpdateDesignation['designationId'],
                                    district: self.loadUpdateDesignation['districtId'],
                                    ddoNo: self.loadUpdateDesignation['ddoNumber'],
                                    cardexNo: self.loadUpdateDesignation['cardexNo'],
                                    officeName: self.loadUpdateDesignation['officeName'],
                                    newPostName: self.loadUpdateDesignation['postName'],
                                    objStatus: self.loadUpdateDesignation['objection'],
                                    objRemark: self.loadUpdateDesignation['objectionRemarks']
                                });
                                this.officeDistrictId = self.loadUpdateDesignation['districtId'];
                                this.activePostList = self.loadUpdateDesignation['empPostView'];
                                if (this.activePostList.length > 1) {
                                    const activePost = this.activePostList.find(postObj => {
                                        return Number(postObj.postId) === self.loadUpdateDesignation['activePostId'];
                                    });
                                    this.updateDesignationForm.patchValue({
                                        actpost: activePost['postId']
                                    });
                                } else if (this.activePostList.length === 1) {
                                    this.isActivePost = true;
                                    this.updateDesignationForm.patchValue({
                                        actpost: this.activePostList[0]['postId']
                                    });
                                } else {
                                    this.isActivePost = false;
                                }
                                if (!this.updateDesignationForm.controls.newPostName.value) {
                                    this.isDesignation = false;
                                } else {
                                    this.isDesignation = true;
                                }
                                self.officeData();
                            }
                        }
                    } else {
                        this.toastr.error(this.errorMessages.ADD_DESIGNATION.DISTRICT_NAME);
                    }
                } else {
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        } else {
            this.updateDesignationForm.patchValue({
                district: userOffice.districtName,
                ddoNo: userOffice.ddoNo,
                cardexNo: userOffice.cardexno,
                officeName: userOffice.officeName
            });
            this.officeId = userOffice.officeId;
            this.districtId = userOffice.districtId;
            this.isDATUser = false;
            this.getUpdateDesignationDetails(this.officeId);
        }
    }
    officeData() {
        const district = this.updateDesignationForm.controls.district.value;
        this.officeDistrictId = district;
        if (district) {
            this.isOfficeDetailSearch = true;
        } else {
            this.isOfficeDetailSearch = false;
        }
        const officeList = this.districtNameList.filter(data => {
            return data.id === district;
        })[0];
        if (officeList) {
            this.officeListData = _.cloneDeep(officeList['officeList']);
        }
    }
    changeOfficeData() {
        this.officeId = null;
        const district = this.updateDesignationForm.controls.district.value;
        this.officeDistrictId = district;
        if (district) {
            this.isOfficeDetailSearch = true;
        } else {
            this.isOfficeDetailSearch = false;
        }
        this.makeEmptyInput();
        const officeList = this.districtNameList.filter(data => {
            return data.id === district;
        })[0];
        if (officeList) {
            this.officeListData = _.cloneDeep(officeList['officeList']);
        }
    }
    makeEmptyInput() {
        this.updateDesignationForm.controls.ddoNo.setValue('');
        this.updateDesignationForm.controls.cardexNo.setValue('');
        this.updateDesignationForm.controls.officeName.setValue('');
        this.updateDesignationForm.controls.employeeNo.setValue('');
        this.updateDesignationForm.controls.employeeName.setValue('');
        this.updateDesignationForm.controls.actpost.setValue('');
        this.updateDesignationForm.controls.designation.setValue('');
        this.employeeNoList = [];
        this.activePostList = [];
        this.designationList = [];
        this.isDesignation = false;
        this.saveDraftEnable = false;
        this.isSubmitDisable = true;
    }
    onChangeNumber() {
        const ddoNo = this.updateDesignationForm.controls.ddoNo.value;
        const cardexNo = this.updateDesignationForm.controls.cardexNo.value;
        const district = this.updateDesignationForm.controls.district.value;
        this.districtId = district;
        if (ddoNo && cardexNo) {
            this.updateDesignationForm.controls.officeName.setValue('');
            this.officeListData.forEach(officeObj => {
                if (ddoNo === officeObj['ddoNo'] && cardexNo.toString() === officeObj['cardexNo'].toString()) {
                    this.updateDesignationForm.patchValue({
                        officeName: officeObj.name
                    });
                    this.officeId = officeObj['id'];
                    this.isOfficeDetailSearch = true;
                    this.getUpdateDesignationDetails(this.officeId);
                    return true;
                }
            });
            if (!this.updateDesignationForm.controls.district.value) {
                this.toastr.error(this.errorMessages.ADD_DESIGNATION.DISTRICT);
                this.resetUpdateDesignationForm();
            } else if (!this.updateDesignationForm.controls.officeName.value) {
                this.toastr.error(this.errorMessages.ADD_DESIGNATION.OFFICE);
                this.resetUpdateDesignationForm();
            } else {
                this.saveDraftEnable = true;
                this.isSubmitDisable = false;
            }
        } else {
            this.resetUpdateDesignationForm();
        }
    }
    createForm() {
        this.updateDesignationForm = this.fb.group({
            employeeNo: ['', Validators.required],
            actpost: ['', Validators.required],
            singleActPost: [''],
            designation: ['', Validators.required],
            district: ['', Validators.required],
            ddoNo: ['', Validators.required],
            cardexNo: ['', Validators.required],
            officeName: [''],
            newPostName: [''],
            employeeName: [''],
            objStatus: [''],
            objRemark: ['']
        });
        if (this.objStatus) {
            this.objectionRemarks();
        }
    }
    getUpdateDesignationDetails(officeId) {
        const param = {
            officeId: officeId
        };
        this.addDesignationService.getUpdateDesignationDetails(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.designationList = [];
                // tslint:disable-next-line: no-shadowed-variable
                if (res['result']['designation']) {
                    // tslint:disable-next-line: no-shadowed-variable
                    res['result']['designation'].forEach(element => {
                        this.designationList.push(element);
                    });
                }
                this.employeeNoList = [];
                if (res['result']['officeEmpDetails']) {
                    // tslint:disable-next-line: no-shadowed-variable
                    res['result']['officeEmpDetails'].forEach(element => {
                        this.employeeNoList.push(element);
                    });
                }
                if (!this.action) {
                    this.loadAttachment();
                }
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }
    loadEmployeeName() {
        // tslint:disable-next-line: no-inferrable-types
        if (this.isResetActivePost) {
            this.updateDesignationForm.controls.actpost.setValue('');
        }
        const empNo = this.updateDesignationForm.controls.employeeNo.value;
        const employee = this.employeeNoList.filter(data => {
            return data.empId === empNo;
        })[0];
        if (!employee) {
            this.updateDesignationForm.controls.employeeName.setValue('');
        }
        if (employee) {
            const param = {
                officeId: this.officeId,
                userCode: employee['empNo']
            };
            if (this.action === 'edit') {
                if (this.updateDesignationForm.controls.employeeNo.dirty) {
                    this.updateDesignationForm.controls.actpost.setValidators(Validators.required);
                }
            }
            const employeeName = employee['empName'];
            this.updateDesignationForm.controls.employeeName.setValue(employeeName);
            this.addDesignationService.getEmployeeActivePostList(param).subscribe((res: any) => {
                if (res && res.result && res.status === 200) {
                    this.activePostList = res.result;
                    if (this.activePostList.length === 1) {
                        this.getExistsRecord(this.activePostList[0].postId);
                        const data = _.cloneDeep(this.activePostList[0].postId);
                        this.updateDesignationForm.controls.actpost.setValue(data);
                        this.isActivePost = true;
                    } else {
                        this.isActivePost = false;
                        this.updateDesignationForm.controls.actpost.setValue('');
                    }
                } else {
                    this.toastr.error(res.message);
                    this.updateDesignationForm.controls.actpost.setValue('');
                }
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }
    checkAlreadyExistsRecord() {
        const activePost = this.updateDesignationForm.controls.actpost.value;
        if (!activePost) {
            this.updateDesignationForm.controls.actpost.setValue('');
        }
        this.getExistsRecord(activePost);
    }
    getExistsRecord(postId) {
        const param = {
            id: postId
        };
        this.addDesignationService.getLoadExistsRecord(param).subscribe((res: any) => {
            if (res && res.status === 10001) {
                this.loadAlreadyExistsPopup(res);
            } else if (res.result === null) {
                return res;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }
    loadUpdateDesignationDeatail(updateDesignationId) {
        const param = {
            id: updateDesignationId
        };
        this.addDesignationService.loadUpdateDesignationDeatail(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const resResult = res['result'];
                this.officeId = resResult.officeId;
                this.transactionNo = resResult.trnNo;
                this.transactionDate = resResult.createdDate;
                this.postId = resResult.postId;
                this.loadUpdateDesignation = res['result'];
                this.objectionRequired = resResult.objectionRequired;
                this.objStatus = resResult.objection;
                this.districtId = resResult.districtId;
                this.hasWorkFlow = resResult.wfInRequest;
                if (this.objectionRequired) {
                    this.updateDesignationForm.disable();
                    this.updateDesignationForm.controls['objStatus'].enable();
                    this.updateDesignationForm.controls['objRemark'].enable();
                }
                if (this.officeDivision && this.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
                    this.loadDistrictDetails();
                    this.isOfficeDetailSearch = true;
                } else {
                    this.updateDesignationForm.patchValue({
                        employeeNo: resResult.empId,
                        employeeName: resResult.empName,
                        designation: resResult.designationId,
                        district: resResult.districtName,
                        ddoNo: resResult.ddoNumber,
                        cardexNo: resResult.cardexNo,
                        officeName: resResult.officeName,
                        newPostName: resResult.postName,
                        objStatus: resResult.objection,
                        objRemark: resResult.objectionRemarks
                    });
                    this.activePostList = resResult.empPostView;
                    if (this.activePostList.length > 1) {
                        const activePost = this.activePostList.find(postObj => {
                            return Number(postObj.postId) === resResult.activePostId;
                        });
                        this.updateDesignationForm.patchValue({
                            actpost: activePost.postId
                        });
                    } else if (this.activePostList.length === 1) {
                        this.isActivePost = true;
                        this.updateDesignationForm.patchValue({
                            actpost: this.activePostList[0]['postId']
                        });
                        if (this.activePostList.length === 1) {
                            this.isActivePost = true;
                        }
                    } else {
                        this.isActivePost = false;
                    }
                    if (resResult.designationId) {
                        this.isDesignation = true;
                    }
                }
                if (this.action === 'edit') {
                    this.getUpdateDesignationDetails(this.officeId);
                }
                if (this.action === 'view') {
                    const employee = new EmployeeNo();
                    employee.empId = resResult.empId;
                    employee.empNo = resResult.empNo;
                    employee.empName = resResult.empName;
                    this.employeeNoList.push(employee);

                    const designation = new Designation();
                    designation.id = resResult.designationId;
                    designation.name = resResult.designationName;
                    this.designationList.push(designation);
                    this.updateDesignationForm.disable();
                }
                this.loadListAttachment(this.updateDesignationId);
            }
        },
            (err) => {
                this.toastr.error(err);
            });
    }
    loadPostName() {
        const param = {};
        param['officeId'] = this.officeId;
        param['designationId'] = this.updateDesignationForm.controls.designation.value;
        if (!param['designationId']) {
            this.isDesignation = false;
            this.updateDesignationForm.controls.newPostName.setValue('');
        } else {
            if (this.action === 'edit') {
                param['trnNo'] = this.transactionNo;
            }
            this.addDesignationService.updateDesignationGetCount(param).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200 && res['status']) {
                    // tslint:disable-next-line: no-inferrable-types
                    let postName: string = '';
                    const designation = this.updateDesignationForm.controls.designation.value;
                    if (designation) {
                        this.isDesignation = true;
                    } else {
                        this.isDesignation = false;
                    }
                    const post = this.designationList.filter(data => {
                        return data.id === designation;
                    })[0];
                    postName = post['name'];
                    this.postId = null;
                    if (res['result']['count'] && res['result']['count'] > 1) {
                        postName += ' - ' + res['result']['count'];
                    } else if (res['result']['name']) {
                        postName = res['result']['name'];
                        this.postId = res['result']['id'];
                    }
                    this.updateDesignationForm.controls.newPostName.setValue(postName);
                } else {
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.toastr.error(this.errorMessages.POST.ERR_POST_COUNT_DETAILS);
            });
        }
    }
    degination(btnName) {
        const param = this.getUpdateDesignationDataToSend();
        if (btnName === 'save') {
            if (param) {
                param['menuShCode'] = this.commonService.getMenuCode();
                if (!this.updateDesignationId) {
                    this.getValueForCheckWorkFlowPopup().subscribe(r => {
                        param['wfInRequest'] = this.isCheckWorkFlow;
                        param['wfSubmit'] = false;
                        this.saveUpdateDegination(param);
                    });
                } else {
                    this.saveUpdateDegination(param);
                }
            }
        } else if (btnName === 'submit') {
            if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                param['menuShCode'] = this.commonService.getMenuCode();
                if (this.isCheckWorkFlow) {
                    if (this.updateDesignationForm.valid && this.checkForMandatory()) {
                        this.submitUpdateDegination(param);
                    } else {
                        if (this.updateDesignationForm.invalid) {
                            this.toastr.error(
                                this.errorMessages.UPDATE_DESIGNATION.UPDATE_DESIGNATION_FORM_ERROR
                            );
                            this.getFormError();
                            return;
                        }
                        this.showMandatoryAttachmentError();
                    }
                } else {
                    this.submitUpdateDegination(param);
                }
            } else {
                param['menuShCode'] = this.commonService.getMenuCode();
                if (this.updateDesignationForm.valid && this.checkForMandatory()) {
                    this.submitUpdateDegination(param);
                } else {
                    if (this.updateDesignationForm.invalid) {
                        this.toastr.error(
                            this.errorMessages.UPDATE_DESIGNATION.UPDATE_DESIGNATION_FORM_ERROR
                        );
                        this.getFormError();
                        return;
                    }
                    this.showMandatoryAttachmentError();
                }
            }
        }
    }

    hasMandatoryAttachmentUploaded(): boolean {
        const hasAllMandatoryAttachment = this.dataSourceBrowse.data
            .filter(attachement => attachement.mandatoryFlag)
            .every(x => x.tedpUpdDsgnAttId > 0);
        return hasAllMandatoryAttachment;
    }

    showMandatoryAttachmentError() {
        this.toastr.error(this.errorMessages.UPDATE_DESIGNATION.TRANSACTION.ERR_UPLOAD_ATTACH);
        return;
    }
    getUpdateDesignationDataToSend() {
        const param = {
            activePostId: this.updateDesignationForm.controls.actpost.value,
            designationId: this.updateDesignationForm.controls.designation.value,
            empId: this.updateDesignationForm.controls.employeeNo.value,
            officeId: this.officeId,
            postName: this.updateDesignationForm.controls.newPostName.value,
            curMenuId: EdpDataConst.MENU.UPDATE_DESIGNATION_MENU_ID,
        };
        if (this.transactionNo) {
            param['trnNo'] = this.transactionNo;
        }
        if (this.updateDesignationId) {
            param['tedpUpdDsgnId'] = this.updateDesignationId;
            param['postId'] = this.postId;
        }
        if (this.isCheckWorkFlow) {
            param['wfInRequest'] = true;
            param['wfSubmit'] = false;
        } else {
            if (this.action === 'edit') {
                param['wfInRequest'] = this.hasWorkFlow;
            } else {
                param['wfInRequest'] = false;

            }
            param['wfSubmit'] = undefined;
        }
        if (this.objectionRequired) {
            if (this.objStatus) {
                param['objection'] = this.updateDesignationForm.controls.objStatus.value;
                param['objectionRemarks'] = this.updateDesignationForm.controls.objRemark.value;
            } else {
                param['objection'] = false;
                this.updateDesignationForm.controls.objRemark.setValue('');
                param['objectionRemarks'] = null;
            }
        }
        return param;
    }
    saveUpdateDegination(param: any, showPopup = true) {
        param['formAction'] = EdpDataConst.STATUS_DRAFT;
        let isInsertPDesignation = true;
        if (this.activePostList) {
            // tslint:disable-next-line: no-shadowed-variable
            this.activePostList.forEach(element => {
                if (element.postId === param.activePostId &&
                    Number(element.designationId) === param.designationId) {
                    isInsertPDesignation = false;
                }
            });
            if (!isInsertPDesignation) {
                this.toastr.error(msgConst.UPDATE_DESIGNATION.SELECT_DESIGNATION);
                return false;
            }
        }
        if (!this.officeId) {
            this.toastr.error(this.errorMessages.ADD_DESIGNATION.OFFICE_DETAILS);
        } else if (!this.updateDesignationForm.controls.employeeNo.value) {
            this.toastr.error(this.errorMessages.UPDATE_DESIGNATION.EMP_NO);
            this.getFormError();
        } else {
            if (showPopup) {
                this.getFormError();
                if (this.updateDesignationForm.valid) {
                    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                        width: '360px',
                        data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        if (result === 'yes') {
                            this.saveUpdateDesignationApiCall(param, false);
                        }
                    });
                } else {
                    this.toastr.error(this.errorMessages.UPDATE_DESIGNATION.UPDATE_DESIGNATION_FORM_ERROR);
                }
            } else {
                this.saveUpdateDesignationApiCall(param, false);
            }
        }
    }
    submitUpdateDegination(param: any, showPopup = true) {
        param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
        let isInsertPDesignation = true;
        if (this.activePostList) {
            // tslint:disable-next-line: no-shadowed-variable
            this.activePostList.forEach(element => {
                if (element.postId === param.activePostId &&
                    Number(element.designationId) === param.designationId) {
                    isInsertPDesignation = false;
                }
            });
            if (!isInsertPDesignation) {
                this.toastr.error(msgConst.UPDATE_DESIGNATION.SELECT_DESIGNATION);
                return false;
            }
        }
        if (!this.officeId) {
            this.toastr.error(this.errorMessages.ADD_DESIGNATION.OFFICE_DETAILS);
        } else if (!this.updateDesignationForm.controls.employeeNo.value) {
            this.toastr.error(this.errorMessages.UPDATE_DESIGNATION.EMP_NO);
            this.getFormError();
        } else {
            if (showPopup) {
                this.getFormError();
                if (this.action === 'edit') {
                    if (this.updateDesignationForm.controls.employeeNo.dirty ||
                        this.updateDesignationForm.controls.actpost.dirty ||
                        this.updateDesignationForm.controls.designation.dirty) {
                        // tslint:disable-next-line: no-shadowed-variable
                        if (this.updateDesignationForm.valid) {
                            // tslint:disable-next-line: no-shadowed-variable
                            const param: any = this.getUpdateDesignationDataToSend();
                            param['formAction'] = EdpDataConst.STATUS_DRAFT;
                            this.saveUpdateDesignationApiCall(param, false);
                        }
                    }
                }
                if (this.updateDesignationForm.valid) {
                    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                        width: '360px',
                        data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        if (result === 'yes') {
                            if (this.hasWorkFlow) {
                                this.openWorkFlow();
                            } else {
                                this.getValueForCheckWorkFlowPopup().subscribe(r => {
                                    if (this.isCheckWorkFlow) {
                                        if (this.checkForMandatory()) {
                                            this.openWorkFlow();
                                        } else {
                                            this.showMandatoryAttachmentError();
                                        }
                                    } else {
                                        this.isSubmitDisable = true;
                                        this.callSubmit(param);
                                    }
                                });
                            }
                        }
                    });
                } else {
                    this.toastr.error(this.errorMessages.UPDATE_DESIGNATION.UPDATE_DESIGNATION_FORM_ERROR);
                }
            } else {
                this.callSubmit(param);
            }
        }
    }
    checkForMandatory() {
        let flag = true;
        this.dataSourceBrowse.data.forEach(obj => {
            if (obj.mandatoryFlag) {
                if (!obj.tedpUpdDsgnAttId) {
                    flag = false;
                }
            }
        });
        if (!this.dataSourceBrowse.data[0].tedpUpdDsgnAttId) {
            flag = false;
        }
        return flag;
    }
    saveUpdateDesignationApiCall(param, stayOnTransactionPage = true) {
        this.addDesignationService.saveUpdateDesignationDetails(param).subscribe((res: any) => {
            if (res && res['result'] && res['status'] === 200 && res['message']) {
                // tslint:disable-next-line: max-line-length
                if (!(res.result.wfInRequest && res.result.formAction === EdpDataConst.STATUS_SUBMITTED)) {
                    this.toastr.success(res['message']);
                }
                this.saveDraftEnable = false;
                this.updateDesignationId = res['result']['tedpUpdDsgnId'];
                this.transactionNo = res['result']['trnNo'];
                this.transactionDate = res['result']['createdDate'];
                this.postId = res['result']['postId'];
                this.hasWorkFlow = res['result']['wfInRequest'];
                this.selectedIndex = 1;
                this.updateDesignationForm.markAsPristine();
                if (!stayOnTransactionPage && param.formAction === EdpDataConst.STATUS_SUBMITTED) {
                    this.goToListing();
                }
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }
    callSubmit(param) {
        this.addDesignationService.saveUpdateDesignationDetails(param).subscribe((res: any) => {
            if (res['status'] === 200) {
                if (!res.result.wfInRequest) {
                    this.toastr.success(res['message']);
                }
                this.goToListing();
            } else {
                this.toastr.error(res['message']);
            }
        },
            err => {
                this.toastr.error(err);
            }
        );
    }
    viewComments(): void {
        this.addDesignationService.getHeaderDetails({
            'id': this.updateDesignationId,
            'menuId': EdpDataConst.MENU.UPDATE_DESIGNATION_MENU_ID,
        }).subscribe(
            (res: any) => {
                if (res && res.result && res.status === 200) {
                    const headerJson: HeaderJson[] = res.result;
                    this.dialog.open(ViewCommonWorkflowHistoryComponent, {
                        width: '2700px',
                        height: '600px',
                        data: {
                            menuModuleName: ModuleNames.EDP,
                            headingName: EdpDataConst.UPDATE_DESIGNATION,
                            headerJson: headerJson,
                            trnId: this.updateDesignationId,
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

    getValueForCheckWorkFlowPopup() {
        return this.addDesignationService.checkWorkFlowUpdate().pipe(
            map(
                (res: any) => {
                    if (res && res.status === 200) {
                        this.isCheckWorkFlow = res.result;
                    }
                    return this.isCheckWorkFlow;
                },
                err => {
                    this.toastr.error(err);
                }
            )
        );
    }
    openWorkFlow() {
        this.addDesignationService
            .getHeaderDetails({
                'id': this.updateDesignationId,
                'menuId': EdpDataConst.MENU.UPDATE_DESIGNATION_MENU_ID,
            })
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
                        headingName: EdpDataConst.UPDATE_DESIGNATION,
                        headerJson: headerJson,
                        trnId: this.updateDesignationId, // dynamic
                        conditionUrl: 'edp/condition/2001', // edp url
                        moduleInfo: moduleInfo,
                        refNo: this.transactionNo, // dynamic
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
                            if (popUpRes.trnStatus && popUpRes.trnStatus.toLowerCase() === 'approved') {
                                const param: any = this.getUpdateDesignationDataToSend();
                                param.wfSubmit = true;
                                this.submitUpdateDegination(param, false);
                            } else if (this.action === 'edit') {
                                if (this.updateDesignationForm.controls.objStatus.dirty ||
                                    this.updateDesignationForm.controls.objRemark.dirty) {
                                    // For objection
                                    const param: any = this.getUpdateDesignationDataToSend();
                                    param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
                                    this.saveUpdateDesignationApiCall(param, false);
                                } else {
                                    this.goToListing();
                                }
                            } else {
                                this.goToListing();
                            }
                        }
                    });
                }
            });
    }
    loadAttachment() {
        const param = [{
            name: ''
        }];
        this.addDesignationService.loadAttachment(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const mandatoryAttach = [],
                    nonMandatoryAttach = [];
                res['result'].forEach(fileObj => {
                    const attach = fileObj;
                    attach['fileName'] = '';
                    attach['uploadedFileName'] = '';
                    attach['uploadedByName'] = '';
                    attach['tedpUpdDsgnAttId'] = null;
                    attach['size'] = 0;
                    attach['pathUploadFile'] = '';
                    attach['file'] = null;
                    attach['trnUpdDsgnEntity'] = null;
                    if (attach['mandatoryFlag']) {
                        mandatoryAttach.push(attach);
                    } else {
                        nonMandatoryAttach.push(attach);
                    }
                    this.noOfAttachment++;
                });
                this.browseData = mandatoryAttach;
                this.browseData = this.browseData.concat(nonMandatoryAttach);
                this.dataSourceBrowse.data = _.cloneDeep(this.browseData);
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages.ATTACHMENT.ERR_GET_LIST);
            });
    }
    onFileSelection(fileSelected) {
        const fileType = EdpDataConst.EDP_ATTACHMENT_FILE_TYPE;
        if (fileSelected.target && fileSelected.target.files) {
            let fileAllowed: Boolean = false;
            fileType.forEach(el => {
                if (fileSelected.target.files[0] &&
                    el.toLowerCase() === fileSelected.target.files[0].name.split('.').pop().toLowerCase()) {
                    fileAllowed = true;
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    this.totalAttachmentSize += Number(fileSizeInKb);
                    if (this.totalAttachmentSize <= EdpDataConst.MAX_FILE_SIZE_FOR_COMMON) {
                        const uplFlName = fileSelected.target.files[0].name;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedFileName = uplFlName;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].pathUploadFile = fileSelected.target.value;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].size = fileSizeInKb;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].uploadedByName = this.userName;
                        this.dataSourceBrowse.data[this.fileBrowseIndex].file = fileSelected.target.files[0];
                        this.addAttachment.nativeElement.value = '';
                        this.isUpload = true;
                    } else {
                        this.totalAttachmentSize = this.totalAttachmentSize - fileSizeInKb;
                        this.toastr.error(this.errorMessages.ATTACHMENT.LARGE_FILE);
                        this.addAttachment.nativeElement.value = '';
                        this.isUpload = false;
                    }
                }
            });
            if (!fileAllowed) {
                this.toastr.error(this.errorMessages.ATTACHMENT.INVALID_TYPE);
            }
        }
    }
    openFileSelector(index) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }
    addBrowse() {
        if (this.dataSourceBrowse) {
            const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
            if (data && data.fileName && data.uploadedFileName) {
                const attachData = this.dataSourceBrowse.data;
                let mandtoryFlag = false;
                if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                    mandtoryFlag = false;
                } else {
                    mandtoryFlag = true;
                }
                attachData.push({
                    attachmentId: Number(data.attachmentId),
                    attachmentName: data.attachmentName,
                    attachmentCode: data.attachmentCode,
                    attachmentDesc: data.attachmentDesc,
                    attahcmentType: Number(data.attahcmentType),
                    fileName: '',
                    uploadedFileName: '',
                    uploadedByName: '',
                    size: 0,
                    pathUploadFile: '',
                    file: null,
                    officeId: null,
                    trnUpdDsgnEntity: null,
                    tedpUpdDsgnAttId: null,
                    mandatoryFlag: mandtoryFlag
                });
                this.dataSourceBrowse.data = attachData;
                this.isUpload = true;
            } else {
                this.isUpload = false;
                this.toastr.error(this.errorMessages.ATTACHMENT.ERR_FILL_ALL_DATA);
            }
        }
    }
    deleteBrowse(index) {
        const data = _.cloneDeep(this.dataSourceBrowse.data);
        const deletedFile: any = data.splice(index, 1)[0];
        if (!this.removeFile(deletedFile, index)) {
            this.dataSourceBrowse.data.splice(index, 1);
            const tableData = this.dataSourceBrowse.data;
            tableData.push(deletedFile);
            this.dataSourceBrowse = new MatTableDataSource(tableData);
        } else {
            this.dataSourceBrowse.data.splice(index, 1);
            this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
        }
    }
    removeFile(fileData, removeIndex = null): boolean {
        this.dataSourceBrowse.data.forEach((file, index) => {
            if (file.tedpUpdDsgnAttId) {
                const fileSize = Number(fileData.uploadedFileSize);
                if (file.size === fileData.size && file.uploadedFileName === fileData.uploadedFileName &&
                    file.tedpUpdDsgnAttId === fileData.tedpUpdDsgnAttId) {
                    this.addDesignationService.deleteAttachment({ id: fileData.tedpUpdDsgnAttId }).subscribe((res) => {
                        if (res && res['result'] && res['status'] === 200) {
                            this.totalAttachmentSize = this.totalAttachmentSize - fileSize;
                            file.uploadedByName = '';
                            file.size = 0;
                            file.uploadedFileName = '';
                            file.pathUploadFile = '';
                            file.file = null;
                            file.tedpUpdDsgnAttId = null;
                            return true;
                        } else {
                            return false;
                        }
                    },
                        (err) => {
                            this.toastr.error(this.errorMessages.ATTACHMENT.ERR_REMOVE_ATTACHMENT);
                            return false;
                        });
                }
            } else if (file.size === fileData.size && file.uploadedFileName === fileData.uploadedFileName &&
                file.attachmentId === fileData.attachmentId && index === removeIndex) {
                this.totalAttachmentSize = this.totalAttachmentSize - Number(fileData.size);
                file.uploadedByName = '';
                file.size = 0;
                file.uploadedFileName = '';
                file.pathUploadFile = '';
                file.file = null;
                file.tedpUpdDsgnAttId = null;
                return true;
            }
        });
        return true;
    }
    loadListAttachment(designationId) {
        const param = {
            'id': designationId
        };
        this.addDesignationService.loadListAttachment(param).subscribe(res => {
            if (res && res['result'] && res['status'] === 200) {
                const resultObject = _.cloneDeep(res['result']);
                this.noOfAttachment = this.browseData.length;
                this.totalAttachmentSize = 0;
                resultObject.forEach(attachData => {
                    this.totalAttachmentSize += Number(attachData.uploadedFileSize);
                });
                this.dataSourceBrowse.data = resultObject;
            } else {
                if (this.dataSourceBrowse && this.dataSourceBrowse.data) {
                    this.loadAttachment();
                }
            }
        });
    }
    uploadFiles() {
        let allowUpload = false;
        const uploadAttachmentList = new FormData();
        let index = 0;
        this.dataSourceBrowse.data.forEach((obj) => {
            if (obj.pathUploadFile && obj.size > 0 && obj.uploadedFileName &&
                obj.uploadedByName && obj.tedpUpdDsgnAttId === null) {
                if (obj.fileName.trim()) {
                    uploadAttachmentList.append('attch[' + index + '].fileName', obj.fileName.trim());
                    uploadAttachmentList.append('attch[' + index + '].file', obj.file);
                    uploadAttachmentList.append('attch[' + index + '].attachmentId', obj.attachmentId.toString());
                    uploadAttachmentList.append('attch[' + index + '].uploadedFileName', obj.uploadedFileName);
                    uploadAttachmentList.append('attch[' + index + '].pathUploadFile', obj.pathUploadFile);
                    uploadAttachmentList.append(
                        'attch[' + index + '].officeId',
                        this.officeId.toString()
                    );
                    uploadAttachmentList.append(
                        'attch[' + index + '].trnUpdDsgnEntity',
                        this.updateDesignationId.toString()
                    );
                    allowUpload = true;
                    index++;
                }
            }
        });
        if (allowUpload && uploadAttachmentList) {
            this.addDesignationService.uploadAttachment(uploadAttachmentList).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    this.toastr.success(this.errorMessages.ATTACHMENT.UPLOAD_SUCCESS);
                    this.loadListAttachment(this.updateDesignationId);
                    this.isUpload = false;
                } else {
                    this.isUpload = true;
                }
            },
                (err) => {
                    this.toastr.error(this.errorMessages.ATTACHMENT.ERR_UPLOAD_ATTACHMENT);
                });
        } else {
            this.toastr.error(this.errorMessages.ATTACHMENT.ERR_FILENAME);
        }
    }
    viewAttachment(attachment) {
        const ID = {
            'id': attachment.tedpUpdDsgnAttId
        };
        this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.UPDATE_DESIGNATION.DOWNLOAD_ATTACHMENT}`,
            ID,
            { responseType: 'blob' as 'json' }
        ).subscribe((res) => {
            const url = window.URL.createObjectURL(res);
            window.open(url, '_blank');
        },
            (err) => {
                this.toastr.error(err);
            });
    }
    downloadAttachment(attachment) {
        const ID = {
            'id': attachment.tedpUpdDsgnAttId
        };
        this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.UPDATE_DESIGNATION.DOWNLOAD_ATTACHMENT}`,
            ID,
            { responseType: 'blob' as 'json' }
        ).subscribe((res) => {
            const url = window.URL.createObjectURL(res);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', '' + attachment.uploadedFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    resetForm(updateDesignationForms: NgForm) {
        const proceedMessage = this.errorMessages.CONFIRMATION_DIALOG.CONFIRMATION;
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.updateDesignationId) {
                    this.isResetActivePost = false;
                    this.loadUpdateDesignationDeatail(this.updateDesignationId);
                } else {
                    updateDesignationForms.resetForm();
                    this.getUpdateDesignationDetails(this.officeId);
                    if (!this.officeDivision) {
                        const userOffice = this.storageService.get('userOffice');
                        this.updateDesignationForm.patchValue({
                            district: userOffice.districtName,
                            ddoNo: userOffice.ddoNo,
                            cardexNo: userOffice.cardexno,
                            officeName: userOffice.officeName
                        });
                    }
                }
                this.saveDraftEnable = false;
                this.isDesignation = false;
                this.isSubmitDisable = true;
                const district = this.updateDesignationForm.controls.district.value;
                if (district) {
                    this.isOfficeDetailSearch = true;
                } else {
                    this.isOfficeDetailSearch = false;
                }
            }
        });
    }
    goToListing() {
        this.router.navigate(['/dashboard/edp/designation/update-list'], { skipLocationChange: true });
    }
    goToDashboard() {
        const proceedMessage = this.errorMessages.CONFIRMATION_DIALOG.CONFIRMATION;
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }
    resetAttachment() {
        const proceedMessage = this.errorMessages.CONFIRMATION_DIALOG.CONFIRMATION;
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.browseData = [];
                this.loadListAttachment(this.updateDesignationId);
                this.isUpload = false;
            }
        });
    }

    resetUpdateDesignationForm() {
        this.updateDesignationForm.controls.officeName.setValue('');
        this.updateDesignationForm.controls.employeeNo.setValue('');
        this.updateDesignationForm.controls.employeeName.setValue('');
        this.updateDesignationForm.controls.actpost.setValue('');
        this.updateDesignationForm.controls.designation.setValue('');
        this.isDesignation = false;
        this.saveDraftEnable = false;
        this.isSubmitDisable = true;
        this.employeeNoList = [];
        this.activePostList = [];
        this.designationList = [];
    }
    getTitleName(list, formControlKey, listIdKey, listValueKey) {
        const val = this.updateDesignationForm.get(formControlKey).value;
        if (list && list.length > 0) {
            const data = list.filter(obj => {
                return obj[listIdKey] === val;
            });
            if (data && data.length === 1) {
                return data[0][listValueKey];
            }
        }
        return '';
    }
    getFormError() {
        _.each(this.updateDesignationForm.controls, function (control) {
            if (control.status === 'INVALID') {
                control.markAsTouched({ onlySelf: true });
            }
        });
    }

    objectionRemarks() {
        if (this.objStatus) {
            this.updateDesignationForm.controls.objRemark.setValidators(Validators.required);
            this.updateDesignationForm.controls.objRemark.updateValueAndValidity();
        } else {
            this.objStatus = false;
            this.updateDesignationForm.controls.objRemark.clearValidators();
            this.updateDesignationForm.controls.objRemark.updateValueAndValidity();
        }
    }

    loadAlreadyExistsPopup(res) {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(AlreadyExistsRecordDialogComponent, {
            disableClose: true,
            height: '270px',
            width: '600px',
            data: {
                message: res['message']
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'no') {
                this.updateDesignationForm.controls.actpost.setValue('');
                this.updateDesignationForm.controls.employeeNo.setValue('');
                this.updateDesignationForm.controls.employeeName.setValue('');
                return result;
            }
        });
    }
    searchOfficeDetails() {
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
    selector: 'app-already-exists-dialog',
    templateUrl: 'already-exists-dialog.html',
    styleUrls: ['./update-designation.component.css']
})
export class AlreadyExistsRecordDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<AlreadyExistsRecordDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }
    message: string;
    ngOnInit() {
        this.message = this.data.message;
    }

    onNoClick(data): void {
        this.dialogRef.close(data);
    }
}
