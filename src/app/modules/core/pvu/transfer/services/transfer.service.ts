import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json ',
  });
  constructor(private httpClient: HttpClient) { }
  getLookupData() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.TRANSFER.LOOKUP }`, '');
  }
  getDistrictDesg() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.TRANSFER.DISTRICT_DESG_LOOKUP }`, '');
  }
  getOfficeByDistrictID(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.TRANSFER.GET_OFFICE_BY_DISTRICT }`, param);
  }
  getSubOffice (params) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.TRANSFER.GET_SUB_OFFICE }`, params);
  }
  getSelectedEmpDetail(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.TRANSFER.GET_EMP_DETAIL }`, param);
  }
  createTransfer(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.TRANSFER.SAVE_TRANSFER }`, param);
  }
  getTransferList (params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.TRANSFER.GET_ALL}`, params);
  }
  getTransfer(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.TRANSFER.GET}`,
     params, {headers: this.headers});
  }

  getTransferJoiningList(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.TRANSFER.GET_TRANSFER_JOINING_LIST}`,
     params, {headers: this.headers});
  }

  deleteTransfer(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.TRANSFER.DELETE}`,
      param
    );
  }
}
