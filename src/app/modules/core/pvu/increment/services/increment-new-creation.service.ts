import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';

@Injectable({
    providedIn: 'root'
})
export class IncrementNewCreationService {


    constructor(
        private httpClient: HttpClient
    ) { }

    /**
    * /@function getDesignation
    * @description To get lookup values of Designation
    * @param -
    * @returns Get Designation list
    */
    getDesignation() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.CREATE.DESIGNATION}`,
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
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.CREATE.GET_EMP_LIST}`,
            param
        );
    }

    /**
       * /@function getLookupDetails
       * @description To Fetch all Lookup data
       * @param -
       * @returns Fetch all Lookup data
       */
    getLookupDetails() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.CREATE.LOOKUP}`,
            {}
        );
    }

    /**
       * /@function  saveIncrementDetails
       *  @description To Save the transaction details
       *  @param param Transaction parameter
       *  @returns 
       */
    saveIncrementDetails(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.CREATE.SAVE_INCREMENT_DETAILS}`,
            param
        );
    }


    /**
    * /@function  saveIncrementDetails
    *  @description To Save the transaction details
    *  @param param Transaction parameter
    *  @returns 
    */
    validateIncrementDetails(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.CREATE.VALIDATE_INCREMENT_DETAILS}`,
            param
        );
    }

    /**
       * /@function  confirmProcessData
       *  @description To confirm & Process the transaction details
       *  @param param Transaction parameter
       *  @returns 
       */
    confirmProcessData(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.CREATE.CONFIRM_PROCESS}`,
            param
        );
    }

    /**
       * @method getEmployeeDataExcel
       * @description Function to download excel for EMployee data
       * @param param search parameters
      */
    getEmployeeDataExcel(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.EMPLOYEE_DATA}`, param);
    }

    /**
       * @method getEmployeeDataExcel
       * @description Function to download excel for EMployee data
       * @param param search parameters
      */
    getProcessedEmpDataExcel(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.PROCESSED_EMP_DATA}`, param);
    }

    /**
       * @method getInEligibleExcel
       * @description Function to download excel for InEligible Employee data
       * @param param search parameters
      */
    getInEligibleExcel(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.INELIGIBLE_EMPLOYEE_DATA}`, param);
    }

    /**
     * /@function getIncrementDetail
     * @description To Fetch all Lookup and Summary data
     * @param param Transaction parameter
     * @returns Fetch all Lookup and Summary data for the transaction
     */
    getIncrementDetail(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.GET}`,
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
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.GET_EMPLOYEE_DETAILS}`,
            params
        );
    }

    /**
     * @method getList
     * @description Common function to return list for demaded report
     * @param param search parameters
     * @param reportName name of the report according to list in apiconstant
    */
    getsuccessFailureCountList(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.CREATE.COUNTLIST}`, param);
    }

    /**
    * @method getExcelSummaryCount
    * @description Function to download excel for Success Failure Count data
    * @param param search parameters
    */
    getExcelSummaryCount(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.SUCCESS_FAILURE_COUNT}`, param);
    }

    /**
     * @method printOrder
     * @description Function is called to Print the record
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
     printOrder(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.INCREMENT.PRINT_ORDER}`, params);
    }


}
