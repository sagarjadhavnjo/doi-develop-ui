import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { PostCreationComponent, AvailableVacantPostDialogComponent } from './post-creation/post-creation.component';
import { PostCreationListComponent } from './post-creation-list/post-creation-list.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EdpPostService } from '../services/edp-post.service';
import { CommonWorkflowComponent } from '../../common/common-workflow/common-workflow.component';
import { ViewCommonWorkflowHistoryComponent } from '../../common/view-common-workflow-history/view-common-workflow-history.component';
import { SearchDialogComponent } from 'src/app/shared/components/search-dialog/search-dialog.component';
@NgModule({
    imports: [
        CommonModule,
        PostRoutingModule,
        SharedModule
    ],
    declarations: [
        PostCreationComponent,
        PostCreationListComponent,
        AvailableVacantPostDialogComponent
    ],
    entryComponents: [
        ConfirmationDialogComponent,
        AvailableVacantPostDialogComponent,
        CommonWorkflowComponent,
        ViewCommonWorkflowHistoryComponent,
        SearchDialogComponent
    ],
    providers: [
        EdpPostService
    ]
})
export class PostModule { }
