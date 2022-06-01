import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards';
import { LoanRepaymentScheduleComponent } from './nssf-loan/loan-repayment-schedule/loan-repayment-schedule.component';
import { NssfLoanRepaymentComponent } from './nssf-loan/nssf-loan-repayment/nssf-loan-repayment.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      redirectTo: 'daily-position-sheet',
      pathMatch: 'full'
    }, {
      path: 'daily-position-sheet',
      loadChildren: () => import('./daily-position/daily-position-sheet/daily-position.module').then(m => m.DailyPositionModule),
      canActivate: [AuthGuard]
    }, {
      path: 'daily-position-sheet-listing',
      loadChildren: () => import('./daily-position/daily-position-sheet-listing/daily-position-sheet-listing.module').then(m => m.DailyPositionSheetListingModule),
      canActivate: [AuthGuard]
    }, {
      path: 'nssf-loan-received',
      loadChildren: () => import('./nssf-loan/nssf-loan-received/nssf-loan-received.module').then(m => m.NssfLoanReceivedModule),
      canActivate: [AuthGuard]
    }, {
      path: 'nssf-loan-approved',
      loadChildren: () => import('./nssf-loan/nssf-loan-approved/nssf-loan-approved.module').then(m => m.NssfLoanApprovedModule),
      canActivate: [AuthGuard]
    }, {
      path: 'loan-repayment-schedule',
      component: LoanRepaymentScheduleComponent,
      canActivate: [AuthGuard]
    }, {
      path: 'nssf-loan-repayment',
      component: NssfLoanRepaymentComponent,
      canActivate: [AuthGuard]
    }, {
      path: 'market-loan-received',
      loadChildren: () => import('./market-loan/market-loan-received/market-loan-received.module').then(m => m.MarketLoanReceivedModule),
      canActivate: [AuthGuard]
    }, {
      path: 'market-loan-approved',
      loadChildren: () => import('./market-loan/market-loan-approved/market-loan-approved.module').then(m => m.MarketLoanApprovedModule),
      canActivate: [AuthGuard]
    }, {
      path: 'market-loan-repayment-rbi',
      loadChildren: () => import('./market-loan/market-loan-repayment-rbi/market-loan-repayment-rbi.module').then(m => m.MarketLoanRepaymentRbiModule),
      canActivate: [AuthGuard]
    }, {
      path: 'market-loan-repayment-treasury',
      loadChildren: () => import('./market-loan/market-loan-repayment-treasury/market-loan-repayment-treasury.module').then(m => m.MarketLoanRepaymentTreasuryModule),
      canActivate: [AuthGuard]
    }, {
      path: 'press-communique-for-principle-payment',
      loadChildren: () => import('./market-loan/press-communique-for-principle-payment/press-communique-for-principle-payment.module').then(m => m.PressCommuniqueForPrinciplePaymentModule),
      canActivate: [AuthGuard]
    }, {
      path: 'grf',
      loadChildren: () => import('./GRF/grf.module').then(m => m.GrfModule),
      canActivate: [AuthGuard]
    }, {
      path: 'crf',
      loadChildren: () => import('./CRF/crf.module').then(m => m.CrfModule),
      canActivate: [AuthGuard]
    }, {
      path: 'guarantee-entry',
      loadChildren: () => import('./gauarantee-entry/guarantee-entry/gauarantee-entry.module').then(m => m.GauaranteeEntryModule),
      canActivate: [AuthGuard]
    },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DmoRoutingModule { }
