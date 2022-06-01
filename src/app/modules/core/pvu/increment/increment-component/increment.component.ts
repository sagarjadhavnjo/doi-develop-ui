import { EventViewPopupService } from './../../services/event-view-popup.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/shared/services/storage.service';
import { IncrementCreationService } from '../services/increment-creation.service';
import { CommonService } from 'src/app/modules/services/common.service';
import {
    ClassName, PayCommissionList, DesignationList, EmpTypeList,
    ReasonForExclusionList, StopIncrementList, EmpPayTypeList
} from '../models/increment-create';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { SaveDraftDialogComponent } from './save-draft-dialog.component';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { ForwardDialogComponent } from '../../pvu-common/forward-dialog/forward-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { RouteService } from 'src/app/shared/services/route.service';
import { SearchEmployeeComponent } from '../../pvu-common/search-employee/search-employee.component';

@Component({
    selector: 'app-exclude-dialog',
    templateUrl: './exclude-dialog.html',
})
export class ExcludeDialogComponent implements OnInit {
    showData;
    excludeDialogForm: FormGroup;
    showExclusionReasion: boolean = false;
    reasonDrp: number;
    stopIncrementDrp: number;
    exclusionReasionCtrl: FormControl = new FormControl();
    resionForStopCtrl: FormControl = new FormControl();
    reasonForExclusionList: ReasonForExclusionList[] = [];
    stopIncrementList: StopIncrementList[] = [];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ExcludeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    ngOnInit() {
        this.excludeDialogForm = this.fb.group({
            exclusionReasion: ['', Validators.required],
            resionForStop: ['', Validators.required],
            stopIncFromDate: ['', Validators.required],
            stopIncToDate: ['', Validators.required],
            dateNxtInc: ['', Validators.required]
        });
        this.reasonForExclusionList = this.data.reasonForExclusionList;
        this.stopIncrementList = this.data.stopIncrementList;
    }

    /**
     * /@function  exclusionReasion
     *  @description Assign lookup value in Reason for exclude pop-up
     *  @param -
     *  @returns Assign lookup value
     */
    exclusionReasion() {
        const controlValue = this.excludeDialogForm.controls.exclusionReasion.value;
        if (this.reasonForExclusionList) {
            const exculdeReason = this.reasonForExclusionList.filter(obj => {
                return obj.lookupInfoId === controlValue;
            })[0];
            if (exculdeReason) {
                if (exculdeReason.lookupInfoName.toLowerCase() === 'Stop Increment'.toLowerCase()) {
                    this.showExclusionReasion = true;
                    this.excludeDialogForm.controls.resionForStop.setValidators(Validators.required);
                    this.excludeDialogForm.controls.stopIncFromDate.setValidators(Validators.required);
                    this.excludeDialogForm.controls.stopIncToDate.setValidators(Validators.required);
                    this.excludeDialogForm.controls.dateNxtInc.setValidators(Validators.required);
                } else if (exculdeReason.lookupInfoName.toLowerCase() === 'Absent'.toLowerCase()) {
                    this.excludeDialogForm.controls.resionForStop.clearValidators();
                    this.excludeDialogForm.controls.resionForStop.updateValueAndValidity();
                    this.excludeDialogForm.controls.stopIncFromDate.clearValidators();
                    this.excludeDialogForm.controls.stopIncFromDate.updateValueAndValidity();
                    this.excludeDialogForm.controls.stopIncToDate.clearValidators();
                    this.excludeDialogForm.controls.stopIncToDate.updateValueAndValidity();
                    this.excludeDialogForm.controls.dateNxtInc.clearValidators();
                    this.excludeDialogForm.controls.dateNxtInc.updateValueAndValidity();
                    this.showExclusionReasion = false;
                }
            }
        }
    }

    /**
     * /@function  excludeDialogFormSubmit
     *  @description Reason for exclude pop-up data sent to exclude data source
     *  @param data Reason for exclude selected form data
     *  @returns Reason for exclude pop-up data
     */
    excludeDialogFormSubmit(data) {
        const showData = this.excludeDialogForm.value,
            dataToSend = _.cloneDeep(this.excludeDialogForm.value),
            excludeReason = this.reasonForExclusionList.filter(reason => {
                return reason.lookupInfoId === showData.exclusionReasion;
            }),
            reasonStop = this.stopIncrementList.filter(reason => {
                return reason.lookupInfoId === showData.resionForStop;
            });
        dataToSend['exclusionReasion'] = this.excludeDialogForm.controls.exclusionReasion.value;
        dataToSend['exclusionReasionValue'] = excludeReason[0] ? excludeReason[0].lookupInfoName : null;
        dataToSend['resionForStop'] = this.excludeDialogForm.controls.resionForStop.value;
        dataToSend['resionForStopValue'] = reasonStop[0] ? reasonStop[0].lookupInfoName : null;

        if (this.excludeDialogForm.invalid) {
            _.each(this.excludeDialogForm.controls, control => {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
        } else {
            this.dialogRef.close(dataToSend);
        }
    }

    /**
     * /@function  onClickExcludeDialog
     *  @description for Closing of Reason for exclude pop-up
     *  @param -
     *  @returns for Closing of Reason for exclude pop-up
     */
    onClickExcludeDialog() {
        this.dialogRef.close(this.excludeDialogForm.value);
    }
}
@Component({
    selector: 'app-increment',
    templateUrl: './increment.component.html',
    styleUrls: ['./increment.component.css']
})
export class IncrementComponent implements OnInit {
    searchIncrementForm: FormGroup;
    errorMessages = pvuMessage;
    showEmpListData: boolean = false;
    showSummary: boolean = false;
    employeeIncrement: boolean = false;
    checkedExclude: boolean = false;
    currentDetailsCols = 3;
    revisedDetailsCols = 5;
    transactionId: boolean;
    transactionNo: string;
    transactionDate: Date;
    userOffice: any;
    currentPost: any;
    lkPoOffUserId: any;
    excludeRowIndex = [];
    includeRowIndex = [];
    classList: ClassName[] = [];
    payCommissionList: PayCommissionList[] = [];
    // incrementTypeList: IncrementTypeList[] = [];
    empTypeList: EmpTypeList[] = [];
    empPayTypeList: EmpPayTypeList[] = [];
    reasonForExclusionList: ReasonForExclusionList[] = [];
    stopIncrementList: StopIncrementList[] = [];
    designationList: DesignationList[] = [];
    statusData: any;
    saveDraftStatusId: number;
    financialYearList: any;
    subscribeParams: Subscription;
    action: any;
    pageTitle: any = 'Create';
    tabDisable: boolean = true;
    doneHeader: boolean = false;
    isExcludeBtnDisable: boolean = true;
    isIncludeBtnDisable: boolean = true;
    inEventId: number;
    submitted: boolean = false;
    incrementDetail: any = {};
    incrementEmployeeDetail: any = {};
    disableEligible: boolean = false;
    disableExclude: boolean = false;
    isApprove: boolean = false;
    isSaveDraftVisible: boolean = false;
    totalRecords: number;
    paginationArray;
    sortBy = '';
    sortOrder: string = '';
    pageSize: number;
    pageSizeExclude: number = 0;
    pageIndexExclude: number = 0;
    pageIndex: number;
    isSearch = '0';
    pageEvent: any;
    storedData: any[] = [];
    eligibleDataList: any[] = [];
    indexedItem: number;
    pageElements: number;
    disableSearchValue: boolean = true;
    newSearch: boolean = false;
    pageSizeOptions: number[] = [10, 25, 100];
    todayDate = new Date();
    minDate: Date;
    maxDate: Date;
    dialogRef: any;
    showEffectiveValidationMsg7Pay: boolean = false;
    showEffectiveValidationMsg6Pay: boolean = false;
    showEffectiveValidationMsg5Pay: boolean = false;
    effectiveDate: any;
    eventId: number;
    isCreator: boolean = false;
    isVerifier: boolean = false;
    isApprover: boolean = false;
    isRework: boolean = false;
    isNonEditable: boolean = false;
    isGetListVisible: boolean = false;
    isResetVisible: boolean = false;
    wfRoleCodeArray: string[] = [];
    statusId: number = 0;
    private sort: MatSort;
    dialogOpen: boolean;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('paginatorExclude') paginatorExclude: MatPaginator;

    finYearCtrl: FormControl = new FormControl();
    payCommissionCtrl: FormControl = new FormControl();
    // incrementTypeCtrl: FormControl = new FormControl();
    empPayTypeCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
    classCtrl: FormControl = new FormControl();
    designationCtrl: FormControl = new FormControl();
    displayedColumnsFooter: string[] = ['checkBox'];
    eligibleForColumns = [];
    defaultEmpColumns = ['checkBox', 'srno', 'empNo', 'empName', 'incrementType', 'gpf', 'className', 'designationName',
        'dateOfJoining', 'revEffDate', 'revDateNexInc',
        'diffAmt', 'susStartDate', 'susEndDate', 'eolStartDate', 'eolEndDate', 'remarks'];
    displayedColumns7thPayComm = ['curPayLevelValue', 'curCellIdValue', 'curBasicPay',
        'revPayLevelValue', 'revCellIdValue', 'revBasicPay'];
    displayedColumns6thPayComm = ['curPayBandRange', 'curPayBandValue', 'curGradePayValue', 'curBasicPay',
        'revPayBandRange', 'revPayBandValue', 'revGradePayValue', 'revBasicPay'];
    displayedColumns5thPayComm = ['curScaleValue', 'curBasicPay', 'revScaleValue', 'revBasicPay'];
    displayedColumns = new BehaviorSubject(this.eligibleForColumns);
    eligibleForIncrement = new MatTableDataSource([]);
    excludeColumns = [];
    defaultExcludeColumns = ['checkBox', 'srno', 'empNo', 'empName', 'incrementType', 'className', 'designationName',
        'dateOfJoining', 'reasonForExclusion', 'remarks'];
    excludeList7thPayComm = ['curPayLevelValue', 'curCellIdValue', 'curBasicPay'];
    excludeList6thPayComm = ['curPayBandRange', 'curPayBandValue', 'curGradePayValue', 'curBasicPay'];
    excludeList5thPayComm = ['curScaleValue', 'curBasicPay'];
    excludeDataColumns = new BehaviorSubject(this.excludeColumns);
    excludedDataSource = new MatTableDataSource([]);
    displayedSummaryColumns = ['class', 'includeCount', 'excludeCount', 'totalCount'];
    summaryDataGet;
    searchParamsChanged = false;
    summaryData = [
        { class: 'Class I', includeCount: 0, excludeCount: 0, totalCount: 0 },
        { class: 'Class II', includeCount: 0, excludeCount: 0, totalCount: 0 },
        { class: 'Class III', includeCount: 0, excludeCount: 0, totalCount: 0 },
        { class: 'Class IV', includeCount: 0, excludeCount: 0, totalCount: 0 }
    ];
    summaryDataSource = new MatTableDataSource([]);
    subscriberArray: Subscription[] = [];
    tempPayCommList;
    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private storageService: StorageService,
        private incrementCreationService: IncrementCreationService,
        private commonService: CommonService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private datepipe: DatePipe,
        private routeService: RouteService,
        private eventViewPopupService: EventViewPopupService,
    ) { }

    ngOnInit() {
        const userOffice = this.storageService.get('currentUser');
        if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
            this.currentPost = userOffice['post'].filter((item) => item['loginPost'] === true);
        }
        this.createForm();
        if (this.action === 'new') {
            this.subscriberArray.push(this.searchIncrementForm.valueChanges.subscribe(res => {
                this.searchParamsChanged = true;
            }));
        }
        this.getLookupDetails();
        this.getFinancialYears();
        this.getDesignation();
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.indexedItem = 0;
        this.pageElements = 250;
        this.pageSize = this.paginationArray[0];
        this.pageIndex = 0;

        this.eligibleForIncrement.sort = this.sort;
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action === 'edit') {
                this.pageTitle = 'Edit';
            } else if (this.action === 'view') {
                this.pageTitle = '';
            }
            if (this.action === 'edit' || this.action === 'view') {
                this.inEventId = +resRoute.id;
                if (this.inEventId) {
                    this.getRopTransactionWfRoleCode();
                    this.getIncrementDetail();
                    this.getIncrementEmployeeDetails();
                    this.searchIncrementForm.disable();
                    this.transactionId = true;
                    this.showEmpListData = true;
                    this.showSummary = true;
                    this.doneHeader = true;

                    if (this.action === 'view') {
                        this.submitted = true;
                        this.disableEligible = true;
                        this.disableExclude = true;
                    }
                    this.tabDisable = false;
                } else {
                    this.router.navigate(['../new'], { relativeTo: this.activatedRoute });
                }
            } else {
                this.isSaveDraftVisible = true;
            }
        });

        const eventID = +this.eventViewPopupService.eventID;
        // const eventCode = this.eventViewPopupService.eventCode;
        this.eventViewPopupService.eventID = 0;
        this.eventViewPopupService.eventCode = '';
        if (eventID !== 0) {
            this.dialogOpen = true;
            this.action = 'view';
            this.pageTitle = '';
            this.inEventId = eventID;
            if (this.inEventId) {
                this.getRopTransactionWfRoleCode();
                this.getIncrementDetail();
                this.getIncrementEmployeeDetails();
                this.searchIncrementForm.disable();
                this.transactionId = true;
                this.showEmpListData = true;
                this.showSummary = true;
                this.doneHeader = true;
                this.submitted = true;
                this.disableEligible = true;
                this.disableExclude = true;
                this.tabDisable = false;
            }
        }
    }

    /**
     * /@function  setDataSourceAttributes
     *  @description Assign Pagination and sorting in eligible data source
     *  @param -
     *  @returns Assign Pagination and sorting
     */
    setDataSourceAttributes() {
        this.eligibleForIncrement.paginator = this.paginator;
        this.eligibleForIncrement.sort = this.sort;
    }


    /**
     * /@function  createForm
     *  @description Creation of Increment Form Group
     *  @param -
     *  @returns Creation of Increment Form
     */
    createForm() {
        this.searchIncrementForm = this.fb.group({
            financialYear: ['', Validators.required],
            officeName: [this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeName']],
            incrementFor: [ 152 , Validators.required],
            empPayType: [156],
            empType: [''],
            classId: [''],
            designationId: [''],
            incrementEffDate: ['', Validators.required],
            dateNextInc: [''],
            gpf: [''],
            empNo: [''],
        });
    }


    /**
    * /@function  setPageSizeOptions
    *  @description set Per page record in eligible and exclude employee list
    *  @param setPageSizeOptionsInput pass page size option
    *  @returns set Per page record in eligible and exclude employee list
    */
    setPageSizeOptions(setPageSizeOptionsInput: string) {
        if (setPageSizeOptionsInput) {
            this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
        }
    }

    /**
     * /@function  effectiveDateChange
     *  @description set NextIncrement Date on the selection of effective date
     *  @param -
     *  @returns set NextIncrement Date
     */
    effectiveDateChange() {
        const currentDate = this.searchIncrementForm.get('incrementEffDate').value;
        // tslint:disable-next-line: max-line-length
        this.searchIncrementForm.controls.dateNextInc.patchValue(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate()));
        this.eligibleForIncrement.data.forEach(el => {
            el.revEffDate = currentDate;
        });
    }

    /**
     * /@function  nextIncrementDateChange
     *  @description Check that next increment data is always greater then effective data.
     *  @param event pass next increment data
     *  @returns Check that next increment data is always greater then effective data.
     */
    nextIncrementDateChange(event) {
        const nextIncrementDate = this.searchIncrementForm.get('dateNextInc').value;
        if (nextIncrementDate < this.searchIncrementForm.controls.incrementEffDate.value) {
            this.toastr.error('Date of Next Increment should be greater then Effective Date.');
            event.target.value = '';
        }
        this.eligibleForIncrement.data.forEach(el => {
            el.revDateNexInc = nextIncrementDate;
        });
    }

    /**
     * /@function  onPayCommissionChange
     *  @description On the change of paycommission value set effective date
     *  @param pay pass paycommission
     *  @returns On the change of paycommission value set effective date
     */
    onPayCommissionChange(pay?) {
        const self = this,
            payCommValue = self.searchIncrementForm.controls.incrementFor.value,
            fySelectedId = self.searchIncrementForm.get('financialYear').value;
        this.effectiveDate = self.searchIncrementForm.get('incrementEffDate').value;
        let fy;
        fy = self.financialYearList.filter(fyObj => {
            return fyObj.financialYearId === fySelectedId;
        })[0];

        if (fy) {
            fy = fy.fyStart;
        }
        switch (payCommValue) {
            case 152:
                self.minDate = new Date(fy, 0, 1);
                if (self.effectiveDate !== self.minDate) {
                    this.showEffectiveValidationMsg7Pay = true;
                    this.showEffectiveValidationMsg6Pay = false;
                }
                break;
            case 151:
                self.minDate = new Date(fy, 6, 1);
                self.maxDate = new Date(fy, 6, 1);
                if (self.effectiveDate !== self.minDate) {
                    this.showEffectiveValidationMsg7Pay = false;
                    this.showEffectiveValidationMsg6Pay = true;
                }
                break;
            case 150:
            default:
                self.minDate = new Date(fy, 0, 1);
                self.maxDate = new Date(fy, 11, 31);
                break;
        }
        if (this.checkForValueSelected()) {
            this.setEffectiveDate();
        }
    }

    seventhDateOfEffectiveFilter = (d: Date | null) => {
        // const Month = (d || new Date()).getMonth();
        // // Prevent Saturday and Sunday from being selected.
        // return Month === 0 || Month === 6;
        const payCommValue = this.searchIncrementForm.controls.incrementFor.value;
        let month, dateN;
        switch (payCommValue) {
            case 151:
                month = (d || new Date()).getMonth();
                dateN = (d || new Date()).getDate();
                // Prevent Saturday and Sunday from being selected.
                return month === 6 && dateN === 1;
                break;
            case 152:
                month = (d || new Date()).getMonth();
                dateN = (d || new Date()).getDate();
                // Prevent Saturday and Sunday from being selected.
                return (month === 0 || month === 6) && dateN === 1;
                break;
            default:
                return true;
                break;
        }
    }

    /**
     * /@function  showEmpList
     *  @description Show Eligible and Exclude Employee data on the basis of lookup value selection
     *  @param -
     *  @returns Show Eligible and Exclude Employee data
     */
    showEmpList(event) {
        if (this.searchIncrementForm.invalid) {
            _.each(this.searchIncrementForm.controls, checkControl => {
                if (checkControl.status === 'INVALID') {
                    checkControl.markAsTouched({ onlySelf: true });
                }
            });
        } else {
            this.isExcludeBtnDisable = true;
            this.showEmpListData = true;
            this.showSummary = true;
            this.errorMessages = pvuMessage;
            this.newSearch = true;
            this.pageIndex = 0;
            this.pageIndexExclude = 0;
            this.payCommissionChange();
            this.getData();
            this.searchIncrementForm.disable();
        }
    }

    /**
     * /@function  payCommissionChange
     *  @description Show Eligible and Exclude datasource column's on the basis of Pay Commission selected
     *  @param -
     *  @returns Show Eligible and Exclude datasource column's on the basis of Pay Commission selected
     */
    payCommissionChange() {
        const controlValue = this.searchIncrementForm.controls.incrementFor.value;
        let payCommColumns = [],
            excludePayComm = []
            ;
        this.eligibleForColumns = _.cloneDeep(this.defaultEmpColumns);
        this.excludeColumns = _.cloneDeep(this.defaultExcludeColumns);
        if (controlValue === 152) {
            payCommColumns = _.cloneDeep(this.displayedColumns7thPayComm);
            excludePayComm = _.cloneDeep(this.excludeList7thPayComm);
            this.currentDetailsCols = 3;
            this.revisedDetailsCols = 5;
        } else if (controlValue === 151) {
            payCommColumns = _.cloneDeep(this.displayedColumns6thPayComm);
            excludePayComm = _.cloneDeep(this.excludeList6thPayComm);
            this.currentDetailsCols = 4;
            this.revisedDetailsCols = 6;
        } else if (controlValue === 150) {
            payCommColumns = _.cloneDeep(this.displayedColumns5thPayComm);
            excludePayComm = _.cloneDeep(this.excludeList5thPayComm);
            this.currentDetailsCols = 2;
            this.revisedDetailsCols = 4;
        }
        this.eligibleForColumns.splice(9, 0, ...payCommColumns);
        this.displayedColumns.next(this.eligibleForColumns);
        this.excludeColumns.splice(7, 0, ...excludePayComm);
        this.excludeDataColumns.next(this.excludeColumns);
    }

    /**
     * /@function  getData
     *  @description Get Eligible, Exclude Employee data with pagination and Prepare Summary data
     * on the basis of lookup value selection
     *  @param - officeId, incrementFor, financialYearId, incrementType, classId, designationId,
     * pPan, empNo, nextIncrDate, incrEffectiveDate
     *  @returns Get Eligible, Exclude Employee data and summary data on the basis of lookup value selection
     */
    getData(event: any = null) {
        const formData = this.searchIncrementForm.getRawValue();
        const self = this,
            param = {
                'jsonArr': [
                    {
                        'key': 'officeId',
                        'value': this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId']
                    },
                    { 'key': 'incrementFor', 'value': formData.incrementFor },
                    { 'key': 'financialYearId', 'value': formData.financialYear },
                    { 'key': 'empPayType', 'value': formData.empPayType },
                    { 'key': 'empType', 'value': formData.empType ? formData.empType : 0 },
                    { 'key': 'classId', 'value': formData.classId ? formData.classId : 0 },
                    { 'key': 'designationId', 'value': formData.designationId ? formData.designationId : 0 },
                    { 'key': 'pPan', 'value': formData.gpf ? formData.gpf : '' },
                    { 'key': 'empNo', 'value': formData.empNo ? formData.empNo : 0 },
                    { 'key': 'nextIncrDate', 'value': this.convertDateFormat(formData.dateNextInc) },
                    { 'key': 'incrEffectiveDate', 'value': this.convertDateFormat(formData.incrementEffDate) }
                ],
                'pageElement': 250,
                'pageIndex': 0
            };
        this.incrementCreationService.getIncrementListData(param).subscribe((res) => {
            self.newSearch = false;
            this.searchParamsChanged = false;
            if (res && res['status'] === 200) {
                self.storedData = _.cloneDeep(res['result']['result']);
                self.assignEligibleData([]);
                self.assignExcludeData([]);
                const excludedData = [], eligibleDataList = [];
                self.summaryData = [
                    { class: 'Class I', includeCount: 0, excludeCount: 0, totalCount: 0 },
                    { class: 'Class II', includeCount: 0, excludeCount: 0, totalCount: 0 },
                    { class: 'Class III', includeCount: 0, excludeCount: 0, totalCount: 0 },
                    { class: 'Class IV', includeCount: 0, excludeCount: 0, totalCount: 0 },
                ];
                if (self.storedData) {
                    this.prepareSummaryData(self.storedData);
                    self.storedData.forEach(objFilterData => {
                        if (objFilterData.reasonForExclude === 0) {
                            eligibleDataList.push(objFilterData);
                        } else {
                            excludedData.push(objFilterData);
                        }
                    });
                    if (eligibleDataList && eligibleDataList.length > 0) {
                        self.pageIndex = 0;
                        self.pageSize = self.paginationArray[0];
                        self.assignEligibleData(eligibleDataList);
                        self.eligibleForIncrement.data.forEach(el => {
                            // if (el.dateOfJoining) {
                            //     el.dateOfJoining = this.dateFormating(el.dateOfJoining);
                            // }
                            if (el.revEffDate) {
                                el.revEffDate = this.dateFormating(el.revEffDate);
                            }
                            // tslint:disable-next-line: max-line-length
                            el.revDateNexIncMin = new Date(el.revEffDate.getFullYear() + 1, el.revEffDate.getMonth(), el.revEffDate.getDate());
                            if (el.revDateNexInc) {
                                el.revDateNexInc = this.dateFormating(el.revDateNexInc);
                            }
                        });
                    }
                    if (excludedData && excludedData.length > 0) {
                        self.pageIndexExclude = 0;
                        self.pageSizeExclude = self.paginationArray[0];
                        self.assignExcludeData(excludedData);
                    }
                }
                setTimeout(() => {
                    self.eligibleForIncrement.sort = self.sort;
                    self.eligibleForIncrement.paginator = self.paginator;
                    if (excludedData && excludedData.length > 0) {
                        self.excludedDataSource.paginator = self.paginatorExclude;
                    }
                });
            } else {
                self.pageIndex = 0;
                self.pageSize = self.paginationArray[0];
                self.assignEligibleData([]);
                self.pageIndexExclude = 0;
                self.pageSizeExclude = self.paginationArray[0];
                self.assignExcludeData([]);
                self.toastr.error(res['message']);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.eligibleForIncrement.sort = self.sort;
            }
        }, (err) => {
            self.toastr.error(err);
        });
    }

    /**
         * /@function dateFormating
         * @description return date and split object
         * @param date Date object
         * @returns return date in the yyyy-MM-dd format
         */
    dateFormating(date) {
        if (date !== 0 && date !== '' && date != null) {
            let d;
            if (date.indexOf('T') !== -1) {
                d = date.split('T')[0].split('-');
            } else if (date.indexOf(' ') !== -1) {
                d = date.split(' ')[0].split('-');
            } else {
                d = date.split('-');
            }
            d = new Date(d[0], Number(d[1]) - 1, d[2]);
            return d;
        }
        return '';
    }

    /**
     * /@function  prepareSummaryData
     *  @description Prepare Summary Data and assign to summary Data Source on the basis of reasonForExclude Flag.
     *  @param data List of Eligible and exclude employee's
     *  @returns Prepare Summary Data
     */
    prepareSummaryData(data) {
        if (data) {
            data.forEach(obj => {
                if (obj.reasonForExclude === 0) {
                    if (obj.classId === 162) {
                        this.summaryData[0]['includeCount']++;
                    }
                    if (obj.classId === 163) {
                        this.summaryData[1]['includeCount']++;
                    }
                    if (obj.classId === 164) {
                        this.summaryData[2]['includeCount']++;
                    }
                    if (obj.classId === 165) {
                        this.summaryData[3]['includeCount']++;
                    }
                } else {
                    if (obj.classId === 162) {
                        this.summaryData[0]['excludeCount']++;
                    }
                    if (obj.classId === 163) {
                        this.summaryData[1]['excludeCount']++;
                    }
                    if (obj.classId === 164) {
                        this.summaryData[2]['excludeCount']++;
                    }
                    if (obj.classId === 165) {
                        this.summaryData[3]['excludeCount']++;
                    }
                }
            });
        }
        this.summaryDataSource = new MatTableDataSource(this.summaryData);
    }

    getSearchFilter() {
        const obj = this.searchIncrementForm.getRawValue();
        const returnArray = [];

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const currObj = {};
                currObj['key'] = key;
                currObj['value'] = '' + (obj[key] || '');
                returnArray.push(currObj);
            }
        }
        return returnArray;
    }

    /**
     * /@function  onPaginateChange
     *  @description updation of pagination on the basis of exclude record from the eligible data list
     *  @param event page event
     *  @returns Updated pagination list
     */
    onPaginateChange(event) {
        const self = this;
        self.pageSize = event.pageSize;
        self.pageIndex = event.pageIndex;
    }

    /**
     * /@function  onPaginateChangeExclude
     *  @description updation of pagination on the basis of include record from the exclude data list
     *  @param event page event
     *  @returns Updated pagination list
     */
    onPaginateChangeExclude(event) {
        const self = this;
        self.pageSizeExclude = event.pageSize;
        self.pageIndexExclude = event.pageIndex;
    }

    /**
     * /@function  onEffectiveDateChange
     *  @description if user checked the record and change effective date, system
     * automatically highlight the remark field
     *  @param (el, event, i) element, checked status, index
     *  @returns Pop-up of Reason for exclude
     */
    onEffectiveDateChange(el, event, i) {
        if (el.revEffDate.getTime === event.value.getTime) {
            el.isHighLight = true;
        } else {
            el.isHighLight = false;
        }
        if (el.includeExclude) {
            this.onCheckboxChange({ value: true }, i, el);
        }
    }

    /**
     * /@function  onNextIncrementDateChange
     *  @description if user checked the record and change next increment date, system should
     * prompt mandatory the remark and highlight the section
     *  @param (event, i, el) checked status, index, include row
     *  @returns mandatory the remark and highlight the section
     */
    onNextIncrementDateChange(el, i, event) {
        el.isHighLight = true;
    }

    /**
     * /@function  removeHighlightFlag
     *  @description if user checked the record and change next increment date, system should
     * reset the remark section
     *  @param el include row
     *  @returns reset the remark highlight
     */
    removeHighlightFlag(el) {
        el.isHighLight = false;
    }


    /**
    * /@function  excludeReasonDialog
    *  @description when user select and checked the record in eligible data list for exclude the record and
    * click the exclude button pop-up is visible
    *  @param -
    *  @returns Pop-up of Reason for exclude
    */
    excludeReasonDialog(event) {
        const self = this;
        const dialogRef = this.dialog.open(ExcludeDialogComponent, {
            width: '800px',
            data: {
                'stopIncrementList': this.stopIncrementList,
                'reasonForExclusionList': this.reasonForExclusionList,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== '') {
                let validForExclude = true,
                    rowData = [];
                const newExcludedEmpId = [];
                // tslint:disable-next-line: max-line-length
                if (this.excludedDataSource && this.excludedDataSource.data && this.excludedDataSource.data.length > 0) {
                    rowData = rowData.concat(this.excludedDataSource.data);
                }

                this.excludeRowIndex.forEach(el => {
                    const exclusionData = self.eligibleForIncrement.data[el];
                    if (exclusionData.isHighLight) {
                        if (exclusionData.remarks) {
                            validForExclude = true;
                        } else {
                            validForExclude = false;
                        }
                    }
                    if (validForExclude) {
                        self.eligibleForIncrement.data[el].reasonForExclusion = _.cloneDeep(result);
                        if (exclusionData) {
                            exclusionData.reasonForExclude = exclusionData.reasonForExclusion.exclusionReasion;
                            // tslint:disable-next-line: max-line-length
                            exclusionData.reasonForExcludeValue = exclusionData.reasonForExclusion.exclusionReasionValue;
                            exclusionData.stopIncrementType = exclusionData.reasonForExclusion.resionForStop;
                            exclusionData.stopIncrementTypeValue = exclusionData.reasonForExclusion.resionForStopValue;
                            exclusionData.stopIncFromDate =
                                this.convertDateFormat(exclusionData.reasonForExclusion.stopIncFromDate);
                            exclusionData.stopIncToDate =
                                this.convertDateFormat(exclusionData.reasonForExclusion.stopIncToDate);
                            exclusionData.dateNxtInc =
                                this.convertDateFormat(exclusionData.reasonForExclusion.dateNxtInc);
                        }
                        newExcludedEmpId.push(exclusionData.empId);
                        exclusionData.includeToExclude = false;
                        exclusionData.includeExclude = false;
                        rowData.push(exclusionData);
                        this.countExcludeInclude('exclude', exclusionData);
                    } else {
                        validForExclude = true;
                        exclusionData.includeToExclude = false;
                        exclusionData.includeExclude = false;
                    }
                });

                this.assignExcludeData(rowData);
                this.assignEligibleData(self.eligibleForIncrement.data.filter(el => {
                    return !newExcludedEmpId.includes(el.empId);
                }));
                this.excludeRowIndex = [];
                this.isExcludeBtnDisable = true;
                this.onAllCheckIncludeChange({ checked: false });
                this.excludeRowIndex = [];
                this.pageIndex = 0;
                this.employeeIncrement = false;
            }
        });
    }

    /**
    * /@function  onAllCheckIncludeChange
    *  @description find the checkbox is checked in eligible data source list
    *  @param event all select checkbox checked
    *  @returns find the checkbox is checked in eligible data source list
    */
    onAllCheckIncludeChange(event) {
        const self = this;
        self.excludeRowIndex = [];
        if (event.checked) {
            self.eligibleForIncrement.data.forEach((includeRow, index) => {
                includeRow.includeExclude = true;
                self.onCheckboxChange({ checked: true }, index, includeRow, true);
            });
        } else {
            self.eligibleForIncrement.data.forEach((includeRow, index) => {
                includeRow.includeExclude = false;
                self.onCheckboxChange({ checked: false }, index, includeRow, true);
            });
        }
        if (this.excludeRowIndex.length === this.eligibleForIncrement.data.length) {
            this.employeeIncrement = true;
        } else {
            this.employeeIncrement = false;
        }
    }

    /**
     * /@function  onCheckboxChange
     *  @description if user checked the record and change next increment date, system should
     * prompt the messge that remark is mandatory
     *  @param (event, i, el) checked status, index, include row
     *  @returns Pop-up of Reason for exclude
     */
    onCheckboxChange(event, i, el, allClicked = false) {
        if (event.checked) {
            this.isExcludeBtnDisable = false;
            const rowData = this.eligibleForIncrement.data[i];
            this.eligibleForIncrement.data.forEach((elm) => {
                if (elm.empNo === el.empNo) {
                    // event.checked = true;
                    elm.includeExclude = true;
                }
            });
            if (rowData.isHighLight) {
                if (rowData.remarks) {
                    if (!allClicked) {
                        this.excludeRowIndex.push((this.pageSize * this.pageIndex) + i);
                    } else {
                        this.excludeRowIndex.push(i);
                    }
                    el.includeExclude = true;
                } else {
                    el.includeExclude = false;
                    let removeRowIndex;
                    if (!allClicked) {
                        removeRowIndex = this.excludeRowIndex.indexOf((this.pageSize * this.pageIndex) + i);
                    } else {
                        removeRowIndex = this.excludeRowIndex.indexOf(i);
                    }
                    if (removeRowIndex && removeRowIndex !== -1) {
                        this.excludeRowIndex.splice(removeRowIndex, 1);
                    }
                    this.toastr.error('Please fill remarks for ' + this.eligibleForIncrement.data[i].empName +
                        ' as you changed his/her increment date');
                }
            } else {

                if (!allClicked) {
                    this.eligibleForIncrement.data.forEach((elm, indexAssign) => {
                        if (elm.empNo === el.empNo) {
                            this.excludeRowIndex.push(indexAssign);
                            elm.includeExclude = true;
                        }
                    });
                } else {
                    this.excludeRowIndex.push(i);
                    el.includeExclude = true;
                }
            }
        } else {
            if (!allClicked) {
                this.eligibleForIncrement.data.forEach((elm, indexAssign) => {
                    if (elm.empNo === el.empNo) {
                        if (this.excludeRowIndex.indexOf(indexAssign) !== -1) {
                            this.excludeRowIndex.splice(this.excludeRowIndex.indexOf(indexAssign), 1);
                            elm.includeExclude = false;
                        }
                    }
                });
            } else {
                if (this.excludeRowIndex.indexOf(i) !== -1) {
                    this.excludeRowIndex.splice(this.excludeRowIndex.indexOf(i), 1);
                    el.includeExclude = false;
                }
            }
        }
        if (this.excludeRowIndex.length > 0) {
            this.isExcludeBtnDisable = false;
        } else {
            this.isExcludeBtnDisable = true;
        }
    }

    /**
     * /@function  onAllCheckExcludeChange
     *  @description find the event all checkbox checked
     *  @param event allcheckbox select event
     *  @returns find the event all checkbox checked
     */
    onAllCheckExcludeChange(event) {
        const self = this;
        self.includeRowIndex = [];
        if (event.checked) {
            self.excludedDataSource.data.forEach((excludeRow, index) => {
                if (!excludeRow.systemExcluded) {
                    excludeRow.includeToExclude = true;
                    self.onCheckIncludeToExcludeChange({ checked: true }, index, true);
                }
            });
        } else {
            self.excludedDataSource.data.forEach((excludeRow, index) => {
                excludeRow.includeToExclude = false;
                self.onCheckIncludeToExcludeChange({ checked: false }, index, true);
            });
        }
        if (this.includeRowIndex.length === this.excludedDataSource.data.length) {
            this.checkedExclude = true;
        } else {
            this.checkedExclude = false;
        }
    }

    /**
     * /@function  onCheckIncludeToExcludeChange
     *  @description shift record exclude to eligible data click on include button
     *  @param (event, i) checkbox checked, i index value
     *  @returns find the event all checkbox checked
     */
    onCheckIncludeToExcludeChange(event, i, el, allClicked = false) {
        if (event.checked) {
            this.isIncludeBtnDisable = false;
            this.excludedDataSource.data.forEach((elm) => {
                if (elm.empNo === el.empNo) {
                    elm.includeToExclude = true;
                }
            });
            if (!allClicked) {
                this.excludedDataSource.data.forEach((elm, indexAssign) => {
                    if (elm.empNo === el.empNo) {
                        this.includeRowIndex.push(indexAssign);
                        elm.includeToExclude = true;
                    }
                });
            } else {
                this.includeRowIndex.push(i);
                el.includeToExclude = true;
            }
        } else {
            if (!allClicked) {
                this.excludedDataSource.data.forEach((elm, indexAssign) => {
                    if (elm.empNo === el.empNo) {
                        if (this.includeRowIndex.indexOf(indexAssign) !== -1) {
                            this.includeRowIndex.splice(this.includeRowIndex.indexOf(indexAssign), 1);
                            elm.includeToExclude = false;
                        }
                    }
                });
            } else {
                if (this.includeRowIndex.indexOf(i) !== -1) {
                    this.includeRowIndex.splice(this.includeRowIndex.indexOf(i), 1);
                    el.includeToExclude = false;
                }
            }
        }
        if (this.includeRowIndex.length > 0) {
            this.isIncludeBtnDisable = false;
        } else {
            this.isIncludeBtnDisable = true;
        }
    }

    /**
     * /@function  onIncludeToExcludeChange
     *  @description find the record selected for exclude
     *  @param (event, i) type - event is include, i - index number
     *  @returns find the record selected for exclude
     */
    onIncludeToExcludeChange(event, i) {
        const self = this;
        let rowData = [];
        const newIncludedEmpId = [];
        // tslint:disable-next-line: max-line-length
        if (this.eligibleForIncrement && this.eligibleForIncrement.data && this.eligibleForIncrement.data.length > 0) {
            rowData = rowData.concat(this.eligibleForIncrement.data);
        }
        this.includeRowIndex.forEach(el => {
            // rowData.push(self.excludedDataSource.data[el]);
            const includeData = self.excludedDataSource.data[el];
            if (includeData) {
                includeData.reasonForExclude = 0;
                includeData.reasonForExcludeValue = '';
                includeData.stopIncrementType = '';
                includeData.stopIncrementTypeValue = '';
                includeData.stopIncFromDate = '';
                includeData.stopIncToDate = '';
            }
            newIncludedEmpId.push(includeData.empId);
            includeData.isHighLight = false;
            includeData.includeToExclude = false;
            includeData.includeExclude = false;
            includeData.remarks = null;
            rowData.push(includeData);
            this.countExcludeInclude('include', includeData);
        });
        this.assignExcludeData(self.excludedDataSource.data.filter(el => {
            return !newIncludedEmpId.includes(el.empId);
        }));

        this.assignEligibleData(rowData);
        self.eligibleForIncrement.data.forEach(el => {
            if (el.revEffDate) {
                el.revEffDate = new Date(el.revEffDate);
            }
            if (el.revDateNexInc) {
                el.revDateNexInc = new Date(el.revDateNexInc);
            }
        });
        this.includeRowIndex = [];
        this.isIncludeBtnDisable = true;
        this.onAllCheckExcludeChange({ checked: false });
        this.includeRowIndex = [];
        this.pageIndexExclude = 0;
        this.checkedExclude = false;
    }

    /**
     * /@function  countExcludeInclude
     *  @description updation of summary list data on the updation of exclude and eligible data list
     *  @param (type, data) type - data is exclude or include, data - what is the class of the data?
     *  @returns updation of summary list data
     */
    countExcludeInclude(type, data) {
        if (data && type === 'exclude') {
            if (data.classId === 162) {
                this.summaryData[0]['includeCount']--;
                this.summaryData[0]['excludeCount']++;
            }
            if (data.classId === 163) {
                this.summaryData[1]['includeCount']--;
                this.summaryData[1]['excludeCount']++;
            }
            if (data.classId === 164) {
                this.summaryData[2]['includeCount']--;
                this.summaryData[2]['excludeCount']++;
            }
            if (data.classId === 165) {
                this.summaryData[3]['includeCount']--;
                this.summaryData[3]['excludeCount']++;
            }
        } else if (data && type === 'include') {
            if (data.classId === 162) {
                this.summaryData[0]['includeCount']++;
                this.summaryData[0]['excludeCount']--;
            }
            if (data.classId === 163) {
                this.summaryData[1]['includeCount']++;
                this.summaryData[1]['excludeCount']--;
            }
            if (data.classId === 164) {
                this.summaryData[2]['includeCount']++;
                this.summaryData[2]['excludeCount']--;
            }
            if (data.classId === 165) {
                this.summaryData[3]['includeCount']++;
                this.summaryData[3]['excludeCount']--;
            }
        }
    }

    /**
     * /@function  OnSaveAsDraft
     *  @description To Save the transaction
     *  @param dataToSend Transaction details
     *  @returns Generate unique transaction id
     */
    onSaveAsDraft(event) {
        let valid = true;
        const self = this;
        if (this.searchIncrementForm.invalid || this.searchParamsChanged) {
            _.each(this.searchIncrementForm.controls, function (ctrl) {
                if (ctrl.status === 'INVALID') {
                    ctrl.markAsTouched({ onlySelf: true });
                    valid = false;
                }
            });
            if (this.searchParamsChanged) {
                this.toastr.error('Please click getlist !');
            }
        } else {
            this.transactionId = true;
            const dataToSend = _.cloneDeep(this.searchIncrementForm.getRawValue()),
                eligibleData = _.cloneDeep(this.eligibleForIncrement.data);
            const excludedData = _.cloneDeep(this.excludedDataSource.data);

            if (eligibleData) {
                eligibleData.forEach(eligible => {
                    if (eligibleData instanceof Date) {
                        // tslint:disable-next-line: max-line-length
                        eligible.dateOfJoining = this.convertDateFormat(eligible.dateOfJoining.split('T')[0].split('-'));
                        eligible.revEffDate = this.convertDateFormat(eligible.revEffDate);
                        eligible.revDateNexInc = this.convertDateFormat(eligible.revDateNexInc);
                    }
                });
            }
            if (excludedData) {
                excludedData.forEach(exclude => {
                    if (excludedData instanceof Date) {
                        exclude.revEffDate = this.convertDateFormat(exclude.revEffDate);
                        exclude.revDateNexInc = this.convertDateFormat(exclude.revDateNexInc);
                    }
                });
            }
            dataToSend['incrementEffDate'] = this.convertDateFormat(dataToSend['incrementEffDate']);
            dataToSend['dateNextInc'] = this.convertDateFormat(dataToSend['dateNextInc']);
            dataToSend['officeId'] = this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId'];
            dataToSend['statusId'] = this.statusId;
            dataToSend['inEventId'] = this.inEventId;
            dataToSend['trnNo'] = this.transactionNo;
            dataToSend['createdDate'] = this.transactionDate;
            dataToSend['pvuIncrementEmpDtos'] = [];
            if (eligibleData) {
                dataToSend['pvuIncrementEmpDtos'] = dataToSend['pvuIncrementEmpDtos'].concat(_.cloneDeep(eligibleData));
            }
            if (excludedData) {
                dataToSend['pvuIncrementEmpDtos'] = dataToSend['pvuIncrementEmpDtos'].concat(_.cloneDeep(excludedData));
            }
            dataToSend['pvuIncrementEventSummaryDto'] = {
                classOneInclCount: _.cloneDeep(this.summaryDataSource.data[0].includeCount),
                classOneExclCount: _.cloneDeep(this.summaryDataSource.data[0].excludeCount),
                classTwoInclCount: _.cloneDeep(this.summaryDataSource.data[1].includeCount),
                classTwoExclCount: _.cloneDeep(this.summaryDataSource.data[1].excludeCount),
                classThreeInclCount: _.cloneDeep(this.summaryDataSource.data[2].includeCount),
                classThreeExclCount: _.cloneDeep(this.summaryDataSource.data[2].excludeCount),
                classFourInclCount: _.cloneDeep(this.summaryDataSource.data[3].includeCount),
                classFourExclCount: _.cloneDeep(this.summaryDataSource.data[3].excludeCount)
            };
            this.incrementCreationService.saveIncrementDetails(dataToSend).subscribe(res => {
                if (res && res['result'] && res['status'] === 200) {
                    this.toastr.success(res['message']);
                    this.transactionNo = res['result']['trnNo'];
                    this.transactionDate = res['result']['createdDate'];
                    this.inEventId = res['result']['inEventId'];
                    this.incrementDetail = res['result'];
                    this.statusId = res['result']['statusId'];
                    if (self.incrementDetail) {
                        if (self.incrementDetail.pvuIncrementEmpDtos) {
                            self.eligibleForIncrement.data.forEach(el => {
                                // tslint:disable-next-line: max-line-length
                                const pvuIncrementEmpDtosDataDTO = self.incrementDetail.pvuIncrementEmpDtos.filter((pvuIncrementEmpDtosData) => {
                                    // tslint:disable-next-line:max-line-length
                                    return el.empId === pvuIncrementEmpDtosData.empId && el.incrementType === pvuIncrementEmpDtosData.incrementType;
                                })[0];
                                if (pvuIncrementEmpDtosDataDTO) {
                                    el.inEmpId = pvuIncrementEmpDtosDataDTO.inEmpId;
                                }
                            });
                            self.excludedDataSource.data.forEach(elmt => {
                                // tslint:disable-next-line: max-line-length
                                const pvuIncrementEmpDtosDataDTO = self.incrementDetail.pvuIncrementEmpDtos.filter((pvuIncrementEmpDtosData) => {
                                    // tslint:disable-next-line:max-line-length
                                    return elmt.empId === pvuIncrementEmpDtosData.empId && elmt.incrementType === pvuIncrementEmpDtosData.incrementType;
                                })[0];
                                if (pvuIncrementEmpDtosDataDTO) {
                                    elmt.inEmpId = pvuIncrementEmpDtosDataDTO.inEmpId;
                                }
                            });
                        }

                    }
                    if (this.incrementDetail.status === 'SUBMIT') {
                        this.submitted = true;
                    }
                    if (this.incrementDetail.pvuIncrementEventSummaryDto) {
                        this.summaryData[0].includeCount =
                            this.incrementDetail.pvuIncrementEventSummaryDto.classOneInclCount;
                        this.summaryData[0].excludeCount =
                            this.incrementDetail.pvuIncrementEventSummaryDto.classOneExclCount;
                        this.summaryData[0].totalCount =
                            (this.summaryData[0].includeCount + this.summaryData[0].excludeCount);
                        this.summaryData[1].includeCount =
                            this.incrementDetail.pvuIncrementEventSummaryDto.classTwoInclCount;
                        this.summaryData[1].excludeCount =
                            this.incrementDetail.pvuIncrementEventSummaryDto.classTwoExclCount;
                        this.summaryData[1].totalCount =
                            (this.summaryData[1].includeCount + this.summaryData[1].excludeCount);
                        this.summaryData[2].includeCount =
                            this.incrementDetail.pvuIncrementEventSummaryDto.classThreeInclCount;
                        this.summaryData[2].excludeCount =
                            this.incrementDetail.pvuIncrementEventSummaryDto.classThreeExclCount;
                        this.summaryData[2].totalCount =
                            (this.summaryData[2].includeCount + this.summaryData[2].excludeCount);
                        this.summaryData[3].includeCount =
                            this.incrementDetail.pvuIncrementEventSummaryDto.classFourInclCount;
                        this.summaryData[3].excludeCount =
                            this.incrementDetail.pvuIncrementEventSummaryDto.classFourExclCount;
                        this.summaryData[3].totalCount =
                            (this.summaryData[3].includeCount + this.summaryData[3].excludeCount);
                        this.summaryDataSource = new MatTableDataSource(this.summaryData);
                    }
                    this.payCommissionChange();
                } else {
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        }

    }

    /**
     * /@function  onSubmit
     *  @description To Submit the transaction
     *  @param dataToSend Transaction details
     *  @returns successful submission Popup
     */
    onSubmit() {
        if (this.transactionId) {
            let valid = true;
            const self = this;
            if (this.searchIncrementForm.invalid || this.searchParamsChanged) {
                _.each(this.searchIncrementForm.controls, function (control) {
                    if (control.status === 'INVALID') {
                        control.markAsTouched({ onlySelf: true });
                        valid = false;
                    }
                });
                if (this.searchParamsChanged) {
                    this.toastr.error('Please click getlist !');
                }
            } else {
                this.transactionId = true;
                const dataToSend = _.cloneDeep(this.searchIncrementForm.getRawValue());
                const eligibleData = _.cloneDeep(this.eligibleForIncrement.data);
                const excludedData = _.cloneDeep(this.excludedDataSource.data);
                if (eligibleData) {
                    eligibleData.forEach(eligibleDates => {
                        if (eligibleData instanceof Date) {
                            // tslint:disable-next-line: max-line-length
                            eligibleDates.dateOfJoining = this.convertDateFormat(eligibleDates.dateOfJoining.split('T')[0].split('-'));
                            eligibleDates.revEffDate = this.convertDateFormat(eligibleDates.revEffDate);
                            eligibleDates.revDateNexInc = this.convertDateFormat(eligibleDates.revDateNexInc);
                        }
                    });
                }
                dataToSend['incrementEffDate'] = this.convertDateFormat(dataToSend['incrementEffDate']);
                dataToSend['dateNextInc'] = this.convertDateFormat(dataToSend['dateNextInc']);
                dataToSend['officeId'] = this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId'];
                dataToSend['lkPoOffUserId'] = this.currentPost[0]['lkPoOffUserId'];
                dataToSend['inEventId'] = this.inEventId;
                dataToSend['trnNo'] = this.transactionNo;
                dataToSend['statusId'] = this.statusId;
                dataToSend['pvuIncrementEmpDtos'] = [];
                if (eligibleData) {
                    dataToSend['pvuIncrementEmpDtos'] =
                        dataToSend['pvuIncrementEmpDtos'].concat(_.cloneDeep(eligibleData));
                }
                if (excludedData) {
                    dataToSend['pvuIncrementEmpDtos'] =
                        dataToSend['pvuIncrementEmpDtos'].concat(_.cloneDeep(excludedData));
                }
                dataToSend['pvuIncrementEventSummaryDto'] = {
                    classOneInclCount: _.cloneDeep(this.summaryDataSource.data[0].includeCount),
                    classOneExclCount: _.cloneDeep(this.summaryDataSource.data[0].excludeCount),
                    classTwoInclCount: _.cloneDeep(this.summaryDataSource.data[1].includeCount),
                    classTwoExclCount: _.cloneDeep(this.summaryDataSource.data[1].excludeCount),
                    classThreeInclCount: _.cloneDeep(this.summaryDataSource.data[2].includeCount),
                    classThreeExclCount: _.cloneDeep(this.summaryDataSource.data[2].excludeCount),
                    classFourInclCount: _.cloneDeep(this.summaryDataSource.data[3].includeCount),
                    classFourExclCount: _.cloneDeep(this.summaryDataSource.data[3].excludeCount)
                };
                this.incrementCreationService.validateIncrementDetails(dataToSend).subscribe((res) => {
                    if (res && res['result'] && res['status'] === 200) {
                        this.incrementCreationService.saveIncrementDetails(dataToSend).subscribe((resData) => {
                            if (resData && resData['result'] && resData['status'] === 200) {
                                self.toastr.success(resData['message']);
                                this.inEventId = resData['result']['inEventId'];
                                this.lkPoOffUserId = resData['result']['lkPoOffUserId'];
                                this.openWorkFlowPopUp();
                            } else {
                                self.toastr.error(resData['message']);
                            }
                        }, (err) => {
                            self.toastr.error(err);
                        });
                    } else {
                        self.toastr.error(res['message']);
                    }
                }, (err) => {
                    self.toastr.error(err);
                });
            }
        }
    }

    /**
     * /@function  openWorkFlowPopUp
     *  @description To open the workflow popup
     *  @param -
     *  @returns Open workflow popup
     */
    openWorkFlowPopUp(): void {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ForwardDialogComponent, {
            width: '2700px',
            height: '600px',
            data: {
                'trnNo': this.transactionNo,
                'initiationDate': this.transactionDate,
                'trnId': this.inEventId,
                'lkPoOffUserId': this.lkPoOffUserId,
                'event': 'INCREMENT'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.action === 'edit') {
                    this.router.navigate(['/dashboard/pvu/increment'], { skipLocationChange: true });
                } else {
                    this.router.navigate(['/dashboard'], { skipLocationChange: true });
                }
            }
        });
    }

    /**
     * /@function  resetForm
     *  @description Reset the form
     *  @param -
     *  @returns Reset the form values
     */
    resetForm() {
        if (this.inEventId && this.inEventId !== 0) {
            this.subscriberArray.forEach(Sub => {
                Sub.unsubscribe();
            });
            this.getRopTransactionWfRoleCode();
            this.getIncrementDetail();
            this.assignEligibleData([]);
            this.assignExcludeData([]);
            this.getIncrementEmployeeDetails();
            this.transactionId = true;
            this.showEmpListData = true;
            this.showSummary = true;
            this.doneHeader = true;
            this.searchParamsChanged = false;
        } else {
            this.resetIncrementForm();
        }
    }

    /**
     * /@function  resetForm
     *  @description Reset the form and datasource of eligible and exclude data list
     *  @param -
     *  @returns Reset the form and datasource of eligible and exclude data list
     */
    resetIncrementForm() {
        this.searchIncrementForm.patchValue({
            incrementEffDate: '',
            dateNextInc: '',
            incrementFor: 152,
            empType: '',
            classId: '',
            designationId: '',
            gpf: '',
            empNo: '',
        });
        this.searchIncrementForm.enable();
        this.showEmpListData = false;
        this.showSummary = false;
        this.eligibleDataList = [];
        this.eligibleForIncrement = new MatTableDataSource([]);
        this.excludedDataSource = new MatTableDataSource([]);
        this.includeRowIndex = [];
        this.excludeRowIndex = [];
        this.summaryDataSource = new MatTableDataSource([]);
        if (this.financialYearList) {
            const fId = this.financialYearList.filter(year => {
                return year.isCurrentYear === 1;
            })[0];
            this.searchIncrementForm.patchValue({
                financialYear: fId.financialYearId
            });
            this.onFySelect({ value: fId.financialYearId });
            this.minDate = new Date(fId.fyStart, 0, 1);
            this.maxDate = new Date(fId.fyStart, 11, 31);
        }

        this.searchIncrementForm.controls.incrementEffDate.markAsUntouched();
        this.searchIncrementForm.controls.incrementEffDate.updateValueAndValidity();
        this.searchIncrementForm.controls.incrementFor.markAsUntouched();
        this.searchIncrementForm.controls.incrementFor.updateValueAndValidity();
    }

    /**
     * /@function  goToListing
     *  @description Navigate to the listing screen
     *  @param -
     *  @returns Navigate to the listing screen
     */
    goToListing() {
        this.router.navigate(['/dashboard/pvu/increment/list'], { skipLocationChange: true });
    }

    /**
     * Navigate to the dashboard
     */
    goToDashboard() {
        if (!this.dialogOpen) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: pvuMessage.CLOSE
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    const url: string = this.routeService.getPreviousUrl();
                    this.router.navigate([url.toString()], { skipLocationChange: true });
                }
            });
        } else {
            this.dialog.closeAll();
        }
    }

    /**
     * /@function getLookupDetails
     * @description To get the master data of all lookup's.
     * @param -
     * @returns Get the master data of all lookup's.
     */
    getLookupDetails() {
        this.incrementCreationService.getLookupDetails().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.classList = res['result']['Dept_Class'];
                this.payCommissionList = res['result']['Dept_Pay_Commission'];
                this.tempPayCommList = this.payCommissionList;
                this.empPayTypeList = res['result']['Employee_PayType'];
                this.empTypeList = res['result']['Emp_Type'];
                this.stopIncrementList = res['result']['STOP_INCREMENT_TYPE'];
                this.reasonForExclusionList = res['result']['REASONFOREXCLUDE'];
                this.statusData = res['result']['Status_id'];
                this.saveDraftStatusId = this.getStatusId('Saved as Draft');
            }
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    /**
     * /@function getFinancialYears
     * @description To get lookup values of current Year
     * @param -
     * @returns Get lookup value of current Year
     */
    getFinancialYears() {
        this.commonService.getAllFinancialYears().subscribe((res) => {
            if (res && res['result'] && res['result'].length > 0) {
                this.financialYearList = _.cloneDeep(res['result']);
                const fId = this.financialYearList.filter(year => {
                    return year.isCurrentYear === 1;
                })[0];
                this.financialYearList = _.orderBy(this.financialYearList, 'fyStart', 'asc');
                if (this.action === 'new') {
                    this.searchIncrementForm.patchValue({
                        financialYear: fId.financialYearId
                    });
                    this.onFySelect({ value: fId.financialYearId });
                    this.minDate = new Date(fId.fyStart, 0, 1);
                    this.maxDate = new Date(fId.fyStart, 11, 31);
                }
            }
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    /**
     * /@function getDesignation
     * @description To get lookup values of Designation
     * @param -
     * @returns Get lookup value of Designation
     */
    getDesignation() {
        this.incrementCreationService.getDesignation().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.designationList = res['result'];
            }
        });
    }

    /**
     * /@function convertDateFormat
     * @description Convert the date object in the yyyy-MM-dd format
     * @param date Date object
     * @returns Convert date in the yyyy-MM-dd format
     */
    convertDateFormat(date) {
        if (date !== '' && date !== undefined && date != null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'yyyy-MM-dd');
        }
        return '';
    }

    /**
     * /@function getStatusId
     * @description Get Status ID
     * @param status Save as draft
     * @returns Status ID
     */
    getStatusId(status) {
        if (this.statusData) {
            const lookupStatus = this.statusData.filter((item) => {
                return item['lookupInfoName'] === status;
            });
            if (lookupStatus && lookupStatus[0] && lookupStatus[0]['lookupInfoId']) {
                return lookupStatus[0]['lookupInfoId'];
            }
        }
    }

    /**
     * /@function getIncrementDetail
     * @description To Fetch all Lookup and Summary data
     * @param id Increment Transaction Id
     * @returns Fetch all Lookup and Summary data for the transaction
     */
    getIncrementDetail() {
        const self = this;
        this.incrementCreationService.getIncrementDetail({ id: this.inEventId }).subscribe(res => {
            if (res && res['result']) {
                self.incrementDetail = res['result'];
                self.statusId = res['result']['statusId'];
                if (self.saveDraftStatusId === self.incrementDetail['statusId']) {
                    self.isSaveDraftVisible = true;
                } else {
                    self.isSaveDraftVisible = false;
                }
                // tslint:disable-next-line:no-unused-expression
                if (self.incrementDetail.status === 'SUBMIT') {
                    self.submitted = true;
                }
                self.transactionNo = res['result']['trnNo'];
                self.transactionDate = res['result']['createdDate'];
                self.searchIncrementForm.patchValue({
                    financialYear: self.incrementDetail.financialYear,
                    incrementFor: self.incrementDetail.incrementFor,
                    empPayType: self.incrementDetail.empPayType,
                    empType: self.incrementDetail.empType,
                    classId: self.incrementDetail.classId,
                    designationId: self.incrementDetail.designationId,
                    gpf: self.incrementDetail.gpf,
                    empNo: self.incrementDetail.empNo,
                });
                setTimeout(() => {
                    this.subscriberArray.push(this.searchIncrementForm.valueChanges.subscribe(() => {
                        this.searchParamsChanged = true;
                    }));
                });
                if (self.incrementDetail.incrementEffDate) {
                    let effcDate = self.incrementDetail.incrementEffDate;
                    if (effcDate.indexOf('T') !== -1) {
                        effcDate = effcDate.split('T')[0].split('-');
                    } else {
                        effcDate = effcDate.split('-');
                    }
                    self.searchIncrementForm.patchValue({
                        incrementEffDate: new Date(effcDate[0], Number(effcDate[1]) - 1, effcDate[2])
                    });
                }
                if (self.incrementDetail.dateNextInc) {
                    let dateNextInc = self.incrementDetail.dateNextInc;
                    if (dateNextInc.indexOf('T') !== -1) {
                        dateNextInc = dateNextInc.split('T')[0].split('-');
                    } else {
                        dateNextInc = dateNextInc.split('-');
                    }
                    self.searchIncrementForm.patchValue({
                        dateNextInc: new Date(dateNextInc[0], Number(dateNextInc[1]) - 1, dateNextInc[2])
                    });
                }
                self.onFySelect({ value: self.incrementDetail.financialYear });
                if (self.incrementDetail.pvuIncrementEventSummaryDto) {
                    self.summaryData[0].includeCount =
                        self.incrementDetail.pvuIncrementEventSummaryDto.classOneInclCount;
                    self.summaryData[0].excludeCount =
                        self.incrementDetail.pvuIncrementEventSummaryDto.classOneExclCount;
                    self.summaryData[0].totalCount =
                        (self.summaryData[0].includeCount + self.summaryData[0].excludeCount);
                    self.summaryData[1].includeCount =
                        self.incrementDetail.pvuIncrementEventSummaryDto.classTwoInclCount;
                    self.summaryData[1].excludeCount =
                        self.incrementDetail.pvuIncrementEventSummaryDto.classTwoExclCount;
                    self.summaryData[1].totalCount =
                        (self.summaryData[1].includeCount + self.summaryData[1].excludeCount);
                    self.summaryData[2].includeCount =
                        self.incrementDetail.pvuIncrementEventSummaryDto.classThreeInclCount;
                    self.summaryData[2].excludeCount =
                        self.incrementDetail.pvuIncrementEventSummaryDto.classThreeExclCount;
                    self.summaryData[2].totalCount =
                        (self.summaryData[2].includeCount + self.summaryData[2].excludeCount);
                    self.summaryData[3].includeCount =
                        self.incrementDetail.pvuIncrementEventSummaryDto.classFourInclCount;
                    self.summaryData[3].excludeCount =
                        self.incrementDetail.pvuIncrementEventSummaryDto.classFourExclCount;
                    self.summaryData[3].totalCount =
                        (self.summaryData[3].includeCount + self.summaryData[3].excludeCount);
                    self.summaryDataSource = new MatTableDataSource(self.summaryData);
                }
                self.payCommissionChange();
                this.onPayCommissionChange();
            }
        },
            err => {
                self.toastr.error(err);
            }
        );
    }

    /**
     * /@function getIncrementEmployeeDetails
     * @description To Fetch Eligible and Exclude Employee list
     * @param inEventId Event Id
     * @returns Fetch Eligible and Exclude Employee list for the transaction
     */
    getIncrementEmployeeDetails() {
        const self = this,
            param = {
                'jsonArr': [
                    {
                        'key': 'inEventId',
                        'value': this.inEventId
                    }
                ],
                'pageElement': 250,
                'pageIndex': 0
            };
        this.incrementCreationService.getIncrementEmployeeDetails(param).subscribe(
            res => {
                this.searchParamsChanged = false;
                if (res && res['result'] && res['result']['result'] && res['status'] === 200) {
                    const incrementEmployeeDetail = res['result']['result'];
                    const eligibleDataList = [], excludedData = [];
                    if (incrementEmployeeDetail) {
                        incrementEmployeeDetail.forEach(obj => {
                            if (obj.reasonForExclude === 0) {
                                eligibleDataList.push(obj);
                            } else {
                                excludedData.push(obj);
                            }
                        });
                        if (eligibleDataList && eligibleDataList.length > 0) {
                            self.pageIndex = 0;
                            self.pageSize = self.paginationArray[0];
                            self.assignEligibleData(eligibleDataList);
                            self.eligibleForIncrement.data.forEach(el => {
                                if (el.revEffDate) {
                                    el.revEffDate = this.dateFormating(el.revEffDate);
                                }
                                const d = new Date(el.revEffDate);
                                el.revDateNexIncMin = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());
                                if (el.revDateNexInc) {
                                    el.revDateNexInc = this.dateFormating(el.revDateNexInc);
                                }
                            });
                        }
                        if (excludedData && excludedData.length > 0) {
                            self.pageIndexExclude = 0;
                            self.pageSizeExclude = self.paginationArray[0];
                            self.assignExcludeData(excludedData);
                        }
                    }
                } else {
                    self.pageIndex = 0;
                    self.pageSize = self.paginationArray[0];
                    self.assignEligibleData([]);
                    self.pageIndexExclude = 0;
                    self.pageSizeExclude = self.paginationArray[0];
                    self.assignExcludeData([]);
                    self.toastr.error(res['message']);
                }
            },
            err => {
                self.toastr.error(err);
            }
        );
    }

    /**
     * /@function assignEligibleData
     * @description To Asign Eligible Employee data from complete data list
     * @param data Eligible Employee data
     * @returns Asign Eligible Employee data
     */
    assignEligibleData(data) {
        this.eligibleForIncrement = new MatTableDataSource(data);
        setTimeout(() => {
            this.eligibleForIncrement.paginator = this.paginator;
        });
    }

    /**
     * /@function assignEligibleData
     * @description To Asign Exclude Employee data from complete data list
     * @param data Exclude Employee data
     * @returns Asign Exclude Employee data
     */
    assignExcludeData(data) {
        this.excludedDataSource = new MatTableDataSource(data);
        setTimeout(() => {
            this.excludedDataSource.paginator = this.paginatorExclude;
        });
    }

    /**
     * /@function onFySelect
     * @description To set the financial selected by creator
     * @param event pass financial year
     * @returns To fetch effective date and date of next increment
     */
    onFySelect(event) {
        if (this.financialYearList) {
            const filterYear = this.financialYearList.filter(obj => {
                return obj.financialYearId === event.value;
            })[0],
                effecDateSelected = this.searchIncrementForm.value.incrementEffDate;
            let fy;
            if (filterYear) {
                fy = filterYear.fyStart;
            }
            this.minDate = new Date(fy, 0, 1);
            this.maxDate = new Date(fy, 11, 31);
            if (effecDateSelected) {
                if (effecDateSelected.getFullYear() !== fy) {
                    this.searchIncrementForm.patchValue({
                        incrementFor: null,
                        incrementEffDate: null,
                        dateNextInc: null
                    });
                    this.payCommissionList = this.tempPayCommList;
                    this.searchIncrementForm.controls.incrementFor.markAsTouched({ onlySelf: true });
                    this.searchIncrementForm.controls.incrementEffDate.markAsTouched({ onlySelf: true });
                    this.searchIncrementForm.controls.dateNextInc.markAsTouched({ onlySelf: true });
                }
            }
            if (fy) {
                if (fy >= 2006 && fy < 2016) {
                    this.payCommissionList = this.tempPayCommList.filter((payComm) =>
                        payComm.lookupInfoId === 151 || payComm.lookupInfoId === 150);
                } else {
                    if (fy < 2006) {
                        this.payCommissionList = this.tempPayCommList.filter((payComm) => payComm.lookupInfoId === 150);
                    } else {
                        this.payCommissionList = _.cloneDeep(this.tempPayCommList);
                    }
                }
            }
            if (this.checkForValueSelected()) {
                this.setEffectiveDate();
            }
        }
    }

    /**
     * @method checkForValueSelected
     * @description method check if Finacial year and pay commision both selected
     */
    checkForValueSelected() {
        if (this.searchIncrementForm.get('financialYear').value !== null &&
            this.searchIncrementForm.get('incrementFor').value !== null) {
            return true;
        }
        return false;
    }

    /**
     * @method
     * @description
     */
    setEffectiveDate() {
        if (!this.searchIncrementForm.disabled) {
            const fySelectedId = this.searchIncrementForm.get('financialYear').value;
            const fy = this.financialYearList.filter(fyObj => {
                return fyObj.financialYearId === fySelectedId;
            });
            let year;
            if (fy.length > 0) {
                year = fy[0].fyStart;
            }
            if (year) {
                const todayDate = new Date();
                let month = 6;
                let date = 1;
                const paycomm = this.searchIncrementForm.get('incrementFor').value;
                switch (paycomm) {
                    case 150:
                        month = todayDate.getMonth();
                        break;
                    case 152:
                        if (todayDate.getMonth() < 6) {
                            month = 0;
                        }
                        break;
                }
                if (this.incrementDetail) {
                    if (this.incrementDetail.financialYear === fy[0].financialYearId &&
                        this.incrementDetail.incrementFor === paycomm) {
                        if (this.incrementDetail.incrementEffDate) {
                            let effcDate = this.incrementDetail.incrementEffDate;
                            if (effcDate.indexOf('T') !== -1) {
                                effcDate = effcDate.split('T')[0].split('-');
                            } else {
                                effcDate = effcDate.split('-');
                            }
                            month = Number(effcDate[1]) - 1;
                            date = effcDate[2];
                        }
                    }
                }
                this.searchIncrementForm.patchValue({
                    incrementEffDate: new Date(year, month, date)
                });
                this.effectiveDateChange();
            }
        }
    }

    /**
     * @method ngOnDestroy
     * @description Function is called when compnent is destroyed to take necessary calls on view destroy from browser
     * Kept for future purpose
     */
    // ngOnDestroy() {}

    /**
     * To get the workflow role code of the selected tranasaction
     */
    getRopTransactionWfRoleCode() {
        const param = {
            id: this.inEventId
        };
        this.incrementCreationService.getRopTransactionWfRoleCode(param).subscribe((res) => {
            if (res && res['status'] === 200) {
                if (res['result'] === null || res['result'] === 'null') {
                    this.isCreator = true;
                    this.isGetListVisible = false;
                    this.isResetVisible = false;
                } else if (res['result'] === DataConst.INCREMENT.CREATOR_WF_ROLE_CODE) {
                    if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                        this.isRework = true;
                    }
                    this.searchIncrementForm.enable();
                } else if (res['result'] === DataConst.INCREMENT.VERIFIER_WF_ROLE_CODE) {
                    if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                        this.isVerifier = true;
                    }
                    this.searchIncrementForm.disable();
                    this.isGetListVisible = true;
                    this.isResetVisible = true;
                } else if (res['result'] === DataConst.INCREMENT.APPROVER_WF_ROLE_CODE) {
                    if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                        this.isApprover = true;
                    }
                    this.searchIncrementForm.disable();
                    this.isGetListVisible = true;
                    this.isResetVisible = true;
                } else {
                    this.isNonEditable = true;
                }
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * @method onPrint
     * @description Function is called to Print the pdf
     */
    onPrint() {
        const self = this,
        params = {
            'id': self.inEventId
        };
        this.incrementCreationService.printOrder(params).subscribe(res => {
            if (res) {
                const file = res['result'];
                const docType = 'application/pdf';
                const byteArray = new Uint8Array(atob(file).split('').map(char => char.charCodeAt(0)));
                const blob = new Blob([byteArray], { type: docType });
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    // this.onSubmitSearch();
                    window.navigator.msSaveOrOpenBlob(blob);
                    // this.loader = false;
                } else {
                    // this.onSubmitSearch();
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                }
            }
        }, err => {
            this.toastr.error(err);
        });
    }
}
