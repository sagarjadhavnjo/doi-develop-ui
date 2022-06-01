import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';

@Injectable({
    providedIn: 'root'
})
export class FixToRegularListService {

    headers = new HttpHeaders({
        'Content-Type': 'application/json ',
    });

    constructor(
        private httpClient: HttpClient
    ) { }

    getDesignation() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.FIX_TO_REGULAR.DESIGNATION}`, '',
            { headers: this.headers });
    }

    getStatus(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.FIX_TO_REGULAR.STATUS}`, param);
    }
    getAllOffice() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.SEARCH_EMPLOYEE.LOOKUP}`, '',
            { headers: this.headers });
    }

    // getfixToRegularList(params) {
    //     // tslint:disable-next-line: max-line-length
    // tslint:disable-next-line:max-line-length
    //     return this.httpClient.post(`${environment.baseUrl}${APIConst.FIX_TO_REGULAR.LIST.LIST_DATA}`, params, { headers: this.headers });
    // }

    deleteRecord(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.FIX_TO_REGULAR.LIST.DELETE}`, params);
    }

    getfixToRegularList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.FIX_TO_REGULAR.LIST.LIST_DATA}`, params
        );
    }


}
