import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BranchCreationListComponent } from './branch-creation-list/branch-creation-list.component';
import { BranchCreationDetailComponent } from './branch-creation-detail/branch-creation-detail.component';
import { BranchCreationRoutingModule } from './branch-creation-routing.module';
import { BranchService } from './services/branch.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
    declarations: [
        BranchCreationListComponent,
        BranchCreationDetailComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BranchCreationRoutingModule
    ],
    entryComponents: [
        ConfirmationDialogComponent,
    ],
    providers: [
        BranchService
    ]
})
export class BranchCreationModule { }
