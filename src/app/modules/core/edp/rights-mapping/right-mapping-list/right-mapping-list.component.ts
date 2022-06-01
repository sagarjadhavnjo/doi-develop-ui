import { StorageService } from './../../../../../shared/services/storage.service';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { CommonService } from './../../../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RightsMappingService } from '../services/right-mapping.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { UserRightViewDialogComponent } from '../user-right-view-dialog/user-right-view-dialog.component';
import { DatePipe } from '@angular/common';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';

@Component({
    selector: 'app-right-mapping-list',
    templateUrl: './right-mapping-list.component.html',
    styleUrls: ['./right-mapping-list.component.css']
})
export class RightMappingListComponent implements OnInit {
    totalRecords: Number = 0;
    paginationArray;
    sortBy: String = '';
    sortOrder: String = '';
    pageSize = 0;
    pageIndex = 1;
    pageEvent: any;
    customPageIndex = 1;
    iteratablePageIndex = 0;
    searchValues: any[] = [];
    pageElements = 250;
    storedData: any[] = [];
    searchListForm: FormGroup;
    statusList = [];
    workFlowStatusList = [];

    fromDate = new Date();
    fromMaxDate = new Date();
    toMinDate: Date;
    toMaxDate = new Date();

    public subObjectFilterCtrl: FormControl = new FormControl();
    public statusCtrl: FormControl = new FormControl();
    wfStatusCtrl: FormControl = new FormControl();
    public filteredSubObjects: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    displayedColumns: string[] = [
        'srNo', 'trnNo', 'trnDate', 'district',
        'ddoNo', 'cardexNo', 'ddoOffice', 'empNo',
        'empName', 'lyingWith', 'status', 'wfStatus', 'action'
    ];

    dataSource = new MatTableDataSource<any>([]);
    private paginator: MatPaginator;
    private sort: MatSort;

    errorMessages = msgConst;
    commonSubscription: Subscription[] = [];
    postId;
    userOffice;
    disableSearchValue = true;
    rightMappingSearch = false;
    user: any = {};
    conditionalData: any[] = [];
    districtList: any[] = [];
    defaultUserRightMapped;
    approvedUserRightMapped;
    unApprovedUserRightMapped;
    finYearCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();

    estimationFromCtrl: FormControl = new FormControl();

    displayedColumnsFooter: string[] = ['srNo'];

    deleteResult: string = '';

    @ViewChild('singleSelect') singleSelect: MatSelect;
    selectedPostOfficeUserId: any;
    empName: any;
    empNo: any;
    postName: any;
    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;
    constructor(
        public dialog: MatDialog,
        private fb: FormBuilder,
        private rightsMappingService: RightsMappingService,
        private router: Router,
        private toastr: ToastrService,
        private commonService: CommonService,
        private route: ActivatedRoute,
        private storageService: StorageService,

    ) { }

    @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }

    @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    setDataSourceAttributes() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnInit() {
        const currentUser = this.storageService.get('currentUser');
        this.userOffice = this.storageService.get('userOffice');
        const primaryPost = currentUser['post'].filter((item) => item['primaryPost'] === true);
        if (primaryPost && primaryPost[0]) {
            this.postId = primaryPost[0]['postId'];
        }
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.pageSize = 25;
        this.getStatus();
        this.getAllDistrict();
        this.createSearchForm();
        this.getData();
        // this.errorMsg = msgConst;
    }

    resetToDate() {
        this.toMinDate = new Date(this.searchListForm.controls.trnFromDate.value);
        this.searchListForm.controls.trnToDate.setValue('');
    }

    getStatus() {

        this.rightsMappingService.getListingStatus('').subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                this.statusList = res.result.transStatusList;
                this.workFlowStatusList = res.result.workFlowStatusList;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    createSearchForm() {
        this.searchListForm = this.fb.group({
            trnNo: [''],
            trnFromDate: [''],
            trnToDate: [''],
            employeeNo: [''],
            employeeName: [''],
            districtId: [''],
            ddoNo: [''],
            cardexNo: [''],
            statusId: [''],
            wfStatusId: ['']
        });
    }

    getAllDistrict() {
        this.rightsMappingService.getDistricts().subscribe(
            res => {
                if (res && res['result'] && res['result'].length > 0) {
                    const distData = _.orderBy(res['result'], 'name', 'asc');
                    this.districtList = _.cloneDeep(distData);
                }
            },
            err => {
                this.toastr.error('Some error while fetching District !');
            }
        );
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

    onSubmitSearch() {
        this.rightMappingSearch = true;
        this.pageIndex = 1;
        this.customPageIndex = 1;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.getData();
    }
    getSearchFilter() {
        const obj = this.searchListForm.value;
        const returnArray = [];
        // tslint:disable-next-line: forin
        for (const key in obj) {
            const currObj = {};
            currObj['key'] = key;
            if (key === 'trnNo' || key === 'trnFromDate' || key === 'trnToDate'
                || key === 'employeeName' || key === 'statusId' || key === 'wfStatusId' || key === 'ddoNo') {
                if (key === 'trnFromDate' || key === 'trnToDate') {
                    if (obj['trnFromDate'] || obj['trnToDate']) {
                        if (!(obj['trnFromDate'] && obj['trnToDate'])) {
                            if (!obj['trnFromDate']) {
                                this.toastr.error(this.errorMessages.RIGHTS_MAPPING.LIST.FROM_DATE);
                            } else {
                                this.toastr.error(this.errorMessages.RIGHTS_MAPPING.LIST.TO_DATE);
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
                value: this.searchListForm.dirty ? 0 : 1
            },
            {
                key: 'menuId',
                value: EdpDataConst.MENU.RIGHTS_MAPPING.LISTING
                // As we are traversing from post transfer screen to listing there is no
                // way to dynamic assign menu id
            }
        );
        return returnArray;
    }
    getData(event: any = null) {
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: this.getSearchFilter()
        };
        const self = this;
        if (passData.jsonArr) {
            // tslint:disable-next-line:max-line-length
            if (
                !this.rightMappingSearch &&
                this.storedData.length !== 0 &&
                this.iteratablePageIndex + 1 <= Math.ceil(this.pageElements / this.pageSize)
            ) {
                // If data already fetched
                // tslint:disable-next-line:max-line-length
                this.dataSource = new MatTableDataSource(
                    this.storedData.slice(
                        this.iteratablePageIndex * this.pageSize,
                        this.iteratablePageIndex * this.pageSize + this.pageSize
                    )
                );
            } else {
                // If data needs to fetch from database.pass'
                this.rightsMappingService.getUserRightsList(passData).subscribe(
                    res => {
                        self.rightMappingSearch = false;
                        if (res && res['status'] === 200) {
                            // For customize pagination
                            self.storedData = _.cloneDeep(res['result']['result']);
                            // tslint:disable-next-line:max-line-length
                            if (
                                event != null &&
                                event.pageIndex < event.previousPageIndex &&
                                self.iteratablePageIndex - 1 === Math.ceil(self.pageElements / self.pageSize)
                            ) {
                                self.iteratablePageIndex = Math.ceil(self.pageElements / self.pageSize) - 1;
                                /*
                            below if Condition is to handle button of 'Go First Page'
                            Reset iteratablePageIndex to 0
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
                                 * else if conditin to handle button of 'Go Last Page'
                                 * reset iteratablePageIndex to last pageIndex of particular pageSet
                                 */
                                self.iteratablePageIndex = Math.ceil(self.storedData.length / self.pageSize) - 1;
                            } else {
                                self.iteratablePageIndex = 0;
                            }

                            // tslint:disable-next-line:max-line-length
                            self.dataSource = new MatTableDataSource(
                                self.storedData.slice(
                                    self.iteratablePageIndex * self.pageSize,
                                    self.iteratablePageIndex * self.pageSize + self.pageSize
                                )
                            );

                            // self.dataSource = new MatTableDataSource(res['result']);
                            self.totalRecords = res['result']['totalElement'];
                            self.dataSource.sort = self.sort;
                        } else {
                            self.storedData = [];
                            // tslint:disable-next-line:max-line-length
                            self.dataSource = new MatTableDataSource(self.storedData);
                            self.toastr.error(res['message']);
                            // self.dataSource = new MatTableDataSource(res['result']);
                            self.totalRecords = 0;
                            self.pageIndex = 0;
                            self.customPageIndex = 0;
                            self.iteratablePageIndex = 0;
                            self.dataSource.sort = self.sort;
                        }
                    },
                    err => {
                        self.toastr.error(err['message']);
                        self.totalRecords = 0;
                        self.pageIndex = 0;
                        self.customPageIndex = 0;
                        self.iteratablePageIndex = 0;
                        self.dataSource = new MatTableDataSource([]);
                    }
                );
            }
        }
    }

    onPaginateChange(event) {
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
        this.getData(event);
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    clearForm() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.searchListForm.reset();
            }
        });
    }

    showConfirmationPopup(element, tranStatus) {
        this.selectedPostOfficeUserId = element.transactionId;
        const self = this;
        const param = {
            id: this.selectedPostOfficeUserId,
            status: tranStatus
        };
        this.rightsMappingService.getApprovedUserMappedRights(param).subscribe(res => {
            if (res['status'] === 200) {
                self.approvedUserRightMapped = res['result'];
            } else {
                self.approvedUserRightMapped = [];
                self.toastr.error(res['message']);
            }
            const dialogRef = this.dialog.open(UserRightViewDialogComponent, {
                width: '100%',
                panelClass: 'UserRightViewDialog',
                height: '500px',
                data: {
                    user: res['result']['edpPrmRights'][0],
                    userRights: _.cloneDeep(self.approvedUserRightMapped),
                    tranStatus: tranStatus
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                return result;
            });
        }, err => {
            self.toastr.error(err);
        });
    }
    editRightsMapping(element) {
        const isWfStatusDraft = element.wfStatus.toLowerCase() === 'draft' ? true : false;
        this.router.navigate(
            [
                '../edit', element.transactionId, element.ddoNo,
                element.cardexNo, element.districtId, element.district,
                element.status, element.trnNo, element.trnDate, isWfStatusDraft
            ], {
            relativeTo: this.route,
            skipLocationChange: true
        });
    }
    viewRightMapping(element) {
        const isWfStatusDraft = element.wfStatus.toLowerCase() === 'draft' ? true : false;
        this.router.navigate(
            [
                '../view', element.transactionId, element.ddoNo,
                element.cardexNo, element.districtId, element.district,
                element.status, element.trnNo, element.trnDate, isWfStatusDraft
            ], {
            relativeTo: this.route,
            skipLocationChange: true
        });
    }
    delete(element) {
        const self = this;
        const param = {
            id: Number(element.transactionId)
        };
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.rightsMappingService.deleteUserRights(param).subscribe(res => {
                    if (res && res['status'] === 200) {
                        self.toastr.success(res['message']);
                        this.pageIndex = 1;
                        this.customPageIndex = 1;
                        this.rightMappingSearch = true;
                        this.getData();
                    } else {
                        self.toastr.error(res['message']);
                    }
                }, err => {
                    self.toastr.error(err['message']);
                });
            }
        });
    }
}
