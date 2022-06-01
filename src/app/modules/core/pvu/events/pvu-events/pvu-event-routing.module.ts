import { PVUEventViewComponent } from './event-view/event-view.component';
import { PVUPrintOrderComponent } from './pvu-print-order/pvu-print-order.component';
import { PVUAuditorVerifierApproverComponent } from './auditor-verifier-approver/auditor-verifier-approver-component/pvu-auditor-verifier-approver.component';
import { PVUOutwardComponent } from './outward/outward.component';
import { PVUDistributorComponent } from './distributor/distributor.component';
import { PVUInwardComponent } from './inward/inward.component';
import { PVUEventComponent } from './pvu-event/pvu-event.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PVUEventListComponent } from './event-list/event-list.component';
import { PVUAuditorVerifierApproverListComponent } from './auditor-verifier-approver/auditor-verifier-approver-listing/pvu-auditor-verifier-approver-list.component';

const routes: Routes = [{
    path: '',
    children: [{
        path: 'list',
        component: PVUEventListComponent
    }, {
        path: 'list/:event',
        component: PVUEventListComponent
    }, {
        path: 'inward-list',
        component: PVUInwardComponent
    }, {
        path: 'distributor-list',
        component: PVUDistributorComponent
    }, {
        path: 'auditor-list',
        component: PVUAuditorVerifierApproverListComponent
    }, {
        path: 'auditor-list/:eventType',
        component: PVUAuditorVerifierApproverListComponent
    }, {
        path: 'auditor/:action/:eventType/:id',
        component: PVUAuditorVerifierApproverComponent
    }, {
        path: 'verifier-list',
        component: PVUAuditorVerifierApproverListComponent
    }, {
        path: 'verifier-list/:eventType',
        component: PVUAuditorVerifierApproverListComponent
    }, {
        path: 'verifier/:action/:eventType/:id',
        component: PVUAuditorVerifierApproverComponent
    }, {
        path: 'approver-list',
        component: PVUAuditorVerifierApproverListComponent
    }, {
        path: 'approver-list/:eventType',
        component: PVUAuditorVerifierApproverListComponent
    }, {
        path: 'approver/:action/:eventType/:id',
        component: PVUAuditorVerifierApproverComponent
    }, {
        path: 'print-list',
        component: PVUPrintOrderComponent
    }, {
        path: 'outward-list',
        component: PVUOutwardComponent
    }, {
        path: ':action',
        component: PVUEventComponent
    }, {
        path: 'view/:id/:event',
        component: PVUEventViewComponent
    }, {
        path: ':action/:id/:event',
        component: PVUEventComponent
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PVUEventsRoutingModule { }
