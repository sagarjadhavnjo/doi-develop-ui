import { NgModule } from '@angular/core';
import { NssfLoanReceivedComponent } from './nssf-loan-received.component';
import { RouterModule, Routes } from '@angular/router';
import { NssfLoanReceivedAddDetailsComponent } from './nssf-loan-received-add-details/nssf-loan-received-add-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

const routes: Routes = [{
  path: '',
  component: NssfLoanReceivedComponent
}, {
  path: 'add-details',
  component: NssfLoanReceivedAddDetailsComponent
}, {
  path: 'add-details/:id',
  component: NssfLoanReceivedAddDetailsComponent
}];

@NgModule({
  declarations: [
    NssfLoanReceivedComponent,
    NssfLoanReceivedAddDetailsComponent
  ],
  imports: [
    SharedModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(routes)
  ]
})
export class NssfLoanReceivedModule { }
