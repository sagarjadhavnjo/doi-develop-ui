import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { JpaRejectionListingComponent } from './jpa-rejection-listing.component';

const routes: Routes = [{
  path: '',
  component: JpaRejectionListingComponent
}];

@NgModule({
  declarations: [JpaRejectionListingComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    MatOptionModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    NgxMatSelectSearchModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class JpaRejectionListingModule { }
