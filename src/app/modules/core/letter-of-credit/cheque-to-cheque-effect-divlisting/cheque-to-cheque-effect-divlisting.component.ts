import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ListValue, chequeCancellationDivision, chequeToChequeEffect } from './../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../directive/letter-of-credit-directive';
import { MatTableDataSource } from '@angular/material/table';
import { CommonWorkflowService } from '../../common/workflow-service/common-workflow.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { LetterOfCreditService } from '../service/letter-of-credit.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as _ from 'lodash';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { ModuleNames } from '../../common/constant/common-workflow.constants';
import { ViewCommonWorkflowHistoryComponent } from '../../common/view-common-workflow-history/view-common-workflow-history.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { LcCommonWorkflowHistoryComponent } from '../lc-common-workflow-history/lc-common-workflow-history.component';
import { DateLocaleAndFormat } from 'src/app/shared/constants/constants/common/common-data.constants';


@Component({
  selector: 'app-cheque-to-cheque-effect-divlisting',
  templateUrl: './cheque-to-cheque-effect-divlisting.component.html',
  styleUrls: ['./cheque-to-cheque-effect-divlisting.component.css']
})
export class ChequeToChequeEffectDivisionListingComponent implements OnInit {





  /**
   * Configuration for this file
   *
   *
   * @memberOf ChequeCancelationDivisionListingComponent
   */

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
  divCodeList = [];
  divNameList = [];
  circleCodeList = [];
  circleNameList = [];
  statusList = [];
  wfStatusList = [];
  newSearch: boolean = false;
  newSearchParam: number = 0;
  totalRecords: number = 0;
  todayDate = new Date();
  isTreasuryHideFlag: boolean = false;
  valueBetweenError = false;
  apiURL: string;
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
  lcChequeCancelationData: chequeToChequeEffect[] = [

  ];

  // readonly config = {
  //   dates: {
  //     from: {
  //       default: new Date(),
  //       max: new Date()
  //     },
  //     to: {
  //       default: new Date(),
  //       min: new Date(),
  //       max: new Date()
  //     }
  //   },
  // };


  lcChequeCancelationDataColumn: string[] = [
    'srno', 'referenceNo', 'referenceDate', 'missingChequeNo', 'chequeDate', 'chequeAmount', 'receivedFrom', 'receivedDate', 'sentTo', 'sentDate', 'lyingWith', 'workflowStatus','status',  'action'
  ];

  /**
     * Stored table data
     *
     * @type {*}
     * @memberOf ChequeCancelationDivisionListingComponent
     */

  storedData: any[] = [];
  /**
     *  Form group instance
     *
     * @type {FormGroup}
     * @memberOf ChequeCancelationDivisionListingComponent
     */

  lcChequeCancelationListingForm: FormGroup;
  workflowStatusstatusCtrl: FormControl = new FormControl();
  statusCtrl: FormControl = new FormControl();
  DivisionCodeCtrl: FormControl = new FormControl();
  DivisionNameCtrl: FormControl = new FormControl();

  /**
    * Mat table instance
    *
    * @type {MatTableDataSource<any>}
    * @memberOf ChequeCancelationDivisionListingComponent
    */

  dataSource = new MatTableDataSource([]);
  lcChequeCancelationDataSource = new MatTableDataSource<chequeCancellationDivision>(this.lcChequeCancelationData);
  /**
   * Paginator view child reference
   *
   * @type {MatPaginator}
   * @memberOf ChequeCancelationDivisionListingComponent
   */
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  /**
     * Sort
     *
     * @type {MatSort}
     * @memberOf ChequeCancelationDivisionListingComponent
     */

  @ViewChild(MatSort, { static: true }) sort: MatSort;


  /**
   * Creates an instance of ChequeCancelationDivisionListingComponent.
   * @param {FormBuilder} fb
   * @param {StorageService} storageService
   * @param {ToastrService} toastr
   * @param {LetterOfCreditService} locService
   * @param {CommonWorkflowService} workflowService
   * @param {MatDialog} dialog
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   *
   * @memberOf ChequeCancelationDivisionListingComponent
   */

  constructor(private fb: FormBuilder, private el: ElementRef, public dialog: MatDialog, private router: Router,
    private activatedRoute: ActivatedRoute, private storageService: StorageService, private commonService: CommonService,
    private workflowService: CommonWorkflowService, private locService: LetterOfCreditService, private toastr: ToastrService, public datepipe: DatePipe) { }

  /**
   * Create object to access Methods of Letter of Credit Directive
  */
  directiveObject = new LetterOfCreditDirectives(this.router, this.dialog, this.el);

  /***********************Life cycle hooks methods start***********************************/

  /**
   *
   * Life cycle hook method
   *
   * @memberOf ChequeCancelationDivisionListingComponent
   */

  ngOnInit() {
    this.currentUserData = this.storageService.get('currentUser');
    this.userPostList = this.currentUserData['post'];
    this.userPostList = this.userPostList.filter(row => row.loginPost == true)
    const userPostList = _.head(this.userPostList)

    /**
    * Pagination and configuration for this file
    *
    *
    * @memberOf ChequeCancelationDivisionListingComponent
    */

    this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
    this.paginationArray = DataConst.PAGINATION_ARRAY;
    this.indexedItem = 0;
    this.customPageIndex = 0;
    this.iteratablePageIndex = 0;
    this.pageElements = 250;
    this.pageSize = 25;
    this.pageIndex = 0;
    this.getCurrentUser();
    this.menuId = this.commonService.getLinkMenuId();
    this.lcChequeCancelationListingFormData();
    this.fillDropdownOfFilter();

  }
  /***********************Life cycle hooks methods end***********************************/

  /***********************Public methods start***********************************/


  /**
   * Initialize formgroup
   *
   *
   * @memberOf ChequeCancelationDivisionListingComponent
   */

  lcChequeCancelationListingFormData() {
    this.lcChequeCancelationListingForm = this.fb.group({
      referenceNo: [''],
      chequeNo: [''],
      referenceFromDate: [''],
      referenceToDate: [''],
      chequeFromAmt: [''],
      chequeToAmt: [''],
      status: [''],
      workflowStatus: [''],
      receivedFromDate: [''],
      receivedToDate: [''],
      sentFromDate: [''],
      sentToDate: [''],
      lyingWith: ['']
    });
  }

  /**
 * Reset To Date field if Later From Date is selected after selecting To Date
 *
 *
 * @memberOf LcAccountClosingRequestSavedComponent
 */
  // resetToDate() {
  //   this.config.dates.to.min = new Date(this.lcChequeCancelationListingForm.controls.referenceFromDate.value);
  //   this.lcChequeCancelationListingForm.controls.referenceToDate.setValue('');
  // }

  // resetReceiveToDate() {
  //   this.config.dates.to.min = new Date(this.lcChequeCancelationListingForm.controls.receiveFromDate.value);
  //   this.lcChequeCancelationListingForm.controls.receiveToDate.setValue('');
  // }

  // resetSentToDate() {
  //   this.config.dates.to.min = new Date(this.lcChequeCancelationListingForm.controls.sentFromDate.value);
  //   this.lcChequeCancelationListingForm.controls.sentToDate.setValue('');
  // }


  /**
  * @description Get Current User Details
  */
  getCurrentUser() {
    this.workflowService.getCurrentUserDetail().then((res: any) => {
      console.log(res, 'currentuserdetails')
      this.pouId = res.lkPOUId;
    });
    if (this.pouId)
      this.getListData()
  }

  /**
   * Reset To Date field if Later From Date is selected after selecting To Date
   *
   *
   * @memberOf LcAccountClosingRequestSavedComponent
   */
  resetToDate() {
    this.config.dates.to.min = new Date(this.lcChequeCancelationListingForm.controls.referenceFromDate.value);
    this.lcChequeCancelationListingForm.controls.referenceToDate.setValue('');
  }


  resetReceiveToDate() {
    this.config.dates.to.min = new Date(this.lcChequeCancelationListingForm.controls.receivedFromDate.value);
    this.lcChequeCancelationListingForm.controls.receivedToDate.setValue('');
  }

  resetSentToDate() {
    this.config.dates.to.min = new Date(this.lcChequeCancelationListingForm.controls.sentFromDate.value);
    this.lcChequeCancelationListingForm.controls.sentToDate.setValue('');
  }

  /**
  * @description Filling Dropdown List of  Status,workFlow status
  */
  fillDropdownOfFilter() {
    this.locService.getDropDownListChequeEffect({}).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          if (resp.result.statusList) {
            this.statusList = _.orderBy(_.cloneDeep(resp.result.statusList), 'statusName', 'asc');
          }
          if (resp.result.wfList) {
            this.wfStatusList = _.orderBy(_.cloneDeep(resp.result.wfList), 'wfStatus', 'asc');

          }
          if (this.pouId) {
            this.getListData();
            this.dataSource.sort = this.sort;
          }
        }
      },
      err => {
        this.toastr.error(err);
      }
    );
  }


  /** * @description Method  is to 
   * set pagination values and 
   * trigger grant order list 
   * 
   * */

  getListData(event: any = null) {
    const searchData = this.getFilterParams();

    this.apiURL = APIConst.LC_CHEQUE_TO_CHEQUE_EFFECT.GET_CHEQUE_CANCEL_LISTING


    if (!searchData) {
      return false;
    }
    const passData = {
      pageIndex: this.customPageIndex,
      pageElement: this.pageElements,
      jsonArr: searchData
    }
    console.log(passData, 'input params for listing outtt')

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
      // this.dataSource.sort = this.sort;
    } else {
      this.locService.getData(passData, this.apiURL).subscribe(
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
   * Fliter based on Dropdown
   * 
   * @returns params
   */

  getFilterParams() {
    if (
      this.newSearch && (
        this.lcChequeCancelationListingForm.value.chequeNo ||
        this.lcChequeCancelationListingForm.value.referenceNo ||
        this.lcChequeCancelationListingForm.value.chequeFromAmt ||
        this.lcChequeCancelationListingForm.value.chequeToAmt ||
        this.lcChequeCancelationListingForm.value.referenceFromDate ||
        this.lcChequeCancelationListingForm.value.referenceToDate ||
        this.lcChequeCancelationListingForm.value.receivedFromDate ||
        this.lcChequeCancelationListingForm.value.receivedToDate ||
        this.lcChequeCancelationListingForm.value.sentFromDate ||
        this.lcChequeCancelationListingForm.value.sentToDate ||
        this.lcChequeCancelationListingForm.value.lyingWith ||
        this.lcChequeCancelationListingForm.value.status ||
        this.lcChequeCancelationListingForm.value.workflowStatus)
    ) {
      this.newSearchParam = 1;
    } else {
      this.newSearchParam = 0;
    }

    const datePipe = new DatePipe(DateLocaleAndFormat.Locale.EnUS);
    const returnArray = [
      {
        key: "pouId",
        value: this.pouId//2796
      },
      {
        key: "menuId",
        value: this.menuId
      },
      {
        key: "chequeNo",
        value: this.lcChequeCancelationListingForm.value.chequeNo || ""
      },
      {
        key: "refNo",
        value: this.lcChequeCancelationListingForm.value.referenceNo || ""
      },
      {
        key: "refFromDate",
        value: datePipe.transform(this.lcChequeCancelationListingForm.value.referenceFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: "refToDate",
        value: datePipe.transform(this.lcChequeCancelationListingForm.value.referenceToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },

      {
        key: "chequeFromAmt",
        value: this.lcChequeCancelationListingForm.value.chequeFromAmt || 0
      },
      {
        key: "chequeToAmt",
        value: this.lcChequeCancelationListingForm.value.chequeToAmt || 0
      },
      {
        key: "recFromDate",
        value: datePipe.transform(this.lcChequeCancelationListingForm.value.receivedFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: "recToDate",
        value: datePipe.transform(this.lcChequeCancelationListingForm.value.receivedToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: "sentFromDate",
        value: datePipe.transform(this.lcChequeCancelationListingForm.value.sentFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: "sentToDate",
        value: datePipe.transform(this.lcChequeCancelationListingForm.value.sentToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: "lyingWith",
        value: this.lcChequeCancelationListingForm.value.lyingWith || ""
      },
      {
        key: "status",
        value: this.lcChequeCancelationListingForm.value.status || ""
      },
      {
        key: "wfStatus",
        value: this.lcChequeCancelationListingForm.value.workflowStatus || ""
      },
      {
        key: "isSearch",
        value: this.newSearchParam
      }
    ]

   

    const referenceFromDate = this.lcChequeCancelationListingForm.value.referenceFromDate;
    const referenceToDate = this.lcChequeCancelationListingForm.value.referenceToDate;
    const receiveFromDate = this.lcChequeCancelationListingForm.value.receivedFromDate;
    const receiveToDate = this.lcChequeCancelationListingForm.value.receivedToDate;
    const sentFromDate = this.lcChequeCancelationListingForm.value.sentFromDate;
    const sentToDate = this.lcChequeCancelationListingForm.value.sentToDate;

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

    return returnArray
  }


  /**
   * on Edit Click
   *
   * @param {any} element
   *
   * @memberOf ChequeCancelationDivisionListingComponent
   */

  edit(element) {
    this.router.navigate(
      ['/dashboard/lc/lc-cheque-to-cheque-effect', { mode: 'edit', id: element.hdrId, status: element.trnStatus, isEditable: element.isEditable }],
      { relativeTo: this.activatedRoute, skipLocationChange: true }
    );
  }


  /**
       * On Click of view
       *
       * @param {any} element
       *
       * @memberOf ChequeCancelationDivisionListingComponent
       */
  view(element) {
    this.router.navigate(
      ['/dashboard/lc/lc-cheque-to-cheque-effect-view', { mode: 'view', id: element.hdrId, status: element.trnStatus, isEditable: element.isEditable }],
      { relativeTo: this.activatedRoute, skipLocationChange: true }
    );
  }

  /**
      * Call on Search Icon
      *
      * @memberOf ChequeCancelationDivisionListingComponent
      */

  search() {
    if (this.lcChequeCancelationListingForm.valid) {
      this.newSearch = true;

      this.pageIndex = 0;
      this.customPageIndex = 0;
      this.iteratablePageIndex = 0;
      this.getListData();
    } else {
      _.each(this.lcChequeCancelationListingForm.controls, function (ctrl: FormControl) {
        if (ctrl.status === 'INVALID') {
          ctrl.markAsTouched();
        }
      });
    }
  }

  /**
     * Call on reset click
     *
     *
     * @memberOf ChequeCancelationDivisionListingComponent
     */
  reset() {
    this.lcChequeCancelationListingForm.reset();
    this.newSearch = true;

    this.pageIndex = 0;
    this.customPageIndex = 0;
    this.pageIndex = 0;
    this.iteratablePageIndex = 0;
    this.getListData(null);


  }

  /**
      * Call on change of pagination
      *
      * @param {PageEvent} event
      *
      * @memberOf ChequeCancelationDivisionListingComponent
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
    *  View Comments
    * @param element 
    */
  viewComments(element) {
    const param = {
      id: element.hdrId,
    };
    this.locService.getCheqEffectHeaderData(param).subscribe((resp: any) => {

      if (resp && resp.status === 200) {
        const headerDetails = _.cloneDeep(resp.result);
        const headerJson = [
          { label: 'Missing Cheque No', value: (headerDetails.missingChequeNo) ? headerDetails.missingChequeNo : '' },
          { label: 'Cheque No', value: (headerDetails.chequeNo) ? headerDetails.chequeNo : '' },
          { label: 'Cheque Amount', value: headerDetails.chequeAmt ? Number(headerDetails.chequeAmt).toFixed(2) : '' },
          { label: 'Cheque Date', value: headerDetails.chequeDate ? headerDetails.chequeDate : '' },
          { label: 'In Favour of', value: headerDetails.inFavourOf ? headerDetails.inFavourOf : '' },
          { label: 'Advice No', value: headerDetails.adviceNo ? headerDetails.adviceNo : '' },
          { label: 'Advice Date', value: headerDetails.adviceDate ? headerDetails.adviceDate : '' },
          { label: 'Division Code', value: headerDetails.divisionCode ? headerDetails.divisionCode : '' },
          { label: 'Division Name', value: headerDetails.divisionName ? headerDetails.divisionName : '' },
          { label: 'Drawing Officer', value: headerDetails.drawingOfficeName ? headerDetails.drawingOfficeName : '' },


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
            headingName: 'LC Cheque Cancellation',
            headerJson: headerJson,
            moduleInfo: moduleInfo,
            trnId: element.hdrId,
            refNo: headerDetails.refNo ? headerDetails.refNo : '',
            refDate: headerDetails.refDate ? headerDetails.refDate : '',
            isAttachmentTab: false // for Attachment tab visible it should be true
          }
        });
      } else {
        this.toastr.error(resp.message);
      }
    },
      err => {
        this.toastr.error(err);
      }
    );
  }

  /**
       * On Click Of Delete
       *
       * @param {any} element
       *
       * @memberOf ChequeCancelationDivisionListingComponent
       */

  deleteSDDetails(element: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: MESSAGES.DELETE_CONFIRMATION_MESSAGE
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const param = {
          id: element.hdrId
        };
        this.locService.deleteSDCheqEffect(param).subscribe(
          (resp: any) => {
            if (resp && resp.status === 200) {
              this.toastr.success(resp.message);

              this.newSearch = true;
              this.pageIndex = 0;
              this.customPageIndex = 0;
              this.pageIndex = 0;
              this.iteratablePageIndex = 0;
              this.getListData(null);
            } else {
              this.toastr.error(resp.message);
            }
          },
          err => {
            this.toastr.error(err);
          }
        );
      }
    });
  }

}
