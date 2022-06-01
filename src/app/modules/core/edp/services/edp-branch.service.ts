import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';

@Injectable({
    providedIn: 'root'
})
export class EdpBranchService {
    constructor(private httpClient: HttpClient) {}

    // Branch Mapping And Transfer Starts
    getBranchRequestType() {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.GET_BRANCH_REQUEST_TYPE}`,
            {}
        );
    }

    getEmpAndPostForOffice(officeId: number) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.GET_EMP_AND_POST_FOR_OFFICE}`,
            { officeId: officeId }
        );
    }

    getEmpBranches(postOfficeUserId: number) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.GET_EMP_BRANCHES}`,
            { postOfficeUserId: postOfficeUserId }
        );
    }

    getLoggedOfficeBranches() {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.GET_LOGGED_OFFICE_BRANCHES}`,
            null
        );
    }

    saveBranchMappingOrTransfer(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.SAVE_BRANCH_MAPPING}`,
            params
        );
    }

    getSearchFilters() {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.GET_SEARCH_FILTERS}`,
            null
        );
    }

    getFilteredMappedBranches(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.GET_FILTERED_MAPPED_BRANCHES}`,
            params
        );
    }

    getBranchDetailsByHdrId(tedpBrHdrId: number) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.GET_MAPPED_BRANCH_EDIT_VIEW}`,
            { id: tedpBrHdrId }
        );
    }

    deleteMappedBranch(tedpBrHdrId: number) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.DELETE_MAPPED_BRANCH_LIST}`,
            { id: tedpBrHdrId }
        );
    }

    checkForBrMapRequest(postOfficeUserId: number) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.CHECK_FOR_BR_MAP_REQUEST}`,
            { postOfficeUserId: postOfficeUserId }
        );
    }

    checkUserAccess(fromPouId: number, toPouId: number) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.BRANCH.BRANCH_MAPPING_TRANSFER.CHECK_USER_ACCESS}`,
            { fromPouId: fromPouId, toPouId: toPouId }
        );
    }
}
