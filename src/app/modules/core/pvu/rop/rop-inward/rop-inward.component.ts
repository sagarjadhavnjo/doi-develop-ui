import { Router } from '@angular/router';
import { MessageConst, pvuMessage } from './../../../../../shared/constants/pvu/pvu-message.constants';
import { ROPService } from './../service/rop.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { PvuCommonService } from '../../pvu-common/services/pvu-common.service';
import * as _ from 'lodash';
import { ValidationService } from 'src/app/modules/services/validatation.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-rop-inward',
    templateUrl: './rop-inward.component.html',
    styleUrls: ['./rop-inward.component.css']
})
export class RopInwardComponent implements OnInit {

    displayedColumns: string[] = [
        'isReceived', 'position', 'transNo', 'inwardDate', 'inwardNumber', 'eventName', 'employeeNo', 'employeeName',
        'designation', 'retirementDate', 'employeeType', 'forwardedDate', 'officeName', 'status', 'wfStatus', 'caseType'
    ];

    totalRecords: number = 0;
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
    fwdToMin: Date;
    inwardToMin: Date;

    eventsForm: FormGroup;
    private paginator: MatPaginator;
    private sort: MatSort;

    disableReceive: boolean = true;
    isForwardForNextLevel: boolean = false;
    checked = false;

    designation_list;
    events_name_list;
    class_list;
    emp_type_list;
    location_list;
    cardexNo_list;
    ddoNo_list;
    district_list;
    wf_list;
    intermediate: boolean = false;

    designationCtrl: FormControl = new FormControl();
    date = new FormControl(new Date());
    eventsNameCtrl: FormControl = new FormControl();
    classCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
    locationCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();
    wfStatusCtrl: FormControl = new FormControl();

    dataSource = new MatTableDataSource([]);
    displayedColumnsFooter: string[] = ['position'];
    selectedData = [];
    receiveData = [];
    submitData = [];
    dateNow: Date;

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
        public ropService: ROPService,
        public router: Router
    ) { }

    // To get Current User Info

    ngOnInit() {
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.pageSize = 25;
        this.dateNow = new Date();
        this.createForm();
        this.getLookupInfo();
        this.ropService.getCurrentUserDetail().then(res => {
            if (res) {
                this.loggedUserObj = res;
                if (res['officeDetail']) {
                    this.officeId = +res['officeDetail']['officeId'];
                    this.getData();
                    this.getWorkflowStatus();
                }
            }
        }, err => {
            this.toastr.error(err);
        });
    }

    /** To get Current Work Flow*/

    getWorkflowStatus() {
        const param = {
            id: this.loggedUserObj['menuId']
        };
        this.ropService.getWorkFlowStatus(param).subscribe((res) => {
            if (res && res['result'] && res['result'].length > 0) {
                this.wf_list = res['result'];
            }
        });
    }

    /**
     * Creating Search Form
     */

    createForm() {
        this.eventsForm = this.fb.group({
            forwardToDate: [''],
            forwardFromDate: [''],
            eventName: [''],
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

    onFwdToSelect(event) { }

    onInwardToSelect(event) { }

    /**
     * To get LookUp Info
     */

    getLookupInfo() {
        this.ropService.getInwardLookup().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.designation_list = res['result']['designation'];
                this.district_list = res['result']['district'];
                this.events_name_list = res['result']['lstLuLookUp']['ROPType'];
                this.emp_type_list = res['result']['lstLuLookUp']['Emp_Type'];
                this.class_list = res['result']['lstLuLookUp']['Dept_Class'];
            }
        }, (err: Response) => {
            this.toastr.error(String(err));
        });
    }

    /**
     *
     * @param event Date Validation for forward Date to and From
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
     *
     * @param event Date Validation for Inward Date from To
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
     * To get the Form Control using getter as it reduces the length of
     * Code in or anywhere if form Control is Required
     */

    get fc() {
        return this.eventsForm.controls;
    }

    /**
     *
     * @param event To get the Listing in Inward Screen
     */

    getData(event = null) {
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: this.getSearchFilter()
        },
            self = this;
        if (
            !this.newSearch && this.storedData.length !== 0 &&
            (this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize))
        ) {
            // If data already fetched
            this.dataSource = new MatTableDataSource(
                this.storedData.slice(this.iteratablePageIndex * this.pageSize,
                    this.iteratablePageIndex * this.pageSize + this.pageSize));
            this.selectedData.forEach(el => {
                el.isReceived = false;
            });
            // selected data is initially set to Empty Array
            this.selectedData = [];
            if (self.dataSource.data.length > 0) {
                console.log(this.dataSource, 'inward');
                self.dataSource.data.forEach((el) => {
                    /**
                     * Condition for initial Selecting only
                     * datas which has inwardDate inwardNumber and status is Forwarded to PVU
                     */
                    if (el.inwardDate && el.inwardNumber && el.status === 'Forwarded to PVU') {
                        el.isReceived = true;
                        if (this.selectedData.find((ob) => ob.ropEventId === el.ropEventId) === undefined) {
                            // Pushed the data with the above condition to the Selected List
                            this.selectedData.push(el);
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
                    }
                });
            }

            setTimeout(function () {
                self.dataSource.sort = self.sort;
            }, 0);
        } else {
            // If data needs to fetch from database.
            this.ropService.getInwardList(passData).subscribe((res) => {
                console.log(res);
                self.newSearch = false;
                if (res && res['status'] === 200) {
                    // For customize paginations
                    self.storedData = _.cloneDeep(res['result']['result']);
                    if (
                        event != null &&
                        event.pageIndex < event.previousPageIndex &&
                        (self.iteratablePageIndex - 1) === (Math.ceil(self.pageElements / self.pageSize))
                    ) {
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
                         * else if condition to handle button of 'Go Last Page'
                         * reset iteratablePageIndex to last pageIndex of particular pageSet
                        */
                        self.iteratablePageIndex = Math.ceil((self.storedData.length / self.pageSize)) - 1;
                    } else {
                        self.iteratablePageIndex = 0;
                    }
                    self.dataSource = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize,
                        self.iteratablePageIndex * self.pageSize + self.pageSize));
                    if (self.dataSource.data.length > 0) {
                        self.dataSource.data.forEach((listElement) => {
                            if (
                                listElement.inwardDate &&
                                listElement.inwardNumber &&
                                listElement.status === 'Forwarded to PVU'
                            ) {
                                listElement.isReceived = true;
                                if (
                                    this.selectedData.find((ob) =>
                                        ob.ropEventId === listElement.ropEventId) === undefined
                                ) {
                                    this.selectedData.push(listElement);
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
                            }
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
     * @param date To Convert the Date Format
     */
    convertDateFormat(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'MM/dd/yyyy');
        }
        return '';
    }

    /**
     * to Get the Search Filter . This Function with return an array with parameters user Searched
     */

    getSearchFilter() {
        const obj = this.eventsForm.value;

        if (!obj.forwardToDate && !obj.forwardFromDate && !obj.eventName && !obj.empNo
            && !obj.empName && !obj.designationId && !obj.caseNo && !obj.classId
            && !obj.retirementDate && !obj.panNo && !obj.districtId && !obj.cardexNo
            && !obj.ddoCode && !obj.employeeTypeId && !obj.inwardFromDate && !obj.inwardToDate && !obj.transNo) {
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
                key === 'eventName' ||
                key === 'designationId' ||
                key === 'districtId' ||
                key === 'classId' ||
                key === 'employeeTypeId' ||
                key === 'empNo' ||
                key === 'cardexNo' ||
                key === 'ddoCode') {
                currObj['value'] = (Number(obj[key]) || 0
                );
                returnArray.push(currObj);
            } else {
                if (
                    key === 'forwardToDate' ||
                    key === 'forwardFromDate' ||
                    key === 'inwardFromDate' ||
                    key === 'inwardToDate' ||
                    key === 'retirementDate') {
                    currObj['value'] = '' + (this.convertDateFormat(obj[key]) || ''
                    );
                    returnArray.push(currObj);
                } else {
                    currObj['value'] = '' + (obj[key] || '');
                    returnArray.push(currObj);
                }
            }
        }
        returnArray.push({ 'key': 'trnStatus', 'value': 'Forwarded to PVU' });
        returnArray.push({ 'key': 'wfStatus', 'value': '' });
        returnArray.push({ 'key': 'postId', 'value': this.loggedUserObj['postId'] });
        returnArray.push({ 'key': 'menuId', 'value': this.loggedUserObj['menuId'] });
        returnArray.push({ 'key': 'officeId', 'value': this.loggedUserObj['officeDetail']['officeId'] });
        returnArray.push({ 'key': 'lkPoOffUserId', 'value': this.loggedUserObj['lkPOUId'] });
        returnArray.push(
            {
                'key': 'wfRoleIds',
                'value': this.loggedUserObj['wfRoleId'] ? this.loggedUserObj['wfRoleId'].toString() : ''
            }
        );
        return returnArray;
    }

    /**
     * This Function triggered when Search Button is Click
     */

    onSubmitSearch() {
        this.selectedData = [];
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;
        this.getData();
    }

    /**
     *
     * @param event For Custom Pagination
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

    /**
     * For Reseting the Form
     */

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

    /**
     * This will be triggered when user select any row of data
     * @param event event will have have the checked or unchecked
     * @param item complete row object
     */

    checkboxValueChange(event, item) {
        // condition to check whether user has selected or deselected the Row
        if (event.checked) {
            // Conditiom to Check if the Selectec Data already exist in the Selected Data Array
            // Condition to check wheather status is appropiate or not
            if (
                this.selectedData.find(ob => ob.ropEventId === item.ropEventId) === undefined &&
                item.status === 'Forwarded to PVU') {
                // push the selected object Array in the Selected Data
                this.selectedData.push(item);
                // Condition to disable or enable Receive Button
                if (!item.inwardNumber && !item.inwardDate) {
                    if (this.receiveData.find((ob) => ob.id === item.ropEventId) === undefined) {
                        this.receiveData.push({ id: item.ropEventId });
                        item.isReceived = true;
                        this.disableReceive = false;
                    }
                }
            }
            // Condition for Unselecting Row
        } else {
            item.isReceived = false;
            // Remove the data if unselected and exists in the Selected data Object Array
            // Removing Only that row form The Selection data after finding the exact index of that data in
            // Selected data Array
            this.selectedData.splice(this.selectedData.findIndex(ob => ob.ropEventId === item.ropEventId), 1);
            this.submitData.splice(this.selectedData.findIndex(ob => ob.ropEventId === item.ropEventId), 1);
            this.receiveData.splice(this.selectedData.findIndex(ob => ob.ropEventId === item.ropEventId), 1);
            this.checked = false;
            // Condition for toggling the Master Checkbox
            if (this.selectedData.length === 0) {
                this.checked = false;
                this.intermediate = false;
            }
        }
        if (this.receiveData.length > 0) {
            this.disableReceive = false;
        } else {
            this.disableReceive = true;
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
     * activated when Master Checkbox is Selected
     * @param check this is $event to check whether the box is selected or unselected
     * @param item Item is pushed in row vise Manner
     */

    selectallEvent(check, item) {
        if (check.checked && item.status === 'Forwarded to PVU') {
            item.isReceived = true;
            if (!item.inwardNumber && !item.inwardDate) {
                if (this.receiveData.find((ob) => ob.id === item.ropEventId) === undefined) {
                    this.receiveData.push({ id: item.ropEventId });
                    item.isReceived = true;
                    this.disableReceive = false;
                }
            }
        } else {
            this.selectedData = [];
            this.disableReceive = true;
            item.isReceived = false;
            this.intermediate = false;
            this.checked = false;
            this.receiveData = [];
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
     * Triggered when Master Checkbox is Selected
     * @param event to check wheather row master checkbox is selected or unselected
     * this function will add all the the element data to Selected data available on the same Page
     */

    selectAll(event) {
        const self = this;
        self.selectedData = [];
        if (event.checked) {
            self.dataSource.data.forEach((includeRow) => {
                // this function is called to select each data row vise
                self.selectallEvent({ checked: true }, includeRow);
            });
        } else {
            self.dataSource.data.forEach((includeRow) => {
                self.selectallEvent({ checked: false }, includeRow);
            });
        }
    }

    /**
     * Check if all rows are selected or not
     */

    isAllSelected() {
        if (this.dataSource.data.length === this.selectedData.length) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Check if all rows are deleselected
     */

    isNothingIsSelected() {
        if (this.selectedData.length > 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Triggered when Received Button is clicked
     * this function will receive the Inward date and Inward Number
     */

    onReceive() {
        if (this.receiveData.length > 0) {
            this.ropService.receiveInward(this.receiveData).subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    this.selectedData = [];
                    this.receiveData = [];
                    this.newSearch = true;
                    this.getData();
                }
            });
        }
    }

    /**
     * Trigged when Submit Button is clicked
     * This will open the action form
     */

    submitInward(): void {
        if (this.selectedData.length !== 0) {
            const data = this.selectedData.every((item) => {
                return item.inwardDate && item.inwardNumber;
            });
            if (data) {
                this.selectedData.forEach((item) => {
                    if (this.submitData.find(ob => ob.id === item.ropEventId) === undefined) {
                        if (item.inwardDate && item.inwardNumber) {
                            this.submitData.push({ id: item.ropEventId });
                        }
                    }
                });
                // tslint:disable-next-line: no-use-before-declare
                const dialogRef = this.dialog.open(FwdRopInwardDialogComponent, {
                    width: '600px',
                    minHeight: '100px',
                    data: this.submitData
                });
                dialogRef.afterClosed().subscribe(result => {
                    this.eventsForm.reset();
                    if (result === 'yes') {
                        this.newSearch = true;
                        this.getData();
                    }
                });
            } else {
                this.toastr.error('First Receive the selected Cases');
            }
        } else {
            this.toastr.error('Please select atleast one record');
        }
    }

    /**
     * Navigate to the dashboard
     */

    goToDashboard() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.CLOSE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }
}

/**
 * Action Dialog Box Component
 */

@Component({
    selector: 'app-pvu-rop-inward-dialog',
    templateUrl: 'pvu-rop-inward-dialog.html',
})
export class FwdRopInwardDialogComponent implements OnInit {

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
    action_list: object[] = [];
    actionCodeCtrl: FormControl = new FormControl();

    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private pvuService: PvuCommonService,
        private ropService: ROPService,
        public dialogRef: MatDialogRef<FwdRopInwardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) { }

    ngOnInit() {

        this.actionForm = this.fb.group({
            workflowAction: ['', Validators.required],
            //  userCode: ['', Validators.required],
        });
        // to get the Current User Details
        this.pvuService.getCurrentUserDetail().then(res => {
            if (res) {
                this.wfRoleIds = res['wfRoleId'];
                this.menuId = res['menuId'];
                this.postId = res['postId'];
                this.userId = res['userId'];
                this.officeId = res['officeDetail']['officeId'];
                this.lkPoOffUserId = res['lkPoOffUserId'];
                if (this.data.length !== 0) {
                    this.getData();
                }
            }
        });
    }

    /**
     * To get Wf Action data
     */

    getData() {
        if (this.menuId && this.wfRoleIds && this.postId && this.userId &&
            this.officeId && this.lkPoOffUserId) {
            const params = {
                'menuId': this.menuId,
                'officeId': this.officeId,
                'postId': this.postId,
                'trnId': Number(this.data[0].id),
                'userId': this.userId,
                'wfRoleIds': this.wfRoleIds,
                'lkPOUId': this.lkPoOffUserId,
            };
            this.pvuService.getWorkFlowAssignmentOpt(params).subscribe((data) => {
                if (data && data['result'] && data['result'].length > 0) {
                    this.actionResponse = data['result'];
                    if (data['result'].length === 1) {
                        this.action_list.push(
                            {
                                'wfActionId': data['result'][0]['wfActionId'],
                                'wfActionName': data['result'][0]['wfActionName']
                            }
                        );
                        this.actionForm.get('workflowAction').setValue(data['result'][0]['wfActionId']);
                    } else {
                        data['result'].forEach(element => {
                            this.action_list.push(
                                {
                                    'wfActionId': element['wfActionId'],
                                    'wfActionName': element['wfActionName']
                                }
                            );
                        });

                    }
                }
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }

    /**
     * Triggered when Wf is Submitted
     * This Function will call inward WF Action Submit Api
     */

    submitWorkFlow() {
        if (this.actionForm.valid) {
            const selectedAction = this.actionResponse.filter(item => {
                return item['wfActionId'] === this.actionForm.get('workflowAction').value;
            });

            if (!selectedAction || (selectedAction && selectedAction.length === 0)) {
                return;
            }
            const params = [];
            this.data.forEach(el => {
                params.push({
                    'assignByOfficeId': this.officeId,
                    'assignByPostId': this.postId,
                    'assignByUserId': this.userId,
                    'assignByWfRoleId': selectedAction[0]['currentWfRoleId'],
                    'assignToWfRoleId': selectedAction[0]['assignedWfRoleId'],
                    'currentWorkflowId': selectedAction[0]['currentWorkflowId'],
                    'menuId': this.menuId,
                    'remarks': 'Inwarded',
                    'trnId': Number(el.id),
                    'trnStatus': selectedAction[0]['trnStatus'],
                    'wfActionId': selectedAction[0]['wfActionId'],
                    'wfStatus': selectedAction[0]['wfStatus'],
                    'assignByActionLevel': selectedAction[0]['currentActionLevel'],
                    'assignToActionLevel': selectedAction[0]['nextActionLevel'],
                    'assignByPOUId': this.lkPoOffUserId
                });
            });
            this.ropService.submitInwardWF(params).subscribe((data) => {
                if (data && data['status'] === 200) {
                    this.toastr.success(data['message']);
                    this.dialogRef.close('yes');
                } else {
                    this.toastr.error(data['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        } else {
            this.toastr.error(MessageConst.VALIDATION.TOASTR_REQUIRED);
        }
    }
    onNoClick() {
        this.dialogRef.close('no');
    }
}
