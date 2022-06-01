import { EmployeeCurrentDetailsComponent } from './employee-current-details/employee-current-details.component';
import { SharedModule } from './../../../../shared/shared.module';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { NgModule } from '@angular/core';
import { ForwardDialogComponent } from './forward-dialog/forward-dialog.component';
import { TransactionNumberDialogComponent } from './transaction-number-dialog/transaction-number-dialog.component';
import { AttachmentPvuComponent } from './attachment-pvu/attachment-pvu.component';
import { SeniorScaleComponent } from './senior-scale/senior-scale.component';
import { ChangeOfScaleComponent } from './change-of-scale/change-of-scale.component';
import { ViewCommentsComponent } from './view-comments/view-comments.component';
import { ForwardDialogPVUComponent } from './forward-dialog-pvu/forward-dialog-pvu.component';
import { PVUUTransactionDialogEventComponent } from './forward-dialog-pvu/transaction-dialog.component';

@NgModule({
    declarations: [
        SearchEmployeeComponent,
        ForwardDialogComponent,
        TransactionNumberDialogComponent,
        AttachmentPvuComponent,
        SeniorScaleComponent,
        ChangeOfScaleComponent,
        ViewCommentsComponent,
        EmployeeCurrentDetailsComponent,
        ForwardDialogPVUComponent,
        PVUUTransactionDialogEventComponent,
    ],
    imports: [
        SharedModule
    ],
    exports: [
        SearchEmployeeComponent,
        SharedModule,
        SeniorScaleComponent,
        ChangeOfScaleComponent,
        AttachmentPvuComponent,
        EmployeeCurrentDetailsComponent,
        ForwardDialogPVUComponent
    ],
    entryComponents: [
        SearchEmployeeComponent,
        ForwardDialogComponent,
        TransactionNumberDialogComponent,
        ViewCommentsComponent,
        ForwardDialogPVUComponent,
        PVUUTransactionDialogEventComponent
    ]
})
export class PvuCommonModule { }
