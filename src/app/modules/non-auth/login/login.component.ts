import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit, Inject, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from 'src/app/models';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageService } from 'src/app/shared/services/storage.service';
import { common_message } from 'src/app/shared/constants/common/common-message.constants';
import { DataConst } from 'src/app/shared/constants/common/common-data.constants';
import { environment } from 'src/environments/environment';
import { msgConst } from 'src/app/shared/constants/edp/edp-msg.constants';
import { TransactionMessageDialogComponent } from './transaction-message-dialog/transaction-message-dialog.component';
import { SignInInfoComponent } from './sign-in-info/sign-in-info.component';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    toggleSection = false;
    isSubmitDisable: boolean = false;
    captcha1: number;
    captcha2: number;
    captchaAns: string;
    captchaLength: number;
    errorMessage: string = null;
    buildVersion = environment.buildVersion;
    releaseVersion = environment.releaseVersion;
    errorMessages = {};
    errorTimer: ReturnType<typeof setTimeout>;
    showCapsOn: boolean = false;
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
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private router: Router,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.errorMessages = msgConst.PASSWORD;
        this.loginForm = this.formBuilder.group({
            userName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
            captchaCode: ['', [Validators.required]],
        });
        this.loadCaptcha();
    }

    loadCaptcha() {
        this.captcha1 = Math.floor(Math.random() * (((99 - 10) + 1)) + 10);
        this.captcha2 = Math.floor(Math.random() * (((9 - 1) + 1)) + 1);
        this.captchaAns = (this.captcha1 + this.captcha2) + '';
        this.captchaLength = (this.captchaAns).toString().length;

        const c: any = document.getElementById('myCanvas');
        const ctx = c.getContext('2d');
        ctx.font = '17px Roboto,"Helvetica Neue",sans-serif';
        ctx.clearRect(0, 0, 1000, 1000);
        ctx.fillText(this.captcha1 + ' + ' + this.captcha2, 25, 30);
    }

    isToggle() {
        this.toggleSection = !this.toggleSection;
    }

    getFormControls() {
        return this.loginForm.controls;
    }

    onSubmit(e) {
        e.preventDefault();
        if (!this.loginForm.invalid && this.isSubmitDisable === false) {
            this.isSubmitDisable = true;
            this.captchaAns = this.captchaAns + '';
            // (this.loginForm.value.captchaCode) === '00' is for automation testing testing only
            if (!environment.captcha) {
                if ((this.loginForm.value.captchaCode) === this.captchaAns ||
                    (this.loginForm.value.captchaCode) === '00') {
                    this.loginService();
                } else {
                    this.toastr.error(common_message.INVALID_CAPTCHA);
                    this.loginForm.controls.captchaCode.setValue('');
                    this.isSubmitDisable = false;
                }
            } else if (environment.captcha) {
                if ((this.loginForm.value.captchaCode) === this.captchaAns) {
                    this.loginService();
                } else {
                    this.toastr.error(common_message.INVALID_CAPTCHA);
                    this.loginForm.controls.captchaCode.setValue('');
                    this.isSubmitDisable = false;
                }
            }
        }
    }

    loginService() {
        const self = this;
        const loginInfo: Login = this.loginForm.value;
        this.authService.login(loginInfo).subscribe((resolve) => {
            if (resolve.status && resolve.status !== 200) {
                console.log(resolve);
                self.errorMessage = (resolve.message === common_message.AUTH_FAIL) ?
                    common_message.INVALID_USER_PWD : resolve.message;
                this.loadCaptcha();
                this.loginForm.patchValue({
                    'captchaCode': null
                });
                if (self.errorTimer) {
                    clearTimeout(self.errorTimer);
                }
                self.errorTimer = setTimeout(() => {
                    self.errorMessage = null;
                }, 3000);
                this.isSubmitDisable = false;
                return;
            }
            self.errorMessage = null;
            clearTimeout(self.errorTimer);
            this.authService.setLocalStorage(resolve).then(data => {
                if(resolve.result && resolve.status === 200) {
                    if(resolve.result.signInMsgInfo){
                        this.openSignInInfoDialog(resolve.result.signInMsgInfo);
                    }
                  
                    this.commonService.createMouseMoveOrWheelObservable();
                    this.commonService.subscribeMouseMoveEvent();
                    this.commonService.refreshSessionTimer();
                }
                if (data.transactionInfo) {
                    this.openTransactionMessageDialog(data.transactionInfo.transactionMessage);
                }
                if (resolve['result'] && (resolve['result'].isFirstLogin || resolve['result'].isResetPwd)) {
                    self.router.navigate(['/password/change-password'], { skipLocationChange: true });
                } else {
                    self.router.navigate(['/dashboard'], { skipLocationChange: true });
                }
            }).catch(err => {
                throw err;
            });
            this.isSubmitDisable = false;
        }, (error) => {
            this.loadCaptcha();
            this.loginForm.patchValue({
                'captchaCode': null
            });
            self.errorMessage = error.message;
            if (self.errorTimer) {
                clearTimeout(self.errorTimer);
            }
            this.isSubmitDisable = false;
            self.errorTimer = setTimeout(() => {
                self.errorMessage = null;
            }, 3000);
            this.toastr.error('Unable to Login: ' + error);
            this.isSubmitDisable = false;
        });
    }

    onPaste(event) {
        event.preventDefault();
    }

    ngOnDestroy(): void {
        clearTimeout(this.errorTimer);
    }

    integerKeyPress(event: any) {
        const pattern = /^\d{0,2}?$/;
        const inputChar = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        // If the key is backspace, tab, left, right or delete
        const keystobepassedout = '$Backspace$Delete$Home$Tab$ArrowLeft$ArrowRight$ArrowUp$ArrowDown$End$';
        if (keystobepassedout.indexOf('$' + event.key + '$') !== -1) {
            return true;
        }
        if (event.target.value.length > 2) {
            event.preventDefault();
            return false;
        }

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
            return false;
        }
        return true;
    }

    private openSignInInfoDialog(signInMsgInfo: any) {
        let dialogRef = this.dialog.open(SignInInfoComponent, {
            width: '600px',
            data: { signInMsgInfo: signInMsgInfo },
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            dialogRef = null;
        });
    }

    private openTransactionMessageDialog(transactionMessage: string) {
        let dialogRef = this.dialog.open(TransactionMessageDialogComponent, {
            width: '600px',
            data: { transactionMessage: transactionMessage }
        });

        dialogRef.afterClosed().subscribe(result => {
            dialogRef = null;
        });
    }
}

@Component({
    selector: 'app-session-extend-confirmation',
    templateUrl: 'session.extend.confirmation.html',
})
// tslint:disable-next-line:component-class-suffix
export class SessionExtendConfirmationDialog implements OnInit {

    sessionExpiredCounter: number = 0;
    sessionCounterIntervel: any;
    @ViewChild(LoginComponent) LoginComponentRef: LoginComponent;

    constructor(
        public dialogRef: MatDialogRef<SessionExtendConfirmationDialog>,
        @Inject(MAT_DIALOG_DATA) public data,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private storageService: StorageService
    ) {
        this.data = data;
        dialogRef.disableClose = true;
    }

    /**
     * Start counter to 60 seoconds to show on popup with message.
    */
    ngOnInit() {
        this.sessionExpiredCounter = DataConst.SESSION_EXP_POPUP_TIME;
        this.sessionCounterIntervel = setInterval(() => {
            if (this.sessionExpiredCounter > 0) {
                this.sessionExpiredCounter = this.sessionExpiredCounter - 1;
            } else {
                clearInterval(this.sessionCounterIntervel);
                this.dialogRef.close('no');
            }
        }, 1000);
    }

    /**
     * Do Nothing close the dialog.
     * Clear the interval.
    */
    onCancel(): void {
        this.dialogRef.close('no');
        clearInterval(this.sessionCounterIntervel);
    }

    /**
     * Call refresh token api by passing refresh token as params.
     * Reset the local storage.
    */
    onSave(): void {
        this.authService.extendToken(this.data.refreshToken).subscribe((res) => {
            if (res && res['result'] && res['status'] && res['status'] === 200) {
                this.storageService.clear();
                this.authService.setLocalStorage(res);
                this.toastr.success(common_message.SESSION_EXTEND);
                clearInterval(this.sessionCounterIntervel);
                this.dialogRef.close('yes');
            } else {
                clearInterval(this.sessionCounterIntervel);
                this.toastr.error(common_message.ERR_SESSION_EXTEND);
                this.dialogRef.close('');
                this.authService.clearData();
            }
        }, (error) => {
            clearInterval(this.sessionCounterIntervel);
            this.toastr.error(common_message.ERR_SESSION_EXTEND);
            this.dialogRef.close('');
            this.authService.clearData();
        });
    }
}
