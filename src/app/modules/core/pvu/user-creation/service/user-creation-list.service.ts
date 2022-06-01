import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';

@Injectable({
    providedIn: 'root'
})
export class UserCreationListService {

    headers = new HttpHeaders({
        'Content-Type': 'application/json ',
    });

    constructor(
        private httpClient: HttpClient
    ) { }

    getListData(params) {
        // tslint:disable-next-line: max-line-length
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.LIST.GET_LIST}`, params, 
        { headers: this.headers });
    }

    deleteRecord(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.LIST.DELETE}`, params);
    }

    getDesignation() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.LIST.DESIGNATION}`, '',
        { headers: this.headers });
    }

    getEmpPayType(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.USER_CREATION.LIST.EMP_PAY_TYPE}`, param);
    }
    getAllOffice() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.LIST.OFFICE_NAME_LIST}`, '',
        { headers: this.headers });
    }
}
