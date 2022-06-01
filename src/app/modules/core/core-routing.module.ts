import { AuthGuard } from './../../guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
   
    {
        path: 'pvu',
        loadChildren: () => import('./pvu/pvu.module').then((m) => m.PVUModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'edp',
        loadChildren: () => import('./edp/edp.module').then((m) => m.EdpModule),
        canActivate: [AuthGuard]
    },
    
    {
        path: 'lc',
        loadChildren: () => import('./letter-of-credit/letter-of-credit.module').then((m) => m.LetterOfCreditModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'dmo',
        loadChildren: () => import('./dmo/dmo.module').then((m) => m.DmoModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'doi',
        loadChildren: () => import('./doi/doi.module').then((m) => m.DoiModule),
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})
export class CoreRoutingModule {}
