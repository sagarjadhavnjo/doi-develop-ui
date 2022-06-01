import { OfficeAttachmentComponent } from './../office-attachment/office-attachment.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTab, MatTabHeader, MatTabGroup } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import {
    BillSubmnittedTo, Taluka, BillType, DesignationOfDdo, ListOfBills, CoDesignation, CoOfficeName,
    PVU, IsCoOffice, Status, District, OfficeType, Level, DdoType, NonDdoType, RequestTo,
    TreasuryType, EmployeeName, Department, Hod
} from '../../model/office-data-model';
import { EdpDdoOfficeService } from '../../services/edp-ddo-office.service';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { SubOfficeCreationComponent } from '../sub-office-creation/sub-office-creation.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DatePipe } from '@angular/common';
import { SubOfficeListComponent } from '../sub-office-list/sub-office-list.component';
import { SelectedBillDialogComponent } from '../selected-bill-dialog/selected-bill-dialog.component';
import { CommonService } from 'src/app/modules/services/common.service';
import { CommonWorkflowComponent } from '../../../common/common-workflow/common-workflow.component';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { AlreadyExistDialogComponent } from '../already-exist-dialog/already-exist-dialog.component';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';
import { ViewCommonWorkflowHistoryComponent } from '../../../common/view-common-workflow-history/view-common-workflow-history.component';
@Component({
    selector: 'app-office-updation',
    templateUrl: './office-updation.component.html',
    styleUrls: ['./office-updation.component.css']
})
export class OfficesUpdationComponent implements OnInit {
    action: string;
    transactionNo: string;
    transactionDate: Date;
    trnId: number;
    userType: string;
    officeId: number;
    parentOfficeId: number;
    officeData;
    disableSubOfficeCreate: boolean = false;
    ddoType: string;
    isUpdate: number;
    selectedOption;
    districtId: number;
    cardexNo: string;
    passResult;
    wfRoleIds;
    hodName: string;
    wfRoleCode;
    menuId;
    linkMenuId;
    postId;
    userId;
    officeTypeIdForSubOffice: number;
    lkPoOffUserId;
    hodId: number;
    hodIdFromData: number;
    isHodShow: boolean = true;
    fromDetailOfficeSummary: boolean = false;
    @ViewChild(SubOfficeListComponent) subOfficeList: SubOfficeListComponent;
    @ViewChild(OfficeAttachmentComponent) attachmentView: OfficeAttachmentComponent;
    subOfficeUpdateFlag: boolean = true;
    subOfficeFlag: boolean = false;
    districtID;
    deptId: any;
    officeDivision: string;
    subscribeParams: Subscription;
    displayedColumns = new BehaviorSubject<any[]>(['noData']);
    ddoForm: FormGroup;
    ddoOfficeName: string;
    ddoSubOffice: FormGroup;
    selectedIndex: number;
    fileBrowseIndex: number;
    date = new Date().toISOString();
    branchId: number;
    branchName: string;
    isObjection: boolean = false;
    firstTimeLoad: boolean = true;
    statusCopy: string = '';

    isDepartmentVisible: boolean = true;
    isHOD: boolean = false;
    saveDraftEnable: boolean = false;
    updateOffice: boolean = false;
    isCoOfficeNameRequired: boolean = false;
    isCoDesignationRequired: boolean = false;
    tabDisable: boolean = true;
    isCreateShow: boolean = false;
    isSubOfficeEnable: boolean = true;
    isOnlySummaryView: boolean = true;
    isEditAttachment: boolean = true;
    isActiveSelected: boolean;
    isInActiveSelected: boolean;
    isCancelSelected: boolean;
    isSelected: boolean;
    objStatus: boolean = false;
    isBillNotMapped: boolean;

    isNonDDO: boolean = false;
    isDDOUser: boolean = false;
    isDatUser: boolean = false;
    isGadUser: boolean = false;
    isHodUser: boolean = false;
    isToPaoUser: boolean = false;
    isEdpUser: boolean = false;
    isDatSuperAdmin: boolean = false;
    isJD: boolean = false;
    enableObjection: boolean = true;
    isAdUser: boolean = false;
    navFromDetailOfficeSummary: boolean = false;

    isHidden: boolean = false;
    isShown: boolean = true;
    isOfficeDivision: boolean = false;
    isSubmitDisable: boolean = false;
    isCntrlOfficer: boolean = true;
    isTreasuryType: boolean = false;
    isTalukaRequired: boolean = false;
    isHODRequired: boolean = false;
    billSubmitDisabled: boolean = true;
    isDisplaySubOffice: boolean = false;
    districtName: string;
    errorMessages = {};
    displayedBrowseColumns = ['attachmentType', 'fileName', 'browse', 'uploadedFileName', 'uploadedBy', 'action'];

    subOfficesList = new MatTableDataSource([]);
    subOfficeColumn = ['srNo', 'subOfficeCode', 'ddoOfficeName', 'department', 'hod', 'district', 'taluka', 'action'];


    // Office Detail List Variables
    districtList: District[] = [];
    districtListTrans: District[] = [];
    officeTypeList: OfficeType[] = [];
    officeTypeData: OfficeType[] = [];
    levelList: Level[] = [];
    levelData: Level[] = [];
    ddoTypeList: DdoType[] = [];
    ddoTypeData: DdoType[] = [];
    nonDDOTypeList: NonDdoType[] = [];
    pvuList: PVU[] = [];
    pvuData: PVU[] = [];
    designationList: DesignationOfDdo[] = [];
    requestToData: RequestTo[] = [];
    requestToList: RequestTo[] = [];
    treasuryTypeList: TreasuryType[] = [];
    isCoOfficeList: IsCoOffice[] = [];
    employeeData: EmployeeName[] = [];
    talukaList: Taluka[] = [];
    departmentList: Department[] = [];
    departmentListCopy: Department[] = [];
    departmentToSubOffice: Department[] = [];
    hodList: Hod[] = [];
    coDesignationList: CoDesignation[] = [];
    coOfficeList: CoOfficeName[] = [];
    billSubmittedToList: BillSubmnittedTo[] = [];
    billTypeList: BillType[] = [];
    billList: ListOfBills[] = [];
    statusList: Status[] = [];
    isOfficeList: IsCoOffice[] = [];
    departmentIdFromLogin: number;
    isDepartmentShowInSubOffice: boolean = true;
    hodIdFromLogin: number;
    isHodShowInSubOffice: boolean = true;

    districtCtrl: FormControl = new FormControl();
    districtCtrlTrans: FormControl = new FormControl();
    treasuryCtrl: FormControl = new FormControl();
    addDistrictCtrl: FormControl = new FormControl();
    talukaCtrl: FormControl = new FormControl();
    designationCtrl: FormControl = new FormControl();
    departmentCtrl: FormControl = new FormControl();
    officeTypeCtrl: FormControl = new FormControl();
    levelCtrl: FormControl = new FormControl();
    pvuCtrl: FormControl = new FormControl();
    requestCtrl: FormControl = new FormControl();
    hodCtrl: FormControl = new FormControl();
    coNameCtrl: FormControl = new FormControl();
    coOfficeNameCtrl: FormControl = new FormControl();
    billSubmittedToCtrl: FormControl = new FormControl();
    listOfBillCtrl: FormControl = new FormControl();
    selectedBillCtrl: FormControl = new FormControl();

    autoSetHodEnable: boolean = true;

    browseData: any[] = [{
        name: undefined,
        file: undefined
    }];
    dataSourceBrowse = new MatTableDataSource(this.browseData);
    prevOfficeStatusDisable: boolean = false;
    isSubOfficeEditDisable: boolean = false;
    isSavedRequet: boolean = false;
    isSummarySaved: any;
    userDetails;
    hasWorkFlow: boolean = false;
    departId: number;
    userOffice;
    currentUser;
    userTypeForSubOffice: any;
    loadSubOffice: boolean = false;
    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;
    loggedUserObj;
    transferOfficeEnable: boolean = false;
    transferOfficeDetail: any;
    departName: string;
    @ViewChild('headerTabGroup', { static: true })
    headerTabGroup: MatTabGroup;
    officeDataFromLogin;
    isWfInReq: boolean = false;
    officeIdCopy: number;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private edpDdoOfficeService: EdpDdoOfficeService,
        private activatedRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private router: Router,
        private storageService: StorageService,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.createForm();
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.isUpdate = Number(resRoute.update);
            if (
                Number(this.isUpdate) ===
                Number(EdpDataConst.NAVIAGTE_FROM_UPDATION_LIST)) { // from Office Updation List
                this.officeIdCopy = Number(resRoute.officeId);
            } else {
                this.officeIdCopy = Number(resRoute.id);
            }
        });
        this.headerTabGroup._handleClick = this.interceptTabChange.bind(this);
        this.officeDataFromLogin = this.storageService.get('userOffice');
        const userOffice = this.storageService.get('currentUser');
        const loginPost = userOffice['post'].filter(item => item['loginPost'] === true);
        this.loggedUserObj = loginPost;
        this.errorMessages = msgConst.DDO_OFFICE;
        this.currentUser = userOffice;
        this.isWorkFlowEnabled();
    }

    /**
     * @description To set User Type
     */

    setUserType() {
        const wfRoleId: number[] = this.commonService.getwfRoleId()[0]['wfRoleIds'];
        const wfRoleIdArr: any[] = this.commonService.getwfRoleId();
        const linkMenuWfRoleIdArr: any[] = this.commonService.getLinkMenuWfRoleId();
        let wfRoleArr: number[] = [];
        wfRoleIdArr.forEach(e => {
            wfRoleArr.push(e.wfRoleIds[0]);
        });
        if (linkMenuWfRoleIdArr) {
            wfRoleArr = [];
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
            wfRoleArr.indexOf(EdpDataConst.USERTYPE_DAT_SUPER_ADMIN) !== -1 && !this.hasWorkFlow) {
            this.isDatSuperAdmin = true;
        } else {
            this.isDatSuperAdmin = false;
        }

        if (wfRoleId.indexOf(EdpDataConst.USERTYPE_JD) !== -1) {
            this.isJD = true;
        }

        if (this.officeDivision === EdpDataConst.OFFICE_DIVISION_DAT) {
            this.isOfficeDivision = true;
            this.isShown = false;
            this.isGadUser = true;
        } else {
            this.isOfficeDivision = false;
            this.isShown = true;
            this.isGadUser = false;
        }

        if (this.officeDataFromLogin) {
            if (
                this.officeDataFromLogin.officeName.toLowerCase() ===
                EdpDataConst.ACCOUNT_AND_TREASURY_OFFICE_1.toLowerCase() ||
                this.officeDataFromLogin.officeName.toLowerCase() ===
                EdpDataConst.ACCOUNT_AND_TREASURY_OFFICE_2.toLowerCase()
            ) {
                if (!this.isDatSuperAdmin) {
                    this.isDatUser = true;
                }
            } else {
                this.isTreasuryType = false;
            }
        } else {
            this.isTreasuryType = false;
        }

        this.parentOfficeId = this.officeDataFromLogin['officeId'];

        if (this.officeDivision === EdpDataConst.OFFICE_DIVISION_DAT) {
            this.userType = 'edp_user';
            this.isEdpUser = true;
        } else if (
            (this.officeDataFromLogin['isTreasury'] === EdpDataConst.OFFICE_DATA_FOR_TREASURY ||
                this.officeDataFromLogin['officeSubType'] === EdpDataConst.IS_PO_USER) &&
            !(this.parentOfficeId === this.officeIdCopy)
        ) {
            this.userType = 'to_user';
            this.isToPaoUser = true;
        } else if (this.officeDataFromLogin['isHod'] === EdpDataConst.OFFICE_DATA_FOR_HOD) {
            this.userType = 'hod_user';
            this.isHodUser = true;
        } else if (
            this.officeDataFromLogin['officeTypeId'] === EdpDataConst.OFFICE_TYPE_ID_FOR_DDO
            && this.officeDataFromLogin['officeSubType'] === EdpDataConst.SUB_OFFICE_TYPE_FOR_DDO
        ) {
            this.isDDOUser = true;
        } else if ((
            this.officeDataFromLogin['isTreasury'] === EdpDataConst.OFFICE_DATA_FOR_TREASURY ||
            this.officeDataFromLogin['officeSubType'] === EdpDataConst.IS_PO_USER) &&
            (this.parentOfficeId === this.officeIdCopy)
        ) {
            this.isDDOUser = true;
        } else if ((
            this.officeDataFromLogin['isTreasury'] === EdpDataConst.OFFICE_DATA_FOR_TREASURY ||
            this.officeDataFromLogin['officeSubType'] === EdpDataConst.IS_PO_USER) &&
            (this.parentOfficeId === this.officeIdCopy)
        ) {
            this.isDDOUser = true;
        } else if (this.isDatSuperAdmin === false) {
            this.isAdUser = true;
        }
        if (this.isDatUser &&
            (wfRoleId.indexOf(EdpDataConst.WF_CREATOR_ROLE) !== -1
                || wfRoleId.indexOf(EdpDataConst.WF_VERIFIER_ROLE) !== -1
                || wfRoleId.indexOf(EdpDataConst.WF_APPROVER_ROLE) !== -1
            ) && wfRoleArr.indexOf(EdpDataConst.USERTYPE_DAT_SUPER_ADMIN) === -1) {
            this.isHodUser = true;
            this.isDatUser = false;
            this.enableObjection = false;
        }

        this.userTypeForSubOffice = {
            isHodUser: this.isHodUser,
            isEdpUser: this.isEdpUser,
            isToPaoUser: this.isToPaoUser,
            isDDOUser: this.isDDOUser,
            isAdUser: this.isAdUser,
            isDatUser: this.isDatUser,
            isDatSuperAdmin: this.isDatSuperAdmin,
            isJD: this.isJD
        };
        if (!this.isWfInReq) {
            this.toGetData();
        } else {
            this.fieldsValidation();
        }
        if (this.action === 'view') {
            this.ddoForm.disable();
        }
    }

    /**
     * To get Data.
     */

    toGetData() {
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            this.transactionDate = resRoute.transDate;
            this.isUpdate = Number(resRoute.update);
            this.fieldsValidation();
            if (Number(this.isUpdate) !== Number(EdpDataConst.NAVIAGTE_FROM_UPDATION_LIST)) {
                this.navFromDetailOfficeSummary = true;
            }
            if (this.action === 'edit' || this.action === 'view') {
                if (
                    Number(this.isUpdate) ===
                    Number(EdpDataConst.NAVIAGTE_FROM_UPDATION_LIST)) { // from Office Updation List
                    this.subOfficeFlag = true;
                    this.transactionNo = resRoute.id;
                    this.officeId = +resRoute.officeId;
                    this.isOnlySummaryView = false;
                    this.isSubOfficeEditDisable = false;
                } else {
                    this.isSubOfficeEnable = false;
                    this.subOfficeFlag = false;  // from summary list
                    this.officeId = +resRoute.id;
                    this.isOnlySummaryView = true;
                    this.isSubOfficeEditDisable = true;
                }
                if (Number(resRoute.update) === Number(EdpDataConst.NAVIAGTE_FROM_UPDATION_LIST)) {
                    this.updateOffice = true;
                    this.isHidden = true;
                }
                if (this.officeId || this.transactionNo) {
                    this.getOfficeDetails();
                    if (this.action === 'view') {
                        this.ddoForm.disable();
                    }
                } else {
                    this.router.navigate(['..'], { relativeTo: this.activatedRoute, skipLocationChange: true });
                }
            } else {
                this.router.navigate(['..'], { relativeTo: this.activatedRoute, skipLocationChange: true });
            }
        });

        this.ddoForm.valueChanges.subscribe(() => {
            this.saveDraftEnable = true;
            this.isSubmitDisable = true;
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

    /**
     * @description To get the office Details
     */

    getOfficeDetails() {
        this.edpDdoOfficeService.getOfficeDetails('').subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.fieldsValidation();
                this.districtList = res['result']['districts'];
                this.districtListTrans = _.cloneDeep(res['result']['districts']);
                this.officeTypeList = res['result']['officeType'];
                this.officeTypeData = _.cloneDeep(res['result']['officeType']);
                if (this.isGadUser) {
                    this.officeTypeList = _.cloneDeep(this.officeTypeData);
                }
                this.levelList = res['result']['level'];
                this.levelData = _.cloneDeep(res['result']['level']);
                this.ddoTypeList = res['result']['ddoType'];
                this.ddoTypeData = _.cloneDeep(res['result']['ddoType']);
                this.nonDDOTypeList = res['result']['nonDdoType'];
                this.pvuList = res['result']['pvu'];
                this.pvuData = _.cloneDeep(res['result']['pvu']);
                this.designationList = res['result']['designationOfDdo'];
                this.requestToData = _.cloneDeep(res['result']['requestTos']);
                this.isCoOfficeList = res['result']['controllingOffice'];
                this.coDesignationList = res['result']['designationOfDdo'];
                // this.billSubmittedToList = _.cloneDeep(res['result']['billSubmittedTo']);
                this.billTypeList = res['result']['billType'];
                this.billList = res['result']['listsofBill'];
                this.coOfficeList = res['result']['coOffice'];
                this.statusList = res['result']['updateStatus'];
                this.departmentList = res['result']['departments'];
                this.departName = this.loggedUserObj[0]['oauthTokenPostDTO']['edpMsOfficeDto']['deptName'];
                this.departId = this.loggedUserObj[0]['oauthTokenPostDTO']['edpMsOfficeDto']['departmentId'];
                this.departmentIdFromLogin = _.cloneDeep(this.departId);
                this.hodId = this.loggedUserObj[0]['oauthTokenPostDTO']['edpMsOfficeDto']['hodId'];
                this.hodIdFromLogin = _.cloneDeep(this.hodId);
                this.hodName = this.loggedUserObj[0]['oauthTokenPostDTO']['edpMsOfficeDto']['hodName'];
                this.departmentListCopy = res['result']['department'];
                if (this.departId) {
                    this.ddoForm.patchValue({
                        departmentId: this.officeDivision === EdpDataConst.OFFICE_DIVISION_DAT ?
                            this.deptId : this.departmentList.filter(e => e.id === this.departId)[0].name
                    });
                }
                const param = {
                    id: this.departId ? this.departId : 0
                };
                this.edpDdoOfficeService.getHodList(param).subscribe(data => {
                    this.hodList = data['result'];
                    if (this.hodId) {
                        this.ddoForm.patchValue({
                            hodId: this.officeDivision === EdpDataConst.OFFICE_DIVISION_DAT ?
                                this.hodId : this.hodList.filter(e => e.id === this.hodId)[0].name
                        });
                    }
                });

                if (this.action === 'edit' || this.action === 'view') {
                    if (this.transactionNo) {
                        this.getOfficeSummaryUpdateDetails(this.transactionNo);
                    } else {
                        this.fromDetailOfficeSummary = true;
                        this.getOfficeUpdateDetails(this.officeId);
                    }
                }
            } else {
                this.toastr.error(res['message']);
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages['ERR_OFFICE_MASTER_DATA']);
            });
    }

    /**
     * @description To load treasury Type
     */

    loadTreasuryType() {
        const req = this.ddoForm.controls.requestTo.value;
        const tresury = this.requestToList.filter((data) => {
            return data['id'] === req;
        })[0];
        if (tresury) {
            this.treasuryTypeList = tresury['tresuryType'];
        }
    }

    /**
     * @description To Reset the Form
     * @param ddoForms formGroup
     */

    resetForm(ddoForms: NgForm) {

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.officeId) {
                    this.action = 'edit';
                }
                ddoForms.resetForm();
                this.getOfficeDetails();
            }
        });
    }

    /**
     * @description To create the form
     */

    createForm() {
        this.ddoForm = this.fb.group({
            grNo: [''],
            uniqueId: [''],
            districtId: [''],
            officeTypeId: [''],
            levelId: [''],
            officeName: ['', Validators.required],
            cardexno: [''],
            ddoNo: [''],
            ddoType: ['', Validators.required],
            nonDdo: [''],
            pvuId: ['', Validators.required],
            desgDdoId: ['', Validators.required],
            requestTo: [''],
            treasuryType: [''],
            isCo: [''],
            employeeNo: ['', [Validators.minLength(10), Validators.maxLength(10)]],
            employeeName: [''],
            addrLine1: ['', Validators.required],
            addrLine2: [''],
            addDistrict: [''],
            talukaId: [''],
            station: [''],
            pincode: ['', [Validators.minLength(6), Validators.maxLength(6)]],
            stdCode: [''],
            phoneNo: ['', [Validators.minLength(8), Validators.maxLength(8)]],
            mobileNo: ['', [Validators.minLength(10), Validators.maxLength(10)]],
            faxNo: ['', [Validators.minLength(10), Validators.maxLength(10)]],
            emailId: ['', Validators.compose([Validators.pattern(EdpDataConst.PATTERN.EMAIL)])],
            officeNameDisp: [''],
            departmentId: [''],
            hodId: [''],
            coId: [''],
            coOfficeName: [''],
            billSubmittedTo: ['', Validators.required],
            billType: ['', Validators.required],
            selectedBills: [[]],
            officeStatus: [''],
            officeStartDate: [''],
            officeEndDate: [''],
            offStComments: [''],
            objStatus: [''],
            objRemark: [''],
            districtIdTrans: [''],
            cardexnoTrans: [''],
            ddoNoTrans: [''],
            officeNameTrans: ['']
        });
    }

    /**
     * @description Fields enable disable as per User.
     */

    fieldsValidation() {
        this.ddoForm.get('uniqueId').disable();
        this.ddoForm.controls.cardexno.disable();
        this.ddoForm.controls.addDistrict.disable();
        this.ddoForm.controls.officeNameTrans.disable();
        this.ddoForm.controls.officeNameDisp.disable();
        this.ddoForm.controls.districtId.disable();
        this.ddoForm.controls.ddoNo.disable();
        this.ddoForm.controls.officeStartDate.disable();
        this.ddoForm.controls.officeEndDate.disable();
        this.ddoForm.controls.offStComments.disable();
        this.ddoForm.controls.employeeName.disable();
        if ((this.isHodUser || this.isAdUser) && this.hasWorkFlow) {
            this.ddoForm.controls.officeTypeId.disable();
            this.ddoForm.controls.levelId.disable();
            this.ddoForm.controls.requestTo.disable();
            this.ddoForm.controls.treasuryType.disable();
            this.ddoForm.controls.isCo.disable();
            this.ddoForm.get('employeeNo').disable();
            this.ddoForm.controls.ddoNo.disable();
            this.ddoForm.controls.ddoType.disable();
            this.ddoForm.controls.nonDdo.disable();
            this.ddoForm.controls.departmentId.disable();
            this.ddoForm.controls.hodId.disable();
            this.ddoForm.controls.officeStartDate.disable();
            this.ddoForm.controls.offStComments.disable();
        } else if (this.isDDOUser && this.hasWorkFlow) {
            this.ddoForm.controls.officeTypeId.disable();
            this.ddoForm.controls.levelId.disable();
            this.ddoForm.controls.requestTo.disable();
            this.ddoForm.controls.treasuryType.disable();
            this.ddoForm.controls.isCo.disable();
            this.ddoForm.get('employeeNo').disable();
            this.ddoForm.controls.ddoNo.disable();
            this.ddoForm.controls.ddoType.disable();
            this.ddoForm.controls.nonDdo.disable();
            this.ddoForm.controls.departmentId.disable();
            this.ddoForm.controls.hodId.disable();
            this.ddoForm.controls.officeStartDate.disable();
            this.ddoForm.controls.offStComments.disable();
            this.ddoForm.controls.officeName.disable();
            this.ddoForm.controls.pvuId.disable();
            this.ddoForm.controls.desgDdoId.disable();
        } else if (this.isToPaoUser && this.hasWorkFlow) {
            this.disableSubOfficeCreate = true;
            this.ddoForm.disable();
            this.ddoForm.get('objRemark').enable();
            this.ddoForm.get('objStatus').enable();
        } else if (this.isDatUser && this.hasWorkFlow) {
            this.ddoForm.disable();
            this.disableSubOfficeCreate = this.isDatSuperAdmin ? false : true;
        } else if (this.isJD) {
            this.disableSubOfficeCreate = true;
        }
        if (this.action === 'view') {
            this.ddoForm.disable();
        }
        if (this.isDatSuperAdmin) {
            this.isTreasuryType = true;
        }
        this.ddoForm.controls.pvuId.setValidators([Validators.required]);
        this.ddoForm.controls.pvuId.updateValueAndValidity();
        this.ddoForm.updateValueAndValidity();
    }

    /**
     * @description To enable fields for Objection
     */

    enableObjectionFields() {
        if (this.isDatUser && this.hasWorkFlow) {
            this.ddoForm.controls.objRemark.enable();
            this.ddoForm.controls.objStatus.enable();
        }
    }

    validateFieldsHideShow(officeTypeId) {
        this.officeTypeIdForSubOffice = officeTypeId;
        this.loadSubOffice = true;
        if (Number(officeTypeId) === Number(EdpDataConst.ADMINISTRATIVE_DEPARTMENT_OFFICE_TYPE_ID)) {
            this.isHodShow = false;
            this.isDepartmentVisible = false;
            this.ddoForm.controls.hodId.reset();
            this.ddoForm.controls.departmentId.reset();
        } else if (Number(officeTypeId) === Number(EdpDataConst.HOD_OFFICE_TYPE_ID)) {
            this.isHodShow = false;
            this.isDepartmentVisible = true;
            this.ddoForm.controls.hodId.reset();
        } else if (Number(officeTypeId) === Number(EdpDataConst.DDO_OFFICE_TYPE_ID)) {
            this.isDepartmentVisible = true;
            this.isHodShow = true;
        }
        this.ddoForm.patchValue({
            officeTypeId: officeTypeId
        });
        if (this.subOfficeList) {
            this.subOfficeList.hideShowAsOfficeTypeId(officeTypeId);
        }
    }

    /**
     * @description to get office Update Details
     * @param id Office ID i.e. primary key
     */

    getOfficeUpdateDetails(id) {
        const param = {
            id: id
        };
        this.edpDdoOfficeService.getOfficeUpdateDetails(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const data = _.cloneDeep(res['result']);
                this.isObjection = data.objection === 2 ? true : false;
                this.districtID = data.districtId;
                this.hodName = data.hodName;
                this.hodId = data.hodId;
                this.statusCopy = data['officeStatus'];
                this.districtId = data.districtId;
                const presentDistrictIndex = this.districtListTrans.findIndex(e => e.id === this.districtID);
                this.districtListTrans.splice(presentDistrictIndex, 1);
                this.officeData = res['result'];
                this.departId = _.cloneDeep(data.departmentId);
                this.departName = data.deptName;
                if (this.pvuList.filter(e => e.id === data.pvuId).length === 0 && data.pvuId !== data.officeId) {
                    data.pvuId = null;
                }
                if (data) {
                    if (data.districtId) {
                        this.districtId = res['result']['districtId'];
                        this.cardexNo = res['result']['cardexno'];
                        this.ddoForm.controls.cardexno.setValue(this.cardexNo);
                        this.isSubOfficeEnable = false;
                    }
                    const datePipe = new DatePipe('en-US');
                    let dateArray;
                    if (data['officeEndDate']) {
                        const endDatedata = new Date(data['officeEndDate']);
                        const dataDate = this.datePipe.transform(endDatedata, 'yyyy-MM-dd').toString();
                        dateArray = dataDate.split('-');
                        dateArray = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                    }
                    this.patchOfficeTransferDetail(data);
                    if (this.officeDivision !== EdpDataConst.OFFICE_DIVISION_DAT) {
                        this.ddoForm.patchValue({
                            grNo: data.grNo,
                            uniqueId: data.uniqueId,
                            districtId: data.districtId,
                            officeTypeId: data.officeTypeId,
                            levelId: data.levelId,
                            officeName: data.officeName,
                            cardexno: data.cardexno,
                            ddoNo: data.ddoNo,
                            ddoType: data.ddoType,
                            nonDdo: data.nonDdo,
                            pvuId: data.pvuId === null ? null : (data.pvuId === data.officeId) ? 0 : data.pvuId,
                            desgDdoId: data.desgDdoId,
                            requestTo: data.requestTo,
                            treasuryType: data.treasuryType,
                            isCo: data.isCo,
                            employeeNo: data.employeeNo,
                            employeeName: data.employeeName,
                            addrLine1: data.addrLine1,
                            addrLine2: data.addrLine2,
                            talukaId: data.talukaId,
                            station: data.station,
                            pincode: data.pincode,
                            phoneNo: data.phoneNo,
                            mobileNo: data.mobileNo,
                            faxNo: data.faxNo,
                            emailId: data.emailId,
                            departmentId: data.deptName ? data.deptName : this.departName,
                            hodId: this.hodName ? this.hodName : this.hodList['name'],
                            coId: data.coId,
                            coOfficeName: data.coOfficeName,
                            officeNameDisp: data.officeNameDisp,
                            billSubmittedTo: data.billSubmittedTo,
                            billType: data.billType,
                            selectedBills: data.selectedBills,
                            officeStatus: data['officeStatus'],
                            officeStartDate: datePipe.transform(data['createdDate'], 'dd/MM/yyyy'),
                            offStComments: data['offStComments'],
                            objStatus: data['objStatus'] === 2 ? true : false,
                            objRemark: data['objectionRemarks']
                        });

                        this.objStatus = data['objStatus'] === 2 ? true : false;
                        this.deptId = this.departmentListCopy ? this.departmentListCopy['name'] : null;
                        this.validateFieldsHideShow(data.officeTypeId);
                    } else {
                        this.ddoForm.patchValue({
                            grNo: data.grNo,
                            uniqueId: data.uniqueId,
                            districtId: data.districtId,
                            officeTypeId: data.officeTypeId,
                            levelId: data.levelId,
                            officeName: data.officeName,
                            cardexno: data.cardexno,
                            ddoNo: data.ddoNo,
                            ddoType: data.ddoType,
                            nonDdo: data.nonDdo,
                            pvuId: data.pvuId === null ? null : (data.pvuId === data.officeId) ? 0 : data.pvuId,
                            desgDdoId: data.desgDdoId,
                            requestTo: data.requestTo,
                            treasuryType: data.treasuryType,
                            isCo: data.isCo,
                            employeeNo: data.employeeNo,
                            employeeName: data.employeeName,
                            addrLine1: data.addrLine1,
                            addrLine2: data.addrLine2,
                            talukaId: data.talukaId,
                            station: data.station,
                            pincode: data.pincode,
                            phoneNo: data.phoneNo,
                            mobileNo: data.mobileNo,
                            faxNo: data.faxNo,
                            emailId: data.emailId,
                            departmentId: this.departId,
                            hodId: this.hodId,
                            coId: data.coId,
                            coOfficeName: data.coOfficeName,
                            officeNameDisp: data.officeNameDisp,
                            billSubmittedTo: data.billSubmittedTo,
                            billType: data.billType,
                            selectedBills: data.selectedBills,
                            officeStatus: data['officeStatus'],
                            officeStartDate: datePipe.transform(data['createdDate'], 'dd/MM/yyyy'),
                            offStComments: data['offStComments'],
                            objStatus: data['objStatus'] === 2 ? true : false,
                            objRemark: data['objectionRemarks']
                        });
                        this.validateFieldsHideShow(data.officeTypeId);
                        this.objStatus = data['objStatus'] === 2 ? true : false;
                        this.deptId = data.deptName;
                        this.departmentSelected();
                    }
                    if (
                        !data['officeStatus'] || data['officeStatus'] === EdpDataConst.OFFICE_STATUS_ACTIVE
                    ) {
                        const status = this.statusList.filter(statusObj => {
                            return statusObj.name.toLowerCase() === 'Active'.toLowerCase();
                        })[0];
                        if (status) {
                            this.ddoForm.controls.officeStatus.setValue(status.id);
                        }
                    }
                    if (data.ddoType === 69) {
                        this.isNonDDO = true;
                        this.ddoForm.controls.nonDdo.setValidators(Validators.required);
                        this.ddoForm.controls.nonDdo.updateValueAndValidity();
                    } else {
                        this.isNonDDO = false;
                        this.ddoForm.controls.nonDdo.setValue('');
                        this.ddoForm.controls.nonDdo.clearValidators();
                    }
                    this.oficeDetailDistrictChange();
                    this.loadTreasuryType();
                    this.selectBill();
                    this.selectStatus();
                    this.hodDisbaled();
                    this.displayOfficeName();
                    this.ddoForm.patchValue({
                        officeEndDate: dateArray,
                    });
                    this.saveDraftEnable = true;
                    this.isSubmitDisable = true;
                    if (this.action !== 'view' && data.prvOfficeStatusId && data.prvOfficeStatus &&
                        data.prvOfficeStatusId === EdpDataConst.PRV_OFFICE_STATUS_INACTIVE &&
                        data.prvOfficeStatus.toLowerCase() === EdpDataConst.INACTIVE_STATUS) {
                        this.prevOfficeStatusDisable = true;
                        this.ddoForm.controls.selectedBills.disable();
                        this.disableFieldsForInactiveStatus();
                    }
                    if (this.action === 'view') {
                        this.ddoForm.disable();
                    }
                }
                this.officeBillMapping();
            } else {
                this.toastr.error(res['message']);
            }
        });
    }

    /**
     * Disable fields when Status is Inactive
     */

    disableFieldsForInactiveStatus() {
        this.ddoForm.disable();
        this.ddoForm.controls.nonDdo.disable();
        this.ddoForm.controls.officeStatus.enable();
        this.ddoForm.controls.officeEndDate.enable();
        this.ddoForm.controls.offStComments.enable();
        if (!this.disableSubOfficeCreate) {
            this.ddoForm.controls.officeEndDate.enable();
        }
        this.isSubOfficeEnable = true;
        this.isEditAttachment = false;
        this.isSubOfficeEditDisable = true;
    }

    /**
     * To get Office Summary Details
     * @param id Transaction Number
     */

    getOfficeSummaryUpdateDetails(id) {
        const param = {
            trnNo: id
        };

        this.edpDdoOfficeService.getOfficeSummaryUpdateDetails(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const data = _.cloneDeep(res['result']);
                this.districtID = data.districtId;
                this.districtId = data.districtId;
                const presentDistrictIndex = this.districtListTrans.findIndex(e => e.id === this.districtID);
                this.districtListTrans.splice(presentDistrictIndex, 1);
                this.trnId = data.trnId;
                this.officeData = res['result'];
                this.passResult = data;
                this.hodName = data.hodName;
                this.departName = data.deptName;
                this.hodId = data.hodId;
                this.statusCopy = data['officeStatus'];
                if (!this.hasWorkFlow) {
                    this.hasWorkFlow = data.wfInRequest === 2 ? true : false;
                    this.isWfInReq = true;
                    this.setUserType();
                }
                this.departId = _.cloneDeep(data.departmentId);
                if (this.pvuList.filter(e => e.id === data.pvuId).length === 0 && data.pvuId !== data.officeId) {
                    data.pvuId = null;
                }
                if (data) {
                    if (data.districtId) {
                        this.districtId = res['result']['districtId'];
                        this.cardexNo = res['result']['cardexno'];
                        this.ddoForm.controls.cardexno.setValue(this.cardexNo);
                        this.isSubOfficeEnable = false;
                    }

                    const datePipe = new DatePipe('en-US');
                    let dateArray;
                    if (data['officeEndDate']) {
                        const endDatedata = new Date(data['officeEndDate']);
                        const dataDate = this.datePipe.transform(endDatedata, 'yyyy-MM-dd').toString();
                        dateArray = dataDate.split('-');
                        dateArray = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                    }
                    this.patchOfficeTransferDetail(data);
                    if (this.officeDivision !== EdpDataConst.OFFICE_DIVISION_DAT) {
                        this.ddoForm.patchValue({
                            grNo: data.grNo,
                            uniqueId: data.uniqueId,
                            districtId: data.districtId,
                            officeTypeId: data.officeTypeId,
                            levelId: data.levelId,
                            officeName: data.officeName,
                            cardexno: data.cardexno,
                            ddoNo: data.ddoNo,
                            ddoType: data.ddoType,
                            nonDdo: data.nonDdo,
                            pvuId: data.pvuId === null ? null : (data.pvuId === data.officeId) ? 0 : data.pvuId,
                            desgDdoId: data.desgDdoId,
                            requestTo: data.requestTo,
                            treasuryType: data.treasuryType,
                            isCo: data.isCo,
                            employeeNo: data.employeeNo,
                            employeeName: data.employeeName,
                            addrLine1: data.addrLine1,
                            addrLine2: data.addrLine2,
                            talukaId: data.talukaId,
                            station: data.station,
                            pincode: data.pincode,
                            phoneNo: data.phoneNo,
                            mobileNo: data.mobileNo,
                            faxNo: data.faxNo,
                            emailId: data.emailId,
                            departmentId: data.deptName ? data.deptName : this.departName,
                            hodId: this.hodName ? this.hodName : this.hodList['name'],
                            coId: data.coId,
                            coOfficeName: data.coOfficeName,
                            officeNameDisp: data.officeNameDisp,
                            billSubmittedTo: data.billSubmittedTo,
                            billType: data.billType,
                            selectedBills: data.selectedBills,
                            officeStatus: data['officeStatus'],
                            officeStartDate: datePipe.transform(data['createdDate'], 'dd/MM/yyyy'),
                            offStComments: data['offStComments'],
                            objStatus: data['objStatus'] === 2 ? true : false,
                            objRemark: data['objectionRemarks']
                        });
                        this.validateFieldsHideShow(data.officeTypeId);
                        this.deptId = this.departmentListCopy ? this.departmentListCopy['name'] : null;
                        this.objStatus = data['objStatus'] === 2 ? true : false;
                    } else {
                        this.ddoForm.patchValue({
                            grNo: data.grNo,
                            uniqueId: data.uniqueId,
                            districtId: data.districtId,
                            officeTypeId: data.officeTypeId,
                            levelId: data.levelId,
                            officeName: data.officeName,
                            cardexno: data.cardexno,
                            ddoNo: data.ddoNo,
                            ddoType: data.ddoType,
                            nonDdo: data.nonDdo,
                            pvuId: data.pvuId === null ? null : (data.pvuId === data.officeId) ? 0 : data.pvuId,
                            desgDdoId: data.desgDdoId,
                            requestTo: data.requestTo,
                            treasuryType: data.treasuryType,
                            isCo: data.isCo,
                            employeeNo: data.employeeNo,
                            employeeName: data.employeeName,
                            addrLine1: data.addrLine1,
                            addrLine2: data.addrLine2,
                            talukaId: data.talukaId,
                            station: data.station,
                            pincode: data.pincode,
                            phoneNo: data.phoneNo,
                            mobileNo: data.mobileNo,
                            faxNo: data.faxNo,
                            emailId: data.emailId,
                            departmentId: this.departId,
                            hodId: this.hodId,
                            coId: data.coId,
                            coOfficeName: data.coOfficeName,
                            officeNameDisp: data.officeNameDisp,
                            billSubmittedTo: data.billSubmittedTo,
                            billType: data.billType,
                            selectedBills: data.selectedBills,
                            officeStatus: data['officeStatus'],
                            officeStartDate: datePipe.transform(data['createdDate'], 'dd/MM/yyyy'),
                            offStComments: data['offStComments'],
                            objStatus: data['objStatus'] === 2 ? true : false,
                            objRemark: data['objectionRemarks']
                        });
                        this.validateFieldsHideShow(data.officeTypeId);
                        this.objStatus = data['objStatus'] === 2 ? true : false;
                        this.deptId = data.deptName;
                        this.departmentSelected();
                    }
                    if (!data['officeStatus'] || data['officeStatus'] === EdpDataConst.OFFICE_STATUS_ACTIVE) {
                        const status = this.statusList.filter(statusObj => {
                            return statusObj.name.toLowerCase() === EdpDataConst.ACTIVE_STATUS.toLowerCase();
                        })[0];
                        if (status) {
                            this.ddoForm.controls.officeStatus.setValue(status.id);
                        }
                    }

                    if (data.ddoType === EdpDataConst.NON_DDO_TYPE_ID) {
                        this.isNonDDO = true;
                        this.ddoForm.controls.nonDdo.setValidators(Validators.required);
                        this.ddoForm.controls.nonDdo.updateValueAndValidity();
                    } else {
                        this.isNonDDO = false;
                        this.ddoForm.controls.nonDdo.setValue('');
                        this.ddoForm.controls.nonDdo.clearValidators();
                    }
                    this.listOfNonDDO();
                    this.oficeDetailDistrictChange();
                    this.loadTreasuryType();
                    this.selectBill();
                    this.selectStatus();
                    this.hodDisbaled();
                    this.displayOfficeName();
                    this.ddoForm.patchValue({
                        officeEndDate: dateArray,
                    });
                    this.transactionNo = data['transactionNo'];
                    this.saveDraftEnable = true;
                    this.isSubmitDisable = true;
                    if (this.action !== 'view' && data.prvOfficeStatusId && data.prvOfficeStatus &&
                        data.prvOfficeStatusId === EdpDataConst.PRV_OFFICE_STATUS_INACTIVE &&
                        data.prvOfficeStatus.toLowerCase() === EdpDataConst.INACTIVE_STATUS) {
                        this.prevOfficeStatusDisable = true;
                        this.disableFieldsForInactiveStatus();
                    }
                    if (this.action === 'view') {
                        this.ddoForm.disable();
                    }
                }
                this.officeBillMapping();
            } else {
                this.toastr.error(res['message']);
            }
        });
    }

    /**
     * @description To Patch Office Transfer Details
     * @param data data
     */

    patchOfficeTransferDetail(data) {
        if (data['officeTransferDetails'] !== null) {
            const offTrnfDet = data['officeTransferDetails'];
            this.transferOfficeDetail = data['officeTransferDetails'];
            this.ddoForm.patchValue({
                districtIdTrans: offTrnfDet.districtId,
                cardexnoTrans: offTrnfDet.cardexNo,
                ddoNoTrans: offTrnfDet.ddoNo,
                officeNameTrans: offTrnfDet.officeName
            });
        }
    }

    /**
     * Triggered when district is changed
     */

    oficeDetailDistrictChange() {
        const districtName = this.districtList.filter(data => {
            return data['id'] === this.ddoForm.getRawValue().districtId;
        });

        this.billSubmitDisabled = false;
        if (districtName) {
            this.ddoForm.patchValue({
                addDistrict: districtName[0] ? districtName[0]['name'] : null,
                stdCode: districtName[0] ? districtName[0]['stdCode'] : null
            });
            this.talukaList = districtName[0] ? districtName[0]['taluka'] : null;
            this.districtName = districtName[0] ? districtName[0]['name'] : null;
            if (districtName[0]) {
                if ((districtName[0]['name'].toLowerCase() === 'Ahmedabad'.toLowerCase()) ||
                    (districtName[0]['name'].toLowerCase() === 'Ahmedabad(PAO)'.toLowerCase()) ||
                    (districtName[0]['name'].toLowerCase() === 'Gandhinagar(PAO)'.toLowerCase()) ||
                    (districtName[0]['name'].toLowerCase() === 'Gandhinagar'.toLowerCase())) {
                    if (EdpDataConst.FD_ID.toLowerCase() === this.ddoForm.controls.departmentId.value) {
                        this.requestToList = this.requestToData.filter(reqObj => {
                            return reqObj.name.toLowerCase() !== EdpDataConst.PAO_ID.toLowerCase();
                        });
                    } else if (
                        EdpDataConst.AD_ID.toLowerCase() === this.ddoForm.controls.departmentId.value
                    ) {
                        const offType = this.officeTypeList.filter(offTypeObj => {
                            return offTypeObj.name.toLowerCase() === EdpDataConst.DDO_OFFICE_TYPE.toLowerCase();
                        })[0];
                        if (offType) {
                            this.requestToList = this.requestToData.filter(reqObj => {
                                return reqObj.name.toLowerCase() !== EdpDataConst.PAO_ID.toLowerCase();
                            });
                        } else {
                            this.requestToList = _.cloneDeep(this.requestToData);
                        }
                    } else {
                        this.requestToList = _.cloneDeep(this.requestToData);
                    }
                } else {
                    this.requestToList = this.requestToData.filter(data => {
                        return data.name.toLowerCase() !== EdpDataConst.PAO_ID.toLowerCase();
                    });
                    this.hodDisbaled();
                }
            }
        } else {
            this.isTreasuryType = false;
        }

        this.officeBillMapping();
        if (this.action === 'edit' || this.action === 'view') {
            if (Number(this.isUpdate) === Number(EdpDataConst.NAVIAGTE_FROM_UPDATION_LIST)) {
                if (this.ddoForm.getRawValue().districtId !== this.districtId) {
                    this.loadCardexNo();
                } else {
                    this.ddoForm.controls.cardexno.setValue(this.cardexNo);
                }
            }
        }
    }

    /**
     * @description For Office Bill Mapping
     */

    officeBillMapping() {
        const param = {
            id: this.districtID
        };
        this.edpDdoOfficeService.getOfficeBillMapping(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.billSubmittedToList = _.cloneDeep(res['result']);
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * Open dialog to view the selected bill list
     */

    loadSelectedList() {
        const selectedBill = this.ddoForm.controls.selectedBills.value;
        if (selectedBill && selectedBill.length > 0) {
            const billArray = [];
            selectedBill.forEach(id => {
                if (this.billList && this.billList.length > 0) {
                    billArray.push(this.billList.filter(bill => {
                        return bill.id === id;
                    })[0]);
                }
            });
            if (billArray && billArray.length > 0) {
                const dialogRef = this.dialog.open(SelectedBillDialogComponent, {
                    width: '450px',
                    data: billArray
                });
                dialogRef.afterClosed().subscribe(result => {
                    if (result === 'no') {
                        return result;
                    }
                });
            }
        }
    }

    /**
     * @description To load cardex Number
     */

    loadCardexNo() {
        const param = {
            id: this.ddoForm.getRawValue().districtId
        };
        this.edpDdoOfficeService.getCardexNo(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.ddoForm.controls.cardexno.setValue(res['result']['id']);
            } else {
                this.toastr.error(this.errorMessages['ERR_CARDEX_NO']);
            }
        }, (err) => {
            this.toastr.error(this.errorMessages['ERR_CARDEX_NO']);
        });
    }

    /**
     * @description Triggered when department is changed
     */

    departmentSelected() {
        let clearHodList = false;
        const formClone = _.cloneDeep(this.ddoForm.getRawValue());
        this.enableObjectionFields();
        this.firstTimeLoad = false;
        if (formClone.departmentId) {
            this.departId = formClone.departmentId;
            this.isDepartmentShowInSubOffice = true;
        } else {
            this.ddoForm.controls.hodId.reset();
            this.hodList = [];
            clearHodList = true;
            this.ddoForm.controls.departmentId.reset();
            this.departId = this.departmentIdFromLogin;
            this.isDepartmentShowInSubOffice = false;
            this.isHodShowInSubOffice = false;
        }

        if (!formClone.hodId) {
            this.isHodShowInSubOffice = false;
        }

        if (this.departId) {
            this.departName =
                this.departmentList ? this.departmentList.filter(e => e.id === this.departId)[0].name : null;
        }
        if (!this.departId) {
            this.hodList = null;
            this.ddoForm.controls.hodId.reset();
            return;
        }
        const param = {
            id: this.departId
        };
        this.departmentListCopy['name'] =
            this.departmentListCopy ? this.departmentList.filter(e => e.id === this.departId)[0].name : null;
        if (!clearHodList) {
            this.edpDdoOfficeService.getHodList(param).subscribe(res => {
                this.hodList = _.cloneDeep(res['result']);
                if (this.hodList.filter(e => e.id === this.hodId).length === 0) {
                    this.hodId = null;
                    this.ddoForm.patchValue({
                        hodId: null
                    });
                }
                if (this.autoSetHodEnable) {
                    this.ddoForm.patchValue({
                        hodId: this.hodId
                    });
                    this.hodName = this.hodList && this.hodList.filter(e => e.id === this.hodId)[0] ?
                        this.hodList.filter(e => e.id === this.hodId)[0].name : null;
                }
                this.autoSetHodEnable = false;
                this.hodSelectionChange();
            });
            this.isHodShowInSubOffice = true;
        }
    }

    hodSelectionChange() {
        this.hodId = this.ddoForm.controls.hodId.value ?
            this.ddoForm.controls.hodId.value : this.hodIdFromLogin;
        if (this.hodId) {
            const temp = this.hodList.find(e => e.id === this.hodId);
            this.hodName =
                temp ?
                    temp.name : null;
        }
        if (!this.ddoForm.controls.hodId.value) {
            this.isHodShowInSubOffice = false;
        } else {
            this.isHodShowInSubOffice = true;
        }
    }

    /**
     * @description TO get the list of non DDO
     */

    listOfNonDDO() {
        const ddoName = this.ddoTypeList.filter(obj => {
            return obj.id === this.ddoForm.controls.ddoType.value;
        })[0];
        if (ddoName) {
            if (((ddoName['name']).replace(/ /g, '')).toLowerCase() === 'nonddo'.toLowerCase()) {
                this.isNonDDO = true;
                this.ddoForm.controls.nonDdo.setValidators(Validators.required);
                this.ddoForm.controls.nonDdo.updateValueAndValidity();
            } else {
                this.isNonDDO = false;
                this.ddoForm.controls.nonDdo.setValue('');
                this.ddoForm.controls.nonDdo.clearValidators();
                this.ddoForm.controls.nonDdo.updateValueAndValidity();
            }
        } else {
            this.isNonDDO = false;
            this.ddoForm.controls.nonDdo.setValue('');
            this.ddoForm.controls.nonDdo.clearValidators();
            this.ddoForm.controls.nonDdo.updateValueAndValidity();
        }
    }

    /**
     * @description to disable hod field
     */

    hodDisbaled() {
        if (this.ddoForm.value.officeTypeId) {
            this.validateFieldsHideShow(this.ddoForm.value.officeTypeId);
        }
        const officeType = this.officeTypeList.filter(typeObj => {
            return typeObj.id === this.ddoForm.getRawValue().officeTypeId;
        })[0];
        if (officeType) {
            this.requiredField();
            const officeName = officeType.name.toLowerCase();
            if (officeName === EdpDataConst.AD_ID.toLowerCase()) {
                if (this.districtName.toLowerCase() !== 'Gandhinagar'.toLowerCase() &&
                    this.districtName.toLowerCase() !== 'Gandhinagar(PAO)'.toLowerCase()) {
                    this.toastr.error(this.errorMessages['ADDMINISTRATION_TYPE']);
                    this.ddoForm.controls.officeTypeId.setValue('');
                }
                // Administrative Department Condition for Office type.
                this.levelList = this.levelData.filter(levelObj => {
                    return levelObj.name.toLowerCase() === EdpDataConst.STATE_ID.toLowerCase();
                });
                // pay verfication unit field data disabled.
                this.pvuList = this.pvuData.filter(pvuObj => {
                    return pvuObj.name.toLowerCase() !== EdpDataConst.PVU_ID.toLowerCase();
                });
                // ddo type field data disabled.
                if (this.officeDivision === 'DAT' || this.isGadUser) {
                    this.ddoTypeList = this.ddoTypeData.filter(levelObj => {
                        return levelObj.name.toLowerCase() === EdpDataConst.DDO_ID.toLowerCase();
                    });
                }
                // this.isDepartmentVisible = false;
                this.isHOD = false;
                this.isHODRequired = false;
                this.isTreasuryType = false;
                this.ddoForm.controls.departmentId.clearValidators();
                this.ddoForm.controls.departmentId.updateValueAndValidity();
            } else if (officeName === EdpDataConst.HOD_ID.toLowerCase()) {
                // Head of Department condition for Office type.
                this.levelList = this.levelData.filter(levelObj1 => {
                    return (levelObj1.name.toLowerCase() === EdpDataConst.STATE_ID.toLowerCase()) ||
                        (levelObj1.name.toLowerCase() === EdpDataConst.DISTRICT_ID.toLowerCase());
                });

                // ddo type field data disabled.
                this.ddoTypeList = this.ddoTypeData.filter(levelObj => {
                    return levelObj.name.toLowerCase() !== EdpDataConst.NON_DDO_ID.toLowerCase();
                });
                let ddoT = [];
                ddoT = this.ddoTypeList.filter(ddoObj => {
                    return ddoObj.id === this.ddoForm.controls.ddoType.value;
                });
                if (ddoT.length === 0) {
                    this.ddoForm.controls.ddoType.setValue('');
                    this.isNonDDO = false;
                    this.ddoForm.controls.nonDdo.setValue('');
                    this.ddoForm.controls.nonDdo.clearValidators();
                    this.ddoForm.controls.nonDdo.updateValueAndValidity();
                }
                if (this.isGadUser || this.officeDivision === 'DAT') {
                    // pay verfication unit field data disabled.
                    this.pvuList = this.pvuData.filter(pvuObj => {
                        return pvuObj.name.toLowerCase() !== EdpDataConst.PVU_ID.toLowerCase();
                    });
                    this.isHOD = true;
                    this.isTreasuryType = false;
                }
                this.isHOD = true;
                this.isHODRequired = false;
                this.isTreasuryType = false;
                this.ddoForm.controls.departmentId.setValidators(Validators.required);
                this.ddoForm.controls.departmentId.updateValueAndValidity();
            } else if (officeName === EdpDataConst.OFFICE_DDO_ID.toLowerCase() &&
                EdpDataConst.FD_ID.toLowerCase() === this.ddoForm.controls.departmentId.value) {
                this.isHOD = false;
                this.isHODRequired = true;
                // Head of Department condition for Office type.
                this.levelList = _.cloneDeep(this.levelData);
            } else if (officeName === EdpDataConst.OFFICE_DDO_ID.toLowerCase()) {
                this.isHOD = false;
                this.isHODRequired = true;
                this.levelList = _.cloneDeep(this.levelData);
                this.pvuList = _.cloneDeep(this.pvuData);
                this.ddoTypeList = _.cloneDeep(this.ddoTypeData);
            } else {
                if (EdpDataConst.AD_ID.toLowerCase() === this.ddoForm.controls.departmentId.value) {
                    const offType = this.officeTypeList.filter(offTypeObj => {
                        return offTypeObj.name.toLowerCase() === EdpDataConst.DDO_OFFICE_TYPE.toLowerCase();
                    })[0];
                    this.ddoForm.controls.requestTo.setValue('');
                    if (offType) {
                        this.requestToList = this.requestToData.filter(reqObj => {
                            return reqObj.name.toLowerCase() !== EdpDataConst.PAO_ID.toLowerCase();
                        });
                    } else {
                        this.requestToList = _.cloneDeep(this.requestToData);
                    }
                }
                this.isTreasuryType = false;
                this.isHOD = false;
                this.isHODRequired = false;
                this.levelList = _.cloneDeep(this.levelData);
                this.pvuList = _.cloneDeep(this.pvuData);
                this.ddoTypeList = _.cloneDeep(this.ddoTypeData);
                this.ddoForm.controls.departmentId.setValidators(Validators.required);
                this.ddoForm.controls.departmentId.updateValueAndValidity();
            }
        } else {
            this.isTreasuryType = false;
            this.isHOD = false;
            this.isHODRequired = false;
            this.levelList = _.cloneDeep(this.levelData);
            this.pvuList = _.cloneDeep(this.pvuData);
            this.ddoTypeList = _.cloneDeep(this.ddoTypeData);
            this.ddoForm.controls.departmentId.setValidators(Validators.required);
            this.ddoForm.controls.departmentId.updateValueAndValidity();
        }
    }

    /**
     * @description To set the validation of Fields
     */

    requiredField() {
        const levelData = this.levelList.filter(levelObj => {
            return levelObj.id === this.ddoForm.getRawValue().levelId;
        })[0];
        if (levelData) {
            if (levelData.name.toLowerCase() === EdpDataConst.TALUKA_LEVEL_ID.toLowerCase()) {
                this.isCntrlOfficer = false;
                this.ddoForm.controls.isCo.setValue('');
                this.isCoOfficeNameRequired = true;
                this.isCoDesignationRequired = true;
                this.isTalukaRequired = true;
                this.ddoForm.controls.coId.setValidators([Validators.required]);
                this.ddoForm.controls.coOfficeName.setValidators([Validators.required]);
                this.ddoForm.controls.coId.updateValueAndValidity();
                this.ddoForm.controls.coOfficeName.updateValueAndValidity();
                this.ddoForm.controls.coId.markAsUntouched();
                this.ddoForm.controls.coOfficeName.markAsUntouched();
            } else {
                this.isCntrlOfficer = true;
                this.isCoOfficeNameRequired = false;
                this.isCoDesignationRequired = false;
                this.isTalukaRequired = false;
                this.ddoForm.controls.coId.clearValidators();
                this.ddoForm.controls.coOfficeName.clearValidators();
                this.ddoForm.controls.coId.updateValueAndValidity();
                this.ddoForm.controls.coOfficeName.updateValueAndValidity();
            }
        } else {
            this.isCntrlOfficer = true;
            this.isCoOfficeNameRequired = false;
            this.isCoDesignationRequired = false;
            this.isTalukaRequired = false;
            this.ddoForm.controls.coId.clearValidators();
            this.ddoForm.controls.coOfficeName.clearValidators();
            this.ddoForm.controls.coId.updateValueAndValidity();
            this.ddoForm.controls.coOfficeName.updateValueAndValidity();
        }
    }

    /**
     * @description To prepare Office Name For Display.
     */

    displayOfficeName() {
        let name: string;
        name = '';
        name = this.prepareOfficeName(name, this.ddoForm.getRawValue().officeName);
        name = this.prepareOfficeName(name, this.ddoForm.getRawValue().station);
        const talukaName = this.talukaList.filter(data => {
            return data.id === this.ddoForm.getRawValue().talukaId;
        });
        if (talukaName.length > 0) {
            name = this.prepareOfficeName(name, talukaName[0]['name']);
        }
        name = this.prepareOfficeName(name, this.ddoForm.getRawValue().addDistrict);
        this.ddoForm.patchValue({
            officeNameDisp: name
        });
        this.ddoOfficeName = this.ddoForm.getRawValue().officeName;
    }

    // To append ',' in a string
    prepareOfficeName(name, appendValue) {
        if (appendValue) {
            if (name.lastIndexOf(',') === (name.length - 1)) {
                name += appendValue;
            } else {
                name += ', ' + appendValue;
            }
        }
        return name;
    }

    /**
     * @description Triggered when status field is changed by User
     */

    selectStatus() {
        const status = this.statusList.filter(statusObj => {
            return statusObj.id === this.ddoForm.controls.officeStatus.value;
        })[0];
        let tempFlagForEndDate = false;
        if (status) {
            if (((status.name).replace(/ /g, '')).toLowerCase() === EdpDataConst.CANCEL_STATUS.toLowerCase() ||
                ((status.name).replace(/ /g, '')).toLowerCase() === EdpDataConst.INACTIVE_STATUS.toLowerCase()) {
                this.isInActiveSelected = true;
                this.ddoForm.controls.officeEndDate.setValue('');
                this.ddoForm.controls.officeEndDate.enable();
                this.ddoForm.controls.officeEndDate.setValidators(Validators.required);
                this.ddoForm.controls.officeEndDate.updateValueAndValidity();
                tempFlagForEndDate = true;
            } else {
                tempFlagForEndDate = false;
                this.isInActiveSelected = false;
                this.ddoForm.controls.officeEndDate.setValue('');
                this.ddoForm.controls.officeEndDate.disable();
                this.ddoForm.controls.officeEndDate.clearValidators();
                this.ddoForm.controls.officeEndDate.updateValueAndValidity();
            }
            if (String(status.name).toLowerCase() === EdpDataConst.TRANSFER_STATUS.toLowerCase()) {
                this.ddoForm.controls.districtIdTrans.setValidators(Validators.required);
                this.ddoForm.controls.districtIdTrans.updateValueAndValidity();
                this.ddoForm.controls.cardexnoTrans.setValidators(Validators.required);
                this.ddoForm.controls.cardexnoTrans.updateValueAndValidity();
                this.ddoForm.controls.ddoNoTrans.setValidators(Validators.required);
                this.ddoForm.controls.ddoNoTrans.updateValueAndValidity();
                this.ddoForm.controls.officeEndDate.setValue('');
                this.ddoForm.controls.officeEndDate.enable();
                this.ddoForm.controls.officeEndDate.setValidators(Validators.required);
                this.ddoForm.controls.officeEndDate.updateValueAndValidity();
                this.transferOfficeEnable = true;
            } else {
                this.ddoForm.controls.districtIdTrans.clearValidators();
                this.ddoForm.controls.districtIdTrans.updateValueAndValidity();
                this.ddoForm.controls.cardexnoTrans.clearValidators();
                this.ddoForm.controls.cardexnoTrans.updateValueAndValidity();
                this.ddoForm.controls.ddoNoTrans.clearValidators();
                this.ddoForm.controls.ddoNoTrans.updateValueAndValidity();
                this.transferOfficeEnable = false;
                if (!tempFlagForEndDate) {
                    this.ddoForm.controls.officeEndDate.setValue('');
                    this.ddoForm.controls.officeEndDate.disable();
                    this.ddoForm.controls.officeEndDate.clearValidators();
                    this.ddoForm.controls.officeEndDate.updateValueAndValidity();
                }
                this.ddoForm.patchValue({
                    districtIdTrans: '',
                    cardexnoTrans: '',
                    ddoNoTrans: '',
                    officeNameTrans: ''
                });
            }
        } else {
            this.isInActiveSelected = false;
            this.ddoForm.controls.officeEndDate.setValue('');
            this.ddoForm.controls.officeEndDate.clearValidators();
            this.ddoForm.controls.officeEndDate.updateValueAndValidity();
            this.ddoForm.controls.districtIdTrans.clearValidators();
            this.ddoForm.controls.districtIdTrans.updateValueAndValidity();
            this.ddoForm.controls.cardexnoTrans.clearValidators();
            this.ddoForm.controls.cardexnoTrans.updateValueAndValidity();
            this.ddoForm.controls.ddoNoTrans.clearValidators();
            this.ddoForm.controls.ddoNoTrans.updateValueAndValidity();
            this.transferOfficeEnable = false;
        }

        if (this.ddoForm.controls.officeStatus.dirty) {
            if (this.ddoForm.controls.officeStatus.value === this.statusCopy) {
                this.ddoForm.controls.offStComments.reset();
                this.ddoForm.controls.offStComments.disable();
            } else {
                this.ddoForm.controls.offStComments.enable();
            }
        }
    }

    /**
     * ------------Office Transfer To Section Starts-------------
     */

    setTransferOfficeNameAndId() {
        if (this.ddoForm.value.districtIdTrans && this.ddoForm.value.cardexnoTrans && this.ddoForm.value.ddoNoTrans) {
            const params = {
                cardexNo: Number(this.ddoForm.value.cardexnoTrans),
                ddoNo: this.ddoForm.value.ddoNoTrans,
                districtId: Number(this.ddoForm.value.districtIdTrans),
                officeName: ''
            };
            this.edpDdoOfficeService.getTransferOfficeNameId(params).subscribe(res => {
                if (res && res['status'] === 200 && res['result']) {
                    const resResult = res['result'];
                    if (resResult.length > 0) {
                        const status = resResult[0]['status'];
                        if (status.toLowerCase() === EdpDataConst.INACTIVE_STATUS ||
                            status.toLowerCase() === EdpDataConst.ACTIVE_STATUS) {
                            this.transferOfficeDetail = resResult[0];
                            this.ddoForm.controls.officeNameTrans.patchValue(this.transferOfficeDetail['officeName']);
                        } else {
                            this.ddoForm.controls.officeNameTrans.patchValue('');
                            this.toastr.error(msgConst.DDO_OFFICE.OFFICE_NOT_FOUND);
                        }
                    } else {
                        this.ddoForm.controls.officeNameTrans.patchValue('');
                        this.toastr.error(msgConst.DDO_OFFICE.OFFICE_NOT_FOUND);
                    }
                } else {
                    this.ddoForm.controls.officeNameTrans.patchValue('');
                    this.toastr.error(res['message']);
                }
            });
        }
    }

    searchOfficeDetails() {
        const districtData = {
            district: Number(this.ddoForm.value.districtIdTrans)
        };
        const dialogRef = this.dialog.open(SearchDialogComponent, {
            width: '1000px',
            height: '600px',
            data: districtData
        });
        dialogRef.afterClosed().subscribe(resultParam => {
            if (resultParam === 'no') {
                return resultParam;
            }
        });
    }
    /**
     * ------------Office Transfer To Section Ends-------------
     */

    /**
     * @description To load Employee Name when user enter the Employee Number
     */

    loadEmployeeName() {
        if (this.ddoForm.getRawValue().employeeNo && this.ddoForm.getRawValue().employeeNo.length === 10) {
            this.edpDdoOfficeService.getEmployeeName({ id: this.ddoForm.getRawValue().employeeNo }).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result']['name']) {
                        this.employeeData = res['result'];
                        this.ddoForm.controls.employeeName.setValue(this.employeeData['name']);
                    } else {
                        this.toastr.error(res['message']);
                        this.ddoForm.controls.employeeName.setValue('');
                    }
                } else {
                    this.toastr.error(res['message']);
                    this.ddoForm.controls.employeeName.setValue('');
                }
            }, (err) => {
                this.toastr.error(err);
            });
        } else {
            this.ddoForm.controls.employeeName.setValue('');
        }
    }

    /**
     * @description Triggered when bill type selection changes
     */

    selectBill() {
        const billType = this.billTypeList.filter(obj => {
            return obj.id === this.ddoForm.controls.billType.value;
        })[0];
        if (billType) {
            if (((billType.name).replace(/ /g, '')).toLowerCase() === 'selected') {
                this.isSelected = true;
                this.ddoForm.controls.selectedBills.setValidators(Validators.required);
                this.ddoForm.controls.selectedBills.updateValueAndValidity();
                this.listOfBills();
            } else {
                this.ddoForm.controls.selectedBills.reset();
                this.isSelected = false;
                this.ddoForm.controls.selectedBills.clearValidators();
                this.ddoForm.controls.selectedBills.updateValueAndValidity();
            }
        } else {
            this.isSelected = false;
            this.ddoForm.controls.selectedBills.clearValidators();
            this.ddoForm.controls.selectedBills.updateValueAndValidity();
        }
    }

    /**
     * @description call API based on Bill Type selection and display options in list of bills field
     */

    listOfBills() {
        this.edpDdoOfficeService.getListOfBills().subscribe((res) => {
            if (res && res['status'] === 200) {
                this.billList = res['result'];
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * @description set the validation of the objection remarks fields when user checked the objection field
     */

    ObjectionRemarks(event) {
        if (event.checked === true) {
            this.objStatus = true;
            this.ddoForm.controls.objRemark.setValidators(Validators.required);
            this.ddoForm.controls.objRemark.updateValueAndValidity();
        } else {
            this.objStatus = false;
            this.ddoForm.controls.objRemark.reset();
            this.ddoForm.controls.objRemark.clearValidators();
            this.ddoForm.controls.objRemark.updateValueAndValidity();
        }
        if (this.action === 'view') {
            this.ddoForm.controls.objStatus.disable();
        }
    }

    /**
     * @description To the form error
     */

    showFormErrors() {
        _.each(this.ddoForm.controls, function (formErrorControl) {
            if (formErrorControl.status === 'INVALID') {
                formErrorControl.markAsTouched({ onlySelf: true });
            }
        });
    }

    /**
     * Validation for check if user is trying to re create the same transaction
     * @param buttonName submit/save as draft
     * @param params request payload for save and submit
     */

    validationCheckForDuplicateRecords(buttonName, params) {
        if (this.isUpdate === 1) { // if user navigate from office detail summary
            const req = {
                officeId: this.officeId,
            };
            this.edpDdoOfficeService.validationForDuplicateRecordsDetailsList(req).subscribe(res => {
                if (res && res['status'] === 200) {
                    if (buttonName === 'submit') {
                        this.submitApi(buttonName, params);
                    } else {
                        this.updateOfficeSaveApi(params, buttonName);
                    }
                } else {
                    this.dialog.open(AlreadyExistDialogComponent, {
                        width: '500px',
                        data: res['message']
                    });
                }
            });
        } else {  // if user navigate from update office list
            if (buttonName === 'submit') {
                this.submitApi(buttonName, params);
            } else {
                this.updateOfficeSaveApi(params, buttonName);
            }
        }

    }

    /**
     * To Submit the form
     * @param buttonName submit/save as draft
     * @param param request payload for save and submit
     */

    submitApi(buttonName, param) {
        if (this.isUpdate === 1) {
            const date = new Date();
            this.transactionDate = date;
        }
        this.isUpdate = 2;
        if (this.ddoForm.valid && this.attachmentView && this.attachmentView.checkForMandatory()) {
            this.edpDdoOfficeService.updateOfficeDetailsUo(param).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200 && res['message']) {
                    this.ddoForm.markAsUntouched();
                    this.saveDraftEnable = true;
                    this.isSubmitDisable = true;
                    this.passResult = res['result'];
                    this.isSavedRequet = true;
                    this.updateOffice = false;
                    this.isOnlySummaryView = false;
                    this.isSubOfficeEditDisable = false;
                    this.transactionNo = res['result']['transactionNo'];
                    this.isSubOfficeEnable = false;
                    this.trnId = res['result']['trnId'];
                    param.trnId = this.trnId;
                    // for Dat Super Admin, when wf is disabled
                    if (this.isDatSuperAdmin) {
                        param.wfStatus = EdpDataConst.APPROVE_WF_STATUS;
                        this.edpDdoOfficeService.finalApproval(param).subscribe(resp => {
                            if (resp && resp['status'] === 200) {
                                this.toastr.success(resp['message']);
                                this.goToList();
                                return;
                            }
                        });
                    }
                    this.getHeaderDetailForWFPopUp(param);
                } else {
                    this.toastr.error(res['message']);
                }
            },
                (err) => {
                    this.toastr.error(this.errorMessages['ERR_SAVE_OFFICE']);
                });
        } else {
            if (!this.ddoForm.valid) {
                this.toastr.error(EdpDataConst.FILL_ALL_DETAILS_WARNING);
                this.saveDraftEnable = true;
                this.isSubmitDisable = true;
                return false;
            }
            if (this.attachmentView && !this.attachmentView.checkForMandatory()) {
                this.toastr.error(msgConst.ATTACHMENT.ERR_NOT_UPLOAD);
                this.saveDraftEnable = true;
                this.isSubmitDisable = true;
                return false;
            }
        }
    }

    /**
     * Trigerred when user click on save as draft/ submit Button
     * @param buttonName submit/save as draft
     */

    saveDDO(buttonName, requiredPopUp?) {
        if (this.transferOfficeEnable) {
            const officeName = this.ddoForm.getRawValue().officeNameTrans;
            if (!officeName) {
                return;
            }
        }
        this.saveDraftEnable = false;
        this.isSubmitDisable = false;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        if (requiredPopUp) {
            setTimeout(e => dialogRef.close('yes'));
        }
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                const param = _.cloneDeep(this.ddoForm.getRawValue());
                const endDate = this.ddoForm.controls.officeEndDate.value;
                if (endDate) {
                    param.officeEndDate = this.datePipe.transform(endDate, 'yyyy-MM-dd').toString();
                }
                param.objStatus = param.objStatus ? 2 : 1;
                if (this.officeDivision !== EdpDataConst.OFFICE_DIVISION_DAT) {
                    param.hodId = this.hodId;
                }
                param.menuShName = EdpDataConst.MENU_CODE_UPDATE_OFF;
                param.officeId = this.officeId;
                param.stdCode = Number(param.stdCode);
                param.wfInRequest = this.isDatSuperAdmin ? 1 : 2;
                param.objectionRemarks = param.objStatus === 2 ? param.objRemark : null;
                param.objRemark = param.objStatus === 2 ? param.objRemark : null;

                param.curMenuId = EdpDataConst.UPDATE_OFFICE_MENU_ID;
                param.wfRoleId = this.commonService.getwfRoleId()[0]['wfRoleIds'][0];
                param.officeSubType = this.officeData['officeSubType'];
                if (this.isJD) {
                    param.offStComments = null;
                }

                if (this.transferOfficeEnable) {
                    param['officeTransferId'] = this.transferOfficeDetail ? this.transferOfficeDetail.officeId : null;
                }

                if (this.action === 'edit') {
                    param.activeStatus = 1;
                    if (!this.updateOffice) {
                        param.transactionNo = this.transactionNo;
                    }
                    param.transactionNo = this.isUpdate === 2 ? this.transactionNo : null;
                    param.departmentId = this.departId;

                    if (buttonName === 'submit') {
                        param['msgFlag'] = true; // for proper submit message of office updation it should be true
                        param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
                        if (this.transactionNo && !this.isOnlySummaryView) {
                            param.transactionNo = this.transactionNo;
                        }
                        _.each(this.ddoForm.controls, function (editControl) {
                            editControl.markAsTouched({ onlySelf: true });
                            if (editControl.status === 'INVALID') {
                                editControl.markAsTouched({ onlySelf: true });
                            }
                        });
                        this.validationCheckForDuplicateRecords(buttonName, param);
                    } else {
                        this.isDisplaySubOffice = true;
                        if (this.updateOffice === true) {
                            this.subOfficeFlag = true;
                        }
                        if (this.transactionNo && !this.isOnlySummaryView) {
                            param.transactionNo = this.transactionNo;
                        }
                        param['formAction'] = EdpDataConst.STATUS_DRAFT;
                        this.validationCheckForDuplicateRecords(buttonName, param);
                    }
                } else {
                    param.isUpdateOffice = false;
                    if (buttonName === 'submit') {
                        param['msgFlag'] = true; // for proper submit message of office updation it should be true
                        param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
                        _.each(this.ddoForm.controls, function (newControl) {
                            if (newControl.status === 'INVALID') {
                                newControl.markAsTouched({ onlySelf: true });
                            }
                        });
                        if (this.ddoForm.valid && this.attachmentView.checkForMandatory()) {
                            this.updateOfficeSaveApi(param, buttonName);
                        } else {
                            if (!this.ddoForm.valid) {
                                this.toastr.error(EdpDataConst.FILL_ALL_DETAILS_WARNING);
                                return false;
                            }
                            if (!this.attachmentView ||
                                (this.attachmentView && !this.attachmentView.checkForMandatory())) {
                                this.toastr.error(msgConst.ATTACHMENT.ERR_NOT_UPLOAD);
                                return false;
                            }
                        }
                    } else {
                        this.isDisplaySubOffice = true;
                        param['formAction'] = EdpDataConst.STATUS_DRAFT;
                        this.updateOfficeSaveApi(param, buttonName);
                    }
                }
            } else {
                this.saveDraftEnable = true;
                this.isSubmitDisable = true;
            }
        });

    }

    /**
     * @description To get the Header Details for Work Flow PopUp
     */

    getHeaderDetailForWFPopUp(param) {
        const currentUser = this.storageService.get('currentUser');
        if (
            currentUser['branchDetails'] &&
            currentUser['branchDetails'] !== null &&
            currentUser['branchDetails'].length > 0
        ) {
            this.branchId = currentUser['branchDetails'][0].branchId;
            this.branchName = currentUser['branchDetails'][0].branchName;
        }
        const params = {
            id: this.officeId,
            menuId: EdpDataConst.UPDATE_OFFICE_MENU_ID
        };
        this.edpDdoOfficeService.getHeaderDetailsForWf(params).subscribe(res => {
            const headerJson: any[] = _.cloneDeep(res['result']);
            headerJson.splice(0, 1);
            if (this.hasWorkFlow) {
                this.openWfDialog(headerJson, param);
            }
        });
    }

    /**
     * check if work flow is enable or not
     */

    isWorkFlowEnabled() {
        this.edpDdoOfficeService.isWfEnabled().subscribe(resp => {
            if (resp['result'] === true || resp['result'] === 'true') {
                this.hasWorkFlow = true;
            }
            this.setUserType();
        });
    }

    /**
     * To open work flow pop up.
     * @param headerJson header details
     */

    openWfDialog(headerJson, param) {
        const moduleInfo = {
            moduleName: ModuleNames.EDP,
            districtId: this.districtId
        };
        const dialogRef = this.dialog.open(CommonWorkflowComponent, {
            width: '2700px',
            height: '600px',
            data: {
                headingName: 'Office Updation',
                refNo: this.transactionNo ? this.transactionNo : null,
                refDate: this.transactionDate ? this.transactionDate : null,
                menuModuleName: ModuleNames.EDP,
                headerJson: headerJson,
                trnId: this.trnId,
                conditionUrl: 'edp/condition/2001',
                moduleInfo: moduleInfo,
                isAttachmentTab: false,
                branchId: this.branchId
            }
        });

        dialogRef.afterClosed().subscribe(wfData => {
            if (wfData && wfData.commonModelStatus === true) {
                console.log(wfData);
                const popUpRes = wfData.data.result[0];
                const paramsForWf = {
                    trnId: popUpRes.trnId,
                    wfId: popUpRes.wfId,
                    assignByWfRoleId: popUpRes.assignByWfRoleId,
                    trnStatus: popUpRes.trnStatus,
                    isNew: 1
                };
                param.wfStatus = paramsForWf.trnStatus;
                if (param.wfStatus === EdpDataConst.CANCEL_WF_STATUS ||
                    param.wfStatus === EdpDataConst.REJECT_WF_STATUS ||
                    (this.isJD && param.wfStatus === EdpDataConst.APPROVE_WF_STATUS)) {
                    this.edpDdoOfficeService.finalApproval(param).subscribe(res => {
                        if (res && res['status'] === 200) {
                            this.toastr.success(res['message']);
                            this.goToList();
                        }
                    });
                } else {
                    this.goToList();
                }

            }
        });

    }


    /**
    * @description For Viewing Comments in popup
    */
    viewComments() {

        const moduleInfo = {
            moduleName: ModuleNames.EDP,
            districtId: this.districtId
        };

        const params = {
            id: this.officeId,
            menuId: EdpDataConst.UPDATE_OFFICE_MENU_ID
        };
        this.edpDdoOfficeService.getHeaderDetailsForWf(params).subscribe(res => {
            const headerJson: any[] = _.cloneDeep(res['result']);
            headerJson.splice(0, 1);
            this.dialog.open(ViewCommonWorkflowHistoryComponent, {
                width: '2700px',
                height: '600px',
                data: {
                    refNo: this.transactionNo ? this.transactionNo : null,
                    refDate: this.transactionDate ? this.transactionDate : null,
                    menuModuleName: ModuleNames.EDP,
                    headingName: 'Office Updation',
                    headerJson: headerJson,
                    trnId: this.trnId,
                    conditionUrl: 'edp/condition/2001',
                    moduleInfo: moduleInfo,
                    isAttachmentTab: false,
                    branchId: this.branchId
                }
            });
        }, err => {
            this.toastr.error(err);
        });
    }

    /**
     * To save the data as a draft
     * @param param request payload
     * @param buttonName submit/save as draft
     */

    updateOfficeSaveApi(param, buttonName) {
        if (this.isUpdate === 1) {
            const date = new Date();
            this.transactionDate = date;
        }
        this.isUpdate = 2;
        this.edpDdoOfficeService.updateOfficeDetailsUo(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200 && res['message']) {
                this.ddoForm.markAsUntouched();
                this.toastr.success(res['message']);
                this.subOfficeFlag = true;
                this.saveDraftEnable = true;
                this.isSubmitDisable = true;
                this.isSubOfficeEnable = false;
                this.isSubOfficeEditDisable = false;
                this.isOnlySummaryView = false;
                this.disableSubOfficeCreate = false;
                this.passResult = res['result'];
                this.subOfficeList.newSearch = true;
                this.subOfficeList.getSubOfficeList();
                this.action = 'edit';
                this.isSavedRequet = true;
                this.officeId = res['result']['officeId'];
                this.transactionNo = this.passResult['transactionNo'];
                this.trnId = res['result']['trnId'];
                this.subOfficeList.validation();
                if (buttonName === 'submit') {
                    this.goToList();
                }
            } else {
                this.toastr.error(res['message']);
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages['ERR_SAVE_OFFICE']);
            });
    }

    /**
     * To create sub office
     */

    createSubChild() {
        const object = _.cloneDeep(this.ddoForm.getRawValue());
        object['departmentList'] = this.departmentList.filter(e => e.id === this.departId);
        object['departmentId'] = this.departId;
        object['hodList'] = this.hodList;
        object['officeTypeId'] = this.officeTypeIdForSubOffice;
        const district = this.districtList.filter(obj => {
            return obj.id === this.ddoForm.getRawValue().districtId;
        });
        if (district) {
            object['districtList'] = district;
        } else {
            object['districtList'] = [];
        }
        object['officeId'] = this.officeId;
        object['action'] = this.action;
        object['subOfficeUpdateFlag'] = this.subOfficeUpdateFlag;
        object['subOfficeFlag'] = this.subOfficeFlag;
        object['isDepartmentVisible'] = this.isDepartmentVisible;
        object['isHOD'] = this.isHOD;
        object['isDisplaySubOffice'] = this.isDisplaySubOffice;
        object['hodId'] = this.hodId ? this.hodId : this.hodIdFromLogin;
        object['hodName'] = this.hodName ? this.hodName : null;
        object['departmentName'] = this.departName;
        object['usertype'] = this.userTypeForSubOffice;
        object['isDepartmentShowInSubOffice'] = this.isDepartmentShowInSubOffice;
        object['isUpdate'] = this.isUpdate ? this.isUpdate : 2;
        object['officeTrnId'] = this.trnId;
        const formClone = _.cloneDeep(this.ddoForm.value);
        if (!formClone.departmentId && this.isDatSuperAdmin) {
            object['departmentName'] = null;
            object['departmentId'] = this.departmentIdFromLogin;
            object['departmentList'] = null;
        }
        if (!formClone.hodId && this.isDatSuperAdmin) {
            object['hodId'] = null;
            object['hodName'] = null;
            object['hodList'] = null;
        }
        const dialogRef = this.dialog.open(SubOfficeCreationComponent, {
            disableClose: true,
            data: object
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'save') {
                this.subOfficeList.newSearch = true;
                this.subOfficeList.getSubOfficeList();
            }
        });
    }

    /**
     * To go back to list
     */

    goToList() {
        if (this.isUpdate.toString() === '1') {
            if (this.action === 'edit') {
                if (this.isSavedRequet) {
                    this.router.navigate(['/dashboard/edp/office/update-list'], { skipLocationChange: true });
                } else {
                    this.router.navigate(['/dashboard/edp/office/detailsummary'], { skipLocationChange: true });
                }
            } else if (this.action === 'view') {
                this.router.navigate(['/dashboard/edp/office/detailsummary'], { skipLocationChange: true });
            }
        } else {
            this.router.navigate(['/dashboard/edp/office/update-list'], { skipLocationChange: true });
        }
    }

    /**
     * To go back to dashboard
     */

    goToDashboard() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.CLOSE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }

    /**
     * To set the form status
     */

    setFormStatus() {
        this.edpDdoOfficeService.setStatus(this.ddoForm.valid);
    }

    /**
     * On tab change
     * @param event tab change event
     */

    tabChage(event) {
        if (event.index === 2) {
            this.setFormStatus();
        }
    }

    /**
     * @description To get the name of Title
     * @param list designation list/department list/hod list/co-designation list/co office list
     * @param formControlKey designation id/departmentId/hodId/ co-id/co-officelist
     * @param listIdKey id
     * @param listValueKey name
     */

    getTitleName(list, formControlKey, listIdKey, listValueKey) {
        const val = this.ddoForm.get(formControlKey).value;
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

    interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, idx: number) {
        let result = true;
        if (this.ddoForm.touched === true) {
            result = false;
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: 'Do you want to save the Data!'
            });
            dialogRef.afterClosed().subscribe(data => {
                if (data === 'yes') {
                    this.ddoForm.markAsUntouched();
                    result = true;
                    this.saveDDO('save', true);
                    this.interceptTabChange(tab, tabHeader, idx);
                } else {
                    result = false;
                }
            });
        }
        return result && MatTabGroup.prototype._handleClick.apply(this.headerTabGroup, arguments);
    }

    /**
     * @description To disable create Office Button for double Varification
     * @ref ED-1027 Bug
     */

    disableCreateSubOffice(): boolean {
        if (this.isDatUser || this.isJD || this.isToPaoUser) {
            return true;
        }
        return false;
    }

}
