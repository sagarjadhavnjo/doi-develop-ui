import { ValidationService } from 'src/app/modules/services/validatation.service';
import { SearchEmployeeService } from '../services/search-employee/search-employee.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.css']
})

export class SearchEmployeeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SearchEmployeeComponent>,
    private fb: FormBuilder,
    private empService: SearchEmployeeService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data) {
    this.totalRecords = 0;
    this.pageSize = 0;
    this.pageIndex = 0;
    this.indexedItem = 0;
    this.customPageIndex = 0;
    this.iteratablePageIndex = 0;
    this.pageElements = DataConst.PAGE_ELEMENT;
  }
  displayedColumnsArray = new BehaviorSubject<string[]>(['noData']);
  searchEmployeeNo: FormGroup;
  pageEvent;
  designationCtrl: FormControl = new FormControl();
  employeetypeCtrl: FormControl = new FormControl();
  locationCtrl: FormControl = new FormControl();

  designation_list;
  employee_type_list;
  empPayTypeList;

  public listshow = false;
  public autopopulated = false;
  totalRecords: number;
  customPageIndex: number;
  iteratablePageIndex: number;
  paginationArray;
  sortBy = '';
  sortOrder = '';
  pageSize = 0;
  isSearch = 0;
  pageIndex: number;
  storedData = [];
  indexedItem: number;
  pageElements = DataConst.PAGE_ELEMENT;
  disableSearchValue = true;
  newSearch = false;
  disabledEmpSearch = new BehaviorSubject<boolean>(true);

  officeName;
  currentPost;
  userOffice;

  variableClm = new BehaviorSubject<string[]>(['noData']);
  displayedColumns = ['employeeNumber', 'empName', 'empDesignation', 'classLevel', 'employeeType', 'pan', 'officeId'];
  dataSource = new MatTableDataSource(['noData']);

  designationList = [];

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  saveEmployeeNumber(employeeNo) {

  }
  ngOnInit() {

    this.userOffice = this.storageService.get('currentUser');
    if (this.userOffice && this.userOffice['post'][0]['loginPost'] !== undefined) {
      this.currentPost = this.userOffice['post'].filter((item) => item['loginPost'] === true);
      this.officeName = this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeName'];
    }

    this.paginationArray = DataConst.PAGINATION_ARRAY;
    this.pageSize = 5;

    this.getLookUpInfoData();
    this.getDesignations();
    this.createForm();

    if (this.data?.empPayType) {
      this.empPayTypeList = [{
        id: 160,
        viewValue: 'Adhoc/Bonded'
      } , {
        id: 161,
        viewValue: 'Probational'
      }];
      this.searchEmployeeNo.addControl('empPayType', new FormControl(this.data.empPayType));
      this.getEPTCData();
    }

    this.searchEmployeeNo.valueChanges.subscribe(val => {
      this.disabledEmpSearch.next(true);
      for (const key in this.searchEmployeeNo.value) {
        if (this.searchEmployeeNo.value[key] !== '') {
          this.disabledEmpSearch.next(false);
        }
      }
    });
  }

  createForm() {
    this.searchEmployeeNo = this.fb.group({
      empName: [''],
      empDesignation: [''],
      empType: [''],
      pan: ['', ValidationService.panCardValidation],
      pPan: [''],
      retirementDate: [''],
      caseNo: [''],
      officeId: [this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId']]
    });
  }

  /**
   * @description Method to get lookup data through service and set dropdown list
   */
  getLookUpInfoData() {
    const self = this;
    this.empService.getLookUp().subscribe((data) => {
      if (data && data['result']) {
        this.employee_type_list = data['result']['Emp_Type'];
        this.designation_list = data['result']['designation'];
      }
    }, (err) => {
      self.toastr.error(err);
    });
  }

    /**
     * @method getDesignations
     * @description Function is called to get all designations
     */
    getDesignations() {
      const self = this;
      self.empService.getDesignations().subscribe(res => {
          if (res['status'] === 200 && res['result']) {
              self.designationList = res['result'];
          } else {
              self.toastr.error(res['message']);
          }
      }, err => {
          self.toastr.error(err);
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


    if (!this.newSearch && this.storedData.length !== 0 &&
      (this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize))) {
      this.dataSource = new MatTableDataSource(this.storedData.slice(this.iteratablePageIndex * this.pageSize,
        (this.iteratablePageIndex * this.pageSize) + this.pageSize));
    } else {
      if (this.searchEmployeeNo.controls['pan'].value && this.searchEmployeeNo.controls['pan'].invalid) {
        this.searchEmployeeNo.controls['pan'].markAsTouched({ onlySelf: true });
        return false;
      }
      this.empService.getEmployee(passData).subscribe((res) => {
        self.newSearch = false;
        if (res && res['status'] === 200) {
          self.storedData = _.cloneDeep(res['result']['result']);
          if (event != null && event.pageIndex < event.previousPageIndex &&
            (self.iteratablePageIndex - 1) === (Math.ceil(self.pageElements / self.pageSize))) {
            self.iteratablePageIndex = Math.ceil((self.pageElements / self.pageSize)) - 1;
            if (event !== null && event.previousPageIndex > event.pageIndex &&
              (event.previousPageIndex - event.pageIndex) > 1) {
              self.iteratablePageIndex = 0;
            }
          } else if (event != null && event.pageIndex > event.previousPageIndex &&
            (event.pageIndex - event.previousPageIndex) > 1) {
            self.iteratablePageIndex = Math.ceil((self.storedData.length / self.pageSize)) - 1;
          } else {
            self.iteratablePageIndex = 0;
          }
          self.dataSource = new MatTableDataSource(self.storedData.slice(self.iteratablePageIndex * self.pageSize,
            (self.iteratablePageIndex * self.pageSize) + self.pageSize));
          if (self.storedData.length > 0) {
            self.variableClm.next(this.displayedColumns);
          } else {
            self.variableClm.next(['noData']);
            self.dataSource = new MatTableDataSource(['noData']);
          }
          self.totalRecords = res['result']['totalElement'];
          setTimeout(() => {
            self.dataSource.sort = self.sort;
          });
        } else {
          self.storedData = ['noData'];
          self.dataSource = new MatTableDataSource(self.storedData);
          self.variableClm.next(['noData']);
          self.toastr.error(res['message']);
          self.totalRecords = 0;
          self.pageIndex = 0;
          self.customPageIndex = 0;
          self.iteratablePageIndex = 0;
          self.dataSource.sort = self.sort;
        }
      }, (err) => {
        self.toastr.error(err);
        self.totalRecords = 0;
        self.pageIndex = 0;
        self.customPageIndex = 0;
        self.iteratablePageIndex = 0;
        self.dataSource = new MatTableDataSource(['noData']);
      });
    }
  }

  /**
   * @description Method to fetch table data based on search parameters through service and set dataSource
   * @param event event
   */
   getEPTCData(event = null) {
    const passData = {
        officeId: this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId'],
        empPaytype: this.searchEmployeeNo.controls['empPayType'].value,
        desigId: this.searchEmployeeNo.controls['empDesignation'].value,
        emptype: this.searchEmployeeNo.controls['empType'].value,
        empName: this.searchEmployeeNo.controls['empName'].value,
        retirementDate: this.searchEmployeeNo.controls['retirementDate'].value ?
                    this.datePipe.transform(this.searchEmployeeNo.controls['retirementDate'].value, 'yyyy-MM-dd') : '',
        panNo: this.searchEmployeeNo.controls['pan'].value
    },
      self = this;


    if (!this.newSearch && this.storedData.length !== 0 &&
      (this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize))) {
      this.dataSource = new MatTableDataSource(this.storedData.slice(this.iteratablePageIndex * this.pageSize,
        (this.iteratablePageIndex * this.pageSize) + this.pageSize));
    } else {
      if (this.searchEmployeeNo.controls['pan'].value && this.searchEmployeeNo.controls['pan'].invalid) {
        this.searchEmployeeNo.controls['pan'].markAsTouched({ onlySelf: true });
        return false;
      }
      this.empService.getEPTCEmployee(passData).subscribe((res) => {
        self.newSearch = false;
        if (res && res['status'] === 200) {
          self.storedData = _.cloneDeep(res['result']);
          self.storedData.forEach((resS) => {
            resS.employeeNo = resS.empNo;
            resS.designation = resS.desigName;
            resS.classLevel = resS.empClassName;
            resS.empType = resS.empTypeName;
            resS.pan = resS.panNo;
          } );
          if (event != null && event.pageIndex < event.previousPageIndex &&
            (self.iteratablePageIndex - 1) === (Math.ceil(self.pageElements / self.pageSize))) {
            self.iteratablePageIndex = Math.ceil((self.pageElements / self.pageSize)) - 1;
            if (event !== null && event.previousPageIndex > event.pageIndex &&
              (event.previousPageIndex - event.pageIndex) > 1) {
              self.iteratablePageIndex = 0;
            }
          } else if (event != null && event.pageIndex > event.previousPageIndex &&
            (event.pageIndex - event.previousPageIndex) > 1) {
            self.iteratablePageIndex = Math.ceil((self.storedData.length / self.pageSize)) - 1;
          } else {
            self.iteratablePageIndex = 0;
          }
          self.dataSource = new MatTableDataSource(self.storedData.slice(self.iteratablePageIndex * self.pageSize,
            (self.iteratablePageIndex * self.pageSize) + self.pageSize));
          if (self.storedData.length > 0) {
            self.variableClm.next(this.displayedColumns);
          } else {
            self.variableClm.next(['noData']);
            self.dataSource = new MatTableDataSource(['noData']);
          }
          self.totalRecords = res['result'].length;
          setTimeout(() => {
            self.dataSource.sort = self.sort;
          });
        } else {
          self.storedData = ['noData'];
          self.dataSource = new MatTableDataSource(self.storedData);
          self.variableClm.next(['noData']);
          self.toastr.error(res['message']);
          self.totalRecords = 0;
          self.pageIndex = 0;
          self.customPageIndex = 0;
          self.iteratablePageIndex = 0;
          self.dataSource.sort = self.sort;
        }
      }, (err) => {
        self.toastr.error(err);
        self.totalRecords = 0;
        self.pageIndex = 0;
        self.customPageIndex = 0;
        self.iteratablePageIndex = 0;
        self.dataSource = new MatTableDataSource(['noData']);
      });
    }
  }

  /**
   * @description Method to set search parameters from form
   */
  getSearchFilter() {
    const obj = this.searchEmployeeNo.value;

    if (!obj.empDesignation && !obj.empName && !obj.caseNo && !obj.empType && !obj.pPan && !obj.officeId &&
      !obj.retirementDate && !obj.pan) {
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
      if (key === 'empName' || key === 'pan' || key === 'retirementDate' || key === 'pPan' || key === 'caseNo') {
        if (key === 'retirementDate') {
          currObj['value'] = '' + (this.convertDateFormat(obj[key]) || '');
          returnArray.push(currObj);
        } else {
          currObj['value'] = '' + (obj[key] || '');
          returnArray.push(currObj);
        }
      } else {
        currObj['value'] = '' + (Number(obj[key]) || 0);
        returnArray.push(currObj);
      }
    }
    return returnArray;
  }

  /**
   * @description Method to modify date format
   * @param date date to be formatted
   * @returns date in date string format
   */
  convertDateFormat(date) {
    if (date !== '' && date !== undefined) {
      date = new Date(date);
      return this.datePipe.transform(date, 'MM/dd/yyyy');
    }
    return '';
  }

  /**
   * @description Method invoked on changing pagination to set next data set
   * @param event event
   */
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.customPageIndex = Math.floor((this.pageIndex) / Math.ceil((this.pageElements / this.pageSize)));
    if (event.pageIndex < event.previousPageIndex) {
      this.iteratablePageIndex = this.iteratablePageIndex - 1;

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
    if (this.data?.empPayType) {
      this.getEPTCData(event);
    } else {
      this.getData(event);
    }
  }

  onSortColumn() {
    this.sortBy = this.sort.active;
    this.sortOrder = this.sort.direction;
    this.paginator.pageIndex = 0;
    this.pageIndex = 0;
    if (this.data?.empPayType) {
      this.getEPTCData();
    }  else {
      this.getData();
    }
  }


  /**
    * @description Method invoked on search button click event
    */
  onSubmitSearch() {
    this.newSearch = true;
    this.isSearch = 1;
    if (this.data?.empPayType) {
      this.getEPTCData();
    } else {
      this.getData();
    }
  }

  /**
   * @description Method to set dataSource attributes paginator and sort
   */
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * @description Method invoked on the click of employee number hyperlink
   * @param i index
   */
  onClickEmpNo(i) {
    this.dialogRef.close(this.dataSource.data[i]);
  }
}

