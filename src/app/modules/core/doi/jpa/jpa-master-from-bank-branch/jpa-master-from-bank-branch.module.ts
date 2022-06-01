import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaMasterFromBankBranchComponent } from './jpa-master-from-bank-branch.component';

const routes: Routes = [{
  path: '',
  component: JpaMasterFromBankBranchComponent
}];

@NgModule({
  declarations: [JpaMasterFromBankBranchComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaMasterFromBankBranchModule { }
