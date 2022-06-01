import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIConst } from 'src/app/shared/constants/letter-of-credit/letter-of-credit-api.constants';
import { environment } from 'src/environments/environment';
import { LcAdvPreparationsaveRequest } from '../model/letter-of-credit';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT_TYPE } from 'src/app/shared/constants/edp/edp-data.constants';
//\src\app\shared\constants\letter-of-credit\letter-of-credit-api.constants.ts

@Injectable({
  providedIn: 'root'
})
export class LetterOfCreditService {

  constructor(private httpClient: HttpClient) { }

  /**
      * Save Advice Preparation Data API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */
  LcAdvicePrepSave(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.SAVE_LCPREP_DATA}`, params);
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
  getDataWithoutParamsPost(url) {
    console.log(url)
    return this.httpClient.post(`${environment.baseUrl}${url}`, {});
  }

  /**
      * Get Circle Data API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */
  getCircleNames() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.GET_CIRCLE_NAME_DETAILS}`, {});
  }

  /**
      * Get Bank Data API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */
  getBankDetails() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.GET_BANK_DETAILS}`, {});
  }

  /**
      * Get MajorHeadData API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */

  getMajorheadList() {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.GET_MAJOR_HEAD_LIST}`, {});

  }

  /**
      *  Submit OpenReq WfData API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */
  locWFSubmitDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.SUBMIT_WF_DETAILS}`, param);
  }

  /**
    *  Submit OpenReq Data API
    *
    * @param {any} params
    * @returns
    *
    * @memberOf LetterOfCreditService
    */

  getSubmitActionDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.SUBMIT_ACTION_DETAILS}`, param);
  }

  /**
     *  Submit ClosedReq Data API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */

  getClosedSubmitActionDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CLOSEREQUEST.SUBMIT_ACTION_DETAILS}`, param);
  }

  /**
     *  Submit ClosedWfReq Data API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */

  locWFClosedSubmitDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CLOSEREQUEST.SUBMIT_WF_DETAILS}`, param);
  }



  /**
       *  CLose Req DropDownList API
       *
       * @param {any} params
       * @returns
       *
       * @memberOf LetterOfCreditService
       */
  getDropDownListForSearch(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.DROP_DOWN}`, params);
  }

  /**
      *  Open Req DropDownList API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */

  getDropDownListForCloseRequest(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CLOSEREQUEST.DROP_DOWN}`, params);
  }

  /**
        *  Open Req Search API
        *
        * @param {any} params
        * @returns
        *
        * @memberOf LetterOfCreditService
        */

  getTableList(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.GET_SEARCHED_LIST}`, params);
  }

  /**
      *  Closed Req Search API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */

  getClosedReqTableList(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CLOSEREQUEST.GET_SEARCHED_LIST}`, params);
  }

  /**
    * get OpenHeader Info API
    *
    * @param {any} params
    * @returns
    *
    * @memberOf LetterOfCreditService
    */
  getHeaderData(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.GET_HEADER_DATA}`, params);

  }


  /**
   * Delete OpenData API
   *
   * @param {any} params
   * @returns
   *
   * @memberOf LetterOfCreditService
   */

  deleteHdrDetails(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.DELETE_ROW}`, params);
  }

  /**
  * Delete ClosedData API
  *
  * @param {any} params
  * @returns
  *
  * @memberOf LetterOfCreditService
  */

  deleteClosedReqHdrDetails(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CLOSEREQUEST.DELETE_ROW}`, params);
  }

  /**
   * Save DivisionData API
   *
   * @param {any} params
   * @returns
   *
   * @memberOf LetterOfCreditService
   */

  saveDivisionData(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.DIVISION_TAB_SAVE}`, param);
  }

  /**
   * Validate AG Details API
   *
   * @param {any} params
   * @returns
   *
   * @memberOf LetterOfCreditService
   */

  validateAGDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.VALIDATION_AG}`, param);
  }


  /**
      *  ChequeBook  Search API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */

  getCheckBookSearchParams() {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.CHECKBOOK_ACTIVE_INACTIVE.CHECK_BOOK_lISTING_SEARCH_PARAMS}`, {});
  }

  /**
     *  ChequeBook  Submit API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */

  getSubmitActionChequeDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.CHECKBOOK_ACTIVE_INACTIVE.GET_CHEQUEBOOK_GETHEARDER}`, param);
  }
  /**
       *  ChequeBook  WFSubmit API
       *
       * @param {any} params
       * @returns
       *
       * @memberOf LetterOfCreditService
       */


  locChequeWFSubmitDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.CHECKBOOK_ACTIVE_INACTIVE.GET_CHEQUEBOOK_SUBMIT_DETAILS}`, param);
  }

  /**
     *  Save CheckBook API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */


  saveLCChequeActiveInactive(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.CHECKBOOK_ACTIVE_INACTIVE.GET_CHEQUEBOOK_SAVE_DRAFT}`, param);
  }

  /**
    *  LC Distribution Search API
    *
    * @param {any} params
    * @returns
    *
    * @memberOf LetterOfCreditService
    */


  getLcDistributionSearchParams() {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.LC_DISTRIBUTION.GET_LC_SEARCH_PARAMS}`, {});
  }

  /**
      *  LC Distribution Form B Print Pdf
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */

  getDistributionCirclePrintPdf(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_DISTRIBUTION.GET_DISTRIBUTION_PRINT_PDF}`, params);
  }

  /**
      *  LC Distribution DropdownList API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */


  getLCAdviceChequetypelistDropdown() {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.GET_LC_CHEQUETYPE_DROPDOWN}`, {});
  }

  /**
      *  LC Distribution WFSubmit
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */


  getAdvPrepWFSubmitDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.SUBMIT_WF_DETAILS}`, param);
  }

  /**
     *  LC AdvPrp DropdownList API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */
  getDropDownListLcAdvPrep(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.DROP_DOWN}`, params);
  }

  /**
   * Delete LcAdvPrepData API
   *
   * @param {any} params
   * @returns
   *
   * @memberOf LetterOfCreditService
   */

  deleteSDLcAdvPrep(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.DELETE_ROW}`, params);
  }

  /**
   * Listing LcAdvPrepData API
   *
   * @param {any} params
   * @returns
   *
   * @memberOf LetterOfCreditService
   */
  getLcAdvPrpListingData(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.GET_SEARCHED_LIST}`, params);
  }

  /**
     * Listing LcAdvPrepNonEmployeeData API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */

  getAdvPrepNonEmployeeList(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.NON_EMPLOYEE_LIST}`, params);
  }

  /**
     *  LcAdvPrepTypeData API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */
  getAdviceTypeList() {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.GET_POSTING_DETAILS_ADVICE_TYPE}`, {});
  }

  /**
     * Save Epayment- LcAdvPrepData API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */
  saveEpaymentDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.GET_EPAY_SAVE}`, param);
  }

  /**
    * get AdvPrepHeader Info API
    *
    * @param {any} params
    * @returns
    *
    * @memberOf LetterOfCreditService
    */
  getAdvPrepHeaderData(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.GET_HEADER_DATA}`, params);

  }

  /**
     * Delete Epayment-Data API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */

  deleteEpaymentRow(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.DELETE_EPAY_ROW}`, params);
  }
  getAdviceStatementPdf(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.GET_ADVICE_STATEMENT_PDF}`, params);
  }


  /**
   * get dropdown API
   *
   * @returns
   *
   * @memberOf LetterOfCreditService
   */
  getDropDownListCheqCancel(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_CANCEL.DROP_DOWN}`, params);
  }

  /**
    * get CheckCancelHeader Info API
    *
    * @param {any} params
    * @returns
    *
    * @memberOf LetterOfCreditService
    */
  getCheqCancelHeaderData(params) {

    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_CANCEL.GET_HEADER_DATA}`, params);

  }
  /**
     * Delete Cheque Cancel Data API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */

  deleteSDCheqCancel(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_CANCEL.DELETE_ROW}`, params);
  }

  /**
   * Cheque Cancel WFSubmit Data API
   *
   * @param {any} params
   * @returns
   *
   * @memberOf LetterOfCreditService
   */
  locChequeCancelWFSubmitDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_CANCEL.WFSUBMIT_CHEQUECANCE}`, param);
  }

  /**
     * Cheque Cancel Save Data API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */

  saveLCChequeCancel(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_CANCEL.SAVEDATA_CHEQUECANEL}`, param);
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

  /**
     * To show Error message
     * @param toastr ToastrService instance
     * @param error error received if any
     */
  private showError(toastr: ToastrService, error: any) {
    toastr.error(error);
  }


  /**
 * get dropdown API
 *
 * @returns
 *
 * @memberOf LetterOfCreditService
 */
  getDropDownListChequeEffect(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_TO_CHEQUE_EFFECT.DROP_DOWN}`, params);
  }

  /**
     * Cheque Cancel Save Data API
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */

  saveChequeToChequeEffect(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_TO_CHEQUE_EFFECT.SAVEDATA_CHEQUEEFFECT}`, param);
  }


  /**
  * get CheckCancelHeader Info API
  *
  * @param {any} params
  * @returns
  *
  * @memberOf LetterOfCreditService
  */
  getCheqEffectHeaderData(params) {

    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_TO_CHEQUE_EFFECT.GET_HEADER_DATA}`, params);

  }


  /**
* Cheque Cancel WFSubmit Data API
*
* @param {any} params
* @returns
*
* @memberOf LetterOfCreditService
*/
  locChequeEffectWFSubmitDetails(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_TO_CHEQUE_EFFECT.WFSUBMIT_CHEQUECANCE}`, param);
  }

  /**
    * Delete Cheque Cancel Data API
    *
    * @param {any} params
    * @returns
    *
    * @memberOf LetterOfCreditService
    */

  deleteSDCheqEffect(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_TO_CHEQUE_EFFECT.DELETE_ROW}`, params);
  }
  /**
     *  LC Open Req  Print Letter Pdf
     *
     * @param {any} params
     * @returns
     *
     * @memberOf LetterOfCreditService
     */

  getOpenreqPdf(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_OPENING_REQUEST.GET_OPEN_REQ_PRINT_AUTH_LETTER}`, params);
  }

  /**
      * Delete ChequeDetails-Data API
      *
      * @param {any} params
      * @returns
      *
      * @memberOf LetterOfCreditService
      */



  deleteChequetocheque(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_CHEQUE_TO_CHEQUE_EFFECT.DELETE_EPAY_ROW}`, params);
  }
  adviceCheqEpaymentPrint(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.LC_ADVICEPREPARATION.GET_ADVICE_CHEQ_EPAYMENT_PRINT}`, params);
  }



}
