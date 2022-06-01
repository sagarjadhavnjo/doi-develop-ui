import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/edp/edp-api.constants';
@Injectable({
    providedIn: 'root'
})
export class EdpPostService {

    constructor(private httpClient: HttpClient) { }

    /**
     * @method getPostDetails
     * @description Function is called to get post details from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getPostDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST.POST_DETAILS}`, params);
    }

    /**
     * @method postCountDetails
     * @description Function is called to get post count details from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    postCountDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST.POST_COUNT}`, params);
    }
    
    /**
     * @method savePostDetails
     * @description Function is called to save post details in server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    savePostDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST.SAVE_POST}`, params);
    }

     /**
   * @description Get Attachment data
   */
    loadAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.DDO_OFFICE.ATTACHMENT.ATTACHMENT_LIST_NAME}`,
            params
        );
    }

     /**
   * @description Get Attachment data
   */
    loadListAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST.LOAD_ATTACHMENT_LIST}`,
            params
        );
    }

    /**
      * @description Save/Upload Attachment Details
      */
    uploadAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST.UPLOAD_ATTACHMENT}`,
            params
        );
    }

    /**
     * @description Delete Attachment
     * @param params id
     * @param moduleName event name
     */
    deleteAttachment(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST.DELETE_ATTACHMENT}`,
            params
        );
    }

     /**
     * @method getPostList
     * @description Function is called to get post List from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getPostList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST.POST_LIST}`, params);
    }

     /**
     * @method loadPostDeatail
     * @description Function is called to load post details from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    loadPostDeatail(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST.POST_GET_DETAILS}`, params);
    }

     /**
     * @method getPostDetails
     * @description Function is called to update post details in server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    updatePostDetails(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST.UPDATE_POST}`, params);
    }

     /**
     * @method deletePost
     * @description Function is called to delete post details in server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    deletePost(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST.DELETE_POST}`,
            params
        );
    }

     /**
     * @method availabelVacantPost
     * @description Function is called to give available vacant post from server
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    availabelVacantPost(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST.AVAILABEL_VACANT_POST}`,
            params
        );
    }

     /**
     * @method getHeaderDetails
     * @description get Logged in User Details
     * @param params is paramters to get desired output
     * @returns Observable for the API call
     */
    getHeaderDetails(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST_CREATE.LIST.HEADER_SUBMIT_POPUP}`,
            params
        );
    }

    /**
     * @description Get value for workflow poup required or not
     * @param param workflow parameters
     */
    getValueForCheckWorkFlowPopup(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.POST_CREATE.CHECK_FOR_WORKFLOW_CALL}`
        , params);
    }

    /**
     * @description Get listing status
     */
    getListingStatus(params) {
        return this.httpClient.post(
            `${environment.baseUrl}${APIConst.POST_CREATE.LIST.GET_STATUS}`,
            params
        );
    }
}
