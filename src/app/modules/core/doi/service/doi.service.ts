import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT_TYPE } from 'src/app/shared/constants/edp/edp-data.constants';


@Injectable({
  providedIn: 'root'
})
export class DoiService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json ',
});

  constructor(private httpClient: HttpClient) { }


   
 /**
   * Save common documents API
   *
   * @param {any} params
   * @returns
   *
   * @memberOf DoiService
   */

  saveDocumentsData(relativeURL: string, param) {
    return this.httpClient.post(`${environment.baseUrl}${relativeURL}`, param);
  }


  /**
      * Get Data API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */

  getData(params, url) {
  
    return this.httpClient.post(`${environment.baseUrl}${url}`, params);
  }

  /**
      * Get Data API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */

   getDataPost(params, url) {
    return this.httpClient.post(`${environment.baseUrl}${url}`, params);
  }

  /**
      * Get Data without Params API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */
  getDataWithoutParams(url) {
    console.log(url)
    return this.httpClient.get(`${environment.baseUrl}${url}`);
  }

  /**
      * Get Data without Params API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */
   getDataWithHeadersWithoutParams(url) {
    console.log(url)
    return this.httpClient.get(`${environment.baseUrl}${url}`,{ headers: this.headers });
  }

  /**
       * Get Data without Params API
       *
       * @param {any} params
       * @returns
       *
       * @memberOf LetterOfCreditService
       */
  getDataWithoutParamsPost(url) {
    console.log(url)
    return this.httpClient.post(`${environment.baseUrl}${url}`, {});
  }

  /**
    * Method to Get PDF
    * @param service$ service method which returns observable
    * @param callBackFn callback function which you wants to execute once subscription response is available
    * @param toastr toaster ref to show error if any
    */
  getPDF(res, callBackFn: Function = null, toastr: ToastrService) {
    if (res && res.result && res.status === 200) {
      const file = res.result.base64String;
      const docType = DOCUMENT_TYPE.PDF;
      const byteArray = new Uint8Array(
        atob(file)
          .split('')
          .map(char => char.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: docType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', '' + res.result.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      if (callBackFn) {
        callBackFn(blob, url);
      }
    } else {
      this.showError(toastr, res.message);
    }
  }

  deleteDocument(url: string, id: number) {
    return this.httpClient.delete(`${environment.baseUrl}${url}?pathVariable=${id}`);
  }
  deleteDocumentByPathParam(url: string) {
    return this.httpClient.delete(`${environment.baseUrl}${url}`);
  }

  getRequestWithStringPathVar(url: string, pathVariable: string) {
    return this.httpClient.get(`${environment.baseUrl}${url}?pathVariable=${pathVariable}`);
  }

  getRequestWithNumberPathVar(url: string, pathVariable: number) {
    return this.httpClient.get(`${environment.baseUrl}${url}?pathVariable=${pathVariable}`);
  }

  getRequestWithNumber(url: string, pathVariable: number) {
    return this.httpClient.get(`${environment.baseUrl}${url}/${pathVariable}`);
  }

  postUpdateStatus(url: string, id: number, status: number,) {
    return this.httpClient.post(`${environment.baseUrl}${url}?id=${id}&status=${status}`, {});
  }

   /**
     * To show Error message
     * @param toastr ToastrService instance
     * @param error error received if any
     */
  private showError(toastr: ToastrService, error: any) {
    toastr.error(error);
  }
}
