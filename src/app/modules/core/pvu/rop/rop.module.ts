import { PvuCommonModule } from './../pvu-common/pvu-common.module';
import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RopRoutingModule } from './rop-routing.module';
import { RopComponent } from './rop/rop.component';
import { RopListComponent } from './rop-list/rop-list.component';
import { RopWfComponent } from './rop-wf/rop-wf.component';
import { RopInwardComponent, FwdRopInwardDialogComponent } from './rop-inward/rop-inward.component';
import { RopDistributorComponent, FwdRopDistributorDialogComponent } from './rop-distributor/rop-distributor.component';
import { RopViewComponent } from './rop-view/rop-view.component';
import { RopAttachmentComponent } from './rop-attachment/rop-attachment.component';
import { RopPrintEndorsementComponent } from './rop-print-endorsement/rop-print-endorsement.component';
import { RopSearchEmployeeComponent } from './rop-search-employee/rop-search-employee.component';
import { RopCommentsComponent } from './rop-comments/rop-comments.component';
import { RopAuditorApproverComponent } from './rop-auditor-approver/rop-auditor-approver.component';
import { RopAuditorApproverListComponent } from './rop-auditor-approver-list/rop-auditor-approver-list.component';
import { PrintEndDailogComponent } from './rop-print-endorsement/print-end-dailog/print-end-dailog.component';
import { RePrintHistoryComponent } from './re-print-history/re-print-history.component';
import { WarningMessageComponent } from './rop-print-endorsement/warning-message/warning-message.component';

@NgModule({
    declarations: [
        RopComponent,
        RopListComponent,
        RopWfComponent,
        RopInwardComponent,
        RopDistributorComponent,
        FwdRopInwardDialogComponent,
        FwdRopDistributorDialogComponent,
        RopViewComponent,
        RopAttachmentComponent,
        RopPrintEndorsementComponent,
        RopSearchEmployeeComponent,
        RopCommentsComponent,
        RopAuditorApproverComponent,
        RopAuditorApproverListComponent,
        PrintEndDailogComponent,
        RePrintHistoryComponent,
        WarningMessageComponent
    ],
    imports: [
        SharedModule,
        RopRoutingModule,
        PvuCommonModule
    ],
    entryComponents: [
        RopWfComponent,
        FwdRopInwardDialogComponent,
        FwdRopDistributorDialogComponent,
        RopSearchEmployeeComponent,
        RopCommentsComponent,
        PrintEndDailogComponent,
        RePrintHistoryComponent,
        WarningMessageComponent
    ]
})
export class RopModule { }
