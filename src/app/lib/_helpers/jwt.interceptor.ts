import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/modules/services';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CommonService } from './../../modules/services/common.service';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    urls: string[] = [];
    constructor(
        public authenticationService: AuthenticationService,
        public commonService: CommonService,
        public storageService: StorageService,
        private toastr: ToastrService
        ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = this.storageService.get('currentUser'),
            self = this;
        if (isDevMode()) {
            this.urls.push(request.url);
        } else {
            this.urls.push(document.getElementsByTagName('base')[0].href + request.url);
        }
        if (this.urls.length === 1) {
            this.commonService.showLoader();
        }
        if (currentUser && currentUser.access_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.access_token}`
                },
                withCredentials: true
            });
        }
        return next.handle(request).pipe(
            tap(res => {
                if (res instanceof HttpResponse && res['status'] === 200) {
                    const urlMatch = self.urls.indexOf(res['url']);
                    if (urlMatch !== -1) {
                        self.urls.splice(urlMatch, 1);
                    }
                    if (self.urls.length === 0) {
                        this.commonService.removeLoader();
                    }
                    this.commonService.removeLoader();
                }
            }),
            catchError(err => {
                const urlIndex = self.urls.indexOf(err['url']);
                if (urlIndex !== -1) {
                    self.urls.splice(urlIndex, 1);
                }
                if (self.urls.length === 0) {
                    this.commonService.removeLoader();
                }
                if (err.status === 401 || err.status === 403) {
                    // auto logout if 401 response returned from api
                    this.commonService.clearSessionTimeout();
                    this.authenticationService.logout('from interceptor');
                    // location.reload(true);
                } else if (err.status === 404) {
                    this.toastr.error('Page not found!');
                } else if (err.status === 500) {
                    this.toastr.error('something went wrong!');
                } else if (err.status === 403) {
                    this.toastr.error('your session has expired!');
                    this.commonService.clearSessionTimeout();
                    this.authenticationService.logout('from interceptor');
                }

                const error = err.error.message || err.statusText;
                return throwError(error);
            }
            ));
    }
}

