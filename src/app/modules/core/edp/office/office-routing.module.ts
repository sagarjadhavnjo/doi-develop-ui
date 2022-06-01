import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfficeCreationComponent } from './office-creation/office-creation.component';
import { OfficeListComponent } from './office-list/office-list.component';
import { OfficesUpdationComponent } from './office-updation/office-updation.component';
import { OfficeSummaryListComponent } from './office-summary/office-summary-list/office-summary-list.component';
import { OfficeUpdationListComponent } from './office-summary/office-updation-list/office-updation-list.component';
import { OfficeDetailsSummaryComponent } from './office-summary/office-details-summary/office-details-summary.component';
const routes: Routes = [
    {
        path: 'new',
        component: OfficeCreationComponent
    },
    {
        path: 'list',
        component: OfficeListComponent
    },
    {
        path: ':action/:id/:wfStatus',
        component: OfficeCreationComponent
    },
    {
        path: 'update-list',
        component: OfficeListComponent
    },
    {
        path: 'update/:action/:id/:officeId/:update/:transDate',
        component: OfficesUpdationComponent
    },
    {
        path: 'summary',
        component: OfficeSummaryListComponent
    },
    {
        path: 'updation-list/:typeId/:distId/:temp',
        component: OfficeUpdationListComponent
    },
    {
        path: 'detailsummary',
        component: OfficeDetailsSummaryComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OfficeRoutingModule {}
