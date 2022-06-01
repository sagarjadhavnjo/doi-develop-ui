import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BulkEmpCreationRoutingModule } from './bulk-emp-creation-routing.module';
import { BulkEmpCreationComponent } from './bulk-emp-creation/bulk-emp-creation.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
    declarations: [
        BulkEmpCreationComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BulkEmpCreationRoutingModule
    ],
    entryComponents: [
        ConfirmationDialogComponent
    ]
})
export class BulkEmpCreationModule { }
