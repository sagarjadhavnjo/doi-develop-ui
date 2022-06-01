import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { JpaLegalListingComponent } from './jpa-legal-listing.component';

const routes: Routes = [{
  path: '',
  component: JpaLegalListingComponent
}];

@NgModule({
  declarations: [JpaLegalListingComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class JpaLegalListingModule { }
