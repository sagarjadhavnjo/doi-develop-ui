import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransferListComponent } from './transfer-list/transfer-list.component';
import { TransferComponent } from './transfer/transfer.component';
import { TransferJoiningComponent } from './transfer-joining/transfer-joining.component';
import { TransferJoiningListComponent } from './transfer-joining-list/transfer-joining-list.component';

const routes: Routes = [
  {
    path: 'transfer',
    children : [
      {
        path: '',
        component: TransferListComponent
      },
      {
        path: ':action',
        component: TransferComponent
      },
      {
        path: ':action/:id',
        component: TransferComponent
      },
    ]
  },
  {
    path : 'transfer-joining',
    children: [
      {
        path: '',
        component: TransferJoiningListComponent
      },
      {
        path: ':action/:id',
        component: TransferJoiningComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferRoutingModule { }
