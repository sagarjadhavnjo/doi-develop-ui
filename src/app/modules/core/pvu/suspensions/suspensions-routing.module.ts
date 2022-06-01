import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuspensionListComponent } from './suspension-list/suspension-list.component';
import { SuspensionComponent } from './suspension/suspension.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SuspensionListComponent,
      },
      {
        path: ':action',
        component: SuspensionComponent
      },
      {
        path: ':action/:id',
        component: SuspensionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuspensionsRoutingModule { }
