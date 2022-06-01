import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { DatePipe } from '@angular/common';
import { EdpDdoOfficeService } from '../../services/edp-ddo-office.service';
import * as _ from 'lodash';
import { StatusName, District } from '../../model/post-transfer-model';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { PostTransferService } from '../../services/post-transfer.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
@Component({
    selector: 'app-post-transfer-list',
    templateUrl: './post-transfer-list.component.html',
    styleUrls: ['./post-transfer-list.component.css']
})
export class PostTransferListComponent implements OnInit {
    seachPostTransferListForm: FormGroup;
    errorMessages = {};

    fromDate = new Date();
    fromMaxDate = new Date();
    toMinDate: Date;
    toMaxDate = new Date();

    paginationArray;
    newSearch: boolean = false;
    totalRecords: number = 0;
    sortBy: string = '';
    sortOrder: string = '';
    pageSize = 0;
    pageIndex: number;
    isSearch: number = 0;
    storedData: any[] = [];
    indexedItem: number;
    customPageIndex: number;
    iteratablePageIndex: number;
    pageElements: number;

    displayedColumnsFooter: string[] = ['id'];
    dataSource = new MatTableDataSource([]);
    pageEvent: any;
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    statusList: StatusName[] = [];
    workFlowStatusList: StatusName[] = [];
    districtNameList: District[] = [];
    statusCtrl: FormControl = new FormControl();
    wfStatusCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();
    displayedColumns: string[] = [
        'id', 'transactionNumber', 'transactionDate', 'districtName', 'ddoNo',
        'cardexNo', 'ddoOffice', 'postTransferFrom', 'fromEmployeeNo',
        'postTransferTo', 'toEmployeeNo', 'lyingWith', 'trnStatus', 'wfStatus', 'action'
    ];
    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private edpDdoOfficeService: EdpDdoOfficeService,
        private postTransferService: PostTransferService,
        private commonService: CommonService
    ) { }
    ngOnInit() {
        this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
        this.createForm();
        this.errorMessages = msgConst;
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.getPostTransferDataList();
        this.getOfficeDetails();
        this.dataSource.sort = this.sort;
    }
    resetToDate() {
        this.toMinDate = new Date(this.seachPostTransferListForm.controls.fromDate.value);
        this.seachPostTransferListForm.controls.toDate.setValue('');
    }

    onResetClick() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.seachPostTransferListForm.reset();
            }
        });
    }

    createForm() {
        this.seachPostTransferListForm = this.fb.group({
            trnNo: [''],
            fromDate: [''],
            toDate: [''],
            employeeNo: [''],
            employeeName: [''],
            districtId: [''],
            ddoNo: [''],
            cardexNo: [''],
            statusId: [''],
            wfStatusId: ['']
        });
    }
    getOfficeDetails() {
        this.edpDdoOfficeService.getOfficeDetails('').subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.districtNameList = res['result']['districts'];
            }
        }, (err) => {
            this.toastr.error(this.errorMessages['DDO_OFFICE']['ERR_OFFICE_MASTER_DATA']);
        });

        this.postTransferService.getListingStatus('').subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                this.statusList = res.result.transStatusList;
                this.workFlowStatusList = res.result.workFlowStatusList;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }
    onSubmitSearch() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;
        this.getPostTransferDataList();
    }
    getPostTransferDataList(event: any = null) {
        const searchData = this.getSearchFilter();
        if (!searchData) {
            return false;
        }
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: searchData
        },
            self = this;
        if (!this.newSearch && this.storedData.length !== 0 &&
            ((this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize)))) {
            // If data already fetched
            this.dataSource = new MatTableDataSource(this.storedData.slice(
                this.iteratablePageIndex * this.pageSize,
                (this.iteratablePageIndex * this.pageSize) + this.pageSize
            ));
        } else {
            // If data needs to fetch from database.
            this.postTransferService.getPostTransferDataList(passData).subscribe((res) => {
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

                    self.storedData.forEach(x => {
                        x.fromEmployeeNo = +x.fromEmployeeNo ? x.fromEmployeeNo : '-';
                        x.toEmployeeNo = +x.toEmployeeNo ? x.toEmployeeNo : '-';
                    });
                    self.dataSource = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize, (
                            self.iteratablePageIndex * self.pageSize
                        ) + self.pageSize
                    ));
                    self.totalRecords = res['result']['totalElement'];
                    self.dataSource.sort = self.sort;
                } else {
                    self.storedData = [];
                    self.dataSource = new MatTableDataSource(self.storedData);
                    self.toastr.error(res['message']);
                    self.totalRecords = 0;
                    self.pageIndex = 0;
                    self.customPageIndex = 0;
                    self.iteratablePageIndex = 0;
                    self.dataSource.sort = self.sort;
                }
            }, (err) => {
                self.toastr.error(this.errorMessages['POST_TRANSFER']['LIST']['ERR_POST_TRANSFER_LIST']);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSource = new MatTableDataSource([]);
            });
        }
    }
    getSearchFilter() {
        const obj = this.seachPostTransferListForm.value;
        const returnArray = [];
        // tslint:disable-next-line: forin
        for (const key in obj) {
            const currObj = {};
            currObj['key'] = key;
            if (key === 'trnNo' || key === 'fromDate' || key === 'toDate' || key === 'ddoNo'
                || key === 'employeeName' || key === 'statusId' || key === 'wfStatusId') {
                if (key === 'fromDate' || key === 'toDate') {
                    if (obj['fromDate'] || obj['toDate']) {
                        if (!(obj['fromDate'] && obj['toDate'])) {
                            if (!obj['fromDate']) {
                                this.toastr.error(this.errorMessages['POST_TRANSFER']['LIST']['FROM_DATE']);
                            } else {
                                this.toastr.error(this.errorMessages['POST_TRANSFER']['LIST']['TO_DATE']);
                            }
                            return false;
                        }
                    }
                    const datePipe = new DatePipe('en-US');
                    currObj['value'] = (datePipe.transform(obj[key], 'MM/dd/yyyy') || '');
                } else {
                    currObj['value'] = (obj[key] || '').trim();
                }
            } else if (key === 'districtId' ||
                key === 'cardexNo' || key === 'employeeNo') {
                if (key === 'cardexNo') {
                    currObj['value'] = Number(obj[key] || 0);
                } else {
                    currObj['value'] = (obj[key] || 0);
                }
            }
            returnArray.push(currObj);
        }
        returnArray.push(
            {
                key: 'isDefaultSearch',
                value: this.seachPostTransferListForm.dirty ? 0 : 1
            },
            {
                key: 'menuId',
                value: EdpDataConst.MENU.LISTING
                // As we are traversing from post transfer screen to listing there is no
                // way to dynamic assign menu id
            }
        );
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
        this.getPostTransferDataList(event);
    }
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getPostTransferDataList();
    }
    editPostTransfer(element) {
        const isWfStatusDraft = element.wfStatus.toLowerCase() === 'draft' ? true : false;
        this.router.navigate(['../edit', element.edpUsrPoTrnsHeaderId, element.status, isWfStatusDraft],
            {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
    }

    viewPostTransfer(element) {
        const isWfStatusDraft = element.wfStatus.toLowerCase() === 'draft' ? true : false;
        this.router.navigate(['../view', element.edpUsrPoTrnsHeaderId, element.status, isWfStatusDraft],
            {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
    }

    deletePostTransfer(element) {
        const param = {
            id: element.edpUsrPoTrnsHeaderId
        };
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.postTransferService.deletePostTransfer(param).subscribe((res) => {
                    if (res && res['status'] === 200) {
                        this.toastr.success(this.errorMessages['POST_TRANSFER']['LIST']['POST_TRANSFER_DELETE']);
                        this.newSearch = true;
                        this.getPostTransferDataList();
                    }
                }, (err) => {
                    this.toastr.error(this.errorMessages['POST_TRANSFER']['LIST']['ERR_POST_TRANSFER_DELETE']);
                });
            }
        });
    }
    goToDashboard() {
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
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

