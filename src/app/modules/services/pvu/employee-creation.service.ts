import { CommonService } from './../common.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DataConst } from 'src/app/shared/constants/pvu/pvu-data.constants';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class EmployeeCreationService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  testHeader = new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  });

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private commonService: CommonService
  ) { }
  getEmployeeList(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_LIST.GET_ALL}`,
      params, { headers: this.headers });
  }
  deleteEmployee(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_LIST.DELETE}`, params);
  }
  getPayMasters(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.GET_PAY_SCALE}`, params);
  }

  getPresentOffice(districtId, ddoNo , cardexNo) {
    return this.httpClient.post(`${environment.baseUrl}${
      APIConst.EMPLOYEE_CREATION.DEPARTMENTAL.GET_OFFICE_BY_DDO_CARDEX}?districtId=` + districtId +
    `&dooNo=` + ddoNo + `&cardexNo=` + cardexNo, {});
  }

  /**
   * @description To get the Entry pay(pay band value) for 6th pay commission based on the pay band
   * @param params request Parameter
   */
  getEntryPay(params) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.GET_PAY_ENTRY_PAY}`, params
    );
  }

  /**
   * @description To get the Approver name and designation
   * @param params request parameter
   */
  getApproverDetails(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.APPROVER_DETAIL}`, params);
  }
  getLookUPInfoData(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_LIST.LOOKUP_DATA}`,
      params, { headers: this.headers });
  }

  /**
   * @description To get the designation list
   * @param params request parameter
   */
  getDesignationList(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_LIST.DESIGNATION_LIST}`,
      params, { headers: this.headers });
  }
  getAllEvents(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.EVENTS.GET_ALL}`,
      params, { headers: this.headers });
  }

  getJoiningPayEvents(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.EVENTS.GET_JOINING_PAY}`,
      params, { headers: this.headers });
  }

  getPayCommissionEvents(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.EVENTS.GET_FIVE_SIX_SEVEN}`,
      params, { headers: this.headers });
  }

  getOtherEvents(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.EVENTS.GET_OTHER}`,
      params, { headers: this.headers });
  }

  /**
   * @description To get the event ID for given transaction number
   * @param params Request Parameters
   */
  getEventIdByEventDetail(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.EVENTS.GET_EVENT_ID}`,
      params, { headers: this.headers });
  }

  getTransferEvents(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.EVENTS.GET_TRANSFER}`,
      params, { headers: this.headers });
  }

  getEmployeeByID(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PERSONAL_DETAIL.GET}`,
      params, { headers: this.headers });
  }
  checkDuplicatePAN(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PERSONAL_DETAIL.CHECK_PAN}`, param,
      { headers: this.headers });
  }
  getLookUpInfoData() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.LOOKUPINFO}`, '',
      { headers: this.headers });
  }

  getOfficeType(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_LIST.OFFICE_TYPE}`, param,
      { headers: this.headers });
  }

  /**
   * @method getOfficeNameList
   * @description to get office name list by office type
   */
  getOfficeNameList(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_LIST.OFFICE_NAME_LIST}`, param,
      { headers: this.headers });
  }

  savePersonalDetail(data) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PERSONAL_DETAIL.SAVE}`,
      data);
  }

  deleteNominee(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PERSONAL_DETAIL.DELETE_NOMINEE}`,
      param
    );
  }

  deleteNomineeAttachment(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PERSONAL_DETAIL.DELETE_NOMINEE_ATTACHMENT}`,
      param
    );
  }

  deleteEmpPhoto(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PERSONAL_DETAIL.DELETE_EMP_PHOTO}`,
      param
    );
  }

  submitEditableDetail(data) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.EDITABLE_SUBMIT}`,
      data);
  }

  savePayDetail(data) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.SAVE}`,
      data, { headers: this.headers });
  }

  getPayDetails(data) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.GET}`,
      data, { headers: this.headers });
  }

  getSixPayDesignation() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.MASTER_DESIGNATION}`, '');
  }

  getLstSDTData() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.MASTER_LSTSDT}`, '');
  }

  getDistrict(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.MASTER_DISTRICT}`, param);
  }

  getTaluka(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.MASTER_TALUKA}`, param);
  }

  getAdministrativeDepartment() {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.MASTER_ADMINISTRATIVE_DEPARTMENT}`, '');
  }

  saveQualificationDetails(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.QUALIFICATION.CREATE}`, params);
  }

  getQualificationDetail(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.QUALIFICATION.GET}`, param);
  }

  updateQualificationDetail(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.QUALIFICATION.UPDATE}`, params);
  }

  deleteQualExam(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.QUALIFICATION.DELETE_QUAL_EXAM}`,
      param
    );
  }

  deleteDeptExam(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.QUALIFICATION.DELETE_DEPT_EXAM}`,
      param
    );
  }

  deleteCCCExam(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.QUALIFICATION.DELETE_CCC_EXAM}`,
      param
    );
  }

  deleteLangExam(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.QUALIFICATION.DELETE_LANG_EXAM}`,
      param
    );
  }

  saveDepartmentalDetails(params) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.DEPARTMENTAL.CREATE}`, params);
  }

  getDepartmentalDetail(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.DEPARTMENTAL.GET}`, param);
  }

  deletePrevHistory(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.DEPARTMENTAL.DELETE_PREV_HISTORY}`,
      param
    );
  }

  get7thCPCBasicPay(param) {
    return this.httpClient.post(`${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.BASIC_PAY}`, param);
  }
  getOfficeByDistrict(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.DEPARTMENTAL.GET_OFFICE_BY_DISTRICT_ID}`, param);
  }
  getDuplicatePanDetail(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.EMPLOYEE_VIEW.GET_DUPLICATE_PAN}`, param);
  }
  getWorkFlowAssignmentOpt(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.WORKFLOW.GET_ASSIGN_OPT}`, param);
  }
  getWorkFlowEmpDetail(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.WORKFLOW.GET_EMP_DETAIL}`, param);
  }
  getWorkFlowUsers(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.WORKFLOW.GET_USERS}`, param);
  }
  submitWorkFlow(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.WORKFLOW.SUBMIT}`, param);
  }
  getAttachmentByMenuId(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PERSONAL_DETAIL.GET_ATTACHMENT}`, param);
  }
  upload(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.UPLOAD}`, param);
  }
  getWorkFlowReview(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.WORKFLOW.GET_REVIEW}`, param);
  }
  downloadAttachment(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PERSONAL_DETAIL.DOWNLOADATTACHMENT}`,
      param,
      { responseType: 'blob' as 'json' }
    );
  }
  getWorkFlowStatus(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_LIST.WORKFLOW_STATUS}`, param);
  }
  getPayScale() {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.PAY_DETAIL.GET_PAY_SCALE}`, {});
  }
  getSubOffice(param) {
    return this.httpClient.post(
      `${environment.baseUrl}${APIConst.EMPLOYEE_CREATION.DEPARTMENTAL.GET_SUB_OFFICE}`, param);
  }
  /* getCurrentUserDetail() {
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
  } */
  getCurrentUserDetail(param?) {
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
              if (param) {
                const wfRoleData = this.commonService.getwfRoleId();
                wfRoleArray = wfRoleData.map(elm => elm.wfRoleIds);
                wfRoleArray = [].concat(...wfRoleArray);
                wfRoleCodeArray = wfRoleData.map(elmCode => elmCode.wfRoleCode); 
                wfRoleCodeArray = [].concat(...wfRoleCodeArray);   
                wfRoleCode = wfRoleCodeArray; 
              } else {
                const wfRoleData = this.commonService.getwfRoleId()[0];
                wfRoleArray = wfRoleData['wfRoleIds'];
                wfRoleCodeArray = wfRoleData['wfRoleCode'];
                wfRoleCode = (wfRoleData['wfRoleCode'] && wfRoleData['wfRoleCode'][0]) ? wfRoleData['wfRoleCode'][0] : '';
            }
            
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

  getCurrentUserMultipleRoleDetail() {
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

  getMenuDetailsForListing(subMenuId: number) {
    return new Promise(resolve => {
      const currentUser = this.storageService.get('currentUser');
      if (currentUser && currentUser['post']) {
        const loginPost = currentUser['post'].filter((item) => item['loginPost'] === true);
        // tslint:disable-next-line: max-line-length
        if (loginPost && loginPost[0]['oauthTokenPostDTO'] && loginPost[0]['oauthTokenPostDTO']['edpMsMenuDtoList']) {
          const parentMenu = cloneDeep(
            this.storageService.get('menu').filter(res => res.menuId === 3));
          if (parentMenu && parentMenu[0]) {
            const subMenu = cloneDeep(parentMenu[0]['menuDtos'].filter(res1 => res1.menuId === 17));
            if (subMenu && subMenu[0] && subMenuId) {
              const node = cloneDeep(subMenu[0]['menuDtos'].filter(res2 => res2.menuId === subMenuId));
              if (node[0]) {
                this.commonService.setLinkMenuId(node[0].linkMenuId);
                this.commonService.setMenu(node[0]);
                this.commonService.setwfRoleId(node[0].wfRoleId);
                this.commonService.setMenuId(node[0].menuId);
                this.commonService.setLinkMenuWfRoleId(node[0].linkMenuWfRoleId);
                this.commonService.setMenuCode(node[0].menuCode);
                resolve(true);
              }
            }
          }
        }
      }
    });
  }
}
