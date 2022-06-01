import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from 'src/app/guards';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'intimation-for-purchase-sale',
      loadChildren: () => import('./intimation-for-purchase-sale/intimation-for-purchase-sale.module').then(m => m.IntimationForPurchaseSaleModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'rbi-advice-for-investment',
      loadChildren: () => import('./rbi-advice-for-investment/rbi-advice-for-investment.module').then(m => m.RbiAdviceForInvestmentModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'rbi-advice-for-sale-of-securities',
      loadChildren: () => import('./rbi-advice-for-sale-of-securities/rbi-advice-for-sale-of-securities.module').then(m => m.RbiAdviceForSaleOfSecuritiesModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'rbi-advice-for-maturity-interest',
      loadChildren: () => import('./rbi-advice-for-maturity-interest/rbi-advice-for-maturity-interest.module').then(m => m.RbiAdviceForMaturityInterestModule),
      canActivate: [AuthGuard]
    }

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
  exports: [RouterModule]
})
export class GrfRoutingModule { }
