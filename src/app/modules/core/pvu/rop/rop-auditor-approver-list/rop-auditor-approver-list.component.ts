import { ValidationService } from './../../../../services/validatation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { ROPService } from '../service/rop.service';
import { RopCommentsComponent } from '../rop-comments/rop-comments.component';

@Component({
    selector: 'app-rop-auditor-approver-list',
    templateUrl: './rop-auditor-approver-list.component.html',
    styleUrls: ['./rop-auditor-approver-list.component.css']
})
export class RopAuditorApproverListComponent implements OnInit {

    subscribeParams;
    ropListForm: FormGroup;
    private paginator: MatPaginator;
    private sort: MatSort;

    eventsNameList = [];
    designationList = [];
    districtList = [];
    classList = [];
    officeNameList = [];
    empTypeList = [];
    // workflowStatusList = [];

    eventsNameCtrl: FormControl = new FormControl();
    designationCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();
    classCtrl: FormControl = new FormControl();
    officeNameCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
    // workflowStatusCtrl: FormControl = new FormControl();

    variableClm = new BehaviorSubject<string[]>(['noData']);
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
    dateNow: Date = new Date();
    minForwardToDate: Date;
    minInwardToDate: Date;

    displayedColumns: string[] = [
        'srNo', 'transNo', 'inwardDate', 'inwardNo', 'ropType', 'employeeNumber', 'employeeName', 'designationName',
        'empType', 'officeName', 'forwardDate', 'action'
    ];

    dataSource = new MatTableDataSource(['noData']);
    isAuditor: boolean = false;
    isPvuApprover: boolean = false;

    @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }

    @ViewChild(MatPaginator, { static: true }) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.setDataSourceAttributes();
    }

    constructor(private fb: FormBuilder,
        public dialog: MatDialog,
        private ropService: ROPService,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private datepipe: DatePipe
    ) { }

    ngOnInit() {
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.pageSize = 25;
        this.createForm();

        this.ropService.getCurrentUserDetail().then(res => {
            if (res) {
                this.loggedUserObj = res;
                this.getData();
                this.getLookUpInfo();
            }
        });

        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            if (this.activatedRoute.snapshot.url[0].path === 'auditor-list') {
                this.isAuditor = true;
            } else if (this.activatedRoute.snapshot.url[0].path === 'approver-list') {
                this.isPvuApprover = true;
            }
        });
    }

    // getWorkflowStatus() {
    //     const param = {
    //         id: this.loggedUserObj['linkMenuId']
    //     };
    //     this.ropService.getWorkFlowStatus(param).subscribe((res) => {
    //         if (res && res['result'] && res['result'].length > 0) {
    //             this.workflowStatusList = res['result'];
    //         }
    //     });
    // }

    /**
     * To get the controls of form group
     */
    get fc() {
        return this.ropListForm.controls;
    }

    /**
     * To set the Min date for Forward To Date Filed
     * @param event selected date event
     */
    setMinForwardToDate(event) {
        this.minForwardToDate = event.value;
        const fromDate = this.ropListForm.controls.forwardFromDate.value;
        const toDate = this.ropListForm.controls.forwardToDate.value;
        if (toDate !== null && toDate !== '') {
            if (toDate < fromDate) {
                this.ropListForm.controls.forwardToDate.reset();
            }
        }
    }

    /**
     * To set the Min date for Inwars To Date Filed
     * @param event selected date event
     */
    setMinInwardToDate(event) {
        this.minInwardToDate = event.value;
        const fromDate = this.ropListForm.controls.inwardFromDate.value;
        const toDate = this.ropListForm.controls.inwardToDate.value;
        if (toDate !== null && toDate !== '') {
            if (toDate < fromDate) {
                this.ropListForm.controls.inwardToDate.reset();
            }
        }
    }

    /**
     * To create the search parameter form
     */
    createForm() {
        this.ropListForm = this.fb.group({
            forwardFromDate: [''],
            forwardToDate: [''],
            ropType: [''],
            transNo: [''],
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
            officeId: [''],
            empType: [''],
            inwardNo: [''],
            inwardFromDate: [''],
            inwardToDate: [''],
            // wfStatus: [''],
        });
    }

    /**
     * To load the lookup data
     */
    getLookUpInfo() {
        this.ropService.getInwardLookup().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.designationList = res['result']['designation'];
                this.districtList = res['result']['district'];
                this.eventsNameList = res['result']['lstLuLookUp']['ROPType'];
                this.empTypeList = res['result']['lstLuLookUp']['Emp_Type'];
                this.classList = res['result']['lstLuLookUp']['Dept_Class'];
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * To load the office list
     */
    loadOfficeList() {
        const param = {
            'pvuId': this.loggedUserObj['officeDetail']['officeId'],
            'districtId': this.ropListForm.get('districtId').value
        };

        this.ropListForm.controls.officeId.setValue('');
        this.ropService.getOfficeList(param).subscribe((res) => {
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
        if (!this.ropListForm.get('districtId').value) {
            this.toastr.error('Please Select District');
            this.officeNameList = [];
        }
    }

    /**
     * To get the ROP List Data
     * @param event search parameter
     */
    getData(event = null) {
        if (!this.ropListForm.valid) {
            return false;
        }
        const passData = {
            pageIndex: this.customPageIndex,
            // pageElement: this.pageElements,
            pageElement: 250,
            // sortByColumn: this.sortBy,
            // sortOrder: this.sortOrder,
            jsonArr: this.getSearchFilter()
        },
            self = this;

        if (!this.newSearch && this.storedData.length !== 0 &&
            (this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize))) {
            // If data already fetched
            this.dataSource = new MatTableDataSource(this.storedData.slice(
                this.iteratablePageIndex * this.pageSize,
                (this.iteratablePageIndex * this.pageSize) + this.pageSize)
            );
        } else { // If data needs to fetch from database.
            this.ropService.getAuditorRopList(passData).subscribe((res) => {
                self.newSearch = false;
                if (res && res['status'] === 200) {
                    // this.dataSource.data = res['result'];
                    // For customize pagination
                    self.storedData = _.cloneDeep(res['result']['result']);
                    if (event != null && event.pageIndex < event.previousPageIndex &&
                        (self.iteratablePageIndex - 1) === (Math.ceil(self.pageElements / self.pageSize))) {
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
                        (self.iteratablePageIndex * self.pageSize) + self.pageSize)
                    );
                    if (self.storedData.length > 0) {
                        self.variableClm.next(this.displayedColumns);
                    } else {
                        self.variableClm.next(['noData']);
                        self.dataSource = new MatTableDataSource(['noData']);
                    }
                    // self.dataSource = new MatTableDataSource(res['result']);
                    self.totalRecords = res['result']['totalElement'];
                    self.dataSource.sort = self.sort;
                } else {
                    self.storedData = ['noData'];
                    self.dataSource = new MatTableDataSource(self.storedData);
                    self.variableClm.next(['noData']);
                    self.toastr.error(res['message']);
                    // self.dataSource = new MatTableDataSource(res['result']);
                    self.totalRecords = 0;
                    self.pageIndex = 0;
                    self.customPageIndex = 0;
                    self.iteratablePageIndex = 0;
                    self.dataSource.sort = self.sort;
                }
            }, (err) => {
                self.variableClm.next(['noData']);
                self.toastr.error(err['message']);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSource = new MatTableDataSource([]);
            });
        }
    }

    /**
     * Convert the date formate in to (yyyy-MM-dd)
     * @param date Date formate
     */
    convertDateFormat(date) {
        if (date !== '' && date !== undefined && date != null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'yyyy-MM-dd');
        }
        return '';
    }

    /**
     * To get the search filter parameter
     */
    getSearchFilter() {
        const obj = this.ropListForm.value;

        if (!obj.forwardFromDate &&
            !obj.forwardToDate &&
            !obj.ropType &&
            !obj.transNo &&
            !obj.empNo &&
            !obj.empName &&
            !obj.designationId &&
            !obj.panNo &&
            !obj.districtId &&
            !obj.cardexNo &&
            !obj.ddoCode &&
            !obj.retirementDate &&
            !obj.caseNo &&
            !obj.classId &&
            !obj.officeId &&
            !obj.empType &&
            !obj.inwardNo &&
            !obj.inwardFromDate &&
            !obj.inwardToDate
            // !obj.wfStatus
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
            if (key === 'forwardFromDate' || key === 'forwardToDate' || key === 'retirementDate'
                || key === 'inwardFromDate' || key === 'inwardToDate') {
                currObj['value'] = '' + (this.convertDateFormat(obj[key]) || '');
                returnArray.push(currObj);
            } else if (key === 'caseNo' || key === 'empName' || key === 'panNo' ||
                key === 'transNo' || key === 'inwardNo' || key === 'cardexNo' || key === 'ddoCode') {
                currObj['value'] = '' + (obj[key] || '');
                returnArray.push(currObj);
            } else {
                currObj['value'] = (Number(obj[key]) || 0);
                returnArray.push(currObj);
            }
        }
        returnArray.push({ 'key': 'postId', 'value': this.loggedUserObj['postId'] });
        // returnArray.push({ 'key': 'menuId', 'value': this.loggedUserObj['menuId'] });
        returnArray.push({ 'key': 'menuId', 'value': this.loggedUserObj['linkMenuId'] });
        returnArray.push({ 'key': 'pvuOfficeId', 'value': this.loggedUserObj['officeDetail']['officeId'] });
        returnArray.push({ 'key': 'lkPoOffUserId', 'value': this.loggedUserObj['lkPoOffUserId'] });
        returnArray.push(
            {
                'key': 'wfRoleIds',
                'value': this.loggedUserObj['wfRoleId'] ? this.loggedUserObj['wfRoleId'].toString() : ''
            });
        returnArray.push({ 'key': 'gpfNo', 'value': '' });
        returnArray.push({ 'key': 'wfStatus', 'value': '' });
        // returnArray.push({ 'key': 'transNo', 'value': '' });
        return returnArray;
    }

    /**
     * TO get searched list on submit click
     */
    onSubmitSearch() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;
        this.getData();
    }

    /**
     * On pagination change get the List data
     * @param event list parameter
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

    /**
     * To sort the listing data
     */
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getData();
    }

    /**
     * To set the paginator and sorting
     */
    setDataSourceAttributes() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /**
     * To Reset the search field and set the default value
     */
    clearForm() {
        this.ropListForm.patchValue({
            forwardFromDate: '',
            forwardToDate: '',
            ropType: '',
            transNo: '',
            empNo: '',
            empName: '',
            designationId: '',
            panNo: '',
            districtId: '',
            cardexNo: '',
            ddoCode: '',
            retirementDate: '',
            caseNo: '',
            classId: '',
            officeId: '',
            empType: '',
            inwardNo: '',
            inwardFromDate: '',
            inwardToDate: '',
            // wfStatus: '',
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
     * To display the workflow history comments
     * @param element selected record data
     */
    viewWorkflowHistory(element) {
        const dialogRef = this.dialog.open(RopCommentsComponent, {
            width: '2700px',
            height: '600px',
            data: {
                'empId': element.employeeId,
                'officeId': this.loggedUserObj['officeDetail']['officeId'],
                'eventId': element.eventId,
                'heading': element.ropType
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                // close logic
            }
        });
    }

    /**
     * @method onEdit
     * To edit the selected ROP
     * @param id eventId
     */
    onEdit(id) {
        this.onViewEdit(id, 'edit');
    }

    /**
     * @method onViewEdit
     * To edit the selected ROP
     * @param id eventId
     * @action view/edit
     */
    onViewEdit(id, action) {
        if (this.isAuditor) {
            this.router.navigate(['dashboard/pvu/rop/auditor', action, id],
                { skipLocationChange: true });
        } else if (this.isPvuApprover) {
            this.router.navigate(['dashboard/pvu/rop/approver', action, id],
                { skipLocationChange: true });
        }
    }

    /**
     * @method onView
     * To view the selected ROP
     * @param id eventId
     */
    onView(id) {
        this.onViewEdit(id, 'view');
    }
}
