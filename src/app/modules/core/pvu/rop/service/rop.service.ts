import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/modules/services/common.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Injectable({
    providedIn: 'root'
})

export class ROPService {
    headers = new HttpHeaders({
        'Content-Type': 'application/json ',
    });

    constructor(
        private httpClient: HttpClient,
        private commonService: CommonService,
        private storageService: StorageService
    ) { }

    getLookUpInfoData() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.LOOKUP}`, '',
            { headers: this.headers });
    }

    getRopLookUpInfoData(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.ROP_LOOKUP}`, param);
    }

    getReturnReasonList(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.ROP_RETURN_REASON}`, param);
    }

    getRopEventData(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.ROP_EVENT_DATA}`, param);
    }

    getRopReasonData(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.ROP_REASON_DATA}`, param);
    }

    getRopTransactionWfRoleCode(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.ROP_TRNS_STATUS}`, param);
    }

    getRopConfiguration(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.ROP_CONFIG}`, param);
    }

    getEmployeeDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.EMPLOYEE_DETAILS}`, params);
    }

    validateEmployee(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.VALIDATE_EMPLOYEE}`, params);
    }

    getPostDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.GET_POST_DATA}`, params);
    }

    getWorkFlowStatus(param) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.ROP.LIST.WORKFLOW_STATUS}`, param);
    }

    getPvuOffice(param) {
        return this.httpClient.post(`${environment.baseUrl}${
            APIConst.ROP.GET_PVUOFFICE}`, param);
    }

    getDesignation() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.DESIGNATION}`, '',
            { headers: this.headers });
    }

    getRopList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.LIST.GET_LIST_DATA}`, params);
    }

    getAuditorRopList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.AUDITOR_LIST.GET_LIST_DATA}`, params);
    }

    deleteRop(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.LIST.DELETE}`, params);
    }

    getRopSearchList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.LIST.GET_SEARCH_LIST}`, params);
    }

    createROP(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.CREATE}`, params);
    }

    updateRemarks(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.UPDATE_REMARKS}`, params);
    }

    getWorkFlowEmpDetail(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.WORKFLOW.GET_EMP_DETAIL}`, param);
    }

    getWorkFlowReview(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.ROP.WORKFLOW.WORKFLOW_HISTORY}`, param);
    }

    getWorkFlowAssignmentOpt(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.WORKFLOW.GET_ASSIGN_OPT}`, param);
    }

    getWorkFlowUsers(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.WORKFLOW.GET_USERS}`, param);
    }

    submitRopWorkFlow(param) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.ROP.WORKFLOW.ROP_SUBMIT}`, param);
    }

    /* getCurrentUserDetail() {
        return new Promise(resolve => {
            const currentUser = this.storageService.get('currentUser');
            if (currentUser && currentUser['post']) {
                const loginPost = currentUser['post'].filter((item) => item['loginPost'] === true);
                if (loginPost && loginPost[0]['oauthTokenPostDTO'] &&
                    loginPost[0]['oauthTokenPostDTO']['edpMsMenuDtoList']) {
                    let wfRoleArray = [],
                        wfRoleCode, wfRoleCodeArray;
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
                    resolve({
                        'menuId': this.commonService.getMenuId(),
                        'linkMenuId': this.commonService.getLinkMenuId(),
                        'wfRoleId': wfRoleArray,
                        'wfRoleCode': wfRoleCode,
                        'wfRoleCodeArray': wfRoleCodeArray,
                        'postId': loginPost[0]['postId'],
                        'lkPOUId': loginPost[0]['lkPoOffUserId'],
                        'officeDetail': loginPost[0]['oauthTokenPostDTO']['edpMsOfficeDto'],
                        'userId': currentUser['userId'],
                        'lkPoOffUserId': loginPost[0]['lkPoOffUserId']
                    });
                }
            }
        });
    } */

    getCurrentUserDetail() {
        return new Promise(resolve => {
            const currentUser = this.storageService.get('currentUser');
            // console.log(currentUser);
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
                        const wfRoleData = this.commonService.getwfRoleId();
                        wfRoleArray = wfRoleData.map(elm => elm.wfRoleIds);
                        wfRoleArray = [].concat(...wfRoleArray);
                        wfRoleCodeArray = wfRoleData.map(elmCode => elmCode.wfRoleCode);
                        wfRoleCodeArray = [].concat(...wfRoleCodeArray);
                        wfRoleCode = wfRoleCodeArray;
                        // wfRoleData['wfRoleCode'][0] : '';
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

    getOfficeList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.AUDITOR_LIST.OFFICE_LIST}`, params);
    }

    getInwardLookup() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.INWARD.INWARD_LOOKUP}`, '',
            { headers: this.headers });
    }

    getInwardList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.INWARD.GET_INWARDS}`, params);
    }

    receiveInward(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.INWARD.RECEIVE}`, params);
    }

    submitInwardWF(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.INWARD.SUBMIT_WF}`, params);
    }

    submitDistributerWF(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.DISTRIBUTOR.SUBMIT_WF}`, params);
    }

    getDistributorList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.DISTRIBUTOR.GET_DISTRIBUTOR}`, params);
    }

    getPrintEndorsementLookup() {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.ROP.PRINTENDORSEMENT.GET_PRINTENDORSEMENT_LOOKUP}`,
            ''
        );
    }
    getRopPrintEndorsementList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.PRINTENDORSEMENT.GET_PRINTENDORSEMENT}`,
            params);
    }
    printSticker(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.PRINTENDORSEMENT.PRINT_STICKER}`,
            params);
    }
    printMultipleSticker(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.PRINTENDORSEMENT.PRINT_MULTI_STICKER}`,
            params);
    }

    printAnnexure(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.PRINT_ANNEXURE}`, params);
    }

    printDdoCertificate(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ROP.PRINT_DDO_CERTIFICATE}`, params);
    }

    reprintRemarksHistory(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.ROP.PRINTENDORSEMENT.REPRINT_REMARKS_HISTORY}`,
            params
        );
    }
}
