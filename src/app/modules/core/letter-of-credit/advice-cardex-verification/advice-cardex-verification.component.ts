import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LcAdviceCardexVerification, partyNameDetails } from './../model/letter-of-credit';
import { LetterOfCreditDirectives } from './../directive/letter-of-credit-directive';
import { CommonWorkflowService } from '../../common/workflow-service/common-workflow.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/modules/services/common.service';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ModuleNames } from '../../common/constant/common-workflow.constants';
import { AdviceInwardSubmitComponent } from '../saved-advice/saved-advice.component';
import { LetterOfCreditService } from '../service/letter-of-credit.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as _ from 'lodash';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { SelectionModel } from '@angular/cdk/collections';
import { LcCommonWorkflowHistoryComponent } from '../lc-common-workflow-history/lc-common-workflow-history.component';
import { MESSAGES } from 'src/app/shared/constants/letter-of-credit/message-constants';
import { DateLocaleAndFormat } from 'src/app/shared/constants/constants/common/common-data.constants';

@Component({
  selector: 'app-advice-cardex-verification',
  templateUrl: './advice-cardex-verification.component.html',
  styleUrls: ['./advice-cardex-verification.component.css']
})

export class AdviceCardexVerificationComponent implements OnInit {

  // List of Employee to forward
  ForwardToList: any[] = [
  ];

  // Display Data for Advice Cardex Verificaiton Table

  // Data Column for Advice Cardex Verificaiton Table
  LcAdviceCardexVerificationDATAColumn: string[] = [
    'select', 'srno', 'virtualTokenNo', 'virtualTokenDate', 'adviceNo',
    'adviceDate', 'divisionCode', 'divisionName', 'cardexNo', 'ddoNO', 'partyName', 'adviceAmount',
    'totalDeduction', 'adviceNetAmount', 'ddoApproverName', 'sign', 'action' //Inwardfromdate  Inwardtodate 

  ];

  // List of LC Branch
  LcBranchList: any[] = [
    { value: '', viewValue: '' }
  ];

  // List of Sign Verify
  SignVerifyList: any[] = [
    { value: '1', viewValue: 'Yes' },
    { value: '2', viewValue: 'No' }
  ];

  // List of Division Code
  DivisionCodeList: any[] = [];

  // List of Division Names
  DivisionNameList: any[] = [];

  // List of Circle Names

  CircleNameList: any[] = [];

  // List of Circle Code
  CircleCodeList: any[] = [];
  workFlowData = 'fromLCAdviceCardexVerification';
  todayDate = new Date();
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
  selection = new SelectionModel<any>(true, []);

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

  lcAdviceCardexVerificationForm: FormGroup;
  DivisionCodeCtrl: FormControl = new FormControl();
  DivisionNameCtrl: FormControl = new FormControl();
  CircleCodeCtrl: FormControl = new FormControl();
  CircleNameCtrl: FormControl = new FormControl();
  ForwardToCtrl: FormControl = new FormControl();
  LCBranchCtrl: FormControl = new FormControl();
  SignVerifyCtrl: FormControl = new FormControl();
  dataSource = new MatTableDataSource<LcAdviceCardexVerification>([]);
  trnIdsBulk: string;
  public imgsrc: string = '';
  public fileName: string;

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

    this.lcAdviceCardexVerificationFormData();
    this.fillDropdownOfFilter();

  }

  // Form Fields Initialization
  lcAdviceCardexVerificationFormData() {
    this.lcAdviceCardexVerificationForm = this.fb.group({
      forwardTo: [''],
      cardexNo: [''],
      ddoNo: [''],
      referenceNo: [''],
      adviceNumber: [''],
      divisionCode: [''],
      divisionName: [''],
      circleCode: [''],
      circleName: [''],
      adviceFromDate: [''],
      adviceToDate: [''],
      adviceGrossAmount: [''],
      adviceNetAmount: [''],
      tokenNo: [''],
      virtualTokenDate: [''],
    });
  }
      /**
     * @description View Attachment
     * @param AttachmentModel item Object of Selcted File to Download
     */

  downloadAttachment(item) {
      const params = {
        documentDataKey: item.docFileKey,
        fileName: item.fileName
      };
    this.locService.getData(params,APIConst.LC_ADVICEPREPARATION.IMAGE_DOWNLOAD).subscribe(
        (res:any) => {
          console.log(res)
          if (res && res.status === 200) {
            const resultObj = res['result']['fileSrc'];
            const imgNameArray = item.fileName.split('.');
            const imgType = imgNameArray[imgNameArray.length - 1];
            this.imgsrc = 'data:image/' + imgType + ';base64,' + resultObj;
            item.imgsrc = 'data:image/' + imgType + ';base64,' + resultObj;

            console.log(this.imgsrc)
          }
        })
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
    this.locService.getDataWithoutParamsPost(APIConst.LC_ADVICEPREPARATION.CARDEX_VERIFICATION_DROP_DOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {

          if (resp.result.circleCodeList.length > 0) {
            this.CircleCodeList = _.orderBy(_.cloneDeep(resp.result.circleCodeList), 'circleCode', 'asc');

          }
          if (resp.result.circleNameList.length > 0) {
            this.CircleNameList = _.orderBy(_.cloneDeep(resp.result.circleNameList), 'circleName', 'asc');

          }
          if (resp.result.divCodeList.length > 0) {
            this.DivisionCodeList = _.orderBy(_.cloneDeep(resp.result.divCodeList), 'divCode', 'asc');

          }
          if (resp.result.divNameList.length > 0) {
            this.DivisionNameList = _.orderBy(_.cloneDeep(resp.result.divNameList), 'divName', 'asc');

          }

        }
      },
      err => {
        this.toastr.error(err);
      }
    );
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
      ['/dashboard/lc/lc-advice-preparation', { mode: 'edit', id: element.hdrId, status: element.trnStatus, isEditable: element.isEditable }],
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
  // view(element) {
  //   this.router.navigate(
  //     ['/dashboard/lc/lc-advice-preparation-view', {
  //       mode: 'view', id: element.hdrId, status: element.trnStatus,
  //       isEditable: element.isEditable, listingUrl: '/dashboard/lc/lc-advice-cardex-verification'
  //     }],
  //     { relativeTo: this.activatedRoute, skipLocationChange: true }
  //   );
  // }
  view(element) {
    this.router.navigate(
      ['/dashboard/lc/lc-advice-preparation-view',
        {
          mode: 'view', id: element.hdrId, status: element.trnStatus, isEditable: element.isEditable,
          listingUrl: '/dashboard/lc/lc-advice-cardex-verification', headingName: 'Advice Cardex Verificaion'
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
      this.locService.getData(passData, APIConst.LC_ADVICEPREPARATION.GET_CARDEX_VERIFICATION_LISTING).subscribe(
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
        this.lcAdviceCardexVerificationForm.value.referenceNo
        || this.lcAdviceCardexVerificationForm.value.adviceNumber
        || this.lcAdviceCardexVerificationForm.value.divisionName
        || this.lcAdviceCardexVerificationForm.value.divisionCode
        || this.lcAdviceCardexVerificationForm.value.circleCode
        || this.lcAdviceCardexVerificationForm.value.circleName
        || this.lcAdviceCardexVerificationForm.value.adviceFromDate
        || this.lcAdviceCardexVerificationForm.value.adviceToDate
        || this.lcAdviceCardexVerificationForm.value.adviceGrossAmount
        || this.lcAdviceCardexVerificationForm.value.adviceNetAmount
        || this.lcAdviceCardexVerificationForm.value.cardexNo
        || this.lcAdviceCardexVerificationForm.value.ddoNo
        || this.lcAdviceCardexVerificationForm.value.tokenNo
        || this.lcAdviceCardexVerificationForm.value.virtualTokenDate

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
        value: this.lcAdviceCardexVerificationForm.value.adviceNumber || ''
      },
      {
        key: 'tokenNo',
        value: this.lcAdviceCardexVerificationForm.value.tokenNo || 0
      },
      {
        key: 'adviceFromDate',
        value: datePipe.transform(this.lcAdviceCardexVerificationForm.value.adviceFromDate, DateLocaleAndFormat.Format.MMddyyyy) || ''


      },
      {
        key: 'adviceToDate',
        value: datePipe.transform(this.lcAdviceCardexVerificationForm.value.adviceToDate, DateLocaleAndFormat.Format.MMddyyyy) || ''

      },
      {
        key: 'adviceGrossFromAmt',
        value: this.lcAdviceCardexVerificationForm.value.adviceGrossAmount || 0
      },
      {
        key: 'adviceGrossToAmt',
        value: this.lcAdviceCardexVerificationForm.value.adviceNetAmount || 0
      },

      {
        key: 'refNo',
        value: this.lcAdviceCardexVerificationForm.value.referenceNo || ''
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
        key: "circleId",
        value:
          (this.lcAdviceCardexVerificationForm.value.circleCode) ? this.lcAdviceCardexVerificationForm.value.circleCode.circleId : 0
      },
      {
        key: "circleNameId",
        value: (this.lcAdviceCardexVerificationForm.value.circleName) ? this.lcAdviceCardexVerificationForm.value.circleName.circleId : 0
      },
      {
        key: "divisionId",
        value: (this.lcAdviceCardexVerificationForm.value.divisionCode) ? this.lcAdviceCardexVerificationForm.value.divisionCode.divId : 0
      },
      {
        key: "divisionNameId",
        value: (this.lcAdviceCardexVerificationForm.value.divisionName) ? this.lcAdviceCardexVerificationForm.value.divisionName.divId : 0

      },
      {
        key: "cardexNo",
        value: this.lcAdviceCardexVerificationForm.value.cardexNo || 0
      },
      {
        key: "ddoNo",
        value: this.lcAdviceCardexVerificationForm.value.ddoNo || 0
      },
      {
        key: "tokenDate",
        value: datePipe.transform(this.lcAdviceCardexVerificationForm.value.virtualTokenDate, DateLocaleAndFormat.Format.MMddyyyy) || ''

      }



    ];
    const adviceFromDate = this.lcAdviceCardexVerificationForm.value.adviceFromDate;
    const adviceToDate = this.lcAdviceCardexVerificationForm.value.adviceToDate;
    const adviceGrossFromAmount:number = this.lcAdviceCardexVerificationForm.controls['adviceGrossAmount'].value
    const adviceGrossToAmount:number =  this.lcAdviceCardexVerificationForm.controls['adviceNetAmount'].value

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
* Reset To Date field if Later From Date is selected after selecting To Date
*
*
* @memberOf AdviceCardexVerificationComponent
*/

  resetAdviceToDate() {
    this.config.dates.to.min = new Date(this.lcAdviceCardexVerificationForm.controls.adviceFromDate.value);
    this.lcAdviceCardexVerificationForm.controls.adviceToDate.setValue('');
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
    this.lcAdviceCardexVerificationForm.reset();
    this.lcAdviceCardexVerificationFormData()
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
    if (this.lcAdviceCardexVerificationForm.valid) {
      this.newSearch = true;

      this.pageIndex = 0;
      this.customPageIndex = 0;
      //this.paginator.pageIndex = 0;
      this.iteratablePageIndex = 0;
      this.getListData();
    } else {
      _.each(this.lcAdviceCardexVerificationForm.controls, function (ctrl: FormControl) {
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
  }/**
      * Call save api with submit request
      *
      * @memberof AdviceCardexVerificationComponent
      */

  adviceInwardSubmit(): void {

    let trnBulkIds: number[] = [];
    this.selection.selected.forEach((value: any) => {
      trnBulkIds.push(value.hdrId)
    })

    if (this.selection.selected.length > 0)
      this.openWfPopup(trnBulkIds)
    else {
      this.toastr.error('Please select Atleast One Record to Submit')
    }

  }
  /**
  * @description open work-flow popup
  */
  openWfPopup(trnBulkIds) {

    const headerJson = [];
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
    const dialogRef = this.dialog.open(AdviceInwardSubmitComponent, {
      width: '700px',
      height: '500px',
      data: {
        menuModuleName: 'loc',
        headingName: 'Advice Cardex Verificaion',
        headerJson: headerJson,
        trnId: trnBulkIds,
        moduleInfo: moduleInfo,
        refNo:// headerDetails.referanceNo ? headerDetails.referanceNo :
          '',
        refDate: //headerDetails.referanceDate ? headerDetails.referanceDate : 
          '',
        conditionUrl: '',
        isAttachmentTab: false, // for Attachment tab visible it should be true

      }
    });

    dialogRef.afterClosed().subscribe(wfData => {
      console.log(wfData)
      if (wfData.commonModelStatus === true) {
        this.searchList()
      }
    });
  }

  /**
     * @description function is called for checkbox toggling
     * add and remove row based on checkbox selection
     */
  masterToggle() {
    console.log(this.dataSource.data)
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((value: any) => {
          this.selection.select(value)
      })
  }

  /**
     * @description function is called for checkbox toggling
     * add and remove row based on checkbox selection/deselection
     */

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    else {
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} `;
    }
  }

  /**
    * @description function is called for checkbox toggling
    * add and remove row based on checkbox selection or either select All
    */

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /**
  * @description open work-flow popup
  */


  partyDetails(element) {
    if ((element.partyName).toLowerCase() === 'multiple') {
      const dialogRef = this.dialog.open(PartyNameListDialogComponent, {
        width: '500px',
        data: element.hdrId
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'no') {
          return result;
        }
      });
    }

  }

}



@Component({
  selector: 'app-partyListdetails-dialog',
  templateUrl: 'partyListdetails-dialog.html',
  styleUrls: ['./advice-cardex-verification.component.css']
})

export class PartyNameListDialogComponent {

  ELEMENT_DATA: partyNameDetails[] = [];
  partydataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
  userList: any[]

  constructor(private router: Router, public dialog: MatDialog,
    private fb: FormBuilder, public dialogRef: MatDialogRef<PartyNameListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService, private locService: LetterOfCreditService,) { }



  // tslint:disable-next-line: member-ordering
  displayedColumns: string[] = ['srno', 'label', 'value'];
  // tslint:disable-next-line: member-ordering
  actionForm: FormGroup;


  ngOnInit(): void {

    this.onclick()

  }

  onclick() {
    const param = {
      id: this.data
    }
    console.log(param);
    this.locService.getData(param, APIConst.LC_ADVICEPREPARATION.CARDEX_VERIFY_MULTIPLE_USER).subscribe((res: any) => {
      if (res && res.result && res.status === 200) {
        this.userList = _.cloneDeep(res.result.multipleList);
        this.partydataSource = new MatTableDataSource(this.userList)
      }
    })
  }


  columnTotal() {
    let amount = 0;
    this.partydataSource.data.forEach((element) => {
      amount = amount + Number(element.chqAmnt);
    });
    return amount;
  }



  goToDashboard(): void {
    this.dialogRef.close('no');
  }

}