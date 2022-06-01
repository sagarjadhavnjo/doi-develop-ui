import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'src/app/modules/services/common.service';
import * as _ from 'lodash';
import { AddDesignationService } from '../../services/add-designation.service';
import { ToastrService } from 'ngx-toastr';
import { ADDTabelElement, DistrictName, OfficeListData } from '../../model/add-designation';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { HttpClient } from '@angular/common/http';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';
import { environment } from 'src/environments/environment';
import { HeaderJson, WorkflowPopupData } from '../../../common/model/common-workflow';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { CommonWorkflowComponent } from '../../../common/common-workflow/common-workflow.component';
import { PostTransferService } from '../../services/post-transfer.service';
import { ViewCommonWorkflowHistoryComponent } from '../../../common/view-common-workflow-history/view-common-workflow-history.component';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';


@Component({
    selector: 'app-already-exists-dialog',
    templateUrl: 'already-exists-dialog.html',
    styleUrls: ['./add-designation.component.css']
})
export class AlreadyExistsDialogComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AlreadyExistsDialogComponent>,
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

@Component({
    selector: 'app-add-designation',
    templateUrl: './add-designation.component.html',
    styleUrls: ['./add-designation.component.css']
})
export class AddDesignationComponent implements OnInit {

    addDesignationForm: FormGroup;
    selectedIndex: number;
    fileBrowseIndex: number;
    subscribeParams: Subscription;
    officeId: number;
    transactionNo: string;
    transactionDate: string;
    action: string;
    designationId: number;
    userName: string;
    totalAttachmentSize: number;
    officeDivision: string;
    officeDistrictId: number;
    statusId: number;

    doneHeader: Boolean = false;
    isSubmitDisable: boolean = true;
    saveDraftEnable: boolean = false;
    isDATUser: boolean = false;
    isUpload: boolean = false;
    isObjectionRequired: boolean = false;
    hasObjection: boolean = false;
    wfInRequest: boolean;
    hasWorkflow: boolean = false;
    wfSaveDrftApiCall: boolean;
    wfSubmit: boolean;
    isCheckWorkFlow: boolean = false;
    districtId: number;
    approvedStatus: boolean = false;
    workFlowStatus: boolean = false;
    isOfficeDetailSearch: boolean = false;
    hasWorkFlow: boolean = false;

    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;
    loadAddDesignation: string;
    districtNameList: DistrictName[] = [];
    officeListData: OfficeListData[] = [];
    districtCtrl: FormControl = new FormControl();
    errorMessages = msgConst;
    @ViewChild('addAttachment', { static: true }) addAttachment: ElementRef;
    displayedBrowseColumns = ['attachmentType', 'fileName', 'browse', 'uploadedFileName', 'uploadedBy', 'action'];

    browseData: ADDTabelElement[] = [];
    dataSourceBrowse = new MatTableDataSource(this.browseData);
    officeDataFromLogin;
    loggedUserObj;
    isDatSuperAdmin: boolean = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private storageService: StorageService,
        private commonService: CommonService,
        private el: ElementRef,
        private addDesignationService: AddDesignationService,
        private postTransferService: PostTransferService,
        private httpClient: HttpClient
    ) { }
    ngOnInit() {
        this.officeDataFromLogin = this.storageService.get('userOffice');
        const userOfficePost = this.storageService.get('currentUser');
        const loginPost = userOfficePost['post'].filter(item => item['loginPost'] === true);
        this.loggedUserObj = loginPost;
        const wfRoleIdArr: any[] = this.commonService.getwfRoleId();
        const linkMenuWfRoleIdArr: any[] = this.commonService.getLinkMenuWfRoleId();
        const wfRoleArr: number[] = [];
        wfRoleIdArr.forEach(e => {
            wfRoleArr.push(e.wfRoleIds[0]);
        });
        if (linkMenuWfRoleIdArr) {
            linkMenuWfRoleIdArr.forEach(e => {
                wfRoleArr.push(e.wfRoleIds[0]);
            });
        }
        this.officeDivision = this.officeDataFromLogin['officeDivision'];

        if (this.commonService.getwfRoleId()) {
            const wfRoleIdArray = this.getWfRoleIdArray(this.commonService.getwfRoleId());
            this.loggedUserObj['wfRoleData'] = wfRoleIdArray;
        }
        if (linkMenuWfRoleIdArr) {
            const wfRoleIdArray = this.getWfRoleIdArray(linkMenuWfRoleIdArr);
            this.loggedUserObj['wfRoleData'] = wfRoleIdArray;
        }
        this.officeDivision = this.loggedUserObj[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeDivision'];
        if (
            wfRoleArr.indexOf(EdpDataConst.USERTYPE_DAT_SUPER_ADMIN) !== -1) {
            this.isDatSuperAdmin = true;
        }

        this.totalAttachmentSize = 0;
        this.errorMessages = msgConst;
        this.createForm();
        this.userName = this.storageService.get('userName');
        const userOffice = this.storageService.get('userOffice');
        this.officeDivision = userOffice['officeDivision'];
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action === 'edit' || this.action === 'view') {
                this.designationId = +resRoute.id;
                this.loadAddUpdateDesignationDeatail(this.designationId);
                if (this.designationId) {
                    if (this.action === 'view') {
                        this.addDesignationForm.disable();
                        this.addDesignationForm.controls['hasObjection'].enable();
                        this.addDesignationForm.controls['objectionRemarks'].enable();

                    }
                } else {
                    this.router.navigate(['../new'], { relativeTo: this.activatedRoute, skipLocationChange: true });
                }
            } else {
                this.loadDistrictDetails();
                this.checkWf();
            }
        });

        this.addDesignationForm.valueChanges.subscribe(() => {
            this.saveDraftEnable = true;
            this.isSubmitDisable = false;
        });
    }


    /**
    * To get the array of Work Flow Roles Assigned
    * @param wfRoleData Function to get array of wfRoles
    */

    getWfRoleIdArray(wfRoleData) {
        const wfRoleArray = [];
        wfRoleData.forEach(element => {
            if (wfRoleArray.indexOf(element['wfRoleIds'][0]) === -1) {
                wfRoleArray.push(element['wfRoleIds']);
            }
        });
        return wfRoleArray;
    }


    createForm() {
        this.addDesignationForm = this.fb.group({
            district: [''],
            ddoNo: [''],
            cardexNo: [''],
            officeName: [''],
            designationName: ['', Validators.required],
            designationShortName: [''],
            hasObjection: [''],
            objectionRemarks: ['']
        });
        if (this.hasObjection) {
            this.objectionRemarks();
        }
    }

    onDesignationNameKeyup() {
        const initalValue = this.addDesignationForm.controls.designationName.value.replace(/  /gi, ' ');
        this.addDesignationForm.controls.designationName.patchValue(initalValue);
    }

    onDesignationNameChange() {
        const initalValue = this.addDesignationForm.controls.designationName.value.trim();
        this.addDesignationForm.controls.designationName.patchValue(initalValue);
    }

    loadDistrictDetails() {
        const userOffice = this.storageService.get('userOffice');
        if (this.officeDivision && this.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
            this.addDesignationService.loadDistrictDetails('').subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    const districtData = res['result'];
                    if (districtData) {
                        this.districtNameList = districtData;
                        this.isDATUser = true;
                        if (this.officeId) {
                            if (this.loadAddDesignation) {
                                this.addDesignationForm.patchValue({
                                    district: this.loadAddDesignation['districtId'],
                                    ddoNo: this.loadAddDesignation['ddoNumber'],
                                    cardexNo: this.loadAddDesignation['cardexNo'],
                                    officeName: this.loadAddDesignation['officeName'],
                                    designationName: this.loadAddDesignation['designationName'],
                                    designationShortName: this.loadAddDesignation['designationShortName']
                                });
                                this.officeDistrictId = this.loadAddDesignation['districtId'];
                            }
                            this.officeData();
                        }
                        this.loadAttachment();
                    } else {
                        this.toastr.error(this.errorMessages['ADD_DESIGNATION']['DISTRICT_NAME']);
                    }
                } else {
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        } else {
            this.addDesignationForm.patchValue({
                district: userOffice.districtName,
                ddoNo: userOffice.ddoNo,
                cardexNo: userOffice.cardexno,
                officeName: userOffice.officeName
            });
            this.officeId = userOffice.officeId;
            this.districtId = userOffice.districtId;
            this.isDATUser = false;
            this.loadAttachment();
        }
    }
    officeData() {
        const district = this.addDesignationForm.controls.district.value;
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
        const district = this.addDesignationForm.controls.district.value;
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
        this.addDesignationForm.controls.ddoNo.setValue('');
        this.addDesignationForm.controls.cardexNo.setValue('');
        this.addDesignationForm.controls.officeName.setValue('');
        this.addDesignationForm.controls.designationName.setValue('');
        this.addDesignationForm.controls.designationShortName.setValue('');
        this.saveDraftEnable = false;
        this.isSubmitDisable = true;
    }
    onChangeNumber() {
        const ddoNo = this.addDesignationForm.controls.ddoNo.value;
        const cardexNo = this.addDesignationForm.controls.cardexNo.value;
        const district = this.addDesignationForm.controls.district.value;
        this.districtId = district;

        if (ddoNo && cardexNo) {
            this.addDesignationForm.controls.officeName.setValue('');
            this.officeListData.forEach(officeObj => {
                if (ddoNo === officeObj['ddoNo'] && cardexNo.toString() === officeObj['cardexNo'].toString()) {
                    this.addDesignationForm.patchValue({
                        officeName: officeObj.name
                    });
                    this.officeId = officeObj['id'];
                    this.isOfficeDetailSearch = true;
                    return true;
                }
            });
            if (!this.addDesignationForm.controls.district.value) {
                this.toastr.error(this.errorMessages['ADD_DESIGNATION']['DISTRICT']);
                this.addDesignationForm.controls.officeName.setValue('');
                this.addDesignationForm.controls.designationName.setValue('');
                this.addDesignationForm.controls.designationShortName.setValue('');
                this.saveDraftEnable = false;
                this.isSubmitDisable = true;
            } else if (!this.addDesignationForm.controls.officeName.value) {
                this.toastr.error(this.errorMessages['ADD_DESIGNATION']['OFFICE']);
                this.addDesignationForm.controls.officeName.setValue('');
                this.addDesignationForm.controls.designationName.setValue('');
                this.addDesignationForm.controls.designationShortName.setValue('');
                this.saveDraftEnable = false;
                this.isSubmitDisable = true;
            } else {
                this.saveDraftEnable = true;
                this.isSubmitDisable = false;
            }
        } else {
            this.addDesignationForm.controls.officeName.setValue('');
            this.addDesignationForm.controls.designationName.setValue('');
            this.addDesignationForm.controls.designationShortName.setValue('');
            this.saveDraftEnable = false;
            this.isSubmitDisable = true;
        }
    }
    /**
     * @description on click of save/submit button this function is called
     *
    */

    saveDTO(buttonName) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        if (this.approvedStatus) {
            dialogRef.close('yes');
        }
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes' || this.approvedStatus) {
                const param = this.addDesignationForm.getRawValue();
                param.officeId = this.officeId;
                if (!this.officeId) {
                    this.toastr.error(this.errorMessages['ADD_DESIGNATION']['OFFICE_DETAILS']);
                    return;
                }
                if (buttonName === 'submit') {
                    param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
                } else {
                    param['formAction'] = EdpDataConst.STATUS_DRAFT;
                }
                if (this.transactionNo) {
                    param.trnNo = this.transactionNo;
                }
                param.designationId = this.designationId;
                param.menuCode = this.commonService.getMenuCode();
                param.curMenuId = EdpDataConst.MENU.ADD_DESIGNATION_MENU_ID;
                param.wfInRequest = this.isCheckWorkFlow;
                param.statusId = this.statusId;
                param.approvedStatus = this.approvedStatus;
                if (!this.action) {
                    this.wfSaveDrftApiCall = true;
                    this.wfSubmit = false;
                }
                param.wfSaveDrftApiCall = this.wfSaveDrftApiCall;
                param.wfSubmit = this.wfSubmit;
                if (
                    (this.checkForMandatory() || buttonName === 'save') &&
                    (this.addDesignationForm.valid || buttonName === 'save') &&
                    (this.isDatSuperAdmin || this.isCheckWorkFlow)
                ) {
                    this.addDesignationService.saveDesignationDetails(param).subscribe(res => {
                        if (res && res['result'] && res['status'] === 200 && res['message']) {
                            this.saveDraftEnable = false;
                            this.isSubmitDisable = false;
                            this.action = 'edit';
                            this.designationId = res['result']['designationId'];
                            this.transactionNo = res['result']['trnNo'];
                            this.transactionDate = res['result']['trnDate'];
                            this.statusId = res['result']['statusId'];
                            if (buttonName === EdpDataConst.STATUS_SUBMITTED) {
                                this.goToListing();
                            }
                            if (buttonName === 'submit') {
                                if (this.isCheckWorkFlow) {
                                    this.openWorkFlow();
                                } else {
                                    if (!this.workFlowStatus) {
                                        this.toastr.success(res['message']);
                                    }
                                    this.goToListing();
                                }
                            } else {
                                if (!this.workFlowStatus) {
                                    this.toastr.success(res['message']);
                                }
                            }
                        }  else if (res && res['status'] === 500) {
                            this.toastr.error(res['message']);
                        } else if (res && res['status'] === 10002) {
                            this.loadAlreadyExistsPopup(res);
                        } else {
                            this.toastr.error(res['message']);
                        }
                    });
                } else {
                    if (this.addDesignationForm.invalid) {
                        this.toastr.error('Please Fill all the Details');
                        _.each(this.addDesignationForm.controls, function (control) {
                            if (control.status === 'INVALID') {
                                control.markAsTouched({ onlySelf: true });
                            }
                        });
                        return;
                    }
                    if (!this.checkForMandatory()) {
                        this.toastr.error(
                            this.errorMessages.POST_TRANSFER.CREATE.ERR_UPLOAD_ALL_ATTACH
                        );
                    }
                }
            }
        }, err => {
            this.toastr.error(err);
        });
    }


    /**
     * @description on click on edit icon we get directed to this method
     * Param - headerId
     * @returns  page details
     */

    loadAddUpdateDesignationDeatail(designationId) {
        const param = {
            id: designationId
        };
        this.addDesignationService.loadAddDesignationDeatail(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.saveDraftEnable = false;
                this.loadAddDesignation = res['result'];
                const resResult = res['result'];
                this.officeId = resResult.officeId;
                this.transactionNo = resResult.trnNo;
                this.transactionDate = resResult.trnDate;
                this.isObjectionRequired = resResult.isObjectionRequired;
                this.statusId = resResult.statusId;
                this.hasWorkFlow = resResult.wfInRequest;
                this.isCheckWorkFlow = resResult.wfInRequest;
                if (this.isObjectionRequired) {
                    this.addDesignationForm.controls['district'].disable();
                    this.addDesignationForm.controls['ddoNo'].disable();
                    this.addDesignationForm.controls['cardexNo'].disable();
                    this.addDesignationForm.controls['officeName'].disable();
                    this.addDesignationForm.controls['designationName'].disable();
                    this.addDesignationForm.controls['designationShortName'].disable();
                }
                this.districtId = resResult.districtId;
                this.hasObjection = resResult.hasObjection;
                if (this.officeDivision && this.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
                    this.addDesignationForm.patchValue({
                        hasObjection: resResult.hasObjection,
                        objectionRemarks: resResult.objectionRemarks
                    });
                    this.isOfficeDetailSearch = true;
                    this.loadDistrictDetails();
                } else {
                    this.addDesignationForm.patchValue({
                        district: resResult.districtName,
                        ddoNo: resResult.ddoNumber,
                        cardexNo: resResult.cardexNo,
                        officeName: resResult.officeName,
                        designationName: resResult.designationName,
                        designationShortName: resResult.designationShortName,
                        hasObjection: resResult.hasObjection,
                        objectionRemarks: resResult.objectionRemarks
                    });
                }
                if (this.action === 'view') {
                    this.addDesignationForm.disable();
                }
                this.loadAttachmentList(this.designationId);
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages['ADD_DESIGNATION']['ERR_ADD_DESIGNATION_DETAILS']);
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
                    attach['designationId'] = null;
                    attach['size'] = 0;
                    attach['pathUploadFile'] = '';
                    attach['file'] = null;
                    attach['designationAttachId'] = null;
                    if (attach['mandatoryFlag']) {
                        mandatoryAttach.push(attach);
                    } else {
                        nonMandatoryAttach.push(attach);
                    }
                    // this.browseData.push(attach);
                });
                if (this.isDATUser && !this.isDatSuperAdmin) {
                    this.loadAttachmentList(this.designationId);
                }
                this.browseData = mandatoryAttach;
                this.browseData = this.browseData.concat(nonMandatoryAttach);
                this.dataSourceBrowse.data = this.browseData;
                this.isSubmitDisable = false;
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
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
                        this.toastr.error(this.errorMessages['ATTACHMENT']['LARGE_FILE']);
                        this.addAttachment.nativeElement.value = '';
                        this.isUpload = false;
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
        if (this.dataSourceBrowse) {
            const data = this.dataSourceBrowse.data[this.dataSourceBrowse.data.length - 1];
            if (data && data.fileName && data.uploadedFileName) {
                const attachData = this.dataSourceBrowse.data;
                let addman = false;
                if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                    addman = false;
                }
                // else {
                //     addman = true;
                // }
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
                    rolePermId: null,
                    designationId: null,
                    designationAttachId: null,
                    mandatoryFlag: addman
                });
                attachData[0].mandatoryFlag = true;
                if (this.officeDivision && this.officeDivision.toLowerCase() === 'dat') {
                    attachData[0].mandatoryFlag = true;
                }
                this.dataSourceBrowse.data = attachData;
                this.isUpload = true;
            } else {
                this.isUpload = false;
                this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_FILL_ALL_DATA']);
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
            this.isUpload = false;
        }
    }
    removeFile(fileData, removeIndex = null): boolean {
        this.dataSourceBrowse.data.forEach((file, index) => {
            if (file.designationAttachId) {
                const fileSize = Number(fileData.uploadedFileSize);
                if (file.size === fileData.size && file.uploadedFileName === fileData.uploadedFileName &&
                    file.designationAttachId === fileData.designationAttachId) {
                    this.addDesignationService.deleteAddAttachment({
                        id: fileData.designationAttachId
                    }).subscribe((res) => {
                        if (res && res['result'] && res['status'] === 200) {
                            this.totalAttachmentSize = this.totalAttachmentSize - fileSize;
                            file.uploadedByName = '';
                            file.size = 0;
                            file.uploadedFileName = '';
                            file.pathUploadFile = '';
                            file.file = null;
                            file.designationAttachId = null;
                            return true;
                        } else {
                            return false;
                        }
                    }, (err) => {
                        this.toastr.error(err);
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
                file.designationAttachId = null;
                return true;
            }
        });
        return true;
    }
    loadAttachmentList(designationId) {
        const param = {
            'id': designationId
        };
        this.addDesignationService.loadAttachmentDataList(param).subscribe(res => {
            if (res && res['result'] && res['status'] === 200) {
                const resultObject = _.cloneDeep(res['result']);
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
                obj.uploadedByName && obj.designationAttachId === null) {
                if (obj.fileName.trim()) {
                    uploadAttachmentList.append('attch[' + index + '].fileName', obj.fileName.trim());
                    uploadAttachmentList.append('attch[' + index + '].file', obj.file);
                    uploadAttachmentList.append('attch[' + index + '].attachmentId', obj.attachmentId.toString());
                    uploadAttachmentList.append('attch[' + index + '].uploadedFileName', obj.uploadedFileName);
                    uploadAttachmentList.append('attch[' + index + '].pathUploadFile', obj.pathUploadFile);
                    uploadAttachmentList.append(
                        'attch[' + index + '].rolePermId',
                        EdpDataConst.ROLE_PERM_ID.toString()
                    );
                    uploadAttachmentList.append(
                        'attch[' + index + '].designationId',
                        this.designationId.toString()
                    );
                    allowUpload = true;
                    index++;
                }
            }
        });
        if (allowUpload && uploadAttachmentList) {
            this.addDesignationService.uploadADDAttachment(uploadAttachmentList).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    this.toastr.success(this.errorMessages['ATTACHMENT']['UPLOAD_SUCCESS']);
                    this.loadAttachmentList(this.designationId);
                    this.isUpload = false;
                } else {
                    this.isUpload = true;
                }
            }, (err) => {
                this.toastr.error(err);
            });
        } else {
            this.toastr.error(this.errorMessages['ATTACHMENT']['ERR_FILENAME']);
        }
    }
    viewAttachment(attachment) {
        const ID = {
            'id': attachment.designationAttachId
        };
        this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.ADD_DESIGNATION.DOWNLOAD_ATTACHMENT}`,
            ID,
            { responseType: 'blob' as 'json' }
        ).subscribe((res) => {
            const url = window.URL.createObjectURL(res);
            window.open(url, '_blank');
        }, (err) => {
            this.toastr.error(err);
        });
    }
    downloadAttachment(attachment) {
        const ID = {
            'id': attachment.designationAttachId
        };
        this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.ADD_DESIGNATION.DOWNLOAD_ATTACHMENT}`,
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
        }, (err) => {
            this.toastr.error(err);
        });
    }
    resetAttachment() {
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.browseData = [];
                this.loadAttachmentList(this.designationId);
                this.isUpload = false;
            }
        });
    }
    goToListing() {
        this.router.navigate(['/dashboard/edp/designation/list'], { skipLocationChange: true });
    }
    goToDashboard() {
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
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
    resetForm(addDesignationForms: NgForm) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.designationId) {
                    this.action = 'edit';
                }
                if (this.isObjectionRequired) {
                    this.addDesignationForm.controls.hasObjection.reset();
                    this.addDesignationForm.controls.objectionRemarks.reset();
                    this.loadAddUpdateDesignationDeatail(this.designationId);
                } else {
                    if (this.officeDivision && this.officeDivision.toLowerCase() === 'DAT'.toLowerCase()) {
                        addDesignationForms.resetForm();
                        this.loadAddUpdateDesignationDeatail(this.designationId);
                        const district = this.addDesignationForm.controls.district.value;
                        if (district) {
                            this.isOfficeDetailSearch = true;
                        } else {
                            this.isOfficeDetailSearch = false;
                        }
                    } else {
                        this.addDesignationForm.controls.designationName.reset();
                        this.addDesignationForm.controls.designationShortName.reset();
                        this.loadAddUpdateDesignationDeatail(this.designationId);
                    }
                }
                this.saveDraftEnable = false;
                this.isSubmitDisable = true;
            }
        });
    }
    objectionRemarks() {
        if (this.hasObjection) {
            this.hasObjection = true;
            this.addDesignationForm.controls.objectionRemarks.setValidators(Validators.required);
            this.addDesignationForm.controls.objectionRemarks.updateValueAndValidity();
        } else {
            if (this.addDesignationForm.controls.objectionRemarks.value) {
                this.addDesignationForm.controls.objectionRemarks.reset();
            }
            this.hasObjection = false;
            this.addDesignationForm.controls.objectionRemarks.clearValidators();
            this.addDesignationForm.controls.objectionRemarks.updateValueAndValidity();
        }
    }
    openWorkFlow() {
        this.addDesignationService
            .getHeaderDetails({
                'id': this.designationId,
                'menuId': EdpDataConst.MENU.ADD_DESIGNATION_MENU_ID,
                // 'menuId': this.commonService.getMenuId()
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
                        headingName: EdpDataConst.ADD_DESIGNATION,
                        headerJson: headerJson,
                        trnId: this.designationId, // dynamic
                        conditionUrl: 'edp/condition/addNewDesignation/2001', // url
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
                                this.approvedStatus = true;
                                this.workFlowStatus = this.approvedStatus;
                                this.saveDTO(EdpDataConst.STATUS_SUBMITTED);
                            } else {
                                this.goToListing();
                            }
                        }
                    });
                }
            });
    }
    /**
     * @description Checks wheather WF is required or not
     * Param - null
     * @returns  isCheckWorkFlow(boolean)
     */
    checkWf() {
        this.addDesignationService.checkWorkFlow().subscribe((res: any) => {
            if (res && res.result && res['status'] === 200) {
                this.isCheckWorkFlow = res.result;
            }
        });
    }
    /**
     * @description checks wheather Mandatory attachment is required or not
     * Param - null
     * @returns  boolean with true or false
     */
    checkForMandatory() {
        let flag = true;
        this.dataSourceBrowse.data.forEach(obj => {
            if (obj.mandatoryFlag) {
                if (!obj.designationAttachId) {
                    flag = false;
                }
            }
        });
        if (
            !this.dataSourceBrowse.data[0].designationAttachId &&
            !this.isDatSuperAdmin
        ) {
            flag = false;
        }
        return flag;
    }
    hasMandatoryAttachmentUploaded(): boolean {
        const hasAllMandatoryAttachment = this.dataSourceBrowse.data
            .filter(attachement => attachement.mandatoryFlag)
            .every(x => x.designationAttachId > 0);
        return hasAllMandatoryAttachment;
    }
    /**
     * @description WF method for view commwnts popup
     * Param - headerId, menuId
     * @returns  popup with WF data
     */
    viewComments(): void {
        this.addDesignationService.getHeaderDetails({
            'id': this.designationId,
            'menuId': EdpDataConst.MENU.ADD_DESIGNATION_MENU_ID,
        }).subscribe(
            (res: any) => {
                if (res && res.result && res.status === 200) {
                    const headerJson: HeaderJson[] = res.result;
                    this.dialog.open(ViewCommonWorkflowHistoryComponent, {
                        width: '2700px',
                        height: '600px',
                        data: {
                            menuModuleName: ModuleNames.EDP,
                            headingName: EdpDataConst.ADD_DESIGNATION,
                            headerJson: headerJson,
                            trnId: this.designationId,
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
    /**
     * @description pops up when the designation name is already there
     * @returns  result with 100002
     */
    loadAlreadyExistsPopup(res) {
        const dialogRef = this.dialog.open(AlreadyExistsDialogComponent, {
            disableClose: true,
            height: '270px',
            width: '600px',
            data: {
                message: res['message']
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.goToListing();
            }
        });
    }

}
