import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';

@Injectable({
    providedIn: 'root'
})
export class IncrementListService {

    constructor(private httpClient: HttpClient) { }

    getLookupDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.LIST.INCREMENT_GET_LOOKUP_DATA}`,
            params
        );
    }

    getWorkFlowStatus(param) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.LIST.WORKFLOW_STATUS}`, param);
    }

    getIncrementList(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.LIST.INCREMENT_LIST_DATA}`,
            params
        );
    }
    deleteAddDesignation(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.LIST.DELETE}`,
            params
        );
    }
    deleteRecord(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.LIST.DELETE}`, params);
    }
}
