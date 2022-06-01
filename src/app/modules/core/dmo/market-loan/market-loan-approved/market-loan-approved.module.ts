import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SharedModule } from 'src/app/shared/shared.module';
import { MarketLoanApprovedApproveComponent } from './market-loan-approved-approve/market-loan-approved-approve.component';
import { MarketLoanApprovedComponent } from './market-loan-approved.component';
import { MarketLoanRepaymentScheduleComponent } from './market-loan-repayment-schedule/market-loan-repayment-schedule.component';

const routes: Routes = [{
  path: '',
  component: MarketLoanApprovedComponent
}, {
  path: 'approve',
  component: MarketLoanApprovedApproveComponent
}, {
  path: 'approve/loan-repayment-schedule',
  component: MarketLoanRepaymentScheduleComponent
}];

@NgModule({
  declarations: [
    MarketLoanApprovedComponent,
    MarketLoanApprovedApproveComponent,
    MarketLoanRepaymentScheduleComponent
  ],
  imports: [
    SharedModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(routes)
  ]
})

export class MarketLoanApprovedModule { }
