import { Observable, BehaviorSubject } from 'rxjs';
import { EVENT_APIS } from './../';
import { environment } from './../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PVUEventsService {

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
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.LIST.LIST_DATA[event]}`, params);
    }

    /**
     * @method deleteRecord
     * @description Function is called to delete event
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    deleteRecord(params, event) {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.DELETE_TRANSACTION[event]}`, params);
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
     * @method getWorkFlowStatus
     * @description Function is called to get all workflow options from server
     * @param param is paramters to get desired output
     * @returns Observable for the API call
     */
    getWorkFlowStatus(param): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.LIST.WORKFLOW_STATUS}`, param);
    }

    /**
     * @method getAllCommissions
     * @description Function is called to get all commissions from server
     * @returns Observable for the API call
     */
    getAllCommissions(): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.PAY_COMM}`, {});
    }

    /**
     * @method getEmployeeDetails
     * @description Function is called to get employee details from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getEmployeeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.EMPLOYEE_DETAILS}`, params);
    }

    /**
     * @method getEmployeeDetailsShettyPay
     * @description Function is called to get employee details from server for Shetty Pay
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getEmployeeDetailsShettyPay(params) {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.EMPLOYEE_DETAILS_SHETTY_PAY}`, params);
    }

    /**
     * @method getCurrentEmployeeDetails
     * @description Function is called to get current employee details from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getCurrentEmployeeDetails(params) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CAREER_ADVANCEMENT_SCHEME.CURRENT_DETAILS}`, params);
    }

    /**
     * @method getLookUp
     * @description Function is called to get constants based on events from server
     * @param event is paramters to get desired output
     * @returns Observable for the API call
     */
    getLookUp(event) {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.LOOK_UP[event]}`, {});
    }

    /**
     * @method getEventDetails
     * @description Function is called to get saved event details from server
     * @param params is paramters to get desired output
     * @param event is for to call specific event data API
     * @returns Observable for the API call
     */
    getEventDetails(params, event) {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CRUD[event]}${EVENT_APIS.GET}`, params);
    }

    /**
     * @method saveEvent
     * @description Function is called to save event details to server
     * @param params is paramters to save desired input
     * @param event is for to call specific event data API
     * @returns Observable for the API call
     */
    saveEvent(params, event) {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CRUD[event]}${EVENT_APIS.CREATE}`, params);
    }

    /**
     * @method getDesignations
     * @description Function is called to get all designations from server
     * @returns Observable for the API call
     */
    getDesignations() {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.DESIGNATIONS}`, {});
    }

    /**
     * @method getPayMasters
     * @description Function is called to get all pay master from server
     * @param params is paramters to get desired input
     * @returns Observable for the API call
     */
    getPayMasters(params?) {
        if (!params) {
            params = {};
        }
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.PAY_MASTERS}`, params);
    }

    /**
     * @method getPVUEvents
     * @description Function is called to get all PVU events
     * @returns Observable for the API call
     */
    getPVUEvents() {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.PVU_EVENTS}`, {});
    }

    /**
     * @method checkforHigherPayEligibility
     * @description Function is called to check for employee eligibility for Higher Pay scale
     * @param params is paramters to get desired input
     * @returns Observable for the API call
     */
    checkforHigherPayEligibility(params) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.HIGHER_PAY_SCALE_APIs.CHECK_ELIGIBILITY}`, params);
    }

    /**
     * 
     * @param params 
     * @returns 
     */
    calculateOptionAvailedYes(params){
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.OPTION_CALCULATE_API}`, params);
    }

    /**
     * @method checkforDateNxtIncr
     * @description Function is called to check for emloyee eligibility from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    checkforDateNxtIncr(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.HIGHER_PAY_SCALE_APIs.CHECK_FOR_DATE_NXT_INCR}`, params);
    }

    /**
     * @method calcHigherPaySeventhBasic
     * @description Function is called to get seventh pay commission basic pay from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    calcHigherPaySeventhBasic(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.HIGHER_PAY_SCALE_APIs.CAL_SEVEN_BASIC}`, params);
    }

    /**
    * @method calcHigherPaySeventhBasic
    * @description Function is called to get seventh pay commission basic pay from server
    * @param params is paramters to get desired output
    * @returns Observable for the API call
    */
    calcCasSeventhBasic(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CAREER_ADVANCEMENT_SCHEME.CAL_SEVEN_BASIC}`, params);
    }

    /**
     * @method calcHigherPaySixthBasic
     * @description Function is called to get sixth pay commission basic pay from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    calcHigherPaySixthBasic(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.HIGHER_PAY_SCALE_APIs.CAL_SIX_BASIC}`, params);
    }

    /**
     * @method calcCasSixthBasic
     * @description Function is called to get sixth pay commission basic pay from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    calcCasSixthBasic(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CAREER_ADVANCEMENT_SCHEME.CAL_SIX_BASIC}`, params);
    }

    /**
     * @method checkforTikuPayEligibility
     * @description Function is called to check for employee eligibility for Tiku Pay
     * @param params is paramters to get desired input
     * @returns Observable for the API call
     */
    checkforTikuPayEligibility(params) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.TIKU_PAY_APIs.CHECK_ELIGIBILITY}`, params);
    }

    /**
    * @method calcSelectionGradeSeventhBasic
    * @description Function is called to get seventh pay commission basic pay from server
    * @param params is paramters to get desired output
    * @returns Observable for the API call
    */
    calcSelectionGradeSeventhBasic(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.SELECTION_GRADE_APIs.CAL_SEVEN_BASIC}`, params);
    }

    /**
     * @method checkForACPEligibility
     * @description Function is called to eligibility of ACP for an employee from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    checkForACPEligibility(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.Assured_Career_Progression.CHECK_ELIGIBILITY}`, params);
    }

    /**
     * @method checkEligibilityForShettPay
     * @description Function is called to eligibility of employee from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    checkEligibilityForShettPay(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.SHETTY_PAY_API.CHECK_ELG_SP}`, params);
    }

    /**
     * @method getJnrEmpDetailss
     * @description Function is called to eligibility of employee from server for stepping up
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getJnrEmpDetailss(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.STEPPING_UP_API.VALIDATE_EMPLOYEE}`, params);
    }

    /**
     * @method getSixthPayMasters
     * @description Function is called to get all pay master from server
     * @param params is paramters to get desired input
     * @returns Observable for the API call
     */
    getSixthPayMasters(params) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.Assured_Career_Progression.SIXTH_PAY_MASTERS}`, params);
    }

    /**
     * @method checkDateNxtIncrCAS
     * @description Function is called to check for emloyee eligibility from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    checkDateNxtIncrCAS(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.CAREER_ADVANCEMENT_SCHEME.CHECK_FOR_DATE_NXT_INCR}`, params);
    }

    /**
     * @method getEmployeeExamDetails
     * @description Function is called to get employee exam details
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getEmployeeExamDetails(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.EMPLOYEE_EXAM_DETAILS}`, params);
    }

    printComparisonStatement(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${EVENT_APIS.PRINT_COMPARISON_STATEMENT}`, params);
    }
  
}
