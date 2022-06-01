import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FixToRegularListComponent } from './fix-to-regular-list/fix-to-regular-list.component';
import { FixToRegularComponent } from './fix-to-regular/fix-to-regular.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: FixToRegularListComponent,
            },
            {
                path: ':action',
                component: FixToRegularComponent
            },
            {
                path: ':action/:id/:isSubmitted',
                component: FixToRegularComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FixToRegularRoutingModule { }
