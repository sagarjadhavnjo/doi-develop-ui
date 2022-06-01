import { PromotionForgoComponent } from './promotion-forgo/promotion-forgo.component';
import { ReversionComponent } from './reversion/reversion.component';
// import { ChangeOfScaleComponent } from './change-of-scale/change-of-scale.component';
import { PayEventListComponent } from './event-list/event-list.component';
import { PvuCommonModule } from './../../pvu-common/pvu-common.module';
import { NgModule } from '@angular/core';

import { PayEventsRoutingModule } from './events-routing.module';
import { EventComponent } from './event/event.component';
import { PromotionComponent } from './promotion/promotion.component';
import { DeemedDateComponent } from './deemed-date/deemed-date.component';
import { ResetClearDialogPayEventComponent } from './event/reset-clear-dialog.component';

@NgModule({
    declarations: [
        EventComponent,
        PayEventListComponent,
        PromotionComponent,
        // ChangeOfScaleComponent,
        DeemedDateComponent,
        ReversionComponent,
        PromotionForgoComponent,
        ResetClearDialogPayEventComponent
    ],
    exports: [],
    entryComponents: [ResetClearDialogPayEventComponent],
    imports: [
        PayEventsRoutingModule,
        PvuCommonModule
    ]
})
export class PayEventsModule { }
