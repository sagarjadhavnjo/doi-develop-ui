import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGES } from './../index';
import { Router } from '@angular/router';
import { PasswordService } from './../services/password.service';
import { StorageService } from './../../services/storage.service';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { msgConst } from '../../constants/edp/edp-msg.constants';
@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
    @Input() withoutOldPass: boolean = false;
    @Input() isFromForgot: boolean = false;
    @Input() userToken: string;
    passwordCriteria = false;
    passwordMatch = false;
    hide = true;
    passwordForm: FormGroup;
    capsCheck = false;
    lowerCheck = false;
    numberCheck = false;
    specialCharCheck = false;
    lengthCheck = false;
    userInfo;
    passwordChangeError: string = '';
    showCapsOn: boolean = false;
    showCloseButton: boolean = true;

    showOTPConfirmation = false;
    showResentOTP = false;
    otpConfirmationForm: FormGroup;
    otpMaskingData;
    minuteTimer: string = '2';
    secondsTimer: string = '59';
    timerInterval;
    otpError: string;
    showChangePassword: boolean = true;
    errorMessages = ERROR_MESSAGES;
    errorMessage = {};
    @HostListener('document:keyup', ['$event'])
    onKeyup(event: KeyboardEvent) {
        const capsOn = event.getModifierState && event.getModifierState('CapsLock');
        if (capsOn) {
            this.showCapsOn = true;
        } else {
            this.showCapsOn = false;
        }
    }
    constructor(
        private fb: FormBuilder,
        private stoageService: StorageService,
        private passwordService: PasswordService,
        private router: Router,
        private toastrService: ToastrService,
        private dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.errorMessage = msgConst.CONFIRMATION_DIALOG;
        this.userInfo = this.stoageService.get('currentUser');
        if (this.userInfo.isFirstLogin || this.userInfo.isResetPwd) {
            this.showCloseButton = false;
            this.showOTPConfirmation = true;
            this.withoutOldPass = true;
            this.isFromForgot = true;
            this.showChangePassword = false;
            this.createOTPConfirmationForm();
            this.onUserCodeSubmit();
        }
        this.createForm();
    }

    createForm() {
        const self = this;
        if (this.withoutOldPass) {
            this.passwordForm = this.fb.group({
                newPassword: ['', [Validators.required, Validators.maxLength(16)]],
                confirmPassword: ['', [Validators.required, Validators.maxLength(16)]]
            });
        } else {
            this.passwordForm = this.fb.group({
                currentPassword: ['', [Validators.required, Validators.maxLength(16)]],
                newPassword: ['', [Validators.required, Validators.maxLength(16)]],
                confirmPassword: ['', [Validators.required, Validators.maxLength(16)]]
            });
        }
        this.passwordForm.valueChanges.subscribe(res => {
            self.passwordChangeError = '';
        });
    }

    passwordCriteriaCheck() {
        const newPass = this.passwordForm.value.newPassword,
            capsReg: RegExp = /[A-Z]/,
            lowerReg: RegExp = /[a-z]/,
            numberReg: RegExp = /[0-9]/,
            specialReg: RegExp = /[!@#$%&*^?()=+<_:;\"\'/\\/[\]/~`,.>|{}-]/;

        if (newPass) {
            if (capsReg.test(newPass)) {
                this.capsCheck = true;
            } else {
                this.capsCheck = false;
            }
            if (lowerReg.test(newPass)) {
                this.lowerCheck = true;
            } else {
                this.lowerCheck = false;
            }
            if (numberReg.test(newPass)) {
                this.numberCheck = true;
            } else {
                this.numberCheck = false;
            }
            if (specialReg.test(newPass)) {
                this.specialCharCheck = true;
            } else {
                this.specialCharCheck = false;
            }
            if (newPass.length >= 8) {
                this.lengthCheck = true;
            } else {
                this.lengthCheck = false;
            }
        } else {
            this.lowerCheck = false;
            this.lengthCheck = false;
            this.capsCheck = false;
            this.specialCharCheck = false;
            this.numberCheck = false;
        }
        return this.lowerCheck && this.lengthCheck && this.capsCheck && this.specialCharCheck && this.numberCheck;
    }

    onSubmit() {
        const self = this,
            isPassSame = self.passwordForm.value.confirmPassword === self.passwordForm.value.newPassword;
        if (!self.passwordForm.invalid && self.passwordCriteriaCheck() && isPassSame) {
            self.passwordCriteria = false;
            self.passwordMatch = false;
            const funcCall = !self.isFromForgot ? 'changePassword' : 'resetForgotPassword';
            self.passwordService[funcCall]({
                'confirmPassword': self.passwordForm.value.confirmPassword,
                'currentPassword': self.passwordForm.value.currentPassword,
                'newPassword': self.passwordForm.value.newPassword,
                'userId': self.userInfo.userId || self.userToken,
            }).subscribe(res => {
                if (res['status'] === 200) {
                    self.toastrService.success('Password changed successfully');
                    const userInfo = _.cloneDeep(self.userInfo);
                    if (self.userInfo.isFirstLogin) {
                        userInfo.isFirstLogin = false;
                    }
                    if (self.userInfo.isResetPwd) {
                        userInfo.isResetPwd = false;
                    }
                    self.stoageService.set('currentUser', userInfo);
                    // self.router.navigate(['/dashboard'], { skipLocationChange: true });
                    window.location.reload();
                } else {
                    self.passwordChangeError = res['message'] ? res['message'] : res['error_description'];
                }
            }, err => {
                self.passwordChangeError = err['message'] ? err['message'] : err['error_description'];
            });
        } else {
            _.each(self.passwordForm.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
            if (!self.passwordCriteriaCheck() && !self.passwordForm.invalid &&
            !self.passwordForm.controls.currentPassword.value) {
                self.passwordCriteria = true;
            } else {
                self.passwordCriteria = false;
            }
            if (!isPassSame && !self.passwordForm.invalid) {
                self.passwordMatch = true;
            } else {
                self.passwordMatch = false;
            }
            self.passwordChangeError = '';
        }
    }

    onReset(passwordForms: NgForm) {
        this.passwordCriteria = false;
        this.passwordMatch = false;
        const proceedMessage = this.errorMessage['CONFIRMATION'];
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: proceedMessage
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                this.passwordCriteriaCheck();
                passwordForms.resetForm();
                this.lowerCheck = false;
                this.lengthCheck = false;
                this.capsCheck = false;
                this.specialCharCheck = false;
                this.numberCheck = false;
            }
        });
    }

    createOTPConfirmationForm() {
        const self = this;
        this.otpConfirmationForm = this.fb.group({
            otp: ['', Validators.required]
        });
        this.otpConfirmationForm.valueChanges.subscribe(res => {
            self.otpError = '';
        });
    }

    onUserCodeSubmit() {
        const self = this;
        if (this.userInfo.usercode) {
            this.passwordService.forgotPassword({
                'userCode': this.userInfo.usercode
            }).subscribe(res => {
                // this.router.navigate(['/dashboard'], { skipLocationChange: true });
                if (res['status'] === 200) {
                    self.showTimer();
                    self.showOTPConfirmation = true;
                    self.otpMaskingData = res['result'];
                    self.toastrService.success('OTP sent successfully');
                } else {
                    self.toastrService.error(res['message']);
                }
            }, err => {
                self.toastrService.error(err['message']);
            });
        } else {
            // _.each(this.forgotPasswordForm.controls, function (control) {
            //     if (control.status === 'INVALID') {
            //         control.markAsTouched({ onlySelf: true });
            //     }
            // });
        }
    }

    showTimer() {
        const self = this;
        self.timerInterval = setInterval(function () {
            self.secondsTimer = '' + (Number(self.secondsTimer) - 1);
            if (self.secondsTimer === '0' && self.minuteTimer !== '0') {
                self.secondsTimer = '59';
                self.minuteTimer = '' + (Number(self.minuteTimer) - 1);
            }
            if (self.minuteTimer === '0' && self.secondsTimer === '0') {
                self.showResentOTP = true;
                clearInterval(self.timerInterval);
            }
            if (Number(self.secondsTimer) < 10) {
                self.secondsTimer = '0' + self.secondsTimer;
            }
        }, 1000); // 3 mins
    }

    onResendOTP(form: NgForm) {
        const self = this;
        self.showResentOTP = false;
        self.secondsTimer = '59';
        self.minuteTimer = '2';
        self.otpError = '';
        form.resetForm();
        self.onUserCodeSubmit();
    }

    onOTPSubmit() {
        const self = this;
        if (!this.otpConfirmationForm.invalid) {
            self.otpError = '';
            this.passwordService.confirmOTP({
                'tokenNo': self.otpConfirmationForm.value.otp,
                'tokenHash': self.otpMaskingData.tokenHash
            }).subscribe(res => {
                // self.router.navigate(['/dashboard'], { skipLocationChange: true });
                if (res['status'] === 200) {
                    // self.forgotPasswordForm.disable();
                    // self.createOTPConfirmationForm();
                    clearInterval(self.timerInterval);
                    self.showOTPConfirmation = false;
                    self.showChangePassword = true;
                } else {
                    self.otpError = res['message'] ? res['message'] : res['error_description'];
                }
            }, err => {
                self.otpError = err['message'] ? err['message'] : err['error_description'];
            });
        } else {
            _.each(self.otpConfirmationForm.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
        }
    }
}
