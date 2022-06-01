import { PVUEventViewComponent } from './event-view/event-view.component';
import { PVUPrintOrderComponent } from './pvu-print-order/pvu-print-order.component';
import { PrintRemarksHistoryDailogComponent } from './pvu-print-order/print-remarks-history-dailog/print-remarks-history-dailog.component';
import { PrintRemarksDailogComponent } from './pvu-print-order/print-remarks-dailog/print-remarks-dailog.component';
import { PVUAuditorVerifierApproverComponent } from './auditor-verifier-approver/auditor-verifier-approver-component/pvu-auditor-verifier-approver.component';
import { PVUDistributorComponent, PVUDistributorFwdDialogComponent } from './distributor/distributor.component';
import { PVUInwardComponent, PVUInwardFwdDialogComponent } from './inward/inward.component';
import { PVUAuditorVerifierApproverListComponent } from './auditor-verifier-approver/auditor-verifier-approver-listing/pvu-auditor-verifier-approver-list.component';
import { ResetClearDialogEventComponent } from './pvu-event/reset-clear-dialog.component';
import { AssuredProgressionComponent } from './assured-career-progression/assured-career-progression.component';
import { HigherPayScaleComponent } from './higher-pay-scale/higher-pay-scale.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../../../../shared/shared.module';
import { PvuCommonModule } from './../../pvu-common/pvu-common.module';
import { NgModule } from '@angular/core';

import { PVUEventsRoutingModule } from './pvu-event-routing.module';
import { PVUEventComponent } from './pvu-event/pvu-event.component';
import { PVUEmployeeCurrentDetailsComponent } from './pvu-event-employee-current-details/pvu-event-employee-current-details.component';
import { SelectionGradeComponent } from './selection-grade/selection-grade.component';
import { ShettyPayComponent } from './shetty-pay/shetty-pay.component';
import { SteppingUpComponent } from './stepping-up/stepping-up.component';
import { PVUEventListComponent } from './event-list/event-list.component';
import { TikuPayComponent } from './tiku-pay/tiku-pay.component';
import { CareerAdvancementSchemeComponent } from './career-advancement-scheme/career-advancement-scheme.component';
import { PVUOutwardComponent, PVUOutwardFwdDialogComponent } from './outward/outward.component';

@NgModule({
    declarations: [
        PVUEventComponent,
        PVUEmployeeCurrentDetailsComponent,
        HigherPayScaleComponent,
        SelectionGradeComponent,
        ShettyPayComponent,
        AssuredProgressionComponent,
        SteppingUpComponent,
        PVUEventListComponent,
        TikuPayComponent,
        CareerAdvancementSchemeComponent,
        ResetClearDialogEventComponent,
        PVUInwardComponent,
        PVUInwardFwdDialogComponent,
        PVUDistributorComponent,
        PVUDistributorFwdDialogComponent,
        PVUAuditorVerifierApproverListComponent,
        PVUAuditorVerifierApproverComponent,
        PVUOutwardComponent,
        PVUOutwardFwdDialogComponent,
        PVUPrintOrderComponent,
        PrintRemarksHistoryDailogComponent,
        PrintRemarksDailogComponent,
        PVUEventViewComponent
    ],
    entryComponents: [
        ResetClearDialogEventComponent,
        PVUInwardFwdDialogComponent,
        PVUDistributorFwdDialogComponent,
        PVUOutwardFwdDialogComponent,
        PrintRemarksHistoryDailogComponent,
        PrintRemarksDailogComponent
    ],
    imports: [
        PVUEventsRoutingModule,
        PvuCommonModule
    ]
})
export class PVUEventsModule { }
