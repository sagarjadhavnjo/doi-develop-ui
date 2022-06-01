import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CommonService } from 'src/app/modules/services/common.service';

@Injectable({
  providedIn: 'root'
})

export class SuspensionService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json ',
  });

  constructor(private httpClient: HttpClient) { }

  /**
   * @description Get initial Lookup Data
   */
  getLookUpInfoData() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.SUSPENSION.LOOKUPINFO}`, '',
      { headers: this.headers });
  }

  /**
   * @description Save Suspension Details
   * @param params suspension details
   * @returns response observable
   */
  saveSuspensionDetails(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.SUSPENSION.CREATE}`, params);
  }

  /**
   * @description Get Suspension List
   * @param params Search parameters for fetching list
   * @returns response observable
   */
  getSuspensionList(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.SUSPENSION.GET_ALL}`, params);
  }

  /**
   * @description Get Suspension details by id
   * @param param id
   * @returns response observable
   */
  getSuspensionDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.SUSPENSION.GET}`, param);
  }

  /**
   * @description Get Employee details by parameters
   * @param param parameters on the basis of which employee is searched
   * @returns response Observable
   */
  getEmpByNo(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.SUSPENSION.SEARCH_EMP_BY_NO}`, param);
  }

  /**
   * @description Get workflow status
   * @param param menuId of the event
   * @returns response observable
   */
  getWorkFlowStatus(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.SUSPENSION.WORKFLOW_STATUS}`, param);
  }

  /**
   * @description Delete Suspension Penalty Details
   * @param param id
   */
  deletePayDetail(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.SUSPENSION.DELETE_PAY}`,
      param
    );
  }

  /**
   * @description Delete Save as draft Suspension Transaction
   * @param param Suspension id
   */
  deleteSuspension(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.SUSPENSION.DELETE_SUS}`,
      param
    );
  }

  /**
     * @method printOrder
     * @description Function is called to Print the record
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    printOrder(params) {
      return this.httpClient.post(
          `${environment.baseUrl}${APIConst.SUSPENSION.PRINT_ORDER}`, params);
  }

}
