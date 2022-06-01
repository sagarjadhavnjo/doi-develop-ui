import { APIConst } from './../../../../shared/constants/edp/edp-api.constants';
import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EdpObjectClassService {
    constructor(private httpClient: HttpClient) { }

    getObjectClassDetails() {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.OBJECT_CLASS_MAPPING_APIS.OBJECT_CLASS_MAPPING}`, '');
    }

    getSelectedObjectClass(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.OBJECT_CLASS_MAPPING_APIS.GET_SELECTED_CLASS}`, param);
    }

    saveObjectClassDetails(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.OBJECT_CLASS_MAPPING_APIS.SAVE_OBJECT_CLASS_MAPPING}`, param);
    }
}
