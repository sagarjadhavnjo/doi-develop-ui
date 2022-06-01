import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RbiAdviceForSaleOfSecuritiesComponent } from './rbi-advice-for-sale-of-securities.component';

const routes: Routes = [{
  path: '',
  component: RbiAdviceForSaleOfSecuritiesComponent
}];

@NgModule({
  declarations: [RbiAdviceForSaleOfSecuritiesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class RbiAdviceForSaleOfSecuritiesModule { }
