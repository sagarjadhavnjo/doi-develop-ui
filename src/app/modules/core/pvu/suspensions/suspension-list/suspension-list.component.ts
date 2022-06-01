import { SuspensionService } from './../services/suspension.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import * as _ from 'lodash';
import { PvuCommonService } from '../../pvu-common/services/pvu-common.service';
import { pvuMessage} from 'src/app/shared/constants/pvu/pvu-message.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-suspension-list',
  templateUrl: './suspension-list.component.html',
  styleUrls: ['./suspension-list.component.css']
})
export class SuspensionListComponent implements OnInit {

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
  loggedUserObj;
  officeId;
  officeTypeId;
  displayedColumnsFooter: string[] = ['position'];
  errorMessages = pvuMessage;
  date = new Date();

  displayedColumns: string[] = ['position', 'transNo', 'empNo', 'empName', 'employeeClass',
    'designation', 'officeName', 'payCommission',
    'startDate', 'reasonForSus', 'status', 'workflowStatus', 'action'];

  searchListForm: FormGroup;

  pay_commission_list;
  sus_reason_list;
  workflow_list;

  payCommissionCtrl: FormControl = new FormControl();
  reasonCtrl: FormControl = new FormControl();
  statusCtrl: FormControl = new FormControl();

  _onDestroy = new Subject<void>();

  dataSource = new MatTableDataSource(['noData']);

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private suspensionService: SuspensionService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private datepipe: DatePipe,
    private pvuCommonService: PvuCommonService
  ) { }

  ngOnInit() {
    this.getLookUpInfo();
    this.paginationArray = DataConst.PAGINATION_ARRAY;
    this.pageSize = 25;
    this.searchListForm = this.fb.group({
      transNo: [''],
      empName: [''],
      endDate: [''],
      startDate: [''],
      payCommission: [''],
      empNo: [''],
      wfStatus: [''],
      reasonForSus: ['']

    });
    this.pvuCommonService.getCurrentUserMultipleRoleDetail().then(res => {
      if (res) {
        this.loggedUserObj = res;
        if (res['officeDetail']) {
          this.officeId = +res['officeDetail']['officeId'];
        }
        this.getData();
        this.getWorkflowStatus();
      }
    });
    // this.getData();
  }

  /**
   * @description Method to set workflow dropdown values through service
   */
  getWorkflowStatus() {
    const param = {
      id: this.loggedUserObj['menuId']
    };
    this.suspensionService.getWorkFlowStatus(param).subscribe((res) => {
      if (res && res['result'] && res['result'].length > 0) {
        this.workflow_list = res['result'];
      }
    });
  }

  /**
   * @description Method to get lookup data through service and set dropdown list
   */
  getLookUpInfo() {
    this.suspensionService.getLookUpInfoData().subscribe((res) => {
      if (res && res['status'] === 200) {
        this.pay_commission_list = res['result']['Dept_Pay_Commission'];
        this.sus_reason_list = res['result']['ReasonForSuspension'];
      }
    });
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
      this.suspensionService.getSuspensionList(passData).subscribe((res) => {
        self.newSearch = false;
        if (res && res['status'] === 200) {
          // For customize pagination
          self.storedData = _.cloneDeep(res['result']['result']);
          if (self.storedData) {
            let date;
            self.storedData.forEach((el) => {
              if (el.startDate) {
                if (el.startDate.indexOf(' ') !== -1) {
                  date = el.startDate.split(' ')[0].split('-');
                  el.startDate = new Date(date[0], Number(date[1]) - 1, date[2]);
                } else if (el.startDate.indexOf('T') !== -1) {
                  date = el.startDate.split('T')[0].split('-');
                  el.startDate = new Date(date[0], Number(date[1]) - 1, date[2]);
                }
              }
            });
          }
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
   * @description Method to modify date format
   * @param date date to be formatted
   * @returns date in date string format
   */
  convertDateFormat(date) {
    if (date !== '' && date !== undefined && date != null) {
      date = new Date(date);
      return this.datepipe.transform(date, 'MM-dd-yyyy');
    }
    return '';
  }

  /**
   * @description Method to set search parameters from form
   */

  getSearchFilter() {
    const obj = this.searchListForm.value;

    if (!obj.empNo && !obj.empName && !obj.payCommission && !obj.endDate
      && !obj.startDate && !obj.transNo && !obj.wfStatus && !obj.reasonForSus) {
      this.isSearch = 0;
    }
    const returnArray = [];
    const searchObj = {};
    searchObj['key'] = 'isSearch';
    searchObj['value'] = this.isSearch;
    returnArray.push(searchObj);

    // tslint:disable-next-line: forin
    for (const key in obj) {
      const currObj = {};
      currObj['key'] = key;
      if (key === 'startDate' || key === 'endDate' || key === 'transNo' || key === 'empName' || key === 'wfStatus') {
        if (key === 'startDate' || key === 'endDate') {
          currObj['value'] = '' + (this.convertDateFormat(obj[key]) || '');
          returnArray.push(currObj);
        } else {
          currObj['value'] = '' + (obj[key] || '');
          returnArray.push(currObj);
        }
      } else {
        currObj['value'] = (Number(obj[key]) || 0);
        returnArray.push(currObj);
      }
    }
    returnArray.push({ 'key': 'postId', 'value': this.loggedUserObj['postId'] });
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

  /**
   * @description Method to set dataSource attributes paginator and sort
   */
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * @description Method invoked on reset button click to reset search form
   */
  clearForm() {
    this.searchListForm.reset();
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
        this.suspensionService.deleteSuspension({ 'id': id, 'activeStatus': 0 }).subscribe((res) => {
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
