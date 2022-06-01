import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LcAdviceVerification } from './../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../directive/letter-of-credit-directive';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/modules/services/common.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CommonWorkflowService } from '../../common/workflow-service/common-workflow.service';
import { LetterOfCreditService } from '../service/letter-of-credit.service';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import * as _ from 'lodash';
import { ModuleNames } from '../../common/constant/common-workflow.constants';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { LcCommonWorkflowHistoryComponent } from '../lc-common-workflow-history/lc-common-workflow-history.component';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { DateLocaleAndFormat } from 'src/app/shared/constants/constants/common/common-data.constants';

@Component({
    selector: 'app-lc-advice-verification',
    templateUrl: './lc-advice-verification.component.html',
    styleUrls: ['./lc-advice-verification.component.css']
})

export class LcAdviceVerificationComponent implements OnInit {

    LcAdviceVerificationData: LcAdviceVerification[] = [];

    // Table Columns for Advice Verification Table
    LcAdviceVerificationDATAColumn: string[] = [
        'select', 'srno', 'virtualTokenNo',
        'adviceNo', 'adviceDate', 'divisionCode',
        'divisionName', 'ddoApproverName', 'adviceGrossAmount', 'totalDeduction',
        'adviceNetAmount','paymentType', 'receivedFrom', 'receivedDate', 'sentTo', 'sentDate',
        'lyingWith',  'workflowStatus', 'status', 'AuthorizedReturnedDate', 'action'
        //DeptName	  PaymentType	lying With

    ];

    // List of division Code
    divisionCodeList: any[] = []

    // List of division name
    divisionNameList: any[] = [];

    // List of circle code
    circleCodeList: any[] = [];

    // List of circle name
    circleNameList: any[] = [];

    // List of status
    statusList: any[] = [];
    wfstatusList: any[] = []
    // List of department
    departmentNameList = [];
    //List of party type
    partyTypeList = []

    workFlowData = 'fromLCAdviceVerification';
    todayDate = new Date();
    ForwardToCtrl: FormControl = new FormControl();
    statusCtrl: FormControl = new FormControl();
    workflowStatusCtrl: FormControl = new FormControl();
    circleNameCtrl: FormControl = new FormControl();
    circleCodeCtrl: FormControl = new FormControl();
    divisionNameCtrl: FormControl = new FormControl();
    divisionCodeCtrl: FormControl = new FormControl();
    DepartmentNameCtrl: FormControl = new FormControl();
    PartyTypeCtrl: FormControl = new FormControl();
    pageSize = 0;
    pageIndex = 0;
    customPageIndex: number;
    iteratablePageIndex: number;
    userOffice = null;
    officeId: number;
    pageElements: number;
    paginationArray;
    tokenFlag: boolean = false;
    sortBy: string = '';
    sortOrder: string = '';
    isSearch: number = 0;
    indexedItem: number;
    pouId: number;
    userName: any;
    currentUserData: any;
    userPostList: any;
    officeName: any;
    menuId: number;
    newSearch: boolean = false;
    newSearchParam: number = 0;
    totalRecords: number = 0;
    DepartmentNameList = [];
    lcAdviceVerificationForm: FormGroup;
    LCBranchCtrl: FormControl = new FormControl();
    dataSource = new MatTableDataSource<LcAdviceVerification>(this.LcAdviceVerificationData);
    readonly config = {
        dates: {
            from: {
                default: new Date(),
                max: new Date()
            },
            to: {
                default: new Date(),
                min: new Date(),
                max: new Date()
            }
        },
    };

    constructor(private fb: FormBuilder, private el: ElementRef, public dialog: MatDialog, private router: Router,
        private activatedRoute: ActivatedRoute, private storageService: StorageService, private commonService: CommonService,
        private workflowService: CommonWorkflowService, private locService: LetterOfCreditService, private toastr: ToastrService, public datepipe: DatePipe) { }
    /**
    * Paginator view child reference
    *
    * @type {MatPaginator}
    * @memberOf SavedAdviceComponent
    */

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    /**
     * Sort
     *
     * @type {MatSort}
     * @memberOf SavedAdviceComponent
     */
    @ViewChild(MatSort, { static: true }) sort: MatSort;

    /**
    * Stored table data
    *
    * @type {*}
    * @memberOf SavedAdviceComponent
    */

    storedData: any[] = [];

    // Create object to access Methods of Letter of Credit Directive
    directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

    ngOnInit() {
        this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.userName = this.storageService.get('userName');
        console.log(this.userName)
        this.currentUserData = this.storageService.get('currentUser');
        this.userPostList = this.currentUserData['post'];
        console.log(this.currentUserData);
        this.getCurrentUser();
        this.userOffice = this.storageService.get('userOffice');
        this.officeId = this.userOffice.officeId;
        this.menuId = this.commonService.getLinkMenuId();

        this.lcAdviceVerificationFormData();
        this.fillDropdownOfFilter();


    }

    // Initialize Form Fields
    lcAdviceVerificationFormData() {
        this.lcAdviceVerificationForm = this.fb.group({
            forwardTo: [''],
            adviceNumber: [''],
            adviceFromDate: [''],
            adviceToDate: [''],
            divisionCode: [''],
            cardexNo: [''],
            ddoNo: [''],
            virtualTokenDate: [''],
            divisionName: [''],
            referenceNo: [''],
            circleCode: [''],
            circleName: [''],
            adviceNo: [''],
            adviceGrossAmount: [''],
            adviceNetAmount: [''],
            workflowStatus: [''],
            virtualTokenNo: [''],
            status: [''],
            departmentName: [''],
            partyType: [''],
            lyingWith: ['']

        });
    }
    /**
   * @description For get user details
   */
    getCurrentUser() {
        this.workflowService.getCurrentUserDetail().then((res: any) => {
            console.log(res, 'currentuserdetails')
            this.pouId = res.lkPOUId;
            this.getListData();
        });
    }
    /**
   * @description Filling Dropdown List of  Status,workFlow status
   */
    fillDropdownOfFilter() {
        this.locService.getDataWithoutParamsPost(APIConst.LC_ADVICEPREPARATION.ADVICE_VERIFICATION_DROP_DOWN).subscribe(
            (resp: any) => {
                if (resp && resp.result && resp.status === 200) {

                    if (resp.result.circleCodeList.length > 0) {
                        this.circleCodeList = _.orderBy(_.cloneDeep(resp.result.circleCodeList), 'circleCode', 'asc');

                    }
                    if (resp.result.circleNameList.length > 0) {
                        this.circleNameList = _.orderBy(_.cloneDeep(resp.result.circleNameList), 'circleName', 'asc');

                    }
                    if (resp.result.divCodeList.length > 0) {
                        this.divisionCodeList = _.orderBy(_.cloneDeep(resp.result.divCodeList), 'divCode', 'asc');

                    }
                    if (resp.result.divNameList.length > 0) {
                        this.divisionNameList = _.orderBy(_.cloneDeep(resp.result.divNameList), 'divName', 'asc');

                    }
                    if (resp.result.statusList.length > 0) {

                        this.statusList = _.orderBy(_.cloneDeep(resp.result.statusList), 'statusName', 'asc');
                    }

                    if (resp.result.wfList.length > 0) {
                        this.wfstatusList = _.orderBy(_.cloneDeep(resp.result.wfList), 'wfStatus', 'asc');
                    }

                    if (resp.result.deptList.length > 0) {
                        this.DepartmentNameList = _.orderBy(_.cloneDeep(resp.result.deptList), 'deptName', 'asc');;
                    }

                    if (resp.result.paymentTypeList.length > 0) {
                        this.partyTypeList = _.orderBy(_.cloneDeep(resp.result.paymentTypeList), 'paymentName', 'asc');;
                    }

                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }
    /**
    * Reset To Date field if Later From Date is selected after selecting To Date
    *
    *
    * @memberOf LcAdviceVerificationComponent
    */

    resetAdviceToDate() {
        this.config.dates.to.min = new Date(this.lcAdviceVerificationForm.controls.adviceFromDate.value);
        this.lcAdviceVerificationForm.controls.adviceToDate.setValue('');
    }



    /**
     * on Edit  Click
     *
     * @param {any} element
     *
     * @memberOf SavedAdviceComponent
     */


    edit(element) {
        this.router.navigate(
            ['/dashboard/lc/lc-advice-preparation-view', {
                mode: 'edit', id: element.hdrId, status: element.trnStatus,
                isEditable: element.isEditable, listingUrl: '/dashboard/lc/lc-advice-verification'
                , headingName: 'LC Advice Verification'
            }],
            { relativeTo: this.activatedRoute, skipLocationChange: true }
        );
    }


    /**
       * on View Click
       *
       * @param {any} element
       *
       * @memberOf SavedAdviceComponent
       */
    view(element) {
        this.router.navigate(
            ['/dashboard/lc/lc-advice-preparation-view', {
                mode: 'view', id: element.hdrId, status: element.trnStatus,
                isEditable: element.isEditable, listingUrl: '/dashboard/lc/lc-advice-verification'
                , headingName: 'LC Advice Verification'
            }],
            { relativeTo: this.activatedRoute, skipLocationChange: true }
        );
    }

    /**
     * @description Getting The Table Data
     */
    getListData(event: any = null, isReset: boolean = false) {
        const searchData = this.getFilterParams(isReset);

        if (!searchData) {
            return false;
        }
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: searchData
        }

        if (
            !this.newSearch &&
            this.storedData.length !== 0 &&
            this.iteratablePageIndex + 1 <= Math.ceil(this.pageElements / this.pageSize)
        ) {
            // If data already fetched
            this.dataSource = new MatTableDataSource(
                this.storedData.slice(
                    this.iteratablePageIndex * this.pageSize,
                    this.iteratablePageIndex * this.pageSize + this.pageSize
                )
            );
            this.dataSource.sort = this.sort;
        } else {
            this.locService.getData(passData, APIConst.LC_ADVICEPREPARATION.GET_ADVICE_VERIFICATION_LISTING).subscribe(
                (res: any) => {
                    console.log(passData, 'input params for listing')
                    console.log(res, 'listingg result')
                    this.newSearch = false;
                    if (res && res.result && res.status === 200) {
                        this.storedData = _.cloneDeep(res.result.result);
                        if (
                            event != null &&
                            event.pageIndex < event.previousPageIndex &&
                            this.iteratablePageIndex - 1 === Math.ceil(this.pageElements / this.pageSize)
                        ) {
                            this.iteratablePageIndex = Math.ceil(this.pageElements / this.pageSize) - 1;
                            /*
                                below if Condition is to handle button of 'Go First Page'
                                Reset iteratablePageIndex to 0
                            */
                            if (
                                event !== null &&
                                event.previousPageIndex > event.pageIndex &&
                                event.previousPageIndex - event.pageIndex > 1
                            ) {
                                this.iteratablePageIndex = 0;
                            }
                        } else if (
                            event != null &&
                            event.pageIndex > event.previousPageIndex &&
                            event.pageIndex - event.previousPageIndex > 1
                        ) {
                            /**
                             * else if conditin to handle button of 'Go Last Page'
                             * reset iteratablePageIndex to last pageIndex of particular pageSet
                             */
                            this.iteratablePageIndex = Math.ceil(this.storedData.length / this.pageSize) - 1;
                        } else {
                            this.iteratablePageIndex = 0;
                        }

                        this.dataSource = new MatTableDataSource(
                            this.storedData.slice(
                                this.iteratablePageIndex * this.pageSize,
                                this.iteratablePageIndex * this.pageSize + this.pageSize
                            )
                        );

                        this.totalRecords = res.result.totalElement;
                        this.dataSource.sort = this.sort;
                    } else {
                        this.storedData = [];
                        this.dataSource = new MatTableDataSource(this.storedData);

                        this.toastr.error(res.message);
                        this.totalRecords = 0;
                        this.pageIndex = 0;
                        this.customPageIndex = 0;
                        this.iteratablePageIndex = 0;
                        this.dataSource.sort = this.sort;
                    }
                },
                err => {
                    this.toastr.error(err);
                    this.totalRecords = 0;
                    this.pageIndex = 0;
                    this.customPageIndex = 0;
                    this.iteratablePageIndex = 0;
                    this.dataSource = new MatTableDataSource([]);
                }
            );
        }
    }

    /**
      * @description Getting Filtered Data From Backend for Table
      */
    getFilterParams(isReset: boolean) {
        if (this.newSearch
            && !isReset
            && (

                this.lcAdviceVerificationForm.value.referenceNo
                || this.lcAdviceVerificationForm.value.adviceNo
                || this.lcAdviceVerificationForm.value.divisionName
                || this.lcAdviceVerificationForm.value.divisionCode
                || this.lcAdviceVerificationForm.value.circleCode
                || this.lcAdviceVerificationForm.value.circleName
                || this.lcAdviceVerificationForm.value.adviceFromDate
                || this.lcAdviceVerificationForm.value.adviceToDate
                || this.lcAdviceVerificationForm.value.adviceGrossAmount
                || this.lcAdviceVerificationForm.value.adviceNetAmount
                || this.lcAdviceVerificationForm.value.cardexNo
                || this.lcAdviceVerificationForm.value.ddoNo
                || this.lcAdviceVerificationForm.value.virtualTokenNo
                || this.lcAdviceVerificationForm.value.virtualTokenDate
                || this.lcAdviceVerificationForm.value.status
                || this.lcAdviceVerificationForm.value.workflowStatus
                || this.lcAdviceVerificationForm.value.departmentName
                || this.lcAdviceVerificationForm.value.partyType
                || this.lcAdviceVerificationForm.value.lyingWith

            )) {
            this.newSearchParam = 1;
        } else {
            this.newSearchParam = 0;
        }
        const datePipe = new DatePipe(DateLocaleAndFormat.Locale.EnUS);

        const returnArray = [
            {
                key: 'isSearch',
                value: this.newSearchParam
            },
            {
                key: 'adviceNo',
                value: this.lcAdviceVerificationForm.value.adviceNo || ''
            },
            {
                key: 'tokenNo',
                value: this.lcAdviceVerificationForm.value.virtualTokenNo || 0
            },
            {
                key: 'adviceFromDate',
                value: datePipe.transform(this.lcAdviceVerificationForm.value.adviceFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''


            },
            {
                key: 'adviceToDate',
                value: datePipe.transform(this.lcAdviceVerificationForm.value.adviceToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''

            },
            {
                key: 'adviceGrossFromAmt',
                value: this.lcAdviceVerificationForm.value.adviceGrossAmount || 0
            },
            {
                key: 'adviceGrossToAmt',
                value: this.lcAdviceVerificationForm.value.adviceNetAmount || 0
            },
            {
                key: 'refNo',
                value: this.lcAdviceVerificationForm.value.referenceNo || ''
            },
            {
                key: 'wfStatus',
                value: (this.lcAdviceVerificationForm.value.workflowStatus) ? this.lcAdviceVerificationForm.value.workflowStatus.wfStatus : ''
            },
            {
                key: 'status',
                value: this.lcAdviceVerificationForm.value.status ? this.lcAdviceVerificationForm.value.status.statusName : ''
            },

            {
                key: 'pouId',
                value: Number(this.pouId)
            },
            {
                key: 'menuId',
                value: Number(this.menuId)
            },
            {
                key: 'lyingWith',
                value: this.lcAdviceVerificationForm.value.lyingWith || ''
            },
            {
                key: "circleCd",
                value:
                    (this.lcAdviceVerificationForm.value.circleCode) ? this.lcAdviceVerificationForm.value.circleCode.circleId : 0
            },
            {
                key: "circleNameId",
                value: (this.lcAdviceVerificationForm.value.circleName) ? this.lcAdviceVerificationForm.value.circleName.circleId : 0
            },
            {
                key: "divisionNo",
                value: (this.lcAdviceVerificationForm.value.divisionCode) ? this.lcAdviceVerificationForm.value.divisionCode.divId : 0
            },
            {
                key: "divisionNameId",
                value: (this.lcAdviceVerificationForm.value.divisionName) ? this.lcAdviceVerificationForm.value.divisionName.divId : 0

            },
            {
                key: "cardexNo",
                value: this.lcAdviceVerificationForm.value.cardexNo || 0
            },
            {
                key: "ddoNo",
                value: this.lcAdviceVerificationForm.value.ddoNo || 0
            },
            {
                key: "tokenDate",
                value: datePipe.transform(this.lcAdviceVerificationForm.value.virtualTokenDate, DateLocaleAndFormat.Format.MMddyyyy) || ''

            },
            {
                key: "deptId",
                value: (this.lcAdviceVerificationForm.value.departmentName) ? this.lcAdviceVerificationForm.value.departmentName.deptId : 0
            },
            {
                key: "paymentId",
                value: (this.lcAdviceVerificationForm.value.partyType) ? this.lcAdviceVerificationForm.value.partyType.paymentId : 0
            }

        ];
        const adviceFromDate = this.lcAdviceVerificationForm.value.adviceFromDate;
        const adviceToDate = this.lcAdviceVerificationForm.value.adviceToDate;
        const adviceGrossFromAmount: number = this.lcAdviceVerificationForm.controls['adviceGrossAmount'].value
        const adviceGrossToAmount: number = this.lcAdviceVerificationForm.controls['adviceNetAmount'].value

        if (adviceFromDate || adviceToDate || adviceGrossFromAmount || adviceGrossToAmount) {
            if (adviceFromDate || adviceToDate) {
                if (!adviceFromDate) {
                    this.toastr.error(MESSAGES.ADVICE_FROM_DATE);
                    return false;
                } else if (!adviceToDate) {
                    this.toastr.error(MESSAGES.ADVICE_TO_DATE);
                    return false;
                }
            }

            else if (adviceGrossFromAmount || adviceGrossToAmount) {
                if (!adviceGrossFromAmount) {
                    this.toastr.error(MESSAGES.ADVICE_GROSS_FROM_AMOUNT);
                    return false;
                } else if (!adviceGrossToAmount) {
                    this.toastr.error(MESSAGES.ADVICE_GROSS_TO_AMOUNT);
                    return false;
                }
            }
        }
        if (adviceGrossFromAmount && adviceGrossToAmount) {
            if ((Number(adviceGrossFromAmount)) > (Number(adviceGrossToAmount))) {
                this.toastr.error(MESSAGES.ADVICE_GROSS_FROM_AMOUNT_VALIDATION);
                return false;
            } else {
                return returnArray;
            }
        }

        return returnArray;
    }

    /**
     * @description For Paginator At Bottom Of Table
     * @param  event No. of Rows
     */
    onPaginateChange(event) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        // Calculate pageIndex so we can fetched next data set wheneve current iteration will complete.
        this.customPageIndex = Math.floor(this.pageIndex / Math.ceil(this.pageElements / this.pageSize));
        // Increase iteratablePageIndex by 1.
        if (event.pageIndex < event.previousPageIndex) {
            // For handle previous page or back button
            this.iteratablePageIndex = this.iteratablePageIndex - 1;
            /**
             * check if iteratableIndex is in negative number, or going to First Page via Go First Page button
             * if condition matched, set iteratablePageIndex to highest page index of particular pageElement.
             * So getData method can load the newer data of pageIndex 0.
             */
            if (this.iteratablePageIndex < 0 || event.previousPageIndex - event.pageIndex > 1) {
                this.iteratablePageIndex = Math.ceil(this.pageElements / this.pageSize) + 1;
            }
        } else if (event.pageIndex === event.previousPageIndex) {
            this.iteratablePageIndex = 0;
        } else if (event.pageIndex > event.previousPageIndex && event.pageIndex - event.previousPageIndex > 1) {
            /**
             * Condition is for handle Go To Last Page button event.
             * set iteratablePageIndex to highest pageIndex so getData can load new set of data of current page index.
             */
            this.iteratablePageIndex = event.pageIndex;
        } else {
            this.iteratablePageIndex = this.iteratablePageIndex + 1;
        }
        this.getListData(event);
    }

    /**
     * @description For Resetting The Form
     */
    clearForm() {
        this.lcAdviceVerificationForm.reset();
        this.lcAdviceVerificationFormData()
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.getListData(null);


    }


    /**
     * @description For Searching Estimate List
     */
    searchList() {
        if (this.lcAdviceVerificationForm.valid) {
            this.newSearch = true;

            this.pageIndex = 0;
            this.customPageIndex = 0;
            //this.paginator.pageIndex = 0;
            this.iteratablePageIndex = 0;
            this.getListData();
        } else {
            _.each(this.lcAdviceVerificationForm.controls, function (ctrl: FormControl) {
                if (ctrl.status === 'INVALID') {
                    ctrl.markAsTouched();
                }
            });
        }
    }


    /**
     *  View Comments
     * @param element 
     */
    viewComments(element) {
        const param = {
            id: element.hdrId,
        };
        this.locService.getAdvPrepHeaderData(param).subscribe(
            (resp: any) => {
                if (resp && resp.status === 200) {
                    const headerDetails = _.cloneDeep(resp.result);
                    const headerJson = [
                        { label: 'Advice No', value: headerDetails.adviceNo },
                        { label: 'Advice Date', value: headerDetails.adviceDate },
                        { label: 'Division Code', value: headerDetails.divisionCode },
                        { label: 'Division Name', value: headerDetails.divisionName },
                        { label: 'Treasury Office', value: headerDetails.divisionName },
                        { label: 'Drawing Officer', value: headerDetails.drawingOfficer },

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
                    this.dialog.open(LcCommonWorkflowHistoryComponent, {
                        width: '2700px',
                        height: '600px',
                        data: {
                            menuModuleName: 'loc',
                            headingName: 'LC Advice Preparation',
                            headerJson: headerJson,
                            moduleInfo: moduleInfo,
                            trnId: element.hdrId,
                            refNo: headerDetails.referanceNumber ? headerDetails.referanceNumber : '',
                            refDate: headerDetails.referanceDate ? headerDetails.referanceDate : '',
                            isAttachmentTab: false // for Attachment tab visible it should be true
                        }
                    });
                } else {
                    this.toastr.error(resp['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    // Method to Calculate Total of Advice Amount
    totalAdviceAmount() {
        let adviceAmount = 0;
        this.dataSource.data.forEach(element =>
            adviceAmount = adviceAmount + Number(element.adviceGrossAmount)
        );
        return adviceAmount;
    }

    // Method to Calculate Total of Deduction Amount
    totalDeductionAmount() {
        let totalDeduction = 0;
        this.dataSource.data.forEach(element =>
            totalDeduction = totalDeduction + Number(element.totalDeduction)
        );
        return totalDeduction;
    }

    // Method to Calculate Total Net Amount
    totalNetAmount() {
        let netAmount = 0;
        this.dataSource.data.forEach(element =>
            netAmount = netAmount + Number(element.adviceNetAmount)
        );
        return netAmount;
    }

}
