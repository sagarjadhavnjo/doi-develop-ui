import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';
@Injectable({
    providedIn: 'root'
})
export class PostTransferService {
    constructor(private httpClient: HttpClient) { }

    getPostTransferList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST_TRANSFER.GET_POST_TRANS_LIST}`, params);
    }

    deletePostTransfer(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST_TRANSFER.LIST.DELETE_RECORD}`, params);
    }

    getEmployeeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST_TRANSFER.GET_EMPL_DATA}`, params);
    }

    getVacantPostList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST_TRANSFER.GET_VACANT_POST_LIST}`, params);
    }

    changePostType(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST_TRANSFER.CHANGE_POST_TYPE}`, params);
    }

    createPostTransfer(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST_TRANSFER.CREATE_POST_TRANSFER_REQ}`, params);
    }

    getPostTransferData(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST_TRANSFER.GET_POST_TRANSFER_DATA}`, params);
    }

    getPostTransferApproveData(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST_TRANSFER.GET_POST_TRANSFER_DATA_VIEW}`
            , params);
    }

    getValueForCheckWorkFlowPopup(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST_TRANSFER.CHECK_FOR_WORKFLOW_CALL}`
        , params);
    }

    getAttachmentMasterData(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST_TRANSFER.ATTACHMENT.LIST_NAME}`,
            params
        );
    }
    uploadAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST_TRANSFER.ATTACHMENT.UPLOAD_ATTACHMENT}`,
            params
        );
    }
    loadAttachmentDataList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST_TRANSFER.ATTACHMENT.LOAD_ATTACHMENT_LIST_DATA}`,
            params
        );
    }
    getPostTransferDataList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST_TRANSFER.LIST.LIST_OF_DATA}`,
            params
        );
    }
    deleteAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST_TRANSFER.ATTACHMENT.DELETE_ATTACHMENT}`,
            params
        );
    }

    getHeaderDetails(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST_TRANSFER.LIST.HEADER_SUBMIT_POPUP}`,
            params
        );
    }

    getListingStatus(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST_TRANSFER.LIST.GET_STATUS}`,
            params
        );
    }
    getDistrictOfficeDetails(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.COMMON.GET_DISTRICT_OFFICE_DETAILS}`,
            params
        );
    }
}
