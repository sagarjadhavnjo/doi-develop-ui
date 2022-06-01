import { Observable } from 'rxjs';
import { EVENT_APIS } from './../';
import { environment } from './../../../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { COMMON_APIS } from '../../../pvu-common';

@Injectable({
    providedIn: 'root'
})
export class PVUWorkflowService {

    headers = new HttpHeaders({
        'Content-Type': 'application/json ',
    });
    constructor(
        private httpClient: HttpClient
    ) { }


    /**
     * @method getEventListing
     * @description Function is called to get List of events created
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getEventListing(params, event): Observable<any> {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.LIST.LIST_DATA[event]}`, params);
    }

    getWorkFlowStatus(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${
            EVENT_APIS.PVU_WORKFLOW.LIST.WORKFLOW_STATUS}`, param);
    }

    getInwardLookup() {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.INWARD.INWARD_LOOKUP}`, '',
            { headers: this.headers });
    }

    getInwardList(params, event) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.INWARD.GET_INWARDS[event]}`, params);
    }

    receiveInward(params, event) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.INWARD.RECEIVE[event]}`, params);
    }

    submitInwardWF(params, event) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.INWARD.SUBMIT[event]}`, params);
    }

    getOutwardList(params, event) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.OUTWARD.GET_OUTWARDS[event]}`, params);
    }

    receiveOutward(params, event) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.OUTWARD.RECEIVE[event]}`, params);
    }

    getOutwardLookup() {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.OUTWARD.LOOKUP}`, {});
    }

    submitOutwardWF(params, event) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.OUTWARD.SUBMIT[event]}`, params);
    }

    getWorkFlowUsers(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${COMMON_APIS.WORKFLOW.GET_USERS}`, param);
    }

    submitDistributerWF(params, event) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.DISTRIBUTOR.SUBMIT[event]}`, params);
    }

    getOfficeList(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.AUDITOR_VERIFIER_APPROVER.OFFICE_LIST}`, params);
    }

    getAuditorVerifierApproverList(params, event) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.AUDITOR_VERIFIER_APPROVER.GET_LIST_DATA[event]}`, params);
    }

    getPVUEventData(params, event) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.AUDITOR_VERIFIER_APPROVER.GET_DATA[event]}`, params);
    }

    getPVUEventLookUpInfoData() {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.AUDITOR_VERIFIER_APPROVER.LOOK_UP}`, {});
    }

    getReturnReasonList() {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.AUDITOR_VERIFIER_APPROVER.REASONS_LIST}`, {});
    }

    getPVUEventTransactionWfRoleCode(params, eventType) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.AUDITOR_VERIFIER_APPROVER.TRNS_WF_CODE[eventType]}`,
            params);
    }

    updateRemarks(params, eventType) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.AUDITOR_VERIFIER_APPROVER.UPDATE_REMARKS[eventType]}`,
            params);
    }

    getPVUEventReasonData(params, eventType) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.AUDITOR_VERIFIER_APPROVER.SAVED_RETURN_REMARKS[eventType]}`,
            params);
    }

    getPrintOrderLookup() {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.PRINT_ORDER.LOOKUP}`, {});
    }

    getPVUPrintOrderList(params, eventType) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.PRINT_ORDER.GET_LIST[eventType]}`, params);
    }

    printMultipleOrder(params, eventType) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.PRINT_ORDER.MULTIPLE_ORDER[eventType]}`, params);
    }

    printOrder(params, eventType) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.PRINT_ORDER.SINGLE_ORDER[eventType]}`, params);
    }

    reprintRemarksHistory(params, eventType) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.PRINT_ORDER.REPRINT_REMARKS_HISTORY[eventType]}`, params);
    }

    rollbackPrintCount(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PVU_WORKFLOW.PRINT_ORDER.ROLLBACK_PRINT_COUNT}`, params);
    }
}
