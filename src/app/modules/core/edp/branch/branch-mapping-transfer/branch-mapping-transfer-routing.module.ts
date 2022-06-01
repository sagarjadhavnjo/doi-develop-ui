import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BranchMappingTransferListComponent } from './branch-mapping-transfer-list/branch-mapping-transfer-list.component';
import { BranchMappingTransferDetailComponent } from './branch-mapping-transfer-detail/branch-mapping-transfer-detail.component';

const routes: Routes = [
    {
        path: 'list',
        component: BranchMappingTransferListComponent
    },
    {
        path: 'new',
        component: BranchMappingTransferDetailComponent
    },
    {
        path: ':action/:id',
        component: BranchMappingTransferDetailComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BranchMappingTransferRoutingModule {}
