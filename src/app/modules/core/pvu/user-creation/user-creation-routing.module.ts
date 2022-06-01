import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCreationListComponent } from './user-creation-list/user-creation-list.component';
import { UserCreationComponent } from './user-creation/user-creation.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: UserCreationListComponent,
            },
            {
                path:':action',
                component:UserCreationComponent,
            },
            {
                path: ':action/:id',
                component: UserCreationComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserCreationRoutingModule { }
