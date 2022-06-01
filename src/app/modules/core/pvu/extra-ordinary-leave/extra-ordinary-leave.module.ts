import { PvuCommonModule } from './../pvu-common/pvu-common.module';
import { SharedModule } from './../../../../shared/shared.module';
import { NgModule } from '@angular/core';

import { ExtraOrdinaryLeaveRoutingModule } from './extra-ordinary-leave-routing.module';
import { EolComponent } from './eol/eol.component';
import { EolListComponent } from './eol-list/eol-list.component';
import { SaveDrafDialogComponent } from './eol/save-draft-dialog.component';

@NgModule({
  declarations: [EolComponent, EolListComponent, SaveDrafDialogComponent],
  imports: [
    SharedModule,
    ExtraOrdinaryLeaveRoutingModule,
    PvuCommonModule,
  ],
  entryComponents: [SaveDrafDialogComponent],
})
export class ExtraOrdinaryLeaveModule { }
