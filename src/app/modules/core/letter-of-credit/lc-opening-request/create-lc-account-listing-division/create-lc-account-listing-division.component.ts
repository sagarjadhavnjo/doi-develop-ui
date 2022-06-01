import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { LcOpeningRequest, ListValue } from './../../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../../directive/letter-of-credit-directive';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonWorkflowService } from '../../../common/workflow-service/common-workflow.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { LetterOfCreditService } from '../../service/letter-of-credit.service';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { ModuleNames } from '../../../common/constant/common-workflow.constants';
import { DatePipe } from '@angular/common';
import { LcCommonWorkflowHistoryComponent } from '../../lc-common-workflow-history/lc-common-workflow-history.component';
import { DateLocaleAndFormat } from 'src/app/shared/constants/constants/common/common-data.constants';


@Component({
  selector: 'app-create-lc-account-listing-division',
  templateUrl: './create-lc-account-listing-division.component.html',
  styleUrls: ['./create-lc-account-listing-division.component.css']
})

export class CreateLcAccountListingDivisionComponent implements OnInit {



  /**
   * Configuration for this file
   *
   *
   * @memberOf LcAccountClosingRequestSavedComponent
   */


  pageSize = 0;
  pageIndex = 0;
  customPageIndex: number;
  iteratablePageIndex: number;
  userOffice = null;
  officeId: number;
  pageElements: number;
  pouId: number;
  receive_list: any[] = [
    { id: '1', name: 'Received' },
    { id: '2', name: 'Sent' }
  ];
  isToken: Boolean = false;
  receiveValue: string;



  // Table Columns of LC Account Listing AG
  LcOpeningRequestSavedDataColumn: string[] = [
    'srNo',
    'referenceNo',
    'referenceDate',
    'officeName',
    'cardexNo',
    'ddoCode',
    'receivedFrom',
    'receivedDate',
    'sentTo',
    'sentDate',
    'lyingWith',
    'workflowStatus',
    'status',
    'action'
  ];

  userName: any;
  currentUserData: any;
  userPostList: any;
  officeName: any;
  menuId: number;
  officeList = [];
  statusList = [];
  wfStatusList = [];
  newSearch: boolean = false;
  newSearchParam: number = 0;
  totalRecords: number = 0;
  sortBy: string = '';
  sortOrder: string = '';
  todayDate = new Date();
  workFlowData = 'fromLCAccountOpeningRequest';
  isSearch: boolean;
  DepartmentList: any[] = []
  distritList: any[] = []
  circleList: any[] = [];
  CircleCodeList: any[] = [];
  toLoginFlag: boolean = false;
  agLoginFlag: boolean = false;
  datLoginFlag :boolean = false;
  private paginator: MatPaginator;
  private sort: MatSort;
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
    * @memberOf CreateLcAccountListingDivisionComponent
    */
  storedData: any[] = [];


  /**
    *  Form group instance
    *
    * @type {FormGroup}
    * @memberOf CreateLcAccountListingDivisionComponent
    * 
    */

  accountClosingRequestForm: FormGroup;
  StatusCtrl: FormControl = new FormControl();
  officeNameCtrl: FormControl = new FormControl();
  workFlowStatusCtrl: FormControl = new FormControl();
  DepartmentCtrl: FormControl = new FormControl();
  distritCtrl: FormControl = new FormControl();
  circleCtrl: FormControl = new FormControl();
  CircleCodeCtrl: FormControl = new FormControl();

  /**
  * Mat table instance
  *
  * @type {MatTableDataSource<any>}
  * @memberOf CreateLcAccountListingDivisionComponent
  */
  dataSource = new MatTableDataSource([]);

  /**
   * Sort
   *
   * @type {MatSort}
   * @memberOf CreateLcAccountListingDivisionComponent
   */

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();

    /**
  * Paginator view child reference
  *
  * @type {MatPaginator}
  * @memberOf CreateLcAccountListingDivisionComponent
  */

  }
  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  /**
 * Creates an instance of CreateLcAccountListingDivisionComponent.
 * @param {FormBuilder} fb
 * @param {DepartmentRegistrationService} departmentRegistrationService
 * @param {ToastrService} toastr
 * @param {ReceiptManagementService} receiptManagementService
 * @param {CommonWorkflowService} commonWorkflowService
 * @param {MatDialog} dialog
 * @param {Router} router
 * @param {ActivatedRoute} activatedRoute
 *
 * @memberOf CreateLcAccountListingDivisionComponent
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
   * @memberOf CreateLcAccountListingDivisionComponent
   */

  ngOnInit() {
    this.userName = this.storageService.get('userName');
    console.log(this.userName)
    this.currentUserData = this.storageService.get('currentUser');
    this.userPostList = this.currentUserData['post'];
    this.userPostList = this.userPostList.filter(row => row.loginPost == true)
    const userPostList = _.head(this.userPostList)
    console.log(this.userPostList)
    if (userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'AG') {
      this.agLoginFlag = true;
    }
    if (userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].isTreasury == 2) {
      this.toLoginFlag = true;
    }
    else if (userPostList['oauthTokenPostDTO']['edpMsOfficeDto'].officeDivision == 'DAT') {
      this.datLoginFlag = true;
  }
    console.log(this.agLoginFlag, 'agflag', this.toLoginFlag, 'toflag')
    this.getCurrentUser();
    this.userOffice = this.storageService.get('userOffice');
    this.officeId = this.userOffice.officeId;
    this.menuId = this.commonService.getLinkMenuId();
    this.iteratablePageIndex = 0;
    this.customPageIndex = 0;
    this.iteratablePageIndex = 0;
    this.pageElements = 250;
    this.pageSize = 25;
    this.pageIndex = 0;
    this.fillDropdownOfFilter();

    this.accountClosingRequestFormData();
  }


  /**
* @description Method to set dataSource attributes paginator and sort
*/
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /***********************Life cycle hooks methods end***********************************/

  /***********************Public methods start***********************************/

  /**
  * Initialize formgroup
  *
  *
  * @memberOf CreateLcAccountListingDivisionComponent
  */

  accountClosingRequestFormData() {
    this.accountClosingRequestForm = this.fb.group({
      referenceNumber: [''],
      referenceFromDate: [''],
      referenceToDate: [''],
      status: [''],
      workflowStatus: [''],
      lyingWith: [''],
      officeName: [''],
      receiveFromDate: [''],
      receiveToDate: [''],
      sentFromDate: [''],
      sentToDate: [''],
      circleName: [''],
      circleCode: [''],
      department: [''],
      district: [''],
      cardexNumber: [''],
      ddoNo: [''],

    });

  }


  /**
   * Reset To Date field if Later From Date is selected after selecting To Date
   *
   *
   * @memberOf LcAccountClosingRequestSavedComponent
   */
  resetToDate() {
    this.config.dates.to.min = new Date(this.accountClosingRequestForm.controls.referenceFromDate.value);
    this.accountClosingRequestForm.controls.referenceToDate.setValue('');
  }

  resetReceiveToDate() {
    this.config.dates.to.min = new Date(this.accountClosingRequestForm.controls.receiveFromDate.value);
    this.accountClosingRequestForm.controls.receiveToDate.setValue('');
  }

  resetSentToDate() {
    this.config.dates.to.min = new Date(this.accountClosingRequestForm.controls.sentFromDate.value);
    this.accountClosingRequestForm.controls.sentToDate.setValue('');
  }

  /**
    * on Edit Comments Click
    *
    * @param {any} element
    *
    * @memberOf CreateLcAccountListingDivisionComponent
    */
  edit(element) {
    this.router.navigate(
      ['/dashboard/lc/create-lc-account-division', { mode: 'edit', id: element.hdrId, status: element.status, isEditable: element.isEditable }],
      { relativeTo: this.activatedRoute, skipLocationChange: true }
    );
  }

  /**
     * on View Comments Click
     *
     * @param {any} element
     *
     * @memberOf CreateLcAccountListingDivisionComponent
     */


  view(element) {
    this.router.navigate(
      ['/dashboard/lc/create-lc-account-division', { mode: 'view', id: element.hdrId, status: element.status, isEditable: element.isEditable }],
      { relativeTo: this.activatedRoute, skipLocationChange: true }
    );
  }

  /**
   * @description  Method to delete row
   */
  delete(index) {
    this.dataSource.data.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }



  /**
   * @description For get user details
   */
  getCurrentUser() {
    this.workflowService.getCurrentUserDetail().then((res: any) => {
      console.log(res, 'currentuserdetails')
      this.pouId = res.lkPOUId;
    });
  }



  /**
  * @description Filling Dropdown List of Major Head, Financial Year, Status
  */
  fillDropdownOfFilter() {
    this.locService.getDropDownListForSearch({}).subscribe(
      (resp: any) => {
        console.log(resp, 'listing params')
        if (resp && resp.result && resp.status === 200) {

          this.CircleCodeList = _.orderBy(_.cloneDeep(resp.result.circleCodeList), 'circleCode', 'asc');
          this.circleList = _.orderBy(_.cloneDeep(resp.result.circleNameList), 'circleName', 'asc');
          this.DepartmentList = _.orderBy(_.cloneDeep(resp.result.deptList), 'deptName', 'asc');
          this.distritList = _.orderBy(_.cloneDeep(resp.result.districtList), 'districtName', 'asc');
          this.officeList = _.orderBy(_.cloneDeep(resp.result.officeList), 'officeName', 'asc');
          if (resp.result.statusList) {
            this.statusList = _.orderBy(_.cloneDeep(resp.result.statusList), 'statusName', 'asc');
          }
          if (resp.result.wfList) {
            this.wfStatusList = _.orderBy(_.cloneDeep(resp.result.wfList), 'wfName', 'asc');
          }
          this.getListData();
          this.dataSource.sort = this.sort;
        }
      },
      err => {
        this.toastr.error(err);
      }
    );
  }



  /**
   * @description Getting The Table Data
   */
  getListData(event: any = null) {
    const searchData = this.getFilterParams();

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
      this.locService.getTableList(passData).subscribe(
        (res: any) => {
          console.log(passData, 'input params for listing api')
          console.log(res, 'result of search')
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
        }
      );
    }
  }

  /**
    * @description Getting Filtered Data From Backend for Table
    */
  getFilterParams() {
    if (this.newSearch

      && (
        this.accountClosingRequestForm.value.referenceNumber
        || this.accountClosingRequestForm.value.referenceFromDate
        || this.accountClosingRequestForm.value.referenceToDate
        || this.accountClosingRequestForm.value.lyingWith
        || this.accountClosingRequestForm.value.officeName
        || this.accountClosingRequestForm.value.status
        || this.accountClosingRequestForm.value.workflowStatus
        || this.accountClosingRequestForm.value.receiveFromDate
        || this.accountClosingRequestForm.value.receiveToDate
        || this.accountClosingRequestForm.value.sentFromDate
        || this.accountClosingRequestForm.value.sentToDate
        || this.accountClosingRequestForm.value.department
        || this.accountClosingRequestForm.value.district
        || this.accountClosingRequestForm.value.cardexNumber
        || this.accountClosingRequestForm.value.ddoNo
        || this.accountClosingRequestForm.value.circleCode
        || this.accountClosingRequestForm.value.circleName


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
        key: 'refFromDate',
        value: datePipe.transform(this.accountClosingRequestForm.value.referenceFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: 'refToDate',
        value: datePipe.transform(this.accountClosingRequestForm.value.referenceToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: 'recFromDate',
        value: datePipe.transform(this.accountClosingRequestForm.value.receiveFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: 'recToDate',
        value: datePipe.transform(this.accountClosingRequestForm.value.receiveToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: 'sentFromDate',
        value: datePipe.transform(this.accountClosingRequestForm.value.sentFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },
      {
        key: 'sentToDate',
        value: datePipe.transform(this.accountClosingRequestForm.value.sentToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''
      },

      {
        key: 'circleNameId',
        value: this.accountClosingRequestForm.value.circleName || 0
      },
      {
        key: 'circleId',
        value: this.accountClosingRequestForm.value.circleCode || 0
      },
      {
        key: 'cardexNo',
        value: this.accountClosingRequestForm.value.cardexNumber || 0
      },
      {
        key: 'ddoNo',
        value: this.accountClosingRequestForm.value.ddoNo || 0
      },
      {
        key: 'deptId',
        value: this.accountClosingRequestForm.value.department || 0
      },

      {
        key: 'districtId',
        value: this.accountClosingRequestForm.value.district || 0
      },

      {
        key: 'refNo',
        value: this.accountClosingRequestForm.value.referenceNumber || ''
      },
      {
        key: 'lyingWith',
        value: this.accountClosingRequestForm.value.lyingWith || ''
      },
      {
        key: 'wfStatus',
        value: this.accountClosingRequestForm.value.workflowStatus || ''
      },
      {
        key: 'status',
        value: this.accountClosingRequestForm.value.status || ''
      },
      {
        key: 'officeNameId',
        value: this.accountClosingRequestForm.value.officeName || 0
      },
      {
        key: 'pouId',
        value: Number(this.pouId)
      },
      {
        key: 'menuId',
        value: Number(this.menuId)
      },
    ];

    const referenceFromDate = this.accountClosingRequestForm.value.referenceFromDate;
    const referenceToDate = this.accountClosingRequestForm.value.referenceToDate;
    const receiveFromDate = this.accountClosingRequestForm.value.receiveFromDate;
    const receiveToDate = this.accountClosingRequestForm.value.receiveToDate;
    const sentFromDate = this.accountClosingRequestForm.value.sentFromDate;
    const sentToDate = this.accountClosingRequestForm.value.sentToDate;


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
    this.accountClosingRequestForm.reset();
    this.accountClosingRequestFormData()
    this.newSearch = true;
    this.pageIndex = 0;
    this.customPageIndex = 0;
    this.paginator.pageIndex = 0;
    this.iteratablePageIndex = 0;
    this.getListData(null);
  }


  /**
   * @description For Search Parameter
   */
  searchList() {
    if (this.accountClosingRequestForm.valid) {
      this.newSearch = true;

      this.pageIndex = 0;
      this.customPageIndex = 0;
      this.paginator.pageIndex = 0;
      this.iteratablePageIndex = 0;
      this.getListData();
    } else {
      _.each(this.accountClosingRequestForm.controls, function (ctrl: FormControl) {
        if (ctrl.status === 'INVALID') {
          ctrl.markAsTouched();
        }
      });
    }
  }
  /**
    * @description Function called for Received/Sent to dropdown
    * @param index used for getting  the particular value
    */
  onrecevietoken(index) {
    //this.isToken = true; // true when show filter
    for (const item of this.receive_list) {
      if (item.id === index.value) {
        this.receiveValue = item.name;
      }
    }



  }

  /**
    * @description For Deleting The Entry From Table
    * @param element Table row
    * @param number index Value
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
        this.locService.deleteHdrDetails(param).subscribe(
          (resp: any) => {
            if (resp && resp.status === 200) {
              this.toastr.success(resp.message);

              this.newSearch = true;
              this.pageIndex = 0;
              this.customPageIndex = 0;
              this.paginator.pageIndex = 0;
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


  /**
   *  View Comments
   * @param element 
   */
  viewComments(element) {
    const param = {
      id: element.hdrId
    };
    this.locService.getSubmitActionDetails(param).subscribe(
      (resp: any) => {
        if (resp && resp.status === 200) {
          const headerDetails = _.cloneDeep(resp.result);
          const headerJson = [
            { label: 'Office Name', value: headerDetails.officeName },
            { label: 'Office Address', value: headerDetails.divisionOfficeAddress },
            { label: 'Administrative Department', value: headerDetails.departmentName },
            { label: 'Head Of Department', value: headerDetails.hodOfficeName },
            { label: 'Treasury Office', value: headerDetails.toOfficeName },
            { label: 'District', value: headerDetails.districtName },
            { label: 'Cardex No', value: headerDetails.cardexNo },
            { label: 'DDO No', value: headerDetails.ddoNo },
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
              headingName: 'LC Account Opening Request',
              headerJson: headerJson,
              moduleInfo: moduleInfo,
              trnId: element.hdrId,
              refNo: headerDetails.trnRefNo ? headerDetails.trnRefNo : '',
              refDate: headerDetails.trnRefDate ? headerDetails.trnRefDate : '',
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

}
