import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class FixToRegularService {

    constructor(
        private httpClient: HttpClient, private datepipe: DatePipe
    ) { }

    /**
    * /@function getEmpByNo
    * @description To Search Employee details
    * @param -
    * @returns Search Employee details
    */
    getEmpByNo(param) {
        return this.httpClient
            .post(`${environment.baseUrl}${APIConst.SEARCH_EMPLOYEE.SEARCH_FIX_PAY_EMPLOYEE_BY_NO}`, param);
    }

    /**
     * @method getAllCommissions
     * @description Function is called to get all commissions from server
     * @returns Observable for the API call
     */
    getAllCommissions(): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.PAY_COMM}`, {});
    }

    /**
     * @method getAllCommissions
     * @description Function is called to get all commissions from server
     * @returns Observable for the API call
     */
    saveFixToPay(param): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.FIX_TO_REG.SAVE_FIX_TO_REG}`, param);
    }

    /**
     * @method getPayScale
     * @param param for request params
     * @description get all the fix pay scale
     * @returns observables for the api
     */
    getPayScale(param): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.FIX_TO_REG.GET_PAY_SCALE}`, param);
    }


    /**
    * @method getPayBand
    * @param param for request params
    * @description get all the fix pay scale
    * @returns observables for the api
    */
    getPayBand(param): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.FIX_TO_REG.GET_PAY_BAND}`, param);
    }


    /**
     * @method getPayBand
     * @param param for request params
     * @description get all the fix pay scale
     * @returns observables for the api
     */
    getGradePay(param): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.FIX_TO_REG.GET_GRADE_PAY}`, param);
    }

    /**
     * @method getPayBand
     * @param param for request params
     * @description get all the fix pay scale
     * @returns observables for the api
     */
    getPayLevel(param): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.FIX_TO_REG.GET_PAY_LEVEL}`, param);
    }

    /**
     * @method getCell
     * @param param for request params
     * @description get all the fix pay scale
     * @returns observables for the api
     */
    getCell(param): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.FIX_TO_REG.GET_CELL}`, param);
    }

    /**
         * @method changeDateFormat
         * @param param for request params
         * @description Date conversion
         * @returns observables for the api
         */
    changeDateFormat(date) {
        console.log(date);
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'dd/MM/yyyy');
        }
        return '';
    }

    getFixToRegular(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.FIX_TO_REGULAR.GETFIXTOREGULARDATA}`, params
        );
    }
}
