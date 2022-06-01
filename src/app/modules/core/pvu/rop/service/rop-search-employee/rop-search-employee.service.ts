import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class RopSearchEmployeeService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json ',
    });

    constructor(private httpClient: HttpClient) { }

    getEmployee(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.EMP_SEARCH.ROP_EMP_LIST}`, params);
    }

    getLookUp() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.SEARCH_EMPLOYEE.LOOKUP}`, '',
            { headers: this.headers });
    }

}
