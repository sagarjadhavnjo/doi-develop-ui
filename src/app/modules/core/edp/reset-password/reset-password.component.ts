import { Component, OnInit } from '@angular/core';
import { msgConst } from './../../../../shared/constants/edp/edp-msg.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EdpPasswordService } from '../services/edp-password.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    screenName: string;
    isGlobal: boolean = false;
    employeeForm: FormGroup;
    saveDraftEnable: boolean = false;
    errorMessage: any = {};
    displayedColumnsFooter = ['checked'];
    headerColumn: string[] = ['checked', 'userCode', 'userName', 'officeName', 'postName', 'postType'];
    dataSource = new MatTableDataSource([]);
    isRecordSelected: boolean = false;
    isSerch: boolean = false;

    constructor(private fb: FormBuilder,
        private toaster: ToastrService,
        public dialog: MatDialog,
        private edpPasswordService: EdpPasswordService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.errorMessage = msgConst.PASSWORD;
        this.employeeForm = this.fb.group({
            employeeId: ['', Validators.required],
        });
        const url = this.router.url;
        if (url === '/dashboard/edp/global-reset-password') {
            this.isGlobal = true;
            this.screenName = 'Global Reset Password';
        } else if (url === '/dashboard/edp/reset-password') {
            this.isGlobal = false;
            this.screenName = 'Reset Password';
        } else {
            this.router.navigate(['/dashboard'], { skipLocationChange: true });
        }
    }
    searchDetail(): void {
        const param = {
            id: Number(this.employeeForm.value.employeeId)
        };
        if (this.isGlobal) {
            if (this.employeeForm.valid) {
                this.edpPasswordService.getGlobalEmployyeDetails(param).subscribe(res => {
                    if (res && res['result'] && res['status'] === 200) {
                        const employeeObj = res['result'];
                        this.dataSource = new MatTableDataSource(employeeObj);
                        this.isSerch = true;
                        if (!employeeObj) {
                            this.dataSource = new MatTableDataSource([]);
                        }
                    } else {
                        this.toaster.error(res['message']);
                        this.isSerch = false;
                    }
                }, (err) => {
                    this.toaster.error(this.errorMessage['GLOBAL_EMPLOYEE_DETAILS']);
                    this.isSerch = false;
                });
            } else {
                _.each(this.employeeForm.controls, function (globalControl) {
                    if (globalControl.status === 'INVALID') {
                        globalControl.markAsTouched({ onlySelf: true });
                    }
                });
            }
        } else {
            if (this.employeeForm.valid) {
                this.edpPasswordService.getEmployyeDetails(param).subscribe(res => {
                    if (res && res['result'] && res['status'] === 200) {
                        const employeeObj = res['result'];
                        this.dataSource = new MatTableDataSource(employeeObj);
                        this.isSerch = true;
                        if (!employeeObj) {
                            this.dataSource = new MatTableDataSource([]);
                        }
                    } else {
                        this.toaster.error(res['message']);
                        this.isSerch = false;
                    }
                }, (err) => {
                    this.toaster.error(this.errorMessage['EMPLOYEE_DETAIL']);
                });
            } else {
                _.each(this.employeeForm.controls, function (nonGlobalControl) {
                    if (nonGlobalControl.status === 'INVALID') {
                        nonGlobalControl.markAsTouched({ onlySelf: true });
                    }
                });
            }
        }
    }
    resetPassword() {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.RESET_PASSWORD
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                const data = this.dataSource.data;
                const param = {
                    fieldValue: data[0].userId
                };
                if (this.isGlobal) {
                    this.edpPasswordService.resetPassword(param).subscribe(res => {
                        if (res && res['result'] && res['status'] === 200) {
                            this.toaster.success(res['message']);
                            this.dataSource = new MatTableDataSource([]);
                            this.isSerch = false;
                            this.employeeForm.reset();
                            this.isRecordSelected = false;
                        } else {
                            this.toaster.error(res['message']);
                        }
                    }, (err) => {
                        this.toaster.error(this.errorMessage['RESET_PASSWORD']);
                    });
                } else {
                    this.edpPasswordService.globalResetPassword(param).subscribe(res => {
                        if (res && res['result'] && res['status'] === 200) {
                            this.toaster.success(res['message']);
                            this.dataSource = new MatTableDataSource([]);
                            this.isSerch = false;
                            this.employeeForm.reset();
                            this.isRecordSelected = false;
                        } else {
                            this.toaster.error(res['message']);
                        }
                    }, (err) => {
                        this.toaster.error(this.errorMessage['GLOBAL_RESET_PASSWORD']);
                    });
                }
            }
        });
    }
    goToDashboard() {
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }
    checkboxValueChange() {
        this.isRecordSelected = false;
        this.dataSource.data.forEach(element => {
            if (element['checked']) {
                this.isRecordSelected = true;
            }
        });
    }

    resetForm(employeesForms: NgForm) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                employeesForms.resetForm();
                this.isSerch = false;
            }
        });
    }
}


