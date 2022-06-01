import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NssfLoanApprovedComponent } from './nssf-loan-approved.component';
import { NssfLoanApprovedApproveComponent } from './nssf-loan-approved-approve/nssf-loan-approved-approve.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Routes = [{
  path: '',
  component: NssfLoanApprovedComponent
}, {
  path: 'approve',
  component: NssfLoanApprovedApproveComponent
}];

@NgModule({
  declarations: [
    NssfLoanApprovedComponent,
    NssfLoanApprovedApproveComponent
  ],
  imports: [
    SharedModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(routes)
  ]
})
export class NssfLoanApprovedModule { }
