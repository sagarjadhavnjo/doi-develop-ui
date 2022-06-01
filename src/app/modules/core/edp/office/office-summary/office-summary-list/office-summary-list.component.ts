import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EdpDdoOfficeService } from '../../../services/edp-ddo-office.service';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { District } from '../../../model/office-data-model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
@Component({
    selector: 'app-summary',
    templateUrl: './office-summary-list.component.html',
    styleUrls: ['./office-summary-list.component.css']
})
export class OfficeSummaryListComponent implements OnInit {
    searchSummaryForm: FormGroup;
    errorMessages = {};
    paginationArray;
    newSearch: Boolean = false;
    totalRecords: Number = 0;
    sortBy: String = '';
    sortOrder: String = '';
    pageSize = 0;
    pageIndex = 0;
    isSearch: Number = 0;
    storedData: any[] = [];
    indexedItem: number;
    customPageIndex: number;
    iteratablePageIndex: number;
    pageElements: number;
    isToPaoUser: boolean = false;
    displayedBrowseColumns: string[] = [
        'id', 'districtCode', 'districtName', 'ddoCount', 'nonDDOCount', 'panchayatCount', 'total'
    ];
    displayedColumnsFooter: string[] = ['id'];
    dataSource = new MatTableDataSource([]);
    @ViewChild('paginator') paginator: MatPaginator;
    pageEvent: any;
    private sort: MatSort;

    districtList: District[] = [];
    districtId: string;
    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;

    districtCtrl: FormControl = new FormControl();
    @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    constructor(
        public fb: FormBuilder,
        private toastr: ToastrService,
        private edpDdoOfficeService: EdpDdoOfficeService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private storageService: StorageService
    ) { }

    ngOnInit() {
        const officeData = this.storageService.get('userOffice');
        if (officeData['isTreasury'] === EdpDataConst.IS_TREASURY ||
            officeData['officeSubType'] === EdpDataConst.IS_PO_USER) {
            this.isToPaoUser = true;
        }
        this.districtId = officeData['districtId'];
        this.errorMessages = msgConst.OFFICE_SUMMARY;
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 36;
        this.pageIndex = 0;
        this.createForm();
        if (!this.isToPaoUser) {
            this.getOfficeSummaryList();
        }
        this.getOfficeDetails();
    }

    /**
     * @description To disable the form and to avoid the default search for TO/PAO User
     */

    userBasedValidation() {
        if (this.isToPaoUser) {
            this.searchSummaryForm.disable();
            this.searchSummaryForm.patchValue({
                districtId: this.districtId
            });
            this.searchSummary();
        }
    }

    /**
     * @description To create the Form
     */

    createForm() {
        this.searchSummaryForm = this.fb.group({
            districtCode: [''],
            districtId: ['']
        });
    }

    /**
     * @description To clear the Form
     */

    clearForm() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.searchSummaryForm.reset();
            }
        });
    }

    /**
     * @description To get Office Details
     */

    getOfficeDetails() {
        this.edpDdoOfficeService.getOfficeDetails('').subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.districtList = res['result']['districts'];
                this.userBasedValidation();
            } else {
                this.toastr.error(res['message']);
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages['ERR_OFFICE_MASTER_DATA']);
            });
    }

    /**
     * @description Triggered when search button is clicked
     */

    searchSummary() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        // this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;
        this.getOfficeSummaryList();
    }

    /**
     * @description TO get the rows of Data
     * @param event event
     */

    getOfficeSummaryList(event: any = null) {
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: this.getSearchFilter()
        },
            self = this;
        if (!this.newSearch && this.storedData.length !== 0 &&
            ((this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize)))) {
            // If data already fetched
            // tslint:disable-next-line:max-line-length
            this.dataSource = new MatTableDataSource(this.storedData.slice((this.iteratablePageIndex * this.pageSize), ((this.iteratablePageIndex * this.pageSize) + this.pageSize)));
        } else {
            // If data needs to fetch from database.
            this.edpDdoOfficeService.getOfficeSummaryList(passData).subscribe((res) => {
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
                    // tslint:disable-next-line:max-line-length
                    self.dataSource = new MatTableDataSource(self.storedData.slice((self.iteratablePageIndex * self.pageSize), ((self.iteratablePageIndex * self.pageSize) + self.pageSize)));
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
                self.toastr.error(this.errorMessages['ERR_SUMMARY_LIST']);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSource = new MatTableDataSource([]);
            });
        }
    }

    /**
     * @description To get search parameters for Search Api
     */

    getSearchFilter() {
        const obj = this.searchSummaryForm.value;
        if (!obj.districtCode && !obj.districtId) {
            this.isSearch = 0;
        }
        const returnArray = [];
        // tslint:disable-next-line: forin
        for (const key in obj) {
            const currObj = {};
            currObj['key'] = key;
            if (key === 'districtCode') {
                currObj['value'] = (obj[key] || '').trim();
            } else if (key === 'districtId') {
                currObj['value'] = (obj[key] || 0);
            }
            returnArray.push(currObj);
        }
        return returnArray;
    }

    /**
     * @description Triggered when pagination is changed
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
            /**
             * Condition is for handle Go To Last Page button event.
             * set iteratablePageIndex to highest pageIndex so getData can load new set of data of current page index.
            */
            this.iteratablePageIndex = event.pageIndex;
        } else {
            this.iteratablePageIndex = this.iteratablePageIndex + 1;
        }
        this.getOfficeSummaryList(event);
    }

    /**
     * @description To sort the column
     */

    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getOfficeSummaryList();
    }

    /**
     * @descriptiontriggered when user click on numbers of ddo column in any row
     * @param element row data
     */

    ddoCountNavigate(element) {
        this.router.navigate(['../updation-list', element.ddoId, element.districtId, 2],
            {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
    }

    /**
     * @description when user click on numbers of non ddo column in an row
     * @param element row data
     */

    nonDdoCountNavigate(element) {
        this.router.navigate(['../updation-list', element.nonDDOId, element.districtId, 2],
            {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
    }

    /**
     * @description when user click on numbers of panchayat column in any row
     * @param element row data
     */

    panchayatCountNavigate(element) {
        this.router.navigate(['../updation-list', element.panchayatId, element.districtId, 2],
            {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
    }

    /**
     * @description when User CLick on total column in any row
     * @param element row data
     */

    ddoTotal(element) {
        this.router.navigate(['../updation-list', 0, element.districtId, 2],
            {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
    }

    /**
     * Go Back to DashBoard
     */

    goToDashboard() {
        const proceedMessage = msgConst.CONFIRMATION_DIALOG.CLOSE;
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
