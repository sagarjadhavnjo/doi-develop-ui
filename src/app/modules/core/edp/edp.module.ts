import { EdpPasswordService } from './services/edp-password.service';
import { ConfirmationDialogComponent } from './../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EdpRoutingModule } from './edp-routing.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ObjectClassMappingComponent } from './object-class-mapping/object-class-mapping.component';


@NgModule({
    declarations: [
        ResetPasswordComponent,
        ObjectClassMappingComponent
    ],
    imports: [
        CommonModule,
        EdpRoutingModule,
        SharedModule,
    ],
    providers: [
        EdpPasswordService
    ],
    entryComponents: [
        ConfirmationDialogComponent
    ]
})
export class EdpModule { }
