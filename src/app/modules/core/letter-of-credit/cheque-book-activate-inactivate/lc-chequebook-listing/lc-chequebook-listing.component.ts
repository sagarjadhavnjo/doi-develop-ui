import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChequebookDetails } from './../../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../../directive/letter-of-credit-directive';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/modules/services/common.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CommonWorkflowService } from '../../../common/workflow-service/common-workflow.service';
import { LetterOfCreditService } from '../../service/letter-of-credit.service';
import * as _ from 'lodash';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { DatePipe } from '@angular/common';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { LcCommonWorkflowHistoryComponent } from '../../lc-common-workflow-history/lc-common-workflow-history.component';
import { DateLocaleAndFormat } from 'src/app/shared/constants/constants/common/common-data.constants';

@Component({
  selector: 'app-lc-chequebook-listing',
  templateUrl: './lc-chequebook-listing.component.html',
  styleUrls: ['./lc-chequebook-listing.component.css']
})


export class LcChequebookListingComponent implements OnInit {

  // List of Cheque Type
  ChequeTypeList: any[] = [];

  // List of Request Type
  RequestTypeList: any[] = [];

  // List of Status
  StatusTypeList: any[] = [];
  wfStatusList = [];
  DivisionCodeList: any[] = [];

  // List of Division Name
  DivisionNameList: any[] = [];


  // Display data for Chequebook Details
  ChequbookDetailsData: ChequebookDetails[] = [

  ];

  // Data Column for Chequebook Details Table
  ChequbookDetailsDataColumn: string[] = [
    'srno',
    'referenceNumber',
    'referenceDate',
    'typeOfRequest',
    'receivedFrom',
    'receivedDate',
    'sentTo',
    'sentDate',
    'lyingWith',
    'workFlowStatus',
    'status',
    'action'
  ];

  /**
    * Configuration for this file
    *
    *
    * @memberOf LcChequebookListingComponent
    */
  pouId: any;
  userOffice: any;
  officeId: any;
  menuId: any;
  newSearchParam: number;
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
  workFlowData = 'fromLcChequebookActivateInactivate';
  todayDate = new Date();
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
     * @memberOf LcChequebookListingComponent
     */

  storedData: any[] = [];
  /**
       *  Form group instance
       *
       * @type {FormGroup}
       * @memberOf LcChequebookListingComponent
       */
  lcChequeBookActivateInactivateForm: FormGroup;
  ChequeTypeCTRL: FormControl = new FormControl();
  RequestTypeCTRL: FormControl = new FormControl();
  StatusCTRL: FormControl = new FormControl();
  workFlowStatusCtrl: FormControl = new FormControl();
  DivisionCodeCTRL: FormControl = new FormControl();
  DivisionNameCTRL: FormControl = new FormControl();

  /**
    * Mat table instance
    *
    * @type {MatTableDataSource<any>}
    * @memberOf LcChequebookListingComponent
    */
  ChequbookDetailsDataSource = new MatTableDataSource<ChequebookDetails>([]);
  /**
   * Paginator view child reference
   *
   * @type {MatPaginator}
   * @memberOf LcChequebookListingComponent
   */


  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  /**
    * Sort
    *
    * @type {MatSort}
    * @memberOf LcChequebookListingComponent
    */
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentUserData: any;
  userPostList: any;
  isTreasuryFlag: boolean;

  /**
    * Creates an instance of LcChequebookListingComponent.
    * @param {FormBuilder} fb
    * @param {DepartmentRegistrationService} departmentRegistrationService
    * @param {ToastrService} toastr
    * @param {ReceiptManagementService} receiptManagementService
    * @param {CommonWorkflowService} commonWorkflowService
    * @param {MatDialog} dialog
    * @param {Router} router
    * @param {ActivatedRoute} activatedRoute
    *
    * @memberOf LcChequebookListingComponent
    */

  constructor(private fb: FormBuilder, private el: ElementRef, public dialog: MatDialog, private router: Router,
    private activatedRoute: ActivatedRoute, private storageService: StorageService, private commonService: CommonService,
    private workflowService: CommonWorkflowService, private locService: LetterOfCreditService, private toastr: ToastrService,
    public datepipe: DatePipe) { }

  /**
   *  Create object to access Methods of Letter of Credit Directive
   */
  directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

  /***********************Life cycle hooks methods start***********************************/

  /**
   *
   * Life cycle hook method
   *
   * @memberOf LcChequebookListingComponent
   */
  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
    this.paginationArray = DataConst.PAGINATION_ARRAY;
    this.iteratablePageIndex = 0;
    this.indexedItem = 0;
    this.customPageIndex = 0;
    this.pageElements = 250;
    this.pageSize = 25;
    this.pageIndex = 0;
    this.ChequbookDetailsDataSource.sort = this.sort;
    this.userOffice = this.storageService.get('userOffice');
    this.currentUserData = this.storageService.get('currentUser');
    this.userPostList = this.currentUserData['post'];
    this.userPostList = this.userPostList.filter(row => row.loginPost == true)
    const userPostList = _.head(this.userPostList)

    //this.officeId = this.userOffice.officeId;
    if (userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].isTreasury == 2){
      this.isTreasuryFlag = true;
      this.ChequbookDetailsDataColumn= [
        'srno','referenceNumber','referenceDate','divisionCode','divisionName','typeOfRequest','receivedFrom',
        'receivedDate','sentTo','sentDate','lyingWith','workFlowStatus','status','action'
      ];
    
    }
    else 
      this.isTreasuryFlag = false;

    this.menuId = this.commonService.getLinkMenuId();
    console.log(this.menuId, 'menuId', this.userOffice)
    this.lcChequeBookActivateInactivateFormData();
    this.getChequeTypeList();
    this.getCurrentUser();
  }


  /***********************Life cycle hooks methods end***********************************/

  /***********************Public methods start***********************************/

  /**
  * Initialize formgroup
  *
  *
  * @memberOf LcChequebookListingComponent
  */

  lcChequeBookActivateInactivateFormData() {
    this.lcChequeBookActivateInactivateForm = this.fb.group({
      requestType: [''],
      chequeType: [''],
      sentFromDate: [''],
      sentToDate: [''],
      status: [''],
      referenceFromDate: [''],
      referenceToDate: [''],
      receiveFromDate: [''],
      receiveToDate: [''],
      referenceNo: [''],
      divisionCode: [''],
      divisionName: [''],
      workflowStatus: [''],
      lyingWith:['']

    });
  }
  /**
   * Paginator initialization
   * 
   *   @memberOf LcChequebookListingComponent
   */
  setDataSourceAttributes() {
    this.ChequbookDetailsDataSource.paginator = this.paginator;
    this.ChequbookDetailsDataSource.sort = this.sort;
  }

  /**
     * Reset To Date field if Later From Date is selected after selecting To Date
     *
     *
     * @memberOf LcAccountClosingRequestSavedComponent
     */
  resetToDate() {
    this.config.dates.to.min = new Date(this.lcChequeBookActivateInactivateForm.controls.referenceFromDate.value);
    this.lcChequeBookActivateInactivateForm.controls.referenceToDate.setValue('');
  }

  resetReceiveToDate() {
    this.config.dates.to.min = new Date(this.lcChequeBookActivateInactivateForm.controls.receiveFromDate.value);
    this.lcChequeBookActivateInactivateForm.controls.receiveToDate.setValue('');
  }

  resetSentToDate() {
    this.config.dates.to.min = new Date(this.lcChequeBookActivateInactivateForm.controls.sentFromDate.value);
    this.lcChequeBookActivateInactivateForm.controls.sentToDate.setValue('');
  }

  /**
    * Get search parameters
    *
    *
    * @memberOf LcChequebookListingComponent
    */

  getChequeTypeList() {
    this.locService.getCheckBookSearchParams().subscribe(
      (res: any) => {
        console.log(res)
        if (res && res.result && res.status === 200) {
          this.ChequeTypeList = _.orderBy(_.cloneDeep(res.result.chequeTypeList), 'chequeTypeName', 'asc');
          this.StatusTypeList = _.orderBy(_.cloneDeep(res.result.statusList), 'statusName', 'asc');
          this.RequestTypeList = _.orderBy(_.cloneDeep(res.result.reqTypeList), 'reqTypeName', 'asc');
          this.wfStatusList = _.orderBy(_.cloneDeep(res.result.wfList), 'wfName', 'asc');
          this.DivisionCodeList=_.orderBy(_.cloneDeep(res.result.divCodeList), 'divCode', 'asc');
          this.DivisionNameList=_.orderBy(_.cloneDeep(res.result.divNameList), 'divName', 'asc');


        }
      }
    )

  }

  /**
   * @description Get Current User Details
   */

  getCurrentUser() {
    this.workflowService.getCurrentUserDetail().then((res: any) => {
      console.log(res, 'currentuserdetails')
      this.pouId = res.lkPOUId;
      this.lcChequeBookActivateInactivateFormDetails();
    });
  }



   /**
     * Call on reset click
     *
     *
     * @memberOf ChequeCancelationDivisionListingComponent
     */
    reset() {
      this.lcChequeBookActivateInactivateForm.reset();
      this.newSearch = true;
  
      this.pageIndex = 0;
      this.customPageIndex = 0;
      this.pageIndex = 0;
      this.iteratablePageIndex = 0;
      this.getGrantOrderList(null);
  
  
    }
  /** * @description Method  
   * 
   * 
   * is to set pagination values and trigger grant order list 
   * 
   * */

  lcChequeBookActivateInactivateFormDetails() {

    this.newSearch = true;
    this.pageIndex = 0;
    this.customPageIndex = 0;
    this.paginator.pageIndex = 0;
    this.iteratablePageIndex = 0;
    this.isSearch = 1;
    //this.storedData= []; 
    this.getGrantOrderList();

  }
  /**  @description Method 
   * 
   *  is to fetch data from backend  
   * */

  getGrantOrderList(event: any = null) {
    const searchData = this.getSearchFilter();

    if (!searchData) {
      return false;
    }

    const passData = {
      pageIndex: this.customPageIndex,
      pageElement: this.pageElements,
      jsonArr: searchData

    }

    // tslint:disable-next-line:max-line-length 
    if (
      !this.newSearch &&
      this.storedData.length !== 0 &&
      this.iteratablePageIndex + 1 <= Math.ceil(this.pageElements / this.pageSize)
    ) {
      // If data already fetched 
      // tslint:disable-next-line:max-line-length 
      this.ChequbookDetailsDataSource = new MatTableDataSource(
        this.storedData.slice(
          this.iteratablePageIndex * this.pageSize,
          this.iteratablePageIndex * this.pageSize + this.pageSize

        )
      );
      this.ChequbookDetailsDataSource.sort = this.sort;

    } else {

      console.log(passData);
      this.locService.getData(passData, APIConst.CHECKBOOK_ACTIVE_INACTIVE.CHECK_BOOK_LISTING).subscribe(
        (res: any) => {
          console.log(res)
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

            // tslint:disable-next-line:max-line-length 
            this.ChequbookDetailsDataSource = new MatTableDataSource(
              this.storedData.slice(
                this.iteratablePageIndex * this.pageSize,
                this.iteratablePageIndex * this.pageSize + this.pageSize
              )
            );


            this.totalRecords = res.result.totalElement;
            this.ChequbookDetailsDataSource.sort = this.sort;
          } else {
            this.storedData = [];
            // tslint:disable-next-line:max-line-length 
            this.ChequbookDetailsDataSource = new MatTableDataSource(this.storedData);
            this.toastr.error(res.message);
            this.totalRecords = 0;
            this.pageIndex = 0;
            this.customPageIndex = 0;
            this.iteratablePageIndex = 0;
            this.ChequbookDetailsDataSource.sort = this.sort;

          }
        },
        err => {
          this.toastr.error(err['message']);
          this.totalRecords = 0;
          this.pageIndex = 0;
          this.customPageIndex = 0;
          this.iteratablePageIndex = 0;
          this.ChequbookDetailsDataSource = new MatTableDataSource([]);
        }
      );
    }
  }

  /** * @description Method  is to fetch values from the form to send to backend and user details 
   * @returns array of objects
   */

  getSearchFilter() {
    console.log(this.lcChequeBookActivateInactivateForm);

    console.log(this.datepipe.transform(this.lcChequeBookActivateInactivateForm.value.receiveFromDate, 'dd/MM/yyyy'), 'received from')

    if (this.newSearch
      && (
        this.lcChequeBookActivateInactivateForm.value.requestType
        || this.lcChequeBookActivateInactivateForm.value.chequeType
        || this.lcChequeBookActivateInactivateForm.value.status
        || this.lcChequeBookActivateInactivateForm.value.receiveFromDate
        || this.lcChequeBookActivateInactivateForm.value.receiveToDate
        || this.lcChequeBookActivateInactivateForm.value.sentFromDate
        || this.lcChequeBookActivateInactivateForm.value.sentToDate
        || this.lcChequeBookActivateInactivateForm.value.referenceFromDate
        || this.lcChequeBookActivateInactivateForm.value.referenceToDate
        || this.lcChequeBookActivateInactivateForm.value.referenceNo
        || this.lcChequeBookActivateInactivateForm.value.workflowStatus
        || this.lcChequeBookActivateInactivateForm.value.lyingWith 

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
        key: 'reqTypeId',
        value: this.lcChequeBookActivateInactivateForm.value.requestType || 0
      },
      {
        key: 'chequeTypeId',
        value: this.lcChequeBookActivateInactivateForm.value.chequeType || 0
      },
      {
        key: 'refFromDate',
        value: datePipe.transform(this.lcChequeBookActivateInactivateForm.value.referenceFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },

      {
        key: 'refToDate',
        value: datePipe.transform(this.lcChequeBookActivateInactivateForm.value.referenceToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: 'recFromDate',
        value: this.datepipe.transform(this.lcChequeBookActivateInactivateForm.value.receiveFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: 'recToDate',
        value: datePipe.transform(this.lcChequeBookActivateInactivateForm.value.receiveToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: 'sentFromDate',
        value: datePipe.transform(this.lcChequeBookActivateInactivateForm.value.sentFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''

      },
      {
        key: 'sentToDate',
        value: datePipe.transform(this.lcChequeBookActivateInactivateForm.value.sentToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''

      },

      {
        key: 'refNo',
        value: this.lcChequeBookActivateInactivateForm.value.referenceNo || ''
      },
      {
        key: 'status',
        value: this.lcChequeBookActivateInactivateForm.value.status || ''

      },
      {
        key: "lyingWith",
        value: this.lcChequeBookActivateInactivateForm.value.lyingWith || ''
      },
      {
        key: 'pouId',
        value: this.pouId

      },

      {
        key: 'menuId',
        value: this.menuId

      },
      {
        key: 'wfStatus',
        value: this.lcChequeBookActivateInactivateForm.value.workflowStatus || ''
      },
      {
        key: 'divisionId',
        value: this.lcChequeBookActivateInactivateForm.value.divisionCode || 0
      },
      {
        key: 'divisionNameId',
        value: this.lcChequeBookActivateInactivateForm.value.divisionName || 0
      }
    ]
    console.log(returnArray);
    const referenceFromDate = this.lcChequeBookActivateInactivateForm.value.referenceFromDate;
    const referenceToDate = this.lcChequeBookActivateInactivateForm.value.referenceToDate;
    const receiveFromDate = this.lcChequeBookActivateInactivateForm.value.receiveFromDate;
    const receiveToDate = this.lcChequeBookActivateInactivateForm.value.receiveToDate;
    const sentFromDate = this.lcChequeBookActivateInactivateForm.value.sentFromDate;
    const sentToDate = this.lcChequeBookActivateInactivateForm.value.sentToDate;


    if (receiveFromDate || receiveToDate || referenceFromDate || referenceToDate || sentFromDate || sentToDate) {
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
    return returnArray;
  }
  /** * @description Method  is to set data based on pagination selection  */

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
    this.getGrantOrderList(event);
  }

  /**
     * on Edit Click
     *
     * @param {any} element
     *
     * @memberOf LcChequebookListingComponent
     */

  edit(element) {
    this.router.navigate(
      ['/dashboard/lc/lc-cheque-activate-inactivate-division', { mode: 'edit', id: element.hdrId, status: element.status, isEditable: element.isEditable }],
      { relativeTo: this.activatedRoute, skipLocationChange: true }
    );
  }


  /**
     * on View Comments Click
     *
     * @param {any} element
     *
     * @memberOf LcChequebookListingComponent
     */

  viewComments(element) {
    const passData = {
      id: element.hdrId
    };

    this.locService.getSubmitActionChequeDetails(passData).subscribe(
      (res: any) => {
        if (res && res.status === 200) {
          const headerDetails = _.cloneDeep(res.result);
          const headerJson = [
            { label: 'Division Code', value: headerDetails.divCode },
            { label: 'Division Name', value: headerDetails.divName },
            { label: 'Bank Name', value: headerDetails.bankName },
            { label: 'Bank Account No', value: headerDetails.bankAccNo },
            { label: 'Cheque Type', value: headerDetails.chequeType },
            { label: 'Type of', value: headerDetails.reqType },

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
              headingName: 'LC ChequeBook Active Inactive',
              headerJson: headerJson,

              trnId: element.hdrId,
              moduleInfo: moduleInfo,
              refNo: headerDetails.referenceNo ? headerDetails.referenceNo : '',
              refDate: headerDetails.referenceDt ? headerDetails.referenceDt : '',
              isAttachmentTab: false, // for Attachment tab visible it should be true
            }
          });
        }
        else {
          this.toastr.error(res.message);
        }
      },
      err => {
        this.toastr.error(err);
      }
    );
  }


  /**
     * on delete Click
     *
     * @param {any} element
     *
     * @memberOf LcChequebookListingComponent
     */

  deleteSDDetails(element: any, elementindex: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: MESSAGES.DELETE_CONFIRMATION_MESSAGE
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const param = {
          id: element.hdrId
        };
        this.locService.getData(param, APIConst.CHECKBOOK_ACTIVE_INACTIVE.DELETE_CHECKBOOK_DATA).subscribe(
          (resp: any) => {
            if (resp && resp.status === 200) {
              this.toastr.success(resp.message);
              this.spliceExistingDataOnDelete(element, elementindex);
            } else {
              this.toastr.error(resp['message']);
            }
          },
          err => {
            this.toastr.error(err);
          }
        );
      }
    });
  }
  spliceExistingDataOnDelete(element, elementindex) {
    this.ChequbookDetailsDataSource.data.splice(elementindex, 1);

    this.ChequbookDetailsDataSource = new MatTableDataSource<any>(this.ChequbookDetailsDataSource.data);

  }


  /**
     * on View Click
     *
     * @param {any} element
     *
     * @memberOf LcChequebookListingComponent
     */

  view(element) {
    this.router.navigate(
      ['/dashboard/lc/lc-chequebook-listing-view', { mode: 'view', id: element.hdrId, status: element.status, isEditable: element.isEditable }],
      { relativeTo: this.activatedRoute, skipLocationChange: true }
    );
  }
}
