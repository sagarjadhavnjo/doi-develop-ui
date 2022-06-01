import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreationComponent } from './post-creation/post-creation.component';
import { PostCreationListComponent } from './post-creation-list/post-creation-list.component';

const routes: Routes = [
    {
        path: 'new',
        component: PostCreationComponent
    },
    {
        path: 'list',
        component: PostCreationListComponent
    },
    {
        path: ':action/:id',
        component: PostCreationComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostRoutingModule { }
