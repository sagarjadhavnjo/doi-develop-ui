import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostTransferListComponent } from './post-transfer-list/post-transfer-list.component';
import { PostTransferComponent } from './post-transfer/post-transfer.component';

const routes: Routes = [
    {
        path: 'list',
        component: PostTransferListComponent
    },
    {
        path: 'new',
        component: PostTransferComponent
    },
    {
        path: ':action/:id/:status/:isWfStatusDraft',
        component: PostTransferComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostTransferRoutingModule { }
