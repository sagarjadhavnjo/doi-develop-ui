/**
 * this.isUpdate = 1; for the new office creation list
 * this.isUpdate = 2; for the update office list
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
    DesignationOfDdo,
    Status,
    District,
    OfficeType,
    Department,
    Hod,
    IsCoOffice
} from '../../model/office-data-model';
import { EdpDdoOfficeService } from '../../services/edp-ddo-office.service';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'src/app/modules/services/common.service';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
@Component({
    selector: 'app-office-list',
    templateUrl: './office-list.component.html',
    styleUrls: ['./office-list.component.css']
})
export class OfficeListComponent implements OnInit {
    listHeading: string;
    isUpdate: number;
    searchDDOListForm: FormGroup;
    noDataColSpan: number;

    fromDate = new Date();
    fromMaxDate = new Date();
    toMinDate: Date;
    toMaxDate = new Date();

    editIcon: boolean = true;
    selectedAll: boolean = false;
    errorMessages: any = {};
    isHodUser: boolean = false;
    isToPaoUser: boolean = false;
    isEdpUser: boolean = false;
    userType: string = '';
    paginationArray;
    newSearch: boolean = false;
    totalRecords: number = 0;
    sortBy: string = '';
    sortOrder: string = '';
    pageSize = 0;
    pageIndex = 0;
    isSearch: number = 1;
    storedData: any[] = [];
    indexedItem: number;
    customPageIndex: number;
    iteratablePageIndex: number;
    pageElements: number;
    displayedOfficeListBrowseColumns: string[] = [
        'id',
        'requestNo',
        'createdDate',
        'locationName',
        'ddoNo',
        'cardexNo',
        'designationName',
        'edpOfficeName',
        'lyingWith',
        'status',
        'wfStatus',
        'action'
    ];
    // displayedOfficeListBrowseColumns: string[] = [
    //     'id', 'requestNo', 'createdDate', 'designationName',
    //     'edpOfficeName', 'status', 'action'
    // ];
    displayedColumnsFooter: string[] = ['id'];
    dataSource = new MatTableDataSource([]);
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    pageEvent: any;
    private sort: MatSort;

    designationList: DesignationOfDdo[] = [];
    statusList: Status[] = [];
    districtList: District[] = [];
    officeTypeList: OfficeType[] = [];
    adminDepartList: Department[] = [];
    hodList: Hod[] = [];
    ControlingOfficeList: IsCoOffice[] = [];
    workFlowStatusList: Status[] = [];
    wfStatusCtrl: FormControl = new FormControl();
    officeDivision: string;
    designationCtrl: FormControl = new FormControl();
    statusCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();
    officeTypeCtrl: FormControl = new FormControl();
    adminDepartCtrl: FormControl = new FormControl();
    ddoTypeCtrl: FormControl = new FormControl();
    hodCtrl: FormControl = new FormControl();
    controlOfctrl: FormControl = new FormControl();
    loggedUserObj;
    ddoTypeList;
    wfRole: number;
    matInputSelectNull = EdpDataConst.MAT_SELECT_NULL_VALUE;
    @ViewChild(MatSort, { static: true }) set matSort(ms: MatSort) {
        this.sort = ms;
    }
    constructor(
        public fb: FormBuilder,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private edpDdoOfficeService: EdpDdoOfficeService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private storageService: StorageService,
        private commonService: CommonService
    ) { }
    ngOnInit() {
        this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
        const userOffice = this.storageService.get('currentUser');
        const loginPost = userOffice['post'].filter(item => item['loginPost'] === true);
        this.loggedUserObj = loginPost;
        const wfRoleId: number[] = this.commonService.getwfRoleId()[0]['wfRoleIds'];
        const wfRoleIdArr: any[] = this.commonService.getwfRoleId();
        const linkMenuWfRoleIdArr: any[] = this.commonService.getLinkMenuWfRoleId();
        const wfRoleArr: number[] = [];
        wfRoleIdArr.forEach(e => {
            wfRoleArr.push(e.wfRoleIds[0]);
        });
        if (linkMenuWfRoleIdArr) {
            linkMenuWfRoleIdArr.forEach(e => {
                wfRoleArr.push(e.wfRoleIds[0]);
            });
        }
        if (this.commonService.getwfRoleId()) {
            const wfRoleIdArray = this.getWfRoleIdArray(this.commonService.getwfRoleId());
            this.loggedUserObj['wfRoleData'] = wfRoleIdArray;
        }
        if (linkMenuWfRoleIdArr) {
            const wfRoleIdArray = this.getWfRoleIdArray(linkMenuWfRoleIdArr);
            this.loggedUserObj['wfRoleData'] = wfRoleIdArray;
        }
        if (wfRoleArr.indexOf(EdpDataConst.USERTYPE_DAT_SUPER_ADMIN) !== -1) {
            this.wfRole = EdpDataConst.USERTYPE_DAT_SUPER_ADMIN;
        } else {
            this.wfRole = wfRoleArr[0];
        }
        this.officeDivision = userOffice['post'][0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeDivision'];
        const url = this.router.url;
        if (url === '/dashboard/edp/office/update-list') {
            this.isUpdate = 2;
            this.listHeading = 'Office Updation List';
        } else {
            this.isUpdate = 1;
            this.listHeading = 'Create New Office List';
        }
        this.setDisplayedColumnsByUserType();
        this.errorMessages = msgConst.OFFICE_LIST;
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.iteratablePageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.createForm();
        // if (this.isUpdate === 2) {
        //     this.getOfficeUpdateList();
        // } else {
        this.getOfficeList();
        // }
        this.getOfficeDetails();
    }

    resetToDate() {
        this.toMinDate = new Date(this.searchDDOListForm.controls.fromDate.value);
        this.searchDDOListForm.controls.toDate.setValue('');
    }

    createForm() {
        this.searchDDOListForm = this.fb.group({
            referenceNo: [''],
            fromDate: [''],
            toDate: [''],
            designationId: [],
            officeName: [''],
            statusId: [],
            districtId: [],
            ddoNo: [''],
            cardexNo: [''],
            officeTypeId: [''],
            ddoTypeId: [''],
            departmentId: [''],
            hodId: [''],
            isCntOffice: [''],
            wfStatus: ['']
        });
    }

    getOfficeDetails() {
        this.edpDdoOfficeService.getOfficeDetails('').subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    this.districtList = res['result']['districts'];
                    this.designationList = res['result']['designationOfDdo'];
                    this.ddoTypeList = res['result']['ddoType'];
                    // this.statusList = res['result']['status'];
                    this.statusList = res['result']['transStatusList'];
                    this.workFlowStatusList = res['result']['wfStatus'];
                    this.officeTypeList = res['result']['officeType'];
                    this.adminDepartList = res['result']['departments'];
                    this.ControlingOfficeList = res['result']['controllingOffice'];
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(this.errorMessages['ERR_OFFICE_MASTER_DATA']);
            }
        );
    }

    loadHodList() {
        if (
            !this.searchDDOListForm.controls.departmentId.value
        ) {
            this.hodList = null;
            this.searchDDOListForm.controls.hodId.reset();
            return;
        }
        if (this.searchDDOListForm.controls.departmentId.value) {
            const param = {
                id: this.searchDDOListForm.controls.departmentId.value
            };
            this.edpDdoOfficeService.getHodList(param).subscribe(
                hodRes => {
                    if (hodRes && hodRes['result'] && hodRes['status'] === 200) {
                        this.hodList = hodRes['result'];
                    } else {
                        this.toastr.error(hodRes['message']);
                    }
                },
                hodErr => {
                    this.toastr.error(this.errorMessages['HOD_LIST']);
                }
            );
        }
    }

    editOffice(element) {
        if (this.isUpdate === 1) {
            this.router.navigate(['../edit', element.officeId, element.trnStatus], {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
        } else if (this.isUpdate === 2) {
            this.router.navigate(
                [
                    '../update',
                    'edit', element.requestNo, element.officeId, this.isUpdate.toString(), element.createdDate
                ],
                {
                    relativeTo: this.activatedRoute,
                    skipLocationChange: true
                });
        }
    }

    viewOffice(element) {
        if (this.isUpdate === 1) {
            this.router.navigate(['../view', element.officeId, element.trnStatus], {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
        } else if (this.isUpdate === 2) {
            this.router.navigate([
                '../update', 'view', element.requestNo, element.officeId, this.isUpdate, element.createdDate
            ], {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
        }
    }

    clearForm() {
        const dialogReference = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogReference.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.searchDDOListForm.reset();
                this.hodList = [];
            }
        });
    }

    getWfRoleIdArray(wfRoleData) {
        const wfRoleArray = [];
        wfRoleData.forEach(element => {
            if (wfRoleArray.indexOf(element['wfRoleIds'][0]) === -1) {
                wfRoleArray.push(element['wfRoleIds']);
                // wfRoleArray.push(element['wfRoleIds'][0]);
            }
        });
        return wfRoleArray;
    }

    onSubmitSearch() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 0;
        // this.getOfficeList();
        // if (this.isUpdate === 2) {
        //     this.getOfficeUpdateList();
        // } else {
        this.getOfficeList();
        // }
    }

    /**
     *
     * @description it gets office list from Data base
     * @param event for paginator
     * @return  false if searchData is not there
     */
    getOfficeList(event: any = null) {
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
        if (
            !this.newSearch &&
            this.storedData.length !== 0 &&
            this.iteratablePageIndex + 1 <= Math.ceil(this.pageElements / this.pageSize)
        ) {
            // If data already fetched
            this.dataSource = new MatTableDataSource(
                this.storedData.slice(
                    this.iteratablePageIndex * this.pageSize,
                    this.iteratablePageIndex * this.pageSize + this.pageSize
                )
            );
        } else {
            // If data needs to fetch from database.
            this.getOfficeListMethodBasedOnIsUpdate(passData).subscribe(
                res => {
                    self.newSearch = false;
                    if (res && res['status'] === 200) {
                        // For customize pagination
                        self.storedData = _.cloneDeep(res['result']['result']);
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
                        self.dataSource = new MatTableDataSource(
                            self.storedData.slice(
                                self.iteratablePageIndex * self.pageSize,
                                self.iteratablePageIndex * self.pageSize + self.pageSize
                            )
                        );
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
                },
                err => {
                    self.toastr.error(this.errorMessages['ERR_OFFICE_LIST']);
                    self.totalRecords = 0;
                    self.pageIndex = 0;
                    self.customPageIndex = 0;
                    self.iteratablePageIndex = 0;
                    self.dataSource = new MatTableDataSource([]);
                }
            );
        }
    }

    getSearchFilter() {
        const obj = this.searchDDOListForm.value;
        // this.isSearch = this.isU1`pdate === 1 ? 0 : 1;
        if (
            !obj.referenceNo &&
            !obj.fromDate &&
            !obj.toDate &&
            !obj.designationId &&
            !obj.officeName &&
            !obj.statusId &&
            !obj.districtId &&
            !obj.ddoNo &&
            !obj.cardexNo &&
            !obj.officeTypeId &&
            !obj.ddoTypeId &&
            !obj.departmentId &&
            !obj.hodId &&
            !obj.isCntOffice &&
            !obj.wfStatus
        ) {
            this.isSearch = 1;
        }
        const returnArray = [];
        const searchObj = {};
        searchObj['key'] = 'isSearch';
        searchObj['value'] = this.isSearch;
        returnArray.push(_.cloneDeep(searchObj));
        // searchObj['key'] = 'currentWfId';
        // searchObj['value'] = '0';
        // returnArray.push(_.cloneDeep(searchObj));
        searchObj['key'] = 'isUpdate';
        searchObj['value'] = this.isUpdate;
        returnArray.push(_.cloneDeep(searchObj));
        // tslint:disable-next-line: forin
        for (const key in obj) {
            const currObj = {};
            currObj['key'] = key;
            if (
                key === 'referenceNo' ||
                key === 'fromDate' ||
                key === 'toDate' ||
                key === 'officeName' ||
                key === 'ddoNo' ||
                key === 'wfStatus' ||
                key === 'statusId'
            ) {
                if (key === 'fromDate' || key === 'toDate') {
                    if (obj['fromDate'] || obj['toDate']) {
                        if (!(obj['fromDate'] && obj['toDate'])) {
                            if (!obj['fromDate']) {
                                this.toastr.error(this.errorMessages['FROM_DATE']);
                            } else {
                                this.toastr.error(this.errorMessages['TO_DATE']);
                            }
                            return false;
                        }
                    }
                    const datePipe = new DatePipe('en-US');
                    currObj['value'] = datePipe.transform(obj[key], 'MM/dd/yyyy') || '';
                } else {
                    currObj['value'] = (obj[key] || '').trim();
                }
            } else if (
                key === 'designationId' ||
                key === 'districtId' ||
                key === 'officeTypeId' ||
                key === 'ddoTypeId' ||
                key === 'departmentId' ||
                key === 'hodId' ||
                key === 'isCntOffice' ||
                key === 'cardexNo'
            ) {
                if (key === 'cardexNo') {
                    currObj['value'] = Number(obj[key] || 0);
                } else {
                    currObj['value'] = obj[key] || 0;
                }
            }
            returnArray.push(currObj);
        }
        if (this.isUpdate === 2) {
            if (String(this.loggedUserObj['wfRoleData']) === String(EdpDataConst.USERTYPE_DAT_SUPER_ADMIN)) {
                returnArray.push({
                    key: 'wfRoles',
                    value: this.wfRole
                    // ?
                    // this.loggedUserObj['wfRoleData'].toString() + ',' + String(EdpDataConst.WF_CREATOR_ROLE) : ''
                });
            } else {
                returnArray.push({
                    key: 'wfRoles',
                    value: this.loggedUserObj['wfRoleData'] ? this.loggedUserObj['wfRoleData'].toString() : ''
                });

            }
            returnArray.push({ key: 'pouId', value: this.loggedUserObj[0]['lkPoOffUserId'] });
            returnArray.push({
                key: 'officeId',
                value: this.loggedUserObj[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId']
            });
        } else {
            returnArray.push({
                key: 'menuId',
                value: EdpDataConst.MENU.OFFICE_CREATION_MENU_ID
            });
        }
        return returnArray;
    }
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
            /**
             * Condition is for handle Go To Last Page button event.
             * set iteratablePageIndex to highest pageIndex so getData can load new set of data of current page index.
             */
            this.iteratablePageIndex = event.pageIndex;
        } else {
            this.iteratablePageIndex = this.iteratablePageIndex + 1;
        }
        this.getOfficeList(event);
    }
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getOfficeList();
    }
    showConfirmationPopup(element) {
        if (this.isUpdate === 2) {
            // tslint:disable-next-line: no-use-before-declare
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: msgConst.CONFIRMATION_DIALOG.DELETE
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.edpDdoOfficeService.deleteUpdateOffice(element.requestNo).subscribe(
                        res => {
                            if (res && res['status'] === 200) {
                                this.toastr.success(this.errorMessages['OFFICE_DELETE']);
                                this.newSearch = true;
                                this.getOfficeList();
                            } else {
                                this.toastr.error(res['message']);
                            }
                        },
                        err => {
                            this.toastr.error(this.errorMessages['ERR_OFFICE_DELETE']);
                        }
                    );
                }
            });
        } else {
            const param = {
                id: element.officeId
            };
            // tslint:disable-next-line: no-use-before-declare
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: msgConst.CONFIRMATION_DIALOG.DELETE
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.edpDdoOfficeService.getOfficeDelete(param).subscribe(
                        resDelete => {
                            if (resDelete && resDelete['status'] === 200) {
                                this.toastr.success(this.errorMessages['OFFICE_DELETE']);
                                this.newSearch = true;
                                this.getOfficeList();
                            } else {
                                this.toastr.error(resDelete['message']);
                            }
                        },
                        err => {
                            this.toastr.error(this.errorMessages['ERR_OFFICE_DELETE']);
                        }
                    );
                }
            });
        }
    }

    checkHodList() {
        const departName = this.searchDDOListForm.controls.departmentId.value;
        if (departName === '' || departName === null || departName === undefined) {
            this.toastr.error(this.errorMessages['ADDMIN_DEPT']);
            this.hodList = [];
            return false;
        }
    }
    /**
     * @description Goes to Dashboard
     */
    goToDashboard() {
        const proceedMessage = msgConst.CONFIRMATION_DIALOG.CLOSE;
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
    /**
     * @description Sets the column to be displayed based on userType and isUpdate flag
     */
    setDisplayedColumnsByUserType() {
        const officeData = this.storageService.get('userOffice');
        if (this.isUpdate === 1) {
            if (this.officeDivision === 'DAT') {
                this.userType = 'edp_user';
                this.isEdpUser = true;
                this.displayedOfficeListBrowseColumns = [
                    'id',
                    'requestNo',
                    'createdDate',
                    'locationName',
                    'ddoNo',
                    'cardexNo',
                    'designationName',
                    'edpOfficeName',
                    'lyingWith',
                    'status',
                    'wfStatus',
                    'action'
                ];
            } else if (
                officeData['isTreasury'] === 2 ||
                officeData['officeSubType'] === EdpDataConst.IS_PO_USER ||
                (officeData['officeTypeId'] === 71 &&
                    officeData['officeTypeName'] === 'Drawing and Disbursing office (DDO)')
            ) {
                this.userType = 'to_user';
                this.isToPaoUser = true;
                this.displayedOfficeListBrowseColumns = [
                    'id',
                    'requestNo',
                    'createdDate',
                    'locationName',
                    'cardexNo',
                    'designationName',
                    'edpOfficeName',
                    'lyingWith',
                    'status',
                    'wfStatus',
                    'action'
                ];
            } else if (
                officeData['isHod'] === 2 ||
                (officeData['officeTypeId'] === 52 && officeData['officeTypeName'] === 'Administrative Department')
            ) {
                this.userType = 'hod_user';
                this.isHodUser = true;
                this.displayedOfficeListBrowseColumns = [
                    'id',
                    'requestNo',
                    'createdDate',
                    'locationName',
                    'designationName',
                    'edpOfficeName',
                    'lyingWith',
                    'status',
                    'wfStatus',
                    'action'
                ];
            }
            if (this.userType === 'edp_user') {
                if (this.commonService.getwfRoleId()) {
                    const wfRoleIdArray = (this.commonService.getwfRoleId());
                    const wfRoleArray = [];
                    wfRoleIdArray.forEach(element => {
                        wfRoleArray.push(element['wfRoleIds'][0]);
                    });
                    wfRoleIdArray.forEach(element => {
                        // wfRoleArray.push(element['wfRoleIds'][0]);
                        if (((element['wfRoleIds'][0]) === 1 ||
                            (element['wfRoleIds'][0]) === 2 ||
                            (element['wfRoleIds'][0]) === 3) && (wfRoleArray.indexOf(45) === -1)) {
                            this.userType = 'hod_user';
                            this.isHodUser = true;
                            this.isEdpUser = false;
                            this.displayedOfficeListBrowseColumns = [
                                'id',
                                'requestNo',
                                'createdDate',
                                'locationName',
                                'designationName',
                                'edpOfficeName',
                                'lyingWith',
                                'status',
                                'wfStatus',
                                'action'
                            ];
                        }
                    });
                }
            }
        }
        if (this.isUpdate === 2) {
            this.displayedOfficeListBrowseColumns = [
                'id',
                'requestNo',
                'createdDate',
                'locationName',
                'ddoNo',
                'cardexNo',
                'designationName',
                'edpOfficeName',
                'lyingWith',
                'status',
                'wfStatus',
                'action'
            ];
        }
        this.noDataColSpan = this.displayedOfficeListBrowseColumns.length;
    }

    /**
     *@description It gets which method to call based on isUpdate Flag
     * @param  passData passData which is data to be passed
     * @return Observable<Object> method from Service
     */
    getOfficeListMethodBasedOnIsUpdate(passData) {
        if (this.isUpdate === 1) {
            return this.edpDdoOfficeService.getOfficeList(passData);
        } else if (this.isUpdate === 2) {
            return this.edpDdoOfficeService.getUpdateOfficeList(passData);
        }
    }
}
