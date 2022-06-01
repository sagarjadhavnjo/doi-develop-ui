import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkEmpCreationComponent } from './bulk-emp-creation/bulk-emp-creation.component';

const routes: Routes = [
    {
        path: 'new',
        component: BulkEmpCreationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BulkEmpCreationRoutingModule { }
