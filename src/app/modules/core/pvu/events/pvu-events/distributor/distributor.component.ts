import { CommonService } from 'src/app/modules/services/common.service';
import { EVENT_ERRORS } from './../index';
import { PVUWorkflowService } from './../services/pvu-workflow.service';
import { ValidationService } from './../../../../../services/validatation.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PvuCommonService } from '../../../pvu-common/services/pvu-common.service';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-pvu-distributor',
    templateUrl: './distributor.component.html',
    styleUrls: ['./distributor.component.css']
})
export class PVUDistributorComponent implements OnInit {

    displayedColumns: string[] = [
        'isSelected', 'position', 'transNo', 'inwardDate', 'inwardNumber', 'eventName', 'employeeNo', 'employeeName',
        'designation', 'retirementDate', 'employeeType', 'forwardedDate', 'officeName', 'status', 'wfStatus',
        'caseType'];

    totalRecords: number = 0;
    errorMessages = EVENT_ERRORS;
    paginationArray;
    sortBy = '';
    sortOrder = '';
    pageSize = 0;
    pageIndex = 0;
    isSearch = 1;
    pageEvent: Object;
    storedData = [];
    indexedItem = 0;
    customPageIndex = 0;
    iteratablePageIndex = 0;
    pageElements = DataConst.PAGE_ELEMENT;
    disableSearchValue = true;
    newSearch = false;
    loggedUserObj;
    officeId;
    officeTypeId;
    fwdFromMax: Date;
    fwdToMin: Date;
    inwardFromMax: Date;
    inwardToMin: Date;
    sortedData;
    isUserRequired = true;

    eventsForm: FormGroup;
    private paginator: MatPaginator;
    private sort: MatSort;

    disableReceive: boolean = true;
    isForwardForNextLevel: boolean = false;
    checked = false;

    designationList;
    eventsNameList;
    classList;
    empTypeList;
    locationList;
    cardexNoList;
    ddoNoList;
    districtList;
    wfList;

    designationCtrl: FormControl = new FormControl();
    date = new FormControl(new Date());
    eventsNameCtrl: FormControl = new FormControl();
    classCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
    locationCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();
    cardexNoCtrl: FormControl = new FormControl();
    ddoNoCtrl: FormControl = new FormControl();
    wfStatusCtrl: FormControl = new FormControl();

    dataSource = new MatTableDataSource([]);
    displayedColumnsFooter: string[] = ['position'];
    selectedData = [];
    submitData = [];
    dateNow: Date;
    intermediate: boolean = false;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
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
        private datepipe: DatePipe,
        private pvuCommonService: PvuCommonService,
        public pvuWorkflowService: PVUWorkflowService,
        public router: Router
    ) { }

    ngOnInit() {
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.pageSize = 10;
        this.dateNow = new Date();
        this.createForm();
        this.getLookupInfo();
        /**
         * Get the Current user Details
         */
        this.pvuCommonService.getCurrentUserMultipleRoleDetail().then(res => {
            if (res) {
                this.loggedUserObj = res;
                if (res['officeDetail']) {
                    this.officeId = +res['officeDetail']['officeId'];
                    // this.getData();
                }
            }
        }, err => {
            this.toastr.error(err);
        });
    }

    createForm() {
        this.eventsForm = this.fb.group({
            forwardToDate: [''],
            forwardFromDate: [''],
            eventCode: ['', Validators.required],
            inwardNo: [''],
            empNo: [''],
            empName: [''],
            designationId: [''],
            caseNo: [''],
            classId: [''],
            retirementDate: [''],
            panNo: ['', ValidationService.panCardValidation],
            districtId: [''],
            cardexNo: [''],
            ddoCode: [''],
            employeeTypeId: [''],
            inwardFromDate: [''],
            inwardToDate: [''],
            transNo: ['']
        });
    }

    getLookupInfo() {
        this.pvuWorkflowService.getInwardLookup().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.designationList = res['result']['designation'];
                this.districtList = res['result']['district'];
                this.eventsNameList = res['result']['pvuEvents'];
                this.empTypeList = res['result']['lstLuLookUp']['Emp_Type'];
                this.classList = res['result']['lstLuLookUp']['Dept_Class'];
            }
        }, (err: Response) => {
            this.toastr.error(String(err));
        });
    }

    /**
     * Date Validation for forward from date
     * @param event selected date on change event
     */

    onFwdFromSelect(event) {
        this.fwdToMin = event.value;
        const fromDate = this.eventsForm.controls.forwardFromDate.value;
        const toDate = this.eventsForm.controls.forwardToDate.value;
        if (toDate !== null && toDate !== '') {
            if (toDate < fromDate) {
                this.eventsForm.controls.forwardToDate.reset();
            }
        }
    }

    /**
     * Date validation for Inward Form Date
     * @param event selected date on change event
     */

    onInwardFromSelect(event) {
        this.inwardToMin = event.value;
        const fromDate = this.eventsForm.controls.inwardFromDate.value;
        const toDate = this.eventsForm.controls.inwardToDate.value;
        if (toDate !== null && toDate !== '') {
            if (toDate < fromDate) {
                this.eventsForm.controls.inwardToDate.reset();
            }
        }
    }

    /**
     * Get Form Control
     */

    get fc() {
        return this.eventsForm.controls;
    }

    /**
     * Get Table datas
     * @param event null
     */

    getData(event = null) {
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: this.getSearchFilter()
        },
            self = this;

        if (
            !this.newSearch &&
            this.storedData.length !== 0 &&
            (
                this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize)
            )
        ) {
            // If data already fetched
            this.dataSource = new MatTableDataSource(
                this.storedData.slice(this.iteratablePageIndex * this.pageSize,
                    this.iteratablePageIndex * this.pageSize + this.pageSize));
            this.selectedData.forEach(el => {
                el.isSelected = false;
            });
            this.selectedData = [];
            this.dataSource.data.forEach(el => {
                el.isSelected = false;
            });

            setTimeout(function () {
                self.dataSource.sort = self.sort;
            }, 0);
        } else { // If data needs to fetch from database.
            const eventType = this.eventsForm.get('eventCode').value;
            this.submitData = [];
            this.pvuWorkflowService.getInwardList(passData, eventType).subscribe((res) => {
                self.newSearch = false;
                if (res && res['status'] === 200) {
                    // this.dataSource.data = res['result'];
                    // For customize pagination
                    self.storedData = _.cloneDeep(res['result']['result']);
                    self.sortedData = self.storedData;
                    // tslint:disable-next-line:max-line-length
                    if (event != null && event.pageIndex < event.previousPageIndex && (self.iteratablePageIndex - 1) === (Math.ceil(self.pageElements / self.pageSize))) {
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
                    self.dataSource = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize,
                        self.iteratablePageIndex * self.pageSize + self.pageSize));
                    if (this.dataSource.data.length > 0) {
                        this.selectedData.forEach(el => {
                            el.isSelected = false;
                        });
                        this.selectedData = [];
                        this.dataSource.data.forEach(el => {
                            el.isSelected = false;
                        });
                    }
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
                setTimeout(function () {
                    self.dataSource.sort = self.sort;
                }, 0);
            }, (err) => {
                self.toastr.error(err['message']);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSource = new MatTableDataSource([]);
                setTimeout(function () {
                    self.dataSource.sort = self.sort;
                }, 0);
            });
        }
    }

    /**
     * to convert date format
     * @param date date
     */

    convertDateFormat(date) {
        if (date !== '' && date !== undefined && date != null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'MM/dd/yyyy');
        }
        return '';
    }

    getSearchFilter() {
        const obj = this.eventsForm.value;

        if (
            !obj.forwardToDate &&
            !obj.forwardFromDate &&
            !obj.empNo &&
            !obj.empName &&
            !obj.inwardNo &&
            !obj.designationId &&
            !obj.caseNo &&
            !obj.classId &&
            !obj.retirementDate &&
            !obj.panNo &&
            !obj.districtId &&
            !obj.cardexNo &&
            !obj.ddoCode &&
            !obj.employeeTypeId &&
            !obj.inwardFromDate &&
            !obj.inwardToDate &&
            !obj.transNo) {
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
            if (
                key === 'designationId' ||
                key === 'districtId' ||
                key === 'classId' ||
                key === 'employeeTypeId' ||
                key === 'empNo' ||
                key === 'cardexNo') {
                currObj['value'] = (Number(obj[key]) || 0);
            }
            if (
                key === 'forwardToDate' ||
                key === 'forwardFromDate' ||
                key === 'empName' ||
                key === 'caseNo' ||
                key === 'ddoCode' ||
                key === 'retirementDate' ||
                key === 'panNo' ||
                key === 'inwardFromDate' ||
                key === 'inwardToDate' ||
                key === 'transNo' ||
                key === 'inwardNo' ||
                key === 'eventCode') {
                if (
                    key === 'forwardToDate' ||
                    key === 'forwardFromDate' ||
                    key === 'inwardFromDate' ||
                    key === 'inwardToDate' ||
                    key === 'retirementDate') {
                    if (obj[key]) {
                        currObj['value'] = '' + (this.convertDateFormat(obj[key]) || '');
                    } else {
                        currObj['value'] = '';
                    }
                } else {
                    currObj['value'] = '' + (obj[key] || '');
                }
            }
            returnArray.push(currObj);
        }
        returnArray.push({ 'key': 'trnStatus', 'value': 'Inwarded' });
        returnArray.push({ 'key': 'wfStatus', 'value': '' });
        returnArray.push({ 'key': 'postId', 'value': this.loggedUserObj['postId'] });
        returnArray.push({ 'key': 'menuId', 'value': this.loggedUserObj['menuId'] });
        returnArray.push({ 'key': 'officeId', 'value': this.loggedUserObj['officeDetail']['officeId'] });
        returnArray.push({ 'key': 'lkPoOffUserId', 'value': this.loggedUserObj['lkPOUId'] });
        returnArray.push({
            'key': 'wfRoleIds', 'value': this.loggedUserObj['wfRoleId'] ? this.loggedUserObj['wfRoleId'].toString() : ''
        });
        return returnArray;
    }

    onSubmitSearch() {
        if (this.eventsForm.valid) {
            this.selectedData = [];
            this.newSearch = true;
            this.pageIndex = 0;
            this.customPageIndex = 0;
            this.paginator.pageIndex = 0;
            this.iteratablePageIndex = 0;
            this.isSearch = 1;
            this.getData();
        } else {
            _.forEach(this.eventsForm.controls, (control) => {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
        }
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

    setDataSourceAttributes() {
        this.dataSource.paginator = this.paginator;
    }

    clearForm() {
        this.eventsForm.reset();
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

    onSortChange(event) {
        this.sortedData = _.orderBy(this.storedData, event.active, event.direction);
    }

    /**
     * This will be triggered when user select any row of data
     * @param event event will have have the checked or unchecked
     * @param item complete row object
     */

    checkboxValueChange(event, item) {
        if (event.checked) {
            if (
                this.selectedData.filter(ob => ob.id === item.id).length === 0 &&
                item.status === 'Inwarded'
            ) {
                this.selectedData.push(item);
                item.isSelected = true;
            }
        } else {
            item.isSelected = false;
            if (this.submitData.findIndex(ob => ob.id === item.id) !== -1) {
                this.submitData.splice(this.submitData.findIndex(ob => ob.id === item.id), 1);
            }
            if (this.selectedData.findIndex(ob => ob.id === item.id) !== -1) {
                this.selectedData.splice(this.selectedData.findIndex(ob => ob.id === item.id), 1);
            }
            this.checked = false;
        }
        if (this.dataSource.data.length === this.selectedData.length) {
            this.checked = true;
            this.intermediate = false;
        } else if (this.selectedData.length > 0) {
            this.intermediate = true;
            this.checked = false;
        } else {
            this.intermediate = false;
            this.checked = false;
        }
    }

    /**
     * Triggered when master checkbox is selected or deselected
     * @param event to check whether user has selected oe deselected
     */

    selectAll(event) {
        const self = this;
        self.selectedData = [];
        if (event.checked) {
            self.dataSource.data.forEach((includeRow, index) => {
                self.checkboxValueChange({ checked: true }, includeRow);
            });
        } else {
            self.dataSource.data.forEach((includeRow, index) => {
                self.checkboxValueChange({ checked: false }, includeRow);
            });
        }
    }

    isAllSelected() {
        if (this.dataSource.data.length === this.selectedData.length) {
            return true;
        } else {
            return false;
        }
    }

    isNothingIsSelected() {
        if (this.selectedData.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Triggered when submit button is pressed
     */

    submitDistributor(): void {
        const self = this;
        const selectedEvent = this.eventsNameList.filter(event => {
            return event.code === this.eventsForm.get('eventCode').value;
        })[0];
        if (selectedEvent) {
            // tslint:disable-next-line: no-use-before-declare
            const dialogRef = this.dialog.open(PVUDistributorFwdDialogComponent, {
                width: '600px',
                minHeight: '100px',
                data: {
                    submitData: this.selectedData,
                    eventType: this.eventsForm.get('eventCode').value,
                    eventId: selectedEvent.id
                }
            });
            dialogRef.componentInstance.distributeData = {
                selectedRangeData: (rangeStart, rangeEnd) => {
                    if (rangeStart < 0 || rangeEnd > this.totalRecords) {
                        this.toastr.error('Please select valid Serial No. Range');
                    } else {
                        const data = self.storedData.slice(rangeStart - 1, rangeEnd);
                        const params = [];
                        data.forEach((el) => {
                            if (params.find(ob => ob === el.id) === undefined) {
                                params.push(el.id);
                            }
                        });
                        return params;
                    }
                }
            };
            dialogRef.afterClosed().subscribe(result => {
                const eventCode = this.eventsForm.get('eventCode').value;
                this.eventsForm.reset();
                this.eventsForm.patchValue({
                    eventCode: eventCode
                });
                if (result === 'yes') {
                    this.newSearch = true;
                    this.getData();
                    this.selectedData = [];
                    this.submitData = [];
                }
            });
        }
    }

    /**
     * Navigate to the dashboard
     */

    goToDashboard() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: EVENT_ERRORS.WORKFLOW.CLOSE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }
}

@Component({
    selector: 'app-pvu-distributor-dialog',
    templateUrl: 'pvu-distributor-dialog.html',
})
export class PVUDistributorFwdDialogComponent implements OnInit {

    public menuId;
    public officeId;
    public postId;
    public wfRoleIds;
    public trnId;
    public userId;
    public wfStatus;
    public lkPoOffUserId;

    event;
    eventId = undefined;
    trnNo;
    initiationDate;
    isUserRequired: boolean = true;
    isSubmitted: boolean = false;
    isApprove: boolean = false;
    showAction: boolean = true;
    fileBrowseIndex: number;
    date: any = new Date();
    headerJSON = [];
    actionResponse;
    userResponse;
    actionForm: FormGroup;
    isRange: boolean;
    distributeData;
    selectedRange;
    valid: boolean = true;
    userList: object[] = [];
    actionList: object[] = [];
    actionCodeCtrl: FormControl = new FormControl();
    userCodeCtrl: FormControl = new FormControl();

    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private pvuService: PvuCommonService,
        private pvuWorkflowService: PVUWorkflowService,
        private commonService: CommonService,
        public dialogRef: MatDialogRef<PVUDistributorFwdDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.event = this.data.eventType;
        this.eventId = this.data.eventId;
        this.actionForm = this.fb.group({
            workflowAction: ['', Validators.required],
            srNoFrom: [''],
            srNoTo: [''],
            user: ['']
        });

        this.validationCheck();

        this.pvuService.getCurrentUserDetail().then(res => {
            if (res) {
                this.wfRoleIds = res['wfRoleId'];
                this.menuId = res['menuId'];
                this.postId = res['postId'];
                this.userId = res['userId'];
                this.officeId = res['officeDetail']['officeId'];
                this.lkPoOffUserId = res['lkPoOffUserId'];
                if (this.data.submitData.length !== 0) {
                    this.getData();
                }
            }
        });
    }

    validationCheck() {
        if (this.data.submitData.length === 0) {
            this.actionForm.get('srNoFrom').setValidators([Validators.required]);
            this.actionForm.get('srNoFrom').updateValueAndValidity();
            this.actionForm.get('srNoTo').setValidators([Validators.required]);
            this.actionForm.get('srNoTo').updateValueAndValidity();
            this.isRange = true;
        } else {
            this.actionForm.get('srNoFrom').setValidators(null);
            this.actionForm.get('srNoFrom').updateValueAndValidity();
            this.actionForm.get('srNoTo').setValidators(null);
            this.actionForm.get('srNoTo').updateValueAndValidity();
            this.isRange = false;
        }
    }

    rangeCheck() {
        if (this.actionForm.get('srNoTo').value && this.actionForm.get('srNoFrom').value) {
            this.selectedRange = this.distributeData.selectedRangeData(
                this.actionForm.get('srNoFrom').value,
                this.actionForm.get('srNoTo').value
            );
            if (this.selectedRange) {
                if (this.actionForm.get('srNoTo').value - this.actionForm.get('srNoFrom').value > 250) {
                    this.actionForm.get('srNoTo').markAsTouched();
                    this.toastr.error('Please select valid range');
                    this.valid = false;
                }
                this.getData();
            }

        }
    }

    /**
     * To get the action Data
     */

    getData() {
        if (this.menuId && this.wfRoleIds && this.postId && this.userId &&
            this.officeId && this.lkPoOffUserId) {
            let params = {};
            params = {
                'menuId': this.commonService.getMenuId(),
                'officeId': this.officeId,
                'postId': this.postId,
                'userId': this.userId,
                'wfRoleIds': this.wfRoleIds,
                'lkPOUId': this.lkPoOffUserId,
                'eventId': this.eventId,
                'event': this.event
            };
            if (this.data.submitData.length === 0) {
                if (this.selectedRange) {
                    params['trnId'] = Number(this.selectedRange[0]);
                }
            } else {
                params['trnId'] = Number(this.data.submitData[0].id);

            }
            this.pvuService.getWorkFlowAssignmentOpt(params).subscribe((data) => {
                if (data && data['result'] && data['result'].length > 0) {
                    this.actionResponse = data['result'];
                    if (data['result'].length === 1) {
                        this.actionList.push(
                            {
                                'wfActionId': data['result'][0]['wfActionId'],
                                'wfActionName': data['result'][0]['wfActionName']
                            }
                        );
                        this.actionForm.get('workflowAction').setValue(data['result'][0]['wfActionId']);
                        this.getWorkFlowUser();
                    } else {

                        data['result'].forEach(element => {
                            this.actionList.push(
                                {
                                    'wfActionId': element['wfActionId'],
                                    'wfActionName': element['wfActionName']
                                }
                            );
                        });
                    }
                }
            }, () => {
                this.toastr.error('Please select valid Serial No. Range');
            });
        }
    }

    /**
     * to get the wf users
     */

    getWorkFlowUser() {
        const selectedAction = this.actionResponse.filter(item => {
            return item['wfActionId'] === this.actionForm.get('workflowAction').value;
        });
        this.actionForm.controls.user.updateValueAndValidity();

        if (this.menuId && this.wfRoleIds && this.postId && this.userId &&
            this.officeId && this.lkPoOffUserId) {
            let params = {};
            params = {
                'menuId': this.commonService.getLinkMenuId(),
                'officeId': this.officeId,
                'postId': this.postId,
                'userId': this.userId,
                'wfRoleIds': this.wfRoleIds,
                'wfActionId': selectedAction[0]['wfActionId'],
                'nextWfRoleId': selectedAction[0]['assignedWfRoleId'],
                'lkPOUId': this.lkPoOffUserId,
                'eventId': this.eventId,
                'event': this.event
            };
            if (this.data.submitData.length === 0) {
                if (this.selectedRange) {
                    params['trnId'] = Number(this.selectedRange[0]);
                }
            } else {
                params['trnId'] = Number(this.data.submitData[0].id);
            }
            this.pvuWorkflowService.getWorkFlowUsers(params).subscribe((data) => {
                if (data && data['status'] === 200 && data['result']) {
                    if (data['result'].length > 0) {
                        this.userResponse = data['result'];
                        if (data['result'].length === 1) {
                            this.userList.push({
                                'userId': data['result'][0]['userId'],
                                'userName': data['result'][0]['userName'],
                                'pouId': data['result'][0]['pouId'],
                                'officeId': data['result'][0]['officeId'],
                                'postId': data['result'][0]['postId']
                            });
                            this.actionForm.get('user').setValue(data['result'][0]['userId']);
                        } else {
                            data['result'].forEach(element => {
                                this.userList.push(
                                    {
                                        'userId': element['userId'],
                                        'userName': element['userName'],
                                        'pouId': element['pouId'],
                                        'officeId': element['officeId'],
                                        'postId': element['postId']
                                    }
                                );
                            });
                        }
                    } else {
                        this.toastr.error(EVENT_ERRORS.WORKFLOW.WF_USER_LIST_EMPTY);
                    }
                } else {
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }

    submitWorkFlow() {
        if (this.actionForm.valid && !this.isSubmitted && this.valid) {
            this.isSubmitted = true;
            const selectedAction = this.actionResponse.filter(item => {
                return item['wfActionId'] === this.actionForm.get('workflowAction').value;
            });

            if (!selectedAction || (selectedAction && selectedAction.length === 0)) {
                this.isSubmitted = false;
                return;
            }
            const selectedAuditor = this.actionForm.controls.user.value;
            const selectedAuditorDetails = this.userList.filter(sel => sel['userId'] === selectedAuditor);
            const params = [];
            if (this.data.submitData.length === 0) {
                const returnedValue = this.distributeData.selectedRangeData(
                    this.actionForm.get('srNoFrom').value,
                    this.actionForm.get('srNoTo').value
                );
                returnedValue.forEach(el => {
                    params.push({
                        'assignByOfficeId': this.officeId,
                        'assignByPostId': this.postId,
                        'assignByUserId': this.userId,
                        'assignByWfRoleId': selectedAction[0]['currentWfRoleId'],
                        'assignToOfficeId': selectedAuditorDetails[0]['officeId'],
                        'assignToPostId': selectedAuditorDetails[0]['postId'],
                        'assignToUserId': selectedAuditorDetails[0]['userId'],
                        'assignToWfRoleId': selectedAction[0]['assignedWfRoleId'],
                        'currentWorkflowId': selectedAction[0]['currentWorkflowId'],
                        'menuId': this.menuId,
                        'remarks': '',
                        'trnId': Number(el),
                        'trnStatus': selectedAction[0]['trnStatus'],
                        'wfActionId': selectedAction[0]['wfActionId'],
                        'wfStatus': selectedAction[0]['wfStatus'],
                        'assignByActionLevel': selectedAction[0]['currentActionLevel'],
                        'assignToActionLevel': selectedAction[0]['nextActionLevel'],
                        'assignByPOUId': this.lkPoOffUserId,
                        'assignToPOUId': selectedAuditorDetails[0]['pouId'],
                        'eventId': this.eventId,
                        'event': this.event
                    });
                });
            } else {
                this.data.submitData.forEach(el => {
                    params.push({
                        'assignByOfficeId': this.officeId,
                        'assignByPostId': this.postId,
                        'assignByUserId': this.userId,
                        'assignByWfRoleId': selectedAction[0]['currentWfRoleId'],
                        'assignToOfficeId': selectedAuditorDetails[0]['officeId'],
                        'assignToPostId': selectedAuditorDetails[0]['postId'],
                        'assignToUserId': selectedAuditorDetails[0]['userId'],
                        'assignToWfRoleId': selectedAction[0]['assignedWfRoleId'],
                        'currentWorkflowId': selectedAction[0]['currentWorkflowId'],
                        'menuId': this.menuId,
                        'remarks': '',
                        'trnId': Number(el.id),
                        'trnStatus': selectedAction[0]['trnStatus'],
                        'wfActionId': selectedAction[0]['wfActionId'],
                        'wfStatus': selectedAction[0]['wfStatus'],
                        'assignByActionLevel': selectedAction[0]['currentActionLevel'],
                        'assignToActionLevel': selectedAction[0]['nextActionLevel'],
                        'assignByPOUId': this.lkPoOffUserId,
                        'assignToPOUId': selectedAuditorDetails[0]['pouId'],
                        'eventId': this.eventId,
                        'event': this.event
                    });
                });
            }
            this.pvuWorkflowService.submitDistributerWF(params, this.event).subscribe((data) => {
                if (data && data['status'] === 200) {
                    this.toastr.success(data['message']);
                    this.dialogRef.close('yes');
                } else {
                    this.isSubmitted = false;
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.isSubmitted = false;
                this.toastr.error(err);
            });
        }
    }

    onNoClick() {
        this.dialogRef.close('no');
    }
}

