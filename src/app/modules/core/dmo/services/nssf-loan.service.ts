import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/dmo/dmo-api.constants';

@Injectable({
  providedIn: 'root'
})
export class NssfLoanService {
  dpObj: any;
  constructor(private _httpClient: HttpClient) { }

  /**
   * DP list API called here
   * @param reqObj 
   * @returns 
   */
  fetchNssfLoanReceivedList(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.MAIN_TRANS}`, reqObj);
  }

  fetchNssfLoanReceived(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.NSS_LOAN_RECEIVED}`, reqObj);
  }

  fetchNssfLoanReceivedDetails(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.NSS_LOAN_RECEIVED_DETAILS}`, reqObj);
  }

  saveNssfLoanDetails(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.NSS_LOAN_ADD}`, reqObj);
  }

  fetchNssfLoanPaybleDetails(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.NSS_LOAN_PAYBLE_DET}`, reqObj);
  }

  fetchNssfLoanRepymntScheduleDtls(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.NSS_LOAN_RESHEDULE_DET}`, reqObj);
  }

  submitNssfLoanData(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.NSS_LOAN_REPAYMENT_SAVE}`, reqObj);
  }

  fetchRepaymentScheduleData(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.NSS_LOAN_REPAYMENT_SCH}`, reqObj);
  }

  setDPData(obj) {
    this.dpObj = obj;
  }
  getDPObj() {
    return this.dpObj;
  }

  setLoanId(obj) {
    this.dpObj = obj;
  }
  getLoanId() {
    return this.dpObj;
  }
}
