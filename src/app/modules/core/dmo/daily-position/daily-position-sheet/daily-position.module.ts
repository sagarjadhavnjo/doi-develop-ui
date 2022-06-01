import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DailyPositionRoutingModule } from './daily-position-routing.module';
import { DailyPositionSheetComponent } from './daily-position-sheet.component';
import { HistoryDetailsCommonDialogComponent } from '../history-details-common-dialog/history-details-common-dialog.component';
import { SubmitDialogComponent } from '../submit-dialog/submit-dialog.component';
import { WorkflowDmoComponent } from '../workflow-dmo/workflow-dmo.component';
import { NwmaDialogComponent } from './nwma-dialog/nwma-dialog.component';
import { OverdraftDialogComponent } from './overdraft-dialog/overdraft-dialog.component';
import { SwmaDialogComponent } from './swma-dialog/swma-dialog.component';
import { TbillInvestmentComponent } from './tbill-investment/tbill-investment.component';
import { TbillMaturityComponent } from './tbill-maturity/tbill-maturity.component';
import { TbillRediscountingComponent } from './tbill-rediscounting/tbill-rediscounting.component';

@NgModule({
  imports: [
    SharedModule,
    NgxMatSelectSearchModule,
    DailyPositionRoutingModule
  ],
  declarations: [
    DailyPositionSheetComponent,
    HistoryDetailsCommonDialogComponent,
    SubmitDialogComponent,
    WorkflowDmoComponent,
    NwmaDialogComponent,
    OverdraftDialogComponent,
    SwmaDialogComponent,
    TbillInvestmentComponent,
    TbillMaturityComponent,
    TbillRediscountingComponent
  ],
  entryComponents: [
    WorkflowDmoComponent
  ]
})
export class DailyPositionModule { }
