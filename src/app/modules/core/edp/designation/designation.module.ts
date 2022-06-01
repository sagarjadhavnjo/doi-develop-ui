import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignationRoutingModule } from './designation-routing.module';
import { AddDesignationComponent, AlreadyExistsDialogComponent } from './add-designation/add-designation.component';
import { AddDesignationListComponent } from './add-designation-list/add-designation-list.component';
// tslint:disable-next-line: max-line-length
import { UpdateDesignationComponent, AlreadyExistsRecordDialogComponent } from './update-designation/update-designation.component';
import { UpdateDesignationListComponent } from './update-designation-list/update-designation-list.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonWorkflowComponent } from '../../common/common-workflow/common-workflow.component';
import { ViewCommonWorkflowHistoryComponent } from '../../common/view-common-workflow-history/view-common-workflow-history.component';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';
@NgModule({
    declarations: [
        AddDesignationComponent,
        AddDesignationListComponent,
        UpdateDesignationComponent,
        UpdateDesignationListComponent,
        AlreadyExistsDialogComponent,
        AlreadyExistsRecordDialogComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DesignationRoutingModule
    ],
    entryComponents: [
        ConfirmationDialogComponent,
        CommonWorkflowComponent,
        ViewCommonWorkflowHistoryComponent,
        SearchDialogComponent,
        AlreadyExistsDialogComponent,
        AlreadyExistsRecordDialogComponent
    ],
})
export class DesignationModule { }
