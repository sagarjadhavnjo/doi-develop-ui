import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'branch-mapping',
        loadChildren: () => import('./branch-mapping-transfer/branch-mapping-transfer.module').then(m => m.BranchMappingTransferModule)
    },
    {
        path: 'branch-creation',
        loadChildren: () => import('./branch-creation/branch-creation.module').then(m => m.BranchCreationModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BranchRoutingModule {}
