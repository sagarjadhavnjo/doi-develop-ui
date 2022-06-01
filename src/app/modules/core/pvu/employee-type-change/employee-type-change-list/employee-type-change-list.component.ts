import { PvuCommonService } from './../../pvu-common/services/pvu-common.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { cloneDeep, orderBy } from 'lodash';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { EmployeeTypeChangeService } from '../services/employee-type-change.service';

@Component({
    selector: 'app-employee-type-change-list',
    templateUrl: './employee-type-change-list.component.html',
    styleUrls: ['./employee-type-change-list.component.css']
})
export class EmployeeTypeChangeListComponent implements OnInit {

    variableClm = new BehaviorSubject<string[]>(['noData']);
    totalRecords: number = 0;
    paginationArray;
    sortBy = '';
    sortOrder = '';
    pageSize = 0;
    pageIndex = 0;
    isSearch = 0;
    pageEvent: Object;
    storedData = [];
    indexedItem = 0;
    customPageIndex = 0;
    iteratablePageIndex = 0;
    pageElements = DataConst.PAGE_ELEMENT;
    disableSearchValue = true;
    newSearch = false;
    minDate = new Date();
    displayedColumns: string[] = [
        'srNo', 'transNo', 'refDate', 'empNo', 'empName', 'designation',
        'curEmpType', 'updatedEmpType', 'officeName', 'status', 'action'
    ];

    searchListForm: FormGroup;
    empDesignation_list;
    officeName_list;
    loggedUserObj;
    officeId;
    officeTypeId;
    officeName: string;
    currentPost;
    isEditable;
    workflowStatus_list: object[] = [];
    empDesignationCtrl: FormControl = new FormControl();
    workflowStatusCtrl: FormControl = new FormControl();
    dataSource = new MatTableDataSource([]);
    private paginator: MatPaginator;
    private sort: MatSort;
    today: Date = new Date();

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
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private datepipe: DatePipe,
        private pvuService: PvuCommonService,
        private empTypeService: EmployeeTypeChangeService
    ) { }

    ngOnInit() {
        this.getLookup();
        this.createForm();
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.pageSize = 25;
        this.pvuService.getCurrentUserDetail().then((res) => {
            if (res) {
                this.loggedUserObj = res;
                if (res['officeDetail']) {
                    this.officeName = res['officeDetail']['officeName'];
                    this.officeId = +res['officeDetail']['officeId'];
                    this.searchListForm.patchValue({
                        officeName: this.officeName,
                        officeId: this.officeId
                    });
                }
                this.getData();
            }
        });

    }

    /**
     * @method createForm
     * @description to create formgroup
     */
    createForm() {
        this.searchListForm = this.fb.group({
            fromDate: [''],
            toDate: [''],
            transNo: [''],
            empNo: [''],
            empName: [''],
            designationId: [''],
            officeId: [this.officeId],
            officeName: [this.officeName],
            wfStatus: [''],
        });
    }

    /**
     * @method getLookup
     * @description to get lookup details
     */
    getLookup() {
        this.isSearch = 0;
        this.workflowStatus_list = [{
            id : 205,
            name: 'Saved as Draft'
        }, {
            id : 327,
            name: 'Approved'
        }];
        this.pvuService.getDesignations().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.empDesignation_list = cloneDeep(res['result']);
            }
        });
    }

    /**
     * @method getData
     * @param event By default null
     */
    getData(event = null) {
        const passData = {
            refFromDate: this.searchListForm.get('fromDate').value ?
                                this.datepipe.transform(this.searchListForm.get('fromDate').value, 'yyyy-MM-dd') : '',
            refToDate: this.searchListForm.get('toDate').value ?
                                this.datepipe.transform(this.searchListForm.get('toDate').value, 'yyyy-MM-dd') : '',
            desigId: this.searchListForm.get('designationId').value ?
                                        this.searchListForm.get('designationId').value : null,
            transNo: this.searchListForm.get('transNo').value ? this.searchListForm.get('transNo').value : '',
            empNo: this.searchListForm.get('empNo').value ? this.searchListForm.get('empNo').value : '',
            empName: this.searchListForm.get('empName').value ? this.searchListForm.get('empName').value : '',
            officeId: this.searchListForm.get('officeId').value,
            statusId: this.searchListForm.get('wfStatus').value ? this.searchListForm.get('wfStatus').value : ''
        },
            self = this;

        if (passData['refFromDate'] || passData['refToDate'] || passData['transNo']) {
            passData['statusId'] = 327;
        } else if (!passData['desigId'] && !passData['empNo'] && !passData['empName'] && !passData['statusId']) {
            passData['statusId'] = 205;
        }

        // tslint:disable-next-line:max-line-length
        if (!this.newSearch && this.storedData.length !== 0 && (this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize))) { // If data already fetched
            // tslint:disable-next-line:max-line-length
            this.dataSource = new MatTableDataSource(this.storedData.slice(this.iteratablePageIndex * this.pageSize, (this.iteratablePageIndex * this.pageSize) + this.pageSize));
        } else { // If data needs to fetch from database.
            this.empTypeService.getSearchListing(passData).subscribe((res) => {
                self.newSearch = false;
                if (res && res['status'] === 200) {
                    // For customize pagination
                    self.storedData = cloneDeep(orderBy(res['result'], 'sdId', 'asc'));
                    // tslint:disable-next-line:max-line-length
                    if (event != null && event.pageIndex < event.previousPageIndex
            && (self.iteratablePageIndex - 1) === (Math.ceil(self.pageElements / self.pageSize))) {
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
                        self.storedData.slice(self.iteratablePageIndex * self.pageSize,
                        (self.iteratablePageIndex * self.pageSize) + self.pageSize));
                    if (self.storedData.length > 0) {
                        self.variableClm.next(this.displayedColumns);
                    } else {
                        self.variableClm.next(['noData']);
                        self.dataSource = new MatTableDataSource(['noData']);
                    }
                    // self.dataSource = new MatTableDataSource(res['result']);
                    self.totalRecords = self.storedData.length;
                    self.dataSource.sort = self.sort;
                } else {
                    self.storedData = ['noData'];
                    // tslint:disable-next-line:max-line-length
                    self.dataSource = new MatTableDataSource(self.storedData);
                    self.variableClm.next(['noData']);
                    self.toastr.error(res['message']);
                    // self.dataSource = new MatTableDataSource(res['result']);
                    self.totalRecords = 0;
                    self.pageIndex = 0;
                    self.customPageIndex = 0;
                    self.iteratablePageIndex = 0;
                    self.dataSource.sort = self.sort;
                }
            }, (err) => {
                self.variableClm.next(['noData']);
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
     * @method convertDateFormat
     * @param date passed when function called
     * @returns converted date in desired format
     */
    convertDateFormat(date) {
        if (date !== '' && date !== undefined) {
            date = new Date(date);
            return this.datepipe.transform(date, 'MM-dd-yyyy');
        }
        return '';
    }

    /**
     * @method onSubmitSearch
     * @description called when listing is seaarched with filters
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
     * @method onPaginateChange
     * @description pagination functionality
     * @param event parameter
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
     * @method onSortColumn
     * @description Sorting functionality for mattable
     */
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getData();
    }

    /**
     * @method setDataSourceAttributes
     * @description to map paginatior & sorting head from html
     */
    setDataSourceAttributes() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /**
     * @method showConfirmationPopup
     * @param element passed by mat table element in html
     * @description when delete action is performed from listing
     */
    showConfirmationPopup(element) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                const param = {
                    'id': Number(element.sdId)
                };
                this.empTypeService.deleteRecord(param).subscribe((res) => {
                    if (res && res['status'] === 200) {
                        this.toastr.success(res['message']);
                        this.newSearch = true;
                        this.getData();
                    } else {
                        this.toastr.error(res['message']);
                    }
                }, err => {
                    this.toastr.error(err);
                });
            }
        });
    }

    /**
     * @method clearForm
     * @description to reset form values
     */
    clearForm() {
        this.searchListForm.reset();
        this.searchListForm.patchValue({
            officeName: this.officeName,
            officeId: this.officeId
        });
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
        this.getData();
    }

    /**
     * @method onEdit
     * @param id element id to be edited
     * @description to navigate to creation component in edit mode
     */
    onEdit(id) {
        this.router.navigate(['../', 'edit', id], { relativeTo: this.route, skipLocationChange: true });
    }

    /**
     * @method onView
     * @param id element id to be edited
     * @description to navigate to creation component in view mode
     */
    onView(id) {
        this.router.navigate(['../', 'view', id], { relativeTo: this.route, skipLocationChange: true });
    }
}
