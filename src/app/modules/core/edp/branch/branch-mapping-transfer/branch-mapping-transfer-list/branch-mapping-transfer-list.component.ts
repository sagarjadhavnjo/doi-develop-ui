import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EDP_BRANCH, EdpDataConst, EDPDialogResult } from 'src/app/shared/constants/edp/edp-data.constants';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';

import { FilterNamesWithType, Types } from '../../../model/common.model';
import { EdpBranchService } from '../../../services/edp-branch.service';
import { EdpUtilityService } from '../../../services/edp-utility.service';

@Component({
    selector: 'app-branch-mapping-transfer-list',
    templateUrl: './branch-mapping-transfer-list.component.html',
    styleUrls: ['./branch-mapping-transfer-list.component.css']
})
export class BranchMappingTransferListComponent implements OnInit {
    readonly config = {
        hasDoneFilter: false,
        errorMessages: msgConst,
        statusCtrl: new FormControl(),
        requestTypeCtrl: new FormControl(),
        requestType: {
            list: []
        },
        status: {
            list: []
        },
        pagination: {
            pageSize: EDP_BRANCH.BRANCH.PAGE_SIZE_OPTIONS[2],
            pageIndex: 0,
            customPageIndex: 0,
            iteratablePageIndex: 0,
            newSearch: true,
            pageSizeOptions: EDP_BRANCH.BRANCH.PAGE_SIZE_OPTIONS,
            pageElements: EDP_BRANCH.BRANCH.PAGE_ELEMENTS
        },
        totalRecords: 0,
        dates: {
            from: {
                max: new Date()
            },
            to: {
                min: new Date(),
                max: new Date()
            }
        },
        matSelectNullValue: EdpDataConst.MAT_SELECT_NULL_VALUE,
        branchMappingTransferColumns: EDP_BRANCH.BRANCH.BRANCH_MAPPING_TRANSFER.LISTING.DISPLAY_COLS_HEADER,
        branchMappingTransferDisplayedRows: EDP_BRANCH.BRANCH.BRANCH_MAPPING_TRANSFER.LISTING.DISPLAY_NO_DATA_ROW
    };

    branchMappingAndTransferListingForm: FormGroup;
    branchMappingAndTransferDataSource: MatTableDataSource<any> = new MatTableDataSource([
        { noData: msgConst.BRANCH.NO_DATA_MSG }
    ]);

    storedData: any = [];

    private sort: MatSort;
    private paginator: MatPaginator;

    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this.sort = ms;
        this.setDataSourceAttributes();
    }

    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.branchMappingAndTransferDataSource.paginator = this.paginator;
    }

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private edpBranchService: EdpBranchService,
        private edpUtilityService: EdpUtilityService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.branchMappingAndTransferListingForm = this.fb.group({
            trnNo: [null],
            fromDate: [null],
            toDate: [null],
            employeeNo: [null],
            employeeName: [null],
            statusId: [null],
            requestType: [null]
        });

        this.setSearchFilters();
        this.onSearchClick();
    }

    onDeleteClick(tedpBrHdrId: number) {
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: EDP_BRANCH.BRANCH.CONFIRM_DIALOG_WIDTH,
            data: msgConst.CONFIRMATION_DIALOG.DELETE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === EDPDialogResult.YES) {
                this.edpBranchService.deleteMappedBranch(tedpBrHdrId).subscribe(
                    (response: any) => {
                        if (response && response.status === 200) {
                            this.onSearchClick();
                            this.showSuccessMessage(response.message);
                        }
                    },
                    err => {
                        this.toastr.error(err);
                    },
                    () => {
                        dialogRef = null;
                    }
                );
            } else {
                dialogRef = null;
            }
        });
    }

    private showSuccessMessage(message: string) {
        if (message) {
            this.toastr.success(message);
        }
    }

    onEditClick(tedpBrHdrId: number) {
        this.router.navigate(['../edit', tedpBrHdrId], {
            relativeTo: this.activatedRoute,
            skipLocationChange: true
        });
    }

    onViewClick(tedpBrHdrId: number) {
        this.router.navigate(['../view', tedpBrHdrId], {
            relativeTo: this.activatedRoute,
            skipLocationChange: true
        });
    }

    onClose() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: EDP_BRANCH.BRANCH.CONFIRM_DIALOG_WIDTH,
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === EDPDialogResult.YES) {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }

    onSearchClick() {
        this.resetPaginationInfo();
        this.getFilteredMappedBranches();
    }

    resetPaginationInfo() {
        if (this.paginator) {
            this.paginator.pageIndex = 0;
        }
        this.config.pagination.pageIndex = 0;
        this.config.pagination.customPageIndex = 0;
        this.config.pagination.iteratablePageIndex = 0;
        this.config.pagination.newSearch = true;
    }

    reset() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: EDP_BRANCH.BRANCH.CONFIRM_DIALOG_WIDTH,
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === EDPDialogResult.YES) {
                this.branchMappingAndTransferListingForm.reset();
            }
        });
    }

    resetToDate() {
        this.config.dates.to.min = new Date(this.branchMappingAndTransferListingForm.controls.fromDate.value);
        this.branchMappingAndTransferListingForm.controls.toDate.setValue('');
    }

    onPaginateChange(event: PageEvent) {
        this.getFilteredMappedBranches(event);
    }

    private setSearchFilters() {
        this.edpBranchService.getSearchFilters().subscribe((response: any) => {
            if (response && response.result && response.status === 200) {
                this.config.requestType.list = response.result.requestTypes;
                this.config.status.list = response.result.statusList;
            }
        });
    }

    /**
     * @description Gets List data
     */
    private getFilteredMappedBranches(event: any = null) {
        const params = this.getFilterMappedBranchRequest();
        if (params) {
            if (
                this.config.pagination.newSearch ||
                event.pageIndex * event.pageSize > this.config.pagination.pageElements
            ) {
                this.edpBranchService.getFilteredMappedBranches(params).subscribe(
                    (res: any) => {
                        if (res && res.status === 200) {
                            this.config.hasDoneFilter = true;
                            this.config.pagination.newSearch = false;
                            this.storedData = res.result ? cloneDeep(res.result.result) : [];

                            this.edpUtilityService.updatePaginationEventOnPageChange(
                                event,
                                this.config.pagination,
                                this.storedData
                            );

                            this.branchMappingAndTransferDataSource = new MatTableDataSource(
                                this.storedData.slice(
                                    this.config.pagination.iteratablePageIndex * this.config.pagination.pageSize,
                                    this.config.pagination.iteratablePageIndex * this.config.pagination.pageSize +
                                        this.config.pagination.pageSize
                                )
                            );
                            this.config.totalRecords = res.result ? res.result.totalElement : 0;
                            this.branchMappingAndTransferDataSource.sort = this.sort;

                            if (this.storedData.length < 1) {
                                this.branchMappingAndTransferDataSource = new MatTableDataSource([
                                    { noData: msgConst.BRANCH.NO_DATA_MSG }
                                ]);
                                this.config.branchMappingTransferDisplayedRows =
                                    EDP_BRANCH.BRANCH.BRANCH_MAPPING_TRANSFER.LISTING.DISPLAY_NO_DATA_ROW;
                            } else {
                                this.config.branchMappingTransferDisplayedRows =
                                    EDP_BRANCH.BRANCH.BRANCH_MAPPING_TRANSFER.LISTING.DISPLAY_COLS_HEADER;
                            }
                        }
                    },
                    err => {
                        this.config.hasDoneFilter = true;
                        this.toastr.error(err.message);

                        this.branchMappingAndTransferDataSource = new MatTableDataSource([]);
                    }
                );
            }
        }
    }

    private setDataSourceAttributes() {
        this.branchMappingAndTransferDataSource.paginator = this.paginator;
        this.branchMappingAndTransferDataSource.sort = this.sort;
    }

    private getFilterMappedBranchRequest() {
        const searchParam = this.getSearchFilter();

        if (searchParam) {
            const params = {
                jsonArr: searchParam,
                pageElement: this.config.pagination.pageElements,
                pageIndex: this.config.pagination.pageIndex
            };
            return params;
        } else {
            return null;
        }
    }

    /**
     * @description Creates Search Filter
     */
    private getSearchFilter() {
        const filterNamesWithTypes: FilterNamesWithType[] = [
            {
                name: 'trnNo',
                type: Types.String
            },

            {
                name: 'fromDate',
                type: Types.Date
            },
            {
                name: 'toDate',
                type: Types.Date
            },
            {
                name: 'employeeNo',
                type: Types.Number
            },

            {
                name: 'employeeName',
                type: Types.String
            },

            {
                name: 'statusId',
                type: Types.Number
            },
            {
                name: 'requestType',
                type: Types.Number
            }
        ];

        const filteredRequest = this.edpUtilityService.getSearchFilterRequest(
            this.branchMappingAndTransferListingForm,
            filterNamesWithTypes
        );

        const trnFromDate = filteredRequest.find(x => x.key === 'fromDate').value;
        const trnToDate = filteredRequest.find(x => x.key === 'toDate').value;

        if (trnFromDate || trnToDate) {
            if (!trnFromDate) {
                this.toastr.error(this.config.errorMessages.BRANCH.BRANCH_MAPPING_TRANSFER.LIST.FROM_DATE);
                return false;
            } else if (!trnToDate) {
                this.toastr.error(this.config.errorMessages.BRANCH.BRANCH_MAPPING_TRANSFER.LIST.TO_DATE);
                return false;
            }
        }

        return filteredRequest;
    }
}
