import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { BranchMappingTransferDetailComponent } from './branch-mapping-transfer-detail/branch-mapping-transfer-detail.component';
import { BranchMappingTransferListComponent } from './branch-mapping-transfer-list/branch-mapping-transfer-list.component';
import { BranchMappingTransferRoutingModule } from './branch-mapping-transfer-routing.module';
import { MappedBranchDialogComponent } from './mapped-branch-dialog/mapped-branch-dialog.component';
import { MenuErrorDisplayDialogComponent } from './menu-error-display-dialog/menu-error-display-dialog.component';
import { MessageBranchDialogComponent } from './message-branch-dialog/message-branch-dialog.component';

@NgModule({
    imports: [CommonModule, SharedModule, BranchMappingTransferRoutingModule],
    declarations: [
        BranchMappingTransferListComponent,
        BranchMappingTransferDetailComponent,
        MappedBranchDialogComponent,
        MessageBranchDialogComponent,
        MenuErrorDisplayDialogComponent
    ],
    entryComponents: [MappedBranchDialogComponent, MessageBranchDialogComponent, MenuErrorDisplayDialogComponent]
})
export class BranchMappingTransferModule {}
