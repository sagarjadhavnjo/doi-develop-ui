import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RIGHT_MAPPING } from '../';

@Injectable({
    providedIn: 'root'
})
export class RightsMappingService {

    constructor(private httpClient: HttpClient) { }

    getStatusList(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.STATUS_LIST}`, params);
    }
    getWorkflowList(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.WORKFLOW_LIST}`, params);
    }
    getWorkflowListNonDat (params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.WORKFLOW_LIST_NONDAT}`, params);
    }
    getDistricts() {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.DISTRICT_LIST}`, {});
    }
    getUserMappedRights(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.USER_RIGHTS_MAPPED}`, params);
    }
    getApprovedUserMappedRights(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.USER_RIGHTS_MAPPED_APPROVED}`, params);
    }
    getEditViewApprovedRight(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.USER_RIGHTS_EDITVIEW_APPROVED}`, params);
    }
    getEditModuleSubModule(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.USER_RIGHTS_EDIT_MODULESSUMODULES}`, params);
    }
    // loadModuleList() {
    //     return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.MODULE_LIST}`, {});
    // }
    loadSubModuleListByModuleId(param) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.SUB_MODULE_LIST_BY_MODULE_ID}`, param);
    }
    loadMenuListBySubModuleId(param) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.MENU_LIST_BY_SUB_MODULE_ID}`, param);
    }
    loadMenuListByModuleId(param) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.MENU_LIST_BY_MODULE_ID}`, param);
    }
    loadModuleListNonDat(param) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.MODULE_LIST_NONDAT}`, param);
    }
    getApprovedUserMappedRightsNonDat(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            RIGHT_MAPPING.USER_RIGHTS_MAPPED_APPROVED_NONDAT}`, params);
    }
    loadSubModuleListByModuleIdNonDat(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${RIGHT_MAPPING.SUB_MODULE_LIST_BY_MODULE_ID_NONDAT}`, param
        );
    }
    loadMenuListBySubModuleIdNonDat(param) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.MENU_LIST_BY_SUB_MODULE_ID_NONDAT}`, param);
    }
    getOfficeDetailByDistrict() {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.OFFICE_DETAIL_BY_DISTRICT}`, '');
    }
    getUserPostList(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.USER_POST_LIST}`, params);
    }
    getSearchValue(url, params) {
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }
    // for data table
    getUserRightsList(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.SEARCH.ALL}`, params);
    }
    getPermissionsByMenu(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.PERMISSIONS_BY_MENU}`, params);
    }
    saveRights(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.SAVE_RIGHTS}`, params);
    }
    getTransactionDetail(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.TRANSACTION_RIGHTS}`, params);
    }
    submitRights(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.SUBMIT_RIGHTS}`, params);
    }
    deleteRights(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.DELETE_RIGHTS}`, params);
    }
    deleteTransaction(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.DELETE_TRANSACTION}`, params);
    }
    getAttachmentList(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.ATTECHMENT.GET_ALL}`, params);
    }
    getAttachmentMaster(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.ATTECHMENT.GET_MASTER}`, params);
    }
    saveAttachment(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.ATTECHMENT.ADD}`, params);
    }
    deleteAttachmentByAttachID(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.ATTECHMENT.DELETE}`, params);
    }
    downloadAttachmentByAttachID(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${RIGHT_MAPPING.ATTECHMENT.DOWNLOAD_FILE}`,
            { id: params.id },
            { responseType: 'blob' as 'json' }
        );
    }
    getEmpByOffId(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.GETEMPBYOFFID}`, params);
    }
    getAprvdUsrRightsByMenuOffcId(params) {
        return this.httpClient.post(`${environment.baseUrl}${RIGHT_MAPPING.USER_RIGHTS_MAPPED_BY_MENU_APPROVED}`,
            params);
    }
    loadAttachmentList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${RIGHT_MAPPING.ATTECHMENT.GET_ALL}`,
            params
        );
    }
    deleteAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${RIGHT_MAPPING.ATTECHMENT.DELETE}`,
            params
        );
    }
    uploadAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${RIGHT_MAPPING.ATTECHMENT.ADD}`,
            params
        );
    }
    saveUserData(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${RIGHT_MAPPING.SAVE_USER_RIGHTS}`,
            param
        );
    }
    deleteUserRights(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${RIGHT_MAPPING.DELETE_SAVED_USER_RIGHTS_RECORDS}`,
            param
        );
    }
    // Need to update url
    getHeaderDetails(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${RIGHT_MAPPING.WF_COMMON_HEADER}`,
            params
        );
    }

    checkForWorkFlow(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${RIGHT_MAPPING.WF_CHECK_FOR_WORKFLOW}`,
            params
        );
    }

    getListingStatus(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${RIGHT_MAPPING.SEARCH_STATUS}`,
            params
        );
    }
}


