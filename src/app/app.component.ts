import { StorageService } from './shared/services/storage.service';
import { Router, RouterEvent, RouteConfigLoadStart, NavigationEnd, RouteConfigLoadEnd } from '@angular/router';
import { CommonService } from './modules/services/common.service';
import { environment } from 'src/environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouteService } from './shared/services/route.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
    title = 'app';
    spinnerSubscribe: any;
    showSpinner = false;
    showModuleSpinner = false;
    routerSubscribe: any;
    constructor(
        private commonService: CommonService,
        private router: Router,
        /**
         * don't delete this service (RouteService) even it is not used in this component,
         * it is required to store the routing history
         * */
        private routeService: RouteService,
        private stoageService: StorageService
    ) { }
    ngOnInit() {
        window['buildVersion'] = environment.buildVersion; // 
        window['releaseVersion'] = environment.releaseVersion; // 
        const self = this;
        const userInfo = this.stoageService.get('currentUser');
        if (userInfo.isFirstLogin || userInfo.isResetPwd) {
            self.router.navigate(['/password/change-password'], { skipLocationChange: true });
        }
        // else {
        //     self.router.navigate(['/dashboard'], { skipLocationChange: true });
        // }
        this.spinnerSubscribe = this.commonService.getSpinnerEvent().subscribe((res) => {
            setTimeout(function () {
                self.showSpinner = res.showSpinner === true;
            });
        });
        this.routerSubscribe = this.router.events.subscribe(routerEvent => {
            if (routerEvent instanceof RouteConfigLoadStart) {
                self.showModuleSpinner = true;
            } else if (routerEvent instanceof RouteConfigLoadEnd) {
                self.showModuleSpinner = false;
            } else if (routerEvent instanceof NavigationEnd) {
                this.commonService.scrollToTop();
            }
        });
    }

    ngOnDestroy(): void {
        this.routerSubscribe.unsubscribe();
        this.spinnerSubscribe.unsubscribe();
    }
}
