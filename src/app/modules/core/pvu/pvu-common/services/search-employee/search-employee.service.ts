import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { environment } from 'src/environments/environment';
import { EVENT_APIS } from '../../../events/pvu-events';

@Injectable({
  providedIn: 'root'
})

export class SearchEmployeeService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json ',
  });

  constructor(private httpClient: HttpClient) { }

  getEmployee(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.SEARCH_EMPLOYEE.SEARCH}`, params);
  }

  getEPTCEmployee(params) {
    return this.httpClient.post(`${environment.baseUrl
    }${APIConst.EMPLOYEE_TYPE_CHANGE.CREATE.GET_EMP_DETAILS}`, params);
  }

  getLookUp() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.SEARCH_EMPLOYEE.LOOKUP}`, '',
     {headers: this.headers});
  }

  /**
     * @method getDesignations
     * @description Function is called to get all designations from server
     * @returns Observable for the API call
     */
    getDesignations() {
      return this.httpClient.post(`${environment.baseUrl}${EVENT_APIS.DESIGNATIONS}`, {});
  }

}
