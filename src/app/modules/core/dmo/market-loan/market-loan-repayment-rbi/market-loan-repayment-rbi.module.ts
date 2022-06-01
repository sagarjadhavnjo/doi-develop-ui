import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MarketLoanRepaymentRbiComponent } from './market-loan-repayment-rbi.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Routes = [{
  path: '',
  component: MarketLoanRepaymentRbiComponent
}];

@NgModule({
  declarations: [
    MarketLoanRepaymentRbiComponent
  ],
  imports: [
    SharedModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(routes)
  ]
})
export class MarketLoanRepaymentRbiModule { }
