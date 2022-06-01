import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { StorageService } from 'src/app/shared/services/storage.service';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { BranchService } from '../services/branch.service';
import { BranchType } from '../model/branch.model';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EdpDataConst } from 'src/app/shared/constants/edp/edp-data.constants';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-branch-creation-detail',
    templateUrl: './branch-creation-detail.component.html',
    styleUrls: ['./branch-creation-detail.component.css']
})
export class BranchCreationDetailComponent implements OnInit {

    branchCreationForm: FormGroup;
    subscribeParams: Subscription;
    officeId: number;
    tedpBrHdrId: number;
    branchId: number;
    trnNo: string;
    trnDate: string;
    action: string;
    branchData;

    saveDraftEnable: boolean = false;
    submitEnable: boolean = false;
    isSaveDraftDisabled: boolean = false;

    errorMessages = msgConst;
    branchTypeList: BranchType[] = [];
    branchTypeCtrl: FormControl = new FormControl();

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        private storageService: StorageService,
        private branchService: BranchService,
    ) {}

    ngOnInit() {
        this.branchForm();
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action === 'edit' || this.action === 'view') {
                this.branchData = resRoute;
                this.loadEditBranchData(resRoute);
            } else {
                this.getOfficeDeatils();
                this.getBranchTypeDetails();
            }
        });
        this.branchCreationForm.valueChanges.subscribe(() => {
            this.saveDraftEnable = true;
            this.submitEnable = true;
        });
    }
    // Define form variable and also define field validation.
    branchForm() {
        this.branchCreationForm = this.fb.group({
            district: [''],
            ddoNo: [''],
            cardexNo: [''],
            ddoOffice: [''],
            branchName: ['', Validators.required],
            branchType: ['', Validators.required]
        });
    }
    // edit load data of branch creation.
    loadEditBranchData(element) {
        if (element) {
            if (element.district && element.ddoNo && element.cardexNo && element.officeName) {
                this.branchCreationForm.patchValue({
                    district: element.district,
                    ddoNo: element.ddoNo,
                    cardexNo: element.cardexNo,
                    ddoOffice: element.officeName,
                    branchName: element.branchName,
                    branchType: Number(element.branchTypeId)
                });
            } else {
                this.getOfficeDeatils();
                this.branchCreationForm.patchValue({
                    branchName: element.branchName,
                    branchType: element.branchType
                });
            }
            this.trnNo = element.trnNo;
            if (element.referenceDate) {
                this.trnDate = element.referenceDate;
            } else {
                this.trnDate = element.createdDate;
            }
            this.tedpBrHdrId = Number(element.tedpBrHdrId);
            this.branchId = Number(element.branchId);
            this.officeId = Number(element.officeId);
            if (this.branchId) {
                if (Number(element.branchTypeId) === EdpDataConst.BRANCH_TYPE_ID) {
                    this.branchCreationForm.controls['branchType'].disable();
                }
            }
            if (element.transactionStatus) {
                if (element.transactionStatus.toLowerCase() === EdpDataConst.BRANCH_STATUS.toLowerCase()) {
                    this.isSaveDraftDisabled = true;
                } else {
                    this.isSaveDraftDisabled = false;
                    this.saveDraftEnable = true;
                }
            }
            this.submitEnable = true;
            this.getBranchTypeDetails();
            if (this.action === 'view') {
                this.isSaveDraftDisabled = true;
                this.branchCreationForm.disable();
            }
        }
    }
    // Get Office details
    getOfficeDeatils() {
        const userOffice = this.storageService.get('userOffice');
        this.branchCreationForm.patchValue({
            district: userOffice.districtName,
            ddoNo: userOffice.ddoNo,
            cardexNo: userOffice.cardexno,
            ddoOffice: userOffice.officeName
        });
        this.officeId = userOffice.officeId;
    }

    // Get Branch Type Data
    getBranchTypeDetails() {
        this.branchService.getBranchDataDetails().subscribe((res: any) => {
            if (res && res.result && res.status === 200) {
                this.branchTypeList = res.result;
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    // save and submit of branch creation calling of function define
    branch(btnName) {
        const param = this.addBranchDataToBeSend();
        if (btnName === 'save') {
            if (param) {
                param['formAction'] = EdpDataConst.STATUS_DRAFT;
                this.saveBranchCreation(param);
            }
        } else if (btnName === 'submit') {
            param['formAction'] = EdpDataConst.STATUS_SUBMITTED;
            this.submitBranchCreation(param);
        }
    }

    // all the paramerter set for branch creation.
    addBranchDataToBeSend() {
        const param =  {
            branchName : this.branchCreationForm.controls.branchName.value,
            branchType : this.branchCreationForm.controls.branchType.value,
            menuCode : EdpDataConst.BRANCH_MENU_CODE,
            officeId : this.officeId,
            requestType : EdpDataConst.BRANCH_REQUEST_TYPE
        };
        if (this.tedpBrHdrId) {
            param['tedpBrHdrId'] = this.tedpBrHdrId;
        }
        if (this.branchId) {
            param['branchId'] = this.branchId;
        }
        return param;
    }

    // save as draft all the branch creation records.
    saveBranchCreation(param) {
        if (this.branchCreationForm.valid) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.branchService.saveBranchData(param).subscribe((res: any) => {
                        if (res && res.result && res.status === 200) {
                            this.toastr.success(res['message']);
                            this.saveDraftEnable = false;
                            this.action = 'edit';
                            this.branchData = res.result;
                            if (res.result.trnNo && res.result.createdDate) {
                                this.trnNo =  res.result.trnNo;
                                this.trnDate = res.result.createdDate;
                            }
                            this.tedpBrHdrId = res.result.tedpBrHdrId;
                            this.branchId = res.result.branchId;
                            this.officeId = res.result.officeId;
                            this.branchCreationForm.markAsPristine();
                        } else {
                            this.toastr.error(res['message']);
                        }
                    }, (err) => {
                        this.toastr.error(err);
                    });
                }
            });
        } else {
            this.getBranchFormError();
        }
    }

    // submit or approved all the branch creation records.
    submitBranchCreation(param) {
        if (this.branchCreationForm.valid) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.branchService.saveBranchData(param).subscribe((res: any) => {
                        if (res && res.result && res.status === 200) {
                            this.toastr.success(res['message']);
                            this.goToListing();
                        } else {
                            this.toastr.error(res['message']);
                        }
                    }, (err) => {
                        this.toastr.error(err);
                    });
                }
            });
        } else {
            this.getBranchFormError();
        }
    }

    // required field of branch creation check form using this function.
    getBranchFormError() {
        _.each(this.branchCreationForm.controls, function (control) {
            if (control.status === 'INVALID') {
                control.markAsTouched({ onlySelf: true });
            }
        });
    }

    // reset form data of branch creation.
    resetForm(branchCreationForms: NgForm) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.action === 'edit') {
                    this.loadEditBranchData(this.branchData);
                } else {
                    branchCreationForms.resetForm();
                    this.saveDraftEnable = false;
                    this.submitEnable = false;
                    this.getOfficeDeatils();
                }
            }
        });
    }

    // go to listing page of branch creation list.
    goToListing() {
        this.router.navigate(
            ['/dashboard/edp/branch/branch-creation/list'],
            { skipLocationChange: true }
        );
    }

    // go to dashbord
    goToDashboard() {
        const proceedMessage = this.errorMessages.CONFIRMATION_DIALOG.CONFIRMATION;
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
}
