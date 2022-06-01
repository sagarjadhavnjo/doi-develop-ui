import { Injectable } from '@angular/core';
import { Router, Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad } from '@angular/router';
import { CommonService } from '../modules/services/common.service';

@Injectable({ providedIn: 'root' })
export class NonAuthGuard implements CanLoad, CanActivate {

    constructor(private router: Router, private commonService: CommonService) { }

    canLoad(route: Route) {
        if (!this.commonService.isUserLoggedIn()) {
            // logged in so return true
            // if (this.router.url.indexOf('dashboard') === -1) {
            //     this.router.navigate(['/dashboard'],{skipLocationChange: true});
            //     return false;
            // } else {
            return true;
            // }
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/dashboard'], { skipLocationChange: true });
        return false;
    }

    canActivate(route: ActivatedRouteSnapshot) {
        if (!this.commonService.isUserLoggedIn()) {
            // logged in so return true
            // this.router.navigate(['/dashboard'],{skipLocationChange: true});
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/dashboard'], { skipLocationChange: true });
        return false;
    }
}
