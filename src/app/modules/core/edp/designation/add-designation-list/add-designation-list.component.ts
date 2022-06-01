import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { District, StatusName } from '../../model/add-designation';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddDesignationService } from '../../services/add-designation.service';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EdpDdoOfficeService } from '../../services/edp-ddo-office.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';

@Component({
    selector: 'app-add-designation-list',
    templateUrl: './add-designation-list.component.html',
    styleUrls: ['./add-designation-list.component.css']
})
export class AddDesignationListComponent implements OnInit {
    searchaddDesignForm: FormGroup;

    fromDate = new Date();
    fromMaxDate = new Date();
    toMinDate: Date;
    toMaxDate = new Date();

    paginationArray;
    newSearch: boolean = false;
    totalRecords: number = 0;
    sortBy: string = '';
    sortOrder: string = '';
    pageSize = 0;
    pageIndex: number;
    isSearch: number = 1;
    storedData: any[] = [];
    indexedItem: number;
    customPageIndex: number;
    iteratablePageIndex: number;
    pageElements: number;

    errorMessages = msgConst;

    matSelectNullValue = EdpDataConst.MAT_SELECT_NULL_VALUE;
    displayedColumnsFooter: string[] = ['id'];
    dataSourceAddDesignationList = new MatTableDataSource([]);
    pageEvent: any;
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    statusList: StatusName[] = [];
    districtNamelist: District[] = [];
    workFlowStatusList: StatusName[] = [];
    statusCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();
    wfStatusCtrl: FormControl = new FormControl();
    loggedUserObj;

    displayedColumns: string[] = [
        'id', 'transactionNumber',  'transactionDate', 'districtName',
        'ddoNo', 'cardexNo', 'officeName', 'designationName', 'lyingWith', 'status', 'wfStatus', 'action'
    ];
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private addDesignationService: AddDesignationService,
        private edpDdoOfficeService: EdpDdoOfficeService,
        private storageService: StorageService,
        private commonService: CommonService
    ) { }
    ngOnInit() {
        this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
        const userOffice = this.storageService.get('currentUser');
        const loginPost = userOffice['post'].filter((item) => item['loginPost'] === true);
        this.loggedUserObj = loginPost;
        if (this.commonService.getwfRoleId()) {
            const wfRoleIdArray = this.getWfRoleIdArray(this.commonService.getwfRoleId());
            this.loggedUserObj['wfRoleData'] = wfRoleIdArray;
        }
        this.createForm();
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.getAddDesignationList();
        this.getSearchDropDownValue();
        this.dataSourceAddDesignationList.sort = this.sort;
    }
    resetToDate() {
        this.toMinDate = new Date(this.searchaddDesignForm.controls.fromDate.value);
        this.searchaddDesignForm.controls.toDate.setValue('');
    }
    createForm() {
        this.searchaddDesignForm = this.fb.group({
            trnNo: [''],
            fromDate: [''],
            toDate: [''],
            designationName: [''],
            districtId: [''],
            ddoNo: [''],
            cardexNo: [''],
            statusId: [],
            wfStatus: ['']
        });
    }
    /**
     * @description method to load dropdown values in search page of listing
     * Param - {}
     * @returns  values of district, status, WFstatus
    */

    getSearchDropDownValue() {
        this.addDesignationService.loadSearchDropDownValue().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.districtNamelist = res['result']['districts'];
                this.statusList = res['result']['transStatusList'];
                this.workFlowStatusList = res['result']['workFlowStatusList'];
            }
        },
        (err) => {
            this.toastr.error(this.errorMessages['DDO_OFFICE']['ERR_OFFICE_MASTER_DATA']);

        });
    }
    onSubmitSearch() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 0;
        this.getAddDesignationList();
    }
    getAddDesignationList (event: any = null) {
        const searchData = this.getSearchFilter();
        if (!searchData) {
            return false;
        }
        const passData = {
            pageIndex : this.customPageIndex,
            pageElement : this.pageElements,
            jsonArr: searchData
        },
        self = this;
        if (!this.newSearch && this.storedData.length !== 0 &&
            ((this.iteratablePageIndex + 1) <= ( Math.ceil(this.pageElements / this.pageSize)))) {
            // If data already fetched
            this.dataSourceAddDesignationList = new MatTableDataSource(this.storedData.slice(
                this.iteratablePageIndex * this.pageSize,
                (this.iteratablePageIndex * this.pageSize) + this.pageSize
            ));
        } else {
            // If data needs to fetch from database.
            this.addDesignationService.getAddDesignationList(passData).subscribe((res) => {
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
                    self.dataSourceAddDesignationList = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize, (
                            self.iteratablePageIndex * self.pageSize
                        ) + self.pageSize
                    ));
                    self.totalRecords = res['result']['totalElement'];
                    self.dataSourceAddDesignationList.sort = self.sort;
                } else {
                    self.storedData = [];
                    self.dataSourceAddDesignationList = new MatTableDataSource(self.storedData);
                    self.toastr.error(res['message']);
                    self.totalRecords = 0;
                    self.pageIndex = 0;
                    self.customPageIndex = 0;
                    self.iteratablePageIndex = 0;
                    self.dataSourceAddDesignationList.sort = self.sort;
                }
            }, (err) => {
                self.toastr.error(this.errorMessages['Add_DESIGNATION_LIST']['ERR_Add_DESIGNATION_LIST']);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSourceAddDesignationList = new MatTableDataSource([]);
            });
        }
    }
    getSearchFilter() {
        const obj = this.searchaddDesignForm.value;
        const returnArray = [];
        if ( !obj.trnNo && !obj.fromDate && !obj.toDate && !obj.ddoNo && !obj.designationName &&
            !obj.statusId && !obj.districtId && !obj.cardexNo && !obj.wfStatus) {
                this.isSearch = 1;
        }
        const searchObj = {};
        searchObj['key'] = 'isSearch';
        searchObj['value'] = this.isSearch;
        returnArray.push(_.cloneDeep(searchObj));
        // tslint:disable-next-line: forin
        for (const key in obj) {
            const currObj = {};
            currObj['key'] = key;
            if (key === 'trnNo' || key === 'fromDate' || key === 'toDate' || key === 'ddoNo'
            || key === 'designationName' || key === 'wfStatus' || key === 'statusId') {
                if (key === 'fromDate' || key === 'toDate' ) {
                    if (obj['fromDate'] || obj['toDate']) {
                        if (!(obj['fromDate'] && obj['toDate'])) {
                            if (!obj['fromDate']) {
                                this.toastr.error(this.errorMessages['Add_DESIGNATION_LIST']['FROM_DATE']);
                            } else {
                                this.toastr.error(this.errorMessages['Add_DESIGNATION_LIST']['TO_DATE']);
                            }
                            return false;
                        }
                    }
                    const datePipe = new DatePipe('en-US');
                    currObj['value'] = (datePipe.transform(obj[key], 'MM/dd/yyyy') || '');
                } else {
                    currObj['value'] = (obj[key] || '').trim() ;
                }
            } else if ( key === 'districtId' ||
            key === 'cardexNo' ) {
                if (key === 'cardexNo') {
                    currObj['value'] = Number(obj[key] || 0);
                } else {
                    currObj['value'] = (obj[key] || 0);
                }
            }
            returnArray.push(currObj);
        }
        returnArray.push({
            key: 'officeId',
            value: this.loggedUserObj[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId']
            },
            {
            key: 'wfRoles',
            value: this.loggedUserObj['wfRoleData'] ? this.loggedUserObj['wfRoleData'].toString() : ''
            },
            {
            key: 'pouId',
            value: this.loggedUserObj[0]['lkPoOffUserId']
        });

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
        this.getAddDesignationList(event);
    }
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getAddDesignationList();
    }
    clearForm() {
        const proceedMessage = this.errorMessages.CONFIRMATION_DIALOG.RESET_DATA;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.searchaddDesignForm.reset();
            }
        });
    }
    editDesignation(element) {
        this.router.navigate(
            ['../edit', element.designationId],
            {relativeTo: this.activatedRoute, skipLocationChange: true}
        );
    }
    viewDesignation(element) {
        this.router.navigate(
            ['../view', element.designationId],
            {relativeTo: this.activatedRoute, skipLocationChange: true}
        );
    }
    showConfirmationPopup(designationId, index) {
        const param = {
            id: designationId
        };
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '360px',
          data: msgConst.CONFIRMATION_DIALOG.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.addDesignationService.deleteAddDesignation(param).subscribe((res) => {
                    if (res && res['status'] === 200 ) {
                        this.toastr.success(this.errorMessages['Add_DESIGNATION_LIST']['Add_DESIGNATION_DELETE']);
                        this.newSearch = true;
                        // this.getAddDesignationList();
                        this.dataSourceAddDesignationList.data.splice(index, 1);
                        this.dataSourceAddDesignationList.data = this.dataSourceAddDesignationList.data;
                        // this.totalRecords = this.dataSourceAddDesignationList.data.length;
                    }
                }, (err) => {
                    this.toastr.error(this.errorMessages['Add_DESIGNATION_LIST']['ERR_Add_DESIGNATION_DELETE']);
                });
            }
        });
    }
    /**
     * @description Method for WFRole Id
     * Param - {}
     * @returns  array form of WFrole Id
    */
    getWfRoleIdArray(wfRoleData) {
        const wfRoleArray = [];
        wfRoleData.forEach(element => {
            if (wfRoleArray.indexOf(element['wfRoleIds'][0]) === -1) {
                wfRoleArray.push(element['wfRoleIds']);
            }
        });
        return wfRoleArray;
    }
    /**
     * @description Works on clode button take back to home page
     * Param - {}
     * @returns  back to home page
    */
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

}
