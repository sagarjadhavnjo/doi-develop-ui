import { PASSWORD_APIS } from './../index';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PasswordService {

    constructor(
        private http: HttpClient
    ) { }

    changePassword(params) {
        return this.http.post(`${environment.baseUrl}${PASSWORD_APIS.CHANGE_PASSWORD}`, params);
    }

    forgotPassword(params) {
        return this.http.post(`${environment.baseUrl}${PASSWORD_APIS.FORGOT_PASSWORD}`, params);
    }

    confirmOTP(params) {
        return this.http.post(`${environment.baseUrl}${PASSWORD_APIS.CONFIRM_TOKEN}`, params);
    }

    resetForgotPassword(params) {
        return this.http.post(`${environment.baseUrl}${PASSWORD_APIS.RESET_FORGOT_PASSWORD}`, params);
    }

    getNewCaptcha() {
        return this.http.get(`${environment.baseUrl}${PASSWORD_APIS.GET_NEW_CAPTCHA}`);
    }
}
