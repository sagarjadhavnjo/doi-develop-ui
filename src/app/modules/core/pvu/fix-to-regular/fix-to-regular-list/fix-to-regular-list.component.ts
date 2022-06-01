import { Component, OnInit } from '@angular/core';
import { ActionEventInterFace } from 'src/app/shared/components/common-table/model/common-model';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FixToRegularListService } from '../service/fix-to-regular-list.service';
import { PvuCommonService } from '../../pvu-common/services/pvu-common.service';
import { cloneDeep } from 'lodash';
import { FixtoRegularListingDto } from '../models/fix-to-regular.model';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-fix-to-regular-list',
    templateUrl: './fix-to-regular-list.component.html',
    styleUrls: ['./fix-to-regular-list.component.css']
})
export class FixToRegularListComponent implements OnInit {
    storedData: any[] = [];
    storedDataCopy: any[] = [];

    TABLE_HEADER_DATA_CONFIG = [
        {
            'dataKey': 'position',
            'tableHeader': 'Sr. No.',
            'matSortDisable': true,
            'width': '3%'
        },
        {
            'dataKey': 'trnNo',
            'tableHeader': 'Reference No',
            'matSortDisable': true,
            'width': '10%'
        },
        {
            'dataKey': 'refDate',
            'tableHeader': 'Reference Date',
            'matSortDisable': true,
            'width': '10%'
        },

        {
            'dataKey': 'employeeNo',
            'tableHeader': 'Employee No',
            'matSortDisable': true,
            'width': '10%'
        },
        {
            'dataKey': 'employeeName',
            'tableHeader': 'Employee Name',
            'matSortDisable': true,
            'width': '10%'
        },
        {
            'dataKey': 'designationName',
            'tableHeader': 'Designation',
            'matSortDisable': true,
            'width': '10%'
        },
        {
            'dataKey': 'preEmpPayType',
            'tableHeader': 'Employee Pay Type',
            'matSortDisable': true,
            'width': '10%'
        },
        {
            'dataKey': 'updatedPayType',
            'tableHeader': 'Updated Employee Pay Type',
            'matSortDisable': true,
            'width': '10%'
        },
        {
            'dataKey': 'officeName',
            'tableHeader': 'Office Name',
            'matSortDisable': true,
            'width': '10%'
        },
        {
            'dataKey': 'status',
            'tableHeader': 'Status',
            'matSortDisable': true,
            'width': '10%'
        },
        {
            'dataKey': 'action',
            'tableHeader': 'Action',
            'width': '10%',
            'matSortDisable': true,
            'configuration': {
                'actions': [
                    {
                        'actionName': 'edit',
                        'title': 'Edit',
                        'actionClass': 'material-icons plus edit-icon',
                        'iconName': 'edit',
                        'isDisable': 'isDisable',
                        'isVisible': 'isEditVisible'
                    }, {
                        'actionName': 'view',
                        'title': 'View',
                        'actionClass': 'material-icons plus view-icon',
                        'iconName': 'remove_red_eye',
                        'isDisable': 'isDisable',
                        'isVisible': 'isViewVisible'
                    }, {
                        'actionName': 'delete',
                        'title': 'Delete',
                        'actionClass': 'material-icons plus view-icon',
                        'iconName': 'delete',
                        'isDisable': 'isDisable',
                        'isVisible': 'isDeleteVisible'
                    }
                ]

            }
        }];

    pageConfiguration = {
        pageSizeOptions: DataConst.PAGINATION_ARRAY,
        totalElements: 0,
        pageSize: 25,
        pageIndex: 0,
    };
    loggedUserObj;
    sortByKey = null;
    directiveObject;
    indexedItem: number;
    customPageIndex: number;
    searchListForm: FormGroup;
    empDesignation_list;
    newSearch = false;
    officeName: string = '';
    isSearch = 0;
    officeName_list;
    statusList: object[] = [];
    officeId;
    errorMessages = pvuMessage;
    todayDate = new Date();
    createdFromDate = new Date();
    createdToDate = new Date();
    empDesignationCtrl: FormControl = new FormControl();
    officeNameCtrl: FormControl = new FormControl();
    statusCtrl: FormControl = new FormControl();
    constructor(private toastr: ToastrService,
        private router: Router,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private pvuService: PvuCommonService,
        private fixToRegularListService: FixToRegularListService,
        private datepipe: DatePipe) { }

    ngOnInit(): void {
        this.getLookup();

        this.searchListForm = this.fb.group({
            trNo: [''],
            empNo: [null],
            empName: [''],
            desigId: [null],
            offName: [this.officeName],
            statusId: [null],
            createdFromDate: [''],
            createdToDate: ['']
        });
        this.pvuService.getCurrentUserDetail().then((res) => {
            if (res) {
                this.loggedUserObj = res;
                console.log(this.loggedUserObj);
                if (res['officeDetail']) {
                    this.officeName = res['officeDetail']['officeName'];
                    this.officeId = +res['officeDetail']['officeId'];
                    this.searchListForm.patchValue({
                        offName: this.officeName
                    });
                }
                this.getStatus();
                this.getfixToRegularList(null, true);
            }
        });

    }

    getStatus() {
        const param = {
            id: this.loggedUserObj['currentMenuId']
        };
        this.fixToRegularListService.getStatus(param).subscribe((res) => {
            if (res && res['result'] && res['result'].length > 0) {
                this.statusList = res['result'];
            }
        });
    }


    getLookup() {
        this.isSearch = 0;
        this.fixToRegularListService.getDesignation().subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.empDesignation_list = res['result'];
            }
        });
        // this.fixToRegularListService.getAllOffice().subscribe((res) => {
        //     if (res && res['status'] === 200) {
        //         console.log(res['result']['Office_type']);

        //         this.officeName_list = res['result']['Office_type'];
        //     }
        // });
    }


    /**
  * @description gets outcome list
  * @param event pagechange event null
  * @param refresh to refresh data
  */
    getfixToRegularList(event: any = null, refresh: boolean = false) {
        const searchData = this.getSearchFilter();
        if (!searchData || searchData === null) {
            return;
        }
        const passData = {
            pageIndex: !this.newSearch ? this.pageConfiguration.pageIndex : 0,
            pageElement: this.pageConfiguration.pageSize,
            // sortByKey: this.sortByKey ? this.sortByKey : null,
            jsonArr: searchData
        };
        this.fixToRegularListService.getfixToRegularList(passData).subscribe(res => {
            if (res && res['status'] === 200) {
                // For customize pagination
                this.storedData = cloneDeep(res['result']['result']);

                this.pageConfiguration.totalElements = res['result']['totalElement'];
                if (event === null) {
                    this.pageConfiguration.pageIndex = 0;
                }
                this.newSearch = refresh;
                this.setActionConfig();
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.storedData = [];
        });
    }
    setActionConfig() {
        this.storedData = this.storedData.map(item => {
            item['isEditVisible'] = (item.isEditable === 1) ? true : false;
            item['isViewVisible'] = true;
            item['isDeleteVisible'] = (item.isEditable === 1) ? true : false;
            return item;
        });
        if ( this.isSearch === 0) {
            this.storedDataCopy = cloneDeep(this.storedData);
        }
    }
    openConfirmPopUpDialog(msg: string) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '350px',
            data: msg
        });
        return dialogRef.afterClosed();
    }

    /**
        * @description handles page change value
        * @param value pageChange value
        */

    pageChange(value) {
        this.pageConfiguration.pageIndex = value.pageIndex;
        this.pageConfiguration.pageSize = value.pageSize;
        this.getfixToRegularList(value);
    }

    sortChange(event) {

    }


    getSearchFilter() {
        if (this.searchListForm.valid) {
            const jsonArr = [];
            const commPageObj = new FixtoRegularListingDto(this.searchListForm.value);
            const check = JSON.parse(JSON.stringify(commPageObj));
            // tslint:disable-next-line:forin
            for (const pageKey in check) {
                let keyVal = {};
                if (commPageObj[pageKey] && commPageObj[pageKey] != null) {
                    this.isSearch = 1;
                }
                if (pageKey === 'createdFromDate' || pageKey === 'createdToDate') {
                    keyVal = {
                        key: pageKey,
                        value: this.changeDateFormat(commPageObj[pageKey])
                    };
                } else {
                    keyVal = {
                        key: pageKey,
                        value: commPageObj[pageKey]
                    };
                }
                jsonArr.push(keyVal);
            }

            jsonArr.push({ key: 'isSearch', value: this.isSearch });
            jsonArr.push({ key: 'lkpouId', value: this.loggedUserObj['lkPOUId'] });
            jsonArr.push({ key: 'menuId', value: this.loggedUserObj['currentMenuId'] });
            return jsonArr;
        } else {
            // this.toastr.error(MessageConst.COMMON.FILL_ALL_DETAIL);
        }
        return null;
    }

    /**
        * @description handles action event
        * @param actionName action interface
        */
    actionEvent(actionName: ActionEventInterFace) {
        if (actionName.action === 'edit' || actionName.action === 'view') {
            this.goToTransaction(actionName.action, actionName.data);
        } else if (actionName.action === 'delete') {
            this.deleteTransaction(actionName.data);
        }
    }

    deleteTransaction(data: any) {
        this.openConfirmPopUpDialog(pvuMessage.CONFIRMATION_DIALOG.DELETE).subscribe(dialogRes => {
            if (dialogRes === 'yes') {
                this.deleteTrans(data);
            }
        });
    }

    deleteTrans(data) {
        this.fixToRegularListService.deleteRecord({ id: data.fixRegId }).subscribe(res => {
            if (res && res['status'] === 200) {
                this.toastr.success(res['message']);
                this.storedData = this.storedData.filter(function (element) {
                    return element.fixRegId !== data.fixRegId;
                });
            } else {
                this.toastr.error(res['message']);
            }
        });
    }

    goToTransaction(actionName, actionData) {
        const isSubmitted = (actionData.status && actionData.status === 'Saved as Draft') ? 0 : 1;
        const routeUrl = 'dashboard/pvu/fix-to-regular/' + actionName + '/' + actionData.fixRegId + '/' + isSubmitted;
        this.router.navigate([routeUrl], { skipLocationChange: true });
    }

    onSubmitSearch() {
        // this.isSearch = 1;
        this.getfixToRegularList(null, true);
        this.newSearch = true;
        // this.pageIndex = 0;
        // this.customPageIndex = 0;
        // this.paginator.pageIndex = 0;
        // this.iteratablePageIndex = 0;
        // this.getData();
        // this.getStatus();
    }

    clearForm() {
        this.searchListForm.reset();
        if (this.isSearch === 0) {
            return;
        }
        this.isSearch = 0;
        // this.searchListForm.patchValue({
        //     officeName: this.officeName
        // });
        // this.storedData = this.storedDataCopy;
        this.getfixToRegularList(null, true);
        this.newSearch = true;
        // this.dataSource = new MatTableDataSource([]);
        // this.newSearch = true;
        // this.pageIndex = 0;
        // this.customPageIndex = 0;
        // this.paginator.pageIndex = 0;
        // this.iteratablePageIndex = 0;
        // this.isSearch = 1;
        // this.indexedItem = 0;
        // this.iteratablePageIndex = 0;
        // this.totalRecords = 0;
    }

    changeDateFormat(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'MM/dd/yyyy');
        }
        return '';
    }


    oncreatedToDateChange(date) {
        this.createdFromDate = date;
    }

    oncreatedFromDateChange(date) {
        this.createdToDate = date;
    }
    // goToDashboard() {
    //     this.openConfirmPopUpDialog(pvuMessage.CONFIRMATION_DIALOG.CLOSE).subscribe(dialRes => {
    //         if (dialRes === 'yes') {
    //             this.router.navigate(['/dashboard'], {skipLocationChange: true});
    //         }
    //     });
    // }
}
