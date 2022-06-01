import { PVUWorkflowService } from './../services/pvu-workflow.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EVENT_ERRORS } from './../index';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { ValidationService } from 'src/app/modules/services/validatation.service';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { PvuCommonService } from '../../../pvu-common/services/pvu-common.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-outward',
    templateUrl: './outward.component.html',
    styleUrls: ['./outward.component.css']
})
export class PVUOutwardComponent implements OnInit {
    @ViewChild('outwardSubmitForm', { static: true }) outForm: any;
    displayedColumns: string[] = [
        'isReceived', 'position', 'outWardNo', 'outWardDate', 'postConsignmentNumber', 'employeeNo', 'employeeName',
        'officeName', 'authorisedDate', 'trnStatus', 'wfStatus'];
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
    outwardToMin: Date;
    inwardToMin: Date;

    eventsForm: FormGroup;
    private paginator: MatPaginator;
    private sort: MatSort;

    disableOutward: boolean = true;
    isForwardForNextLevel: boolean = false;
    checked = false;

    statusList;
    approverList;
    designationList;
    districtList;
    eventsNameList;
    classList;
    officeNameList;
    empTypeList;
    intermediate: boolean = false;
    submitClicked = false;
    statusCtrl: FormControl = new FormControl();
    date = new FormControl(new Date());
    approverNamePOUIdCtrl: FormControl = new FormControl();
    designationCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();
    classCtrl: FormControl = new FormControl();
    officeNameCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
    eventsNameCtrl: FormControl = new FormControl();

    dataSource = new MatTableDataSource([]);
    displayedColumnsFooter: string[] = ['position'];
    selectedData = [];
    receiveData = [];
    submitData = [];
    dateNow: Date;
    errorMessages = EVENT_ERRORS;
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
        public pvuWFService: PVUWorkflowService,
        public router: Router
    ) { }

    // To get Current User Info

    ngOnInit() {
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.pageSize = 25;
        this.dateNow = new Date();
        this.createForm();
        this.getLookupInfo();
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

    /**
     * Creating Search Form
     */

    createForm() {
        this.eventsForm = this.fb.group({
            inwardFromDate: [''],
            inwardToDate: [''],
            inwardNo: [''],
            outwardFromDate: [''],
            outwardToDate: [''],
            outwardNo: [''],
            eventCode: ['', Validators.required],
            status: [''],
            approverNamePOUId: [''],
            empNo: [''],
            empName: [''],
            designationId: [''],
            panNo: ['', ValidationService.panCardValidation],
            districtId: [''],
            cardexNo: [''],
            ddoCode: [''],
            retirementDate: [''],
            caseNo: [''],
            classId: [''],
            seaOfficeId: [''],
            transNo: [''],
            employeeTypeId: ['']
        });
    }

    /**
     * To load the office list
     */
    loadOfficeList() {
        const param = {
            'pvuId': this.loggedUserObj['officeDetail']['officeId'],
            'districtId': this.eventsForm.get('districtId').value
        };

        this.eventsForm.controls.seaOfficeId.setValue('');
        this.pvuWFService.getOfficeList(param).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.officeNameList = res['result'];
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * To check, district is selected or not?
     */
    isDistrictSelected() {
        if (!this.eventsForm.get('districtId').value) {
            this.toastr.error('Please Select District');
            this.officeNameList = [];
        }
    }


    onOutwardToSelect(event) { }

    onInwardToSelect(event) { }

    /**
     * To get LookUp Info
     */

    getLookupInfo() {
        this.pvuWFService.getOutwardLookup().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.designationList = res['result']['designation'];
                this.statusList = res['result']['statusList'];
                this.approverList = res['result']['approverList'];
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
     *
     * @param event Date Validation for forward Date to and From
     */

    onOutwardFromSelect(event) {
        this.outwardToMin = event.value;
        const fromDate = this.eventsForm.controls.outwardFromSelect.value;
        const toDate = this.eventsForm.controls.outwardToSelect.value;
        if (toDate !== null && toDate !== '') {
            if (toDate < fromDate) {
                this.eventsForm.controls.outwardToSelect.reset();
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
            // if (self.dataSource.data.length > 0) {
            //     console.log(this.dataSource, 'outward');
            //     self.dataSource.data.forEach((el) => {
            //         if (el.outWardDate && el.outWardNo && el.outwardFlag) {
            //             el.isReceived = true;
            //             if (this.selectedData.find((ob) => ob.id === el.id) === undefined) {
            //                 this.selectedData.push(el);
            //                 if (this.isAllSelected()) {
            //                     this.checked = true;
            //                     this.intermediate = false;
            //                 } else if (this.selectedData.length > 0) {
            //                     this.intermediate = true;
            //                     this.checked = false;
            //                 } else {
            //                     this.intermediate = false;
            //                     this.checked = false;
            //                 }
            //             }
            //         }
            //     });
            // }

            setTimeout(function () {
                self.dataSource.sort = self.sort;
            }, 0);
        } else {
            // If data needs to fetch from database.
            const eventType = this.eventsForm.get('eventCode').value;
            this.submitData = [];
            this.receiveData = [];
            this.pvuWFService.getOutwardList(passData, eventType).subscribe((res) => {
                // console.log(res);
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
                    // if (self.dataSource.data.length > 0) {
                    //     self.dataSource.data.forEach((listElement) => {
                    //         if (
                    //             listElement.outWardDate &&
                    //             listElement.outWardNo && listElement.outwardFlag
                    //         ) {
                    //             listElement.isReceived = true;
                    //             if (
                    //                 this.selectedData.find((ob) =>
                    //                     ob.id === listElement.id) === undefined
                    //             ) {
                    //                 this.selectedData.push(listElement);
                    //                 if (this.isAllSelected()) {
                    //                     this.checked = true;
                    //                     this.intermediate = false;
                    //                 } else if (this.selectedData.length > 0) {
                    //                     this.intermediate = true;
                    //                     this.checked = false;
                    //                 } else {
                    //                     this.intermediate = false;
                    //                     this.checked = false;
                    //                 }
                    //             }
                    //         }
                    //     });
                    // }
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
            return this.datepipe.transform(date, 'yyyy/MM/dd');
        }
        return '';
    }

    /**
     * to Get the Search Filter . This Function with return an array with parameters user Searched
     */

    getSearchFilter() {
        const obj = this.eventsForm.value;

        if (
            !obj.empNo &&
            !obj.seaOfficeId &&
            !obj.empName &&
            !obj.designationId &&
            !obj.caseNo &&
            !obj.transNo &&
            !obj.classId &&
            !obj.retirementDate &&
            !obj.panNo &&
            !obj.districtId &&
            !obj.cardexNo &&
            !obj.ddoCode &&
            !obj.employeeTypeId &&
            !obj.inwardFromDate &&
            !obj.inwardToDate &&
            !obj.inwardNo &&
            !obj.outwardNo &&
            !obj.outwardFromDate &&
            !obj.outwardToDate &&
            !obj.approverNamePOUId &&
            !obj.status &&
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
                key === 'cardexNo' ||
                key === 'approverNamePOUId' ||
                key === 'seaOfficeId') {
                currObj['value'] = (Number(obj[key]) || 0);
            }
            if (
                key === 'empName' ||
                key === 'caseNo' ||
                key === 'ddoCode' ||
                key === 'transNo' ||
                key === 'retirementDate' ||
                key === 'panNo' ||
                key === 'inwardFromDate' ||
                key === 'inwardToDate' ||
                key === 'outwardFromDate' ||
                key === 'outwardToDate' ||
                key === 'transNo' ||
                key === 'eventCode' ||
                key === 'inwardNo' ||
                key === 'status' ||
                key === 'outwardNo') {
                if (
                    key === 'inwardFromDate' ||
                    key === 'inwardToDate' ||
                    key === 'outwardFromDate' ||
                    key === 'outwardToDate' ||
                    key === 'retirementDate') {
                    if (obj[key]) {
                        currObj['value'] = obj[key].getFullYear() +
                            '/' + (obj[key].getMonth() + 1) + '/' + obj[key].getDate();
                    } else {
                        currObj['value'] = '';
                    }
                } else {
                    currObj['value'] = '' + (obj[key] || '');
                }
            }
            returnArray.push(currObj);
        }
        returnArray.push({ 'key': 'trnStatus', 'value': '' });
        // returnArray.push({ 'key': 'wfStatus', 'value': '' });
        // returnArray.push({ 'key': 'postId', 'value': this.loggedUserObj['postId'] });
        // returnArray.push({ 'key': 'menuId', 'value': this.loggedUserObj['menuId'] });
        returnArray.push({
            'key': 'officeId', 'value': this.loggedUserObj['officeDetail']['officeId']
        });
        // returnArray.push({
        //     'key': 'pvuId', 'value': this.loggedUserObj['officeDetail']['pvuId']
        // });
        returnArray.push({ 'key': 'lkPoOffUserId', 'value': this.loggedUserObj['lkPOUId'] });
        // returnArray.push(
        //     {
        //         'key': 'wfRoleIds',
        //         'value': this.loggedUserObj['wfRoleId'] ? this.loggedUserObj['wfRoleId'].toString() : ''
        //     }
        // );
        return returnArray;
    }

    /**
     * This Function triggered when Search Button is Click
     */
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
                this.selectedData.find(ob => ob.id === item.id) === undefined) {
                // push the selected object Array in the Selected Data
                this.selectedData.push(item);
                item.isReceived = true;
                // Condition to disable or enable Receive Button
                if (!item.outWardNo && !item.outWardDate) {
                    if (this.receiveData.find((ob) => ob.id === item.id) === undefined) {
                        this.receiveData.push({ id: item.id });
                        this.disableOutward = false;
                    }
                }
            }
            // Condition for Unselecting Row
        } else {
            item.isReceived = false;
            // Remove the data if unselected and exists in the Selected data Object Array
            // Removing Only that row form The Selection data after finding the exact index of that data in
            // Selected data Array
            if (this.submitData.findIndex(ob => ob.id === item.id) !== -1) {
                this.submitData.splice(this.submitData.findIndex(ob => ob.id === item.id), 1);
            }
            if (this.selectedData.findIndex(ob => ob.id === item.id) !== -1) {
                this.selectedData.splice(this.selectedData.findIndex(ob => ob.id === item.id), 1);
            }
            if (this.receiveData.findIndex(ob => ob.id === item.id) !== -1) {
                this.receiveData.splice(this.receiveData.findIndex(ob => ob.id === item.id), 1);
            }
            this.checked = false;
            // Condition for toggling the Master Checkbox
            if (this.selectedData.length === 0) {
                this.checked = false;
                this.intermediate = false;
            }
        }
        if (this.receiveData.length > 0) {
            this.disableOutward = false;
        } else {
            this.disableOutward = true;
        }
        if (this.isAllSelected()) {
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
        if (check.checked) {
            this.selectedData.push(item);
            item.isReceived = true;
            if (!item.outWardNo && !item.outWardDate) {
                if (this.receiveData.find((ob) => ob.id === item.id) === undefined) {
                    this.receiveData.push({ id: item.id });
                    this.disableOutward = false;
                }
            }
        } else {
            item.isReceived = false;
        }
        if (this.isAllSelected()) {
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
                if (includeRow.outwardFlag) {
                    self.selectallEvent({ checked: true }, includeRow);
                }
            });
        } else {
            this.disableOutward = true;
            this.intermediate = false;
            this.checked = false;
            this.receiveData = [];
            this.submitData = [];
            self.dataSource.data.forEach((includeRow) => {
                self.selectallEvent({ checked: false }, includeRow);
            });
        }
    }

    /**
     * Check if all rows are selected or not
     */

    isAllSelected() {
        const notOutwardRecords = this.dataSource.data.filter((outwardData) => {
            return outwardData.outwardFlag === 1;
        });
        if (notOutwardRecords && notOutwardRecords.length === this.selectedData.length) {
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
     * Triggered when Outward Button is clicked
     * this function will Outward the Inward date and Inward Number
     */

    onOutward() {
        if (this.receiveData.length > 0) {
            const eventType = this.eventsForm.get('eventCode').value;
            this.pvuWFService.receiveOutward(this.receiveData, eventType).subscribe((res) => {
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

    submitOutward(): void {
        if (this.selectedData.length !== 0) {
            const data = this.selectedData.every((item) => {
                return item.outWardDate && item.outWardNo;
            });
            if (data) {
                this.submitClicked = true;
                if (this.outForm.valid) {
                    this.selectedData.forEach((item) => {
                        if (this.submitData.find(ob => ob.id === item.id) === undefined) {
                            if (item.outWardDate && item.outWardNo) {
                                this.submitData.push({
                                    id: item.id,
                                    status: item.status,
                                    postConsignmentNumber: item.postConsignmentNumber
                                });
                            }
                        }
                    });
                    const selectedEvent = this.eventsNameList.filter(event => {
                        return event.code === this.eventsForm.get('eventCode').value;
                    })[0];
                    if (selectedEvent) {
                        // tslint:disable-next-line: no-use-before-declare
                        const dialogRef = this.dialog.open(PVUOutwardFwdDialogComponent, {
                            width: '600px',
                            minHeight: '100px',
                            data: {
                                submitData: this.submitData,
                                eventType: this.eventsForm.get('eventCode').value,
                                eventId: selectedEvent.id,
                            }
                        });
                        dialogRef.afterClosed().subscribe(result => {
                            const eventCode = this.eventsForm.get('eventCode').value;
                            this.eventsForm.reset();
                            this.eventsForm.patchValue({
                                eventCode: eventCode
                            });
                            if (result === 'yes') {
                                this.newSearch = true;
                                this.getData();
                            }
                            this.submitClicked = false;
                        });
                    }
                } else {
                    this.toastr.error('Please enter consignment number for selected records!');
                }
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
            data: EVENT_ERRORS.WORKFLOW.CLOSE
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
    selector: 'app-pvu-outward-dialog',
    templateUrl: 'pvu-outward-dialog.html',
})
export class PVUOutwardFwdDialogComponent implements OnInit {

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
    actionList: object[] = [];
    actionCodeCtrl: FormControl = new FormControl();
    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private pvuService: PvuCommonService,
        private pvuWFService: PVUWorkflowService,
        public dialogRef: MatDialogRef<PVUOutwardFwdDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.event = this.data.eventType;
        this.eventId = this.data.eventId;
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
                if (this.data.submitData.length !== 0) {
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
                'trnId': Number(this.data.submitData[0].id),
                'userId': this.userId,
                'event': this.event,
                'eventId': this.eventId,
                'wfRoleIds': this.wfRoleIds,
                'lkPOUId': this.lkPoOffUserId,
            };
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
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }

    /**
     * Triggered when Wf is Submitted
     * This Function will call outward WF Action Submit Api
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
            this.data.submitData.forEach(el => {
                params.push({
                    'assignByOfficeId': this.officeId,
                    'assignByPostId': this.postId,
                    'assignByUserId': this.userId,
                    'assignByWfRoleId': selectedAction[0]['currentWfRoleId'],
                    'assignToWfRoleId': selectedAction[0]['assignedWfRoleId'],
                    'currentWorkflowId': selectedAction[0]['currentWorkflowId'],
                    'menuId': this.menuId,
                    'remarks': 'Outward',
                    'trnId': Number(el.id),
                    'postConsignmentNumber': el.postConsignmentNumber,
                    'event': this.event,
                    'eventId': this.eventId,
                    'status': el.status,
                    'trnStatus': selectedAction[0]['trnStatus'],
                    'wfActionId': selectedAction[0]['wfActionId'],
                    'wfStatus': selectedAction[0]['wfStatus'],
                    'assignByActionLevel': selectedAction[0]['currentActionLevel'],
                    'assignToActionLevel': selectedAction[0]['nextActionLevel'],
                    'assignByPOUId': this.lkPoOffUserId
                });
            });
            this.pvuWFService.submitOutwardWF(params, this.event).subscribe((data) => {
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
            this.toastr.error(EVENT_ERRORS.WORKFLOW.VALIDATION.TOASTR_REQUIRED);
        }
    }
    onNoClick() {
        this.dialogRef.close('no');
    }
}
