import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';

@Injectable({
    providedIn: 'root'
})
export class EmployeeTypeChangeService {
    constructor(private httpClient: HttpClient) {}

    /**
     * /@function getEmpByNo
     * @description To Search Employee details
     * @param -
     * @returns Search Employee details
     */
    getEmpByNo(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.SEARCH_EMPLOYEE.SEARCH_EMP_BY_NO}`, param);
    }

    /**
     * /@function getLookupDetails
     * @description To Fetch all Lookup data
     * @param -
     * @returns Fetch all Lookup data
     */
    getLookupDetails() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_TYPE_CHANGE.CREATE.EMP_PAY_TYPE}`, {});
    }

    /**
     * /@function  saveDetails
     *  @description To Save the emp change type details
     *  @param param emp change type parameter
     */
    saveDetails(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.EMPLOYEE_TYPE_CHANGE.CREATE.SUBMIT_DETAILS}`,
            param
        );
    }

    /**
     * /@function  getDetails
     *  @description To get the emp change type details
     *  @param param id
     *  @returns details based on id
     */
    geteEmpChangeTypeDetails(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.EMPLOYEE_TYPE_CHANGE.CREATE.GET_EMP_CHANGE_DATA}`,
            param
        );
    }

    /**
     * /@function  geteEmpDetails
     *  @description To get the emp details
     *  @param param id
     *  @returns emp details based on emp number
     */
    getEmpDetails(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.EMPLOYEE_TYPE_CHANGE.CREATE.GET_EMP_DETAILS}`,
            param
        );
    }

     /**
     * /@method  geteEmpDetails
     *  @description To delete saved record
     *  @param param id
     */
      deleteRecord(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.EMPLOYEE_TYPE_CHANGE.LIST.DELETE}`,
            param
        );
    }

    /**
     * /@method  getSearchListing
     *  @description To get listing
     *  @param param request parameters
     */
    getSearchListing(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.EMPLOYEE_TYPE_CHANGE.LIST.LIST}`,
            param
        );
    }
}
