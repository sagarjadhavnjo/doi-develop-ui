import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UserCreationService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    constructor(
        private httpClient: HttpClient
    ) { }

    /**
      * /@function getEmpByNo
      * @description To Search Employee details
      * @param -
      * @returns Search Employee details
      */
    getEmpByCaseNo(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.CREATE.EMPLOYEE_SEARCH}`, param);
    }

    /**
    * /@function getLookupDetails
    * @description To Fetch all Lookup data
    * @param -
    * @returns Fetch all Lookup data
    */
    getLookupDetails() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.CREATE.LOOKUP_DETAILS}`, '',
            { headers: this.headers });
    }

    /**
    * /@function checkDuplicatePAN
    * @description for checking Duplicate PAN Number
    * @param -
    * @returns Duplicate PAN Number if available
    */
    checkDuplicatePAN(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.CREATE.CHECK_PAN}`, param,
            { headers: this.headers });
    }

    /**
     * /@function getDesignation
     * @description To get lookup values of Designation
     * @param -
     * @returns Get Designation list
     */
    getDesignation() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.CREATE.DESIGNATION}`, '',
            { headers: this.headers });
    }

    /**
     * /@function getEmpPayType
     * @description To get lookup values of employee pay type
     * @param -
     * @returns Get pay type list
     */
    getEmpPayType() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.CREATE.EMP_PAY_TYPE}`, '',
            { headers: this.headers });
    }

    /**
     * /@function  onSubmitData
     *  @description To Submit the transaction details
     *  @param param Transaction parameter
     *  @returns Generate unique transaction id
     */
    onSubmitData(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.CREATE.SUBMIT}`, param);
    }

    /**
     * /@function getUserDetail
     * @description To Fetch all Lookup and User Data in View Mode
     * @param param Transaction parameter
     * @returns Fetch all Lookup and User Data for the transaction
     */
    getUserDetail(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.USER_CREATION.CREATE.GET_USER_DATA}`,
            param
        );
    }

}
