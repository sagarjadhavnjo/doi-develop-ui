import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaLegalEntryForRequestListingComponent } from './jpa-legal-entry-for-request-listing.component';

const routes: Routes = [{
  path: '',
  component: JpaLegalEntryForRequestListingComponent
}];

@NgModule({
  declarations: [JpaLegalEntryForRequestListingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaLegalEntryForRequestListingModule { }
