import { PasswordService } from './services/password.service';
import { SharedModule } from './../shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PasswordRoutingModule } from './password-routing.module';
import { PasswordComponent } from './password/password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
    declarations: [
        ChangePasswordComponent,
        PasswordComponent,
        ForgotPasswordComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        PasswordRoutingModule
    ],
    entryComponents: [
        ConfirmationDialogComponent
    ],
    providers: [PasswordService]
})
export class PasswordModule { }
