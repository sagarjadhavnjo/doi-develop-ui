import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDesignationComponent } from './add-designation/add-designation.component';
import { AddDesignationListComponent } from './add-designation-list/add-designation-list.component';
import { UpdateDesignationComponent } from './update-designation/update-designation.component';
import { UpdateDesignationListComponent } from './update-designation-list/update-designation-list.component';


const routes: Routes = [
    {
        path: 'add',
        component: AddDesignationComponent
    },
    {
        path: 'list',
        component: AddDesignationListComponent
    },
    {
        path: ':action/:id',
        component: AddDesignationComponent
    },
    {
        path: 'update',
        component: UpdateDesignationComponent
    },
    {
        path: 'update-list',
        component: UpdateDesignationListComponent
    },
    {
        path: 'update/:action/:id',
        component: UpdateDesignationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DesignationRoutingModule { }
