import { ObjectClassMappingComponent } from './object-class-mapping/object-class-mapping.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards';
const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'office',
                loadChildren: () => import('./office/office.module').then(m => m.OfficeModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'post',
                loadChildren: () => import('./post/post.module').then(m => m.PostModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'designation',
                loadChildren: () => import('./designation/designation.module').then(m => m.DesignationModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'post-transfer',
                loadChildren: () => import('./post-transfer/post-transfer.module').then(m => m.PostTransferModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'rights-mapping',
                loadChildren: () => import('./rights-mapping/rights-mapping.module').then(m => m.RightsMappingModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'branch',
                loadChildren: () => import('./branch/branch.module').then(m => m.BranchModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'bulk-emp-creation',
                loadChildren: () => import('./bulk-emp-creation/bulk-emp-creation.module').then(m => m.BulkEmpCreationModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent
            },
            {
                path: 'global-reset-password',
                component: ResetPasswordComponent
            },
            {
                path: 'object-class-mapping',
                component: ObjectClassMappingComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EdpRoutingModule {}
