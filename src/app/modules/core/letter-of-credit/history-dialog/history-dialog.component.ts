import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { LetterOfCreditService } from '../service/letter-of-credit.service';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';



@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  styleUrls: ['./history-dialog.component.css']
})
export class HistoryDialogComponent implements OnInit {
  header = '';
  historyDataSource = new MatTableDataSource([]);
  historyColumns: string[] = [];
  viewHisoryApi: any;
  pageEvent: any;
  noRecords: any;
  arr: any;
  newSearch: boolean = false;
  flag: boolean = true;
  isSearch: number = 0;
  storedData: any[] = [];
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

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private locService: LetterOfCreditService, private toastr: ToastrService, public dialogRef: MatDialogRef<HistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit() {
    console.log(this.data)
    this.arr=this.data.split(":")
    console.log(this.arr[0],'name',this.arr[1],'hdrid')

    this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
    this.paginationArray = DataConst.PAGINATION_ARRAY;
    // this.errorMessages = msgConst;
    this.iteratablePageIndex = 0;
    this.indexedItem = 0;
    this.customPageIndex = 0;
    this.pageElements = 250;
    this.pageSize = 25;
    this.pageIndex = 0;
    this.historyDataSource.sort = this.sort;
 
    if (this.arr[0] === 'forLCAccountOpeningRequest') {
      this.historyColumns = [
        'srNo',
        'empNo',
        'userName',
        'userRole',
        'designation',
        'divName',
        'circleName',
        'circleCode',
        'dateAndTime',
        'remarks',
      ];
      this.header = 'LC Account Opening Request';
      this.viewHisoryApi = APIConst.LC_OPENING_REQUEST.GET_OPENING_REQUEST_VIEW
      this.setPaginationValues()

    } else if (this.arr[0] === 'forAGOffice') {
      this.historyColumns = [
        'srNo',
        'empNo',
        'userName',
        'userRole',
        'designation',
        'agAuthorizationNo',
        'agAuthorizationDate',
        'majorHead',
        'subMajorHead',
        'minorHead',
        'subHead',
        'detailedHead',
        'dateAndTime',
        'agRemarks',
      ];
      this.header = ' for AG Office Details';
      this.viewHisoryApi = APIConst.LC_OPENING_REQUEST.GET_OPENING_REQUEST_AG_VIEW
      this.setPaginationValues()
    } else if (this.arr[0] === 'forBankDetails') {
      this.historyColumns = [
        'srNo',
        'empNo',
        'userName',
        'userRole',
        'designation',
        'bankName',
        'bankBranch',
        'bankCode',
        'dateAndTime',
        'bankRemarks',
      ];
      this.header = 'Bank Details';
      this.viewHisoryApi = APIConst.LC_OPENING_REQUEST.GET_OPENING_REQUEST_BANK_VIEW
      this.setPaginationValues()

    } else if (this.arr[0] === 'forDivisionOffice') {
      this.historyColumns = [
        'srNo',
        'empNo',
        'userName',
        'userRole',
        'designation',
        'divisionCode',
        'dateAndTime',
        'divRemarks',
      ];
      this.header = 'Details For Division Office';
      this.viewHisoryApi = APIConst.LC_OPENING_REQUEST.GET_OPENING_REQUEST_DIVISION_VIEW
      this.setPaginationValues()

    }else if (this.arr[0] === 'LcClosingRequest') {
      this.historyColumns = [
        'srNo',
        'empNumber',
        'userName',
        'wfRoleName',
        'designatinName',
        'closingDate',
        'updatedDate',
        'clsRemarks',
      ];
  
    this.header = 'LC Account Closing Details';
    this.viewHisoryApi = APIConst.LC_CLOSEREQUEST.VIEW_HISTORY
    this.setPaginationValues()
    
  }
    else {
      this.historyColumns = [
        'srNo',
        'empNo',
        'userName',
        'userRole',
        'designation',
        'divName',
        'circleName',
        'circleCode',
        'dateAndTime',
        'remarks',
      ];
      this.header = 'LC Account Opening Request';
      this.viewHisoryApi = APIConst.LC_OPENING_REQUEST.GET_OPENING_REQUEST_VIEW
      this.setPaginationValues()

    }
  }
  setDataSourceAttributes() {
    this.historyDataSource.paginator = this.paginator;
    this.historyDataSource.sort = this.sort;
  }
  
      /** * @description Method  is to set pagination values and trigger grant order list  */

      setPaginationValues() {
        console.log('setpagination values method')
        //this.storedData=[];
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;
        //this.storedData= []; 
    console.log('no error with the pagination.pageindex')
        this.getViewHistoryList();
      
      }
    
  /** * @description Method  is to fetch data from backend  */
  getViewHistoryList(event: any = null) {

    const passData = {
      pageIndex: this.customPageIndex,
      pageElement: this.pageElements,
      jsonArr: [
        {
          "key": "hdrId",
          "value": this.arr[1]
        }
      ],
    },

      self = this;

    // tslint:disable-next-line:max-line-length 
    if (
      !this.newSearch &&
      this.storedData.length !== 0 &&
      this.iteratablePageIndex + 1 <= Math.ceil(this.pageElements / this.pageSize)
    ) {
      // If data already fetched 
      // tslint:disable-next-line:max-line-length 
      this.historyDataSource = new MatTableDataSource(
        this.storedData.slice(
          this.iteratablePageIndex * this.pageSize,
          this.iteratablePageIndex * this.pageSize + this.pageSize

        )
      );
      this.historyDataSource.sort = this.sort;

    } else {
      // If data needs to fetch from database. 
    //  this.getCurrentUserDetail();
      console.log(passData);
      this.locService.getData(passData, this.viewHisoryApi).subscribe(
        res => {
          console.log(res)
          self.newSearch = false;
          if (res && res['status'] === 200) {
            // For customize pagination 
            // res['result']['result'].forEach(value => {
            //   if (value.trnStatus == 'Approved')
            //     value.lyingWith = '';
            // });
            self.storedData = _.cloneDeep(res['result']['result']);

            console.log(this.storedData);
            if (
              event != null &&
              event.pageIndex < event.previousPageIndex &&
              self.iteratablePageIndex - 1 === Math.ceil(self.pageElements / self.pageSize)
            ) {
              self.iteratablePageIndex = Math.ceil(self.pageElements / self.pageSize) - 1;
              /* 
below if Condition is to handle button of 'Go First Page' 
Reset iteratablePageIndex to 0 
*/
              if (
                event !== null &&
                event.previousPageIndex > event.pageIndex &&
                event.previousPageIndex - event.pageIndex > 1
              ) {
                self.iteratablePageIndex = 0;
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
              self.iteratablePageIndex = Math.ceil(self.storedData.length / self.pageSize) - 1;
            } else {
              self.iteratablePageIndex = 0;
            }

            // tslint:disable-next-line:max-line-length 
            self.historyDataSource = new MatTableDataSource(
              self.storedData.slice(
                self.iteratablePageIndex * self.pageSize,
                self.iteratablePageIndex * self.pageSize + self.pageSize
              )
            );

            // self.dataSource = new MatTableDataSource(res['result']); 
            self.totalRecords = res['result']['totalElement'];
            self.historyDataSource.sort = self.sort;
          } else {
            self.storedData = [];
            // tslint:disable-next-line:max-line-length 
            self.historyDataSource = new MatTableDataSource(self.storedData);
            self.toastr.error(res['message']);
            // self.dataSource = new MatTableDataSource(res['result']); 
            self.totalRecords = 0;
            self.pageIndex = 0;
            self.customPageIndex = 0;
            self.iteratablePageIndex = 0;
            self.historyDataSource.sort = self.sort;

          }
        },
        err => {
          self.toastr.error(err['message']);
          self.totalRecords = 0;
          self.pageIndex = 0;
          self.customPageIndex = 0;
          self.iteratablePageIndex = 0;
          self.historyDataSource = new MatTableDataSource([]);
        }
      );
    }
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
    this.getViewHistoryList(event);
  }


  onClose(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
