import { EolListComponent } from './eol-list/eol-list.component';
import { EolComponent } from './eol/eol.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EolListComponent,
},
{
    path: ':action',
    component: EolComponent
},
{
    path: ':action/:id',
    component: EolComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraOrdinaryLeaveRoutingModule { }
