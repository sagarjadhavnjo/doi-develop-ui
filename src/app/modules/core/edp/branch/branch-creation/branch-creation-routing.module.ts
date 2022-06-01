import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchCreationDetailComponent } from './branch-creation-detail/branch-creation-detail.component';
import { BranchCreationListComponent } from './branch-creation-list/branch-creation-list.component';


const routes: Routes = [
    {
        path: 'new',
        component: BranchCreationDetailComponent
    },
    {
        path: 'list',
        component: BranchCreationListComponent
    },
    {
        path: ':action',
        component: BranchCreationDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BranchCreationRoutingModule { }
