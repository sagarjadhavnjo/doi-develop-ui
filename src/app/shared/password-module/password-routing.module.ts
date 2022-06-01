import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordComponent } from './password/password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard } from './../../guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonAuthGuard } from 'src/app/guards/non-auth-guard';
const routes: Routes = [
    {
        path: '',
        component: PasswordComponent,
        children: [{
            path: 'change-password',
            component: ChangePasswordComponent,
            canActivate: [AuthGuard]
        }, {
            path: 'first-login-change-password',
            component: ChangePasswordComponent,
            canActivate: [AuthGuard]
        }, {
            path: 'reset-change-password',
            component: ChangePasswordComponent,
            canActivate: [AuthGuard]
        }, {
            path: 'forgot-password',
            component: ForgotPasswordComponent,
            canActivate: [NonAuthGuard]
        }, {
            path: 'set-default-password',
            component: ChangePasswordComponent,
            canActivate: [AuthGuard]
        }]
    }];

@NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
export class PasswordRoutingModule { }
