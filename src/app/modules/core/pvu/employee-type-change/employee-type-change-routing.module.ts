
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeTypeChangeListComponent } from './employee-type-change-list/employee-type-change-list.component';
import { EmployeeTypeChangeComponent } from './employee-type-change/employee-type-change.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: EmployeeTypeChangeListComponent,
            },
            {
                path: ':action',
                component: EmployeeTypeChangeComponent
            },
            {
                path: ':action/:id',
                component: EmployeeTypeChangeComponent
            }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})
export class EmployeeTypeChnageRoutingModule { }
