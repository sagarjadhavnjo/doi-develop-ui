import { RopInwardComponent } from './rop-inward/rop-inward.component';
import { RopListComponent } from './rop-list/rop-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RopComponent } from './rop/rop.component';
import { RopDistributorComponent } from './rop-distributor/rop-distributor.component';
import { RopPrintEndorsementComponent } from './rop-print-endorsement/rop-print-endorsement.component';
import { RopAuditorApproverListComponent } from './rop-auditor-approver-list/rop-auditor-approver-list.component';
import { RopAuditorApproverComponent } from './rop-auditor-approver/rop-auditor-approver.component';

const routes: Routes = [
    {
        path: '',
        component: RopListComponent
    },
    {
        path: 'rop-inward',
        component: RopInwardComponent
    },
    {
        path: 'rop-distributor',
        component: RopDistributorComponent
    },
    {
        path: 'auditor-list',
        component: RopAuditorApproverListComponent
    },
    {
        path: 'auditor/:action/:id',
        component: RopAuditorApproverComponent
    },
    {
        path: 'approver-list',
        component: RopAuditorApproverListComponent
    },
    {
        path: 'approver/:action/:id',
        component: RopAuditorApproverComponent
    },
    {
        path: 'rop-print-endorsement',
        component: RopPrintEndorsementComponent
    },
    {
        path: ':action',
        component: RopComponent
    },
    {
        path: ':action/:id',
        component: RopComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RopRoutingModule { }
