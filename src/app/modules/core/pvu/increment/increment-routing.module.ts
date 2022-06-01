import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Old Increment
import { IncrementListComponent } from './increment-list/increment-list.component';
import { IncrementComponent } from './increment-component/increment.component';

// New Increment
import { IncrementNewComponentComponent } from './increment-new-component/increment-new-component.component';
import { IncrementNewListComponent } from './increment-new-list/increment-new-list.component';

export const pvuRoutes: Routes = [
    {
        path: '',
        children: [
            // Old Increment
            // {
            //     path: 'list',
            //     component: IncrementListComponent,
            // },
            // {
            //     path: ':action',
            //     component: IncrementComponent
            // },
            // {
            //     path: ':action/:id',
            //     component: IncrementComponent
            // }

            // // New Increment
            {
                path: 'list',
                component: IncrementNewListComponent,
            },
            {
                path: ':action',
                component: IncrementNewComponentComponent
            },
            {
                path: ':action/:id',
                component: IncrementNewComponentComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(pvuRoutes)],
    exports: [RouterModule],
    declarations: []
})
export class IncrementRoutingModule { }
