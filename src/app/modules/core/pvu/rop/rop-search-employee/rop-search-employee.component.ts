import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/shared/services/storage.service';
import { RopSearchEmployeeService } from '../service/rop-search-employee/rop-search-employee.service';

@Component({
    selector: 'app-rop-search-employee',
    templateUrl: './rop-search-employee.component.html',
    styleUrls: ['./rop-search-employee.component.css']
})

export class RopSearchEmployeeComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<RopSearchEmployeeComponent>,
        private fb: FormBuilder,
        private empService: RopSearchEmployeeService,
        private toastr: ToastrService,
        private datePipe: DatePipe,
        private storageService: StorageService
    ) {
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
    pageEvent: any;
    designationCtrl: FormControl = new FormControl();
    employeetypeCtrl: FormControl = new FormControl();
    locationCtrl: FormControl = new FormControl();

    designation_list;
    employee_type_list;

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
    storedData: any[] = [];
    indexedItem: number;
    pageElements = DataConst.PAGE_ELEMENT;
    disableSearchValue = true;
    newSearch = false;
    disabledEmpSearch = new BehaviorSubject<boolean>(true);

    officeName;
    currentPost;
    officeId: number;

    variableClm = new BehaviorSubject<string[]>(['noData']);
    displayedColumns = ['employeeNumber', 'empName', 'designation', 'classLevel', 'employeeType', 'pan', 'officeId'];
    dataSource = new MatTableDataSource(['noData']);

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

        const userOffice = this.storageService.get('currentUser');
        if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
            this.currentPost = userOffice['post'].filter((item) => item['loginPost'] === true);
            this.officeName = this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeName'];
            this.officeId = Number(this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId']);
        }

        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.pageSize = 5;

        this.getLookUpInfoData();
        this.createForm();

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
            designationId: [''],
            empType: [''],
            panNo: [''],
            pPan: [''],
            retirementDate: [''],
            caseNo: [''],
            officeId: this.officeId
        });
    }

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

                    self.dataSource = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize,
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

    getSearchFilter() {
        const obj = this.searchEmployeeNo.value;

        if (!obj.designationId && !obj.empName && !obj.caseNo && !obj.empType && !obj.pPan && !obj.officeId &&
            !obj.retirementDate && !obj.panNo) {
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
            if (key === 'empName' || key === 'panNo' || key === 'retirementDate' ||
                key === 'pPan' || key === 'caseNo' || key === 'officeId') {
                if (key === 'retirementDate') {
                    currObj['value'] = '' + (this.convertDateFormat(obj[key]) || '');
                    returnArray.push(currObj);
                } else if (key === 'officeId') {
                    currObj['value'] = Number((obj[key]));
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
        console.log('with office id', returnArray);
        return returnArray;
    }

    convertDateFormat(date) {
        if (date !== '' && date !== undefined) {
            date = new Date(date);
            return this.datePipe.transform(date, 'dd-MM-yyyy');
        }
        return '';
    }
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
        this.getData(event);
    }

    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getData();
    }


    onSubmitSearch() {
        this.newSearch = true;
        this.isSearch = 1;
        this.getData();
    }

    setDataSourceAttributes() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    onClickEmpNo(i) {
        this.dialogRef.close(this.dataSource.data[i]);
    }
}

