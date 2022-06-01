import { PvuCommonModule } from './../pvu-common/pvu-common.module';
import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';

import { TransferRoutingModule } from './transfer-routing.module';
import { TransferComponent } from './transfer/transfer.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';
import { TransferJoiningComponent } from './transfer-joining/transfer-joining.component';
import { TransferJoiningListComponent } from './transfer-joining-list/transfer-joining-list.component';

@NgModule({
  imports: [
    SharedModule,
    TransferRoutingModule,
    PvuCommonModule,
  ],
  declarations: [
    TransferComponent,
    TransferListComponent,
    TransferJoiningComponent,
    TransferJoiningListComponent
  ],
  entryComponents: [],
})
export class TransferModule { }
