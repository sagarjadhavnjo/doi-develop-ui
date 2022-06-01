
import { NgModule } from '@angular/core';
import { DmoRoutingModule } from './dmo-routing.module';
import { DailyPositionSheetService } from './services/daily-position-sheet.service';
import { NssfLoanService } from './services/nssf-loan.service';
import { ToastMsgService } from './services/toast.service';
import { LoanRepaymentScheduleComponent } from './nssf-loan/loan-repayment-schedule/loan-repayment-schedule.component';
import { NssfLoanRepaymentComponent } from './nssf-loan/nssf-loan-repayment/nssf-loan-repayment.component';
import { WorkflowDmoComponent } from './workflow-dmo/workflow-dmo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    LoanRepaymentScheduleComponent,
    NssfLoanRepaymentComponent,
    WorkflowDmoComponent
  ],
  imports: [
    SharedModule,
    NgxMatSelectSearchModule,
    DmoRoutingModule,
  ],
  providers: [
    DailyPositionSheetService,
    NssfLoanService,
    ToastMsgService
  ]
})
export class DmoModule { }
