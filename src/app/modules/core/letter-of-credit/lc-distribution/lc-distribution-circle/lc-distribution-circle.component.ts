import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/modules/services/common.service';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { CommonWorkflowService } from '../../../common/workflow-service/common-workflow.service';
import { LcCommonWorkflowHistoryComponent } from '../../lc-common-workflow-history/lc-common-workflow-history.component';
import { LetterOfCreditService } from '../../service/letter-of-credit.service';
import { LetterOfCreditDirectives } from './../../directive/letter-of-credit-directive';
import { LCDistribution } from './../../model/letter-of-credit';
import { DateLocaleAndFormat } from 'src/app/shared/constants/constants/common/common-data.constants';


@Component({
    selector: 'app-lc-distribution-circle',
    templateUrl: './lc-distribution-circle.component.html',
    styleUrls: ['./lc-distribution-circle.component.css']
})
export class LcDistributionCircleComponent implements OnInit {

    /**
     * Configuration for this file
     *
     *
     * @memberOf LcDistributionCircleComponent
     */

    LcdistributionDATAColumn: string[] = [
        'select',
        'srno',
        'referenceNo',
        'referenceDate',
        'divisionCode',
        'divisionName',
        'lcNo',
        'entryType',
        'lcAmount',
        'lcIssueDate',
        'receivedFrom',
        'receivedDate',
        'sentTo',
        'sentDate',
        'lyingWith',
        'wfStatus',
        'status',
        'authorizedDate',
        'action'
    ];

    // List of Entry Type
    EntryTypeList: any[] = [

    ];

    // List of Status
    StatusList: any[] = [

    ];

    // List of Division Codes
    DivisionCodeList: any[] = [

    ];

    // List of Division Names
    DivisionNameList: any[] = [

    ];

    // List of Circle Code
    CircleCodeList: any[] = [

    ];

    // List of Circle Name
    CircleNameList: any[] = [

    ];
    financialYearList: any;
    wfStatusList = [];
    todayDate = new Date();
    valueBetweenError = false;
    pageEvent: any;
    noRecords: any;
    arr: any;
    newSearch: boolean = false;
    flag: boolean = true;
    isSearch: number = 0;
    pageIndex = 0;
    pageElements: number = 250;
    pageSize = 0;
    indexedItem: number = 0;
    totalRecords: number = 0;
    errorMessages: any = {};
    paginationArray;
    userName: String;
    customPageIndex: number = 0;
    iteratablePageIndex: number = 0;
    searchFlag: boolean = true;
    newSearchParam: number;
    currentUserData: any;
    userPostList: any;
    isTreasuryFlag: boolean;
    isTo: number = 0
    pouId: number;
    menuId: number;
    currDropYear: any;
    cardexno: any;
    ddoNo: any;
    officeNameId: any;
    editSaveResult: any;
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
    /**
   * Stored table data
   *
   * @type {*}
   * @memberOf LcDistributionCircleComponent
   */

    storedData: any[] = [];

    /**
     *  Form group instance
     *
     * @type {FormGroup}
     * @memberOf LcDistributionCircleComponent
     */

    lcVerificationForm: FormGroup;
    EntryTypeCtrl: FormControl = new FormControl();
    StatusCtrl: FormControl = new FormControl();
    DivisionCodeCtrl: FormControl = new FormControl();
    DivisionNameCtrl: FormControl = new FormControl();
    CircleCodeCtrl: FormControl = new FormControl();
    CircleNameCtrl: FormControl = new FormControl();
    workFlowStatusCtrl: FormControl = new FormControl();
    finYearCtrl: FormControl = new FormControl();
    /**
   * Mat table instance
   *
   * @type {MatTableDataSource<any>}
   * @memberOf LcDistributionCircleComponent
   */

    LcdistributionDataSource = new MatTableDataSource<LCDistribution>([]);

    /**
   * Paginator view child reference
   *
   * @type {MatPaginator}
   * @memberOf LcDistributionCircleComponent
   */

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    /**
   * Sort
   *
   * @type {MatSort}
   * @memberOf LcDistributionCircleComponent
   */
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    districtId: any;

    /**
    * Creates an instance of LcDistributionCircleComponent.
    * @param {FormBuilder} fb
    * @param {DepartmentRegistrationService} departmentRegistrationService
    * @param {ToastrService} toastr
    * @param {ReceiptManagementService} receiptManagementService
    * @param {CommonWorkflowService} commonWorkflowService
    * @param {MatDialog} dialog
    * @param {Router} router
    * @param {ActivatedRoute} activatedRoute
    *
    * @memberOf LcDistributionCircleComponent
    */
    constructor(
        private locService: LetterOfCreditService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private el: ElementRef,
        public dialog: MatDialog,
        private workflowService: CommonWorkflowService,
        private router: Router,
        private commonService: CommonService,
        private activatedRoute: ActivatedRoute,

        public datepipe: DatePipe,
        private storageService: StorageService
    ) { }

    /**
 *  Create object to access Methods of Letter of Credit Directive
 */
    directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

    /***********************Life cycle hooks methods start***********************************/

    /**
     *
     * Life cycle hook method
     *
     * @memberOf LcDistributionCircleComponent
     */

    ngOnInit() {
        this.currentUserData = this.storageService.get('currentUser');
        this.userPostList = this.currentUserData['post'];
        this.userPostList = this.userPostList.filter(row => row.loginPost == true)
        const userPostList = _.head(this.userPostList)

        this.officeNameId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeId;
        this.cardexno = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].cardexno;
        this.ddoNo = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].ddoNo;
        this.districtId = userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].districtId;

        if (userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].isTreasury == 2) {
            this.isTreasuryFlag = true;
            this.isTo = 1;
        } else this.isTreasuryFlag = false;

        this.menuId = this.commonService.getLinkMenuId();
        console.log(this.menuId, 'menuuu id');
        this.lcVerificationFormData();
        this.getCurrentUser();
        this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
    }


    /***********************Life cycle hooks methods end***********************************/

    /***********************Public methods start***********************************/

    /**
    * Initialize formgroup
    *
    *
    * @memberOf LcDistributionCircleComponent
    */


    lcVerificationFormData() {
        this.lcVerificationForm = this.fb.group({
            circleCode: [''],
            circleName: [''],
            divisionCode: [''],
            divisionName: [''],
            lcIssueFromDate: [''],
            lcIssueToDate: [''],
            entryType: [''],
            status: [''],
            lcAmountBetween: [''],
            and: [''],
            referenceFromDate: [''],
            referenceToDate: [''],
            lcNumber: [''],
            receiveFromDate: [''],
            receiveToDate: [''],
            sentFromDate: [''],
            sentToDate: [''],
            workflowStatus: [''],
            referenceNo: [''],
            finYear: ['']
        });
    }

    /**
    * Reset To Date field if Later From Date is selected after selecting To Date
    *
    *
    * @memberOf LcAccountClosingRequestSavedComponent
    */
    resetToDate() {
        this.config.dates.to.min = new Date(this.lcVerificationForm.controls.referenceFromDate.value);
        this.lcVerificationForm.controls.referenceToDate.setValue('');
    }

    resetReceiveToDate() {
        this.config.dates.to.min = new Date(this.lcVerificationForm.controls.receiveFromDate.value);
        this.lcVerificationForm.controls.receiveToDate.setValue('');
    }

    resetSentToDate() {
        this.config.dates.to.min = new Date(this.lcVerificationForm.controls.sentFromDate.value);
        this.lcVerificationForm.controls.sentToDate.setValue('');
    }


    resetLcIssueToDate(){
        this.config.dates.to.min = new Date(this.lcVerificationForm.controls.lcIssueFromDate.value);
        this.lcVerificationForm.controls.lcIssueToDate.setValue('');
    }
    /**
     * @description For get user details
     */

    getCurrentUser() {
        this.workflowService.getCurrentUserDetail().then((res: any) => {
            console.log(res, 'currentuserdetails');
            this.pouId = res.lkPOUId;
            this.menuId = res.menuId;
        });
        this.getSearchDropDowns();
    }

    /**
 * @description Filling Dropdown List of Entrytype,Division, Financial Year, Status
 */

    getSearchDropDowns() {
        this.locService.getLcDistributionSearchParams().subscribe((res: any) => {
            console.log(res);
            if (res && res.result && res.status === 200) {
                this.EntryTypeList = _.orderBy(_.cloneDeep(res.result.entryTypeList), 'entryType', 'asc');
                this.StatusList = _.orderBy(_.cloneDeep(res.result.statusList), 'statusName', 'asc');
                this.DivisionCodeList = _.orderBy(_.cloneDeep(res.result.divCodeList), 'divCode', 'asc');
                this.DivisionNameList = _.orderBy(_.cloneDeep(res.result.divNameList), 'divName', 'asc');
                this.CircleNameList = _.orderBy(_.cloneDeep(res.result.circleNameList), 'circleName', 'asc');
                this.CircleCodeList = _.orderBy(_.cloneDeep(res.result.circleCodeList), 'circleCode', 'asc');
                this.wfStatusList = _.orderBy(_.cloneDeep(res.result.wfList), 'wfStatus', 'asc');

                this.financialYearList = res.result.finYearList;
                this.financialYearList.forEach(year => {
                    if (year.isCurFinYear === 1) {
                        this.currDropYear = year.finYearId;
                        this.lcVerificationForm.patchValue({ finYear: this.currDropYear });
                    }
                });
                this.setPaginationValues();
            }
        });
    }

    isAllSelected() { }

    /**
  * @description For Resetting The Form
  */

    onReset() {
        this.lcVerificationForm.reset();
        this.lcVerificationFormData();
        this.lcVerificationForm.patchValue({ finYear: this.currDropYear });
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.getLcDistributionSerchData(null);
    
    }

    /**
    * Set Pagination
    *
    *
    * @memberOf LcDistributionCircleComponent
    */

    setPaginationValues() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;

        this.getLcDistributionSerchData();
    }

    /**
    * fetch listing data from backend
    *
    *
    * @memberOf LcDistributionCircleComponent
    */
    getLcDistributionSerchData(event: any = null) {
        const searchData = this.getSearchFilter();

        if (!searchData) {
            return false;
        }

        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: this.getSearchFilter()
        }


        if (
            !this.newSearch &&
            this.storedData.length !== 0 &&
            this.iteratablePageIndex + 1 <= Math.ceil(this.pageElements / this.pageSize)
        ) {
            // If data already fetched

            this.LcdistributionDataSource = new MatTableDataSource(
                this.storedData.slice(
                    this.iteratablePageIndex * this.pageSize,
                    this.iteratablePageIndex * this.pageSize + this.pageSize
                )
            );
            this.LcdistributionDataSource.sort = this.sort;
        } else {
            // If data needs to fetch from database.
            this.locService.getData(passData, APIConst.LC_DISTRIBUTION.GET_DISTRIBUTION_LISTING).subscribe(
                (res: any) => {
                    console.log(res);
                    this.newSearch = false;
                    if (res && res.status === 200) {
                        this.storedData = _.cloneDeep(res.result.result);

                        console.log(this.storedData);
                        if (
                            event != null &&
                            event.pageIndex < event.previousPageIndex &&
                            this.iteratablePageIndex - 1 === Math.ceil(this.pageElements / this.pageSize)
                        ) {
                            this.iteratablePageIndex = Math.ceil(this.pageElements / this.pageSize) - 1;
                            /* 
                              below if Condition is to handle button of 'Go First Page' 
                              Reset iteratablePageIndex to 0 
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
                             * else if conditin to handle button of 'Go Last Page'
                             * reset iteratablePageIndex to last pageIndex of particular pageSet
                             */
                            this.iteratablePageIndex = Math.ceil(this.storedData.length / this.pageSize) - 1;
                        } else {
                            this.iteratablePageIndex = 0;
                        }

                        this.LcdistributionDataSource = new MatTableDataSource(
                            this.storedData.slice(
                                this.iteratablePageIndex * this.pageSize,
                                this.iteratablePageIndex * this.pageSize + this.pageSize
                            )
                        );

                        this.totalRecords = res.result.totalElement;
                        this.LcdistributionDataSource.sort = this.sort;
                    } else {
                        this.storedData = [];

                        this.LcdistributionDataSource = new MatTableDataSource(this.storedData);
                        this.toastr.error(res.message);

                        this.totalRecords = 0;
                        this.pageIndex = 0;
                        this.customPageIndex = 0;
                        this.iteratablePageIndex = 0;
                        this.LcdistributionDataSource.sort = this.sort;
                    }
                },
                err => {
                    this.toastr.error(err['message']);
                    this.totalRecords = 0;
                    this.pageIndex = 0;
                    this.customPageIndex = 0;
                    this.iteratablePageIndex = 0;
                    this.LcdistributionDataSource = new MatTableDataSource([]);
                }
            );
        }
    }


    /**
    * @description Getting Filtered Data From Backend for Table
    */

    getSearchFilter() {
        if (
            this.newSearch &&
            (this.lcVerificationForm.value.circleCode ||
                this.lcVerificationForm.value.circleName ||
                this.lcVerificationForm.value.divisionCode ||
                this.lcVerificationForm.value.divisionName ||
                this.lcVerificationForm.value.lcIssueFromDate ||
                this.lcVerificationForm.value.lcIssueToDate ||
                this.lcVerificationForm.value.referenceFromDate ||
                this.lcVerificationForm.value.referenceToDate ||
                this.lcVerificationForm.value.receiveFromDate ||
                this.lcVerificationForm.value.receiveToDate ||
                this.lcVerificationForm.value.sentFromDate ||
                this.lcVerificationForm.value.sentToDate ||
                this.lcVerificationForm.value.referenceNo ||
                this.lcVerificationForm.value.lcNumber ||
                this.lcVerificationForm.value.entryType ||
                this.lcVerificationForm.value.status ||
                this.lcVerificationForm.value.workflowStatus ||
                this.lcVerificationForm.value.lcAmountBetween ||
                this.lcVerificationForm.value.and ||
                this.lcVerificationForm.value.lyingWith)
        ) {
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
                key: 'divisionId',
                value: this.lcVerificationForm.value.divisionCode || 0
            },
            {
                key: 'divisionNameId',
                value: this.lcVerificationForm.value.divisionCode || 0
            },
            {
                key: 'circleId',
                value: this.lcVerificationForm.value.circleName || 0
            },
            {
                key: 'circleNameId',
                value: this.lcVerificationForm.value.circleName || 0
            },

            {
                key: 'refFromDate',
                value: datePipe.transform(this.lcVerificationForm.value.referenceFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
            },

            {
                key: 'refToDate',
                value: datePipe.transform(this.lcVerificationForm.value.referenceToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
            },
            {
                key: 'recFromDate',
                value: datePipe.transform(this.lcVerificationForm.value.receiveFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
            },
            {
                key: 'recToDate',
                value: datePipe.transform(this.lcVerificationForm.value.receiveToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
            },
            {
                key: 'sentFromDate',
                value: datePipe.transform(this.lcVerificationForm.value.sentFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
            },

            {
                key: 'sentToDate',
                value: datePipe.transform(this.lcVerificationForm.value.sentToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
            },
            {
                key: 'lcIssueFromDate',
                value: datePipe.transform(this.lcVerificationForm.value.lcIssueFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
            },
            {
                key: 'lcIssueToDate',
                value: datePipe.transform(this.lcVerificationForm.value.lcIssueToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
            },
            {
                key: 'lcNo',
                value: this.lcVerificationForm.value.lcNumber || ''
            },
            {
                key: 'lyingWith',
                value: this.lcVerificationForm.value.lyingWith || ''
            },
            {
                key: 'lcAmntFromRange',
                value: this.lcVerificationForm.value.lcAmountBetween || 0
            },
            {
                key: 'lcAmntToRange',
                value: this.lcVerificationForm.value.and || 0
            },
            {
                key: 'entryType',
                value: this.lcVerificationForm.value.entryType || ''
            },
            {
                key: 'refNo',
                value: this.lcVerificationForm.value.referenceNo || ''
            },
            {
                key: 'status',
                value: this.lcVerificationForm.value.status || ''
            },
            {
                key: 'wfStatus',
                value: this.lcVerificationForm.value.workflowStatus || ''
            },
            {
                key: 'finYear',
                value: this.lcVerificationForm.value.finYear || 0
            },
            {
                key: 'cardexNo',
                value: this.cardexno
            },
            {
                key: 'ddoNo',
                value: this.ddoNo
            },
            {
                key: 'officeId',
                value: this.officeNameId
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
                key: 'isTo',
                value: this.isTo
            }

        ];


       
       

        const referenceFromDate = this.lcVerificationForm.value.referenceFromDate;
        const referenceToDate = this.lcVerificationForm.value.referenceToDate;
        const receiveFromDate = this.lcVerificationForm.value.receiveFromDate;
        const receiveToDate = this.lcVerificationForm.value.receiveToDate;
        const sentFromDate = this.lcVerificationForm.value.sentFromDate;
        const sentToDate = this.lcVerificationForm.value.sentToDate;
        const lcIssueFromDate = this.lcVerificationForm.value.lcIssueFromDate;
        const lcIssueToDate = this.lcVerificationForm.value.lcIssueToDate;
        const lcFromAmount:number = this.lcVerificationForm.controls['lcAmountBetween'].value
        const lcToAmount:number =  this.lcVerificationForm.controls['and'].value

        if (receiveFromDate || receiveToDate || referenceFromDate || referenceToDate || sentFromDate || sentToDate || lcIssueFromDate || lcIssueToDate || lcFromAmount || lcToAmount) {
            if (receiveFromDate || receiveToDate) {
                if (!receiveFromDate) {
                    this.toastr.error(MESSAGES.RECEIVE_FROM_DATE);
                    return false;
                } else if (!receiveToDate) {
                    this.toastr.error(MESSAGES.RECEIVE_TO_DATE);
                    return false;
                }
            }

            else if (referenceFromDate || referenceToDate) {
                if (!referenceFromDate) {
                    this.toastr.error(MESSAGES.REFERENCE_FROM_DATE);
                    return false;
                } else if (!referenceToDate) {
                    this.toastr.error(MESSAGES.REFERENCE_TO_DATE);
                    return false;
                }
            }

            else if (lcIssueFromDate || lcIssueToDate) {
                if (!lcIssueFromDate) {
                    this.toastr.error(MESSAGES.ISSUE_FROM_DATE);
                    return false;
                } else if (!lcIssueToDate) {
                    this.toastr.error(MESSAGES.ISSUE_TO_DATE);
                    return false;
                }
            }

            else if (lcFromAmount || lcToAmount) {
                if (!lcFromAmount) {
                    this.toastr.error(MESSAGES.LC_FROM_AMOUNT);
                    return false;
                } else if (!lcToAmount) {
                    this.toastr.error(MESSAGES.LC_TO_AMOUNT);
                    return false;
                }
            }
            else if (sentFromDate || sentToDate) {
                if (!sentFromDate) {
                  this.toastr.error(MESSAGES.SENT_FROM_DATE);
                  return false;
                } else if (!sentToDate) {
                  this.toastr.error(MESSAGES.SENT_TO_DATE);
                  return false;
                }
              }
        
          
            
        }

        if (lcFromAmount && lcToAmount) {
            if ((Number(lcFromAmount)) > (Number(lcToAmount))) {
                this.toastr.error(MESSAGES.LC_FROM_AMOUNT_VALIDATION);
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
        console.log('pagination event');
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
            this.iteratablePageIndex = event.pageIndex;
        } else {
            this.iteratablePageIndex = this.iteratablePageIndex + 1;
        }
        this.getLcDistributionSerchData(event);
    }

    /**
    * on Edit  Click
    *
    * @param {any} element
    *
    * @memberOf LcDistributionCircleComponent
    */

    edit(element) {
        this.router.navigate(
            [
                '/dashboard/lc/lc-verification-to-edit',
                {
                    mode: 'edit',
                    id: element.hdrId,
                    isEditable: element.isEditable,
                    refNo: element.refNo,
                    refDate: element.refDate
                }
            ],
            { relativeTo: this.activatedRoute, skipLocationChange: true }
        );
    }

    /**
    * on View  Click
    *
    * @param {any} element
    *
    * @memberOf LcDistributionCircleComponent
    */
    view(element) {
        this.router.navigate(
            [
                '/dashboard/lc/lc-verification-to-edit',
                {
                    mode: 'view',
                    id: element.hdrId,
                    isEditable: element.isEditable,
                    refNo: element.refNo,
                    refDate: element.refDate
                }
            ],
            { relativeTo: this.activatedRoute, skipLocationChange: true }
        );
    }

    /**
    * on Consolidate Click
    *
    * @param {any} element
    *
    * @memberOf LcDistributionCircleComponent
    */

    cosolidate(element) {
        this.router.navigate(
            [
                '/dashboard/lc/lc-verification-to-edit',
                {
                    mode: 'consolidate',
                    id: element.hdrId,
                    isEditable: element.isEditable,
                    refNo: element.refNo,
                    refDate: element.refDate
                }
            ],
            { relativeTo: this.activatedRoute, skipLocationChange: true }
        );
    }

    /**
  *  View Comments
  * @param element 
  */


    viewComments(element) {
        const params = {
            id: element.hdrId
        };
        this.locService.getData(params, APIConst.LC_DISTRIBUTION.GET_EDIT_VIEW_DETAILS).subscribe(
            (res: any) => {
                if (res && res.status === 200) {
                    this.editSaveResult = res.result;

                    const headerJson = [
                        { label: 'LC Number', value: this.editSaveResult.lcNo },
                        { label: 'Division code', value: this.editSaveResult.divCode },
                        { label: 'Division Name', value: this.editSaveResult.divName },
                        {
                            label: 'LC Issue Date',
                            value: this.datepipe.transform(this.editSaveResult.lcIssueDate, 'dd-MMM-yyyy')
                        },
                        { label: 'Entry Type', value: this.editSaveResult['entryType'] },
                        {
                            label: 'LC Valid From',
                            value: this.datepipe.transform(this.editSaveResult.lcValidFrom, 'dd-MMM-yyyy')
                        },
                        {
                            label: 'LC Valid Upto',
                            value: this.datepipe.transform(this.editSaveResult.lcValidTo, 'dd-MMM-yyyy')
                        },
                        { label: 'circle code', value: this.editSaveResult['circleCode'] },
                        { label: 'circle Name', value: this.editSaveResult['circleName'] },
                        { label: 'Grant order Number', value: this.editSaveResult['grantOrderNo'] },
                        {
                            label: 'Grant Order Date',
                            value: this.datepipe.transform(this.editSaveResult.grantOrderDate, 'dd-MMM-yyyy')
                        },
                        { label: 'Balance LC Amount', value: this.editSaveResult['balanceLcAmt'] },
                        { label: 'New Balance LC Amount', value: this.editSaveResult['newBalanceLcAmt'] }
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
                    const dialogRef = this.dialog.open(LcCommonWorkflowHistoryComponent, {
                        width: '2700px',
                        height: '600px',
                        data: {
                            menuModuleName: 'loc',
                            headingName: 'LC Distribution',
                            headerJson: headerJson,
                            trnId: element.hdrId,
                            moduleInfo: moduleInfo,
                            refNo: element.refNo ? element.referenceNo : '',
                            refDate: element.refDate ? element.refDate : '',
                            isAttachmentTab: false // for Attachment tab visible it should be true
                        }
                    });
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    // Method to compare amounts
    compareAmount() {
        if (this.lcVerificationForm.controls['lcAmountBetween'].value > this.lcVerificationForm.controls['and'].value) {
            this.valueBetweenError = true;
        } else {
            this.valueBetweenError = false;
        }
    }

    /**
     * Print method
     * @param element 
     */
    onDownloadprintClick(element) {
        const hdrId = element.hdrId;
        //const hdrId = 100;

        this.locService.getDistributionCirclePrintPdf(hdrId).subscribe((res: any) => {
            if (res.status === 200) {
                this.locService.getPDF(res, null, this.toastr);
            } else {
                this.toastr.error(res.message);
            }
        });
    }
    downloadFormBPdf(element){
        const hdrId = element.hdrId;
        this.locService.getData(hdrId, APIConst.LC_DISTRIBUTION.GET_DISTRIBUTION_PRINT_FORM_A_PDF).subscribe((res: any) => {
            if (res.status === 200) {
                this.locService.getPDF(res, null, this.toastr);
            } else {
                this.toastr.error(res.message);
            }
        });
    }

}
