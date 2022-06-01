import { RightsMappingService } from './services/right-mapping.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RightMappingRoutingModule } from './rights-mapping-routing.module';
import { RightMappingComponent, UserRightSubmitDialogComponent,
    // tslint:disable-next-line: max-line-length
    AlreadyExistsDialogComponent, UserRightMappingDialogComponent, UserRightConfirmDialogComponent } from './right-mapping/right-mapping.component';
import { RightMappingListComponent } from './right-mapping-list/right-mapping-list.component';
import { UserRightViewDialogComponent } from './user-right-view-dialog/user-right-view-dialog.component';
import { CommonWorkflowComponent } from '../../common/common-workflow/common-workflow.component';
import { ViewCommonWorkflowHistoryComponent } from '../../common/view-common-workflow-history/view-common-workflow-history.component';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';
@NgModule({
    declarations: [
        RightMappingComponent,
        RightMappingListComponent,
        UserRightSubmitDialogComponent,
        AlreadyExistsDialogComponent,
        UserRightMappingDialogComponent,
        UserRightViewDialogComponent,
        UserRightConfirmDialogComponent,
    ],
    imports: [
        CommonModule,
        RightMappingRoutingModule,
        SharedModule
    ],
    entryComponents: [
        ConfirmationDialogComponent,
        UserRightSubmitDialogComponent,
        AlreadyExistsDialogComponent,
        UserRightConfirmDialogComponent,
        UserRightMappingDialogComponent,
        UserRightViewDialogComponent,
        CommonWorkflowComponent,
        ViewCommonWorkflowHistoryComponent,
        SearchDialogComponent
    ],
    providers: [
        RightsMappingService
    ]
})
export class RightsMappingModule { }
