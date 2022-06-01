import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketLoanReceivedComponent } from './market-loan-received.component';
import { MarketLoanReceivedAddDetailsComponent } from './market-loan-received-add-details/market-loan-received-add-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MarketLoanService } from '../../services/market-loan.service';

const routes: Routes = [{
  path: '',
  component: MarketLoanReceivedComponent
}, {
  path: 'add-details',
  component: MarketLoanReceivedAddDetailsComponent
}, {
  path: 'add-details/:id',
  component: MarketLoanReceivedAddDetailsComponent
}];

@NgModule({
  declarations: [
    MarketLoanReceivedComponent,
    MarketLoanReceivedAddDetailsComponent
  ],
  imports: [
    SharedModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    MarketLoanService
  ]
})
export class MarketLoanReceivedModule { }
