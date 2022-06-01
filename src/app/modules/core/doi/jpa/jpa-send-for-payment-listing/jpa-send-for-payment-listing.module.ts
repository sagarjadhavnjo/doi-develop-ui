import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaSendForPaymentListingComponent } from './jpa-send-for-payment-listing.component';

const routes: Routes = [{
  path: '',
  component: JpaSendForPaymentListingComponent
}];

@NgModule({
  declarations: [JpaSendForPaymentListingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaSendForPaymentListingModule { }
