import { Injectable } from '@angular/core';
import { Router, Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad } from '@angular/router';
import { CommonService } from '../modules/services/common.service';
import { StorageService } from '../shared/services/storage.service';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanLoad, CanActivate {

    constructor(
        private router: Router,
        private commonService: CommonService,
        private storageService: StorageService
    ) { }

    canLoad(route: Route) {
        if (this.commonService.isUserLoggedIn()) {
            // logged in so return true
            // if (this.router.url.indexOf('dashboard') === -1) {
            //     this.router.navigate(['/dashboard'],{skipLocationChange: true});
            //     return false;
            // } else {
            // if (this.commonService.checkURLAuth(state.url)) {
                return true;
            // } else {
            //     this.router.navigate(['/dashboard'],{skipLocationChange: true});
            //     return false;
            // }
            // }
        }

        // not logged in so redirect to login page with the return url
        this.commonService.clearSessionTimeout();
        this.router.navigate(['/login'], { skipLocationChange: true});
        this.storageService.clear();
        return false;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.commonService.isUserLoggedIn()) {
            // logged in so return true
            // this.router.navigate(['/dashboard'],{skipLocationChange: true});
            // if (this.commonService.checkURLAuth(state.url)) {
                return true;
            // } else {
            //     this.router.navigate(['/dashboard'],{skipLocationChange: true});
            //     return false;
            // }
        }

        // not logged in so redirect to login page with the return url
        this.commonService.clearSessionTimeout();
        this.router.navigate(['/login'], { skipLocationChange: true});
        this.storageService.clear();
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.commonService.isUserLoggedIn()) {
            // logged in so return true
            // this.router.navigate(['/dashboard'],{skipLocationChange: true});
            // if (this.commonService.checkURLAuth(state.url)) {
                return true;
            // } else {
            //     this.router.navigate(['/dashboard'],{skipLocationChange: true});
            //     return false;
            // }
        }

        // not logged in so redirect to login page with the return url
        this.commonService.clearSessionTimeout();
        this.router.navigate(['/login'], { skipLocationChange: true});
        this.storageService.clear();
        return false;
    }
}
