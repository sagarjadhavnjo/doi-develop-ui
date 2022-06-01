import { APIConst } from './../../shared/constants/common/common-api.constants';
import { Injectable, Renderer2, RendererFactory2, EventEmitter, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/shared/services/storage.service';
import { debounceTime } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
    providedIn: 'root'
})
export class CommonService implements OnDestroy {
    public _menuId;
    public _linkMenuId;
    public _linkMenuWfRoleId;
    public _menuCode;
    public _menu;
    public _officeTypeId;
    public _wfRoleId;
    private renderer: Renderer2;
    private keyBoardData = { isSave: false, isNew: false };
    public keyBoardObservable: BehaviorSubject<any> = new BehaviorSubject(this.keyBoardData);
    updateNotificationCount$ = new BehaviorSubject<any>(0);
    // public conditionalData: any[] = [];

    inactivityTimerEvent: Array<any>[] = [
        [document, 'click'],
        [document, 'wheel'],
        [document, 'mousemove'],
        [document, 'keyup']
    ];

    mergedObservable$: Observable<any> = null;
    mergedSubscription$: Subscription;

    conditionalSource = new EventEmitter();
    conditionalData = [];
    dialogRef: any;
    sessionPopupTimer: any = null;
    sessionTimer: any = null;
    removeSpinnerEmitter: EventEmitter<any> = new EventEmitter();
    constructor(
        private router: Router,
        private rendererFactory: RendererFactory2,
        private httpClient: HttpClient,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private storageService: StorageService,
        private _ngZone: NgZone
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
        this.createMouseMoveOrWheelObservable();
    }

    ngOnDestroy() {
        this.unSubscribeMouseMoveEvent();
    }

    public scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    public getMenuId() {
        return this._menuId;
    }
    public setMenuId(value) {
        if (value) {
            this._menuId = value;
        }
    }

    public getLinkMenuId() {
        return this._linkMenuId;
    }
    public setLinkMenuId(value) {
        if (value) {
            this._linkMenuId = value;
        }
    }

    /**
     * @description To set the Link menu workflow role details
     */
    public getLinkMenuWfRoleId() {
        return this._linkMenuWfRoleId;
    }
    /**
     * @description To get the Link menu workflow role details
     */
    public setLinkMenuWfRoleId(value) {
        if (value) {
            this._linkMenuWfRoleId = value;
        }
    }

    public getMenuCode() {
        return this._menuCode;
    }
    public setMenuCode(value) {
        if (value) {
            this._menuCode = value;
        }
    }

    public getMenu() {
        return _.cloneDeep(this._menu);
    }

    public setMenu(menu) {
        this._menu = menu;
    }

    public getOfficeTypeId() {
        return this._officeTypeId;
    }
    public setOfficeTypeId(value) {
        if (value) {
            this._officeTypeId = value;
        }
    }

    public getwfRoleId() {
        return this._wfRoleId;
    }
    public setwfRoleId(value) {
        if (value) {
            this._wfRoleId = value;
        }
    }

    checkURLAuth(url) {
        const menu = this.storageService.get('menu');
        let checkURLAuth = false;
        if (menu) {
            for (let i = 0; i < menu.length; i++) {
                const menuItem = menu[i];
                if (menuItem['menuLink']) {
                    if (menuItem['menuLink'].indexOf(url) !== -1) {
                        checkURLAuth = true;
                        break;
                    }
                }
                if (menuItem['menuDtos'] && menuItem['menuDtos'].length > 0) {
                    if (this.checkForInternalMenuLink(menuItem['menuDtos'], url)) {
                        checkURLAuth = true;
                        break;
                    }
                }
            }
        }
        return checkURLAuth;
    }

    checkForInternalMenuLink(menu, url) {
        let checkForInternalMenuLink = false;
        for (let j = 0; j < menu.length; j++) {
            const menuItem = menu[j];
            if (menuItem['menuLink']) {
                if (menuItem['menuLink'].indexOf(url) !== -1) {
                    checkForInternalMenuLink = true;
                    break;
                }
            }
            if (menuItem['menuDtos'] && menuItem['menuDtos'].length > 0) {
                if (this.checkForInternalMenuLink(menuItem['menuDtos'], url)) {
                    checkForInternalMenuLink = true;
                    break;
                }
            }
        }
        return checkForInternalMenuLink;
    }

    isUserLoggedIn() {
         const loginDetails = this.storageService.get('currentUser');
        if (loginDetails && loginDetails.access_token) {
            // this.handleAutoLogout(this.storageService.get('idleTimeout'), this.storageService.get('refresh_token'));
            this.subscribeMouseMoveEvent();
            this.refreshSessionTimer();
            return true;
        }
        return false;
    }

    checkKeyboardEvent(): Observable<any> {
        this.renderer.listen('document', 'keydown', e => {
            // alt+s
            if (e.altKey && e.keyCode === 83) {
                this.keyBoardData.isSave = true;
                this.keyBoardObservable.next(this.keyBoardData);
            }
            // alt+n
            if (e.altKey && e.keyCode === 78) {
                this.keyBoardData.isNew = true;
                this.keyBoardObservable.next(this.keyBoardData);
            }
        });
        return this.keyBoardObservable;
    }

    defaultKeyboardData() {
        this.keyBoardData.isNew = false;
        this.keyBoardData.isSave = false;
    }

    filterObjValue(arrValue, searchValue, filteredValue) {
        if (!arrValue) {
            return;
        }
        // get the search keyword
        let search = searchValue;
        if (!search) {
            filteredValue.next(arrValue.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the values
        filteredValue.next(arrValue.filter(item => item.viewValue.toLowerCase().indexOf(search) > -1));
    }

    getConditionalIds() {
        const self = this;
        return new Promise((resolve, reject) => {
            if (this.conditionalData.length > 0) {
                resolve(self.conditionalData);
            } else {
                self.callConditionalData().subscribe(
                    res => {
                        if (res && res['result'] && res['result'].length > 0) {
                            self.conditionalData = res['result'];
                            resolve(self.conditionalData);
                        } else {
                            reject({ message: 'Do not find the data' });
                        }
                    },
                    err => {
                        reject(err);
                    }
                );
            }
        });
    }

    callConditionalData(params = { name: 'ConditionCheck' }) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.GET_CONDITIONAL_IDS}`, params);
    }

    getConditionalData() {
        // return this.conditionalData;
    }

    /**
     * Check if stored token in localstorage is still exists or not.
     * Comparing last login time to current time.
     * Check difference bw last logged_in time to current time and get total difference seconds.
     * Compare result seconds to expired_in values which stored in localstorage.
     */
    isTokenStillExists() {
        const lastLoggedIn = this.storageService.get('lastLoggedIn');
        const diffToLastLoggedIn = new Date().getTime() - new Date(lastLoggedIn).getTime();
        const differenceInSeconds = Math.abs(diffToLastLoggedIn / 1000);
        const expiresIn = this.storageService.get('idleTimeout');
        // tslint:disable-next-line:radix
        if (differenceInSeconds >= parseInt(expiresIn)) {
            return false;
        }
        return true;
    }

    logout() {
        this.unSubscribeMouseMoveEvent();
        sessionStorage.clear();
        this.clearSessionTimeout();
        this.dialog.closeAll();
        this.authService.logout();
        this.resetMenuInfo();
    }

    resetMenuInfo() {
        this._menuId = null;
        this._linkMenuId = null;
        this._menuCode = null;
        this._menu = null;
        this._officeTypeId = null;
        this._wfRoleId = null;
    }

    handleAutoLogout(idleTimeout, refreshToken) {
        idleTimeout = idleTimeout ? idleTimeout : 900000;
        if (!this.sessionTimer) {
            this.sessionTimer = setTimeout(() => {
                this.clearSessionTimeout();
                this.authService.logoutForSession().subscribe(
                    resolve => {
                        this.resetMenuInfo();
                        this.toastr.error('Session Expired! You have been logged out.');
                        this.authService.clearData();
                        this.dialog.closeAll();
                        this.unSubscribeMouseMoveEvent();
                    },
                    error => {
                        // this.toastr.error('Unable to Logout');
                        this.unSubscribeMouseMoveEvent();
                    }
                );
            }, idleTimeout);
        }
    }


    subscribeMouseMoveEvent() {
        if (!this.mergedObservable$) {
            this.createMouseMoveOrWheelObservable();
        }
        this.mergedSubscription$ = this.mergedObservable$.pipe(debounceTime(1500)).subscribe(() => {
            const loginDetails = this.storageService.get('currentUser');
            if (loginDetails && loginDetails.access_token) {
                this.refreshSessionTimer();
            }
        });
    }

    unSubscribeMouseMoveEvent() {
        this.mergedSubscription$.unsubscribe();
    }

    refreshSessionTimer() {
        this.clearSessionTimeout();
        this.handleAutoLogout(this.storageService.get('idleTimeout'), this.storageService.get('refresh_token'));
    }

    clearSessionTimeout() {
        clearTimeout(this.sessionTimer);
        clearTimeout(this.sessionPopupTimer);
        this.sessionTimer = null;
        this.sessionPopupTimer = null;
    }


    createMouseMoveOrWheelObservable() {
        this._ngZone.runOutsideAngular(() => {
            const observableArray$: Observable<any>[] = [];
            this.inactivityTimerEvent.forEach(x => {
                observableArray$.push(fromEvent(x[0], x[1]))
            });
            this.mergedObservable$ = merge(...observableArray$);
        });
    }

    removeLoader() {
        this.removeSpinnerEmitter.emit({ showSpinner: false });
    }

    showLoader() {
        this.removeSpinnerEmitter.emit({ showSpinner: true });
    }

    getSpinnerEvent() {
        return this.removeSpinnerEmitter;
    }

    getAllFinancialYears() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_FINANCIAL_YEARS}`, {});
    }

    getMonth(data) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_MONTH}`, data);
    }

    getAllDepartmanets() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_DEPARTMENTS}`, {});
    }


    getAllDeptSorted() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_DEPT}`, {});
    }


    getAllBranch(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_BRANCH}`, params);
    }

    getAllEstimateFrom() {
        // return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_ESTIMATE_FROM}`, {});
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ESTIMATE_FROM}`, {});
    }

    getAllEstimateFor(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_ESTIMATE_FOR}`, params);
    }

    getAllDemand(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_DEMAND}`, params);
    }

    getRevenueCapital(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_REVENUE_CAPITAL}`, params);
    }

    getAllMajorHead(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_MAJOR_HEAD}`, params);
    }

    getAllSubMajorHead(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_SUB_MAJOR_HEAD}`, params);
    }


    getAllSubMajorHeadByMajorHead(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_SUB_MAJOR_HEAD_BYMAJOR_ID}`, params);
    }

    getAllMinorHead(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_MINOR_HEAD}`, params);
    }

    getAllMinorHeadByMajorHead(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_MINOR_HEAD_BYMAJOR_ID}`, params);
    }

    getAllSubHead(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_SUB_HEAD}`, params);
    }


    getAllSubHeadByMajorHead(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_SUB_HEAD_BYMAJOR_ID}`, params);
    }

    getAllDetailHead(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_DETAIL_HEAD}`, params);
    }

    getAllDetailHeadByMajorHead(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_DETAIL_HEAD_BYMAJOR_ID}`, params);
    }

    getAllObjectHead() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_ALL_OBJECT_HEAD}`, {});
    }

    getObjectHeadForReciept(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.GET_RECIPET_OBJECT_HEAD}`, params);
    }
    getSchemeList() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.SCHEME_LIST}`, {});
    }

    getFormList() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.FORM_LIST}`, {});
    }

    getItemCategoryList() {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.HEADER.ITEM_CATEGORY_LIST}`, {});
    }
    getSwitchPost(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.PROFILE.SWITCH_POST}`, params);
    }
    // getEstList(params) {
    //     return this.httpClient.post(`${environment.baseUrl}${APIConst.SEARCH.SEARCH_ALL}`, params);
    // }
    saveWorkFlowDetails(data: any): Observable<any> {
        const endurl = 'common/wf/trn/save/101';
        return this.httpClient.post(`${environment.baseUrl}${endurl}`, data);
        // .pipe(catchError(this.handleError));
    }

    /**
     * @author Dwarkesh Modi
     * @description check major head for disbursement amount
     * @param majorHeadCode send code of majorhead
     * @returns boolean value
     */
    isDisbursementColumnShow(majorHeadCode): boolean {
        if (Number(majorHeadCode) < 8000) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * @author Dwarkesh Modi
     * @description check major head for object head column hide-show
     * @param majorHeadCode send code of majorhead
     * @returns boolean value
     */
    isObjectHeadColumnShow(majorHeadCode): boolean {
        if (Number(majorHeadCode) === 1601) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * get the workflowroleid and Menuid
     */
    getMenuIdWorkFlowId() {
        return this.storageService.get('menu')[0].menuDtos[0].menuDtos[0];
    }

    /**
     * get the Post name
     */
    getPostName() {
        return this.storageService.get('currentUser').post[0].postName;
    }

    getNotificationList(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.NOTIFICATION.GET_NOTIFICATION_LIST}`, params);
    }

    getNotificationCount(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.NOTIFICATION.GET_NOTIFICATION_COUNT}`, params);
    }

    getUpdatedNotification(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.NOTIFICATION.UPDATE_NOTIFICATION_COUNT}`, params);
    }


    /**
     * Called when Pagination Update
     *
     * @param {PageEvent} event
     * @param {*} paginationInfo
     * @param {[]} storedData
     *
     * @memberOf ReceiptManagementService
     */
    updatePaginationEventOnPageChange(event: PageEvent, paginationInfo: any, storedData: []) {
        if (
            event != null &&
            event.pageIndex < event.previousPageIndex &&
            paginationInfo.iteratablePageIndex - 1 === Math.ceil(paginationInfo.pageElements / paginationInfo.pageSize)
        ) {
            paginationInfo.iteratablePageIndex = Math.ceil(paginationInfo.pageElements / paginationInfo.pageSize) - 1;
            /*
              Below if Condition is to handle button of 'Go First Page'
              Reset iteratablePageIndex to 0
            */
            if (
                event !== null &&
                event.previousPageIndex > event.pageIndex &&
                event.previousPageIndex - event.pageIndex > 1
            ) {
                paginationInfo.iteratablePageIndex = 0;
            }
        } else if (
            event != null &&
            event.pageIndex > event.previousPageIndex &&
            event.pageIndex - event.previousPageIndex > 1
        ) {
            /**
             * else if conditin to handle button of 'Go Last Page'
             * reset iteratablePageIndex to last pageIndex of particular pageSet
             */
            paginationInfo.iteratablePageIndex = Math.ceil(storedData.length / paginationInfo.pageSize) - 1;
        } else {
            paginationInfo.iteratablePageIndex = 0;
        }
    }

    /**
     * Update Pagination when Button is clickied
     *
     * @param {PageEvent} event
     * @param {*} paginationInfo
     *
     * @memberOf ReceiptManagementService
     */
    updatePaginationOnButtonsClicked(event: PageEvent, paginationInfo: any) {
        paginationInfo.pageSize = event.pageSize;
        paginationInfo.pageIndex = event.pageIndex;
        if (event.pageIndex < event.previousPageIndex) {
            paginationInfo.iteratablePageIndex = paginationInfo.iteratablePageIndex - 1;
            if (paginationInfo.iteratablePageIndex < 0 || event.previousPageIndex - event.pageIndex > 1) {
                paginationInfo.iteratablePageIndex =
                    Math.ceil(paginationInfo.pageElements / paginationInfo.pageSize) + 1;
                paginationInfo.pageIndex = 1;
            }
        } else if (event.pageIndex === event.previousPageIndex) {
            paginationInfo.iteratablePageIndex = 0;
        } else if (event.pageIndex > event.previousPageIndex && event.pageIndex - event.previousPageIndex > 1) {
            paginationInfo.iteratablePageIndex = event.pageIndex;
        } else {
            paginationInfo.iteratablePageIndex = paginationInfo.iteratablePageIndex + 1;
        }
    }

    loadCommonAttachmentList(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ATTACHMENT.LOAD_ATTACHMENT_LIST}`,
            param
        );
    }

    viewAttachment(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ATTACHMENT.VIEM_ATTACHMENT}`,
            params
        );
    }

    downloadAttachment(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ATTACHMENT.DOWNLOAD_ATTACHMENT}`,
            params, { responseType: 'blob' as 'json' }
        );
    }

    uploadAttachment(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ATTACHMENT.UPLOAD_ATTACHMENT}`,
            params
        );
    }


    getAttachmentTypes(params) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ATTACHMENT.ATTACHMENT_TYPE}`,
            params);
    }

    attachmentDelete(param) {
        return this.httpClient.post(`${environment.baseUrl}${APIConst.ATTACHMENT.DELETE_ATTACHMENT}`, param);
    }

    adviceForAccuredInterest(params, url) {        
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }
    
    getAccoutType(params, url) {        
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }

    getInvestmentForm(params, url) {        
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }
    getYearsOfMaturity(params, url) {        
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }

    getTypeofTranscation(params, url) {        
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }

    intimationforPurchaseSale(params, url) {        
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }
    

    getNameSecurity(params, url) {        
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }

    getIntimationData(params, url) {        
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }

    saleofSecurities(params, url) {        
        return this.httpClient.post(`${environment.baseUrl}${url}`, params);
    }
}
