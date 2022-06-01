import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { AddDesignationService } from '../../services/add-designation.service';
import { ToastrService } from 'ngx-toastr';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { DatePipe } from '@angular/common';
import { EdpDdoOfficeService } from '../../services/edp-ddo-office.service';
import * as _ from 'lodash';
import { DesignationOfDdo, StatusName, District } from '../../model/add-designation';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
@Component({
    selector: 'app-update-designation-list',
    templateUrl: './update-designation-list.component.html',
    styleUrls: ['./update-designation-list.component.css']
})
export class UpdateDesignationListComponent implements OnInit {
    searchUpdateDesignForm: FormGroup;

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

    errorMessages = msgConst;
    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;
    displayedColumnsFooter: string[] = ['id'];
    dataSourceUpdateDesignationList = new MatTableDataSource([]);
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    pageEvent: any;

    designationList: DesignationOfDdo[] = [];
    statusList: StatusName[] = [];
    workFlowStatusList: StatusName[] = [];
    districtNameList: District[] = [];

    desigCtrl: FormControl = new FormControl();
    statusCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();
    wfStatusCtrl: FormControl = new FormControl();

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private addDesignationService: AddDesignationService,
        private edpDdoOfficeService: EdpDdoOfficeService
    ) { }

    displayedColumns: string[] = [
        'id', 'transactionNumber', 'transactionDate', 'districtName', 'ddoNo',
        'cardexNo', 'ddoName', 'employeeId', 'employeeName',
        'ddoDesignation', 'lyingWith', 'trnStatus', 'status', 'action'
    ];

    ngOnInit() {
        this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
        this.createForm();
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.createForm();
        this.getDesignationList();
        this.getOfficeDetails();
        this.dataSourceUpdateDesignationList.sort = this.sort;
    }
    resetToDate() {
        this.toMinDate = new Date(this.searchUpdateDesignForm.controls.fromDate.value);
        this.searchUpdateDesignForm.controls.toDate.setValue('');
    }
    createForm() {
        this.searchUpdateDesignForm = this.fb.group({
            trnNo: [''],
            fromDate: [''],
            toDate: [''],
            designationId: [''],
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
                this.designationList = res['result']['designationOfDdo'];
            }
        },
            (err) => {
                this.toastr.error(err);
            });

        this.addDesignationService.getDistrictDetails().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.districtNameList = res['result']['districts'];
                this.statusList = res['result']['transStatusList'];
                this.workFlowStatusList = res['result']['workFlowStatusList'];
            }
        },
            (err) => {
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
        this.getDesignationList();
    }
    getDesignationList(event: any = null) {
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
            this.dataSourceUpdateDesignationList = new MatTableDataSource(this.storedData.slice(
                this.iteratablePageIndex * this.pageSize,
                (this.iteratablePageIndex * this.pageSize) + this.pageSize
            ));
        } else {
            // If data needs to fetch from database.
            this.addDesignationService.getDesignationList(passData).subscribe((res) => {
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
                    self.dataSourceUpdateDesignationList = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize, (
                            self.iteratablePageIndex * self.pageSize
                        ) + self.pageSize
                    ));
                    self.totalRecords = res['result']['totalElement'];
                    self.dataSourceUpdateDesignationList.sort = self.sort;
                } else {
                    self.storedData = [];
                    self.dataSourceUpdateDesignationList = new MatTableDataSource(self.storedData);
                    self.toastr.error(res['message']);
                    self.totalRecords = 0;
                    self.pageIndex = 0;
                    self.customPageIndex = 0;
                    self.iteratablePageIndex = 0;
                    self.dataSourceUpdateDesignationList.sort = self.sort;
                }
            }, (err) => {
                self.toastr.error(this.errorMessages['UPDATE_DESIGNATION_LIST']['ERR_UPDATE_DESIGNATION_LIST']);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSourceUpdateDesignationList = new MatTableDataSource([]);
            });
        }
    }
    getSearchFilter() {
        const obj = this.searchUpdateDesignForm.value;
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
                                this.toastr.error(this.errorMessages['UPDATE_DESIGNATION_LIST']['FROM_DATE']);
                            } else {
                                this.toastr.error(this.errorMessages['UPDATE_DESIGNATION_LIST']['TO_DATE']);
                            }
                            return false;
                        }
                    }
                    const datePipe = new DatePipe('en-US');
                    currObj['value'] = (datePipe.transform(obj[key], 'MM/dd/yyyy') || '');
                } else {
                    currObj['value'] = (obj[key] || '').trim();
                }
            } else if (key === 'designationId' || key === 'districtId' ||
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
                value: this.searchUpdateDesignForm.dirty ? 0 : 1
            },
            {
                key: 'menuId',
                value: EdpDataConst.MENU.UPDATE_DESIGNATION_LIST
                // As we are traversing from update designation screen to listing there is no
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
        this.getDesignationList(event);
    }
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getDesignationList();
    }
    clearForm() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.searchUpdateDesignForm.reset();
            }
        });
    }
    editDesignation(element) {
        this.router.navigate(['../update/edit', element.updDsgId],
            {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
    }

    viewDesignation(element) {
        this.router.navigate(['../update/view', element.updDsgId],
            {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
    }
    showConfirmationPopup(designationId) {
        const param = {
            id: designationId
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.addDesignationService.deleteUpdateDesignation(param).subscribe((res) => {
                    if (res && res['status'] === 200) {
                        this.toastr.success(this.errorMessages['UPDATE_DESIGNATION_LIST']['UPDATE_DESIGNATION_DELETE']);
                        this.newSearch = true;
                        this.getDesignationList();
                    }
                }, (err) => {
                    this.toastr.error(this.errorMessages['UPDATE_DESIGNATION_LIST']['ERR_UPDATE_DESIGNATION_DELETE']);
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
