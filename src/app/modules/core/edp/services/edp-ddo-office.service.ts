import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';

@Injectable({
    providedIn: 'root'
})
export class EdpDdoOfficeService {
    officeFormStatusFlag: boolean;

    constructor(private httpClient: HttpClient) { }

    getOfficeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.OFFICE_DETAILS}`, params);
    }

    getHodList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.HOD_LIST}`, params);
    }

    loadOfficeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.EDIT_OFFICE_DETAILS}`, params);
    }

    getCardexNo(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.CARDEX_NO}`, params);
    }

    getEmployeeName(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.EMPLOYEE_DATA}`, params);
    }

    saveOfficeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.CREATE_OFFICE}`, params);
    }

    updateOfficeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.UPDATE_OFFICE}`, params);
    }

    updateOfficeDetailsUo(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.UPDATE_OFFICE_UO}`, params);
    }

    saveSubOfficeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.SAVE_SUB_OFFICE}`, params);
    }

    getSubOfficeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.LOAD_SUB_OFFICE}`, params);
    }

    updateSubOfficeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.UPDATE_SUB_OFFICE}`, params);
    }

    getOfficeList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.OFFICE_LIST}`, params);
    }

    getUpdateOfficeList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.UPDATE_OFFICE_LIST}`, params);
    }

    deleteUpdateOffice(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.HOD.UPDATE_OFFICE_DELETE}`, params);
    }

    getAttachmentMasterData(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.ATTACHMENT_LIST_NAME}`,
            params
        );
    }

    getOfficeAttachmentMasterData(params, typeOf) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.OFFICE_ATTACHEMT_LIST[typeOf]}`,
            params
        );
    }

    loadAttachmentList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.LOAD_ATTACHMENT_LIST}`,
            params
        );
    }

    loadUpadateOfficeAttachmentList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.LOAD_UPDATE_OFFICE_ATTACHMENT_LIST}`,
            params
        );
    }

    uploadAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.UPLOAD_ATTACHMENT}`,
            params
        );
    }

    uploadOfficeUpdateAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.UPLOAD_OFFICE_UPDATE_ATTACHMENT}`,
            params
        );
    }

    deleteAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.DELETE_ATTACHMENT}`,
            params
        );
    }

    getOfficeUpdateDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE_UPDATE.OFFICE_DETAILS}`, params);
    }

    getOfficeSummaryUpdateDetails(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE_UPDATE.OFFICE_SUMMARY_DETAILS}`,
            params
        );
    }

    getSubOfficeList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_SUB_OFFICE.SUB_OFFICE_LIST}`, params);
    }

    getSubOfficeDelete(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_SUB_OFFICE.SUB_OFFICE_DELETE}`, params);
    }

    getOfficeDelete(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.OFFICE_DELETE}`, params);
    }

    getOfficeSummaryList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.OFFICE_SUMMARY.OFFICE_SUMMARY_LIST}`, params);
    }

    getOfficeSummaryUpdateList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.OFFICE_SUMMARY.OFFICE_SUMMARY_UPDATE_LIST}`,
            params
        );
    }
    getOfficeSummaryDetailList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.OFFICE_SUMMARY.OFFICE_SUMMARY_DETAIL_LIST}`,
            params
        );
    }
    getDepartmentList() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.DEPARTMENT_WITH_HOD}`, '');
    }
    getOfficeBillMapping(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE_UPDATE.OFFICE_BILL_MAPPING}`, params);
    }
    getListOfBills() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.DDO_OFFICE.LIST_OF_BILLS}`, '');
    }

    setStatus(flag) {
        this.officeFormStatusFlag = flag;
    }
    getStatus() {
        return this.officeFormStatusFlag;
    }

    getHeaderDetailsForWf(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.COMMON.GET_HEADER_DETAILS_WF}`, params);
    }

    getCommonWfHeaderDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.COMMON.WF_HEADER_DETAILS}`, params);
    }
    checkForWorkflowCno(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.COMMON.WORKFLOW_CONDITION}`, params);
    }

    isWfEnabled() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.COMMON.IS_WF_ENABLE}`, {});
    }

    attachmentValidation() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.COMMON.ATTACHMENT_VALIDATION}`, [{ name: '' }]);
    }

    validateForDuplicateRecords(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.COMMON.VALIDATE_FOR_DUPLICATE_RECORDS}`, params);
    }

    validationForDuplicateRecordsDetailsList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.COMMON.VALIDATE_FOR_DUPLICATE_RECORDS_DETAILS_LIST}`, params);
    }

    checkForDuplicateDdoNo(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.CHECK_DUPLICATE_DDO}`, params);
    }
    checkDuplOffName(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.CHECK_DUPL_TREASURY_OFF_NAME}`, params);
    }
    finalApproval(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.FINAL_APPROVAL}`, params);
    }
    getTransferOfficeNameId(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.OFFICE_TRANSFER}`, params);
    }
}
