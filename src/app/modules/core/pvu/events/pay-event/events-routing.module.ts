import { PayEventListComponent } from './event-list/event-list.component';
import { EventComponent } from './event/event.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
    path: '',
    children: [{
        path: 'list',
        component: PayEventListComponent
    }, {
        path: 'list/:event',
        component: PayEventListComponent
    }, {
        path: ':action',
        component: EventComponent
    }, {
        path: ':action/:id/:event',
        component: EventComponent
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PayEventsRoutingModule { }
