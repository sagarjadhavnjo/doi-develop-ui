import { Component, Directive, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subject, BehaviorSubject } from 'rxjs';
import { EmployeeCreationService } from 'src/app/modules/services/pvu/employee-creation.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MENU_ID, pvuMessage } from './../../../../shared/constants/pvu/pvu-message.constants';
import { EcViewCommentsComponent } from '../ec-view-comments/ec-view-comments.component';

@Component({
    selector: 'app-employee-creation-list',
    templateUrl: './employee-creation-list.component.html',
    styleUrls: ['./employee-creation-list.component.css']
})
export class EmployeeCreationListComponent implements OnInit {
    currentPost: object;
    totalRecords: number;
    paginationArray;
    sortBy = '';
    sortOrder: string = '';
    pageSize: number;
    pageIndex: number;
    isSearch = 0;
    pageEvent: any;
    storedData: any[] = [];
    indexedItem: number;
    customPageIndex: number;
    iteratablePageIndex: number;
    pageElements: number;
    disableSearchValue = true;
    newSearch = false;
    loggedUserObj;
    lkPoOffUserId;
    officeTypeId: string;
    officeId: number;
    dateNow = new Date();
    minStartDate: Date;

    variableClm = new BehaviorSubject<string[]>(['noData']);
    displayedColumns: string[] = ['position', 'employeeNo', 'empName', 'caseNo',
        'designation', 'classLevel', 'dob', 'doj', 'pan', 'officeName', 'status', 'wfTrnStatus', 'action'];

    searchListForm: FormGroup;

    empDesignationList: object[] = [];
    empTypeList: object[] = [];
    empClassList: object[] = [];
    officeNameList: object[] = [];
    officeTypeList: object[] = [];
    empPayTypeList: object[] = [];
    workflowStatus_list: object[] = [];

    empDesignationCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
    empClassCtrl: FormControl = new FormControl();
    officeNameCtrl: FormControl = new FormControl();
    officeTypeCtrl: FormControl = new FormControl();
    empPayTypeCtrl: FormControl = new FormControl();
    workflowStatusCtrl: FormControl = new FormControl();
    expressRedirect = null;

    _onDestroy = new Subject<void>();

    dataSource = new MatTableDataSource(['noData']);

    private paginator: MatPaginator;
    private sort: MatSort;

    @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }

    @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    constructor(
        private fb: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        private pvuService: EmployeeCreationService,
        private toaster: ToastrService,
        private route: ActivatedRoute,
        private datepipe: DatePipe,
        private storageService: StorageService
    ) {
        this.totalRecords = 0;
        this.pageSize = 0;
        this.pageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = DataConst.PAGE_ELEMENT;
    }

    ngOnInit() {
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.pageSize = 25;
        this.getLookupInfoData();
        this.getDesignationList();
        this.searchListForm = this.fb.group({
            startDate: [''],
            endDate: [''],
            empNo: [''],
            empName: [''],
            designationId: [''],
            gpfNo: [''],
            cpfNo: [''],
            pPan: [''],
            caseNo: [''],
            empType: [''],
            classId: [''],
            officeId: [''],
            officeType: [''],
            retirementDate: [''],
            employeePayType: [''],
            wfStatus: [''],
        });
        this.route.params.subscribe(resRoute => {
            this.expressRedirect = resRoute.express;
        });
        if (this.expressRedirect) {
            this.pvuService.getMenuDetailsForListing(MENU_ID.EMP_CREATION_LIST).then(res1 => {
                if (res1) {
                    this.getUserDetails();
                } else {
                    this.toaster.error(pvuMessage.EMP_CREATION_LIST_NO_RIGHTS);
                    this.router.navigate(['/dashboard']);
                }
            });
        } else {
            this.getUserDetails();
        }
    }

    getUserDetails() {
        this.pvuService.getCurrentUserMultipleRoleDetail().then(res => {
            if (res) {
                this.loggedUserObj = res;
                if (res['officeDetail']) {
                    this.officeId = +res['officeDetail']['officeId'];
                    const officeName = res['officeDetail']['officeName'];
                    this.officeTypeId = res['officeDetail']['officeTypeId'];
                    const officeTypeName = res['officeDetail']['officeTypeName'];
                    this.officeNameList.push({ 'key': this.officeId, 'value': officeName });
                    this.officeTypeList.push({ 'officeTypeId': this.officeTypeId, 'officeTypeName': officeTypeName });
                }
                if (this.loggedUserObj['wfRoleCode'] === '1070') {
                    this.getOfficeNameByType();
                } else {
                    this.searchListForm.get('officeId').setValue(this.officeId);
                    this.searchListForm.get('officeId').updateValueAndValidity();
                    this.searchListForm.get('officeType').setValue(this.officeTypeId);
                    this.searchListForm.get('officeType').updateValueAndValidity();
                }
                this.getData();
                this.getWorkflowStatus();
            }
        });
    }

    getOfficeNameByType() {
        const param = {
            id: this.officeTypeId
        };
        this.pvuService.getOfficeNameList(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result'] !== '') {
                this.officeNameList = res['result'];
                this.searchListForm.patchValue({
                    officeId : this.officeId,
                    officeType: this.officeTypeId
                });
            } else {
                this.toaster.error(res['message']);
            }
        }, (err) => {
            this.toaster.error(err);
        });
    }

    /**
     * To set the Min date for Start To Date Filed
     * @param event selected date event
     */
    setMinStartDate(event) {
        this.minStartDate = event.value;
        const fromDate = this.searchListForm.controls.startDate.value;
        const toDate = this.searchListForm.controls.endDate.value;
        if (toDate !== null && toDate !== '') {
            if (toDate < fromDate) {
                this.searchListForm.controls.endDate.reset();
            }
        }
    }

    /**
     * To get the workflow status list
     */
    getWorkflowStatus() {
        const param = {
            id: this.loggedUserObj['menuId']
            // id: this.loggedUserObj['linkMenuId']
        };
        this.pvuService.getWorkFlowStatus(param).subscribe((res) => {
            if (res && res['result'] && res['result'].length > 0) {
                this.workflowStatus_list = res['result'];
            }
        });
    }
    getData(event: any = null) {
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: this.getSearchFilter()
        },
            self = this;
        if (!this.newSearch && this.storedData.length !== 0 &&
            (this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize))) {
            this.dataSource = new MatTableDataSource(this.storedData.slice(this.iteratablePageIndex * this.pageSize,
                (this.iteratablePageIndex * this.pageSize) + this.pageSize));
        } else {
            this.pvuService.getEmployeeList(passData).subscribe((res) => {
                self.newSearch = false;
                if (res && res['status'] === 200) {
                    self.storedData = _.cloneDeep(res['result']['result']);
                    if (event != null && event.pageIndex < event.previousPageIndex &&
                        (self.iteratablePageIndex - 1) === (Math.ceil(self.pageElements / self.pageSize))) {
                        self.iteratablePageIndex = Math.ceil((self.pageElements / self.pageSize)) - 1;

                        if (event !== null && event.previousPageIndex > event.pageIndex &&
                            (event.previousPageIndex - event.pageIndex) > 1) {
                            self.iteratablePageIndex = 0;
                        }
                    } else if (event != null && event.pageIndex > event.previousPageIndex &&
                        (event.pageIndex - event.previousPageIndex) > 1) {
                        self.iteratablePageIndex = Math.ceil((self.storedData.length / self.pageSize)) - 1;
                    } else {
                        self.iteratablePageIndex = 0;
                    }

                    self.dataSource = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize,
                        (self.iteratablePageIndex * self.pageSize) + self.pageSize));
                    if (self.storedData.length > 0) {
                        self.variableClm.next(this.displayedColumns);
                    } else {
                        self.variableClm.next(['noData']);
                        self.dataSource = new MatTableDataSource(['noData']);
                    }
                    self.totalRecords = res['result']['totalElement'];
                    setTimeout(() => {
                        self.dataSource.sort = self.sort;
                    });
                } else {
                    self.storedData = ['noData'];
                    self.dataSource = new MatTableDataSource(self.storedData);
                    self.variableClm.next(['noData']);
                    self.toaster.error(res['message']);
                    self.totalRecords = 0;
                    self.pageIndex = 0;
                    self.customPageIndex = 0;
                    self.iteratablePageIndex = 0;
                    self.dataSource.sort = self.sort;
                }
            }, (err) => {
                self.toaster.error(err);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSource = new MatTableDataSource(['noData']);
            });
        }
    }
    getOfficeType(officeTypeId) {
        const param = {
            id: officeTypeId
        };
        this.pvuService.getOfficeType(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result'] !== '') {
                this.officeTypeList = res['result']['Office_type'];
            }
        },
            (err) => {
                this.toaster.error(err);
            });
    }

    /**
     * @description To get the lookup data
     */
    getLookupInfoData() {
        const param = '';
        this.pvuService.getLookUPInfoData(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result'] !== '') {
                this.empTypeList = res['result']['Emp_Type'];
                this.empClassList = res['result']['Dept_Class'];
                this.empPayTypeList = res['result']['Employee_PayType'];
                // this.empDesignationList = res['result']['designation'];
            }
        },
            (err) => {
                this.toaster.error(err);
            });
    }

    /**
     * @description To get the designation list
     */
    getDesignationList() {
        const param = '';
        this.pvuService.getDesignationList(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result'] !== '') {
                this.empDesignationList = res['result'];
            }
        }, (err) => {
            this.toaster.error(err);
        });
    }
    getSearchFilter() {
        const obj = this.searchListForm.value;

        if (!obj.empNo
            && !obj.empName
            && !obj.caseNo
            && !obj.startDate
            && !obj.endDate
            && !obj.empType
            && !obj.pPan
            && !obj.gpfNo
            && !obj.cpfNo
            && !obj.classId
            // && !obj.officeType
            && !obj.retirementDate
            && !obj.employeePayType
            && !obj.wfStatus
            && !obj.designationId) {
            this.isSearch = 0;
        }
        const returnArray = [];
        const searchObj = {};
        searchObj['key'] = 'isSearch';
        searchObj['value'] = this.isSearch;
        returnArray.push(searchObj);

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const currObj = {};
                currObj['key'] = key;
                if (key === 'empName' || key === 'caseNo' || key === 'pPan' || key === 'gpfNo' || key === 'wfStatus') {
                    currObj['value'] = '' + (obj[key] || '');
                } else if (key === 'retirementDate' || key === 'endDate' || key === 'startDate') {
                    if (obj[key]) {
                        currObj['value'] = '' + (this.convertDateFormat(obj[key]) || '');
                    } else {
                        currObj['value'] = '';
                    }
                    // currObj['value'] = '' + obj[key] ? (this.convertDateFormat(obj[key]) || '') : '';
                } else if (key === 'officeId') {
                    currObj['value'] = obj[key] ? obj[key] : this.officeId;
                } else {
                    currObj['value'] = '' + (obj[key] || 0);
                }
                returnArray.push(currObj);
            }
        }
        returnArray.push({ 'key': 'postId', 'value': this.loggedUserObj['postId'] });
        returnArray.push({ 'key': 'menuId', 'value': this.loggedUserObj['menuId'] });
        returnArray.push({ 'key': 'lkPoOffUserId', 'value': this.loggedUserObj['lkPoOffUserId'] });
        // returnArray.push({ 'key': 'menuId', 'value': this.loggedUserObj['linkMenuId'] });
        returnArray.push(
            {
                'key': 'wfRoleIds',
                'value': this.loggedUserObj['wfRoleId'] ? this.loggedUserObj['wfRoleId'].toString() : ''
            });
        return returnArray;
    }
    convertDateFormat(date) {
        if (date !== '' && date !== undefined) {
            date = new Date(date);
            return this.datepipe.transform(date, 'MM/dd/yyyy');
        }
        return '';
    }
    onSubmitSearch() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;
        this.getData();
    }

    onPaginateChange(event) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.customPageIndex = Math.floor((this.pageIndex) / Math.ceil((this.pageElements / this.pageSize)));
        if (event.pageIndex < event.previousPageIndex) {
            this.iteratablePageIndex = this.iteratablePageIndex - 1;

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
        this.dataSource.sort = this.sort;
    }

    onclickStatus(data) {
        if (data.active) {
            data.active = false;
        } else {
            data.active = true;
        }
        return data;
    }

    clearForm() {
        this.searchListForm.reset();
        this.searchListForm.controls.officeId.setValue(this.officeId);
        this.searchListForm.controls.officeType.setValue(this.officeTypeId);
        this.dataSource = new MatTableDataSource(['noData']);
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

    showConfirmationPopup(element) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.pvuService.deleteEmployee({ 'id': element.employeeId }).subscribe((res) => {
                    if (res && res['status'] === 200 && res['message']) {
                        this.toaster.success(res['message']);
                        this.newSearch = true;
                        this.getData();
                    } else {
                        this.toaster.error(res['message']);
                    }
                }, (err) => {
                    this.toaster.error(err);
                });
            }
        });

    }

    /**
     * To display the workflow history comments
     * @param element selected record data
     */
    viewWorkflowHistory(element) {
        const dialogRef = this.dialog.open(EcViewCommentsComponent, {
            width: '2700px',
            height: '600px',
            data: {
                'empId': element.employeeId,
                'heading': 'Employee Creation'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                // close logic
            }
        });
    }

    navigateToEdit(id) {
        if (this.expressRedirect) {
            this.router.navigate(['/dashboard/pvu/employee-creation', 'edit', id],
            { relativeTo: this.route, skipLocationChange: true });
        } else {
            this.router.navigate(['./', 'edit', id], { relativeTo: this.route, skipLocationChange: true });
        }
    }

    navigateToView(id) {
        if (this.expressRedirect) {
            this.router.navigate(['/dashboard/pvu/employee-creation', 'view', id],
            { relativeTo: this.route, skipLocationChange: true });
        } else {
            this.router.navigate(['./', 'view', id], { relativeTo: this.route, skipLocationChange: true });
        }
    }
}
