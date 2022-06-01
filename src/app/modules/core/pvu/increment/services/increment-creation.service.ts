import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';

@Injectable({
    providedIn: 'root'
})
export class IncrementCreationService {

    constructor(
        private httpClient: HttpClient
    ) { }

    /**
     * /@function getLookupDetails
     * @description To Fetch all Lookup data
     * @param -
     * @returns Fetch all Lookup data
     */
    getLookupDetails() {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.CREATE.CREATE_LOOKUP_DATA}`,
            {}
        );
    }

    /**
     * /@function getDesignation
     * @description To get lookup values of Designation
     * @param -
     * @returns Get Designation list
     */
    getDesignation() {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.CREATE.DESIGNATION}`,
            {}
        );
    }

    /**
     * /@function  payCommissionChange
     *  @description Get Eligible, Exclude Employee data on the selection of lookup values
     *  @param - officeId, incrementFor, financialYearId, incrementType, classId, designationId,
     * pPan, empNo, nextIncrDate, incrEffectiveDate
     *  @returns Get Eligible, Exclude Employee data
     */
    getIncrementListData(param) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.CREATE.INCREMENT_LIST_DATA}`,
            param
        );
    }

    /**
     * /@function  saveIncrementDetails
     *  @description To Save the transaction details
     *  @param param Transaction parameter
     *  @returns Generate unique transaction id
     */
    saveIncrementDetails(param) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.CREATE.SAVE_INCREMENT_DETAILS}`,
            param
        );
    }

    validateIncrementDetails(param) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.CREATE.VALIDATE_INCREMENT_DETAILS}`,
            param
        );
    }

    /**
     * /@function getIncrementDetail
     * @description To Fetch all Lookup and Summary data
     * @param param Transaction parameter
     * @returns Fetch all Lookup and Summary data for the transaction
     */
    getIncrementDetail(param) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.GET}`,
            param
        );
    }

    /**
     * /@function getIncrementEmployeeDetails
     * @description To Fetch Eligible and Exclude Employee list
     * @param inEventId Event Id
     * @returns Fetch Eligible and Exclude Employee list for the transaction
     */
    getIncrementEmployeeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.INCREMENT.GET_EMPLOYEE_DETAILS}`,
            params
        );
    }

    getRopTransactionWfRoleCode(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.TRNS_STATUS}`, param);
    }

    /**
     * @method printOrder
     * @description Function is called to Print the record
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    printOrder(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.INCREMENT.PRINT_ORDER}`, params);
    }
}
