import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaLegalClaimListingComponent } from './jpa-legal-claim-listing.component';

const routes: Routes = [{
  path: '',
  component: JpaLegalClaimListingComponent
}];

@NgModule({
  declarations: [JpaLegalClaimListingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaLegalClaimListingModule { }
