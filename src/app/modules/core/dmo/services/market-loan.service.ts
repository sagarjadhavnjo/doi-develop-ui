import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/dmo/dmo-api.constants';

@Injectable({
  providedIn: 'root'
})
export class MarketLoanService {
  dpObj: any=null;
  constructor(private _httpClient: HttpClient) { }

  fetchMarketLoanReceivedList(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.MARKET_LOAN_RECEIVED}`, reqObj);
  }

  fetchMarketLoanReceivedDetails(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.MARKET_LOAN_RECEIVED_DETAILS}`, reqObj);
  }

  saveMarketLoanReceivedDetails(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.MARKET_LOAN_SAVE}`, reqObj);
  }

  fetchMarketLoanApprovedList(reqObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.MARKET_LOAN_APPROVED_LIST}`, reqObj);
  }

  setDPData(obj) {
    this.dpObj = obj;
  }
  getDPObj() {
    return this.dpObj;
  }
}
