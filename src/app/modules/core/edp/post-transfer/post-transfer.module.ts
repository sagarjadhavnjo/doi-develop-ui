import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostTransferRoutingModule } from './post-transfer-routing.module';
import { PostTransferComponent, ChargeConfirmDialogComponent } from './post-transfer/post-transfer.component';
import { PostTransferListComponent } from './post-transfer-list/post-transfer-list.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { PostTransferService } from '../services/post-transfer.service';
import { AlreadyExistsDialogComponent } from './post-transfer/post-transfer.component';
import { CommonWorkflowComponent } from '../../common/common-workflow/common-workflow.component';
import { ViewCommonWorkflowHistoryComponent } from '../../common/view-common-workflow-history/view-common-workflow-history.component';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';
@NgModule({
    declarations: [
        PostTransferComponent,
        PostTransferListComponent,
        ChargeConfirmDialogComponent,
        AlreadyExistsDialogComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        PostTransferRoutingModule
    ],
    providers: [
        PostTransferService
    ],
    entryComponents: [
        ChargeConfirmDialogComponent,
        ConfirmationDialogComponent,
        AlreadyExistsDialogComponent,
        CommonWorkflowComponent,
        ViewCommonWorkflowHistoryComponent,
        SearchDialogComponent
    ]
})
export class PostTransferModule { }
