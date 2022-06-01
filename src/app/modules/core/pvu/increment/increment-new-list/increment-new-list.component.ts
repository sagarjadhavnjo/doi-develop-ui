import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { IncrementListService } from '../services/increment-list.service';
// tslint:disable-next-line: max-line-length
import { listTypeName } from 'src/app/modules/core/pvu/increment/models/increment-list';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { BehaviorSubject } from 'rxjs';
import { PvuCommonService } from '../../pvu-common/services/pvu-common.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CommonService } from 'src/app/modules/services/common.service';
@Component({
    selector: 'app-increment-new-list',
    templateUrl: './increment-new-list.component.html',
    styleUrls: ['./increment-new-list.component.css']
})
export class IncrementNewListComponent implements OnInit {

    incrementSearchForm: FormGroup;

    fromDate = new Date();
    fromMaxDate = new Date();
    toMinDate: Date;
    toMaxDate = new Date();
    variableClm = new BehaviorSubject<string[]>(['noData']);
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
    pageEvent: any;
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    errorMessages = {};
    loggedUserObj;
    officeTypeId: string;
    officeId: number;
    menuId: number;
    currentPost: any;
    displayedColumnsFooter: string[] = ['id'];
    incrementListDataSource = new MatTableDataSource([]);
    incrementDisplayedColumns = [
        'id', 'refNo', 'refDate', 'ddoCode', 'cardexNo', 'officeName', 'financialYear', 'incrementFor', 'empPayType', 'totalCount', 'successCount', 'failureCount', 'tranStatus', 'wfStatus', 'action'
    ];
    action: any;
    financialYearList: any;
    empTypeList: listTypeName[] = [];
    empPayTypeList: listTypeName[] = [];
    classList: listTypeName[] = [];
    incrementForList: listTypeName[] = [];
    workflowStatusList: object[] = [];
    transStatusList: object[] = [];
    officeName_list: object[] = [];
    incrementForCtrl: FormControl = new FormControl();
    finYearCtrl: FormControl = new FormControl();
    empPayTypeCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
    classCtrl: FormControl = new FormControl();
    workflowStatusCtrl: FormControl = new FormControl();
    transStatusCtrl: FormControl = new FormControl();

    constructor(
        public dialog: MatDialog,
        private fb: FormBuilder,
        private router: Router,
        private toaster: ToastrService,
        private route: ActivatedRoute,
        private datepipe: DatePipe,
        private toastr: ToastrService,
        private incrementListService: IncrementListService,
        private pvuService: PvuCommonService,
        private commonService: CommonService,
        private storageService: StorageService
    ) { }

    ngOnInit() {
        const userOffice = this.storageService.get('currentUser');
        if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
            this.currentPost = userOffice['post'].filter((item) => item['loginPost'] === true);
        }
        this.createForm();
        this.getLookupDetails();
        this.getFinancialYears();
        this.errorMessages = pvuMessage;
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.incrementListDataSource.sort = this.sort;
        this.pvuService.getCurrentUserMultipleRoleDetail().then(res => {
            if (res) {
                this.loggedUserObj = res;
                this.menuId = res['menuId'];
                if (res['officeDetail']) {
                    this.officeId = +res['officeDetail']['officeId'];
                    const officeName = res['officeDetail']['officeName'];
                    this.officeTypeId = res['officeDetail']['officeTypeId'];
                    this.officeName_list.push({ 'officeId': this.officeId, 'name': officeName });
                }
                if (this.incrementSearchForm.get('financialYear').value) {
                    this.getIncrementDataList();
                }
                this.getWorkflowStatus();
            }
        });
    }

    resetToDate() {
        this.toMinDate = new Date(this.incrementSearchForm.controls.fromDate.value);
        this.incrementSearchForm.controls.toDate.setValue('');
    }

    /**
     * /@function  createForm
     *  @description Creation of Increment listing Form Group
     *  @param -
     *  @returns Creation of Increment listing Form
     */
    createForm() {
        this.incrementSearchForm = this.fb.group({
            ddoCode: [this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['ddoNo']],
            cardexNo: [this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['cardexno']],
            officeName: [this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeName']],
            district: [this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['districtName']],
            fromDate: [''],
            toDate: [''],
            transNo: [''],
            referenceDate: [''],
            financialYear: [''],
            incrementFor: [''],
            payTypeId: [0],
            wfStatus: [''],
            statusId: ['']
        });
    }

    /**
     * /@function getFinancialYears
     * @description To get lookup values of current Year
     * @param -
     * @returns Get lookup value of current Year
     */
    getFinancialYears() {
        this.commonService.getAllFinancialYears().subscribe((res) => {
            if (res && res['result'] && res['result'].length > 0) {

                const date = new Date();
                const currentYear = date.getFullYear();
                this.financialYearList = res['result'].filter(item => item.fyStart <= currentYear);
                this.financialYearList = _.orderBy(this.financialYearList, 'fyStart', 'asc');
                const fId = this.financialYearList.filter(year => {
                    return year.fyStart === currentYear;
                })[0];
                this.incrementSearchForm.patchValue({
                    financialYear: fId.financialYearId
                });
                
                if (this.loggedUserObj && this.loggedUserObj.officeDetail) {
                    this.getIncrementDataList();
                }
            }
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    /**
     * /@function  resetForm
     *  @description Reset the increment form
     *  @param -
     *  @returns Reset increment form values
     */
    clearForm() {
        this.resetListing();
    }


    resetListing() {
        this.incrementSearchForm.patchValue({
            fromDate: '',
            toDate: '',
            incrementFor: '',
            transNo: '',
            referenceDate: '',
            // payTypeId: '',
            empTypeId: '',
            classId: '',
            wfStatus: '',
            statusId: '',
        });
        this.incrementListDataSource = new MatTableDataSource([]);
        const date = new Date();
        const currentYear = date.getFullYear();
        if (this.financialYearList) {
            const fId = this.financialYearList.filter(year => {
                return year.fyStart === currentYear;
            })[0];
            this.incrementSearchForm.patchValue({
                financialYear: fId.financialYearId
            });
        }
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
     * /@function  onEdit
     *  @description To edit the selected increment transaction
     * @param id eventId
     * @returns Edit transaction
     */
    onEdit(id) {
        this.router.navigate(['../', 'edit', id], { relativeTo: this.route, skipLocationChange: true });
    }

    /**
     * /@function  onView
     *  @description To view the selected transaction
     * @param id eventId
     * @returns View transaction
     */
    onView(id) {
        this.router.navigate(['../', 'view', id], { relativeTo: this.route, skipLocationChange: true });
    }

    /**
     * /@function getLookupDetails
     * @description To Fetch all Lookup data
     * @param -
     * @returns Fetch all Lookup data
     */
    getLookupDetails() {
        this.incrementListService.getLookupDetails('').subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.empTypeList = res['result']['Emp_Type'];
                this.empPayTypeList = res['result']['Employee_PayType'];
                this.empPayTypeList.splice(0, 0, {lookupInfoId: 0, lookupInfoName: 'All'});
                this.incrementForList = res['result']['Dept_Pay_Commission'];
                this.transStatusList = res['result']['Increment_Status_Id'];
                // this.eventNameList = res['result']['Status_id'];
            }
        },
            (err) => {
                this.toastr.error(err);
            });
    }

    /**
     * /@function onSubmitSearch
     * @description To get the list on the selection
     * @param -
     * @returns Get the list
     */
    onSubmitSearch() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;
        this.getIncrementDataList();
    }

    /**
     * /@function getWorkflowStatus
     * @description To get the lookup values of the workflow field
     * @param -
     * @returns Get the lookup values
     */
    getWorkflowStatus() {
        // console.log(this.loggedUserObj['menuId']);
        const param = {
            id: this.loggedUserObj['menuId']
        };
        this.incrementListService.getWorkFlowStatus(param).subscribe((res) => {
            if (res && res['result'] && res['result'].length > 0) {
                this.workflowStatusList = res['result'];
            }
        });
    }

    /**
     * /@function getIncrementDataList
     * @description To get the increment transaction List
     * @param event search parameter
     * @returns Get the increment transaction List
     */
    getIncrementDataList(event: any = null) {
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
            this.incrementListDataSource = new MatTableDataSource(
                this.storedData.slice(
                    this.iteratablePageIndex * this.pageSize,
                    this.iteratablePageIndex * this.pageSize + this.pageSize
                ));
        } else {
            // If data needs to fetch from database.
            this.incrementListService.getIncrementList(passData).subscribe((res) => {
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
                    self.incrementListDataSource = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize, (
                            self.iteratablePageIndex * self.pageSize
                        ) + self.pageSize
                    ));

                    if (self.storedData.length > 0) {
                        self.variableClm.next(this.incrementDisplayedColumns);
                    } else {
                        self.variableClm.next(['noData']);
                        self.incrementListDataSource = new MatTableDataSource(['noData']);
                    }
                    self.totalRecords = res['result']['totalElement'];
                    setTimeout(() => {
                        self.incrementListDataSource.sort = self.sort;
                    });
                    // console.log(self.incrementListDataSource.data);
                    self.totalRecords = res['result']['totalElement'];
                    self.incrementListDataSource.sort = self.sort;
                } else {
                    self.storedData = ['noData'];
                    self.incrementListDataSource = new MatTableDataSource(self.storedData);
                    self.variableClm.next(['noData']);
                    self.toaster.error(res['message']);
                    self.totalRecords = 0;
                    self.pageIndex = 0;
                    self.customPageIndex = 0;
                    self.iteratablePageIndex = 0;
                    self.incrementListDataSource.sort = self.sort;
                }
            }, (err) => {
                self.toaster.error(err);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.incrementListDataSource = new MatTableDataSource(['noData']);
            });
        }
    }

    /**
     * /@function getSearchFilter
     * @description To get the search data on the selection of parameters
     * @param event search parameter
     * @returns Get the search data List
     */
    getSearchFilter() {
        const obj = this.incrementSearchForm.getRawValue();
        obj['financialYearId'] = obj.financialYear;
        if (
            !obj.ddoCode &&
            !obj.cardexNo &&
            !obj.officeName &&
            !obj.district &&
            !obj.fromDate &&
            !obj.toDate &&
            !obj.transNo &&
            !obj.referenceDate &&
            !obj.financialYearId &&
            !obj.payTypeId &&
            !obj.officeId &&
            !obj.postId &&
            !obj.lkPoOffUserId &&
            !obj.menuId &&
            !obj.wfRoleIds &&
            !obj.wfStatus &&
            !obj.statusId
        ) {
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
            if (key === 'transNo' || key === 'fromDate' || key === 'toDate' || key === 'referenceDate' || key === 'wfStatus') {
                if (key === 'fromDate' || key === 'toDate' || key === 'referenceDate') {
                    // if (obj['fromDate'] || obj['toDate'] || obj['referenceDate']) {
                    //     if (!(obj['fromDate'] && obj['toDate'] && obj['referenceDate'])) {
                    //         if (!obj['fromDate']) {
                    //             this.toastr.error(this.errorMessages['INCREMENT_LIST']['FROM_DATE']);
                    //         } else if (!obj['toDate']) {
                    //             this.toastr.error(this.errorMessages['INCREMENT_LIST']['TO_DATE']);
                    //         } else {
                    //             this.toastr.error(this.errorMessages['INCREMENT_LIST']['REFERENCE_DATE']);
                    //         }
                    //         return false;
                    //     }
                    // }
                    const datePipe = new DatePipe('en-US');
                    currObj['value'] = (datePipe.transform(obj[key], 'MM/dd/yyyy') || '');
                } else {
                    currObj['value'] = (obj[key] || '').trim();
                }
            } else if (
                key === 'ddoCode' || key === 'cardexNo' ||
                key === 'officeName' || key === 'district' || key === 'statusId' ||
                // key === 'eventId' ||
                key === 'payTypeId' || key === 'financialYearId' || key === '  ' ||
                key === 'incrementFor' || 
                key === 'officeId' || key === 'postId' ||
                key === 'menuId' || key === 'wfRoleIds') {
                if (key === 'payTypeId') {
                    currObj['value'] = Number(obj[key] || 0);
                } else {
                    currObj['value'] = (obj[key] || 0);
                }
            }
            returnArray.push(currObj);
        }
        returnArray.push({ 'key': 'postId', 'value': this.loggedUserObj['postId'] });
        returnArray.push({ 'key': 'menuId', 'value': this.loggedUserObj['menuId'] });
        returnArray.push({ 'key': 'lkPoOffUserId', 'value': this.loggedUserObj['lkPoOffUserId'] });

        returnArray.push({ 'key': 'officeId', 'value': this.loggedUserObj['officeDetail']['officeId'] });
        returnArray.push({ 'key': 'districtId', 'value': this.loggedUserObj['officeDetail']['districtId'] });
        returnArray.push({ 'key': 'wfStatusId', 'value': 0 });
        returnArray.push(
            {
                'key': 'wfRoleIds',
                'value': this.loggedUserObj['wfRoleId'] ? this.loggedUserObj['wfRoleId'].toString() : ''
            });
        return returnArray;
    }

    /**
     * /@function convertDateFormat
     * @description Convert the date object in the MM/dd/yyyy format
     * @param date Date object
     * @returns Convert date in the MM/dd/yyyy format
     */
    convertDateFormat(date) {
        if (date !== '' && date !== undefined && date != null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'MM/dd/yyyy');
        }
        return '';
    }

    /**
     * /@function onPaginateChange
     * @description On pagination change get the List data
     * @param event list parameter
     * @returns On pagination change get the List data
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
        this.getIncrementDataList(event);
    }

    /**
     * /@function onPaginateChange
     * @description To sort the listing data
     * @param -
     * @returns sort the listing data
     */
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getIncrementDataList();
    }

    /**
     * To delete the Rop from list
     * @param element selected record data
     */
    showConfirmationPopup(element) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.incrementListService.deleteRecord({ 'id': element.eventId }).subscribe((res) => {
                    if (res && res['status'] === 200 && res['message']) {
                        this.toastr.success(res['message']);
                        this.newSearch = true;
                        this.getIncrementDataList();
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

