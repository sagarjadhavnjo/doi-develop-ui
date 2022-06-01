import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
// import { lcMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue, Treasury } from './../../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../../directive/letter-of-credit-directive';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription } from 'rxjs';
import { EdpDdoOfficeService } from '../../../edp/services/edp-ddo-office.service';
import * as _ from 'lodash';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { LcCommonWorkflowComponent } from '../../lc-common-workflow/lc-common-workflow.component';
import { LetterOfCreditService } from '../../service/letter-of-credit.service';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { CommonWorkflowService } from '../../../common/workflow-service/common-workflow.service';
import { lcMessage, MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { OkDialogComponent } from 'src/app/shared/components/ok-dialog/ok-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';


@Component({
    selector: 'app-create-lc-account-division',
    templateUrl: './create-lc-account-division.component.html',
    styleUrls: ['./create-lc-account-division.component.css']
})
export class CreateLcAccountDivisionComponent implements OnInit {


    /**
   * Configuration for this file
   *
   *
   * @memberOf CreateLcAccountDivisionComponent
   */


    // List of Major Head
    majorHead_list: any[] = [];

    // List of Sub Major Head
    subMajorHead_list: any[] = [];

    // List of Minor Head
    minorHead_list: any[] = [];

    // List of Sub Head
    subHead_list: any[] = [];

    // List of Detailed Head
    detailedHead_list: any[] = [];
    // Table Data for Treasury LC Data
    TreasuryLCData: Treasury[] = [{ employeeNumber: '', employeeName: '' }];

    // Table Columns for Treasury Lc Data
    TreasuryLCDataColumn: string[] = ['srNo', 'employeeNumber', 'employeeName', 'action'];

    // Table Data for Sub Treasury LC Data
    SubTreasuryLCData: Treasury[] = [{ employeeNumber: '', employeeName: '' }];
    // List Bank Name
    BankName_list: any[] = [];

    BankBranch_list: any[] = [];

    // List of Designation
    designation_list: ListValue[] = [{ value: '1', viewValue: 'Deputy Accountant' }];

    // Table Columns for Sub Treasury Lc Data
    SubTreasuryLCDataColumn: string[] = ['srNo', 'employeeNumber', 'employeeName', 'action'];



    // List of Circle Names
    CircleNameList: any[] = [];

    // List of Head of department
    headOfDepartmentList: any[] = [];

    // List of Attachments
    attachmentTypeCode: any[] = [
        { value: '01', viewValue: 'Supporting Document' },
        { value: '02', viewValue: 'Sanction Order' },
        { value: '03', viewValue: 'Others' }
    ];
    brwoseData: any[] = [
        {
            name: undefined,
            file: undefined,
            uploadedBy: '',
            attachmentType: ''
        }
    ];
    displayedBrowseColumns = [
        'position',
        'attachmentTypeId',
        'fileName',
        'browse',
        'uploadedFileName',
        'userName',
        'action'
    ];
    @Input() isView: boolean;
    @Input() isEdit: boolean;
    circleCode: any;
    circleId: any;
    circleName: any;
    postList1: any;
    totalAttachmentSize: number;
    fileBrowseIndex: number;
    userName: any;
    currentUserData: any;
    wfRoleIds: any;
    wfRoleCode: any;
    menuId: any;
    linkMenuId: any;
    postId: any;
    userId: any;
    lkPoOffUserId: any;
    departmentName: any;
    userPostList: any;
    departmentId: any;
    officeName: any;
    officeId: any;
    districtName: any;
    districtId: any;
    firstName: any;
    cardexno: any;
    ddoNo: any;
    divisionOfficeAddress: any;
    subscribeParams: Subscription;
    mode: any;
    disableflag: boolean;
    otherCircle: { circleCode: any; circleId: any; circleName: any };
    action: any;
    status: any;
    attachmentTypeList: any[] = [];
    viewableExtension = ['pdf', 'jpg', 'jpeg', 'png'];
    selectedFilePreviewPdf: string;
    selectedFilePreviewImageBase64: string;
    selectedFileBase64: string;
    dData: any;
    showWorkFlowAction: boolean = true;
    maxAttachment: number;
    constant = EdpDataConst;
    isEditable: any;
    agOfficeProcessEnableFlag: boolean = false;
    bankDetailsProcessEnableFlag: boolean = false;
    divisionDetailsProcessEnableFlag: boolean = false;
    selectedTabIndex: number = 0;
    tabNameHdrId: any;
    hdrId: any;
    agDetailTabDropDownValues: any;
    lcOpenReqDivSdId: number = null;
    officeNameId: any;
    isCoDdoHodTabHideFlag: boolean = false;
    isTreasuryHideFlag: boolean = false;
    isAgHideFlag: boolean = false;
    treasuryOfficeId: any;
    openReqEditReset: boolean = false;
    bankDetailsEditReset: boolean = false;
    agOfficeEditReset: boolean = false;
    divisionOfficeEditReset: boolean = false;
    referenceNo: any;
    referenceDt: any;
    createRecordFlag: boolean = true;
    datLoginFlag: boolean = false;
    openReqResetFlag: boolean = true;
    bankDetailsResetFlag: boolean = true;
    agDetailsResetFlag: boolean = true;
    divisionDetailsResetFlag: boolean = true;
    disableTabs: boolean;
    minDate = new Date();
    showTreasuryVar = true;
    isInputTreasury = true;
    isInputSubTreasury = true;
    isDeleteTreasury = false;
    isDeleteSubTreasury = false;
    workFlowData = 'fromLCAccountOpeningRequest';
    divisionOfficeAddressValue = 'Deputy Conservator of Forest, Neat Temple, Gandhinagar';
    administrativeDepartmentValue = 'Forest and Environment Department';
    parentHeadDepartmentValue = 'Convertor of Forest';
    districtValue = 'Gandhinagar';
    cardexNoValue = '986';
    ddoCodeValue = '986';
    ddoNameValue = 'Deputy Conservator of Forest';
    noOfSanctionedValue = '2';
    todayDate = new Date();
    anticipatedDateValue = new Date(2019, 1, 15);
    showRemarksVar = false;
    showDesignationVar = false;
    errorMessage = lcMessage;

    /**
     * Form Group Instance
     *
     * @type {FormGroup}
     * @memberOf CreateLcAccountDivisionComponent
     */
    lcOpeningRequestCreateForm: FormGroup;
    aGOfficeCreateForm: FormGroup;
    bankDetailsCreateForm: FormGroup;
    divisionOfficeCreateForm: FormGroup;
    OfficeNameCtrl: FormControl = new FormControl();
    budgetProvisionCtrl: FormControl = new FormControl();
    detailsOfStaffCtrl: FormControl = new FormControl();
    designationCtrl: FormControl = new FormControl();
    CircleNameCtrl: FormControl = new FormControl();
    headOfDepartmentCtrl: FormControl = new FormControl();
    majorHeadCtrl: FormControl = new FormControl();
    subMajorHeadCtrl: FormControl = new FormControl();
    minorHeadCtrl: FormControl = new FormControl();
    subHeadCtrl: FormControl = new FormControl();
    detailedHeadCtrl: FormControl = new FormControl();
    BankNameCtrl: FormControl = new FormControl();
    BankBranchCtrl: FormControl = new FormControl();
    attachmentTypeCodeCtrl: FormControl = new FormControl();
    /**
     * Mat table instance
     *
     * @type {MatTableDataSource<any>}
     * @memberOf CreateLcAccountDivisionComponent
     */

    TreasuryLCDataSource = new MatTableDataSource(this.TreasuryLCData);
    SubTreasuryLCDataSource = new MatTableDataSource(this.SubTreasuryLCData);
    dataSourceBrowse = new MatTableDataSource(this.brwoseData);

    /**
    * attachment
    *
    * @type {attachment}
    * @memberOf CreateLcAccountDivisionComponent
    */



    @ViewChild('attachment', { static: true }) attachment: ElementRef;
    openreqEditResult: any;
    circleNameFalg: boolean;

    /**
    * Creates an instance of CreateLcAccountDivisionComponent.
    * @param {FormBuilder} fb
    * @param {LetterOfCreditService} locService
    * @param {StorageService} storageService
    * @param {CommonWorkflowService} commonWorkflowService
    * @param {ToastrService} toastr
    * @param {MatDialog} dialog
    * @param {Router} router
    * @param {ActivatedRoute} activatedRoute
    *
    * @memberOf CreateLcAccountDivisionComponent
    */

    constructor(
        private fb: FormBuilder,
        private el: ElementRef,
        private toastr: ToastrService,
        private storageService: StorageService,
        private activatedRoute: ActivatedRoute,
        private locService: LetterOfCreditService,
        private commonWorkflowService: CommonWorkflowService,
        public dialog: MatDialog,
        private router: Router
    ) { }

    /**
    * 
    * Create object to access Methods of Letter of Credit Directive
    * 
    * */
    directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);


    /***********************Life cycle hooks methods start***********************************/

    /**
     * Life cycle hooks method
     *
     *
     * @memberOf CreateLcAccountDivisionComponent
     */

    ngOnInit() {
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.mode = resRoute.mode;
            this.action = resRoute.action;
            this.status = resRoute.status;
            this.hdrId = resRoute.id;
            this.isEditable = resRoute.isEditable;
        });
        if (this.hdrId == undefined || this.hdrId == null || this.hdrId == 'NaN') {
            this.disableTabs = true;
        } else this.disableTabs = false;

        this.userName = this.storageService.get('userName');
        this.currentUserData = this.storageService.get('currentUser');
        this.userPostList = this.currentUserData['post'];
        console.log(this.userPostList)
        this.userPostList = this.userPostList.filter(row => row.loginPost == true)
        console.log(this.userPostList)

        const userPostList = _.head(this.userPostList)
        this.postList1 = userPostList
        if (userPostList) {
            console.log(userPostList)
            this.departmentId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].departmentId;
            this.departmentName = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].deptName;
            this.officeName = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeName;
            this.divisionOfficeAddress = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].addrLine1;
            this.officeNameId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeId;
            this.districtName = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].districtName;
            this.districtId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].districtId;
            this.cardexno = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].cardexno;
            this.ddoNo = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].ddoNo;

        }


        if (userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'AG') {
            this.isAgHideFlag = true;
        } else if (userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].isTreasury == 2) {
            this.isTreasuryHideFlag = true;
        } else if (userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'DAT') {
            this.datLoginFlag = true;
        } else {
            this.isCoDdoHodTabHideFlag = true;
        }

        this.headOfDepartmentList.push({
            id: this.officeNameId,
            name: this.officeName
        });
        this.disableflag = true;

        this.storageService.get('menu').forEach(menu => {
            if (menu.menuName === 'Letter of Credit') {
                menu.menuDtos.forEach(m => {
                    if (m.menuName === 'LC Account Opening Request') {
                        m.menuDtos.forEach(n => {
                            if (n.menuDescription === 'LC Account Opening Request- New') {
                                this.menuId = m.menuId;
                            }
                        });
                    }
                });
            }
        });
        this.getCurrentUserDetail();
        this.maxAttachment = this.constant.MAX_ATTACHMENT;
        this.firstName = this.userName.split(' ')[1];
        this.lcOpeningRequestCreateFormData();
        this.aGOfficeCreateFormData();
        this.bankDetailsCreateFormData();
        this.divisionOfficeCreateFormData();
        this.getMajorHeadList();
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            this.status = resRoute.status;
        });
        if (this.mode == 'view') {
            this.lcOpeningRequestCreateForm.disable();
            this.aGOfficeCreateForm.disable();
            this.bankDetailsCreateForm.disable();
            this.divisionOfficeCreateForm.disable();
        }
        if (this.mode == 'edit' || this.mode == 'view') {
            this.getOpeningRequestEdit();
            this.getDivisionDetailsEdit();
        }
        else {
            this.getTreasuryOffice();
            this.getCircleNames();

        }
    }
    /***********************Life cycle hooks methods end***********************************/

    /***********************Public methods start***********************************/



    /**
     * Initialize formgroup
     *
     *
     * @memberOf CreateLcAccountDivisionComponent
     */

    // Initialize Form Fields Validators.required, Validators.minLength(5), Validators.pattern
    lcOpeningRequestCreateFormData() {
        this.lcOpeningRequestCreateForm = this.fb.group({
            officeName: [''],
            divisionOfficeAddress: [''],
            administrativeDepartment: [''],
            headOfDepartment: [''],
            treasuryOffice: [''],
            district: [''],
            cardexNo: [''],
            ddoCode: [''],
            divisionName: [''],
            circleName: [''],
            circleCode: [''],
            otherCircleName: [''],
            remarks: ['']
        });
        this.lcOpeningRequestCreateForm.patchValue({ officeName: this.officeName });
        this.lcOpeningRequestCreateForm.patchValue({ divisionOfficeAddress: this.divisionOfficeAddress });
        this.lcOpeningRequestCreateForm.patchValue({ administrativeDepartment: this.departmentName });
        this.lcOpeningRequestCreateForm.patchValue({ headOfDepartment: this.headOfDepartmentList[0].id });

        this.lcOpeningRequestCreateForm.patchValue({ district: this.districtName });
        this.lcOpeningRequestCreateForm.patchValue({ cardexNo: this.cardexno });
        this.lcOpeningRequestCreateForm.patchValue({ ddoCode: this.ddoNo });
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'AG') {
            this.lcOpeningRequestCreateForm.disable();
            this.openReqResetFlag = false;
        }
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].isTreasury == 2) {
            this.lcOpeningRequestCreateForm.disable();
            this.openReqResetFlag = false;
        }
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'DAT') {
            this.lcOpeningRequestCreateForm.disable();
            this.openReqResetFlag = false;
        }
    }


    /**
     * Initialize formgroup
     *
     *
     * @memberOf CreateLcAccountDivisionComponent
     */
    bankDetailsCreateFormData() {
        this.bankDetailsCreateForm = this.fb.group({
            bankName: [''],
            bankBranch: [''],
            bankCode: [''],
            bankRemarks: ['']
        });
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'AG') {
            this.bankDetailsCreateForm.disable();
            this.bankDetailsResetFlag = false;
        }
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].isTreasury == 2) {
            this.bankDetailsCreateForm.disable();
            this.bankDetailsResetFlag = false;
        }
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'DAT') {
            this.bankDetailsCreateForm.disable();
            this.bankDetailsResetFlag = false;
        }
    }


    /**
     * Initialize formgroup
     *
     *
     * @memberOf CreateLcAccountDivisionComponent
     */
    aGOfficeCreateFormData() {
        this.aGOfficeCreateForm = this.fb.group({
            agAuthorizationNo: [''],
            agAuthorizationDate: [''],
            majorHead: [''],
            subMajorHead: [''],
            minorHead: [''],
            subHead: [''],
            detailedHead: [''],
            agRemarks: ['']
        });

        this.aGOfficeCreateForm.get('agAuthorizationDate').patchValue('');
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].isTreasury == 2) {
            this.aGOfficeCreateForm.disable();
            this.agDetailsResetFlag = false;
        }
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'DAT') {
            this.aGOfficeCreateForm.disable();
            this.agDetailsResetFlag = false;
        }
        if (this.isCoDdoHodTabHideFlag) {
            this.aGOfficeCreateForm.disable();
            this.agDetailsResetFlag = false;
        }
    }


    /**
     * Initialize formgroup
     *
     *
     * @memberOf CreateLcAccountDivisionComponent
     */

    divisionOfficeCreateFormData() {
        this.divisionOfficeCreateForm = this.fb.group({
            divisionCode: [''],
            lcRemarks: ['']
        });
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'AG') {
            this.divisionOfficeCreateForm.disable();
            this.divisionDetailsResetFlag = false;
        }

        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'DAT') {
            this.divisionOfficeCreateForm.disable();
            this.divisionDetailsResetFlag = false;
        }
        if (this.isCoDdoHodTabHideFlag) {
            this.divisionOfficeCreateForm.disable();
            this.divisionDetailsResetFlag = false;
        }
    }

    /*
    * Validation to check whether the record exists or not
    *
    * 
    * @memberOf CreateLcAccountDivisionComponent
    * 
    */

    checkRecordExists() {
        const params = this.openReqSaveAndProcessParams();
        this.locService.getData(params, APIConst.LC_OPENING_REQUEST.GET_HEADER_EXISTS_DETAILS).subscribe((res: any) => {

            if (res.result === 1 && this.mode != 'edit') {
                this.createRecordFlag = false;
                this.toastr.error('Transanction already exists and is in progress!');
            }
        });
    }


    /**
     * View History
     *
     *
     * @memberOf CreateLcAccountDivisionComponent
     */

    historyDialogView(tabname) {
        this.hdrId = this.hdrId;
        this.tabNameHdrId = tabname + ':' + this.hdrId;

        this.directiveObject.historyDialog(this.tabNameHdrId);
    }


    /**
    * Call Opening Request Edit Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */


    getOpeningRequestEdit() {
        const param = {
            isEditable: this.isEditable,
            lcOpenReqHdrId: this.hdrId
        };
        this.locService.getData(param, APIConst.LC_OPENING_REQUEST.GET_EDIT_ACCOUNT_DETAILS).subscribe((res: any) => {
            if (res && res.status === 200) {
                this.openreqEditResult = res.result
                this.bankDetailsProcessEnableFlag = true;
                this.openReqEditReset = true;
                this.lcOpeningRequestCreateForm.patchValue({ officeName: res.result.offName });
                this.lcOpeningRequestCreateForm.patchValue({ divisionOfficeAddress: res.result.divOffAdd });
                this.lcOpeningRequestCreateForm.patchValue({ administrativeDepartment: res.result.dptName });
                this.departmentId = res.result.dptId;
                this.districtId = res.result.disId;
                this.officeNameId = res.result.offId;
                this.treasuryOfficeId = res.result.toOffId;
                this.referenceDt = res.result.refDt;
                this.referenceNo = res.result.refNo;
                this.officeName = res.result.offName;
                this.getTreasuryOffice();
                this.getCircleNames();
                this.headOfDepartmentList = [];
                this.headOfDepartmentList.push({
                    id: this.officeNameId,
                    name: this.officeName
                });
                this.lcOpeningRequestCreateForm.patchValue({ headOfDepartment: this.headOfDepartmentList[0].id });
                this.lcOpeningRequestCreateForm.patchValue({ district: res.result.disName });
                this.lcOpeningRequestCreateForm.patchValue({ cardexNo: res.result.cardexNo });
                this.lcOpeningRequestCreateForm.patchValue({ ddoCode: res.result.ddoNo });
                this.lcOpeningRequestCreateForm.patchValue({ divisionName: res.result.divisionName });
                this.lcOpeningRequestCreateForm.patchValue({ circleCode: res.result.circleCode });
                this.lcOpeningRequestCreateForm.patchValue({ remarks: res.result.remarks });
                this.treasuryOfficeId = res.result.toOffId;
                this.lcOpeningRequestCreateForm.patchValue({ treasuryOffice: res.result.toOffName });
                // if (res.result.circleCode == null || res.result.circleCode == '') {
                //     this.CircleNameList.forEach(circle => {
                //         if (circle.circleName == 'Other') {
                //             this.lcOpeningRequestCreateForm.get('circleName').setValue(circle.circleId);
                //         }
                //         this.lcOpeningRequestCreateForm.patchValue({ otherCircleName: res.result.circleName });

                //     })

                // } else {
                //     this.CircleNameList.forEach(circle => {
                //         if (circle.circleId == res.result.circleId) {
                //             this.lcOpeningRequestCreateForm.get('circleName').setValue(circle.circleId);
                //         }
                //     });
                // }
            }
        });
    }


    /**
    * Call Opening Request Bank Edit Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */

    getBankDetailsEdit() {
        const param = {
            isEditable: this.isEditable,
            lcOpenReqHdrId: this.hdrId
        };
        this.locService.getData(param, APIConst.LC_OPENING_REQUEST.GET_BANK_EDIT_DETAILS).subscribe((res: any) => {
            if (res && res.status === 200 && res.result != null) {
                this.agOfficeProcessEnableFlag = true;
                this.bankDetailsEditReset = true;
                this.bankDetailsCreateForm.patchValue({ bankRemarks: res.result.bankRemarks });
                this.BankName_list.forEach(key => {
                    if (key.bankId == res.result.bankId) {
                        this.bankDetailsCreateForm.get('bankName').setValue(key.bankId);
                        this.getBankBranchList();
                    }
                });
                this.BankBranch_list.forEach(key => {
                    if (key.bankBranchId == res.result.bankBranchId) {
                        this.bankDetailsCreateForm.get('bankBranch').setValue(key.bankBranchId);
                        this.bankDetailsCreateForm.patchValue({ bankCode: res.result.bankIfscCode });
                    }
                });
            }
        });
    }

    /**
    * Call Opening Request AG Office Edit Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */



    getAgOfficeEdit() {
        const param = {
            isEditable: this.isEditable,
            lcOpenReqHdrId: this.hdrId
        };
        this.locService.getData(param, APIConst.LC_OPENING_REQUEST.GET_AG_EDIT_ACCOUNT_DETAILS).subscribe((res: any) => {
            if (res && res.status === 200 && res.result != null && res.result.hdrId != null && res.result.dtlId != null) {
                this.divisionDetailsProcessEnableFlag = true;
                if (res.result.authorizationNo != null)
                    this.agOfficeEditReset = true;
                this.agDetailTabDropDownValues = res.result;
                this.aGOfficeCreateForm.patchValue({ agAuthorizationNo: res.result.authorizationNo });
                this.aGOfficeCreateForm.patchValue({ agRemarks: res.result.agRemarks });
                console.log(this.aGOfficeCreateForm.value.agAuthorizationDate)
                res.result.authorizationDt ? this.aGOfficeCreateForm.patchValue({ agAuthorizationDate: new Date(res.result.authorizationDt) })
                    : this.aGOfficeCreateForm.get('agAuthorizationDate').patchValue('');
                // this.aGOfficeCreateForm.patchValue({agAuthorizationDate: new Date(res.result.authorizationDt)});
                console.log(this.aGOfficeCreateForm.value.agAuthorizationDate)
                this.majorHead_list.forEach(key => {
                    if (key.id == res.result.majorHeadId) {
                        this.aGOfficeCreateForm.get('majorHead').setValue(key.id);
                        this.getSubMajorHeadList();
                    }
                });
            }
        });
    }

    /**
    * Call Opening Request Division Edit Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */



    getDivisionDetailsEdit() {
        const param = {
            isEditable: this.isEditable,
            lcOpenReqHdrId: this.hdrId
        };
        this.locService.getData(param, APIConst.LC_OPENING_REQUEST.GET_DIVISION_EDIT_DETAILS).subscribe((res: any) => {
            if (res && res.status === 200 && res.result != null) {
                this.divisionOfficeEditReset = true;
                this.divisionOfficeCreateForm.patchValue({ divisionCode: res.result.divisionCode });
                this.divisionOfficeCreateForm.patchValue({ lcRemarks: res.result.divisionRemarks });
            }
        });
    }


    /**
    * Fetch Opening Request Treasury office Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */

    getTreasuryOffice() {
        const param = {
            departmentId: this.departmentId,
            districtId: this.districtId
        };
        this.locService.getData(param, APIConst.LC_OPENING_REQUEST.GET_TREASURY_OFFICE_DETAILS).subscribe(
            (res: any) => {
                if (res && res.result && res.status === 200) {
                    this.treasuryOfficeId = res.result.officeId;
                    this.lcOpeningRequestCreateForm.patchValue({ treasuryOffice: res.result.officeName });
                    this.getBankDetails();
                    if (this.mode != 'edit' && this.mode != 'view') this.checkRecordExists();
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
    * Fetch CircleName Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */


    getCircleNames() {
        const params = {
            id: this.departmentId
        };
        this.locService.getData(params, APIConst.LC_OPENING_REQUEST.GET_CIRCLE_DETAILS).subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                this.CircleNameList = res.result;

                if (this.mode == 'edit' || this.mode == 'view') {

                    if (this.openreqEditResult.circleCode == null || this.openreqEditResult.circleCode == '') {
                        this.circleNameFalg = true;
                        this.CircleNameList.forEach(circle => {
                            if (circle.circleName == 'Other') {
                                this.lcOpeningRequestCreateForm.get('circleName').setValue(circle.circleId);
                            }
                            this.lcOpeningRequestCreateForm.patchValue({ otherCircleName: this.openreqEditResult.circleName });

                        })

                    } else {
                        this.CircleNameList.forEach(circle => {
                            if (circle.circleId == this.openreqEditResult.circleId) {
                                this.lcOpeningRequestCreateForm.get('circleName').setValue(circle.circleId);
                            }
                        });
                    }

                }
            }
        });
    }


    /**
     * Fetch Bank Details based on treasuryOfficeId
     *
     *
     * @memberOf CreateLcAccountDivisionComponent
     */


    getBankDetails() {
        const param = {
            id: this.treasuryOfficeId
        };
        this.locService.getData(param, APIConst.LC_OPENING_REQUEST.GET_BANK_DETAILS).subscribe((res: any) => {
            this.BankName_list = _.orderBy(_.cloneDeep(res.result.bankBranchList), 'bankName', 'asc');

            this.getBankBranchList();
            if (this.BankName_list.length == 1) {
                this.bankDetailsCreateForm.get('bankName').setValue(this.BankName_list[0]['bankId']);
            }
            if (this.mode == 'edit' || this.mode == 'view') {
                this.getBankDetailsEdit();
            }
        });
    }
    getBankBranchList() {
        if (this.BankName_list.length == 1) {
            this.BankBranch_list = this.BankName_list[0]['bankBranchList'];
            this.BankBranch_list = _.orderBy(_.cloneDeep(this.BankBranch_list), 'bankBranchName', 'asc');

        } else {
            this.BankName_list.forEach(key => {
                if (key.bankId == this.bankDetailsCreateForm.value.bankName) {
                    this.BankBranch_list = key.bankBranchList;
                    this.BankBranch_list = _.orderBy(_.cloneDeep(this.BankBranch_list), 'bankBranchName', 'asc');
                    if (this.BankBranch_list.length == 1)
                        this.bankDetailsCreateForm.get('bankBranch').setValue(this.BankBranch_list['bankBranchId']);
                }
            });
        }
    }




    /**
     * Method to be exectuted on circle dropdown change
     *
     *
     * @memberOf CreateLcAccountDivisionComponent
     */


    onCircle(event) {
        if (this.lcOpeningRequestCreateForm.controls.circleName.value == 1490 ||
            this.lcOpeningRequestCreateForm.value.circleName.circleName == 'Other') {
            this.circleNameFalg = true;
            this.lcOpeningRequestCreateForm.get('otherCircleName').setValidators(Validators.required)
            this.lcOpeningRequestCreateForm.get('otherCircleName').updateValueAndValidity();


        }
        else {
            // this.lcOpeningRequestCreateForm.controls.otherCircleName.errors(Validators.required: false)
            this.lcOpeningRequestCreateForm.get('otherCircleName').clearValidators()
            this.lcOpeningRequestCreateForm.get('otherCircleName').updateValueAndValidity();

            this.circleNameFalg = false;
            Object.keys(this.CircleNameList).forEach(key => {
                if (this.CircleNameList[key].circleId === event.value) {
                    this.lcOpeningRequestCreateForm.patchValue({
                        circleCode: this.CircleNameList[key].circleCode
                    });
                }
            });
        }
    }


    /**
     * Method to be exectuted on bank-branch dropdown change
     *
     *
     * @memberOf CreateLcAccountDivisionComponent
     */


    onBankBranch(event) {
        this.BankBranch_list.forEach(key => {
            if (key.bankBranchId == this.bankDetailsCreateForm.value.bankBranch) {
                this.bankDetailsCreateForm.patchValue({
                    bankCode: key.bankBranchCode
                });
            }
        });
    }

    /**
     * @description Method to get CurrentUser Deatils.
     * @returns an object
     */

    getCurrentUserDetail() {
        this.commonWorkflowService.getCurrentUserDetail().then((res: any) => {
            if (res) {
                this.wfRoleIds = res.wfRoleId;
                this.wfRoleCode = res.wfRoleCode;
                this.menuId = res.menuId
                this.linkMenuId = res.linkMenuId ? res.linkMenuId : this.menuId;
                this.postId = res.postId;
                this.userId = res.userId;
                this.lkPoOffUserId = res.lkPoOffUserId;
                this.officeId = res.officeDetail.officeId;

                this.getAttachmentList();
            }
        });
    }


    /**
    * Request Params - Save Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */


    openReqSaveAndProcessParams() {
        if (this.hdrId == undefined || this.hdrId == NaN) {
            this.hdrId = null;
        }
        if (
            this.lcOpeningRequestCreateForm.value.circleName.circleName == 'Other' ||
            this.lcOpeningRequestCreateForm.value.circleName == 1490
        ) {
            this.circleCode = null;
        } else {
            this.circleCode = this.lcOpeningRequestCreateForm.value.circleCode;
        }
        const params = {
            activeStatus: 1,
            cardexNo: this.lcOpeningRequestCreateForm.value.cardexNo,
            ddoNo: this.lcOpeningRequestCreateForm.value.ddoCode,
            departmentId: this.departmentId,
            districtId: this.districtId,
            divisionOfficeAddress: this.lcOpeningRequestCreateForm.value.divisionOfficeAddress,
            hodId: this.lcOpeningRequestCreateForm.value.headOfDepartment,
            lcOpenReqHdrId: this.hdrId,
            locAccountOpenReqSdDto: {
                activeStatus: 1,
                circleCode: this.lcOpeningRequestCreateForm.value.circleCode,
                circleId: this.lcOpeningRequestCreateForm.value.circleName,
                divisionName: this.lcOpeningRequestCreateForm.value.divisionName,
                remarks: this.lcOpeningRequestCreateForm.value.remarks,
                statusId: 1,
                wfId: 1,
                wfRoleId: 1000
            },
            officeNameId: this.officeNameId,
            toOfficeId: this.treasuryOfficeId,
            pendingWithUserId: 1,
            //referenceDt: "",
            referenceNo: '',
            requestingOfficeId: 1,
            statusId: 0,
            wfId: 1,
            wfRoleId: 1,
            wfUserReqSDDto: {
                branchId: null,
                menuId: this.linkMenuId,
                officeId: this.officeId,
                postId: this.postId,
                pouId: this.lkPoOffUserId,
                userId: this.userId,
                wfRoleIds: this.wfRoleIds

            }
        };
        return params;
    }



    /**
    * Request Params - Save Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */


    OpeningRequestSaveAndProcess() {
        if (this.hdrId == undefined || this.hdrId == NaN) {
            this.hdrId = null;
        }
        if (
            this.lcOpeningRequestCreateForm.value.circleName.circleName == 'Other' ||
            this.lcOpeningRequestCreateForm.value.circleName == 1490
        ) {
            this.circleCode = null;
            this.circleId = this.lcOpeningRequestCreateForm.value.circleName
            this.circleName = this.lcOpeningRequestCreateForm.value.otherCircleName;
        } else {
            this.circleCode = this.lcOpeningRequestCreateForm.value.circleCode;
            (this.circleId = this.lcOpeningRequestCreateForm.value.circleName),
                (this.circleName = null);
        }

        const params = {
            activeStatus: 1,
            cardexNo: this.lcOpeningRequestCreateForm.value.cardexNo,
            ddoNo: this.lcOpeningRequestCreateForm.value.ddoCode,
            departmentId: this.departmentId,
            districtId: this.districtId,
            divisionOfficeAddress: this.lcOpeningRequestCreateForm.value.divisionOfficeAddress,
            hodId: this.lcOpeningRequestCreateForm.value.headOfDepartment,
            lcOpenReqHdrId: this.hdrId,
            locAccountOpenReqSdDto: {
                activeStatus: 1,
                circleCode: this.circleCode, //this.lcOpeningRequestCreateForm.value.circleCode,
                circleId: this.circleId, //this.lcOpeningRequestCreateForm.value.circleName,
                circleName: this.circleName,
                divisionName: this.lcOpeningRequestCreateForm.value.divisionName,
                remarks: this.lcOpeningRequestCreateForm.value.remarks,
                statusId: 1,
                wfId: 1,
                wfRoleId: 1000
            },
            officeNameId: this.officeNameId,
            toOfficeId: this.treasuryOfficeId,
            pendingWithUserId: 1,
            referenceNo: this.referenceNo ? this.referenceNo : '',
            referenceDt: this.referenceDt ? this.referenceDt : '',
            requestingOfficeId: 1,
            statusId: 0,
            wfId: 1,
            wfRoleId: 1,
            wfUserReqSDDto: {
                branchId: null,
                menuId: 367,
                officeId: this.officeId,
                postId: this.postId,
                pouId: this.lkPoOffUserId,
                userId: this.userId,
                wfRoleIds: this.wfRoleIds

            }
        };
        this.locService.getData(params, APIConst.LC_OPENING_REQUEST.OPEN_REQUEST_SAVE_AND_PROCESS).subscribe((res: any) => {
            if (res.status === 200) {
                if (
                    res.result.errorMessage == '' ||
                    res.result.errorMessage == null ||
                    res.result.errorMessage == undefined ||
                    res.result.errorMessage == NaN
                ) {
                    this.bankDetailsProcessEnableFlag = true;
                    this.openReqEditReset = true;
                    this.hdrId = res.result.locAccountOpenReqSdDto.lcOpenReqHdrId;
                    this.disableTabs = false;
                    this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);

                    this.tabChangeOnSave(1);
                } else {
                    this.toastr.error(res.result.errorMessage);
                }
            }
            else {
                this.toastr.error(res.message);
            }
        });
    }


    /**
    * Request Params - Banl Details Save Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */

    bankDetailsSaveAndProcess() {
        const params = {
            bankBranchId: this.bankDetailsCreateForm.value.bankBranch,
            bankCode: this.bankDetailsCreateForm.value.bankCode,
            bankId: this.bankDetailsCreateForm.value.bankName,
            bankRemarks: this.bankDetailsCreateForm.value.bankRemarks,
            lcOpenReqHdrId: this.hdrId,
            statusId: 204,
            wfId: 1,
            wfRoleId: 1000
        };

        this.locService.getData(params, APIConst.LC_OPENING_REQUEST.SAVE_BANK_DETAILS).subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                this.agOfficeProcessEnableFlag = true;
                this.bankDetailsEditReset = true;
                this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);
                this.tabChangeOnSave(2);


            } else {
                this.toastr.error(res.message);
            }
        });
    }


    /**
    * Request Params - AG Office Save Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */


    agSave() {
        const params = {
            agAuthorizationDt: this.aGOfficeCreateForm.value.agAuthorizationDate,
            agAuthorizationNo: this.aGOfficeCreateForm.value.agAuthorizationNo,
            agRemarks: this.aGOfficeCreateForm.value.agRemarks,
            detailHeadId: this.aGOfficeCreateForm.value.detailedHead,
            lcOpenReqHdrId: this.hdrId,
            majorHeadId: this.aGOfficeCreateForm.value.majorHead,
            minorHeadId: this.aGOfficeCreateForm.value.minorHead,
            statusId: 1,
            subHeadId: this.aGOfficeCreateForm.value.subHead,
            subMajorHeadId: this.aGOfficeCreateForm.value.subMajorHead,
            wfId: 1,
            wfRoleId: 1
        };

        this.locService.getData(params, APIConst.LC_OPENING_REQUEST.AG_OFFICE_SAVE_AND_PROCESS).subscribe((res: any) => {
            if (res.status === 200) {
                this.divisionDetailsProcessEnableFlag = true;
                this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);
                if (res && res.status === 200 && res.result != null && res.result.authorizationNo != null)
                    this.agOfficeEditReset = true;

                this.tabChangeOnSave(3);

            }
        });
    }


    /**
    * AG office Save Api
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */


    agOfficeSaveAndProcess() {
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'AG') {
            if (this.aGOfficeCreateForm.valid) {
                this.agSave();
            } else {
                this.toastr.error(MESSAGES.MANDATORY_FIELD_MSG);
                this.markTouchControls();
            }
        } else {
            this.agSave();
        }
    }

    getTabIndex($event) {
        this.selectedTabIndex = $event;
    }


    /**
    * find Array Index
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */

    findArrayIndex(itemArray, keyName, selectedValue) {
        const selectedIndex = itemArray.findIndex(x => x[keyName] === selectedValue);
        return itemArray[selectedIndex];
    }


    /**
    * Tab Change
    *
    *
    * @memberOf CreateLcAccountDivisionComponent
    */


    tabChangeOnSave(index: number): void {
        this.selectedTabIndex = index;
    }

    /**
     * @description Method to get attachment types.
     * @returns array object
     */
    getAttachmentList() {
        const param = {
            categoryName: 'TRANSACTION',
            menuId: this.linkMenuId
        };
        this.commonWorkflowService.getAttachmentList(param).subscribe(
            (res: any) => {
                if (res && res.status === 200 && res.result && res.result.length > 0) {
                    this.attachmentTypeList = res.result.filter(data => {
                        data.id = data['attTypeId'].id;
                        data.name = data['attTypeId'].name;
                        data.isMandatory = data['attTypeId'].isMandatory;
                        data.category = data['attTypeId'].category;
                        return data;
                    });

                    this.getUploadedAttachmentData();
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @description Method to get user uploaded attachments.
     * @returns array object
     */
    getUploadedAttachmentData() {
        try {
            this.dataSourceBrowse = new MatTableDataSource([]);
            const param = {
                categoryName: 'TRANSACTION',
                menuId: this.linkMenuId,
                trnId: this.hdrId,
                lkPOUId: this.lkPoOffUserId
            };
            this.commonWorkflowService.getUploadedAttachmentList(param).subscribe(
                (res: any) => {
                    if (res && res.status === 200 && res.result) {
                        const resultObject = _.cloneDeep(res.result);
                        if (resultObject.length === 0) {
                            if (this.mode !== 'view') {
                                this.addNewFileRow();
                            }
                        } else {
                            let extension;
                            resultObject.filter(data => {
                                extension = data.uploadedFileName ? data.uploadedFileName.split('.').pop() : '';
                                if (this.constant.viewableExtension.indexOf(extension) !== -1) {
                                    data.isView = true;
                                }
                                return data;
                            });
                            this.dataSourceBrowse.data = _.cloneDeep(resultObject);
                        }
                    }
                },
                err => {
                    this.toastr.error(err);
                }
            );
        } catch (error) {
            this.toastr.error(error);
        }
    }

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
                    userName: this.userName
                });

                this.dataSourceBrowse.data = p_data;
            } else {
                this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILL_ALL_DATA);
            }
        } else {
            const getCurrentFileTypeInfo = this.getSelectedFileTypeData();
            const tableData = [
                {
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
                    userName: this.userName
                }
            ];
            this.dataSourceBrowse = new MatTableDataSource(tableData);
        }
    }

    /**
     * @description Get seleted attachment type
     */
    getSelectedFileTypeData(id?) {
        if (id) {
            return this.attachmentTypeList.find(ele => ele.id === id);
        } else {
            return this.attachmentTypeList[0] ? this.attachmentTypeList[0] : {};
        }
    }


    divisionKeyPress(event: any) {
        const pattern = /^[A-Z0-9]*$/;

        const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);

        let tempstr = event.target.value;
        tempstr += inputChar;
        if (!pattern.test(tempstr)) {
            event.preventDefault();
            return false;
        }
    }


    decimalKeyPress(event: any) {
        // const pattern = /^\d+(\.\d{​​​​​​​​0,4}​​​​​​​​)?$/;
        const pattern = /^\d+(\d)?$/;

        const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        // If the key is backspace, tab, left, right or delete
        // console.log('event.target.value', event.target.value);
        // console.log('tst', pattern.test(event.target.value));
        let tempstr = event.target.value;
        tempstr += inputChar;
        if (!pattern.test(tempstr)) {
            // invalid character, prevent input
            event.preventDefault();
            return false;
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
            this.toastr.error(MESSAGES.ATTACHMENT.PLEASE_ATTACH);
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
        if (filesArray.length === 0 && this.dataSourceBrowse.data.length !== 5) {
            this.toastr.error(MESSAGES.ATTACHMENT.ATLEAST_ONE_UPLOAD);
            valid = false;
        } else if (filesArray.length === 0 && this.dataSourceBrowse.data.length === 5) {
            this.toastr.error(MESSAGES.ATTACHMENT.ALREADY_UPLOADED);
            valid = false;
        } else {
            filesArray.forEach(element => {
                if (
                    !(
                        element.file &&
                        element.file !== '' &&
                        element.fileName &&
                        element.fileName !== '' &&
                        element.attachmentTypeId
                    )
                ) {
                    valid = false;
                }
            });
            if (!valid) {
                this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILL_DATA);
            }
        }

        if (valid) {
            filesArray.forEach((element, index) => {
                const categoryInfo = this.attachmentTypeList.filter(ele => ele.id === element.attachmentTypeId)[0];
                formData.append('attachmentCommonDtoList[' + index + '].eventId', '');
                formData.append('attachmentCommonDtoList[' + index + '].uploadedFileSize', element.uploadedFileSize);
                formData.append('attachmentCommonDtoList[' + index + '].userName', this.userName);
                formData.append('attachmentCommonDtoList[' + index + '].attachmentTypeId', element.attachmentTypeId);
                formData.append('attachmentCommonDtoList[' + index + '].categoryId', categoryInfo.category);
                formData.append('attachmentCommonDtoList[' + index + '].fileName', element.fileName);
                formData.append('attachmentCommonDtoList[' + index + '].fileSize', element.fileSize);
                formData.append('attachmentCommonDtoList[' + index + '].format', element.fileExtension);
                formData.append('attachmentCommonDtoList[' + index + '].lkPOUId', this.lkPoOffUserId);
                formData.append('attachmentCommonDtoList[' + index + '].menuId', this.linkMenuId);
                formData.append('attachmentCommonDtoList[' + index + '].trnId', this.hdrId);
                formData.append('attachmentCommonDtoList[' + index + '].userId', this.userId);
                formData.append(
                    'attachmentCommonDtoList[' + index + '].uploadDirectoryPath',
                    element.uploadDirectoryPath
                );
                formData.append('attachmentCommonDtoList[' + index + '].attachment', element.file, element.file.name);
                formData.append('attachmentCommonDtoList[' + index + '].uploadedFileName', element.uploadedFileName);
            });
            this.commonWorkflowService.attachmentUpload(formData).subscribe(
                (res: any) => {
                    if (res && res.status === 200) {
                        this.toastr.success(MESSAGES.ATTACHMENT.UPLOAD_SUCCESS);
                        this.getUploadedAttachmentData();
                    } else {
                        this.toastr.error(res.message);
                    }
                },
                err => {
                    this.toastr.error(err);
                }
            );
        }
    }

    /**
     * @description View Attachment
     * @param attachment  attachment
     */
    viewUploadedAttachment(attachment: any, event, isPreview = false) {
        try {
            const param = {
                documentDataKey: attachment.documentId,
                fileName: attachment.uploadedFileName
            };
            this.commonWorkflowService.viewAttachment(param).subscribe(
                (res: any) => {
                    if (res) {
                        const resultObj = res.result;
                        const imgNameArray = attachment.uploadedFileName.split('.');
                        const imgType = imgNameArray[imgNameArray.length - 1].trim();
                        let docType;
                        let isPdf = false;

                        switch (imgType) {
                            case 'pdf':
                                docType = 'application/pdf';
                                isPdf = true;
                                break;
                            case 'png':
                                docType = 'image/png';
                                break;

                            case 'jpg':
                                docType = 'image/jpg';
                                break;

                            case 'jpeg':
                            default:
                                docType = 'image/jpeg';
                                break;
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
                            event.stopPropagation();
                        } else {
                            const byteArray = new Uint8Array(
                                atob(resultObj['fileSrc'])
                                    .split('')
                                    .map(char => char.charCodeAt(0))
                            );
                            const blob = new Blob([byteArray], { type: docType });
                            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                                window.navigator.msSaveOrOpenBlob(blob, res['result']['fileName']);
                            } else {
                                const url = window.URL.createObjectURL(blob);
                                window.open(url, '_blank');
                            }
                        }
                    }
                },
                err => {
                    this.toastr.error(err);
                }
            );
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description Download Attachment
     * @param params attachment details
     */
    downLoadUploadedAttachment(params) {
        try {
            const ID = {
                documentDataKey: params.documentId,
                fileName: params.uploadedFileName
            };
            this.commonWorkflowService.downloadAttachment(ID).subscribe(
                res => {
                    const url = window.URL.createObjectURL(res);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', '' + params.uploadedFileName);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                },
                err => {
                    this.toastr.error(err);
                }
            );
        } catch (error) {
            this.toastr.error(error);
        }
    }

    /**
     * @description Open file selector
     */
    openFileSelector(index: number) {
        this.el.nativeElement.querySelector('#fileBrowse').click();
        this.fileBrowseIndex = index;
    }

    /**
     * @description Validate File on file selection
     * @param fileSelected selected file
     */
    onFileSelection(fileSelected: any) {
        let valid = true;
        const fileExtension = fileSelected.target.files[0].name
            .split('.')
            .pop()
            .toLowerCase();
        const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
        const fileSupportedExtension = this.dataSourceBrowse.data[this.fileBrowseIndex].format;
        const extensionArray = fileSupportedExtension.split(',');
        if (fileSelected.target.files[0].size > EdpDataConst.MAX_FILE_SIZE_FOR_COMMON * 1024) {
            valid = false;
            // const sizeInMB = BudgetConst.MAX_FILE_SIZE_FOR_COMMON / 1024;
            this.toastr.error(MESSAGES.ATTACHMENT.ERROR_FILE_SIZE);
        } else if (extensionArray.indexOf(fileExtension) < 0) {
            valid = false;
            this.toastr.error(MESSAGES.ATTACHMENT.ERROR_EXTENSION + extensionArray);
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
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: MESSAGES.ATTACHMENT.DELETE_FILE
        });
        dialogRef.afterClosed().subscribe(confirmationResult => {
            if (confirmationResult === 'yes') {
                if (item && item.uploadedFileName && item.uploadedDate && item.attachmentId) {
                    const param = {
                        attachmentId: item.attachmentId,
                        menuId: this.linkMenuId
                    };
                    this.commonWorkflowService.attachmentDelete(param).subscribe(
                        (res: any) => {
                            if (res && res.status === 200 && res.result === true) {
                                this.toastr.success(res.message);
                                this.dataSourceBrowse.data.splice(index, 1);
                                this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
                                if (this.dataSourceBrowse.data.length === 0) {
                                    this.getUploadedAttachmentData();
                                }
                            }
                        },
                        err => {
                            this.toastr.error(err);
                        }
                    );
                } else {
                    this.dataSourceBrowse.data.splice(index, 1);
                    this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
                }
            }
        });
    }

    /**
  * @description Method  is know the result status for all apis
  * @params result fetched from th backend 
   
  */

    checkSucessApiResponse(res: any) {
        if (res && res.status === 200 && res.result.length > 0) {
            return 1;
        } else if (res && res.status === 200 && (res.result == null || res.result.length == 0)) {
            res['message'] = 'No Record Found';
            return 2;
        } else if (res && res.status !== 200) {
            return 3;
        }
    }

    /**
  * @description Method  is to reset list of SubMajorheads  on Majorhead Change
   
  */
    resetSubMajorHead() {
        this.subMajorHead_list = [];
        this.aGOfficeCreateForm.get('subMajorHead').setValue('');
        this.aGOfficeCreateForm.get('subMajorHead').updateValueAndValidity();
    }

    /**
 * @description Method  is to reset list of Minor  Head  on SubMajorhead Change
  
 */
    resetMinorHead() {
        this.minorHead_list = [];
        this.aGOfficeCreateForm.get('minorHead').setValue('');
        this.aGOfficeCreateForm.get('minorHead').updateValueAndValidity();
    }
    /**
 * @description Method  is to reset list of Subhead  on MinorHead Change
  
 */
    resetSubHead() {
        this.subHead_list = [];
        this.aGOfficeCreateForm.get('subHead').setValue('');
        this.aGOfficeCreateForm.get('subHead').updateValueAndValidity();
    }
    /**
 * @description Method  is to reset list of Detailed head  on Sub Head Change
  
 */
    resetDetailHead() {
        this.detailedHead_list = [];
        this.aGOfficeCreateForm.get('detailedHead').setValue('');
        this.aGOfficeCreateForm.get('detailedHead').updateValueAndValidity();
    }


    /**
  * @description Method  is to fetch list of majorheads  for details for AG tab
   
  */
    getMajorHeadList() {
        this.locService.getMajorheadList().subscribe(
            (res: any) => {
                const resValue = this.checkSucessApiResponse(res);
                if (resValue === 1) {
                    this.majorHead_list = _.orderBy(_.cloneDeep(res.result), 'code', 'asc');

                    if (res.result.length === 1) {
                        this.aGOfficeCreateForm.get('majorHead').setValue(res['result'][0].id);
                        this.getSubMajorHeadList();
                    }
                    if (this.mode == 'edit' || this.mode == 'view') {
                        this.getAgOfficeEdit();
                    }
                }
            },
            err => {
                this.toastr.error(err['message']);
            }
        );
    }
    /**
     * @description Method  is to fetch list of sub majorheads for details for AG tab
     */

    getSubMajorHeadList() {
        this.resetSubMajorHead();
        this.resetMinorHead();
        this.resetSubHead();
        this.resetDetailHead();
        var params = {
            majorHeadId: this.aGOfficeCreateForm.value.majorHead
        };

        this.locService.getData(params, APIConst.LC_OPENING_REQUEST.GET_SUB_MAJOR_HEAD_LIST).subscribe(
            (res: any) => {
                const resValue = this.checkSucessApiResponse(res);
                if (resValue === 1) {
                    this.subMajorHead_list = _.orderBy(_.cloneDeep(res.result), 'code', 'asc');

                    if (res['result'].length === 1) {
                        this.aGOfficeCreateForm.get('subMajorHead').setValue(res['result'][0].id);
                        this.getMinorHeadList();
                    } else if (this.mode == 'edit' || this.mode == 'view') {
                        this.subMajorHead_list.forEach(key => {
                            if (key.id == this.agDetailTabDropDownValues.subMajorHeadId) {
                                this.aGOfficeCreateForm.get('subMajorHead').setValue(key.id);
                                this.getMinorHeadList();
                            }
                        });
                    }
                }
            },
            err => {
                this.toastr.error(err['message']);
            }
        );
    }
    /**
     * @description Method  is to fetch list of minorheads  for details for AG tab
     */

    getMinorHeadList() {
        this.resetMinorHead();
        this.resetSubHead();
        this.resetDetailHead();
        const params = {
            majorHeadId: this.aGOfficeCreateForm.value.majorHead,
            subMajorHeadId: this.aGOfficeCreateForm.value.subMajorHead
        };
        this.locService.getData(params, APIConst.LC_OPENING_REQUEST.GET_MINOR_HEAD_LIST).subscribe(
            (res: any) => {
                const resValue = this.checkSucessApiResponse(res);
                if (resValue === 1) {
                    this.minorHead_list = _.orderBy(_.cloneDeep(res.result), 'code', 'asc');

                    if (res.result.length === 1) {
                        this.aGOfficeCreateForm.get('minorHead').setValue(res['result'][0].id);
                        this.getSubHeadList();
                    } else if (this.mode == 'edit' || this.mode == 'view') {
                        this.minorHead_list.forEach(key => {
                            if (key.id == this.agDetailTabDropDownValues.minorHeadId) {
                                this.aGOfficeCreateForm.get('minorHead').setValue(key.id);
                                this.getSubHeadList();
                            }
                        });
                    }
                }
            },
            err => {
                this.toastr.error(err['message']);
            }
        );
    }
    /**
     * @description Method  is to fetch list of sub heads  for details for AG tab
     */

    getSubHeadList() {
        this.resetSubHead();
        this.resetDetailHead();
        const params = {
            majorHeadId: this.aGOfficeCreateForm.value.majorHead,
            subMajorHeadId: this.aGOfficeCreateForm.value.subMajorHead,
            minorHeadId: this.aGOfficeCreateForm.value.minorHead
        };
        this.locService.getData(params, APIConst.LC_OPENING_REQUEST.GET_SUB_HEAD_LIST).subscribe(
            (res: any) => {
                const resValue = this.checkSucessApiResponse(res);
                if (resValue === 1) {
                    this.subHead_list = _.orderBy(_.cloneDeep(res.result), 'code', 'asc');

                    if (res.result.length === 1) {
                        this.aGOfficeCreateForm.get('subHead').setValue(res['result'][0].id);
                        this.getDetailHeadList();
                    } else if (this.mode == 'edit' || this.mode == 'view') {
                        this.subHead_list.forEach(key => {
                            if (key.id == this.agDetailTabDropDownValues.subHeadId) {
                                this.aGOfficeCreateForm.get('subHead').setValue(key.id);
                                this.getDetailHeadList();
                            }
                        });
                    }
                }
            },
            err => {
                this.toastr.error(err['message']);
            }
        );
    }

    /**
     * @description Method  is to fetch list of detail heads  for details for AG tab
     */
    getDetailHeadList() {
        this.resetDetailHead();
        const dto = {
            majorHeadId: this.aGOfficeCreateForm.value.majorHead,
            subMajorHeadId: this.aGOfficeCreateForm.value.subMajorHead,
            minorHeadId: this.aGOfficeCreateForm.value.minorHead,
            subHeadId: this.aGOfficeCreateForm.value.subHead
        };
        this.locService.getData(dto, APIConst.LC_OPENING_REQUEST.GET_DETAIL_HEAD_LIST).subscribe(
            (res: any) => {
                const resValue = this.checkSucessApiResponse(res);
                if (resValue === 1) {
                    this.detailedHead_list = _.orderBy(_.cloneDeep(res.result), 'code', 'asc');

                    if (res.result.length === 1) {
                        this.aGOfficeCreateForm.get('detailedHead').setValue(res['result'][0].id);
                    } else if (this.mode == 'edit' || this.mode == 'view') {
                        this.detailedHead_list.forEach(key => {
                            if (key.id == this.agDetailTabDropDownValues.detailHeadId) {
                                this.aGOfficeCreateForm.get('detailedHead').setValue(key.id);
                            }
                        });
                    }
                }
            },
            err => {
                this.toastr.error(err['message']);
            }
        );
    }



    /**
      * Call on click of Reset Button
      *
      *
      * @memberOf LcChequebookActivateInactivateComponent
      */

    lcAccountOpeningRequestReset() {
        if (this.openReqEditReset) {
            this.getOpeningRequestEdit();
        } else {
            this.lcOpeningRequestCreateForm.reset();
            this.getTreasuryOffice();
            this.lcOpeningRequestCreateFormData();
        }
    }


    /**
      * Call on click of Bank Reset Button
      *
      *
      * @memberOf LcChequebookActivateInactivateComponent
      */

    bankDetailsReset() {
        if (this.bankDetailsEditReset) {
            this.getBankDetailsEdit();
        } else {
            this.bankDetailsCreateForm.reset();
            this.bankDetailsCreateFormData();
        }
    }


    /**
      * Call on click of AG office Reset Button
      *
      *
      * @memberOf LcChequebookActivateInactivateComponent
      */

    agOfficeReset() {
        if (this.agOfficeEditReset) {
            this.getAgOfficeEdit();
        } else {
            this.aGOfficeCreateForm.reset();
            this.subMajorHead_list = [];
            this.minorHead_list = [];
            this.subHead_list = [];
            this.detailedHead_list = [];
            this.aGOfficeCreateFormData();
        }
    }


    /**
      * Call on click of Division Office Reset Button
      *
      *
      * @memberOf LcChequebookActivateInactivateComponent
      */

    divisionOfficeReset() {
        if (this.divisionOfficeEditReset) {
            this.getDivisionDetailsEdit();
        } else {
            this.divisionOfficeCreateForm.reset();
            this.divisionOfficeCreateFormData();
        }
    }

    /**
        * Call save api with submit request
        *
        * @memberof CreateLcAccountDivisionComponent
        */

    submitClick() {
        if (this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'AG') {
            if (this.aGOfficeCreateForm.valid) {
                this.agOfficeSaveAndProcess();
                this.saveDivisionDetails(true);
            } else {
                this.toastr.error('Please Fill AG office Details');
            }
        } else if (
            this.isCoDdoHodTabHideFlag == true ||
            this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'DAT' ||
            this.postList1['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'AG'
        ) {
            this.saveDivisionDetails(true);
        } else {
            if (this.divisionOfficeCreateForm.valid) {
                this.saveDivisionDetails(true);
            } else {
                this.toastr.error(MESSAGES.MANDATORY_FIELD_MSG);
                this.markTouchControls();
            }
        }
    }

    markTouchControls() {
        _.each(this.divisionOfficeCreateForm.controls, function (ctrl: FormControl) {
            if (ctrl.status === 'INVALID') {
                ctrl.markAsTouched();
            }
        });
    }

    /**
         * Call save api with submit request
         *
         * @memberof CreateLcAccountDivisionComponent
         */
    saveDivisionDetails(fromSubmit: boolean = false) {
        const dto = {
            menuId: this.linkMenuId,
            userId: this.userId,
            postId: this.postId,
            pouId: this.lkPoOffUserId,
            officeId: this.officeId,
            wfRoleId: 46,
            statusId: 267,
            wfId: 2,
            lcOpenReqHdrId: this.hdrId,
            divisionCd: this.divisionOfficeCreateForm.value.divisionCode,
            divisionRemarks: this.divisionOfficeCreateForm.value.lcRemarks,
        };
        this.locService.saveDivisionData(dto).subscribe(
            (res: any) => {
                if (res.message == 'Record Already Exists.') {
                    this.toastr.error('Division Code Already Exists, Please enter new Division Code');
                } else {
                    if (res && res.result && res.status === 200) {
                        this.divisionOfficeEditReset = true;
                        if (!fromSubmit) {
                            this.toastr.success(MESSAGES.DATA_SAVED_MESSAGE);
                        }
                        const resData = res.result;
                        this.lcOpenReqDivSdId = resData.lcOpenReqDiviSdId;

                        if (fromSubmit) {
                            this.validateTransaction();
                        }
                    } else {
                        this.toastr.error(res.message);
                    }
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @description validation for submit
     */
    validateTransaction() {
        const param = {
            lcOpenReqHdrId: this.hdrId
        };
        this.locService.validateAGDetails(param).subscribe(
            (res: any) => {
                if (res && res.status === 200) {
                    this.openWfPopup();
                } else {
                    this.toastr.error(res.message);
                    this.toastr.error(MESSAGES.MANDATORY_FIELD_MSG);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @description open work-flow popup
     */
    openWfPopup() {
        const passData = {
            id: this.hdrId
        };

        this.locService.getSubmitActionDetails(passData).subscribe((res: any) => {
            const headerDetails = _.cloneDeep(res.result);
            const headerJson = [
                { label: 'Office Name', value: headerDetails.officeName },
                { label: 'Office Address', value: headerDetails.divisionOfficeAddress },
                { label: 'Administrative Department', value: headerDetails.departmentName },
                { label: 'Head Of Department', value: headerDetails.hodOfficeName },
                { label: 'Treasury Office', value: headerDetails.toOfficeName },
                { label: 'District', value: headerDetails.districtName },
                { label: 'Cardex No', value: headerDetails.cardexNo },
                { label: 'DDO No', value: headerDetails.ddoNo }
            ];
            const moduleInfo = {
                moduleName: ModuleNames.LetterOFCredit,
                tbudSceHdrId: 1,
                financialYearId: 1,
                trnRefNo: 1,
                departmentId: 1,
                estimationFrom: 1,
                demandId: 1,
                bpnI: 1,
                majorheadId: 1,
                isRevenueCapital: 1,
                submajorheadId: 1,
                minorheadId: 1,
                subheadId: 1,
                detailheadId: 1,
                isChargedVoted: 1,
                proposed_Amount: 1000,
                officeTypeId: 1,
                workflowId: 1,
                wfRoleId: 1,
                statusId: 1
            };
            const dialogRef = this.dialog.open(LcCommonWorkflowComponent, {
                width: '2700px',
                height: '600px',
                data: {
                    menuModuleName: 'loc',
                    headingName: 'LC Account Opening Request',
                    headerJson: headerJson,
                    trnId: this.hdrId,
                    moduleInfo: moduleInfo,
                    refNo: headerDetails.referenceNo ? headerDetails.referenceNo : '',
                    refDate: headerDetails.referenceDt ? headerDetails.referenceDt : '',
                    conditionUrl: 'loc/accopenreq/2001',
                    isAttachmentTab: true // for Attachment tab visible it should be true
                }
            });

            dialogRef.afterClosed().subscribe(wfData => {
                if (wfData.commonModelStatus === true) {
                    const popUpRes = wfData.data.result[0];
                    const paramsForWf = {
                        trnId: popUpRes.trnId,
                        wfId: popUpRes.wfId,
                        assignByWfRoleId: popUpRes.assignByWfRoleId,
                        trnStatus: popUpRes.trnStatus,
                        assignToWfRoleId: popUpRes.assignToWfRoleId,
                        assignByBranchId: popUpRes.assignByBranchId,
                        wfActionId: popUpRes.wfActionId,
                        assignByOfficeId: popUpRes.assignByOfficeId,
                        assignToOfficeId: popUpRes.assignToOfficeId,
                        assignToPouId: popUpRes.assignToPouId,
                        menuId: this.linkMenuId,
                        isAg: this.isAgHideFlag,
                        isTo: this.isTreasuryHideFlag,
                        isDat:this.datLoginFlag
                        //isNew: 1
                    };

                    this.wfSubmitDetails(paramsForWf);
                }
            });
        });
    }

    /**
     * @description submit work-flow popup
     */
    wfSubmitDetails(params) {
        this.locService.locWFSubmitDetails(params).subscribe((res: any) => {
            if (res && res.status === 200) {
                if (!this.referenceNo) {
                    const passData = {
                        id: this.hdrId,
                        isAg: this.isAgHideFlag,
                        isTo: this.isTreasuryHideFlag,
                        isDat:this.datLoginFlag
                    };

                    this.locService.getSubmitActionDetails(passData).subscribe((resp: any) => {
                        if (resp && resp.status === 200) {
                            const headerDetails = _.cloneDeep(resp.result);

                            const dialogRef = this.dialog.open(OkDialogComponent, {
                                width: '360px',
                                data: MESSAGES.REF_NO + headerDetails.referenceNo
                            });
                            dialogRef.afterClosed().subscribe(() => {
                                this.gotoListing();
                            });
                        }
                    });
                } else {
                    this.gotoListing();
                }
            } else {
                this.toastr.error(res['message']);
            }
        });
    }

    /**
     * @description Go To Listing Page of LOC
     */
    gotoListing() {
        this.router.navigate(['/dashboard/lc/create-lc-account-listing-division'], { skipLocationChange: true });
    }

    /**
     * @description Close Button Click
     */
    goToDashboard() {
        const proceedMessage = MESSAGES.PROCEED_MESSAGE;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard/lc/create-lc-account-division'], { skipLocationChange: true });
            }
        });
    }
    printLetterDocument() {
        const hdrId = this.hdrId;
        //const hdrId = 6;
       const params={
           id:this.hdrId
       }
        this.locService.getOpenreqPdf(params).subscribe((res: any) => {
            if (res.status === 200) {
                this.locService.getPDF(res, null, this.toastr);
            } else {
                this.toastr.error(res.message);
            }
        });
    }
}
