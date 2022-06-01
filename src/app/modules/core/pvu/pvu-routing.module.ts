import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeCreationComponent } from './employee-creation/employee-creation.component';
import { EmployeeCreationListComponent } from './employee-creation-list/employee-creation-list.component';
import { EmpViewOtherOfficeComponent } from './emp-view-other-office/emp-view-other-office.component';
import { ChangeOfScaleEmpCreationComponent } from './change-of-scale-emp-creation/change-of-scale-emp-creation.component';
export const pvuRoutes: Routes = [
    {
        path: 'employee-creation',
        children: [
            {
                path: '',
                component: EmployeeCreationListComponent,
            }, {
                path: 'list/:express',
                component: EmployeeCreationListComponent,
            },
            {
                path: 'emp-view-other-office/:action',
                component: EmpViewOtherOfficeComponent
            },
            {
                path: ':action',
                component: EmployeeCreationComponent
            },
            {
                path: ':action/:id',
                component: EmployeeCreationComponent
            },{
                path: ':action/:id/:expCreation',
                component: EmployeeCreationComponent
            }
        ]
    },
    {
            path: 'change-of-scale-emp-creation',
            component: ChangeOfScaleEmpCreationComponent
    },
    {
        path: 'extra-ordinary-leave',
        loadChildren: () => import('./extra-ordinary-leave/extra-ordinary-leave.module').then(m => m.ExtraOrdinaryLeaveModule)
    },
    {
        path: 'transfer',
        loadChildren: () => import('./transfer/transfer.module').then(m => m.TransferModule)
    },
    {
        path: '',
        children: [
            {
                path: 'increment',
                loadChildren: () => import('./increment/increment.module').then(m => m.IncrementModule)
            }]
    },
    {
        path: '',
        children: [
            {
                path: 'employee-type-change',
                loadChildren: () => import('./employee-type-change/employee-type-change.module').then(m => m.EmployeeTypeChangeModule)
            }]
    },
    {
        path: 'pay-fixation-events',
        loadChildren: () => import('./events/pay-event/events.module').then(m => m.PayEventsModule)
    },
    {
        path: 'pvu-events',
        loadChildren: () => import('./events/pvu-events/pvu-events.module').then(m => m.PVUEventsModule)
    },
    {
        path: 'suspension',
        loadChildren: () => import('./suspensions/suspensions.module').then(m => m.SuspensionsModule)
    },
    {
        path: 'rop',
        loadChildren: () => import('./rop/rop.module').then(m => m.RopModule)
    },
    {
        path: '',
        children: [
            {
                path: 'fix-to-regular',
                loadChildren: () => import('./fix-to-regular/fix-to-regular.module').then(m => m.FixToRegularModule)
            }]
    },
    {
        path: '',
        children: [
            {
                path: 'user-creation',
                loadChildren: () => import('./user-creation/user-creation.module').then(m => m.UserCreationModule)
            }]
    }

];

@NgModule({
    imports: [RouterModule.forChild(pvuRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class PVURoutingModule { }
