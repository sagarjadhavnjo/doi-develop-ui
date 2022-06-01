import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/dmo/dmo-api.constants';

@Injectable({
  providedIn: 'root'
})
export class DailyPositionSheetService {

  constructor(private _httpClient: HttpClient) { }

  fetchDailyPositionList() {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.TRANS}`, null);
  }

  fetchMainTransactiononList(dpObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.MAIN_TRANS_2}`, dpObj);
  }

  submitMainTransactiononList(dpObj) {
    return this._httpClient.post(`${environment.baseUrl}${APIConst.MAIN_TRANS_SUBMIT}`, dpObj);
  }
}
