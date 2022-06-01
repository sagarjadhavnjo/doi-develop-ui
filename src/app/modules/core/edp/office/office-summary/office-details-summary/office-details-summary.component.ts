import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EdpDdoOfficeService } from '../../../services/edp-ddo-office.service';
import { Router, ActivatedRoute } from '@angular/router';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import * as _ from 'lodash';
import { District, DesignationOfDdo, DdoType, Hod, Department, Status } from '../../../model/office-data-model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-detailsummary',
    templateUrl: './office-details-summary.component.html',
    styleUrls: ['./office-details-summary.component.css']
})
export class OfficeDetailsSummaryComponent implements OnInit {

    searchForm: FormGroup;
    districtId: string;
    ddoType: string;
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
    isShow: Boolean;
    officeId: number;

    displayedBrowseColumns: string[] = [
        'id', 'districtCode', 'districtName', 'ddoNo', 'cardexNo', 'designName',
        'officeName', 'officeType', 'ddoType', 'isThisControllingOfc',
        'referenceDate', 'endDate', 'status', 'action'
    ];
    displayedColumnsFooter: string[] = ['id'];
    dataSource = new MatTableDataSource([]);
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    pageEvent: any;
    private sort: MatSort;

    districtList: District[] = [];
    designationList: DesignationOfDdo[] = [];
    ddoTypeList: DdoType[] = [];
    adminDepartList: Department[] = [];
    hodList: Hod[] = [];
    statusList: Status[] = [];
    statusListData: Status[] = [];
    ControlingOfficeList;
    officeTypeList;

    districtCtrl: FormControl = new FormControl();
    designationCtrl: FormControl = new FormControl();
    ddoTypeCtrl: FormControl = new FormControl();
    adminDepartCtrl: FormControl = new FormControl();
    hodCtrl: FormControl = new FormControl();
    statusCtrl: FormControl = new FormControl();
    controlOfctrl: FormControl = new FormControl();
    officeTypeCtrl: FormControl = new FormControl();
    @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
        this.sort = ms;
    }

    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;

    constructor(
        public fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private storageService: StorageService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private edpDdoOfficeService: EdpDdoOfficeService,
    ) { }
    ngOnInit() {
        this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
        const userOffice = this.storageService.get('userOffice');
        this.officeId = userOffice['officeId'];
        this.districtId = this.route.snapshot.paramMap.get('distId');
        this.ddoType = this.route.snapshot.paramMap.get('typeId');
        this.errorMessages = msgConst.OFFICE_SUMMARY;
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.createForm();
        this.getOfficeDetails();
        this.getOfficeSummaryUpdateList();
    }
    createForm() {
        this.searchForm = this.fb.group({
            districtCode: [''],
            districtId: [''],
            officeName: [''],
            designationId: [''],
            ddoNo: [''],
            cardexNo: [''],
            ddoTypeId: [''],
            departmentId: [''],
            hodId: [''],
            officeStatus: [''],
            isCntOffice: [''],
            officeTypeId: ['']
        });
    }

    clearForm() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.searchForm.reset();
                this.hodList = [];
            }
        });
    }

    getOfficeDetails() {
        this.edpDdoOfficeService.getOfficeDetails('').subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.districtList = res['result']['districts'];
                this.designationList = res['result']['designationOfDdo'];
                this.statusList = _.cloneDeep(res['result']['updateStatus']);
                this.ddoTypeList = res['result']['ddoType'];
                this.adminDepartList = res['result']['departments'];
                this.officeTypeList = res['result']['officeType'];
                this.ControlingOfficeList = res['result']['controllingOffice'];
            } else {
                this.toastr.error(res['message']);
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages['ERR_OFFICE_MASTER_DATA']);
            });
    }

    loadHodList() {
        if (
            !this.searchForm.controls.departmentId.value
        ) {
            this.hodList = null;
            this.searchForm.controls.hodId.reset();
            return;
        }
        const param = {
            id: this.searchForm.controls.departmentId.value
        };
        this.edpDdoOfficeService.getHodList(param).subscribe((hodRes) => {
            if (hodRes && hodRes['result'] && hodRes['status'] === 200) {
                this.hodList = hodRes['result'];
            } else {
                this.toastr.error(hodRes['message']);
            }
        }, (hodErr) => {
            this.toastr.error(this.errorMessages['HOD_LIST']);
        });
    }

    searchList() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;
        this.getOfficeSummaryUpdateList();
    }

    getOfficeSummaryUpdateList(event: any = null) {
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: this.getSearchFilter()
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
            this.edpDdoOfficeService.getOfficeSummaryDetailList(passData).subscribe((res) => {
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
                    self.dataSource = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize,
                        (self.iteratablePageIndex * self.pageSize) + self.pageSize
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
                self.toastr.error(this.errorMessages['ERR_SUMMARY_UPDATE_LIST']);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSource = new MatTableDataSource([]);
            });
        }
    }

    getSearchFilter() {
        const obj = this.searchForm.value;
        if (!obj.districtCode && !obj.districtId && !obj.officeName && !obj.designationId && !obj.ddoNo &&
            !obj.cardexNo && !obj.ddoTypeId && !obj.departmentId && !obj.hodId && !obj.statusId) {
            this.isSearch = 0;
        }
        const returnArray = [];
        // tslint:disable-next-line: forin
        for (const key in obj) {
            const currObj = {};
            currObj['key'] = key;
            if (key === 'districtCode' || key === 'officeName' || key === 'ddoNo') {
                currObj['value'] = (obj[key] || '').trim();
            } else if (key === 'districtId' || key === 'designationId' || key === 'ddoTypeId' || key === 'cardexNo' ||
                key === 'departmentId' || key === 'hodId' || key === 'officeStatus' ||
                key === 'isCntOffice' || key === 'officeTypeId') {
                if (this.isSearch === 0) {
                    if (key === 'districtId') {
                        currObj['value'] = (obj[key] || 0);
                    } else if (key === 'ddoTypeId') {
                        currObj['value'] = 0;
                    } else {
                        currObj['value'] = (obj[key] || 0);
                    }
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
        this.getOfficeSummaryUpdateList(event);
    }
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getOfficeSummaryUpdateList();
    }
    editUpdateOffice(element, action) {
        this.router.navigate(['./dashboard/edp/office/update', action, element.officeId, '', 1, element.referenceDate],
            { skipLocationChange: true });
    }
    goToListing() {
        this.router.navigate(['/dashboard/edp/office/summary'], { skipLocationChange: true });
    }
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

    checkHodList() {
        const departName = this.searchForm.controls.departmentId.value;
        if (departName === '' || departName === null || departName === undefined) {
            this.toastr.error(this.errorMessages['ADDMIN_DEPT']);
            this.hodList = [];
            return false;
        }
    }

    /**
     * @description edit button will be disabled in case of Cancel and Transfer Status
     * @param status status
     */

    enableEdit(status: string): boolean {
        if (!status) {
            status = 'Active';
        }
        const statusList = [EdpDataConst.CANCEL_STATUS, EdpDataConst.TRANSFER_NAME_STATUS];
        if (statusList.includes(status.toLowerCase())) {
            return false;
        }
        return true;
    }
}
