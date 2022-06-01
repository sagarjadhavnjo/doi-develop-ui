import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaApprovalListingComponent } from './jpa-approval-listing.component';

const routes: Routes = [{
  path: '',
  component: JpaApprovalListingComponent
}];

@NgModule({
  declarations: [JpaApprovalListingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaApprovalListingModule { }
