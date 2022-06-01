import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MarketLoanRepaymentTreasuryComponent } from './market-loan-repayment-treasury.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{
  path: '',
  component: MarketLoanRepaymentTreasuryComponent
}];

@NgModule({
  declarations: [
    MarketLoanRepaymentTreasuryComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MarketLoanRepaymentTreasuryModule { }
