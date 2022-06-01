import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { BranchService } from '../services/branch.service';
import { BranchType } from '../model/branch.model';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
@Component({
    selector: 'app-branch-creation-list',
    templateUrl: './branch-creation-list.component.html',
    styleUrls: ['./branch-creation-list.component.css']
})
export class BranchCreationListComponent implements OnInit {

    branchCreationListForm: FormGroup;
    fromDate = new Date();
    fromMaxDate = new Date();
    toMinDate: Date;
    toMaxDate = new Date();

    paginationArray;
    pageEvent: any;
    pageSize = 0;
    totalRecords: number = 0;
    isSearch: number = 0;
    pageIndex: number;
    indexedItem: number;
    customPageIndex: number;
    iteratablePageIndex: number;
    pageElements: number;
    sortBy: string = '';
    sortOrder: string = '';
    newSearch: boolean = false;

    errorMessages = msgConst;
    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;
    displayedColumnsFooter: string[] = ['id'];
    dataSourceBranchCreationList = new MatTableDataSource([]);
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    storedData: any[] = [];
    branchTypeList: BranchType[] = [];
    branchTypeCtrl: FormControl = new FormControl();

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private router: Router,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private branchService: BranchService,
    ) { }

    branchDetailsColumns: string[] = [
        'id', 'referenceNumber', 'referenceDate', 'district', 'ddoNo', 'cardexNo',
        'officeName', 'branchName', 'branchType', 'transactionStatus', 'lyingWith', 'action'
    ];
    ngOnInit() {
        this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.dataSourceBranchCreationList.sort = this.sort;
        this.branchCrationListForm();
        this.getBranchTypeDetails();
        this.getBranchCreationList();
    }


    // max and min date set for branch creation list.
    resetToDate() {
        this.toMinDate = new Date(this.branchCreationListForm.controls.fromDate.value);
        this.branchCreationListForm.controls.toDate.setValue('');
    }

    // branch creation filter form parameter
    branchCrationListForm() {
        this.branchCreationListForm = this.fb.group({
            trnNo: [''],
            fromDate: [''],
            toDate: [''],
            branchName: [''],
            branchTypeId: ['']
        });
    }

    // Get Branch Type Data
    getBranchTypeDetails() {
        this.branchService.getBranchDataDetails().subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                this.branchTypeList = res.result;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    // serach paramter of branch creation list.
    onSubmitSearch() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;
        this.getBranchCreationList();
    }

    // get branch creation list of data.
    getBranchCreationList (event: any = null) {
        const searchData = this.getSearchFilter();
        if (!searchData) {
            return false;
        }
        const passData = {
            pageIndex : this.customPageIndex,
            pageElement : this.pageElements,
            jsonArr: searchData
        },
        self = this;
        if (!this.newSearch && this.storedData.length !== 0 &&
            ((this.iteratablePageIndex + 1) <= ( Math.ceil(this.pageElements / this.pageSize)))) {
            // If data already fetched
            this.dataSourceBranchCreationList = new MatTableDataSource(this.storedData.slice(
                this.iteratablePageIndex * this.pageSize,
                (this.iteratablePageIndex * this.pageSize) + this.pageSize
            ));
        } else {
            // If data needs to fetch from database.
            this.branchService.getBranchCreationList(passData).subscribe((res) => {
                self.newSearch = false;
                if (res && res['status'] === 200) {
                    // For customize pagination
                    self.storedData = _.cloneDeep(res['result']['result']);
                    if (event != null && event.pageIndex < event.previousPageIndex &&
                        (self.iteratablePageIndex - 1) === (Math.ceil(self.pageElements / self.pageSize))) {
                        self.iteratablePageIndex = Math.ceil((self.pageElements / self.pageSize)) - 1;
                        /*
                        below if Condition is to handle button of 'Go First Page'
                        Reset iteratablePageIndex to 0
                        */
                        if (event !== null && event.previousPageIndex > event.pageIndex &&
                            (event.previousPageIndex - event.pageIndex) > 1) {
                            self.iteratablePageIndex = 0;
                        }
                    } else if (event != null && event.pageIndex > event.previousPageIndex &&
                        (event.pageIndex - event.previousPageIndex) > 1) {
                        /**
                         * else if conditin to handle button of 'Go Last Page'
                         * reset iteratablePageIndex to last pageIndex of particular pageSet
                        */
                        self.iteratablePageIndex = Math.ceil((self.storedData.length / self.pageSize)) - 1;
                    } else {
                        self.iteratablePageIndex = 0;
                    }
                    self.dataSourceBranchCreationList = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize, (
                            self.iteratablePageIndex * self.pageSize
                        ) + self.pageSize
                    ));
                    self.totalRecords = res['result']['totalElement'];
                    self.dataSourceBranchCreationList.sort = self.sort;
                } else {
                    self.storedData = [];
                    self.dataSourceBranchCreationList = new MatTableDataSource(self.storedData);
                    self.toastr.error(res['message']);
                    self.totalRecords = 0;
                    self.pageIndex = 0;
                    self.customPageIndex = 0;
                    self.iteratablePageIndex = 0;
                    self.dataSourceBranchCreationList.sort = self.sort;
                }
            }, (err) => {
                self.toastr.error(err);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSourceBranchCreationList = new MatTableDataSource([]);
            });
        }
    }
    getSearchFilter() {
        const obj = this.branchCreationListForm.value;
        const returnArray = [];
        // tslint:disable-next-line: forin
        for (const key in obj) {
            const currObj = {};
            currObj['key'] = key;
            if (key === 'trnNo' || key === 'fromDate' || key === 'toDate' || key === 'branchName') {
                if (key === 'fromDate' || key === 'toDate') {
                    if (obj['fromDate'] || obj['toDate']) {
                        if (!(obj['fromDate'] && obj['toDate'])) {
                            if (!obj['fromDate']) {
                                this.toastr.error(this.errorMessages.BRANCH.BRANCH_CREATION_LIST.FROM_DATE);
                            } else {
                                this.toastr.error(this.errorMessages.BRANCH.BRANCH_CREATION_LIST.TO_DATE);
                            }
                            return false;
                        }
                    }
                    const datePipe = new DatePipe('en-US');
                    currObj['value'] = (datePipe.transform(obj[key], 'MM/dd/yyyy') || '');
                } else {
                    currObj['value'] = (obj[key] || '').trim() ;
                }
            } else if (key === 'branchTypeId') {
                if (key === 'branchTypeId') {
                    currObj['value'] = Number(obj[key] || 0);
                } else {
                    currObj['value'] = (obj[key] || 0);
                }
            }
            returnArray.push(currObj);
        }
        return returnArray;
    }
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
            /**
             * Condition is for handle Go To Last Page button event.
             * set iteratablePageIndex to highest pageIndex so getData can load new set of data of current page index.
            */
            this.iteratablePageIndex = event.pageIndex;
        } else {
          this.iteratablePageIndex = this.iteratablePageIndex + 1;
        }
        this.getBranchCreationList(event);
    }
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getBranchCreationList();
    }

    // Clear form value of brnach creation list.
    clearForm() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.branchCreationListForm.reset();
            }
        });
    }

    // edit branch data.
    editBranch(element) {
        this.router.navigate(['../edit', element],
        {
            relativeTo: this.activatedRoute,
            skipLocationChange: true
        });
    }

    viewBranch(element) {
        this.router.navigate(['../view', element],
        {
            relativeTo: this.activatedRoute,
            skipLocationChange: true
        });
    }
    showConfirmationPopup(branchHeaderId) {
        const param = {
            id: branchHeaderId
        };
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '360px',
          data: msgConst.CONFIRMATION_DIALOG.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.branchService.deleteBranchCreationData(param).subscribe((res) => {
                    if (res && res['status'] === 200 ) {
                        this.toastr.success(res['message']);
                        this.newSearch = true;
                        this.getBranchCreationList();
                    }
                }, (err) => {
                    this.toastr.error(err);
                });
            }
        });
    }

    goToDashboard() {
        const proceedMessage = this.errorMessages.CONFIRMATION_DIALOG.CONFIRMATION;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }
}

