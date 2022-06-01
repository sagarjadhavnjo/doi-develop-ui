import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGES } from './../index';
import { Router } from '@angular/router';
import { PasswordService } from './../services/password.service';
import { StorageService } from './../../services/storage.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { msgConst } from '../../constants/edp/edp-msg.constants';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
    hide = true;
    showOTPConfirmation = false;
    showChangePassword = false;
    showResentOTP = false;
    forgotPasswordForm: FormGroup;
    otpConfirmationForm: FormGroup;
    userInfo;
    otpMaskingData;
    minuteTimer: string = '2';
    secondsTimer: string = '59';
    timerInterval;
    userCodeError: string;
    otpError: string;
    errorMessages = ERROR_MESSAGES;
    errorMessage = msgConst.PASSWORD;
    showCaptcha = true;
    imgsrc: string;
    captchaId:number;
    tempUserCode: string;

    captcha = {
        ans: null,
        length: null
    };

    constructor(
        private fb: FormBuilder,
        private stoageService: StorageService,
        private passwordService: PasswordService,
        private router: Router,
        private toastrService: ToastrService,
    ) { }

    ngOnInit() {
        this.userInfo = this.stoageService.get('currentUser');
        this.createforgotPasswordForm();
    }

    createforgotPasswordForm() {
        const self = this;
        this.forgotPasswordForm = this.fb.group({
            userCode: ['', [Validators.required, Validators.minLength, Validators.maxLength]],
            entrcaptcha: [null, Validators.required]
        });
        this.forgotPasswordForm.valueChanges.subscribe(res => {
            self.userCodeError = '';
        });
        setTimeout(() => {
            this.loadNewCaptcha();
        }, 50);
    }

    loadNewCaptcha() {
        this.passwordService.getNewCaptcha().subscribe(res => {
            // this.router.navigate(['/dashboard'], { skipLocationChange: true });
            if (res['status'] === 201) {
                this.captchaId = res['result']['captchaId'];
                this.imgsrc = 'data:image/jpg;base64,' + res['result']['captchaImg'];
                this.captcha.length=6;
            } 
        }, err => {
            console.log("error");
        });
    }

    loadCaptcha() {
        const captchaFirst = Math.floor(Math.random() * (99 - 10 + 1) + 10);
        const captchaSecond = Math.floor(Math.random() * (9 - 1 + 1) + 1);
        this.captcha.ans = captchaFirst + captchaSecond;

        this.captcha.length = this.captcha.ans.toString().length;
        const c: any = document.getElementById('captchaCanvasId');
        const ctx = c.getContext('2d');
        ctx.font = '17px Roboto,"Helvetica Neue",sans-serif';

        ctx.clearRect(0, 0, 1000, 1000);
        ctx.fillText(captchaFirst + ' + ' + captchaSecond, 25, 30);
    }

    createOTPConfirmationForm() {
        const self = this;
        this.otpConfirmationForm = this.fb.group({
            otp: ['', [Validators.required, Validators.minLength]]
        });
        this.forgotPasswordForm.valueChanges.subscribe(res => {
            self.otpError = '';
        });
    }

    onUserCodeSubmit() {
        const self = this;
        if (!this.forgotPasswordForm.invalid) {
            self.userCodeError = '';
            this.passwordService.forgotPassword({
                'userCode': this.forgotPasswordForm.value.userCode,
                'captchaId': this.captchaId,
                'captcha': this.forgotPasswordForm.value.entrcaptcha
            }).subscribe(res => {
                // this.router.navigate(['/dashboard'], { skipLocationChange: true });
                if (res['status'] === 200) {
                    this.showCaptcha = false;
                    self.forgotPasswordForm.disable();
                    self.createOTPConfirmationForm();
                    self.showTimer();
                    self.showOTPConfirmation = true;
                    self.otpMaskingData = res['result'];
                    self.toastrService.success('OTP sent successfully');
                } else {
                    this.showCaptcha = true;
                    this.loadNewCaptcha();
                    this.forgotPasswordForm.controls['entrcaptcha'].setValue(null);
                    self.userCodeError = res['message'] ? res['message'] : res['error_description'];
                }
            }, err => {
                self.userCodeError = err;
                this.showCaptcha = true;
                this.loadNewCaptcha();
            });
        } else {
            _.each(this.forgotPasswordForm.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
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
        self.showOTPConfirmation = false;
        this.tempUserCode = this.forgotPasswordForm.value.userCode;
        this.createforgotPasswordForm();
        this.showCaptcha = true;
        this.forgotPasswordForm.controls['userCode'].setValue(this.tempUserCode);
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
