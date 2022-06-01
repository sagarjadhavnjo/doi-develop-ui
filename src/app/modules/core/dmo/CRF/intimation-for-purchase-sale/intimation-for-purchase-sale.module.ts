import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { IntimationForPurchaseSaleComponent } from './intimation-for-purchase-sale.component';

const routes: Routes = [{
  path: '',
  component: IntimationForPurchaseSaleComponent
}];

@NgModule({
  declarations: [IntimationForPurchaseSaleComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class IntimationForPurchaseSaleModule { }
