import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EDP_BRANCH, EdpDataConst, EDPDialogResult } from 'src/app/shared/constants/edp/edp-data.constants';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { StorageService } from 'src/app/shared/services/storage.service';

import { EdpBranchService } from '../../../services/edp-branch.service';
import { BranchDetails } from '../branch-detail.model';
import { EmployeeBranchDetails } from '../branch-emp-detail.model';
import { BranchMappingRequest, FormActions } from '../branch-mapping-transfer';
import { MappedBranchDialogComponent } from '../mapped-branch-dialog/mapped-branch-dialog.component';
import { MenuErrorDisplayDialogComponent } from '../menu-error-display-dialog/menu-error-display-dialog.component';
import { MessageBranchDialogComponent } from '../message-branch-dialog/message-branch-dialog.component';

@Component({
    selector: 'app-branch-mapping-transfer-detail',
    templateUrl: './branch-mapping-transfer-detail.component.html',
    styleUrls: ['./branch-mapping-transfer-detail.component.css']
})
export class BranchMappingTransferDetailComponent implements OnInit, OnDestroy {
    readonly config = {
        errorMessages: msgConst,

        referenceDate: null,
        referenceNo: null,
        tedpBrHdrId: null,

        branchActionCtrl: new FormControl(),
        employeeDetailsCtrl: new FormControl(),
        branchCtrl: new FormControl(),
        employeeDetailsFromCtrl: new FormControl(),
        employeeDetailsToCtrl: new FormControl(),

        branch: {
            branchMapping: { list: [], selected: null, mappedBranch: [] },
            branchMappingFrom: { list: [], selected: null, mappedBranch: [], branchesToBeMapped: [] },
            branchMappingTo: { list: [], selected: null, mappedBranch: [] }
        },
        branchAction: {
            list: [],
            selected: null,
            isBranchMapping: false,
            isBranchTransfer: false
        },
        employeeDetails: {
            list: [],
            selected: null
        },

        header: {
            branchMapping: msgConst.BRANCH.BRANCH_MAPPING_TRANSFER.BRANCH_MAPPING_HEADER,
            branchMappingFrom: msgConst.BRANCH.BRANCH_MAPPING_TRANSFER.BRANCH_MAPPING_FROM_HEADER,
            branchMappingTo: msgConst.BRANCH.BRANCH_MAPPING_TRANSFER.BRANCH_MAPPING_TO_HEADER
        },
        branchMappingTransferColumns: EDP_BRANCH.BRANCH.BRANCH_MAPPING_TRANSFER.DISPLAY_COLS_HEADER,
        branchMappingTransferDisplayedRows: EDP_BRANCH.BRANCH.BRANCH_MAPPING_TRANSFER.DISPLAY_NO_DATA_ROW,

        branchMappingFromColumns: EDP_BRANCH.BRANCH.BRANCH_MAPPING_FROM.DISPLAY_COLS_HEADER,
        branchMappingFromDisplayedRows: EDP_BRANCH.BRANCH.BRANCH_MAPPING_FROM.DISPLAY_NO_DATA_ROW,

        branchMappingToColumns: EDP_BRANCH.BRANCH.BRANCH_MAPPING_TO.DISPLAY_COLS_HEADER,
        branchMappingToDisplayedRows: EDP_BRANCH.BRANCH.BRANCH_MAPPING_TO.DISPLAY_NO_DATA_ROW,

        subscription: {
            activatedRoute$: null
        },
        pageAction: null,
        mode: {
            create: true,
            edit: false,
            view: false
        },
        matSelectNullValue: EdpDataConst.MAT_SELECT_NULL_VALUE,
        userOfficeInfo: null
    };

    // Main Form
    branchMappingTransferForm: FormGroup;

    // When branch mapping is there
    branchMappingDataSource: MatTableDataSource<any> = new MatTableDataSource([
        { noData: msgConst.BRANCH.NO_DATA_MSG }
    ]);

    // When branch transfer is there
    branchMappingFromDataSource: MatTableDataSource<any> = new MatTableDataSource([
        { noData: msgConst.BRANCH.NO_DATA_MSG }
    ]);
    branchMappingToDataSource: MatTableDataSource<any> = new MatTableDataSource([
        { noData: msgConst.BRANCH.NO_DATA_MSG }
    ]);

    paginator: MatPaginator;
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        this.branchMappingDataSource.paginator = this.paginator;
    }

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private storageService: StorageService,
        private edpBranchService: EdpBranchService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.setFormGroup();
        this.setUserOfficeInfo();
        this.setBranchRequestType();
        this.setLoggedOfficeBranches();
        this.setEmpAndPostForOffice();
    }

    ngOnDestroy() {
        this.config.subscription.activatedRoute$ = null;
    }

    private setFormGroup() {
        this.branchMappingTransferForm = this.fb.group({
            district: [{ value: null, disabled: true }],
            ddoNo: [{ value: null, disabled: true }],
            cardexNo: [{ value: null, disabled: true }],
            officeName: [{ value: null, disabled: true }],
            branchAction: [null, [Validators.required]],
            employeeDetails: [null],
            employeeDetailsFrom: [null],
            employeeDetailsTo: [null]
        });
    }

    isBranchDisabled(branchId: number) {
        if (branchId) {
            return this.config.branch.branchMapping.mappedBranch.some(x => x === branchId);
        }
        return false;
    }

    isFromBranchDisabled(branchId: number) {
        if (branchId) {
            const concatedBranches = this.getConcatedBranches();
            return !concatedBranches.includes(branchId);
        }
        return false;
    }

    private getConcatedBranches() {
        const branchesToBeMapped = this.config.branch.branchMappingFrom.branchesToBeMapped;
        const mappedBranches = this.config.branch.branchMappingFrom.mappedBranch;
        return branchesToBeMapped.concat(mappedBranches);
    }

    onBranchActionChange() {
        const branchActionId = this.branchMappingTransferForm.controls.branchAction.value;
        switch (branchActionId) {
            case EDP_BRANCH.BRANCH.BRANCH_ACTIONS.MAPPING:
                this.config.branchAction.isBranchMapping = true;
                this.config.branchAction.isBranchTransfer = false;

                this.branchMappingTransferForm.controls.employeeDetailsFrom.clearValidators();
                this.branchMappingTransferForm.controls.employeeDetailsTo.clearValidators();
                this.branchMappingTransferForm.controls.employeeDetails.setValidators([Validators.required]);
                this.branchMappingTransferForm.updateValueAndValidity();
                break;

            case EDP_BRANCH.BRANCH.BRANCH_ACTIONS.TRANSFER:
                this.config.branchAction.isBranchMapping = false;
                this.config.branchAction.isBranchTransfer = true;

                this.branchMappingTransferForm.controls.employeeDetails.clearValidators();
                this.branchMappingTransferForm.controls.employeeDetailsFrom.setValidators([Validators.required]);
                this.branchMappingTransferForm.controls.employeeDetailsTo.setValidators([Validators.required]);
                this.branchMappingTransferForm.updateValueAndValidity();
                break;

            default:
                this.config.branchAction.isBranchMapping = false;
                this.config.branchAction.isBranchTransfer = false;
                break;
        }

        this.resetBranchMappingData();
    }

    private resetBranchMappingData(
        branchMappingTransferActions: { isMappingOnly?: boolean; isFromEmp?: boolean; isToEmp?: boolean } = null
    ) {
        if (branchMappingTransferActions) {
            if (branchMappingTransferActions.isMappingOnly) {
                this.resetBranchMapping();
            } else if (branchMappingTransferActions.isFromEmp) {
                this.resetFromBranchMapping();
            } else {
                this.resetToBranchMapping();
            }
        } else {
            this.resetBranchMapping();
            this.resetFromBranchMapping();
            this.resetToBranchMapping();
        }
        this.branchMappingTransferForm.markAsPristine();
    }

    onBranchChange(employeeBranchDetails: EmployeeBranchDetails) {
        const branchIds = employeeBranchDetails.mappedBranches.filter(
            x => !this.config.branch.branchMapping.mappedBranch.includes(x)
        );

        employeeBranchDetails.branchesToBeMapped = this.config.branch.branchMapping.list.filter(x =>
            branchIds.includes(x.id)
        );
        this.branchMappingTransferForm.markAsDirty();
    }

    onFromBranchChange(employeeBranchDetails: EmployeeBranchDetails) {
        const concatedBranches = this.getConcatedBranches();

        const branchIds = concatedBranches.filter(x => !employeeBranchDetails.mappedBranches.includes(x));

        employeeBranchDetails.branchesToBeMapped = this.config.branch.branchMapping.list.filter(x =>
            branchIds.includes(x.id)
        );
        this.branchMappingTransferForm.markAsDirty();
    }

    onBranchMappingSaveAsDraft() {
        this.saveMappedBranches(FormActions.DRAFT);
    }

    onBranchMappingSubmit() {
        this.saveMappedBranches(FormActions.SUBMITTED);
    }

    onBranchTransferSaveAsDraft() {
        this.saveTansferredBranches(FormActions.DRAFT);
    }

    onBranchTransferSubmit() {
        this.saveTansferredBranches(FormActions.SUBMITTED);
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

    gotoListing() {
        this.router.navigate(['/dashboard/edp/branch/branch-mapping/list'], { skipLocationChange: true });
    }

    onEmpDetailChange() {
        const employeeDetail = this.getCurrentEmployeeDetails();
        const postOfficeUserId = employeeDetail ? employeeDetail.postOfficeUserId : null;

        if (postOfficeUserId) {
            this.checkForBrMapRequest(postOfficeUserId).subscribe(
                (response: any) => {
                    if (response && response.status === 200) {
                        this.setEmpBranches(postOfficeUserId, { isMappingOnly: true });
                    } else {
                        this.showAlreadyExistTransactionMsg(response.message);
                        this.resetBranchMapping();
                    }
                },
                err => this.toastr.error(err)
            );
        } else {
            this.resetBranchMapping();
        }
    }

    onFromEmpDetailChange() {
        const employeeDetail = this.getCurrentFromEmployeeDetails();
        const postOfficeUserId = employeeDetail ? employeeDetail.postOfficeUserId : null;

        if (postOfficeUserId) {
            if (!this.isEmpToFromSame()) {
                this.checkForBrMapRequest(postOfficeUserId).subscribe(
                    (response: any) => {
                        if (response && response.status === 200) {
                            this.setEmpBranches(postOfficeUserId, { isFromEmp: true });
                        } else {
                            this.showAlreadyExistTransactionMsg(response.message);
                            this.resetFromBranchMapping();
                        }
                    },
                    err => this.toastr.error(err)
                );
            } else {
                this.toastr.error(msgConst.BRANCH.BRANCH_MAPPING_TRANSFER.ERR_SAME_TO_FROM_EMP);
                this.resetFromBranchMapping();
            }
        } else {
            this.resetFromBranchMapping();
        }
    }

    onToEmpDetailChange() {
        const employeeDetail = this.getCurrentToEmployeeDetails();
        const postOfficeUserId = employeeDetail ? employeeDetail.postOfficeUserId : null;
        if (postOfficeUserId) {
            if (!this.isEmpToFromSame()) {
                this.checkForBrMapRequest(postOfficeUserId).subscribe((response: any) => {
                    if (response && response.status === 200) {
                        this.setEmpBranches(postOfficeUserId, { isToEmp: true });
                    } else {
                        this.showAlreadyExistTransactionMsg(response.message);
                        this.resetToBranchMapping();
                    }
                });
            } else {
                this.toastr.error(msgConst.BRANCH.BRANCH_MAPPING_TRANSFER.ERR_SAME_TO_FROM_EMP);
                this.resetToBranchMapping();
            }
        } else {
            this.resetToBranchMapping();
        }
    }

    checkForBrMapRequest(postOfficeUserId: number) {
        return this.edpBranchService.checkForBrMapRequest(postOfficeUserId);
    }

    showAlreadyExistTransactionMsg(message: string) {
        let dialogRef = this.dialog.open(MessageBranchDialogComponent, {
            disableClose: true,
            height: 'auto',
            width: '600px',
            data: { message: message }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                dialogRef = null;
            }
        });
    }

    isEmpToFromSame() {
        let isSame = false;
        const employeeFrom = this.getCurrentFromEmployeeDetails();
        const employeeTo = this.getCurrentToEmployeeDetails();

        const fromPostOfficeUserId = employeeFrom ? employeeFrom.postOfficeUserId : null;
        const toPostOfficeUserId = employeeTo ? employeeTo.postOfficeUserId : null;

        if (fromPostOfficeUserId && toPostOfficeUserId) {
            isSame = fromPostOfficeUserId === toPostOfficeUserId;
        }
        return isSame;
    }

    onFromMappedBranchClick(employeeBranchDetails: EmployeeBranchDetails) {
        const concatedBranches = this.getConcatedBranches();
        const mappedBranches = this.config.branch.branchMapping.list.filter(x => concatedBranches.includes(x.id));
        this.openMappedBranchDialog(mappedBranches, employeeBranchDetails);
    }

    onMappedBranchClick(employeeBranchDetails: EmployeeBranchDetails) {
        const mappedBranches = this.config.branch.branchMapping.list.filter(x =>
            this.config.branch.branchMapping.mappedBranch.includes(x.id)
        );
        this.openMappedBranchDialog(mappedBranches, employeeBranchDetails);
    }

    private openMappedBranchDialog(mappedBranches: any[], employeeBranchDetails: EmployeeBranchDetails) {
        const headerJson = [
            { label: EDP_BRANCH.BRANCH.MAPPING_INFO.LABELS.EMP_NO, value: employeeBranchDetails.empNo },
            { label: EDP_BRANCH.BRANCH.MAPPING_INFO.LABELS.EMP_NAME, value: employeeBranchDetails.empName },
            { label: EDP_BRANCH.BRANCH.MAPPING_INFO.LABELS.POST_NAME, value: employeeBranchDetails.postName }
        ];
        let dialogRef = this.dialog.open(MappedBranchDialogComponent, {
            width: '800px',
            height: 'auto',
            data: {
                branches: mappedBranches,
                headerJson: headerJson
            }
        });
        dialogRef.afterClosed().subscribe(() => {
            dialogRef = null;
        });
    }

    onReset() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: EDP_BRANCH.BRANCH.CONFIRM_DIALOG_WIDTH,
            data: msgConst.CONFIRMATION_DIALOG.RESET_DATA
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === EDPDialogResult.YES) {
                if (this.config.pageAction === EDP_BRANCH.BRANCH.PAGE_ACTION.NEW && !this.config.tedpBrHdrId) {
                    this.resetBranchMappingData();
                } else {
                    this.setBranchDetailsByHdrId();
                }
            }
        });
    }

    private setUserOfficeInfo() {
        this.config.userOfficeInfo = this.storageService.get(EDP_BRANCH.STORAGE_SERVICE_KEYS.USER_OFFICE);
        this.branchMappingTransferForm.patchValue({
            district: this.config.userOfficeInfo.districtName,
            ddoNo: this.config.userOfficeInfo.ddoNo,
            cardexNo: this.config.userOfficeInfo.cardexno,
            officeName: this.config.userOfficeInfo.officeName
        });
    }

    private setBranchMappingHeaders(employeeBranchDetails: EmployeeBranchDetails) {
        this.config.branch.branchMapping.mappedBranch = [...employeeBranchDetails.mappedBranches];
        this.config.branchMappingTransferDisplayedRows = EDP_BRANCH.BRANCH.BRANCH_MAPPING_TRANSFER.DISPLAY_COLS_HEADER;
    }

    private setBranchTransferFromHeaders(employeeBranchDetails: EmployeeBranchDetails) {
        this.config.branch.branchMappingFrom.mappedBranch = [...employeeBranchDetails.mappedBranches];
        this.config.branchMappingFromDisplayedRows = EDP_BRANCH.BRANCH.BRANCH_MAPPING_FROM.DISPLAY_COLS_HEADER;
    }

    private setBranchTransferToHeaders(employeeBranchDetails: EmployeeBranchDetails) {
        this.config.branch.branchMappingTo.mappedBranch = employeeBranchDetails.mappedBranches
            ? [...employeeBranchDetails.mappedBranches]
            : [];
        this.config.branchMappingToDisplayedRows = EDP_BRANCH.BRANCH.BRANCH_MAPPING_TO.DISPLAY_COLS_HEADER;
    }

    private getCurrentFromEmployeeDetails() {
        return this.branchMappingTransferForm.controls.employeeDetailsFrom.value;
    }

    private getCurrentToEmployeeDetails() {
        return this.branchMappingTransferForm.controls.employeeDetailsTo.value;
    }
    private getCurrentEmployeeDetails() {
        return this.branchMappingTransferForm.controls.employeeDetails.value;
    }

    private setEmpBranches(
        postOfficeUserId: number,
        branchMappingTransferActions: { isMappingOnly?: boolean; isFromEmp?: boolean; isToEmp?: boolean } = null
    ) {
        if (postOfficeUserId) {
            this.edpBranchService.getEmpBranches(postOfficeUserId).subscribe((response: any) => {
                if (response && response.result && response.status === 200) {
                    let employeeBranchDetails: EmployeeBranchDetails = new EmployeeBranchDetails();
                    employeeBranchDetails = employeeBranchDetails.fromJson(response.result);

                    if (branchMappingTransferActions.isMappingOnly) {
                        this.branchMappingDataSource = new MatTableDataSource([employeeBranchDetails]);
                        this.setBranchMappingHeaders(employeeBranchDetails);
                    } else if (branchMappingTransferActions.isFromEmp) {
                        this.branchMappingFromDataSource = new MatTableDataSource([employeeBranchDetails]);
                        this.setBranchTransferFromHeaders(employeeBranchDetails);
                    } else {
                        this.branchMappingToDataSource = new MatTableDataSource([employeeBranchDetails]);
                        this.setBranchTransferToHeaders(employeeBranchDetails);
                    }
                } else {
                    this.toastr.error(response.message);
                }
            });
        } else {
            this.resetBranchMappingData(branchMappingTransferActions);
        }
    }

    private saveMappedBranches(formAction = FormActions.DRAFT) {
        const branches = this.branchMappingDataSource.data.find(x => x.branchesToBeMapped.length > 0);
        const branchesToBeMapped = branches ? branches.branchesToBeMapped.map(x => x.id) : [];

        if (branchesToBeMapped && branchesToBeMapped.length) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: EDP_BRANCH.BRANCH.CONFIRM_DIALOG_WIDTH,
                data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === EDPDialogResult.YES) {
                    const request = this.getBranchMappingRequest(formAction, branchesToBeMapped);
                    this.callSaveTransferMapping(request);
                }
            });
        } else {
            this.toastr.error(msgConst.BRANCH.BRANCH_MAPPING_TRANSFER.ERR_SELECT_ATLEAST_ONE_BRANCH_ADD);
        }
    }

    private saveTansferredBranches(formAction = FormActions.DRAFT) {
        const branches = this.branchMappingFromDataSource.data.find(x => x.branchesToBeMapped.length > 0);
        const branchesToBeMapped = branches ? branches.branchesToBeMapped.map(x => x.id) : [];

        if (branchesToBeMapped && branchesToBeMapped.length) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: EDP_BRANCH.BRANCH.CONFIRM_DIALOG_WIDTH,
                data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === EDPDialogResult.YES) {
                    const request = this.getBranchTransferRequest(formAction, branchesToBeMapped);
                    this.checkUserAccess(request.fromPouId, request.toPouId).subscribe((response: any) => {
                        if (response.status === 200) {
                            this.callSaveTransferMapping(request);
                        } else {
                            this.showMenuErrorDisplayDialog(response);
                        }
                    });
                }
            });
        } else {
            this.toastr.error(msgConst.BRANCH.BRANCH_MAPPING_TRANSFER.ERR_SELECT_ATLEAST_ONE_BRANCH_TRNS);
        }
    }

    private checkUserAccess(fromPouId: number, toPouId: number) {
        return this.edpBranchService.checkUserAccess(fromPouId, toPouId);
    }

    private showMenuErrorDisplayDialog(reponse) {
        const headerJson = [{ message: reponse.message }];
        let dialogRef = this.dialog.open(MenuErrorDisplayDialogComponent, {
            width: '1000px',
            height: 'auto',
            data: {
                menuInfo: reponse.result,
                headerJson: headerJson
            }
        });
        dialogRef.afterClosed().subscribe(() => {
            dialogRef = null;
        });
    }

    private getBranchMappingRequest(formAction = FormActions.DRAFT, branchesToBeMapped: number[] = []) {
        const branchRequest: BranchMappingRequest = {
            branchesToBeMapped: branchesToBeMapped,
            formAction: formAction,
            fromPouId: this.getCurrentEmployeeDetails().postOfficeUserId,
            requestType: this.branchMappingTransferForm.controls.branchAction.value,
            tedpBrHdrId: this.config.tedpBrHdrId ? +this.config.tedpBrHdrId : null,
            toPouId: null,
            trnNo: this.config.referenceNo
        };

        return branchRequest;
    }

    private getBranchTransferRequest(formAction = FormActions.DRAFT, branchesToBeMapped: number[] = []) {
        const branchRequest: BranchMappingRequest = {
            branchesToBeMapped: branchesToBeMapped,
            formAction: formAction,
            fromPouId: this.getCurrentFromEmployeeDetails().postOfficeUserId,
            requestType: this.branchMappingTransferForm.controls.branchAction.value,
            tedpBrHdrId: this.config.tedpBrHdrId,
            toPouId: this.getCurrentToEmployeeDetails().postOfficeUserId,
            trnNo: this.config.referenceNo
        };

        return branchRequest;
    }

    private callSaveTransferMapping(branchRequest: BranchMappingRequest) {
        this.edpBranchService.saveBranchMappingOrTransfer(branchRequest).subscribe((response: any) => {
            if (response && response.result && response.status === 200) {
                // let branchDetails: BranchDetails = new BranchDetails();
                // branchDetails = branchDetails.fromJson(response.result);
                // this.setBranchDetailsFromToEmployee(response.result);
                this.showSuccessMessage(response.message);
                this.gotoListing();
            } else {
                this.toastr.error(response.message);
            }
        });
    }

    private showSuccessMessage(message: string) {
        if (message) {
            this.toastr.success(message);
        }
    }

    private updateConfig(branchDetails: BranchDetails) {
        this.config.tedpBrHdrId = branchDetails.tedpBrHdrId;
        this.config.referenceNo = branchDetails.trnNo;
        this.config.referenceDate = branchDetails.createdDate ? new Date(branchDetails.createdDate) : new Date();
    }

    private resetBranchMapping() {
        this.branchMappingTransferForm.patchValue({
            employeeDetails: null
        });
        this.config.branchMappingTransferDisplayedRows = EDP_BRANCH.BRANCH.BRANCH_MAPPING_TRANSFER.DISPLAY_NO_DATA_ROW;
        this.branchMappingDataSource = new MatTableDataSource([{ noData: msgConst.BRANCH.NO_DATA_MSG }]);
    }

    private resetFromBranchMapping() {
        this.branchMappingTransferForm.patchValue({
            employeeDetailsFrom: null
        });
        this.config.branchMappingFromDisplayedRows = EDP_BRANCH.BRANCH.BRANCH_MAPPING_FROM.DISPLAY_NO_DATA_ROW;
        this.branchMappingFromDataSource = new MatTableDataSource([{ noData: msgConst.BRANCH.NO_DATA_MSG }]);
    }

    private resetToBranchMapping() {
        this.branchMappingTransferForm.patchValue({
            employeeDetailsTo: null
        });
        this.config.branchMappingToDisplayedRows = EDP_BRANCH.BRANCH.BRANCH_MAPPING_TO.DISPLAY_NO_DATA_ROW;
        this.branchMappingToDataSource = new MatTableDataSource([{ noData: msgConst.BRANCH.NO_DATA_MSG }]);
    }

    private subscribeActivatedRoute() {
        this.config.subscription.activatedRoute$ = this.activatedRoute.params.subscribe(resRoute => {
            this.config.pageAction = resRoute.action ? resRoute.action : EDP_BRANCH.BRANCH.PAGE_ACTION.NEW;
            this.config.tedpBrHdrId = resRoute.id ? resRoute.id : null;

            this.enableDisableFieldsByPageAction();
            this.setBranchDetailsByHdrId();
        });
    }

    private enableDisableFieldsByPageAction() {
        if (this.config.pageAction === EDP_BRANCH.BRANCH.PAGE_ACTION.EDIT) {
            this.config.mode = {
                create: false,
                edit: true,
                view: false
            };
            this.branchMappingTransferForm.controls.branchAction.disable();
        } else if (this.config.pageAction === EDP_BRANCH.BRANCH.PAGE_ACTION.VIEW) {
            this.config.mode = {
                create: false,
                edit: false,
                view: true
            };
            this.branchMappingTransferForm.disable();
        } else {
            this.config.mode = {
                create: true,
                edit: false,
                view: false
            };
        }
    }

    private setBranchDetailsByHdrId() {
        if (this.config.pageAction !== EDP_BRANCH.BRANCH.PAGE_ACTION.NEW) {
            this.edpBranchService.getBranchDetailsByHdrId(this.config.tedpBrHdrId).subscribe(
                (response: any) => {
                    if (response && response.result && response.status === 200) {
                        this.setBranchDetailsFromToEmployee(response.result);
                    } else {
                        this.toastr.error(response.message);
                    }
                },
                error => this.toastr.error(error)
            );
        }
    }

    private setBranchDetailsFromToEmployee(result: any) {
        let branchDetail = new BranchDetails();
        let employeeBranchDetails: EmployeeBranchDetails = null;

        branchDetail = branchDetail.fromJson(result);
        this.setRequestType(branchDetail);
        this.updateConfig(branchDetail);
        employeeBranchDetails = new EmployeeBranchDetails();

        if (branchDetail.fromPouId && branchDetail.toPouId) {
            employeeBranchDetails = employeeBranchDetails.fromJson(branchDetail.fromUserBranch);
            this.setBranchesToBeMapped(employeeBranchDetails, branchDetail);
            if (branchDetail.branchesToBeMapped && branchDetail.branchesToBeMapped.length) {
                const notTransferredBranches = employeeBranchDetails.mappedBranches.filter(
                    x => !branchDetail.branchesToBeMapped.includes(x)
                );
                employeeBranchDetails.mappedBranches = notTransferredBranches;
                this.config.branch.branchMappingFrom.branchesToBeMapped = branchDetail.branchesToBeMapped;
            }

            this.branchMappingFromDataSource = new MatTableDataSource([cloneDeep(employeeBranchDetails)]);
            this.setBranchTransferFromHeaders(employeeBranchDetails);

            employeeBranchDetails = employeeBranchDetails.fromJson(branchDetail.toUserBranch);
            this.branchMappingToDataSource = new MatTableDataSource([cloneDeep(employeeBranchDetails)]);
            this.setBranchTransferToHeaders(employeeBranchDetails);

            const fromEmployee = this.config.employeeDetails.list.find(
                x => x.postOfficeUserId === branchDetail.fromPouId
            );
            const toEmployee = this.config.employeeDetails.list.find(x => x.postOfficeUserId === branchDetail.toPouId);

            this.branchMappingTransferForm.patchValue({
                employeeDetailsFrom: fromEmployee,
                employeeDetailsTo: toEmployee
            });
        } else {
            employeeBranchDetails = employeeBranchDetails.fromJson(branchDetail.fromUserBranch);
            this.setBranchesToBeMapped(employeeBranchDetails, branchDetail);

            this.branchMappingDataSource = new MatTableDataSource([employeeBranchDetails]);
            this.setBranchMappingHeaders(employeeBranchDetails);

            const employee = this.config.employeeDetails.list.find(x => x.postOfficeUserId === branchDetail.fromPouId);
            this.branchMappingTransferForm.patchValue({
                employeeDetails: employee
            });
            if (branchDetail.branchesToBeMapped && branchDetail.branchesToBeMapped.length) {
                branchDetail.fromUserBranch.mappedBranches.push(...branchDetail.branchesToBeMapped);
            }
        }
    }

    private setBranchesToBeMapped(employeeBranchDetails: EmployeeBranchDetails, branchDetail: BranchDetails) {
        employeeBranchDetails.branchesToBeMapped = this.config.branch.branchMapping.list.filter(x =>
            branchDetail.branchesToBeMapped.includes(x.id)
        );
    }

    private setRequestType(branchDetail: BranchDetails) {
        this.branchMappingTransferForm.controls.branchAction.setValue(branchDetail.requestType);
        this.onBranchActionChange();
    }

    private setBranchRequestType() {
        this.edpBranchService.getBranchRequestType().subscribe((response: any) => {
            if (response && response.result && response.status === 200) {
                this.config.branchAction.list = response.result as any[];
            } else {
                this.toastr.error(response.message);
            }
        });
    }

    private setEmpAndPostForOffice() {
        this.edpBranchService.getEmpAndPostForOffice(this.config.userOfficeInfo.officeId).subscribe((response: any) => {
            if (response && response.result && response.status === 200) {
                this.config.employeeDetails.list = response.result as any[];
                this.subscribeActivatedRoute();
            } else {
                this.toastr.error(response.message);
            }
        });
    }

    private setLoggedOfficeBranches() {
        this.edpBranchService.getLoggedOfficeBranches().subscribe((response: any) => {
            if (response && response.result && response.status === 200) {
                this.config.branch.branchMapping.list = response.result as any[];
            } else {
                this.toastr.error(response.message);
            }
        });
    }
}
