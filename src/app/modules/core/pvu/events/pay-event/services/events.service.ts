import { Observable } from 'rxjs';
import { EVENT_APIS } from './../';
import { environment } from './../../../../../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor(
        private httpClient: HttpClient
    ) { }

    /**
     * @method getAllCommissions
     * @description Function is called to get all commissions from server
     * @returns Observable for the API call
     */
    getAllCommissions(): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.PAY_COMM}`, {});
    }

    /**
     * @method getEventListing
     * @description Function is called to get events list based on event from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getEventListing(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.LIST.LIST_DATA}`, params);
    }
    /**
     * 
     * @param params 
     * @returns 
     */
    calculateOptionAvailedYes(params) {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.OPTION_CALCULATE_API}`, params);
    }

    /**
     * @method getEmployeeDetails
     * @description Function is called to get employee details from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getEmployeeDetails(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.EMPLOYEE_DETAILS}`, params);
    }

    /**
     * @method getDeemedEmployeeDetails
     * @description Function is called to get junior employee details from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getDeemedEmployeeDetails(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.DEEMED_EMPLOYEE_DETAILS}`, params);
    }

    /**
     * @method getPayEvents
     * @description Function is called to get all pay fixation events from server
     * @returns Observable for the API call
     */
    getPayEvents(): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.PAY_EVENTS}`, {});
    }

    /**
     * @method getLookUp
     * @description Function is called to get constants based on events from server
     * @param event is paramters to get desired output
     * @returns Observable for the API call
     */
    getLookUp(event): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.LOOK_UP[event]}`, {});
    }

    getReversionData(event, payload): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.LOOK_UP[event]}`, payload);
    }

    /**
     * @method getEventDetails
     * @description Function is called to get saved event details from server
     * @param params is paramters to get desired output
     * @param event is for to call specific event data API
     * @returns Observable for the API call
     */
    getEventDetails(params, event): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CRUD[event]}${EVENT_APIS.GET}`, params);
    }

    /**
     * @method saveEvent
     * @description Function is called to save event details to server
     * @param params is paramters to save desired input
     * @param event is for to call specific event data API
     * @returns Observable for the API call
     */
    saveEvent(params, event): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CRUD[event]}${EVENT_APIS.CREATE}`, params);
    }

    /**
     * @method getDesignations
     * @description Function is called to get all designations from server
     * @returns Observable for the API call
     */
    getDesignations(): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.DESIGNATIONS}`, {});
    }

    /**
     * @method getPayMasters
     * @description Function is called to get all pay master from server
     * @param params is paramters to get desired input
     * @returns Observable for the API call
     */
    getPayMasters(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.PAY_MASTERS}`, params);
    }

    getPayMastersCommission(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.PAY_MASTERS_COMMISSION}`, params);
    }

    /**
     * @method calcSeventhBasic
     * @description Function is called to get seventh pay commission basic pay from server
     * @param params is paramters to get desired output
     * @param event is for to call specific event data API
     * @returns Observable for the API call
     */
    calcSeventhBasic(params, event): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CAL_SEVEN_BASIC[event]}`, params);
    }

    /**
     * @method calcSixthBasic
     * @description Function is called to get sixth pay commission basic pay from server
     * @param params is paramters to get desired output
     * @param event is for to call specific event data API
     * @returns Observable for the API call
     */
    calcSixthBasic(params, event): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CAL_SIX_BASIC[event]}`, params);
    }

    /**
     * @method getWorkFlowStatus
     * @description Function is called to get all workflow options from server
     * @param param is paramters to get desired output
     * @returns Observable for the API call
     */
    getWorkFlowStatus(param): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.LIST.WORKFLOW_STATUS}`, param);
    }

    /**
     * @method getLookupDetails
     * @description Function is called to get all constants from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getLookupDetails(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.LIST.GET_LOOKUP_DATA}`, params);
    }

    /**
     * @method getEmployeeJoiningDetails
     * @description Function is called to get emloyee joining details from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getEmployeeJoiningDetails(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.EMPLOYEE_JOINING_DETAILS}`, params);
    }

    /**
     * @method checkforEligibility
     * @description Function is called to check for emloyee eligibility from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    checkforEligibility(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CHECK_FOR_ELIGIBILITY}`, params);
    }

    /**
     * @method checkforPromotionEligibility
     * @description Function is called to check for emloyee promotion eligibility from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    checkforPromotionEligibility(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.PROMOTION_ELIGIBILITY}`, params);
    }


    /**
     * @method deleteRecord
     * @description Function is called to soft delete record
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    deleteRecord(params, event): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CRUD[event]}${EVENT_APIS.LIST.DELETE}`, params);
    }

    printOrder(params, eventType) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PRINT_ORDER[eventType]}`, params);
    }

    printComparisonStatement(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PRINT_COMPARISON_STATEMENT}`, params);
    }
}
