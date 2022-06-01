import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import {
    RouterModule, Routes,
} from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AppLayoutComponent } from './containers/_layout/app-layout/app-layout.component';
import { SiteLayoutComponent } from './containers/_layout/site-layout/site-layout.component';
import { NonAuthGuard } from './guards/non-auth-guard';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: '',
        component: SiteLayoutComponent,
        canActivate: [NonAuthGuard],
        children: [{
            path: 'login',
            loadChildren: () => import('./modules/non-auth/non-auth.module').then(m => m.NonAuthModule),
            canLoad: [NonAuthGuard]
        }]
    },
    {
        path: 'dashboard',
        component: AppLayoutComponent,
        canActivate: [AuthGuard],
        children: [{
            path: '',
            // loadChildren: () => import('./modules/core/core.module').then(mod => mod.CoreModule),
            loadChildren: () => import('./modules/core/core.module').then(m => m.CoreModule),
            canLoad: [AuthGuard]
        }]
    },
    {
        path: 'password',
        loadChildren: () => import('./shared/password-module/password.module').then(m => m.PasswordModule)
    },
	/*{
        path: 'doi',
        loadChildren: () => import('./modules/doi/doi.module').then(m => m.DoiModule)
    },*/
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes, { useHash: true }
        )
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: [AuthGuard, NonAuthGuard]
})
export class AppRoutingModule { }
