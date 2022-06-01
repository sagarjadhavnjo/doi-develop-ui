import { Observable } from 'rxjs';
import { CommonService } from './../../../../services/common.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { COMMON_APIS, SENIOR_SCALE_APIS } from './../index';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class PvuCommonService {

    constructor(private httpClient: HttpClient,
        private storageService: StorageService,
        private commonService: CommonService) { }

    /**
     * @description Get all Pay Commission
     */
    getAllCommissions() {
        return this.httpClient.post(`${environment.baseUrl}${COMMON_APIS.ALL_COMMISSION}`, {});
    }

     /**
     * @method getDesignations
     * @description Function is called to get all designations from server
     * @returns Observable for the API call
     */
      getDesignations() {
        return this.httpClient.post(`${environment.baseUrl}${COMMON_APIS.DESIGNATION}`, {});
    }

    /**
     * @description Get Logged In User details
     */
    getCurrentUserDetail() {
        return new Promise(resolve => {
            const currentUser = this.storageService.get('currentUser');
             console.log(currentUser);
            if (currentUser && currentUser['post']) {
                const loginPost = currentUser['post'].filter((item) => item['loginPost'] === true);
                // tslint:disable-next-line: max-line-length
                if (loginPost && loginPost[0]['oauthTokenPostDTO'] && loginPost[0]['oauthTokenPostDTO']['edpMsMenuDtoList']) {
                    let wfRoleArray = [],
                        wfRoleCode, wfRoleCodeArray;
                    // let menuArray = [];
                    let menuData;
                    // console.log(this.commonService.getwfRoleId());
                    if (this.commonService.getwfRoleId()) {
                        const wfRoleData = this.commonService.getwfRoleId()[0];
                        wfRoleArray = wfRoleData['wfRoleIds'];
                        wfRoleCodeArray = wfRoleData['wfRoleCode'];
                        wfRoleCode = (wfRoleData['wfRoleCode'] && wfRoleData['wfRoleCode'][0]) ?
                            wfRoleData['wfRoleCode'][0] : '';
                        // this.commonService.getwfRoleId().forEach(element => {
                        //     if (wfRoleArray.indexOf(element['wfRoleIds'][0]) === -1) {
                        //         wfRoleArray.push(element['wfRoleIds']);
                        //         // wfRoleArray.push(element['wfRoleIds'][0]);
                        //     }
                        // });
                    }
                    if (this.commonService.getMenu()) {
                        menuData = this.commonService.getMenu();
                        // menuArray = menuData['linkMenuId'];
                        // console.log(menuArray);
                    }
                    resolve({
                        'menuId': this.commonService.getLinkMenuId(),
                        'currentMenuId': this.commonService.getMenuId(),
                        'menuDescription': menuData['menuName'],
                        'wfRoleId': wfRoleArray,
                        'wfRoleCode': wfRoleCode,
                        'wfRoleCodeArray': wfRoleCodeArray,
                        'postId': loginPost[0]['postId'],
                        'lkPOUId': loginPost[0]['lkPoOffUserId'],
                        'officeDetail': loginPost[0]['oauthTokenPostDTO']['edpMsOfficeDto'],
                        'userId': currentUser['userId'],
                        'userName': currentUser['username'],
                        'lkPoOffUserId': loginPost[0]['lkPoOffUserId']
                    });
                }
            }
        });
    }

    getCurrentUserMultipleRoleDetail() {
        return new Promise(resolve => {
            const currentUser = this.storageService.get('currentUser');
            if (currentUser && currentUser['post']) {
                const loginPost = currentUser['post'].filter((item) => item['loginPost'] === true);
                // tslint:disable-next-line: max-line-length
                if (loginPost && loginPost[0]['oauthTokenPostDTO'] && loginPost[0]['oauthTokenPostDTO']['edpMsMenuDtoList']) {
                    let wfRoleArray = [],
                        wfRoleCode, wfRoleCodeArray;
                    let menuData;
                    if (this.commonService.getwfRoleId()) {
                        const wfRoleData = this.commonService.getwfRoleId();
                        wfRoleArray = wfRoleData.map(elm => elm.wfRoleIds);
                        wfRoleArray = [].concat(...wfRoleArray);
                        wfRoleCodeArray = wfRoleData.map(elmCode => elmCode.wfRoleCode);
                        wfRoleCodeArray = [].concat(...wfRoleCodeArray);
                        wfRoleCode = wfRoleCodeArray;
                    }
                    if (this.commonService.getMenu()) {
                        menuData = this.commonService.getMenu();
                    }
                    resolve({
                        'linkMenuId': this.commonService.getLinkMenuId(),
                        'menuId': this.commonService.getLinkMenuId(),
                        'menuName': menuData['menuDescription'],
                        'wfRoleId': wfRoleArray,
                        'wfRoleCode': wfRoleCode,
                        'wfRoleCodeArray': wfRoleCodeArray,
                        'postId': loginPost[0]['postId'],
                        'lkPOUId': loginPost[0]['lkPoOffUserId'],
                        'officeDetail': loginPost[0]['oauthTokenPostDTO']['edpMsOfficeDto'],
                        'userId': currentUser['userId'],
                        'userName': currentUser['username'],
                        'lkPoOffUserId': loginPost[0]['lkPoOffUserId']
                    });
                }
            }
        });
      }

    /**
     * @description Get employee details
     * @param param empId
     */
    getWorkFlowEmpDetail(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${COMMON_APIS.WORKFLOW.GET_EMP_DETAIL}`, param);
    }

    /**
     * @description Get workflow users
     * @param param workflow parameters
     */
    getWorkFlowUsers(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${COMMON_APIS.WORKFLOW.GET_USERS}`, param);
    }

    /**
     * @description Submit Workflow
     * @param param params to be submitted
     * @param event event name
     */
    submitWorkFlow(param, event) {
        return this.httpClient.post(
            `${environment.baseUrl}${COMMON_APIS.WORKFLOW.SUBMIT[event]}${COMMON_APIS.WORKFLOW.SUBMIT_CODE}`, param);
    }

    /**
     * @description Get Workflow History
     * @param param menuId, transactionId
     */
    getWorkFlowReview(param, url) {
        return this.httpClient.post(
            `${environment.baseUrl}${url}`, param);
    }

    /**
     * @description Get Workflow Action
     * @param param menuId ,officeId, postId;trnId;userId; wfRoleIds; lkPoOffUserId;
     */
    getWorkFlowAssignmentOpt(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${COMMON_APIS.WORKFLOW.GET_ASSIGN_OPT}`, param);
    }

    /**
     * @description Get Attachment details by menuId
     * @param param menuId
     */
    getAttachmentByMenuId(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${COMMON_APIS.ATTACHMENT.GET_ATTACHMENT_DATA}`, param);
    }

    /**
   * @description Get Attachment data
   */
    getAttachmentList(params, moduleName) {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${moduleName}${COMMON_APIS.ATTACHMENT.GET_ATTACHMENT}`, params);
    }

    /**
      * @description Save/Upload Attachment Details
      */
    uploadAttachment(params, moduleName) {
        return this.httpClient.post(`${environment.baseUrl}${moduleName}${COMMON_APIS.ATTACHMENT.UPLOAD}`, params);
    }

    /**
     * @description Delete Attachment
     * @param params id
     * @param moduleName event name
     */
    deleteAttachment(params, moduleName) {
        return this.httpClient.post(`${environment.baseUrl}${moduleName}${COMMON_APIS.ATTACHMENT.DELETE}`, params);
    }

    /**
     * @description Download Attachment
     * @param params params
     */
    downloadAttachment(params) {
        return this.httpClient.post(`${environment.baseUrl}${COMMON_APIS.ATTACHMENT.DOWNLOAD}`, params,
            { responseType: 'blob' as 'json' });
    }

    /**
    * @description View Attachment
    * @param params params
    */
    viewAttachment(params) {
        return this.httpClient.post(`${environment.baseUrl}${COMMON_APIS.ATTACHMENT.VIEW}`, params);
    }

    /**
    * @description Print PDF View Comments
    * @param params params
    */
    viewComments(params) {
        return this.httpClient.post(`${environment.baseUrl}${COMMON_APIS.VIEWCOMMENTS}`, params);
    }

    /**
     * @method getPayMasters
     * @description Function is called to get all pay master from server
     * @param params is paramters to get desired input
     * @returns Observable for the API call
     */
    getPayMasters(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${SENIOR_SCALE_APIS.PAY_MASTERS}`, params);
    }

    /**
     * @method calcSeventhBasic
     * @description Function is called to get seventh pay commission basic pay from server
     * @param params is paramters to get desired output
     * @param event is for to call specific event data API
     * @returns Observable for the API call
     */
    calcSeventhBasic(params, event): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${SENIOR_SCALE_APIS.SEVENTH_BASIC_PAY}`, params);
    }

    /**
     * @method getPVUEmployeeDetails
     * @description Function is called to get employee details from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    // getPVUEmployeeDetails(params): Observable<any> {
    //   return this.httpClient.post(`${environment.baseUrl}${SENIOR_SCALE_APIS.PVU_EMPLOYEE_DETAILS}`, params);
    // }

    /**
       * @method calcSeventhBasicPVU
       * @description Function is called to get seventh pay commission basic pay from server
       * @param params is paramters to get desired output
       * @param event is for to call specific event data API
       * @returns Observable for the API call
       */
    calcSeventhBasicPVU(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${SENIOR_SCALE_APIS.PVU_CAL_SEVEN_BASIC}`, params);
    }

    /**
       * @method getPvuOffice
       * @description Function is called to get employee pvu office
       * @param params is paramters to get desired output
       * @returns Observable for the API call
       */
    getPvuOffice(param, event) {
        return this.httpClient.post(`${environment.baseUrl}${COMMON_APIS.WORKFLOW.GET_PVUOFFICE[event]}`, param);
    }

    /**
     * @method getEmployeeDetails
     * @description Function is called to get employee details from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getEmployeeDetails(url, params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }

    /**
     * @method checkforEligibility
     * @description Function is called to check for emloyee eligibility from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    checkforEligibility(params): Observable<any> {
        return this.httpClient.post(`${environment.baseUrl}${SENIOR_SCALE_APIS.CHECK_FOR_ELIGIBILITY}`, params);
    }

    /**
     * @method getEmployeeExamDetails
     * @description Function is called to get employee exam details
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getEmployeeExamDetails(params): Observable<any> {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.post(`${environment.baseUrl}${SENIOR_SCALE_APIS.EMPLOYEE_EXAM_DETAILS}`, params);
    }

}
