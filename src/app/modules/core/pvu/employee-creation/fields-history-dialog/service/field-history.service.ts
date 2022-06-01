import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/common/common-api.constants';

@Injectable({
  providedIn: 'root'
})
export class FieldHistoryService {

  constructor( private httpClient: HttpClient) { }

  /**
     * @method getHistory
     * @description Function called to get History for fields updation Section wise
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getHistory(params, sectionName, moduleName): Observable<any> {
      return this.httpClient.post(`${environment.baseUrl}${APIConst.DATA_UPDATION_HISTORY
        [moduleName][sectionName]}`, params);
  }

}
