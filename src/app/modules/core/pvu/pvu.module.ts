import { RopModule } from './rop/rop.module';
import { TransferModule } from './transfer/transfer.module';
import { SuspensionsModule } from './suspensions/suspensions.module';
import { ExtraOrdinaryLeaveModule } from './extra-ordinary-leave/extra-ordinary-leave.module';
import { PVUEventsModule } from './events/pvu-events/pvu-events.module';
import { IncrementModule } from './increment/increment.module';
import { TransferJoiningComponent } from './transfer/transfer-joining/transfer-joining.component';
import { SuspensionComponent } from './suspensions/suspension/suspension.component';
import { EolComponent } from './extra-ordinary-leave/eol/eol.component';
import { PVUEventViewComponent } from './events/pvu-events/event-view/event-view.component';
import { PayEventsModule } from './events/pay-event/events.module';
import { EventComponent } from './events/pay-event/event/event.component';
import { ChangeOfScaleEmpCreationComponent } from './change-of-scale-emp-creation/change-of-scale-emp-creation.component';
import { EmployeeForwardDialogComponent } from './employee-creation/employee-forward-dialog.component';
import { PvuCommonModule } from './pvu-common/pvu-common.module';
import { NgModule } from '@angular/core';
import { PVURoutingModule } from './pvu-routing.module';
import { EmployeeCreationComponent } from './employee-creation/employee-creation.component';
import { EmployeeCreationListComponent } from './employee-creation-list/employee-creation-list.component';
import { EmpViewOtherOfficeComponent } from './emp-view-other-office/emp-view-other-office.component';
import { SearchEmployeeComponent } from './pvu-common/search-employee/search-employee.component';
import { EmployeeConfirmationDialogComponent } from './employee-creation/employee-confirmation-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SaveDraftDialogComponent } from './increment/increment-component/save-draft-dialog.component';
import { SaveDraftDialogEventComponent } from './events/pay-event/event/save-draft-dialog.component';
import { EcViewCommentsComponent } from './ec-view-comments/ec-view-comments.component';
import { NgxMaskModule } from 'ngx-mask';
import { EcEventComponent } from './ec-event/ec-event.component';
import { EmployeePrintComponent } from './employee-creation/employee-print/employee-print.component';
import { EventTableComponent } from './ec-event/event-table/event-table.component';
import { FieldsHistoryDialogComponent } from './employee-creation/fields-history-dialog/fields-history-dialog.component';
import { IncrementNewComponentComponent } from './increment/increment-new-component/increment-new-component.component';
import { EmployeeTypeChangeModule } from './employee-type-change/employee-type-change.module';
import { FixToRegularModule } from './fix-to-regular/fix-to-regular.module';
import { UserCreationModule } from './user-creation/user-creation.module';
import { UserConfirmationDialogComponent } from './user-creation/user-creation/user-confirmation-dialog.component';
@NgModule({
  imports: [
    PVURoutingModule,
    PvuCommonModule,
    PayEventsModule,
    PVUEventsModule,
    ExtraOrdinaryLeaveModule,
    SuspensionsModule,
    IncrementModule,
    EmployeeTypeChangeModule,
    FixToRegularModule,
    UserCreationModule,
    TransferModule,
    RopModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    EmployeeCreationComponent,
    EmployeeCreationListComponent,
    EmpViewOtherOfficeComponent,
    EmployeeForwardDialogComponent,
    EmployeeConfirmationDialogComponent,
    EcViewCommentsComponent,
    SaveDraftDialogComponent,
    SaveDraftDialogEventComponent,
    EcEventComponent,
    EmployeePrintComponent,
    ChangeOfScaleEmpCreationComponent,
    EventTableComponent,
    FieldsHistoryDialogComponent,
    UserConfirmationDialogComponent
  ],
  entryComponents: [
    EmployeeCreationComponent,
    FieldsHistoryDialogComponent,
    SearchEmployeeComponent,
    EmployeeForwardDialogComponent,
    EmployeeConfirmationDialogComponent,
    ConfirmationDialogComponent,
    SaveDraftDialogComponent,
    SaveDraftDialogEventComponent,
    EcViewCommentsComponent,
    EmployeePrintComponent,
    ChangeOfScaleEmpCreationComponent,
    EventComponent,
    PVUEventViewComponent,
    EolComponent,
    SuspensionComponent,
    TransferJoiningComponent,
    IncrementNewComponentComponent,
    UserConfirmationDialogComponent
  ]
})
export class PVUModule { }
