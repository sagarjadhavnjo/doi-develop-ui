import { APIConst } from './../../../../shared/constants/edp/edp-api.constants';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EdpPasswordService {

    constructor(private httpClient: HttpClient) { }

    getGlobalEmployyeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.PASSWORD_APIS.GLOBAL_EMPLOYEE_DETAILS}`, params);
    }

    getEmployyeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.PASSWORD_APIS.EMPLOYEE_DETAILS}`, params);
    }

    resetPassword(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.PASSWORD_APIS.RESET_PASSWORD}`, params);
    }

    globalResetPassword(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.PASSWORD_APIS.GLOBAL_RESET_PASSWORD}`, params);
    }

}
