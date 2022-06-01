import { SaveDraftDialogComponent } from './suspension/save-draft-dialog.component';
import { PvuCommonModule } from './../pvu-common/pvu-common.module';
import { NgModule } from '@angular/core';

import { SuspensionsRoutingModule } from './suspensions-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SuspensionComponent } from './suspension/suspension.component';
import { SuspensionListComponent } from './suspension-list/suspension-list.component';

@NgModule({
  imports: [
    SharedModule,
    SuspensionsRoutingModule,
    PvuCommonModule,
  ],
  declarations: [
    SuspensionComponent,
    SuspensionListComponent,
    SaveDraftDialogComponent,
  ],
  entryComponents: [
    SaveDraftDialogComponent,
  ],
})
export class SuspensionsModule { }
