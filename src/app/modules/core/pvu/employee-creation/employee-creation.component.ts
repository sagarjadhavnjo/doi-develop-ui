import { EmployeeDataService } from './../services/employee-data.service';
import { filter } from 'rxjs/operators';
import { EmployeeForwardDialogComponent } from './employee-forward-dialog.component';
import { pvuMessage, MessageConst, MENU_ID } from './../../../../shared/constants/pvu/pvu-message.constants';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import {
    EmployeeEventsList, EmployeementHistory, QualificationData, MasterPhdData, NomineeData,
    DeptExamData, CCCExamData, LanguageExamData, SuspendedList
} from '../../../../models/pvu/employee-creation';
import { EmployeeCreationService } from 'src/app/modules/services/pvu/employee-creation.service';
import { ValidationService } from 'src/app/modules/services/validatation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/shared/services/storage.service';
import { EmpViewOtherOfficeComponent } from 'src/app/modules/core/pvu/emp-view-other-office/emp-view-other-office.component';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { RouteService } from 'src/app/shared/services/route.service';
import { EcViewCommentsComponent } from '../ec-view-comments/ec-view-comments.component';
import { EmployeeCreationPopUpServiceService } from 'src/app/modules/pvu/pvu-common/employee-creation-pop-up-service.service';
import { currentEmployeeDetailsIfNotAvailable } from '../events/pvu-events';
import { DataConst } from 'src/app/shared/constants/pvu/pvu-data.constants';
import { EmployeePrintComponent } from './employee-print/employee-print.component';
import { FieldsHistoryDialogComponent } from './fields-history-dialog/fields-history-dialog.component';

@Component({
    selector: 'app-employee-creation',
    templateUrl: './employee-creation.component.html',
    styleUrls: ['./employee-creation.component.css'],
    providers: [
        { provide: MatDialogRef, useValue: '' }
    ]
})
export class EmployeeCreationComponent implements OnInit {
    addharMask = '0000-0000-0000';
    panMask = 'SSSSS0000S';
    mobNoMask = '0000000000';
    isNpaVisible: boolean;
    cccExemptedArray: number[] = [];
    cccExemptedFlag: boolean = false;
    loader: boolean = false;
    isPersonalSaveDisabled: boolean = false;
    isQualSaveDisabled: boolean = false;
    isDeptSaveDisabled: boolean = false;
    isPaySaveDisabled: boolean = false;
    approvedStatus: boolean = false;
    isHodRequired: boolean = true;
    isAccNoMatch: boolean = true;
    hide4thPayCommission: boolean = false;
    hide5thPayCommission: boolean = false;
    isAttachmentExists: boolean = false;
    // @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    //     this.sort = ms;
    //     this.setDataSourceAttributes();
    // }

    // @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    //     this.paginator = mp;
    //     this.setDataSourceAttributes();
    // }
    @ViewChild('empPhoto', { static: true }) empPhoto: ElementRef;
    @ViewChild('nomPhoto') nomPhoto: ElementRef;
    @ViewChild('npsNomForm') npsNomForm: ElementRef;
    @ViewChild('nomDeclForm') nomDeclForm: ElementRef;
    defaultDob;
    currentPost;
    attachmentData;
    adminDepartment;
    hodData;
    empId: number;
    data: any;
    isPassDateRequired = false;
    isPhLevelRequired = false;
    isTabDisabled = true;
    quallfctnBtnDisable = false;
    disableQualField = false;
    empPayType: number;
    fixPayValue: number;
    eventList: EmployeeEventsList[];
    maxDOJ = new Date();
    statusMaxDate;
    statusMinDate;
    minDate = new Date();
    maxDate;
    joiningDateGog = new Date();
    minDate4th = new Date(1986, 0, 1);
    minDate5th = new Date(1996, 0, 1);
    min5thNextIncDate = new Date(1996, 0, 1);
    maxDate5th = new Date(2005, 11, 31);
    minDate6th = new Date(2006, 0, 1);
    minDate7th = new Date(2016, 0, 1);
    subscribeParams: Subscription;
    action: any;
    eventsClm = new BehaviorSubject(['noData']);
    departmentId: number;
    employeHistroyId: number;
    presentOfficeId: number;
    empAddressId: number = 0;
    sevenPayId: number;
    sixpayId: number;
    fifthPayId: number;
    fourthPayId: number;
    fixPayId: number;
    duplicatePanNo = false;
    gujaratId: number = 0;
    today = new Date();
    statusData;
    departmentCategoryIdSelected;
    npsNomiFormIndex: number;
    genNomiFormIndex: number;
    photoOfNomineeIndex: number;
    nomineeHighlight: boolean = false;
    qualHighlight: boolean = false;
    deptHighlight: boolean = false;
    cccHighlight: boolean = false;
    langHighlight: boolean = false;
    dialogOpen: boolean = false;
    employeeDataPersonal;
    employeeDataPayDetails;
    employeeDataExam;
    employeeDataDepartment;
    payDetailType = {
        'formAction': 'SUBMITTED',
        'pvuEmployeFixPayDetailDto': {
            'fixPayValue': 'string',
            'effDate': 'number'
        },
        'pvuEmployeSixPayDetailDto': {
            'dateOfOption': 'string',
            'dateOfPreRevisedNextIncrement': 'string',
            'dateOfStagnational': 'string',
            'effDate': 'string',
            'dateOfNextIncrement': 'string',
            'empDesignationAsOn': 'number',
            'empId': 'number',
            'empOtherDesignation': 'string',
            'formAction': 'string',
            'gradePay': 'number',
            'incrementAmount': 'number',
            'preRevisedBasicPay': 'number',
            'preRevisedPayScale': 'number',
            'revisedPayBand': 'number',
            'sixpayId': 'number',
            'payBandValue': 'number',
            'basicPay': 'number',
        },
        'pvuEmployeSevenPayDetailDto': {
            'basicPay': 'number',
            'cellId': 'number',
            'dateOfBenefitEffective': 'string',
            'dateOfNextIncrement': 'string',
            'empId': 'number',
            'formAction': 'string',
            'payLevel': 'number',
            'sevenpayId': 'string',
        },
        'pvuEmployefivePayDetailDto': {
            'basicPay': 'number',
            'effectiveDate': 'string',
            'dateOfNextIncrement': 'string',
            'empId': 'number',
            'fifthPayId': 'number',
            'formAction': 'string',
            'payScale': 'number'
        },
        'pvuEmployefourthPayDetailDto': {
            'basicPay': 'number',
            'effectiveDate': 'string',
            'empId': 'number',
            'formAction': 'string',
            'fourthPayId': 'number',
            'payScale': 'number',
            'statusId': 'number'
        }
    };

    displayedColumns = ['employementTypeName', 'deptName', 'officeName', 'officeAdd',
        'empDesignationHist', 'fromDate', 'toDate', 'lastPayDrawn', 'empServiceContinuationName',
        'orderNoDate', 'action'];

    fixProbationDateApplicable = false;
    maxFixProbationDate = new Date();
    selectedIndex: number;
    tabDisable = true;
    phCategory = false;
    serviceOrderNo = false;
    isDeputation = false;
    isDeptExamApplicable = false;
    isDepExemptedStatus = true;
    isCCCExamApplicable = false;
    isCccExemptedStatus = false;
    isEmployeementApplicable = false;
    sameAsCurrentAddr = false;
    sameAsPermanentAddr = false;
    fileDetailsNomi = false;
    fileDetailsGenForm = false;
    fileDetailsNpsForm = false;
    fileDetailsEmp = false;
    fileBrowseEmp = true;
    empViewPhoto;
    empPhotoKey: string;
    empPhotoName: string;
    disableQual = false;
    disableFieldDept = false;
    exemptDept = false;
    applicableDept = false;
    exemptCCC = false;
    cccExmptedStatus = false;
    deptExamptedStatus = false;
    disableFieldCCC = false;
    disabledeptHOD = false;
    applicableCCC = false;
    listshow = false;
    prevEmpHistory = false;
    showGPF = true;
    showPRAN = true;
    payData;
    createEmployeeForm: FormGroup;
    createFixPayDetail: FormGroup;
    create4thPayDetails: FormGroup;
    create5thPayDetails: FormGroup;
    create6thPayDetails: FormGroup;
    create7thPayDetails: FormGroup;
    departmentalDetails: FormGroup;
    previousEmployementDetails: FormGroup;
    transStatus;
    errorMessages = pvuMessage;
    salutationList;
    genderList;
    maritalStatusList;
    categoryList;
    bloodGroupList;
    marriedRelationshipList;
    unmerriedRelationshipList;
    relationshipList;
    curStateList = [];
    isCurStateNonGujarat: boolean = false;
    perStateList = [];
    isPerStateNonGujarat: boolean = false;
    natStateList = [];
    isNatStateNonGujarat: boolean = false;
    curDistrictList = [];
    perDistrictList = [];
    natDistrictList = [];
    curTalukaList = [];
    perTalukaList = [];
    natTalukaList = [];
    nationalityList: object[] = [];
    phStatusList = [];
    deputationDistList = [];

    phTypeList: object[] = [];

    curOfficeDistList: object[] = [];

    deptEmpStatusList;
    empPayTypeData;
    empPayTypeList;
    empDesignationList;
    fourthBasicPayError: boolean = false;
    fifthBasicPayError: boolean = false;
    sixthBasicPayError: boolean = false;
    parentAdminDeptList: object[] = [];
    parentHeadDeptList: object[] = [];

    subOfficeList: object[] = [];
    fixPayCommissionEmpPayType = [157, 158];
    empClassList;
    empTypeData;
    empTypeList;
    departmentalCategoryList;
    degreeList;
    allCourseNameList;
    passingYearListData = [];
    passingYearList = [];
    deptExamBodyList;
    cccExamBodyList;
    deptExamStatusList;
    cccExamNameData;
    cccExamNameList;
    cccExamStatusList;
    langNameList;
    langTypeList;
    langExamStatusList;
    districtList;
    talukaList: string[] = [];
    employementTypeList;
    empServiceContinuationList;
    isSuspendedList: SuspendedList[] = [];
    applicablePayCommList;
    empDesignationAsOnList;
    preRevisedPayScaleList;
    payLevelList: string[];
    gradePayList: string[];
    fivePayScaleList: string[] = [];
    fourPayScaleList: string[] = [];
    sixPayGrade: string[] = [];
    npaAmountList: object[] = [];
    fixPayList: object[] = [];
    cellIdList: object[] = [];
    salutationCtrl: FormControl = new FormControl();
    applicablePayCommCtrl: FormControl = new FormControl();
    genderCtrl: FormControl = new FormControl();
    nationalityCtrl: FormControl = new FormControl();
    maritalStatusCtrl: FormControl = new FormControl();
    categoryCtrl: FormControl = new FormControl();
    bloodGroupCtrl: FormControl = new FormControl();
    phStatusCtrl: FormControl = new FormControl();
    phTypeCtrl: FormControl = new FormControl();
    nStateCtrl: FormControl = new FormControl();
    nDistrictCtrl: FormControl = new FormControl();
    nTalukaCtrl: FormControl = new FormControl();
    nCityCtrl: FormControl = new FormControl();
    pStateCtrl: FormControl = new FormControl();
    pDistrictCtrl: FormControl = new FormControl();
    pTalukaCtrl: FormControl = new FormControl();
    pCityCtrl: FormControl = new FormControl();
    cStateCtrl: FormControl = new FormControl();
    cDistrictCtrl: FormControl = new FormControl();
    cTalukaCtrl: FormControl = new FormControl();
    cCityCtrl: FormControl = new FormControl();
    cOfficeDistCtrl: FormControl = new FormControl();
    empCategoryCtrl: FormControl = new FormControl();
    empStatusCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
    empDesignationCtrl: FormControl = new FormControl();
    parentAdminDeptCtrl: FormControl = new FormControl();
    fixPayValueCtrl: FormControl = new FormControl();
    parentHeadDeptCtrl: FormControl = new FormControl();
    presentOfficeCtrl: FormControl = new FormControl();
    subOfficeCtrl: FormControl = new FormControl();
    empClassCtrl: FormControl = new FormControl();
    departmentalCategoryCtrl: FormControl = new FormControl();
    empDesignationAsOnCtrl: FormControl = new FormControl();
    preRevisedPayScaleCtrl: FormControl = new FormControl();
    revisedPayBandCtrl: FormControl = new FormControl();
    gradePayCtrl: FormControl = new FormControl();
    npaAmountCtrl: FormControl = new FormControl();
    degreeCtrl: FormControl[] = [new FormControl()];
    courseCtrl: FormControl[] = [new FormControl()];
    passingYearCtrl: FormControl[] = [new FormControl()];
    employementTypeCtrl: FormControl = new FormControl();
    empDesignationHistCtrl: FormControl = new FormControl();
    empServiceContinuationCtrl: FormControl = new FormControl();
    cellIdCtrl: FormControl = new FormControl();
    payLevelCtrl: FormControl = new FormControl();
    cccExamNameCtrl: FormControl[] = [new FormControl()];
    cccExamBodyCtrl: FormControl[] = [new FormControl()];
    cccExamStatusCtrl: FormControl[] = [new FormControl()];
    relationshipCtrl: FormControl[] = [new FormControl()];
    examBodyCtrl: FormControl[] = [new FormControl()];
    deptHodNameCtrl: FormControl[] = [new FormControl()];
    deptExamStatusCtrl: FormControl[] = [new FormControl()];
    langNameCtrl: FormControl[] = [new FormControl()];
    langExamTypeCtrl: FormControl[] = [new FormControl()];
    langExamStatusCtrl: FormControl[] = [new FormControl()];
    payScaleCtrl: FormControl = new FormControl();
    fifthGradeCtrl: FormControl = new FormControl();
    deputationDistCtrl: FormControl = new FormControl();
    currentWfRlId:number;

    qualificationData: QualificationData[] = [
        {
            empQualiId: 0, degree: 0, courseName: '', isOtherCourseName: false, otherCourseName: '',
            passingYear: '', schoolCollege: '', universityBoard: '', percentageCGPA: '', remarks: ''
        }
    ];

    displayedQualificationColumns = ['degree', 'courseName', 'passingYear', 'schoolCollege',
        'universityBoard', 'percentageCGPA', 'remarks', 'Action'];

    dataSourceQualification = new MatTableDataSource<QualificationData>(this.qualificationData);

    masterPhdData: MasterPhdData[] = [
        {
            empQualiId: 0, degree: 0, courseName: '', isOtherCourseName: false, otherCourseName: '',
            passingYear: '', schoolCollege: '', universityBoard: '', percentageCGPA: '', remarks: ''
        }
    ];

    displayedMasterPhdColumns = ['degree', 'courseName', 'passingYear', 'schoolCollege',
        'universityBoard', 'percentageCGPA', 'remarks', 'Action'];

    dataSourceMasterPhd = new MatTableDataSource<MasterPhdData>(this.masterPhdData);

    nomineeData: NomineeData[] = [
        {
            empNomineeId: '0', relationship: '', otherRelationship: '', nomineeName: '',
            nomineeAddress: '', nomineeAge: '', nomineeShare: '',
            photoOfNominee: '', genNomiForm: '', npsNomiForm: '', fileBrowseNomi: true,
            fileBrowseGenForm: true, fileBrowseNpsForm: true, isOtherRelation: false,
            nomineePhotoName: '', genNomineeFormName: '', npsNomineeFormName: '',
        }
    ];
    displayedNomineeColumns = [
        'relationship', 'nomineeName', 'nomineeAddress', 'nomineeAge',
        'nomineeShare', 'photoOfNominee', 'genNomiForm', 'npsNomiForm', 'Action'
    ];
    dataSourceNominee = new MatTableDataSource<NomineeData>(this.nomineeData);

    deptExamData: DeptExamData[] = [{
        empDeptExamDetailId: 0, deptExamName: '', examBody: 0, deptHodName: 0, otherDeptHodName: '',
        dateOfPassing: '', examStatus: 0, examAttempts: '', remarks: '', disabledeptHOD: false
    }];
    displayedDeptExamColumns = [
        'deptExamName', 'examBody', 'deptHodName', 'dateOfPassing', 'examStatus',
        'examAttempts', 'remarks', 'Action'
    ];
    dataSourceDeptExam = new MatTableDataSource<DeptExamData>();

    spclExamData: CCCExamData[] = [
        {
            empCCCExamDetailId: 0, cccExamName: 0, cccExamNameDisable: false, examBody: 0,
            dateOfExam: '', dateOfPassing: '', examStatus: 0, certificateNo: '', remarks: ''
        }
    ];
    displayedspclExamColumns = ['cccExamName', 'examBody', 'dateOfExam', 'dateOfPassing', 'examStatus',
        'certificateNo', 'remarks', 'Action'];
    dataSourceSpclExam = new MatTableDataSource<CCCExamData>();

    languageExamData: LanguageExamData[] = [
        {
            empLangExamId: 0, langName: 0, langNameDisable: false, examBody: '', examType: 0,
            examTypeDisable: false, dateOfPassing: '', seatNo: '', examStatus: 0, remarks: ''
        }
    ];
    allEventsList: any[] = [
        {
            transacNumber: 1100100012, eventName: 'Employee Creation', eventEffectiveDate: '04-01-2020',
            employeeName: 'Hardik Nenuji', payScale: '', gradePay: '', payBandValue: '',
            empBasicPay: '', designation: 'Sub Accountant', dateOfAudit: '04-01-2020',
            status: 'Approved'
        }
    ];

    displayedEventsColumns: string[] = [
        'srNo', 'transacNumber', 'eventName', 'eventDate',
        'empPayBand', 'payBandValue', 'employeePayLevel', 'empBasicPay', 'personalPay', 'incrementDate',
        'designation', 'optionOpted', 'approvalDate'
    ];

    displayedLangExamColumns = ['langName', 'examBody', 'examType', 'dateOfPassing',
        'seatNo', 'examStatus', 'remarks', 'Action'];
    dataSourceLangExam = new MatTableDataSource<LanguageExamData>(this.languageExamData);

    dataSource = new MatTableDataSource<EmployeementHistory>();

    fileData;
    fixDistrictValue: any;
    saveDraftStatusId: number;
    savedEmpStatusId: number;
    isSaveDraftVisible: boolean = false;
    dateOfBirth = new Date();
    payMasterData: any = [];
    formattedDateOfBirth = new Date();
    minDoj: Date = new Date();
    minDob: Date = new Date(this.minDoj.getFullYear() - 100, this.minDoj.getMonth(), this.minDoj.getDate());

    // Joining Pay declaration start here
    joiningPayId = null;
    isJoiningFixPay: boolean = false;
    isJoining1stPay: boolean = false;
    isJoining2ndPay: boolean = false;
    isJoining3rdPay: boolean = false;
    isJoining4thPay: boolean = false;
    isJoining5thPay: boolean = false;
    isJoining6thPay: boolean = false;
    isJoining7thPay: boolean = false;
    joiningFixPayDetail: FormGroup;
    joinFixPayValueCtrl: FormControl = new FormControl();
    joining1stPayDetail: FormGroup;
    joining2ndPayDetail: FormGroup;
    joining3rdPayDetail: FormGroup;
    join3rdScaleCtrl: FormControl = new FormControl();
    join3rdScaleList;
    join3rdBasicPayError: boolean = false;
    joining4thPayDetail: FormGroup;
    join4thScaleCtrl: FormControl = new FormControl();
    join4thScaleList;
    join4thBasicPayError: boolean = false;
    joining5thPayDetail: FormGroup;
    join5thScaleCtrl: FormControl = new FormControl();
    join5thScaleList;
    join5thBasicPayError: boolean = false;
    joining6thPayDetail: FormGroup;
    join6thPayBandCtrl: FormControl = new FormControl();
    join6thGradePayCtrl: FormControl = new FormControl();
    join6thPayBandList;
    join6thGradePayList;
    join6thBasicPayError: boolean = false;
    joining7thPayDetail: FormGroup;
    join7thPayLevelCtrl: FormControl = new FormControl();
    join7thCellIdCtrl: FormControl = new FormControl();
    join7thPayLevelList;
    join7thCellIdList;
    // end of joining pay declaration
    // Bank Details Declaration Start from Here
    bankId = null;
    bankDetailsForm: FormGroup;
    ifscCodeCtrl: FormControl = new FormControl();
    ifscCodeList;
    accountTypeCtrl: FormControl = new FormControl();
    accountTypeList;
    // end of Bank Details Declaration
    isJudiciaryDeptCat: boolean = false;
    loadJoiningDetails: boolean = false;
    ddoEditable: boolean;
    adminEditable: boolean;
    empHistoryArray: any = [];
    empNomineeArray: any = [];
    employeeSubmitData: any = {};
    formData = new FormData();
    expCreation = null;
    req6th = false;
    req7th = false;
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private el: ElementRef,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private routeService: RouteService,
        private pvuService: EmployeeCreationService,
        private employeeDataService: EmployeeDataService,
        private datepipe: DatePipe,
        private httpClient: HttpClient,
        private storageService: StorageService,
        private employeeCreationPopUpServiceService: EmployeeCreationPopUpServiceService,
        public dialogRefEmployeeCreation: MatDialogRef<EmployeeCreationComponent>
    ) {
        const today = new Date();
        this.defaultDob = new Date(today.getFullYear() - 18, today.getMonth(),
            today.getDate());
    }

    ngOnInit() {
        this.createJoiningPayForm();
        this.bankDetailsForm = this.fb.group({
            accountType: ['', Validators.required],
            ifscCode: ['', Validators.required],
            bankName: [''],
            bankAddress: [''],
            bankAccNo1: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
            bankAccNo2: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
        });
        this.createForm();
        // const originFormControlNgOnChanges = FormControlDirective.prototype.ngOnChanges;
        // FormControlDirective.prototype.ngOnChanges = function () {
        //     this.createEmployeeForm.nativeElement = this.valueAccessor._elementRef.nativeElement;
        //     return originFormControlNgOnChanges.apply(this, arguments);
        // };

        // const originFormControlNameNgOnChanges = FormControlName.prototype.ngOnChanges;
        // FormControlName.prototype.ngOnChanges = function () {
        //     const result = originFormControlNameNgOnChanges.apply(this, arguments);
        //     // console.log('this', this);
        //     this.control.nativeElement = this.valueAccessor._elementRef.nativeElement;
        //     return result;
        // };

        if (this.employeeCreationPopUpServiceService.empID !== 0) {
            this.dialogOpen = true;
            this.selectedIndex = 4;
            this.currentPost = currentEmployeeDetailsIfNotAvailable;
            this.patchDepartmentDetail();
            this.getAttachmentMaster(currentEmployeeDetailsIfNotAvailable['menuId']);
            // this.getAttachmentMaster(res['linkMenuId']);
            this.getSubOffice(currentEmployeeDetailsIfNotAvailable['officeDetail']['officeId']);
        } else {
            if (this.activatedRoute.snapshot.params && this.activatedRoute.snapshot.params.expCreation) {
                this.pvuService.getMenuDetailsForListing(MENU_ID.EMP_CREATION).then(res => {
                    if (res) {
                        this.getCurrentUserDetails();
                    } else {
                        this.toastr.error(pvuMessage.EMP_CREATION_NO_RIGHTS);
                    }
                });
            } else {
                this.getCurrentUserDetails();
            }
        }
        // this.getLookUpInfoData();
        this.getPayMasters();
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action && this.action === 'edit' || this.action === 'view') {
                this.isTabDisabled = true;
                this.empId = +resRoute.id;
                this.expCreation = resRoute.expCreation ? +resRoute.expCreation : null;
                if (this.expCreation) {
                    this.verifyCredentials();
                }
                this.loader = true;
                this.getSixthPayDesignationList();
                this.getLookUpInfoData();
                this.passportExpiryMand();
                if (this.empId) {
                    if (this.action === 'view') {
                        this.disableForms();
                    }
                } else {
                    this.router.navigate(['../add'], { relativeTo: this.activatedRoute });
                }
            } else {
                this.loader = true;
                this.getSixthPayDesignationList();
                this.getLookUpInfoData();
                // this.getPayMasters();
            }
        });
        const employeeId = this.employeeCreationPopUpServiceService.empID;
        this.employeeCreationPopUpServiceService.empID = 0;
        if (employeeId !== 0) {
            this.action = 'view';
            this.isTabDisabled = true;
            this.empId = employeeId;
            this.getSixthPayDesignationList();
            this.getLookUpInfoData();
            this.passportExpiryMand();
            this.getAttachmentMaster('46');
            if (this.empId) {
                if (this.action === 'view') {
                    this.disableForms();
                }
            }
        }
    }

    getCurrentUserDetails() {
        this.pvuService.getCurrentUserDetail(true).then(res => {
            if (res) {
                this.currentPost = _.cloneDeep(res);
                this.verifyCredentials();
                this.patchDepartmentDetail();
                this.getAttachmentMaster(res['menuId']);
                // this.getAttachmentMaster(res['linkMenuId']);
                this.getSubOffice(res['officeDetail']['officeId']);
                if (this.action && this.action === 'edit' && this.currentPost) {
                    if (this.currentPost['wfRoleCode'].includes('1070')) {
                        this.adminEditable = true;
                        this.ddoEditable = false;
                        this.currentWfRlId = 80;
                    }
                    else if (this.currentPost['wfRoleCode'].includes('1002')) {
                        this.ddoEditable = true;
                        this.adminEditable = false;
                        this.currentWfRlId = 3;
                    }
                }
            }
        });
    }

    disableNonEditableForms() {
        this.disableJoiningForm();
        this.bankDetailsForm.disable();
        this.createFixPayDetail.disable();
        this.create4thPayDetails.disable();
        this.create5thPayDetails.disable();
        this.create6thPayDetails.disable();
        this.create7thPayDetails.disable();
    }

    verifyCredentials() {
        if (this.expCreation && this.currentPost) {
            if (this.currentPost['wfRoleCode'] !== '1000') {
                this.toastr.error(pvuMessage.EMP_CREATION_NO_RIGHTS);
                this.router.navigate(['/dashboard/pvu/user-creation/list'],
                    { skipLocationChange: true });
            }
        }
    }

    /**
     * @description To disable all the forms for view action
     */
    disableForms() {
        this.addharMask = 'XXXX XXXX 0000';
        this.panMask = 'AAXXXXXX0A';
        this.mobNoMask = 'XXXXXX0000';
        this.isTabDisabled = false;
        this.createEmployeeForm.disable();
        this.departmentalDetails.disable();
        this.disableJoiningForm();
        this.bankDetailsForm.disable();
        this.createFixPayDetail.disable();
        this.create4thPayDetails.disable();
        this.create5thPayDetails.disable();
        this.create6thPayDetails.disable();
        this.create7thPayDetails.disable();
        this.disableQual = true;
        // this.getAllEmployeeEvents();
        this.displayedNomineeColumns = [
            'relationship', 'nomineeName', 'nomineeAddress', 'nomineeAge',
            'nomineeShare', 'photoOfNominee', 'genNomiForm', 'npsNomiForm'
        ];
        this.displayedQualificationColumns = [
            'degree', 'courseName', 'passingYear', 'schoolCollege', 'universityBoard',
            'percentageCGPA', 'remarks'
        ];
        this.displayedDeptExamColumns = [
            'deptExamName', 'examBody', 'deptHodName', 'dateOfPassing', 'examStatus',
            'examAttempts', 'remarks'
        ];
        this.displayedspclExamColumns = [
            'cccExamName', 'examBody', 'dateOfExam', 'dateOfPassing', 'examStatus',
            'certificateNo', 'remarks'
        ];
        this.displayedLangExamColumns = [
            'langName', 'examBody', 'examType', 'dateOfPassing', 'seatNo', 'examStatus',
            'remarks'
        ];
        this.displayedColumns = [
            'employementTypeName', 'deptName', 'officeName', 'officeAdd',
            'empDesignationHist', 'fromDate', 'toDate', 'lastPayDrawn',
            'empServiceContinuationName', 'orderNoDate'
        ];
    }

    /**
     * @description Create Joining Pay forms
     */
    createJoiningPayForm() {
        this.joiningFixPayDetail = this.fb.group({
            joinFixPayValue: ['', Validators.required]
        });
        this.joining1stPayDetail = this.fb.group({
            join1stScale: ['', Validators.required],
            join1stBasicPay: ['', Validators.required]
        });
        this.joining2ndPayDetail = this.fb.group({
            join2ndScale: ['', Validators.required],
            join2ndBasicPay: ['', Validators.required]
        });
        this.joining3rdPayDetail = this.fb.group({
            join3rdScale: ['', Validators.required],
            join3rdBasicPay: ['', Validators.required]
        });
        this.joining4thPayDetail = this.fb.group({
            join4thScale: ['', Validators.required],
            join4thBasicPay: ['', Validators.required]
        });
        this.joining5thPayDetail = this.fb.group({
            join5thScale: ['', Validators.required],
            join5thBasicPay: ['', Validators.required]
        });
        this.joining6thPayDetail = this.fb.group({
            join6thPayBand: ['', Validators.required],
            join6thPayBandValue: ['', Validators.required],
            join6thGradePay: ['', Validators.required],
            join6thBasicPay: [''],
        });
        this.joining7thPayDetail = this.fb.group({
            join7thPayLevel: ['', Validators.required],
            join7thCellId: ['', Validators.required],
            join7thBasicPay: [''],
        });
    }

    /**
     * @description To set the bank name and bank address based on the IFSC Code change
     */
    ifscCodeChange() {
        if (this.bankDetailsForm.get('ifscCode').value && this.ifscCodeList) {
            const ifscData = this.ifscCodeList.filter(ifscObj => {
                return this.bankDetailsForm.get('ifscCode').value === ifscObj['id'];
            })[0];

            if (ifscData) {
                this.bankDetailsForm.patchValue({
                    'bankName': ifscData['name'],
                    'bankAddress': ifscData['address']
                });
            } else {
                this.bankDetailsForm.patchValue({
                    'bankName': '',
                    'bankAddress': ''
                });
            }
        } else {
            this.bankDetailsForm.patchValue({
                'bankName': '',
                'bankAddress': ''
            });
        }
    }

    /**
     * @description To reset the bank details form
     */
    resetBankDetails() {
        this.bankDetailsForm.patchValue({
            accountType: '',
            ifscCode: '',
            bankName: '',
            bankAddress: '',
            bankAccNo1: '',
            bankAccNo2: '',
        });

        if (this.accountTypeList && this.accountTypeList.length === 1
            && this.accountTypeList[0]['lookupInfoId']) {
            this.bankDetailsForm.controls.accountType.setValue(this.accountTypeList[0]['lookupInfoId']);
        }

    }

    /**
     * @description To check the validation for the Judiciary departmental category and 7th Pay Commission
     */
    onDepartmentCategoryChange() {
        // 17 is for Judiciary Department Category ID
        if (this.departmentalDetails.get('departmentalCategory').value === 17) {
            this.isJudiciaryDeptCat = true;
            // 152 for 7th Pay Commission as Applicable Pay Commission
            if (this.departmentalDetails.get('payCommissionJoiningTime').value === 152
                && this.departmentalCategoryList) {
                const catName = this.departmentalCategoryList.filter((catObj) => {
                    return catObj['id'] === 17;
                })[0];
                this.toastr.error(
                    '7th Pay Commission is not applicable for ' + catName['name'] + ' Departmental Category'
                );
                this.departmentalDetails.controls.payCommissionJoiningTime.setValue('');
                this.payCommissionChange();
            }
        } else {
            this.isJudiciaryDeptCat = false;
        }
    }

    /**
     * @description To get the pay master data
     */
    getPayMasters() {
        const self = this;
        const param = {
            request: {
                departmentCategoryId: this.departmentCategoryIdSelected
            }
        };
        this.pvuService.getPayMasters(param).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                // if (!self.payLevelList) {
                self.payMasterData = _.cloneDeep(res['result']);
                self.payLevelList = _.cloneDeep(self.payMasterData['152']);
                self.join7thPayLevelList = _.cloneDeep(self.payMasterData['152']);
                if (this.empId) {
                    const params = { 'id': this.empId };
                    this.getPayDetails(params);
                }
                // }
                this.join3rdScaleList = res['result']['148']; // third pay scale list
                this.fourPayScaleList = res['result']['149'];
                this.fivePayScaleList = res['result']['150'];
                this.join5thScaleList = _.cloneDeep(res['result']['150']);
                this.preRevisedPayScaleList = res['result']['150'];
                this.sixPayGrade = _.cloneDeep(res['result']['151']);
                this.join6thPayBandList = _.cloneDeep(res['result']['151']);
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    /**
     * @description To get the sub office list
     */
    getSubOffice(officeId) {
        if (officeId) {
            const param = { 'id': officeId };
            this.pvuService.getSubOffice(param).subscribe((res) => {
                if (res && res['result']) {
                    this.subOfficeList = res['result'];
                }
            });
        }
    }

    /**
     * @description To get the attachment master data
     * @param menuId menu ID
     */
    getAttachmentMaster(menuId) {
        if (menuId) {
            const param = { 'id': menuId };
            this.pvuService.getAttachmentByMenuId(param).subscribe((res) => {
                if (res && res['result']) {
                    this.attachmentData = res['result'][0];

                }
            });
        }
    }

    /**
     * @description To get the office details and set in the department details tab
     */
    getOfficeDetails() {
        this.pvuService.getOfficeByDistrict(this.departmentalDetails.controls.districtId.value).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                res['result'].forEach(element => {
                    if (Number(this.departmentalDetails.controls.cardexNo.value) === element.cardexno) {
                        this.departmentalDetails.patchValue({
                            'ddoCode': Number(element.ddoNo),
                            'officeAddNum': element.addressDescription,
                            'presentOffice': element.officeName
                        });
                        this.presentOfficeId = element.officeId;
                    }
                });
            }
        });
    }

    /**
     * @description To reset the pay band value on 6th pay band change
     */
    on6thPayBandChange() {
        this.toggleRequireTag6th();
        if (this.departmentalDetails.getRawValue().payCommissionJoiningTime === 151) {
            this.create6thPayDetails.controls.payBandValue.setValue('');
            this.create6thPayDetails.controls.gradePay.setValue('');
            this.calculateBasicPay();
            this.getPayGrade();
        } else {
            this.create6thPayDetails.controls.gradePay.setValue('');
            this.calculateBasicPay();
            this.getPayGrade();
            this.validate6thPreRevisedRange(this.create6thPayDetails.get('revisedPayBand'), 'current');
        }
    }

    /**
     * @description To load the grade pay list based on the pay band
     */
    getPayGrade() {
        const payBand = this.create6thPayDetails.get('revisedPayBand').value;
        if (this.sixPayGrade) {
            const selectedpayBand = this.sixPayGrade.filter((item) => item['id'] === payBand);
            if (selectedpayBand && selectedpayBand[0]) {
                this.gradePayList = selectedpayBand[0]['gradePays'];
                if (this.gradePayList.length === 0) {
                    this.create6thPayDetails.controls.gradePay.setValue('');
                }
                if (this.isJudiciaryDeptCat && this.gradePayList.length === 1) {
                    if (this.gradePayList[0]['id']) {
                        this.create6thPayDetails.controls.gradePay.setValue(this.gradePayList[0]['id']);
                    }
                }
            }
        }
    }

    /**
     * @description To get the entry pay based on the 6th pay commission grade pay
     */
    onGradePayChange() {
        // for joining 6th pay commission (151 is for 6th pay commission)
        if (this.departmentalDetails.getRawValue().payCommissionJoiningTime === 151) {
            this.getEntryPay(this.departmentCategoryIdSelected,
                this.create6thPayDetails.getRawValue().revisedPayBand,
                this.create6thPayDetails.getRawValue().gradePay, 'current').then((entryPay) => {
                    if (entryPay) {
                        this.calculateBasicPay();
                        if (this.action !== 'view') {
                            const payBandValueConst = {
                                value: this.create6thPayDetails.controls.revisedPayBand.value
                            };
                            this.validate6thPreRevisedRange(payBandValueConst, 'current');
                        }
                    } else {
                        this.calculateBasicPay();
                    }
                });
        } else {
            this.calculateBasicPay();
        }
    }

    /**
     * @description To reset the pay band value on joining 6th pay band change
     */
    onJoining6thPayBandChange() {
        this.joining6thPayDetail.controls.join6thPayBandValue.setValue('');
        this.joining6thPayDetail.controls.join6thGradePay.setValue('');
        this.calJoining6thBasicPay();
        this.getJoiningPayGrade();
    }

    /**
     * @description To load the 6th pay grade pay list based on the joining 6th pay band
     */
    getJoiningPayGrade() {
        const payBand = this.joining6thPayDetail.get('join6thPayBand').value;
        if (this.join6thPayBandList) {
            const selectedpayBand = this.join6thPayBandList.filter((item) => item['id'] === payBand);
            if (selectedpayBand && selectedpayBand[0]) {
                this.join6thGradePayList = selectedpayBand[0]['gradePays'];
                if (this.join6thGradePayList.length === 0) {
                    this.joining6thPayDetail.controls.join6thGradePay.setValue('');
                }
                if (this.isJudiciaryDeptCat && this.join6thGradePayList.length === 1) {
                    if (this.join6thGradePayList[0]['id']) {
                        this.joining6thPayDetail.controls.join6thGradePay.setValue(this.join6thGradePayList[0]['id']);
                    }
                }
            }
        }
    }

    /**
     * @description To get the entry pay based on the grade pay change
     */
    onJoiningGradePayChange() {
        // for joining 6th pay commission (151 is for 6th pay commission)
        if (this.departmentalDetails.getRawValue().payCommissionJoiningTime === 151) {
            this.getEntryPay(this.departmentCategoryIdSelected,
                this.joining6thPayDetail.getRawValue().join6thPayBand,
                this.joining6thPayDetail.getRawValue().join6thGradePay, 'join').then((entryPay) => {
                    if (entryPay) {
                        this.calJoining6thBasicPay();
                        if (this.action !== 'view') {
                            const payBandValueConst = {
                                value: this.joining6thPayDetail.controls.join6thPayBand.value
                            };
                            this.validate6thPreRevisedRange(payBandValueConst, 'join');
                        }
                    } else {
                        this.calJoining6thBasicPay();
                    }
                });
        } else {
            this.calJoining6thBasicPay();
        }
    }

    /**
     * @description To get the pay details tab data
     * @param params request parameter
     */
    getPayDetails(params) {
        this.pvuService.getPayDetails(params).subscribe((data) => {
            if (data && data['result']) {
                this.employeeDataPayDetails = _.cloneDeep(data['result']);
                this.patchPayDetail(data['result']);
                this.disablePayDetails();
            } else {
                this.disablePayDetails();
            }
        });
    }

    /**
     * @description To disable the pay details for view action
     */
    disablePayDetails() {
        if (this.action === 'view') {
            this.createFixPayDetail.disable();
            this.create4thPayDetails.disable();
            this.create5thPayDetails.disable();
            this.create6thPayDetails.disable();
            this.create7thPayDetails.disable();
            this.disableJoiningForm();
        }
    }

    /**
     * @description To disable the jopining pay details forms
     */
    disableJoiningForm() {
        this.joiningFixPayDetail.disable();
        this.joining1stPayDetail.disable();
        this.joining2ndPayDetail.disable();
        this.joining3rdPayDetail.disable();
        this.joining4thPayDetail.disable();
        this.joining5thPayDetail.disable();
        this.joining6thPayDetail.disable();
        this.joining7thPayDetail.disable();
    }

    /**
     * @description To set the pay details tab data
     * @param data pay details tab data
     */
    patchPayDetail(data) {
        const empPayComm = this.departmentalDetails.get('payCommissionJoiningTime').value;
        this.payData = data;

        if (data.pvuEmpBankDetailDto) {
            this.bankId = data.pvuEmpBankDetailDto.id;
            this.bankDetailsForm.patchValue({
                accountType: data.pvuEmpBankDetailDto.accountType,
                ifscCode: data.pvuEmpBankDetailDto.ifscCode,
                bankName: data.pvuEmpBankDetailDto.bankName,
                bankAddress: data.pvuEmpBankDetailDto.bankAddress,
                bankAccNo1: data.pvuEmpBankDetailDto.accountNo,
                bankAccNo2: data.pvuEmpBankDetailDto.accountNo,
            });
            this.validateAccNo();
        } else {
            this.resetBankDetails();
        }

        // 341 for fix pay commission
        if (data.pvuEmployeFixPayDetailsDto != null && (empPayComm === 341 || this.approvedStatus)) {
            this.createFixPayDetail.patchValue({
                fixPayValue: data.pvuEmployeFixPayDetailsDto.fixPayValue !== '' &&
                    data.pvuEmployeFixPayDetailsDto.fixPayValue !== undefined &&
                    data.pvuEmployeFixPayDetailsDto.fixPayValue !== null &&
                    data.pvuEmployeFixPayDetailsDto.fixPayValue !== 0 ?
                    data.pvuEmployeFixPayDetailsDto.fixPayValue : '',
                effDate: this.employeeDataService.dateFormating(data.pvuEmployeFixPayDetailsDto.effDate)
            });
            this.fixPayId = data.pvuEmployeFixPayDetailsDto.fixPayId;
        } else {
            this.resetFixPayForm();
        }

        // 4th Pay Commission (149)
        // 3rd Pay Commission (148)
        // 2nd Pay Commission (339)
        // 1st Pay Commission (338)
        if (data.pvuEmployefourthPayDetailDto != null &&
            (empPayComm === 149 || empPayComm === 148 || empPayComm === 339 || empPayComm === 338)) {
            this.create4thPayDetails.patchValue({
                payScale: data.pvuEmployefourthPayDetailDto.payScale !== '' &&
                    data.pvuEmployefourthPayDetailDto.payScale !== undefined &&
                    data.pvuEmployefourthPayDetailDto.payScale !== null &&
                    data.pvuEmployefourthPayDetailDto.payScale !== 0 ?
                    data.pvuEmployefourthPayDetailDto.payScale : '',
                basicPay: data.pvuEmployefourthPayDetailDto.basicPay !== '' &&
                    data.pvuEmployefourthPayDetailDto.basicPay !== undefined &&
                    data.pvuEmployefourthPayDetailDto.basicPay !== null &&
                    data.pvuEmployefourthPayDetailDto.basicPay !== 0 ?
                    data.pvuEmployefourthPayDetailDto.basicPay : '',
                effectiveDate: this.employeeDataService.dateFormating(data.pvuEmployefourthPayDetailDto.effectiveDate)
            });
            this.create4thPayDetails.updateValueAndValidity();
            this.fourthPayId = data.pvuEmployefourthPayDetailDto.fourthPayId;
            if (this.action !== 'view') {
                this.validate4thBasicPayRange({ value: this.create4thPayDetails.controls.payScale.value }, 'current');
            }
        } else {
            this.reset4thPayForm();
        }

        // 150 is for 5th Pay commission
        // 4th Pay Commission (149)
        // 3rd Pay Commission (148)
        // 2nd Pay Commission (339)
        // 1st Pay Commission (338)
        const joinEmpPayType = this.employeeDataDepartment?.joinEmpPayType;
        if (data.pvuEmployefivePayDetailDto != null && (empPayComm === 150 ||
            empPayComm === 149 || empPayComm === 148 || empPayComm === 339 ||
            empPayComm === 338 || (empPayComm === 341 && joinEmpPayType === 157))) {
            this.create5thPayDetails.patchValue({
                payScale: data.pvuEmployefivePayDetailDto.payScale !== '' &&
                    data.pvuEmployefivePayDetailDto.payScale !== undefined &&
                    data.pvuEmployefivePayDetailDto.payScale !== null &&
                    data.pvuEmployefivePayDetailDto.payScale !== 0 ?
                    data.pvuEmployefivePayDetailDto.payScale : '',
                basicPay: data.pvuEmployefivePayDetailDto.basicPay !== '' &&
                    data.pvuEmployefivePayDetailDto.basicPay !== undefined &&
                    data.pvuEmployefivePayDetailDto.basicPay !== null &&
                    data.pvuEmployefivePayDetailDto.basicPay !== 0 ?
                    data.pvuEmployefivePayDetailDto.basicPay : '',
                effectiveDate: this.employeeDataService.dateFormating(data.pvuEmployefivePayDetailDto.effectiveDate),
                dateOfNextIncrement: this.employeeDataService.dateFormating(
                    data.pvuEmployefivePayDetailDto.dateOfNextIncrement),
            });
            this.create5thPayDetails.updateValueAndValidity();
            this.fifthPayId = data.pvuEmployefivePayDetailDto.fifthPayId;
            if (this.action !== 'view') {
                this.validate5thBasicPayRange({ value: this.create5thPayDetails.controls.payScale.value }, 'current');
            }
        } else {
            this.reset5thPayForm();
        }
        if (data.pvuEmployeSixPayDetailDto != null) {
            this.create6thPayDetails.patchValue({
                empDesignationAsOn: data.pvuEmployeSixPayDetailDto.empDesignationAsOn !== '' &&
                    data.pvuEmployeSixPayDetailDto.empDesignationAsOn !== undefined &&
                    data.pvuEmployeSixPayDetailDto.empDesignationAsOn !== null &&
                    data.pvuEmployeSixPayDetailDto.empDesignationAsOn !== 0 ?
                    data.pvuEmployeSixPayDetailDto.empDesignationAsOn : '',
                empOtherDesignation: data.pvuEmployeSixPayDetailDto.empOtherDesignation !== '' &&
                    data.pvuEmployeSixPayDetailDto.empOtherDesignation !== undefined &&
                    data.pvuEmployeSixPayDetailDto.empOtherDesignation !== null &&
                    data.pvuEmployeSixPayDetailDto.empOtherDesignation !== 0 ?
                    data.pvuEmployeSixPayDetailDto.empOtherDesignation : '',
                preRevisedPayScale: data.pvuEmployeSixPayDetailDto.preRevisedPayScale !== '' &&
                    data.pvuEmployeSixPayDetailDto.preRevisedPayScale !== undefined &&
                    data.pvuEmployeSixPayDetailDto.preRevisedPayScale !== null &&
                    data.pvuEmployeSixPayDetailDto.preRevisedPayScale !== 0 ?
                    data.pvuEmployeSixPayDetailDto.preRevisedPayScale : '',
                preRevisedBasicPay: data.pvuEmployeSixPayDetailDto.preRevisedBasicPay !== '' &&
                    data.pvuEmployeSixPayDetailDto.preRevisedBasicPay !== undefined &&
                    data.pvuEmployeSixPayDetailDto.preRevisedBasicPay !== null &&
                    data.pvuEmployeSixPayDetailDto.preRevisedBasicPay !== 0 ?
                    data.pvuEmployeSixPayDetailDto.preRevisedBasicPay : '',
                revisedPayBand: data.pvuEmployeSixPayDetailDto.revisedPayBand !== '' &&
                    data.pvuEmployeSixPayDetailDto.revisedPayBand !== undefined &&
                    data.pvuEmployeSixPayDetailDto.revisedPayBand !== null &&
                    data.pvuEmployeSixPayDetailDto.revisedPayBand !== 0 ?
                    data.pvuEmployeSixPayDetailDto.revisedPayBand : '',
                gradePay: data.pvuEmployeSixPayDetailDto.gradePay !== '' &&
                    data.pvuEmployeSixPayDetailDto.gradePay !== undefined &&
                    data.pvuEmployeSixPayDetailDto.gradePay !== null &&
                    data.pvuEmployeSixPayDetailDto.gradePay !== 0 ?
                    data.pvuEmployeSixPayDetailDto.gradePay : '',
                payBandValue: data.pvuEmployeSixPayDetailDto.payBandValue !== '' &&
                    data.pvuEmployeSixPayDetailDto.payBandValue !== undefined &&
                    data.pvuEmployeSixPayDetailDto.payBandValue !== null &&
                    data.pvuEmployeSixPayDetailDto.payBandValue !== 0 ?
                    data.pvuEmployeSixPayDetailDto.payBandValue : '',
                // tslint:disable-next-line:max-line-length
                dateOfPreRevisedNextIncrement: this.employeeDataService.dateFormating(data.pvuEmployeSixPayDetailDto.dateOfPreRevisedNextIncrement),
                dateOfOption: this.employeeDataService.dateFormating(
                    data.pvuEmployeSixPayDetailDto.dateOfOption),
                dateOfStagnational: this.employeeDataService.dateFormating(
                    data.pvuEmployeSixPayDetailDto.dateOfStagnational),
                incrementAmount: data.pvuEmployeSixPayDetailDto.incrementAmount !== '' &&
                    data.pvuEmployeSixPayDetailDto.incrementAmount !== undefined &&
                    data.pvuEmployeSixPayDetailDto.incrementAmount !== null &&
                    data.pvuEmployeSixPayDetailDto.incrementAmount !== 0 ?
                    data.pvuEmployeSixPayDetailDto.incrementAmount : '',
                effDate: this.employeeDataService.dateFormating(data.pvuEmployeSixPayDetailDto.effDate),
                dateOfNextIncrement: this.employeeDataService.dateFormating(
                    data.pvuEmployeSixPayDetailDto.dateOfNextIncrement),
            });
            this.getPayGrade();
            this.create6thPayDetails.updateValueAndValidity();
            this.sixpayId = data.pvuEmployeSixPayDetailDto.sixpayId;
            this.calculateBasicPay();
            if (this.action !== 'view') {
                const payBandValueConst = {
                    value: this.create6thPayDetails.controls.revisedPayBand.value
                };
                this.validate6thPreRevisedRange(payBandValueConst, 'current');
            }
        } else {
            this.reset6thPayForm();
        }
        if (data.pvuEmployeSevenPayDetailDto != null) {
            this.create7thPayDetails.patchValue({
                payLevel: data.pvuEmployeSevenPayDetailDto.payLevel !== '' &&
                    data.pvuEmployeSevenPayDetailDto.payLevel !== undefined &&
                    data.pvuEmployeSevenPayDetailDto.payLevel !== null &&
                    data.pvuEmployeSevenPayDetailDto.payLevel !== 0 ?
                    data.pvuEmployeSevenPayDetailDto.payLevel : '',
                dateOfNextIncrement: this.employeeDataService.dateFormating(
                    data.pvuEmployeSevenPayDetailDto.dateOfNextIncrement),
                dateOfBenefitEffective: this.employeeDataService.dateFormating(
                    data.pvuEmployeSevenPayDetailDto.dateOfBenefitEffective)
            });
            this.sevenPayId = data.pvuEmployeSevenPayDetailDto.sevenPayId;
            this.get7thCPCBasicPay();
            this.create7thPayDetails.patchValue({
                cellId: data.pvuEmployeSevenPayDetailDto.cellId !== '' &&
                    data.pvuEmployeSevenPayDetailDto.cellId !== undefined &&
                    data.pvuEmployeSevenPayDetailDto.cellId !== null &&
                    data.pvuEmployeSevenPayDetailDto.cellId !== 0 ?
                    data.pvuEmployeSevenPayDetailDto.cellId : '',
                basicPay: data.pvuEmployeSevenPayDetailDto.basicPay !== '' &&
                    data.pvuEmployeSevenPayDetailDto.basicPay !== undefined &&
                    data.pvuEmployeSevenPayDetailDto.basicPay !== null &&
                    data.pvuEmployeSevenPayDetailDto.basicPay !== 0 ?
                    data.pvuEmployeSevenPayDetailDto.basicPay : '',
            });
            if (this.cellIdList && this.cellIdList.length > 0 &&
                this.create7thPayDetails.get('cellId').value && this.create7thPayDetails.get('payLevel').value) {
                this.calculate7thPay();
            } else {
                this.create7thPayDetails.get('basicPay').setValue(0);
            }
            this.create7thPayDetails.updateValueAndValidity();
        } else {
            this.reset7thPayForm();
        }

        // To disable 7th Pay commission fields for the Judiciary department Category
        if (this.isJudiciaryDeptCat) {
            this.create7thPayDetails.disable();
            this.create6thPayDetails.controls.gradePay.disable();
            this.create6thPayDetails.controls.gradePay.updateValueAndValidity();
            this.joining6thPayDetail.controls.join6thGradePay.disable();
            this.joining6thPayDetail.controls.join6thGradePay.updateValueAndValidity();
        } else {
            if (!this.ddoEditable && !this.adminEditable) {
                this.joining6thPayDetail.controls.join6thGradePay.enable();
                this.joining6thPayDetail.controls.join6thGradePay.updateValueAndValidity();
            }
        }

        this.resetJoiningPayForm();
        if (data.pvuEmployeeJoiningPayDto && data.pvuEmployeeJoiningPayDto.joiningPayId) {
            this.joiningPayId = data.pvuEmployeeJoiningPayDto.joiningPayId;
        }

        // 7th Pay commission (152)
        // 6th Pay commission (151)
        // 5th Pay commission (150)
        // 4th Pay Commission (149)
        // 3rd Pay Commission (148)
        // 2nd Pay Commission (339)
        // 1st Pay Commission (338)
        // Fix Pay Commission (341)
        if (empPayComm === 341) {
            this.isJoiningFixPay = true;
            if (data.pvuEmployeeJoiningPayDto && data.pvuEmployeeJoiningPayDto.joinPayCommId === empPayComm) {
                this.joiningFixPayDetail.patchValue({
                    joinFixPayValue: data.pvuEmployeeJoiningPayDto.payScale ?
                        Number(data.pvuEmployeeJoiningPayDto.payScale) : ''
                });
            }
        } else if (empPayComm === 338) {
            this.isJoining1stPay = true;
            if (data.pvuEmployeeJoiningPayDto && data.pvuEmployeeJoiningPayDto.joinPayCommId === empPayComm) {
                this.joining1stPayDetail.patchValue({
                    join1stScale: data.pvuEmployeeJoiningPayDto.payScale ?
                        data.pvuEmployeeJoiningPayDto.payScale : '',
                    join1stBasicPay: data.pvuEmployeeJoiningPayDto.basicPay ?
                        data.pvuEmployeeJoiningPayDto.basicPay : ''
                });
            }
        } else if (empPayComm === 339) {
            this.isJoining2ndPay = true;
            if (data.pvuEmployeeJoiningPayDto && data.pvuEmployeeJoiningPayDto.joinPayCommId === empPayComm) {
                this.joining2ndPayDetail.patchValue({
                    join2ndScale: data.pvuEmployeeJoiningPayDto.payScale ?
                        data.pvuEmployeeJoiningPayDto.payScale : '',
                    join2ndBasicPay: data.pvuEmployeeJoiningPayDto.basicPay ?
                        data.pvuEmployeeJoiningPayDto.basicPay : ''
                });
            }
        } else if (empPayComm === 148) {
            this.isJoining3rdPay = true;
            if (data.pvuEmployeeJoiningPayDto && data.pvuEmployeeJoiningPayDto.joinPayCommId === empPayComm) {
                this.joining3rdPayDetail.patchValue({
                    join3rdScale: data.pvuEmployeeJoiningPayDto.payScale ?
                        Number(data.pvuEmployeeJoiningPayDto.payScale) : '',
                    join3rdBasicPay: data.pvuEmployeeJoiningPayDto.basicPay ?
                        data.pvuEmployeeJoiningPayDto.basicPay : ''
                });
            }
        } else if (empPayComm === 149) {
            this.isJoining4thPay = true;
            if (data.pvuEmployeeJoiningPayDto && data.pvuEmployeeJoiningPayDto.joinPayCommId === empPayComm) {
                this.joining4thPayDetail.patchValue({
                    join4thScale: data.pvuEmployeeJoiningPayDto.payScale ?
                        Number(data.pvuEmployeeJoiningPayDto.payScale) : '',
                    join4thBasicPay: data.pvuEmployeeJoiningPayDto.basicPay ?
                        data.pvuEmployeeJoiningPayDto.basicPay : ''
                });
            }
        } else if (empPayComm === 150) {
            this.isJoining5thPay = true;
            if (data.pvuEmployeeJoiningPayDto && data.pvuEmployeeJoiningPayDto.joinPayCommId === empPayComm) {
                this.joining5thPayDetail.patchValue({
                    join5thScale: data.pvuEmployeeJoiningPayDto.payScale ?
                        Number(data.pvuEmployeeJoiningPayDto.payScale) : '',
                    join5thBasicPay: data.pvuEmployeeJoiningPayDto.basicPay ?
                        data.pvuEmployeeJoiningPayDto.basicPay : ''
                });
            }
        } else if (empPayComm === 151) {
            this.isJoining6thPay = true;
            if (data.pvuEmployeeJoiningPayDto && data.pvuEmployeeJoiningPayDto.joinPayCommId === empPayComm) {
                this.joining6thPayDetail.patchValue({
                    join6thPayBand: data.pvuEmployeeJoiningPayDto.payBandId ?
                        data.pvuEmployeeJoiningPayDto.payBandId : '',
                    join6thPayBandValue: data.pvuEmployeeJoiningPayDto.payBandValue ?
                        data.pvuEmployeeJoiningPayDto.payBandValue : '',
                    join6thGradePay: data.pvuEmployeeJoiningPayDto.gradePayId ?
                        data.pvuEmployeeJoiningPayDto.gradePayId : '',
                    join6thBasicPay: data.pvuEmployeeJoiningPayDto.basicPay ?
                        data.pvuEmployeeJoiningPayDto.basicPay : '',
                });

                this.getJoiningPayGrade();
                this.calJoining6thBasicPay();
                if (this.action !== 'view') {
                    this.validate6thPreRevisedRange(this.joining6thPayDetail.get('join6thPayBand'), 'join');
                }
            }
        } else if (empPayComm === 152) {
            this.isJoining7thPay = true;
            if (data.pvuEmployeeJoiningPayDto && data.pvuEmployeeJoiningPayDto.joinPayCommId === empPayComm) {
                this.joining7thPayDetail.patchValue({
                    join7thPayLevel: data.pvuEmployeeJoiningPayDto.payLevelId ?
                        data.pvuEmployeeJoiningPayDto.payLevelId : '',
                    join7thBasicPay: data.pvuEmployeeJoiningPayDto.basicPay ?
                        data.pvuEmployeeJoiningPayDto.basicPay : '',
                });
                this.get7thCellId();
                this.joining7thPayDetail.patchValue({
                    join7thCellId: data.pvuEmployeeJoiningPayDto.cellId ?
                        data.pvuEmployeeJoiningPayDto.cellId : ''
                });
                if (this.join7thCellIdList && this.join7thCellIdList.length > 0 &&
                    this.joining7thPayDetail.get('join7thCellId').value &&
                    this.joining7thPayDetail.get('join7thPayLevel').value) {
                    this.calcJoining7thBasicPay();
                } else {
                    this.joining7thPayDetail.get('join7thBasicPay').setValue(0);
                }
            }
        }
    }

    /**
     * @description To get the pay band value (entry pay) for 6th joining pay commission
     * @param deptCatId Department category ID
     * @param payBandId Pay Band ID
     * @param gradePayId Grade Pay ID
     * @param payType Pay type, it should be 'current'(for current pay details) or 'join'(for joining pay details)
     */
    getEntryPay(deptCatId, payBandId, gradePayId, payType) {
        return new Promise((entryPay) => {
            if (payType === 'current') {
                this.create6thPayDetails.controls.payBandValue.setValue('');
            } else if (payType === 'join') {
                this.joining6thPayDetail.controls.join6thPayBandValue.setValue('');
            } else {
                entryPay(false);
            }
            if (deptCatId && payBandId && gradePayId) {
                const param = {
                    'jsonArr': [
                        { 'key': 'deptCatId', 'value': deptCatId },
                        { 'key': 'payBandId', 'value': payBandId },
                        { 'key': 'gradPayId', 'value': gradePayId }
                    ]
                };
                this.pvuService.getEntryPay(param).subscribe(res => {
                    if (res && res['status'] === 200) {
                        if (res['result']) {
                            if (payType === 'current') {
                                this.create6thPayDetails.controls.payBandValue.setValue(res['result']);
                            } else if (payType === 'join') {
                                this.joining6thPayDetail.controls.join6thPayBandValue.setValue(res['result']);
                            }
                            entryPay(true);
                        } else {
                            entryPay(false);
                        }
                    } else {
                        this.toastr.error(res['message']);
                        entryPay(false);
                    }
                }, err => {
                    this.toastr.error(err);
                    entryPay(false);
                });
            } else {
                entryPay(false);
            }
        });
    }

    /**
     * @description To validate the account number
     */
    validateAccNo() {
        const bankDetail = this.bankDetailsForm.getRawValue();
        if (bankDetail.bankAccNo2) {
            if (bankDetail.bankAccNo1 !== bankDetail.bankAccNo2) {
                this.isAccNoMatch = false;
            } else {
                this.isAccNoMatch = true;
            }
        } else {
            this.isAccNoMatch = true;
        }
    }

    /**
     * @description To filter the date picker for Retirement Date
     * Allow only last day of every month
     * @param date date of retiremet date
     */
    retirementDateFilter: (date: Date | null) => boolean =
        (date: Date | null) => {
            const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            // const day = date.getDay();
            const lastDate = last.getDate();
            const datePickerLastDate = date.getDate();
            if (lastDate === datePickerLastDate) {
                return true;
            } else {
                return false;
            }
            // 0 means sunday
            // 6 means saturday
        }

    /**
     * @description To filter the date picker for Date Of Next Increment in Sixth Pay
     * Allow only 1st July of every year
     * @param date sixth pay date of next increment
     */
    sixthDateOfNextIncrFilter: (date: Date | null) => boolean =
        (date: Date | null) => {
            const first = new Date(date.getFullYear(), 6, 1); // 6 for July Month, 1 for Date 1
            const firstDate = first.getDate();
            const datePickerFirstDate = date.getDate();
            const month = first.getMonth();
            const datePickerMonth = date.getMonth();
            if (firstDate === datePickerFirstDate && month === datePickerMonth) {
                return true;
            } else {
                return false;
            }
        }

    /**
     * @descriptionTo filter the date picker for Date Of Next Increment in Seventh Pay
     * Allow only 1st January and 1st July of every year
     * @param date seventh pay date of next increment
     */
    seventhDateOfNextIncrFilter: (date: Date | null) => boolean =
        (date: Date | null) => {
            const first = new Date(date.getFullYear(), 6, 1); // 6 for July Month, 1 for Date 1
            const firstDate = first.getDate();
            const datePickerFirstDate = date.getDate();
            const datePickerMonth = date.getMonth();
            // 0 is for January and 6 is for July Months
            if (firstDate === datePickerFirstDate && (datePickerMonth === 0 || datePickerMonth === 6)) {
                return true;
            } else {
                return false;
            }
        }


    /**
     * @description To get the personal details tab data of employee
     * @param params request parameter
     * @param callFor 'reset' or null default, 'reset' for reset the employee form data
     */
    getEmployeeByID(params, callFor = null) {
        const self = this;
        this.pvuService.getEmployeeByID(params).subscribe((data) => {
            if (data && data['result'] && data['status'] === 200) {
                this.employeeDataPersonal = _.cloneDeep(data['result']);
                this.employeeDataService.employeeDTO = _.cloneDeep(data['result']);
                this.setEmployeeData(data['result'], callFor);
                if (this.action && this.action === 'edit') {
                    this.getDeptDetail({ 'id': this.empId });
                } else {
                    this.loader = false;
                }
            } else {
                this.loader = false;
                self.toastr.error(data['message']);
            }
        }, (err) => {
            this.loader = false;
            self.toastr.error(err);
        });
    }

    /**
     * @description To the employee personal details data
     * @param data Employee data
     * @param callFor 'reset' or null, 'reset' for reset the employee form validation
     */
    setEmployeeData(data, callFor) {
        if (data['pvuEmployeDto'] != null) {
            const pvuEmployeDto = data.pvuEmployeDto;
            if (pvuEmployeDto && pvuEmployeDto != null) {
                this.savedEmpStatusId = pvuEmployeDto.statusId;
                this.isSaveDraftVisible = (this.saveDraftStatusId === this.savedEmpStatusId) ? true : false;
                this.approvedStatus = (pvuEmployeDto.statusId === 327) ? true : false; // 327 Approved status id
                if (!this.approvedStatus && this.action === 'edit') {
                    this.ddoEditable = false;
                    this.adminEditable = false;
                } else if (this.action === 'edit') {
                    this.disableNonEditableForms();
                }
                this.fixProbationDateApplicable = (pvuEmployeDto.caseNo && pvuEmployeDto.caseNo !== '0' &&
                    pvuEmployeDto.caseNo !== 0);
                this.createEmployeeForm.patchValue({
                    empId: this.empId,
                    caseNo: (pvuEmployeDto.caseNo && pvuEmployeDto.caseNo !== '0' &&
                        pvuEmployeDto.caseNo !== 0) ? pvuEmployeDto.caseNo : '',
                    employeeCode: (pvuEmployeDto.employeeCode && pvuEmployeDto.employeeCode !== 0 &&
                        pvuEmployeDto.employeeCode !== '0') ? pvuEmployeDto.employeeCode : '',
                    salutation: pvuEmployeDto.salutation !== 0 ? pvuEmployeDto.salutation : '',
                    employeeName: (pvuEmployeDto.employeeName !== 0 &&
                        pvuEmployeDto.employeeName !== '0' && pvuEmployeDto.employeeName != null) ?
                        pvuEmployeDto.employeeName.toUpperCase() : '',
                    employeeMiddleName: (pvuEmployeDto.employeeMiddleName !== 0 &&
                        pvuEmployeDto.employeeMiddleName !== '0' &&
                        pvuEmployeDto.employeeMiddleName != null) ? pvuEmployeDto.employeeMiddleName.toUpperCase() : '',
                    employeeSurname: (pvuEmployeDto.employeeSurname !== 0 &&
                        pvuEmployeDto.employeeSurname !== '0' &&
                        pvuEmployeDto.employeeSurname != null) ? pvuEmployeDto.employeeSurname.toUpperCase() : '',
                    gender: (pvuEmployeDto.gender !== 0 && pvuEmployeDto.gender !== '0') ? pvuEmployeDto.gender : '',
                    nationality: (pvuEmployeDto.nationality !== 0 && pvuEmployeDto.nationality !== '0') ?
                        pvuEmployeDto.nationality : '',
                    // tslint:disable-next-line:triple-equals
                    emailID: pvuEmployeDto.emailID != 0 && pvuEmployeDto.emailID !== '' ? pvuEmployeDto.emailID : '',
                    dateOfBirth: this.employeeDataService.dateFormating(pvuEmployeDto.dateOfBirth),
                    // tslint:disable-next-line:triple-equals
                    mobileNo: pvuEmployeDto.mobileNo != 0 ? pvuEmployeDto.mobileNo : '',
                    fatherName: (pvuEmployeDto.fatherName !== 0 &&
                        pvuEmployeDto.fatherName !== '0' && pvuEmployeDto.fatherName != null) ?
                        pvuEmployeDto.fatherName.toUpperCase() : '',
                    motherName: (pvuEmployeDto.motherName !== 0 &&
                        pvuEmployeDto.motherName !== '0' && pvuEmployeDto.motherName != null) ?
                        pvuEmployeDto.motherName.toUpperCase() : '',
                    maritalStatus: (pvuEmployeDto.maritalStatus !== 0 && pvuEmployeDto.maritalStatus !== '0') ?
                        pvuEmployeDto.maritalStatus : '',
                    category: (pvuEmployeDto.category !== 0 && pvuEmployeDto.category !== '0') ?
                        pvuEmployeDto.category : '',
                    religion: (pvuEmployeDto.religion !== 0 && pvuEmployeDto.religion !== '0') ?
                        pvuEmployeDto.religion : '',
                    caste: (pvuEmployeDto.caste !== 0 && pvuEmployeDto.caste !== '0') ? pvuEmployeDto.caste : '',
                    bloodGroup: (pvuEmployeDto.bloodGroup !== 0 && pvuEmployeDto.bloodGroup !== '0') ?
                        pvuEmployeDto.bloodGroup : '',
                    phStatus: (pvuEmployeDto.phStatus !== 0 && pvuEmployeDto.phStatus !== '0') ?
                        pvuEmployeDto.phStatus : '',
                    phType: (pvuEmployeDto.phType !== 0 && pvuEmployeDto.phType !== '0') ? pvuEmployeDto.phType : '',
                    // tslint:disable-next-line:triple-equals
                    otherPhCategory: pvuEmployeDto.otherPhCategory != 0 &&
                        pvuEmployeDto.otherPhCategory != null ? pvuEmployeDto.otherPhCategory : '',
                    dateOfMedFitnessCert: this.employeeDataService.dateFormating(pvuEmployeDto.dateOfMedFitnessCert),
                    // tslint:disable-next-line:triple-equals
                    height: pvuEmployeDto.height != 0 ? pvuEmployeDto.height : '',
                    identificationMark: (pvuEmployeDto.identificationMark !== 0 &&
                        pvuEmployeDto.identificationMark !== '0') ? pvuEmployeDto.identificationMark : '',
                    // tslint:disable-next-line:triple-equals
                    electionCardNo: pvuEmployeDto.electionCardNo != 0 ? pvuEmployeDto.electionCardNo : '',
                    // tslint:disable-next-line:triple-equals
                    aadhaarNo: pvuEmployeDto.aadhaarNo != 0 ? pvuEmployeDto.aadhaarNo : '',
                    // tslint:disable-next-line:triple-equals
                    panNo: pvuEmployeDto.panNo != 0 && pvuEmployeDto.panNo != null ?
                        pvuEmployeDto.panNo.toUpperCase() : '',
                    // tslint:disable-next-line:triple-equals
                    passportNo: pvuEmployeDto.passportNo != 0 ? pvuEmployeDto.passportNo : '',
                    passportExpiryDate: this.employeeDataService.dateFormating(pvuEmployeDto.passportExpiryDate),
                    // tslint:disable-next-line:triple-equals
                    buckleNo: pvuEmployeDto.buckleNo != 0 ? pvuEmployeDto.buckleNo : '',
                });
                if (this.createEmployeeForm.controls.nationality.value === '' ||
                    this.createEmployeeForm.controls.nationality.value === null ||
                    this.createEmployeeForm.controls.nationality.value === 0) {
                    if (this.nationalityList) {
                        const getIndiaRow = this.nationalityList.filter((item) => {
                            return item['lookupInfoName'].toUpperCase() === 'Indian'.toUpperCase();
                        });
                        if (getIndiaRow && getIndiaRow[0]['lookupInfoId']) {
                            this.createEmployeeForm.patchValue({
                                'nationality': getIndiaRow[0]['lookupInfoId'],
                            });
                        }
                    }
                }
                if (pvuEmployeDto && pvuEmployeDto.employeePhoto && pvuEmployeDto.employeePhotoName) {
                    this.fileDetailsEmp = true;
                    this.fileBrowseEmp = false;
                    this.isAttachmentExists = true;
                    this.empPhotoKey = pvuEmployeDto.employeePhoto;
                    this.empPhotoName = pvuEmployeDto.employeePhotoName;
                }
                this.transStatus = pvuEmployeDto.statusId;
                if (pvuEmployeDto.dateOfBirth !== 0 && pvuEmployeDto.dateOfBirth != null) {
                    this.dateOfBirth = this.createEmployeeForm.get('dateOfBirth').value;
                    const date = new Date(this.createEmployeeForm.get('dateOfBirth').value);
                    this.minDoj = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate());
                }
                if (pvuEmployeDto.employeePhotoName) {
                    const imgNameArray = pvuEmployeDto.employeePhotoName.split('.');
                    if (pvuEmployeDto.empViewPhoto && imgNameArray) {
                        const imgType = imgNameArray[imgNameArray.length - 1];
                        this.empViewPhoto = 'data:image/' + imgType + ';base64,' + pvuEmployeDto.empViewPhoto;
                    } else {
                        this.empViewPhoto = null;
                    }
                } else {
                    this.empViewPhoto = null;
                }
            }
            const dateOfRetirement = this.departmentalDetails.controls.dateOfRetirement.value;
            if (!dateOfRetirement) {
                const costDob = this.createEmployeeForm.controls.dateOfBirth.value;
                if (costDob !== 0 && costDob !== '' && costDob != null) {
                    this.dobOnChange(new Date(costDob));
                }
            }

            this.onPhChange();
            this.onNationChange();
            this.onMaritalStatusChange();
            if (this.action === 'view') {
                this.createEmployeeForm.disable();
            }
        }
        if (data['pvuEmployeAddressDto'] != null) {
            const pvuEmployeAddressDto = data.pvuEmployeAddressDto;
            this.createEmployeeForm.patchValue({
                // tslint:disable-next-line:triple-equals
                curAddress1: pvuEmployeAddressDto.curAddress1 != 0 ?
                    pvuEmployeAddressDto.curAddress1.toUpperCase() : '',
                // tslint:disable-next-line:triple-equals
                curAddress2: (pvuEmployeAddressDto.curAddress2 != 0) ? pvuEmployeAddressDto.curAddress2 : '',
                curState: (pvuEmployeAddressDto.curState !== 0 && pvuEmployeAddressDto.curState !== '0') ?
                    pvuEmployeAddressDto.curState : '',
                curDistrict: (pvuEmployeAddressDto.curDistrict !== 0 && pvuEmployeAddressDto.curDistrict !== '0') ?
                    pvuEmployeAddressDto.curDistrict : '',
                // tslint:disable-next-line:triple-equals
                curCity: (pvuEmployeAddressDto.curCity != 0) ? pvuEmployeAddressDto.curCity : '',
                // tslint:disable-next-line:triple-equals
                curPinCode: (pvuEmployeAddressDto.curPinCode != 0) ? pvuEmployeAddressDto.curPinCode : '',
                curOfficeDist: (pvuEmployeAddressDto.curOfficeDist !== 0 &&
                    pvuEmployeAddressDto.curOfficeDist !== '0') ? pvuEmployeAddressDto.curOfficeDist : '',
                isPerAddCurAdd: (pvuEmployeAddressDto.isPerAddCurAdd === 1) ? 'sameAsCurrentAddr' : '',
                // tslint:disable-next-line:triple-equals
                perAddress1: (pvuEmployeAddressDto.perAddress1 != 0) ?
                    pvuEmployeAddressDto.perAddress1.toUpperCase() : '',
                // tslint:disable-next-line:triple-equals
                perAddress2: (pvuEmployeAddressDto.perAddress2 != 0) ? pvuEmployeAddressDto.perAddress2 : '',
                perState: (pvuEmployeAddressDto.perState !== 0 && pvuEmployeAddressDto.perState !== '0') ?
                    pvuEmployeAddressDto.perState : '',
                perDistrict: (pvuEmployeAddressDto.perDistrict !== 0 && pvuEmployeAddressDto.perDistrict !== '0') ?
                    pvuEmployeAddressDto.perDistrict : '',
                // tslint:disable-next-line:triple-equals
                perCity: (pvuEmployeAddressDto.perCity != 0) ? pvuEmployeAddressDto.perCity : '',
                // tslint:disable-next-line:triple-equals
                perPinCode: (pvuEmployeAddressDto.perPinCode != 0) ? pvuEmployeAddressDto.perPinCode : '',
                isNatAddCurAddPerAdd: (pvuEmployeAddressDto.isNatAddCurAddPerAdd === 1) ?
                    'sameAsCurrentAddr' : ((pvuEmployeAddressDto.isNatAddCurAddPerAdd === 2) ?
                        'sameAsPermanentAddr' : ''),
                // tslint:disable-next-line:triple-equals
                natAddress1: (pvuEmployeAddressDto.natAddress1 != 0) ?
                    pvuEmployeAddressDto.natAddress1.toUpperCase() : '',
                // tslint:disable-next-line:triple-equals
                natAddress2: (pvuEmployeAddressDto.natAddress2 != 0) ? pvuEmployeAddressDto.natAddress2 : '',
                natState: (pvuEmployeAddressDto.natState !== 0 && pvuEmployeAddressDto.natState !== '0') ?
                    pvuEmployeAddressDto.natState : '',
                natDistrict: (pvuEmployeAddressDto.natDistrict !== 0 && pvuEmployeAddressDto.natDistrict !== '0') ?
                    pvuEmployeAddressDto.natDistrict : '',
                // tslint:disable-next-line:triple-equals
                natCity: (pvuEmployeAddressDto.natCity != 0) ? pvuEmployeAddressDto.natCity : '',
                // tslint:disable-next-line:triple-equals
                natPinCode: (pvuEmployeAddressDto.natPinCode != 0) ? pvuEmployeAddressDto.natPinCode : '',
            });

            if (pvuEmployeAddressDto.isPerAddCurAdd === 1) {
                this.sameAsCurrentAddr = true;
            } else {
                this.sameAsCurrentAddr = false;
            }
            this.empAddressId = pvuEmployeAddressDto.empAddressId;
            this.getDistricts(pvuEmployeAddressDto.curState, 'cur');
            this.getTalukas(pvuEmployeAddressDto.curDistrict, 'cur');
            this.getDistricts(pvuEmployeAddressDto.perState, 'per');
            this.getTalukas(pvuEmployeAddressDto.perDistrict, 'per');
            this.getDistricts(pvuEmployeAddressDto.natState, 'nat');
            this.getTalukas(pvuEmployeAddressDto.natDistrict, 'nat');

            this.createEmployeeForm.patchValue({
                curTaluka: (pvuEmployeAddressDto.curTaluka !== 0 && pvuEmployeAddressDto.curTaluka !== '0') ?
                    pvuEmployeAddressDto.curTaluka : '',
                curOtherTaluka: pvuEmployeAddressDto.curOtherTaluka ? pvuEmployeAddressDto.curOtherTaluka : '',
                perTaluka: (pvuEmployeAddressDto.perTaluka !== 0 && pvuEmployeAddressDto.perTaluka !== '0') ?
                    pvuEmployeAddressDto.perTaluka : '',
                perOtherTaluka: pvuEmployeAddressDto.perOtherTaluka ? pvuEmployeAddressDto.perOtherTaluka : '',
                natTaluka: (pvuEmployeAddressDto.natTaluka !== 0 && pvuEmployeAddressDto.natTaluka !== '0') ?
                    pvuEmployeAddressDto.natTaluka : '',
                natOtherTaluka: pvuEmployeAddressDto.natOtherTaluka ? pvuEmployeAddressDto.natOtherTaluka : '',
            });

            this.getDistricts(this.gujaratId, '');
            this.getTalukas(this.departmentalDetails.controls.districtId.value, '');
            if (this.talukaList && this.talukaList.length > 0) {
                this.departmentalDetails.controls.taluka.setValidators(Validators.required);
                this.departmentalDetails.controls.taluka.updateValueAndValidity();
            } else {
                this.departmentalDetails.controls.taluka.clearValidators();
                this.departmentalDetails.controls.taluka.updateValueAndValidity();
            }
        }
        if (data['pvuEmployeNomineeDto'] != null) {
            const pvuEmployeNomineeDto = data.pvuEmployeNomineeDto;
            if (pvuEmployeNomineeDto) {
                this.relationshipCtrl = [];
                pvuEmployeNomineeDto.forEach(nomineeObj => {
                    if (nomineeObj['relationship'] === 121 || nomineeObj.relationship === 127) {
                        nomineeObj['isOtherRelation'] = true;
                    } else {
                        nomineeObj['isOtherRelation'] = false;
                    }
                    nomineeObj['nomineeShare'] = nomineeObj['nomineeShare'] ? nomineeObj['nomineeShare'] : '';
                    this.relationshipCtrl.push(new FormControl());
                });
                this.dataSourceNominee.data = pvuEmployeNomineeDto;
            }
        }
        if (callFor === 'reset') {
            ValidationService.resetValidation(this.createEmployeeForm);
        }

        if (this.approvedStatus && this.action === 'view') {
            // this.eventTab.loadJoiningPayData(this.approvedStatus);
            this.loadJoiningDetails = true;
        }
    }

    /**
     * @description To get the 6th pay designation list data
     */
    getSixthPayDesignationList() {
        this.getLstSDTData();
        this.getAdministrativeDepartment();
        this.pvuService.getSixPayDesignation().subscribe(res => {
            if (res && res['result'] && res['status'] === 200) {
                this.empDesignationAsOnList = res['result'];
                this.empDesignationList = _.cloneDeep(res['result']);
            } else {
                this.toastr.error(res['message']);
            }
        }, err => {
            this.toastr.error(err);
        });
    }

    getAdministrativeDepartment() {
        this.pvuService.getAdministrativeDepartment().subscribe((res3) => {
            if (res3 && res3['result'] && res3['status'] === 200) {
                this.adminDepartment = _.cloneDeep(res3['result']);
                this.parentAdminDeptList = _.sortBy(res3['result'], 'departmentName');
            } else {
                this.adminDepartment = [];
                this.parentAdminDeptList = [];
            }
        }, err => {
            this.adminDepartment = [];
            this.parentAdminDeptList = [];
        });
    }

    /**
    * @description To get the 6th pay getLstSDTData list data
    */
    getLstSDTData() {
        this.pvuService.getLstSDTData().subscribe(res1 => {
            if (res1 && res1['result'] && res1['status'] === 200) {
                this.curStateList = res1['result'];
                this.perStateList = res1['result'];
                this.natStateList = res1['result'];
                const ahmdDist = this.curStateList.filter((item) => {
                    return item['stateCode'] === DataConst.EMPLOYEE_CREATION.GUJARAT_STATE_CODE;
                });
                if (ahmdDist && ahmdDist[0]) {
                    this.gujaratId = ahmdDist[0]['stateId'];
                }
            } else {
                this.toastr.error(res1['message']);
            }
        }, err => {
            this.toastr.error(err);
        });
    }

    /**
     * @description To get the lookup data
     */
    getLookUpInfoData() {
        const self = this;
        this.pvuService.getLookUpInfoData().subscribe((data) => {
            if (data && data['result']) {
                // this.curStateList = data['result']['lstSDTData'];
                // this.perStateList = data['result']['lstSDTData'];
                // this.natStateList = data['result']['lstSDTData'];
                this.salutationList = data['result']['lstLuLookUp']['SalutationType'];
                this.genderList = data['result']['lstLuLookUp']['Gender_Type'];
                this.maritalStatusList = data['result']['lstLuLookUp']['Marital_Status'];
                this.categoryList = data['result']['lstLuLookUp']['Category'];
                this.bloodGroupList = data['result']['lstLuLookUp']['Blood_Type'];
                this.curOfficeDistList = data['result']['lstLuLookUp']['Distance_from_office'];
                this.marriedRelationshipList = data['result']['lstLuLookUp']['Married_Relationship'];
                this.unmerriedRelationshipList = data['result']['lstLuLookUp']['Unmarried_Relationship'];
                // this.payLevelList = data['result']['lstLuLookUp']['PayLevel'];

                // bank details master data
                this.ifscCodeList = data['result']['bankIfsc'];
                this.accountTypeList = _.cloneDeep(data['result']['lstLuLookUp']['BankAccountType']);
                if (this.accountTypeList && this.accountTypeList.length === 1
                    && this.accountTypeList[0]['lookupInfoId']) {
                    this.bankDetailsForm.controls.accountType.setValue(this.accountTypeList[0]['lookupInfoId']);
                }

                this.degreeList = _.cloneDeep(data['result']['schoolDegree']);
                this.dataSourceQualification.data[0]['courseNameList'] = _.cloneDeep(data['result']['course']);
                this.allCourseNameList = _.cloneDeep(data['result']['course']);
                if (this.allCourseNameList) {
                    this.allCourseNameList.forEach(courceElement => {
                        if (courceElement && courceElement.isCCCExempted === 1) {
                            this.cccExemptedArray.push(courceElement.id);
                        }
                    });
                }
                this.deptExamStatusList = _.cloneDeep(data['result']['lstLuLookUp']['Status']);
                this.cccExamStatusList = _.cloneDeep(data['result']['lstLuLookUp']['Status']);
                this.langExamStatusList = _.cloneDeep(data['result']['lstLuLookUp']['Status']);
                this.deptExamBodyList = _.cloneDeep(data['result']['lstLuLookUp']['Dept_Examination_Body']);
                this.cccExamNameData = _.cloneDeep(data['result']['lstLuLookUp']['CCC_Exam_Name']);
                this.cccExamNameList = _.cloneDeep(data['result']['lstLuLookUp']['CCC_Exam_Name']);
                this.npaAmountList = _.cloneDeep(data['result']['lstLuLookUp']['ConditionCheck']);
                this.isSuspendedList = _.cloneDeep(data['result']['lstLuLookUp']['ConditionCheck']);
                this.phStatusList = _.cloneDeep(data['result']['lstLuLookUp']['ConditionCheck']);
                this.empServiceContinuationList = _.cloneDeep(data['result']['lstLuLookUp']['ConditionCheck']);
                if (this.isSuspendedList) {
                    const suspData = this.isSuspendedList.filter(obj => {
                        return obj['lookupInfoName'].toLowerCase() === 'No'.toLowerCase();
                    })[0];
                    if (suspData) {
                        this.departmentalDetails.controls.suspended.setValue(suspData.lookupInfoId);
                    }
                }
                this.cccExamBodyList = data['result']['cccExamBody'];
                this.langNameList = data['result']['lstLuLookUp']['Language'];
                this.langTypeList = data['result']['lstLuLookUp']['Lang_Exam_Type'];
                // this.departmentalCategoryList = data['result']['lstLuLookUp']['DeptCategory'];
                this.departmentalCategoryList = data['result']['deptCategory'];
                // this.empDesignationList = data['result']['lstLuLookUp']['DesignationMaster'];
                // this.empDesignationList = _.cloneDeep(data['result']['designation']); // employee designation
                // this.empDesignationAsOnList = _.cloneDeep(data['result']['designation']); // 6th pay designation
                this.applicablePayCommList = _.sortBy(
                    data['result']['lstLuLookUp']['Dept_Pay_Commission'],
                    'lookupInfoName'
                );
                this.deptEmpStatusList = data['result']['lstLuLookUp']['Dept_Emp_Status'];
                // .filter((empStatus) => {
                //     return empStatus.lookupInfoId !== 155;
                // });
                this.empPayTypeData = _.cloneDeep(data['result']['lstLuLookUp']['Employee_PayType']);
                this.empPayTypeList = data['result']['lstLuLookUp']['Employee_PayType'];
                this.empClassList = data['result']['lstLuLookUp']['Dept_Class'];
                this.empTypeData = _.cloneDeep(data['result']['lstLuLookUp']['Emp_Type']);
                this.empTypeList = _.cloneDeep(data['result']['lstLuLookUp']['Emp_Type']);
                this.employementTypeList = data['result']['lstLuLookUp']['Employment_Type'];
                this.phTypeList = data['result']['lstLuLookUp']['Divyang_Sub_Category'];
                this.passingYearListData = _.cloneDeep(data['result']['yearOfPassing']);
                this.passingYearList = _.cloneDeep(data['result']['yearOfPassing']);
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                this.passingYearListData = this.passingYearListData.filter((r1) => {
                    return Number(r1.name) <= currentYear;
                });
                this.passingYearList = this.passingYearList.filter((r2) => {
                    return Number(r2.name) <= currentYear;
                });
                this.nationalityList = data['result']['lstLuLookUp']['Nationality'];
                // this.adminDepartment = _.cloneDeep(data['result']['administrativeDepartment']);
                // this.parentAdminDeptList = _.sortBy(data['result']['administrativeDepartment'], 'name');
                this.hodData = data['result']['hodDepartment'];
                this.fixPayList = data['result']['lstLuLookUp']['Fix_Pay_Value'];
                this.parentHeadDeptList = data['result']['hodDepartment'];
                this.statusData = data['result']['lstLuLookUp']['Status_id'];
                this.saveDraftStatusId = this.getStatusId('Saved as Draft');
                if (this.dataSourceQualification.data && this.dataSourceQualification.data.length) {
                    this.dataSourceQualification.data.forEach((value, key) => {
                        // tslint:disable-next-line:max-line-length
                        this.dataSourceQualification.data[key]['courseNameList'] = _.cloneDeep(data['result']['course']);
                    });
                }
                if (this.dataSourceLangExam.data && this.dataSourceLangExam.data.length) {
                    this.dataSourceLangExam.data.forEach(langObj => {
                        langObj.langNameList = this.langNameList;
                        langObj.langTypeList = this.langTypeList;
                    });
                }
                // const ahmdDist = this.curStateList.filter((item) => {
                //     return item['code'] === DataConst.EMPLOYEE_CREATION.GUJARAT_STATE_CODE;
                // });
                // if (ahmdDist && ahmdDist[0]) {
                //     this.gujaratId = ahmdDist[0]['id'];
                // }
                if (this.action && (this.action === 'edit' || this.action === 'view')) {
                    const params = { 'id': this.empId };
                    if (this.action === 'edit') {
                        this.getEmployeeByID(params);
                    } else if (this.action === 'view') {
                        this.getEmployeeByID(params);
                        this.getQualificationDetail(params);
                        this.getDeptDetail(params);
                    }
                    // this.getPayMasters();
                    // this.getPayDetails(params);
                } else {
                    this.isSaveDraftVisible = true;
                    const getIndiaRow = this.nationalityList.filter((item) => {
                        return item['lookupInfoName'].toUpperCase() === 'Indian'.toUpperCase();
                    });
                    if (getIndiaRow && getIndiaRow[0]['lookupInfoId']) {
                        this.createEmployeeForm.patchValue({
                            'nationality': getIndiaRow[0]['lookupInfoId'],
                        });
                    }
                    this.getDistricts(this.gujaratId, '');
                    this.getTalukas(this.departmentalDetails.controls.districtId.value, '');
                    if (this.talukaList && this.talukaList.length > 0) {
                        this.departmentalDetails.controls.taluka.setValidators(Validators.required);
                        this.departmentalDetails.controls.taluka.updateValueAndValidity();
                    } else {
                        this.departmentalDetails.controls.taluka.clearValidators();
                        this.departmentalDetails.controls.taluka.updateValueAndValidity();
                    }
                    this.loader = false;
                }
            }
        }, (err) => {
            this.loader = false;
            self.toastr.error(err);
        });
    }

    /**
     * @description To load the relation ship list for nominee based on the marital status
     */
    onMaritalStatusChange() {
        const maritalId = this.createEmployeeForm.controls.maritalStatus.value;
        if (maritalId) {
            if (this.maritalStatusList && this.maritalStatusList.length > 0) {
                const maritalData = this.maritalStatusList.filter(statusObj => {
                    return statusObj.lookupInfoId === maritalId;
                })[0];
                if (maritalData) {
                    if (maritalData.lookupInfoName.toLowerCase() === 'Unmarried'.toLowerCase()) {
                        this.relationshipList = _.cloneDeep(this.unmerriedRelationshipList);
                    } else {
                        this.relationshipList = _.cloneDeep(this.marriedRelationshipList);
                    }
                    if (maritalData.lookupInfoId === 93 || maritalData.lookupInfoId === 94) {
                        this.relationshipList = this.relationshipList.filter((rel) => {
                            return rel.lookupInfoId !== 114;
                        });
                    }
                    if (this.dataSourceNominee.data) {
                        this.dataSourceNominee.data.forEach(nomObj => {
                            nomObj.isOtherRelation = false;
                            nomObj.otherRelationship = '';
                            nomObj.relationship = '';
                        });
                    }
                }
            }
        }
    }

    /**
     * @description To clear the value and set the validator for given formcontrol of given form group
     * @param formName form group name
     * @param formControlName form control name
     * @param validator form control validator
     */
    clearValueSetValidator(formName: FormGroup, formControlName, validator) {
        if (validator) {
            formName.controls[formControlName].setValue('');
            formName.controls[formControlName].setValidators(validator);
            formName.controls[formControlName].updateValueAndValidity();
        }
    }

    /**
     * @description To clear value and clear validator for given formcontrol of given form group
     * @param formName form group name
     * @param formControlName form control name
     */
    clearValueClearValidator(formName: FormGroup, formControlName) {
        formName.controls[formControlName].setValue('');
        formName.controls[formControlName].clearValidators();
        formName.controls[formControlName].updateValueAndValidity();
    }

    getDeputationDistrict() {
        this.pvuService.getDistrict({ 'id': 7 }).subscribe(res1 => {
            if (res1 && res1['result'] && (res1['status'] === 200)) {
                this.deputationDistList = res1['result'];
            }
        }, err => {
        });
    }

    /**
     * @description To load the district dropdown list based on the state selection
     * @param value state ID
     * @param type address type: 'cur' for current, 'per' for permanent and 'nat' for native address
     */
    getDistricts(value, type) {
        if (value) {
            const param = {
                'id': value
            };
            this.pvuService.getDistrict(param).subscribe(res1 => {
                if (res1 && res1['result'] && (res1['status'] === 200)) {
                    if (type === 'cur') {
                        this.curDistrictList = _.cloneDeep(res1['result']);
                        if (value !== '' && this.curStateList && this.curStateList.length > 0) {
                            const selectedState = this.curStateList.filter((item) => {
                                return item['stateId'] === value;
                            });
                            if (selectedState && selectedState.length === 1) {
                                const curDistList = this.curDistrictList.filter((curDistObj) => {
                                    return (curDistObj['districtCode'] !==
                                        DataConst.EMPLOYEE_CREATION.AHMEDABAD_PAO_CODE
                                        && curDistObj['districtCode'] !==
                                        DataConst.EMPLOYEE_CREATION.GANDHINAGAR_PAO_CODE);
                                });
                                this.curDistrictList = curDistList;
                            }
                            this.curTalukaList = [];
                            if (value && selectedState && selectedState.length > 0 && selectedState[0] &&
                                selectedState[0].stateCode !== DataConst.EMPLOYEE_CREATION.GUJARAT_STATE_CODE) {
                                this.isCurStateNonGujarat = true;
                                this.clearValueClearValidator(this.createEmployeeForm, 'curTaluka');
                                let tempVal4 = '';
                                if (this.createEmployeeForm.get('curOtherTaluka')) {
                                    tempVal4 = this.createEmployeeForm.get('curOtherTaluka').value;
                                }
                                this.clearValueSetValidator(this.createEmployeeForm, 'curOtherTaluka', '');
                                if (tempVal4) {
                                    this.createEmployeeForm.patchValue({
                                        'curOtherTaluka': tempVal4
                                    });
                                }
                            } else {
                                this.isCurStateNonGujarat = false;
                                this.clearValueClearValidator(this.createEmployeeForm, 'curOtherTaluka');
                                let tempVal = null;
                                if (this.createEmployeeForm.get('curTaluka')) {
                                    tempVal = this.createEmployeeForm.get('curTaluka').value;
                                }
                                this.clearValueSetValidator(this.createEmployeeForm, 'curTaluka', Validators.required);
                                if (tempVal) {
                                    this.createEmployeeForm.patchValue({
                                        'curTaluka': tempVal
                                    });
                                }
                            }
                        }
                    } else if (type === 'per') {
                        this.perDistrictList = _.cloneDeep(res1['result']);
                        if (value !== '' && this.perStateList && this.perStateList.length > 0) {
                            const selectedState = this.perStateList.filter((item) => {
                                return item['stateId'] === value;
                            });
                            if (selectedState && selectedState.length === 1) {
                                const perDistList = this.perDistrictList.filter((perDistObj) => {
                                    return (perDistObj.districtCode !== DataConst.EMPLOYEE_CREATION.AHMEDABAD_PAO_CODE
                                        && perDistObj.districtCode !==
                                        DataConst.EMPLOYEE_CREATION.GANDHINAGAR_PAO_CODE);
                                });
                                this.perDistrictList = perDistList;
                            }
                            this.perTalukaList = [];
                            if (value && selectedState && selectedState.length > 0 && selectedState[0] &&
                                selectedState[0].stateCode !== DataConst.EMPLOYEE_CREATION.GUJARAT_STATE_CODE) {
                                this.isPerStateNonGujarat = true;
                                this.clearValueClearValidator(this.createEmployeeForm, 'perTaluka');
                                let tempVal5 = '';
                                if (this.createEmployeeForm.get('perOtherTaluka')) {
                                    tempVal5 = this.createEmployeeForm.get('perOtherTaluka').value;
                                }
                                this.clearValueSetValidator(this.createEmployeeForm, 'perOtherTaluka', '');
                                if (tempVal5) {
                                    this.createEmployeeForm.patchValue({
                                        'perOtherTaluka': tempVal5
                                    });
                                }
                            } else {
                                this.isPerStateNonGujarat = false;
                                this.clearValueClearValidator(this.createEmployeeForm, 'perOtherTaluka');
                                let tempVal1 = null;
                                if (this.createEmployeeForm.get('perTaluka')) {
                                    tempVal1 = this.createEmployeeForm.get('perTaluka').value;
                                }
                                this.clearValueSetValidator(this.createEmployeeForm, 'perTaluka', Validators.required);
                                if (tempVal1) {
                                    this.createEmployeeForm.patchValue({
                                        'perTaluka': tempVal1
                                    });
                                }
                            }
                            if (this.ddoEditable) {
                                this.createEmployeeForm.get('perState').disable();
                                this.createEmployeeForm.get('perDistrict').disable();
                                this.createEmployeeForm.get('perTaluka').disable();
                                this.createEmployeeForm.get('perAddress1').disable();
                                this.createEmployeeForm.get('perAddress2').disable();
                            }
                        }
                    } else if (type === 'nat') {
                        this.natDistrictList = _.cloneDeep(res1['result']);
                        if (value !== '' && this.natStateList && this.natStateList.length > 0) {
                            const selectedState = this.natStateList.filter((item) => {
                                return item['stateId'] === value;
                            });
                            if (selectedState && selectedState.length === 1) {
                                const natDistList = this.natDistrictList.filter((natDistObj) => {
                                    return (natDistObj.districtCode !== DataConst.EMPLOYEE_CREATION.AHMEDABAD_PAO_CODE
                                        && natDistObj.districtCode !==
                                        DataConst.EMPLOYEE_CREATION.GANDHINAGAR_PAO_CODE);
                                });
                                this.natDistrictList = natDistList;
                            }
                            this.natTalukaList = [];
                            if (value && selectedState && selectedState.length > 0 && selectedState[0] &&
                                selectedState[0].stateCode !== DataConst.EMPLOYEE_CREATION.GUJARAT_STATE_CODE) {
                                this.isNatStateNonGujarat = true;
                                this.clearValueClearValidator(this.createEmployeeForm, 'natTaluka');
                                let tempVal6 = '';
                                if (this.createEmployeeForm.get('natOtherTaluka')) {
                                    tempVal6 = this.createEmployeeForm.get('natOtherTaluka').value;
                                }
                                this.clearValueSetValidator(this.createEmployeeForm, 'natOtherTaluka', '');
                                if (tempVal6) {
                                    this.createEmployeeForm.patchValue({
                                        'perTaluka': tempVal6
                                    });
                                }
                            } else {
                                this.isNatStateNonGujarat = false;
                                this.clearValueClearValidator(this.createEmployeeForm, 'natOtherTaluka');
                                let tempVal2 = null;
                                if (this.createEmployeeForm.get('natTaluka')) {
                                    tempVal2 = this.createEmployeeForm.get('natTaluka').value;
                                }
                                this.clearValueSetValidator(this.createEmployeeForm, 'natTaluka', Validators.required);
                                if (tempVal2) {
                                    this.createEmployeeForm.patchValue({
                                        'natTaluka': tempVal2
                                    });
                                }
                            }
                            if (this.ddoEditable) {
                                this.createEmployeeForm.get('natState').disable();
                                this.createEmployeeForm.get('natDistrict').disable();
                                this.createEmployeeForm.get('natTaluka').disable();
                                this.createEmployeeForm.get('natAddress1').disable();
                                this.createEmployeeForm.get('natAddress2').disable();
                            }
                        }
                    } else if (value === this.gujaratId) {
                        // if (this.curStateList) {
                        //     const selectedState = this.curStateList.filter((item) => {
                        //         return item['stateId'] === value;
                        //     });
                        //     if (selectedState && selectedState.length === 1) {
                        this.districtList = _.cloneDeep(res1['result']);
                        //     }
                        // }
                    }
                } else {
                    this.toastr.error(res1['message']);
                    if (type === 'cur') {
                        this.curDistrictList = [];
                    } else if (type === 'per') {
                        this.perDistrictList = [];
                    } else if (type === 'nat') {
                        this.natDistrictList = [];
                    }
                }
            }, err => {
                if (type === 'cur') {
                    this.curDistrictList = [];
                } else if (type === 'per') {
                    this.perDistrictList = [];
                } else if (type === 'nat') {
                    this.natDistrictList = [];
                }
            });
        }
    }

    /**
     * @description To reset the district, taluka and city for given type of address
     * @param value state event data
     * @param type address type: 'cur' for current, 'per' for permanent and 'nat' for native address
     */
    resetDistTalCity(value, type) {
        if (type === 'cur') {
            if (value !== '' && this.curStateList && this.curStateList.length > 0) {
                this.createEmployeeForm.patchValue({
                    curDistrict: '',
                    curTaluka: '',
                    curOtherTaluka: '',
                    curCity: ''
                });
                this.createEmployeeForm.controls.curDistrict.markAsUntouched();
                this.createEmployeeForm.controls.curTaluka.markAsUntouched();
                this.createEmployeeForm.controls.curOtherTaluka.markAsUntouched();
                this.createEmployeeForm.controls.curCity.markAsUntouched();
                this.createEmployeeForm.controls.curDistrict.updateValueAndValidity();
                this.createEmployeeForm.controls.curTaluka.updateValueAndValidity();
                this.createEmployeeForm.controls.curOtherTaluka.updateValueAndValidity();
                this.createEmployeeForm.controls.curCity.updateValueAndValidity();
            }
        } else if (type === 'per') {
            if (value !== '' && this.perStateList && this.perStateList.length > 0) {
                this.createEmployeeForm.patchValue({
                    perDistrict: '',
                    perTaluka: '',
                    perOtherTaluka: '',
                    perCity: ''
                });
                this.createEmployeeForm.controls.perDistrict.markAsUntouched();
                this.createEmployeeForm.controls.perTaluka.markAsUntouched();
                this.createEmployeeForm.controls.perOtherTaluka.markAsUntouched();
                this.createEmployeeForm.controls.perCity.markAsUntouched();
                this.createEmployeeForm.controls.perDistrict.updateValueAndValidity();
                this.createEmployeeForm.controls.perTaluka.updateValueAndValidity();
                this.createEmployeeForm.controls.perOtherTaluka.updateValueAndValidity();
                this.createEmployeeForm.controls.perCity.updateValueAndValidity();
            }
        } else if (type === 'nat') {
            if (value !== '' && this.natStateList && this.natStateList.length > 0) {
                this.createEmployeeForm.patchValue({
                    natDistrict: '',
                    natTaluka: '',
                    natOtherTaluka: '',
                    natCity: ''
                });
                this.createEmployeeForm.controls.natDistrict.markAsUntouched();
                this.createEmployeeForm.controls.natTaluka.markAsUntouched();
                this.createEmployeeForm.controls.natOtherTaluka.markAsUntouched();
                this.createEmployeeForm.controls.natCity.markAsUntouched();
                this.createEmployeeForm.controls.natDistrict.updateValueAndValidity();
                this.createEmployeeForm.controls.natTaluka.updateValueAndValidity();
                this.createEmployeeForm.controls.natOtherTaluka.updateValueAndValidity();
                this.createEmployeeForm.controls.natCity.updateValueAndValidity();
            }
        }
    }

    /**
     * @description To load the taluka dropdown list based on the district selection
     * @param districtID district ID
     * @param type address type: 'cur' for current, 'per' for permanent and 'nat' for native address
     */
    getTalukas(districtID, type) {
        if (districtID) {
            const param = {
                'id': districtID
            };
            this.pvuService.getTaluka(param).subscribe((res2) => {
                if (res2 && res2['result'] && res2['status'] === 200) {
                    if (type === 'cur') {
                        if (this.curDistrictList) {
                            if (districtID !== '' && this.curDistrictList.length > 0) {
                                // const selectedDistrict = this.curDistrictList.filter((item) => {
                                //     return item['id'] === districtID;
                                // });
                                // if (selectedDistrict && selectedDistrict.length === 1) {
                                // this.curTalukaList = selectedDistrict[0]['taluka'];
                                // }
                                this.curTalukaList = _.cloneDeep(res2['result']);
                            }
                        }
                    } else if (type === 'per') {
                        if (this.perDistrictList) {
                            if (districtID !== '' && this.perDistrictList.length > 0) {
                                // const selectedDistrict = this.perDistrictList.filter((item) => {
                                //     return item['id'] === districtID;
                                // });
                                // if (selectedDistrict && selectedDistrict.length === 1) {
                                //     this.perTalukaList = selectedDistrict[0]['taluka'];
                                // }
                                this.perTalukaList = _.cloneDeep(res2['result']);
                            }
                        }
                    } else if (type === 'nat') {
                        if (this.natDistrictList) {
                            if (districtID !== '' && this.natDistrictList.length > 0) {
                                // const selectedDistrict = this.natDistrictList.filter((item) => {
                                //     return item['id'] === districtID;
                                // });
                                // if (selectedDistrict && selectedDistrict.length === 1) {
                                //     this.natTalukaList = selectedDistrict[0]['taluka'];
                                // }
                                this.natTalukaList = _.cloneDeep(res2['result']);
                            }
                        }
                    } else if (type === '') {
                        if (this.districtList) {
                            // const selectedDistrict = this.districtList.filter((item) => {
                            //     return item['id'] === districtID;
                            // });
                            // if (selectedDistrict && selectedDistrict.length === 1) {
                            //     this.talukaList = selectedDistrict[0]['taluka'];
                            // }
                            this.talukaList = _.cloneDeep(res2['result']);
                            if (this.talukaList && this.talukaList.length > 0) {
                                this.departmentalDetails.controls.taluka.setValidators(Validators.required);
                                this.departmentalDetails.controls.taluka.updateValueAndValidity();
                            } else {
                                this.departmentalDetails.controls.taluka.clearValidators();
                                this.departmentalDetails.controls.taluka.updateValueAndValidity();
                            }
                        }
                    }
                } else {
                    if (type === 'cur') {
                        this.curTalukaList = [];
                    } else if (type === 'per') {
                        this.perTalukaList = [];
                    } else if (type === 'nat') {
                        this.natTalukaList = [];
                    } else {
                        this.talukaList = [];
                    }
                }
            }, err => {
                if (type === 'cur') {
                    this.curTalukaList = [];
                } else if (type === 'per') {
                    this.perTalukaList = [];
                } else if (type === 'nat') {
                    this.natTalukaList = [];
                } else {
                    this.talukaList = [];
                }
            });
        }
    }

    /**
     * @description To reset the taluka and city for given type of address
     * @param value district event data
     * @param type address type: 'cur' for current, 'per' for permanent and 'nat' for native address
     */
    resetTalCity(value, type) {
        if (type === 'cur') {
            if (value !== '' && this.curDistrictList && this.curDistrictList.length > 0) {
                this.createEmployeeForm.patchValue({
                    curTaluka: '',
                    curOtherTaluka: '',
                    curCity: ''
                });
            }
        } else if (type === 'per') {
            if (value !== '' && this.perDistrictList && this.perDistrictList.length > 0) {
                this.createEmployeeForm.patchValue({
                    perTaluka: '',
                    perOtherTaluka: '',
                    perCity: ''
                });
            }
        } else if (type === 'nat') {
            if (value !== '' && this.natDistrictList && this.natDistrictList.length > 0) {
                this.createEmployeeForm.patchValue({
                    natTaluka: '',
                    natOtherTaluka: '',
                    natCity: ''
                });
            }
        }
    }

    /**
     * @description To get the events tab data
     */
    // getAllEmployeeEvents() {
    //     const self = this;
    //     const param = {
    //         pageIndex: 0,
    //         pageElement: 250,
    //         jsonArr: [
    //             {
    //                 key: 'in_emp_id',
    //                 value: '' + this.empId
    //             }
    //         ]
    //     };
    //     this.pvuService.getAllEvents(param).subscribe((data) => {
    //         if (data && data['result'] && data['result']['result'] && data['result']['result'].length > 0) {
    //             this.eventsClm.next(this.displayedEventsColumns);
    //             self.dataSourceEvents = new MatTableDataSource(data['result']['result']);
    //             self.dataSourceEvents.paginator = this.paginator;
    //             self.dataSourceEvents.sort = this.sort;
    //         } else {
    //             this.eventsClm.next(['noData']);
    //             this.dataSourceEvents = new MatTableDataSource(['noData']);
    //         }
    //     }, (err) => {
    //         self.toastr.error(err);
    //     });
    // }

    /**
     * @description To get the exam and qualification details tab data
     * @param params request parameter
     */
    getQualificationDetail(params) {
        const self = this;
        this.pvuService.getQualificationDetail(params).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.employeeDataExam = _.cloneDeep(res['result']);
                this.employeeDataService.qualificationDTO = _.cloneDeep(res['result']);
                this.setQualificationDetail(res['result']);
            } else {
                // self.toastr.error(res['message']);
            }
        }, (err) => {
            self.toastr.error(err);
        });
    }

    /**
     * @description To disable the fix pay form
     */
    disableFixPay() {
        this.createFixPayDetail.disable();
        this.createFixPayDetail.patchValue({
            fixPayValue: '',
            effDate: ''
        });
        ValidationService.resetValidation(this.createFixPayDetail);
    }

    /**
     * @description To set 7th pay commission form validation
     */
    set7thPayDetailsValidation() {
        this.create7thPayDetails.controls.payLevel.setValidators(Validators.required);
        this.create7thPayDetails.controls.payLevel.updateValueAndValidity();
        this.create7thPayDetails.controls.cellId.setValidators(Validators.required);
        this.create7thPayDetails.controls.cellId.updateValueAndValidity();
        this.create7thPayDetails.controls.dateOfNextIncrement.setValidators(Validators.required);
        this.create7thPayDetails.controls.dateOfNextIncrement.updateValueAndValidity();
        this.create7thPayDetails.controls.dateOfBenefitEffective.setValidators(Validators.required);
        this.create7thPayDetails.controls.dateOfBenefitEffective.updateValueAndValidity();
        this.create7thPayDetails.updateValueAndValidity();
    }

    /**
     * @description To clear 7th pay commission form validation
     */
    clear7thPayDetailsValidation() {
        this.create7thPayDetails.controls.payLevel.clearValidators();
        this.create7thPayDetails.controls.cellId.clearValidators();
        this.create7thPayDetails.controls.dateOfNextIncrement.clearValidators();
        this.create7thPayDetails.controls.dateOfBenefitEffective.clearValidators();
        this.create7thPayDetails.updateValueAndValidity();
    }

    /**
     * @description To set 6th pay commission form validation
     */
    set6thPayDetailsValidation() {
        this.create6thPayDetails.controls.revisedPayBand.setValidators(Validators.required);
        this.create6thPayDetails.controls.revisedPayBand.updateValueAndValidity();
        this.create6thPayDetails.controls.gradePay.setValidators(Validators.required);
        this.create6thPayDetails.controls.gradePay.updateValueAndValidity();
        this.create6thPayDetails.controls.payBandValue.setValidators(Validators.required);
        this.create6thPayDetails.controls.payBandValue.updateValueAndValidity();
        this.create6thPayDetails.controls.incrementAmount.setValidators(Validators.required);
        this.create6thPayDetails.controls.incrementAmount.updateValueAndValidity();
        this.create6thPayDetails.controls.effDate.setValidators(Validators.required);
        this.create6thPayDetails.controls.effDate.updateValueAndValidity();
        this.create6thPayDetails.controls.dateOfNextIncrement.setValidators(Validators.required);
        this.create6thPayDetails.controls.dateOfNextIncrement.updateValueAndValidity();
        this.create6thPayDetails.updateValueAndValidity();
    }

    /**
     * @description To clear 6th pay commission form validation
     */
    clear6thPayDetailsValidation() {
        this.create6thPayDetails.controls.revisedPayBand.clearValidators();
        this.create6thPayDetails.controls.gradePay.clearValidators();
        this.create6thPayDetails.controls.payBandValue.clearValidators();
        this.create6thPayDetails.controls.incrementAmount.clearValidators();
        this.create6thPayDetails.controls.effDate.clearValidators();
        this.create6thPayDetails.controls.dateOfNextIncrement.clearValidators();
        this.create6thPayDetails.updateValueAndValidity();
    }

    /**
     * @description To set 5th pay commission form validation
     */
    set5thPayDetailsValidation() {
        this.create5thPayDetails.controls.payScale.setValidators(Validators.required);
        this.create5thPayDetails.controls.payScale.updateValueAndValidity();
        this.create5thPayDetails.controls.basicPay.setValidators(Validators.required);
        this.create5thPayDetails.controls.basicPay.updateValueAndValidity();
        this.create5thPayDetails.controls.effectiveDate.setValidators(Validators.required);
        this.create5thPayDetails.controls.effectiveDate.updateValueAndValidity();
        this.create5thPayDetails.controls.dateOfNextIncrement.setValidators(Validators.required);
        this.create5thPayDetails.controls.dateOfNextIncrement.updateValueAndValidity();
        this.create5thPayDetails.updateValueAndValidity();
    }

    /**
     * @description To clear 5th pay commission form validation
     */
    clear5thPayDetailsValidation() {
        this.create5thPayDetails.controls.payScale.clearValidators();
        this.create5thPayDetails.controls.basicPay.clearValidators();
        this.create5thPayDetails.controls.effectiveDate.clearValidators();
        this.create5thPayDetails.controls.dateOfNextIncrement.clearValidators();
        this.create5thPayDetails.updateValueAndValidity();
    }

    /**
     * @description To set 4th pay commission form validation
     */
    set4thPayDetailsValidation() {
        this.create4thPayDetails.controls.payScale.setValidators(Validators.required);
        this.create4thPayDetails.controls.payScale.updateValueAndValidity();
        this.create4thPayDetails.controls.basicPay.setValidators(Validators.required);
        this.create4thPayDetails.controls.basicPay.updateValueAndValidity();
        this.create4thPayDetails.controls.effectiveDate.setValidators(Validators.required);
        this.create4thPayDetails.controls.effectiveDate.updateValueAndValidity();
        this.create4thPayDetails.updateValueAndValidity();
    }

    /**
     * @description To clear 4th pay commission form validation
     */
    clear4thPayDetailsValidation() {
        this.create4thPayDetails.controls.payScale.clearValidators();
        this.create4thPayDetails.controls.basicPay.clearValidators();
        this.create4thPayDetails.controls.effectiveDate.clearValidators();
        this.create4thPayDetails.updateValueAndValidity();
    }

    /**
     * @method checkForJoiningDateAndPayCommision
     * @description for checking is Paycommision is correct according to joinig date
     * @param paycommission passed paycommision id
     */
    checkForJoiningDateAndPayCommision(paycommission) {
        switch (paycommission) {
            case 152: return this.joiningDateGog >= new Date(2016, 0, 1);
            case 151: return this.joiningDateGog >= new Date(2006, 0, 1);
            case 150: return this.joiningDateGog >= new Date(1996, 0, 1);
            case 149: return this.joiningDateGog >= new Date(1986, 0, 1);
        }
        return true;
    }

    /**
     * @description To set the validation for pay details form based on the pay commission selection
     */
    payCommissionChange() {
        const empPayComm = this.departmentalDetails.get('payCommissionJoiningTime').value;
        if (this.checkForJoiningDateAndPayCommision(empPayComm)) {
            // 17 is for Judiciary Department Category ID
            if (this.departmentalDetails.get('departmentalCategory').value === 17) {
                this.isJudiciaryDeptCat = true;
                // 152 for 7th Pay Commission as Applicable Pay Commission
                if (empPayComm === 152 && this.departmentalCategoryList) {
                    const catName = this.departmentalCategoryList.filter((catObj) => {
                        return catObj['id'] === 17;
                    })[0];
                    this.toastr.error(
                        '7th Pay Commission is not applicable for ' + catName['name'] + ' Departmental Category'
                    );
                    this.departmentalDetails.controls.payCommissionJoiningTime.setValue('');
                    return;
                }
            }
            ValidationService.resetValidation(this.create4thPayDetails);
            ValidationService.resetValidation(this.create5thPayDetails);
            ValidationService.resetValidation(this.create6thPayDetails);
            ValidationService.resetValidation(this.create7thPayDetails);
            this.isJoiningFixPay = false;
            this.isJoining1stPay = false;
            this.isJoining2ndPay = false;
            this.isJoining3rdPay = false;
            this.isJoining4thPay = false;
            this.isJoining5thPay = false;
            this.isJoining6thPay = false;
            this.isJoining7thPay = false;
            this.hide4thPayCommission = false;
            this.hide5thPayCommission = false;
            this.resetJoiningPayForm();
            if (empPayComm === 152) { // 7th Pay Commission (152)
                this.create4thPayDetails.disable();
                this.create5thPayDetails.disable();
                this.create6thPayDetails.enable();
                this.create7thPayDetails.enable();
                this.disableFixPay();
                this.reset4thPayForm();
                this.reset5thPayForm();
                this.req6th = true;
                this.req7th = true;
                this.hide4thPayCommission = true;
                this.hide5thPayCommission = true;
                // this.clear4thPayDetailsValidation();
                // this.clear5thPayDetailsValidation();
                // this.set6thPayDetailsValidation();
                // this.set7thPayDetailsValidation();
                this.isJoining7thPay = true;
            } else if (empPayComm === 151) { // 6th Pay Commission (151)
                this.create4thPayDetails.disable();
                this.create5thPayDetails.disable();
                this.create6thPayDetails.enable();
                this.create7thPayDetails.enable();
                this.disableFixPay();
                this.reset4thPayForm();
                this.reset5thPayForm();
                this.hide4thPayCommission = true;
                this.hide5thPayCommission = true;
                this.req7th = false;
                this.req6th = true;
                // this.clear4thPayDetailsValidation();
                // this.clear5thPayDetailsValidation();
                // this.set6thPayDetailsValidation();
                // this.clear7thPayDetailsValidation();
                this.isJoining6thPay = true;
            } else if (empPayComm === 150) { // 5th Pay Commission (150)
                this.create4thPayDetails.disable();
                this.create5thPayDetails.enable();
                this.create6thPayDetails.enable();
                this.create7thPayDetails.enable();
                this.disableFixPay();
                this.reset4thPayForm();
                this.hide4thPayCommission = true;
                this.req6th = false;
                this.req7th = false;
                // this.clear4thPayDetailsValidation();
                // this.set5thPayDetailsValidation();
                // this.clear6thPayDetailsValidation();
                // this.clear7thPayDetailsValidation();
                this.isJoining5thPay = true;
            } else if (empPayComm === 149 || empPayComm === 148 || empPayComm === 339 || empPayComm === 338) {
                // 4th Pay Commission (149)
                // 3rd Pay Commission (148)
                // 2nd Pay Commission (339)
                // 1st Pay Commission (338)
                this.create4thPayDetails.enable();
                this.create5thPayDetails.enable();
                this.create6thPayDetails.enable();
                this.create7thPayDetails.enable();
                this.disableFixPay();
                this.setRegularPayValue(this.payData);
                // this.set4thPayDetailsValidation();
                // this.set5thPayDetailsValidation();
                // this.clear6thPayDetailsValidation();
                // this.clear7thPayDetailsValidation();
                this.isJoining4thPay = (empPayComm === 149) ? true : false;
                this.isJoining3rdPay = (empPayComm === 148) ? true : false;
                this.isJoining2ndPay = (empPayComm === 339) ? true : false;
                this.isJoining1stPay = (empPayComm === 338) ? true : false;
            } else if (empPayComm === 341) { // Fix Pay Commission
                this.create4thPayDetails.disable();
                this.create5thPayDetails.disable();
                this.create6thPayDetails.disable();
                this.create7thPayDetails.disable();
                this.clearRegularPayValue();
                this.isJoiningFixPay = true;
                // To remove the Regular Pay type option from the Employee Pay Type
                this.empPayTypeList = _.cloneDeep(this.empPayTypeData).filter(typeObj => {
                    return (typeObj.lookupInfoId === 157) ||
                        (typeObj.lookupInfoId === 158);    // Fix pay, Contractual and Reappointed
                    // Pay Type Id (157,158,159) in Employee Pay Type List
                });
                if (this.departmentalDetails.get('empPayType').value === 156) {
                    this.departmentalDetails.controls.empPayType.setValue('');
                }
                this.createFixPayDetail.enable();
                if (this.payData && this.payData.pvuEmployeFixPayDetailsDto) {
                    this.createFixPayDetail.patchValue({
                        fixPayValue: this.payData.pvuEmployeFixPayDetailsDto.fixPayValue,
                        effDate: this.employeeDataService.dateFormating(this.payData.pvuEmployeFixPayDetailsDto.effDate)
                    });
                }
            }

            if (empPayComm !== 341) {
                // To remove the Fix Pay type option from the Employee Pay Type
                this.empPayTypeList = _.cloneDeep(this.empPayTypeData).filter(typeObj => {
                    return (typeObj.lookupInfoId === 156) ||
                        (typeObj.lookupInfoId === 160) ||
                        (typeObj.lookupInfoId === 161) ||
                        (typeObj.lookupInfoId === 159);    // Regular, contracted, probitional, reappointed
                    // Pay Type Id (156,160,161, 159) in Employee Pay Type List
                });
                if (this.departmentalDetails.get('empPayType').value === 157) {
                    this.departmentalDetails.controls.empPayType.setValue('');
                }
            }
            if (this.ddoEditable || this.adminEditable) {
                this.disableNonEditableForms();
            }
            if (this.employeeDataDepartment && this.employeeDataDepartment.joinEmpPayType) {
                this.departmentalDetails.controls.empPayType.setValue(this.employeeDataDepartment.empPayType);
                if (!this.fixPayCommissionEmpPayType.includes(this.employeeDataDepartment.empPayType)) {
                    this.empPayTypeList = _.cloneDeep(this.empPayTypeData).filter(typeObj => {
                        return (typeObj.lookupInfoId === 156) ||
                            (typeObj.lookupInfoId === 160) ||
                            (typeObj.lookupInfoId === 161) ||
                            (typeObj.lookupInfoId === 159);    // Regular, contracted, probitional, reappointed
                        // Pay Type Id (156,160,161, 159) in Employee Pay Type List
                    });
                } else {
                    this.empPayTypeList = _.cloneDeep(this.empPayTypeData).filter(typeObj => {
                        return (typeObj.lookupInfoId === 157) ||
                            (typeObj.lookupInfoId === 158);    // Fix pay, Contractual and Reappointed
                        // Pay Type Id (157,158,159) in Employee Pay Type List
                    });
                }
            }
        } else {
            if (empPayComm) {
                this.toastr.error((empPayComm === 152 ? '7th' :
                    (empPayComm === 151 ? '6th' :
                        (empPayComm === 150 ? '5th' :
                            (empPayComm === 149 ? '4th' :
                                (empPayComm === 148 ? '3rd' :
                                    (empPayComm === 139 ? '2nd' :
                                        (empPayComm === 138 ? '1st' :
                                            'Selected'))))))) + pvuMessage.JOINING_DATE_ERROR);
                this.departmentalDetails.patchValue({
                    'payCommissionJoiningTime': null
                });
            }
        }
    }

    /**
     * @description TO reset the joining pay comission forms
     */
    resetJoiningPayForm() {
        this.joiningFixPayDetail.patchValue({
            joinFixPayValue: ''
        });
        this.joining1stPayDetail.patchValue({
            join1stScale: '',
            join1stBasicPay: ''
        });
        this.joining2ndPayDetail.patchValue({
            join2ndScale: '',
            join2ndBasicPay: ''
        });
        this.joining3rdPayDetail.patchValue({
            join3rdScale: '',
            join3rdBasicPay: ''
        });
        this.joining4thPayDetail.patchValue({
            join4thScale: '',
            join4thBasicPay: ''
        });
        this.joining5thPayDetail.patchValue({
            join5thScale: '',
            join5thBasicPay: ''
        });
        this.joining6thPayDetail.patchValue({
            join6thPayBand: '',
            join6thPayBandValue: '',
            join6thGradePay: '',
            join6thBasicPay: '',
        });
        this.joining7thPayDetail.patchValue({
            join7thPayLevel: '',
            join7thCellId: '',
            join7thBasicPay: '',
        });
        ValidationService.resetValidation(this.joiningFixPayDetail);
        ValidationService.resetValidation(this.joining1stPayDetail);
        ValidationService.resetValidation(this.joining2ndPayDetail);
        ValidationService.resetValidation(this.joining3rdPayDetail);
        ValidationService.resetValidation(this.joining4thPayDetail);
        ValidationService.resetValidation(this.joining5thPayDetail);
        ValidationService.resetValidation(this.joining6thPayDetail);
        ValidationService.resetValidation(this.joining7thPayDetail);
    }

    /**
     * @description To clear the regular pay comission forms
     */
    clearRegularPayValue() {
        this.create4thPayDetails.patchValue({
            payScale: '',
            basicPay: '',
            effectiveDate: ''
        });
        this.fourthPayId = 0;
        this.fourthBasicPayError = false;

        this.create5thPayDetails.patchValue({
            payScale: '',
            basicPay: '',
            effectiveDate: '',
            dateOfNextIncrement: '',
        });
        this.fifthPayId = 0;
        this.fifthBasicPayError = false;

        this.create6thPayDetails.patchValue({
            empDesignationAsOn: '',
            empOtherDesignation: '',
            preRevisedPayScale: '',
            preRevisedBasicPay: '',
            revisedPayBand: '',
            gradePay: '',
            payBandValue: '',
            dateOfPreRevisedNextIncrement: '',
            dateOfOption: '',
            dateOfStagnational: '',
            incrementAmount: '',
            effDate: '',
            dateOfNextIncrement: '',
        });
        this.getPayGrade();
        this.sixpayId = 0;
        this.sixthBasicPayError = false;
        this.calculateBasicPay();
        this.create7thPayDetails.patchValue({
            payLevel: '',
            cellId: '',
            basicPay: '',
            dateOfNextIncrement: '',
            dateOfBenefitEffective: ''
        });
        this.sevenPayId = 0;
        ValidationService.resetValidation(this.create4thPayDetails);
        ValidationService.resetValidation(this.create5thPayDetails);
        ValidationService.resetValidation(this.create6thPayDetails);
        ValidationService.resetValidation(this.create7thPayDetails);
    }

    /**
     * @description To set the regular pay details
     * @param data regular pay comission data
     */
    setRegularPayValue(data) {
        if (data && data.pvuEmployefourthPayDetailDto != null) {
            this.create4thPayDetails.patchValue({
                payScale: data.pvuEmployefourthPayDetailDto.payScale,
                basicPay: data.pvuEmployefourthPayDetailDto.basicPay,
                effectiveDate: this.employeeDataService.dateFormating(data.pvuEmployefourthPayDetailDto.effectiveDate)
            });
            this.fourthPayId = data.pvuEmployefourthPayDetailDto.fourthPayId;
        }

        if (data && data.pvuEmployefivePayDetailDto != null) {
            this.create5thPayDetails.patchValue({
                payScale: data.pvuEmployefivePayDetailDto.payScale,
                basicPay: data.pvuEmployefivePayDetailDto.basicPay,
                effectiveDate: this.employeeDataService.dateFormating(data.pvuEmployefivePayDetailDto.effectiveDate),
                dateOfNextIncrement: this.employeeDataService.dateFormating(
                    data.pvuEmployefivePayDetailDto.dateOfNextIncrement),
            });
            this.fifthPayId = data.pvuEmployefivePayDetailDto.fifthPayId;
        }
        if (data && data.pvuEmployeSixPayDetailDto != null) {
            this.create6thPayDetails.patchValue({
                empDesignationAsOn: data.pvuEmployeSixPayDetailDto.empDesignationAsOn,
                empOtherDesignation: data.pvuEmployeSixPayDetailDto.empOtherDesignation,
                preRevisedPayScale: data.pvuEmployeSixPayDetailDto.preRevisedPayScale,
                preRevisedBasicPay: data.pvuEmployeSixPayDetailDto.preRevisedBasicPay,
                revisedPayBand: data.pvuEmployeSixPayDetailDto.revisedPayBand,
                gradePay: data.pvuEmployeSixPayDetailDto.gradePay,
                payBandValue: data.pvuEmployeSixPayDetailDto.payBandValue,
                dateOfPreRevisedNextIncrement:
                    this.employeeDataService.dateFormating(
                        data.pvuEmployeSixPayDetailDto.dateOfPreRevisedNextIncrement),
                dateOfOption: this.employeeDataService.dateFormating(
                    data.pvuEmployeSixPayDetailDto.dateOfOption),
                dateOfStagnational: this.employeeDataService.dateFormating(
                    data.pvuEmployeSixPayDetailDto.dateOfStagnational),
                incrementAmount: data.pvuEmployeSixPayDetailDto.incrementAmount,
                effDate: this.employeeDataService.dateFormating(data.pvuEmployeSixPayDetailDto.effDate),
                dateOfNextIncrement: this.employeeDataService.dateFormating(
                    data.pvuEmployeSixPayDetailDto.dateOfNextIncrement),
            });
            this.getPayGrade();
            this.sixpayId = data.pvuEmployeSixPayDetailDto.sixpayId;
            this.calculateBasicPay();
            if (this.action !== 'view') {
                const payBandValueConst = {
                    value: this.create6thPayDetails.controls.revisedPayBand.value
                };
                this.validate6thPreRevisedRange(payBandValueConst, 'current');
            }
        }
        if (data && data.pvuEmployeSevenPayDetailDto != null) {
            this.create7thPayDetails.patchValue({
                payLevel: data.pvuEmployeSevenPayDetailDto.payLevel,
                cellId: data.pvuEmployeSevenPayDetailDto.cellId,
                basicPay: data.pvuEmployeSevenPayDetailDto.basicPay,
                dateOfNextIncrement: this.employeeDataService.dateFormating(
                    data.pvuEmployeSevenPayDetailDto.dateOfNextIncrement),
                dateOfBenefitEffective: this.employeeDataService.dateFormating(
                    data.pvuEmployeSevenPayDetailDto.dateOfBenefitEffective)
            });
            this.sevenPayId = data.pvuEmployeSevenPayDetailDto.sevenPayId;
        }
    }

    /**
     * @description To validate the entered basic pay is within a range or not of 3rd pay with specific increment slab
     * @param control formcontrol data
     */
    validate3rdBasicPayRange(control) {
        const payScaleValue = control.value;
        let selectedValue;
        let basic;
        let firstEle;
        let endEle;
        this.join3rdBasicPayError = false;

        basic = this.joining3rdPayDetail.get('join3rdBasicPay').value;
        if (this.join3rdScaleList) {
            selectedValue = this.join3rdScaleList.filter((item) => item['id'] === payScaleValue);
            if (selectedValue) {
                if (selectedValue[0]) {
                    if (selectedValue[0]['scaleValue']) {
                        const rangeArray = selectedValue[0]['scaleValue'].split('-');
                        firstEle = rangeArray[0];
                        endEle = rangeArray[rangeArray.length - 1];
                    }
                }
            }
        }

        if (basic !== '' && (!((+basic >= +firstEle) && (+basic <= +endEle)))) {
            this.join3rdBasicPayError = true;
        } else {
            if (!this.validateBasicPay(selectedValue[0]['scaleValue'], basic)) {
                this.join3rdBasicPayError = true;
            }
        }
    }

    /**
     * @description To validate the entered basic pay is within a range or not of 4th pay with specific increment slab
     * @param control formcontrol data
     * @param payType pay type 'current' or 'join'
     */
    validate4thBasicPayRange(control, payType) {
        const payScaleValue = control.value;
        let selectedValue;
        let basic;
        let firstEle;
        let endEle;
        this.fourthBasicPayError = false;
        this.join4thBasicPayError = false;

        if (payType === 'current') {
            basic = this.create4thPayDetails.get('basicPay').value;
        } else if (payType === 'join') {
            basic = this.joining4thPayDetail.get('join4thBasicPay').value;
        }
        if (this.fourPayScaleList) {
            selectedValue = this.fourPayScaleList.filter((item) => item['id'] === payScaleValue);
            if (selectedValue) {
                if (selectedValue[0]) {
                    if (selectedValue[0]['scaleValue']) {
                        const rangeArray = selectedValue[0]['scaleValue'].split('-');
                        firstEle = rangeArray[0];
                        endEle = rangeArray[rangeArray.length - 1];
                    }
                }
            }
        }

        if (basic !== '' && (!((+basic >= +firstEle) && (+basic <= +endEle)))) {
            if (payType === 'current') {
                this.fourthBasicPayError = true;
            } else if (payType === 'join') {
                this.join4thBasicPayError = true;
            }
        } else {
            if (!this.validateBasicPay(selectedValue[0]['scaleValue'], basic)) {
                if (payType === 'current') {
                    this.fourthBasicPayError = true;
                } else if (payType === 'join') {
                    this.join4thBasicPayError = true;
                }
            }
        }
    }

    /**
     * @description To validate the entered basic pay is within a range or not of 5th pay with specific increment slab
     * @param control formcontrol data
     * @param payType pay type 'current' or 'join'
     */
    validate5thBasicPayRange(control, payType) {
        const payScaleValue = control.value;
        let selectedValue;
        let basic;
        let firstEle;
        let endEle;
        this.fifthBasicPayError = false;
        this.join5thBasicPayError = false;

        if (payType === 'current') {
            basic = this.create5thPayDetails.get('basicPay').value;
        } else if (payType === 'join') {
            basic = this.joining5thPayDetail.get('join5thBasicPay').value;
        }
        if (this.fivePayScaleList) {
            selectedValue = this.fivePayScaleList.filter((item) => item['id'] === payScaleValue);
            if (selectedValue) {
                if (selectedValue[0]) {
                    if (selectedValue[0]['scaleValue']) {
                        const rangeArray = selectedValue[0]['scaleValue'].split('-');
                        firstEle = rangeArray[0];
                        endEle = rangeArray[rangeArray.length - 1];
                    }
                }
            }
        }

        if (basic !== '' && (!((+basic >= +firstEle) && (+basic <= +endEle)))) {
            if (payType === 'current') {
                this.fifthBasicPayError = true;
            } else if (payType === 'join') {
                this.join5thBasicPayError = true;
            }
        } else {
            if (!this.validateBasicPay(selectedValue[0]['scaleValue'], basic)) {
                if (payType === 'current') {
                    this.fifthBasicPayError = true;
                } else if (payType === 'join') {
                    this.join5thBasicPayError = true;
                }
            }
        }
    }

    /**
     * @description To validate the entered basic pay is valid or not
     *              with respect to the increment amount of selected pay scale
     * @param selectedScale selected pay scale range
     * @param basicPay Basic Pay which is entered by user
     * @returns if entered basic pay valid to increment amount then return true otherwise return false
     */
    validateBasicPay(selectedScale, basicPay): boolean {
        const scale = selectedScale.split('-');
        if (scale.length === 1) {
            return Number(basicPay) === Number(scale[0]) ? true : false;
        } else {
            if (!isNaN(basicPay)) {
                const paySelectedLenth = scale.length;
                if (paySelectedLenth > 2) {
                    for (let i = 2; i < paySelectedLenth; i += 2) {
                        if (Number(basicPay) >= Number(scale[i - 2]) && Number(basicPay) <= scale[i]) {
                            let diff = scale[i - 2] - basicPay;
                            diff /= scale[i - 1];
                            if (diff.toString().indexOf('.') !== -1) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            }
        }
    }

    /**
     * @description To validate the entered basic pay is within a range or not of 6th pay with specific increment slab
     * @param control formcontrol data
     * @param payType pay type 'current' or 'join'
     */
    validate6thPreRevisedRange(control, payType) {
        this.toggleRequireTag6th();
        const payScaleValue = control.value; // pay scale or pay band range
        let selectedValue;
        let basic;
        let firstEle;
        let endEle;
        this.sixthBasicPayError = false;
        this.join6thBasicPayError = false;

        if (payType === 'current') {
            basic = this.create6thPayDetails.get('payBandValue').value;
            if (this.sixPayGrade) {
                selectedValue = this.sixPayGrade.filter((item) => item['id'] === payScaleValue);
                if (selectedValue) {
                    if (selectedValue[0]) {
                        if (this.isJudiciaryDeptCat) {
                            if (selectedValue[0]['scaleValue']) {
                                const rangeArray = selectedValue[0]['scaleValue'].split('-');
                                firstEle = rangeArray[0];
                                endEle = rangeArray[rangeArray.length - 1];
                            }
                        } else {
                            if (selectedValue[0]['startingValue'] && selectedValue[0]['endValue']) {
                                // const rangeArray = selectedValue[0]['payBandName'].split('-');
                                firstEle = selectedValue[0]['startingValue'] ? selectedValue[0]['startingValue'] : 0;
                                endEle = selectedValue[0]['endValue'] ? selectedValue[0]['endValue'] : 0;
                            }
                        }
                    }
                }
            }
        } else if (payType === 'join') {
            basic = this.joining6thPayDetail.get('join6thPayBandValue').value;
            if (this.join6thPayBandList) {
                selectedValue = this.join6thPayBandList.filter((item) => item['id'] === payScaleValue);
                if (selectedValue) {
                    if (selectedValue[0]) {
                        if (this.isJudiciaryDeptCat) {
                            if (selectedValue[0]['scaleValue']) {
                                const rangeArray = selectedValue[0]['scaleValue'].split('-');
                                firstEle = rangeArray[0];
                                endEle = rangeArray[rangeArray.length - 1];
                            }
                        } else {
                            if (selectedValue[0]['startingValue'] && selectedValue[0]['endValue']) {
                                // const rangeArray = selectedValue[0]['payBandName'].split('-');
                                firstEle = selectedValue[0]['startingValue'] ? selectedValue[0]['startingValue'] : 0;
                                endEle = selectedValue[0]['endValue'] ? selectedValue[0]['endValue'] : 0;
                            }
                        }
                    }
                }
            }
        }

        if (this.isJudiciaryDeptCat) {
            if (basic !== '' && (!((+basic >= +firstEle) && (+basic <= +endEle)))) {
                if (payType === 'current') {
                    this.sixthBasicPayError = true;
                } else if (payType === 'join') {
                    this.join6thBasicPayError = true;
                }
            } else {
                if (!this.validateBasicPay(selectedValue[0]['scaleValue'], basic)) {
                    if (payType === 'current') {
                        this.sixthBasicPayError = true;
                    } else if (payType === 'join') {
                        this.join6thBasicPayError = true;
                    }
                }
            }
        } else {
            if (basic !== '' && (!((+basic >= +firstEle) && (+basic <= +endEle)))) {
                if (payType === 'current') {
                    this.sixthBasicPayError = true;
                } else if (payType === 'join') {
                    this.join6thBasicPayError = true;
                }
            }
        }
    }

    /**
     * @description to open the confirmation box for reset the any tab
     * @param tabNo tab index
     */
    resetTab(tabNo) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.RESET
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                switch (tabNo) {
                    case 1:
                        this.resetPerDetailTab();
                        break;
                    case 2:
                        this.resetQualificationTab();
                        break;
                    case 3:
                        this.resetDeptTab();
                        break;
                    case 4:
                        this.resetPayDetailTab();
                        break;
                }
            }
        });
    }

    /**
     * @description To reset the personal details form
     */
    resetPerDetailForm() {
        this.createEmployeeForm.patchValue({
            empId: this.empId,
            salutation: '',
            employeeName: '',
            employeeMiddleName: '',
            employeeSurname: '',
            gender: '',
            emailID: '',
            dateOfBirth: '',
            mobileNo: '',
            fatherName: '',
            motherName: '',
            maritalStatus: '',
            category: '',
            religion: '',
            caste: '',
            bloodGroup: '',
            phStatus: '',
            phType: '',
            otherPhCategory: '',
            dateOfMedFitnessCert: '',
            height: '',
            identificationMark: '',
            electionCardNo: '',
            aadhaarNo: '',
            panNo: '',
            passportNo: '',
            passportExpiryDate: '',
            buckleNo: '',
            curAddress1: '',
            curAddress2: '',
            curState: '',
            curDistrict: '',
            curTaluka: '',
            curOtherTaluka: '',
            curCity: '',
            curPinCode: '',
            curOfficeDist: '',
            perAddress1: '',
            perAddress2: '',
            perState: '',
            perDistrict: '',
            perTaluka: '',
            perOtherTaluka: '',
            perCity: '',
            perPinCode: '',
            natAddress1: '',
            natAddress2: '',
            natState: '',
            natDistrict: '',
            natTaluka: '',
            natOtherTaluka: '',
            natCity: '',
            natPinCode: ''
        });

        ValidationService.resetValidation(this.createEmployeeForm);
        const p_data = [];
        p_data.push({
            empNomineeId: '0',
            relationship: '',
            otherRelationship: '',
            nomineeName: '',
            nomineeAddress: '',
            nomineeAge: '',
            nomineeShare: '',
            photoOfNominee: '',
            genNomiForm: '',
            npsNomiForm: '',
            fileBrowseNomi: true,
            fileBrowseGenForm: true,
            fileBrowseNpsForm: true,
            isOtherRelation: false,
            nomineePhotoName: '',
            genNomineeFormName: '',
            npsNomineeFormName: '',
        });
        this.relationshipCtrl = [new FormControl()];
        this.dataSourceNominee.data = p_data;
    }

    /**
     * @description To reset personal details tab
     */
    resetPerDetailTab() {
        if (this.empId && this.empId !== 0) {
            const param = { 'id': this.empId };
            this.getEmployeeByID(param, 'reset');
        } else {
            this.resetPerDetailForm();
        }
    }

    /**
     * @description To reset exam and qualification tab
     */
    resetQualificationTab() {
        if (this.empId && this.empId !== 0) {
            const param = { 'id': this.empId };
            this.getQualificationDetail(param);
        } else {
            this.resetQualPanel();
            this.resetDeptPanel();
            this.resetCCCPanel();
            this.resetLangPanel();
        }
    }

    /**
     * @description To reset the qualification details
     */
    resetQualPanel() {
        const q_data = [];
        q_data.push({
            empQualiId: 0, degree: 0, courseName: '', passingYear: '', schoolCollege: '', universityBoard: '',
            percentageCGPA: '', remarks: ''
        });
        this.degreeCtrl = [new FormControl()];
        this.courseCtrl = [new FormControl()];
        this.passingYearCtrl = [new FormControl()];
        this.dataSourceQualification.data = q_data;
    }

    /**
     * @description To reset the deparmental exam details
     */
    resetDeptPanel() {
        // const d_data = [];
        // d_data.push({
        //     empDeptExamDetailId: 0, deptExamName: '', examBody: 0, deptHodName: 0, otherDeptHodName: '',
        //     dateOfPassing: '', examStatus: 0, examAttempts: '', remarks: ''
        // });
        // this.examBodyCtrl = [new FormControl()];
        // this.deptHodNameCtrl = [new FormControl()];
        // this.deptExamStatusCtrl = [new FormControl()];
        // this.dataSourceDeptExam.data = d_data;
        this.exemptDept = false;
        this.applicableDept = false;
        this.isDeptExamApplicable = false;
        this.isDepExemptedStatus = true;
        this.dataSourceDeptExam = new MatTableDataSource();
    }

    /**
     * @description To reset the CCC exam
     */
    resetCCCPanel() {
        // const c_data = [];
        // c_data.push({
        //     empCCCExamDetailId: 0, cccExamName: 0, cccExamNameDisable: false,
        //     cccExamNameList: _.cloneDeep(this.cccExamNameData), examBody: 0,
        //     dateOfExam: '', dateOfPassing: '', examStatus: 0, certificateNo: '', remarks: ''
        // });
        // this.cccExamNameCtrl = [new FormControl()];
        // this.cccExamBodyCtrl = [new FormControl()];
        // this.cccExamStatusCtrl = [new FormControl()];
        // this.dataSourceSpclExam.data = c_data;
        this.exemptCCC = false;
        this.applicableCCC = false;
        this.isCCCExamApplicable = false;
        this.isCccExemptedStatus = true;
        this.dataSourceSpclExam = new MatTableDataSource();
    }

    /**
     * @description To reset the language exam
     */
    resetLangPanel() {
        const l_data = [];
        l_data.push({
            empLangExamId: 0, langName: 0, examBody: '', examType: 0, dateOfPassing: '', seatNo: '',
            examStatus: 0, remarks: '', langNameList: _.cloneDeep(this.langNameList),
            langTypeList: _.cloneDeep(this.langTypeList)
        });
        this.langNameCtrl = [new FormControl()];
        this.langExamTypeCtrl = [new FormControl()];
        this.langExamStatusCtrl = [new FormControl()];
        this.dataSourceLangExam.data = l_data;
    }

    /**
     * @description To reset the departmental details tab
     */
    resetDeptTab() {
        if (this.empId && this.empId !== 0) {
            const param = { 'id': this.empId };
            this.getDeptDetail(param);
        } else {
            this.resetDeptTabForm();
        }
    }

    /**
     * @description To reset the departmental details tab form
     */
    resetDeptTabForm() {
        this.departmentalDetails.patchValue({
            dateOfJoiningGOG: '',
            payCommissionJoiningTime: '',
            dateOfRetirement: '',
            empStatus: '',
            deputationStartDate: '',
            deputationEndDate: '',
            empPayType: '',
            designationId: '',
            empClass: '',
            empType: '',
            departmentalCategory: '',
            station: '',
            taluka: '',
            parentHeadDeptId: '',
            isNPA: '',
            hodNameId: '',
            gpfNo: '',
            pranAccNo: '',
            ppoNo: '',
            deathTerminationDate: '',
            ppanNo: '',
        });
        ValidationService.resetValidation(this.departmentalDetails);
        this.previousEmployementDetails.patchValue({
            employementType: '',
            deptName: '',
            officeName: '',
            officeAdd: '',
            empDesignationHist: '',
            fromDate: '',
            toDate: '',
            lastPayDrawn: '',
            empServiceContinuation: '',
            orderNoDate: ''
        });
        ValidationService.resetValidation(this.previousEmployementDetails);
        const pre_data = [];
        this.dataSource.data = pre_data;
    }

    /**
     * @description To reset the pay details tab
     */
    resetPayDetailTab() {
        this.req6th = false;
        this.req7th = false;
        if (this.empId && this.empId !== 0) {
            const param = { 'id': this.empId };
            this.getPayDetails(param);
        } else {
            this.resetFixPayForm();
            this.reset4thPayForm();
            this.reset5thPayForm();
            this.reset6thPayForm();
            this.reset7thPayForm();
            this.resetJoiningPayForm();
            this.resetBankDetails();
            // To disable the 7th Pay Commission for the Judiciary Department Category
            if (this.isJudiciaryDeptCat) {
                this.create7thPayDetails.disable();
            }
        }
    }

    /**
     * @description To reset the fix pay comission form
     */
    resetFixPayForm() {
        this.createFixPayDetail.patchValue({
            fixPayValue: '',
            effDate: ''
        });
        ValidationService.resetValidation(this.createFixPayDetail);
    }

    /**
     * @description To reset the 4th pay comission form
     */
    reset4thPayForm() {
        this.create4thPayDetails.patchValue({
            payScale: '',
            basicPay: '',
            effectiveDate: ''
        });
        ValidationService.resetValidation(this.create4thPayDetails);
    }

    /**
     * @description To reset the 5th pay comission form
     */
    reset5thPayForm() {
        this.create5thPayDetails.patchValue({
            payScale: '',
            basicPay: '',
            effectiveDate: '',
            dateOfNextIncrement: '',
        });
        ValidationService.resetValidation(this.create5thPayDetails);
    }

    /**
     * @description To reset the 6th pay comission form
     */
    reset6thPayForm() {
        this.create6thPayDetails.patchValue({
            empDesignationAsOn: '',
            empOtherDesignation: '',
            preRevisedPayScale: '',
            preRevisedBasicPay: '',
            revisedPayBand: '',
            gradePay: '',
            payBandValue: '',
            basicPay: '',
            dateOfPreRevisedNextIncrement: '',
            dateOfOption: '',
            dateOfStagnational: '',
            incrementAmount: '',
            effDate: '',
            dateOfNextIncrement: '',
        });
        ValidationService.resetValidation(this.create6thPayDetails);
    }

    /**
     * @description To reset the 7th pay comission form
     */
    reset7thPayForm() {
        this.create7thPayDetails.patchValue({
            payLevel: '',
            cellId: '',
            basicPay: '',
            dateOfNextIncrement: '',
            dateOfBenefitEffective: ''
        });
        ValidationService.resetValidation(this.create7thPayDetails);
    }

    /**
     * @description To set the exam and qualification tab data
     * @param detail exam and qualification tab data from API response
     */
    setQualificationDetail(detail) {
        this.cccExemptedFlag = false;
        if (detail.pvuEmployeQualificationDto && detail.pvuEmployeQualificationDto.length > 0) {
            this.courseCtrl = [];
            this.degreeCtrl = [];
            this.passingYearCtrl = [];
            detail.pvuEmployeQualificationDto.forEach(obj => {
                if (obj.courseName === 251 || obj.courseName === 252 || obj.courseName === 253) {
                    obj['isOtherCourseName'] = true;
                } else {
                    obj['isOtherCourseName'] = false;
                }
                obj['courseNameList'] = _.cloneDeep(this.allCourseNameList);
                this.onChangeSchoolDegree({ value: obj.degree }, obj);
                if (this.passingYearList) {
                    const pYearData = this.passingYearList.filter(pObj => {
                        return pObj.id === obj.passingYear;
                    });
                    if (pYearData && pYearData.length !== 1) {
                        obj.passingYear = '';
                    }
                }
                this.courseCtrl.push(new FormControl());
                this.degreeCtrl.push(new FormControl());
                this.passingYearCtrl.push(new FormControl());
                if (this.cccExemptedArray && this.cccExemptedArray.length !== 0) {
                    if (this.cccExemptedArray.indexOf(obj.courseName) !== -1) {
                        this.cccExemptedFlag = true;
                    }
                }
            });
            this.dataSourceQualification = new MatTableDataSource(detail.pvuEmployeQualificationDto);
        } else {
            this.resetQualPanel();
        }

        if (detail.exemptedDeptExamFlag) {
            this.dataSourceDeptExam = new MatTableDataSource();
            if (detail.exemptedDeptExam) {
                this.dataSourceDeptExam.data[0] = detail.exemptedDeptExam;
                if (detail.exemptedDeptExam.examStatus === this.getExamStatusId('Exempted', 'dept')) {
                    this.exemptDept = true;
                    this.disableFieldDept = true;
                    this.isDeptExamApplicable = true;
                    this.isDepExemptedStatus = true;
                } else {
                    this.applicableDept = true;
                    this.disableFieldDept = false;
                    this.isDeptExamApplicable = true;
                    this.isDepExemptedStatus = false;
                }
                this.dataSourceDeptExam.data.forEach((element, index) => {
                    element.dateOfPassing = this.employeeDataService.dateFormating(element.dateOfPassing);
                    element.examAttempts = element.examAttempts ? element.examAttempts : '';
                });
                this.setExambody();
            } else {
                this.exemptDept = false;
                this.applicableDept = false;
                this.isDeptExamApplicable = false;
                this.isDepExemptedStatus = true;
            }
        } else {
            if (detail.pvuEmployeDeptExamDetailsDto && detail.pvuEmployeDeptExamDetailsDto.length > 0) {
                this.examBodyCtrl = [];
                this.deptHodNameCtrl = [];
                this.deptExamStatusCtrl = [];
                this.dataSourceDeptExam.data = detail.pvuEmployeDeptExamDetailsDto;
                // if (detail.pvuEmployeDeptExamDetailsDto[0].examStatus === this.getExamStatusId('Exempted', 'dept')) {
                //     this.exemptDept = true;
                //     this.disableFieldDept = true;
                //     this.isDeptExamApplicable = true;
                //     this.isDepExemptedStatus = true;
                // } else {
                this.applicableDept = true;
                this.disableFieldDept = false;
                this.isDeptExamApplicable = true;
                this.isDepExemptedStatus = false;
                // }
                this.dataSourceDeptExam.data.forEach((element, index) => {
                    element.dateOfPassing = this.employeeDataService.dateFormating(element.dateOfPassing);
                    element.examAttempts = element.examAttempts ? element.examAttempts : '';
                    this.examBodyCtrl.push(new FormControl());
                    this.deptHodNameCtrl.push(new FormControl());
                    this.deptExamStatusCtrl.push(new FormControl());
                });
                this.setExambody();
            } else {
                this.resetDeptPanel();
            }
        }
        if (detail.exemptedCccExamFlag) {
            if (detail.exemptedCccExam) {
                this.dataSourceSpclExam = new MatTableDataSource();
                this.dataSourceSpclExam.data[0] = detail.exemptedCccExam;
                if (detail.exemptedCccExam.examStatus === this.getExamStatusId('Exempted', 'ccc')) {
                    this.exemptCCC = true;
                    this.applicableCCC = false;
                    this.disableFieldCCC = true;
                    this.isCCCExamApplicable = true;
                    this.isCccExemptedStatus = true;
                } else {
                    this.exemptCCC = false;
                    this.applicableCCC = true;
                    this.disableFieldCCC = false;
                    this.isCCCExamApplicable = true;
                    this.isCccExemptedStatus = false;
                }
                this.dataSourceSpclExam.data.forEach((element, index) => {
                    element.dateOfExam = this.employeeDataService.dateFormating(
                        this.dataSourceSpclExam.data[index].dateOfExam);
                    element.dateOfPassing = this.employeeDataService.dateFormating(
                        this.dataSourceSpclExam.data[index].dateOfPassing);
                });
            } else {
                this.exemptCCC = false;
                this.applicableCCC = false;
                this.isCCCExamApplicable = false;
                this.isCccExemptedStatus = true;
                this.dataSourceSpclExam = new MatTableDataSource();
            }
        } else {
            if (detail.pvuEmployeCCCExamDetailDto && detail.pvuEmployeCCCExamDetailDto.length > 0) {
                this.cccExamNameCtrl = [];
                this.cccExamBodyCtrl = [];
                this.cccExamStatusCtrl = [];
                this.dataSourceSpclExam.data = detail.pvuEmployeCCCExamDetailDto;
                // if (detail.pvuEmployeCCCExamDetailDto[0].examStatus === this.getExamStatusId('Exempted', 'ccc')) {
                //     this.exemptCCC = true;
                //     this.disableFieldCCC = true;
                //     this.isCCCExamApplicable = true;
                //     this.isCccExemptedStatus = true;
                // } else {
                this.applicableCCC = true;
                this.disableFieldCCC = false;
                this.isCCCExamApplicable = true;
                this.isCccExemptedStatus = false;
                // }
                this.dataSourceSpclExam.data.forEach((element, index) => {
                    element.dateOfExam = this.employeeDataService.dateFormating(
                        this.dataSourceSpclExam.data[index].dateOfExam);
                    element.dateOfPassing = this.employeeDataService.dateFormating(
                        this.dataSourceSpclExam.data[index].dateOfPassing);
                    element.cccExamNameDisable = true;
                    element.cccExamNameList = _.cloneDeep(this.cccExamNameData);
                    this.cccExamNameCtrl.push(new FormControl());
                    this.cccExamBodyCtrl.push(new FormControl());
                    this.cccExamStatusCtrl.push(new FormControl());
                });
                if (this.dataSourceSpclExam.data.length > 0) {
                    const lastIdx = this.dataSourceSpclExam.data.length - 1;
                    this.dataSourceSpclExam.data[lastIdx].cccExamNameDisable = false;
                    const cccExamList = [];
                    this.dataSourceSpclExam.data.forEach((spclExamObj, idx) => {
                        if (lastIdx !== idx) {
                            cccExamList.push(spclExamObj.cccExamName);
                        }
                    });
                    this.dataSourceSpclExam.data[lastIdx]['cccExamNameList'] = this.cccExamNameData.filter(examObj => {
                        return cccExamList.indexOf(examObj.lookupInfoId) === -1;
                    });
                }
            } else {
                this.resetCCCPanel();
            }
        }

        if (detail.pvuEmployeLangExamDto && detail.pvuEmployeLangExamDto.length > 0) {
            this.langNameCtrl = [];
            this.langExamTypeCtrl = [];
            this.langExamStatusCtrl = [];
            this.dataSourceLangExam.data = detail.pvuEmployeLangExamDto;
            const lastIdx = this.dataSourceLangExam.data.length - 1;
            const langList = [];
            const langTypeList = [];
            this.dataSourceLangExam.data.forEach((element, index) => {
                if (index !== lastIdx) {
                    element.langNameDisable = true;
                    element.examTypeDisable = true;
                    element.langNameList = _.cloneDeep(this.langNameList);
                    element.langTypeList = _.cloneDeep(this.langTypeList);
                    langList.push(element.langName);
                    langTypeList.push(element.examType);
                }
                element.dateOfPassing = this.employeeDataService.dateFormating(
                    this.dataSourceLangExam.data[index].dateOfPassing);
                this.langNameCtrl.push(new FormControl());
                this.langExamTypeCtrl.push(new FormControl());
                this.langExamStatusCtrl.push(new FormControl());
            });
            this.dataSourceLangExam.data[lastIdx]['langNameDisable'] = false;
            this.dataSourceLangExam.data[lastIdx]['examTypeDisable'] = false;
            const languageList = this.getLanguageList(langList, this.langNameList); // to get the language name list
            const languageTypeList = this.getLanguageList(langTypeList, this.langTypeList); // to get languageType list

            this.dataSourceLangExam.data[lastIdx]['langNameList'] = languageList;
            this.dataSourceLangExam.data[lastIdx]['langTypeList'] = languageTypeList;
            this.dataSourceLangExam = new MatTableDataSource(this.dataSourceLangExam.data);
        } else {
            this.resetLangPanel();
        }
    }

    /**
     * @description to get the unselected list of language name or language type list
     * @param list list of selected language or language list
     * @param dropdownListArray master dropdown list data
     * @returns list of filtered language name or language type list
     */
    getLanguageList(list, dropdownListArray) {
        let returnList = [];
        const unique = list.filter((item, i, ar) => ar.indexOf(item) === i);
        if (unique && unique.length > 0) {
            if (unique.length === 1 && list.length === 2) {
                unique.forEach(unqObj => {
                    returnList.push(dropdownListArray.filter((langListObj) => {
                        return langListObj.lookupInfoId !== unqObj;
                    })[0]);
                });
            } else if (unique.length === 1 && list.length === 1) {
                returnList = _.cloneDeep(dropdownListArray);
            } else {
                unique.forEach(unqObj => {
                    const count = list.filter(lang => {
                        return lang === unqObj;
                    }).length;
                    if (count < 2) {
                        returnList.push(dropdownListArray.filter((langListObj) => {
                            return langListObj.lookupInfoId === unqObj;
                        })[0]);
                    }
                });
            }
        } else {
            returnList = _.cloneDeep(dropdownListArray);
        }
        return returnList;
    }

    /**
     * @description To get form control from formcontrol array
     * @param ctrlArray formcontrol array of search of mat option in data source
     * @param index selected row index
     */
    getCtrl(ctrlArray, index) {
        return ctrlArray[index];
    }

    /**
     * @description To set the validation based on the parent administrative department
     */
    getHODList() {
        const adminDept = this.departmentalDetails.get('parentHeadDeptId').value;

        if (adminDept && this.parentAdminDeptList) {
            const deptName = this.parentAdminDeptList.filter(deptObj => {
                return deptObj['departmentId'] === adminDept;
            })[0];
            if (deptName && deptName['departmentCode'] && deptName['departmentCode'] === 'DP52') {
                // Code(DP52) of Health and Family Welfare Department
                this.isNpaVisible = true;
                this.departmentalDetails.controls.isNPA.setValidators(Validators.required);
                this.departmentalDetails.controls.isNPA.updateValueAndValidity();
            } else {
                this.isNpaVisible = false;
                this.departmentalDetails.controls.isNPA.setValue('');
                this.departmentalDetails.controls.isNPA.clearValidators();
                this.departmentalDetails.controls.isNPA.updateValueAndValidity();
            }
        }
        if (adminDept && this.hodData) {
            this.parentHeadDeptList = this.hodData.filter((item) => {
                return item['parentId'] === adminDept;
            });
            if (this.parentHeadDeptList.length === 0) {
                this.isHodRequired = false;
                this.departmentalDetails.controls.hodNameId.clearValidators();
                this.departmentalDetails.controls.hodNameId.updateValueAndValidity();
            } else {
                this.isHodRequired = true;
                this.departmentalDetails.controls.hodNameId.setValidators(Validators.required);
                this.departmentalDetails.controls.hodNameId.updateValueAndValidity();
            }
            this.departmentalDetails.controls.hodNameId.setValue('');
        }
    }

    /**
     * @description To disable/enable the departmental HOD name and load the dropdown list
     */
    setExambody() {
        this.dataSourceDeptExam.data.forEach((element, index) => {
            switch (element['examBody']) {
                case 133:
                    element['deptHodNameList'] = _.cloneDeep(this.adminDepartment);
                    element['disabledeptHOD'] = false;
                    break;
                case 134:
                    element['deptHodNameList'] = _.cloneDeep(this.hodData);
                    element['disabledeptHOD'] = false;
                    break;
                case 135:
                case 136:
                    element['disabledeptHOD'] = true;
                    element['deptHodName'] = 0;
                    break;
                case 137:
                    element['disabledeptHOD'] = false;
                    element['deptHodNameList'] = '';
                    if (this.action === 'add') {
                        element['otherDeptHodName'] = '';
                    }
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * @description To get the departmental detils data
     * @param params request parameter
     */
    getDeptDetail(params) {
        const self = this;
        let detail;
        this.pvuService.getDepartmentalDetail(params).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.loader = false;
                this.employeeDataService.departmentDTO = _.cloneDeep(res['result']);
                detail = res['result'].pvuEmployeDepartmentDto;
                this.employeeDataDepartment = _.cloneDeep(res['result'].pvuEmployeDepartmentDto);
                if (detail !== null) {
                    this.departmentId = detail.departmentId;
                    this.departmentCategoryIdSelected = detail.departmentalCategory;
                    if (this.action === 'view') {
                        this.getPayMasters();
                    }
                    if (detail['suspended']) {
                        if (this.isSuspendedList) {
                            const suspData = this.isSuspendedList.filter(obj => {
                                return obj['lookupInfoName'].toLowerCase() === 'Yes'.toLowerCase();
                            })[0];
                            if (suspData) {
                                this.departmentalDetails.controls.suspended.setValue(suspData.lookupInfoId);
                            }
                        }
                    } else {
                        if (this.isSuspendedList) {
                            const suspData = this.isSuspendedList.filter(obj => {
                                return obj['lookupInfoName'].toLowerCase() === 'No'.toLowerCase();
                            })[0];
                            if (suspData) {
                                this.departmentalDetails.controls.suspended.setValue(suspData.lookupInfoId);
                            }
                        }
                    }
                    this.setDeptDetail(detail);
                    if (res['result'].pvuEmployeHistoryDto && res['result'].pvuEmployeHistoryDto.length === 0) {
                        this.prevEmpHistory = false;
                        this.isEmployeementApplicable = false;
                    } else {
                        this.prevEmpHistory = true;
                        this.isEmployeementApplicable = true;
                        this.dataSource.data = res['result'].pvuEmployeHistoryDto;
                        this.dataSource.data.forEach(histObj => {
                            if (this.employementTypeList) {
                                const emplType = this.employementTypeList.filter(emplObj => {
                                    return emplObj.lookupInfoId === histObj.employementType;
                                })[0];
                                if (emplType) {
                                    histObj.employementTypeName = emplType.lookupInfoName;
                                }
                            }

                            if (this.empServiceContinuationList) {
                                const isService = this.empServiceContinuationList.filter(servObj => {
                                    return servObj.lookupInfoId === histObj.empServiceContinuation;
                                })[0];
                                if (isService) {
                                    histObj.empServiceContinuationName = isService.lookupInfoName;
                                }
                            }
                        });
                        this.listshow = true;
                    }
                } else {
                    const costDob = this.createEmployeeForm.controls.dateOfBirth.value;
                    if (costDob !== 0 && costDob !== '' && costDob != null) {
                        this.dobOnChange(new Date(costDob));
                    }
                    this.prevEmpHistory = false;
                    this.isEmployeementApplicable = false;
                    this.resetDeptTabForm();
                }
            } else {
                this.loader = false;
            }
        }, (err) => {
            this.loader = false;
            self.toastr.error(err);
        });
    }

    /**
     * @description To set the departmental details tab data
     * @param detail tab data from API response
     */
    setDeptDetail(detail) {
        this.departmentalDetails.patchValue({
            'dateOfJoiningGOG': this.employeeDataService.dateFormating(detail.dateOfJoiningGOG),
            'fixPayDate': this.employeeDataService.dateFormating(detail.fixPayDate),
            'payCommissionJoiningTime': detail.payCommissionJoiningTime !== 0 ? detail.payCommissionJoiningTime : '',
            'empStatus': detail.empStatus !== 0 && detail.empStatus !== '' && detail.empStatus != null ?
                detail.empStatus : '',
            'empPayType': detail.empPayType !== 0 && detail.empPayType !== '' && detail.empPayType != null ?
                detail.empPayType : '',
            'designationId': detail.designationId !== 0 && detail.designationId !== '' && detail.designationId != null ?
                detail.designationId : '',
            'districtId': detail.districtId !== 0 && detail.districtId !== '' && detail.districtId != null ?
                detail.districtId : '',
            'cardexNo': detail.cardexNo,
            'presentOffice': this.currentPost['officeDetail']['officeName'],
            'subOffice': detail.subOffice !== 0 && detail.subOffice !== '' && detail.subOffice != null ?
                detail.subOffice : '',
            'ddoCode': detail.ddoCode,
            'officeAddNum': this.getOfficeAdd(),
            'empClass': detail.empClass !== 0 && detail.empClass !== '' && detail.empClass != null ?
                detail.empClass : '',
            'empType': detail.empType !== 0 && detail.empType !== '' && detail.empType != null ?
                detail.empType : '',
            'departmentalCategory': detail.departmentalCategory !== 0 && detail.departmentalCategory !== '' &&
                detail.departmentalCategory != null ? detail.departmentalCategory : '',
            'station': detail.station,
            'taluka': detail.taluka !== 0 && detail.taluka !== '' && detail.taluka != null ?
                detail.taluka : '',
            'parentHeadDeptId': detail.parentHeadDeptId !== 0 && detail.parentHeadDeptId !== '' &&
                detail.parentHeadDeptId != null ? detail.parentHeadDeptId : '',
            'isNPA': detail.isNPA !== 0 && detail.isNPA !== '' && detail.isNPA != null ?
                detail.isNPA : '',
            'hodNameId': detail.hodNameId !== 0 && detail.hodNameId !== '' && detail.hodNameId != null ?
                detail.hodNameId : '',
            'gpfNo': detail.gpfNo !== 0 && detail.gpfNo !== '0' && detail.gpfNo != null ?
                detail.gpfNo : '',
            'pranAccNo': detail.pranAccNo !== 0 && detail.pranAccNo !== '0' && detail.pranAccNo != null ?
                detail.pranAccNo : '',
            'ppoNo': detail.ppoNo !== 0 && detail.ppoNo !== '0' && detail.ppoNo != null ?
                detail.ppoNo : '',
            'dateOfRetirement': this.employeeDataService.dateFormating(detail.dateOfRetirement),
            'deathTerminationDate': this.employeeDataService.dateFormating(detail.deathTerminationDate),
            'ppanNo': detail.ppanNo !== 0 && detail.ppanNo !== '0' && detail.ppanNo != null ?
                detail.ppanNo : '',
            'deputation': detail.deputation ? detail.deputation : 1,
            'deputDistrictId': detail.deputDistrictId ? detail.deputDistrictId : null,
            'deputDdoCode': detail.deputDdoCode ? detail.deputDdoCode : '',
            'deputCardexNo': detail.deputCardexNo ? detail.deputCardexNo : '',
            'deputOfficeId': detail.deputOfficeId ? detail.deputOfficeId : '',
            'deputOfficeName': detail.deputOfficeName ? detail.deputOfficeName : ''
        });
        this.loadPresentOffice();
        this.getDeputationDistrict();
        this.onDeputationChange({ value: detail.deputation });
        if (this.departmentalDetails.controls.dateOfJoiningGOG.value) {
            const data = new Date(this.departmentalDetails.controls.dateOfJoiningGOG.value);
            this.joiningDateGog = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        }
        const doj = {};
        doj['target'] = { 'value': new Date(this.departmentalDetails.controls.dateOfJoiningGOG.value) };
        const retire = this.departmentalDetails.controls.dateOfRetirement.value;
        if (!retire) {
            const costDob = this.createEmployeeForm.controls.dateOfBirth.value;
            if (costDob !== 0 && costDob !== '' && costDob != null) {
                this.dobOnChange(new Date(costDob));
            } else {
                this.onEmpClassChange();
            }
        } else {
            this.onEmpClassChange();
        }

        this.onDOJSelect(doj);
        this.payCommissionChange();
        this.getHODList();
        this.departmentalDetails.patchValue({
            'empType': detail.empType !== 0 && detail.empType !== '' && detail.empType != null ? detail.empType : '',
            'isNPA': detail.isNPA !== 0 && detail.isNPA !== '' && detail.isNPA != null ? detail.isNPA : '',
            'hodNameId': detail.hodNameId !== 0 && detail.hodNameId !== '' && detail.hodNameId != null ?
                detail.hodNameId : '',
        });
        this.setDefaultEmpType();
        // && detail.deputation === 2
        if ((detail.deputationStartDate || detail.deputationEndDate)) {
            this.isDeputation = true;
            this.departmentalDetails.patchValue({
                'deputationStartDate': this.employeeDataService.dateFormating(detail.deputationStartDate),
                'deputationEndDate': this.employeeDataService.dateFormating(detail.deputationEndDate)
            });
        }
    }

    /**
     * @description To ser the min effective date for 4th, 5th, 6th and 7th pay comission
     */
    setMinEffectiveDate() {
        if (this.joiningDateGog > this.minDate4th) {
            this.minDate4th = new Date(this.joiningDateGog);
        } else {
            this.minDate4th = new Date(1986, 0, 1);
        }
        if (this.joiningDateGog > this.minDate5th) {
            this.minDate5th = new Date(this.joiningDateGog);
            // tslint:disable-next-line:max-line-length
            this.min5thNextIncDate = new Date(this.joiningDateGog.getFullYear() + 1, this.joiningDateGog.getMonth(), 1);
        } else {
            this.minDate5th = new Date(1996, 0, 1);
            this.min5thNextIncDate = new Date(1996, 0, 1);
        }
        if (this.joiningDateGog > this.minDate6th) {
            this.minDate6th = new Date(this.joiningDateGog);
        } else {
            this.minDate6th = new Date(2006, 0, 1);
        }
        if (this.joiningDateGog > this.minDate7th) {
            this.minDate7th = new Date(this.joiningDateGog);
        } else {
            this.minDate7th = new Date(2016, 0, 1);
        }
    }

    /**
     * @description To set the 5th pay date of next increment based on the 5th pay Effective Date selection
     * @param event datepicker event data
     */
    fifthEffectiveDateChange(event) {
        if (event.value) {
            this.min5thNextIncDate = new Date(event.value.getFullYear() + 1, event.value.getMonth(), 1);
            // tslint:disable-next-line:max-line-length
            this.create5thPayDetails.get('dateOfNextIncrement').setValue(new Date(event.value.getFullYear() + 1, event.value.getMonth(), 1));
        }
    }

    /**
     * @description To prepare the office address formate
     */
    getOfficeAdd() {
        const userOffice = this.storageService.get('userOffice');
        let str = '';
        if (userOffice.addrLine1 && userOffice.addrLine1.trim()) {
            str = userOffice.addrLine1.trim();
        }
        if (userOffice.addrLine2 && userOffice.addrLine2.trim()) {
            if (str) {
                if (!(str[str.length - 1] === ',')) {
                    str += ',';
                }
                str += ' ' + userOffice.addrLine2.trim();
            } else {
                str += userOffice.addrLine2;
            }
        }
        if (userOffice.phoneNo && userOffice.phoneNo.trim()) {
            if (str) {
                if (!(str[str.length - 1] === ',')) {
                    str += ',';
                }
                str += ' ' + userOffice.phoneNo.trim();
            } else {
                str += userOffice.phoneNo.trim();
            }
        }
        if (userOffice.mobileNo && userOffice.mobileNo.trim()) {
            if (str) {
                if (!(str[str.length - 1] === ',')) {
                    str += ',';
                }
                str += ' ' + userOffice.mobileNo.trim();
            } else {
                str += userOffice.mobileNo.trim();
            }
        }
        return str;
    }

    /**
     * @description To create the personal details, all pay commission,
     * department details and previous employement history forms
     */
    createForm() {
        this.createEmployeeForm = this.fb.group({
            officeName: [''],
            empId: [0],
            caseNo: [''],
            employeeCode: [''],
            salutation: [''],
            employeeName: ['', [Validators.required, ValidationService.charWithSpaceValidationName]],
            employeeMiddleName: ['', ValidationService.charWithSpaceValidationName],
            employeeSurname: ['', ValidationService.charWithSpaceValidationName],
            gender: ['', Validators.required],
            nationality: ['', Validators.required],
            // emailID: ['', [ValidationService.emailValidator]],
            emailID: ['', [
                Validators.compose([
                    Validators.pattern(
                        '(?!.*?\\.\\.)(?!.*?\\-\\-)[a-zA-Z0-9.\\-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'
                    )
                ])
            ]],
            dateOfBirth: ['', Validators.required],
            mobileNo: ['', [Validators.required, ValidationService.mobileNoValidator]],
            fatherName: ['', [Validators.required, ValidationService.charWithSpaceValidationFatherName]],
            motherName: ['', [Validators.required, ValidationService.charWithSpaceValidationName]],
            maritalStatus: ['', Validators.required],
            category: ['', Validators.required],
            religion: ['', Validators.required],
            caste: [''],
            bloodGroup: [''],
            phStatus: ['', Validators.required],
            phType: [],
            otherPhCategory: [''],
            dateOfMedFitnessCert: [''],
            height: ['', [Validators.required, ValidationService.minHeightValidation]],
            identificationMark: ['', Validators.required],
            electionCardNo: ['', ValidationService.electionNoValidation],
            aadhaarNo: ['', ValidationService.aadharNoValidation],
            panNo: ['', [Validators.required, ValidationService.panCardValidation]],
            passportNo: ['', ValidationService.passportValidation],
            passportExpiryDate: [''],
            buckleNo: [''],
            curAddress1: ['', Validators.required],
            curAddress2: [''],
            curState: ['', Validators.required],
            curDistrict: ['', Validators.required],
            curTaluka: ['', Validators.required],
            curOtherTaluka: [''],
            curCity: ['', Validators.required],
            curPinCode: ['', [Validators.required, ValidationService.pincodeValidation]],
            curOfficeDist: ['', Validators.required],
            perAddress1: ['', Validators.required],
            perAddress2: [''],
            perState: ['', Validators.required],
            perDistrict: ['', Validators.required],
            perTaluka: ['', Validators.required],
            perOtherTaluka: [''],
            perCity: ['', Validators.required],
            perPinCode: ['', [Validators.required, ValidationService.pincodeValidation]],
            natAddress1: ['', Validators.required],
            natAddress2: [''],
            natState: ['', Validators.required],
            natDistrict: ['', Validators.required],
            natTaluka: ['', Validators.required],
            natOtherTaluka: [''],
            natCity: ['', Validators.required],
            natPinCode: ['', [Validators.required, ValidationService.pincodeValidation]],
            isNatAddCurAddPerAdd: [''],
            isPerAddCurAdd: ['']
        });

        this.createFixPayDetail = this.fb.group({
            fixPayValue: ['', Validators.required],
            effDate: ['', Validators.required]
        });

        this.create4thPayDetails = this.fb.group({
            payScale: ['', Validators.required],
            basicPay: ['', Validators.required],
            effectiveDate: ['', Validators.required]
        });

        this.create5thPayDetails = this.fb.group({
            payScale: ['', Validators.required],
            basicPay: ['', Validators.required],
            effectiveDate: ['', Validators.required],
            dateOfNextIncrement: ['', Validators.required],
        });

        this.create6thPayDetails = this.fb.group({
            empDesignationAsOn: [''],
            empOtherDesignation: [''],
            preRevisedPayScale: [''],
            preRevisedBasicPay: [''],
            revisedPayBand: ['', Validators.required],
            gradePay: ['', Validators.required],
            payBandValue: ['', Validators.required],
            basicPay: [],
            dateOfPreRevisedNextIncrement: [''],
            dateOfOption: [''],
            dateOfStagnational: [''],
            incrementAmount: ['', Validators.required],
            effDate: ['', Validators.required],
            dateOfNextIncrement: ['', Validators.required],
        });

        this.create7thPayDetails = this.fb.group({
            payLevel: ['', Validators.required],
            cellId: ['', Validators.required],
            basicPay: [''],
            dateOfNextIncrement: ['', Validators.required],
            dateOfBenefitEffective: ['', Validators.required]
        });
        this.create6thPayDetails.patchValue({
            preRevisedBasicPay: ''
        });
        this.departmentalDetails = this.fb.group({
            dateOfJoiningGOG: new FormControl('', Validators.required),
            fixPayDate: new FormControl(''),
            payCommissionJoiningTime: new FormControl('', Validators.required),
            empStatus: new FormControl('', Validators.required),
            deputationStartDate: new FormControl(),
            deputationEndDate: new FormControl(),
            suspended: new FormControl(''),
            deputation: new FormControl(1),
            deputDistrictId: new FormControl(null),
            deputDdoCode: new FormControl(''),
            deputCardexNo: new FormControl(''),
            deputOfficeId: new FormControl(''),
            deputOfficeName: new FormControl(''),
            empPayType: new FormControl('', Validators.required),
            designationId: new FormControl('', Validators.required),
            districtId: new FormControl('', Validators.required),
            cardexNo: new FormControl(''),
            presentOffice: new FormControl(''),
            subOffice: new FormControl(''),
            ddoCode: new FormControl(),
            officeAddNum: new FormControl(''),
            empClass: new FormControl('', Validators.required),
            empType: new FormControl('', Validators.required),
            departmentalCategory: new FormControl('', Validators.required),
            station: new FormControl('', Validators.required),
            taluka: new FormControl('', Validators.required),
            parentHeadDeptId: new FormControl('', Validators.required),
            isNPA: new FormControl(''),
            hodNameId: new FormControl('', Validators.required),
            gpfNo: new FormControl(''),
            pranAccNo: new FormControl(''),
            ppoNo: new FormControl(''),
            dateOfRetirement: new FormControl('', Validators.required),
            deathTerminationDate: new FormControl(''),
            ppanNo: new FormControl(''),
        });
        this.previousEmployementDetails = this.fb.group({
            employementType: ['', Validators.required],
            deptName: ['', Validators.required],
            officeName: ['', Validators.required],
            officeAdd: ['', Validators.required],
            empDesignationHist: ['', Validators.required],
            fromDate: ['', Validators.required],
            toDate: ['', Validators.required],
            lastPayDrawn: ['', Validators.required],
            empServiceContinuation: ['', Validators.required],
            orderNoDate: [''],
        });
    }

    /**
     * @description To set max date for date of exam
     * @param item selected row data
     */
    loadMaxDateOfExam(item) {
        if (item.dateOfPassing !== null && item.dateOfPassing !== 0 && item.dateOfPassing !== '') {
            return item.dateOfPassing;
        } else {
            return this.maxDOJ;
        }
    }

    /**
     * @description To patch the office details in departmental details
     */
    patchDepartmentDetail() {
        this.createEmployeeForm.patchValue({
            'officeName': this.currentPost['officeDetail']['officeName']
        });
        this.departmentalDetails.patchValue({
            'districtId': this.currentPost['officeDetail']['districtId'],
            'cardexNo': this.currentPost['officeDetail']['cardexno'],
            'ddoCode': this.currentPost['officeDetail']['ddoNo'],
            'presentOffice': this.currentPost['officeDetail']['officeName'],
            'officeAddNum': this.getOfficeAdd()
        });
        this.presentOfficeId = this.currentPost['officeDetail']['officeId'];
    }

    /**
     * @description To display the other PH category
     */
    showOtherPHCategory() {
        const PHCategory = this.createEmployeeForm.get('phType').value;
        if (PHCategory === 113) {
            this.createEmployeeForm.controls.otherPhCategory.setValidators([Validators.required]);
            this.createEmployeeForm.controls.otherPhCategory.updateValueAndValidity();
            this.isPhLevelRequired = true;
            return true;
        }
        this.isPhLevelRequired = false;
        this.createEmployeeForm.controls.otherPhCategory.setValidators(null);
        this.createEmployeeForm.controls.otherPhCategory.updateValueAndValidity();
        return false;
    }

    /**
     * @description To set validation based on the DOB change
     */
    dobOnChange(data) {
        let dateObj;
        if (data.value) {
            dateObj = data.value;
        } else {
            dateObj = data;
        }

        if (!(new Date(dateObj.getFullYear() + 18, dateObj.getMonth(),
            dateObj.getDate()) <= new Date())) {
            this.toastr.error(pvuMessage.AGE_ERROR);
            this.createEmployeeForm.patchValue({
                dateOfBirth: ''
            });
        }
        this.dateOfBirth = this.createEmployeeForm.get('dateOfBirth').value;
        let val = _.cloneDeep(this.createEmployeeForm.get('dateOfBirth').value);
        val = this.convertDateOnly(val);
        const dateArr = val.split('-');
        if (dateArr && dateArr.length === 3) {
            this.formattedDateOfBirth = new Date(
                dateArr[0], dateArr[1], dateArr[2]
            );
        }
        this.departmentalDetails.controls.dateOfRetirement.patchValue(
            new Date(dateObj.getFullYear() + 60, dateObj.getMonth() + 1, 0)
        );
        this.onEmpClassChange();
        this.minDoj = new Date(dateObj.getFullYear() + 18, dateObj.getMonth(), dateObj.getDate());

        if (this.passingYearListData) {
            this.passingYearList = this.passingYearListData.filter(pyObj => {
                return Number(pyObj.name) >= Number(dateObj.getFullYear());
            });

            if (this.dataSourceQualification && this.dataSourceQualification.data
                && this.dataSourceQualification.data.length > 0) {
                const qualData = _.cloneDeep(this.dataSourceQualification.data);
                qualData.forEach(qObj => {
                    if (this.passingYearList) {
                        const pYearData = this.passingYearList.filter(pObj => {
                            return pObj.id === qObj.passingYear;
                        });
                        if (pYearData && pYearData.length !== 1) {
                            qObj.passingYear = '';
                        }
                    }
                });
                this.dataSourceQualification = new MatTableDataSource(qualData);
            }
        }
    }

    /**
     * @description To set the validation for retirement date and employee type based on the employee class
     */
    onEmpClassChange(event = null) {
        const className = this.empClassList.filter(classObj => {
            return classObj.lookupInfoId === this.departmentalDetails.controls.empClass.value;
        })[0];

        if (this.createEmployeeForm.controls.dateOfBirth.value) {
            if (className && className.lookupInfoId === 165) {
                const date = new Date(this.createEmployeeForm.controls.dateOfBirth.value);
                // tslint:disable-next-line:max-line-length
                this.departmentalDetails.controls.dateOfRetirement.setValue(new Date(date.getFullYear() + 60, date.getMonth() + 1, 0));
            } else {
                const date = new Date(this.createEmployeeForm.controls.dateOfBirth.value);
                // tslint:disable-next-line:max-line-length
                this.departmentalDetails.controls.dateOfRetirement.setValue(new Date(date.getFullYear() + 58, date.getMonth() + 1, 0));
            }
        }

        if (this.empTypeData && this.empTypeData.length !== 0) {
            this.departmentalDetails.controls.empType.setValue('');
            if (className && (className.lookupInfoId === 162 || className.lookupInfoId === 163)) {
                // Class 1 (lookupInfoId - 162) & Class 2 (lookupInfoId - 163) option
                this.empTypeList = this.empTypeData.filter(typeObj => {
                    return typeObj.lookupInfoId === 167; // GO option lookupInfoId - 167
                });
            } else if (className && (className.lookupInfoId === 164 || className.lookupInfoId === 165)) {
                // Class 3 (lookupInfoId - 164) & Class 4 (lookupInfoId - 165) option
                this.empTypeList = this.empTypeData.filter(typeObj => {
                    return typeObj.lookupInfoId === 168; // NGO option lookupInfoId - 168
                });
            } else { // No Grade option
                this.empTypeList = _.cloneDeep(this.empTypeData);
            }
            this.setDefaultEmpType();
        }
        if (event && event.value) {
            if (event.value === 162 || event.value === 163) {
                if (this.departmentalDetails.get('payCommissionJoiningTime') &&
                    this.departmentalDetails.get('payCommissionJoiningTime').value) {
                    if (this.departmentalDetails.get('empPayType').value === 157) {
                        this.departmentalDetails.patchValue({
                            empClass: null
                        });
                        this.toastr.error('Selected class is not applicable for Fix Pay');
                    }
                }
            } else {
                if (this.departmentalDetails.get('empPayType').value === 161) {
                    this.departmentalDetails.patchValue({
                        empClass: null
                    });
                    this.toastr.error('Selected class is not applicable for probational');
                }
            }
        }
    }

    /**
     * @description To set the validation for Employee Type Change
     */
    onEmpPayTypeChange(event) {
        if (event && event.value === 161) {
            if (this.departmentalDetails.get('empPayType').value
                && this.departmentalDetails.get('empPayType').value === 161
                && this.departmentalDetails.get('empClass').value) {
                if (!([162, 163].includes(this.departmentalDetails.get('empClass').value))) {
                    this.departmentalDetails.patchValue({
                        empClass: null
                    });
                }
            }
        }
    }

    /**
     * @description to set the default employee type if employee type list has only one records.
     */
    setDefaultEmpType() {
        if (this.empTypeList && this.empTypeList.length === 1) {
            this.departmentalDetails.controls.empType.setValue(this.empTypeList[0]['lookupInfoId']);
        }
    }

    /**
     * @description To calculate the 6th basic pay
     */
    calculateBasicPay() {
        this.toggleRequireTag6th();
        let GPValue = 0;
        const PBValue = this.create6thPayDetails.controls['payBandValue'].value;
        if (this.gradePayList && this.create6thPayDetails.controls['gradePay'].value !== '') {
            const selectedIndex = this.gradePayList.findIndex(x =>
                x['id'] === this.create6thPayDetails.controls['gradePay'].value);
            GPValue = (this.gradePayList[selectedIndex] && this.gradePayList[selectedIndex]['gradePayValue']) ?
                this.gradePayList[selectedIndex]['gradePayValue'] : 0;
        }
        this.create6thPayDetails.controls.basicPay.patchValue(+PBValue + (isNaN(GPValue) ? 0 : +GPValue));
        this.calculateIncrementAmt(this.create6thPayDetails.controls.basicPay.value);
    }

    /**
     * @description To calsulate and set the 6th pay incremetn amount
     * @param sixBasic sixth basic pay amount
     */
    calculateIncrementAmt(sixBasic) {
        const basicPer = (+sixBasic * 3) / 100;
        const roundToNext10 = Math.ceil(basicPer / 10) * 10;
        this.create6thPayDetails.get('incrementAmount').setValue(roundToNext10);
    }

    /**
     * @description To calulate the 6th basic pay
     */
    calJoining6thBasicPay() {
        let GPValue = 0;
        const PBValue = this.joining6thPayDetail.controls['join6thPayBandValue'].value;
        if (this.join6thGradePayList && this.joining6thPayDetail.controls['join6thGradePay'].value !== '') {
            const selectedIndex = this.join6thGradePayList.findIndex(x =>
                x['id'] === this.joining6thPayDetail.controls['join6thGradePay'].value);
            GPValue = (this.join6thGradePayList[selectedIndex] &&
                this.join6thGradePayList[selectedIndex]['gradePayValue']) ?
                this.join6thGradePayList[selectedIndex]['gradePayValue'] : 0;
        }
        this.joining6thPayDetail.controls.join6thBasicPay.patchValue(+PBValue + (isNaN(GPValue) ? 0 : +GPValue));
    }

    /**
     * @description To set the validation based on the date of joining
     */
    onDOJSelect(event) {
        if (event.target.value < new Date('04/01/2005')) { // new Date(MM/dd/yyyy)
            this.showGPF = true;
            this.showPRAN = false;
        } else {
            this.showGPF = false;
            this.showPRAN = true;
        }
        let data = new Date(this.departmentalDetails.controls.dateOfJoiningGOG.value);
        if (this.joiningDateGog && data && (this.ddoEditable || this.adminEditable) &&
            this.departmentalDetails.controls.payCommissionJoiningTime &&
            this.departmentalDetails.controls.payCommissionJoiningTime.value) {
            const diffYear = data.getFullYear() - this.getYearFromApplicablePayCommision();
            if (diffYear < 0) {
                data = this.joiningDateGog;
                this.departmentalDetails.patchValue({
                    dateOfJoiningGOG: data
                });
                if (data < new Date('04/01/2005')) {
                    this.showGPF = true;
                    this.showPRAN = false;
                } else {
                    this.showGPF = false;
                    this.showPRAN = true;
                }
                this.toastr.error(pvuMessage.JOINING_DATE_SELECT_ERROR);
            }
        }
        this.joiningDateGog = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        this.maxFixProbationDate = new Date(data.getFullYear(), data.getMonth(), data.getDate());
        this.setMinEffectiveDate();
    }

    /**
     * @method getYearFromApplicablePayCommision
    * @description To get year for applicable pay commision
    */
    getYearFromApplicablePayCommision() {
        const payComm = this.departmentalDetails.controls.payCommissionJoiningTime.value;
        return ((payComm === 152) ? 2016 :
            ((payComm === 151) ? 2006 :
                ((payComm === 150) ? 1996 :
                    ((payComm === 149) ? 1986 : 1900))));
        // kept 1900 as default value for pay commision less than 4th
    }

    /**
     * @description To set the min date and max date for employement history from date and to date
     */
    dateVal(): any {
        this.minDate = new Date(this.previousEmployementDetails.controls.fromDate.value);
        this.maxDate = this.previousEmployementDetails.controls.toDate.value;
    }

    /**
     * @description To set the min date and max date for daputation start date and end date
     */
    dateValStatus(): any {
        this.statusMinDate = this.departmentalDetails.controls.deputationStartDate.value;
        this.statusMaxDate = this.departmentalDetails.controls.deputationEndDate.value;
    }

    /**
     * @description To convert the date into 'dd-MM-yyyy 00:00:00' format
     * @param date date value
     */
    convertDateFormat(date) {
        if (date !== '' && date !== undefined) {
            date = new Date(date);
            return this.datepipe.transform(date, 'dd-MM-yyyy 00:00:00').toString();
        }
        return '';
    }

    /**
     * @description To convert the date into 'yyyy-MM-dd' format
     * @param date date value
     */
    convertDateOnly(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'yyyy-MM-dd').toString();
        }
        return '';
    }

    /**
     * @description To save the personal details tab data
     * @param type 'DRAFT' or 'SUBMIT' type
     */
    onSavePersonalDetail(type) {
        const self = this;
        let valid = true;
        this.nomineeHighlight = false;
        let isSkipValidatation = false;
        this.isPersonalSaveDisabled = true;
        if (type === 'DRAFT') {
            isSkipValidatation = true;
            this.createEmployeeForm.controls.employeeName.updateValueAndValidity();
            if (!this.createEmployeeForm.controls.employeeName.value) {
                this.createEmployeeForm.controls.employeeName.markAsTouched();
                this.toastr.error(pvuMessage.EMPLOYEE_NAME);
                this.isPersonalSaveDisabled = false;
                return;
            }
        } else {
            ValidationService.validateAllFormFields(this.createEmployeeForm);
            // if (!this.createEmployeeForm.valid) {
            //     let invalid = <FormControl[]>Object.keys(this.createEmployeeForm.controls)
            //     .map(key => this.createEmployeeForm.controls[key]).filter(ctl => ctl.invalid);
            //     if (invalid.length > 0) {
            //         let invalidElem: any = invalid[0];
            //         invalidElem.nativeElement.focus();
            //     }
            //     return false;
            // }
        }

        if (type === 'SUBMIT' && this.duplicatePanNo) {
            this.isPersonalSaveDisabled = false;
            return;
        }

        if (isSkipValidatation || this.createEmployeeForm.valid) {
            this.formData = new FormData();
            // tslint:disable-next-line:prefer-const
            Object.keys(this.createEmployeeForm.value).forEach((key) => {
                if (this.createEmployeeForm.controls.hasOwnProperty(key)) {
                    const value = this.createEmployeeForm.value[key];
                    if ((key.substring(0, 3) === 'cur' ||
                        key.substring(0, 3) === 'nat' ||
                        key.substring(0, 3) === 'per') && (key !== 'nationality')) {
                        this.formData.append('pvuEmployeAddressDto.' + key, (value || '0'));
                    } else if (key === 'isNatAddCurAddPerAdd') {
                        if (value === 'sameAsCurrentAddr') {
                            this.formData.append('pvuEmployeAddressDto.' + key, ('1'));
                        } else if (value === 'sameAsPermanentAddr') {
                            this.formData.append('pvuEmployeAddressDto.' + key, ('2'));
                        } else {
                            this.formData.append('pvuEmployeAddressDto.' + key, ('0'));
                        }
                    } else if (key === 'isPerAddCurAdd') {
                        if (value) {
                            this.formData.append('pvuEmployeAddressDto.' + key, ('1'));
                        } else {
                            this.formData.append('pvuEmployeAddressDto.' + key, ('0'));
                        }
                    } else if (key !== 'dateOfBirth' && key !== 'dateOfMedFitnessCert'
                        && key !== 'passportExpiryDate') {
                        this.formData.append('pvuEmployeDto.' + key, (value || '0'));
                    }
                }
            });
            this.formData.append('formAction', 'DRAFT');
            this.formData.append('pvuEmployeAddressDto.statusId', this.getStatusId('Saved as Draft'));
            // tslint:disable-next-line:max-line-length
            this.formData.append('pvuEmployeAddressDto.empAddressId', this.empAddressId.toString() ? this.empAddressId.toString() : '0');
            this.formData.append('pvuEmployeDto.officeId', this.currentPost['officeDetail']['officeId']);

            // tslint:disable-next-line:max-line-length
            this.formData.append('pvuEmployeDto.dateOfBirth', this.createEmployeeForm.get('dateOfBirth').value !== '' && this.createEmployeeForm.get('dateOfBirth').value !== null ? this.convertDateFormat(this.createEmployeeForm.get('dateOfBirth').value) : '');
            // tslint:disable-next-line:max-line-length
            this.formData.append('pvuEmployeDto.dateOfMedFitnessCert', this.createEmployeeForm.get('dateOfMedFitnessCert').value !== '' && this.createEmployeeForm.get('dateOfMedFitnessCert').value !== null ? this.convertDateFormat(this.createEmployeeForm.get('dateOfMedFitnessCert').value) : '');
            // tslint:disable-next-line:max-line-length
            this.formData.append('pvuEmployeDto.passportExpiryDate', this.createEmployeeForm.get('passportExpiryDate').value !== '' && this.createEmployeeForm.get('passportExpiryDate').value !== null ? this.convertDateFormat(this.createEmployeeForm.get('passportExpiryDate').value) : '');

            this.formData.append('pvuEmployeDto.statusId', this.getStatusId('Saved as Draft'));
            this.formData.append('pvuEmployeDto.empSrcType',
                            (this.employeeDataPersonal && this.employeeDataPersonal.pvuEmployeDto?.empSrcType !== 1) ?
                                (this.employeeDataPersonal.pvuEmployeDto.empSrcType + '') : '0');

            let nomineeData = _.cloneDeep(this.dataSourceNominee.data);
            let totalshare = 0;
            let isOtherReleation = true;
            let nomAttach = false;
            if (this.ddoEditable || this.adminEditable) {
                const nomData = nomineeData.concat(this.empNomineeArray);
                nomineeData = this.employeeDataService.checkPvuEmployeNomineeDtoDifference(nomData);
            }
            nomineeData.forEach((data, key) => {
                if (!isSkipValidatation) {
                    if (!(+data.nomineeShare && data.relationship && data.nomineeName &&
                        data.nomineeAddress && data.nomineeAge)) {
                        this.nomineeHighlight = true;
                        valid = false;
                    }
                    if (!data.npsNomiForm) {
                        if (!(data.npsNomineePhoto && data.npsNomineeFormName)) {
                            if (data && (data['changeType'] !== 3)) {
                                valid = false;
                                nomAttach = true;
                            }
                        }
                    }
                    if ((data.relationship === 121 || data.relationship === 127) &&
                        (data.otherRelationship === undefined || data.otherRelationship == null ||
                            data.otherRelationship === '')) {
                        this.nomineeHighlight = true;
                        if (data && (data['changeType'] !== 3)) {
                            isOtherReleation = false;
                        }
                    }
                }
                delete data.fileBrowseGenForm;
                delete data.fileBrowseNpsForm;
                delete data.fileBrowseNomi;
                if (data.photoOfNominee && data.photoOfNominee['type'] && data.photoOfNominee['name']) {
                    this.formData.append(
                        'pvuEmployeNomineeDto[' + key + '].nomineePhotoAttachment.attachment[0]',
                        (data.photoOfNominee ? data.photoOfNominee : ''),
                        (data.photoOfNominee.name ? data.photoOfNominee.name : '')
                    );
                    if (this.ddoEditable || this.adminEditable) {
                        if (data.nomineePhotoDelete) {
                            this.formData.append(
                                'pvuEmployeNomineeDto[' + key + '].nomineePhotoAttachment.changeType', '1');
                        } else {
                            this.formData.append(
                                'pvuEmployeNomineeDto[' + key + '].nomineePhotoAttachment.changeType', '2');
                        }
                    }
                } else if (this.ddoEditable || this.adminEditable) {
                    if (data.nomineePhotoDelete) {
                        this.formData.append(
                            'pvuEmployeNomineeDto[' + key + '].nomineePhotoAttachment.changeType', '3');
                    } else {
                        this.formData.append(
                            'pvuEmployeNomineeDto[' + key + '].nomineePhotoAttachment.changeType', '0');
                    }
                }
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].nomineePhotoAttachment.fileSize', (data.photoOfNominee ? this.bytesToKB(data.photoOfNominee['size']) : '0'));
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].nomineePhotoAttachment.format', (data.photoOfNominee && data.photoOfNominee['type'] ? data.photoOfNominee['type'] : '0'));
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].nomineePhotoAttachment.menuId', (this.attachmentData ? this.attachmentData['menuId'] : '0'));
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].nomineePhotoAttachment.uploadDirectoryPath', (this.attachmentData ? this.attachmentData['uploadDirectoryPath'] : ''));
                if (data.nomineePhoto && data.nomineePhotoName) {
                    // tslint:disable-next-line:max-line-length
                    this.formData.append('pvuEmployeNomineeDto[' + key + '].nomineePhoto', (data.nomineePhoto ? data.nomineePhoto : ''));
                    // tslint:disable-next-line:max-line-length
                    this.formData.append('pvuEmployeNomineeDto[' + key + '].nomineePhotoName', (data.nomineePhotoName ? data.nomineePhotoName : ''));
                }

                if (data.genNomiForm && data.genNomiForm['type'] && data.genNomiForm['name']) {
                    this.formData.append(
                        'pvuEmployeNomineeDto[' + key + '].genNomineePhotoAttachment.attachment[0]',
                        (data.genNomiForm ? data.genNomiForm : ''),
                        (data.genNomiForm.name ? data.genNomiForm.name : '')
                    );
                    if (this.ddoEditable || this.adminEditable) {
                        if (data.genNomineePhotoDelete) {
                            this.formData.append(
                                'pvuEmployeNomineeDto[' + key + '].genNomineePhotoAttachment.changeType', '1');
                        } else {
                            this.formData.append(
                                'pvuEmployeNomineeDto[' + key + '].genNomineePhotoAttachment.changeType', '2');
                        }
                    }
                } else if (this.ddoEditable || this.adminEditable) {
                    if (data.genNomineePhotoDelete) {
                        this.formData.append(
                            'pvuEmployeNomineeDto[' + key + '].genNomineePhotoAttachment.changeType', '3');
                    } else {
                        this.formData.append(
                            'pvuEmployeNomineeDto[' + key + '].genNomineePhotoAttachment.changeType', '0');
                    }
                }
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].genNomineePhotoAttachment.fileSize', (data.genNomiForm ? this.bytesToKB(data.genNomiForm['size']) : '0'));
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].genNomineePhotoAttachment.format', (data.genNomiForm && data.genNomiForm['type'] ? data.genNomiForm['type'] : '0'));
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].genNomineePhotoAttachment.menuId', (this.attachmentData ? this.attachmentData['menuId'] : '0'));
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].genNomineePhotoAttachment.uploadDirectoryPath', (this.attachmentData ? this.attachmentData['uploadDirectoryPath'] : ''));
                if (data.genNomineePhoto && data.genNomineeFormName) {
                    // tslint:disable-next-line:max-line-length
                    this.formData.append('pvuEmployeNomineeDto[' + key + '].genNomineePhoto', (data.genNomineePhoto ? data.genNomineePhoto : ''));
                    // tslint:disable-next-line:max-line-length
                    this.formData.append('pvuEmployeNomineeDto[' + key + '].genNomineeFormName', (data.genNomineeFormName ? data.genNomineeFormName : ''));
                }

                if (data.npsNomiForm && data.npsNomiForm['type'] && data.npsNomiForm['name']) {
                    this.formData.append(
                        'pvuEmployeNomineeDto[' + key + '].npsNomineePhotoAttachment.attachment[0]',
                        (data.npsNomiForm ? data.npsNomiForm : ''),
                        (data.npsNomiForm.name ? data.npsNomiForm.name : '')
                    );
                    if (this.ddoEditable || this.adminEditable) {
                        if (data.npsNomineePhotoDelete) {
                            this.formData.append(
                                'pvuEmployeNomineeDto[' + key + '].npsNomineePhotoAttachment.changeType', '1');
                        } else {
                            this.formData.append(
                                'pvuEmployeNomineeDto[' + key + '].npsNomineePhotoAttachment.changeType', '2');
                        }
                    }
                } else if (this.ddoEditable || this.adminEditable) {
                    if (data.npsNomineePhotoDelete) {
                        this.formData.append(
                            'pvuEmployeNomineeDto[' + key + '].npsNomineePhotoAttachment.changeType', '3');
                    } else {
                        this.formData.append(
                            'pvuEmployeNomineeDto[' + key + '].npsNomineePhotoAttachment.changeType', '0');
                    }
                }
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].npsNomineePhotoAttachment.fileSize', (data.npsNomiForm ? this.bytesToKB(data.npsNomiForm['size']) : '0'));
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].npsNomineePhotoAttachment.format', (data.npsNomiForm && data.npsNomiForm['type'] ? data.npsNomiForm['type'] : '0'));
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].npsNomineePhotoAttachment.menuId', (this.attachmentData ? this.attachmentData['menuId'] : '0'));
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].npsNomineePhotoAttachment.uploadDirectoryPath', (this.attachmentData ? this.attachmentData['uploadDirectoryPath'] : ''));
                if (data.npsNomineePhoto && data.npsNomineeFormName) {
                    // tslint:disable-next-line:max-line-length
                    this.formData.append('pvuEmployeNomineeDto[' + key + '].npsNomineePhoto', (data.npsNomineePhoto ? data.npsNomineePhoto : ''));
                    // tslint:disable-next-line:max-line-length
                    this.formData.append('pvuEmployeNomineeDto[' + key + '].npsNomineeFormName', (data.npsNomineeFormName ? data.npsNomineeFormName : ''));
                }

                this.formData.append('pvuEmployeNomineeDto[' + key + '].statusId', this.getStatusId('Saved as Draft'));
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].nomineeAddress', data.nomineeAddress !== '' ? data.nomineeAddress : '');
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].nomineeAge', data.nomineeAge !== '' ? data.nomineeAge : '');
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].nomineeName', data.nomineeName !== '' ? data.nomineeName : '');
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].nomineeShare', data.nomineeShare !== '' ? data.nomineeShare : '0');
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].otherRelationship', data.otherRelationship !== '' ? data.otherRelationship : '');
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].relationship', data.relationship !== '' ? data.relationship : '0');
                if ((data && (Number(data['changeType']) !== 3))) {
                    totalshare += +data.nomineeShare;
                }
                // tslint:disable-next-line:max-line-length
                this.formData.append('pvuEmployeNomineeDto[' + key + '].empNomineeId', data.empNomineeId !== '' ? data.empNomineeId : '0');
                if (this.ddoEditable || this.adminEditable) {
                    // tslint:disable-next-line:max-line-length
                    this.formData.append('pvuEmployeNomineeDto[' + key + '].changeType', data.changeType ? data.changeType : '0');
                }
            });

            if (nomAttach && !isSkipValidatation) {
                this.toastr.error(pvuMessage.NOMINEE_ATTACH);
                this.isPersonalSaveDisabled = false;
                return false;
            }
            if (totalshare > 100 && !isSkipValidatation) {
                self.toastr.error(pvuMessage.NOMINEE_SHARE_GREATER);
                this.isPersonalSaveDisabled = false;
                return false;
            }
            if (totalshare < 100 && !isSkipValidatation) {
                self.toastr.error(pvuMessage.NOMINEE_SHARE_LESS);
                this.isPersonalSaveDisabled = false;
                return false;
            }
            if (!isOtherReleation && !isSkipValidatation) {
                self.toastr.error(pvuMessage.OTHER_RELATION);
                this.isPersonalSaveDisabled = false;
                return false;
            }
            if (this.fileData) {
                this.formData.append('pvuEmployeDto.photoAttachment[0].attachment[0]',
                    (this.fileData ? this.fileData : ''),
                    // Adding a Another Parameter is a workaround for IE Attachment Issue
                    (this.fileData.name ? this.fileData.name : '')
                );
            }
            // tslint:disable-next-line:max-line-length
            this.formData.append('pvuEmployeDto.photoAttachment[0].fileSize', (this.fileData ? this.bytesToKB(this.fileData['size']) : '0'));
            this.formData.append('pvuEmployeDto.photoAttachment[0].format',
                (this.fileData ? this.fileData['type'] : '0'));
            // tslint:disable-next-line:max-line-length
            this.formData.append('pvuEmployeDto.photoAttachment[0].menuId', (this.attachmentData ? this.attachmentData['menuId'] : '0'));
            // tslint:disable-next-line:max-line-length
            this.formData.append('pvuEmployeDto.photoAttachment[0].uploadDirectoryPath', (this.attachmentData ? this.attachmentData['uploadDirectoryPath'] : ''));

            if (this.empPhotoKey && this.empPhotoName) {
                this.formData.append('pvuEmployeDto.employeePhoto', (this.empPhotoKey ? this.empPhotoKey : ''));
                this.formData.append('pvuEmployeDto.employeePhotoName', (this.empPhotoName ? this.empPhotoName : ''));
            }

            if (this.fileData && this.fileData['size'] && this.fileData['type']
                && (this.ddoEditable || this.adminEditable)) {
                if (this.isAttachmentExists) {
                    this.formData.append('pvuEmployeDto.photoAttachment[0].changeType', '1');
                } else {
                    this.formData.append('pvuEmployeDto.photoAttachment[0].changeType', '2');
                }
            } else if (this.ddoEditable || this.adminEditable) {
                if (this.isAttachmentExists && this.empViewPhoto) {
                    this.formData.append('pvuEmployeDto.photoAttachment[0].changeType', '0');
                } else {
                    this.formData.append('pvuEmployeDto.photoAttachment[0].changeType', '3');
                }
            }

            if (isSkipValidatation || valid) {
                if (this.ddoEditable || this.adminEditable) {

                    const newEmpDto = this.createEmployeeForm.getRawValue();
                    const emplDtoChange = this.employeeDataService.checkPvuEmployeDtoDifference(_.cloneDeep(newEmpDto));
                    if (emplDtoChange) {
                        this.formData.append('pvuEmployeDto.changeType', emplDtoChange.toString());
                    } else {
                        this.formData.append('pvuEmployeDto.changeType', '0');
                    }
                    const emplAddrChange = this.employeeDataService.checkEmpAddrDtoDifference(_.cloneDeep(newEmpDto));
                    if (emplAddrChange) {
                        this.formData.append('pvuEmployeAddressDto.changeType', emplAddrChange.toString());
                    } else {
                        this.formData.append('pvuEmployeAddressDto.changeType', '0');
                    }
                    this.isTabDisabled = true;
                    this.isPersonalSaveDisabled = false;
                    this.selectedIndex = 1;
                    if (this.action === 'edit') {
                        const params = { 'id': this.empId };
                        this.getQualificationDetail(params);
                    }
                } else {
                    this.pvuService.savePersonalDetail(this.formData).subscribe((data) => {
                        if (data && data['status'] === 200) {
                            this.isPersonalSaveDisabled = false;
                            if (data['result']) {
                                self.toastr.success(data['message']);
                                this.empId = data['result']['pvuEmployeDto']['empId'];
                                this.setEmployeeData(data['result'], null);
                                this.isTabDisabled = true;
                                this.fileData = null;
                                if (type !== 'DRAFT') {
                                    setTimeout(() => { this.selectedIndex = 1; });
                                    if (this.action === 'edit') {
                                        const params = { 'id': this.empId };
                                        this.getQualificationDetail(params);
                                    }
                                }
                            }
                        } else {
                            this.isPersonalSaveDisabled = false;
                            self.toastr.error(data['message']);
                        }
                    }, (err) => {
                        this.isPersonalSaveDisabled = false;
                        self.toastr.error(err);
                    });
                }
            } else {
                this.isPersonalSaveDisabled = false;
                self.toastr.error(MessageConst.VALIDATION.TOASTR);
            }
        } else {
            this.isPersonalSaveDisabled = false;
            self.toastr.error(MessageConst.VALIDATION.TOASTR);
        }
    }

    /**
     * @description To get the status ID for transaction status
     * @param status status name
     */
    getStatusId(status) {
        const lookupStatus = this.statusData.filter((item) => {
            return item['lookupInfoName'] === status;
        });
        if (!this.transStatus) {
            if (lookupStatus && lookupStatus[0]) {
                return lookupStatus[0]['lookupInfoId'];
            }
        } else {
            if (lookupStatus && lookupStatus[0] && (lookupStatus[0]['lookupInfoId'] === this.transStatus)) {
                return lookupStatus[0]['lookupInfoId'];
            }
        }
        return this.transStatus;
    }

    /**
     * @description To go to the previous tab
     * @param tabIndex tab index
     */
    gotoPrevious(tabIndex) {
        this.selectedIndex = +tabIndex;
    }

    /**
     * @description To convert the data type of value
     * @param dataObj Data object
     * @param typeObj Data type object respective to data object
     */
    typeConverting(dataObj, typeObj) {
        const result = {};
        for (const key in dataObj) {
            if (dataObj.hasOwnProperty(key)) {
                let newValue: any;
                if (typeObj.hasOwnProperty(key) && dataObj[key] !== undefined) {
                    const typeRequired = typeObj[key];
                    if (typeRequired === 'string' && dataObj[key] !== '' && dataObj[key] != null) {
                        newValue = dataObj[key].toString();
                    } else if (typeRequired === 'number' && dataObj[key] !== '' && dataObj[key] != null) {
                        newValue = Number(dataObj[key]);
                    }
                    result[key] = newValue;
                }
            }
        }
        return result;
    }

    /**
     * To check any data entered for the 7th paycommission, if yes then return true else false
     * @param payData7th 7th Pay commission form group value
     */
    hasSevenPayData(payData7th) {
        if ((payData7th.payLevel && payData7th.payLevel !== 0) ||
            (payData7th.cellId && payData7th.cellId !== 0) ||
            (payData7th.basicPay !== 0 && payData7th.basicPay !== '' && payData7th.basicPay !== null) ||
            (payData7th.dateOfNextIncrement && payData7th.dateOfNextIncrement !== 0) ||
            (payData7th.dateOfBenefitEffective && payData7th.dateOfBenefitEffective !== 0)) {
            return true;
        }
        return false;
    }

    /**
     * To check any data entered for the 6th paycommission, if yes then return true else false
     * @param payData6th 6th Pay commission form group value
     */
    hasSixPayData(payData6th) {
        if (((payData6th.empDesignationAsOn && payData6th.empDesignationAsOn !== 0) ||
            (payData6th.empOtherDesignation && payData6th.empOtherDesignation !== null) ||
            (payData6th.preRevisedPayScale && payData6th.preRevisedPayScale !== 0) ||
            (payData6th.preRevisedBasicPay && payData6th.preRevisedBasicPay > 0) ||
            (payData6th.revisedPayBand && payData6th.revisedPayBand !== 0) ||
            (payData6th.gradePay && payData6th.gradePay !== 0) ||
            (payData6th.payBandValue && payData6th.payBandValue > 0) ||
            (payData6th.basicPay && payData6th.basicPay > 0) ||
            (payData6th.dateOfPreRevisedNextIncrement && payData6th.dateOfPreRevisedNextIncrement !== 0) ||
            (payData6th.dateOfOption && payData6th.dateOfOption !== 0) ||
            (payData6th.dateOfStagnational && payData6th.dateOfStagnational !== 0) ||
            (payData6th.incrementAmount && payData6th.incrementAmount > 0) ||
            (payData6th.effDate && payData6th.effDate !== 0) ||
            (payData6th.dateOfNextIncrement && payData6th.dateOfNextIncrement !== 0))) {
            return true;
        }
        return false;
    }

    /**
     * To check any data entered for the 5th paycommission, if yes then return true else false
     * @param payData5th 5th Pay commission form group value
     */
    hasFifthPayData(payData5th) {
        if ((payData5th.payScale && payData5th.payScale !== 0) ||
            (payData5th.basicPay !== 0 && payData5th.basicPay !== '' && payData5th.basicPay !== null) ||
            (payData5th.effectiveDate && payData5th.effectiveDate !== 0 && payData5th.effectiveDate !== null)) {
            return true;
        }
        return false;
    }

    /**
     * To check any data entered for the 4th paycommission, if yes then return true else false
     * @param payData5th 4th Pay commission form group value
     */
    hasFourthPayData(payData4th) {
        if ((payData4th.payScale && payData4th.payScale !== 0) ||
            (payData4th.basicPay !== 0 && payData4th.basicPay !== '' && payData4th.basicPay !== null) ||
            (payData4th.effectiveDate && payData4th.effectiveDate !== 0 && payData4th.effectiveDate !== null)) {
            return true;
        }
        return false;
    }

    /**
     * @description To display the pay details tab eror message
     */
    payDetailsErrorMessage() {
        this.toastr.error(MessageConst.VALIDATION.TOASTR);
        this.isPaySaveDisabled = false;
    }

    toggleRequireTag6th() {
        const empPayCommission = this.departmentalDetails.get('payCommissionJoiningTime').value;
        if (![151, 152].includes(empPayCommission)) {
           const payData6th = this.create6thPayDetails.getRawValue();
           const payData7th = this.create7thPayDetails.getRawValue();
           this.req6th = this.hasSixPayData(payData6th);
           this.req7th = this.hasSevenPayData(payData7th);
        }
    }

    /**
     * @description To save the pay details tab data
     * @param type 'DRAFT' or 'SUBMIT' type
     */
    onSavePayDetail(type) {
        this.isPaySaveDisabled = true;
        const self = this;
        const empPayCommission = this.departmentalDetails.get('payCommissionJoiningTime').value;
        const payData7th = this.create7thPayDetails.getRawValue();
        const payData6th = this.create6thPayDetails.getRawValue();
        const payData5th = this.create5thPayDetails.getRawValue();
        const payData4th = this.create4thPayDetails.getRawValue();
        let seventhPayDetail = null;
        let sixthPayDetail = null;
        let pvuEmployefivePayDetailDto = null;
        let pvuEmployefourthPayDetailDto = null;

        let isSkipValidatation = false;
        if (type === 'DRAFT') {
            isSkipValidatation = true;
        }

        if (!(this.ddoEditable || this.adminEditable)) {
            // Fix Pay Commission (341)
            // Fix Pay Commission selection Validation
            if (empPayCommission === 341 && !isSkipValidatation) {
                ValidationService.validateAllFormFields(this.createFixPayDetail);
                ValidationService.validateAllFormFields(this.joiningFixPayDetail);
                if (!this.createFixPayDetail.valid || !this.joiningFixPayDetail.valid) {
                    this.payDetailsErrorMessage();
                    return;
                }
            }

            // 7th Pay Commission (152)
            // 7th Pay commission selection Validation
            if (empPayCommission === 152 && !isSkipValidatation) {
                ValidationService.validateAllFormFields(this.create7thPayDetails);
                ValidationService.validateAllFormFields(this.create6thPayDetails);
                ValidationService.validateAllFormFields(this.joining7thPayDetail);
                if (!this.create7thPayDetails.valid || !this.create6thPayDetails.valid ||
                    !this.joining7thPayDetail.valid) {
                    this.payDetailsErrorMessage();
                    return;
                }
            }

            // 6th Pay Commission (151)
            // 6th Pay commission selection Validation
            if (empPayCommission === 151 && !isSkipValidatation) {
                ValidationService.validateAllFormFields(this.create6thPayDetails);
                ValidationService.validateAllFormFields(this.joining6thPayDetail);
                if (!this.create6thPayDetails.valid || !this.joining6thPayDetail.valid) {
                    this.payDetailsErrorMessage();
                    return;
                }

                if (this.hasSevenPayData(payData7th)) {
                    // this.set7thPayDetailsValidation();
                    ValidationService.validateAllFormFields(this.create7thPayDetails);
                    if (!this.create7thPayDetails.valid) {
                        this.payDetailsErrorMessage();
                        return;
                    }
                } else {
                    this.reset7thPayForm();
                }
            }

            // 5th Pay Commission (150)
            // 5th Pay commission selection Validation
            if (empPayCommission === 150 && !isSkipValidatation) {
                ValidationService.validateAllFormFields(this.create5thPayDetails);
                ValidationService.validateAllFormFields(this.joining5thPayDetail);
                if (!this.create5thPayDetails.valid || !this.joining5thPayDetail.valid) {
                    this.payDetailsErrorMessage();
                    return;
                }

                if (this.hasSixPayData(payData6th)) {
                    this.req6th = true;
                    // this.set6thPayDetailsValidation();
                    ValidationService.validateAllFormFields(this.create6thPayDetails);
                    if (!this.create6thPayDetails.valid) {
                        this.payDetailsErrorMessage();
                        return;
                    }
                } else {
                    this.req6th = false;
                    this.reset6thPayForm();
                }

                if (this.hasSevenPayData(payData7th)) {
                    this.req7th = true;
                    // this.set7thPayDetailsValidation();
                    ValidationService.validateAllFormFields(this.create7thPayDetails);
                    if (!this.create7thPayDetails.valid) {
                        this.payDetailsErrorMessage();
                        return;
                    }
                } else {
                    this.req7th = false;
                    this.reset7thPayForm();
                }
            }

            // 4th Pay Commission (149)
            // 3rd Pay Commission (148)
            // 2nd Pay Commission (339)
            // 1st Pay Commission (338)
            // 4th Pay commission selection Validation
            if ((empPayCommission === 149 || empPayCommission === 148 || empPayCommission === 339 ||
                empPayCommission === 338) && !isSkipValidatation) {
                ValidationService.validateAllFormFields(this.create4thPayDetails);
                ValidationService.validateAllFormFields(this.create5thPayDetails);
                if (!this.create4thPayDetails.valid || !this.create5thPayDetails.valid) {
                    this.payDetailsErrorMessage();
                    return;
                }

                if (this.hasSixPayData(payData6th)) {
                    // this.set6thPayDetailsValidation();
                    ValidationService.validateAllFormFields(this.create6thPayDetails);
                    if (!this.create6thPayDetails.valid) {
                        this.payDetailsErrorMessage();
                        return;
                    }
                } else {
                    this.reset6thPayForm();
                }

                if (this.hasSevenPayData(payData7th)) {
                    // this.set7thPayDetailsValidation();
                    ValidationService.validateAllFormFields(this.create7thPayDetails);
                    if (!this.create7thPayDetails.valid) {
                        this.payDetailsErrorMessage();
                        return;
                    }
                } else {
                    this.reset7thPayForm();
                }

                if (empPayCommission === 149) {
                    ValidationService.validateAllFormFields(this.joining4thPayDetail);
                    if (!this.joining4thPayDetail.valid) {
                        this.payDetailsErrorMessage();
                        return;
                    }
                } else if (empPayCommission === 148) {
                    ValidationService.validateAllFormFields(this.joining3rdPayDetail);
                    if (!this.joining3rdPayDetail.valid) {
                        this.payDetailsErrorMessage();
                        return;
                    }
                } else if (empPayCommission === 339) {
                    ValidationService.validateAllFormFields(this.joining2ndPayDetail);
                    if (!this.joining2ndPayDetail.valid) {
                        this.payDetailsErrorMessage();
                        return;
                    }
                } else if (empPayCommission === 338) {
                    ValidationService.validateAllFormFields(this.joining1stPayDetail);
                    if (!this.joining1stPayDetail.valid) {
                        this.payDetailsErrorMessage();
                        return;
                    }
                }
            }
        }

        // 7th Pay commission (152)
        // 6th Pay commission (151)
        // 5th Pay commission (150)
        // 4th Pay Commission (149)
        // 3rd Pay Commission (148)
        // 2nd Pay Commission (339)
        // 1st Pay Commission (338)
        // Fix Pay Commission (341)
        const joiningPayDto = {
            joinPayCommId: empPayCommission,
            empId: this.empId
        };
        if (this.joiningPayId) {
            joiningPayDto['joiningPayId'] = this.joiningPayId;
        }
        if (empPayCommission === 341) {
            joiningPayDto['payScale'] = this.joiningFixPayDetail.get('joinFixPayValue').value;
        } else if (empPayCommission === 338) {
            joiningPayDto['payScale'] = this.joining1stPayDetail.get('join1stScale').value;
            joiningPayDto['basicPay'] = Number(this.joining1stPayDetail.get('join1stBasicPay').value);
        } else if (empPayCommission === 339) {
            joiningPayDto['payScale'] = this.joining2ndPayDetail.get('join2ndScale').value;
            joiningPayDto['basicPay'] = Number(this.joining2ndPayDetail.get('join2ndBasicPay').value);
        } else if (empPayCommission === 148) {
            joiningPayDto['payScale'] = this.joining3rdPayDetail.get('join3rdScale').value;
            joiningPayDto['basicPay'] = Number(this.joining3rdPayDetail.get('join3rdBasicPay').value);
        } else if (empPayCommission === 149) {
            joiningPayDto['payScale'] = this.joining4thPayDetail.get('join4thScale').value;
            joiningPayDto['basicPay'] = Number(this.joining4thPayDetail.get('join4thBasicPay').value);
        } else if (empPayCommission === 150) {
            joiningPayDto['payScale'] = this.joining5thPayDetail.get('join5thScale').value;
            joiningPayDto['basicPay'] = Number(this.joining5thPayDetail.get('join5thBasicPay').value);
        } else if (empPayCommission === 151) {
            joiningPayDto['payBandId'] = this.joining6thPayDetail.get('join6thPayBand').value;
            joiningPayDto['payBandValue'] = Number(this.joining6thPayDetail.get('join6thPayBandValue').value);
            joiningPayDto['gradePayId'] = this.joining6thPayDetail.get('join6thGradePay').value;
            joiningPayDto['basicPay'] = Number(this.joining6thPayDetail.get('join6thBasicPay').value);
        } else if (empPayCommission === 152) {
            joiningPayDto['payLevelId'] = this.joining7thPayDetail.get('join7thPayLevel').value;
            joiningPayDto['cellId'] = this.joining7thPayDetail.get('join7thCellId').value;
            joiningPayDto['basicPay'] = Number(this.joining7thPayDetail.get('join7thBasicPay').value);
        }

        let pvuEmpBankDetailDto = null;
        if (!(this.ddoEditable || this.adminEditable)) {
            if (!isSkipValidatation) {
                ValidationService.validateAllFormFields(this.bankDetailsForm);
                if (!this.bankDetailsForm.valid) {
                    this.payDetailsErrorMessage();
                    return;
                }
            }
        }

        const bankData = this.bankDetailsForm.getRawValue();
        if (bankData.bankAccNo1 === bankData.bankAccNo2) {
            pvuEmpBankDetailDto = {
                'accountType': bankData.accountType,
                'bankAddress': bankData.bankAddress,
                'bankName': bankData.bankName,
                'empId': this.empId,
                'ifscCode': bankData.ifscCode,
                'accountNo': bankData.bankAccNo2,
            };
            if (this.bankId) {
                pvuEmpBankDetailDto['id'] = this.bankId;
            }
        } else {
            this.toastr.error(MessageConst.VALIDATION.ACCOUNT_NOT_MATCH);
            this.isPaySaveDisabled = false;
            return;
        }

        const fixPayDetail = this.createFixPayDetail.value;
        fixPayDetail['fixPayValue'] = this.createFixPayDetail.get('fixPayValue').value;
        fixPayDetail['effDate'] = this.createFixPayDetail.get('effDate').value !== '' ?
            this.convertDateOnly(this.createFixPayDetail.get('effDate').value) : '';
        fixPayDetail['empId'] = this.empId;
        fixPayDetail['fixPayId'] = this.fixPayId;

        if (this.hasFourthPayData(payData4th) &&
            (empPayCommission === 149 || empPayCommission === 148 ||
                empPayCommission === 339 || empPayCommission === 338)) {
            pvuEmployefourthPayDetailDto = this.typeConverting(this.create4thPayDetails.getRawValue(),
                this.payDetailType.pvuEmployefourthPayDetailDto);
            pvuEmployefourthPayDetailDto['empId'] = this.empId;
            pvuEmployefourthPayDetailDto['statusId'] = this.getStatusId('Saved as Draft');
            pvuEmployefourthPayDetailDto['effectiveDate'] =
                this.convertDateOnly(pvuEmployefourthPayDetailDto['effectiveDate']);
            pvuEmployefourthPayDetailDto['fourthPayId'] = this.fourthPayId;
        } else {
            pvuEmployefourthPayDetailDto = null;
        }

        if (this.hasFifthPayData(payData5th) &&
            (empPayCommission === 150 || empPayCommission === 149 || empPayCommission === 148
                || empPayCommission === 339 || empPayCommission === 338)) {
            pvuEmployefivePayDetailDto = this.typeConverting(this.create5thPayDetails.getRawValue(),
                this.payDetailType.pvuEmployefivePayDetailDto);
            pvuEmployefivePayDetailDto['empId'] = this.empId;
            pvuEmployefivePayDetailDto['statusId'] = this.getStatusId('Saved as Draft');
            pvuEmployefivePayDetailDto['effectiveDate'] =
                this.convertDateOnly(pvuEmployefivePayDetailDto['effectiveDate']);
            pvuEmployefivePayDetailDto['dateOfNextIncrement'] =
                this.convertDateOnly(pvuEmployefivePayDetailDto['dateOfNextIncrement']);
            pvuEmployefivePayDetailDto['fifthPayId'] = this.fifthPayId;
        } else {
            pvuEmployefivePayDetailDto = null;
        }

        if (this.hasSixPayData(payData6th)) {
            sixthPayDetail = this.typeConverting(
                this.create6thPayDetails.getRawValue(),
                this.payDetailType.pvuEmployeSixPayDetailDto
            );
            sixthPayDetail['empId'] = this.empId;
            sixthPayDetail['dateOfOption'] = this.convertDateOnly(sixthPayDetail['dateOfOption']);
            sixthPayDetail['statusId'] = this.getStatusId('Saved as Draft');
            sixthPayDetail['dateOfPreRevisedNextIncrement'] =
                this.convertDateOnly(sixthPayDetail['dateOfPreRevisedNextIncrement']);
            sixthPayDetail['dateOfStagnational'] = this.convertDateOnly(sixthPayDetail['dateOfStagnational']);
            sixthPayDetail['effDate'] = this.convertDateOnly(sixthPayDetail['effDate']);
            sixthPayDetail['dateOfNextIncrement'] = this.convertDateOnly(sixthPayDetail['dateOfNextIncrement']);
            sixthPayDetail['sixpayId'] = this.sixpayId;
        } else {
            sixthPayDetail = null;
        }

        if (this.hasSevenPayData(payData7th)) {
            seventhPayDetail = this.typeConverting(this.create7thPayDetails.getRawValue(),
                this.payDetailType.pvuEmployeSevenPayDetailDto);
            seventhPayDetail['empId'] = this.empId;
            seventhPayDetail['statusId'] = this.getStatusId('Saved as Draft');
            seventhPayDetail['dateOfBenefitEffective'] =
                this.convertDateOnly(seventhPayDetail['dateOfBenefitEffective']);
            seventhPayDetail['dateOfNextIncrement'] = this.convertDateOnly(seventhPayDetail['dateOfNextIncrement']);
            seventhPayDetail['sevenPayId'] = this.sevenPayId;
        } else {
            seventhPayDetail = null;
        }

        let data;
        data = {
            'pvuEmployeFixPayDetailsDto': empPayCommission === 341 ? fixPayDetail : null,
            'pvuEmployefourthPayDetailDto': empPayCommission !== 341 ? pvuEmployefourthPayDetailDto : null,
            'pvuEmployefivePayDetailDto': empPayCommission !== 341 ? pvuEmployefivePayDetailDto : null,
            'pvuEmployeSixPayDetailDto': empPayCommission !== 341 ? sixthPayDetail : null,
            'pvuEmployeSevenPayDetailDto': empPayCommission !== 341 ? seventhPayDetail : null,
            'pvuEmployeeJoiningPayDto': joiningPayDto ? joiningPayDto : null,
            'pvuEmpBankDetailDto': pvuEmpBankDetailDto ? pvuEmpBankDetailDto : null,
        };

        if (type === 'SUBMIT' &&
            (this.fourthBasicPayError || this.fifthBasicPayError || this.sixthBasicPayError ||
                this.join4thBasicPayError || this.join5thBasicPayError || this.join6thBasicPayError)) {
            this.toastr.error(this.errorMessages.ERR_BASIC_PAY);
            this.isPaySaveDisabled = false;
            return;
        }
        if ((this.ddoEditable || this.adminEditable) && type === 'SUBMIT') {
            Object.keys(this.employeeSubmitData).forEach((k) => {
                if (this.employeeSubmitData[k] && this.employeeSubmitData[k].length > 0) {
                    this.employeeSubmitData[k].forEach((arr) => {
                        this.formData.append(arr['key'], arr['value']);
                    });
                }
            });
            if (this.currentPost && this.currentPost['wfRoleId']) {
                this.formData.append('roleId', ''+this.currentWfRlId);
            }
            if (this.empId) {
                this.formData.append('empId', '' + this.empId);
            }
            this.pvuService.submitEditableDetail(this.formData).subscribe((result) => {
                if (result['status'] === 200) {
                    self.toastr.success(result['message']);
                    this.isPaySaveDisabled = false;
                    this.router.navigate(['/dashboard/pvu/employee-creation'], { skipLocationChange: true });
                } else if (result && result['message']) {
                    self.toastr.error(result['message']);
                }
                this.isPaySaveDisabled = false;
            }, (err) => {
                this.isPaySaveDisabled = false;
                self.toastr.error(err);
            });
        } else {
            this.pvuService.savePayDetail(data).subscribe((result) => {
                if (result['status'] === 200) {
                    this.patchPayDetail(result['result']);
                    self.toastr.success(result['message']);
                    this.isPaySaveDisabled = false;
                    // if (this.action === 'add') {
                    // this.payDetailBtnDisable = true;
                    // }
                    if (type === 'SUBMIT') {
                        this.openWorkFlowPopUp();
                    }
                    // this.selectedIndex = 4;
                } else {
                    this.isPaySaveDisabled = false;
                    self.toastr.error(result['message']);
                }
            }, (err) => {
                this.isPaySaveDisabled = false;
                self.toastr.error(err);
            });
        }
    }

    /**
     * @description To update the Qualification exam remarks
     * @param event remarks event data
     * @param idx selected row index
     */
    updateQualRemarks(event, idx) {
        this.dataSourceQualification.data[idx].remarks = event.target.value;
        this.dataSourceQualification = new MatTableDataSource(this.dataSourceQualification.data);
    }

    /**
     * @description To update the Departmental exam remarks
     * @param event remarks event data
     * @param idx selected row index
     */
    updateDeptRemarks(event, idx) {
        this.dataSourceDeptExam.data[idx].remarks = event.target.value;
        this.dataSourceDeptExam = new MatTableDataSource(this.dataSourceDeptExam.data);
    }

    /**
     * @description To update the CCC exam remarks
     * @param event remarks event data
     * @param idx selected row index
     */
    updateCccRemarks(event, idx) {
        this.dataSourceSpclExam.data[idx].remarks = event.target.value;
        this.dataSourceSpclExam = new MatTableDataSource(this.dataSourceSpclExam.data);
    }

    /**
     * @description To update the language exam remarks
     * @param event remarks event data
     * @param idx selected row index
     */
    updateLangRemarks(event, idx) {
        this.dataSourceLangExam.data[idx].remarks = event.target.value;
        this.dataSourceLangExam = new MatTableDataSource(this.dataSourceLangExam.data);
    }

    changeExemtedRow(event, item) {
        if (event && event.value) {
            const tempStatus = this.deptExamStatusList.filter((r) => {
                return r.lookupInfoId === event.value;
            });
            if (tempStatus && tempStatus.length > 0) {
                item.examStatusName = tempStatus[0]['lookupInfoName'];
            }
        }
    }

    /**
     * @description To save exam and qualification details tab data
     * @param type 'DRAFT' or 'SUBMIT' type
     */
    saveQualificationDetails(type) {
        this.isQualSaveDisabled = true;
        let valid = true;
        const self = this;
        let isSkipValidatation = false;
        this.qualHighlight = false;
        this.deptHighlight = false;
        this.cccHighlight = false;
        this.langHighlight = false;
        if (type === 'DRAFT') {
            isSkipValidatation = true;
        }

        this.dataSourceQualification.data.forEach((element) => {
            if (element && element.degree !== 250) { // 250 id is for Illiterate option
                if (!(element.universityBoard && element.degree && element.passingYear)) {
                    if (!isSkipValidatation) {
                        this.qualHighlight = true;
                    }
                    valid = false;
                }
                if (element.isOtherCourseName && element.otherCourseName === '') {
                    if (!isSkipValidatation) {
                        this.qualHighlight = true;
                    }
                    valid = false;
                }
            }
        });

        // if (!this.exemptDept && !this.applicableDept) {
        //     this.toastr.error('Please Select the Departmental Exam Details');
        //     this.isQualSaveDisabled = false;
        //     return;
        // }

        this.dataSourceDeptExam.data.forEach((element) => {
            if (element.examStatus !== this.getExamStatusId('Exempted', 'dept')) {
                if (!(element.deptExamName && element.examBody &&
                    element.dateOfPassing !== ''
                    // && element.examAttempts && element.examAttempts !== '0'
                    )) {
                    if (!isSkipValidatation) {
                        this.deptHighlight = true;
                    }
                    valid = false;
                }
                if (!element.disabledeptHOD) {
                    if (element.examBody === 137) {
                        if ((element.otherDeptHodName === '')) {
                            if (!isSkipValidatation) {
                                this.deptHighlight = true;
                            }
                            valid = false;
                        }
                    } else {
                        if (!(element.deptHodName)) {
                            if (!isSkipValidatation) {
                                this.deptHighlight = true;
                            }
                            valid = false;
                        }
                    }
                }
                if (element['dateOfPassing'] !== '' && element['dateOfPassing'] != null) {
                    element['dateOfPassing'] = this.convertDateOnly(element['dateOfPassing']);
                }
            } else {
                if (!(element.remarks.trim())) {
                    if (!isSkipValidatation) {
                        this.deptHighlight = true;
                    }
                    valid = false;
                }
            }
        });

        // if ((this.exemptCCC || this.applicableCCC)
        //     && (this.dataSourceSpclExam.data && this.dataSourceSpclExam.data.length < 0)) {
        //     this.toastr.error('Please Select the CCC/ CCC+ Exam Details');
        //     this.isQualSaveDisabled = false;
        //     return;
        // }

        this.dataSourceSpclExam.data.forEach((element) => {
            if (element.examStatus !== this.getExamStatusId('Exempted', 'ccc')) {
                if (!(element.cccExamName && element.examBody && element.dateOfPassing
                    // &&
                    // element.dateOfExam
                    && element.examStatus && element.certificateNo !== '')) {
                    if (!isSkipValidatation) {
                        this.cccHighlight = true;
                    }
                    valid = false;
                }
                if (element['dateOfExam'] !== '' && element['dateOfExam'] !== null) {
                    element['dateOfExam'] = this.convertDateOnly(element['dateOfExam']);
                } else {
                    element['dateOfExam'] = '';
                }
                if (element['dateOfPassing'] !== '' && element['dateOfPassing'] !== null) {
                    element['dateOfPassing'] = this.convertDateOnly(element['dateOfPassing']);
                }
            } else {
                if (!element.remarks.trim()) {
                    if (!isSkipValidatation) {
                        this.cccHighlight = true;
                    }
                    valid = false;
                }
            }
        });

        // this.dataSourceLangExam.data.forEach((element) => {
        //     if (!(element.langName && element.examBody && element.examStatus && element.examType
        //         && element.dateOfPassing)) {
        //         if (!isSkipValidatation) {
        //             this.langHighlight = true;
        //         }
        //         valid = false;
        //     }
        //     if (element['dateOfPassing'] !== '' && element['dateOfPassing'] != null) {
        //         element['dateOfPassing'] = this.convertDateOnly(element['dateOfPassing']);
        //     }
        // });
        if (!valid && !isSkipValidatation) {
            this.toastr.error(MessageConst.VALIDATION.TOASTR);
            this.isQualSaveDisabled = false;
            return;
        }
        if (isSkipValidatation || valid) {
            const deptExamDataTemp = [], qualDatatemp = [];
            this.dataSourceDeptExam.data.forEach(deptExamData => {
                const obj = _.cloneDeep(deptExamData);
                delete obj['deptHodNameList'];
                deptExamDataTemp.push(obj);
            });
            this.dataSourceQualification.data.forEach(qualData => {
                const obj = _.cloneDeep(qualData);
                delete obj['courseNameList'];
                qualDatatemp.push(obj);
            });
            // tslint:disable-next-line:prefer-const
            let dataToSend = {
                exemptedDeptExamFlag: this.isDepExemptedStatus,
                exemptedDeptExam: (this.isDepExemptedStatus && this.dataSourceDeptExam.data
                    && this.dataSourceDeptExam.data.length > 0) ? _.cloneDeep(deptExamDataTemp[0]) : null,
                exemptedCccExamFlag: this.isCccExemptedStatus,
                exemptedCccExam: (this.isCccExemptedStatus && this.dataSourceSpclExam.data
                    && this.dataSourceSpclExam.data.length > 0)
                    ? _.cloneDeep(this.dataSourceSpclExam.data[0]) : null,
                pvuEmployeQualificationDto: _.cloneDeep(qualDatatemp),
                pvuEmployeDeptExamDetailsDto: !this.isDepExemptedStatus ? _.cloneDeep(deptExamDataTemp) : null,
                pvuEmployeCCCExamDetailDto: !this.isCccExemptedStatus ?
                    _.cloneDeep(this.dataSourceSpclExam.data) : null,
                pvuEmployeLangExamDto: (this.dataSourceLangExam.data && this.dataSourceLangExam.data.length > 0) ?
                    _.cloneDeep(this.dataSourceLangExam.data) : null,
            };
            if (dataToSend.exemptedDeptExam) {
                dataToSend.exemptedDeptExam['statusId'] = this.getStatusId('Saved as Draft');
                dataToSend.exemptedDeptExam['empId'] = this.empId;
            } else {
                dataToSend.exemptedDeptExam = null;
            }
            if (dataToSend.exemptedCccExam) {
                dataToSend.exemptedCccExam['statusId'] = this.getStatusId('Saved as Draft');
                dataToSend.exemptedCccExam['empId'] = this.empId;
            } else {
                dataToSend.exemptedCccExam = null;
            }
            if (dataToSend.pvuEmployeQualificationDto && dataToSend.pvuEmployeQualificationDto.length > 0) {
                dataToSend.pvuEmployeQualificationDto.forEach(element => {
                    element['statusId'] = this.getStatusId('Saved as Draft');
                    element['empId'] = this.empId;
                });
            } else {
                dataToSend.pvuEmployeQualificationDto = null;
            }
            if (dataToSend.pvuEmployeDeptExamDetailsDto && dataToSend.pvuEmployeDeptExamDetailsDto.length > 0) {
                dataToSend.pvuEmployeDeptExamDetailsDto.forEach(element => {
                    element['statusId'] = this.getStatusId('Saved as Draft');
                    element['empId'] = this.empId;
                });
            } else {
                dataToSend.pvuEmployeDeptExamDetailsDto = null;
            }
            if (dataToSend.pvuEmployeCCCExamDetailDto && dataToSend.pvuEmployeCCCExamDetailDto.length > 0) {
                dataToSend.pvuEmployeCCCExamDetailDto.forEach(element => {
                    element['statusId'] = this.getStatusId('Saved as Draft');
                    element['empId'] = this.empId;
                });
            } else {
                dataToSend.pvuEmployeCCCExamDetailDto = null;
            }
            if (dataToSend.pvuEmployeLangExamDto && dataToSend.pvuEmployeLangExamDto.length > 0) {
                dataToSend.pvuEmployeLangExamDto.forEach(element => {
                    element['statusId'] = this.getStatusId('Saved as Draft');
                    element['empId'] = this.empId;
                });
            } else {
                dataToSend.pvuEmployeLangExamDto = null;
            }

            if (this.action === 'edit') {
                if (this.ddoEditable || this.adminEditable) {
                    this.isQualSaveDisabled = false;
                    this.employeeSubmitData['qualification'] = [];
                    this.employeeDataService.checkQualificationDtoDifference(_.cloneDeep(dataToSend),
                        this.employeeSubmitData['qualification']);
                    this.selectedIndex = 2;

                } else {
                    this.pvuService.updateQualificationDetail(dataToSend).subscribe((qualRes) => {
                        if (qualRes && qualRes['result'] && qualRes['status'] === 200) {
                            self.toastr.success(qualRes['message']);
                            this.isQualSaveDisabled = false;
                            this.employeeDataExam = _.cloneDeep(qualRes['result']);
                            this.setQualificationDetail(qualRes['result']);
                            if (type !== 'DRAFT') {
                                setTimeout(() => { this.selectedIndex = 2; }, 500);
                            }
                        } else {
                            this.isQualSaveDisabled = false;
                            self.toastr.error(qualRes['message']);
                        }
                    },
                        (err) => {
                            this.isQualSaveDisabled = false;
                            self.toastr.error(err);
                        });
                }
            } else {
                this.pvuService.saveQualificationDetails(dataToSend).subscribe((res) => {
                    if (res && res['result'] && res['status'] === 200) {
                        self.toastr.success(res['message']);
                        this.isQualSaveDisabled = false;
                        this.employeeDataExam = _.cloneDeep(res['result']);
                        this.setQualificationDetail(res['result']);
                        if (type !== 'DRAFT') {
                            setTimeout(() => { this.selectedIndex = 2; });
                        }
                    } else {
                        this.isQualSaveDisabled = false;
                        self.toastr.error(res['message']);
                    }
                },
                    (err) => {
                        this.isQualSaveDisabled = false;
                        self.toastr.error(err);
                    });
            }
        } else {
            this.isQualSaveDisabled = false;
            this.toastr.error(MessageConst.VALIDATION.TOASTR);
        }
    }

    /**
     * @description To save the department details tab data
     * @param type 'DRAFT' or 'SUBMIT' type
     */
    saveDeptDetails(type) {
        this.isDeptSaveDisabled = true;
        let valid = true;
        const self = this;
        let isSkipValidatation = false;
        if (type === 'DRAFT') {
            isSkipValidatation = true;
        }
        if (!isSkipValidatation) {
            _.each(this.departmentalDetails.controls, function (control) {
                control.updateValueAndValidity();
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                    valid = false;
                }
            });
        }

        if (isSkipValidatation || valid) {
            const dataToSend = {
                pvuEmployeDepartmentDto: _.cloneDeep(this.departmentalDetails.value),
                pvuEmployeHistoryDto: _.cloneDeep(this.dataSource.data),
            };
            dataToSend.pvuEmployeDepartmentDto.dateOfJoiningGOG = this.convertDateOnly(
                this.departmentalDetails.controls.dateOfJoiningGOG.value);
            dataToSend.pvuEmployeDepartmentDto.dateOfRetirement = this.convertDateOnly(
                this.departmentalDetails.controls.dateOfRetirement.value);
            dataToSend.pvuEmployeDepartmentDto.deputationStartDate = this.convertDateOnly(
                this.departmentalDetails.controls.deputationStartDate.value);
            dataToSend.pvuEmployeDepartmentDto.deputationEndDate = this.convertDateOnly(
                this.departmentalDetails.controls.deputationEndDate.value);
            dataToSend.pvuEmployeDepartmentDto.deathTerminationDate = this.convertDateOnly(
                this.departmentalDetails.controls.deathTerminationDate.value);
            dataToSend.pvuEmployeDepartmentDto.fixPayDate = this.convertDateOnly(
                this.departmentalDetails.controls.fixPayDate.value);
            if (this.isSuspendedList) {
                const suspData = this.isSuspendedList.filter(suspObj => {
                    return suspObj['lookupInfoName'].toLowerCase() === 'Yes'.toLowerCase();
                })[0];
                if (suspData) {
                    if (dataToSend.pvuEmployeDepartmentDto['suspended'] === suspData.lookupInfoId) {
                        dataToSend.pvuEmployeDepartmentDto['suspended'] = true;
                    } else {
                        dataToSend.pvuEmployeDepartmentDto['suspended'] = false;
                    }
                } else {
                    dataToSend.pvuEmployeDepartmentDto['suspended'] = false;
                }
            }
            dataToSend.pvuEmployeDepartmentDto['presentOffice'] = this.presentOfficeId;
            dataToSend.pvuEmployeDepartmentDto['empId'] = this.empId;
            dataToSend.pvuEmployeDepartmentDto['statusId'] = this.getStatusId('Saved as Draft');
            dataToSend.pvuEmployeHistoryDto.forEach(element => {
                element['empId'] = this.empId;
            });
            if (this.action === 'edit') {
                if (dataToSend.pvuEmployeDepartmentDto !== null) {
                    dataToSend.pvuEmployeDepartmentDto['departmentId'] = this.departmentId;
                }
                if (this.ddoEditable || this.adminEditable) {
                    this.isDeptSaveDisabled = false;
                    // tslint:disable-next-line:max-line-length
                    this.employeeSubmitData['department'] = [];
                    this.employeeDataService.checkEmplDepartmentDtoDiff(_.cloneDeep(dataToSend.pvuEmployeDepartmentDto)
                        , this.employeeSubmitData['department']);
                    const historyArray = this.empHistoryArray.concat(dataToSend.pvuEmployeHistoryDto);
                    this.employeeSubmitData['history'] = [];
                    this.employeeDataService.checkEmplHistoryDiff(historyArray,
                        this.employeeSubmitData['history']);
                    if (dataToSend.pvuEmployeHistoryDto && dataToSend.pvuEmployeHistoryDto.length > 0) {
                        this.listshow = true;
                        this.prevEmpHistory = false;
                    }
                    if (dataToSend.pvuEmployeDepartmentDto !== null) {
                        this.departmentId = dataToSend.pvuEmployeDepartmentDto.departmentId;
                        this.departmentCategoryIdSelected = dataToSend.pvuEmployeDepartmentDto.departmentalCategory;
                        this.payCommissionChange();
                    }
                    this.getPayMasters();
                    this.selectedIndex = 3;
                } else {
                    this.pvuService.saveDepartmentalDetails(dataToSend).subscribe((res) => {
                        if (res && res['result'] && res['status'] === 200) {
                            self.toastr.success(res['message']);
                            this.isDeptSaveDisabled = false;
                            if (res['result'].pvuEmployeHistoryDto && res['result'].pvuEmployeHistoryDto.length > 0) {
                                this.prevEmpHistory = true;
                                this.dataSource.data = res['result'].pvuEmployeHistoryDto;
                                this.dataSource.data.forEach((emplHistObj) => {
                                    if (this.employementTypeList) {
                                        const emplType = this.employementTypeList.filter(emplObj => {
                                            return emplObj.lookupInfoId === emplHistObj.employementType;
                                        })[0];
                                        if (emplType) {
                                            emplHistObj.employementTypeName = emplType.lookupInfoName;
                                        }
                                    }
                                    if (this.empServiceContinuationList) {
                                        const isService = this.empServiceContinuationList.filter(servObj => {
                                            return servObj.lookupInfoId === emplHistObj.empServiceContinuation;
                                        })[0];
                                        if (isService) {
                                            emplHistObj.empServiceContinuationName = isService.lookupInfoName;
                                        }
                                    }
                                });
                                this.listshow = true;
                                this.prevEmpHistory = false;
                            } else {
                                this.prevEmpHistory = false;
                            }
                            const detail = res['result'].pvuEmployeDepartmentDto;
                            if (detail !== null) {
                                this.departmentId = detail.departmentId;
                                this.departmentCategoryIdSelected = detail.departmentalCategory;
                                this.payCommissionChange();
                            }
                            this.getPayMasters();
                            if (type !== 'DRAFT') {
                                setTimeout(() => { this.selectedIndex = 3; });
                            }
                        } else {
                            this.isDeptSaveDisabled = false;
                            self.toastr.error(res['message']);
                        }
                    },
                        (err) => {
                            this.isDeptSaveDisabled = false;
                            self.toastr.error(err);
                        });
                }
            } else {
                if (this.departmentId) {
                    dataToSend.pvuEmployeDepartmentDto['departmentId'] = this.departmentId;
                }
                this.pvuService.saveDepartmentalDetails(dataToSend).subscribe((res) => {
                    if (res && res['result'] && res['status'] === 200) {
                        self.toastr.success(res['message']);
                        this.isDeptSaveDisabled = false;

                        if (res['result'].pvuEmployeHistoryDto && res['result'].pvuEmployeHistoryDto.length > 0) {
                            this.prevEmpHistory = true;
                            this.dataSource.data = res['result'].pvuEmployeHistoryDto;
                            this.dataSource.data.forEach((histObj1) => {
                                if (this.employementTypeList) {
                                    const emplType = this.employementTypeList.filter(emplObj => {
                                        return emplObj.lookupInfoId === histObj1.employementType;
                                    })[0];
                                    if (emplType) {
                                        histObj1.employementTypeName = emplType.lookupInfoName;
                                    }
                                }
                                if (this.empServiceContinuationList) {
                                    const isService = this.empServiceContinuationList.filter(servObj => {
                                        return servObj.lookupInfoId === histObj1.empServiceContinuation;
                                    })[0];
                                    if (isService) {
                                        histObj1.empServiceContinuationName = isService.lookupInfoName;
                                    }
                                }
                            });
                            this.listshow = true;
                            this.prevEmpHistory = false;
                        } else {
                            this.prevEmpHistory = false;
                        }

                        const detail = res['result'].pvuEmployeDepartmentDto;
                        if (detail !== null) {
                            this.departmentId = detail.departmentId;
                            this.departmentCategoryIdSelected = detail.departmentalCategory;
                            this.payCommissionChange();
                        }
                        this.getPayMasters();
                        if (type !== 'DRAFT') {
                            setTimeout(() => { this.selectedIndex = 3; });
                        }
                    } else {
                        this.isDeptSaveDisabled = false;
                        self.toastr.error(res['message']);
                    }
                },
                    (err) => {
                        this.isDeptSaveDisabled = false;
                        self.toastr.error(err);
                    });
            }
        } else {
            this.isDeptSaveDisabled = false;
            self.toastr.error(MessageConst.VALIDATION.TOASTR);
        }
    }

    /**
     * @description To allow decimal with only two decimal point
     * @param event keypress event data
     */
    decimalKeyPress(event: any) {
        this.toggleRequireTag6th();
        const pattern = /^\d+(\.\d{0,2})?$/;
        const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        let tempstr = event.target.value;
        tempstr += inputChar;

        if (!pattern.test(tempstr)) {
            event.preventDefault();
            return false;
        }
    }

    /**
     * @description to allow percentage betwee 1 and 100 only
     * @param event keypress event data
     */
    percentKeyPress(event: any) {
        const pattern = /^[1-9]{1}\d{0,1}(\.\d{0,2})?$|^(100)(\.[0]{1,2})?$/;
        const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        let tempstr = event.target.value;

        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        if (Number(tempstr.substr(start, end - start)) === Number(tempstr)) {
            tempstr = '';
        }
        // tempstr += inputChar;
        tempstr = tempstr.substr(0, start) + inputChar + tempstr.substr(start);

        if (!pattern.test(tempstr)) {
            event.preventDefault();
            return false;
        }
    }

    /**
     * @description To set two decimal point
     * @param data selected row data
     * @param key key name
     */
    decimalPoint(data, key) {
        if (isNaN(data[key]) || data[key] === '') {
            data[key] = '';
        } else {
            data[key] = Number(data[key]).toFixed(2);
        }
    }

    /**
     * @description To allow only integer keypress
     * @param event Key press event data
     */
    integerKeyPress(event: any) {
        const pattern = /^\d{0,5}?$/;
        const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        const keystobepassedout = '$Backspace$Delete$Home$Tab$ArrowLeft$ArrowRight$ArrowUp$ArrowDown$End$';
        if (keystobepassedout.indexOf('$' + event.key + '$') !== -1) {
            return true;
        }
        if (event.target.value.length > 5) {
            event.preventDefault();
            return false;
        }

        if (!pattern.test(inputChar)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    /**
     * @description To set the permanent address, same as current address
     * @param data same as current address boolean
     */
    onClick(data) {
        if (this.action === 'view' || this.ddoEditable) {
            return false;
        }
        let isRemoved = false;
        this.sameAsCurrentAddr = !data;
        const nationValue = this.createEmployeeForm.get('nationality').value;
        const selectedObj = this.findArrayIndex(this.nationalityList, 'lookupInfoId', nationValue);
        if (selectedObj.lookupInfoName.indexOf('Nepal') >= 0 || selectedObj.lookupInfoName.indexOf('Bhutan') >= 0) {
            isRemoved = true;
        }
        if (this.sameAsCurrentAddr) {
            this.getDistricts(this.createEmployeeForm.value.curState, 'per');
            this.getTalukas(this.createEmployeeForm.value.curDistrict, 'per');

            this.createEmployeeForm.patchValue({
                perAddress1: this.createEmployeeForm.value.curAddress1.toUpperCase(),
                perAddress2: this.createEmployeeForm.value.curAddress2.toUpperCase(),
                perState: !isRemoved ? this.createEmployeeForm.value.curState : '',
                perDistrict: !isRemoved ? this.createEmployeeForm.value.curDistrict : '',
                perTaluka: !isRemoved ? this.createEmployeeForm.value.curTaluka : '',
                perOtherTaluka: !isRemoved ? this.createEmployeeForm.value.curOtherTaluka : '',
                perCity: !isRemoved ? this.createEmployeeForm.value.curCity : '',
                perPinCode: !isRemoved ? this.createEmployeeForm.value.curPinCode : ''
            });
        } else {
            this.createEmployeeForm.patchValue({
                perAddress1: '',
                perAddress2: '',
                perState: '',
                perDistrict: '',
                perTaluka: '',
                perOtherTaluka: '',
                perCity: '',
                perPinCode: ''
            });
        }
    }

    /**
     * @description To set native address, same as current address or same as permanent address
     */
    onClickAdd() {
        let isRemoved = false;
        if (this.createEmployeeForm.value.isNatAddCurAddPerAdd === 'sameAsCurrentAddr') {
            this.getDistricts(this.createEmployeeForm.value.curState, 'nat');
            this.getTalukas(this.createEmployeeForm.value.curDistrict, 'nat');
            const nationValue = this.createEmployeeForm.get('nationality').value;
            const selectedObj = this.findArrayIndex(this.nationalityList, 'lookupInfoId', nationValue);
            if (selectedObj.lookupInfoName.indexOf('Nepal') >= 0 || selectedObj.lookupInfoName.indexOf('Bhutan') >= 0) {
                isRemoved = true;
            }
            this.createEmployeeForm.patchValue({
                natAddress1: this.createEmployeeForm.value.curAddress1.toUpperCase(),
                natAddress2: this.createEmployeeForm.value.curAddress2.toUpperCase(),
                natState: !isRemoved ? this.createEmployeeForm.value.curState : '',
                natDistrict: !isRemoved ? this.createEmployeeForm.value.curDistrict : '',
                natTaluka: !isRemoved ? this.createEmployeeForm.value.curTaluka : '',
                natOtherTaluka: !isRemoved ? this.createEmployeeForm.value.curOtherTaluka : '',
                natCity: !isRemoved ? this.createEmployeeForm.value.curCity : '',
                natPinCode: !isRemoved ? this.createEmployeeForm.value.curPinCode : ''
            });
        } else if (this.createEmployeeForm.value.isNatAddCurAddPerAdd === 'sameAsPermanentAddr') {
            this.getDistricts(this.createEmployeeForm.value.perState, 'nat');
            this.getTalukas(this.createEmployeeForm.value.perDistrict, 'nat');
            this.createEmployeeForm.patchValue({
                natAddress1: this.createEmployeeForm.value.perAddress1.toUpperCase(),
                natAddress2: this.createEmployeeForm.value.perAddress2.toUpperCase(),
                natState: this.createEmployeeForm.value.perState,
                natDistrict: this.createEmployeeForm.value.perDistrict,
                natTaluka: this.createEmployeeForm.value.perTaluka,
                natOtherTaluka: this.createEmployeeForm.value.perOtherTaluka,
                natCity: this.createEmployeeForm.value.perCity,
                natPinCode: this.createEmployeeForm.value.perPinCode
            });
        }
    }

    /**
     * @description To add the qualification exam row
     */
    addQualification() {
        if (this.dataSourceQualification && this.dataSourceQualification.data) {
            if (this.dataSourceQualification.data.length === 1
                && this.dataSourceQualification.data[0].degree === 250) { // 250 id is for Illiterate degree option
                this.toastr.error('You can not select Illiterate with any other degree');
                return false;
            }
            this.dataSourceQualification.data.forEach((element, index) => {
                if ((this.dataSourceQualification.data.length === (index + 1))) {
                    if (element && element.degree !== 250) { // 250 id is for Illiterate degree option
                        if (element && element.degree && element.passingYear && element.universityBoard) {
                            this.addEmptyRowInQualification();
                        } else if (this.dataSourceQualification && this.dataSourceQualification.data) {
                            this.toastr.error(MessageConst.VALIDATION.TOASTR);
                        }
                    } else {
                        this.addEmptyRowInQualification();
                    }
                }
            });
        }
    }

    /**
     * @description To add empty row in the Qualification Table
     */
    addEmptyRowInQualification() {
        const p_data = this.dataSourceQualification.data;
        p_data.push({
            empQualiId: 0, degree: 0, courseName: '', isOtherCourseName: false,
            otherCourseName: '', passingYear: '', schoolCollege: '', universityBoard: '',
            percentageCGPA: '', remarks: ''
        });
        this.dataSourceQualification.data = p_data;
        this.courseCtrl.push(new FormControl());
        this.degreeCtrl.push(new FormControl());
        this.passingYearCtrl.push(new FormControl());
    }

    /**
     * @description To check the uniqueness of degree and course name in qualification  table
     * @param clmName column name either 'degree' or 'course'
     * @param item selected row data
     * @param index selected row index
     */
    degreeCourseUniqueCheck(clmName, item, index, event) {
        const self = this;
        let name = '';
        let repeatFlag = false;
        const tempItem = _.cloneDeep(item);
        if (clmName === 'degree') {
            item.degree = event.value;
        } else if (clmName === 'course') {
            item.courseName = event.value;
        }

        self.dataSourceQualification.data.forEach((qualObj, idx) => {
            if (index !== idx) {
                if (Number(item.degree) === Number(qualObj.degree) &&
                    Number(item.courseName) === Number(qualObj.courseName) &&
                    !(item.courseName === 251 || item.courseName === 252 || item.courseName === 253)) {
                    if (clmName === 'degree') {
                        name = self.degreeList.filter(degObj => {
                            return degObj.id === item.degree;
                        })[0].name;
                    } else if (clmName === 'course') {
                        name = item.courseNameList.filter(courseObj => {
                            return courseObj.id === item.courseName;
                        })[0].name;
                    }
                    repeatFlag = true;
                }
            }
        });
        if (repeatFlag && name) {
            self.toastr.error('"' + name + '" is already selected.');
            if (clmName === 'degree') {
                setTimeout(() => {
                    self.dataSourceQualification.data[index].degree = _.cloneDeep(tempItem.degree);
                    item.degree = _.cloneDeep(tempItem.degree);
                }, 0);
            } else if (clmName === 'course') {
                setTimeout(() => {
                    self.dataSourceQualification.data[index].courseName = _.cloneDeep(tempItem.courseName);
                    item.courseName = _.cloneDeep(tempItem.courseName);
                }, 0);
            }
        }
        if (clmName === 'degree') {
            self.onChangeSchoolDegree(event, item);
        } else if (clmName === 'course') {
            self.onCourseNameSelect(item);
        }
    }

    /**
     * @description To delete the qualification
     * @param ID Qualification Id
     * @param index Selected Row index of qualification table
     */
    deleteQualification(ID, index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (ID && (Number(ID) !== 0)) {
                    const dataToSend = {
                        id: ID,
                    };
                    dataToSend['activeStatus'] = 0;
                    this.pvuService.deleteQualExam(dataToSend).subscribe((res) => {
                        if (res && res['status'] === 200) {
                            if (res['message']) {
                                this.toastr.success(res['message']);
                            }
                            this.spliceDeletedQualification(index);
                        }
                    }, (err) => {
                        this.toastr.error(err);
                    });
                } else {
                    this.spliceDeletedQualification(index);
                }
            }
        });
    }

    /**
     * @description to splice the deleted qualification from data source table
     * @param index deleted row index
     */
    spliceDeletedQualification(index) {
        this.dataSourceQualification.data.splice(index, 1);
        this.courseCtrl.splice(index, 1);
        this.degreeCtrl.splice(index, 1);
        this.passingYearCtrl.splice(index, 1);
        this.dataSourceQualification = new MatTableDataSource(this.dataSourceQualification.data);
    }

    /**
     * @description To add departmental exam row in departmental exam datasource table
     */
    addDeptExam() {
        if (this.dataSourceDeptExam && this.dataSourceDeptExam.data) {
            this.dataSourceDeptExam.data.forEach((element, index) => {
                if ((this.dataSourceDeptExam.data.length === (index + 1)) && element && element.deptExamName &&
                    element.examBody && element.dateOfPassing && element.examStatus
                    // && element.examAttempts
                    ) {
                    const p_data = this.dataSourceDeptExam.data;
                    p_data.push({
                        empDeptExamDetailId: 0, deptExamName: '', examBody: 0, deptHodName: 0,
                        otherDeptHodName: '', dateOfPassing: '',
                        examStatus: this.getExamStatusId('Pass', 'dept'),
                        examAttempts: '', remarks: '', disabledeptHOD: false,
                    });
                    this.examBodyCtrl.push(new FormControl());
                    this.deptHodNameCtrl.push(new FormControl());
                    this.deptExamStatusCtrl.push(new FormControl());
                    this.dataSourceDeptExam.data = p_data;
                } else if (this.dataSourceDeptExam && this.dataSourceDeptExam.data &&
                    this.dataSourceDeptExam.data.length === (index + 1)) {
                    this.toastr.error(MessageConst.VALIDATION.TOASTR);
                }
            });
        }
    }

    /**
     * @description To delete the departmental exam row.
     * @param ID departmental exam id
     * @param index selected row index
     */
    deleteDeptExam(ID, index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (ID) {
                    const dataToSend = {
                        id: ID,
                    };
                    dataToSend['activeStatus'] = 0;
                    this.pvuService.deleteDeptExam(dataToSend).subscribe((res) => {
                        if (res && res['status'] === 200) {
                            if (res['message']) {
                                this.toastr.success(res['message']);
                            }
                            this.dataSourceDeptExam.data.splice(index, 1);
                            this.examBodyCtrl.splice(index, 1);
                            this.deptHodNameCtrl.splice(index, 1);
                            this.deptExamStatusCtrl.splice(index, 1);
                            this.dataSourceDeptExam = new MatTableDataSource(this.dataSourceDeptExam.data);
                        }
                    }, (err) => {
                        this.toastr.error(err);
                    });
                } else {
                    this.dataSourceDeptExam.data.splice(index, 1);
                    this.examBodyCtrl.splice(index, 1);
                    this.deptHodNameCtrl.splice(index, 1);
                    this.deptExamStatusCtrl.splice(index, 1);
                    this.dataSourceDeptExam = new MatTableDataSource(this.dataSourceDeptExam.data);
                }
            }
        });

    }

    /**
     * @description to check the nominee share validation on nominee share blur
     * @param item selected nominee row data
     */
    nomineeShareBlur(item) {
        if (this.dataSourceNominee && this.dataSourceNominee.data && this.dataSourceNominee.data.length > 0) {
            let nomineePercentage = 0;
            this.dataSourceNominee.data.forEach(element => {
                nomineePercentage += Number(element.nomineeShare);
            });
            if (nomineePercentage > 100) {
                item.nomineeShare = '';
                this.toastr.error(pvuMessage.NOM_PER_ERR);
                return item;
            }
        }
    }

    /**
     * @description To add nominee row in nominee table
     */
    addNominee() {
        if (this.dataSourceNominee && this.dataSourceNominee.data) {
            let nomineePercentage = 0;
            this.dataSourceNominee.data.forEach((element, index) => {
                nomineePercentage += Number(element.nomineeShare);
                if ((this.dataSourceNominee.data.length === (index + 1)) && element && element.relationship &&
                    element.nomineeName && element.nomineeAddress && element.nomineeAge && element.nomineeShare &&
                    !element.fileBrowseNpsForm) {
                    if (nomineePercentage < 100) {
                        this.nomineeHighlight = false;
                        const p_data = this.dataSourceNominee.data;
                        p_data.push({
                            empNomineeId: '0', relationship: '', otherRelationship: '', nomineeName: '',
                            nomineeAddress: '', nomineeAge: '', nomineeShare: '',
                            photoOfNominee: '', genNomiForm: '', npsNomiForm: '', fileBrowseNpsForm: true,
                            fileBrowseNomi: true, fileBrowseGenForm: true, isOtherRelation: false,
                            nomineePhotoName: '', genNomineeFormName: '', npsNomineeFormName: '',
                        });
                        this.relationshipCtrl.push(new FormControl());
                        this.dataSourceNominee.data = p_data;
                    } else {
                        this.toastr.error(pvuMessage.NOMINEE_SHARE_GREATER);
                    }
                } else if (this.dataSourceNominee.data.length === (index + 1)) {
                    this.toastr.error(MessageConst.VALIDATION.TOASTR_NOMINEE);
                }
            });
        }
    }

    /**
     * @description To delete the nominee row
     * @param ID selected nomunee id
     * @param index selected row index
     */
    deleteNominee(ID, index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (ID && Number(ID) !== 0) {
                    if (this.ddoEditable || this.adminEditable) {
                        const empnominee = this.dataSourceNominee.data.splice(index, 1);
                        if (empnominee && empnominee.length === 1) {
                            this.empNomineeArray.push(this.employeeDataService.setDeleteType(empnominee[0]));
                            this.relationshipCtrl.splice(index, 1);
                            this.toastr.info(pvuMessage.EDIT_NOMINEE_DELETE);
                            this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
                        }
                    } else {
                        const dataToSend = {
                            id: ID,
                        };
                        dataToSend['activeStatus'] = 0;
                        this.pvuService.deleteNominee(dataToSend).subscribe((res) => {
                            if (res && res['status'] === 200) {
                                if (res['message']) {
                                    this.toastr.success(res['message']);
                                }
                                this.dataSourceNominee.data.splice(index, 1);
                                this.relationshipCtrl.splice(index, 1);
                                this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
                            }
                        }, (err) => {
                            this.toastr.error(err);
                        });
                    }
                } else {
                    this.dataSourceNominee.data.splice(index, 1);
                    this.relationshipCtrl.splice(index, 1);
                    this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
                }
            }
        });
    }

    /**
     * @description To add the special exam row
     */
    addSpclExam() {
        if (this.dataSourceSpclExam && this.dataSourceSpclExam.data) {
            const cccExamList = [];
            this.dataSourceSpclExam.data.forEach((element, index) => {
                cccExamList.push(element.cccExamName);
                if ((this.dataSourceSpclExam.data.length === (index + 1)) && element && element.cccExamName &&
                    element.examBody
                    // && element.dateOfExam
                    && element.dateOfPassing && element.examStatus &&
                    element.certificateNo) {
                    element.cccExamNameDisable = true;
                    const examList = this.cccExamNameData.filter(examObj => {
                        return cccExamList.indexOf(examObj.lookupInfoId) === -1;
                    });
                    const p_data = this.dataSourceSpclExam.data;
                    p_data.push({
                        empCCCExamDetailId: 0, cccExamName: 0, cccExamNameList: examList,
                        cccExamNameDisable: false, examBody: 0, dateOfExam: '', dateOfPassing: '',
                        examStatus: this.getExamStatusId('Pass', 'ccc'), certificateNo: '', remarks: ''
                    });
                    this.cccExamNameCtrl.push(new FormControl());
                    this.cccExamBodyCtrl.push(new FormControl());
                    this.cccExamStatusCtrl.push(new FormControl());
                    this.dataSourceSpclExam.data = p_data;
                } else if (this.dataSourceSpclExam && this.dataSourceSpclExam.data &&
                    this.dataSourceSpclExam.data.length === (index + 1)) {
                    this.toastr.error(MessageConst.VALIDATION.TOASTR);
                } else {
                    element.cccExamNameDisable = true;
                }
            });
        }
    }

    /**
     * @description To delete the special exam row
     * @param ID selected splecial exam id
     * @param index selected row index
     */
    deleteSpclExam(ID, index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (ID) {
                    const dataToSend = {
                        id: ID,
                    };
                    dataToSend['activeStatus'] = 0;
                    this.pvuService.deleteCCCExam(dataToSend).subscribe((res) => {
                        if (res && res['status'] === 200) {
                            if (res['message']) {
                                this.toastr.success(res['message']);
                            }
                            this.spliceDeletedSpclExamRow(index);
                        }
                    }, (err) => {
                        this.toastr.error(err);
                    });
                } else {
                    this.spliceDeletedSpclExamRow(index);
                }
            }
        });
    }

    /**
     * @description To splice the selected row of special exam row from datasource
     * @param index selected row index
     */
    spliceDeletedSpclExamRow(index) {
        this.dataSourceSpclExam.data.splice(index, 1);
        this.cccExamNameCtrl.splice(index, 1);
        this.cccExamBodyCtrl.splice(index, 1);
        this.cccExamStatusCtrl.splice(index, 1);
        const lastIdx = this.dataSourceSpclExam.data.length - 1;
        this.dataSourceSpclExam.data[lastIdx]['cccExamNameDisable'] = false;
        const cccExamList = [];
        this.dataSourceSpclExam.data.forEach(spclExamObj => {
            cccExamList.push(spclExamObj.cccExamName);
        });
        if (this.dataSourceSpclExam.data[lastIdx]['cccExamName']) {
            this.dataSourceSpclExam.data[lastIdx]['cccExamNameList'] = this.cccExamNameData.filter(examObj => {
                return cccExamList.indexOf(examObj.lookupInfoId) === -1 ||
                    examObj.lookupInfoId === this.dataSourceSpclExam.data[lastIdx]['cccExamName'];
            });
        } else {
            this.dataSourceSpclExam.data[lastIdx]['cccExamNameList'] = this.cccExamNameData.filter(examObj => {
                return cccExamList.indexOf(examObj.lookupInfoId) === -1;
            });
        }
        this.dataSourceSpclExam = new MatTableDataSource(this.dataSourceSpclExam.data);
    }

    /**
     * @description To add the language exam row
     */
    addLangExam() {
        if (this.dataSourceLangExam && this.dataSourceLangExam.data && this.dataSourceLangExam.data.length > 0) {
            const langNameArr = [];
            this.dataSourceLangExam.data.forEach((element, index) => {
                langNameArr.push(element.langName);
                if ((this.dataSourceLangExam.data.length === (index + 1)) && element &&
                    element.langName && element.examBody && element.examType && element.dateOfPassing
                    && element.examStatus) {
                    element.langNameDisable = true;
                    element.examTypeDisable = true;
                    const p_data = this.dataSourceLangExam.data;
                    let languageList = [];
                    const unique = langNameArr.filter((item, i, ar) => ar.indexOf(item) === i);
                    if (unique && unique.length > 0) {
                        if (unique.length === 1 && langNameArr.length === 2) {
                            unique.forEach(unqObj => {
                                languageList.push(this.langNameList.filter((langListObj) => {
                                    return langListObj.lookupInfoId !== unqObj;
                                })[0]);
                            });
                        } else if (unique.length === 1 && langNameArr.length === 1) {
                            languageList = _.cloneDeep(this.langNameList);
                        } else {
                            unique.forEach(unqObj => {
                                const count = langNameArr.filter(lang => {
                                    return lang === unqObj;
                                }).length;
                                if (count < 2) {
                                    languageList.push(this.langNameList.filter((langListObj) => {
                                        return langListObj.lookupInfoId === unqObj;
                                    })[0]);
                                }
                            });
                        }
                    } else {
                        languageList = _.cloneDeep(this.langNameList);
                    }
                    p_data.push({
                        empLangExamId: 0, langName: 0, langNameDisable: false, langNameList: languageList, examBody: '',
                        examType: 0, examTypeDisable: false, dateOfPassing: '', seatNo: '',
                        examStatus: 0, remarks: ''
                    });
                    this.langNameCtrl.push(new FormControl());
                    this.langExamTypeCtrl.push(new FormControl());
                    this.langExamStatusCtrl.push(new FormControl());
                    this.dataSourceLangExam.data = p_data;
                } else if (this.dataSourceLangExam && this.dataSourceLangExam.data &&
                    this.dataSourceLangExam.data.length === (index + 1)) {
                    this.toastr.error(MessageConst.VALIDATION.TOASTR);
                } else {
                    element.langNameDisable = true;
                    element.examTypeDisable = true;
                }
            });
        } else {
            const p_data = [{
                empLangExamId: 0, langName: 0, langNameDisable: false, langNameList: this.langNameList, examBody: '',
                examType: 0, examTypeDisable: false, dateOfPassing: '', seatNo: '',
                examStatus: 0, remarks: ''
            }];
            this.langNameCtrl.push(new FormControl());
            this.langExamTypeCtrl.push(new FormControl());
            this.langExamStatusCtrl.push(new FormControl());
            this.dataSourceLangExam = new MatTableDataSource(p_data);
        }
    }

    /**
     * @description to load the exam type dropdown list
     * @param item selected row data
     * @param index selected row index
     */
    loadExamType(item, index) {
        const langNameObj = [];
        this.dataSourceLangExam.data.forEach((langObj, indx) => {
            if (index !== indx && item.langName === langObj.langName) {
                langNameObj.push(langObj);
            }
        });
        this.dataSourceLangExam.data.forEach((ele, idx) => {
            if (idx === index) {
                ele.examType = null;
                if (langNameObj && langNameObj.length === 1) {
                    ele.langTypeList = this.langTypeList.filter(typeObj => {
                        return typeObj.lookupInfoId !== langNameObj[0].examType;
                    });
                } else if (langNameObj && langNameObj.length === 2) {
                    ele.langTypeList = [];
                } else {
                    ele.langTypeList = _.cloneDeep(this.langTypeList);
                }
            }
        });
        this.dataSourceLangExam = new MatTableDataSource(this.dataSourceLangExam.data);
    }

    /**
     * @description To delete the Language Exam records
     * @param ID Language exam records id
     * @param index index of element of language exam array
     */
    deleteLangExam(ID, index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (ID) {
                    const dataToSend = {
                        id: ID,
                    };
                    dataToSend['activeStatus'] = 0;
                    this.pvuService.deleteLangExam(dataToSend).subscribe((res) => {
                        if (res && res['status'] === 200) {
                            if (res['message']) {
                                this.toastr.success(res['message']);
                            }
                            this.spliceDeletedLanguage(index);
                        }
                    }, (err) => {
                        this.toastr.error(err);
                    });
                } else {
                    this.spliceDeletedLanguage(index);
                }
            }
        });
    }

    /**
     * @description To splice the deleted row from table
     * @param index selected row index
     */
    spliceDeletedLanguage(index) {
        this.dataSourceLangExam.data.splice(index, 1);
        this.langNameCtrl.splice(index, 1);
        this.langExamTypeCtrl.splice(index, 1);
        this.langExamStatusCtrl.splice(index, 1);
        if (this.dataSourceLangExam.data && this.dataSourceLangExam.data.length > 0) {
            const lastIdx = this.dataSourceLangExam.data.length - 1;
            this.dataSourceLangExam.data[lastIdx]['langNameDisable'] = false;
            this.dataSourceLangExam.data[lastIdx]['examTypeDisable'] = false;
            const langList = [];
            const langTypeList = [];
            this.dataSourceLangExam.data.forEach((langObj, idx) => {
                if (idx !== lastIdx) {
                    langList.push(langObj.langName);
                    langTypeList.push(langObj.examType);
                }
            });
            const languageList = this.getLanguageList(langList, this.langNameList); // to get the language name list
            const languageTypeList = this.getLanguageList(langTypeList, this.langTypeList); // to get languageType list
            this.dataSourceLangExam.data[lastIdx]['langNameList'] = languageList;
            this.dataSourceLangExam.data[lastIdx]['langTypeList'] = languageTypeList;
        }
        this.dataSourceLangExam = new MatTableDataSource(this.dataSourceLangExam.data);
    }

    /**
     * @description To get the selected file data of Employee Photo
     * @param fileSelected selected file data
     */
    onEmplPhotoSelection(fileSelected) {
        const fileType = ['jpg', 'jpeg', 'png'];

        // tslint:disable-next-line:no-inferrable-types
        let fileAllowed: boolean = false;
        // tslint:disable-next-line:no-inferrable-types
        let fileSizeAllowed: boolean = false;
        if (fileSelected.target && fileSelected.target.files) {
            fileType.forEach(el => {
                if (el.toLowerCase() === fileSelected.target.files[0].name.split('.').pop().toLowerCase()) {
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    fileAllowed = true;
                    if (fileSizeInKb <= 300) {
                        fileSizeAllowed = true;
                        this.fileData = fileSelected.target.files[0];
                        this.fileDetailsEmp = true;
                        let reader = new FileReader();
                        reader.onload = e => this.empViewPhoto = e.target.result;
                        reader.readAsDataURL(this.fileData);
                    }
                }
            });
        }
        if (!fileAllowed) {
            this.empPhoto.nativeElement.value = '';
            this.toastr.error(this.errorMessages.UPLOAD_PHOTO_TYPE_ERR);
            this.fileBrowseEmp = false;
            this.fileData = null;
            return;
        }
        if (!fileSizeAllowed) {
            this.empPhoto.nativeElement.value = '';
            this.toastr.error(this.errorMessages.EMPL_PHOTO_SIZE_ERR);
            this.fileBrowseEmp = false;
            this.fileData = null;
        }
    }

    openFileSelector1() {
        this.el.nativeElement.querySelector('#fileBrowse-emp').click();
    }

    /**
     * @description To validate the selected course
     * @param item selected row data
     */
    onCourseNameSelect(item) {
        const prevCccExemptedFlag = this.cccExemptedFlag;
        this.cccExemptedFlag = false;
        if (this.dataSourceQualification && this.dataSourceQualification.data
            && this.dataSourceQualification.data.length > 0
            && this.cccExemptedArray && this.cccExemptedArray.length !== 0) {
            const courseData = _.cloneDeep(this.dataSourceQualification.data);
            courseData.forEach(courseEle => {
                if (this.cccExemptedArray.indexOf(courseEle.courseName) !== -1) {
                    this.cccExemptedFlag = true;
                }
            });
        } else {
            this.cccExemptedFlag = false;
        }

        const isSpecialExam = this.dataSourceSpclExam.data.length < 1;

        // if (this.cccExemptedFlag && !prevCccExemptedFlag) {
        //     this.onClickCCCExamExempted({ 'value': 'Exempted' });
        // } else if (!this.cccExemptedFlag) {
        //     this.onClickCCCExamExempted({ 'value': 'Pass' });
        // }

        if (isSpecialExam) {
            this.exemptCCC = false;
            this.applicableCCC = false;
            this.isCCCExamApplicable = false;
            this.isCccExemptedStatus = true;
            this.dataSourceSpclExam = new MatTableDataSource();
        }

        if (item.courseName === 251 || item.courseName === 252 || item.courseName === 253) {
            item.isOtherCourseName = true;
            return true;
        } else {
            item.isOtherCourseName = false;
            item.otherCourseName = '';
            return false;
        }
    }

    /**
     * @description To set validation for departmental exam based on th exemted or applicable selection
     * @param event event data
     */
    onClickDeptExamExempted(event) {
        if (event.value === 'Exempted') {
            const p_data = [];
            p_data.push({
                deptExamName: '', examBody: 0, deptHodName: 0, otherDeptHodName: '', dateOfPassing: '',
                examStatus: 0, examAttempts: '', remarks: ''
            });
            this.examBodyCtrl = [new FormControl()];
            this.deptHodNameCtrl = [new FormControl()];
            this.deptExamStatusCtrl = [new FormControl()];
            this.dataSourceDeptExam.data = p_data;
            this.dataSourceDeptExam.data.forEach((element) => {
                element.examStatus = this.getExamStatusId(event.value, 'dept');
            });
            this.dataSourceDeptExam = new MatTableDataSource(this.dataSourceDeptExam.data);
            this.disableFieldDept = true;
            this.isDeptExamApplicable = true;
            this.isDepExemptedStatus = true;
            this.exemptDept = true;
            this.applicableDept = false;
        } else {
            if (this.dataSourceDeptExam.data && this.dataSourceDeptExam.data.length === 0) {
                const p_data = [];
                this.examBodyCtrl = [];
                this.deptHodNameCtrl = [];
                this.deptExamStatusCtrl = [];
                p_data.push({
                    empDeptExamDetailId: 0, deptExamName: '', examBody: 0, deptHodName: 0,
                    otherDeptHodName: '', dateOfPassing: '',
                    examStatus: this.getExamStatusId('Pass', 'dept'),
                    examAttempts: '', remarks: '', disabledeptHOD: false,
                });
                this.examBodyCtrl.push(new FormControl());
                this.deptHodNameCtrl.push(new FormControl());
                this.deptExamStatusCtrl.push(new FormControl());
                this.dataSourceDeptExam = new MatTableDataSource(p_data);
            }
            if (this.employeeDataExam) {
                if (this.employeeDataExam.exemptedDeptExamFlag !== null
                    && !this.employeeDataExam.exemptedDeptExamFlag
                    && this.employeeDataExam.pvuEmployeDeptExamDetailsDto
                    && this.employeeDataExam.pvuEmployeDeptExamDetailsDto.length > 0) {
                    this.dataSourceDeptExam =
                        new MatTableDataSource(this.employeeDataExam.pvuEmployeDeptExamDetailsDto);
                    this.examBodyCtrl = [new FormControl()];
                    this.deptHodNameCtrl = [new FormControl()];
                    this.deptExamStatusCtrl = [new FormControl()];
                    this.dataSourceDeptExam.data.forEach((ele) => {
                        ele.dateOfPassing = this.employeeDataService.dateFormating(
                            ele.dateOfPassing);
                        this.onChangeExamBody({ value: ele.examBody }, ele);
                        this.examBodyCtrl.push(new FormControl());
                        this.deptHodNameCtrl.push(new FormControl());
                        this.deptExamStatusCtrl.push(new FormControl());
                    });
                } else {
                    const p_data = [];
                    this.examBodyCtrl = [];
                    this.deptHodNameCtrl = [];
                    this.deptExamStatusCtrl = [];
                    p_data.push({
                        empDeptExamDetailId: 0, deptExamName: '', examBody: 0, deptHodName: 0,
                        otherDeptHodName: '', dateOfPassing: '',
                        examStatus: this.getExamStatusId('Pass', 'dept'),
                        examAttempts: '', remarks: '', disabledeptHOD: false,
                    });
                    this.examBodyCtrl.push(new FormControl());
                    this.deptHodNameCtrl.push(new FormControl());
                    this.deptExamStatusCtrl.push(new FormControl());
                    this.dataSourceDeptExam = new MatTableDataSource(p_data);
                }
            } else {
                this.dataSourceDeptExam.data.forEach((element) => {
                    element.examStatus = this.getExamStatusId(event.value, 'dept');
                    element.remarks = '';
                    element.examAttempts = '';
                });
                this.dataSourceDeptExam = new MatTableDataSource(this.dataSourceDeptExam.data);
            }
            this.disableFieldDept = false;
            this.isDeptExamApplicable = true;
            this.isDepExemptedStatus = false;
            this.exemptDept = false;
            this.applicableDept = true;
        }
    }

    /**
     * @description to get the exam status Id
     * @param data exam status name
     * @param type exam type name
     */
    getExamStatusId(data, type) {
        if (type === 'dept') {
            if (data !== '' && this.deptExamStatusList && this.deptExamStatusList.length > 0) {
                const selectedStatus = this.deptExamStatusList.filter((item) => {
                    if (item['lookupInfoName'] === data) {
                        return item['lookupInfoId'];
                    }
                });
                return selectedStatus[0]['lookupInfoId'];
            }
        }
        if (type === 'ccc') {
            if (data !== '' && this.cccExamStatusList && this.cccExamStatusList.length > 0) {
                const selectedStatus = this.cccExamStatusList.filter((cccExamObj) => {
                    if (cccExamObj['lookupInfoName'] === data) {
                        return cccExamObj['lookupInfoId'];
                    }
                });
                return selectedStatus[0]['lookupInfoId'];
            }
        }
    }

    /**
     * @description On department exam body change
     * @param item selected row data
     */
    onDeptExamBodySelect(item) {
        if (item.examBody !== '' && this.deptExamBodyList && this.deptExamBodyList.length > 0) {
            const selectedExamBody = this.deptExamBodyList.filter((items) => {
                if (items['lookupInfoId'] === item.examBody) {
                    if (items['lookupInfoName'] === 'Other') {
                        return items['lookupInfoId'];
                    }
                }
            });
            if (selectedExamBody && selectedExamBody.length !== 0) {
                if (item.examBody === selectedExamBody[0]['lookupInfoId']) {
                    return true;
                }
            } else {
                return false;
            }
        }
    }

    /**
     * @description to set the validation for special exam based on the exempted or applicable value
     * @param event event data
     */
    onClickCCCExamExempted(event) {
        if (event.value === 'Exempted') {
            const p_data = [];
            p_data.push({
                cccExamName: 0, examBody: 0, dateOfExam: '', dateOfPassing: '', examStatus: 0, certificateNo: '',
                remarks: ''
            });
            this.cccExamNameCtrl = [new FormControl()];
            this.cccExamBodyCtrl = [new FormControl()];
            this.cccExamStatusCtrl = [new FormControl()];
            this.dataSourceSpclExam.data = p_data;
            this.dataSourceSpclExam.data.forEach((element) => {
                element.examStatus = this.getExamStatusId(event.value, 'ccc');
            });
            this.dataSourceSpclExam = new MatTableDataSource(this.dataSourceSpclExam.data);
            this.disableFieldCCC = true;
            this.isCCCExamApplicable = true;
            this.isCccExemptedStatus = true;
            this.exemptCCC = true;
            this.applicableCCC = false;

        } else {
            if (this.dataSourceSpclExam.data && this.dataSourceSpclExam.data.length === 0) {
                const p_data = [];
                p_data.push({
                    empCCCExamDetailId: 0, cccExamName: 0, cccExamNameList: this.cccExamNameList,
                    cccExamNameDisable: false, examBody: 0, dateOfExam: '', dateOfPassing: '',
                    examStatus: this.getExamStatusId('Pass', 'ccc'), certificateNo: '', remarks: ''
                });
                this.cccExamNameCtrl.push(new FormControl());
                this.cccExamBodyCtrl.push(new FormControl());
                this.cccExamStatusCtrl.push(new FormControl());
                this.dataSourceSpclExam = new MatTableDataSource(p_data);
            }
            if (this.employeeDataExam) {
                if (this.employeeDataExam.exemptedCccExamFlag !== null && !this.employeeDataExam.exemptedCccExamFlag
                    && this.employeeDataExam.pvuEmployeCCCExamDetailDto
                    && this.employeeDataExam.pvuEmployeCCCExamDetailDto.length > 0) {
                    this.cccExamBodyCtrl = [];
                    this.dataSourceSpclExam =
                        new MatTableDataSource(_.cloneDeep(this.employeeDataExam.pvuEmployeCCCExamDetailDto));
                    this.dataSourceSpclExam.data.forEach((element, index) => {
                        element.dateOfExam = this.employeeDataService.dateFormating(
                            this.dataSourceSpclExam.data[index].dateOfExam);
                        element.dateOfPassing = this.employeeDataService.dateFormating(
                            this.dataSourceSpclExam.data[index].dateOfPassing);
                        element.cccExamNameDisable = true;
                        element.cccExamNameList = _.cloneDeep(this.cccExamNameData);
                        this.cccExamNameCtrl.push(new FormControl());
                        this.cccExamBodyCtrl.push(new FormControl());
                        this.cccExamStatusCtrl.push(new FormControl());
                    });
                } else {
                    const cccExamList = [];
                    this.cccExamNameCtrl = [];
                    this.cccExamBodyCtrl = [];
                    this.cccExamStatusCtrl = [];
                    const p_data = [];
                    p_data.push({
                        examStatus: this.getExamStatusId(event.value, 'ccc'),
                        remarks: '',
                        cccExamNameDisable: false,
                        cccExamNameList: _.cloneDeep(this.cccExamNameData)
                    });
                    this.cccExamNameCtrl.push(new FormControl());
                    this.cccExamBodyCtrl.push(new FormControl());
                    this.cccExamStatusCtrl.push(new FormControl());
                    this.dataSourceSpclExam = new MatTableDataSource(p_data);
                }
            } else {
                const lastIdx = this.dataSourceSpclExam.data.length - 1;
                const cccExamList = [];
                this.cccExamNameCtrl = [];
                this.cccExamBodyCtrl = [];
                this.cccExamStatusCtrl = [];
                this.dataSourceSpclExam.data.forEach((element, idx) => {
                    element.examStatus = this.getExamStatusId(event.value, 'ccc');
                    element.remarks = '';
                    element.cccExamNameDisable = true;
                    element.cccExamNameList = _.cloneDeep(this.cccExamNameData);
                    this.cccExamNameCtrl.push(new FormControl());
                    this.cccExamBodyCtrl.push(new FormControl());
                    this.cccExamStatusCtrl.push(new FormControl());
                    if (lastIdx !== idx) {
                        cccExamList.push(element.cccExamName);
                    }
                });
                if (this.dataSourceSpclExam.data[lastIdx]) {
                    this.dataSourceSpclExam.data[lastIdx].cccExamNameDisable = false;
                    this.dataSourceSpclExam.data[lastIdx]['cccExamNameList'] = this.cccExamNameData.filter(examObj => {
                        return cccExamList.indexOf(examObj.lookupInfoId) === -1;
                    });
                }
                this.dataSourceSpclExam = new MatTableDataSource(this.dataSourceSpclExam.data);
            }
            this.disableFieldCCC = false;
            this.isCCCExamApplicable = true;
            this.isCccExemptedStatus = false;
            this.exemptCCC = false;
            this.applicableCCC = true;
        }
    }

    /**
     * @description To set the validation and show/hide the employement history section
     */
    onClickEmployeement() {
        if (this.action === 'view') {
            return;
        }
        if (!this.isEmployeementApplicable) {
            if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
                const dialogRefEmpHistory = this.dialog.open(ConfirmationDialogComponent, {
                    width: '360px',
                    data: pvuMessage.IS_APPLICABLE_UNCHECK_MSG
                });
                dialogRefEmpHistory.afterClosed().subscribe(result => {
                    if (result === 'yes') {
                        this.isEmployeementApplicable = false;
                        this.prevEmpHistory = false;
                        this.dataSource = new MatTableDataSource<EmployeementHistory>();
                    } else if (result === 'no') {
                        this.isEmployeementApplicable = true;
                        this.prevEmpHistory = true;
                        this.dataSource = new MatTableDataSource<EmployeementHistory>(this.dataSource.data);
                    }
                });
            }
        }
    }

    /**
     * @description To set the selected attachment value to the mat table.
     * @param fileSelected selected file data
     * @param item selected row data
     * @param index selected row index
     */
    onNomineePhotoSelection(fileSelected, item, index) {
        const fileType = ['jpg', 'jpeg', 'png'];

        // tslint:disable-next-line:no-inferrable-types
        let fileAllowed: boolean = false;
        // tslint:disable-next-line:no-inferrable-types
        let fileSizeAllowed: boolean = false;
        if (fileSelected.target && fileSelected.target.files) {
            fileType.forEach(el => {
                if (el.toLowerCase() === fileSelected.target.files[0].name.split('.').pop().toLowerCase()) {
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    fileAllowed = true;
                    if (fileSizeInKb <= 1024) {
                        fileSizeAllowed = true;
                        // tslint:disable-next-line:max-line-length
                        this.dataSourceNominee.data[this.photoOfNomineeIndex].photoOfNominee = fileSelected.target.files[0];
                        this.dataSourceNominee.data[this.photoOfNomineeIndex].fileBrowseNomi = false;
                    }
                }
            });
        }
        if (!fileAllowed) {
            this.nomPhoto.nativeElement.value = '';
            this.toastr.error(this.errorMessages.UPLOAD_NOM_PHOTO_TYPE_ERR);
            this.dataSourceNominee.data[this.photoOfNomineeIndex].fileBrowseNomi = false;
            this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
            return;
        }
        if (!fileSizeAllowed) {
            this.nomPhoto.nativeElement.value = '';
            this.toastr.error(this.errorMessages.UPLOAD_PHOTO_SIZE_ERR);
            this.dataSourceNominee.data[this.photoOfNomineeIndex].fileBrowseNomi = false;
            this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
            return;
        }
        this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
    }

    /**
     * @description To remove the browsed file data before save
     * @param key column type of nominee attachment
     * @param item selected row data
     * @param index selected row index of column
     */
    removeSelectedNomineeFile(key, item, index) {
        const nData = _.cloneDeep(this.dataSourceNominee.data);
        nData.forEach((nDataObj, nDataIndex) => {
            if (index === nDataIndex) {
                if (key === 'PHOTO') {
                    nDataObj.photoOfNominee = '';
                    nDataObj.nomineePhoto = '';
                    nDataObj.nomineePhotoName = '';
                } else if (key === 'GEN') {
                    nDataObj.genNomiForm = '';
                    nDataObj.genNomineePhoto = '';
                    nDataObj.genNomineeFormName = '';
                } else if (key === 'NPS') {
                    nDataObj.npsNomiForm = '';
                    nDataObj.npsNomineePhoto = '';
                    nDataObj.npsNomineeFormName = '';
                }
            }
        });
        this.dataSourceNominee = new MatTableDataSource(nData);
    }

    /**
     * @description To remove the selected employee photo data
     */
    removeSelectedEmplPhoto() {
        this.fileData = null;
        this.empPhotoKey = '';
        this.empPhotoName = '';
        this.fileDetailsEmp = false;
        this.empViewPhoto = null;
        this.empPhoto.nativeElement.value = '';
    }

    /**
     * @description To clear the value of form control
     * @param formGroupName FormGroup name
     * @param formCntrlName form conttrol of form formgroup
     */
    clearDate(formGroupName, formCntrlName) {
        formGroupName.get(formCntrlName).setValue('');
    }

    /**
     * @description Convert bytes into kb
     * @param bytes value in bytes
     */
    bytesToKB(bytes) {
        if (bytes === 0) {
            return;
        }
        if (isNaN(bytes)) {
            return '0';
        } else {
            return Math.round((bytes / 1024)).toString();
        }
    }

    /**
     * @description to open the nominee file
     */
    openFileSelector2(index) {
        this.photoOfNomineeIndex = index;
        this.el.nativeElement.querySelector('#fileBrowse-nominee').click();
    }

    /**
     * @description to get the selected general form file data
     * @param fileSelected selected file info
     * @param item selected row data
     */
    onFileGenForm(fileSelected, item) {
        const fileType = ['jpg', 'jpeg', 'png', 'pdf'];

        // tslint:disable-next-line:no-inferrable-types
        let fileAllowed: boolean = false;
        // tslint:disable-next-line:no-inferrable-types
        let fileSizeAllowed: boolean = false;
        if (fileSelected.target && fileSelected.target.files) {
            fileType.forEach(el => {
                if (el.toLowerCase() === fileSelected.target.files[0].name.split('.').pop().toLowerCase()) {
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    fileAllowed = true;
                    if (fileSizeInKb <= 1024) {
                        fileSizeAllowed = true;

                        this.dataSourceNominee.data[this.genNomiFormIndex].genNomiForm = fileSelected.target.files[0];
                        this.dataSourceNominee.data[this.genNomiFormIndex].fileBrowseGenForm = false;
                    }
                }
            });
        }
        if (!fileAllowed) {
            this.npsNomForm.nativeElement.value = '';
            this.toastr.error(this.errorMessages.UPLOAD_NPS_NOM_FORM_TYPE_ERR);
            this.dataSourceNominee.data[this.genNomiFormIndex].fileBrowseGenForm = false;
            this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
            return;
        }
        if (!fileSizeAllowed) {
            this.npsNomForm.nativeElement.value = '';
            this.toastr.error(this.errorMessages.UPLOAD_PHOTO_SIZE_ERR);
            this.dataSourceNominee.data[this.genNomiFormIndex].fileBrowseGenForm = false;
            this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
            return;
        }
        this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
    }

    /**
     * @description To open the general form file
     */
    openFileGenForm(index) {
        this.genNomiFormIndex = index;
        this.el.nativeElement.querySelector('#fileBrowse-genform').click();
    }

    /**
     * @description to get the selected nps form file data
     * @param fileSelected selected file info
     * @param item selected row data
     */
    onFileNpsForm(fileSelected, item) {
        const fileType = ['jpg', 'jpeg', 'png', 'pdf'];

        // tslint:disable-next-line:no-inferrable-types
        let fileAllowed: boolean = false;
        // tslint:disable-next-line:no-inferrable-types
        let fileSizeAllowed: boolean = false;
        if (fileSelected.target && fileSelected.target.files) {
            fileType.forEach(el => {
                if (el.toLowerCase() === fileSelected.target.files[0].name.split('.').pop().toLowerCase()) {
                    const fileSizeInKb = fileSelected.target.files[0].size / Math.pow(1024, 1);
                    fileAllowed = true;
                    if (fileSizeInKb <= 1024) {
                        fileSizeAllowed = true;
                        this.dataSourceNominee.data[this.npsNomiFormIndex].npsNomiForm = fileSelected.target.files[0];
                        this.dataSourceNominee.data[this.npsNomiFormIndex].fileBrowseNpsForm = false;
                    }
                }
            });
        }
        if (!fileAllowed) {
            this.nomDeclForm.nativeElement.value = '';
            this.toastr.error(this.errorMessages.UPLOAD_NOM_DECL_FORM_TYPE_ERR);
            this.dataSourceNominee.data[this.npsNomiFormIndex].fileBrowseNpsForm = false;
            this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
            return;
        }
        if (!fileSizeAllowed) {
            this.nomDeclForm.nativeElement.value = '';
            this.toastr.error(this.errorMessages.UPLOAD_PHOTO_SIZE_ERR);
            this.dataSourceNominee.data[this.npsNomiFormIndex].fileBrowseNpsForm = false;
            this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
            return;
        }
        this.dataSourceNominee = new MatTableDataSource(this.dataSourceNominee.data);
    }

    /**
     * @description to get nps file
     */
    openFileNpsForm(index) {
        this.npsNomiFormIndex = index;
        this.el.nativeElement.querySelector('#fileBrowse-npsform').click(index);
    }

    /**
     * @description To set the validation on phType based on phStatus
     */
    onPhChange() {
        const phValue = this.createEmployeeForm.get('phStatus').value;
        const selectedObj = this.findArrayIndex(this.phStatusList, 'lookupInfoId', phValue);
        if (selectedObj && selectedObj['lookupInfoName'].toLowerCase() === 'Yes'.toLowerCase()) {
            this.phCategory = true;
            this.createEmployeeForm.controls.phType.setValidators([Validators.required]);
        } else {
            this.phCategory = false;
            this.createEmployeeForm.patchValue({
                phType: null
            });
            this.createEmployeeForm.controls.phType.setValidators(null);
        }
        this.createEmployeeForm.controls.phType.updateValueAndValidity();
    }

    /**
     * @description To get the selected option object from array
     * @param itemArray Array
     * @param keyName primary key(id)
     * @param selectedValue selected value id
     */
    findArrayIndex(itemArray, keyName, selectedValue) {
        const selectedIndex = itemArray.findIndex(x => x[keyName] === selectedValue);
        return itemArray[selectedIndex];
    }

    /**
     * @description Enable or disable the address fields based on the nationality selection
     */
    onNationChange() {
        const nationValue = this.createEmployeeForm.get('nationality').value;
        const selectedObj = this.findArrayIndex(this.nationalityList, 'lookupInfoId', nationValue);
        const field = ['natState', 'natDistrict', 'natTaluka', 'natCity', 'natPinCode',
            'perState', 'perDistrict', 'perTaluka', 'perCity', 'perPinCode'];
        if (selectedObj) {
            if (selectedObj.lookupInfoName.indexOf('Nepal') >= 0 || selectedObj.lookupInfoName.indexOf('Bhutan') >= 0) {
                this.enableDisableForm('disable', field);
            } else {
                this.enableDisableForm('enable', field);
            }
        } else {
            this.enableDisableForm('disable', field);
        }
        // To update the permanent and native address
        this.updateFromCurrentAddress('nation');
    }

    /**
     * @description To set other relation flag based on the relationship change
     * @param item selected row data
     */
    onRelationshipChange(item) {
        if (item.relationship === 121 || item.relationship === 127) {
            item['isOtherRelation'] = true;
        } else {
            item['isOtherRelation'] = false;
        }
    }

    /**
     * @description On cell Id change calculate the basic pay
     */
    onCellChange() {
        this.toggleRequireTag6th();
        this.calculate7thPay();
    }

    /**
     * @description To get the 7th basic pay
     */
    calculate7thPay() {
        let cellVal;
        if (this.cellIdList && this.cellIdList.length > 0) {
            const cellData = this.cellIdList.filter(cellObj => {
                return cellObj['id'] === this.create7thPayDetails.get('cellId').value;
            });
            if (cellData && cellData.length === 1) {
                cellVal = cellData[0]['cellId'];
            }
        }
        const params = {
            'request': {
                'cellId': cellVal,
                'payLevelId': this.create7thPayDetails.get('payLevel').value
            }
        };
        this.pvuService.get7thCPCBasicPay(params).subscribe((data) => {
            if (data && data['status'] === 200 && data['result'] && data['result']['cellValue']) {
                this.create7thPayDetails.get('basicPay').setValue(data['result']['cellValue']);
            } else {
                this.create7thPayDetails.get('basicPay').setValue('0');
                this.toastr.error(pvuMessage.BASIC_NOT_CALCULATED);
            }
        }, (err) => {
            this.toastr.error(err);
        });

    }

    /**
     * @description To get the 7th pay comission basic pay
     */
    get7thCPCBasicPay() {
        this.toggleRequireTag6th();
        if (this.payLevelList){
            const cellIdList: any = this.payLevelList.filter((payLevel) => {
                return payLevel['id'] === this.create7thPayDetails.get('payLevel').value;
            })[0];
            if (cellIdList) {
                this.cellIdList = _.cloneDeep(cellIdList.cells);
                this.create7thPayDetails.get('cellId').setValue('');
                this.create7thPayDetails.get('basicPay').setValue(0);
            }
        }
    }

    /**
     * @description To calulate the joining 7th pay basic pay
     */
    calcJoining7thBasicPay() {
        let cellVal;
        if (this.join7thCellIdList && this.join7thCellIdList.length > 0) {
            const cellData = this.join7thCellIdList.filter(cellObj => {
                return cellObj['id'] === this.joining7thPayDetail.get('join7thCellId').value;
            });
            if (cellData && cellData.length === 1) {
                cellVal = cellData[0]['cellId'];
            }
        }
        const params = {
            'request': {
                'cellId': cellVal,
                'payLevelId': this.joining7thPayDetail.get('join7thPayLevel').value
            }
        };
        this.pvuService.get7thCPCBasicPay(params).subscribe((data) => {
            if (data && data['status'] === 200 && data['result'] && data['result']['cellValue']) {
                this.joining7thPayDetail.get('join7thBasicPay').setValue(data['result']['cellValue']);
            } else {
                this.joining7thPayDetail.get('join7thBasicPay').setValue('0');
                this.toastr.error(pvuMessage.BASIC_NOT_CALCULATED);
            }
        }, (err) => {
            this.toastr.error(err);
        });

    }

    /**
     * @description To get the 7th pay cell ID
     */
    get7thCellId() {
        if (this.join7thPayLevelList) {
            const cellIdList: any = this.join7thPayLevelList.filter((payLevel) => {
                return payLevel['id'] === this.joining7thPayDetail.get('join7thPayLevel').value;
            })[0];
            if (cellIdList) {
                this.join7thCellIdList = _.cloneDeep(cellIdList.cells);
                this.joining7thPayDetail.get('join7thCellId').setValue('');
                this.joining7thPayDetail.get('join7thBasicPay').setValue(0);
            }
        }
    }

    /**
     * @description To set the default value of city village
     * @param control control name
     * @param event event data
     */
    setCityVillage(control, event) {
        const talukaName = event.source.selected._element.nativeElement.innerText.trim();
        this.createEmployeeForm.get(control).setValue(talukaName);
    }

    /**
     * @description to set validation for passport expiry date
     */
    passportExpiryMand() {
        const passportNo = this.createEmployeeForm.get('passportNo').value;
        if (passportNo !== '') {
            this.isPassDateRequired = true;
        } else {
            this.createEmployeeForm.controls.passportExpiryDate.setValue('');
            this.isPassDateRequired = false;
        }
    }

    /**
     * @description To enable and disable field
     * @param type 'disable' or 'enable'
     * @param fieldArr field name array
     */
    enableDisableForm(type, fieldArr) {
        fieldArr.forEach(keyName => {
            if (type === 'disable') {
                this.createEmployeeForm.get(keyName).setValue('');
                this.createEmployeeForm.controls[keyName].disable();
            } else {
                this.createEmployeeForm.controls[keyName].enable();
            }
        });
    }

    /**
     * @method onDeputationChange
     * @description on change trigger function for deputation selection
     * @param event value passed from template
     */
    onDeputationChange(event) {
        if (event && event.value) {
            if (event.value === 2) {
                this.isDeputation = true;
                this.departmentalDetails.controls.deputationStartDate.setValidators([Validators.required]);
                this.departmentalDetails.controls.deputationEndDate.setValidators([Validators.required]);
                this.departmentalDetails.controls.deputDistrictId.setValidators([Validators.required]);
                this.departmentalDetails.controls.deputDdoCode.setValidators([Validators.required]);
                this.departmentalDetails.controls.deputCardexNo.setValidators([Validators.required]);
                this.departmentalDetails.controls.deputOfficeName.setValidators([Validators.required]);
                if (this.deputationDistList.length < 1) {
                    this.getDeputationDistrict();
                }
            } else {
                this.isDeputation = false;
                this.departmentalDetails.patchValue({
                    'deputationStartDate': '',
                    'deputationEndDate': '',
                    'deputDistrictId': '',
                    'deputCardexNo': '',
                    'deputDdoCode': '',
                    'deputOfficeId': '',
                    'deputOfficeName': ''
                });
                this.departmentalDetails.controls.deputationStartDate.setValidators(null);
                this.departmentalDetails.controls.deputationEndDate.setValidators(null);
                this.departmentalDetails.controls.deputDistrictId.setValidators(null);
                this.departmentalDetails.controls.deputDdoCode.setValidators(null);
                this.departmentalDetails.controls.deputCardexNo.setValidators(null);
                this.departmentalDetails.controls.deputOfficeName.setValidators(null);
            }
            this.departmentalDetails.controls.deputationStartDate.updateValueAndValidity();
            this.departmentalDetails.controls.deputationEndDate.updateValueAndValidity();
            this.departmentalDetails.controls.deputDistrictId.updateValueAndValidity();
            this.departmentalDetails.controls.deputDdoCode.updateValueAndValidity();
            this.departmentalDetails.controls.deputCardexNo.updateValueAndValidity();
            this.departmentalDetails.controls.deputOfficeName.updateValueAndValidity();
        }
    }

    loadPresentOffice() {
        if (this.departmentalDetails.controls.deputDistrictId.value &&
            this.departmentalDetails.controls.deputDdoCode.value
            && this.departmentalDetails.controls.deputCardexNo.value) {
            this.pvuService.getPresentOffice(this.departmentalDetails.controls.deputDistrictId.value,
                this.departmentalDetails.controls.deputDdoCode.value,
                this.departmentalDetails.controls.deputCardexNo.value).subscribe((res) => {
                    if (res && res['status'] === 200 && res['result'] && res['result'].length > 0) {
                        this.departmentalDetails.patchValue({
                            deputOfficeId: res['result'][0].key,
                            deputOfficeName: res['result'][0].value
                        });
                    } else {
                        this.departmentalDetails.patchValue({
                            deputOfficeId: 0,
                            deputOfficeName: ''
                        });
                    }
                });
        }
    }

    /**
   * @description to set deputation date validation
   * @param status employee status
   */
    onEmpStatusChange(status) {
        if (status.value !== '' && this.deptEmpStatusList && this.deptEmpStatusList.length > 0) {
            const selectedStatus = this.deptEmpStatusList.filter((item) => {
                if (item['lookupInfoId'] === status.value) {
                    if (item['lookupInfoName'] === 'On Deputation') {
                        return item['lookupInfoId'];
                    }
                }
            });
            if (selectedStatus && selectedStatus.length !== 0) {
                if (status.value === selectedStatus[0]['lookupInfoId']) {
                    this.isDeputation = true;
                    this.departmentalDetails.controls.deputationStartDate.setValidators([Validators.required]);
                    this.departmentalDetails.controls.deputationEndDate.setValidators([Validators.required]);
                }
            } else {
                this.isDeputation = false;
                this.departmentalDetails.patchValue({
                    'deputationStartDate': '',
                    'deputationEndDate': ''
                });
                this.departmentalDetails.controls.deputationStartDate.setValidators(null);
                this.departmentalDetails.controls.deputationEndDate.setValidators(null);
            }
            this.departmentalDetails.controls.deputationStartDate.updateValueAndValidity();
            this.departmentalDetails.controls.deputationEndDate.updateValueAndValidity();
        }
    }

    /**
     * @description On employee service change
     * @param schemeChange scheme data
     */
    onEmpServiceChange(schemeChange) {
        if (schemeChange.value === 2) {
            this.serviceOrderNo = true;
            this.previousEmployementDetails.controls.orderNoDate.setValidators([Validators.required]);
        } else {
            this.serviceOrderNo = false;
            this.previousEmployementDetails.controls.orderNoDate.setValidators(null);
        }
        this.previousEmployementDetails.controls.orderNoDate.updateValueAndValidity();
    }

    /**
     * @description To set the event tab paginator and sorting
     */
    // setDataSourceAttributes() {
    //     this.dataSourceEvents.paginator = this.paginator;
    //     this.dataSourceEvents.sort = this.sort;
    // }

    /**
     * @description to add the employement history record in to employement history datasource table
     * @param employeeForm employement history form data
     */
    addEmployeementHistory(employeeForm) {
        let valid = true;
        if (this.previousEmployementDetails.invalid) {
            this.toastr.error(MessageConst.VALIDATION.TOASTR);
            _.each(this.previousEmployementDetails.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                    valid = false;
                }
            });
        } else {
            const p_data = this.dataSource.data;
            let emplType, isServiceCont;
            if (this.employementTypeList) {
                emplType = this.employementTypeList.filter(emplObj => {
                    return emplObj.lookupInfoId === this.previousEmployementDetails.controls.employementType.value;
                })[0];
            }
            if (this.empServiceContinuationList) {
                isServiceCont = this.empServiceContinuationList.filter(servObj => {
                    return servObj.lookupInfoId === this.previousEmployementDetails.get('empServiceContinuation').value;
                })[0];
            }
            p_data.push({
                empId: this.empId,
                employementType: this.previousEmployementDetails.controls.employementType.value,
                employementTypeName: (emplType && emplType.lookupInfoName) ? emplType.lookupInfoName : '',
                deptName: this.previousEmployementDetails.controls.deptName.value,
                officeName: this.previousEmployementDetails.controls.officeName.value,
                officeAdd: this.previousEmployementDetails.controls.officeAdd.value,
                empDesignationHist: this.previousEmployementDetails.controls.empDesignationHist.value,
                fromDate: this.previousEmployementDetails.controls.fromDate.value,
                toDate: this.previousEmployementDetails.controls.toDate.value,
                lastPayDrawn: this.previousEmployementDetails.controls.lastPayDrawn.value,
                empServiceContinuation: this.previousEmployementDetails.controls.empServiceContinuation.value,
                empServiceContinuationName: (isServiceCont && isServiceCont.lookupInfoName) ?
                    isServiceCont.lookupInfoName : '',
                orderNoDate: this.previousEmployementDetails.controls.orderNoDate.value,
                employeHistroyId: null
            });
            this.dataSource.data = p_data;
            this.listshow = true;
            this.previousEmployementDetails.reset();
            employeeForm.resetForm();
            const date = new Date(this.createEmployeeForm.controls.dateOfBirth.value);
            this.minDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            this.maxDate = '';
            return true;
        }
    }

    /**
     * @description to convert into uppercase
     * @param data data
     */
    convertUppercase(data) {
        if (data.target.value) {
            data.target.value = data.target.value.toUpperCase();
        }
        return data;
    }

    /**
     * @description To get the selected tab index
     * @param tabChangeEvent tab change event data
     */
    onTabChange(tabChangeEvent: MatTabChangeEvent) {
        const index = tabChangeEvent;
        this.selectedIndex = +index;
    }

    /**
     * @description To view the pan no details in popup
     */
    redirectViewPanDetail() {
        const panNo = this.createEmployeeForm.get('panNo').value;
        const dialogRef = this.dialog.open(EmpViewOtherOfficeComponent, {
            width: '1024px',
            height: '600px',
            data: { 'panNo': panNo }
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }

    /**
     * @description To set the validation based on the school/degree selection
     * @param event school/degree selection event data
     * @param item selected row data
     */
    onChangeSchoolDegree(event, item) {
        const enabledIds = [245, 247, 248];
        if (event.value === 250) { // 250 id is for Illiterate degree option
            if (this.dataSourceQualification && this.dataSourceQualification.data
                && this.dataSourceQualification.data.length > 1) {
                this.toastr.error('You can not select Illiterate with any other degree');
                const qualData = _.cloneDeep(this.dataSourceQualification.data);
                qualData.forEach(qualObj => {
                    if (qualObj && qualObj.degree === 250) { // 250 id is for Illiterate degree option
                        qualObj.degree = 0;
                    }
                });
                this.dataSourceQualification = new MatTableDataSource(qualData);
                return true;
            }
        }
        if (event && event.value) {
            if (enabledIds.indexOf(event.value) === -1) {
                item['courseName'] = '';
                item['otherCourseName'] = '';
                item['enabledCourseName'] = true;
                this.onCourseNameSelect(item);
            } else {
                item['enabledCourseName'] = false;
                if (this.allCourseNameList) {
                    item['courseNameList'] = this.allCourseNameList.filter((item1) => {
                        return item1['parentId'] === event.value;
                    });
                }
            }
        }
    }

    /**
     * @description To clear the course name dropdown
     * @param item selected row data
     */
    clearCourse(item) {
        item.courseName = 0;
        item.isOtherCourseName = false;
        item.otherCourseName = '';
    }

    /**
     * @description To set the validation based on the exam body selection
     * @param event exam body selection event
     * @param item selected row data
     */
    onChangeExamBody(event, item) {
        if (event && event.value) {
            item['deptHodName'] = '';
            switch (event.value) {
                case 133:
                    item['deptHodNameList'] = _.cloneDeep(this.adminDepartment);
                    item['disabledeptHOD'] = false;
                    break;
                case 134:
                    item['deptHodNameList'] = _.cloneDeep(this.hodData);
                    item['disabledeptHOD'] = false;
                    break;
                case 135:
                case 136:
                    item['disabledeptHOD'] = true;
                    item['deptHodName'] = '';
                    break;
                case 137:
                    item['disabledeptHOD'] = false;
                    item['deptHodNameList'] = '';
                    item['otherDeptHodName'] = '';
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * @description To check the PAN No duplication
     * @param event pan no event data
     */
    checkDuplicatePAN(event) {
        if (event.target.value) {
            let isPanOld = true;
            if (this.employeeDataPersonal && this.employeeDataPersonal.pvuEmployeDto
                && this.employeeDataPersonal.pvuEmployeDto.panNo) {
                if (this.employeeDataPersonal.pvuEmployeDto.panNo ===
                    event.target.value) {
                    isPanOld = false;
                }
            }
            if (isPanOld) {
                const param = { fieldValue: event.target.value };
                this.pvuService.checkDuplicatePAN(param).subscribe((data) => {
                    if (data && data['result'] === true) {
                        this.duplicatePanNo = true;
                    } else {
                        this.duplicatePanNo = false;
                    }
                }, (err) => { });
            }
        }
    }

    /**
     * @description To edit the selected employement history row
     * @param data selected row data
     * @param id selected employement history id
     */
    editEmpHistory(data, id) {
        this.previousEmployementDetails.patchValue({
            'employementType': data.employementType,
            'deptName': data.deptName,
            'officeName': data.officeName,
            'officeAdd': data.officeAdd,
            'empDesignationHist': data.empDesignationHist,
            'fromDate': data.fromDate !== '' && data.fromDate != null ? this.convertDateOnly(data.fromDate) : '',
            'toDate': data.toDate !== '' && data.toDate != null ? this.convertDateOnly(data.toDate) : '',
            'lastPayDrawn': data.lastPayDrawn,
            'empServiceContinuation': data.empServiceContinuation,
            'orderNoDate': data.orderNoDate
        });
        this.employeHistroyId = id;
    }

    /**
     * @description To delete the employement history record
     * @param ID selected employement history ID
     * @param index selected row index
     */
    deleteEmpHistory(ID, index) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (ID) {
                    if (this.ddoEditable || this.adminEditable) {
                        const emphist = this.dataSource.data.splice(index, 1);
                        if (emphist && emphist.length === 1) {
                            this.empHistoryArray.push(this.employeeDataService.setDeleteType(emphist[0]));
                            this.toastr.info(pvuMessage.EDIT_ROW_DELETE);
                        }
                        this.dataSource = new MatTableDataSource(this.dataSource.data);
                    } else {
                        const dataToSend = {
                            id: ID,
                        };
                        dataToSend['activeStatus'] = 0;
                        this.pvuService.deletePrevHistory(dataToSend).subscribe((res) => {
                            if (res && res['status'] === 200) {
                                if (res['message']) {
                                    this.toastr.success(res['message']);
                                }
                                this.dataSource.data.splice(index, 1);
                                this.dataSource = new MatTableDataSource(this.dataSource.data);
                            }
                        }, (err) => {
                            this.toastr.error(err);
                        });
                    }
                } else {
                    this.dataSource.data.splice(index, 1);
                    this.dataSource = new MatTableDataSource(this.dataSource.data);
                }
            }
        });
    }

    /**
     * @description To delete the uploaded employee photo
     */
    deleteEmpPhoto() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE_EMPLOYEE_PHOTO
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (!this.ddoEditable && !this.adminEditable) {
                    const param = {
                        id: this.empId
                    };
                    this.pvuService.deleteEmpPhoto(param).subscribe((res) => {
                        if (res && res['status'] === 200) {
                            if (res['message']) {
                                this.toastr.success(res['message']);
                                this.fileData = null;
                                this.empPhotoKey = '';
                                this.empPhotoName = '';
                                this.fileDetailsEmp = false;
                                this.empPhoto.nativeElement.value = '';
                            }
                        } else {
                            this.toastr.error(res['message']);
                        }
                    }, (err) => {
                        this.toastr.error(err);
                    });
                } else {
                    this.fileData = null;
                    this.empPhotoKey = '';
                    this.empPhotoName = '';
                    this.fileDetailsEmp = false;
                    this.empPhoto.nativeElement.value = '';
                    this.empViewPhoto = null;
                    this.toastr.info(pvuMessage.EDIT_ATTACHMENT_DELETE);
                }
            }
        });
    }

    /**
     * @description To delete the uploaded attachment
     * @param key column type of nominee attachment
     * @param item selected row data
     */
    deleteNomineeAttachment(key, item) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE_ATTACHMENT
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (!this.ddoEditable && !this.adminEditable) {
                    const param = {
                        'request': {}
                    };
                    param.request[key] = item.empNomineeId;
                    this.pvuService.deleteNomineeAttachment(param).subscribe((res) => {
                        if (res && res['status'] === 200) {
                            if (res['message']) {
                                this.toastr.success(res['message']);
                                if (key === 'PHOTO') {
                                    item.nomineePhoto = '';
                                    item.nomineePhotoName = '';
                                } else if (key === 'GEN') {
                                    item.genNomineePhoto = '';
                                    item.genNomineeFormName = '';
                                } else if (key === 'NPS') {
                                    item.npsNomineePhoto = '';
                                    item.npsNomineeFormName = '';
                                }
                                return item;
                            }
                        } else {
                            this.toastr.error(res['message']);
                        }
                    }, (err) => {
                        this.toastr.error(err);
                    });
                } else {
                    this.toastr.info(pvuMessage.EDIT_ATTACHMENT_DELETE);
                    if (key === 'PHOTO') {
                        item.nomineePhoto = '';
                        item.nomineePhotoName = '';
                        item.nomineePhotoDelete = true;
                    } else if (key === 'GEN') {
                        item.genNomineePhoto = '';
                        item.genNomineeFormName = '';
                        item.genNomineePhotoDelete = true;
                    } else if (key === 'NPS') {
                        item.npsNomineePhoto = '';
                        item.npsNomineeFormName = '';
                        item.npsNomineePhotoDelete = true;
                    }
                    return item;
                }
            }
        });
    }

    /**
     * @description To view the attachment file in new tab
     * @param key key of selected attachment
     * @param name filename of selected attachment
     */
    downloadAttachFile(key, name) {
        const param = { fieldValue: key };
        this.httpClient.post(
            `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PERSONAL_DETAIL.DOWNLOADATTACHMENT}`,
            param
        ).subscribe((res) => {
            if (res) {
                const resultObj = res['result'];
                const imgNameArray = name.split('.');
                const imgType = imgNameArray[imgNameArray.length - 1];
                let docType;
                if (imgType.toLowerCase() === 'pdf') {
                    docType = 'application/pdf';
                } else if (imgType.toLowerCase() === 'png') {
                    docType = 'image/png';
                } else if (imgType.toLowerCase() === 'jpg') {
                    docType = 'image/jpg';
                } else if (imgType.toLowerCase() === 'jpeg') {
                    docType = 'image/jpeg';
                }

                const byteArray = new Uint8Array(atob(resultObj['image']).split('').map(char => char.charCodeAt(0)));
                const blob = new Blob([byteArray], { type: docType });
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blob);
                } else {
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                }
            }
        }, (err) => {
            this.toastr.error(err);
        });

        /**
         * For Download attachment
         */
        // const param = { documentDataKey: key, fileName: name };
        // this.httpClient.post(
        //     `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PERSONAL_DETAIL.DOWNLOADATTACHMENT}`,
        //     param,
        //     { responseType: 'blob' }
        // ).subscribe((res) => {
        //     if (res) {
        //         // const blob = new Blob([res], { type: 'application/octet-stream' });
        //         const blob = new Blob([res], { type: res['type'] });
        //         // const url = window.URL.createObjectURL(blob);
        //         // window.open(url, '_blank');

        //         const a = document.createElement('a');
        //         document.body.appendChild(a);
        //         const url = window.URL.createObjectURL(blob);
        //         a.href = url;
        //         a.download = name;
        //         // a.setAttribute('target', '_blank');
        //         a.click();
        //         setTimeout(() => {
        //             window.URL.revokeObjectURL(url);
        //             document.body.removeChild(a);
        //             // window.open(url, '_blank');
        //         }, 0);

        //     }
        // }, (err) => {
        //     this.toastr.error(err);
        // });
    }

    /**
     * @description To open the workflow popup
     */
    openWorkFlowPopUp(): void {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(EmployeeForwardDialogComponent, {
            width: '2700px',
            height: '600px',
            data: {
                'empId': this.empId,
                'officeId': this.presentOfficeId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.action === 'edit') {
                    this.router.navigate(['/dashboard/pvu/employee-creation'], { skipLocationChange: true });
                } else {
                    this.router.navigate(['/dashboard'], { skipLocationChange: true });
                }
            }
        });
    }

    /**
     * @description To display the workflow history comments
     */
    viewWorkflowHistory() {
        const dialogRef = this.dialog.open(EcViewCommentsComponent, {
            width: '2700px',
            height: '600px',
            data: {
                'empId': this.empId,
                'heading': 'Employee Creation'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                // close logic
            }
        });
    }

    /**
     * @description To navigate to the employee creation listing page
     */
    goToListing() {
        if (this.expCreation) {
            this.router.navigate(['/dashboard/pvu/employee-creation/list/1'], { skipLocationChange: true });
        } else {
            this.router.navigate(['/dashboard/pvu/employee-creation'], { skipLocationChange: true });
        }
    }

    /**
     * @description To navigate to the dashboard
     */
    goToDashboard() {
        if (this.dialogOpen) {
            this.dialog.closeAll();
        } else {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: pvuMessage.CLOSE
            });
            dialogRef.afterClosed().subscribe(resDashboard => {
                if (resDashboard === 'yes') {
                    const url: string = this.routeService.getPreviousUrl();
                    this.router.navigate([url.toString()], { skipLocationChange: true });

                }
            });
        }
    }

    /**
     * @description to get the selected name of dropdown for datasource
     * @param list dropdown list data
     * @param val selected value id of dropdown
     * @param listIdKey id key name od dropdown list data
     * @param listValueKey value key name od dropdown list data
     */
    getTitleNameDataSorce(list, val, listIdKey, listValueKey) {
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
     * @description TO  display the tooltip for dropdown field
     * @param formGroup FormGroup Name
     * @param list Dropdown List Array
     * @param formControlKey form control name key
     * @param listIdKey id key of dropdown list array
     * @param listValueKey display value key of dropdown list array
     */
    getTitleName(formGroup, list, formControlKey, listIdKey, listValueKey) {
        if (formGroup) {
            const val = formGroup.get(formControlKey).value;
            if (list && list.length > 0) {
                const data = list.filter(obj => {
                    return obj[listIdKey] === val;
                });
                if (data && data.length === 1) {
                    return data[0][listValueKey];
                }
            }
        }
        return '';
    }

    /**
     * @description To update the Permanent and Native Address based on the current address change
     */
    updateFromCurrentAddress(trigger?) {
        const addrData = this.createEmployeeForm.getRawValue();
        let isRemoved = false;
        const nationValue = this.createEmployeeForm.get('nationality').value;
        const selectedObj = this.findArrayIndex(this.nationalityList, 'lookupInfoId', nationValue);
        if (selectedObj.lookupInfoName.indexOf('Nepal') >= 0 || selectedObj.lookupInfoName.indexOf('Bhutan') >= 0) {
            isRemoved = true;
        }
        // for permanent Address updation
        if (addrData.isPerAddCurAdd && (!this.ddoEditable || trigger === 'nation')) {
            this.getDistricts(addrData.curState, 'per');
            this.getTalukas(addrData.curDistrict, 'per');
            this.createEmployeeForm.patchValue({
                perAddress1: addrData.curAddress1,
                perAddress2: addrData.curAddress2,
                perState: !isRemoved ? addrData.curState : '',
                perDistrict: !isRemoved ? addrData.curDistrict : '',
                perTaluka: !isRemoved ? addrData.curTaluka : '',
                perOtherTaluka: !isRemoved ? addrData.curOtherTaluka : '',
                perCity: !isRemoved ? addrData.curCity : '',
                perPinCode: !isRemoved ? addrData.curPinCode : ''
            });
        }
        // for Native Address updation
        if (addrData.isNatAddCurAddPerAdd === 'sameAsCurrentAddr' && (!this.ddoEditable || trigger === 'nation')) {
            this.getDistricts(addrData.curState, 'nat');
            this.getTalukas(addrData.curDistrict, 'nat');
            this.createEmployeeForm.patchValue({
                natAddress1: addrData.curAddress1,
                natAddress2: addrData.curAddress2,
                natState: !isRemoved ? addrData.curState : '',
                natDistrict: !isRemoved ? addrData.curDistrict : '',
                natTaluka: !isRemoved ? addrData.curTaluka : '',
                natOtherTaluka: !isRemoved ? addrData.curOtherTaluka : '',
                natCity: !isRemoved ? addrData.curCity : '',
                natPinCode: !isRemoved ? addrData.curPinCode : ''
            });
        } else if (addrData.isNatAddCurAddPerAdd === 'sameAsPermanentAddr' &&
            (!this.ddoEditable || trigger === 'nation')) {
            // To update the native address based on the Permanent Address change
            this.updateFromPermanentAddress(trigger);
        }

    }

    /**
     * @description To update the Native Address based on the Permanent Address change
     */
    updateFromPermanentAddress(trigger?) {
        const addrData = this.createEmployeeForm.getRawValue();
        if (addrData.isNatAddCurAddPerAdd === 'sameAsPermanentAddr' && (!this.ddoEditable || trigger === 'nation')) {
            this.getDistricts(addrData.perState, 'nat');
            this.getTalukas(addrData.perDistrict, 'nat');
            this.createEmployeeForm.patchValue({
                natAddress1: addrData.perAddress1,
                natAddress2: addrData.perAddress2,
                natState: addrData.perState,
                natDistrict: addrData.perDistrict,
                natTaluka: addrData.perTaluka,
                natOtherTaluka: addrData.perOtherTaluka,
                natCity: addrData.perCity,
                natPinCode: addrData.perPinCode,
            });
        }
    }

    /**
     * @description To get the PF Approver details
     */
    getApproverDetails() {
        try {
            return new Promise((approverData) => {
                const param = {
                    'id': this.empId
                };
                this.pvuService.getApproverDetails(param).subscribe((data) => {
                    if (data && data['status'] === 200 && data['result']) {
                        approverData(data['result']);
                    } else {
                        this.toastr.error(data['message']);
                        approverData(false);
                    }
                }, (err) => {
                    this.toastr.error(err);
                    approverData(false);
                });
            });
        } catch (err) {
            this.toastr.error(err);
        }
    }

    /**
     * @method onPrint
     * @description Called when employee is printed
     */
    onPrint() {
        this.getApproverDetails().then((apprData) => {
            if (apprData) {
                const sendData = {
                    isJoiningFixPay: this.isJoiningFixPay,
                    isJoining1stPay: this.isJoining1stPay,
                    isJoining2ndPay: this.isJoining2ndPay,
                    isJoining3rdPay: this.isJoining3rdPay,
                    isJoining4thPay: this.isJoining4thPay,
                    isJoining5thPay: this.isJoining5thPay,
                    isJoining6thPay: this.isJoining6thPay,
                    isJoining7thPay: this.isJoining7thPay,
                    hide4thPayCommission: !this.hide4thPayCommission,
                    hide5thPayCommission: !this.hide5thPayCommission,
                    personalData: _.cloneDeep(this.employeeDataPersonal),            // data of personal tab
                    payDetail: _.cloneDeep(this.employeeDataPayDetails),             //  data of pay details tab
                    exam: _.cloneDeep(this.employeeDataExam),                         //  data of exam tab
                    department: _.cloneDeep(this.employeeDataDepartment),              // data of department tab
                    approverData: apprData
                };

                if (this.dataSourceDeptExam && this.dataSourceDeptExam.data &&
                    this.dataSourceDeptExam.data.length > 0) {
                    this.dataSourceDeptExam.data.forEach((deptObj, idx) => {
                        if (deptObj['deptHodNameList'] && deptObj['deptHodNameList'].length > 0) {
                            const name = deptObj['deptHodNameList'].filter(obj => {
                                return obj.id === deptObj.deptHodName;
                            })[0];
                            if (name && name.name) {
                                sendData.exam.pvuEmployeDeptExamDetailsDto[idx]['departmentHodName'] = name['name'];
                            }
                        }
                    });
                }

                // checking if expected keys available or not, if not available assigning one
                if (!sendData.personalData.pvuEmployeDto || sendData.personalData.pvuEmployeDto == null) {
                    sendData.personalData.pvuEmployeDto = {};
                }

                if (!sendData.personalData.pvuEmployeAddressDto || sendData.personalData.pvuEmployeAddressDto == null) {
                    sendData.personalData.pvuEmployeAddressDto = {};
                }

                if (!sendData.payDetail.pvuEmpBankDetailDto || sendData.payDetail.pvuEmpBankDetailDto == null) {
                    sendData.payDetail.pvuEmpBankDetailDto = {};
                }

                if (!sendData.payDetail.pvuEmployeeJoiningPayDto ||
                    sendData.payDetail.pvuEmployeeJoiningPayDto == null) {
                    sendData.payDetail.pvuEmployeeJoiningPayDto = {};
                } else {
                    if (this.isJoiningFixPay && this.fixPayList &&
                        sendData.payDetail.pvuEmployeeJoiningPayDto.payScale) {
                        const payScaleData = this.fixPayList.filter(scaleObj => {
                            // tslint:disable-next-line:max-line-length
                            return scaleObj['lookupInfoId'] === Number(sendData.payDetail.pvuEmployeeJoiningPayDto.payScale);
                        })[0];
                        if (payScaleData && payScaleData['lookupInfoName']) {
                            // tslint:disable-next-line:max-line-length
                            sendData.payDetail.pvuEmployeeJoiningPayDto['joinPayScaleName'] = payScaleData['lookupInfoName'];
                        }
                    } else if (this.isJoining3rdPay && this.join3rdScaleList &&
                        sendData.payDetail.pvuEmployeeJoiningPayDto.payScale) {
                        const payScaleData = this.join3rdScaleList.filter(scaleObj => {
                            return scaleObj['id'] === Number(sendData.payDetail.pvuEmployeeJoiningPayDto.payScale);
                        })[0];
                        if (payScaleData && payScaleData['name']) {
                            sendData.payDetail.pvuEmployeeJoiningPayDto['joinPayScaleName'] = payScaleData['name'];
                        }
                    } else if (this.isJoining4thPay && this.fourPayScaleList &&
                        sendData.payDetail.pvuEmployeeJoiningPayDto.payScale) {
                        const payScaleData = this.fourPayScaleList.filter(scaleObj => {
                            return scaleObj['id'] === Number(sendData.payDetail.pvuEmployeeJoiningPayDto.payScale);
                        })[0];
                        if (payScaleData && payScaleData['name']) {
                            sendData.payDetail.pvuEmployeeJoiningPayDto['joinPayScaleName'] = payScaleData['name'];
                        }
                    } else if (this.isJoining5thPay && this.fivePayScaleList &&
                        sendData.payDetail.pvuEmployeeJoiningPayDto.payScale) {
                        const payScaleData = this.fivePayScaleList.filter(scaleObj => {
                            return scaleObj['id'] === Number(sendData.payDetail.pvuEmployeeJoiningPayDto.payScale);
                        })[0];
                        if (payScaleData && payScaleData['name']) {
                            sendData.payDetail.pvuEmployeeJoiningPayDto['joinPayScaleName'] = payScaleData['name'];
                        }
                    }
                }

                if (!sendData.payDetail.pvuEmployeFixPayDetailsDto ||
                    sendData.payDetail.pvuEmployeFixPayDetailsDto == null) {
                    sendData.payDetail.pvuEmployeFixPayDetailsDto = {};
                }

                if (!sendData.payDetail.pvuEmployefourthPayDetailDto ||
                    sendData.payDetail.pvuEmployefourthPayDetailDto == null) {
                    sendData.payDetail.pvuEmployefourthPayDetailDto = {};
                }

                if (!sendData.payDetail.pvuEmployefivePayDetailDto ||
                    sendData.payDetail.pvuEmployefivePayDetailDto == null) {
                    sendData.payDetail.pvuEmployefivePayDetailDto = {};
                }

                if (!sendData.payDetail.pvuEmployeSixPayDetailDto ||
                    sendData.payDetail.pvuEmployeSixPayDetailDto == null) {
                    sendData.payDetail.pvuEmployeSixPayDetailDto = {};
                }

                if (!sendData.payDetail.pvuEmployeSevenPayDetailDto ||
                    sendData.payDetail.pvuEmployeSevenPayDetailDto == null) {
                    sendData.payDetail.pvuEmployeSevenPayDetailDto = {};
                } else {
                    if (this.cellIdList && sendData.payDetail.pvuEmployeSevenPayDetailDto.cellId) {
                        const cellName = this.cellIdList.filter(cellObj => {
                            return cellObj['id'] === sendData.payDetail.pvuEmployeSevenPayDetailDto.cellId;
                        })[0];
                        if (cellName && cellName['cellId']) {
                            sendData.payDetail.pvuEmployeSevenPayDetailDto['cellIdName'] = cellName['cellId'];
                        }
                    }
                }

                if (this.employeeDataExam.exemptedDeptExamFlag) {
                    sendData.exam.exemptedDeptExam = [sendData.exam.exemptedDeptExam];
                }

                if (this.employeeDataExam.exemptedCccExamFlag) {
                    sendData.exam.exemptedCccExam = [sendData.exam.exemptedCccExam];
                }

                const dialogRef = this.dialog.open(EmployeePrintComponent, {
                    width: '5px',
                    height: '5px',
                    data: sendData
                });
                dialogRef.afterClosed().subscribe(htmlData => {
                    if (htmlData) {
                        let printContents, popupWin;
                        printContents = htmlData;
                        popupWin = window.open('', '_blank');
                        popupWin.document.open();
                        popupWin.document.write(`
                        <html>
                            <head>
                            <style>
                                body {
                                  margin: 0 auto;
                                  padding: 50px;
                                }
                                .top-row {
                                    padding-top: 10px;
                                    padding-bottom: 10px;
                                }
                                .heading {
                                    font-size: 20px;
                                }
                                .sub-heading {
                                    font-size: 14px;
                                    padding-top: 10px;
                                    padding-bottom: 5px;
                                }
                                table {
                                    width: 100%;
                                    border: none;
                                    border-collapse: collapse;
                                }
                                td {
                                    width: 100%;
                                    text-align: left;
                                    font-size: 14px;
                                }
                                th {
                                    font-size: 14px;
                                    text-align: center;
                                    padding: 10px;
                                    border: 1px solid black;
                                }
                                .sub-table {
                                    border: 1px solid black;
                                }
                                .sub-table tr {
                                    border: 1px solid black;
                                }
                                .sub-table td {
                                    width: 50%;
                                    padding: 10px;
                                    border: 1px solid black;
                                }
                                .data-table-5 td {
                                    width: 20%;
                                    font-size: 14px;
                                    text-align: center;
                                }
                                .data-table-7 td {
                                    width: 14%;
                                    font-size: 14px;
                                    text-align: center;
                                }
                                @media print {
                                    .top-row {
                                        padding-top: 10px;
                                        padding-bottom: 10px;
                                    }
                                    .heading {
                                        font-size: 20px;
                                    }
                                    .sub-heading {
                                        font-size: 14px;
                                        padding-top: 10px;
                                        padding-bottom: 5px;
                                    }
                                    table {
                                        width: 100%;
                                        border: none;
                                        border-collapse: collapse;
                                    }
                                    td {
                                        width: 100%;
                                        text-align: left;
                                        font-size: 14px;
                                    }
                                    th {
                                        font-size: 14px;
                                        text-align: center;
                                        padding: 10px;
                                        border: 1px solid black;
                                    }
                                    .sub-table {
                                        border: 1px solid black;
                                    }
                                    .sub-table tr {
                                        border: 1px solid black;
                                    }
                                    .sub-table td {
                                        width: 50%;
                                        padding: 10px;
                                        border: 1px solid black;
                                    }
                                    .data-table-5 td {
                                        width: 20%;
                                        font-size: 14px;
                                        text-align: center;
                                    }
                                    .data-table-7 td {
                                        width: 14%;
                                        font-size: 14px;
                                        text-align: center;
                                    }
                                }
                            </style>
                            </head>
                        <body>${printContents}</body>
                        </html>`
                        );
                    }
                });
            }
        });
    }

    /**
     * @method openHistoryDialog
     * @description function opens Dialog for showing Field change history
     * @param heading heading for selected tab
     */
    openHistoryDialog(heading, sectionName) {
        // tslint:disable-next-line:prefer-const
        let data = {
            'moduleName': 'PVU',
            'sectionName': sectionName,
            'params': {
                'id': this.empId ? this.empId : 1031 // remove static id in future
            }
        };
        switch (sectionName) {
            case 'PERSONAL_DETAIL':
                data['isTable'] = false;
                data['keyNameToSkip'] = ['itrId', 'empId'];
                break;

            case 'ADDRESS':
                data['isTable'] = false;
                data['keyNameToSkip'] = ['empAddressId'];
                break;
            case 'NOMINEE_DETAIL':
                data['isTable'] = true;
                data['isAnyOtherField'] = true;
                data['otherFields'] = ['relationshipName'];
                data['otherFieldName'] = { 'relationshipName': 'otherRelationship' };
                data['otherFieldValue'] = ['Others'];
                data['tabularData'] = [
                    {
                        'column': 'relationship',
                        'keyName': 'relationshipName',
                        'headerName': 'Relationship'
                    }, {
                        'column': 'nominee',
                        'keyName': 'nomineeName',
                        'headerName': 'Nominee'
                    }, {
                        'column': 'communicationAddress',
                        'keyName': 'nomineeAddress',
                        'headerName': 'Nominee Communication Address'
                    }, {
                        'column': 'age',
                        'keyName': 'nomineeAge',
                        'headerName': 'Age/ DOB of Nominee'
                    }, {
                        'column': 'percentOfShare',
                        'keyName': 'nomineeShare',
                        'headerName': '% Of Share'
                    }
                    // , {
                    //     'column': 'fileName',
                    //     'keyName': 'fileName',
                    //     'headerName': 'File Name'
                    // }
                ];
                break;
            case 'QUALIFICATION':
                data['isTable'] = true;
                data['isAnyOtherField'] = true;
                data['otherFields'] = ['courseName'];
                data['otherFieldName'] = { 'courseName': 'otherCourseName' };
                data['otherFieldValue'] = ['Other'];
                data['tabularData'] = [
                    {
                        'column': 'courseName',
                        'keyName': 'courseName',
                        'headerName': 'Course Name'
                    }, {
                        'column': 'degreeName',
                        'keyName': 'degreeName',
                        'headerName': 'School/ Degree'
                    }, {
                        'column': 'passingYear',
                        'keyName': 'passingYear',
                        'headerName': 'Passing Year'
                    }, {
                        'column': 'percentageCGPA',
                        'keyName': 'percentageCGPA',
                        'headerName': 'Percentage/ CGPA'
                    }, {
                        'column': 'schoolCollege',
                        'keyName': 'schoolCollege',
                        'headerName': 'School/ College'
                    }, {
                        'column': 'universityBoard',
                        'keyName': 'universityBoard',
                        'headerName': 'University/ Board'
                    }, {
                        'column': 'remarks',
                        'keyName': 'remarks',
                        'headerName': 'Remarks'
                    }
                ];
                break;
            case 'EXAM_DETAIL':
                data['isTable'] = true;
                data['tabularData'] = [
                    {
                        'column': 'departmentExamName',
                        'keyName': 'departmentExamName',
                        'headerName': 'Departmental Exam Name'
                    }, {
                        'column': 'examBodyName',
                        'keyName': 'examBodyName',
                        'headerName': 'Exam Body Name'
                    }, {
                        'column': 'dateOfPassing',
                        'keyName': 'dateOfPassing',
                        'headerName': 'Date of Passing'
                    }, {
                        'column': 'examStatus',
                        'keyName': 'examStatus',
                        'headerName': 'Exam Status'
                    }, {
                        'column': 'attempts',
                        'keyName': 'attempts',
                        'headerName': 'Attempts'
                    }, {
                        'column': 'remarks',
                        'keyName': 'remarks',
                        'headerName': 'Remarks'
                    }
                ];
                break;
            case 'CCE_EXAM':
                data['isTable'] = true;
                data['tabularData'] = [
                    {
                        'column': 'cccExamName',
                        'keyName': 'cccExamName',
                        'headerName': 'Exam Name'
                    }, {
                        'column': 'examBodyName',
                        'keyName': 'examBodyName',
                        'headerName': 'Examination Body'
                    }, {
                        'column': 'dateOfExam',
                        'keyName': 'dateOfExam',
                        'headerName': 'Date of Exam'
                    }, {
                        'column': 'dateOfPassing',
                        'keyName': 'dateOfPassing',
                        'headerName': 'Date of Passing'
                    }, {
                        'column': 'examStatusName',
                        'keyName': 'examStatusName',
                        'headerName': 'Exam Status Name'
                    }, {
                        'column': 'certificateNumber',
                        'keyName': 'certificateNumber',
                        'headerName': 'Notification/ Certificate Number'
                    }, {
                        'column': 'remarks',
                        'keyName': 'remarks',
                        'headerName': 'Remarks'
                    }
                ];
                break;
            case 'LANGUAGE_EXAM':
                data['isTable'] = true;
                data['tabularData'] = [
                    {
                        'column': 'languageName',
                        'keyName': 'languageName',
                        'headerName': 'Language'
                    }, {
                        'column': 'examBody',
                        'keyName': 'examBody',
                        'headerName': 'Exam Body'
                    }, {
                        'column': 'examTypeName',
                        'keyName': 'examTypeName',
                        'headerName': 'Exam Type'
                    }, {
                        'column': 'dateOfPassing',
                        'keyName': 'dateOfPassing',
                        'headerName': 'Date of Passing'
                    }, {
                        'column': 'seatNumber',
                        'keyName': 'seatNumber',
                        'headerName': 'Seat Number'
                    }, {
                        'column': 'examStatusName',
                        'keyName': 'examStatusName',
                        'headerName': 'Exam Status'
                    }, {
                        'column': 'remarks',
                        'keyName': 'remarks',
                        'headerName': 'Remarks'
                    }
                ];
                break;
            case 'EMPLOYEE_HISTORY':
                data['isTable'] = true;
                data['tabularData'] = [
                    {
                        'column': 'employementTypeName',
                        'keyName': 'employementTypeName',
                        'headerName': 'Type of Employement'
                    }, {
                        'column': 'departmentName',
                        'keyName': 'departmentName',
                        'headerName': 'Department Name'
                    }, {
                        'column': 'currentOfficeName',
                        'keyName': 'currentOfficeName',
                        'headerName': 'Office Name'
                    }, {
                        'column': 'officeAddress',
                        'keyName': 'officeAddress',
                        'headerName': 'Office Address'
                    }, {
                        'column': 'employeeDesignation',
                        'keyName': 'employeeDesignation',
                        'headerName': 'Designation'
                    }, {
                        'column': 'fromDate',
                        'keyName': 'fromDate',
                        'headerName': 'From Date'
                    }, {
                        'column': 'toDate',
                        'keyName': 'toDate',
                        'headerName': 'To Date'
                    }, {
                        'column': 'lastPayDrawn',
                        'keyName': 'lastPayDrawn',
                        'headerName': 'Last Pay Drawn'
                    }, {
                        'column': 'order',
                        'keyName': 'order',
                        'headerName': 'Is Service Continuation?'
                    }, {
                        'column': 'orderNo',
                        'keyName': 'orderNumber',
                        'headerName': 'Order No'
                    }
                ];
                break;
            case 'DEPARTMENT_DETAIL':
                data['isTable'] = false;
                data['keyNameToSkip'] = ['departmentId', 'empId'];
                break;
        }
        const widthDialog: string = String(window.innerWidth - (window.innerWidth / 4)) + 'px';
        const heightDialog: string = String(window.innerHeight - (window.innerHeight / 4)) + 'px';
        const sendData = {
            'heading': heading,
            'data': data
        };
        this.dialog.open(FieldsHistoryDialogComponent, {
            width: widthDialog,
            height: heightDialog,
            data: sendData
        });
    }
}
