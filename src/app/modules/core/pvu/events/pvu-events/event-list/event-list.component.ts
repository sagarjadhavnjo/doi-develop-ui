import { EVENT_ERRORS } from './../index';
import { ValidationService } from 'src/app/modules/services/validatation.service';
import { ActivatedRoute } from '@angular/router';
import { PvuCommonService } from './../../../pvu-common/services/pvu-common.service';
import { StorageService } from './../../../../../../shared/services/storage.service';
import { PVUEventsService } from '../services/pvu-event.service';
import { DataConst } from '../../../../../../shared/constants/common/common-data.constants';
import { MatDialog } from '@angular/material/dialog';
import { Component, Directive, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
// tslint:disable-next-line:max-line-length
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Observable, Subject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
// // import { containsElement } from '@angular/animations/browser/src/render/shared';

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.css']
})
export class PVUEventListComponent implements OnInit, OnDestroy {
    today = new Date();
    totalRecords: number = 0;
    paginationArray;
    sortBy: string = '';
    sortOrder: string = '';
    pageSize = 0;
    pageIndex = 0;
    isSearch: any = 0;
    pageEvent: any;
    customPageIndex = 0;
    iteratablePageIndex = 0;
    searchValues: any[] = [];
    pageElements = 250;
    storedData: any[] = [];
    searchEstimateForm: FormGroup;
    private _onDestroy = new Subject<void>();

    public subObjectFilterCtrl: FormControl = new FormControl();
    public filteredSubObjects: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    eventsNameCtrl: FormControl = new FormControl();
    eventList = [];
    designationCtrl: FormControl = new FormControl();
    designationList = [];
    classList = [];
    classCtrl: FormControl = new FormControl();
    officeNameCtrl: FormControl = new FormControl();
    empTypeList = [];
    empTypeCtrl: FormControl = new FormControl();
    displayedColumns: string[] = [
        'id',
        'trnNo',
        'eventName',
        'empNo',
        'empName',
        'designation',
        'empType',
        'officeName',
        'status',
        'wfStatus',
        'action'
    ];

    dataSource = new MatTableDataSource<any>([]);
    private paginator: MatPaginator;
    private sort: MatSort;

    // tslint:disable-next-line:member-ordering
    errorMessages = EVENT_ERRORS;

    commonSubscription: Subscription[] = [];

    disableSearchValue = true;
    newSearch = false;
    user: any = {};
    conditionalData: any[] = [];
    subHeadCodeCtrl: FormControl = new FormControl();
    filteredSubHeadCode: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    userInfo;
    userOffice;
    sectorData: any = {};
    displayedColumnsFooter: string[] = ['id'];
    isPVUOffice: boolean = false;
    loggedUserObj: any;
    officeTypeId: string;
    officeName: string;
    officeId: number;
    menuId: number;
    indexedItem: number;
    subscribeParams: Subscription[] = [];
    workflowStatusList: object[] = [];
    workflowStatusCtrl: FormControl = new FormControl();
    @ViewChild('singleSelect') singleSelect: MatSelect;

    constructor(
        public dialog: MatDialog,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private eventService: PVUEventsService,
        private storageService: StorageService,
        private pvuService: PvuCommonService,
        private activatedRoute: ActivatedRoute
    ) { }

    @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }

    @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    /**
     * @method setDataSourceAttributes
     * @description Call when mat sort and paginator are loaded in view to set to mat table
     */
    setDataSourceAttributes() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        const self = this;
        self.userInfo = self.storageService.get('currentUser');
        self.userOffice = self.storageService.get('userOffice');
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.dataSource.sort = this.sort;

        this.createSearchForm();
        this.getLookupDetails();
        this.getEventList();
        this.getDesignationList();
        this.pvuService.getCurrentUserMultipleRoleDetail().then(res => {
            if (res) {
                this.loggedUserObj = res;
                this.menuId = res['menuId'];
                if (res['officeDetail']) {
                    this.officeName = res['officeDetail']['officeName'];
                    this.officeId = res['officeDetail']['officeId'];
                }
                if (this.searchEstimateForm) {
                    this.searchEstimateForm.patchValue({
                        officeName: this.officeName
                    });
                }
                this.getWorkflowStatus();
                self.subscribeParams.push(self.activatedRoute.params.subscribe(resRoute => {
                    if (resRoute.event) {
                        self.searchEstimateForm.patchValue({
                            eventCode: resRoute.event
                        });
                        self.onSubmitSearch();
                    }
                }));
            }
        });
    }

    /**
     * @method getWorkflowStatus
     * @description Function is called to get all status of workflow
     */
    getWorkflowStatus() {
        const param = {
            id: this.loggedUserObj['menuId']
        };
        this.eventService.getWorkFlowStatus(param).subscribe((res) => {
            if (res && res['result'] && res['result'].length > 0) {
                this.workflowStatusList = res['result'];
            }
        });
    }

    /**
     * @method getLookupDetails
     * @description Function is called to get constants from server
     */
    getLookupDetails() {
        this.eventService.getLookupDetails('').subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.empTypeList = res['result']['Emp_Type'];
                this.classList = res['result']['Dept_Class'];
            }
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    /**
     * @method getDesignationList
     * @description Function is called to get all designations
     */
    getDesignationList() {
        const self = this;
        self.eventService.getDesignations().subscribe(res => {
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
     * @method getEventList
     * @description Function is called to get all PVU events
     */
    getEventList() {
        const self = this;
        self.eventService.getPVUEvents().subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.eventList = res['result'];
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    /**
     * @method createSearchForm
     * @description Function is called to initialize form group for search form
     */
    createSearchForm() {
        this.searchEstimateForm = this.fb.group({
            'empNo': [],
            'eventCode': ['', Validators.required],
            'startDate': [],
            'endDate': [],
            'empName': [],
            'designationId': [],
            'gpfNo': [],
            'pPan': ['', ValidationService.panCardValidation],
            'retirementDate': [],
            'caseNo': [],
            'classId': [],
            'empType': [],
            'officeName': [this.officeName],
            'wfStatus': [],
            'transNo': []
        });
    }

    /**
     * @method onSubmitSearch
     * @description Function is called to when search button is clicked
     */
    onSubmitSearch() {
        if (this.searchEstimateForm.invalid) {
            _.each(this.searchEstimateForm.controls, eventFormControl => {
                if (eventFormControl.status === 'INVALID') {
                    eventFormControl.markAsTouched({ onlySelf: true });
                }
            });
        } else {
            this.newSearch = true;
            this.pageIndex = 0;
            this.customPageIndex = 0;
            this.paginator.pageIndex = 0;
            this.iteratablePageIndex = 0;
            this.isSearch = 1;
            this.getData();
        }
    }

    /**
     * @method getSearchFilter
     * @description Function is called to get search filter in specific format
     * @returns array of searched parameters
     */
    getSearchFilter() {
        const obj = this.searchEstimateForm.value;

        // tslint:disable-next-line:max-line-length
        if (
            !obj.empNo &&
            !obj.startDate &&
            !obj.endDate &&
            !obj.empName &&
            !obj.designationId &&
            !obj.gpfNo &&
            !obj.pPan &&
            !obj.retirementDate &&
            !obj.caseNo &&
            !obj.classId &&
            !obj.empType &&
            !obj.wfStatus &&
            !obj.transNo
        ) {
            this.isSearch = 0;
        }
        const returnArray = [];
        const searchObj = {};
        searchObj['key'] = 'isSearch';
        searchObj['value'] = this.isSearch;
        returnArray.push(searchObj);
        // tslint:disable-next-line:forin
        for (const key in obj) {
            const currObj = {};
            currObj['key'] = key;
            if (key === 'empNo' ||
                key === 'designationId' ||
                key === 'classId' ||
                key === 'empType') {
                currObj['value'] = (obj[key] || 0);
            }
            if (
                key === 'gpfNo' ||
                key === 'pPan' ||
                key === 'eventCode' ||
                key === 'startDate' ||
                key === 'retirementDate' ||
                key === 'endDate' ||
                key === 'empName' ||
                key === 'caseNo' ||
                key === 'wfStatus' ||
                key === 'transNo') {
                if (
                    key === 'startDate' ||
                    key === 'retirementDate' ||
                    key === 'endDate') {
                    if (obj[key]) {
                        // tslint:disable-next-line:max-line-length
                        currObj['value'] = (obj[key].getMonth() + 1) + '/' + obj[key].getDate() + '/' + obj[key].getFullYear();
                    } else {
                        currObj['value'] = '';
                    }
                } else {
                    currObj['value'] = '' + (obj[key] || '');
                }
            }
            returnArray.push(currObj);
        }
        returnArray.push({ 'key': 'postId', 'value': this.loggedUserObj['postId'] });
        returnArray.push({ 'key': 'menuId', 'value': this.loggedUserObj['menuId'] });
        returnArray.push({ 'key': 'lkPoOffUserId', 'value': this.loggedUserObj['lkPoOffUserId'] });
        returnArray.push({ 'key': 'officeId', 'value': this.loggedUserObj['officeDetail']['officeId'] });
        returnArray.push({
            'key': 'wfRoleIds',
            'value': this.loggedUserObj['wfRoleId'] ? this.loggedUserObj['wfRoleId'].toString() : ''
        });
        returnArray.push({ 'key': 'eventsId', 'value': 0 });
        returnArray.push({ 'key': 'workflowId', 'value': 0 });
        return returnArray;
    }

    /**
     * @method getData
     * @description Function is called to get data from server or from the data kept in local
     * @param event which contains page size and page no.
     */
    getData(event: any = null) {
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            // sortByColumn: this.sortBy,
            // sortOrder: this.sortOrder,
            jsonArr: this.getSearchFilter()
        },
            self = this;

        // tslint:disable-next-line:max-line-length
        if (
            !this.newSearch &&
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
            // If data needs to fetch from database.
            this.eventService.getEventListing(passData, this.searchEstimateForm.value.eventCode).subscribe(
                res => {
                    self.newSearch = false;
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

    /**
     * @method onPaginateChange
     * @description Function is called when pagination buttons are clicked
     * @param event which contains page size and page no.
     */
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

    /**
     * @method applyFilter
     * @description Function is called to filter column from mat table
     */
    // Kept for future purposes
    // applyFilter(filterValue: string) {
    //     filterValue = filterValue.trim(); // Remove whitespace
    //     filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    //     this.dataSource.filter = filterValue;
    // }

    /**
     * @method ngOnDestroy
     * @description Function is called when compnent is destroyed to take necessary calls on view destroy from browser
     */
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    /**
     * @method clearForm
     * @description Function is called to clear entered search parameters
     */
    clearForm() {
        this.searchEstimateForm.reset();
        this.searchEstimateForm.patchValue({
            officeName: this.officeName
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
    }

    /**
     * To delete the Rop from list
     * @param element selected record data
     */
    delete(element) {
        const params = {
            'id': element.id
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                // tslint:disable-next-line: max-line-length
                this.eventService.deleteRecord(params, element.eventCode).subscribe((res) => {
                    if (res && res['status'] === 200 && res['message']) {
                        this.toastr.success(res['message']);
                        this.newSearch = true;
                        this.getData();
                    } else {
                        this.toastr.error(res['message']);
                    }
                }, (err) => {
                    this.toastr.error(err);
                });
            }
        });
    }
}
