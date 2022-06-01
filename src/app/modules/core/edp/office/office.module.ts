import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeRoutingModule } from './office-routing.module';
import { OfficeCreationComponent } from './office-creation/office-creation.component';
import { SubOfficeCreationComponent } from './sub-office-creation/sub-office-creation.component';
import { OfficeListComponent } from './office-list/office-list.component';
import { OfficesUpdationComponent } from './office-updation/office-updation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EdpDdoOfficeService } from '../services/edp-ddo-office.service';
import { OfficeSummaryListComponent } from './office-summary/office-summary-list/office-summary-list.component';
import { OfficeUpdationListComponent } from './office-summary/office-updation-list/office-updation-list.component';
import { SubOfficeListComponent } from './sub-office-list/sub-office-list.component';
import { OfficeAttachmentComponent } from './office-attachment/office-attachment.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { OfficeDetailsSummaryComponent } from './office-summary/office-details-summary/office-details-summary.component';
import { SelectedBillDialogComponent } from './selected-bill-dialog/selected-bill-dialog.component';
import { CommonWorkflowComponent } from '../../common/common-workflow/common-workflow.component';
import { ViewCommonWorkflowHistoryComponent } from '../../common/view-common-workflow-history/view-common-workflow-history.component';
import { AlreadyExistDialogComponent } from './already-exist-dialog/already-exist-dialog.component';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';

@NgModule({
    declarations: [
        OfficeCreationComponent,
        SubOfficeCreationComponent,
        OfficeListComponent,
        OfficesUpdationComponent,
        OfficeSummaryListComponent,
        OfficeUpdationListComponent,
        SubOfficeListComponent,
        OfficeAttachmentComponent,
        OfficeDetailsSummaryComponent,
        SelectedBillDialogComponent,
        AlreadyExistDialogComponent
    ],
    imports: [CommonModule, OfficeRoutingModule, SharedModule],
    entryComponents: [
        AlreadyExistDialogComponent,
        SubOfficeCreationComponent,
        ConfirmationDialogComponent,
        SelectedBillDialogComponent,
        CommonWorkflowComponent,
        ViewCommonWorkflowHistoryComponent,
        SearchDialogComponent
    ],
    providers: [EdpDdoOfficeService]
})
export class OfficeModule {}
