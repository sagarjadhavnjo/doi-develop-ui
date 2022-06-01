import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';

@Injectable({
    providedIn: 'root'
})
export class AddDesignationService {

    constructor(private httpClient: HttpClient) { }
    // Add Designation API
    saveDesignationDetails(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${
                APIConst.DESIGNATION.ADD_DESIGNATION.SAVE_DESIGNATION}`,
            params
        );
    }
    uploadADDAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.ADD_DESIGNATION.UPLOAD_ATTACHMENT}`,
            params
        );
    }
    loadAttachmentDataList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.ADD_DESIGNATION.LOAD_ATTACHMENT_LIST}`,
            params
        );
    }
    deleteAddAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.ADD_DESIGNATION.DELETE_ATTACHMENT}`,
            params
        );
    }
    getAddDesignationList(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.ADD_DESIGNATION.ADD_DESIGNATION_LIST}`,
            params
        );
    }
    deleteAddDesignation(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.ADD_DESIGNATION.DELETE_ADD_DESIGNATION}`,
            params
        );
    }
    loadAddDesignationDeatail(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.ADD_DESIGNATION.ADD_DESIGNATION_UPDATE_GET_DETAILS}`,
            params
        );
    }
    loadDistrictDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DISTRICT}`,
            params
        );
    }
    loadSearchDropDownValue() {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.ADD_DESIGNATION.LOAD_DROPDOWN_LIST_VALUE}`,
            {}
        );
    }


    // Update Designation API
    getUpdateDesignationDetails(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${
                APIConst.DESIGNATION.UPDATE_DESIGNATION.GET_UPDATE_DESIGNATION}`,
            params
        );
    }
    saveUpdateDesignationDetails(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${
                APIConst.DESIGNATION.UPDATE_DESIGNATION.SAVE_UPDATE_DESIGNATION}`,
            params
        );
    }
    loadAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.MANDATORY_ATTACHMENT_FOR_NONDAT}`,
            params
        );
    }
    uploadAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.UPDATE_DESIGNATION.UPLOAD_ATTACHMENT}`,
            params
        );
    }
    deleteAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.UPDATE_DESIGNATION.DELETE_ATTACHMENT}`,
            params
        );
    }
    loadListAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.UPDATE_DESIGNATION.LOAD_UPDATE_ATTACHMENT_LIST}`,
            params
        );
    }
    getDesignationList(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.UPDATE_DESIGNATION.UPDATE_DESIGNATION_LIST}`,
            params
        );
    }
    deleteUpdateDesignation(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DESIGNATION.UPDATE_DESIGNATION.DELETE_UPDATE_DESIGNATION}`,
            params
        );
    }
    loadUpdateDesignationDeatail(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.UPDATE_DESIGNATION.UPDATE_DESIGNATION_GET_DETAILS}`,
            params
        );
    }
    updateDesignationUpdate(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.UPDATE_DESIGNATION.UPDATE_DESIGNATION_UPDATE}`,
            params
        );
    }
    updateDesignationGetCount(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.UPDATE_DESIGNATION.UPDATE_DESIGNATION_GET_COUNT}`,
            params
        );
    }

    // Workflow APi
    checkWorkFlow() {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.WORKFLOW.CHECK_WF_REQUIRED}`,
            {}
        );
    }

    // Workflow API for Update Designation
    checkWorkFlowUpdate() {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.WORKFLOW.CHECK_WF_UPDATE}`,
            {}
        );
    }
    getHeaderDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.WORKFLOW.HEADER_DETAILS}`,
            params
        );
    }
    getDistrictDetails() {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.UPDATE_DESIGNATION.UPDATE_DESIGNATION_GET_LIST}`,
            {}
        );
    }

    getEmployeeActivePostList(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.UPDATE_DESIGNATION.GET_EMPLOYEE_ACTIVE_POST_LIST}`,
            params
        );
    }
    getLoadExistsRecord(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.DESIGNATION.UPDATE_DESIGNATION.ALREADY_EXISTS_RECORD}`,
            params
        );
    }
}
