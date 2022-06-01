import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ExtraOrdinaryLeaveService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json ',
  });

  constructor(private httpClient: HttpClient) { }

  saveEOLDetails(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EXTRA_ORDINARY_LEAVE.CREATE}`, params);
  }

  updateEOLDetails(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EXTRA_ORDINARY_LEAVE.UPDATE}`, params);
  }

  getEOLDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EXTRA_ORDINARY_LEAVE.GET}`, param);
  }

  getEOLList(params) {
    // tslint:disable-next-line: max-line-length
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EXTRA_ORDINARY_LEAVE.GET_ALL}`, params, { headers: this.headers });
  }

  deleteEolRecord(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EXTRA_ORDINARY_LEAVE.DELETE}`, params);
  }

  getEmpByNo(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.SEARCH_EMPLOYEE.SEARCH_EMP_BY_NO}`, param);
  }

  getDesignation() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EXTRA_ORDINARY_LEAVE.DESIGNATION}`, '',
      { headers: this.headers });
  }

  getWorkFlowStatus(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EXTRA_ORDINARY_LEAVE_LIST.WORKFLOW_STATUS}`, param);
  }
  getAllOffice() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.SEARCH_EMPLOYEE.LOOKUP}`, '',
      { headers: this.headers });
  }
  printOrder(params) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EXTRA_ORDINARY_LEAVE.PRINT}`, params);
  }

  validateEOL(params, action) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EXTRA_ORDINARY_LEAVE.VALIDATION[action]}`, params);
  }
}
