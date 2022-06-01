import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RbiAdviceForMaturityInterestComponent } from './rbi-advice-for-maturity-interest.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{
  path: '',
  component: RbiAdviceForMaturityInterestComponent
}];

@NgModule({
  declarations: [RbiAdviceForMaturityInterestComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class RbiAdviceForMaturityInterestModule { }
