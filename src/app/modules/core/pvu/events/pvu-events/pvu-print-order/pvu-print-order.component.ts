import { PrintRemarksHistoryDailogComponent } from './print-remarks-history-dailog/print-remarks-history-dailog.component';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { PvuCommonService } from '../../../pvu-common/services/pvu-common.service';
import { ValidationService } from 'src/app/modules/services/validatation.service';
import * as _ from 'lodash';
import { CommonService } from 'src/app/modules/services/common.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { PVUWorkflowService } from './../services/pvu-workflow.service';
import { PrintRemarksDailogComponent } from './print-remarks-dailog/print-remarks-dailog.component';
import { COMMON_MESSAGES } from '../../../pvu-common';

@Component({
    selector: 'app-pvu-print-order',
    templateUrl: './pvu-print-order.component.html',
    styleUrls: ['./pvu-print-order.component.css']
})
export class PVUPrintOrderComponent implements OnInit {
    displayedColumns: string[] = [
        'isSelected', 'position', 'transNo', 'inwardDate', 'inwardNumber', 'eventName', 'employeeNo', 'employeeName',
        'designation', 'retirementDate', 'authorizationDate', 'officeName', 'status', 'wfStatus', 'printCnt', 'action'];

    // variableClm = new BehaviorSubject<string[]>(['noData']);
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
    authToMin: Date;
    inwardToMin: Date;
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
    districtList;
    designationCtrl: FormControl = new FormControl();
    date = new FormControl(new Date());
    eventsNameCtrl: FormControl = new FormControl();
    classCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
    locationCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();
    wfStatusCtrl: FormControl = new FormControl();
    printStatusCtrl: FormControl = new FormControl();
    dataSource = new MatTableDataSource([]);
    displayedColumnsFooter: string[] = ['position'];
    selectedData = [];
    dateNow: Date;
    intermediate = false;
    commonRemarks: string;
    loader: boolean = true;
    printStatusList = [
        { lookupInfoId: 1, lookupInfoName: 'Print' },
        { lookupInfoId: 2, lookupInfoName: 'Reprint' }
    ];

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
        private pvuService: PvuCommonService,
        private commonService: CommonService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loader = false;
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.pageSize = 25;
        this.dateNow = new Date();
        this.authToMin = new Date('01/01/1900');
        this.createForm();
        this.getLookupInfo();
        /**
         * To get the current user Details
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
            authorizationFromDate: [''],
            authorizationToDate: [''],
            eventCode: ['', Validators.required],
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
            transNo: [''],
            printStatus: ['']
        });
    }

    getLookupInfo() {
        this.pvuWorkflowService.getPrintOrderLookup().subscribe((res) => {
            // console.log(res, 'lookup');
            if (res && res['result'] && res['status'] === 200) {
                this.eventsNameList = res['result']['pvuEvents'];
                this.designationList = res['result']['designation'];
                this.districtList = res['result']['district'];
                this.empTypeList = res['result']['lstLuLookUp']['Emp_Type'];
                this.classList = res['result']['lstLuLookUp']['Dept_Class'];
            }
        }, err => {
            this.toastr.error(err);
        });
    }

    /**
     * Authorize to date Valuidation based on Authorised from Date
     * @param event selected date on change Event
     */

    onAuthFromSelect(event) {
        this.authToMin = event.value;
        const authFromDate = this.eventsForm.controls.authorizationFromDate.value;
        const authToDate = this.eventsForm.controls.authorizationToDate.value;
        if (authToDate !== null && authToDate !== '') {
            if (authToDate < authFromDate) {
                this.eventsForm.controls.authorizationToDate.reset();
            }
        }
    }

    /**
     * Authorize to date Valuidation based on Authorised from Date
     * @param event selected date on change Event
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
     * To get the form Control
     */

    get fc() {
        return this.eventsForm.controls;
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
                item.isPrint === 1
            ) {
                this.selectedData.push(item);
                item.isSelected = true;
            }
        } else {
            item.isSelected = false;
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

    /**
     * To get the Table Data
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
            setTimeout(function () {
                self.dataSource.sort = self.sort;
            }, 0);
            this.selectedData.forEach(el => {
                el.isSelected = false;
            });
            this.selectedData = [];
            this.dataSource.data.forEach(el => {
                el.isSelected = false;
            });
        } else {
            const eventType = this.eventsForm.get('eventCode').value;
            // If data needs to fetch from database.
            this.pvuWorkflowService.getPVUPrintOrderList(passData, eventType).subscribe((res) => {
                self.newSearch = false;
                if (res && res['status'] === 200) {
                    // For customize pagination
                    self.storedData = _.cloneDeep(res['result']['result']);
                    if (
                        event != null &&
                        event.pageIndex < event.previousPageIndex &&
                        (
                            self.iteratablePageIndex - 1) === (Math.ceil(self.pageElements / self.pageSize)
                        )
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
                    this.selectedData = [];
                    if (self.dataSource.data.length > 0) {
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

    convertDateFormat(date) {
        if (date !== '' && date !== undefined && date != null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'MM/dd/yyyy');
        }
        return '';
    }

    /**
     * To get the search parameters
     */

    getSearchFilter() {
        const obj = this.eventsForm.value;

        if (!obj.authorizationToDate && !obj.authorizationFromDate && !obj.empNo
            && !obj.empName && !obj.designationId && !obj.caseNo && !obj.classId
            && !obj.retirementDate && !obj.panNo && !obj.districtId && !obj.cardexNo
            && !obj.ddoCode && !obj.employeeTypeId && !obj.inwardFromDate && !obj.inwardToDate
            && !obj.transNo && !obj.printStatus) {
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
            if (key === 'designationId' ||
                key === 'districtId' || key === 'classId' ||
                key === 'employeeTypeId' ||
                key === 'empNo' ||
                key === 'printStatus'
            ) {
                currObj['value'] = (Number(obj[key]) || 0);
                returnArray.push(currObj);
            } else {
                if (
                    key === 'authorizationToDate' ||
                    key === 'authorizationFromDate' ||
                    key === 'inwardFromDate' ||
                    key === 'inwardToDate' ||
                    key === 'retirementDate') {
                    currObj['value'] = '' + (this.convertDateFormat(obj[key]) || '');
                    returnArray.push(currObj);
                } else {
                    currObj['value'] = '' + (obj[key] || '');
                    returnArray.push(currObj);
                }
            }
        }
        returnArray.push({ 'key': 'trnStatus', 'value': '' });
        returnArray.push({ 'key': 'wfStatus', 'value': '' });
        returnArray.push({ 'key': 'postId', 'value': this.loggedUserObj['postId'] });
        returnArray.push({ 'key': 'menuId', 'value': this.commonService.getMenuId() });
        returnArray.push({ 'key': 'officeId', 'value': this.loggedUserObj['officeDetail']['officeId'] });
        returnArray.push({ 'key': 'pvuOfficeId', 'value': this.loggedUserObj['officeDetail']['officeId'] });
        returnArray.push({ 'key': 'lkPoOffUserId', 'value': this.loggedUserObj['lkPOUId'] });
        returnArray.push({
            'key': 'wfRoleIds', 'value': this.loggedUserObj['wfRoleId'] ? this.loggedUserObj['wfRoleId'].toString() : ''
        });
        return returnArray;
    }

    onSubmitSearch() {
        if (this.eventsForm.valid) {
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
        this.authToMin = new Date('01/01/1900');
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

    viewRePrintHistory(element) {
        const dailogData = {
            'empId': element['empId'],
            'id': element['id'],
            'eventType': this.eventsForm.get('eventCode').value,
            'remarksLabel': COMMON_MESSAGES.VIEW_PVU_REMARKS_LABEL
        };
        this.dialog.open(PrintRemarksHistoryDailogComponent, {
            width: '2700px',
            height: '600px',
            data: dailogData
        });
    }

    /**
     * To get WF ID
     * @param element row data
     * @param eventId event TYpe
     * @param _print today's date if print count is 0
     * @param rePrint today's date if print count is greater than 0
     */

    getCurrentWFID(element?, eventId?, _print?, rePrint?) {
        let params;
        if (!element) {
            if (this.selectedData && this.selectedData.length > 0) {
                let trnId;
                if (this.selectedData.length > 0) {
                    this.selectedData.forEach(ele => {
                        if (ele['printCnt'] === 0) {
                            trnId = ele['id'];
                        }
                    });
                }
                params = {
                    'menuId': this.commonService.getMenuId(),
                    'officeId': this.loggedUserObj['officeDetail']['officeId'],
                    'postId': this.loggedUserObj['postId'],
                    'trnId': trnId ? Number(trnId) : Number(this.selectedData[0]['id']),
                    'userId': this.loggedUserObj['userId'],
                    'wfRoleIds': this.loggedUserObj['wfRoleId'],
                    'lkPOUId': this.loggedUserObj['lkPOUId'],
                    'eventId': this.selectedData[0].eventId
                };
            }
        } else {
            params = {
                'menuId': this.commonService.getMenuId(),
                'officeId': this.loggedUserObj['officeDetail']['officeId'],
                'postId': this.loggedUserObj['postId'],
                'trnId': Number(element['id']),
                'userId': this.loggedUserObj['userId'],
                'wfRoleIds': this.loggedUserObj['wfRoleId'],
                'lkPOUId': this.loggedUserObj['lkPOUId'],
                'eventId': element.eventId
            };
        }
        this.pvuService.getWorkFlowAssignmentOpt(params).subscribe(res => {
            if (!element) {
                this.multiplePrinting(res);
            } else {
                this.printing(element, eventId, _print, rePrint, res);
            }
        });

    }

    /**
     * For Multiple Printing
     * @param actionRes to Get Work flow ID
     */

    multiplePrinting(actionRes) {
        let currentWFId;
        let currentActionLvl;
        let currentWFActionID;
        let paramsArray: any[];
        paramsArray = [];
        let rePrintDate;
        let printDate;

        if (this.selectedData.length === 0) {
            this.toastr.error('Please Select Atleast 1 Record');
            return;
        }

        if (!actionRes) {
            currentWFId = 152;
            currentActionLvl = 0;
            currentWFActionID = 21;
        } else {
            if (actionRes === null || actionRes === []) {
                currentWFId = 152;
                currentActionLvl = 0;
                currentWFActionID = 21;
            } else {

                if (!actionRes['result']) {
                    currentWFId = 152;
                    currentActionLvl = 0;
                    currentWFActionID = 21;
                } else if (actionRes['result'].length === 0) {
                    currentWFId = 152;
                    currentActionLvl = 0;
                    currentWFActionID = 21;
                } else {
                    currentWFId = actionRes['result'][0]['currentWorkflowId'];
                    currentActionLvl = actionRes['result'][0]['currentActionLevel'];
                    currentWFActionID = actionRes['result'][0]['wfActionId'];
                }
            }
        }
        if (this.commonRemarks === null) {
            this.commonRemarks = '';
        }

        let eventId;
        this.selectedData.forEach(ele => {
            const event = this.eventsNameList.filter(eventObj => {
                return eventObj.code === ele.eventCode;
            })[0];
            if (event) {
                eventId = event.id;
            }
            if (ele['printCnt'] > 0) {
                rePrintDate = new Date();
                printDate = null;
            } else {
                printDate = new Date();
                rePrintDate = null;
            }
            const params = {
                'printEndorsementDto': {
                    'formAction': 'SUBMITTED',
                    'id': ele['printEndId'],
                    'printCnt': ele['printCnt'],
                    'printDocType': 0,
                    'status': 327,
                    'trnId': ele['id'],
                    'remark': this.commonRemarks
                },
                'pvuWFWrapperDto': {
                    'assignByActionLevel': currentActionLvl,
                    'assignByOfficeId': this.loggedUserObj['officeDetail']['officeId'],
                    'assignByPOUId': this.loggedUserObj['lkPOUId'],
                    'assignByPostId': this.loggedUserObj['postId'],
                    'assignByUserId': this.loggedUserObj['userId'],
                    'assignByWfRoleId': this.loggedUserObj['wfRoleId'][0],
                    'assignToWfRoleId': actionRes && actionRes['result'] &&
                        actionRes['result'][0] ? actionRes['result'][0]['assignedWfRoleId'] : null,
                    'assignToOfficeId': this.loggedUserObj['officeDetail']['officeId'],
                    'currentWorkflowId': currentWFId,
                    'formAction': 'SUBMITTED',
                    'menuId': this.commonService.getMenuId(),
                    'pvuTrnEmpCrWfId': 0,
                    'remarks': 'Print Endorsement',
                    'trnId': ele['id'],
                    'trnStatus': 'Printed',
                    'wfActionId': currentWFActionID,
                    'wfAttachmentIds': [
                        0
                    ],
                    'wfStatus': 'Completed',
                    'eventId': eventId
                },
                'stickerDTO': {
                    'applicableGradePay': '',
                    'applicablePayBand': '',
                    'authorizedByName': '',
                    'cellValue': '',
                    'designation': ele['designation'],
                    'effectiveDate': '',
                    'employeeClass': '',
                    'employeeName': ele['employeeName'],
                    'employeeNo': ele['employeeNo'],
                    'endorsementPrintDate': printDate,
                    'endorsementReprintDate': rePrintDate,
                    'eventCode': ele['eventCode'],
                    'id': Number(ele['id']),
                    'last5thPayCommissionBasic': '',
                    'last5thPayCommissionScale': '',
                    'last6thPayBand': '',
                    'last6thPayBandValue': '',
                    'last6thPayGradePay': '',
                    'levelValue': '',
                    'nextIncDate': '',
                    'officeAddress': '',
                    'officeName': ele['officeName'],
                    'payVerificationUnit': '',
                    'place': '',
                    'rePrintCount': '',
                    'remarks7thPay': '',
                    'revised6thPayBasic': '',
                    'revised7thPayBasic': '',
                    'eventId': eventId
                }
            };
            paramsArray.push(params);
        });

        const eventType = this.eventsForm.get('eventCode').value;
        this.pvuWorkflowService.printMultipleOrder(paramsArray, eventType).subscribe(res => {
            if (res) {
                try {
                    // Check popup is blocked or not
                    let newWin;
                    const file = res['result'];
                    const docType = 'application/pdf';
                    const byteArray = new Uint8Array(atob(file).split('').map(char => char.charCodeAt(0)));
                    const blob = new Blob([byteArray], { type: docType });
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        this.onSubmitSearch();
                        newWin = window.navigator.msSaveOrOpenBlob(blob);
                        this.loader = false;
                    } else {
                        this.onSubmitSearch();
                        const url = window.URL.createObjectURL(blob);
                        newWin = window.open(url, '_blank');
                    }
                    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
                        const selectedIds = [];
                        this.selectedData.forEach(ele => {
                            selectedIds.push({
                                'eventId': eventId,
                                'trnId': Number(ele['id'])
                            });
                        });
                        this.toastr.error('Please allow popups in browser settings!');
                        this.pvuWorkflowService.rollbackPrintCount(selectedIds).subscribe(resRoll => {
                            if (resRoll['status'] === 200 && resRoll['result']) {
                                this.onSubmitSearch();
                            }
                        });
                    }
                } catch (e) {
                    // Handle the reset the count of print
                    const selectedIds = [];
                    this.selectedData.forEach(el => {
                        selectedIds.push({
                            'eventId': eventId,
                            'trnId': Number(el['id'])
                        });
                    });
                    this.toastr.error('Please allow popups in browser settings!');
                    this.pvuWorkflowService.rollbackPrintCount(selectedIds).subscribe(re => {
                        if (re['status'] === 200 && re['result']) {
                            this.onSubmitSearch();
                        }
                    });
                }
            }
        }, err => {
            this.toastr.error(err);
        });
    }

    /**
     * To print
     * @param element row data
     */

    onPrint(element) {
        this.loader = true;
        let rePrint;
        let print;
        // console.log(element);
        const nowDate = new Date();
        const event = this.eventsNameList.filter(eventObj => {
            return eventObj.code === element.eventCode;
        })[0];
        let eventId;
        if (event) {
            eventId = event.id;
        }
        if (
            element['printCnt'] === 0
        ) {
            print = nowDate;
            rePrint = null;
        } else {
            print = null;
            rePrint = nowDate;
        }
        this.getCurrentWFID(element, eventId, print, rePrint);
    }

    /**
     * Triggered when Print Button is clicked
     */

    onMultiplePrint() {
        this.loader = true;
        let remarksFlag = 0;
        if (this.selectedData.length > 0) {
            this.selectedData.forEach(ele => {
                if (ele['printCnt'] > 0) {
                    remarksFlag++;
                }
            });
        }
        this.loader = false;
        if (remarksFlag > 0) {
            const dialogRef = this.dialog.open(PrintRemarksDailogComponent, {
                width: '600px',
                data: []
            });
            dialogRef.afterClosed().subscribe(result => {
                if (!result) {
                    return;
                } else {
                    if (result['isSubmitted']) {
                        if (result['remarks'] !== null && result['remarks'] !== '') {
                            this.commonRemarks = result['remarks'];
                            this.getCurrentWFID();
                        } else {
                            this.toastr.error('Please Enter Remarks');
                        }
                    }
                }
            });
        } else {
            this.getCurrentWFID();
        }
    }

    /**
     * check if printing for 1st time or not , then pass to print stricker function
     * @param element row data
     * @param eventId event TYpe
     * @param _print today's date if print count is 0
     * @param rePrint today's date if print count is greater than 0
     * @param actionRes wf response
     */

    printing(element, eventId, _print, rePrint, actionRes) {

        if (element['printCnt'] > 0) {
            this.loader = false;
            const dialogRef = this.dialog.open(PrintRemarksDailogComponent, {
                width: '600px',
                data: []
            });
            dialogRef.afterClosed().subscribe(result => {
                if (!result) {
                    return;
                } else {
                    if (result['isSubmitted']) {
                        if (result['remarks'] !== null && result['remarks'] !== '') {
                            this.printOrder(element, eventId, _print, rePrint, actionRes, result['remarks']);
                        } else {
                            this.toastr.error('Please Enter Remarks');
                        }
                    }
                }
            });
        } else {
            this.loader = false;
            this.printOrder(element, eventId, _print, rePrint, actionRes);
        }
    }

    /**
     * final step to print Order
     * @param element row data
     * @param eventId event TYpe
     * @param _print today's date if print count is 0
     * @param rePrint today's date if print count is greater than 0
     * @param actionRes wf response
     * @param remarks rePrint Remarks
     */

    printOrder(element, eventId, _print, rePrint, actionRes, remarks?) {
        let remark;
        let currentWFId;
        let currentActionLvl;
        let currentWFActionID;

        if (!actionRes) {
            currentWFId = 152;
            currentActionLvl = 0;
            currentWFActionID = 21;
        } else {
            if (actionRes === null || actionRes === []) {
                currentWFId = 152;
                currentActionLvl = 0;
                currentWFActionID = 21;
            } else {
                if (!actionRes['result']) {
                    currentWFId = 152;
                    currentActionLvl = 0;
                    currentWFActionID = 21;
                } else if (actionRes['result'].length === 0) {
                    currentWFId = 152;
                    currentActionLvl = 0;
                    currentWFActionID = 21;
                } else {
                    currentWFId = actionRes['result'][0]['currentWorkflowId'];
                    currentActionLvl = actionRes['result'][0]['currentActionLevel'];
                    currentWFActionID = actionRes['result'][0]['wfActionId'];
                }
            }
        }

        if (!remarks) {
            remark = '';
        } else {
            remark = remarks;
        }
        const params = {
            'printEndorsementDto': {
                'formAction': 'SUBMITTED',
                'id': element['printEndId'],
                'printCnt': element['printCnt'],
                'printDocType': 0,
                'status': 327,
                'trnId': element['id'],
                'remark': remark
            },
            'pvuWFWrapperDto': {
                'assignByActionLevel': currentActionLvl,
                'assignByOfficeId': this.loggedUserObj['officeDetail']['officeId'],
                'assignByPOUId': this.loggedUserObj['lkPOUId'],
                'assignByPostId': this.loggedUserObj['postId'],
                'assignByUserId': this.loggedUserObj['userId'],
                'assignByWfRoleId': this.loggedUserObj['wfRoleId'][0],
                'assignToWfRoleId': actionRes && actionRes['result'] &&
                    actionRes['result'][0] ? actionRes['result'][0]['assignedWfRoleId'] : null,
                'assignToOfficeId': this.loggedUserObj['officeDetail']['officeId'],
                'currentWorkflowId': currentWFId,
                'formAction': 'SUBMITTED',
                'menuId': this.commonService.getMenuId(),
                'pvuTrnEmpCrWfId': 0,
                'remarks': 'Print Endorsement',
                'trnId': element['id'],
                'trnStatus': 'Printed',
                'wfActionId': currentWFActionID,
                'wfAttachmentIds': [
                    0
                ],
                'wfStatus': 'Completed',
                'eventId': eventId
            },
            'stickerDTO': {
                'applicableGradePay': '',
                'applicablePayBand': '',
                'authorizedByName': '',
                'cellValue': '',
                'designation': element['designation'],
                'effectiveDate': '',
                'employeeClass': '',
                'employeeName': element['employeeName'],
                'employeeNo': element['employeeNo'],
                'endorsementPrintDate': _print,
                'endorsementReprintDate': rePrint,
                'eventCode': element['eventCode'],
                'id': Number(element['id']),
                'last5thPayCommissionBasic': '',
                'last5thPayCommissionScale': '',
                'last6thPayBand': '',
                'last6thPayBandValue': '',
                'last6thPayGradePay': '',
                'levelValue': '',
                'nextIncDate': '',
                'officeAddress': '',
                'officeName': element['officeName'],
                'payVerificationUnit': '',
                'place': '',
                'rePrintCount': '',
                'remarks7thPay': '',
                'revised6thPayBasic': '',
                'revised7thPayBasic': '',
                'eventId': eventId
            }
        };
        const eventType = this.eventsForm.get('eventCode').value;
        this.pvuWorkflowService.printOrder(params, eventType).subscribe(res => {
            if (res) {
                try {
                    // Check popup is blocked or not
                    let newWin;
                    const file = res['result'];
                    const docType = 'application/pdf';
                    const byteArray = new Uint8Array(atob(file).split('').map(char => char.charCodeAt(0)));
                    const blob = new Blob([byteArray], { type: docType });
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        this.onSubmitSearch();
                        newWin = window.navigator.msSaveOrOpenBlob(blob);
                        this.loader = false;
                    } else {
                        this.onSubmitSearch();
                        const url = window.URL.createObjectURL(blob);
                        newWin = window.open(url, '_blank');
                    }
                    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
                        this.toastr.error('Please allow popups in browser settings!');
                        this.pvuWorkflowService.rollbackPrintCount([{
                            'eventId': eventId,
                            'trnId': element['id']
                        }]).subscribe(resRoll => {
                            if (resRoll['status'] === 200 && resRoll['result']) {
                                this.onSubmitSearch();
                            }
                        });
                    }
                } catch (e) {
                    // Handle the reset the count of print
                    this.toastr.error('Please allow popups in browser settings!');
                    this.pvuWorkflowService.rollbackPrintCount([{
                        'eventId': eventId,
                        'trnId': element['id']
                    }]).subscribe(re => {
                        if (re['status'] === 200 && re['result']) {
                            this.onSubmitSearch();
                        }
                    });
                }
            }
        }, err => {
            this.toastr.error(err);
        });
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
