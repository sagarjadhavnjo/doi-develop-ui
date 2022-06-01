import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { PostCreation, DesignationName, Status } from '../../model/post-model';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { EdpPostService } from '../../services/edp-post.service';
import * as _ from 'lodash';
import { EdpDdoOfficeService } from '../../services/edp-ddo-office.service';
import { District } from '../../model/office-data-model';
import { StatusName } from '../../model/post-model';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/modules/services/common.service';
@Component({
    selector: 'app-post-creation-list',
    templateUrl: './post-creation-list.component.html',
    styleUrls: ['./post-creation-list.component.css']
})
export class PostCreationListComponent implements OnInit {
    selectedAll: boolean = false;
    searchPostListForm: FormGroup;

    fromDate = new Date();
    fromMaxDate = new Date();
    toMinDate: Date;
    toMaxDate = new Date();

    errorMessages: any = {};
    userType: string = '';
    isHodUser: boolean = false;
    isToPaoUser: boolean = false;
    isEdpUser: boolean = false;

    designationList: DesignationName[] = [];
    statusList: Status[] = [];
    districtList: District[] = [];
    workFlowStatusList: StatusName[] = [];

    designationCtrl: FormControl = new FormControl();
    statusCtrl: FormControl = new FormControl();
    districtCtrl: FormControl = new FormControl();
    wfStatusCtrl: FormControl = new FormControl();

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
    loggedUserObj;

    displayedColumnsFooter: string[] = ['id'];
    dataSourcePostList = new MatTableDataSource([]);
    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    pageEvent: any;
    displayedColumns: string[] = [
        'id', 'referenceNo', 'requestDate', 'districtName', 'ddoNo', 'cardexNo',
        'officeName', 'designationName', 'postName', 'lyingWith', 'trnStatus', 'status', 'action'
    ];
    matInputSelectNull = EdpDataConst.MAT_SELECT_NULL_VALUE;
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private router: Router,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private edpPostService: EdpPostService,
        private edpDdoOfficeService: EdpDdoOfficeService,
        private storageService: StorageService,
        private commonService: CommonService
    ) { }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        this.paginator._intl.itemsPerPageLabel = DataConst.RECORDS_PER_PAGE;
        this.errorMessages = msgConst;
        this.paginationArray = DataConst.PAGINATION_ARRAY;
        this.iteratablePageIndex = 0;
        this.indexedItem = 0;
        this.customPageIndex = 0;
        this.pageElements = 250;
        this.pageSize = 25;
        this.pageIndex = 0;
        this.dataSourcePostList.sort = this.sort;
        this.createForm();
        const userOffice = this.storageService.get('currentUser');
        const loginPost = userOffice['post'].filter((item) => item['loginPost'] === true);
        this.loggedUserObj = loginPost;
        if (this.commonService.getwfRoleId()) {
            const wfRoleIdArray = this.getWfRoleIdArray(this.commonService.getwfRoleId());
            this.loggedUserObj['wfRoleData'] = wfRoleIdArray;
        }
        this.getPostList();
        this.getOfficeDetails();
    }

    /**
     * @method resetToDate
     * @description reset Date
     */
    resetToDate() {
        this.toMinDate = new Date(this.searchPostListForm.controls.fromDate.value);
        this.searchPostListForm.controls.toDate.setValue('');
    }

    /**
     * @method createForm
     * @description create form with formcontrol values
     */
    createForm() {
        this.searchPostListForm = this.fb.group({
            trnNo: [''],
            fromDate: [''],
            toDate: [''],
            designationId: [''],
            statusId: [''],
            districtId: [''],
            ddoNo: [''],
            cardexNo: [''],
            wfStatusId: ['']
        });
    }

    /**
     * @method getOfficeDetails
     * @description Function is called to get all office details
     */
    getOfficeDetails() {
        this.edpDdoOfficeService.getOfficeDetails('').subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.districtList = res['result']['districts'];
                this.designationList = res['result']['designationOfDdo'];
                // this.statusList = res['result']['status'];
            }
        },
            (err) => {
                this.toastr.error(this.errorMessages['DDO_OFFICE']['ERR_OFFICE_MASTER_DATA']);
            });
        this.edpPostService.getListingStatus('').subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                this.statusList = res.result.transStatusList;
                this.workFlowStatusList = res.result.workFlowStatusList;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * @method editPost
     * @description Function is called while click on edit icon in list and navigate to editable form
     * @param element pass values like post Id
     */
    editPost(element) {
        const isWfStatusDraft = element.wfStatus.toLowerCase() === 'draft' ? true : false;
        this.router.navigate(['../edit', element.postId],
            {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
    }

    /**
     * @method viewPost
     * @description Function is called while click on view icon in list and navigate to editable form
     * @param element pass values like post Id
     */
    viewPost(element) {
        this.router.navigate(['../view', element.postId],
            {
                relativeTo: this.activatedRoute,
                skipLocationChange: true
            });
    }

    /**
     * @method clearForm
     * @description reset form
     */
    clearForm() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.searchPostListForm.reset();
            }
        });
    }

    /**
     * @method getWfRoleIdArray
     * @description Function is called to get WFRoleID array
     * @returns wfRoleArray
     */
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

    /**
     * @method goToDashboard
     * @description Navigate to dashboard
     */
    goToDashboard() {
        const proceedMessage = this.errorMessages['CONFIRMATION_DIALOG']['CONFIRMATION'];
        // tslint:disable-next-line: no-use-before-declare
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
     * @method onSubmitSearch
     * @description Function is called to when search button is clicked
     */
    onSubmitSearch() {
        this.newSearch = true;
        this.pageIndex = 0;
        this.customPageIndex = 0;
        this.paginator.pageIndex = 0;
        this.iteratablePageIndex = 0;
        this.isSearch = 0;
        this.getPostList();
    }

    /**
     * @method getPostList
     * @description get post list
     */
    getPostList(event: any = null) {
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
        if (!this.newSearch && this.storedData.length !== 0 &&
            ((this.iteratablePageIndex + 1) <= (Math.ceil(this.pageElements / this.pageSize)))) {
            // If data already fetched
            this.dataSourcePostList = new MatTableDataSource(this.storedData.slice(
                this.iteratablePageIndex * this.pageSize,
                (this.iteratablePageIndex * this.pageSize) + this.pageSize
            ));
        } else {
            // If data needs to fetch from database.
            this.edpPostService.getPostList(passData).subscribe((res) => {
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
                    self.dataSourcePostList = new MatTableDataSource(self.storedData.slice(
                        self.iteratablePageIndex * self.pageSize, (
                            self.iteratablePageIndex * self.pageSize
                        ) + self.pageSize
                    ));
                    self.totalRecords = res['result']['totalElement'];
                    self.dataSourcePostList.sort = self.sort;
                } else {
                    self.storedData = [];
                    self.dataSourcePostList = new MatTableDataSource(self.storedData);
                    self.toastr.error(res['message']);
                    self.totalRecords = 0;
                    self.pageIndex = 0;
                    self.customPageIndex = 0;
                    self.iteratablePageIndex = 0;
                    self.dataSourcePostList.sort = self.sort;
                }
            }, (err) => {
                self.toastr.error(this.errorMessages['POST_LIST']['ERR_POST_LIST']);
                self.totalRecords = 0;
                self.pageIndex = 0;
                self.customPageIndex = 0;
                self.iteratablePageIndex = 0;
                self.dataSourcePostList = new MatTableDataSource([]);
            });
        }
    }

    /**
     * @method getSearchFilter
     * @description Function is called to get search filter in specific format
     * @returns array of searched parameters
     */
    getSearchFilter() {
        const obj = this.searchPostListForm.getRawValue();
        const returnArray = [];
        if (!obj.trnNo && !obj.fromDate && !obj.toDate && !obj.ddoNo && !obj.designationName &&
            !obj.statusId && !obj.districtId && !obj.cardexNo && !obj.wfStatusId) {
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
                || key === 'statusId' || key === 'wfStatusId') {
                if (key === 'fromDate' || key === 'toDate') {
                    if (obj['fromDate'] || obj['toDate']) {
                        if (!(obj['fromDate'] && obj['toDate'])) {
                            if (!obj['fromDate']) {
                                this.toastr.error(this.errorMessages['POST_LIST']['FROM_DATE']);
                            } else {
                                this.toastr.error(this.errorMessages['POST_LIST']['TO_DATE']);
                            }
                            return false;
                        }
                    }
                    const datePipe = new DatePipe('en-US');
                    currObj['value'] = (datePipe.transform(obj[key], 'MM-dd-yyyy') || '');
                } else {
                    currObj['value'] = (obj[key] || '').trim();
                }
            } else if (key === 'designationId' || key === 'statusId' || key === 'districtId' ||
                key === 'cardexNo') {
                if (key === 'cardexNo') {
                    currObj['value'] = Number(obj[key] || 0);
                } else {
                    currObj['value'] = (obj[key] || 0);
                }
            }
            returnArray.push(currObj);
        }
        returnArray.push(
            {
                key: 'currentWfId',
                value: this.loggedUserObj['wfRoleData'] ? this.loggedUserObj['wfRoleData'].toString() : ''
            },
            {
                key: 'officeId',
                value: this.loggedUserObj[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId']
            },
            {
                key: 'inPouId',
                value: this.loggedUserObj[0]['lkPoOffUserId']
                // As we are traversing from post transfer screen to listing there is no
                // way to dynamic assign menu id
            }
        );
        return returnArray;
    }

    /**
     * @method onPaginateChange
     * @description Function is called when pagination buttons are clicked
     * @param event which contains page size and page no.
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
            /**
             * Condition is for handle Go To Last Page button event.
             * set iteratablePageIndex to highest pageIndex so getData can load new set of data of current page index.
            */
            this.iteratablePageIndex = event.pageIndex;
        } else {
            this.iteratablePageIndex = this.iteratablePageIndex + 1;
        }
        this.getPostList(event);
    }
    onSortColumn() {
        this.sortBy = this.sort.active;
        this.sortOrder = this.sort.direction;
        this.paginator.pageIndex = 0;
        this.pageIndex = 0;
        this.getPostList();
    }

    /**
     * @method showConfirmationPopup
     * @description Function is called when confirm button clicked on popup
     */
    showConfirmationPopup(postId) {
        const param = {
            id: postId
        };
        const deleteMessage = this.errorMessages['CONFIRMATION_DIALOG']['DELETE'];
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: deleteMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.edpPostService.deletePost(param).subscribe((res) => {
                    if (res && res['status'] === 200) {
                        this.toastr.success(this.errorMessages['POST_LIST']['POST_DELETE']);
                        this.newSearch = true;
                        this.getPostList();
                    }
                }, (err) => {
                    this.toastr.error(this.errorMessages['POST_LIST']['ERR_POST_DELETE']);
                });
            }
        });
    }
}
