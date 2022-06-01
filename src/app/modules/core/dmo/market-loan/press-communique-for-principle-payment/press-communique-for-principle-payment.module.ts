import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PressCommuniqueForPrinciplePaymentComponent } from './press-communique-for-principle-payment.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{
  path: '',
  component: PressCommuniqueForPrinciplePaymentComponent
}];

@NgModule({
  declarations: [
    PressCommuniqueForPrinciplePaymentComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PressCommuniqueForPrinciplePaymentModule { }
