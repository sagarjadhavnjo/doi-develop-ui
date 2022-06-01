import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';

@Injectable({
    providedIn: 'root'
})
export class BranchService {
    constructor(private httpClient: HttpClient) {}

    // Get branch data into dropdown.
    getBranchDataDetails() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.BRANCH.BRANCH_CREATION.GET_BRANCH_DATA}`, {});
    }

    // Save data of branch creation menu using this service.
    saveBranchData(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.BRANCH.BRANCH_CREATION.SAVE_BRANCH_DATA}`, param);
    }

    // branch creation list data
    getBranchCreationList(param) {
        // tslint:disable-next-line: max-line-length
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_CREATION.BRANCH_CREATION_LIST}`,
            param
        );
    }

    // delete branch creation list data.
    deleteBranchCreationData(param) {
        // tslint:disable-next-line: max-line-length
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_CREATION.DELETE_BRANCH_CREATION_LIST}`,
            param
        );
    }
}
