import { DataConst } from './../../shared/constants/common/common-data.constants';
import { Router } from '@angular/router';
import { Login } from './../../models/login.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APIConst } from 'src/app/shared/constants/common/common-api.constants';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MatDialog } from '@angular/material/dialog';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private grantType = 'password';
    constructor(
        private http: HttpClient,
        private router: Router,
        private storageService: StorageService,
        private dialogRef: MatDialog
    ) { }

    login(loginInfo: Login) {
        // username: string, password: string
        const self = this,
            headers = new HttpHeaders({
                Authorization: 'Basic ' + window.btoa('client:admin'),
                'Content-type': 'application/x-www-form-urlencoded'
            });
        const requestBody = new HttpParams()
            .set('grant_type', self.grantType)
            .set('username', loginInfo.userName)
            .set('password', encodeURIComponent(loginInfo.password));
        return this.http.post<any>(environment.baseUrl + APIConst.LOGIN, requestBody.toString(), {
            headers: headers
        }).pipe(map(userDetails => {
            // login successful if there's a jwt token in the response
            if (userDetails && userDetails.access_token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
            }
            return userDetails;
        }));
    }

    clearData() {
        this.storageService.remove('currentUser');
        this.storageService.remove('userName');
        this.storageService.remove('menu');
        this.storageService.remove('access_token');
        this.storageService.remove('refresh_token');
        this.storageService.remove('expires_in');
        this.storageService.remove('idleTimeout');
        this.storageService.remove('userOffice');
        this.storageService.clear();
        this.dialogRef.closeAll();
        this.router.navigate(['/login'], { skipLocationChange: true });
    }

    logoutForSession() {
        // remove user from local storage to log user out
        const headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded'
        });
        const requestBody = new HttpParams();
        return this.http.post<any>(environment.baseUrl + APIConst.LOGOUT, requestBody.toString(), {
            headers: headers
        }).pipe(map(userDetails => {
            // remove user from local storage to log user out
            this.storageService.clear();
            return userDetails;
        }));
    }

    logout(fromInterceptor?) {
        // remove user from local storage to log user out
        if (!fromInterceptor) {
            const headers = new HttpHeaders({
                'Content-type': 'application/x-www-form-urlencoded'
            });
            const requestBody = new HttpParams();
            this.http
                .post<any>(environment.baseUrl + APIConst.LOGOUT, requestBody.toString(), {
                    headers: headers
                })
                .subscribe(
                    userDetails => {
                        // remove user from local storage to log user out
                        this.clearData();
                    },
                    err => {
                        this.clearData();
                    }
                );
        } else {
            this.clearData();
        }
    }

    /**
     * extend the user session by replacing new token
     * params refreshToken='Refresh Token', grant_type = 'password'
     */
    extendToken(refreshToken: any) {
        const headers = new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded'
        });
        const requestBody = new HttpParams().set('refresh_token', refreshToken).set('grant_type', this.grantType);
        return this.http.post<any>(
            environment.baseUrl + APIConst.EXTEND_SESSION,
            requestBody.toString(),
            { headers: headers }
        );
    }

    setLocalStorage(obj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const transactionInfo = obj.result ? this.verifyLoginPostAndTransactionDetail(obj.result) : null;
            const post = obj.result.post;
            let loginPost;
            this.storageService.set('currentUser', obj.result);
            this.storageService.set('userName', obj.result.username);
            this.storageService.set('access_token', obj.result.access_token);
            this.storageService.set('refresh_token', obj.result.refresh_token);
            this.storageService.set('expires_in', obj.result.expires_in);
            this.storageService.set('idleTimeout', obj.result.idleTimeout);
            this.storageService.set('lastLoggedIn', new Date().toString());
            this.storageService.set('usertype', obj.result.usertype);
            post.forEach(el => {
                if (el.loginPost) {
                    loginPost = el;
                }
            });
            if (loginPost) {
                this.storageService.set('menu', loginPost.oauthTokenPostDTO.edpMsMenuDtoList);
                this.storageService.set('userOffice', loginPost.oauthTokenPostDTO.edpMsOfficeDto);
            }
            resolve({ result: obj.result, transactionInfo: transactionInfo });
        });
    }

    /**
     *  get current user primary office for validating ui access.
     *  @return string : null for office not found.
     */
    getLoginUserPrimaryOfficeTypeName(): string {
        const userOffice = this.storageService.get('userOffice');
        const obj = JSON.parse(JSON.stringify(userOffice));
        if (obj.isFd === 2) {
            return DataConst.OFFICE_TYPE.FD_OFFICE;
        } else if (obj.officeTypeId === 52) {
            return DataConst.OFFICE_TYPE.AD_OFFICE;
        } if (obj.officeTypeId === 54 || obj.isHod === 2) {
            return DataConst.OFFICE_TYPE.HOD_OFFICE;
        } else if (obj.isCo === 2 && obj.officeTypeId === 54) {
            return DataConst.OFFICE_TYPE.HOD_OFFICE;
        } else if (obj.isCo === 2 && obj.officeTypeId === 71) {
            return DataConst.OFFICE_TYPE.HOD_OFFICE;
        } else if (obj.officeTypeId === 71) {
            return DataConst.OFFICE_TYPE.DDO_OFFICE;
        } else {
            return null;
        }
    }

    /**
     * Verify transaction access detail of logged in user
     * @param currentUserInfo current user info
     */
    private verifyLoginPostAndTransactionDetail(currentUserInfo) {
        const loginPostInfo = this.getLoginPostDetail(currentUserInfo);
        if (loginPostInfo && loginPostInfo.oauthTokenPostDTO) {
            const oauthTokenPostDTO = loginPostInfo.oauthTokenPostDTO;
            if (oauthTokenPostDTO && !oauthTokenPostDTO.transactionAllow) {
                return {
                    transactionAllow: oauthTokenPostDTO.transactionAllow,
                    transactionMessage: oauthTokenPostDTO.transactionMessage
                };
            }
        }
        return null;
    }

    /**
     * Get post detail of logged in user
     * @param currentUserInfo current user info
     */
    private getLoginPostDetail(currentUserInfo) {

        if (currentUserInfo && currentUserInfo.post) {
            const loginPost = currentUserInfo.post.find(p => p.loginPost);

            if (loginPost) {
                return loginPost;
            }
        }
        return null;
    }
}
