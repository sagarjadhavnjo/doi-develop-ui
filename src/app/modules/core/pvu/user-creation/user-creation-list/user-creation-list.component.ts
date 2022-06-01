import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { UserCreationListService } from '../service/user-creation-list.service';
import { PvuCommonService } from '../../pvu-common/services/pvu-common.service';
import { cloneDeep } from 'lodash';



@Component({
    selector: 'app-user-creation-list',
    templateUrl: './user-creation-list.component.html',
    styleUrls: ['./user-creation-list.component.css']
})
export class UserCreationListComponent implements OnInit {

    variableClm = new BehaviorSubject<string[]>(['noData']);
    totalRecords: number = 0;
    paginationArray;
    sortBy = '';
    sortOrder = '';
    pageSize = 0;
    pageIndex = 0;
    isSearch = 0;
    pageEvent: Object;
    storedData = [];
    indexedItem = 0;
    customPageIndex = 0;
    iteratablePageIndex = 0;
    pageElements = DataConst.PAGE_ELEMENT;
    disableSearchValue = true;
    newSearch = false;
    minDate = new Date();
    displayedColumns: string[] = [
        'srNo', 'employeeNo', 'employeeName', 'designation', 'empPayType', 'panNo', 'officeName', 'status', 'action'
    ];
    userOffice: any;
    searchListForm: FormGroup;
    empDesignation_list;
    loggedUserObj;
    officeId;
    officeTypeId;
    currentPost;
    isEditable = false;
    empTypeList: object[] = [];
    empDesignationCtrl: FormControl = new FormControl();
    empTypeCtrl: FormControl = new FormControl();
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
        public dialog: MatDialog,
        private userCreationListService: UserCreationListService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private datepipe: DatePipe,
        private pvuService: PvuCommonService,
        private storageService: StorageService,
    ) { }

    ngOnInit() {
        this.getLookup();
        const self = this;
        const userOffice = this.storageService.get('currentUser');
        if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
            this.currentPost = userOffice['post'].filter((item) => item['loginPost'] === true);
        }
        if (this.currentPost && this.currentPost[0]['oauthTokenPostDTO']
        && this.currentPost[0]['oauthTokenPostDTO']['edpMsMenuDtoList']) {
            const parentMenu = cloneDeep(
                this.currentPost[0]['oauthTokenPostDTO']['edpMsMenuDtoList'].filter(res => res.menuId === 3));
            if (parentMenu && parentMenu[0]) {
              const subMenu = cloneDeep(parentMenu[0]['menuDtos'].filter(res1 => res1.menuId === 17));
              if (subMenu && subMenu[0]) {
                const node = cloneDeep(subMenu[0]['menuDtos'].filter(res2 => res2.menuId === 49));
                if (node[0]) {
                    const wfRole = cloneDeep(node[0]['wfRoleId']);
                    if (wfRole[0]) {
                        const roleCode = cloneDeep(wfRole[0]['wfRoleCode']);
                        if (roleCode[0] && Number(roleCode[0]) === 1000) {
                            this.isEditable = true;
                        }
                    }
                }
              }
            }
          }
        self.userOffice = self.storageService.get('userOffice');
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.pageSize = 25;
        this.searchListForm = this.fb.group({
            officeName: [self.userOffice.officeName, Validators.required],
            employeeNo: [''],
            employeeName: [''],
            designationId: [''],
            empPayTypeId: [''],
            panNo: [''],
            caseNo: ['']
        });
        this.getData();
    }

    /**
     * @function getLookup
     * @param -
     * @returns To get the lookup data
     */
    getLookup() {
        this.isSearch = 0;
        this.userCreationListService.getEmpPayType('').subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                const empPayType = [156, 157, 161]
                this.empTypeList = res['result'].filter((res) => {
                    return empPayType.includes(res.id)
                });
            }
        },
            (err) => {
                this.toastr.error(err);
            });
        this.userCreationListService.getDesignation().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.empDesignation_list = res['result'];
            }
        });
        // this.userCreationListService.getAllOffice().subscribe((res) => {
        //     if (res && res['status'] === 200) {
        //         this.officeName_list = res['result']['Office_type'];
        //     }
        // });
    }

    clearForm() {
        this.searchListForm.reset();
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

    onSubmitSearch() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 1;
        this.getData();
    }

    getData(event = null) {
        const passData = {
            pageIndex: this.customPageIndex,
            pageElement: this.pageElements,
            jsonArr: this.getSearchFilter()
        },
            self = this;

        // tslint:disable-next-line:max-line-length
        if (!this.newSearch && this.storedData.length !== 0 && (this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize))) { // If data already fetched
            // tslint:disable-next-line:max-line-length
            this.dataSource = new MatTableDataSource(this.storedData.slice(this.iteratablePageIndex * this.pageSize, (this.iteratablePageIndex * this.pageSize) + this.pageSize));
        } else { // If data needs to fetch from database.
            this.userCreationListService.getListData(passData).subscribe((res) => {
                self.newSearch = false;
                if (res && res['status'] === 200) {
                    // this.dataSource.data = res['result'];
                    // For customize pagination
                    self.storedData = _.cloneDeep(res['result']['result']);
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

                    // tslint:disable-next-line:max-line-length
                    self.dataSource = new MatTableDataSource(self.storedData.slice(self.iteratablePageIndex * self.pageSize, (self.iteratablePageIndex * self.pageSize) + self.pageSize));
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
                    // tslint:disable-next-line:max-line-length
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

    convertDateFormat(date) {
        if (date !== '' && date !== undefined) {
            date = new Date(date);
            return this.datepipe.transform(date, 'MM-dd-yyyy');
        }
        return '';
    }

    /**
     * /@function getSearchFilter
     * @description To get the search data on the selection of parameters
     * @param event search parameter
     * @returns Get the search data List
     */
    getSearchFilter() {
        const obj = this.searchListForm.value;
        if (
            !obj.employeeNo &&
            !obj.employeeName &&
            !obj.panNo &&
            !obj.caseNo &&
            !obj.designationId &&
            !obj.empPayTypeId
        ) {
            this.isSearch = 0;
        }
        const returnArray = [];
        const searchObj = {};
        searchObj['key'] = 'isSearch';
        searchObj['value'] = this.isSearch;
        returnArray.push(searchObj);
        // tslint:disable-next-line:forin
        for (const key in obj) {
            const currObj = {};
            currObj['key'] = key;
            if (key === 'employeeName' || key === 'panNo' || key === 'caseNo') {
                currObj['value'] = (obj[key] || '').trim();
            } else if (key === 'designationId' || key === 'employeeNo' || key === 'empPayTypeId') {
                currObj['value'] = Number(obj[key] || 0);
            } else {
                currObj['value'] = (obj[key] || 0);
            }
            returnArray.push(currObj);
        }
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

    showConfirmationPopup(element) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                const param = {
                    'activeStatus': 0,
                    'id': Number(element.empEolId)
                };
                this.userCreationListService.deleteRecord(param).subscribe((res) => {
                    if (res && res['status'] === 200) {
                        this.toastr.success(res['message']);
                        this.newSearch = true;
                        this.getData();
                    } else {
                        this.toastr.error(res['message']);
                    }
                }, err => {
                    this.toastr.error(err);
                });
            }
        });
    }

    onclickStatus(data) {
        if (data.active) {
            data.active = false;
        } else {
            data.active = true;
        }
        return data;
    }

    // onEdit(id) {
    //     this.router.navigate(['../', 'edit', id], { relativeTo: this.route, skipLocationChange: true });
    // }

    /**
     * /@function  onView
     *  @description To view the selected transaction
     * @param id eventId
     * @returns View transaction
     */
    onView(id) {
        this.router.navigate(['../', 'view', id], { relativeTo: this.route, skipLocationChange: true });
    }

    navigateToEdit(id) {
        this.router.navigate(['/dashboard/pvu/employee-creation/', 'edit', id, 1],
        { skipLocationChange: true });
    }

    keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode !== 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

}
