import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { PvuCommonService } from './../../pvu-common/services/pvu-common.service';
import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { Router, ActivatedRoute } from '@angular/router';
import { TransferService } from '../services/transfer.service';
import { ValidationService } from 'src/app/modules/services/validatation.service';
import { ViewCommentsComponent } from '../../pvu-common/view-comments/view-comments.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.css']
})
export class TransferListComponent implements OnInit {

  totalRecords: number = 0;
  paginationArray;
  sortBy = '';
  sortOrder = '';
  pageSize = 0;
  pageIndex = 0;
  isSearch = 1;
  pageEvent: Object;
  storedData = [];
  indexedItem = 0;
  customPageIndex = 0;
  iteratablePageIndex = 0;
  pageElements = DataConst.PAGE_ELEMENT;
  disableSearchValue = true;
  newSearch = false;
  officeTypeId: string;
  loggedUserObj;
  officeId: number;
  minDate: Date;
  date = new Date();
  errorMessages = pvuMessage;

  displayedColumnsFooter: string[] = ['position'];
  displayedColumns: string[] = ['position', 'transNo', 'empNumber', 'empName',
    'empDesignation', 'officeName', 'relivingDate', 'status', 'workflowStatus', 'action'];
  dataSource = new MatTableDataSource([]);

  designationList: string[] = [];
  districtList: string[] = [];
  officeDetailCardex = [];
  officeDetailDDO = [];
  workflowList;

  searchForm: FormGroup;
  private paginator: MatPaginator;
  private sort: MatSort;

  designationCtrl: FormControl = new FormControl;
  districtCtrl: FormControl = new FormControl;
  cardexNoCtrl: FormControl = new FormControl;
  ddoNoCtrl: FormControl = new FormControl;
  statusCtrl: FormControl = new FormControl;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private transferService: TransferService,
    private toastr: ToastrService,
    private pvuCommonService: PvuCommonService,
    private datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  /**
 * @description Method to set dataSource attributes paginator and sort
 */
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  ngOnInit() {
    this.paginationArray = DataConst.PAGINATION_ARRAY;
    this.pageSize = 25;

    this.searchForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      transNo: [''],
      empNo: [''],
      empName: [''],
      designationId: [''],
      gpfNo: [''],
      cpfNo: [''],
      panNo: ['', ValidationService.panCardValidation],
      districtId: [''],
      cardexNo: [''],
      ddoCode: [''],
      wfStatus: [''],
    });
    this.pvuCommonService.getCurrentUserDetail().then(res => {
      if (res) {
        this.loggedUserObj = res;
        if (res['officeDetail']) {
          this.officeId = +res['officeDetail']['officeId'];
        }
        this.getData();
      }
    });
    this.transferService.getDistrictDesg().subscribe(data => {
      if (data && data['result'] && data != null) {
        this.districtList = data['result']['district'];
        this.designationList = data['result']['designation'];
      }
    }, (err) => {
      this.toastr.error(err);
    });
    this.transferService.getLookupData().subscribe((res) => {
      if (res && res['result'] && res !== null) {
        this.workflowList = res['result']['Transfer_WF_Status'].concat(res['result']['Status_id']);
      }
    });
  }

  /**
   * To check, district is selected or not?
   */
  isDistrictSelected() {
      if (!this.searchForm.get('districtId').value) {
          this.toastr.error('Please Select District');
          this.officeDetailCardex = [];
          this.officeDetailDDO = [];
          // this.officeNameList = [];
      }
  }

  /**
   * @description To set min Date validation for Created To Date field
   * @param event date selected
   */
  onFromDateSelect(eventVal) {
    this.minDate = eventVal;
  }

  /**
  * @description Fetch Cardex No based on selected district
  * @param eventVal district value selected
  */
  getCardexNoByDistrict(eventVal) {
    const param = {
      'id': eventVal
    };
    this.searchForm.patchValue({
      'cardexNo': '',
      'ddoCode': '',
    });
    this.transferService.getOfficeByDistrictID(param).subscribe(data => {
      if (data && data['result'] && data['result'].length > 0) {
        this.officeDetailCardex = _.orderBy(_.cloneDeep(data['result']), 'cardexno', 'asc');
      } else {
        this.toastr.error(data['message']);
        this.officeDetailCardex = [];
      }
    });
  }

  /**
   * @description Fetch DDO No based on Cardex No selection
   * @param eventVal Cardex No value selected
   */
  getDDONo(eventVal) {
    this.searchForm.patchValue({
      'ddoCode': '',
    });
    const selectedOffice = this.officeDetailCardex.
      filter((item) => item['cardexno'] === eventVal);
    this.officeDetailDDO = selectedOffice;
  }

  /**
   * @description Method to fetch table data based on search parameters through service and set dataSource
   * @param event event
   */
  getData(event = null) {
    const passData = {
      pageIndex: this.customPageIndex,
      pageElement: this.pageElements,
      jsonArr: this.getSearchFilter()
    },
      self = this;

    // tslint:disable-next-line:max-line-length
    if (!this.newSearch && this.storedData.length !== 0 && (this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize))) { // If data already fetched
      // tslint:disable-next-line:max-line-length
      this.dataSource = new MatTableDataSource(
        this.storedData.slice(
          this.iteratablePageIndex * this.pageSize,
          this.iteratablePageIndex * this.pageSize + this.pageSize));
    } else { // If data needs to fetch from database.
      this.transferService.getTransferList(passData).subscribe((res) => {
        self.newSearch = false;
        if (res && res['status'] === 200) {
          // For customize pagination
          self.storedData = _.cloneDeep(res['result']['result']);
          // tslint:disable-next-line:max-line-length
          if (event != null && event.pageIndex < event.previousPageIndex && (self.iteratablePageIndex - 1) === (Math.ceil(self.pageElements / self.pageSize))) {
            self.iteratablePageIndex = Math.ceil((self.pageElements / self.pageSize)) - 1;
            /*
              below if Condition is to handle button of 'Go First Page'
              Reset iteratablePageIndex to 0
            */
            if (event !== null && event.previousPageIndex > event.pageIndex
              && (event.previousPageIndex - event.pageIndex) > 1) {
              self.iteratablePageIndex = 0;
            }
          } else if (event != null && event.pageIndex > event.previousPageIndex
            && (event.pageIndex - event.previousPageIndex) > 1) {
            /**
             * else if conditin to handle button of 'Go Last Page'
             * reset iteratablePageIndex to last pageIndex of particular pageSet
            */
            self.iteratablePageIndex = Math.ceil((self.storedData.length / self.pageSize)) - 1;
          } else {
            self.iteratablePageIndex = 0;
          }

          // tslint:disable-next-line:max-line-length
          self.dataSource = new MatTableDataSource(
            self.storedData.slice(
              self.iteratablePageIndex * self.pageSize,
              self.iteratablePageIndex * self.pageSize + self.pageSize));
          self.totalRecords = res['result']['totalElement'];
          self.dataSource.sort = self.sort;
        } else {
          self.storedData = [];
          // tslint:disable-next-line:max-line-length
          self.dataSource = new MatTableDataSource(self.storedData);
          self.toastr.error(res['message']);
          self.totalRecords = 0;
          self.pageIndex = 0;
          self.customPageIndex = 0;
          self.iteratablePageIndex = 0;
          self.dataSource.sort = self.sort;
        }
      }, (err) => {
        self.toastr.error(err['message']);
        self.totalRecords = 0;
        self.pageIndex = 0;
        self.customPageIndex = 0;
        self.iteratablePageIndex = 0;
        self.dataSource = new MatTableDataSource([]);
      });
    }
  }

  /**
   * @description Method to set search parameters from form
   */
  getSearchFilter() {
    const obj = this.searchForm.value;

    if (!obj.fromDate && !obj.toDate && !obj.transNo && !obj.empNo &&
      !obj.empName && !obj.designation && !obj.gpfNo && !obj.cpfNo && !obj.panNo &&
      !obj.district && !obj.cardexNo && !obj.ddoNo && !obj.wfStatus) {
      this.isSearch = 0;
    }
    const returnArray = [];
    const searchObj = {};
    searchObj['key'] = 'isSearch';
    searchObj['value'] = this.isSearch;
    returnArray.push(searchObj);

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const currObj = {};
        currObj['key'] = key;
        if (key === 'fromDate' || key === 'toDate' || key === 'transNo' || key === 'empName'
          || key === 'gpfNo' || key === 'cpfNo' || key === 'panNo' || key === 'wfStatus'
          || key === 'ddoCode' || key === 'cardexNo') {
          if (key === 'fromDate' || key === 'toDate') {
            currObj['value'] = '' + (this.convertDateFormat(obj[key]) || '');
            returnArray.push(currObj);
          } else {
            currObj['value'] = '' + (obj[key] || '');
            returnArray.push(currObj);
          }
        } else {
          currObj['value'] = (obj[key] || 0);
          returnArray.push(currObj);
        }
      }
    }
    returnArray.push({ 'key': 'menuId', 'value': this.loggedUserObj['menuId'] });
    returnArray.push({ 'key': 'officeId', 'value': this.loggedUserObj['officeDetail']['officeId'] });
    returnArray.push({ 'key': 'lkPoOffUserId', 'value': this.loggedUserObj['lkPOUId'] });
    returnArray.push(
      {
        'key': 'wfRoleIds',
        'value': this.loggedUserObj['wfRoleId'] ? this.loggedUserObj['wfRoleId'].toString() : ''
      });
    return returnArray;
  }

  /**
   * @description Method to modify date format
   * @param date date to be formatted
   * @returns date in date string format
   */
  convertDateFormat(date) {
    if (date !== '' && date !== undefined && date != null) {
      date = new Date(date);
      return this.datepipe.transform(date, 'MM/dd/yyyy');
    }
    return '';
  }

  /**
   * @description Method invoked on search button click event
   */
  onSubmitSearch() {
    this.newSearch = true;
    this.pageIndex = 0;
    this.customPageIndex = 0;
    this.paginator.pageIndex = 0;
    this.iteratablePageIndex = 0;
    this.isSearch = 1;
    this.getData();
  }

  /**
  * @description Method invoked on changing pagination to set next data set
  * @param event event
  */
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // Calculate pageIndex so we can fetched next data set wheneve current iteration will complete.
    this.customPageIndex = Math.floor((this.pageIndex) / Math.ceil((this.pageElements / this.pageSize)));
    // Increase iteratablePageIndex by 1.
    if (event.pageIndex < event.previousPageIndex) {// For handle previous page or back button
      this.iteratablePageIndex = this.iteratablePageIndex - 1;
      /**
      * check if iteratableIndex is in negative number, or going to First Page via Go First Page button
      * if condition matched, set iteratablePageIndex to highest page index of particular pageElement.
      * So getData method can load the newer data of pageIndex 0.
     */
      if (this.iteratablePageIndex < 0 || (event.previousPageIndex - event.pageIndex) > 1) {
        this.iteratablePageIndex = Math.ceil((this.pageElements / this.pageSize)) + 1;
      }
    } else if (event.pageIndex === event.previousPageIndex) {
      this.iteratablePageIndex = 0;
    } else if (event.pageIndex > event.previousPageIndex && (event.pageIndex - event.previousPageIndex) > 1) {
      this.iteratablePageIndex = event.pageIndex;
    } else {
      this.iteratablePageIndex = this.iteratablePageIndex + 1;
    }
    this.getData(event);
  }

  onSortColumn() {
    this.sortBy = this.sort.active;
    this.sortOrder = this.sort.direction;
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    this.getData();
  }

  /**
   * @description Method invoked on Edit button click which navigates to Suspension page
   * @param id id of the Suspension event
   */
  onEdit(id) {
    this.router.navigate(['./', 'edit', id], { relativeTo: this.route, skipLocationChange: true });
  }

  /**
   * @description Method invoked on View button click which navigates to Suspension page
   * @param id id of the Suspension event
   */
  onView(id) {
    this.router.navigate(['./', 'view', id], { relativeTo: this.route, skipLocationChange: true });
  }

  /**
  * @description Method invoked on reset button click to reset search form
  */
  clearForm() {
    this.searchForm.reset();
    this.dataSource = new MatTableDataSource([]);
    this.newSearch = true;
    this.pageIndex = 0;
    this.customPageIndex = 0;
    this.paginator.pageIndex = 0;
    this.iteratablePageIndex = 0;
    this.isSearch = 1;
    this.indexedItem = 0;
    this.iteratablePageIndex = 0;
    this.totalRecords = 0;
  }

  /**
  * @description Method to open ViewComments Dialog
  */
  viewComments(el) {
    this.dialog.open(ViewCommentsComponent, {
      width: '2700px',
      height: '600px',
      data: {
        'empId': el.empId,
        'trnId': el.transId,
        'event': 'TRANSFER',
        'trnNo': el.transNo,
        'initiationDate': el.createdDate
      }
    });
  }

  /**
  * @description Method invoked on delete button click which deletes Saved as Draft Record
  * @param id id of the Suspension event
  */
  onDelete(id) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: pvuMessage.DELETE
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.transferService.deleteTransfer({ 'id': id, 'activeStatus': 0 }).subscribe((res) => {
          if (res && res['status'] === 200) {
            this.toastr.success(res['message']);
            this.newSearch = true;
            this.getData();
          }
        }, (err) => {
          this.toastr.error(err);
        });
      }
    });
  }
}
