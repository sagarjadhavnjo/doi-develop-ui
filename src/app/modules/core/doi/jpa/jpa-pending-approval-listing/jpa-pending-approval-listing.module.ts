import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaPendingApprovalListingComponent } from './jpa-pending-approval-listing.component';

const routes: Routes = [{
  path: '',
  component: JpaPendingApprovalListingComponent
}];

@NgModule({
  declarations: [JpaPendingApprovalListingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaPendingApprovalListingModule { }
