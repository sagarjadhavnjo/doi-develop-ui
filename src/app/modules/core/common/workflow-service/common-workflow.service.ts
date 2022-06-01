import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { APIConst } from '../constant/common-workflow.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CommonService } from 'src/app/modules/services/common.service';

@Injectable({
    providedIn: 'root'
})
export class CommonWorkflowService {
    constructor(
        private httpClient: HttpClient,
        private storageService: StorageService,
        private commonService: CommonService
    ) {}
    /**
    * @description To get the workflow history.
    * @param param: any - Request parameter that required to pass to api
    */
    getWorkFlowHistory(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_HISTORY}`, param);
    }

    /**
     * @description to get the Action list
     * @param param: any - Request parameter that required to pass to api
     */
    getWorkFlowAction(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_ACTION}`, param);
    }

    /**
     * @description to get the User list
     * @param param: any - Request parameter that required to pass to api
     */
    getWorkFlowUsers(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_USER}`, param);
    }

    /**
     * @description to get the Branch list
     * @param param: any - Request parameter that required to pass to api
     */
    getBranchByBranchType(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_BRANCH}`, param);
    }
    /**
     * @description to Return to Office
     * @param param: any - Request parameter that required to pass to api
     */
    getReturn(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_RETURN}`, param);
    }
     /**
     * @description to Reset Consolidation
     * @param param: any - Request parameter that required to pass to api
     */
    getResetConsolidation(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.RESET_CONSOLIDATION}`, param);
    }
    /**
     * @description to get the Office list
     * @param param: any - Request parameter that required to pass to api
     */
    getOfficeByOfficeType(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_OFFICE}`, param);
    }

    /**
     * @description to get the Department list
     * @param param: any - Request parameter that required to pass to api
     */
    getDepartmentList(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_DEPARTMENT}`, param);
    }

    /**
     * @description to get the User list for Grant CO_SELECTION Alias
     * @param param: any - Request parameter that required to pass to api
     */
    getGrantWorkFlowUsers(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GRANT_WORKFLOW_USER}`, param);
    }
    /**
     * @description to get the Workflow Role list
     * @param param: any - Request parameter that required to pass to api
     */
    getWorkflowRoleList(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_WORKFLOW_ROLE}`, param);
    }

    /**
     * @description to get the HOD list
     * @param param: any - Request parameter that required to pass to api
     */
    getHodList(param, isUniqueListReqForBudget = false) {
        if (isUniqueListReqForBudget) {
            return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_UNQ_HOD}`, param);
        } else {
            return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_HOD}`, param);
        }
    }

    /**
     * @description to get the CO list
     * @param param: any - Request parameter that required to pass to api
     */
    getCoList(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_CO}`, param);
    }

    /**
     * @description to get the department office list
     * @param param: any - Request parameter that required to pass to api
     */
    getAdOffice(param, isUniqueListReqForBudget = false) {
        if (isUniqueListReqForBudget) {
            return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_UNQ_AD_OFFICE}`, param);
        } else {
            return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_AD_OFFICE}`, param);
        }
    }

    /**
     * @description to get the FD office list
     * @param param: any - Request parameter that required to pass to api
     */
    getFdOffice(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_FD_OFFICE}`, param);
    }

    /**
     * @description to get the Child office list
     * @param param: any - Request parameter that required to pass to api
     */
    getChildOffice(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_CHILD_OFFICE}`, param);
    }

    /**
     * @description to get the TO/PAO office list
     * @param param: any - Request parameter that required to pass to api
     * As discussed with Shailesh Dobariya i am added aliyas API service into this file.
     */
    getTOPAOOffice(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_TOPAO_OFFICE_NAME}`, param);
    }

    /**
     * @description to get GAD office or outcome budget menu
     * @param param: any - Request parameter that required to pass to api
     * checked for the same with shailesh
     */
    getGadOffice(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_GAD_OFFICE}`, param);
    }
    
    /**
     * @description to get the DAT office list
     * @param param: any - Request parameter that required to pass to api
     * As discussed with Shailesh Dobariya i am added aliyas API service into this file.
     */
    getDatOfficeForReceipt(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_DAT_OFFICE_NAME_FOR_RECEIPT}`, param);
    }

    

    /**
     * @description to get the FD office list
     * @param param: any - Request parameter that required to pass to api
     */
    getFdGroup(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_FD_GROUP}`, param);
    }

    /**
     * @description to get the department office list
     * @param param: any - Request parameter that required to pass to api
     */
    getParentOffice(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_PARENT_OFFICE}`, param);
    }

    /**
     * @description to get the list of minister
     * @param param: any - Request parameter that required to pass to api
     */
    getMinisterInCharge(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_MINISTER}`, param);
    }

    /**
     * @description to get the Office list
     * @param param: any - Request parameter that required to pass to api
     */
    submitWorkFlow(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_SUBMIT}`, param);
    }

    /**
     * @description to get the Office list
     * @param param: any - Request parameter that required to pass to api
     */
    moduleSubmitWorkFlow(submitUrl, param) {
        return this.httpClient.post(`${environment.baseUrl}${submitUrl}`, param);
    }
    /**
     * @description to get attachment List
     * @param param: any - Request parameter that required to pass to api
     */
    getAttachmentList(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_GET_ATTACH}`, param);
    }

    /**
     * @description to get attachment List
     * @param param: any - Request parameter that required to pass to api
     */
    getUploadedAttachmentList(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_GET_UPLOADED_ATTACH}`, param);
    }

    /**
     * @description to upload Attachment
     * @param param: any - Request parameter that required to pass to api
     */
    attachmentUpload(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_ATTACH_UPLOAD}`, param);
    }

    /**
     * @description to Delete Attachment
     * @param param: any - Request parameter that required to pass to api
     */
    attachmentDelete(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_ATTACH_DELETE}`, param);
    }

    /**
     * @description to Delete Attachment
     * @param param: any - Request parameter that required to pass to api
     */
    viewAttachment(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_ATTACH_VIEW}`, param);
    }

    /**
     * @description to Delete Attachment
     * @param param: any - Request parameter that required to pass to api
     */
    downloadAttachment(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.WORKFLOW_ATTACH_DOWNLOAD}`,
        param, { responseType: 'blob' as 'json' });
    }

    /**
     * @description To get the current user details and menu details
     */
    getCurrentUserDetail() {
        return new Promise(resolve => {
            const currentUser = this.storageService.get('currentUser');
            if (currentUser && currentUser['post']) {
                const loginPost = currentUser['post'].filter((item) => item['loginPost'] === true);
                if (loginPost && loginPost[0]['oauthTokenPostDTO'] &&
                    loginPost[0]['oauthTokenPostDTO']['edpMsMenuDtoList']) {
                    let wfRoleArray = [],
                        wfRoleCode, wfRoleCodeArray;
                        // tslint:disable-next-line:prefer-const
                        let menuData;
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
                    }
                    resolve({
                        'menuId': this.commonService.getMenuId(),
                        'linkMenuId': this.commonService.getLinkMenuId(),
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

    /**
     * @description To call post submit api call for transaction.
     * @param method: string - Method Type
     * @param url: string - API url
     * @param data: any - Data that required to pass to api
     */
    postSubmitApi(method: string, url: string, data: any) {
        switch (method) {
            case 'GET':
                return this.httpClient.get(`${environment.baseUrl}${url}`, data);
            case 'POST':
                return this.httpClient.post(`${environment.baseUrl}${url}`, data);
            default:
                break;
        }
    }

    /**
    * @description Print PDF View Comments
    * @param params params
    * @param url url of the API
    */
    viewComments(params, url) {
        return this.httpClient.post(`${environment.baseUrl}${url}`,params);
    }

}
