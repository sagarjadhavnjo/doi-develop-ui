import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RBIAdviceForInvestmentComponent } from './rbi-advice-for-investment.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{
  path: '',
  component: RBIAdviceForInvestmentComponent
}];

@NgModule({
  declarations: [RBIAdviceForInvestmentComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class RbiAdviceForInvestmentModule { }
