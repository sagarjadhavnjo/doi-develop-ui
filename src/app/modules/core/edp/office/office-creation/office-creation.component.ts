import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTab, MatTabGroup, MatTabHeader } from '@angular/material/tabs';
import { HeaderJson, WorkflowPopupData } from '../../../common/model/common-workflow';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { ToastrService } from 'ngx-toastr';
import { CommonWorkflowComponent } from '../../../common/common-workflow/common-workflow.component';

import * as _ from 'lodash';
import {
    District,
    OfficeType,
    Level,
    DdoType,
    NonDdoType,
    PVU,
    DesignationOfDdo,
    RequestTo,
    TreasuryType,
    IsCoOffice,
    EmployeeName,
    Taluka,
    Department,
    Hod,
    CoDesignation,
    CoOfficeName,
    BillType,
    ListOfBills,
    ModuleType,
    BillSubmnittedTo
} from '../../model/office-data-model';
import { EdpDdoOfficeService } from '../../services/edp-ddo-office.service';
import { SubOfficeCreationComponent } from '../sub-office-creation/sub-office-creation.component';
import { SubOfficeListComponent } from '../sub-office-list/sub-office-list.component';
import { OfficeAttachmentComponent } from '../office-attachment/office-attachment.component';
import { Subscription } from 'rxjs';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { CommonService } from 'src/app/modules/services/common.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SelectedBillDialogComponent } from '../selected-bill-dialog/selected-bill-dialog.component';
import { ViewCommonWorkflowHistoryComponent } from '../../../common/view-common-workflow-history/view-common-workflow-history.component';

@Component({
    selector: 'app-office-creation',
    templateUrl: './office-creation.component.html',
    styleUrls: ['./office-creation.component.css']
})
export class OfficeCreationComponent implements OnInit {
    action: string;
    userType: string;
    subscribeParams: Subscription;
    officeId: number;
    transactionNo: string;
    transactionDate: string;
    @ViewChild(SubOfficeListComponent) subOfficeList: SubOfficeListComponent;
    @ViewChild(OfficeAttachmentComponent) attachmentView: OfficeAttachmentComponent;
    subOfficeUpdateFlag: boolean = false; // false for new office creation and new office updation
    subOfficeFlag: boolean = false; // false for new office creation and new office updation
    ddoForm: FormGroup;
    ddoSubOffice: FormGroup;
    isCreateShow: boolean = false;
    selectedIndex: number;
    date = new FormControl(new Date());
    doneHeader: boolean = false;
    todaysDate = Date.now();
    ddoOfficeName: string;
    isEditAttachment: boolean = true;
    isCntrlOfficer: boolean = true;
    isSubOfficeEnable: boolean = true;
    saveDraftEnable: boolean = false;
    isDepartmentVisible: boolean = true;
    isHOD: boolean = false;
    isTreasuryType: boolean = false;
    isDatUser: boolean = false;
    isGadUser: boolean = false;
    isHodUser: boolean = false;
    isToPaoUser: boolean = false;
    isEdpUser: boolean = false;
    isSuperAdmin: boolean = false;
    isCoOfficeNameRequired: boolean = false;
    isCoDesignationRequired: boolean = false;
    isTalukaRequired: boolean = false;
    isHODRequired: boolean = false;
    isHod: boolean = false;
    isNonDDO: boolean;
    isSelected: boolean = false;
    objStatus: boolean = false;
    errorMessages: any = {};
    isSubmitDisable: boolean = true;
    isShown: boolean = true;
    isOfficeDivision: boolean = false;
    billSubmitDisabled: boolean = true;
    // isInsert: boolean = true;
    officeDivision: string;
    newVar;
    passResult;
    districtId: number;
    cardexNo: string;

    // Office Detail List Variables
    districtList: District[] = [];
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
    newArr = [];
    checkByDat = false;
    // Office Address List Variables
    talukaList: Taluka[] = [];

    // Office Mapping List Variables
    departmentList: Department[] = [];
    hodList: Hod[] = [];
    coDesignationList: CoDesignation[] = [];
    coOfficeList: CoOfficeName[] = [];

    // Office Bill Mapping List Variables
    billSubmittedToList: BillSubmnittedTo[] = [];
    billTypeList: BillType[] = [];
    billList: any[] = [];
    moduleTypeList: ModuleType[] = [];

    districtCtrl: FormControl = new FormControl();
    treasuryCtrl: FormControl = new FormControl();
    addDistrictCtrl: FormControl = new FormControl();
    talukaCtrl: FormControl = new FormControl();
    designationCtrl: FormControl = new FormControl();
    departmentCtrl: FormControl = new FormControl();
    officeTypeCtrl: FormControl = new FormControl();
    levelCtrl: FormControl = new FormControl();
    requestCtrl: FormControl = new FormControl();
    hodCtrl: FormControl = new FormControl();
    coNameCtrl: FormControl = new FormControl();
    coOfficeNameCtrl: FormControl = new FormControl();
    billSubmittedToCtrl: FormControl = new FormControl();
    listOfBillCtrl: FormControl = new FormControl();
    moduleCtrl: FormControl = new FormControl();
    districtName: string;

    hasWorkFlow: boolean = false;
    transactionId: number;
    currentMenuId: number;
    currentOfficeTypeName: string = '';
    showHodDropDown: boolean = false;
    departmentListData: Department[] = [];
    currentOfficeName;
    wfStatus;
    datAsHOD: boolean = false;
    loggedUserPouId: number;
    isRequestTC: boolean;
    continueIndex = null;
    matInputSelectNull = EdpDataConst.MAT_SELECT_NULL_VALUE;
    isCurrentOfficeGad: boolean = false;
    @ViewChild('headerTabGroup', { static: true })  headerTabGroup: MatTabGroup;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private edpDdoOfficeService: EdpDdoOfficeService,
        private commonService: CommonService,
        private storageService: StorageService
    ) {}

    /**
     * @description called when component is initiated
     */
    ngOnInit() {
        // this.departmentSelection();
        this.headerTabGroup._handleClick = this.interceptTabChange.bind(this);
        const userOffice = this.storageService.get('currentUser');
        const officeData = this.storageService.get('userOffice');
        const loginPost = userOffice['post'].filter(item => item['loginPost'] === true);
        this.officeDivision = loginPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeDivision'];
        this.loggedUserPouId = loginPost[0]['lkPoOffUserId'];
        this.currentOfficeTypeName = officeData.officeTypeName;
        this.currentOfficeName = officeData.officeName;
        this.isCurrentOfficeGad = officeData.departmentId === EdpDataConst.GAD_DEPT_ID;
        if (this.officeDivision === EdpDataConst.OFFICE_DIVISION_DAT) {
            this.isOfficeDivision = true;
            this.isShown = false;
            this.isGadUser = true;
        } else {
            this.isOfficeDivision = false;
            this.isShown = true;
            this.isGadUser = false;
        }
        if (officeData) {
            if (officeData.officeName.toLowerCase() === EdpDataConst.ACCOUNT_AND_TREASURY_OFFICE_2.toLowerCase()) {
                this.isDatUser = true;
                this.isTreasuryType = true;
            } else {
                this.isTreasuryType = false;
            }
        } else {
            this.isTreasuryType = false;
        }
        if (userOffice['usertype']['code'] === EdpDataConst.USER_TYPE_HOD) {
            this.isHodUser = true;
            this.userType = 'hod_user';
        } else if (userOffice['usertype']['code'] === EdpDataConst.USER_TYPE_TO_PAO) {
            this.isToPaoUser = true;
            this.userType = 'to_user';
        } else if (userOffice['usertype']['code'] === EdpDataConst.USER_TYPE_EDP) {
            this.isEdpUser = true;
            this.userType = 'edp_user';
        }
        if (this.officeDivision === EdpDataConst.OFFICE_DIVISION_DAT) {
            this.userType = 'edp_user';
        } else if (
            officeData['isTreasury'] === 2 ||
            (this.currentOfficeTypeName.toLowerCase() === EdpDataConst.DDO_OFFICE_TYPE.toLowerCase() &&
            officeData['officeSubType'] === EdpDataConst.PAO_SUB_OFFICE_TYPE)
        ) {
            this.userType = 'to_user';
        } else if (
            officeData['isHod'] === 2 ||
            this.currentOfficeTypeName.toLowerCase() === EdpDataConst.AD_ID.toLowerCase()
        ) {
            this.isHod = true;
            this.userType = 'hod_user';
        }

        this.errorMessages = msgConst.DDO_OFFICE;
        this.createForm();
        this.checkForWorkflowCno();
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            this.wfStatus = resRoute.wfStatus;

            if (this.action === 'edit' || this.action === 'view') {
                this.officeId = +resRoute.id;
                if (this.officeId) {
                    this.getOfficeDetails();
                    if (this.action === 'view') {
                        this.ddoForm.disable();
                    } else {
                        if (this.isToPaoUser || this.isEdpUser) {
                            this.ddoForm.get('treasuryType').disable();
                        }
                    }
                } else {
                    this.router.navigate(['../new'], { relativeTo: this.activatedRoute, skipLocationChange: true });
                }
            } else {
                this.getOfficeDetails();
                setTimeout(elm => {
                    this.setChanged();
                });
            }
        });
        if (this.isDatUser && !this.hasWorkFlow) {
            this.isSuperAdmin = true;
        }
        this.currentMenuId = this.commonService.getMenuId();
    }

    /**
     * @description Method gets department List with HOD
     */
    departmentSelection() {
        // This APi is not being used as it gets Wrong Data , Kept for Future Use
        // this.edpDdoOfficeService.getDepartmentList().subscribe(res => {
        //     if (res['status'] === 200) {
        //         this.departmentList = res['result'];
        //     } else {
        //         this.toastr.error(res['message']);
        //     }
        // });
    }

    /**
     * @description Method gets head of department List from database
     * @param departmentID when passed parameter then it fetches HOD using it.
     */
    departmentSelected(event?, departmentID?) {
        const param = {};
        const deptID = this.ddoForm.controls.departmentId.value;
        if (event !== undefined) {
            if (!event.value) {
                this.hodList = [];
                return;
            }
        }
        if (typeof deptID === 'number') {
            param['id'] = deptID;
        } else if (this.passResult && this.passResult.departmentId) {
            param['id'] = +this.passResult.departmentId;
        }
        if (departmentID) {
            param['id'] = departmentID;
        }
        this.edpDdoOfficeService.getHodList(param).subscribe(
            hodRes => {
                if (hodRes && hodRes['result'] && hodRes['status'] === 200) {
                    this.hodList = hodRes['result'];
                } else {
                    this.toastr.error(hodRes['message']);
                }
            },
            hodErr => {
                this.toastr.error(this.errorMessages['HOD_LIST']);
            }
        );
    }

    setChanged() {
        this.ddoForm.valueChanges.subscribe(res => {
            this.saveDraftEnable = true;
            // Below line is set submit button enable when it is disable later otherwise set according to condition
            this.isSubmitDisable = this.officeId && !this.saveDraftEnable ? false :  true;
            // if (this.checkByDat) {
            //     this.continueIndex = 1;
            //     this.checkByDat = false;
            //     this.saveDraftEnable = false;
            //     this.isSubmitDisable = this.officeId && !this.saveDraftEnable ? false :  true;
            // } else if (this.continueIndex === 1) {
            //     this.continueIndex = 0;
            //     this.saveDraftEnable = false;
            //     this.isSubmitDisable = this.officeId && !this.saveDraftEnable ? false :  true;
            // }
        });
    }
    /**
     * @param ddoForms Form input
     * @description It resets Form
     */
    resetForm(ddoForms: NgForm) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.officeId) {
                    this.action = 'edit';
                }
                ddoForms.resetForm();
                this.getOfficeDetails();
                this.saveDraftEnable = false;
                this.isSubmitDisable = true;
            }
        });
    }

    /**
     * @description It creates ddoForm for scrren and it also sets validation according to UserType
     */
    createForm() {
        this.ddoForm = this.fb.group({
            grNo: ['', Validators.required],
            uniqueId: [''],
            districtId: ['', Validators.required],
            officeTypeId: ['', Validators.required],
            levelId: ['', Validators.required],
            officeName: ['', Validators.required],
            cardexno: ['', Validators.required],
            ddoNo: ['', Validators.required],
            ddoType: ['', Validators.required],
            nonDdo: [''],
            pvuId: ['', Validators.required],
            desgDdoId: ['', Validators.required],
            requestTo: ['', Validators.required],
            treasuryType: [''],
            isCo: [''],
            employeeNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            employeeName: ['', [Validators.required]],
            addrLine1: ['', [Validators.required]],
            addrLine2: [''],
            addDistrict: [''],
            talukaId: [''],
            station: ['', Validators.compose([Validators.pattern(EdpDataConst.PATTERN.STATION)])],
            pincode: ['', [Validators.minLength(6), Validators.maxLength(6)]],
            stdCode: [''],
            phoneNo: ['', [Validators.minLength(8), Validators.maxLength(8)]],
            mobileNo: [
                '',
                [
                    Validators.minLength(10),
                    Validators.maxLength(10),
                    Validators.compose([Validators.pattern(EdpDataConst.PATTERN.MOBILE)])
                ]
            ],
            faxNo: ['', [Validators.minLength(10), Validators.maxLength(10)]],
            emailId: ['', Validators.compose([Validators.pattern(EdpDataConst.PATTERN.EMAIL)])],
            officeNameDisp: [''],
            departmentId: ['', Validators.required],
            hodId: [''],
            coId: [''],
            coOfficeName: [''],
            billSubmittedTo: ['', Validators.required],
            billType: ['', Validators.required],
            selectedBills: [[]],
            // comment: ['Forwarded for Approval', Validators.required],
            objStatus: [''],
            objRemark: ['']
        });

        if (this.isToPaoUser || this.isEdpUser) {
            this.ddoForm.controls.cardexno.setValidators(Validators.required);
            this.ddoForm.controls.cardexno.updateValueAndValidity();
            if (this.isToPaoUser) {
                this.ddoForm.controls.billSubmittedTo.setValidators(Validators.required);
                this.ddoForm.controls.billType.setValidators(Validators.required);
                this.ddoForm.controls.billSubmittedTo.updateValueAndValidity();
                this.ddoForm.controls.billType.updateValueAndValidity();
            }
            if (this.isEdpUser) {
                this.ddoForm.controls.ddoNo.setValidators(Validators.required);
                this.ddoForm.controls.ddoNo.updateValueAndValidity();
            }
        }
        if (this.isHod) {
            this.ddoForm.get('cardexno').disable();
            this.ddoForm.get('ddoNo').disable();
            this.ddoForm.get('billSubmittedTo').disable();
            this.ddoForm.get('billType').disable();
            this.ddoForm.get('selectedBills').disable();
        }
        // DAT level with workflow

        if (this.isDatUser && this.hasWorkFlow) {
            this.ddoForm.disable();
            this.ddoForm.get('ddoNo').enable();
        }
        if (this.isSuperAdmin) {
            this.ddoForm.enable();
        }
    }

    /**
     * @description this is called when GR No is being changed
     */
    onGRNoChange() {
        const initalValue = this.ddoForm.controls.grNo.value.replace(/  /gi, ' ');
        this.ddoForm.controls.grNo.patchValue(initalValue);
    }

    /**
     * @description It shows Form errors
     */
    showFormErrors() {
        _.each(this.ddoForm.controls, function(formErrorControl) {
            if (formErrorControl.status === 'INVALID') {
                formErrorControl.markAsTouched({ onlySelf: true });
            }
        });
    }

    /**
     * @description It loads office detail using officeId
     * @param officeid Office Id to fetch data
     */
    loadOfficeDeatail(officeid) {
        const param = {
            id: officeid
        };
        this.edpDdoOfficeService.loadOfficeDetails(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    this.passResult = res['result'];
                    const resResult = res['result'];
                    this.transactionNo = resResult.transactionNo;
                    this.transactionDate = resResult.createdDate;
                    if (resResult.districtId) {
                        this.districtId = res['result']['districtId'];
                        this.cardexNo = res['result']['cardexno'];
                        if (this.cardexNo === null) {
                            this.loadCardexNo(this.districtId);
                        }
                        this.ddoForm.controls.cardexno.setValue(this.cardexNo);
                        this.isSubOfficeEnable = false;
                    }
                    if (this.officeDivision !== EdpDataConst.OFFICE_DIVISION_DAT) {
                        this.ddoForm.patchValue({
                            grNo: resResult.grNo,
                            uniqueId: resResult.uniqueId,
                            districtId: resResult.districtId,
                            officeTypeId: resResult.officeTypeId,
                            levelId: resResult.levelId,
                            officeName: resResult.officeName,
                            cardexno: resResult.cardexno,
                            ddoNo: resResult.ddoNo,
                            ddoType: resResult.ddoType,
                            nonDdo: resResult.nonDdo,
                            pvuId: resResult.pvuId === resResult.officeId ? 0 : resResult.pvuId,
                            desgDdoId: resResult.desgDdoId,
                            // requestTo: resResult.requestTo,
                            isCo: resResult.isCo,
                            employeeNo: resResult.employeeNo,
                            employeeName: resResult.employeeName,
                            addrLine1: resResult.addrLine1,
                            addrLine2: resResult.addrLine2,
                            talukaId: resResult.talukaId,
                            station: resResult.station,
                            pincode: resResult.pincode,
                            phoneNo: resResult.phoneNo,
                            mobileNo: resResult.mobileNo,
                            faxNo: resResult.faxNo,
                            emailId: resResult.emailId,
                            // departmentId: resResult.departmentId,
                            // departmentId: resResult.departmentId,
                            // hodId: resResult.hodId,
                            departmentId:
                                resResult.departmentId && resResult.deptName
                                    ? resResult.deptName
                                    : this.departmentList['name'],
                            hodId: resResult.hodId && resResult.hodName ? resResult.hodName : this.hodList['name'],
                            coId: resResult.coId,
                            coOfficeName: resResult.coOfficeName,
                            comment: resResult.comment,
                            officeNameDisp: resResult.officeNameDisp,
                            billSubmittedTo: resResult.billSubmittedTo,
                            billType: resResult.billType,
                            selectedBills: resResult.selectedBills
                        });
                    } else {
                        if (this.departmentList) {
                            const hod1 = this.departmentList.filter(objDep => {
                                return objDep.id === resResult.departmentId;
                            })[0];
                            if (hod1) {
                                this.hodList = _.cloneDeep(hod1.officeList);
                                this.departmentSelected();
                            }
                        }
                        this.ddoForm.patchValue({
                            grNo: resResult.grNo,
                            uniqueId: resResult.uniqueId,
                            districtId: resResult.districtId,
                            officeTypeId: resResult.officeTypeId,
                            levelId: resResult.levelId,
                            officeName: resResult.officeName,
                            cardexno: resResult.cardexno,
                            ddoNo: resResult.ddoNo,
                            ddoType: resResult.ddoType,
                            nonDdo: resResult.nonDdo,
                            pvuId: resResult.pvuId === resResult.officeId ? 0 : resResult.pvuId,
                            desgDdoId: resResult.desgDdoId,
                            // requestTo: resResult.requestTo,
                            isCo: resResult.isCo,
                            employeeNo: resResult.employeeNo,
                            employeeName: resResult.employeeName,
                            addrLine1: resResult.addrLine1,
                            addrLine2: resResult.addrLine2,
                            talukaId: resResult.talukaId,
                            station: resResult.station,
                            pincode: resResult.pincode,
                            phoneNo: resResult.phoneNo,
                            mobileNo: resResult.mobileNo,
                            faxNo: resResult.faxNo,
                            emailId: resResult.emailId,
                            departmentId: resResult.departmentId,
                            hodId: resResult.hodId,
                            coId: resResult.coId,
                            coOfficeName: resResult.coOfficeName,
                            comment: resResult.comment,
                            officeNameDisp: resResult.officeNameDisp,
                            billSubmittedTo: resResult.billSubmittedTo,
                            billType: resResult.billType,
                            selectedBills: resResult.selectedBills
                        });
                        this.selectBill();
                        if (this.userType === 'edp_user' && !this.hasWorkFlow) {
                            if (this.passResult.wfInRequest) {
                                this.hasWorkFlow = this.passResult.wfInRequest === 2 ? true : false;
                                this.setEnableDisable();
                            }
                        }
                        this.setBillEnableByTreasuryType();
                    }
                    if (this.ddoForm.controls.districtId.value) {
                        this.requestToList = _.cloneDeep(this.requestToData);
                        this.ddoForm.controls.requestTo.setValue(resResult.requestTo);
                    }
                    this.ddoForm.patchValue({
                        treasuryType: resResult.treasuryType,
                        talukaId: resResult.talukaId
                    });
                    if (resResult.objection === 2) {
                        this.objStatus = true;
                        this.ddoForm.controls.objStatus.setValue(true);
                        this.ddoForm.controls.objRemark.setValue(resResult.objectionRemarks);
                    } else {
                        this.objStatus = false;
                        this.ddoForm.controls.objStatus.setValue(false);
                    }
                    this.oficeDetailDistrictChange('load');
                    this.loadTreasuryType();
                    this.listOfNonDDO();
                    this.selectBill();
                    this.hodDisbaled();
                    this.ddoOfficeName = this.ddoForm.getRawValue().officeName;
                    if (this.action === 'view') {
                        this.ddoForm.disable();
                    }
                    this.saveDraftEnable = false;
                    if (this.officeDivision === EdpDataConst.OFFICE_DIVISION_DAT &&
                        !this.isSuperAdmin) {
                            this.checkByDat = true;
                        }
                    setTimeout(elm => {
                        this.setChanged();
                    });
                    this.isSubmitDisable = false;
                    // this.setEnableDisable();
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(this.errorMessages['ERR_OFFICE_DETAILS']);
            }
        );
        this.isSubmitDisable = false;
    }

    /**
     * @description It loads dropdown for district and others using database
     */
    getOfficeDetails() {
        this.edpDdoOfficeService.getOfficeDetails('').subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    this.districtList = res['result']['districts'];
                    this.officeTypeList = res['result']['officeType'];
                    this.officeTypeData = _.cloneDeep(res['result']['officeType']);
                    if (this.officeDivision === EdpDataConst.OFFICE_DIVISION_DAT || this.isGadUser
                        || this.isCurrentOfficeGad || this.userType === 'to_user') {
                        this.officeTypeList = _.cloneDeep(this.officeTypeData);
                    } else {
                        this.officeTypeList = this.officeTypeData.filter(officeTypeObj => {
                            return officeTypeObj.name.toLowerCase() !== EdpDataConst.AD_ID.toLowerCase();
                        });
                    }
                    this.departmentListData = res['result']['departments'];
                    if (this.hasWorkFlow) {
                        for (let i = 0; i < this.officeTypeList.length; i++) {
                            if (this.currentOfficeTypeName === EdpDataConst.HOD_ID) {
                                if (
                                    this.officeTypeList[i]['name'] === EdpDataConst.HOD_ID ||
                                    this.officeTypeList[i]['name'] === EdpDataConst.AD_ID
                                ) {
                                    this.officeTypeList.splice(i, 1);
                                }
                            } else if (this.currentOfficeTypeName === EdpDataConst.AD_ID && !this.isCurrentOfficeGad) {
                                if (this.officeTypeList[i]['name'] === EdpDataConst.AD_ID) {
                                    this.officeTypeList.splice(i, 1);
                                }
                            }
                        }
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
                    // this.billSubmittedToList = res['result']['billSubmittedTo'];
                    this.billTypeList = res['result']['billType'];
                    this.billList = res['result']['listsofBill'];
                    // this.moduleTypeList = res['result']['moduleType'];
                    this.coOfficeList = res['result']['coOffice'];
                    if (
                        res['result'] &&
                        res['result']['hod'] &&
                        res['result']['hod']['name'] &&
                        this.officeDivision !== EdpDataConst.OFFICE_DIVISION_DAT
                    ) {
                        this.hodList = res['result']['hod'];
                        this.ddoForm.controls.hodId.setValue(res['result']['hod']['name']);
                    } else {
                        this.departmentList = _.cloneDeep(this.departmentListData);
                    }
                    if (
                        res['result'] &&
                        res['result']['department'] &&
                        res['result']['department']['name'] &&
                        this.officeDivision !== EdpDataConst.OFFICE_DIVISION_DAT
                    ) {
                        this.departmentList = res['result']['department'];
                        this.ddoForm.controls.departmentId.setValue(res['result']['department']['name']);
                    } else {
                        this.departmentList = _.cloneDeep(this.departmentListData);
                    }
                    if (this.action === 'edit' || this.action === 'view') {
                        this.loadOfficeDeatail(this.officeId);
                    }
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(this.errorMessages['ERR_OFFICE_MASTER_DATA']);
            }
        );
    }

    /**
     * @description To load the Treasury Type List on Request To selection change
     */
    loadTreasuryType() {
        const req = this.ddoForm.controls.requestTo.value;
        const tresury = this.requestToList.filter(data => {
            return data['name'] === 'Treasury Office'; // data['id'] === req; // To solve bug ED-1148
        })[0];
        if (tresury) {
            this.treasuryTypeList = tresury['tresuryType'];
        }
    }

    /**
     * To assign default value in dropdown if only 1 option is available
     * @param list List
     * @param keyName KeyNAme
     * @param fieldName FieldName
     */
    assignDefaultValue(list, keyName, fieldName) {
        if (list.length === 1) {
            this.ddoForm.patchValue({
                [fieldName]: list[0][keyName]
            });
            this.ddoForm.controls[fieldName].disable();
        }
    }

    /**
     * @description To assign the selected district in office address details and load the taluka dropdown list.
     * @param changeStatus changeStatus for setting bill submitted data
     */
    oficeDetailDistrictChange(changeStatus) {
        if (changeStatus === 'change') {
            if (!this.ddoForm.getRawValue().districtId) {
                this.ddoForm.patchValue({
                    addDistrict: '',
                    stdCode: ''
                });
                this.talukaList = [];
                this.districtName = '';
                return;
            }
        }
        const districtName = this.districtList.filter(data => {
            return data['id'] === this.ddoForm.getRawValue().districtId;
        });

        /* If District select than bill submitted to field enabled */
        this.billSubmitDisabled = false;

        if (districtName) {
            this.ddoForm.patchValue({
                addDistrict: districtName[0]['name'],
                stdCode: districtName[0]['stdCode']
            });
            this.saveDraftEnable = true;
            this.talukaList = districtName[0]['taluka'];
            this.districtName = districtName[0]['name'];
            if (
                districtName[0]['name'].toLowerCase() === 'Ahmedabad'.toLowerCase() ||
                districtName[0]['name'].toLowerCase() === 'Ahmedabad(PAO)'.toLowerCase() ||
                districtName[0]['name'].toLowerCase() === 'Gandhinagar(PAO)'.toLowerCase() ||
                districtName[0]['name'].toLowerCase() === 'Gandhinagar'.toLowerCase()
            ) {
                // this.requestToList = _.cloneDeep(this.requestToData);
                if (EdpDataConst.FD_ID.toLowerCase() === this.ddoForm.controls.departmentId.value) {
                    // request to drop down values.
                    this.requestToList = this.requestToData.filter(reqObj => {
                        return reqObj.name.toLowerCase() !== EdpDataConst.PAO_ID.toLowerCase();
                    });
                } else if (EdpDataConst.AD_ID.toLowerCase() === this.ddoForm.controls.departmentId.value) {
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
            }
            this.hodDisbaled();
        } else if (EdpDataConst.FD_ID.toLowerCase() === this.ddoForm.controls.departmentId.value.toLowerCase()) {
            this.isTreasuryType = true;
        } else {
            this.isTreasuryType = false;
            this.saveDraftEnable = false;
        }

        this.officeBillMapping();
        if (changeStatus === 'change') {
            this.ddoForm.controls.billSubmittedTo.setValue('');
        }
        if (this.action === 'edit' || this.action === 'view') {
            if (this.ddoForm.getRawValue().districtId !== this.districtId) {
                this.loadCardexNo();
            } else {
                this.ddoForm.controls.cardexno.setValue(this.cardexNo);
            }
        } else {
            this.loadCardexNo();
        }
    }

    /**
     * @description Select District based on display Sub district Treasury Office in Bill Submitted To Field
     */
    officeBillMapping() {
        const param = {
            id: this.ddoForm.getRawValue().districtId
        };
        this.edpDdoOfficeService.getOfficeBillMapping(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    this.billSubmittedToList = res['result'];
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @description It loads cardex no based on district ID
     * @param districtId districtId to load cardex No
     */
    loadCardexNo(districtId?, directGenerate: boolean = false) {
        const param = {
            id: districtId ? districtId : this.ddoForm.getRawValue().districtId
        };
        if (this.userType === 'to_user' || (this.userType === 'edp_user' && !this.hasWorkFlow) || directGenerate) {
            this.edpDdoOfficeService.getCardexNo(param).subscribe(
                res => {
                    if (res && res['result'] && res['status'] === 200) {
                        this.ddoForm.controls.cardexno.setValue(res['result']['id']);
                    } else {
                        this.toastr.error(this.errorMessages['ERR_CARDEX_NO']);
                    }
                },
                err => {
                    this.toastr.error(this.errorMessages['ERR_CARDEX_NO']);
                }
            );
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

    /**
     * @description To append ',' in a string
     * @param name Name
     * @param appendValue appendValue
     */
    prepareOfficeName(name, appendValue) {
        if (appendValue) {
            if (name.lastIndexOf(',') === name.length - 1) {
                name += appendValue;
            } else {
                name += ', ' + appendValue;
            }
        }
        return name;
    }

    /**
     * @description based on button clicked it saves or submits data
     * @param buttonName which button is clicked
     */
    saveDDO(buttonName, requiredPopUp?) {
        if (buttonName === 'submit') {
            const checkValid = this.checkValidationForSubmit();
            if (!checkValid) {
                return;
            }
        } else {
            if (this.ddoForm.controls.districtId.value > 0) {
                // this.saveOfficeApi(param, buttonName);
                // this.isInsert = false;
            } else {
                this.ddoForm.controls.districtId.markAsTouched({ onlySelf: true });
                this.toastr.error(this.errorMessages['DISTRICT']);
                return;
            }
        }
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

                if (!this.isOfficeDivision) {
                    param.departmentId = this.departmentList['id'];
                    param.hodId = this.hodList['id'] ? this.hodList['id'] :
                        this.passResult && this.passResult.hodId ? this.passResult.hodId : null;
                    if (this.currentOfficeTypeName.toLowerCase() === EdpDataConst.AD_ID.toLowerCase()) {
                        param.hodId = this.ddoForm.controls.hodId.value;
                    }
                } else {
                    if (this.departmentList && this.departmentList.length > 0) {
                        const department = this.departmentList.filter(deptObj => {
                            return param.departmentId === deptObj.id;
                        })[0];
                        if (department) {
                            param.departmentId = department['id'];
                        }
                    }

                    if (this.hodList && this.hodList.length > 0) {
                        const hodName = this.hodList.filter(hodObj => {
                            return param.hodId === hodObj.id;
                        })[0];
                        if (hodName) {
                            param.hodId = hodName['id'];
                        }
                    }
                }
                if (!(this.isDepartmentVisible && !this.isHOD)) {
                    if (this.isHOD) {
                        param['hodId'] = null;
                    }
                    param['departmentId'] = this.isDepartmentVisible ? param['departmentId'] : null;
                    param['hodId'] = param['departmentId'] ? param['hodId'] : null;
                }
                param.officeId = this.officeId ? this.officeId : 0;
                param.curMenuId = this.commonService.getMenuId();
                param.wfInRequest = this.hasWorkFlow ? 2 : 1;
                param.initiatedBy = this.loggedUserPouId ? this.loggedUserPouId : 0;

                param.stdCode = Number(param.stdCode);
                if (this.action === 'edit') {
                    if (!this.isOfficeDivision) {
                        param.departmentId = param.departmentId ? this.passResult.departmentId : param.departmentId;
                        param.hodId = param.hodId ?
                            this.passResult.hodId ? this.passResult.hodId : param.hodId
                            : param.hodId;
                    }
                    param.transactionNo = this.transactionNo;
                    param.isUpdateOffice = false;
                    param.isNewOffice = true;
                    param.activeStatus = 1;
                    if (param.objStatus) {
                        param.objStatus = 2;
                        param.objection = 2;
                        param.objectionRemarks = param.objRemark;
                    } else {
                        param.objStatus = 1;
                        param.objection = 1;
                        param.objectionRemarks = null;
                    }
                    if (buttonName === 'submit') {
                        param['msgFlag'] = false; // for proper submit message of office creation it should be false
                        param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
                        const checkValid = this.checkValidationForSubmit();
                        if (checkValid) {
                            if (this.hasWorkFlow) {
                                this.openWorkFlow(param, buttonName);
                            } else {
                                this.updateOfficeApi(param, buttonName);
                            }
                        } else {
                            return false;
                        }
                    } else {
                        param['formAction'] = EdpDataConst.STATUS_DRAFT;
                        this.updateOfficeApi(param, buttonName);
                    }
                } else {
                    param.menuShName = this.commonService.getMenuCode();
                    if (param.objStatus) {
                        param.objStatus = 2;
                        param.objection = 2;
                        param.objectionRemarks = param.objRemark;
                    } else {
                        param.objStatus = 1;
                        param.objection = 1;
                        param.objectionRemarks = null;
                    }
                    param.isUpdateOffice = false;
                    if (buttonName === 'submit') {
                        param['msgFlag'] = false; // for proper submit message of office creation it should be false
                        param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
                        const checkValid = this.checkValidationForSubmit();
                        if (checkValid) {
                            if (this.hasWorkFlow) {
                                this.openWorkFlow(param, buttonName);
                            } else {
                                this.updateOfficeApi(param, buttonName);
                            }
                        } else {
                            return false;
                        }
                    } else {
                        param['formAction'] = EdpDataConst.STATUS_DRAFT;
                        if (param.districtId > 0) {
                            this.saveOfficeApi(param, buttonName);
                            // this.isInsert = false;
                        } else {
                            this.toastr.error(this.errorMessages['DISTRICT']);
                        }
                    }
                }
            }
        });
    }
    checkValidationForSubmit() {
        _.each(this.ddoForm.controls, function(editControl) {
            if (editControl.status === 'INVALID') {
                editControl.markAsTouched({ onlySelf: true });
            }
        });
        if (this.ddoForm.valid && this.attachmentView && this.attachmentView.checkForMandatory()) {
            //  this.isSubmitDisable = true;
            return true;
        } else {
            if (!this.ddoForm.valid) {
                this.toastr.error('Please Fill All Mandatory Fields');
                return false;
            }
            if (this.attachmentView && !this.attachmentView.checkForMandatory()) {
                this.toastr.error(msgConst.ATTACHMENT.ERR_NOT_UPLOAD);
                return false;
            }
        }
    }

    /**
     * @param savingData savingData parameter to pass in save or update API
     * @param buttonName buttonName whether submit or save
     * @description It opens workflow popup.
     */
    openWorkFlow(savingData, buttonName) {
        const param = {
            id: this.officeId,
            menuId: EdpDataConst.MENU.OFFICE_CREATION_MENU_ID
        };

        this.edpDdoOfficeService.getCommonWfHeaderDetails(param).subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                // Dynamic
                this.ddoForm.markAsUntouched();
                const headerJson: HeaderJson[] = res.result;
                const moduleInfo = {
                    moduleName: ModuleNames.EDP,
                    districtId: this.ddoForm.getRawValue().districtId
                };
                const workflowData: WorkflowPopupData = {
                    menuModuleName: ModuleNames.EDP,
                    headingName: EdpDataConst.CREATE_NEW_OFFICE,
                    headerJson: headerJson,
                    trnId: this.officeId, // dynamic
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

                        if (
                            popUpRes.trnStatus &&
                            popUpRes.trnStatus.toLowerCase() === 'approved' &&
                            popUpRes.wfStatus &&
                            popUpRes.wfStatus.toLowerCase() === 'Approved by Director'.toLowerCase()
                        ) {
                            savingData['wfFinalSubmit'] = 2;
                            savingData['msgFlag'] = false; // for message of final submit Office Creation
                        } else {
                            savingData['wfFinalSubmit'] = 1;
                            savingData['msgFlag'] = null; // for message of Office Updation
                        }
                        if (popUpRes.trnStatus === EdpDataConst.CANCEL_WF_STATUS ||
                            popUpRes.trnStatus === EdpDataConst.REJECT_WF_STATUS) {
                                savingData['wfStatus'] = popUpRes.trnStatus;
                        }
                        if (this.action === 'edit') {
                            this.updateOfficeApi(savingData, buttonName);
                        } else {
                            this.saveOfficeApi(savingData, buttonName);
                        }
                        // this.goToListing();
                    }
                });
            }
        });
    }

    /**
     * @param param savingData parameter to pass update API
     * @param buttonName buttonName whether submit or save
     * @description calls Update API and saves Data
     */
    updateOfficeApi(param, buttonName) {
        this.edpDdoOfficeService.updateOfficeDetails(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200 && res['message']) {
                    this.ddoForm.markAsUntouched();
                    if (param['formAction'] === EdpDataConst.STATUS_DRAFT) {
                        this.toastr.success(res['message']);
                    } else {
                        if (param['wfFinalSubmit'] === 2 || param['msgFlag'] === false) {
                            this.toastr.success(res['message']);
                        }
                    }
                    this.passResult = param;
                    // this.selectedIndex = 1;
                    this.saveDraftEnable = false;
                    if (this.subOfficeList) {
                        this.subOfficeList.newSearch = true;
                        this.subOfficeList.getSubOfficeList();
                    }
                    if (res['result']['districtId']) {
                        this.isSubOfficeEnable = false;
                    }
                    if (buttonName === 'submit') {
                        this.goToListing();
                    }
                    this.isSubmitDisable = false;
                } else {
                    this.isSubmitDisable = false;
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @param param savingData parameter to pass update API
     * @param buttonName buttonName whether submit or save
     * @description Saves data using Save API
     */
    saveOfficeApi(param, buttonName) {
        this.edpDdoOfficeService.saveOfficeDetails(param).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200 && res['message']) {
                    this.toastr.success(res['message']);
                    this.ddoForm.markAsUntouched();
                    this.passResult = param;
                    // this.selectedIndex = 1;
                    if (this.subOfficeList) {
                        this.subOfficeList.newSearch = true;
                        this.subOfficeList.getSubOfficeList();
                    }
                    if (res['result']['districtId']) {
                        this.isSubOfficeEnable = false;
                    }

                    this.action = 'edit';
                    this.officeId = res['result']['officeId'];
                    this.transactionNo = res['result']['transactionNo'];
                    this.transactionDate = res['result']['createdDate'];
                    this.saveDraftEnable = true;
                    this.isSubmitDisable = false;
                    if (buttonName === 'submit') {
                        this.goToListing();
                    }
                    this.isSubmitDisable = false;
                } else {
                    this.saveDraftEnable = true;
                    this.isSubmitDisable = false;
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @description It opens create new child pop up and passes necessary Data to it.
     */
    createSubChild() {
        const object = _.cloneDeep(this.ddoForm.getRawValue());
        if (this.officeDivision &&
                this.officeDivision.toLowerCase() === EdpDataConst.OFFICE_DIVISION_DAT.toLowerCase()) {
            const departmentName = this.departmentList.filter(data => {
                return data['id'] === this.ddoForm.getRawValue().departmentId;
            });
            object['departmentList'] = departmentName;
            const hodName = this.hodList.filter(obj => {
                return obj['id'] === this.ddoForm.getRawValue().hodId;
            });
            object['hodList'] = hodName;
        } else {
            object.departmentId = this.passResult.departmentId;
            object['departmentList'] = this.departmentList;
            object['hodList'] = this.hodList;
            if (
                this.currentOfficeTypeName.toLowerCase() === EdpDataConst.AD_ID.toLowerCase() &&
                this.ddoForm.controls.officeTypeId.value === 71
            ) {
                const hodDept = this.hodList.filter(obj => {
                    return obj.id === this.ddoForm.controls.hodId.value;
                });
                object['hodList'] = hodDept[0] ? hodDept[0] : this.hodList;
            }
        }
        const district = this.districtList.filter(obj => {
            return obj.id === this.ddoForm.getRawValue().districtId;
        });
        object['districtList'] = district;
        object['officeId'] = this.officeId;
        object['action'] = this.action;
        object['subOfficeUpdateFlag'] = this.subOfficeUpdateFlag;
        object['subOfficeFlag'] = this.subOfficeFlag;
        object['isDepartmentVisible'] = _.cloneDeep(this.isDepartmentVisible);
        object['isHOD'] = _.cloneDeep(this.isHOD);
        object['datAsHOD'] = this.datAsHOD;
        const dialogRef = this.dialog.open(SubOfficeCreationComponent, {
            width: '1000px',
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
     * @description It populates non ddo dropdown
     */
    listOfNonDDO() {
        const ddoName = this.ddoTypeList.filter(obj => {
            return obj.id === this.ddoForm.controls.ddoType.value;
        })[0];
        if (ddoName) {
            if (ddoName['name'].replace(/ /g, '').toLowerCase() === 'nonddo') {
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
     * @description based on Office Type it sets dropdown data for Level and Office Mapping.
     */
    hodDisbaled() {
        const officeType = this.officeTypeList.filter(typeObj => {
            return typeObj.id === this.ddoForm.getRawValue().officeTypeId;
        })[0];
        if (officeType) {
            // this.ddoForm.controls.levelId.setValue('');
            this.requiredField();
            const officeName = officeType.name.toLowerCase();
            if (officeName === EdpDataConst.AD_ID.toLowerCase()) {
                if (
                    this.districtName &&
                    this.districtName.toLowerCase() !== 'Gandhinagar'.toLowerCase() &&
                    this.districtName.toLowerCase() !== 'Gandhinagar(PAO)'.toLowerCase()
                ) {
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
                if (this.officeDivision === EdpDataConst.OFFICE_DIVISION_DAT || this.isGadUser) {
                    this.ddoTypeList = this.ddoTypeData.filter(levelObj => {
                        return levelObj.name.toLowerCase() === EdpDataConst.DDO_ID.toLowerCase();
                    });
                }
                this.isDepartmentVisible = false;
                this.isHOD = false;
                this.isTreasuryType = false;
                this.isHODRequired = false;
                this.ddoForm.controls.departmentId.clearValidators();
                this.ddoForm.controls.departmentId.updateValueAndValidity();
            } else if (officeName === EdpDataConst.HOD_ID.toLowerCase()) {
                // Head of Department condition for Office type.
                this.levelList = this.levelData.filter(levelObj1 => {
                    return (
                        levelObj1.name.toLowerCase() === EdpDataConst.STATE_ID.toLowerCase() ||
                        levelObj1.name.toLowerCase() === EdpDataConst.DISTRICT_ID.toLowerCase()
                    );
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
                if (this.isGadUser || this.officeDivision === EdpDataConst.OFFICE_DIVISION_DAT) {
                    // pay verfication unit field data disabled.
                    this.pvuList = this.pvuData.filter(pvuObj => {
                        return pvuObj.name.toLowerCase() !== EdpDataConst.PVU_ID.toLowerCase();
                    });
                    this.isDepartmentVisible = true;
                    this.isHOD = true;
                    this.isTreasuryType = false;
                }
                this.isDepartmentVisible = true;
                this.isHOD = true;
                this.isHODRequired = false;
                this.isTreasuryType = false;
                this.ddoForm.controls.departmentId.setValidators(Validators.required);
                this.ddoForm.controls.departmentId.updateValueAndValidity();
            } else if (
                officeName === EdpDataConst.OFFICE_DDO_ID.toLowerCase() &&
                EdpDataConst.FD_ID.toLowerCase() === this.ddoForm.controls.departmentId.value
            ) {
                this.isTreasuryType = true;
                this.isHOD = false;
                this.isHODRequired = true;
                // Head of Department condition for Office type.
                this.levelList = _.cloneDeep(this.levelData);
                this.setHodDropdownVisble();
            } else if (officeName === EdpDataConst.OFFICE_DDO_ID.toLowerCase()) {
                this.isDepartmentVisible = true;
                this.isHOD = false;
                if (this.isDatUser) {
                    this.isTreasuryType = true;
                }
                this.isHODRequired = true;
                this.levelList = _.cloneDeep(this.levelData);
                this.pvuList = _.cloneDeep(this.pvuData);
                this.ddoTypeList = _.cloneDeep(this.ddoTypeData);
                this.setHodDropdownVisble();
            } else {
                // department should be Administrative Department.
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
                this.isDepartmentVisible = true;
                this.levelList = _.cloneDeep(this.levelData);
                this.pvuList = _.cloneDeep(this.pvuData);
                this.ddoTypeList = _.cloneDeep(this.ddoTypeData);
                this.ddoForm.controls.departmentId.setValidators(Validators.required);
                this.ddoForm.controls.departmentId.updateValueAndValidity();
            }
        } else {
            this.isHODRequired = false;
            this.isTreasuryType = false;
            this.isHOD = false;
            this.isDepartmentVisible = true;
            this.levelList = _.cloneDeep(this.levelData);
            this.pvuList = _.cloneDeep(this.pvuData);
            this.ddoTypeList = _.cloneDeep(this.ddoTypeData);
            this.ddoForm.controls.departmentId.setValidators(Validators.required);
            this.ddoForm.controls.departmentId.updateValueAndValidity();
        }
    }

    /**
     * @description It Sets required Field For form
     */
    requiredField() {
        this.isCntrlOfficer = true;
        this.isCoOfficeNameRequired = false;
        this.isCoDesignationRequired = false;
        this.isTalukaRequired = false;
        // this.isHODRequired = false;
        this.ddoForm.controls.coId.clearValidators();
        this.ddoForm.controls.coOfficeName.clearValidators();
        this.ddoForm.controls.coId.updateValueAndValidity();
        this.ddoForm.controls.coOfficeName.updateValueAndValidity();
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
     * @description It loads employee name based on emp number
     */
    loadEmployeeName() {
        if (this.ddoForm.getRawValue().employeeNo && this.ddoForm.getRawValue().employeeNo.length === 10) {
            this.edpDdoOfficeService.getEmployeeName({ id: this.ddoForm.getRawValue().employeeNo }).subscribe(
                res => {
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
                },
                err => {
                    this.toastr.error(err);
                }
            );
        } else {
            this.ddoForm.controls.employeeName.setValue('');
        }
    }

    /**
     * @description based on bill selected it populates bill type
     */
    selectBill() {
        const billType = this.billTypeList.filter(obj => {
            return obj.id === this.ddoForm.controls.billType.value;
        })[0];
        if (billType) {
            if (billType.name.toLowerCase() === 'Selected'.toLowerCase()) {
                this.isSelected = true;
                this.ddoForm.controls.selectedBills.setValidators(Validators.required);
                this.ddoForm.controls.selectedBills.updateValueAndValidity();
                this.listOfBills();
            } else {
                this.isSelected = false;
                this.billList = [];
                this.ddoForm.controls.selectedBills.setValue(null);
                this.ddoForm.controls.selectedBills.clearValidators();
                this.ddoForm.controls.selectedBills.updateValueAndValidity();
            }
        } else {
            this.isSelected = false;
            this.billList = [];
            this.ddoForm.controls.selectedBills.setValue(null);
            this.ddoForm.controls.selectedBills.clearValidators();
            this.ddoForm.controls.selectedBills.updateValueAndValidity();
        }
    }

    /**
     * @description call API based on Bill Type selection and display options in list of bills field
     */
    listOfBills() {
        this.edpDdoOfficeService.getListOfBills().subscribe(
            res => {
                if (res && res['status'] === 200) {
                    this.billList = res['result'];
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @description Open dialog to view the selected bill list
     */
    loadSelectedList() {
        const selectedBill = this.ddoForm.controls.selectedBills.value;
        if (selectedBill && selectedBill.length > 0) {
            const billArray = [];
            selectedBill.forEach(id => {
                if (this.billList && this.billList.length > 0) {
                    billArray.push(
                        this.billList.filter(bill => {
                            return bill.id === id;
                        })[0]
                    );
                }
            });
            if (billArray && billArray.length > 0) {
                const dialogRef = this.dialog.open(SelectedBillDialogComponent, {
                    width: '800px',
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
     * @description On objection change method is called to set remarks mandatory or not
     */
    ObjectionRemarks() {
        if (this.ddoForm.controls.objStatus.value === true) {
            this.objStatus = true;
            this.ddoForm.controls.objRemark.setValidators(Validators.required);
            this.ddoForm.controls.objRemark.updateValueAndValidity();
        } else {
            this.objStatus = false;
            this.ddoForm.controls.objRemark.clearValidators();
            this.ddoForm.controls.objRemark.updateValueAndValidity();
        }
    }

    /**
     * @description routing to listing page
     */
    goToListing() {
        this.router.navigate(['/dashboard/edp/office/list'], { skipLocationChange: true });
    }

    /**
     * @description routing to dashboard page
     */
    goToDashboard() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }

    /**
     * @description sets form status
     */
    setFormStatus() {
        // Find form is valid or not
        this.edpDdoOfficeService.setStatus(this.ddoForm.valid);
    }

    tabChage(event) {
        if (event.index === 2) {
            this.setFormStatus();
        }
    }

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

    /**
     * @description Calls API which checks for Workflow or not
     */
    checkForWorkflowCno() {
        this.edpDdoOfficeService.checkForWorkflowCno({}).subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                this.hasWorkFlow = res.result;
                this.setEnableDisable();
            }
        });
    }

    /**
     * Sets enable and disable of fields
     */
    setEnableDisable() {
        if (this.userType === 'edp_user' && this.hasWorkFlow) {
            if (this.commonService.getwfRoleId()) {
                // It sets DAT as Hod if it has Creator, Verifier and Approver Role
                const wfRoleIdArray = this.commonService.getwfRoleId();
                wfRoleIdArray.forEach(element => {
                    if (
                        element['wfRoleIds'][0] === EdpDataConst.WF_CREATOR_ROLE ||
                        element['wfRoleIds'][0] === EdpDataConst.WF_VERIFIER_ROLE ||
                        element['wfRoleIds'][0] === EdpDataConst.WF_APPROVER_ROLE
                    ) {
                        this.datAsHOD = true;
                        this.userType = 'hod_user';
                        this.isHod = true;
                        this.isOfficeDivision = false;
                        this.officeDivision = null;
                        this.ddoForm.get('cardexno').disable();
                        this.ddoForm.get('ddoNo').disable();
                        this.ddoForm.get('billSubmittedTo').disable();
                        this.ddoForm.get('billType').disable();
                        this.ddoForm.get('selectedBills').disable();
                    }
                });
            }
        }
        if (((this.userType === 'edp_user' && this.hasWorkFlow) ||
            this.userType === 'to_user') && this.action !== 'view') {
            this.ddoForm.disable();
            this.ddoForm.controls.objStatus.enable();
            this.ddoForm.controls.objRemark.enable();
            if (this.userType === 'edp_user' && this.hasWorkFlow) {
                this.ddoForm.controls.ddoNo.enable();
            } else if (this.userType === 'to_user') {
                this.ddoForm.controls.billSubmittedTo.enable();
                this.ddoForm.controls.billType.enable();
                this.ddoForm.controls.selectedBills.enable();
            }
        }
    }

    /**
     * @description It gets department from department List based on office name
     * @param officeName officeNAme to get department
     */
    getDepartmentSelection(officeName) {
        const departmentName = this.departmentListData.filter(data => {
            return data['name'] === officeName;
        });
        return departmentName;
    }

    /**
     * @description It opens dropdown visible if loggedin user is AD and office type is DDO
     */
    setHodDropdownVisble() {
        if (this.currentOfficeTypeName.toLowerCase() === EdpDataConst.AD_ID.toLowerCase()) {
            this.showHodDropDown = true;
            // const deptName = this.getDepartmentSelection(this.currentOfficeName);
            this.departmentSelected(undefined, this.departmentList['id']);
            if (this.passResult && this.passResult.hodId) {
                this.ddoForm.patchValue({
                    hodId: this.passResult.hodId
                });
            }
        }
    }

    /**
     * @description It opens view comments pop up on button click
     */
    viewComments() {
        const param = {
            id: this.officeId,
            menuId: EdpDataConst.MENU.OFFICE_CREATION_MENU_ID
        };
        this.edpDdoOfficeService.getCommonWfHeaderDetails(param).subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                const headerJson: HeaderJson[] = res.result;
                this.dialog.open(ViewCommonWorkflowHistoryComponent, {
                    width: '2700px',
                    height: '600px',
                    data: {
                        menuModuleName: ModuleNames.EDP,
                        headingName: EdpDataConst.CREATE_NEW_OFFICE,
                        headerJson: headerJson,
                        trnId: this.officeId,
                        refNo: this.transactionNo, // dynamic
                        refDate: this.transactionDate // dynamic
                    }
                });
            } else {
                this.toastr.error(res.message);
            }
        });
    }
    checkDuplicateDDO() {
        const ddoNo = this.ddoForm.getRawValue().ddoNo;
        const districtId = this.ddoForm.getRawValue().districtId;
        if (ddoNo && districtId) {
            const params = {
                ddoNo: ddoNo.toString(),
                districtId : +districtId
            };
            this.edpDdoOfficeService.checkForDuplicateDdoNo(params).subscribe(
                res => {
                    if (res && res['result'] && res['status'] === 200) {
                        if (res['result'] && res['result'] === true) {
                            this.toastr.warning(res['message']);
                        }
                    }
                }, err => {
                    this.toastr.error(err);
                }
            );
        } else {
            if (!districtId) {
                this.toastr.error(this.errorMessages.DISTRICT);
            }
        }
    }

    setBillEnableByTreasuryType() {
        if (this.userType === 'edp_user' && this.hasWorkFlow) {
            if (this.passResult && this.passResult.treasuryType &&
                (this.passResult.treasuryType === EdpDataConst.TREASURY_TYPE_TO_OFFICE_ID
                    || this.passResult.treasuryType === EdpDataConst.TREASURY_TYPE_PAO_OFFICE_ID)) {
                    this.isRequestTC = true;
                    if (this.cardexNo === null) {
                        this.loadCardexNo(this.passResult.districtId, true);
                    }
                    this.ddoForm.controls.billSubmittedTo.enable();
                    this.ddoForm.controls.billType.enable();
                    this.ddoForm.controls.selectedBills.enable();
                    this.isSubmitDisable = false;
            }
        }
    }

    /**
     * @description Checks for duplicate treasury office name if exists or not
     */
    checkDuplTreasuryOffName() {
        const districtId = this.ddoForm.getRawValue().districtId;
        const officeName = this.ddoForm.getRawValue().officeName;
        const treasuryType = this.ddoForm.getRawValue().treasuryType;
        if (districtId && officeName && treasuryType && treasuryType === EdpDataConst.TREASURY_TYPE_TO_OFFICE_ID) {
            const districtName = this.districtList.find(x => x.id === districtId).name;
            const params = {
                'districtid': districtId,
                'officeName': officeName,
                'name': districtName
            };
            this.edpDdoOfficeService.checkDuplOffName(params).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result']) {
                        this.toastr.warning(res['message']);
                    }
                }
            }, err => {
                this.toastr.error(err);
            });
        }
    }

    interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, idx: number) {
        let result = true;
        if (this.ddoForm.touched === true) {
            result = false;
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                // data: this.constantData.DATA_WILL_LOST_MESSAGE
                data: 'Do you want to save the data?'
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
}
