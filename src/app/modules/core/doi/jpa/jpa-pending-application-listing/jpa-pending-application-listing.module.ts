import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaPendingApplicationListingComponent } from './jpa-pending-application-listing.component';

const routes: Routes = [{
  path: '',
  component: JpaPendingApplicationListingComponent
}];

@NgModule({
  declarations: [JpaPendingApplicationListingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaPendingApplicationListingModule { }
