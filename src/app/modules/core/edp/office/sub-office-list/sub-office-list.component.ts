
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SubOfficeCreationComponent } from '../sub-office-creation/sub-office-creation.component';
import { Taluka, District, Hod, Department } from '../../model/office-data-model';
import { EdpDdoOfficeService } from '../../services/edp-ddo-office.service';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import * as _ from 'lodash';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

interface UserType {
    isHodUser: number;
    isEdpUser: number;
    isToPaoUser: number;
    isDDOUser: number;
    isAdUser: number;
    isDatUser: number;
    isDatSuperAdmin: number;
    isJD: number;
}

@Component({
    selector: 'app-sub-office-list',
    templateUrl: './sub-office-list.component.html',
    styleUrls: ['./sub-office-list.component.css']
})
export class SubOfficeListComponent implements OnInit {
    errorMessages: any = {};
    private sort: MatSort;
    displayedSubOfficeListBrowseColumns = [
        'id', 'subOfficeName', 'departmentName', 'hodName', 'districtName', 'talukaName', 'action'
    ];
    displayedColumnsFooter: string[] = ['id'];
    talukaList: Taluka[] = [];
    dataSource = new MatTableDataSource([]);
    paginationArray;
    newSearch: boolean = false;
    totalRecords: number = 0;
    sortBy: string = '';
    sortOrder: string = '';
    pageSize = 0;
    pageIndex = 0;
    storedData: any[] = [];
    indexedItem: number;
    customPageIndex: number;
    iteratablePageIndex: number;
    pageElements: number;
    isHodUser: boolean = false;
    isUpdate;
    isToPaoUser: boolean = false;
    isEdpUser: boolean = false;
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    pageEvent: any;
    subscribeParams: Subscription;
    @Input() departId: number;
    @Input() isDepartmentShowInSubOffice: boolean = true;
    @Input() isHodShowInSubOffice: boolean = true;


    constructor(
        public fb: FormBuilder,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private edpDdoOfficeService: EdpDdoOfficeService,
        private activatedRoute: ActivatedRoute
    ) { }

    @Input() departmentList: Department[];
    @Input() hodList: Hod[];
    @Input() districtList: District[];
    @Input() officeId;
    @Input() action;
    @Input() userType = null;
    @Input() isDepartmentVisible;
    @Input() isHOD;
    @Input() subOfficeUpdateFlag;
    @Input() subOfficeFlag;
    @Input() isSubOfficeEditDisable = false;
    @Input() isDisplaySubOffice;
    @Input() hodId;
    @Input() usertype: UserType;
    @Input() officeTypeId: number = 0;

    ngOnInit() {
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.isUpdate = resRoute.update;
        });

        this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
        this.errorMessages = msgConst.SUB_OFFICE;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.getSubOfficeList();
        this.validation();
    }
    @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
        this.sort = ms;
    }

    validation() {
        if (this.isUpdate && this.isSubOfficeEditDisable === false) {
            this.isSubOfficeEditDisable = false;
            if (this.usertype.isDDOUser) {
                this.isSubOfficeEditDisable = false;
            }
            if (this.usertype.isAdUser) {
                this.isSubOfficeEditDisable = false;
            }
            if (this.usertype.isHodUser) {
                this.isSubOfficeEditDisable = false;

            }
            if (this.usertype.isToPaoUser) {
                this.isSubOfficeEditDisable = true;
            }
            if (this.usertype.isJD) {
                this.isSubOfficeEditDisable = true;
            }
            if (this.usertype.isDatUser) {
                this.isSubOfficeEditDisable = true;
                this.displayedSubOfficeListBrowseColumns = [
                    'id', 'subOfficeName', 'hodName',
                    'districtName', 'talukaName', 'action'
                ];
            }
            if (this.usertype.isDatSuperAdmin) {
                this.isSubOfficeEditDisable = false;
                this.displayedSubOfficeListBrowseColumns = [
                    'id', 'subOfficeName', 'departmentName', 'hodName',
                    'districtName', 'talukaName', 'action'
                ];
            }
        }
        if (this.isUpdate) {
            if (this.action === 'view') {
                this.isSubOfficeEditDisable = true;
            }
            if (this.usertype.isHodUser) {
                this.displayedSubOfficeListBrowseColumns = [
                    'id', 'subOfficeName', 'departmentName',
                    'districtName', 'talukaName', 'action'
                ];
            }
            if (this.usertype.isDatUser) {
                this.displayedSubOfficeListBrowseColumns = [
                    'id', 'subOfficeName', 'hodName',
                    'districtName', 'talukaName', 'action'
                ];
            }
            if (this.usertype.isDatSuperAdmin) {
                this.displayedSubOfficeListBrowseColumns = [
                    'id', 'subOfficeName', 'departmentName', 'hodName',
                    'districtName', 'talukaName', 'action'
                ];
            }
        }
        if (Number(this.officeTypeId) === Number(EdpDataConst.ADMINISTRATIVE_DEPARTMENT_OFFICE_TYPE_ID)) {
            this.displayedSubOfficeListBrowseColumns = [
                'id', 'subOfficeName',
                'districtName', 'talukaName', 'action'
            ];
        } else if (Number(this.officeTypeId) === Number(EdpDataConst.HOD_OFFICE_TYPE_ID)) {
            this.displayedSubOfficeListBrowseColumns = [
                'id', 'subOfficeName', 'departmentName',
                'districtName', 'talukaName', 'action'
            ];
        } else if (Number(this.officeTypeId) === Number(EdpDataConst.DDO_OFFICE_TYPE_ID)) {
            this.displayedSubOfficeListBrowseColumns = [
                'id', 'subOfficeName', 'departmentName', 'hodName', 'districtName', 'talukaName', 'action'
            ];
        }
    }

    hideShowAsOfficeTypeId(offType) {
        if (Number(offType) === Number(EdpDataConst.ADMINISTRATIVE_DEPARTMENT_OFFICE_TYPE_ID)) {
            this.displayedSubOfficeListBrowseColumns = [
                'id', 'subOfficeName',
                'districtName', 'talukaName', 'action'
            ];
        } else if (Number(offType) === Number(EdpDataConst.HOD_OFFICE_TYPE_ID)) {
            this.displayedSubOfficeListBrowseColumns = [
                'id', 'subOfficeName', 'departmentName',
                'districtName', 'talukaName', 'action'
            ];
        } else if (Number(offType) === Number(EdpDataConst.DDO_OFFICE_TYPE_ID)) {
            this.displayedSubOfficeListBrowseColumns = [
                'id', 'subOfficeName', 'departmentName', 'hodName', 'districtName', 'talukaName', 'action'
            ];
        }
    }

    editSubOffice(data, localAction) {
        const object: any[] = [];
        object['departmentList'] = this.departmentList;
        object['hodList'] = this.hodList;
        object['districtId'] = data.districtId;
        object['officeTypeId'] = this.officeTypeId;
        const district = this.districtList.filter((element: District) => {
            return element.id === data.districtId;
        })[0];
        object['districtList'] = [];
        object['districtList'][0] = district;
        if (this.subOfficeFlag) {
            object['subOfficeItrId'] = data.subOfficeItrId;
        } else {
            object['subOfficeId'] = data.subOfficeId;
        }
        object['officeId'] = this.officeId;
        object['isDepartmentVisible'] = this.isDepartmentVisible;
        object['isHOD'] = this.isHOD;
        object['subOfficeUpdateFlag'] = this.subOfficeUpdateFlag;
        object['subOfficeFlag'] = this.subOfficeFlag;
        object['isUpdate'] = this.isUpdate;
        object['departmentId'] = this.departId;
        object['usertype'] = this.usertype;
        object['subOfficeId'] = data.subOfficeId;
        object['isDepartmentShowInSubOffice'] = this.isDepartmentShowInSubOffice;
        object['hodId'] = data.hodId;
        if (this.isUpdate) {
            object['subOfficeItrId'] = data.subOfficeItrId ? data.subOfficeItrId : undefined;
            object['subOfficeId'] = data.subOfficeId ? data.subOfficeId : undefined;
        }
        if (this.action === 'edit') {
            if (localAction === 'view') {
                object['action'] = 'view';
            } else if (localAction === 'edit') {
                object['action'] = 'edit';
            }
        } else {
            object['action'] = this.action;
        }
        const dialogRef = this.dialog.open(SubOfficeCreationComponent, {
            width: '900px',
            disableClose: true,
            data: object
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'save') {
                this.newSearch = true;
                this.getSubOfficeList();
            }
        });
    }

    getSubOfficeList(event: any = null) {
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: this.getSearchFilter()
        },
            self = this;
        if (!this.newSearch && this.storedData.length !== 0 &&
            ((this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize)))) {
            // If data already fetched
            this.dataSource = new MatTableDataSource(this.storedData.slice(
                this.iteratablePageIndex * this.pageSize,
                (this.iteratablePageIndex * this.pageSize) + this.pageSize
            ));
        } else {
            // If data needs to fetch from database.
            this.edpDdoOfficeService.getSubOfficeList(passData).subscribe((res) => {
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
                    self.dataSource = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize,
                        (self.iteratablePageIndex * self.pageSize) + self.pageSize
                    ));
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
            }, (err) => {
                self.toastr.error(this.errorMessages['ERR_SUB_OFFICE_LIST']);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSource = new MatTableDataSource([]);
            });
        }
    }
    getSearchFilter() {
        const returnArray = [];
        const searchObj = {};
        searchObj['key'] = 'activeStatus';
        searchObj['value'] = EdpDataConst.ACTIVE_STATUS_ID;
        returnArray.push(_.cloneDeep(searchObj));
        searchObj['key'] = 'officeId.officeId';
        searchObj['value'] = this.officeId;
        returnArray.push(_.cloneDeep(searchObj));
        searchObj['key'] = 'isUpdate';
        searchObj['value'] = this.subOfficeUpdateFlag;
        returnArray.push(_.cloneDeep(searchObj));
        searchObj['key'] = 'flag';
        searchObj['value'] = this.subOfficeFlag;
        returnArray.push(_.cloneDeep(searchObj));
        searchObj['key'] = 'isDisplaySubOffice';
        searchObj['value'] = this.isDisplaySubOffice;
        returnArray.push(_.cloneDeep(searchObj));

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
        this.getSubOfficeList(event);
    }
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getSubOfficeList();
    }
    showConfirmationPopup(subOfficeId, subOfficeItrId) {
        const param = {
            id: (this.subOfficeUpdateFlag && !this.subOfficeFlag) ?
                (subOfficeItrId ? subOfficeItrId : subOfficeId) :
                (this.subOfficeUpdateFlag ? subOfficeItrId : subOfficeId),
            activeStatus: EdpDataConst.DELETE_RECORD_KEY,
            isUpdate: this.subOfficeUpdateFlag,
            flag: this.subOfficeFlag
        };
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.edpDdoOfficeService.getSubOfficeDelete(param).subscribe((res) => {
                    if (res && res['status'] === 200) {
                        this.toastr.success(this.errorMessages['SUB_OFFICE_DELETE']);
                        this.newSearch = true;
                        this.getSubOfficeList();
                    }
                }, (err) => {
                    this.toastr.error(this.errorMessages['ERR_SUB_OFFICE_DELETE']);
                });
            }
        });
    }

    /**
     * @description To enable edit and delete button for spcific set of User
     * @Ref ED-1027 Bug
     */

    enableEditAndDelete(): boolean {
        if (this.usertype) {
            if (this.usertype.isDatUser || this.usertype.isJD || this.usertype.isToPaoUser) {
                return false;
            }
            return true;
        }
        return true;
    }
}
